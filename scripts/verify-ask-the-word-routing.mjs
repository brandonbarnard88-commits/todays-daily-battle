#!/usr/bin/env node
/**
 * Verify Ask the Word routing: curated answers, universal Scripture frame, off-topic.
 * Loads helpers from script.js in a sandbox (no browser).
 *
 * Run: node scripts/verify-ask-the-word-routing.mjs
 */
import fs from 'fs';
import path from 'path';
import vm from 'vm';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const src = fs.readFileSync(path.join(root, 'script.js'), 'utf8');

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

function extractBlock(startNeedle, endFnName) {
  const start = src.indexOf(startNeedle);
  if (start === -1) throw new Error('Missing block start: ' + startNeedle);
  const fnStart = src.indexOf('function ' + endFnName + '(', start);
  if (fnStart === -1) throw new Error('Missing end function ' + endFnName);
  let depth = 0;
  let begun = false;
  for (let i = fnStart; i < src.length; i++) {
    const c = src[i];
    if (c === '{') {
      depth++;
      begun = true;
    } else if (c === '}') {
      depth--;
      if (begun && depth === 0) return src.slice(start, i + 1);
    }
  }
  throw new Error('Unclosed end function ' + endFnName);
}

const sandbox = {
  console,
  window: {},
  document: { body: null, querySelector: () => null, getElementById: () => null },
  location: { pathname: '/', hostname: 'localhost', search: '' },
  localStorage: { getItem: () => null, setItem: () => {}, removeItem: () => {} },
  navigator: { onLine: true },
  detectCrisisIntent: () => ({ active: false, variant: null }),
  parseReference: (q) => {
    const s = String(q || '').trim();
    if (/^john\s*3\s*:?\s*16$/i.test(s) || /^jn\s*3\s*:?\s*16$/i.test(s)) return 'John 3:16';
    if (/^[1-3]?\s*[A-Za-z]+\s+\d+:\d+/.test(s)) return s;
    return null;
  },
};
sandbox.globalThis = sandbox;
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
vm.runInNewContext(
  extractBlock('var ASK_THE_WORD_OFF_TOPIC_RE =', 'appendAskTheWordAnswerSection'),
  sandbox
);
vm.runInNewContext(extractFunction('findBiblicalAnswer'), sandbox);

let pass = 0;
let fail = 0;

function report(ok, line) {
  console.log((ok ? 'PASS  ' : 'FAIL  ') + line);
  if (ok) pass++;
  else fail++;
}

console.log('Ask the Word routing verification\n');

const typo = sandbox.applyBibleNameTypos('who is marry');
report(typo === 'who is mary', 'applyBibleNameTypos("who is marry") → ' + JSON.stringify(typo));

const curatedCases = [
  { q: 'who is marry', expectId: 'who-was-mary' },
  { q: 'who is mary', expectId: 'who-was-mary' },
  { q: 'who was mary in the bible', expectId: 'who-was-mary' },
  { q: 'tell me about mary', expectId: 'who-was-mary' },
  { q: 'who was peter', expectId: 'who-was-peter-apostle' },
  { q: 'who is jesus', expectId: 'who-was-jesus' },
  { q: 'tell me about jesus', expectId: 'who-was-jesus' },
  { q: 'who is god', expectId: 'who-is-god' },
  { q: 'what is the gospel', expectId: 'what-is-the-gospel' },
  { q: 'how can i be saved', expectId: 'assurance-salvation' },
  { q: 'what is repentance', expectId: 'what-is-repentance' },
  { q: 'what is sin', expectId: 'what-is-sin' },
  { q: 'what is prayer', softKnowledge: true },
];

for (const c of curatedCases) {
  const entry = sandbox.findBiblicalAnswer(c.q);
  const id = entry ? entry.id : 'null';
  const type = entry ? entry.type : '-';
  if (c.expectId) {
    report(!!(entry && entry.id === c.expectId), JSON.stringify(c.q) + ' → ' + id);
    continue;
  }
  if (c.softKnowledge) {
    report(!!(entry && entry.type === 'knowledge'), JSON.stringify(c.q) + ' → ' + id + ' (' + type + ') [knowledge]');
  }
}

