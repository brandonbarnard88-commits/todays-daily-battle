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
if (index.includes('<summary>More feelings</summary>') || /<details[^>]*id="tdbFeelMoreDetails"/.test(index)) {
  fail('Ask the Word must show the topic wall in the open — no More feelings dropdown.');
}
if (!index.includes('id="tdbFeelAllChips"') || !index.includes('id="tdbFeelMoreDetails"')) {
  fail('Ask the Word must keep the full topic wall in the open (tdbFeelAllChips).');
}
if (/<details[^>]*id="tdbKbExamples"/.test(index) || /<details[^>]*id="tdbFeelComboPresets"/.test(index)) {
  fail('Ask the Word example questions and feeling pairs must stay open — no details menus.');
}
if (!/tdbFeelQuickStrip[\s\S]*?data-topic="prayer"[\s\S]*?data-topic="depression"[\s\S]*?data-topic="worry"/.test(index)) {
  fail('Top strip must include Prayer, Down, and Worry.');
}
if (!/tdbFeelQuickStrip[\s\S]*?data-topic="hope"/.test(index)) {
  fail('Top strip must include Hope so the porch is not only heavy feelings.');
}
if (!index.includes('for anyone') || !index.includes('You don&rsquo;t need church words')) {
  fail('Homepage must say the porch is for anyone, without church words required.');
}
if (!index.includes('tdb-hero-share-more--quiet') || !index.includes('id="heroFriendEmailBtn"')) {
  fail('Email/Text/Image must stay as quiet links, not a second toolbar row.');
}
if (index.includes('tdb-hero-share-more--open')) {
  fail('Email/Text/Image must not sit out as an open button row.');
}
if (!/href="#feel-section">Ask the Word</.test(index)) {
  fail('Homepage verse door must say Ask the Word, not How I feel.');
}
if (/data-topic="waiting"[^>]*>[\s\S]{0,80}🕯️/.test(index) || /data-topic="worthless"[^>]*>[\s\S]{0,80}🪞/.test(index)) {
  fail('Waiting and Worthless must not reuse Grief/Identity icons.');
}
if (!/shame:\s*\['shamelift'/.test(script)) {
  fail('Shame must prefer its own Lifted from Shame week first.');
}
if (!/temptation:\s*\['standfirm'/.test(script)) {
  fail('Temptation must prefer Stand Firm first, not Addiction.');
}

console.log('OK   every homepage topic chip (' + unique.length + ' unique) — quiet header, own pack, own plans');
unique.sort().forEach((c) => {
  const pack = ALLOWED_ALIAS[c] || c;
  console.log('  - ' + c + (pack !== c ? ' → ' + pack : '') + '  ' + (firstRefs[c] || ''));
});
