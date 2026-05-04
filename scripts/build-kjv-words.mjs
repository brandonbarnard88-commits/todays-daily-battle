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
import { DEEP_DIVE_SEEDS } from './kjv-word-notes-deep-dive-seeds.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const out = path.join(__dirname, '..', 'kjv-word-notes.json');
const concPath = path.join(__dirname, '..', 'concordance.json');

const concordance = JSON.parse(fs.readFileSync(concPath, 'utf8'));
const concKeys = new Set(Object.keys(concordance));

/** Preserve “why” blurbs across rebuilds when entries in .mjs omit them (see merge-kjv-whys-batch.mjs). */
let existingWhyByWord = new Map();
let existingDeepByWord = new Map();
if (fs.existsSync(out)) {
  try {
    const prev = JSON.parse(fs.readFileSync(out, 'utf8'));
    for (const e of prev.words || []) {
      if (e && e.word && String(e.why || '').trim()) {
        existingWhyByWord.set(String(e.word).toLowerCase().trim(), String(e.why).trim());
      }
      if (e && e.word && e.deepDive && typeof e.deepDive === 'object') {
        existingDeepByWord.set(String(e.word).toLowerCase().trim(), e.deepDive);
      }
    }
  } catch (_) {
    /* ignore corrupt prior file */
  }
}

function cleanText(value) {
  return String(value == null ? '' : value).replace(/\s+/g, ' ').trim();
}

function normalizeDeepDive(raw) {
  if (!raw || typeof raw !== 'object') return null;
  const era = cleanText(raw.kjvEraUsage);
  const notes = cleanText(raw.studyNotes);
  const refs = Array.isArray(raw.keyCrossRefs)
    ? raw.keyCrossRefs.map((ref) => cleanText(ref)).filter(Boolean).slice(0, 5)
    : [];
  const related = Array.isArray(raw.relatedWords)
    ? raw.relatedWords.map((word) => cleanText(word).toLowerCase()).filter(Boolean).slice(0, 6)
    : [];
  const weight = cleanText(raw.theologicalWeight);
  if (!era && !notes && !refs.length && !related.length && !weight) return null;
  const deepDive = {};
  if (era) deepDive.kjvEraUsage = era;
  if (refs.length) deepDive.keyCrossRefs = refs;
  if (notes) deepDive.studyNotes = notes;
  if (related.length) deepDive.relatedWords = related;
  if (weight) deepDive.theologicalWeight = weight;
  return deepDive;
}

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
  offence: 'evil',
  // Batch-2 headwords → Hub lemmas (concordance.json is a curated subset)
  alms: 'gift',
  amen: 'said',
  apostle: 'christ',
  array: 'set',
  begat: 'begotten',
  bewitched: 'devil',
  bewray: 'evil',
  bill: 'word',
  blasphemy: 'evil',
  blemish: 'holy',
  'blot out': 'word',
  brasen: 'holy',
  brazen: 'holy',
  breath: 'spirit',
  bridegroom: 'christ',
  bruise: 'broken',
  buckler: 'refuge',
  burden: 'heavy',
  burthen: 'heavy',
  bushel: 'light',
  candlestick: 'light',
  carcase: 'death',
  carnal: 'flesh',
  'cast lots': 'casting',
  chaste: 'holy',
  chasten: 'son',
  chastise: 'evil',
  cherubims: 'holy',
  cleave: 'heart',
  clothed: 'put',
  comely: 'holy',
  commend: 'commendeth',
  communed: 'said',
  concision: 'flesh',
  confound: 'devil',
  conscience: 'heart',
  convert: 'come',
  couch: 'rest',
  creeping: 'evil',
  cruel: 'evil',
  crucify: 'christ',
  cup: 'drink',
  curseth: 'evil',
  custom: 'word',
  'cut off': 'death',
  defiled: 'holy',
  deliver: 'saved',
  deliverance: 'saved',
  deny: 'evil',
  depart: 'go',
  despise: 'evil',
  devour: 'eat',
  diligence: 'patience',
  discreet: 'heart',
  dissimulation: 'evil',
  divers: 'all',
  doctrine: 'word',
  draught: 'eat',
  dross: 'evil',
  drunken: 'drink',
  dumb: 'word',
  durst: 'afraid',
  edify: 'brethren',
  elder: 'men',
  embrace: 'love',
  engender: 'flesh',
  envious: 'evil',
  epistle: 'word',
  err: 'evil',
  espoused: 'christ',
  esteem: 'heart',
  exhort: 'comfort',
  eyeservice: 'lord',
  'familiar spirit': 'spirit',
  fatlings: 'fat',
  fearfully: 'fear',
  fiends: 'devil',
  filthy: 'evil',
  firstborn: 'son',
  firstfruits: 'hope',
  flattery: 'evil',
  fleshly: 'flesh',
  fowls: 'eagles',
  frankincense: 'sweet',
  freewill: 'gift',
  gainsay: 'evil',
  gender: 'flesh',
  gentiles: 'world',
  gird: 'put',
  girdle: 'put',
  glean: 'eat',
  glede: 'eagles',
  harlot: 'evil',
  haste: 'patience',
  haughty: 'evil',
  hearken: 'word',
  heaviness: 'heavy',
  compass: 'compassed',
  meet: 'good',
  leasing: 'evil',
  mammon: 'world',
  reprobate: 'evil',
  lucre: 'evil',
  sundry: 'all',
  concupiscence: 'flesh',
  chambering: 'evil',
  riot: 'evil',
  discretion: 'understanding',
  sodden: 'eat',
  halting: 'walk',
  fetch: 'go',
  convenient: 'good',
  turtle: 'sweet',
  husbandman: 'lord',
  matrix: 'life',
  carefulness: 'careful',
  emulation: 'envieth',
  revellings: 'drink',
  variance: 'evil',
  talent: 'gift',
  penny: 'gift',
  cloak: 'put',
  napkin: 'put',
  publican: 'man',
  physician: 'saveth',
  strait: 'path'
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
  const note = cleanText(e.shortGloss || e.note);
  if (!w || !note) throw new Error('Entry needs w and note.');
  const conc = resolveConcordance(w, e.c);
  if (!concKeys.has(conc)) {
    console.warn('WARN: concordance key not in index —', w, '→', conc);
  }
  const row = {
    word: w,
    note: note,
    shortGloss: note,
    concordance: conc,
    examples: ex.slice(0, 5)
  };
  const howToRead = cleanText(e.howToRead || e.step);
  if (howToRead) {
    row.step = howToRead;
    row.howToRead = howToRead;
  }
  const srcWhy = cleanText(e.whyToday || e.why);
  if (srcWhy) {
    row.why = srcWhy;
    row.whyToday = srcWhy;
  } else if (existingWhyByWord.has(w)) {
    const prevWhy = existingWhyByWord.get(w);
    row.why = prevWhy;
    row.whyToday = prevWhy;
  }
  const deepDive = normalizeDeepDive(e.deepDive || DEEP_DIVE_SEEDS[w] || existingDeepByWord.get(w));
  if (deepDive) row.deepDive = deepDive;
  return row;
});

const payload = {
  version: 3,
  about:
    'KJV word helps: calm short glosses with optional deep-dive study fields. Hub concordance lists a growing subset of lemmas; each entry includes a concordance key for Search. See scripts/README-kjv-word-notes.md.',
  words: words
};

fs.writeFileSync(out, JSON.stringify(payload, null, 2) + '\n', 'utf8');
console.log('Wrote', out, '—', words.length, 'entries');
