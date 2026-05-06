#!/usr/bin/env node
/**
 * Regenerate hero-daily-365-data.js from kids/kids-verses-365.js (same 365 order).
 * Run from repo root: node scripts/sync-hero-365-from-kids.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const srcPath = path.join(root, 'kids', 'kids-verses-365.js');
const outPath = path.join(root, 'hero-daily-365-data.js');

const src = fs.readFileSync(srcPath, 'utf8');

function extractBracketArray(src, needle) {
  const idx = src.indexOf(needle);
  if (idx === -1) return null;
  let i = idx + needle.length;
  while (i < src.length && /\s/.test(src[i])) i += 1;
  if (src[i] !== '[') return null;
  let depth = 0;
  const start = i;
  for (; i < src.length; i += 1) {
    const c = src[i];
    if (c === '[') depth += 1;
    else if (c === ']') {
      depth -= 1;
      if (depth === 0) return src.slice(start, i + 1);
    }
  }
  return null;
}

const rawArr = extractBracketArray(src, '__TDB_KIDS_VERSES_365 = ');
if (!rawArr) throw new Error('Could not parse __TDB_KIDS_VERSES_365 array from kids-verses-365.js');

const arr = new Function('return ' + rawArr)();
if (!Array.isArray(arr) || arr.length !== 365) {
  throw new Error('Expected 365 verses, got ' + (arr && arr.length));
}

const header = `/**
 * 365 KJV verses for the home hero: ordinal day of year (UTC) → verse.
 * Kept in sync with kids/kids-verses-365.js (uplifting, hope-forward curation).
 * Regenerate: node scripts/sync-hero-365-from-kids.mjs
 */
(function (global) {
  'use strict';
  global.__TDB_HERO_DAILY_YEAR = `;

const footer = `;
})(typeof window !== 'undefined' ? window : this);
`;

fs.writeFileSync(outPath, header + JSON.stringify(arr, null, 2) + footer, 'utf8');
console.log('Wrote', path.relative(root, outPath), '(' + arr.length + ' verses)');
