#!/usr/bin/env node
/**
 * Static guard: core print stylesheet + rhythm sheet print rules stay present.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');

function fail(msg) {
  console.error('verify-print-styles:', msg);
  process.exit(1);
}

function read(rel) {
  const p = path.join(root, rel);
  if (!fs.existsSync(p)) fail(`missing ${rel}`);
  return fs.readFileSync(p, 'utf8');
}

function main() {
  const css = read('styles.css');
  if (!css.includes('@media print')) fail('styles.css: @media print block missing');
  if (!css.includes('@page')) fail('styles.css: @page missing');

  const i = css.lastIndexOf('@media print');
  const chunk = css.slice(i, i + 12000);
  if (!chunk.includes('.tdb-verse-page')) fail('styles.css: verse print rules missing');
  if (!chunk.includes('.plans-page')) fail('styles.css: plans print rules missing');
  if (!chunk.includes('main.mem-main')) fail('styles.css: memorize print rules missing');
  if (!chunk.includes('.family-hub-deep-page')) fail('styles.css: family hub print rules missing');
  if (!chunk.includes('body.family-armor-page')) fail('styles.css: family armor print rules missing');
  if (!chunk.includes('.yearly-rhythm-hub')) fail('styles.css: yearly rhythm print rules missing');
  if (!chunk.includes('.print-pack-generator-page')) fail('styles.css: printable pack generator print rules missing');
  if (!chunk.includes('.tdb-search-page .tdb-site-search-input')) {
    fail('styles.css: site search print rules missing (expect .tdb-search-page .tdb-site-search-input)');
  }
  if (!chunk.includes('.study-workspace-page #search-btn')) {
    fail('styles.css: study workspace print rules missing (expect .study-workspace-page #search-btn)');
  }
  if (!chunk.includes('.hero-banner .cta-group')) {
    fail('styles.css: hero-banner print economy rules missing (expect .hero-banner .cta-group)');
  }

  for (const f of ['printables.html', 'one-week-rhythm-kids.html', 'one-week-rhythm.html', 'print-pack-generator.html']) {
    const html = read(f);
    const mp = html.indexOf('@media print');
    if (mp === -1) fail(`${f}: @media print missing`);
    const block = html.slice(mp, mp + 4000);
    if (!block.includes('@page')) fail(`${f}: @page inside print block expected`);
  }

  const colorJs = read('kids/color-and-tell.js');
  if (!colorJs.includes('tdb-cat-storyboard-print__credit')) {
    fail('kids/color-and-tell.js: Color print credit missing');
  }
  if (!colorJs.includes("Today's Daily Battle")) {
    fail('kids/color-and-tell.js: Color print should name Today\'s Daily Battle');
  }

  const packJs = read('print-pack-generator.js');
  if (!packJs.includes('ppg-sheet__credit') || !packJs.includes("Today's Daily Battle")) {
    fail('print-pack-generator.js: pack sheets need a quiet Today\'s Daily Battle credit');
  }

  const honesty = read('life-lessons/walk-in-honesty-print.html');
  if (!honesty.includes("Today&rsquo;s Daily Battle")) {
    fail('life-lessons/walk-in-honesty-print.html: print footer should name Today\'s Daily Battle');
  }

  const kidsAct = read('kids-activities-print.html');
  if (!kidsAct.includes('tdb-print-credit') || !kidsAct.includes("Today&rsquo;s Daily Battle")) {
    fail('kids-activities-print.html: print credit missing');
  }

  console.log('verify-print-styles: OK');
}

main();
