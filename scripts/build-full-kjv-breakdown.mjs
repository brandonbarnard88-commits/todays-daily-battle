#!/usr/bin/env node
/**
 * Full-KJV breakdown catalog — every verse, not only refs that appear on the site.
 *
 * Writes data/breakdown/<book-slug>.json  { "1:1": "plain English…", … }
 * and data/breakdown/_meta.json { verseCount, books }.
 *
 * Homepage still ships a small seed (site-surfaced overrides). Reader / Ask / lookup
 * load one book at a time. Teaching is this verse restated — not a leftover stamp.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import {
  buildHeroLaymanPlain,
  frameVerseTeaching,
  isWeakLaymanPlain,
  loadVersePlainMeanings,
  normalizeHeroRef
} from './lib/hero-layman-plain.mjs';
import { isWeakPlainStamp } from './lib/teaching-quality.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const outDir = path.join(root, 'data', 'breakdown');

function bookSlug(book) {
  return String(book || '')
    .replace(/^Psalms$/i, 'Psalm')
    .toLowerCase()
    .replace(/\s+/g, '-');
}

function splitRef(ref) {
  const n = normalizeHeroRef(ref);
  const m = n.match(/^(.+?)\s+(\d+):(\d+)$/);
  if (!m) return null;
  let book = m[1];
  if (/^Psalms$/i.test(book)) book = 'Psalm';
  return { book, cv: m[2] + ':' + m[3], ref: book + ' ' + m[2] + ':' + m[3] };
}

function loadKjv() {
  const p = fs.existsSync(path.join(root, 'data', 'kjv-full.json'))
    ? path.join(root, 'data', 'kjv-full.json')
    : path.join(root, 'kjv.json');
  return JSON.parse(fs.readFileSync(p, 'utf8'));
}

function leftoverish(p) {
  return (
    isWeakPlainStamp(p) ||
    /kindness meets you as you are|not after you perform|hold this verse as written/i.test(p)
  );
}

function plainFor(ref, text, map) {
  const raw = String(text || '').replace(/\s+/g, ' ').trim();
  let p = buildHeroLaymanPlain(ref, raw, map, root);
  if (!p || leftoverish(p) || isWeakLaymanPlain(p, raw)) {
    p = frameVerseTeaching(raw);
  }
  return String(p || frameVerseTeaching(raw) || '').trim();
}

function main() {
  const kjv = loadKjv();
  const map = loadVersePlainMeanings(root);
  const byBook = Object.create(null);
  const leftover = [];
  let count = 0;

  Object.keys(kjv).forEach((rawKey) => {
    const text = kjv[rawKey];
    if (typeof text !== 'string' || !text.trim()) return;
    const parts = splitRef(rawKey);
    if (!parts) return;
    const p = plainFor(parts.ref, text, map);
    if (!p) leftover.push(parts.ref + ': empty');
    else if (leftoverish(p) || isWeakLaymanPlain(p, text)) {
      leftover.push(parts.ref + ': leftover-or-echo');
    }
    if (!byBook[parts.book]) byBook[parts.book] = {};
    byBook[parts.book][parts.cv] = p;
    count += 1;
  });

  if (leftover.length) {
    console.error('full-kjv-breakdown leftover', leftover.length);
    leftover.slice(0, 20).forEach((l) => console.error(' •', l));
    process.exit(1);
  }
  if (count < 31000) {
    console.error('full-kjv-breakdown expected ~31102 verses, got', count);
    process.exit(1);
  }

  fs.mkdirSync(outDir, { recursive: true });
  const books = {};
  Object.keys(byBook)
    .sort()
    .forEach((book) => {
      const verses = byBook[book];
      const n = Object.keys(verses).length;
      books[book] = n;
      fs.writeFileSync(path.join(outDir, bookSlug(book) + '.json'), JSON.stringify(verses), 'utf8');
    });
  fs.writeFileSync(
    path.join(outDir, '_meta.json'),
    JSON.stringify({ verseCount: count, bookCount: Object.keys(books).length, books }, null, 2) + '\n'
  );
  const distDir = path.join(root, 'dist', 'data', 'breakdown');
  fs.mkdirSync(distDir, { recursive: true });
  fs.readdirSync(distDir).forEach((name) => {
    fs.unlinkSync(path.join(distDir, name));
  });
  fs.readdirSync(outDir).forEach((name) => {
    fs.copyFileSync(path.join(outDir, name), path.join(distDir, name));
  });
  console.log('full-kjv-breakdown: ' + count + ' verses in ' + Object.keys(books).length + ' books → data/breakdown/');
}

main();
