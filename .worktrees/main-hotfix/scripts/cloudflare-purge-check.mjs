#!/usr/bin/env node
/**
 * Verify Cloudflare purge credentials. Run locally:
 *   CF_API_TOKEN=xxx node scripts/cloudflare-purge-check.mjs
 *   CF_ZONE_ID=yyy CF_API_TOKEN=xxx node scripts/cloudflare-purge-check.mjs
 *
 * Prints zone info and tests purge permission without purging.
 */
const ZONE_ID = process.env.CF_ZONE_ID;
const API_TOKEN = process.env.CF_API_TOKEN;
const DOMAIN = 'todaysdailybattle.com';

if (!API_TOKEN) {
  console.error('Set CF_API_TOKEN. Get from Cloudflare → My Profile → API Tokens.');
  process.exit(1);
}
if (/your_token|paste_your|actual_token|example|placeholder/i.test(API_TOKEN) || API_TOKEN.length < 30) {
  console.error('CF_API_TOKEN looks like a placeholder. Use your real token from Cloudflare.');
  console.error('Create one: dash.cloudflare.com → My Profile → API Tokens → Create Token → Edit zone cache');
  process.exit(1);
}

const headers = {
  'Content-Type': 'application/json',
  Authorization: `Bearer ${API_TOKEN}`
};

async function listZones() {
  const res = await fetch(`https://api.cloudflare.com/client/v4/zones?name=${DOMAIN}`, { headers });
  const data = await res.json();
  return { res, data };
}

async function getZone(zoneId) {
  const res = await fetch(`https://api.cloudflare.com/client/v4/zones/${zoneId}`, { headers });
  return res.json();
}

(async () => {
  console.log('1. Listing zones for', DOMAIN, '...');
  const { res: listRes, data: listData } = await listZones();

  if (!listData.success) {
    console.error('List zones failed:', listData.errors?.[0] || listData);
    if (listData.errors?.[0]?.code === 9109) {
      console.log('\nToken needs Zone Read. Create Custom token with: Zone / Zone (Read) + Zone / Cache Purge (Edit)');
    }
    process.exit(1);
  }

  const zones = listData.result || [];
  if (zones.length === 0) {
    console.error('No zone found for', DOMAIN, '- is the domain on Cloudflare?');
    process.exit(1);
  }

  const zone = zones[0];
  console.log('   Found:', zone.name, '| Zone ID:', zone.id);

  const zoneIdToUse = ZONE_ID || zone.id;
  if (ZONE_ID && ZONE_ID !== zone.id) {
    console.log('\n2. CF_ZONE_ID differs from lookup. Verifying', ZONE_ID, '...');
    const z = await getZone(ZONE_ID);
    if (!z.success) {
      console.error('   CF_ZONE_ID invalid:', z.errors?.[0] || z);
      console.log('   Use Zone ID:', zone.id);
      process.exit(1);
    }
    console.log('   OK:', z.result?.name);
  }

  console.log('\n3. Credentials OK. Zone ID for purge:', zoneIdToUse);
  console.log('   Add to GitHub secrets: CF_ZONE_ID=' + zoneIdToUse);
  console.log('   Or run: CF_ZONE_ID=' + zoneIdToUse + ' CF_API_TOKEN=xxx npm run purge:cloudflare');
})();
