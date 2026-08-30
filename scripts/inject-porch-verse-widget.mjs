#!/usr/bin/env node
/**
 * Inject UTC day-of-year KJV verse into porch widget shells (Explore, Plans, Family).
 * Family / Verse-of-the-Day teaching (sit, meaning, simpler English) must belong to
 * this day's reference — never leftover Psalm 100 first-paint.
 */
import fs from 'fs';
import path from 'path';
import vm from 'vm';
import { fileURLToPath } from 'url';
import { loadYear365, pickVerseForToday, utcDayOfYear } from './lib/hero-daily-verse-pick.mjs';
import { teachingForRef } from './lib/verse-teaching-floor.mjs';
import { BOOK_CHAPTER_SITUATIONS } from './lib/bible-situation-map.mjs';
import {
  buildBandFingerprints,
  evaluateTeachingFields,
  situationLooksWrongForRef,
} from './lib/verse-teaching-guard.mjs';
import { buildHeroLaymanPlain, loadVersePlainMeanings } from './lib/hero-layman-plain.mjs';

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

const DAILY_DESKS = [
  { file: 'verse.html', ids: { ref: 'daily-verse-ref', text: 'daily-verse-text' } },
  { file: 'kids-corner.html', ids: { ref: 'kids-daily-verse-ref', text: 'kids-daily-verse-text' } },
  { file: 'kids/corner.html', ids: { ref: 'kids-daily-verse-ref', text: 'kids-daily-verse-text' } },
  { file: 'church/daily.html', ids: { ref: 'church-daily-ref', text: 'church-daily-verse-text', refAlt: 'church-daily-verse-ref' } },
  { file: 'dist/verse.html', ids: { ref: 'daily-verse-ref', text: 'daily-verse-text' } },
  { file: 'dist/kids-corner.html', ids: { ref: 'kids-daily-verse-ref', text: 'kids-daily-verse-text' } },
  { file: 'dist/kids/corner.html', ids: { ref: 'kids-daily-verse-ref', text: 'kids-daily-verse-text' } },
  { file: 'dist/church/daily.html', ids: { ref: 'church-daily-ref', text: 'church-daily-verse-text', refAlt: 'church-daily-verse-ref' } }
];

const SIT_FINGERPRINTS = buildBandFingerprints(BOOK_CHAPTER_SITUATIONS);

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

