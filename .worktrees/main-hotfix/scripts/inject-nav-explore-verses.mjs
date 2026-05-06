#!/usr/bin/env node
/**
 * Idempotent: ensures Explore, Verses, Prayer on primary strip (after Support, before More).
 * Strips duplicate Explore / plain My Verses from .tdb-nav-more-panel when redundant.
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

const SUPPORT_LONG =
  '<a href="/give" aria-label="Support this quiet place — optional gift">Support</a>';
const SUPPORT_SHORT = '<a href="/give">Support</a>';

const STRIP_BLOCK = `
    <a href="/explore.html">Explore</a>
    <a href="/my-verses.html" aria-label="My Verses — saved KJV verses">Verses</a>
    <a href="/message.html" aria-label="Prayer wall — community requests">Prayer</a>
    <details class="tdb-nav-more">`;

function alreadyHasStrip(s) {
  return (
    /\/explore\.html">Explore</.test(s) &&
    /\/my-verses\.html"[^>]*>Verses</.test(s) &&
    /\/message\.html"[^>]*>Prayer</.test(s) &&
    /Verses<\/a>\s*\n\s*<a href="\/message\.html"/.test(s)
  );
}

function injectStrip(s) {
  if (alreadyHasStrip(s)) return s;
  const b4 = `    ${SUPPORT_LONG}\n    <details class="tdb-nav-more">`;
  const i4 = `    ${SUPPORT_LONG}\n    <a href="/explore.html">Explore</a>\n    <a href="/my-verses.html" aria-label="My Verses — saved KJV verses">Verses</a>\n    <a href="/message.html" aria-label="Prayer wall — community requests">Prayer</a>\n    <details class="tdb-nav-more">`;
  if (s.includes(b4)) return s.replace(b4, i4);

  const b8 = `        ${SUPPORT_LONG}\n        <details class="tdb-nav-more">`;
  const i8 = `        ${SUPPORT_LONG}\n        <a href="/explore.html">Explore</a>\n        <a href="/my-verses.html" aria-label="My Verses — saved KJV verses">Verses</a>\n        <a href="/message.html" aria-label="Prayer wall — community requests">Prayer</a>\n        <details class="tdb-nav-more">`;
  if (s.includes(b8)) return s.replace(b8, i8);

  const short4 = `    ${SUPPORT_SHORT}\n    <details class="tdb-nav-more">`;
  const shortIns4 = `    ${SUPPORT_SHORT}\n    <a href="/explore.html">Explore</a>\n    <a href="/my-verses.html" aria-label="My Verses — saved KJV verses">Verses</a>\n    <a href="/message.html" aria-label="Prayer wall — community requests">Prayer</a>\n    <details class="tdb-nav-more">`;
  if (s.includes(short4)) return s.replace(short4, shortIns4);

  return s.replace(
    /(<a href="\/give"[^>]*>Support<\/a>)\n(\s*)<details class="tdb-nav-more">/,
    `$1\n$2<a href="/explore.html">Explore</a>\n$2<a href="/my-verses.html" aria-label="My Verses — saved KJV verses">Verses</a>\n$2<a href="/message.html" aria-label="Prayer wall — community requests">Prayer</a>\n$2<details class="tdb-nav-more">`
  );
}

/** After Explore+Verses on strip, drop duplicate Explore as first panel link */
function dedupeMorePanel(s) {
  if (!/\/explore\.html">Explore</.test(s)) return s;
  let t = s;
  t = t.replace(
    /(<div class="tdb-nav-more-panel"[^>]*>\s*)<a href="\/explore\.html">Explore<\/a>\s*\n/g,
    '$1'
  );
  t = t.replace(
    /\n\s*<a href="\/my-verses\.html">My Verses<\/a>\s*(?=\n\s*<a href="\/family)/g,
    '\n'
  );
  t = t.replace(/\n\s*<a href="\/my-verses\.html">My Verses<\/a>\s*(?=\n\s*<\/div>\s*\n\s*<\/details>)/g, '\n');
  return t;
}

/** Insert Prayer after Verses when Verses exists but Prayer missing */
function ensurePrayerAfterVerses(s) {
  if (/\/message\.html"[^>]*>Prayer</.test(s) && /Verses<\/a>\s*\n\s*<a href="\/message\.html"/.test(s)) {
    return s;
  }
  return s.replace(
    /(<a href="\/my-verses\.html"[^>]*>Verses<\/a>)\n(\s*)(<details class="tdb-nav-more">)/g,
    `$1\n$2<a href="/message.html" aria-label="Prayer wall — community requests">Prayer</a>\n$2$3`
  );
}

let changed = 0;
for (const fp of walk(ROOT)) {
  let before = fs.readFileSync(fp, 'utf8');
  let after = injectStrip(before);
  after = ensurePrayerAfterVerses(after);
  after = dedupeMorePanel(after);
  if (after !== before) {
    fs.writeFileSync(fp, after);
    changed++;
    console.log('updated', path.relative(ROOT, fp));
  }
}
console.log('inject-nav-primary-strip:', changed, 'file(s)');
