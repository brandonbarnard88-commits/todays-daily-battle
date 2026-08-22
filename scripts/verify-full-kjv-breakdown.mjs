#!/usr/bin/env node
/**
 * Full KJV breakdown catalog must exist and stay leftover-free.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { isWeakPlainStamp } from './lib/teaching-quality.mjs';
import { isWeakLaymanPlain } from './lib/hero-layman-plain.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const dir = path.join(root, 'data', 'breakdown');
const metaPath = path.join(dir, '_meta.json');

if (!fs.existsSync(metaPath)) {
  console.error('verify-full-kjv-breakdown: missing data/breakdown/_meta.json — run node scripts/build-full-kjv-breakdown.mjs');
  process.exit(1);
}
const meta = JSON.parse(fs.readFileSync(metaPath, 'utf8'));
if (Number(meta.verseCount) < 31000) {
  console.error('verify-full-kjv-breakdown: verseCount is', meta.verseCount, 'expected ~31102');
  process.exit(1);
}
const kjvPath = fs.existsSync(path.join(root, 'data', 'kjv-full.json'))
  ? path.join(root, 'data', 'kjv-full.json')
  : path.join(root, 'kjv.json');
const kjv = JSON.parse(fs.readFileSync(kjvPath, 'utf8'));
const leftover = [];
let seen = 0;
for (const book of Object.keys(meta.books || {})) {
  const slug = book.toLowerCase().replace(/\s+/g, '-');
  const p = path.join(dir, slug + '.json');
  if (!fs.existsSync(p)) {
    leftover.push('missing book file ' + slug);
    continue;
  }
  const map = JSON.parse(fs.readFileSync(p, 'utf8'));
  Object.keys(map).forEach((cv) => {
    seen += 1;
    const plain = String(map[cv] || '');
    const kjvKey = book === 'Psalm' ? 'Psalm ' + cv : book + ' ' + cv;
    const altKey = book === 'Psalm' ? 'Psalms ' + cv : '';
    const verseText = String(kjv[kjvKey] || kjv[altKey] || '');
    if (
      !plain ||
      isWeakPlainStamp(plain) ||
      /kindness meets you as you are|hold this verse as written/i.test(plain) ||
      (verseText && isWeakLaymanPlain(plain, verseText))
    ) {
      leftover.push(book + ' ' + cv);
    }
  });
}
if (seen !== Number(meta.verseCount)) {
  console.error('verify-full-kjv-breakdown: counted', seen, 'but meta says', meta.verseCount);
  process.exit(1);
}
if (leftover.length) {
  console.error('verify-full-kjv-breakdown leftover', leftover.length);
  leftover.slice(0, 20).forEach((l) => console.error(' •', l));
  process.exit(1);
}
console.log('Full KJV breakdown PASS:', seen, 'verses in', Object.keys(meta.books).length, 'books.');
