#!/usr/bin/env node
/**
 * Re-runnable: inject product-promise heartbeat under brand title when missing;
 * rename Today's Verse → Today's Lesson in verse.html nav links.
 * Skips heartbeat if already present or tdb-brand-subtitle-learning (e.g. /verse).
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');

const HEARTBEAT =
  '<p class="tdb-header-heartbeat site-tagline" lang="en">One KJV verse for what you&rsquo;re carrying</p>';

const EXCLUDE_DIRS = new Set(['node_modules', 'dist', '.git']);

function walkHtml(dir, baseRel, out) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const e of entries) {
    const rel = path.join(baseRel, e.name).replace(/\\/g, '/');
    const full = path.join(dir, e.name);
    if (e.isDirectory()) {
      if (EXCLUDE_DIRS.has(e.name)) continue;
      walkHtml(full, rel, out);
    } else if (e.name.endsWith('.html')) {
      out.push({ full, rel });
    }
  }
}

function patch(raw) {
  let next = raw;
  if (!next.includes('tdb-header-heartbeat') && !next.includes('tdb-brand-subtitle-learning') && next.includes('<div class="brand">')) {
    const re = /(<a class="brand-title" href="\/">[\s\S]*?<\/a>)/;
    if (re.test(next)) {
      next = next.replace(re, (_, a) => `${a}\n        ${HEARTBEAT}`);
    }
  }
  next = next
    .split('href="/verse.html">Today&rsquo;s Verse</a>')
    .join('href="/verse.html">Today&rsquo;s Lesson</a>');
  next = next
    .split('href="verse.html">Today&rsquo;s Verse</a>')
    .join('href="verse.html">Today&rsquo;s Lesson</a>');
  return next;
}

function main() {
  const files = [];
  walkHtml(root, '', files);
  let n = 0;
  for (const { full, rel } of files) {
    if (rel.startsWith('lighthouse-')) continue;
    const raw = fs.readFileSync(full, 'utf8');
    const out = patch(raw);
    if (out !== raw) {
      fs.writeFileSync(full, out, 'utf8');
      n++;
    }
  }
  console.log('uog-quiet-rollout-header: updated', n, 'files');
}

main();
