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

function auditHomepageFile(kjv, rel) {
  const full = path.join(root, rel);
  if (!fs.existsSync(full)) return;
  const html = fs.readFileSync(full, 'utf8');
  const today = pickVerseForToday(loadYear365(root));
  const expect = normalizeRef(today && today.ref);
  const refM =
    html.match(/id="heroRef"[^>]*>[\s\S]*?<strong>([^<]+)<\/strong>/i) ||
    html.match(/id="heroRef"[^>]*>([\s\S]*?)<\/p>/i);
  const shown = normalizeRef(String(refM ? refM[1] : '').replace(/\(KJV\)/i, ''));
  if (expect && shown && shown !== expect) {
    fail(rel + ' inject shows "' + shown + '" but calendar today is "' + expect + '"');
  }
  const sitM = html.match(/id="heroSimpleSituation"[^>]*>([^<]*)/i);
  const whoM = html.match(/id="heroDeepWho"[^>]*>([^<]*)/i);
  const meanM = html.match(/id="heroSimpleMeaning"[^>]*>([^<]*)/i);
  judge(rel + ' inject ' + (shown || expect), {
    ref: shown || expect,
    about: whoM ? whoM[1] : '',
    setting: sitM ? sitM[1] : '',
    plain: meanM ? meanM[1] : '',
    verseText: kjvText(kjv, shown || expect)
  });
}

