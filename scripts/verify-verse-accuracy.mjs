#!/usr/bin/env node
/**
 * Site-wide verse accuracy gate.
 *
 * One rule: teaching that sits next to a reference must belong to that reference.
 * Covers the daily verse, the 365 calendar, breakdown overrides, verse-context
 * map, topic pages, Ask-the-Word answer refs, homepage inject, and the runtime lock.
 *
 * Run: node scripts/verify-verse-accuracy.mjs
 * Wire: npm run verify:accuracy · npm run verify:teaching · npm run build · npm test
 */
import fs from 'fs';
import path from 'path';
import vm from 'vm';
import { fileURLToPath } from 'url';
import { BOOK_CHAPTER_SITUATIONS } from './lib/bible-situation-map.mjs';
import { loadKjvFull, normalizeRef as normKjv, resolveKjvText } from './lib/kjv-ref-utils.mjs';
import {
  buildBandFingerprints,
  evaluateTeachingFields,
  normalizeRef,
  situationLooksWrongForRef,
  speakerBelongsToBook
} from './lib/verse-teaching-guard.mjs';
import { pickVerseForToday, loadYear365 } from './lib/hero-daily-verse-pick.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const failures = [];
const fingerprints = buildBandFingerprints(BOOK_CHAPTER_SITUATIONS);

function fail(msg) {
  failures.push(msg);
}

function loadJson(rel) {
  return JSON.parse(fs.readFileSync(path.join(root, rel), 'utf8'));
}

function kjvText(kjv, ref) {
  const hit = resolveKjvText(kjv, ref);
  return hit ? hit.text : '';
}

function loadHeroExplanations() {
  const code = fs.readFileSync(path.join(root, 'hero-daily-365-explanations.js'), 'utf8');
  const sandbox = { console };
  sandbox.window = sandbox;
  sandbox.globalThis = sandbox;
  vm.runInNewContext(code, sandbox, { filename: 'hero-daily-365-explanations.js' });
  const list = sandbox.__TDB_HERO_DAILY_EXPLANATIONS;
  if (!Array.isArray(list)) throw new Error('hero explanations missing');
  return list;
}

function loadResolver() {
  const code = fs.readFileSync(path.join(root, 'verse-context.js'), 'utf8');
  const sandbox = { console };
  sandbox.window = sandbox;
  sandbox.globalThis = sandbox;
  vm.runInNewContext(code, sandbox, { filename: 'verse-context.js' });
  if (typeof sandbox.TDB_resolveVerseContext !== 'function') {
    throw new Error('TDB_resolveVerseContext missing');
  }
  return sandbox.TDB_resolveVerseContext;
}

function judge(label, payload) {
  const r = evaluateTeachingFields({ ...payload, fingerprints });
  if (!r.ok) {
    r.errors.forEach((e) => fail(label + ': ' + e));
  }
}

function auditHero365(kjv) {
  const list = loadHeroExplanations();
  list.forEach((row, i) => {
    const ref = normalizeRef(row && row.ref);
    judge('hero365[' + i + '] ' + (ref || '?'), {
      ref,
      about: row.about,
      to: row.to,
      setting: row.setting,
      plain: row.plain,
      verseText: row.text || kjvText(kjv, ref)
    });
  });
}

function auditOverrides(kjv) {
  const manifest = loadJson('data/verse-breakdown-manifest.json');
  const overrides = (manifest && manifest.overrides) || {};
  const keys = Object.keys(overrides);
  if (keys.length < 100) fail('override catalog too small: ' + keys.length);
  keys.forEach((ref) => {
    const entry = overrides[ref] || {};
    const g = entry.general && typeof entry.general === 'object' ? entry.general : entry;
    judge('override ' + ref, {
      ref,
      about: g.about,
      to: g.to,
      setting: g.setting || g.situation,
      plain: g.plainExplanation || g.plain,
      verseText: (manifest.sourceTexts && (manifest.sourceTexts[ref] || manifest.sourceTexts[normalizeRef(ref)])) || kjvText(kjv, ref)
    });
  });
}

