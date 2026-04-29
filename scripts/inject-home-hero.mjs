#!/usr/bin/env node
/**
 * After build-copy-static, inject UTC day-of-year hero verse into dist/index.html so the parser can
 * paint verse text before deferred hero scripts run. Adds data-tdb-hero-prebuilt="1" for first-paint
 * logic (DOM verse until hero-daily-365-data.js loads). Verse source: hero-daily-365-data.js.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { loadYear365, pickVerseForToday, utcDayOfYear } from './lib/hero-daily-verse-pick.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const distIndex = path.join(root, 'dist', 'index.html');

function fail(msg) {
  console.error('inject-home-hero:', msg);
  process.exit(1);
}

function escapeHtmlText(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function normalizeRefBare(ref) {
  return String(ref || '')
    .replace(/\uFEFF/g, '')
    .replace(/\*\*/g, '')
    .replace(/\s*\(KJV\)\s*$/i, '')
    .replace(/^Matt\b\.?\s+/i, 'Matthew ')
    .replace(/^Mt\.?\s+/i, 'Matthew ')
    .replace(/\s+/g, ' ')
    .trim();
}

function normalizeHeroKjvLine(t) {
  let s = String(t == null ? '' : t).replace(/\uFEFF/g, '');
  s = s.replace(/\*\*([^*]{0,400}?)\*\*/g, '$1').replace(/\*([^*\n]{0,400}?)\*/g, '$1');
  s = s.replace(/__([^_]{0,400}?)__/g, '$1');
  s = s.replace(/\s+/g, ' ').trim();
  if (/^are the light of the world\.?$/i.test(s)) {
    s = 'Ye are the light of the world.';
  }
  if (/^[\"'\u201c\u2018\u201d\u2019]*\s*are the light of the world\.?\s*[\"'\u201c\u201d]*$/i.test(s)) {
    s = 'Ye are the light of the world.';
  }
  if (s.length <= 220 && !/\bye\b/i.test(s) && /\bare the light of the world\.?$/i.test(s.trim())) {
    s = 'Ye are the light of the world.';
  }
  return s;
}

function escapeHtmlAttr(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function buildReadChapterHref(refStr) {
  const m = refStr.match(/^(.+?)\s+(\d+):\d+/);
  if (!m) return null;
  const book = encodeURIComponent(m[1].trim());
  const chapter = encodeURIComponent(m[2]);
  return (
    'reader.html?book=' +
    book +
    '&chapter=' +
    chapter +
    '&ref=' +
    encodeURIComponent(refStr.trim().replace(/\s+/g, ' '))
  );
}

function main() {
  if (!fs.existsSync(distIndex)) {
    fail('dist/index.html missing — run build-copy-static first.');
  }
  const year365 = loadYear365(root);
  const v = pickVerseForToday(year365);
  if (!v || !v.ref || !v.text) {
    fail('invalid verse from 365 list');
  }

  const refPlain = String(v.ref).trim();
  const refNorm = normalizeRefBare(refPlain);
  let textPlain = normalizeHeroKjvLine(v.text);
  if (/^matthew\s+5\s*:\s*14$/i.test(refNorm) && !/^ye\s+/i.test(textPlain.replace(/\uFEFF/g, '').trim())) {
    textPlain = 'Ye are the light of the world.';
  }
  const verseInner = '\u201c' + escapeHtmlText(textPlain) + '\u201d';
  const refInner = escapeHtmlText(refPlain) + ' (KJV)';

  let html = fs.readFileSync(distIndex, 'utf8');

  const heroVerseRe = /<p[^>]*\bid="heroVerse"[^>]*>[\s\S]*?<\/p>/;
  if (!heroVerseRe.test(html)) fail('could not find #heroVerse paragraph in dist/index.html');
  html = html.replace(
    heroVerseRe,
    '<p class="hero-verse verse-body is-visible" id="heroVerse" elementtiming="tdb-hero-verse">' + verseInner + '</p>'
  );

  const heroRefRe = /<p[^>]*\bid="heroRef"[^>]*>[\s\S]*?<\/p>/;
  if (!heroRefRe.test(html)) fail('could not find #heroRef in dist/index.html');
  html = html.replace(
    heroRefRe,
    '<p class="big-kjv verse-ref hero-daily-ref-above" id="heroRef"><strong>' + escapeHtmlText(refPlain) + ' (KJV)</strong></p>'
  );

  if (!html.includes('data-tdb-hero-prebuilt')) {
    const verseCardRe = /<section\b[^>]*\bid="verseCard"[^>]*>/;
    if (!verseCardRe.test(html)) fail('could not find #verseCard <section> in dist/index.html');
    html = html.replace(verseCardRe, function (full) {
      if (full.includes('data-tdb-hero-prebuilt')) return full;
      return full.slice(0, -1) + ' data-tdb-hero-prebuilt="1">';
    });
  }

  html = html.replace(/<button([^>]*id="heroWordStudyBtn"[^>]*)>/, function (_full, inner) {
    let u = inner.replace(
      /data-tdb-wordstudy-ref="[^"]*"/,
      'data-tdb-wordstudy-ref="' + escapeHtmlAttr(refPlain) + '"'
    );
    u = u.replace(
      /data-tdb-wordstudy-text="[^"]*"/,
      'data-tdb-wordstudy-text="' + escapeHtmlAttr(textPlain) + '"'
    );
    return '<button' + u + '>';
  });

  html = html.replace(
    /<p class="verse-img-text" id="verseImgText"><\/p>/,
    '<p class="verse-img-text" id="verseImgText">' + verseInner + '</p>'
  );
  html = html.replace(
    /<p class="verse-img-ref" id="verseImgRef"><\/p>/,
    '<p class="verse-img-ref" id="verseImgRef">' + escapeHtmlText(refPlain) + '</p>'
  );

  const href = buildReadChapterHref(refPlain);
  if (href) {
    const m2 = refPlain.match(/^(.+?)\s+(\d+):\d+/);
    const alabel = m2
      ? 'Read ' + m2[1].trim() + ' chapter ' + m2[2] + ' in full context'
      : 'Read the full chapter';
    const linkRe =
      /<a href="[^"]*" id="readChapterLink" class="read-chapter-link"[^>]*>/;
    if (linkRe.test(html)) {
      html = html.replace(
        linkRe,
        '<a href="' +
          href +
          '" id="readChapterLink" class="read-chapter-link" aria-label="' +
          escapeHtmlAttr(alabel) +
          '">'
      );
    }
  }

  const title =
    'God\u2019s University of Life \u2014 Today\u2019s Verse \u2014 ' + refPlain + ' (KJV)';
  const desc =
    'Today\u2019s KJV verse: ' +
    refPlain +
    '. God\u2019s University of Life\u2014quiet campus, search by how you feel, prayer wall, works offline. No ads, no login, no grades.';

  html = html.replace(/<title>[^<]*<\/title>/, '<title>' + escapeHtmlText(title) + '</title>');
  html = html.replace(
    /<meta name="description" content="[^"]*"/,
    '<meta name="description" content="' + escapeHtmlAttr(desc) + '"'
  );
  html = html.replace(
    /<meta property="og:title" content="[^"]*"/,
    '<meta property="og:title" content="' + escapeHtmlAttr(title) + '"'
  );
  html = html.replace(
    /<meta property="og:description" content="[^"]*"/,
    '<meta property="og:description" content="' + escapeHtmlAttr(desc) + '"'
  );
  html = html.replace(
    /<meta name="twitter:title" content="[^"]*"/,
    '<meta name="twitter:title" content="' + escapeHtmlAttr(title) + '"'
  );
  html = html.replace(
    /<meta name="twitter:description" content="[^"]*"/,
    '<meta name="twitter:description" content="' + escapeHtmlAttr(desc) + '"'
  );

  var appleShort = 'Quiet place · ' + refPlain;
  if (appleShort.length > 29) {
    appleShort = refPlain.length > 26 ? refPlain.slice(0, 24) + '…' : refPlain;
  }
  html = html.replace(
    /<meta name="apple-mobile-web-app-title" content="[^"]*"/,
    '<meta name="apple-mobile-web-app-title" content="' + escapeHtmlAttr(appleShort) + '"'
  );

  fs.writeFileSync(distIndex, html, 'utf8');

  // Match preloads in index.html + verse.html — must exist on origin before SW install or 404 in console.
  const distDir = path.join(root, 'dist');
  const verseJson = (verse, dayOfYear) =>
    JSON.stringify(
      {
        ref: String(verse.ref).trim(),
        text: String(verse.text).trim(),
        dayOfYear,
        source: 'hero-daily-365',
      },
      null,
      0
    ) + '\n';
  const yDate = new Date();
  yDate.setUTCDate(yDate.getUTCDate() - 1);
  const vYesterday = pickVerseForToday(year365, yDate);
  fs.writeFileSync(path.join(distDir, 'today-kjv-verse.json'), verseJson(v, utcDayOfYear()), 'utf8');
  fs.writeFileSync(
    path.join(distDir, 'yesterday-kjv-verse.json'),
    verseJson(vYesterday, utcDayOfYear(yDate)),
    'utf8'
  );

  console.log('inject-home-hero: OK —', refPlain, '(UTC doy', utcDayOfYear() + ')');
}

main();
