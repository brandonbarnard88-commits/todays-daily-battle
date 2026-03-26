#!/usr/bin/env node
/**
 * Purge Cloudflare cache via API.
 *
 * Modes:
 *   (default)     Purge entire zone — npm run purge:cloudflare
 *   --social      Purge key HTML + OG JPEG URLs after deploy (recommended for 9c85246-style updates)
 *   CF_PURGE_FILES  Comma/space-separated full URLs (overrides --social if set)
 *
 * Run: npm run purge:cloudflare
 * Or:  CF_API_TOKEN=yyy npm run purge:cloudflare
 * Or:  npm run purge:cloudflare:social
 *
 * Add to .env (gitignored):
 *   CF_API_TOKEN=your_token_from_cloudflare
 *
 * If CF_ZONE_ID is missing, auto-discovers zone for todaysdailybattle.com.
 * Token: My Profile → API Tokens → Create Token → "Edit zone cache" (include Zone Resources: todaysdailybattle.com)
 *
 * API: files[] batches of ≤30 URLs per request (Cloudflare limit).
 *
 * Share images: HTML uses og:image …/file.jpg?v=SHARE_OG_V — bump SHARE_OG_V here when you
 * bump ?v= in index/calm/mobius/shop/testimonials so :social purges both bare and versioned URLs.
 */
import { readFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const envPath = join(root, '.env');
if (existsSync(envPath)) {
  const lines = readFileSync(envPath, 'utf8').split('\n');
  for (const line of lines) {
    const idx = line.indexOf('=');
    if (idx < 0) continue;
    const key = line.slice(0, idx).trim();
    if (!key.startsWith('CF_') || process.env[key]) continue;
    let val = line.slice(idx + 1).trim().replace(/^["']|["']$/g, '');
    process.env[key] = val;
  }
}

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
  console.error('Missing CF_API_TOKEN. Add to project .env (gitignored):');
  console.error('  CF_API_TOKEN=<token from Cloudflare → My Profile → API Tokens → Create → use "Edit zone cache" template, zone: todaysdailybattle.com>');
  process.exit(1);
}
if (API_TOKEN && (/your_token|paste_your|actual_token|example|placeholder|changeme|replace_me/i.test(API_TOKEN) || API_TOKEN.length < 30)) {
  console.error('CF_API_TOKEN is missing or still a placeholder. Edit .env in the repo root and paste a real API token (not the string "your_token").');
  console.error('Cloudflare → My Profile → API Tokens → Create Token → "Edit zone cache" → include Zone: todaysdailybattle.com');
  process.exit(1);
}

/** Bump with HTML og:image ?v= when replacing share art (cache-bust). */
const SHARE_OG_V = '20260322';

/** Service worker registration token — keep in sync with repo root SW-VERSION. */
let SW_REG_VERSION = '20260325-sw-v108';
try {
  const swVerPath = join(root, 'SW-VERSION');
  if (existsSync(swVerPath)) {
    const line = readFileSync(swVerPath, 'utf8').trim().split(/\r?\n/)[0];
    if (line) SW_REG_VERSION = line;
  }
} catch (_) {}

/** Paths appended to https://DOMAIN for post–share-image deploys */
const SOCIAL_PURGE_PATHS = [
  '/',
  '/sw.js',
  '/service-worker.js',
  '/sw.js?v=' + SW_REG_VERSION,
  '/tt-bootstrap.js',
  '/assets/perf-hint.js',
  '/verse-breakdown.js',
  '/loops.json',
  '/loops.json?v=20260324v7',
  '/calm.html',
  '/calm',
  '/team-toolkit.html',
  '/team-toolkit',
  '/explore.html',
  '/explore',
  '/plans',
  '/my-verses.html',
  '/my-verses',
  '/bible-tool.html',
  '/bible-tool',
  '/verse.html',
  '/verse',
  '/ansiedad.html',
  '/ansiedad',
  '/ansiedad.html?tdb_cb=20260328esNav',
  '/fuerza.html',
  '/fuerza',
  '/fuerza.html?tdb_cb=20260328esNav',
  '/paz.html',
  '/paz',
  '/paz.html?tdb_cb=20260328esNav',
  '/id/kecemasan.html',
  '/id/kecemasan',
  '/tl/kabalisahan.html',
  '/tl/kabalisahan',
  '/language-switcher.js',
  '/styles.css',
  '/styles.css?v=20260326es-mas-ayuda',
  '/styles.css?v=20260328esNav',
  '/study.html',
  '/study',
  '/reader.html',
  '/reader',
  '/message',
  '/mobius.html',
  '/shop.html',
  '/testimonials.html',
  '/index.html',
  '/plans.html',
  '/why-not-ai',
  '/why-not-ai/',
  '/why-not-ai.html',
  '/message.html',
  '/script.js',
  '/script.js?v=20260328feelwire',
  '/script.js?v=20260325calmen',
  '/script.js?v=20260324armorflow',
  '/script.js?v=20260331mysave',
  '/script.js?v=20260425savednotes-migrate',
  '/tt-bootstrap.js?v=20260326clean',
  '/sitemap.xml',
  '/assets/share/home-og.jpg',
  '/assets/share/calm-og.jpg',
  '/assets/share/mobius-og.jpg',
  '/assets/share/shop-og.jpg',
  '/assets/share/testimonials-og.jpg',
  '/assets/share/verse-share.jpg',
  '/kids-corner.html',
  '/kids-corner',
  '/kids/corner.html',
  '/kids/corner',
  '/kids/index.html',
  '/kids/',
  '/kids/all-stories.html',
  '/kids/kids-all-stories.js',
  '/kids/kids-all-stories.js?v=20260327kidsmax',
  '/kids/bible-story-tool-index.js',
  '/kids/bible-story-tool-index.js?v=20260327kidsmax',
  /** Keep ?v= in sync with kids/index.html <script src="kids-battle.js?v=…"> */
  '/kids/kids-battle.js',
  '/kids/kids-battle.js?v=20260326clean',
  '/kids/kids-battle.js?v=20260331tierschallenge',
  '/kids/kids-battle.js?v=20260330kidslib',
  '/kids/kids-corner.js',
  '/kids/kids-corner.js?v=20260330kidslib',
  '/kids/kids-corner.js?v=20260331kidsfuzzy',
  '/kids/kids-corner.js?v=20260331kidsdeeplink',
  '/kids/kids-corner.js?v=20260331kidsnav',
  '/kids/kids-page-sky.css',
  '/kids/kids-page-sky.css?v=20260326playful',
  '/kids/kids-page-sky.js',
  '/kids/kids-page-sky.js?v=20260326playful',
  '/kids/kids-page-sky.js?v=20260327ipgeo',
  '/sky-ip-geo.js',
  '/sky-ip-geo.js?v=20260327ipgeo',
  '/kids/kids-all-stories.js?v=20260331kidsfuzzy',
  '/kids/kids-all-stories.js?v=20260331kidsthemes',
  '/vendor/uFuzzy.iife.min.js',
  '/kids/kids-read-quiz-data.js',
  '/kids/kids-read-quiz-data.js?v=20260330kidslib',
  '/kids/kids-read-quiz-data.js?v=20260331tierschallenge',
  '/kids/kids-battle.css',
  '/kids/kids-battle.css?v=20',
  '/assets/share/kids-loop-og.jpg',
  '/assets/share/kids-story-library-og.jpg',
  '/bible-tool.html',
  '/reading-plan.html',
  '/verse-image.html',
  '/assets/share/home-og.jpg?v=' + SHARE_OG_V,
  '/assets/share/calm-og.jpg?v=' + SHARE_OG_V,
  '/assets/share/mobius-og.jpg?v=' + SHARE_OG_V,
  '/assets/share/shop-og.jpg?v=' + SHARE_OG_V,
  '/assets/share/testimonials-og.jpg?v=' + SHARE_OG_V,
  '/assets/share/verse-share.jpg?v=' + SHARE_OG_V,
  '/assets/share/kids-loop-og.jpg?v=' + SHARE_OG_V,
  '/assets/share/kids-story-library-og.jpg?v=' + SHARE_OG_V
];

const CHUNK = 30;

function getUrlsToPurge() {
  const env = (process.env.CF_PURGE_FILES || '').trim();
  if (env) {
    return env.split(/[\s,]+/).map((s) => s.trim()).filter(Boolean);
  }
  if (process.argv.includes('--social')) {
    const base = `https://${DOMAIN}`;
    return SOCIAL_PURGE_PATHS.map((p) => (p === '/' ? base + '/' : base + p));
  }
  return null;
}

async function findZoneId() {
  const res = await fetch(`https://api.cloudflare.com/client/v4/zones?name=${DOMAIN}`, { headers });
  const data = await res.json().catch(() => ({}));
  if (data.success && data.result && data.result.length > 0) {
    return data.result[0].id;
  }
  return null;
}

async function purgeEverything(zoneId) {
  const res = await fetch(`https://api.cloudflare.com/client/v4/zones/${zoneId}/purge_cache`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ purge_everything: true })
  });
  return { res, data: await res.json().catch(() => ({})) };
}

