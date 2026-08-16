#!/usr/bin/env node
/**
 * Build a 730-day hero queue: year 1 (kids 365) + year 2 (new unique KJV), then it restarts.
 * Writes hero-daily-365-data.js and hero-daily-365-explanations.js.
 */
import fs from 'fs';
import path from 'path';
import vm from 'vm';
import { fileURLToPath } from 'url';
import { loadYear365 } from './lib/hero-daily-verse-pick.mjs';
import { buildHeroLaymanPlain, loadVersePlainMeanings } from './lib/hero-layman-plain.mjs';
import {
  normalizeRef,
  situationLooksWrongForRef,
  speakerBelongsToBook,
  evaluateTeachingFields,
  leadingSpeakerInText
} from './lib/verse-teaching-guard.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');

const STEPS = [
  'Read this verse once more, slowly, before you stand up.',
  'Ask God for strength for the next hour only, then take one small step.',
  'Name one honest need this verse meets — tell God in a single sentence.',
  'Put a hand on your chest, breathe out slowly, and read the verse again.',
  'Do the next honest task while holding one phrase from this verse.',
  'Leave one worry with God for ten minutes after reading this.',
  'Write one line of this verse where you will see it today.',
  'Say this verse out loud, then take the next right step.'
];

const HEAVY =
  /\b(whore|abomination|dash thy little|hell fire|damnation|kill every|murderer|adulterer)\b/i;

function loadKjv() {
  return JSON.parse(fs.readFileSync(path.join(root, 'data', 'kjv-full.json'), 'utf8'));
}

function officialSingle(kjv, ref) {
  const n = normalizeRef(ref);
  return kjv[n] || kjv[n.replace(/^Psalm /i, 'Psalms ')] || kjv[n.replace(/^Psalms /i, 'Psalm ')] || '';
}

function loadResolver() {
  const code = fs.readFileSync(path.join(root, 'verse-context.js'), 'utf8');
  const sandbox = { console };
  sandbox.window = sandbox;
  sandbox.globalThis = sandbox;
  vm.runInNewContext(code, sandbox, { filename: 'verse-context.js' });
  return sandbox.TDB_resolveVerseContext;
}

function loadYear1Explanations() {
  const code = fs.readFileSync(path.join(root, 'hero-daily-365-explanations.js'), 'utf8');
  const sandbox = { console };
  sandbox.window = sandbox;
  sandbox.globalThis = sandbox;
  vm.runInNewContext(code, sandbox, { filename: 'hero-daily-365-explanations.js' });
  return sandbox.__TDB_HERO_DAILY_EXPLANATIONS || [];
}

function writeHeroData(list) {
  const header = `/**
 * Home hero queue: 730 unique KJV days (year 1 + year 2), then it starts over.
 * Year 1 matches kids/kids-verses-365.js. Rebuild: node scripts/build-hero-two-year-queue.mjs
 */
(function (global) {
  'use strict';
  global.__TDB_HERO_DAILY_YEAR = `;
  const footer = `;
})(typeof window !== 'undefined' ? window : this);
`;
  fs.writeFileSync(
    path.join(root, 'hero-daily-365-data.js'),
    header + JSON.stringify(list.map((r) => ({ ref: r.ref, text: r.text })), null, 2) + footer,
    'utf8'
  );
}

function writeExplanations(list) {
  const header = `/**
 * High-quality plain meaning + one step for each hero queue day (730, then restart).
 * Built for Grove first-paint. Not bulk stamp text. Free forever.
 */
(function (global) {
  'use strict';
  global.__TDB_HERO_DAILY_EXPLANATIONS = `;
  const footer = `;
  global.TDB_GET_HERO_DAY_EXPLANATION = function (dayIndex) {
    var list = global.__TDB_HERO_DAILY_EXPLANATIONS || [];
    if (!list.length) return null;
    var i = ((Number(dayIndex) % list.length) + list.length) % list.length;
    return list[i] || null;
  };
  global.TDB_GET_HERO_EXPLANATION_BY_REF = function (ref) {
    var list = global.__TDB_HERO_DAILY_EXPLANATIONS || [];
    var r = String(ref || '').replace(/\\s+/g, ' ').replace(/^Psalms\\s+/i, 'Psalm ').trim();
    for (var j = 0; j < list.length; j++) {
      var lr = String(list[j].ref || '').replace(/\\s+/g, ' ').replace(/^Psalms\\s+/i, 'Psalm ').trim();
      if (lr === r) return list[j];
    }
    return null;
  };
  try {
    if (typeof global.TDB_registerVerseContextMap === 'function') {
      var map = Object.create(null);
      (global.__TDB_HERO_DAILY_EXPLANATIONS || []).forEach(function (row) {
        if (!row || !row.ref || !row.about || !row.to) return;
        map[row.ref] = { about: row.about, to: row.to, setting: row.setting || '' };
      });
      global.TDB_registerVerseContextMap(map);
    }
  } catch (eReg) {}
})(typeof window !== 'undefined' ? window : this);
`;
  fs.writeFileSync(
    path.join(root, 'hero-daily-365-explanations.js'),
    header + JSON.stringify(list, null, 2) + footer,
    'utf8'
  );
}

