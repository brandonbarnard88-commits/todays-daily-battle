#!/usr/bin/env node
/**
 * Offline checks: dist/ HTML + OG JPEGs on disk (run after npm run build).
 * Catches regressions without network — pair with npm run verify:live-kids for production.
 */
import { readFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { LOOP_HTML_MARKERS, STORY_HTML_MARKERS, OG_ASSET_PATHS } from './kids-verify-markers.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const dist = join(root, 'dist');

let failed = false;

for (const rel of OG_ASSET_PATHS) {
  const p = join(dist, rel);
  if (!existsSync(p)) {
    console.error('FAIL missing file:', rel);
    failed = true;
  } else {
    console.log('OK   file:', rel);
  }
}

function checkHtml(rel, markers, label) {
  const p = join(dist, rel);
  if (!existsSync(p)) {
    console.error('FAIL missing:', rel);
    failed = true;
    return;
  }
  const body = readFileSync(p, 'utf8');
  const missing = markers.filter((s) => !body.includes(s));
  if (missing.length) {
    console.error(`FAIL ${label} missing:`, missing.join(', '));
    failed = true;
  } else {
    console.log(`OK   ${label}: all markers present`);
  }
}

checkHtml('kids-corner.html', LOOP_HTML_MARKERS, 'Loop Library (dist)');
checkHtml(join('kids', 'corner.html'), STORY_HTML_MARKERS, 'Story Library (dist)');

if (failed) {
  process.exit(1);
}
console.log('\nKids dist verification passed.');
