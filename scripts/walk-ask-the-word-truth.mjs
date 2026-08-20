#!/usr/bin/env node
/**
 * Double-check Ask the Word the way a person uses it:
 * example chips, who-was questions, verse lookups, feelings, tricks.
 * A curated answer must keep its own verses — never leftover comfort cards.
 *
 *   node scripts/walk-ask-the-word-truth.mjs
 */
import fs from 'fs';
import path from 'path';
import vm from 'vm';
import { fileURLToPath } from 'url';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const src = fs.readFileSync(path.join(root, 'script.js'), 'utf8');
const failures = [];
function fail(msg) {
  failures.push(msg);
}

const LEFTOVER_PACK = new Set([
  'Psalm 34:18',
  'Isaiah 41:10',
  'Matthew 11:28',
  'Jeremiah 29:11',
  'Psalm 23:4',
  'Romans 8:28',
  'Philippians 4:6-7',
  'Psalm 147:3'
]);

function extractFunction(name) {
  const start = src.indexOf('function ' + name + '(');
  if (start === -1) throw new Error('Missing function ' + name);
  let depth = 0;
  let begun = false;
  for (let i = start; i < src.length; i++) {
    const c = src[i];
    if (c === '{') {
      depth++;
      begun = true;
    } else if (c === '}') {
      depth--;
      if (begun && depth === 0) return src.slice(start, i + 1);
    }
  }
  throw new Error('Unclosed function ' + name);
}

function extractArrayAssignment(needle) {
  const start = src.indexOf(needle);
  if (start === -1) throw new Error('Missing ' + needle);
  let depth = 0;
  let begun = false;
  for (let i = start; i < src.length; i++) {
    const c = src[i];
    if (c === '[') {
      depth++;
      begun = true;
    } else if (c === ']') {
      depth--;
      if (begun && depth === 0) {
        let end = i + 1;
        if (src[end] === ';') end++;
        return src.slice(start, end);
      }
    }
  }
  throw new Error('Unclosed array ' + needle);
}

function extractObjectAssignment(needle) {
  const start = src.indexOf(needle);
  if (start === -1) throw new Error('Missing ' + needle);
  let depth = 0;
  let begun = false;
  for (let i = start; i < src.length; i++) {
    const c = src[i];
    if (c === '{') {
      depth++;
      begun = true;
    } else if (c === '}') {
      depth--;
      if (begun && depth === 0) {
        let end = i + 1;
        if (src[end] === ';') end++;
        return src.slice(start, end);
      }
    }
  }
  throw new Error('Unclosed object ' + needle);
}

const sandbox = {
  console,
  window: {},
  document: { body: null, querySelector: () => null, getElementById: () => null },
  location: { pathname: '/', hostname: 'localhost', search: '' },
  localStorage: { getItem: () => null, setItem: () => {}, removeItem: () => {} },
  navigator: { onLine: true },
  detectCrisisIntent: () => ({ active: false, variant: null }),
  bible: {},
  getBibleVerseText: () => '',
  resolveBibleTextFromMap: () => ''
};
sandbox.globalThis = sandbox;
sandbox.window = sandbox;
sandbox.self = sandbox;

