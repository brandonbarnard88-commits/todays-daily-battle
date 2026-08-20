#!/usr/bin/env node
/**
 * Spanish/French/Portuguese homes (and /verso.html) must paint the same official
 * UTC verse as English — never leftover rotating comfort verses.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { loadYear365, pickVerseForToday, utcDayOfYear } from './lib/hero-daily-verse-pick.mjs';
import { kjvTextForRef } from './lib/verse-teaching-floor.mjs';
import { leftoverTemplateIssues } from './lib/teaching-quality.mjs';
import { LOCALE_BIBLES, localeTextForRef, localeBibleDir } from './lib/locale-bible.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const failures = [];

function fail(msg) {
  failures.push(msg);
}

function read(rel) {
  return fs.readFileSync(path.join(root, rel), 'utf8');
}

function wrapOf(html) {
  const m = html.match(/<section\b[^>]*tdb-hub-daily-wrap[^>]*>[\s\S]*?<\/section>/);
  return m ? m[0] : '';
}

function main() {
  const year365 = loadYear365(root);
  const v = pickVerseForToday(year365);
  const expectRef = String((v && v.ref) || '').trim();
  const official = kjvTextForRef(root, expectRef);
  const expectText = String(official && official.length >= String((v && v.text) || '').length ? official : v.text)
    .replace(/\s+/g, ' ')
    .trim();

  if (!expectRef) fail('could not pick official today');
  if (!expectText) fail('official KJV text empty');

  Object.values(LOCALE_BIBLES).forEach((spec) => {
    const p = path.join(localeBibleDir(root), spec.file);
    if (!fs.existsSync(p)) fail('missing locale Bible ' + spec.file + ' — run node scripts/vendor-locale-bibles.mjs');
  });

  const injectHome = read('scripts/inject-home-hero.mjs');
  if (!injectHome.includes('injectLocaleHubHero')) {
    fail('inject-home-hero.mjs must call injectLocaleHubHero');
  }
  const pkg = read('package.json');
  if (!pkg.includes('verify-locale-hub-today.mjs')) {
    fail('package.json must run verify-locale-hub-today.mjs');
  }

  const localeJson = JSON.parse(read('data/locale-hub-teaching.json'));
  Object.keys(localeJson).forEach((ref) => {
    ['es', 'fr', 'pt'].forEach((lang) => {
      const row = localeJson[ref] && localeJson[ref][lang];
      if (!row) {
        fail('locale-hub-teaching.json missing ' + lang + ' for ' + ref);
        return;
      }
      leftoverTemplateIssues({ ref, ...row }).forEach((issue) => {
        fail(ref + ' ' + lang + ' leftover: ' + issue);
      });
    });
  });

  const leftoverSnips = [
    'data-tdb-hub-daily-rotate',
    'Salmos 55:22',
    'Psaume 55:22',
    'Mateo 11:28',
    'Matthieu 11:28',
    'Mateus 11:28',
    'Isaías 41:10',
    'Ésaïe 41:10'
  ];

  const pages = [
    'es/index.html',
    'dist/es/index.html',
    'fr/index.html',
    'dist/fr/index.html',
    'pt/index.html',
    'dist/pt/index.html',
    'verso.html',
    'dist/verso.html'
  ];

  pages.forEach((rel) => {
    const full = path.join(root, rel);
    if (!fs.existsSync(full)) {
      fail('missing ' + rel);
      return;
    }
    const html = fs.readFileSync(full, 'utf8');
    const wrap = wrapOf(html);
    if (!wrap) {
      fail(rel + ' missing tdb-hub-daily-wrap');
      return;
    }
    if (!wrap.includes('data-tdb-bound-ref="' + expectRef + '"')) {
      fail(rel + ' bound-ref is not official today (' + expectRef + ')');
    }
    if (!wrap.includes(expectText)) {
      fail(rel + ' missing full official KJV');
    }
    leftoverSnips.forEach((snip) => {
      if (wrap.includes(snip)) fail(rel + ' leftover in daily wrap: ' + snip);
    });
    const lang = rel.includes('verso') || rel.startsWith('es/') || rel.startsWith('dist/es/')
      ? 'es'
      : rel.includes('/fr/')
        ? 'fr'
        : rel.includes('/pt/')
          ? 'pt'
          : '';
    if (lang) {
      const locText = localeTextForRef(root, lang, expectRef);
      if (!locText) fail(lang + ' locale Bible missing ' + expectRef + ' — run node scripts/vendor-locale-bibles.mjs');
      if (!wrap.includes(locText)) fail(rel + ' missing locale Bible text for ' + expectRef);
      if (!wrap.includes('data-tdb-locale-bible="' + LOCALE_BIBLES[lang].name + '"')) {
        fail(rel + ' missing locale Bible stamp');
      }
    }
  });

  const esHub = read('es/index.html');
  if (!esHub.includes('href="/verso.html"')) {
    fail('Spanish hub must send Verso del día to /verso.html, not bounce to English verse.html only');
  }
  if (/<h2>Versículo de hoy<\/h2>/.test(read('ansiedad.html'))) {
    fail('ansiedad.html must not call a topic verse “Versículo de hoy”');
  }
  if (/<h2>Versículo de hoy<\/h2>/.test(read('fuerza.html'))) {
    fail('fuerza.html must not call a topic verse “Versículo de hoy”');
  }
  if (/<h2>Versículo de hoy<\/h2>/.test(read('paz.html'))) {
    fail('paz.html must not call a topic verse “Versículo de hoy”');
  }

  if (failures.length) {
    failures.forEach((f) => console.error('verify-locale-hub-today:', f));
    process.exit(1);
  }
  console.log(
    'verify-locale-hub-today: OK —',
    expectRef,
    '(UTC doy',
    utcDayOfYear() + ')',
    'es/fr/pt + verso'
  );
}

main();
