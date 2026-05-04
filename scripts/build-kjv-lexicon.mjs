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

function cleanText(value) {
  return String(value == null ? '' : value).replace(/\s+/g, ' ').trim();
}

function normalizeDeepDive(rawDeep) {
  if (!rawDeep || typeof rawDeep !== 'object') return null;
  const deep = {};
  const era = cleanText(rawDeep.kjvEraUsage);
  const notes = cleanText(rawDeep.studyNotes);
  const refs = Array.isArray(rawDeep.keyCrossRefs)
    ? rawDeep.keyCrossRefs.map((ref) => cleanText(ref)).filter(Boolean).slice(0, 5)
    : [];
  const related = Array.isArray(rawDeep.relatedWords)
    ? rawDeep.relatedWords.map((word) => cleanText(word).toLowerCase()).filter(Boolean).slice(0, 6)
    : [];
  const weight = cleanText(rawDeep.theologicalWeight);
  if (era) deep.kjvEraUsage = era;
  if (refs.length) deep.keyCrossRefs = refs;
  if (notes) deep.studyNotes = notes;
  if (related.length) deep.relatedWords = related;
  if (weight) deep.theologicalWeight = weight;
  return Object.keys(deep).length ? deep : null;
}

for (let i = 0; i < arr.length; i++) {
  const e = arr[i];
  if (!e || !e.word) continue;
  const k = String(e.word).toLowerCase().trim();
  if (!k) continue;
  const examples = Array.isArray(e.examples)
    ? e.examples.map((r) => String(r || '').replace(/\s+/g, ' ').trim()).filter(Boolean).slice(0, 10)
    : [];
  words[k] = {
    g: cleanText(e.shortGloss || e.note),
    s: cleanText(e.howToRead || e.step),
    w: cleanText(e.whyToday || e.why),
    x: examples
  };
  const deepDive = normalizeDeepDive(e.deepDive);
  if (deepDive) words[k].d = deepDive;
}
const out = {
  version: 3,
  source: 'kjv-word-notes',
  about:
    'Curated KJV English glosses (not a full historic dictionary). g=meaning, s=how to read, w=why it matters today, x=sample refs, d=optional deep-dive study block.',
  count: Object.keys(words).length,
  words
};
fs.writeFileSync(outPath, JSON.stringify(out));
console.log('Wrote', outPath, 'entries:', out.count);
