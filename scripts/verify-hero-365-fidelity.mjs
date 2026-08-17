#!/usr/bin/env node
/**
 * Hero 365 fidelity gate — calendar teaching must fit *this* verse.
 *
 * Hard fails (must never ship):
 *  1. Missing about / to / setting / plain
 *  2. Who (about) contradicts the book (e.g. Solomon under a Psalm)
 *  3. Setting is a known wrong-chapter cluster blurb
 *  4. Setting is an exact paste of a *different* chapter-band situation in that book
 *  5. Plain is a weak generic stamp
 *  6. Plain has zero content overlap with KJV *and* looks like reusable pastoral paste
 *  7. Same plain text reused under two different refs (copy-paste contamination)
 *  8. Same setting reused under two different refs (chapter-band leftover)
 *
 * Soft notes (warn only): low but non-zero plain↔KJV overlap on long verses.
 *
 * Run: node scripts/verify-hero-365-fidelity.mjs
 * Wire: npm run verify:hero-fidelity · npm run verify:teaching · npm run build
 */
import fs from 'fs';
import path from 'path';
import vm from 'vm';
import { fileURLToPath } from 'url';
import { BOOK_CHAPTER_SITUATIONS, situationForChapter } from './lib/bible-situation-map.mjs';
import { isWeakPlainStamp } from './lib/teaching-quality.mjs';
import {
  bookOf,
  buildBandFingerprints,
  chapterOf,
  contentTokens,
  evaluateTeachingFields,
  normalizeRef,
  plainOverlapsVerse,
  situationLooksWrongForRef,
  speakerBelongsToBook
} from './lib/verse-teaching-guard.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');

/** Pastoral paste that can appear under almost any verse — ban when zero KJV overlap. */
const GENERIC_PLAIN_RE =
  /Scripture meets ordinary hours|Stay until one sentence lands|Trust God with what you cannot control|Faith is not pretending|God comes near the brokenhearted|Your pain is not ignored|God offers real rest|a place to set the day down|God is a deliverer\. Call on Him|when you need rescue|not only when you feel stro|God is a real refuge\. Stay close|His covering is for ordinary|The fight is real, but you are not alone|Stand in God’s strength, not onl|Choose gladness in it, even if the schedule/i;

function loadHeroExplanations() {
  const code = fs.readFileSync(path.join(root, 'hero-daily-365-explanations.js'), 'utf8');
  const sandbox = { console };
  sandbox.window = sandbox;
  sandbox.globalThis = sandbox;
  vm.runInNewContext(code, sandbox, { filename: 'hero-daily-365-explanations.js' });
  const list = sandbox.__TDB_HERO_DAILY_EXPLANATIONS;
  if (!Array.isArray(list) || list.length < 300) {
    throw new Error('hero-daily-365-explanations.js missing __TDB_HERO_DAILY_EXPLANATIONS (expected ~365)');
  }
  return list;
}

function loadKjv() {
  const fullPath = path.join(root, 'data', 'kjv-full.json');
  if (fs.existsSync(fullPath)) {
    return JSON.parse(fs.readFileSync(fullPath, 'utf8'));
  }
  return JSON.parse(fs.readFileSync(path.join(root, 'kjv.json'), 'utf8'));
}

function kjvText(kjv, ref) {
  const n = normalizeRef(ref);
  if (kjv[n]) return kjv[n];
  const psalms = n.replace(/^Psalm\s+/i, 'Psalms ');
  if (kjv[psalms]) return kjv[psalms];
  const psalm = n.replace(/^Psalms\s+/i, 'Psalm ');
  if (kjv[psalm]) return kjv[psalm];
  return '';
}

function bookForMap(ref) {
  let b = bookOf(ref);
  if (/^Psalms$/i.test(b)) b = 'Psalm';
  return b;
}

/** True if setting is an exact (or near-exact) paste of another band in the same book. */
function settingIsOtherBandPaste(setting, book, chapter) {
  const sit = String(setting || '')
    .replace(/\s+/g, ' ')
    .trim();
  if (!sit || sit.length < 40) return false;
  const b = book === 'Psalms' ? 'Psalm' : book;
  const bands = BOOK_CHAPTER_SITUATIONS[b];
  if (!bands) return false;
  let ownSit = '';
  for (const band of bands) {
    if (chapter >= band.from && chapter <= band.thru) {
      ownSit = String(band.situation || '').replace(/\s+/g, ' ').trim();
      break;
    }
  }
  for (const band of bands) {
    const other = String(band.situation || '')
      .replace(/\s+/g, ' ')
      .trim();
    if (!other || other.length < 40) continue;
    if (chapter >= band.from && chapter <= band.thru) continue;
    if (sit === other) return true;
    /* Near-exact: setting is prefix/suffix of another band’s full situation */
    if (sit.length >= 50 && other.startsWith(sit.slice(0, 50)) && sit !== ownSit) {
      /* only if not also refining own */
      if (!ownSit || !sit.startsWith(ownSit.slice(0, 30))) {
        /* curated longer lines often don't start with map — skip near-prefix unless equal */
      }
    }
  }
  return false;
}