const stopMatch = src.match(/const STOP_WORDS = new Set\(\[([\s\S]*?)\]\);/);
if (!stopMatch) throw new Error('STOP_WORDS missing');
sandbox.STOP_WORDS = new Set(
  stopMatch[1]
    .split(',')
    .map((x) => x.trim().replace(/^['"]|['"]$/g, ''))
    .filter(Boolean)
);

vm.runInNewContext(extractFunction('normalizeInput'), sandbox);
vm.runInNewContext(extractObjectAssignment('var TDB_BIBLE_NAME_TYPOS ='), sandbox);
vm.runInNewContext(extractFunction('applyBibleNameTypos'), sandbox);
vm.runInNewContext(extractArrayAssignment('var TDB_BIBLICAL_ANSWERS = ['), sandbox);
vm.runInNewContext(extractFunction('findBiblicalAnswer'), sandbox);
vm.runInNewContext(extractFunction('resolveSearchVerseText'), sandbox);
vm.runInNewContext(extractFunction('applyCuratedAnswerToSearchResults'), sandbox);
vm.runInNewContext(extractFunction('queryIsSpecificAsk'), sandbox);

if (!src.includes('applyCuratedAnswerToSearchResults(searchResults, input)')) {
  fail('homepage search must apply curated verses before render');
}
if (!src.includes('usedCuratedKnowledge') || !/!specificAsk/.test(src)) {
  fail('who/what questions must not pad leftover DEFAULT_VERSES');
}

const leftoverResults = {
  verses: [
    { ref: 'Jeremiah 29:11', text: 'plans' },
    { ref: 'Ephesians 2:10', text: 'work' },
    { ref: 'Proverbs 3:5', text: 'trust' }
  ],
  usedDefaultVerses: true
};
sandbox.applyCuratedAnswerToSearchResults(leftoverResults, 'Who was Ruth?');
const ruthRefs = leftoverResults.verses.map((v) => v.ref);
if (ruthRefs[0] !== 'Ruth 1:16') {
  fail('Who was Ruth? still starts with leftover ' + ruthRefs[0]);
}
if (ruthRefs.some((r) => LEFTOVER_PACK.has(r))) {
  fail('Who was Ruth? still includes leftover pack verses: ' + ruthRefs.join(', '));
}

const examples = [
  { q: 'How do I forgive someone?', expectId: /forgiv/i, expectRef: /Ephesians|Colossians|Matthew|Luke/i },
  { q: 'Does God still want me?', expectId: /love|want|saved|grace|assurance/i, expectRef: /John|Romans|Ephesians|Psalm/i },
  { q: 'Why am I so tired?', expectId: /tired|weary|exhaust|rest/i, expectRef: /Matthew|Isaiah|Psalm|Kings|1 Kings/i },
  { q: 'Who was Ruth?', expectId: /ruth/i, expectRef: /^Ruth /i }
];

examples.forEach((c) => {
  const hit = sandbox.findBiblicalAnswer(c.q);
  if (!hit || !c.expectId.test(hit.id || '')) {
    fail('example "' + c.q + '" routed to ' + (hit && hit.id));
    return;
  }
  const fake = { verses: [{ ref: 'Jeremiah 29:11', text: 'x' }] };
  sandbox.applyCuratedAnswerToSearchResults(fake, c.q);
  const refs = (fake.verses || []).map((v) => v.ref);
  if (!refs.some((r) => c.expectRef.test(r))) {
    fail('example "' + c.q + '" verses after bind: ' + refs.join(', '));
  }
  if (c.q === 'Who was Ruth?' && refs.some((r) => LEFTOVER_PACK.has(r))) {
    fail('example Ruth picked leftover pack');
  }
});

const seenIds = {};
const knowledge = (sandbox.TDB_BIBLICAL_ANSWERS || []).filter((e) => {
  if (!e || e.type !== 'knowledge' || !/who-was-|who-is-/.test(e.id || '')) return false;
  if (seenIds[e.id]) return false;
  seenIds[e.id] = true;
  return true;
});
let checked = 0;
knowledge.forEach((entry) => {
  const trig = (entry.triggers || []).find((t) => /^who (was|is)\b/i.test(t)) || (entry.triggers || [])[0];
  if (!trig) return;
  const hit = sandbox.findBiblicalAnswer(trig);
  if (!hit) {
    fail('knowledge trigger unmatched: ' + trig);
    return;
  }
  const fake = {
    verses: [
      { ref: 'Jeremiah 29:11', text: 'x' },
      { ref: 'Psalm 23:4', text: 'y' }
    ]
  };
  sandbox.applyCuratedAnswerToSearchResults(fake, trig);
  const refs = (fake.verses || []).map((v) => v.ref);
  const expected = (hit.verses || []).map((v) => (typeof v === 'string' ? v : v.ref));
  const leftover = refs.filter((r) => LEFTOVER_PACK.has(r) && expected.indexOf(r) === -1);
  if (leftover.length) {
    fail(hit.id + ' kept leftover ' + leftover.join(', ') + ' for "' + trig + '"');
  }
  if (expected[0] && refs[0] !== expected[0]) {
    fail(hit.id + ' first verse is ' + refs[0] + ' not ' + expected[0] + ' for "' + trig + '"');
  }
  checked += 1;
});
if (checked < 20) fail('expected to walk many who-was entries, only ' + checked);

const core = fs.readFileSync(path.join(root, 'ask-the-word-core.js'), 'utf8');
const answers = JSON.parse(fs.readFileSync(path.join(root, 'data', 'ask-the-word-answers.json'), 'utf8'));
const kjv = JSON.parse(fs.readFileSync(path.join(root, 'data', 'kjv-full.json'), 'utf8'));
const coreBox = {
  console,
  fetch: async (url) => {
    const u = String(url || '');
    if (u.includes('ask-the-word-answers')) return { ok: true, json: async () => answers };
    if (u.includes('kjv')) return { ok: true, json: async () => kjv };
    return { ok: false, json: async () => null };
  }
};
coreBox.window = coreBox;
coreBox.globalThis = coreBox;
vm.runInNewContext(core, coreBox, { filename: 'ask-the-word-core.js' });
await coreBox.TDBAskTheWord.prefetch();

const tricks = [
  'What stock should I buy?',
  'pineapple pizza recipe',
  'javascript:alert(1)'
];
for (const q of tricks) {
  const res = await coreBox.TDBAskTheWord.answer(q);
  if (res.from !== 'off_topic') fail('trick "' + q + '" from=' + res.from);
}

const john = await coreBox.TDBAskTheWord.answer('john 3 16');
const johnRefs = (john.verses || []).map((v) => v.ref).join(' ');
if (!/John 3:16/i.test(johnRefs)) fail('john 3 16 core verses: ' + johnRefs);

if (failures.length) {
  console.error('Ask the Word truth walk FAIL — ' + failures.length + ' issue(s):\n');
  failures.forEach((f) => console.error(' • ' + f));
  process.exit(1);
}
console.log(
  'Ask the Word truth walk PASS: homepage examples, ' +
    checked +
    ' who-was entries, leftover pack banned, tricks stay off-topic.'
);
