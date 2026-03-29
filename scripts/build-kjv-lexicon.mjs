/**
 * Builds kjv-lexicon.json (word -> gloss + context + sample refs) from kjv-word-notes.json.
 * Run: node scripts/build-kjv-lexicon.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const srcPath = path.join(root, 'kjv-word-notes.json');
const outPath = path.join(root, 'kjv-lexicon.json');

const raw = JSON.parse(fs.readFileSync(srcPath, 'utf8'));
const words = {};
const arr = Array.isArray(raw.words) ? raw.words : [];
for (let i = 0; i < arr.length; i++) {
  const e = arr[i];
  if (!e || !e.word) continue;
  const k = String(e.word).toLowerCase().trim();
  if (!k) continue;
  const examples = Array.isArray(e.examples)
    ? e.examples.map((r) => String(r || '').replace(/\s+/g, ' ').trim()).filter(Boolean).slice(0, 10)
    : [];
  words[k] = {
    g: String(e.note || '').trim(),
    s: e.step ? String(e.step).trim() : '',
    x: examples
  };
}
const out = {
  version: 2,
  source: 'kjv-word-notes',
  about: 'Curated KJV English glosses (not a full historic dictionary). g=meaning, s=how to read, x=sample refs.',
  count: Object.keys(words).length,
  words
};
fs.writeFileSync(outPath, JSON.stringify(out));
console.log('Wrote', outPath, 'entries:', out.count);