async function purgeFiles(zoneId, urls) {
  const out = [];
  for (let i = 0; i < urls.length; i += CHUNK) {
    const chunk = urls.slice(i, i + CHUNK);
    const res = await fetch(`https://api.cloudflare.com/client/v4/zones/${zoneId}/purge_cache`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ files: chunk })
    });
    const data = await res.json().catch(() => ({}));
    out.push({ res, data, chunk });
  }
  return out;
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

    const urls = getUrlsToPurge();

    if (urls && urls.length) {
      console.log(`Purging ${urls.length} URL(s) (targeted):`);
      urls.forEach((u) => console.log('  ', u));
      let results = await purgeFiles(ZONE_ID, urls);

      if (results[0] && results[0].data && results[0].data.errors && results[0].data.errors[0] && results[0].data.errors[0].code === 7003) {
        console.log('CF_ZONE_ID invalid (7003). Looking up zone...');
        const found = await findZoneId();
        if (found && found !== ZONE_ID) {
          ZONE_ID = found;
          results = await purgeFiles(ZONE_ID, urls);
        }
      }

      const failed = results.filter((r) => !r.data.success);
      if (failed.length) {
        console.error('Purge failed for one or more batches. HTTP', failed[0].res.status);
        console.error('Response:', JSON.stringify(failed[0].data, null, 2));
        process.exit(1);
      }
      console.log('Targeted purge successful. Wait 30–60s, then view-source + Facebook/X validators.');
      return;
    }

    let { res, data } = await purgeEverything(ZONE_ID);

    if (!data.success && data.errors && data.errors[0] && data.errors[0].code === 7003) {
      console.log('CF_ZONE_ID invalid (7003). Looking up zone...');
      const found = await findZoneId();
      if (found && found !== ZONE_ID) {
        ZONE_ID = found;
        const retry = await purgeEverything(ZONE_ID);
        res = retry.res;
        data = retry.data;
      }
    }

    if (data.success) {
      console.log('Full-zone purge successful. Wait 30–60s, then test in incognito.');
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
