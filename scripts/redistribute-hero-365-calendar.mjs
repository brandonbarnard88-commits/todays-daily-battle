#!/usr/bin/env node
/**
 * Reorder kids/kids-verses-365.js so the UTC day-of-year calendar does not stack
 * long same-book streaks (especially Psalms). Same 365 unique verses; new order only.
 *
 * Then run: node scripts/sync-hero-365-from-kids.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const srcPath = path.join(root, 'kids', 'kids-verses-365.js');

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

function bookOf(ref) {
  return String(ref || '')
    .replace(/\s+\d+:[\s\S]*$/, '')
    .trim();
}

function isPsalm(ref) {
  return /^Psalms?\b/i.test(bookOf(ref));
}

/** Round-robin across books so adjacent non-Psalm days still change books. */
function roundRobinByBook(items) {
  const byBook = new Map();
  for (const v of items) {
    const b = bookOf(v.ref);
    if (!byBook.has(b)) byBook.set(b, []);
    byBook.get(b).push(v);
  }
  const queues = [...byBook.entries()]
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([, q]) => q.slice());
  const out = [];
  while (out.length < items.length) {
    let progressed = false;
    for (const q of queues) {
      if (q.length) {
        out.push(q.shift());
        progressed = true;
      }
    }
    if (!progressed) break;
  }
  return out;
}

/** Place `others.length` minority items evenly across `n` slots (Bresenham-style). */
function redistribute(arr) {
  const n = arr.length;
  const psalms = arr.filter((v) => isPsalm(v.ref));
  let others = roundRobinByBook(arr.filter((v) => !isPsalm(v.ref)));

  // Keep a strong, familiar opener on day 1 when present.
  const openerRef = 'Philippians 4:13';
  const openerIdx = others.findIndex((v) => v.ref === openerRef);
  let opener = null;
  if (openerIdx >= 0) {
    opener = others.splice(openerIdx, 1)[0];
  }

  const slots = opener ? n - 1 : n;
  const o = others.length;
  const rest = new Array(slots);
  let oi = 0;
  let pi = 0;
  for (let i = 0; i < slots; i += 1) {
    const takeOther =
      o > 0 &&
      oi < o &&
      (pi >= psalms.length || Math.floor(((i + 1) * o) / slots) > Math.floor((i * o) / slots));
    if (takeOther) rest[i] = others[oi++];
    else rest[i] = psalms[pi++];
  }
  if (oi !== o || pi !== psalms.length) {
    throw new Error(`redistribute mismatch: others ${oi}/${o}, psalms ${pi}/${psalms.length}`);
  }
  return opener ? [opener, ...rest] : rest;
}

function maxSameBookStreak(arr) {
  let max = 1;
  let cur = 1;
  for (let i = 1; i < arr.length; i += 1) {
    if (bookOf(arr[i].ref) === bookOf(arr[i - 1].ref)) {
      cur += 1;
      if (cur > max) max = cur;
    } else cur = 1;
  }
  return max;
}

function main() {
  const src = fs.readFileSync(srcPath, 'utf8');
  const extracted = extractBracketArray(src, '__TDB_KIDS_VERSES_365 = ');
  if (!extracted) throw new Error('Could not parse __TDB_KIDS_VERSES_365');
  const arr = new Function('return ' + extracted.raw)();
  if (!Array.isArray(arr) || arr.length !== 365) {
    throw new Error('Expected 365 verses, got ' + (arr && arr.length));
  }
  const beforeMax = maxSameBookStreak(arr);
  const beforeOrder = arr.map((v) => v.ref).join('\n');
  const next = redistribute(arr);
  const afterRefs = next.map((v) => v.ref).sort().join('\n');
  const beforeSorted = arr.map((v) => v.ref).sort().join('\n');
  if (afterRefs !== beforeSorted) {
    throw new Error('Verse set changed — aborting (reorder must keep the same refs)');
  }
  const afterMax = maxSameBookStreak(next);
  const lines = next
    .map((v) => {
      const text = JSON.stringify(v.text);
      return `  { ref: ${JSON.stringify(v.ref)}, text: ${text} }`;
    })
    .join(',\n');
  const nextSrc = src.slice(0, extracted.start) + '[\n' + lines + '\n  ]' + src.slice(extracted.end);
  fs.writeFileSync(srcPath, nextSrc, 'utf8');
  console.log('redistribute-hero-365-calendar: wrote', path.relative(root, srcPath));
  console.log('  max same-book streak:', beforeMax, '→', afterMax);
  console.log('  day 1:', next[0].ref);
  console.log('  day 214:', next[213].ref);
  if (beforeOrder === next.map((v) => v.ref).join('\n')) {
    console.log('  note: order unchanged');
  }
}

main();
