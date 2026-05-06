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
  assertMatch(idx, /id="tdbFamilyModeListen"[^>]*aria-label="/, 'dist/index.html: #tdbFamilyModeListen needs aria-label');

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

  console.log('verify-a11y-controls: OK');
}

main();