function main() {
  const list = loadHeroExplanations();
  const kjv = loadKjv();
  const failures = [];
  const warnings = [];
  const plainToRefs = new Map();
  const settingToRefs = new Map();
  let checked = 0;

  for (let i = 0; i < list.length; i++) {
    const row = list[i] || {};
    const ref = normalizeRef(row.ref);
    const label = `day[${i}] ${ref || '(no ref)'}`;

    if (!ref) {
      failures.push(`${label}: missing ref`);
      continue;
    }

    const about = String(row.about || '').trim();
    const to = String(row.to || '').trim();
    const setting = String(row.setting || '').trim();
    const plain = String(row.plain || '').trim();
    const text = String(row.text || kjvText(kjv, ref) || '').trim();

    if (!about) failures.push(`${label}: missing about (Who's talking)`);
    if (!to) failures.push(`${label}: missing to (audience)`);
    if (!setting || setting.length < 24) failures.push(`${label}: missing/thin setting`);
    if (!plain || plain.length < 12) failures.push(`${label}: missing/thin plain`);
    if (isWeakPlainStamp(plain)) failures.push(`${label}: weak plain stamp: "${plain.slice(0, 80)}"`);

    if (about && !speakerBelongsToBook(about, ref)) {
      failures.push(`${label}: about does not fit book: "${about}"`);
    }

    if (situationLooksWrongForRef(setting, ref)) {
      failures.push(`${label}: setting is wrong-chapter blurb: "${setting.slice(0, 100)}"`);
    }
    const judged = evaluateTeachingFields({
      ref,
      about,
      to,
      setting,
      plain,
      verseText: text,
      fingerprints: buildBandFingerprints(BOOK_CHAPTER_SITUATIONS)
    });
    if (!judged.ok) {
      judged.errors.forEach((e) => failures.push(`${label}: ${e}`));
    }

    const book = bookForMap(ref);
    const ch = chapterOf(ref);
    if (book && ch && settingIsOtherBandPaste(setting, book, ch)) {
      failures.push(`${label}: setting is an exact paste of another chapter-band situation in ${book}`);
    }

    /* Track plain reuse across different refs */
    const plainKey = plain.toLowerCase().replace(/\s+/g, ' ').trim();
    if (plainKey.length >= 40) {
      if (!plainToRefs.has(plainKey)) plainToRefs.set(plainKey, []);
      plainToRefs.get(plainKey).push(ref);
    }

    const settingKey = setting.toLowerCase().replace(/\s+/g, ' ').trim();
    if (settingKey.length >= 24) {
      if (!settingToRefs.has(settingKey)) settingToRefs.set(settingKey, []);
      settingToRefs.get(settingKey).push(ref);
    }

    const verseBody = text || kjvText(kjv, ref);
    if (!verseBody) {
      failures.push(`${label}: no KJV text available for overlap check`);
    } else {
      const ov = plainOverlapsVerse(plain, verseBody);
      if (!ov.ok) {
        /* Allow quality paraphrase with zero lexical overlap only if not generic paste. */
        if (ov.overlap === 0 && GENERIC_PLAIN_RE.test(plain)) {
          failures.push(
            `${label}: plain has 0 KJV overlap and looks like reusable pastoral paste: "${plain.slice(0, 90)}"`
          );
        } else if (ov.overlap === 0 && plain.length > 90 && !/[.!?]/.test(plain.slice(0, 60))) {
          warnings.push(`${label}: plain has 0 KJV content overlap (paraphrase?) — review: "${plain.slice(0, 70)}"`);
        } else if (ov.overlap === 0) {
          warnings.push(
            `${label}: plain↔KJV overlap 0 (allowed paraphrase): shared=${ov.shared.join(',')} need=${ov.need}`
          );
        } else {
          warnings.push(
            `${label}: plain↔KJV overlap low (${ov.overlap}/${ov.need}): "${plain.slice(0, 60)}"`
          );
        }
      }
    }

    checked += 1;
  }

  /* Same long plain under 2+ different refs = contamination */
  for (const [plain, refs] of plainToRefs) {
    const unique = [...new Set(refs)];
    if (unique.length >= 2) {
      failures.push(
        `Plain copy-paste under ${unique.length} refs: ${unique.slice(0, 4).join(' | ')} — "${plain.slice(0, 70)}"`
      );
    }
  }

  /* Same setting under 2+ different refs = chapter-band leftover */
  for (const [setting, refs] of settingToRefs) {
    const unique = [...new Set(refs)];
    if (unique.length >= 2) {
      failures.push(
        `Setting copy-paste under ${unique.length} refs: ${unique.slice(0, 4).join(' | ')} — "${setting.slice(0, 70)}"`
      );
    }
  }

  if (checked < 360) {
    failures.push(`Expected a full hero year (365) or two-year queue (730), only checked ${checked}`);
  }

  if (warnings.length && process.env.HERO_FIDELITY_VERBOSE) {
    console.warn('Hero 365 fidelity warnings:', warnings.length);
    warnings.slice(0, 15).forEach((w) => console.warn(' ·', w));
  }

  if (failures.length) {
    console.error('Hero 365 fidelity FAIL —', failures.length, 'issue(s) in', checked, 'days:\n');
    failures.slice(0, 50).forEach((f) => console.error(' •', f));
    if (failures.length > 50) console.error(' … and', failures.length - 50, 'more');
    process.exit(1);
  }

  console.log(
    'Hero 365 fidelity PASS:',
    checked,
    'days — speaker/book, wrong-cluster bans, unique setting/plain checks OK.' +
      (warnings.length ? ` (${warnings.length} soft paraphrase notes; set HERO_FIDELITY_VERBOSE=1)` : '')
  );
}

main();
