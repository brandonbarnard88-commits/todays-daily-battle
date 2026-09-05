#!/usr/bin/env node
/**
 * Static guard: sacred listen / share / memorize / pray controls expose helpful names.
 * Run after build (reads dist/ + source where markup is shared).
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');

function fail(msg) {
  console.error('verify-a11y-controls:', msg);
  process.exit(1);
}

function read(rel) {
  const p = path.join(root, rel);
  if (!fs.existsSync(p)) fail(`missing ${rel}`);
  return fs.readFileSync(p, 'utf8');
}

function assertMatch(html, re, msg) {
  if (!re.test(html)) fail(msg);
}

function main() {
  const verse = read('dist/verse.html');
  assertMatch(
    verse,
    /id="verse-page-share"[^>]*aria-label="/,
    'dist/verse.html: #verse-page-share needs aria-label'
  );
  assertMatch(
    verse,
    /id="verse-page-share-encourage"[^>]*aria-label="/,
    'dist/verse.html: #verse-page-share-encourage needs aria-label'
  );
  assertMatch(
    verse,
    /id="pray-this-with-me-verse"[^>]*aria-label="[^"]*[Pp]ray[^"]*"/,
    'dist/verse.html: #pray-this-with-me-verse aria-label should describe prayer copy'
  );
  if (/pray-this-with-me-verse"[^>]*aria-label="Copy verse and share link"/.test(verse)) {
    fail('dist/verse.html: pray button must not use generic copy-only label');
  }
  assertMatch(
    verse,
    /id="verse-listen-btn"[^>]*aria-label="/,
    'dist/verse.html: #verse-listen-btn needs aria-label'
  );
  assertMatch(
    verse,
    /verse-listen-options[\s\S]*?<summary[^>]*aria-label="/,
    'dist/verse.html: #verse-listen-options summary needs aria-label'
  );

  const mem = read('dist/memorize.html');
  assertMatch(mem, /id="mem-speak"[^>]*aria-label="/, 'dist/memorize.html: #mem-speak needs aria-label');
  assertMatch(mem, /id="mem-review-due"[^>]*aria-label="/, 'dist/memorize.html: #mem-review-due needs aria-label');
  assertMatch(mem, /id="mem-load-verse"[^>]*aria-label="/, 'dist/memorize.html: #mem-load-verse needs aria-label');

  const idx = read('dist/index.html');
  assertMatch(idx, /id="heroShareBtn"[^>]*aria-label="/, 'dist/index.html: #heroShareBtn needs aria-label');
  assertMatch(idx, /id="hero-save-my-verses"[^>]*aria-label="/, 'dist/index.html: #hero-save-my-verses needs aria-label');
  const ask = read('dist/ask.html');
  assertMatch(
    ask,
    /id="tdbFeelPathCard"[^>]*aria-live="polite"/,
    'dist/ask.html: #tdbFeelPathCard needs aria-live="polite"'
  );
  assertMatch(
    idx,
    /id="tdbHomeFirstDoors"[^>]*aria-label="/,
    'dist/index.html: #tdbHomeFirstDoors needs aria-label'
  );

  const wall = read('dist/prayer-wall.html');
  assertMatch(
    wall,
    /id="prayer-wall-add"[^>]*aria-label="/,
    'dist/prayer-wall.html: #prayer-wall-add needs aria-label'
  );
  assertMatch(
    wall,
    /id="silentAmenBtn"[^>]*aria-label="/,
    'dist/prayer-wall.html: #silentAmenBtn needs aria-label'
  );
  assertMatch(
    wall,
    /id="prayer-private-template-btn"[^>]*aria-label="Fill the private line with a weight and promise starter"/,
    'dist/prayer-wall.html: #prayer-private-template-btn needs weight/promise aria-label'
  );
  assertMatch(
    wall,
    /id="prayer-door-tabs"[^>]*role="tablist"/,
    'dist/prayer-wall.html: #prayer-door-tabs needs role="tablist"'
  );
  assertMatch(
    wall,
    /id="prayer-tab-private"[^>]*aria-controls="prayer-panel-private"/,
    'dist/prayer-wall.html: #prayer-tab-private needs aria-controls'
  );

  const mystudy = read('dist/mystudy.html');
  assertMatch(
    mystudy,
    /id="tdb-continue-surface"[^>]*aria-label="Pick up on this device"/,
    'dist/mystudy.html: #tdb-continue-surface needs aria-label'
  );

  const reader = read('dist/reader.html');
  assertMatch(
    reader,
    /id="tdb-continue-surface"[^>]*aria-label="Pick up on this device"/,
    'dist/reader.html: #tdb-continue-surface needs aria-label'
  );

  console.log('verify-a11y-controls: OK');
}

main();
