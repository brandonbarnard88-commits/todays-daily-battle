#!/usr/bin/env node
/**
 * Double-check every homepage topic chip: quiet results, own verse pack, own plans.
 * Run: node scripts/verify-homepage-topic-chips.mjs
 */
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');

function fail(msg) {
  console.error('FAIL topic chips:', msg);
  process.exit(1);
}

const index = readFileSync(join(root, 'index.html'), 'utf8');
const script = readFileSync(join(root, 'script.js'), 'utf8');
const homeFeel = readFileSync(join(root, 'tdb-home-feel.js'), 'utf8');
const css = readFileSync(join(root, 'tdb-home-page.css'), 'utf8');

const chips = [...index.matchAll(/data-topic="([^"]+)"/g)].map((m) => m[1]);
const unique = [...new Set(chips)];
if (unique.length < 30) fail('Expected 30+ homepage topic chips, found ' + unique.length);

const ALLOWED_ALIAS = {
  restless: 'anxiety',
  tired: 'strength',
  money: 'finances',
  'difficult person': 'forgiveness',
  'difficult boss': 'forgiveness',
};

const topicsBlock = script.slice(script.indexOf('const topics = {'), script.indexOf('// You can keep adding more here'));
if (!topicsBlock.includes("anxiety:") || !topicsBlock.includes("'jesus said':")) {
  fail('Could not locate topics dictionary.');
}

function topicHasVerses(key) {
  const re = new RegExp(
    "(?:^|\\n)\\s*(?:'?" +
      key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') +
      "'?)\\s*:\\s*\\{[\\s\\S]{0,800}?verses:\\s*\\[([^\\]]+)\\]",
    'm'
  );
  const m = topicsBlock.match(re);
  if (!m) return [];
  return m[1]
    .split(',')
    .map((s) => s.replace(/['"]/g, '').trim())
    .filter(Boolean);
}

const missingPack = [];
const missingQuiet = [];
const missingPrefs = [];
const firstRefs = {};

for (const chip of unique) {
  if (!script.includes("HOME_QUIET_TOPIC_CHIPS") || !/HOME_QUIET_TOPIC_CHIPS = \{[\s\S]*?['"]?/.test(script)) {
    fail('HOME_QUIET_TOPIC_CHIPS missing.');
  }
  const chipLit = chip.includes(' ') ? "'" + chip + "'" : chip;
  if (!script.includes(chipLit + ': 1') && !script.includes("'" + chip + "': 1")) {
    missingQuiet.push(chip);
  }

  const packKey = ALLOWED_ALIAS[chip] || chip;
  const verses = topicHasVerses(packKey);
  if (verses.length < 3) missingPack.push(chip + ' → ' + packKey + ' (' + verses.length + ')');
  else firstRefs[chip] = verses.slice(0, 3).join('|');

  const prefNeedle = chip.includes(' ') ? "'" + chip + "':" : chip + ':';
  const aliasedPref = ALLOWED_ALIAS[chip] ? ALLOWED_ALIAS[chip] + ':' : '';
  if (!script.includes(prefNeedle) && !(aliasedPref && script.includes(aliasedPref))) {
    missingPrefs.push(chip);
  }
}

if (missingQuiet.length) fail('Not in HOME_QUIET_TOPIC_CHIPS: ' + missingQuiet.join(', '));
if (missingPack.length) fail('Missing/thin verse pack: ' + missingPack.join('; '));
if (missingPrefs.length) fail('Missing plan prefs: ' + missingPrefs.join(', '));

if (/wonder:\s*'hope'/.test(script) || /wonder:\s*"hope"/.test(script)) {
  fail('Wonder must not remap to Hope.');
}
if (/exhaustion:\s*'strength'/.test(script)) {
  fail('Exhaustion must not remap to strength/Tired.');
}
if (/heavy:\s*'anxiety'/.test(script)) {
  fail('Heavy must not remap to anxiety.');
}

if (firstRefs.anxiety && firstRefs.overwhelmed && firstRefs.anxiety === firstRefs.overwhelmed) {
  fail('Restless and Heavy still share the same first verses.');
}
if (firstRefs.wonder && firstRefs.hope && firstRefs.wonder === firstRefs.hope) {
  fail('Wonder and Hope share the same first verses.');
}
if (firstRefs.grief && firstRefs.guilt && firstRefs.grief === firstRefs.guilt) {
  fail('Grief and Guilt share the same first verses.');
}
if (firstRefs.grief && firstRefs.heartache && firstRefs.grief === firstRefs.heartache) {
  fail('Grief and Heartache share the same first verses.');
}

if (!homeFeel.includes('One results host')) {
  fail('tdb-home-feel must not stack a second feel-card list on top of the search shell.');
}
if (!css.includes('#feel-results.results ~ #feelCards')) {
  fail('tdb-home-page.css must hide #feelCards while #feel-results has results.');
}

console.log('OK   every homepage topic chip (' + unique.length + ' unique) — quiet header, own pack, own plans');
unique.sort().forEach((c) => {
  const pack = ALLOWED_ALIAS[c] || c;
  console.log('  - ' + c + (pack !== c ? ' → ' + pack : '') + '  ' + (firstRefs[c] || ''));
});
