#!/usr/bin/env node
/**
 * After build-copy-static, inject UTC day-of-year hero verse into dist/index.html so the parser can
 * paint verse text before deferred hero scripts run. Adds data-tdb-hero-prebuilt="1" for first-paint
 * logic (DOM verse until hero-daily-365-data.js loads). Verse source: hero-daily-365-data.js.
 */
import fs from 'fs';
import path from 'path';
import vm from 'vm';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const distIndex = path.join(root, 'dist', 'index.html');
const dataPath = path.join(root, 'hero-daily-365-data.js');

function fail(msg) {
  console.error('inject-home-hero:', msg);
  process.exit(1);
}

function loadYear365() {
  const code = fs.readFileSync(dataPath, 'utf8');
  const ctx = {};
  ctx.window = ctx;
  ctx.globalThis = ctx;
  vm.createContext(ctx);
  vm.runInContext(code, ctx);
  const arr = ctx.__TDB_HERO_DAILY_YEAR;
  if (!Array.isArray(arr) || !arr.length) {
    fail('could not read __TDB_HERO_DAILY_YEAR from hero-daily-365-data.js');
  }
  return arr;
}

function utcDayOfYear() {
  const d = new Date();
  const y = d.getUTCFullYear();
  const jan1 = Date.UTC(y, 0, 1);
  const todayUtc = Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate());
  return Math.floor((todayUtc - jan1) / 86400000) + 1;
}

function pickVerse(arr) {
  const dayOfYear = utcDayOfYear();
  const idx = (dayOfYear - 1) % arr.length;
  return arr[idx];
}

function escapeHtmlText(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
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
  const year365 = loadYear365();
  const v = pickVerse(year365);
  if (!v || !v.ref || !v.text) {
    fail('invalid verse from 365 list');
  }

  const refPlain = String(v.ref).trim();
  const textPlain = String(v.text).trim();
  const verseInner = '\u201c' + escapeHtmlText(textPlain) + '\u201d';
  const refInner = escapeHtmlText(refPlain) + ' (KJV)';

  let html = fs.readFileSync(distIndex, 'utf8');

  const heroVerseRe = /<p class="hero-verse is-visible" id="heroVerse"[^>]*>[\s\S]*?<\/p>/;
  if (!heroVerseRe.test(html)) fail('could not find #heroVerse paragraph in dist/index.html');
  html = html.replace(
    heroVerseRe,
    '<p class="hero-verse is-visible" id="heroVerse" elementtiming="tdb-hero-verse">' + verseInner + '</p>'
  );

  const heroRefRe = /<p class="verse-ref" id="heroRef">[\s\S]*?<\/p>/;
  if (!heroRefRe.test(html)) fail('could not find #heroRef in dist/index.html');
  html = html.replace(heroRefRe, '<p class="verse-ref" id="heroRef">' + refInner + '</p>');

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
    'Today\u2019s Daily Battle: ' + refPlain + ' \u2014 Daily KJV Verse';
  const desc =
    'Today\u2019s verse: ' +
    refPlain +
    ' (KJV). Search by how you\u2019re really feeling, quiet prayer wall, works offline. No ads, no login, no mess.';

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

  fs.writeFileSync(distIndex, html, 'utf8');
  console.log('inject-home-hero: OK —', refPlain, '(UTC doy', utcDayOfYear() + ')');
}

main();
