#!/usr/bin/env node
/**
 * Lookup of an obscure KJV verse must still yield context + plain English.
 */
import fs from 'fs';
import path from 'path';
import vm from 'vm';
import { fileURLToPath } from 'url';
import { isWeakLaymanPlain } from './lib/hero-layman-plain.mjs';
import { isWeakPlainStamp } from './lib/teaching-quality.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');

function loadContext() {
  const code = fs.readFileSync(path.join(root, 'verse-context.js'), 'utf8');
  const s = { console };
  s.window = s;
  s.globalThis = s;
  vm.runInNewContext(code, s, { filename: 'verse-context.js' });
  return s.TDB_resolveVerseContext;
}

const resolve = loadContext();
const meta = JSON.parse(fs.readFileSync(path.join(root, 'data', 'breakdown', '_meta.json'), 'utf8'));
const kjv = JSON.parse(
  fs.readFileSync(
    fs.existsSync(path.join(root, 'data', 'kjv-full.json'))
      ? path.join(root, 'data', 'kjv-full.json')
      : path.join(root, 'kjv.json'),
    'utf8'
  )
);
const samples = Object.keys(meta.books || {}).map((book) => book + ' 1:1');
const extra = ['Haggai 1:5', 'Obadiah 1:3', 'Nahum 1:7', '3 John 1:2', 'Philemon 1:4', '1 Samuel 16:17', 'John 3:16'];
extra.forEach((r) => {
  if (samples.indexOf(r) === -1) samples.push(r);
});
const fails = [];
for (const ref of samples) {
  const ctx = resolve(ref);
  if (!ctx || !ctx.about || !ctx.to || !(ctx.setting || ctx.situation)) {
    fails.push(ref + ': missing chapter context');
    continue;
  }
  const book = ref.replace(/\s+\d+:\d+$/, '').replace(/^Psalms$/i, 'Psalm');
  const cv = ref.match(/(\d+:\d+)$/)[1];
  const slug = book.toLowerCase().replace(/\s+/g, '-');
  const packPath = path.join(root, 'data', 'breakdown', slug + '.json');
  if (!fs.existsSync(packPath)) {
    fails.push(ref + ': missing pack');
    continue;
  }
  const pack = JSON.parse(fs.readFileSync(packPath, 'utf8'));
  const plain = String(pack[cv] || '');
  if (!plain || plain.length < 8) {
    fails.push(ref + ': missing full-Bible plain');
    continue;
  }
  const verseText = String(kjv[ref] || kjv[ref.replace(/^Psalm /, 'Psalms ')] || '');
  if (isWeakPlainStamp(plain) || (verseText && isWeakLaymanPlain(plain, verseText))) {
    fails.push(ref + ': weak or echo plain');
  }
}
if (fails.length) {
  console.error('verify-lookup-full-bible FAIL');
  fails.forEach((f) => console.error(' •', f));
  process.exit(1);
}
console.log('Lookup full-Bible PASS: context + plain for', samples.length, 'off-seed verses.');