function auditVerseContextMap() {
  const chapters = loadJson('data/verse-context-chapters.json');
  Object.keys(chapters).forEach((key) => {
    const row = chapters[key] || {};
    const refGuess = key.replace(':', ' ') + ':1';
    const setting = String(row.setting || '');
    const about = String(row.about || '');
    if (about && !speakerBelongsToBook(about, refGuess)) {
      fail('context-chapter ' + key + ': speaker does not fit ' + refGuess);
    }
    if (setting && situationLooksWrongForRef(setting, refGuess)) {
      fail('context-chapter ' + key + ': locked phrase under ' + refGuess);
    }
  });
  const ranges = loadJson('data/verse-context-ranges.json');
  (ranges || []).forEach((row) => {
    const ref = String(row.book || '') + ' ' + String(row.from || '1:1');
    const setting = String(row.setting || '');
    if (setting && situationLooksWrongForRef(setting, ref)) {
      fail('context-range ' + ref + ': locked phrase in setting');
    }
    if (row.about && !speakerBelongsToBook(row.about, ref)) {
      fail('context-range ' + ref + ': speaker does not fit');
    }
  });
}

function auditHomepageInject(kjv) {
  const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
  const today = pickVerseForToday(loadYear365(root));
  const expect = normalizeRef(today && today.ref);
  const refM =
    html.match(/id="heroRef"[^>]*>[\s\S]*?<strong>([^<]+)<\/strong>/i) ||
    html.match(/id="heroRef"[^>]*>([\s\S]*?)<\/p>/i);
  const shown = normalizeRef(String(refM ? refM[1] : '').replace(/\(KJV\)/i, ''));
  if (expect && shown && shown !== expect) {
    fail('homepage inject shows "' + shown + '" but calendar today is "' + expect + '"');
  }
  const sitM = html.match(/id="heroSimpleSituation"[^>]*>([^<]*)/i);
  const whoM = html.match(/id="heroDeepWho"[^>]*>([^<]*)/i);
  const meanM = html.match(/id="heroSimpleMeaning"[^>]*>([^<]*)/i);
  judge('homepage inject ' + (shown || expect), {
    ref: shown || expect,
    about: whoM ? whoM[1] : '',
    setting: sitM ? sitM[1] : '',
    plain: meanM ? meanM[1] : '',
    verseText: kjvText(kjv, shown || expect)
  });
}

function auditTopicPages() {
  const files = fs.readdirSync(root).filter((f) => /^topic-[\w-]+\.html$/.test(f));
  files.forEach((file) => {
    const html = fs.readFileSync(path.join(root, file), 'utf8');
    const blocks = html.split(/<strong>/i);
    for (let i = 1; i < blocks.length; i++) {
      const head = blocks[i].slice(0, 80);
      const refM = head.match(/^((?:[1-3]\s+)?[A-Za-z][A-Za-z.\s]+?\s+\d+:\d+)/);
      if (!refM) continue;
      const ref = normalizeRef(refM[1]);
      const sitM = blocks[i].match(/tdb-kiss-verse__sit[^>]*>([^<]+)/);
      const meanM = blocks[i].match(/tdb-kiss-verse__mean[^>]*>([^<]+)/);
      if (sitM && situationLooksWrongForRef(sitM[1], ref)) {
        fail(file + ' ' + ref + ': situation locked phrase');
      }
      if (meanM && situationLooksWrongForRef(meanM[1], ref)) {
        fail(file + ' ' + ref + ': meaning locked phrase');
      }
    }
  });
}

function auditAskTheWord(kjv) {
  const p = path.join(root, 'ask-the-word-answers.json');
  if (!fs.existsSync(p)) return;
  const rows = JSON.parse(fs.readFileSync(p, 'utf8'));
  (Array.isArray(rows) ? rows : []).forEach((row) => {
    (row.verses || []).forEach((item) => {
      const ref = typeof item === 'string' ? item : item && (item.ref || item.verse || item.id);
      if (!ref) return;
      if (resolveKjvText(kjv, ref)) return;
      const oneChap = String(ref).match(/^(Jude|Obadiah|Philemon|2 John|3 John)\s+(\d+)$/i);
      if (oneChap && resolveKjvText(kjv, oneChap[1] + ' 1:' + oneChap[2])) return;
      fail('ask-the-word ' + (row.id || '?') + ': missing KJV for ' + ref);
    });
  });
}

