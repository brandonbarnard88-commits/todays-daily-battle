#!/usr/bin/env node
/**
 * Put today’s official KJV (same UTC queue as English home) on ES/FR/PT hubs.
 * Removes leftover rotating comfort verses that were not today’s calendar.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { loadYear365, pickVerseForToday, utcDayOfYear } from './lib/hero-daily-verse-pick.mjs';
import { teachingForRef, kjvTextForRef } from './lib/verse-teaching-floor.mjs';
import { leftoverTemplateIssues } from './lib/teaching-quality.mjs';
import { LOCALE_BIBLES, localeTextForRef } from './lib/locale-bible.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');

const COPY = {
  es: {
    heading: 'Verso del día',
    eyebrow: 'El mismo versículo oficial que el inicio en inglés',
    kjvNote:
      'Mismo libro, capítulo y versículo que el inicio en inglés. Texto arriba: Reina-Valera 1909 (dominio público). La línea inglesa del sitio es KJV.',
    sit: 'Qué ocurría',
    mean: 'Qué significa',
    who: 'Quién habla',
    hear: 'Quién oye esto',
    modern: 'Cómo habla hoy (2026)',
    you: 'Cómo te habla ahora',
    step: 'Un paso honesto, sólo para hoy',
    prayer: 'Una oración sencilla',
    fallback:
      'La enseñanza de este versículo aún está en inglés. El versículo de arriba es el oficial de hoy — no un versículo de consuelo rotado.',
    openEn: 'Ver el porche completo en inglés'
  },
  fr: {
    heading: 'Verset du jour',
    eyebrow: 'Le même verset officiel que l’accueil anglais',
    kjvNote:
      'Même livre, chapitre et verset que l’accueil anglais. Texte ci-dessus : Louis Segond 1910 (domaine public). La ligne anglaise du site est la KJV.',
    sit: 'Ce qui se passait',
    mean: 'Ce que cela veut dire',
    who: 'Qui parle',
    hear: 'Qui entend ceci',
    modern: 'Comment cela parle aujourd’hui (2026)',
    you: 'Comment cela te parle maintenant',
    step: 'Un pas honnête, pour aujourd’hui seulement',
    prayer: 'Une prière simple',
    fallback:
      'L’enseignement de ce verset est encore en anglais. Le verset ci-dessus est le verset officiel d’aujourd’hui — pas un verset de réconfort en rotation.',
    openEn: 'Voir le porche complet en anglais'
  },
  pt: {
    heading: 'Versículo do dia',
    eyebrow: 'O mesmo versículo oficial que a página inicial em inglês',
    kjvNote:
      'O mesmo livro, capítulo e versículo que a página inicial em inglês. Texto acima: Almeida 1911 (domínio público). A linha inglesa do sítio é a KJV.',
    sit: 'O que se passava',
    mean: 'O que isto significa',
    who: 'Quem fala',
    hear: 'Quem ouve isto',
    modern: 'Como fala hoje (2026)',
    you: 'Como te fala agora',
    step: 'Um passo honesto, só para hoje',
    prayer: 'Uma oração simples',
    fallback:
      'O ensino deste versículo ainda está em inglês. O versículo acima é o oficial de hoje — não um versículo de consolo a rodá-lo.',
    openEn: 'Ver o alpendre completo em inglês'
  }
};

const HUBS = [
  {
    lang: 'es',
    files: [
      path.join(root, 'es', 'index.html'),
      path.join(root, 'dist', 'es', 'index.html'),
      path.join(root, 'verso.html'),
      path.join(root, 'dist', 'verso.html')
    ]
  },
  {
    lang: 'fr',
    files: [path.join(root, 'fr', 'index.html'), path.join(root, 'dist', 'fr', 'index.html')]
  },
  {
    lang: 'pt',
    files: [path.join(root, 'pt', 'index.html'), path.join(root, 'dist', 'pt', 'index.html')]
  }
];

function fail(msg) {
  console.error('inject-locale-hub-hero:', msg);
  process.exit(1);
}

function escapeHtml(s) {
  return String(s || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function loadLocaleTeaching() {
  const p = path.join(root, 'data', 'locale-hub-teaching.json');
  try {
    return JSON.parse(fs.readFileSync(p, 'utf8'));
  } catch (e) {
    return {};
  }
}

function pickTeaching(lang, ref, english) {
  const pack = loadLocaleTeaching();
  const loc = pack[ref] && pack[ref][lang];
  if (loc && String(loc.plain || '').trim()) {
    return { ...english, ...loc, teachLang: lang };
  }
  return { ...english, teachLang: 'en' };
}

function buildSection(lang, ref, localeText, kjvText, bibleName, teach, ymd) {
  const c = COPY[lang];
  const fallbackNote =
    teach.teachLang !== lang
      ? '<p class="section-note" data-locale-field="fallback-note">' + escapeHtml(c.fallback) + '</p>'
      : '<p class="section-note" data-locale-field="fallback-note" hidden></p>';
  return (
    '<section class="glass tdb-porch-paper-glass pt-topic-breakdown tdb-hub-daily-wrap" lang="' +
    lang +
    '" id="' +
    lang +
    '-hub-daily-verse" data-tdb-locale-hub="' +
    lang +
    '" data-tdb-hero-ymd="' +
    escapeHtml(ymd) +
    '" data-tdb-bound-ref="' +
    escapeHtml(ref) +
    '" data-tdb-locale-bible="' +
    escapeHtml(bibleName) +
    '" aria-labelledby="' +
    lang +
    '-daily-heading">\n' +
    '          <div class="breakdown">\n' +
    '            <h2 class="section-divider" id="' +
    lang +
    '-daily-heading">' +
    escapeHtml(c.heading) +
    '</h2>\n' +
    '            <p class="tdb-hub-daily-eyebrow">' +
    escapeHtml(c.eyebrow) +
    '</p>\n' +
    '            <p class="big-kjv verse-ref" data-locale-field="ref"><strong>' +
    escapeHtml(ref) +
    ' (' +
    escapeHtml(bibleName) +
    ')</strong></p>\n' +
    '            <p class="hero-verse verse-body" data-locale-field="verse">\u201c' +
    escapeHtml(localeText) +
    '\u201d</p>\n' +
    '            <p class="section-note">' +
    escapeHtml(c.kjvNote) +
    '</p>\n' +
    '            <p class="section-note" data-locale-field="kjv-line"><strong>' +
    escapeHtml(ref) +
    ' (KJV)</strong> \u201c' +
    escapeHtml(kjvText) +
    '\u201d</p>\n' +
    fallbackNote +
    '            <p class="section-note"><strong>' +
    escapeHtml(c.sit) +
    '</strong></p>\n' +
    '            <p data-locale-field="situation">' +
    escapeHtml(teach.setting || teach.situation || '') +
    '</p>\n' +
    '            <p class="section-note"><strong>' +
    escapeHtml(c.mean) +
    '</strong></p>\n' +
    '            <p data-locale-field="plain">' +
    escapeHtml(teach.plain || '') +
    '</p>\n' +
    '            <p class="section-note"><strong>' +
    escapeHtml(c.who) +
    '</strong></p>\n' +
    '            <p data-locale-field="about">' +
    escapeHtml(teach.about || '') +
    '</p>\n' +
    '            <p class="section-note"><strong>' +
    escapeHtml(c.hear) +
    '</strong></p>\n' +
    '            <p data-locale-field="to">' +
    escapeHtml(teach.to || '') +
    '</p>\n' +
    '            <p class="section-note"><strong>' +
    escapeHtml(c.modern) +
    '</strong></p>\n' +
    '            <p data-locale-field="modernApplication">' +
    escapeHtml(teach.modernApplication || '') +
    '</p>\n' +
    '            <p class="section-note"><strong>' +
    escapeHtml(c.you) +
    '</strong></p>\n' +
    '            <p data-locale-field="today">' +
    escapeHtml(teach.today || '') +
    '</p>\n' +
    '            <p class="section-note"><strong>' +
    escapeHtml(c.step) +
    '</strong></p>\n' +
    '            <p data-locale-field="step">' +
    escapeHtml(teach.step || '') +
    '</p>\n' +
    '            <p class="section-note"><strong>' +
    escapeHtml(c.prayer) +
    '</strong></p>\n' +
    '            <p data-locale-field="prayer">' +
    escapeHtml(teach.prayer || '') +
    '</p>\n' +
    '            <div class="cta-group" style="margin-top:1rem;">\n' +
    '              <a class="btn btn-secondary" href="/" hreflang="en">' +
    escapeHtml(c.openEn) +
    '</a>\n' +
    '            </div>\n' +
    '          </div>\n' +
    '        </section>'
  );
}

const SECTION_RE = /<section\b[^>]*tdb-hub-daily-wrap[^>]*>[\s\S]*?<\/section>/;

function applyToFile(filePath, label, sectionHtml) {
  if (!fs.existsSync(filePath)) return false;
  const html = fs.readFileSync(filePath, 'utf8');
  if (!SECTION_RE.test(html)) {
    if (label.includes('dist' + path.sep) || label.startsWith('dist/')) return false;
    fail('could not find daily-verse section in ' + label);
  }
  if (/data-tdb-hub-daily-rotate/.test(sectionHtml)) fail('inject must not keep leftover rotate panels');
  const next = html.replace(SECTION_RE, sectionHtml);
  if (/data-tdb-hub-daily-rotate/.test(next)) fail(label + ' still has leftover rotate verses');
  fs.writeFileSync(filePath, next, 'utf8');
  return true;
}

export function injectLocaleHubHero() {
  const year365 = loadYear365(root);
  const v = pickVerseForToday(year365);
  if (!v || !v.ref) fail('invalid official verse');
  const ref = String(v.ref).trim();
  const official = kjvTextForRef(root, ref);
  const text = String(official && official.length >= String(v.text || '').length ? official : v.text)
    .replace(/\s+/g, ' ')
    .trim();
  if (!text) fail('empty official KJV');
  const english = teachingForRef(root, ref, text, null);
  const ymd = new Date().toISOString().slice(0, 10);

  const distVerso = path.join(root, 'dist', 'verso.html');
  const srcVerso = path.join(root, 'verso.html');
  if (fs.existsSync(path.join(root, 'dist')) && fs.existsSync(srcVerso)) {
    fs.copyFileSync(srcVerso, distVerso);
  }

  for (const hub of HUBS) {
    const spec = LOCALE_BIBLES[hub.lang];
    const localeText = localeTextForRef(root, hub.lang, ref).replace(/\s+/g, ' ').trim();
    if (!localeText) fail(hub.lang + ' missing locale Bible text for ' + ref + ' — run node scripts/vendor-locale-bibles.mjs');
    const teach = pickTeaching(hub.lang, ref, english);
    leftoverTemplateIssues(teach).forEach((issue) => {
      fail(hub.lang + ' leftover: ' + issue);
    });
    const section = buildSection(hub.lang, ref, localeText, text, spec.name, teach, ymd);
    hub.files.forEach((filePath) => {
      const label = path.relative(root, filePath);
      applyToFile(filePath, label, section);
    });
  }

  console.log('inject-locale-hub-hero: OK —', ref, '(UTC doy', utcDayOfYear() + ')', 'es/fr/pt + verso');
}

const isDirect =
  process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isDirect) injectLocaleHubHero();
