#!/usr/bin/env node
/**
 * Objective live checks for Kids Loop + Story Library pages and OG assets.
 * Run after deploy: node scripts/verify-live-kids.mjs
 * Optional: LIVE_BASE=https://www.todaysdailybattle.com node scripts/verify-live-kids.mjs
 */
const BASE = (process.env.LIVE_BASE || 'https://todaysdailybattle.com').replace(/\/$/, '');

const checks = [
  {
    name: 'OG JPEG (loop)',
    url: `${BASE}/assets/share/kids-loop-og.jpg`,
    expectStatus: 200,
    expectType: 'image/jpeg'
  },
  {
    name: 'OG JPEG (story library)',
    url: `${BASE}/assets/share/kids-story-library-og.jpg`,
    expectStatus: 200,
    expectType: 'image/jpeg'
  }
];

const htmlChecks = [
  {
    name: 'Loop Library HTML',
    url: `${BASE}/kids-corner`,
    mustInclude: [
      'kids-loop-og.jpg',
      'Download loop progress (PDF)',
      'summary_large_image',
      '20260322loop-pdf-summary'
    ]
  },
  {
    name: 'Story Library HTML',
    url: `${BASE}/kids/corner`,
    mustInclude: [
      'kids-story-library-og.jpg',
      'Download Story Library List (PDF)',
      'summary_large_image'
    ]
  }
];

async function head(url) {
  const res = await fetch(url, { method: 'HEAD', redirect: 'follow' });
  return res;
}

async function getText(url) {
  const res = await fetch(url, { redirect: 'follow' });
  return { res, text: await res.text() };
}

let failed = false;

for (const c of checks) {
  try {
    const res = await head(c.url);
    const ct = (res.headers.get('content-type') || '').split(';')[0].trim();
    if (res.status !== c.expectStatus || !ct.includes(c.expectType.split('/')[0])) {
      console.error(`FAIL ${c.name}: status=${res.status} (want ${c.expectStatus}), content-type=${ct}`);
      failed = true;
    } else {
      console.log(`OK   ${c.name}: ${res.status} ${ct}`);
    }
  } catch (e) {
    console.error(`FAIL ${c.name}:`, e.message);
    failed = true;
  }
}

for (const h of htmlChecks) {
  try {
    const { res, text } = await getText(h.url);
    if (!res.ok) {
      console.error(`FAIL ${h.name}: HTTP ${res.status}`);
      failed = true;
      continue;
    }
    const missing = h.mustInclude.filter((s) => !text.includes(s));
    if (missing.length) {
      console.error(`FAIL ${h.name}: missing strings:`, missing.join(', '));
      failed = true;
    } else {
      console.log(`OK   ${h.name}: ${res.status}, all markers present`);
    }
  } catch (e) {
    console.error(`FAIL ${h.name}:`, e.message);
    failed = true;
  }
}

if (failed) {
  console.error('\nIf you see FAIL but deploy is new: try another network, incognito, or purge Cloudflare cache.');
  process.exit(1);
}
console.log('\nAll live kids checks passed.');
