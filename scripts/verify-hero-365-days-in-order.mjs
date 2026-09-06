#!/usr/bin/env node
/**
 * Walk the next 365 hero days in calendar order and refuse leftover or false KJV.
 *
 * Starting at today’s UTC day-of-year, then wrapping the year:
 *  1. Calendar ref has an explanation
 *  2. Displayed KJV is the official verse (or a true in-order excerpt)
 *  3. Who / situation / meaning cannot belong to another book (leftover lock)
 *  4. Missing teaching fields fail
 *
 * Run: node scripts/verify-hero-365-days-in-order.mjs
 * Wire: verify:teaching · build
 */
import fs from 'fs';
import path from 'path';
import vm from 'vm';
import { fileURLToPath } from 'url';
import { loadYear365, utcDayOfYear, utcDaysSinceHeroEpoch, pickVerseAtOffset } from './lib/hero-daily-verse-pick.mjs';
import { adjacentSameChapterPairs } from './lib/hero-calendar-spread.mjs';
import { BOOK_CHAPTER_SITUATIONS } from './lib/bible-situation-map.mjs';
import { isWeakPlainStamp } from './lib/teaching-quality.mjs';
import {
  normalizeRef,
  situationLooksWrongForRef,
  speakerBelongsToBook,
  evaluateTeachingFields,
  buildBandFingerprints,
  leadingSpeakerInText
} from './lib/verse-teaching-guard.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');

function loadExplanations() {
  const code = fs.readFileSync(path.join(root, 'hero-daily-365-explanations.js'), 'utf8');
  const sandbox = { console };
  sandbox.window = sandbox;
  sandbox.globalThis = sandbox;
  vm.runInNewContext(code, sandbox, { filename: 'hero-daily-365-explanations.js' });
  const list = sandbox.__TDB_HERO_DAILY_EXPLANATIONS;
  if (!Array.isArray(list) || list.length < 300) {
    throw new Error('hero-daily-365-explanations.js missing year list');
  }
  const byRef = Object.create(null);
  for (let i = 0; i < list.length; i++) {
    const row = list[i];
    if (!row || !row.ref) continue;
    byRef[normalizeRef(row.ref)] = row;
  }
  return byRef;
}

function loadKjv() {
  const full = path.join(root, 'data', 'kjv-full.json');
  return JSON.parse(fs.readFileSync(full, 'utf8'));
}

function officialSingle(kjv, ref) {
  const n = normalizeRef(ref);
  return kjv[n] || kjv[n.replace(/^Psalm /i, 'Psalms ')] || kjv[n.replace(/^Psalms /i, 'Psalm ')] || '';
}

function officialText(kjv, ref) {
  const n = normalizeRef(ref);
  const range = n.match(/^(.+?)\s+(\d+):(\d+)\s*[-–]\s*(\d+)$/);
  if (!range) return officialSingle(kjv, n);
  const book = range[1];
  const ch = range[2];
  const a = Number(range[3]);
  const b = Number(range[4]);
  const parts = [];
  for (let v = a; v <= b; v++) {
    const t = officialSingle(kjv, book + ' ' + ch + ':' + v);
    if (t) parts.push(t);
  }
  return parts.join(' ');
}