function auditRegressionLocks() {
  const cases = [
    {
      ref: '1 John 4:7',
      sit: 'Love one another; test the spirits; God is love; victory that overcomes the world.',
      bad: true
    },
    {
      ref: 'Psalm 94:18',
      sit: 'The Lord reigns: floods, thrones, and idols cannot unseat Him',
      bad: true
    },
    {
      ref: 'Proverbs 16:3',
      sit: 'Solomon giving wisdom',
      about: 'David',
      bad: true
    },
    {
      ref: '1 John 4:7',
      sit: 'John urges the church to love one another because love is of God',
      bad: false
    },
    {
      ref: 'Psalm 92:1',
      sit: 'A Sabbath song of thanksgiving',
      bad: false
    },
    { ref: '1 John 4:7', about: 'Solomon', bad: true },
    { ref: '1 John 4:7', about: 'David', bad: true },
    { ref: '1 John 4:7', about: 'Paul', bad: true },
    { ref: '1 John 4:7', about: 'Peter', bad: true },
    { ref: '1 John 4:7', about: 'John', bad: false },
    { ref: 'Romans 5:5', about: 'David', bad: true },
    { ref: 'Romans 5:5', about: 'Moses', bad: true },
    { ref: 'Romans 5:5', about: 'Paul', bad: false },
    { ref: 'James 1:5', about: 'David', bad: true },
    { ref: 'Proverbs 16:3', about: 'Solomon', bad: false }
  ];
  cases.forEach((c) => {
    const sitWrong = c.sit ? situationLooksWrongForRef(c.sit, c.ref) : false;
    const speakerWrong = c.about ? !speakerBelongsToBook(c.about, c.ref) : false;
    const blocked = sitWrong || speakerWrong;
    if (c.bad && !blocked) fail('regression: should reject mismatched teaching on ' + c.ref + (c.about ? ' / ' + c.about : ''));
    if (!c.bad && blocked) fail('regression: should allow matching teaching on ' + c.ref + (c.about ? ' / ' + c.about : ''));
  });
}

function auditRuntimeContract() {
  const runtime = path.join(root, 'tdb-verse-accuracy.js');
  if (!fs.existsSync(runtime)) {
    fail('tdb-verse-accuracy.js missing — run scripts/build-verse-accuracy-runtime.mjs');
    return;
  }
  const js = fs.readFileSync(runtime, 'utf8');
  if (!js.includes('TDB_verseAccuracy')) fail('runtime lock missing TDB_verseAccuracy export');
  if (!js.includes('1jn-mashup')) fail('runtime lock missing 1 John mashup phrase lock');
  if (!js.includes('SPEAKERS') || !js.includes('"id": "solomon"')) {
    fail('runtime lock missing shared speaker table');
  }
  const vb = fs.readFileSync(path.join(root, 'verse-breakdown.js'), 'utf8');
  if (!vb.includes('TDB_verseAccuracy.sanitize')) {
    fail('verse-breakdown.js must sanitize teaching through TDB_verseAccuracy');
  }
  const fp = fs.readFileSync(path.join(root, 'hero-daily-first-paint.js'), 'utf8');
  if (!fp.includes('TDB_verseAccuracy')) {
    fail('hero-daily-first-paint.js must call TDB_verseAccuracy so live teaching uses the same locks');
  }
  const index = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
  if (!index.includes('tdb-verse-accuracy.js')) {
    fail('index.html must load tdb-verse-accuracy.js before first-paint');
  }
}

function auditResolverSamples(kjv) {
  const resolve = loadResolver();
  const samples = [
    '1 John 4:7',
    '1 John 4:4',
    '1 John 5:11',
    'Psalm 94:18',
    'Psalm 92:1',
    'Proverbs 16:3',
    'Romans 5:5',
    'John 3:16'
  ];
  samples.forEach((ref) => {
    const ctx = resolve(ref) || {};
    judge('resolver ' + ref, {
      ref,
      about: ctx.about,
      to: ctx.to,
      setting: ctx.setting || ctx.situation,
      verseText: kjvText(kjv, ref)
    });
  });
}

function main() {
  const kjv = loadKjvFull(root);
  auditRuntimeContract();
  auditRegressionLocks();
  auditHero365(kjv);
  auditOverrides(kjv);
  auditVerseContextMap();
  auditHomepageInject(kjv);
  auditTopicPages();
  auditAskTheWord(kjv);
  auditResolverSamples(kjv);

  if (failures.length) {
    console.error('Verse accuracy FAIL —', failures.length, 'issue(s):\n');
    failures.slice(0, 60).forEach((f) => console.error(' •', f));
    if (failures.length > 60) console.error(' … and', failures.length - 60, 'more');
    process.exit(1);
  }
  console.log('Verse accuracy PASS: hero 365, overrides, context map, topics, Ask the Word, homepage, runtime lock.');
}

main();
