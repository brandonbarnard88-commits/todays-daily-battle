#!/usr/bin/env node
/**
 * Reorder unpublished hero days so consecutive days are not the same chapter.
 * Frozen through yesterday (UTC). Year 1 remaining and year 2 stay their own sets.
 *
 * Run from repo root: node scripts/separate-hero-adjacent-chapters.mjs
 * Then: node scripts/inject-home-hero.mjs (and porch/locale injects as usual)
 */
import fs from 'fs';
import path from 'path';
import vm from 'vm';
import { execFileSync } from 'child_process';
import { fileURLToPath } from 'url';
import { loadYear365, utcDaysSinceHeroEpoch } from './lib/hero-daily-verse-pick.mjs';
import { breakAdjacentSameChapter, adjacentSameChapterPairs } from './lib/hero-calendar-spread.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const kidsPath = path.join(root, 'kids', 'kids-verses-365.js');
const year2Path = path.join(root, 'data', 'hero-year2.json');
const explPath = path.join(root, 'hero-daily-365-explanations.js');

function extractBracketArray(src, needle) {
  const idx = src.indexOf(needle);
  if (idx === -1) return null;
  let i = idx + needle.length;
  while (i < src.length && /\s/.test(src[i])) i += 1;
  if (src[i] !== '[') return null;
  let depth = 0;
  const start = i;
  for (; i < src.length; i += 1) {
    if (src[i] === '[') depth += 1;
    else if (src[i] === ']') {
      depth -= 1;
      if (depth === 0) return { start, end: i + 1, raw: src.slice(start, i + 1) };
    }
  }
  return null;
}

function normRef(ref) {
  return String(ref || '')
    .replace(/\s+/g, ' ')
    .replace(/^Psalms\s+/i, 'Psalm ')
    .replace(/\s*\(KJV\)\s*$/i, '')
    .trim();
}

function writeKids(arr) {
  const src = fs.readFileSync(kidsPath, 'utf8');
  const extracted = extractBracketArray(src, '__TDB_KIDS_VERSES_365 = ');
  if (!extracted) throw new Error('Could not parse __TDB_KIDS_VERSES_365');
  const lines = arr
    .map((v) => {
      return `  { ref: ${JSON.stringify(v.ref)}, text: ${JSON.stringify(v.text)} }`;
    })
    .join(',\n');
  const nextSrc = src.slice(0, extracted.start) + '[\n' + lines + '\n  ]' + src.slice(extracted.end);
  fs.writeFileSync(kidsPath, nextSrc, 'utf8');
}

function loadExplanations() {
  const code = fs.readFileSync(explPath, 'utf8');
  const sandbox = { console };
  sandbox.window = sandbox;
  sandbox.globalThis = sandbox;
  vm.runInNewContext(code, sandbox, { filename: 'hero-daily-365-explanations.js' });
  const list = sandbox.__TDB_HERO_DAILY_EXPLANATIONS;
  if (!Array.isArray(list) || !list.length) {
    throw new Error('hero-daily-365-explanations.js missing list');
  }
  return { code, list };
}

function writeExplanations(code, ordered) {
  const extracted = extractBracketArray(code, '__TDB_HERO_DAILY_EXPLANATIONS = ');
  if (!extracted) throw new Error('Could not parse __TDB_HERO_DAILY_EXPLANATIONS');
  const next =
    code.slice(0, extracted.start) + JSON.stringify(ordered, null, 2) + code.slice(extracted.end);
  fs.writeFileSync(explPath, next, 'utf8');
}

function main() {
  const queue = loadYear365(root);
  if (queue.length !== 730) {
    throw new Error('Expected 730-day queue, got ' + queue.length);
  }
  const from = utcDaysSinceHeroEpoch();
  if (from < 0 || from >= queue.length) {
    throw new Error('separate-hero-adjacent-chapters: fromIndex ' + from + ' is outside the queue');
  }

  let next = queue;
  if (from < 365) {
    next = breakAdjacentSameChapter(next, from, 365);
    next = breakAdjacentSameChapter(next, 365, 730);
  } else {
    next = breakAdjacentSameChapter(next, from, 730);
  }

  const pastOk = next.slice(0, from).every((v, i) => v.ref === queue[i].ref);
  if (!pastOk) throw new Error('Past days changed — aborting');

  const year1Set = (a) => a.slice(0, 365).map((v) => v.ref).slice().sort().join('\n');
  const year2Set = (a) => a.slice(365).map((v) => v.ref).slice().sort().join('\n');
  if (year1Set(next) !== year1Set(queue)) throw new Error('Year 1 verse set changed');
  if (year2Set(next) !== year2Set(queue)) throw new Error('Year 2 verse set changed');

  const leftover = adjacentSameChapterPairs(next, from);
  if (leftover.length) {
    throw new Error(
      'Still have same-chapter days: ' + leftover.slice(0, 8).map((p) => p.prev + ' → ' + p.next).join('; ')
    );
  }

  writeKids(next.slice(0, 365));

  if (fs.existsSync(year2Path)) {
    const year2 = JSON.parse(fs.readFileSync(year2Path, 'utf8'));
    const byRef = Object.create(null);
    for (const row of year2) {
      if (row && row.ref) byRef[normRef(row.ref)] = row;
    }
    const orderedYear2 = next.slice(365).map((v) => {
      const row = byRef[normRef(v.ref)];
      if (!row) throw new Error('Year 2 missing row for ' + v.ref);
      return row;
    });
    fs.writeFileSync(year2Path, JSON.stringify(orderedYear2, null, 2) + '\n', 'utf8');
  }

  execFileSync(process.execPath, [path.join(__dirname, 'sync-hero-365-from-kids.mjs')], {
    cwd: root,
    stdio: 'inherit'
  });

  const { code, list } = loadExplanations();
  const explByRef = Object.create(null);
  for (const row of list) {
    if (row && row.ref) explByRef[normRef(row.ref)] = row;
  }
  const orderedExpl = next.map((v) => {
    const row = explByRef[normRef(v.ref)];
    if (!row) throw new Error('Missing explanation for ' + v.ref);
    return row;
  });
  writeExplanations(code, orderedExpl);

  console.log(
    'separate-hero-adjacent-chapters: froze through yesterday UTC (index ' +
      (from - 1) +
      ', ' +
      (next[from - 1] && next[from - 1].ref) +
      ')'
  );
  console.log('  today:', next[from].ref);
  console.log('  tomorrow:', next[from + 1] && next[from + 1].ref);
  console.log('  same-chapter pairs from today: 0');
}

main();