function auditHomepageInject(kjv) {
  auditHomepageFile(kjv, 'index.html');
  auditHomepageFile(kjv, 'dist/index.html');
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
    {
      ref: 'Psalm 96:1',
      sit: 'John urges the church to love one another because love is of God: whoever loves is born of God and knows God, and God is love.',
      bad: true
    },
    {
      ref: '1 John 4:7',
      sit: 'John urges the church to love one another because love is of God: whoever loves is born of God and knows God, and God is love.',
      bad: false
    },
    {
      ref: 'Psalm 23:1',
      sit: 'Paul writes from prison to Philippi: rejoice, do not be anxious, the peace of God guards hearts.',
      bad: true
    },
    {
      ref: 'Philippians 4:6',
      sit: 'Paul writes from prison to Philippi: rejoice, do not be anxious, the peace of God guards hearts.',
      bad: false
    },
    {
      ref: 'Matthew 17:20',
      sit: 'John is killed; Jesus feeds multitudes, walks on water, and predicts the cross; Peter confesses Him as Christ.',
      bad: true
    },
    {
      ref: 'Matthew 17:20',
      sit: 'Jesus is transfigured; the disciples cannot heal a boy, and He teaches that faith as a grain of mustard seed is enough.',
      bad: false
    },
    {
      ref: '1 Samuel 16:7',
      sit: 'David is anointed; he fights Goliath while Saul’s army freezes in fear.',
      bad: true
    },
    {
      ref: '1 Samuel 16:7',
      sit: 'Samuel is sent to anoint a king among Jesse’s sons; the Lord refuses Eliab’s looks and looks on the heart.',
      bad: false
    },
    {
      ref: 'Ephesians 6:4',
      sit: 'Walk worthy: unity, purity, marriage, and the armor of God against spiritual war.',
      bad: true
    },
    {
      ref: 'Psalm 56:3',
      sit: 'David under Saul’s pursuit and Doeg’s betrayal; cries from caves and defeat; God still rules.',
      bad: true
    },
    {
      ref: 'Hebrews 13:5',
      sit: 'Hall of faith; run with patience; practical holiness and praise.',
      bad: true
    },
    {
      ref: 'Isaiah 43:1',
      sit: 'Comfort for exiles: God is incomparable; idols are nothing; a servant will bring justice.',
      bad: true
    },
    {
      ref: 'Luke 12:32',
      sit: 'Jesus — On the road to Jerusalem: Good Samaritan, Lord’s Prayer, lost sheep/coin/son, rich fool, Zacchaeus. The verse: Fear not, little flock; for it is your Father’s good pleasure to give you the kingdom.',
      bad: true
    },
    {
      ref: 'Luke 12:32',
      sit: 'Jesus tells the rich fool parable and says, Fear not, little flock — do not be anxious; your Father knows your need.',
      bad: false
    },
    {
      ref: 'Psalm 33:1',
      sit: 'David commits his spirit to God under pressure; confession and instruction; a new song of praise.',
      bad: true
    },
    {
      ref: 'Psalm 31:24',
      sit: 'David commits his spirit to God under pressure; confession and instruction; a new song of praise.',
      bad: true
    },
    {
      ref: 'Psalm 31:24',
      sit: 'David, hunted and pressed, commits his spirit into God’s hand; the Lord is his fortress.',
      bad: false
    },
    {
      ref: 'Psalm 33:1',
      sit: 'A new song of praise: Rejoice in the Lord, O ye righteous; praise is comely for the upright, for His word is right.',
      bad: false
    },
    {
      ref: 'Psalm 33:1',
      to: 'The pressured and the repentant',
      bad: true
    },
    {
      ref: 'Psalm 33:1',
      to: 'The righteous called to rejoice — and you when praise is due',
      bad: false
    },
    {
      ref: 'Psalm 23:1',
      sit: 'The Lord as shepherd and host; the King of glory enters; trust in green pastures and still waters.',
      bad: true
    },
    {
      ref: 'Psalm 23:1',
      sit: 'David sings of the Lord as his own shepherd: green pastures, still waters, a table, and a house forever.',
      bad: false
    },
    {
      ref: 'Psalm 110:1',
      sit: 'David’s confidence in battle; curses on the wicked; the Lord says to my Lord, “Sit at my right hand.”',
      bad: true
    },
    {
      ref: 'John 3:16',
      sit: 'Jesus teaches Nicodemus about new birth; speaks with a Samaritan woman at the well.',
      bad: true
    },
    {
      ref: 'John 3:16',
      sit: 'Jesus teaches Nicodemus at night about new birth: God so loved the world that He gave His only begotten Son.',
      bad: false
    },
    {
      ref: 'Jeremiah 29:11',
      sit: 'Kings reject the word; false prophets promise peace; Jeremiah sends a letter to the first exiles.',
      bad: true
    },
    {
      ref: 'Genesis 1:27',
      sit: 'God is creating the heavens and the earth from nothing — speaking light, order, and life into being.',
      bad: true
    },
    {
      ref: 'Genesis 1:27',
      sit: 'On the sixth day God makes man in His own image, male and female, and blesses them to be fruitful.',
      bad: false
    },
    {
      ref: 'Isaiah 33:2',
      sit: 'Judgment and joy; a highway of holiness; God defends Zion.',
      bad: true
    },
    {
      ref: 'Matthew 14:19',
      sit: 'John the Baptist is beheaded; Jesus feeds the five thousand and walks on the sea.',
      bad: true
    },
    {
      ref: 'Luke 10:42',
      sit: 'Jesus sends the seventy; the Good Samaritan; Martha and Mary.',
      bad: true
    },
    {
      ref: 'Psalm 33:1',
      sit: 'Psalm 100 opens with a call to the whole earth: make a joyful noise unto the Lord, all ye lands.',
      bad: true
    },
    {
      ref: 'Psalm 103:12',
      sit: 'A king’s vow of integrity; an afflicted cry that becomes hope; David blesses the Lord who forgives and crowns with mercy.',
      bad: true
    },
    {
      ref: 'Psalm 103:1',
      sit: 'David blesses the Lord who forgives all iniquity, heals, and removes transgressions as far as the east is from the west.',
      bad: true
    },
    {
      ref: 'Psalm 103:1',
      sit: 'David opens this psalm by commanding his own soul: Bless the Lord, O my soul, and all that is within me, bless His holy name.',
      bad: false
    },
    {
      ref: 'Psalm 103:3',
      sit: 'David names why the soul should bless the Lord: He forgives iniquity, heals diseases, redeems from destruction, and satisfies with good things.',
      bad: true
    },
    {
      ref: 'Psalm 103:3',
      sit: 'David names why the soul should bless the Lord: He forgives all iniquities and heals all diseases.',
      bad: false
    },
    {
      ref: 'Psalm 103:3',
      to: 'The soul that needs forgiveness, healing, and renewal',
      bad: true
    },
    {
      ref: 'Psalm 103:3',
      to: 'The soul that needs forgiveness and healing',
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
    const audienceWrong = c.to ? situationLooksWrongForRef(c.to, c.ref) : false;
    const blocked = sitWrong || speakerWrong || audienceWrong;
    const extra = c.about ? ' / ' + c.about : c.to ? ' / ' + c.to : '';
    if (c.bad && !blocked) fail('regression: should reject mismatched teaching on ' + c.ref + extra);
    if (!c.bad && blocked) fail('regression: should allow matching teaching on ' + c.ref + extra);
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
    'John 3:16',
    'Psalm 103:3'
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
