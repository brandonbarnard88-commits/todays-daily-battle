#!/usr/bin/env node
/**
 * Part A + Part B — Crisis help detector, Wave 1 pastoral answers, wiring checks.
 * Run: node scripts/verify-crisis-help.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import vm from 'vm';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const scriptPath = path.join(root, 'script.js');
const cssPath = path.join(root, 'styles.css');

const src = fs.readFileSync(scriptPath, 'utf8');
const css = fs.readFileSync(cssPath, 'utf8');

const requiredFns = [
  'function detectCrisisIntent',
  'function buildCrisisHelpSection',
  'function prependCrisisHelpIfNeeded',
  'function ensureCrisisHelpForSelfCrisis',
  'function appendBiblicalAnswerSection',
];
for (const fn of requiredFns) {
  if (!src.includes(fn)) {
    console.error('FAIL missing', fn);
    process.exit(1);
  }
}

if (!src.includes('prependCrisisHelpIfNeeded(shell, queryText, true)')) {
  console.error('FAIL home search path missing crisis prepend');
  process.exit(1);
}
if (!src.includes('prependCrisisHelpIfNeeded(output, queryText, false)')) {
  console.error('FAIL tool search path missing crisis prepend');
  process.exit(1);
}
if (!src.includes('appendBiblicalAnswerSection(shell, queryText, true)')) {
  console.error('FAIL home path missing appendBiblicalAnswerSection');
  process.exit(1);
}
if (!src.includes('appendBiblicalAnswerSection(output, queryText, false)')) {
  console.error('FAIL tool path missing appendBiblicalAnswerSection');
  process.exit(1);
}
if (!src.includes("entry.id === 'suicidal-despair' || entry.id === 'self-harm'")) {
  console.error('FAIL suicidal-despair/self-harm crisis guard missing');
  process.exit(1);
}

const waveIds = [
  'suicidal-despair',
  'self-harm',
  'affair-adultery',
  'abortion-grief',
  'cancer-terminal',
  'controlling-abusive-spouse',
  'dementia-caregiving',
  'empty-nest',
  'eating-disorder',
  'panic-attacks',
  'family-estrangement',
  'special-needs-parenting',
  'housing-eviction',
  'remarriage-after-divorce',
];
for (const id of waveIds) {
  if (!src.includes("id: '" + id + "'")) {
    console.error('FAIL missing Wave answer', id);
    process.exit(1);
  }
}

// Wave 2/3/4 strengthen markers
const strengthenMarkers = [
  'god hates me',
  'i was raped',
  'why wont god heal me',
  'died suddenly',
  'i hate myself',
  'should i leave this church',
  'perfectionism bible',
];
for (const marker of strengthenMarkers) {
  if (!src.includes(marker)) {
    console.error('FAIL missing strengthen marker', marker);
    process.exit(1);
  }
}

for (const cls of [
  '.tdb-crisis-block',
  '.tdb-crisis-block__primary',
  '.tdb-crisis-block__whisper',
]) {
  if (!css.includes(cls)) {
    console.error('FAIL missing CSS', cls);
    process.exit(1);
  }
}

// Extract detector function body via Function constructor (standalone).
const start = src.indexOf('function detectCrisisIntent(queryText)');
const end = src.indexOf('function buildCrisisHelpSection', start);
if (start < 0 || end < 0) {
  console.error('FAIL could not slice detectCrisisIntent');
  process.exit(1);
}
const slice = src.slice(start, end);
const sandbox = {
  normalizeInput: function (s) {
    return String(s || '')
      .toLowerCase()
      .replace(/['\u2019]/g, "'")
      .replace(/\s+/g, ' ')
      .trim();
  },
  console,
};
vm.createContext(sandbox);
vm.runInContext(slice + '\nthis.detectCrisisIntent = detectCrisisIntent;', sandbox);
const detect = sandbox.detectCrisisIntent;

const shouldSelf = [
  'i want to die',
  'I want to kill myself',
  'feeling suicidal',
  'self harm',
  'hurting myself',
  'end it all',
  "i don't want to live",
  'better off dead',
];
const shouldOthers = [
  'i want to hurt someone',
  'i want to kill someone',
  "i'm going to hurt my wife",
  'i am going to kill someone',
];
const shouldNot = [
  'i feel hopeless',
  "i can't go on",
  'i am depressed',
  'david killed goliath',
  'what does the bible say about suicide',
  'someone i love died by suicide',
  'cain killed abel',
  'saul is going to kill david',
];

let fails = 0;
function expect(q, active, variant) {
  const got = detect(q);
  const ok = !!got.active === !!active && (!active || got.variant === variant);
  if (!ok) {
    console.error('FAIL', JSON.stringify(q), 'expected', { active, variant }, 'got', got);
    fails += 1;
  }
}

for (const q of shouldSelf) expect(q, true, 'self');
for (const q of shouldOthers) expect(q, true, 'others');
for (const q of shouldNot) expect(q, false, null);

if (fails) {
  console.error(fails + ' crisis detector failure(s).');
  process.exit(1);
}

console.log('OK   crisis help detector + Wave 1-4 wiring (scripts/verify-crisis-help.mjs)');
