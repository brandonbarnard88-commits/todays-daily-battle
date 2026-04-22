#!/usr/bin/env node
/**
 * Mobile Lighthouse on production / and reader.html; writes JSON + prints performance scores.
 * Requires: npx (downloads lighthouse@11 on first run), Chrome/Chromium for Lighthouse.
 * Usage: node scripts/lighthouse-live-two.mjs
 */
import { spawnSync } from 'child_process';
import { readFileSync, existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const root = dirname(fileURLToPath(import.meta.url));
const repoRoot = join(root, '..');
const runs = [
  ['https://todaysdailybattle.com/', join(repoRoot, 'lighthouse-home.json')],
  /* Canonical path avoids 30x to /reader and keeps LCP honest (see Lighthouse "redirects" audit). */
  ['https://todaysdailybattle.com/reader', join(repoRoot, 'lighthouse-reader.json')],
];

for (const [url, outPath] of runs) {
  const args = [
    '--yes',
    'lighthouse@11',
    url,
    '--only-categories=performance',
    '--form-factor=mobile',
    '--screenEmulation.mobile=true',
    '--output=json',
    `--output-path=${outPath}`,
    '--quiet',
    '--chrome-flags=--headless=new --no-sandbox',
  ];
  const r = spawnSync('npx', args, { cwd: repoRoot, stdio: 'inherit', shell: false, env: process.env });
  if (r.status !== 0) {
    console.error('lighthouse-live-two: failed for', url);
    process.exit(r.status || 1);
  }
}

function summarize(path, label) {
  if (!existsSync(path)) return;
  let h;
  try {
    h = JSON.parse(readFileSync(path, 'utf8'));
  } catch (e) {
    console.error('Could not read', path);
    return;
  }
  const perf = h.categories && h.categories.performance;
  const m = h.audits || {};
  const lcp = m['largest-contentful-paint'];
  const cls = m['cumulative-layout-shift'];
  const tbt = m['total-blocking-time'];
  const pct = perf && perf.score != null ? (perf.score * 100).toFixed(0) : '?';
  console.log(`\n${label}`);
  console.log(`  Performance: ${pct}`);
  if (lcp) console.log(`  LCP: ${lcp.displayValue || ''}`);
  if (cls) console.log(`  CLS: ${cls.displayValue || ''}`);
  if (tbt) console.log(`  TBT: ${tbt.displayValue || ''}`);
}

summarize(join(repoRoot, 'lighthouse-home.json'), 'Home /');
summarize(join(repoRoot, 'lighthouse-reader.json'), 'reader.html');
console.log('\nJSON: lighthouse-home.json, lighthouse-reader.json (see .gitignore)');
process.exit(0);
