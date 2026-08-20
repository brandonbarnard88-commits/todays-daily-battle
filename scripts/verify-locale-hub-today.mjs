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

  if (/^Psalms? 98:/i.test(expectRef)) {
    const ru = localeTextForRef(root, 'ru', expectRef);
    if (!ru || /херувим/i.test(ru) || !/песн/i.test(ru)) {
      fail('Russian Synodal must map KJV Psalm 98 to LXX Psalm 97 (new song), not Psalm 98 (the LORD reigns)');
    }
  }

  Object.values(LOCALE_BIBLES).forEach((spec) => {
    const p = path.join(localeBibleDir(root), spec.file);
    if (!fs.existsSync(p)) fail('missing locale Bible ' + spec.file + ' — run node scripts/vendor-locale-bibles.mjs');
  });

  const credits = read('bible-credits.html');
  const notice = read('data/bibles/NOTICE.txt');
  const injectSrc = read('scripts/inject-locale-hub-hero.mjs');
  if (!injectSrc.includes('bible-credits.html')) {
    fail('inject-locale-hub-hero must link Bible credits on locale hubs');
  }
  [
    'Reina-Valera 1909',
    'Louis Segond 1910',
    'Almeida 1911',
    'Chinese Union Version',
    'Синодальный',
    'Bridge Connectivity Solutions',
    'CC BY-SA 4.0',
    'creativecommons.org/licenses/by-sa/4.0',
    'HelloAO',
    'eBible.org',
    'getBible.net',
    'João Ferreira de Almeida'
  ].forEach((need) => {
    if (!credits.includes(need)) fail('bible-credits.html missing credit: ' + need);
    if (!notice.includes(need) && need !== 'Chinese Union Version' && need !== 'Синодальный') {
      /* NOTICE uses English CUV / Synodal names; still require Hindi legal line */
    }
  });
  if (!notice.includes('Bridge Connectivity Solutions') || !notice.includes('CC BY-SA 4.0')) {
    fail('data/bibles/NOTICE.txt must carry Hindi IRV copyright and CC BY-SA 4.0');
  }
  if (!credits.includes('id="locale-hi"') || !credits.includes('id="locale-bibles"')) {
    fail('bible-credits.html must have #locale-bibles and #locale-hi anchors');
  }
  Object.values(LOCALE_BIBLES).forEach((spec) => {
    if (!spec.onPageCredit) fail(spec.lang + ' missing onPageCredit');
    if (/CC BY-SA/i.test(spec.license || '') && (!spec.holder || !spec.licenseUrl)) {
      fail(spec.lang + ' CC license must name holder and license URL');
    }
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
    'Ésaïe 41:10',
    '诗篇 55:22',
    '马太福音 11:28',
    'Псалом 55:22',
    'От Матфея 11:28',
    'भजन संहिता ५५:२२',
    'Psalm 55:22',
    'Matthew 11:28'
  ];

  const pages = [
    'es/index.html',
    'dist/es/index.html',
    'fr/index.html',
    'dist/fr/index.html',
    'pt/index.html',
    'dist/pt/index.html',
    'verso.html',
    'dist/verso.html',
    'zh/index.html',
    'dist/zh/index.html',
    'ru/index.html',
    'dist/ru/index.html',
    'hi/index.html',
    'dist/hi/index.html',
    'id/index.html',
    'dist/id/index.html'
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
    const langMatch = rel.match(/(?:^|\/)(es|fr|pt|zh|ru|hi|id)(?:\/|$)/);
    const lang = rel.includes('verso') ? 'es' : langMatch ? langMatch[1] : '';
    if (lang && LOCALE_BIBLES[lang]) {
      const locText = localeTextForRef(root, lang, expectRef);
      if (!locText) fail(lang + ' locale Bible missing ' + expectRef + ' — run node scripts/vendor-locale-bibles.mjs');
      if (!wrap.includes(locText)) fail(rel + ' missing locale Bible text for ' + expectRef);
      if (!wrap.includes('data-tdb-locale-bible="' + LOCALE_BIBLES[lang].name + '"')) {
        fail(rel + ' missing locale Bible stamp');
      }
      if (!wrap.includes('bible-credits.html#locale-' + lang)) {
        fail(rel + ' missing Bible credits link');
      }
      if (lang === 'hi' && !wrap.includes('Bridge Connectivity Solutions')) {
        fail(rel + ' Hindi IRV must credit Bridge Connectivity Solutions on the page');
      }
    } else if (lang === 'id') {
      if (!wrap.includes('data-tdb-locale-hub="id"')) fail(rel + ' missing Indonesian locale hub stamp');
      if (!wrap.includes(expectText)) fail(rel + ' Indonesian hub must show official KJV until a PD Indonesian Bible is vendored');
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
    'es/fr/pt/zh/ru/hi/id'
  );
}

main();
