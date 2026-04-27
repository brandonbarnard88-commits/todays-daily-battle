#!/usr/bin/env node
/**
 * Objective live checks for Kids Loop + Story Library pages and OG assets.
 * Run after deploy: node scripts/verify-live-kids.mjs
 * Optional: LIVE_BASE=https://www.todaysdailybattle.com node scripts/verify-live-kids.mjs
 */
import { LOOP_HTML_MARKERS, STORY_HTML_MARKERS, OG_ASSET_PATHS } from './kids-verify-markers.mjs';

const BASE = (process.env.LIVE_BASE || 'https://todaysdailybattle.com').replace(/\/$/, '');

const checks = [
  ...OG_ASSET_PATHS.map((rel) => ({
    name: `OG JPEG (${rel.includes('loop') ? 'loop' : 'story'})`,
    url: `${BASE}/${rel}`,
    expectStatus: 200,
    expectType: 'image/jpeg',
  })),
  ...['kids/kids-hub-play.js', 'kids/kids-gentle-shepherd.js', 'kids/kids-wins-recap.js'].map((rel) => ({
    name: `Kids script /${rel}`,
    url: `${BASE}/${rel}`,
    expectStatus: 200,
    expectType: 'application/javascript',
  })),
];

const htmlChecks = [
  {
    name: 'Loop Library HTML',
    url: `${BASE}/kids-corner`,
    mustInclude: LOOP_HTML_MARKERS
  },
  {
    name: 'Story Library HTML',
    url: `${BASE}/kids/corner`,
    mustInclude: STORY_HTML_MARKERS
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