function normKjv(t) {
  return String(t || '')
    .replace(/[’‘‛`]/g, "'")
    .replace(/[“”]/g, '"')
    .replace(/\bLORD\b/g, 'Lord')
    .replace(/\bGOD\b/g, 'God')
    .replace(/longsuffering/gi, 'long suffering')
    .replace(/[^a-zA-Z0-9' ]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase();
}

/** Display line must be official KJV or an in-order excerpt — never another verse. */
function isTrueKjvExcerpt(display, official) {
  const d = normKjv(display);
  const o = normKjv(official);
  if (!d || !o) return false;
  if (o.includes(d)) return true;
  const dw = d.split(' ').filter(Boolean);
  const ow = o.split(' ').filter(Boolean);
  let j = 0;
  for (let i = 0; i < dw.length; i++) {
    const idx = ow.indexOf(dw[i], j);
    if (idx === -1) return false;
    j = idx + 1;
  }
  return true;
}

function main() {
  const year = loadYear365(root);
  const explByRef = loadExplanations();
  const kjv = loadKjv();
  const fps = buildBandFingerprints(BOOK_CHAPTER_SITUATIONS);
  const today = utcDayOfYear(new Date());
  const startOffset = utcDaysSinceHeroEpoch(new Date());
  const failures = [];
  let checked = 0;
  const want = year.length;

  if (!Array.isArray(year) || (want !== 365 && want !== 730)) {
    failures.push('Calendar must have 365 or 730 days, has ' + (year && year.length));
  }

  for (let i = 0; i < want; i++) {
    const doy = ((today - 1 + i) % 365) + 1;
    const cal = pickVerseAtOffset(year, startOffset + i) || {};
    const ref = normalizeRef(cal.ref);
    const label = 'doy ' + String(doy).padStart(3, '0') + ' (+' + String(i).padStart(3, '0') + ') ' + (ref || '(no ref)');
    if (!ref) {
      failures.push(label + ': calendar missing ref');
      continue;
    }
    const row = explByRef[ref];
    if (!row) {
      failures.push(label + ': no explanation for this calendar verse');
      continue;
    }
    const official = officialText(kjv, ref);
    if (!official) {
      failures.push(label + ': no official KJV for ' + ref);
      continue;
    }
    const shown = String(cal.text || row.text || '').trim();
    if (!isTrueKjvExcerpt(shown, official)) {
      failures.push(
        label + ': displayed KJV is not the official verse (or an in-order excerpt): "' + shown.slice(0, 90) + '"'
      );
    }
    if (row.text && !isTrueKjvExcerpt(row.text, official)) {
      failures.push(label + ': explanation text is not official KJV: "' + String(row.text).slice(0, 90) + '"');
    }

    const about = String(row.about || '').trim();
    const to = String(row.to || '').trim();
    const setting = String(row.setting || '').trim();
    const plain = String(row.plain || '').trim();
    if (!about) failures.push(label + ': missing who');
    if (!to) failures.push(label + ': missing audience');
    if (!setting || setting.length < 24) failures.push(label + ': thin setting');
    if (!plain || plain.length < 12) failures.push(label + ': thin meaning');
    if (isWeakPlainStamp(plain)) failures.push(label + ': weak meaning stamp');
    if (about && !speakerBelongsToBook(about, ref)) {
      failures.push(label + ': who does not fit book: "' + about + '"');
    }
    if (situationLooksWrongForRef(setting, ref)) {
      failures.push(label + ': leftover/wrong setting: "' + setting.slice(0, 100) + '"');
    }
    if (situationLooksWrongForRef(plain, ref)) {
      failures.push(label + ': leftover/wrong meaning: "' + plain.slice(0, 100) + '"');
    }
    const lead = leadingSpeakerInText(setting);
    if (lead && !speakerBelongsToBook(lead, ref)) {
      failures.push(label + ': setting leads with the wrong speaker (' + lead + ')');
    }
    const judged = evaluateTeachingFields({
      ref,
      about,
      to,
      setting,
      plain,
      verseText: official,
      fingerprints: fps
    });
    if (!judged.ok) {
      judged.errors.forEach((e) => failures.push(label + ': ' + e));
    }
    checked += 1;
  }

  if (checked !== want) {
    failures.push('Expected to check ' + want + ' upcoming days, checked ' + checked);
  }

  adjacentSameChapterPairs(year, startOffset).forEach((p) => {
    failures.push(
      'Same chapter two days in a row (' +
        p.prev +
        ' → ' +
        p.next +
        ') — today would feel like yesterday. Reorder with scripts/separate-hero-adjacent-chapters.mjs'
    );
  });

  if (failures.length) {
    console.error('Hero 365 days-in-order FAIL — ' + failures.length + ' issue(s) in ' + checked + ' days:\n');
    failures.slice(0, 60).forEach((f) => console.error(' • ' + f));
    if (failures.length > 60) console.error(' … and ' + (failures.length - 60) + ' more');
    process.exit(1);
  }

  const first = pickVerseAtOffset(year, startOffset);
  console.log(
    'Hero queue days-in-order PASS: ' +
      want +
      ' days from UTC doy ' +
      today +
      ' (' +
      (first && first.ref) +
      ') — official KJV, no leftover teaching, then it restarts.'
  );
}

main();
