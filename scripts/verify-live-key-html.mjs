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
];

async function fetchText(url) {
  const res = await fetch(url, {
    redirect: 'follow',
    headers: {
      'User-Agent': 'TDB-verify-live-key-html/1.0 (+https://todaysdailybattle.com)',
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
        'User-Agent': 'TDB-verify-live-key-html/1.0 (+https://todaysdailybattle.com)',
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
    }
  }
  if (failed) {
    console.error(
      '\nverify-live-key-html: Production looks stale or markers were removed.\n' +
        '  • Confirm Vercel (or host) deployed latest commit and uses outputDirectory dist.\n' +
        '  • Purge Cloudflare: npm run purge:cloudflare:social\n' +
        '  • Local dist check: grep plans-still-in-the-works dist/plans.html\n'
    );
    process.exit(1);
  }
  console.log('verify-live-key-html: all checks passed for', base);
}

main();
