#!/usr/bin/env node
/**
 * Purge Cloudflare cache via API.
 * Run: CF_API_TOKEN=yyy node scripts/cloudflare-purge.mjs
 * Or:  CF_ZONE_ID=xxx CF_API_TOKEN=yyy node scripts/cloudflare-purge.mjs
 *
 * If CF_ZONE_ID is missing, auto-discovers zone for todaysdailybattle.com.
 * Token: My Profile → API Tokens → Create Token → "Edit zone cache" (include Zone Resources: todaysdailybattle.com)
 */
const DOMAIN = process.env.CF_DOMAIN || 'todaysdailybattle.com';
let ZONE_ID = process.env.CF_ZONE_ID;
const API_TOKEN = process.env.CF_API_TOKEN;
const AUTH_EMAIL = process.env.CF_EMAIL;
const AUTH_KEY = process.env.CF_API_KEY;

const headers = {
  'Content-Type': 'application/json',
  ...(API_TOKEN
    ? { Authorization: `Bearer ${API_TOKEN}` }
    : AUTH_EMAIL && AUTH_KEY
      ? { 'X-Auth-Email': AUTH_EMAIL, 'X-Auth-Key': AUTH_KEY }
      : null)
};

if (!headers.Authorization && !headers['X-Auth-Email']) {
  console.error('Missing CF_API_TOKEN. Get from Cloudflare → My Profile → API Tokens → "Edit zone cache" template.');
  process.exit(1);
}
if (API_TOKEN && (/your_token|paste_your|actual_token|example|placeholder/i.test(API_TOKEN) || API_TOKEN.length < 30)) {
  console.error('CF_API_TOKEN looks like a placeholder. Use your real token from Cloudflare.');
  process.exit(1);
}

async function findZoneId() {
  const res = await fetch(`https://api.cloudflare.com/client/v4/zones?name=${DOMAIN}`, { headers });
  const data = await res.json().catch(() => ({}));
  if (data.success && data.result && data.result.length > 0) {
    return data.result[0].id;
  }
  return null;
}

async function purge(zoneId) {
  const res = await fetch(`https://api.cloudflare.com/client/v4/zones/${zoneId}/purge_cache`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ purge_everything: true })
  });
  return { res, data: await res.json().catch(() => ({})) };
}

(async () => {
  try {
    if (!ZONE_ID) {
      console.log(`CF_ZONE_ID not set. Looking up zone for ${DOMAIN}...`);
      ZONE_ID = await findZoneId();
      if (!ZONE_ID) {
        console.error(`Could not find zone for ${DOMAIN}. Set CF_ZONE_ID from Cloudflare → domain → Overview.`);
        process.exit(1);
      }
      console.log(`Found zone: ${ZONE_ID}`);
    }

    let { res, data } = await purge(ZONE_ID);

    if (!data.success && data.errors && data.errors[0] && data.errors[0].code === 7003) {
      console.log('CF_ZONE_ID invalid (7003). Looking up zone...');
      const found = await findZoneId();
      if (found && found !== ZONE_ID) {
        ZONE_ID = found;
        const retry = await purge(ZONE_ID);
        res = retry.res;
        data = retry.data;
      }
    }

    if (data.success) {
      console.log('Purge successful. Wait 30–60s, then test in incognito.');
      return;
    }

    if (data.errors && data.errors[0]) {
      const e = data.errors[0];
      if (e.code === 7003) console.error('Hint: Wrong CF_ZONE_ID. Use Zone ID from domain Overview, not Pages project ID.');
      if (e.code === 9109 || e.code === 6003) console.error('Hint: Token needs "Cache Purge". Use "Edit zone cache" template, Zone: ' + DOMAIN);
    }
    console.error('Purge failed. HTTP', res.status);
    console.error('Response:', JSON.stringify(data, null, 2));
    process.exit(1);
  } catch (err) {
    console.error('Request failed:', err.message);
    process.exit(1);
  }
})();
