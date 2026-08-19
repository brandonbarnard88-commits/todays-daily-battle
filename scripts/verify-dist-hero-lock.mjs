#!/usr/bin/env node
/**
 * Dist homepage must load the leftover-lock scripts, not a stale ?v= token.
 * Kids 365 calendar must match the hero 365 calendar.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { loadYear365 } from './lib/hero-daily-verse-pick.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const failures = [];

function fail(msg) {
  failures.push(msg);
}

function read(rel) {
  return fs.readFileSync(path.join(root, rel), 'utf8');
}

function scriptToken(html, file) {
  const re = new RegExp(file.replace(/\./g, '\\.') + '\\?v=([^"\\s]+)');
  const m = html.match(re);
  return m ? m[1] : '';
}

function main() {
  const srcIndex = read('index.html');
  const distIndex = fs.existsSync(path.join(root, 'dist', 'index.html'))
    ? read('dist/index.html')
    : '';
  const fp = read('hero-daily-first-paint.js');
  if (!/if\s*\(\s*!bound\s*\|\|\s*bound\s*!==\s*target\s*\)\s*return false/.test(fp)) {
    fail('hero-daily-first-paint.js missing bound-ref snapshot lock');
  }
  if (!fp.includes('hideHeroTeachingIfMismatched')) {
    fail('hero-daily-first-paint.js must hide teaching when bound-ref !== displayed verse');
  }
  if (!fp.includes('markHeroStampCurrent') || !fp.includes('data-tdb-hero-stale')) {
    fail('hero-daily-first-paint.js must clear a stale yesterday inject after painting UTC today');
  }
  if (!srcIndex.includes('data-tdb-hero-ymd') || !srcIndex.includes('data-tdb-hero-stale')) {
    fail('index.html must stamp UTC day on #verseCard and hide teaching when that day is stale');
  }
  if (!srcIndex.includes('bound !== shown')) {
    fail('index.html must hide teaching immediately if bound-ref does not match the on-screen verse');
  }
  if (!srcIndex.includes('bbeRef !== shown')) {
    fail('index.html must hide simpler English if data-bbe-ref does not match the on-screen verse');
  }
  if (distIndex && !distIndex.includes('bbeRef !== shown')) {
    fail('dist/index.html must hide simpler English if data-bbe-ref does not match the on-screen verse');
  }
  if (!fp.includes('heroBbeSimple')) {
    fail('hero-daily-first-paint.js must hide #heroBbeSimple when data-bbe-ref !== displayed verse');
  }

  const files = [
    'hero-daily-first-paint.js',
    'tdb-verse-accuracy.js',
    'hero-daily-365-data.js',
    'hero-daily-365-explanations.js'
  ];
  files.forEach((file) => {
    const srcTok = scriptToken(srcIndex, file);
    if (!srcTok) fail('index.html missing ' + file + '?v=');
    if (distIndex) {
      const distTok = scriptToken(distIndex, file);
      if (srcTok !== distTok) {
        fail('dist/index.html ' + file + ' token is ' + distTok + ' but source is ' + srcTok);
      }
    }
  });

  const sw = read('service-worker.js');
  if (!sw.includes("url.pathname.endsWith('/hero-daily-365-data.js')")) {
    fail('service-worker.js must network-first the hero 365 calendar');
  }
  if (/CORE_ASSETS[\s\S]*'\/hero-daily-365-data\.js'/.test(sw) && sw.indexOf("'/hero-daily-365-data.js'") < sw.indexOf('network-first')) {
    /* still fail if it remains in CORE_ASSETS list */
  }
  if (sw.includes("  '/hero-daily-365-data.js',")) {
    fail('service-worker.js must not precache unversioned hero-daily-365-data.js');
  }
  if (sw.includes("  '/hero-daily-first-paint.js',")) {
    fail('service-worker.js must not precache unversioned hero-daily-first-paint.js');
  }

  const kids = read('kids/kids-verses-365.js');
  const year = loadYear365(root);
  const kidRefs = [];
  const re = /\{\s*ref:\s*"([^"]+)",\s*text:\s*"((?:\\.|[^"\\])*)"/g;
  let m;
  while ((m = re.exec(kids))) {
    kidRefs.push({ ref: m[1], text: m[2] });
  }
  if (kidRefs.length !== 365) {
    fail('Kids calendar must have 365 days (has ' + kidRefs.length + ')');
  }
  if (year.length !== 365 && year.length !== 730) {
    fail('Hero queue must have 365 or 730 days (has ' + year.length + ')');
  } else {
    for (let i = 0; i < 365; i++) {
      if (kidRefs[i].ref !== year[i].ref || kidRefs[i].text !== year[i].text) {
        fail('Kids year 1 and hero queue drift at day ' + (i + 1) + ': kids ' + kidRefs[i].ref + ' vs hero ' + year[i].ref);
        break;
      }
    }
  }

  if (failures.length) {
    console.error('Dist hero lock FAIL — ' + failures.length + ' issue(s):\n');
    failures.forEach((f) => console.error(' • ' + f));
    process.exit(1);
  }
  console.log('Dist hero lock PASS: tokens match, SW network-first, kids/hero 365 identical.');
}

main();
