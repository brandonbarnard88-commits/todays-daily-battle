#!/usr/bin/env node
/**
 * Every user-facing HTML page should declare a mobile-friendly viewport.
 * Excludes: dist/ (build output), next-app/, node_modules, Lighthouse reports.
 *
 * Run: node scripts/verify-viewport-baseline.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');

const SKIP_DIR = new Set(['node_modules', 'dist', 'next-app', '.git', 'vendor', 'mcps', 'partials']);
const SKIP_FILE = (name) => /lighthouse|\.report\.html$/i.test(name) || name === 'modal.html';

const VIEWPORT_RE = /name\s*=\s*["']viewport["']/i;

function* walkHtml(dir) {
  let ents;
  try {
    ents = fs.readdirSync(dir, { withFileTypes: true });
  } catch {
    return;
  }
  for (const e of ents) {
    if (e.name.startsWith('.')) continue;
    const p = path.join(dir, e.name);
    if (e.isDirectory()) {
      if (SKIP_DIR.has(e.name)) continue;
      yield* walkHtml(p);
    } else if (e.name.endsWith('.html') && !SKIP_FILE(e.name)) {
      yield p;
    }
  }
}

function main() {
  const missing = [];
  let n = 0;
  for (const f of walkHtml(root)) {
    n += 1;
    const raw = fs.readFileSync(f, 'utf8');
    if (!VIEWPORT_RE.test(raw)) {
      missing.push(path.relative(root, f));
    }
  }
  if (missing.length) {
    console.error('verify-viewport-baseline: FAILED — missing <meta name="viewport"> in:\n');
    missing.forEach((m) => console.error('  ', m));
    process.exit(1);
  }
  console.log('verify-viewport-baseline: OK (', n, 'HTML files)');
}

main();
