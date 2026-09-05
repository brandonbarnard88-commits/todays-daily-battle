#!/usr/bin/env node
/**
 * Verify porch verse widget wiring: shared hide key, hub surfaces, build inject targets.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');

const HUB_PAGES = [
  { file: 'explore.html', label: 'Explore' },
  { file: 'plans.html', label: 'Plans' },
  { file: 'family.html', label: 'Family' },
  { file: 'daily-quiet-time.html', label: 'Daily quiet time' }
];

const REQUIRED = [
  'id="tdbPorchVerseWidget"',
  'id="tdbPorchVerseRef"',
  'id="tdbPorchVerseText"',
  'id="tdbPorchVerseHide"',
  'Hide for today',
  'tdb-porch-verse-widget.js'
];

function fail(msg) {
  console.error('verify-porch-verse-widget:', msg);
  process.exit(1);
}

const widgetJs = fs.readFileSync(path.join(root, 'tdb-porch-verse-widget.js'), 'utf8');
if (!widgetJs.includes("var HIDE_KEY = 'tdb-porch-verse-hidden'")) {
  fail('tdb-porch-verse-widget.js missing shared HIDE_KEY tdb-porch-verse-hidden');
}
if (!widgetJs.includes('localStorage.getItem(HIDE_KEY)')) {
  fail('hide-for-today must read shared localStorage key');
}

const injectSrc = fs.readFileSync(path.join(root, 'scripts/inject-porch-verse-widget.mjs'), 'utf8');
for (const hub of HUB_PAGES) {
  if (!injectSrc.includes(hub.file)) {
    fail('inject-porch-verse-widget.mjs missing target ' + hub.file);
  }
  const htmlPath = path.join(root, hub.file);
  if (!fs.existsSync(htmlPath)) {
    fail(hub.file + ' missing in source tree');
  }
  const html = fs.readFileSync(htmlPath, 'utf8');
  for (const needle of REQUIRED) {
    if (!html.includes(needle)) {
      fail(hub.label + ' (' + hub.file + ') missing ' + needle);
    }
  }
  if (!html.includes("localStorage.getItem('tdb-porch-verse-hidden')")) {
    fail(hub.label + ' missing early head dismiss script for tdb-porch-verse-hidden');
  }
}

if (!injectSrc.includes('injectBoundTeaching') || !injectSrc.includes('familySimpleSituation')) {
  fail('inject-porch-verse-widget.mjs must stamp Family sit/meaning for today, not leftover Psalm 100');
}

console.log(
  'verify-porch-verse-widget: OK — shared hide key + ' +
    HUB_PAGES.map((h) => h.label).join(', ') +
    ' surfaces wired'
);