function normalizeRefBare(ref) {
  return String(ref || '')
    .replace(/\s*\(KJV\)\s*$/i, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function loadHeroExplanationsMap() {
  try {
    const code = fs.readFileSync(path.join(root, 'hero-daily-365-explanations.js'), 'utf8');
    const sandbox = { console };
    sandbox.window = sandbox;
    sandbox.globalThis = sandbox;
    vm.runInNewContext(code, sandbox, { filename: 'hero-daily-365-explanations.js' });
    const list = sandbox.__TDB_HERO_DAILY_EXPLANATIONS;
    const map = Object.create(null);
    if (Array.isArray(list)) {
      for (const row of list) {
        if (!row || !row.ref) continue;
        map[normalizeRefBare(row.ref)] = row;
      }
    }
    return map;
  } catch (e) {
    return Object.create(null);
  }
}

function loadVerseContextResolver() {
  try {
    const code = fs.readFileSync(path.join(root, 'verse-context.js'), 'utf8');
    const sandbox = { console };
    sandbox.window = sandbox;
    sandbox.globalThis = sandbox;
    vm.runInNewContext(code, sandbox, { filename: 'verse-context.js' });
    return typeof sandbox.TDB_resolveVerseContext === 'function'
      ? sandbox.TDB_resolveVerseContext
      : null;
  } catch (e) {
    return null;
  }
}

function pickSituationForRef(ref, expl, resolveCtx) {
  const candidates = [];
  const fromExpl = expl && expl.setting ? String(expl.setting).replace(/\s+/g, ' ').trim() : '';
  if (fromExpl) candidates.push(fromExpl);
  if (typeof resolveCtx === 'function') {
    try {
      const hit = resolveCtx(ref) || {};
      const fromMap = String(hit.situation || hit.setting || '').replace(/\s+/g, ' ').trim();
      if (fromMap && fromMap !== fromExpl) candidates.push(fromMap);
    } catch (eCtx) {
      /* non-fatal */
    }
  }
  for (let i = 0; i < candidates.length; i++) {
    const sit = candidates[i];
    if (!sit) continue;
    if (situationLooksWrongForRef(sit, ref)) continue;
    const judged = evaluateTeachingFields({ ref, setting: sit, fingerprints: SIT_FINGERPRINTS });
    if (judged && judged.ok) return sit;
  }
  return '';
}

function loadBbeMap() {
  try {
    return JSON.parse(fs.readFileSync(path.join(root, 'data', 'bbe-full.json'), 'utf8'));
  } catch (e) {
    return null;
  }
}

function officialBbeText(map, ref) {
  if (!map) return '';
  const n = normalizeRefBare(ref);
  const raw = map[n] || map[n.replace(/^Psalm /i, 'Psalms ')] || map[n.replace(/^Psalms /i, 'Psalm ')] || '';
  return String(raw || '')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/^\s*-\s*(?:A Psalm|Of David|A Song)[^.]*\.\s*-\s*/i, '')
    .trim();
}

function injectBoundTeaching(html, ids, ref, sit, meaning, bbe) {
  if (ids.bbeHost) {
    html = html.replace(
      new RegExp('(<[^>]*\\bid="' + ids.bbeHost + '"[^>]*data-bbe-ref=")[^"]*(")'),
      '$1' + escapeHtmlAttr(ref) + '$2'
    );
  }
  if (ids.vbdHost) {
    html = html.replace(
      new RegExp('(<[^>]*\\bid="' + ids.vbdHost + '"[^>]*data-tdb-bound-ref=")[^"]*(")'),
      '$1' + escapeHtmlAttr(ref) + '$2'
    );
  }
  if (ids.bbeText && bbe) html = injectIdInner(html, ids.bbeText, escapeHtmlText(bbe));
  if (ids.sit && sit) html = injectIdInner(html, ids.sit, escapeHtmlText(sit));
  if (ids.mean && meaning) html = injectIdInner(html, ids.mean, escapeHtmlText(meaning));
  return html;
}

function fail(msg) {
  console.error('inject-porch-verse-widget:', msg);
  process.exit(1);
}

function injectIdInner(html, id, inner) {
  const re = new RegExp('(<[^>]*\\bid="' + id + '"[^>]*>)[\\s\\S]*?(</[^>]+>)');
  if (!re.test(html)) return html;
  return html.replace(re, '$1' + inner + '$2');
}

function injectDailyDesk(html, ids, refHtml, textHtml, refBare) {
  html = injectIdInner(html, ids.ref, ids.ref === 'church-daily-ref' ? refBare : refHtml);
  html = injectIdInner(html, ids.text, textHtml);
  if (ids.refAlt) html = injectIdInner(html, ids.refAlt, refHtml);
  return html;
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
const explMap = loadHeroExplanationsMap();
const resolveCtx = loadVerseContextResolver();
const expl = teachingForRef(root, refPlain, verse.text, explMap[normalizeRefBare(refPlain)] || null);
const sit = pickSituationForRef(refPlain, expl, resolveCtx);
const meaning = String((expl && expl.plain) || buildHeroLaymanPlain(refPlain, verse.text, loadVersePlainMeanings(root)) || '')
  .replace(/\s+/g, ' ')
  .trim();
const bbe = officialBbeText(loadBbeMap(), refPlain);
if (sit && situationLooksWrongForRef(sit, refPlain)) {
  fail('refused leftover situation for ' + refPlain);
}

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
    updated = injectBoundTeaching(
      updated,
      {
        bbeHost: 'familyBbeSimple',
        vbdHost: 'familyVbdPrimary',
        bbeText: 'familyBbeText',
        sit: 'familySimpleSituation',
        mean: 'familySimpleMeaning'
      },
      refPlain,
      sit,
      meaning,
      bbe
    );
  }
  fs.writeFileSync(filePath, updated);
}

for (const desk of DAILY_DESKS) {
  const filePath = path.join(root, desk.file);
  if (!fs.existsSync(filePath)) {
    if (desk.file.indexOf('dist/') === 0) continue;
    fail(desk.file + ' missing');
  }
  const original = fs.readFileSync(filePath, 'utf8');
  let updated = injectDailyDesk(original, desk.ids, refHtml, textHtml, refPlain);
  if (/verse\.html$/.test(desk.file)) {
    updated = injectBoundTeaching(
      updated,
      {
        bbeHost: 'versePageBbeSimple',
        vbdHost: 'versePageVbdPrimary',
        bbeText: 'versePageBbeText',
        sit: 'versePageSimpleSituation',
        mean: 'versePageSimpleMeaning'
      },
      refPlain,
      sit,
      meaning,
      bbe
    );
  }
  if (original === updated && !original.includes(refPlain)) {
    fail('could not stamp today into ' + desk.file);
  }
  fs.writeFileSync(filePath, updated);
}

console.log(
  'inject-porch-verse-widget: OK — ' +
    refPlain +
    ' (UTC doy ' +
    utcDayOfYear() +
    ') → explore + plans + family + verse + kids + church'
);