function main() {
  const kjv = loadKjv();
  const resolve = loadResolver();
  const plains = loadVersePlainMeanings(root);
  const year1Data = loadYear365(root).slice(0, 365);
  const year1Expl = loadYear1Explanations();
  const year1ByRef = Object.create(null);
  year1Expl.forEach((row) => {
    if (row && row.ref) year1ByRef[normalizeRef(row.ref)] = row;
  });
  const used = new Set(year1Data.map((v) => normalizeRef(v.ref)));
  const usedPlains = new Set(
    year1Expl.map((r) => String(r.plain || '').toLowerCase().replace(/\s+/g, ' ').trim())
  );

  const year1Rows = year1Data.map((v) => {
    const row = year1ByRef[normalizeRef(v.ref)];
    if (!row) throw new Error('Year 1 missing explanation for ' + v.ref);
    return {
      ref: v.ref,
      text: v.text,
      plain: row.plain,
      step: row.step,
      about: row.about,
      to: row.to,
      setting: row.setting
    };
  });

  const candidates = JSON.parse(fs.readFileSync(path.join(root, 'data', 'hero-year2-refs.json'), 'utf8'));
  const year2 = [];
  const skipped = [];

  for (let i = 0; i < candidates.length && year2.length < 365; i++) {
    const ref = normalizeRef(candidates[i]);
    if (!ref || used.has(ref)) {
      skipped.push(ref + ' (already in year 1)');
      continue;
    }
    const text = officialSingle(kjv, ref);
    if (!text) {
      skipped.push(ref + ' (no official KJV)');
      continue;
    }
    if (HEAVY.test(text.slice(0, 120))) {
      skipped.push(ref + ' (heavy headline)');
      continue;
    }
    const ctx = (resolve && resolve(ref)) || {};
    const about = String(ctx.about || '').trim();
    const to = String(ctx.to || '').trim();
    const setting = String(ctx.setting || '').trim();
    if (!about || !to || setting.length < 24) {
      skipped.push(ref + ' (thin context)');
      continue;
    }
    if (!speakerBelongsToBook(about, ref)) {
      skipped.push(ref + ' (who mismatch)');
      continue;
    }
    const lead = leadingSpeakerInText(setting);
    if (lead && !speakerBelongsToBook(lead, ref)) {
      skipped.push(ref + ' (setting speaker)');
      continue;
    }
    if (situationLooksWrongForRef(setting, ref)) {
      skipped.push(ref + ' (locked setting)');
      continue;
    }
    let plain = buildHeroLaymanPlain(ref, text, plains, root);
    plain = String(plain || '').replace(/\s+/g, ' ').trim();
    const plainKey = plain.toLowerCase();
    if (!plain || plain.length < 20 || usedPlains.has(plainKey)) {
      skipped.push(ref + ' (plain missing/reuse)');
      continue;
    }
    const judged = evaluateTeachingFields({
      ref,
      about,
      to,
      setting,
      plain,
      verseText: text
    });
    if (!judged.ok) {
      skipped.push(ref + ' (' + judged.errors[0] + ')');
      continue;
    }
    used.add(ref);
    usedPlains.add(plainKey);
    year2.push({
      ref,
      text,
      plain,
      step: STEPS[year2.length % STEPS.length],
      about,
      to,
      setting
    });
  }

  if (year2.length < 365) {
    console.error('Year 2 only filled', year2.length, 'of 365. Skipped sample:');
    skipped.slice(0, 20).forEach((s) => console.error(' -', s));
    process.exit(1);
  }

  const queue = year1Rows.concat(year2.slice(0, 365));
  writeHeroData(queue);
  writeExplanations(queue);
  fs.writeFileSync(
    path.join(root, 'data', 'hero-year2.json'),
    JSON.stringify(year2.slice(0, 365), null, 2),
    'utf8'
  );
  console.log('Wrote 730-day hero queue (365 + 365). Year 2 first:', year2[0].ref, 'last:', year2[364].ref);
}

main();
