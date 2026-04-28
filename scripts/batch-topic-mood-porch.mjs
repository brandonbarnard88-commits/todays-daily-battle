#!/usr/bin/env node
/**
 * Add topic-mood-porch alongside existing porch hooks where missing.
 * Pass 1: tdb-print-porch on one-pagers. Does not change copy or IDs.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const SKIP_DIRS = new Set([
  'node_modules',
  'dist',
  '.git',
  'next-app',
  'partials',
  'api',
  'playwright-report',
]);

function walkHtmlFiles(startDir, out = []) {
  for (const ent of fs.readdirSync(startDir, { withFileTypes: true })) {
    const base = ent.name;
    if (base.startsWith('.')) continue;
    const p = path.join(startDir, base);
    if (ent.isDirectory()) {
      if (SKIP_DIRS.has(base)) continue;
      walkHtmlFiles(p, out);
    } else if (base.endsWith('.html')) {
      if (/^lighthouse.*\.html$/i.test(base)) continue;
      out.push(p);
    }
  }
  return out;
}

const files = walkHtmlFiles(ROOT);
let changed = 0;
for (const abs of files) {
  let s = fs.readFileSync(abs, 'utf8');
  if (!s.includes('class="tdb-print-porch"')) continue;
  if (s.includes('tdb-print-porch topic-mood-porch')) continue;

  const orig = s;
  s = s.replace(/class="tdb-print-porch"/g, 'class="tdb-print-porch topic-mood-porch"');
  if (s !== orig) {
    fs.writeFileSync(abs, s, 'utf8');
    changed++;
    console.log(path.relative(ROOT, abs));
  }
}

console.error('batch-topic-mood-porch (print): updated', changed, 'files');
