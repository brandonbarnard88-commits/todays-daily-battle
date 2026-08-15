#!/usr/bin/env node
/**
 * Regression guard: homepage feel search must have ONE visible results host and ONE wiring path.
 * Prevents: hidden #output in #main-search stealing getElementById('output'), or wireSmartSearch
 * duplicating inline feel-search (races + "dumb" smart-card replacing full executeQuery results).
 *
 * Run: node scripts/verify-homepage-search-wiring.mjs
 * Wired into: npm test
 */
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');

function fail(msg) {
  console.error('FAIL homepage search wiring:', msg);
  process.exit(1);
}

let index;
let script;
let homeFeel;
try {
  index = readFileSync(join(root, 'index.html'), 'utf8');
  script = readFileSync(join(root, 'script.js'), 'utf8');
  homeFeel = readFileSync(join(root, 'tdb-home-feel.js'), 'utf8');
} catch (e) {
  fail(String(e && e.message));
}

if (!index.includes('tdb-home-feel.js')) {
  fail('index.html must load deferred tdb-home-feel.js (homepage feel-search bundle).');
}

if (!homeFeel.includes('feelSuggestDropdown') || !homeFeel.includes('FEEL_GROUPS')) {
  fail('tdb-home-feel.js must wire feelSuggestDropdown + FEEL_GROUPS.');
}

if (!index.includes('id="feel-results"')) {
  fail('index.html must contain id="feel-results" (visible search results host).');
}

// sr-only #main-search must not contain a real #output (breaks getElementById + hides results).
const mainSearchStart = index.indexOf('id="main-search"');
if (mainSearchStart === -1) fail('index.html missing id="main-search" (required for tooling/tests).');
const sectionStart = index.lastIndexOf('<section', mainSearchStart);
const sectionEnd = index.indexOf('</section>', mainSearchStart);
if (sectionStart === -1 || sectionEnd === -1 || sectionEnd < mainSearchStart) {
  fail('Could not parse #main-search section in index.html.');
}
const mainSearchChunk = index.slice(sectionStart, sectionEnd);
if (mainSearchChunk.includes('id="output"') || mainSearchChunk.includes("id='output'")) {
  fail(
    'index.html: remove id="output" from inside #main-search (sr-only). Use #feel-results + getSearchOutputElement() in script.js.'
  );
}

if (!script.includes('function getSearchOutputElement')) {
  fail('script.js must define getSearchOutputElement() and use it for homepage results.');
}

if (!script.includes('.home-search-card') || !script.includes('hasSearchCards')) {
  fail('hasSearchCards must recognize .home-search-card so emergency fallback cannot overwrite distinct topic results.');
}

if (!script.includes("getElementById('feelSuggestDropdown')") || !script.includes('wireSmartSearch')) {
  fail('script.js must keep wireSmartSearch + feelSuggestDropdown gate for homepage.');
}

// Early return must stay — otherwise duplicate input handlers fight inline feel-search.
const ws = script.indexOf('function wireSmartSearch');
if (ws === -1) fail('script.js missing wireSmartSearch IIFE.');
const wireChunk = script.slice(ws, ws + 2500);
if (!wireChunk.includes("getElementById('feelSuggestDropdown')") || !wireChunk.includes('return')) {
  fail('wireSmartSearch must return early when #feelSuggestDropdown exists (homepage).');
}

console.log('OK   homepage search wiring guard (scripts/verify-homepage-search-wiring.mjs)');
