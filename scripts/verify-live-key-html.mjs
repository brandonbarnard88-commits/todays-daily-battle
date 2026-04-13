#!/usr/bin/env node
/**
 * After deploy + CDN purge: confirm production HTML includes critical markers.
 * Does not run in default CI (network). Use manually or optional workflow step.
 *
 *   LIVE_BASE_URL=https://todaysdailybattle.com node scripts/verify-live-key-html.mjs
 *
 * Exit 1 if any check fails (stale CDN, wrong output dir, or deploy not finished).
 */
import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const AUTH_ASSET_VERSION_PATH = path.join(root, 'AUTH-ASSET-VERSION');
const base = (process.env.LIVE_BASE_URL || 'https://todaysdailybattle.com').replace(/\/$/, '');

/** Browser-like UA so fewer edges treat this as a bot probe. */
const FETCH_UA =
  'Mozilla/5.0 (compatible; TDB-verify-live/1.0; +https://todaysdailybattle.com) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';

function extractBuildStamp(html) {
  const m = html.match(/<!--\s*tdb build\s+([^>]+?)\s*-->/i);
  return m ? m[1].trim() : null;
}

function getAuthAssetVersion() {
  if (!existsSync(AUTH_ASSET_VERSION_PATH)) {
    throw new Error('AUTH-ASSET-VERSION is missing.');
  }
  const version = readFileSync(AUTH_ASSET_VERSION_PATH, 'utf8').trim();
  if (!version) {
    throw new Error('AUTH-ASSET-VERSION is empty.');
  }
  return version;
}

const AUTH_ASSET_VERSION = getAuthAssetVersion();

function withAuthAssetVersion(assetPath) {
  return assetPath + '?v=' + AUTH_ASSET_VERSION;
}

const jsonChecks = [
  {
    paths: ['/data/site-search-index.json', '/site-search-index.json'],
    label: 'site search index',
    validate(data) {
      return data && Array.isArray(data.entries) && data.entries.length >= 5;
    },
  },
];

const assetChecks = [
  {
    path: withAuthAssetVersion('/browser-shared.js'),
    label: 'browser shared runtime',
    needles: ['TDBBrowserCore'],
  },
  {
    path: withAuthAssetVersion('/auth.js'),
    label: 'auth runtime',
    needles: ['tdbInitLoginPage', 'wireLoginPage'],
  },
];

