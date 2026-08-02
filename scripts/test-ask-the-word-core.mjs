#!/usr/bin/env node
/**
 * Smoke-test curated Ask the Word catalog (no browser).
 * Run: node scripts/test-ask-the-word-core.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const answers = JSON.parse(fs.readFileSync(path.join(root, 'data', 'ask-the-word-answers.json'), 'utf8'));

function normalize(q) {
  return String(q || '')
    .toLowerCase()
    .replace(/['']/g, "'")
    .replace(/[^\w\s':-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function scoreTrigger(norm, trigger) {
  const t = normalize(trigger);
  if (!t) return 0;
  if (norm === t) return 100;
  if (norm.includes(t)) return 80 + Math.min(t.length, 20);
  if (t.includes(norm) && norm.length >= 8) return 60;
  const nt = norm.split(/\s+/).filter((x) => x.length > 1);
  const tt = t.split(/\s+/).filter((x) => x.length > 1);
  let hit = 0;
  for (const w of tt) if (nt.includes(w)) hit++;
  if (hit === tt.length && tt.length >= 2) return 50 + hit;
  if (hit >= 2) return 20 + hit * 5;
  return 0;
}

function find(query) {
  const norm = normalize(query);
  let best = null;
  let bestScore = 0;
  for (const entry of answers) {
    for (const trig of entry.triggers || []) {
      const sc = scoreTrigger(norm, trig);
      if (sc > bestScore) {
        bestScore = sc;
        best = entry;
      }
    }
  }
  return best && bestScore >= 20 ? best : null;
}

const cases = [
  { q: 'Who was Ruth?', expectId: /ruth/i, expectRef: /Ruth/i },
  { q: 'What is grace?', expectId: /grace/i, expectRef: /Ephesians|Romans|Titus/i },
  { q: 'How do I forgive someone?', expectId: /forgiv/i, expectRef: /Ephesians|Colossians|Matthew/i },
  { q: 'Why did Jesus weep?', expectId: /weep/i, expectRef: /John 11/i },
  { q: 'What does the bible say about dinosaurs?', expectId: /dinosaur|creation/i, expectRef: /Genesis/i },
  { q: 'Who wrote Romans?', expectId: /romans|paul/i, expectRef: /Romans/i }
];

let failed = 0;
for (const c of cases) {
  const hit = find(c.q);
  const ok =
    hit &&
    c.expectId.test(hit.id || '') &&
    (hit.verses || []).some((v) => c.expectRef.test(v.ref || '')) &&
    (hit.verses || []).some((v) => (v.text || '').length > 5);
  if (!ok) {
    failed++;
    console.error('FAIL', c.q, hit && { id: hit.id, verses: (hit.verses || []).map((v) => v.ref) });
  } else {
    console.log('OK', c.q, '→', hit.id);
  }
}

// File presence
for (const f of [
  'ask-the-word-core.js',
  'ask-the-word.js',
  'learn-the-word.html',
  'data/ask-the-word-answers.json',
  'data/kjv-full.json',
  'supabase/functions/bible-qa/knowledge.json',
  'supabase/functions/bible-qa/index.ts'
]) {
  if (!fs.existsSync(path.join(root, f))) {
    console.error('MISSING', f);
    failed++;
  }
}

if (failed) {
  console.error('Failed checks:', failed);
  process.exit(1);
}
console.log('All Ask the Word smoke checks passed (' + answers.length + ' answers).');
