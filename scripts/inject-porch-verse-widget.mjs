#!/usr/bin/env node
/**
 * Inject UTC day-of-year KJV verse into porch widget shells (Explore, Plans, Family).
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { loadYear365, pickVerseForToday, utcDayOfYear } from './lib/hero-daily-verse-pick.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');

const TARGETS = [
  { file: 'explore.html', label: 'explore.html' },
  { file: 'plans.html', label: 'plans.html' },
  { file: 'family.html', label: 'family.html' },
  { file: 'dist/explore.html', label: 'dist/explore.html' },
  { file: 'dist/plans.html', label: 'dist/plans.html' },
  { file: 'dist/family.html', label: 'dist/family.html' }
];

function escapeHtmlText(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function fail(msg) {
  console.error('inject-porch-verse-widget:', msg);
  process.exit(1);
}

function injectFamilyDailyVerse(html, refHtml, textHtml) {
  const refIds = ['family-daily-verse-ref', 'family-quick-start-ref'];
  const textIds = ['family-daily-verse-text', 'family-quick-start-verse'];
  refIds.forEach((id) => {
    const re = new RegExp('(<p[^>]*id="' + id + '"[^>]*>)[\\s\\S]*?(</p>)');
    if (re.test(html)) html = html.replace(re, '$1' + refHtml + '$2');
  });
  textIds.forEach((id) => {
    const re = new RegExp('(<p[^>]*id="' + id + '"[^>]*>)[\\s\\S]*?(</p>)');
    if (re.test(html)) html = html.replace(re, '$1' + textHtml + '$2');
  });
  return html;
}

function injectPorchVerse(html, refHtml, textHtml) {
  const refRe = /(<p class="tdb-porch-verse-widget__ref" id="tdbPorchVerseRef">)[\s\S]*?(<\/p>)/;
  const textRe = /(<blockquote class="tdb-porch-verse-widget__text" id="tdbPorchVerseText">)[\s\S]*?(<\/blockquote>)/;
  const prebuiltRe = /(<aside[^>]*id="tdbPorchVerseWidget"[^>]*data-tdb-porch-verse-prebuilt=")[^"]*(")/;

  if (!refRe.test(html) || !textRe.test(html)) {
    return null;
  }

  html = html.replace(refRe, '$1' + refHtml + '$2');
  html = html.replace(textRe, '$1<p>' + textHtml + '</p>$2');
  if (prebuiltRe.test(html)) {
    html = html.replace(prebuiltRe, '$11$2');
  } else {
    html = html.replace(
      /id="tdbPorchVerseWidget"/,
      'id="tdbPorchVerseWidget" data-tdb-porch-verse-prebuilt="1"'
    );
  }
  return html;
}

const arr = loadYear365(root);
const verse = pickVerseForToday(arr);
if (!verse || !verse.ref || !verse.text) {
  fail('no verse picked for today');
}

const refPlain = verse.ref.replace(/\s*\(KJV\)\s*$/i, '').trim();
const refHtml = escapeHtmlText(refPlain + ' (KJV)');
const textHtml = escapeHtmlText('\u201c' + verse.text + '\u201d');

for (const target of TARGETS) {
  const filePath = path.join(root, target.file);
  if (!fs.existsSync(filePath)) {
    if (target.file.indexOf('dist/') === 0) {
      fail(target.file + ' missing — run build-copy-static first');
    }
    continue;
  }
  const original = fs.readFileSync(filePath, 'utf8');
  let updated = injectPorchVerse(original, refHtml, textHtml);
  if (!updated) {
    fail('tdbPorchVerseRef / tdbPorchVerseText markers missing in ' + target.label);
  }
  if (/family\.html$/.test(target.file)) {
    updated = injectFamilyDailyVerse(updated, refHtml, textHtml);
  }
  fs.writeFileSync(filePath, updated);
}

console.log(
  'inject-porch-verse-widget: OK — ' +
    refPlain +
    ' (UTC doy ' +
    utcDayOfYear() +
    ') → explore + plans + family'
);
