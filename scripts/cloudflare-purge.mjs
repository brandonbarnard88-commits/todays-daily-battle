#!/usr/bin/env node
/**
 * Purge Cloudflare cache via API.
 * Run: CF_ZONE_ID=xxx CF_API_TOKEN=yyy node scripts/cloudflare-purge.mjs
 *
 * Get credentials:
 * - Zone ID: Cloudflare Dashboard → your domain → Overview (right sidebar)
 * - API Token: My Profile → API Tokens → Create Token → "Edit zone cache" template
 */
const ZONE_ID = process.env.CF_ZONE_ID;
const API_TOKEN = process.env.CF_API_TOKEN;
const AUTH_EMAIL = process.env.CF_EMAIL;
const AUTH_KEY = process.env.CF_API_KEY;

if (!ZONE_ID) {
  console.error('Missing CF_ZONE_ID. Get it from Cloudflare → your domain → Overview.');
  process.exit(1);
}

const headers = {
  'Content-Type': 'application/json',
  ...(API_TOKEN
    ? { Authorization: `Bearer ${API_TOKEN}` }
    : AUTH_EMAIL && AUTH_KEY
      ? { 'X-Auth-Email': AUTH_EMAIL, 'X-Auth-Key': AUTH_KEY }
      : null)
};

if (!headers.Authorization && !headers['X-Auth-Email']) {
  console.error('Missing CF_API_TOKEN (or CF_EMAIL + CF_API_KEY). Get token from Cloudflare → My Profile → API Tokens.');
  process.exit(1);
}

const url = `https://api.cloudflare.com/client/v4/zones/${ZONE_ID}/purge_cache`;
const body = JSON.stringify({ purge_everything: true });

try {
  const res = await fetch(url, { method: 'POST', headers, body });
  const data = await res.json().catch(() => ({}));
  if (data.success) {
    console.log('Purge successful. Wait 30–60s, then test in incognito.');
  } else {
    console.error('Purge failed. HTTP', res.status);
    console.error('Response:', JSON.stringify(data, null, 2));
    if (data.errors && data.errors[0]) {
      const e = data.errors[0];
      if (e.code === 7003) console.error('Hint: CF_ZONE_ID may be wrong. Use Zone ID from domain Overview, not Pages project ID.');
      if (e.code === 9109 || e.code === 6003) console.error('Hint: Token may lack "Cache Purge" permission. Recreate with "Edit zone cache" template.');
    }
    process.exit(1);
  }
} catch (err) {
  console.error('Request failed:', err.message);
  process.exit(1);
}
