#!/usr/bin/env node
/**
 * Builds kjv-word-notes.json from human-curated entries.
 * Run: node scripts/build-kjv-words.mjs
 * Schema: scripts/README-kjv-word-notes.md
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { ENTRIES } from './kjv-word-notes-entries.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const out = path.join(__dirname, '..', 'kjv-word-notes.json');
const concPath = path.join(__dirname, '..', 'concordance.json');

const concordance = JSON.parse(fs.readFileSync(concPath, 'utf8'));
const concKeys = new Set(Object.keys(concordance));

/** Hub concordance indexes a limited lemma set; map headword → an indexed lemma for useful hit lists. */
const CONCORDANCE_FALLBACK = {
  conversation: 'heart',
  quick: 'word',
  peculiar: 'holy',
  prevent: 'come',
  suffer: 'let',
  virtue: 'power',
  meat: 'strong',
  corn: 'eat',
  replenish: 'fulness',
  comprehend: 'darkness',
  closet: 'prayer',
  bowels: 'mercies',
  communicate: 'good',
  hell: 'death',
  soul: 'life',
  repent: 'heart',
  justified: 'grace',
  sanctified: 'holy',
  propitiation: 'love',
  imputation: 'faith',
  covenant: 'blood',
  tabernacle: 'cloud',
  atonement: 'blood',
  redemption: 'grace',
  works: 'work',
  church: 'brethren',
  bishop: 'man',
  devils: 'devil',
  wine: 'drink',
  winepress: 'blood',
  temple: 'spirit',
  ensample: 'christ',
  eschew: 'evil',
  lust: 'love',
  study: 'word',
  strange: 'suffereth',
  superstitious: 'god',
  list: 'will',
  firmament: 'high',
  sod: 'eat',
  wist: 'know',
  wot: 'know',
  carriage: 'puffed',
  curious: 'work',
  meddle: 'man',
  mortify: 'flesh',
  simplicity: 'god',
  shamefacedness: 'man',
  damnation: 'death',
  multiply: 'abound',
  odd: 'present',
  sheet: 'come',
  press: 'present',
  comfortable: 'comfort',
  beguiled: 'evil',
  let: 'let',
  verily: 'said',
  haply: 'present',
  anon: 'come',
  'by and by': 'present',
  straightway: 'come',
  reins: 'heart',
  science: 'know',
  vain: 'nothing',
  subtil: 'evil',
  fortune: 'present',
  hap: 'present',
  charity: 'charity',
  ghost: 'ghost',
  careful: 'careful',
  flesh: 'flesh',
  heart: 'heart',
  spirit: 'spirit',
  grace: 'grace',
  faith: 'faith',
  world: 'world',
  'hell fire': 'death',
  'new birth': 'spirit',
  baptism: 'lord',
  communion: 'christ',
  cross: 'christ',
  gospel: 'christ',
  holiness: 'holy',
  mercy: 'mercies',
  longsuffering: 'patience',
  meek: 'blessed',
  condemnation: 'death',
  election: 'called',
  predestination: 'purpose',
  adoption: 'spirit',
  intercession: 'prayer',
  resurrection: 'life',
  authority: 'power',
  offence: 'evil'
};

function resolveConcordance(w, c) {
  if (c && typeof c === 'string') return c.trim();
  if (concKeys.has(w)) return w;
  const fb = CONCORDANCE_FALLBACK[w];
  if (fb && concKeys.has(fb)) return fb;
  if (fb && !concKeys.has(fb)) console.warn('Fallback invalid for', w, '→', fb);
  return 'god';
}

const words = ENTRIES.map(function (e) {
  const w = String(e.w || '').trim().toLowerCase();
  const ex = Array.isArray(e.ex) ? e.ex.map((r) => String(r).replace(/\s+/g, ' ').trim()).filter(Boolean) : [];
  if (ex.length < 3 || ex.length > 5) {
    throw new Error('Entry "' + w + '" must have 3–5 examples (got ' + ex.length + ').');
  }
  const note = String(e.note || '').trim();
  if (!w || !note) throw new Error('Entry needs w and note.');
  const conc = resolveConcordance(w, e.c);
  if (!concKeys.has(conc)) {
    console.warn('WARN: concordance key not in index —', w, '→', conc);
  }
  const row = {
    word: w,
    note: note,
    concordance: conc,
    examples: ex.slice(0, 5)
  };
  if (e.step && String(e.step).trim()) row.step = String(e.step).trim();
  return row;
});

const payload = {
  version: 2,
  about:
    'KJV word helps: short glosses + example refs. Hub concordance lists a growing subset of lemmas; each entry includes a concordance key for Search. See scripts/README-kjv-word-notes.md.',
  words: words
};

fs.writeFileSync(out, JSON.stringify(payload, null, 2) + '\n', 'utf8');
console.log('Wrote', out, '—', words.length, 'entries');
