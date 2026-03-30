#!/usr/bin/env node
/**
 * Idempotent: inserts Explore + Verses (My Verses) between Support and More
 * in tdb-global-nav / tdb-home-main-nav strips (4- or 8-space indent).
 */
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(import.meta.dirname, '..');
const SKIP = new Set(['node_modules', 'dist', '.git']);

function walk(dir, out = []) {
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    if (SKIP.has(ent.name)) continue;
    const p = path.join(dir, ent.name);
    if (ent.isDirectory()) walk(p, out);
    else if (ent.isFile() && ent.name.endsWith('.html')) out.push(p);
  }
  return out;
}

const SUPPORT =
  '<a href="/give" aria-label="Support this quiet place — optional gift">Support</a>';

function alreadyInjected(s) {
  return /\n\s*<a href="\/explore\.html">Explore<\/a>\s*\n\s*<a href="\/my-verses\.html" aria-label="My Verses — saved KJV verses">Verses<\/a>\s*\n\s*<details class="tdb-nav-more">/.test(
    s
  );
}

const SHORT = '<a href="/give">Support</a>';

function inject(s) {
  if (alreadyInjected(s)) return s;
  const block4 = `    ${SUPPORT}\n    <details class="tdb-nav-more">`;
  const ins4 = `    ${SUPPORT}\n    <a href="/explore.html">Explore</a>\n    <a href="/my-verses.html" aria-label="My Verses — saved KJV verses">Verses</a>\n    <details class="tdb-nav-more">`;
  if (s.includes(block4)) return s.replace(block4, ins4);

  const block8 = `        ${SUPPORT}\n        <details class="tdb-nav-more">`;
  const ins8 = `        ${SUPPORT}\n        <a href="/explore.html">Explore</a>\n        <a href="/my-verses.html" aria-label="My Verses — saved KJV verses">Verses</a>\n        <details class="tdb-nav-more">`;
  if (s.includes(block8)) return s.replace(block8, ins8);

  /* Explore hub & pages with short Support link (no aria-label on give) */
  return s.replace(
    /(<a href="\/give">Support<\/a>)\n(\s*)<details class="tdb-nav-more">/,
    `$1\n$2<a href="/explore.html">Explore</a>\n$2<a href="/my-verses.html" aria-label="My Verses — saved KJV verses">Verses</a>\n$2<details class="tdb-nav-more">`
  );
}

let changed = 0;
for (const fp of walk(ROOT)) {
  const before = fs.readFileSync(fp, 'utf8');
  const after = inject(before);
  if (after !== before) {
    fs.writeFileSync(fp, after);
    changed++;
    console.log('updated', path.relative(ROOT, fp));
  }
}
console.log('inject-nav-explore-verses:', changed, 'file(s)');
