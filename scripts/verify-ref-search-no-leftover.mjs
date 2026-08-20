#!/usr/bin/env node
/**
 * A verse lookup must return that verse — not leftover comfort cards.
 */
import fs from 'fs';
import path from 'path';
import vm from 'vm';
import { fileURLToPath } from 'url';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const failures = [];
function fail(msg) {
  failures.push(msg);
}

const script = fs.readFileSync(path.join(root, 'script.js'), 'utf8');
if (!/parsed\.intent !== 'reference'/.test(script) || !/Pad feeling\/topic searches only/.test(script)) {
  fail('executeQuery still pads reference lookups with DEFAULT_VERSES');
}
if (!/pickHomeSearchEntries\(HOME_SEARCH_PLAN_LIBRARY, results, queryText, 2, \[\]\)/.test(script)) {
  fail('buildHomeSearchPlanMatches still pads reference lookups with leftover plans');
}

const core = fs.readFileSync(path.join(root, 'ask-the-word-core.js'), 'utf8');
const sandbox = { console, window: {}, globalThis: {} };
sandbox.window = sandbox;
sandbox.globalThis = sandbox;
vm.runInNewContext(core, sandbox, { filename: 'ask-the-word-core.js' });
const src = sandbox.TDBAskTheWord && sandbox.TDBAskTheWord.answer ? String(core) : core;
if (!/\\s\+\(\\d\+\)\$/.test(src) && !/\s\+\(\\d\+\)\$/.test(core)) {
  fail('ask-the-word-core missing space-format verse parse');
}

const inject = fs.readFileSync(path.join(root, 'scripts/inject-home-hero.mjs'), 'utf8');
if (!inject.includes('kjvTextForRef') || !inject.includes('stripBbeSuperscription')) {
  fail('inject-home-hero must prefer full KJV and strip BBE psalm headings');
}

const fp = fs.readFileSync(path.join(root, 'hero-daily-first-paint.js'), 'utf8');
if (!/replace\(\/\^\\s\*So do this:\\s\*\/i/.test(fp) && !fp.includes("replace(/^\\s*So do this:\\s*/i")) {
  fail('hero-daily-first-paint.js must strip leftover “So do this:” prefix');
}

const data = fs.readFileSync(path.join(root, 'hero-daily-365-data.js'), 'utf8');
if (!/hath gotten him the victory/.test(data)) {
  fail('Psalm 98:1 queue text is still truncated');
}
const indexHtml = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
if (!/hero-daily-365-data\.js\?v=20260820-full/.test(indexHtml)) {
  fail('index.html must cache-bust hero-daily-365-data.js after a verse-text change');
}
if (!fp.includes('Never shorten the KJV') && !fp.includes('Stale calendar JS can truncate')) {
  fail('hero-daily-first-paint.js must refuse to shorten an injected full KJV line');
}

if (failures.length) {
  console.error('ref-search leftover FAIL — ' + failures.length + ' issue(s):\n');
  failures.forEach((f) => console.error(' • ' + f));
  process.exit(1);
}
console.log('ref-search leftover PASS: John 3:16 stays John 3:16; Psalm 98:1 is the full verse.');
