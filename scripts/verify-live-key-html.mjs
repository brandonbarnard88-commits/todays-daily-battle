#!/usr/bin/env node
/**
 * After deploy + CDN purge: confirm production HTML includes critical markers.
 * Does not run in default CI (network). Use manually or optional workflow step.
 *
 *   LIVE_BASE_URL=https://todaysdailybattle.com node scripts/verify-live-key-html.mjs
 *
 * Exit 1 if any check fails (stale CDN, wrong output dir, or deploy not finished).
 */
const base = (process.env.LIVE_BASE_URL || 'https://todaysdailybattle.com').replace(/\/$/, '');

/** Browser-like UA so fewer edges treat this as a bot probe. */
const FETCH_UA =
  'Mozilla/5.0 (compatible; TDB-verify-live/1.0; +https://todaysdailybattle.com) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';

function extractBuildStamp(html) {
  const m = html.match(/<!--\s*tdb build\s+([^>]+?)\s*-->/i);
  return m ? m[1].trim() : null;
}

const checks = [
  {
    path: '/plans.html',
    needles: [
      'id="plans-still-in-the-works"',
      'depression-only heaviness',
      'plans-recommended-today__note-body',
      'By feel &amp; length',
      'Quick jump',
      'Plan day checkmarks',
    ],
  },
  {
    path: '/',
    needles: ['id="nav-site-guide"', 'href="/site-guide.html"', 'id="nav-site-search"', 'href="/search.html"'],
  },
  {
    path: '/search.html',
    needles: ['id="tdb-site-search-input"', '/site-search-index.json', 'Search the site'],
  },
  {
    path: '/story',
    needles: ['Hi, I\'m Brandon.', 'Built solo by Brandon', 'hospital season'],
  },
  {
    path: '/where-support-goes.html',
    needles: ['Where support goes', 'Built solo by Brandon', 'Privacy-first', 'KJV only'],
  },
  {
    path: '/journal/',
    needles: ['KJV journal for real battles', 'anxiety-before-tomorrow', 'forgiveness-when-you-replay-it'],
  },
  {
    path: '/journal/anxiety-before-tomorrow.html',
    needles: ['anxiety before tomorrow', 'Philippians 4:6-7 (KJV)', 'One next step'],
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
  try {
    const jUrl = base + '/site-search-index.json';
    const jr = await fetch(jUrl, {
      headers: {
        'User-Agent': FETCH_UA,
        Accept: 'application/json,*/*;q=0.8',
        'Cache-Control': 'no-cache',
      },
    });
    if (!jr.ok) {
      console.error('verify-live-key-html: MISSING or blocked', jUrl, 'HTTP', jr.status);
      failed = true;
    } else {
      const data = await jr.json();
      if (!data || !Array.isArray(data.entries) || data.entries.length < 5) {
        console.error('verify-live-key-html: site-search-index.json shape wrong or too few entries');
        failed = true;
      } else {
        console.log('verify-live-key-html: OK', jUrl, '(' + data.entries.length + ' entries)');
      }
    }
  } catch (e) {
    console.error('verify-live-key-html: site-search-index.json fetch failed', e.message || e);
    failed = true;
  }

  for (const { path, needles } of checks) {
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
    if (pageOk) {
      console.log('verify-live-key-html: OK', url);
    } else if (path.includes('plans') && body) {
      const stamp = extractBuildStamp(body);
      if (stamp) {
        console.error('verify-live-key-html: live Battle Plans build stamp:', stamp, '— if this predates your deploy, origin is stale.');
      }
    }
  }
  if (failed) {
    console.error(
      '\nverify-live-key-html: Production looks stale or markers were removed.\n' +
        '  • Confirm Cloudflare Pages custom domain points to the active Pages project for this repo.\n' +
        '  • Confirm Cloudflare Pages is serving the current deployment (not a stale origin).\n' +
        '  • Purge Cloudflare (needs CF_API_TOKEN in .env): CF_PURGE_FILES=https://todaysdailybattle.com/plans.html,... npm run purge:cloudflare\n' +
        '     or: npm run purge:cloudflare:social\n' +
        '  • Local dist check: grep plans-still-in-the-works dist/plans.html\n'
    );
    process.exit(1);
  }
  console.log('verify-live-key-html: all checks passed for', base);
}

main();
