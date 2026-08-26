#!/usr/bin/env node
/**
 * The 730-day queue must sit on the 31,102 catalog floor.
 * Bound Grove days stay richer. No day may be empty or leftover.
 */
import fs from 'fs';
import path from 'path';
import vm from 'vm';
import { fileURLToPath } from 'url';
import { leftoverTemplateIssues } from './lib/teaching-quality.mjs';
import { teachingForRef, rowIsComplete, loadCatalogPlain } from './lib/verse-teaching-floor.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const failures = [];

function fail(msg) {
  failures.push(msg);
}

function loadList() {
  const code = fs.readFileSync(path.join(root, 'hero-daily-365-explanations.js'), 'utf8');
  const sandbox = { console };
  sandbox.window = sandbox;
  sandbox.globalThis = sandbox;
  vm.runInNewContext(code, sandbox, { filename: 'hero-daily-365-explanations.js' });
  return sandbox.__TDB_HERO_DAILY_EXPLANATIONS;
}

if (process.env.TDB_ALLOW_INCOMPLETE_QUEUE_FLOOR === '1') {
  console.warn(
    'queue catalog floor: skipped (TDB_ALLOW_INCOMPLETE_QUEUE_FLOOR=1). Teaching completeness still runs in quality-gate.'
  );
  process.exit(0);
}

const list = loadList();
if (!Array.isArray(list) || list.length !== 730) {
  fail('queue length is ' + (list && list.length) + ' — expected 730');
}

const refs = new Set();
(list || []).forEach((row, i) => {
  const label = 'day[' + i + '] ' + ((row && row.ref) || '(no ref)');
  leftoverTemplateIssues(row || {}).forEach((issue) => fail(label + ': ' + issue));
  if (!rowIsComplete(row)) fail(label + ': incomplete after catalog floor');
  refs.add(String(row.ref || ''));
});

const offQueue = 'Obadiah 1:1';
if (refs.has(offQueue)) {
  fail('pick a different off-queue probe — Obadiah 1:1 is already in the 730');
} else {
  const floor = teachingForRef(root, offQueue, '');
  leftoverTemplateIssues(floor).forEach((issue) => fail('off-queue ' + offQueue + ': ' + issue));
  if (!rowIsComplete(floor)) fail('off-queue ' + offQueue + ' did not get a complete catalog floor');
  if (!loadCatalogPlain(root, offQueue)) fail('catalog missing ' + offQueue);
}

const enrich = fs.readFileSync(path.join(root, 'scripts/enrich-hero-365-context.mjs'), 'utf8');
if (!/modernApplication/.test(enrich) || !/Object\.assign\(\s*\{\s*\}\s*,\s*row/.test(enrich)) {
  fail('enrich-hero-365-context.mjs must keep modernApplication/today (not rewrite a thin row)');
}

const inject = fs.readFileSync(path.join(root, 'scripts/inject-home-hero.mjs'), 'utf8');
if (!inject.includes('teachingForRef')) {
  fail('inject-home-hero.mjs must use teachingForRef so today cannot inject empty');
}

const fp = fs.readFileSync(path.join(root, 'hero-daily-first-paint.js'), 'utf8');
if (/return 'In ' \+ y \+ ', hold this verse as written/.test(fp)) {
  fail('hero-daily-first-paint.js still generates leftover relate reprint');
}
if (!fp.includes('floorHeroTeaching') || !fp.includes('__tdbCatalogFloor')) {
  fail('hero-daily-first-paint.js must wrap the 730 getter with the catalog floor');
}

const std = fs.readFileSync(path.join(root, 'verse-breakdown-standard.js'), 'utf8');
if (/hold this verse as written/.test(std) && /return 'In ' \+ y \+ ', hold this verse as written/.test(std)) {
  fail('verse-breakdown-standard.js still generates leftover relate reprint');
}

if (failures.length) {
  console.error('queue catalog floor FAIL — ' + failures.length + ' issue(s):\n');
  failures.forEach((f) => console.error(' • ' + f));
  process.exit(1);
}
console.log('queue catalog floor PASS: 730 leftover-free, off-queue verse floored, inject + first-paint wired.');
