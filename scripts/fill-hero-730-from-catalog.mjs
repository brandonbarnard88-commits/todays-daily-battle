#!/usr/bin/env node
/**
 * Wire the 31,102 catalog under the 730-day queue.
 * Bound Grove fields stay. Missing or leftover fields are filled from
 * data/breakdown/{book}.json + chapter context so a day cannot hole.
 */
import fs from 'fs';
import path from 'path';
import vm from 'vm';
import { fileURLToPath } from 'url';
import { leftoverTemplateIssues } from './lib/teaching-quality.mjs';
import { teachingForRef } from './lib/verse-teaching-floor.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const file = path.join(root, 'hero-daily-365-explanations.js');

function loadList() {
  const code = fs.readFileSync(file, 'utf8');
  const sandbox = { console };
  sandbox.window = sandbox;
  sandbox.globalThis = sandbox;
  vm.runInNewContext(code, sandbox, { filename: 'hero-daily-365-explanations.js' });
  return { code, list: sandbox.__TDB_HERO_DAILY_EXPLANATIONS };
}

function uniquify(list, field) {
  const seen = Object.create(null);
  for (const row of list) {
    const key = String(row[field] || '')
      .toLowerCase()
      .replace(/\s+/g, ' ')
      .trim();
    if (!key) continue;
    if (!seen[key]) {
      seen[key] = row.ref;
      continue;
    }
    const next = String(row[field] || '').replace(/[.]$/, '') + ' (' + row.ref + ').';
    row[field] = next;
  }
}

const { code, list } = loadList();
if (!Array.isArray(list) || list.length < 730) {
  console.error('fill-hero-730-from-catalog: expected 730 rows, got', list && list.length);
  process.exit(1);
}

let filledRows = 0;
const filledFields = Object.create(null);
for (const row of list) {
  const before = {};
  ['plain', 'step', 'about', 'to', 'setting', 'prayer', 'modernApplication', 'today'].forEach((f) => {
    before[f] = String(row[f] || '');
  });
  const next = teachingForRef(root, row.ref, row.text, row);
  let changed = false;
  Object.keys(before).forEach((f) => {
    if (String(next[f] || '') !== before[f]) {
      row[f] = next[f];
      filledFields[f] = (filledFields[f] || 0) + 1;
      changed = true;
    } else {
      row[f] = next[f];
    }
  });
  if (changed) filledRows += 1;
}

['plain', 'setting', 'to', 'step', 'prayer', 'modernApplication', 'today'].forEach((f) => uniquify(list, f));

const leftover = [];
for (const row of list) {
  const issues = leftoverTemplateIssues(row);
  if (issues.length) leftover.push(row.ref + ': ' + issues.join('; '));
}
if (leftover.length) {
  console.error('leftover after catalog floor:', leftover.slice(0, 20));
  process.exit(1);
}

const start = code.indexOf('  global.__TDB_HERO_DAILY_EXPLANATIONS = [');
const end = code.indexOf('\n];\n  global.TDB_GET_HERO_DAY_EXPLANATION');
if (start < 0 || end < 0) throw new Error('could not find explanations array bounds');
const json = JSON.stringify(list, null, 2)
  .replace(/^\[/, '')
  .replace(/\]$/, '')
  .split('\n')
  .map((line, i) => (i === 0 ? line : '  ' + line))
  .join('\n');
fs.writeFileSync(file, code.slice(0, start) + '  global.__TDB_HERO_DAILY_EXPLANATIONS = [' + json + code.slice(end));
console.log(JSON.stringify({ filledRows, filledFields, total: list.length }, null, 2));