const checks = [
  {
    path: '/',
    needles: [
      'Save to My Study',
      'href="/mystudy?tab=library#saved-verses"',
      'href="/prayer-wall.html"',
    ],
    forbidden: [
      'Save to My Verses',
      'href="/my-verses.html"',
    ],
  },
  {
    path: '/prayer-wall',
    needles: [
      'Pray privately',
      'Pray with others',
    ],
    forbidden: [
      'Community board',
      'quiet room',
      'Message Board',
    ],
  },
  {
    path: '/mystudy',
    needles: [
      'A calmer place for saved verses, notes, prayer, highlights, and steady progress. Everything stays on this device unless you sign in to sync.',
    ],
    forbidden: [
      'Message Board',
      'My Verses shows the same saves',
    ],
  },
  {
    path: '/my-verses.html',
    needles: [
      'Saved verses now live inside',
      'This page forwards there automatically.',
      'href="/mystudy?tab=library#saved-verses"',
    ],
  },
  {
    path: '/login.html',
    needles: [
      'id="login-form"',
      'id="login-email"',
      'id="login-password"',
      withAuthAssetVersion('/auth.js').replace(/^\//, ''),
      'TDB Login Forced Init v6 - Strong Mode Switching',
    ],
    forbidden: [
      'src="browser-shared.js"',
      'src="script.js"',
      'src="config.js"',
    ],
  },
  {
    path: '/explore.html',
    needles: [
      'Five calm minutes (optional)',
      'Home, Calm, plans, My Study, prayer',
      'saved verses, notes, highlights, and progress in one place.',
    ],
    forbidden: [
      'My Verses',
      'Message Board',
    ],
  },
];

async function fetchText(url) {
  const res = await fetch(url, {
    redirect: 'follow',
    headers: {
      'User-Agent': FETCH_UA,
      Accept: 'text/html,application/xhtml+xml;q=0.9,*/*;q=0.8',
      'Cache-Control': 'no-cache',
      Pragma: 'no-cache',
    },
  });
  if (!res.ok) {
    throw new Error('HTTP ' + res.status + ' for ' + url);
  }
  return res.text();
}

async function main() {
  let failed = false;
  for (const { paths, label, validate } of jsonChecks) {
    let jsonOk = false;
    for (const path of paths) {
      const jUrl = base + path;
      try {
        const jr = await fetch(jUrl, {
          headers: {
            'User-Agent': FETCH_UA,
            Accept: 'application/json,*/*;q=0.8',
            'Cache-Control': 'no-cache',
          },
        });
        if (!jr.ok) {
          console.warn('verify-live-key-html: JSON candidate unavailable', jUrl, 'HTTP', jr.status);
          continue;
        }
        const data = await jr.json();
        if (!validate(data)) {
          console.warn('verify-live-key-html:', label, 'candidate shape wrong', jUrl);
          continue;
        }
        console.log('verify-live-key-html: OK', jUrl);
        jsonOk = true;
        break;
      } catch (e) {
        console.warn('verify-live-key-html:', label, 'candidate failed', jUrl, e.message || e);
      }
    }
    if (!jsonOk) {
      console.error('verify-live-key-html:', label, 'missing or invalid on all known paths');
      failed = true;
    }
  }

  for (const { path, label, needles } of assetChecks) {
    const assetUrl = base + path;
    try {
      const body = await fetchText(assetUrl);
      const missingNeedles = needles.filter((needle) => !body.includes(needle));
      if (missingNeedles.length) {
        console.error('verify-live-key-html:', label, 'is missing markers on', assetUrl, '→', missingNeedles.join(', '));
        failed = true;
        continue;
      }
      console.log('verify-live-key-html: OK', assetUrl);
    } catch (e) {
      console.error('verify-live-key-html:', label, 'fetch failed', assetUrl, e.message || e);
      failed = true;
    }
  }

  for (const { path, needles, forbidden } of checks) {
    const url = base + path;
    let body;
    let pageOk = true;
    try {
      body = await fetchText(url);
    } catch (e) {
      console.error('verify-live-key-html: fetch failed', url, e.message || e);
      failed = true;
      continue;
    }
    for (const n of needles) {
      if (!body.includes(n)) {
        console.error('verify-live-key-html: MISSING on', url, '→', n);
        failed = true;
        pageOk = false;
      }
    }
    for (const n of forbidden || []) {
      if (body.includes(n)) {
        console.error('verify-live-key-html: STALE marker still present on', url, '→', n);
        failed = true;
        pageOk = false;
      }
    }
    if (pageOk) {
      console.log('verify-live-key-html: OK', url);
    } else {
      const stamp = extractBuildStamp(body);
      if (stamp) {
        console.error('verify-live-key-html: live build stamp on', url + ':', stamp);
      }
    }
  }
  if (failed) {
    console.error(
      '\nverify-live-key-html: Production looks stale or markers were removed.\n' +
        '  • Confirm Cloudflare Pages custom domain points to the active Pages project for this repo.\n' +
        '  • Confirm Cloudflare Pages is serving the current deployment (not a stale origin).\n' +
        '  • Confirm CF_API_TOKEN / CLOUDFLARE_API_TOKEN has Zone Cache Purge permission for todaysdailybattle.com.\n' +
        '  • Purge Cloudflare (needs CF_API_TOKEN in .env): CF_PURGE_FILES=https://todaysdailybattle.com/login.html,https://todaysdailybattle.com/browser-shared.js,... npm run purge:cloudflare\n' +
        '     or: npm run purge:cloudflare:social\n' +
        '  • Local dist spot-check: confirm login.html, browser-shared.js, auth.js, index/prayer-wall/mystudy/my-verses/explore contain current output.\n'
    );
    process.exit(1);
  }
  console.log('verify-live-key-html: all checks passed for', base);
}

main();
