#!/usr/bin/env node
/**
 * Lookup of an obscure KJV verse must still yield context + plain English.
 */
import fs from 'fs';
import path from 'path';
import vm from 'vm';
import { fileURLToPath } from 'url';

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
const samples = ['Haggai 1:5', 'Obadiah 1:3', 'Nahum 1:7', '3 John 1:2', 'Philemon 1:4'];
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
  const pack = JSON.parse(fs.readFileSync(path.join(root, 'data', 'breakdown', slug + '.json'), 'utf8'));
  if (!pack[cv] || pack[cv].length < 8) fails.push(ref + ': missing full-Bible plain');
}
if (fails.length) {
  console.error('verify-lookup-full-bible FAIL');
  fails.forEach((f) => console.error(' •', f));
  process.exit(1);
}
console.log('Lookup full-Bible PASS: context + plain for', samples.length, 'off-seed verses.');
