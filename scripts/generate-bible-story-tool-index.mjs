#!/usr/bin/env node
/**
 * Builds kids/bible-story-tool-index.js — compact list for Bible Tool (search + breakdown-style fields).
 * Source: kids/kids-battle.js (bibleStories + STORY_THEMES).
 * Regenerate: npm run kids:generate-story-index
 */
import { readFileSync, writeFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const battlePath = join(root, 'kids', 'kids-battle.js');
const outPath = join(root, 'kids', 'bible-story-tool-index.js');

const s = readFileSync(battlePath, 'utf8');
const startTag = 'var bibleStories = {';
const endTag =
  '\n  };\n\n  /** Export stories before any init() so defer + sync-ready pages always have window.TDB_BIBLE_STORIES (Kids Corner, coloring, RPC helpers). */';
const si = s.indexOf(startTag);
const ei = s.indexOf(endTag);
if (si < 0 || ei < 0) {
  console.error('Could not locate bibleStories block in kids-battle.js');
  process.exit(1);
}
const bibleSlice = s.slice(si + startTag.length, ei);

const storyRe = /\n    ([a-zA-Z][a-zA-Z0-9_]*): \{\n      title:/g;
const rowStarts = [];
let m;
while ((m = storyRe.exec(bibleSlice))) {
  rowStarts.push({ key: m[1], idx: m.index });
}

function readQuoted(str, start) {
  const q = str[start];
  if (q !== "'" && q !== '"') return { text: '', end: start };
  let i = start + 1;
  let out = '';
  while (i < str.length) {
    const c = str[i];
    if (c === '\\') {
      i++;
      out += str[i] || '';
      i++;
      continue;
    }
    if (c === q) return { text: out, end: i + 1 };
    out += c;
    i++;
  }
  return { text: out, end: i };
}

function extractProp(chunk, name) {
  const re = new RegExp('\\b' + name + ':');
  const fm = chunk.match(re);
  if (!fm) return '';
  const pos = fm.index + fm[0].length;
  const rest = chunk.slice(pos).trimStart();
  const r = readQuoted(rest, 0);
  return r.text;
}

function parseTitle(chunk) {
  const m1 = chunk.match(/title:\s*'((?:\\'|[^'])*)'/);
  if (m1) return m1[1].replace(/\\'/g, "'").replace(/\\\\/g, '\\');
  const m2 = chunk.match(/title:\s*"((?:\\"|[^"])*)"/);
  if (m2) return m2[1].replace(/\\"/g, '"').replace(/\\\\/g, '\\');
  return '';
}

function parseKidContextBlock(chunk) {
  const i = chunk.indexOf('kidContext:');
  if (i < 0) return { who: '', to: '', apply: '' };
  let j = chunk.indexOf('{', i);
  if (j < 0) return { who: '', to: '', apply: '' };
  let depth = 0;
  let k = j;
  for (; k < chunk.length; k++) {
    if (chunk[k] === '{') depth++;
    else if (chunk[k] === '}') {
      depth--;
      if (depth === 0) {
        k++;
        break;
      }
    }
  }
  const inner = chunk.slice(j + 1, k - 1);
  return {
    who: extractProp(inner, 'who'),
    to: extractProp(inner, 'to'),
    apply: extractProp(inner, 'apply')
  };
}

function extractKjvRef(chunk) {
  return extractProp(chunk, 'kjvRef') || '';
}

function extractKeywords(chunk) {
  const m = chunk.match(/keywords:\s*\[([\s\S]*?)\]/);
  if (!m) return [];
  const inner = m[1];
  const out = [];
  const re = /'((?:\\.|[^'\\])*)'/g;
  let mm;
  while ((mm = re.exec(inner))) {
    out.push(mm[1].replace(/\\'/g, "'"));
  }
  return out;
}

/** Parse var STORY_THEMES = { ... }; before window.TDB_STORY_THEMES */
function parseStoryThemes(src) {
  const marker = 'var STORY_THEMES = {';
  const ts = src.indexOf(marker);
  if (ts < 0) return {};
  const te = src.indexOf(
    '\n  };\n\n  if (typeof window !== \'undefined\') {\n    window.TDB_STORY_THEMES = STORY_THEMES;',
    ts
  );
  if (te < 0) return {};
  const slice = src.slice(ts + marker.length, te);
  const map = {};
  const re = /\b([a-zA-Z][a-zA-Z0-9_]*):\s*'([^']+)'/g;
  let mm;
  while ((mm = re.exec(slice))) {
    map[mm[1]] = mm[2];
  }
  return map;
}

const themes = parseStoryThemes(s);
const byKey = new Map();
for (let i = 0; i < rowStarts.length; i++) {
  const { key, idx } = rowStarts[i];
  if (byKey.has(key)) continue;
  const end = i + 1 < rowStarts.length ? rowStarts[i + 1].idx : bibleSlice.length;
  byKey.set(key, bibleSlice.slice(idx, end));
}

const rows = [];
for (const [key, chunk] of byKey.entries()) {
  const title = parseTitle(chunk) || key;
  const kjvRef = extractKjvRef(chunk);
  const { who, to, apply } = parseKidContextBlock(chunk);
  const keywords = extractKeywords(chunk);
  rows.push({
    key,
    title,
    kjvRef,
    who,
    to,
    apply,
    theme: themes[key] || '',
    kw: keywords.join(' ')
  });
}

/** Legacy keys: same card as canonical story (matches read-quiz + deep links). */
const ALIAS_TO_CANON = [
  ['naaman', 'naamanHealed'],
  ['elishaOil', 'widowOil'],
  ['parableLostSheep', 'lostSheep'],
  ['marthaServe', 'maryMartha'],
  ['marySit', 'maryMartha'],
  ['jesusLazarus', 'lazarus'],
  ['healLeper', 'tenLepers']
];
for (let ai = 0; ai < ALIAS_TO_CANON.length; ai++) {
  const aliasKey = ALIAS_TO_CANON[ai][0];
  const canonKey = ALIAS_TO_CANON[ai][1];
  if (rows.some((r) => r.key === aliasKey)) continue;
  const canon = rows.find((r) => r.key === canonKey);
  if (!canon) continue;
  rows.push(Object.assign({}, canon, { key: aliasKey }));
}

rows.sort((a, b) => a.title.localeCompare(b.title, undefined, { sensitivity: 'base' }));

const header = `/**
 * Bible Tool — full Kids Bible Story Library index (titles, refs, Who/To/For you, theme).
 * Auto-generated from kids/kids-battle.js — do not edit by hand.
 * Regenerate: npm run kids:generate-story-index
 */
`;
const body =
  header +
  `(function (global) {
  'use strict';
  global.TDB_BIBLE_STORY_TOOL_INDEX = ${JSON.stringify(rows, null, 2)};
})(typeof window !== 'undefined' ? window : this);
`;

writeFileSync(outPath, body, 'utf8');
console.log('Wrote', outPath, '—', rows.length, 'stories');
