#!/usr/bin/env node
/**
 * Fails if Lighthouse category scores fall below env-tunable mins (defaults below).
 * Also checks LCP/TBT against scripts/lighthouse-baseline.json when LH_PAGE is set.
 * Usage: LH_PAGE=home node scripts/assert-lighthouse.mjs [path-to-lhr.json]
 */
import { readFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const path = process.argv[2] || 'lhr-ci.json';
const pageKey = process.env.LH_PAGE || '';

const min = {
  accessibility: Number(process.env.LH_MIN_A11Y ?? 0.9),
  'best-practices': Number(process.env.LH_MIN_BP ?? 0.85),
  performance: Number(process.env.LH_MIN_PERF ?? 0.35),
};

let baseline = null;
const baselinePath = join(root, 'docs/perf-lighthouse-baseline.json');
if (existsSync(baselinePath)) {
  try {
    baseline = JSON.parse(readFileSync(baselinePath, 'utf8'));
  } catch (_) {}
}

let lhr;
try {
  lhr = JSON.parse(readFileSync(path, 'utf8'));
} catch (e) {
  console.error('assert-lighthouse: could not read JSON:', path, e.message || e);
  process.exit(1);
}

const pageBaseline = pageKey && baseline && baseline[pageKey] ? baseline[pageKey] : null;
if (pageBaseline && typeof pageBaseline.performanceMin === 'number') {
  min.performance = Math.max(min.performance, pageBaseline.performanceMin);
}

let fail = false;
for (const [id, minScore] of Object.entries(min)) {
  const cat = lhr.categories && lhr.categories[id];
  if (!cat) {
    console.error('assert-lighthouse: missing category', id);
    fail = true;
    continue;
  }
  const s = cat.score;
  if (s == null || Number.isNaN(s)) {
    console.error('assert-lighthouse: no score for', id);
    fail = true;
    continue;
  }
  const pct = (s * 100).toFixed(0);
  const need = (minScore * 100).toFixed(0);
  if (s < minScore) {
    console.error(`assert-lighthouse: ${id} ${pct} < min ${need}`);
    fail = true;
  } else {
    console.log(`assert-lighthouse: ${id} ${pct} (min ${need})`);
  }
}

function auditMs(id) {
  const a = lhr.audits && lhr.audits[id];
  if (!a || a.numericValue == null) return null;
  return a.numericValue;
}

if (pageBaseline) {
  const lcp = auditMs('largest-contentful-paint');
  if (lcp != null && pageBaseline.lcpMsMax != null) {
    const lcpRound = Math.round(lcp);
    if (lcp > pageBaseline.lcpMsMax) {
      console.error(`assert-lighthouse: LCP ${lcpRound}ms > max ${pageBaseline.lcpMsMax}ms`);
      fail = true;
    } else {
      console.log(`assert-lighthouse: LCP ${lcpRound}ms (max ${pageBaseline.lcpMsMax}ms)`);
    }
  }
  const tbt = auditMs('total-blocking-time');
  if (tbt != null && pageBaseline.tbtMsMax != null) {
    const tbtRound = Math.round(tbt);
    if (tbt > pageBaseline.tbtMsMax) {
      console.error(`assert-lighthouse: TBT ${tbtRound}ms > max ${pageBaseline.tbtMsMax}ms`);
      fail = true;
    } else {
      console.log(`assert-lighthouse: TBT ${tbtRound}ms (max ${pageBaseline.tbtMsMax}ms)`);
    }
  }
}

process.exit(fail ? 1 : 0);
