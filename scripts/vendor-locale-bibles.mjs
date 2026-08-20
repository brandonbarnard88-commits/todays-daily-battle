#!/usr/bin/env node
/**
 * Download public-domain Bibles and flatten to the same key shape as data/kjv-full.json
 * so today’s official UTC ref can be looked up in each language.
 *
 *   node scripts/vendor-locale-bibles.mjs
 *
 * RV 1960 is not public domain. Spanish uses Reina-Valera 1909.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { LOCALE_BIBLES, localeBibleDir } from './lib/locale-bible.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const outDir = localeBibleDir(root);

const BOOK_ID_TO_KJV = {
  GEN: 'Genesis',
  EXO: 'Exodus',
  LEV: 'Leviticus',
  NUM: 'Numbers',
  DEU: 'Deuteronomy',
  JOS: 'Joshua',
  JDG: 'Judges',
  RUT: 'Ruth',
  '1SA': '1 Samuel',
  '2SA': '2 Samuel',
  '1KI': '1 Kings',
  '2KI': '2 Kings',
  '1CH': '1 Chronicles',
  '2CH': '2 Chronicles',
  EZR: 'Ezra',
  NEH: 'Nehemiah',
  EST: 'Esther',
  JOB: 'Job',
  PSA: 'Psalms',
  PRO: 'Proverbs',
  ECC: 'Ecclesiastes',
  SNG: 'Song of Solomon',
  ISA: 'Isaiah',
  JER: 'Jeremiah',
  LAM: 'Lamentations',
  EZK: 'Ezekiel',
  DAN: 'Daniel',
  HOS: 'Hosea',
  JOL: 'Joel',
  AMO: 'Amos',
  OBA: 'Obadiah',
  JON: 'Jonah',
  MIC: 'Micah',
  NAM: 'Nahum',
  HAB: 'Habakkuk',
  ZEP: 'Zephaniah',
  HAG: 'Haggai',
  ZEC: 'Zechariah',
  MAL: 'Malachi',
  MAT: 'Matthew',
  MRK: 'Mark',
  LUK: 'Luke',
  JHN: 'John',
  ACT: 'Acts',
  ROM: 'Romans',
  '1CO': '1 Corinthians',
  '2CO': '2 Corinthians',
  GAL: 'Galatians',
  EPH: 'Ephesians',
  PHP: 'Philippians',
  COL: 'Colossians',
  '1TH': '1 Thessalonians',
  '2TH': '2 Thessalonians',
  '1TI': '1 Timothy',
  '2TI': '2 Timothy',
  TIT: 'Titus',
  PHM: 'Philemon',
  HEB: 'Hebrews',
  JAS: 'James',
  '1PE': '1 Peter',
  '2PE': '2 Peter',
  '1JN': '1 John',
  '2JN': '2 John',
  '3JN': '3 John',
  JUD: 'Jude',
  REV: 'Revelation'
};

const KJV_BOOK_ORDER = [
  'Genesis',
  'Exodus',
  'Leviticus',
  'Numbers',
  'Deuteronomy',
  'Joshua',
  'Judges',
  'Ruth',
  '1 Samuel',
  '2 Samuel',
  '1 Kings',
  '2 Kings',
  '1 Chronicles',
  '2 Chronicles',
  'Ezra',
  'Nehemiah',
  'Esther',
  'Job',
  'Psalms',
  'Proverbs',
  'Ecclesiastes',
  'Song of Solomon',
  'Isaiah',
  'Jeremiah',
  'Lamentations',
  'Ezekiel',
  'Daniel',
  'Hosea',
  'Joel',
  'Amos',
  'Obadiah',
  'Jonah',
  'Micah',
  'Nahum',
  'Habakkuk',
  'Zephaniah',
  'Haggai',
  'Zechariah',
  'Malachi',
  'Matthew',
  'Mark',
  'Luke',
  'John',
  'Acts',
  'Romans',
  '1 Corinthians',
  '2 Corinthians',
  'Galatians',
  'Ephesians',
  'Philippians',
  'Colossians',
  '1 Thessalonians',
  '2 Thessalonians',
  '1 Timothy',
  '2 Timothy',
  'Titus',
  'Philemon',
  'Hebrews',
  'James',
  '1 Peter',
  '2 Peter',
  '1 John',
  '2 John',
  '3 John',
  'Jude',
  'Revelation'
];

function fail(msg) {
  console.error('vendor-locale-bibles:', msg);
  process.exit(1);
}

function cleanText(s) {
  return String(s || '')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/^(Salmo|Psaume|Psalm)\.?\s+/i, '')
    .trim();
}

async function fetchJson(url) {
  const res = await fetch(url, {
    headers: { 'User-Agent': 'todaysdailybattle-locale-bibles/1.0' }
  });
  if (!res.ok) throw new Error(url + ' → ' + res.status);
  return res.json();
}

function flattenHelloaoSimple(complete) {
  const map = Object.create(null);
  const books = Array.isArray(complete.books) ? complete.books : [];
  for (const book of books) {
    const kjvName = BOOK_ID_TO_KJV[book.id];
    if (!kjvName) continue;
    const chapters = Array.isArray(book.chapters) ? book.chapters : [];
    for (const chWrap of chapters) {
      const ch = chWrap && chWrap.chapter ? chWrap.chapter : chWrap;
      const num = Number(ch && ch.number);
      const content = (ch && ch.content) || [];
      for (const piece of content) {
        if (!piece || piece.type !== 'verse') continue;
        const v = Number(piece.number);
        const text = cleanText(piece.text);
        if (!num || !v || !text) continue;
        map[kjvName + ' ' + num + ':' + v] = text;
      }
    }
  }
  return map;
}

function flattenGetbible(data) {
  const map = Object.create(null);
  const books = Array.isArray(data.books) ? data.books : [];
  for (const book of books) {
    const kjvName = KJV_BOOK_ORDER[Number(book.nr) - 1];
    if (!kjvName) continue;
    const chapters = Array.isArray(book.chapters) ? book.chapters : [];
    for (const ch of chapters) {
      const num = Number(ch.chapter);
      const verses = Array.isArray(ch.verses) ? ch.verses : [];
      for (const verse of verses) {
        const v = Number(verse.verse);
        const text = cleanText(verse.text);
        if (!num || !v || !text) continue;
        map[kjvName + ' ' + num + ':' + v] = text;
      }
    }
  }
  return map;
}

async function vendorOne(spec) {
  let map;
  if (spec.kind === 'getbible') {
    console.log('fetch getbible', spec.id);
    const data = await fetchJson('https://api.getbible.net/v2/' + spec.id + '.json');
    map = flattenGetbible(data);
  } else {
    const url = 'https://bible.helloao.org/api/' + spec.id + '/complete.simple.json';
    console.log('fetch helloao', spec.id);
    const data = await fetchJson(url);
    map = flattenHelloaoSimple(data);
  }
  const n = Object.keys(map).length;
  if (n < 30000) fail(spec.file + ' only has ' + n + ' verses');
  const must = ['Psalms 98:1', 'Hebrews 12:2', 'Genesis 1:1', 'John 3:16'];
  must.forEach((ref) => {
    if (!map[ref]) fail(spec.file + ' missing ' + ref);
  });
  fs.writeFileSync(path.join(outDir, spec.file), JSON.stringify(map) + '\n', 'utf8');
  console.log('wrote', spec.file, n, 'verses');
  return n;
}

async function main() {
  fs.mkdirSync(outDir, { recursive: true });
  const force = process.argv.includes('--force');
  const counts = {};
  for (const spec of Object.values(LOCALE_BIBLES)) {
    const dest = path.join(outDir, spec.file);
    if (!force && fs.existsSync(dest)) {
      counts[spec.lang] = Object.keys(JSON.parse(fs.readFileSync(dest, 'utf8'))).length;
      console.log('keep', spec.file, counts[spec.lang], 'verses');
      continue;
    }
    counts[spec.lang] = await vendorOne(spec);
  }
  const meta = {
    generated: new Date().toISOString().slice(0, 10),
    note: 'Flattened public-domain Bibles keyed like data/kjv-full.json. Official English line stays KJV. RV 1960 is not included (not public domain).',
    bibles: Object.values(LOCALE_BIBLES).map((spec) => ({
      ...spec,
      verses: counts[spec.lang]
    }))
  };
  fs.writeFileSync(path.join(outDir, 'meta.json'), JSON.stringify(meta, null, 2) + '\n', 'utf8');
  console.log('vendor-locale-bibles: OK', counts);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
