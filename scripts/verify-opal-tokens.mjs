#!/usr/bin/env node
/**
 * Guard: tdb-opal-tokens.css keeps the named opal bodies + flashes,
 * and Home / inner pages map --accent / --gold onto them.
 */
import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

function fail(msg) {
  console.error('FAIL opal tokens:', msg);
  process.exit(1);
}

function mustInclude(rel, needles) {
  const text = readFileSync(join(root, rel), 'utf8');
  for (const needle of needles) {
    if (!text.includes(needle)) fail(`${rel} missing ${JSON.stringify(needle)}`);
  }
}

mustInclude('tdb-opal-tokens.css', [
  '--opal-white: #F3EEE4',
  '--opal-black: #080C14',
  '--opal-crystal: #C8D6D8',
  '--opal-sea: #A8C3BC',
  '--opal-fire: #D96B4C',
  '--opal-fire-amber: #E8A04A',
  '--opal-flash-blue: #8BB4D4',
  '--opal-flash-teal: #5EAEA4',
  '--opal-flash-green: #6FBF9A',
  '--opal-flash-violet: #8E7DB8',
  '--opal-flash-gold: #E3BC67',
  '--accent: var(--opal-sea)',
  '--gold: var(--opal-flash-gold)'
]);

mustInclude('styles.css', [
  'tdb-opal-tokens.css?v=20260903opal1',
  'var(--opal-sea, #A8C3BC)',
  'var(--opal-flash-gold, #E3BC67)'
]);

mustInclude('tdb-home-page.css', [
  'var(--opal-sea, #A8C3BC)',
  'var(--opal-flash-gold, #E3BC67)',
  'var(--opal-black, #080C14)',
  'var(--opal-white, #F3EEE4)'
]);

mustInclude('index.html', ['tdb-opal-tokens.css?v=20260903opal1']);
mustInclude('ask.html', ['tdb-opal-tokens.css?v=20260903opal1']);
mustInclude('plans.html', ['tdb-opal-tokens.css?v=20260903opal1']);
mustInclude('give.html', ['tdb-opal-tokens.css?v=20260903opal1']);
mustInclude('calm.html', ['tdb-opal-tokens.css?v=20260903opal1']);
mustInclude('explore.html', ['tdb-opal-tokens.css?v=20260903opal1']);
mustInclude('contact.html', ['tdb-opal-tokens.css?v=20260903opal1']);

console.log('OK   opal tokens (scripts/verify-opal-tokens.mjs)');
