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
    openEn: 'Ver el porche completo en inglés',
    creditsLink: 'Créditos de las Biblias'
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
    openEn: 'Voir le porche complet en anglais',
    creditsLink: 'Crédits des Bibles'
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
    openEn: 'Ver o alpendre completo em inglês',
    creditsLink: 'Créditos das Bíblias'
  },
  zh: {
    heading: '今日经文',
    eyebrow: '与英文首页同一日的官方经文',
    kjvNote:
      '书卷、章、节与英文首页相同。上文：和合本 1919（公有领域）。本站英文线是 KJV。',
    sit: '当时在发生什么',
    mean: '这是什么意思',
    who: '谁在说话',
    hear: '谁听见这话',
    modern: '这话怎样对着 2026 说话',
    you: '这话现在怎样对你说',
    step: '今天一个诚实的下一步',
    prayer: '一句简单的祷告',
    fallback: '这一节的讲解仍是英文。上面的经文是今天的官方经文——不是轮换的安慰句。',
    openEn: '查看完整英文门廊',
    creditsLink: '圣经版权与致谢'
  },
  ru: {
    heading: 'Стих дня',
    eyebrow: 'Тот же официальный стих, что и на английской главной',
    kjvNote:
      'Та же книга, глава и стих, что на английской главной. Текст выше: Синодальный перевод (общественное достояние). Английская линия сайта — KJV.',
    sit: 'Что происходило',
    mean: 'Что это значит',
    who: 'Кто говорит',
    hear: 'Кто это слышит',
    modern: 'Как это говорит сегодня (2026)',
    you: 'Как это говорит тебе сейчас',
    step: 'Один честный шаг только на сегодня',
    prayer: 'Простая молитва',
    fallback:
      'Разбор этого стиха пока на английском. Стих выше — официальный стих сегодняшнего дня, не утешительный стих в ротации.',
    openEn: 'Открыть полное английское крыльцо',
    creditsLink: 'Благодарности за тексты Библии'
  },
  hi: {
    heading: 'आज का वचन',
    eyebrow: 'अंग्रेज़ी होम जैसा ही आधिकारिक वचन',
    kjvNote:
      'वही पुस्तक, अध्याय और वचन जो अंग्रेज़ी होम पर है। ऊपर का पाठ: हिन्दी IRV 2019 (CC BY-SA 4.0, Bridge Connectivity Solutions)। साइट की अंग्रेज़ी पंक्ति KJV है।',
    sit: 'तब क्या हो रहा था',
    mean: 'इसका अर्थ क्या है',
    who: 'कौन बोलता है',
    hear: 'यह किस तक पहुँचता है',
    modern: 'यह आज (2026) कैसे बोलता है',
    you: 'यह अभी तुमसे कैसे बोलता है',
    step: 'आज के लिए एक ईमानदार कदम',
    prayer: 'एक सीधी प्रार्थना',
    fallback:
      'इस वचन की व्याख्या अभी अंग्रेज़ी में है। ऊपर का वचन आज का आधिकारिक वचन है — घूमता हुआ सांत्वना वचन नहीं।',
    openEn: 'पूरा अंग्रेज़ी बरामदा देखें',
    creditsLink: 'बाइबल श्रेय'
  },
  id: {
    heading: 'Ayat hari ini',
    eyebrow: 'Ayat resmi yang sama dengan beranda Inggris',
    kjvNote:
      'Kitab, pasal, dan ayat yang sama dengan beranda Inggris. Belum ada Alkitab Indonesia domain publik di situs ini; teks di atas adalah KJV.',
    sit: 'Apa yang sedang terjadi',
    mean: 'Apa artinya',
    who: 'Siapa yang berbicara',
    hear: 'Siapa yang mendengar ini',
    modern: 'Bagaimana ini berbicara hari ini (2026)',
    you: 'Bagaimana ini berbicara kepadamu sekarang',
    step: 'Satu langkah jujur, hanya untuk hari ini',
    prayer: 'Doa yang sederhana',
    fallback:
      'Pengajaran ayat ini masih dalam bahasa Inggris. Ayat di atas adalah ayat resmi hari ini — bukan ayat penghiburan yang berputar.',
    openEn: 'Lihat beranda Inggris lengkap',
    creditsLink: 'Kredit Alkitab'
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
  },
  {
    lang: 'zh',
    files: [path.join(root, 'zh', 'index.html'), path.join(root, 'dist', 'zh', 'index.html')]
  },
  {
    lang: 'ru',
    files: [path.join(root, 'ru', 'index.html'), path.join(root, 'dist', 'ru', 'index.html')]
  },
  {
    lang: 'hi',
    files: [path.join(root, 'hi', 'index.html'), path.join(root, 'dist', 'hi', 'index.html')]
  },
  {
    lang: 'id',
    files: [path.join(root, 'id', 'index.html'), path.join(root, 'dist', 'id', 'index.html')]
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
  const spec = LOCALE_BIBLES[lang] || {};
  const htmlLang = spec.htmlLang || lang;
  const fallbackNote =
    teach.teachLang !== lang
      ? '<p class="section-note" data-locale-field="fallback-note">' + escapeHtml(c.fallback) + '</p>'
      : '<p class="section-note" data-locale-field="fallback-note" hidden></p>';
  return (
    '<section class="glass tdb-porch-paper-glass pt-topic-breakdown tdb-hub-daily-wrap" lang="' +
    htmlLang +
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
    '            <p class="section-note" data-locale-field="credit">' +
    escapeHtml(
      (spec && spec.onPageCredit) ||
        'King James Version. Public domain in the United States.'
    ) +
    (spec && spec.licenseUrl && /CC BY-SA/i.test(spec.license || '')
      ? ' <a href="' + escapeHtml(spec.licenseUrl) + '" rel="license">' + escapeHtml(spec.license) + '</a>.'
      : '') +
    ' <a href="/bible-credits.html#locale-' +
    lang +
    '">' +
    escapeHtml(c.creditsLink || 'Bible credits') +
    '</a></p>\n' +
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
    const localeText = localeTextForRef(root, hub.lang, ref).replace(/\s+/g, ' ').trim() || text;
    if (spec && !localeTextForRef(root, hub.lang, ref).trim()) {
      fail(hub.lang + ' missing locale Bible text for ' + ref + ' — run node scripts/vendor-locale-bibles.mjs');
    }
    const bibleName = spec ? spec.name : 'King James Version';
    const teach = pickTeaching(hub.lang, ref, english);
    leftoverTemplateIssues(teach).forEach((issue) => {
      fail(hub.lang + ' leftover: ' + issue);
    });
    const section = buildSection(hub.lang, ref, localeText, text, bibleName, teach, ymd);
    hub.files.forEach((filePath) => {
      const label = path.relative(root, filePath);
      applyToFile(filePath, label, section);
    });
  }

  console.log('inject-locale-hub-hero: OK —', ref, '(UTC doy', utcDayOfYear() + ')', 'es/fr/pt/zh/ru/hi/id');
}

const isDirect =
  process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isDirect) injectLocaleHubHero();
