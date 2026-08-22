#!/usr/bin/env node
/**
 * Compact KJV chapter → verse-count map for Look up pickers.
 * data/kjv-chapter-verses.json  { "Genesis": [31, 25, ...], ... }
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const kjv = JSON.parse(fs.readFileSync(path.join(root, 'data', 'kjv-full.json'), 'utf8'));
const books = {};
Object.keys(kjv).forEach((raw) => {
  if (typeof kjv[raw] !== 'string' || !kjv[raw].trim()) return;
  const m = String(raw).trim().match(/^(.+?)\s+(\d+):(\d+)$/);
  if (!m) return;
  let book = m[1];
  if (/^Psalms$/i.test(book)) book = 'Psalm';
  const ch = Number(m[2]);
  const vs = Number(m[3]);
  if (!books[book]) books[book] = {};
  books[book][ch] = Math.max(books[book][ch] || 0, vs);
});
const out = {};
let verses = 0;
Object.keys(books)
  .sort()
  .forEach((book) => {
    const chs = books[book];
    const maxCh = Math.max.apply(null, Object.keys(chs).map(Number));
    const arr = [];
    for (let i = 1; i <= maxCh; i++) {
      arr.push(Number(chs[i] || 0));
      verses += Number(chs[i] || 0);
    }
    out[book] = arr;
  });
if (Object.keys(out).length !== 66 || verses < 31000) {
  console.error('kjv-chapter-verses expected 66 books / ~31102 verses, got', Object.keys(out).length, verses);
  process.exit(1);
}
const dest = path.join(root, 'data', 'kjv-chapter-verses.json');
fs.writeFileSync(dest, JSON.stringify(out));
const distDir = path.join(root, 'dist', 'data');
fs.mkdirSync(distDir, { recursive: true });
fs.copyFileSync(dest, path.join(distDir, 'kjv-chapter-verses.json'));
console.log('kjv-chapter-verses:', Object.keys(out).length, 'books,', verses, 'verses');