// Classifier
const classCases = [
  { q: 'who invented pizza', expectKind: 'off_topic', offTopic: true },
  { q: 'best netflix movie', expectKind: 'off_topic', offTopic: true },
  { q: 'what does the bible say about patience', expectKind: 'say_about' },
  { q: 'why does god allow suffering', expectMode: 'closest_principles' },
  { q: 'John 3:16', expectKind: 'reference' },
  { q: 'anxiety', expectKind: 'topic' },
  { q: 'i feel anxious', expectKind: 'life' },
  { q: 'who is moses', expectKind: 'knowledge' },
];

for (const c of classCases) {
  const p = sandbox.classifyAskTheWordQuery(c.q);
  if (c.offTopic != null) {
    report(p.offTopic === c.offTopic && (!c.expectKind || p.kind === c.expectKind),
      'classify ' + JSON.stringify(c.q) + ' → kind=' + p.kind + ' offTopic=' + p.offTopic);
  } else if (c.expectMode) {
    report(p.answerMode === c.expectMode,
      'classify ' + JSON.stringify(c.q) + ' → mode=' + p.answerMode);
  } else {
    report(p.kind === c.expectKind,
      'classify ' + JSON.stringify(c.q) + ' → kind=' + p.kind);
  }
}

// Universal frame: no curated match, but verses exist
const obscureQ = 'what is a cubit in the bible';
report(!sandbox.findBiblicalAnswer(obscureQ),
  'obscure question has no curated id (uses universal frame) → ' +
    ((sandbox.findBiblicalAnswer(obscureQ) && sandbox.findBiblicalAnswer(obscureQ).id) || 'null'));
const uni = sandbox.buildUniversalScriptureAnswerEntry(obscureQ, {
  verses: [
    { ref: 'Genesis 6:15', text: '...' },
    { ref: 'Exodus 25:10', text: '...' },
  ],
});
report(!!(uni && uni.id && uni.id.indexOf('universal-') === 0 && /Scripture|KJV|verses|passages|question/i.test(uni.answer)),
  'universal frame builds answer for obscure Bible question → ' + (uni && uni.id));
report(!!(uni && Array.isArray(uni.verses) && uni.verses.length >= 2),
  'universal frame lists key verse refs');

const off = sandbox.buildUniversalScriptureAnswerEntry('pizza recipe tonight', { verses: [] });
report(!!(off && off.id === 'universal-off-topic' && /Scripture|feeling|verse/i.test(off.answer)),
  'off-topic gets honest Stay-with-the-Word frame');

const boosts = sandbox.getAskTheWordSearchBoostTerms('how can i be saved');
report(Array.isArray(boosts) && boosts.some((t) => /saved|salvation|believe|faith/i.test(t)),
  'search boost terms for salvation question → ' + JSON.stringify(boosts.slice(0, 6)));

// Wiring
const indexHtml = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const coreHome = fs.readFileSync(path.join(root, 'core-home.js'), 'utf8');
report(/Ask the Word/i.test(indexHtml), 'index.html mentions Ask the Word');
report(/id=["']feel-search["']/.test(indexHtml), 'index.html has feel-search input');
report(/appendAskTheWordAnswerSection\s*\(/.test(src), 'script.js wires appendAskTheWordAnswerSection');
report(/classifyAskTheWordQuery\s*\(/.test(src) && /buildUniversalScriptureAnswerEntry\s*\(/.test(src),
  'script.js has classifier + universal entry builder');
report(/script\.js\?v=20260802-ask-universal/.test(coreHome), 'core-home.js cache-busts ask-universal script');

console.log('\n---');
console.log('Passed:', pass);
console.log('Failed:', fail);
if (fail > 0) process.exit(1);
console.log('\nAsk the Word curated + universal routing looks healthy.');
