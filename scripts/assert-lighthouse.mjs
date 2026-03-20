#!/usr/bin/env node
/**
 * Fails if Lighthouse category scores fall below env-tunable mins (defaults below).
 * Usage: node scripts/assert-lighthouse.mjs [path-to-lhr.json]
 */
import { readFileSync } from 'fs';

const path = process.argv[2] || 'lhr-ci.json';
const min = {
  accessibility: Number(process.env.LH_MIN_A11Y ?? 0.9),
  'best-practices': Number(process.env.LH_MIN_BP ?? 0.85),
  performance: Number(process.env.LH_MIN_PERF ?? 0.35),
};

let lhr;
try {
  lhr = JSON.parse(readFileSync(path, 'utf8'));
} catch (e) {
  console.error('assert-lighthouse: could not read JSON:', path, e.message || e);
  process.exit(1);
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

process.exit(fail ? 1 : 0);
