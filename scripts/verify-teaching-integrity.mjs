#!/usr/bin/env node
/**
 * Teaching integrity gate — fine-tooth comb for “this must never ship.”
 *
 * Catches classes of bugs that have burned us:
 *  - Hero dig-deeper mismatched to today’s verse (stale Psalm under Prov, etc.)
 *  - Weak plain stamps as “what it means”
 *  - Feeling search returning irrelevant KJV lines
 *  - Verse body equal to the reference string
 *  - Speakers that can’t belong to the book
 *  - Context about that is empty/wrong for famous refs
 *
 * Run: node scripts/verify-teaching-integrity.mjs
 * Wired into npm run build (must pass).
 */
import fs from 'fs';
import path from 'path';
import vm from 'vm';
import { fileURLToPath } from 'url';
import { pickVerseForToday, loadYear365, utcDayOfYear } from './lib/hero-daily-verse-pick.mjs';
import { buildHeroLaymanPlain, loadVersePlainMeanings } from './lib/hero-layman-plain.mjs';
import {
  isThinSpeakerLine,
  isWeakPlainStamp,
  sampleRefs,
  scoreSituationLine,
} from './lib/teaching-quality.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const failures = [];

function fail(msg) {
  failures.push(msg);
}

function loadJson(rel) {
  return JSON.parse(fs.readFileSync(path.join(root, rel), 'utf8'));
}

function loadKjv() {
  const full = loadJson('data/kjv-full.json');
  return full;
}

function kjvText(kjv, ref) {
  if (!ref) return '';
  if (kjv[ref]) return kjv[ref];
  const n = String(ref).replace(/^Psalm\s+/i, 'Psalms ').replace(/^Psalms\s+/i, 'Psalms ');
  if (kjv[n]) return kjv[n];
  const n2 = String(ref).replace(/^Psalms\s+/i, 'Psalm ');
  if (kjv[n2]) return kjv[n2];
  return '';
}

function loadVerseContextResolve() {
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

function stripHtml(s) {
  return String(s || '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function primaryRef(ref) {
  const n = String(ref || '')
    .replace(/\s*\(KJV\)\s*$/i, '')
    .replace(/\s+/g, ' ')
    .trim();
  const m = n.match(/^(.+?\s+\d+:\d+)/);
  return m ? m[1].trim() : n;
}

function bookOf(ref) {
  const m = String(ref || '').match(/^((?:[1-3]\s+)?[A-Za-z][A-Za-z\s\.]+?)\s+\d+:/);
  return m ? m[1].replace(/\./g, '').replace(/\s+/g, ' ').trim() : '';
}

/** Speaker string must not contradict the book. */
function speakerBelongsToBook(about, ref) {
  const a = String(about || '').toLowerCase();
  const book = bookOf(ref).toLowerCase();
  if (!a || !book) return true;
  // Hard contradictions
  if (/^isaiah\b/.test(book) && /\bdavid\b/.test(a) && !/isaiah/.test(a)) return false;
  if (/^joshua\b/.test(book) && /\bdavid\b/.test(a) && !/joshua/.test(a)) return false;
  if (/^deuteronomy\b/.test(book) && /\bdavid\b/.test(a) && !/moses/.test(a)) return false;
  if (/^matthew\b|^mark\b|^luke\b|^john\b/.test(book) && /\bdavid\b/.test(a) && !/jesus/.test(a)) return false;
  if (/^proverbs\b|^ecclesiastes\b/.test(book) && /\bdavid\b/.test(a) && !/solomon/.test(a)) return false;
  if (/^romans\b|^corinthians\b|^galatians\b|^ephesians\b|^philippians\b|^colossians\b|^timothy\b/.test(book) &&
      /\bdavid\b/.test(a) && !/paul/.test(a)) return false;
  return true;
}

/* isWeakPlainStamp imported from teaching-quality.mjs */

/* ─── 0. Source contracts: no residual weak stamps in runtime engines ─── */
function auditSourceContracts() {
  const vb = fs.readFileSync(path.join(root, 'verse-breakdown.js'), 'utf8');
  /* Reject emission (return/concat), not mere detection regexes that still ban the stamp. */
  if (/return\s+['"`]In plain terms for life today:/i.test(vb) || /\+\s*['"`]In plain terms for life today:/i.test(vb)) {
    fail('verse-breakdown.js still emits “In plain terms for life today” stamp');
  }
  if (/return\s+['"`][^'"`]*Sit with that until one phrase lands/i.test(vb)) {
    fail('verse-breakdown.js still emits “Sit with that until one phrase lands” stamp');
  }
  if (!vb.includes('isThinSpeakerSituation') || !vb.includes('plainMeaningOnly')) {
    fail('verse-breakdown.js missing thin-situation / plainMeaningOnly seals');
  }
  if (!vb.includes('TDBTeachingQuality')) {
    fail('verse-breakdown.js must export window.TDBTeachingQuality for card surfaces');
  }
  const script = fs.readFileSync(path.join(root, 'script.js'), 'utf8');
  if (!script.includes('plainMeaningOnly') && !script.includes('TDBTeachingQuality')) {
    fail('script.js search cards should prefer plainMeaningOnly / TDBTeachingQuality');
  }
  const feel = fs.readFileSync(path.join(root, 'tdb-home-feel.js'), 'utf8');
  if (!feel.includes('speaking to') || !feel.includes('preferSituation') && !feel.includes('TDBTeachingQuality')) {
    /* soft: at least filter thin situations in buildSituationMeaningBlock */
    if (!/speaking to /.test(feel)) {
      fail('tdb-home-feel.js should filter thin “speaking to” situations on feel cards');
    }
  }
  const injectTopic = fs.readFileSync(path.join(root, 'scripts/inject-topic-verse-context.mjs'), 'utf8');
  if (/plain = text\.length > 140/.test(injectTopic) || /Never echo full KJV/.test(injectTopic) === false) {
    /* ensure we do not assign raw KJV as meaning */
  }
  if (/plain = text\.length/.test(injectTopic)) {
    fail('inject-topic-verse-context.mjs must not fall back to raw KJV as meaning');
  }
}

/* ─── 1. Hero dig-deeper matches today’s verse ─── */
function auditHeroInject(kjv, resolve) {
  const indexPath = path.join(root, 'index.html');
  if (!fs.existsSync(indexPath)) {
    fail('index.html missing');
    return;
  }
  const html = fs.readFileSync(indexPath, 'utf8');
  const year365 = loadYear365(root);
  const today = pickVerseForToday(year365);
  if (!today || !today.ref) {
    fail('Could not pick today’s hero verse from 365 calendar');
    return;
  }

  const refM = html.match(/id="heroRef"[^>]*>[\s\S]*?<strong>([^<]+)<\/strong>/i) ||
    html.match(/id="heroRef"[^>]*>([\s\S]*?)<\/p>/i);
  const simpleM = html.match(/id="heroSimpleBreakdown"[^>]*>([^<]*)/i);
  const meanM = html.match(/id="heroSimpleMeaning"[^>]*>([^<]*)/i);
  const sitPrimaryM = html.match(/id="heroSimpleSituation"[^>]*>([^<]*)/i);
  const sitM = html.match(/id="heroDeepSituation"[^>]*>([^<]*)/i);
  const whoM = html.match(/id="heroDeepWho"[^>]*>([^<]*)/i);
  const stepM = html.match(/id="heroVotdOneStep"[^>]*>([^<]*)/i);

  const heroRef = stripHtml(refM ? refM[1] : '').replace(/\s*\(KJV\)\s*$/i, '').trim();
  const simple = stripHtml(simpleM ? simpleM[1] : '');
  const meaning = stripHtml(meanM ? meanM[1] : '') || simple.replace(/^What was going on:[\s\S]*?What it means:\s*/i, '');
  const sit = stripHtml(sitPrimaryM ? sitPrimaryM[1] : '') || stripHtml(sitM ? sitM[1] : '');
  const who = stripHtml(whoM ? whoM[1] : '');
  const step = stripHtml(stepM ? stepM[1] : '');

  const expect = primaryRef(today.ref);
  if (primaryRef(heroRef) !== expect) {
    fail(
      `Hero inject ref mismatch: HTML has "${heroRef}" but UTC day ${utcDayOfYear(new Date())} expects "${expect}". Run inject-home-hero.`
    );
  }

  // Stale dig-deeper: Sabbath/psalm language under non-Psalm-92
  if (!/^Psalm(s)?\s+92:/i.test(expect)) {
    if (/Sabbath song of thanksgiving/i.test(simple + ' ' + sit)) {
      fail(`Stale Psalm 92 situation under hero ${expect}`);
    }
  }

  if (isWeakPlainStamp(meaning) || isWeakPlainStamp(simple)) {
    fail(
      `Hero meaning uses weak stamp for ${expect}: ${(meaning || simple).slice(0, 100)}`
    );
  }
  if (!meaning || meaning.length < 20) {
    fail(`Hero meaning missing/too short for ${expect}`);
  }

  // Situation must not be empty when resolver has one
  const ctx = resolve(expect) || {};
  const liveSit = String(ctx.situation || ctx.setting || '').trim();
  if (liveSit && liveSit.length >= 40 && sit) {
    // Allow speaker-only thin line only if inject failed — flag thin “X speaking to Y” when we have better
    if (/^.{3,40} speaking to /i.test(sit) && liveSit.length > sit.length + 20) {
      fail(`Hero dig-deeper situation is thin speaker-line for ${expect}; resolver has richer setting`);
    }
  }

  if (who && !speakerBelongsToBook(who, expect)) {
    fail(`Hero who="${who}" does not belong to ${expect}`);
  }

  // Step must not be from unrelated theme (forgiveness under commit-your-works)
  if (/commit thy works|proverbs\s+16:3/i.test(expect + ' ' + (kjvText(kjv, expect) || ''))) {
    if (/forgiveness for one sharp|sharp word/i.test(step)) {
      fail(`Hero step for ${expect} is forgiveness boilerplate`);
    }
  }

  // Primary split + deep situation must match when both present (no residual weak combined UI)
  const sitDeep = stripHtml(sitM ? sitM[1] : '');
  const sitPrimary = stripHtml(sitPrimaryM ? sitPrimaryM[1] : '');
  if (sitPrimary && sitDeep && sitPrimary.length >= 40 && /^.{3,50} speaking to /i.test(sitDeep) && sitPrimary.length > sitDeep.length + 15) {
    fail(`Hero deep situation lagging primary for ${expect}: deep is thin speaker-line while primary has narrative`);
  }
  if (html.includes('id="heroSimpleBreakdown"') && !/id="heroSimpleBreakdown"[^>]*(hidden|sr-only)/i.test(html)) {
    fail('heroSimpleBreakdown must stay hidden (sr-only/hidden) — combined line must not paint');
  }
  // dig-deeper integrity lock must exist in first-paint
  const fp = fs.readFileSync(path.join(root, 'hero-daily-first-paint.js'), 'utf8');
  if (!fp.includes('ensureHeroDigDeeperMatchesDisplayedVerse')) {
    fail('hero-daily-first-paint.js missing dig-deeper integrity lock');
  }
  if (!fp.includes('pickBestText') || !fp.includes('scoreSituationLine')) {
    fail('hero-daily-first-paint.js missing prefer-stronger situation scoring');
  }
  if (!fp.includes('clearHeroDigDeeperShell')) {
    fail('hero-daily-first-paint.js missing clearHeroDigDeeperShell');
  }
  if (!fp.includes('data-tdb-bound-ref')) {
    fail('hero-daily-first-paint.js missing data-tdb-bound-ref stamp');
  }
}

/* ─── 2. Feeling search relevance ─── */
function auditFeelingSearch(kjv) {
  const script = fs.readFileSync(path.join(root, 'script.js'), 'utf8');

  // Guards present
  if (!script.includes('isUsefulSearchToken') && !script.includes('WEAK_SEARCH_TOKENS')) {
    fail('script.js missing weak search-token filter (isUsefulSearchToken / WEAK_SEARCH_TOKENS)');
  }
  if (!script.includes('prependCuratedFeelingVerses')) {
    fail('script.js missing prependCuratedFeelingVerses for feeling queries');
  }

  // Extract topics.anxiety (etc.) verse lists from script.js
  const topicsChunk = script.match(/const topics = \{([\s\S]*?)\n\};\s*\n/);
  if (!topicsChunk) {
    fail('Could not parse const topics from script.js');
    return;
  }

  function topicVerses(name) {
    const re = new RegExp(
      name +
        ':\\s*\\{[\\s\\S]*?verses:\\s*\\[([^\\]]+)\\]',
      'i'
    );
    const m = topicsChunk[1].match(re);
    if (!m) return [];
    return [...m[1].matchAll(/'([^']+)'/g)].map((x) => x[1]);
  }

  const FEELING_EXPECT = {
    anxiety: {
      mustIncludeAny: ['Philippians 4:6', 'Philippians 4:7', 'Matthew 6:34', '1 Peter 5:7', 'Isaiah 41:10'],
      mustNotInclude: ['Isaiah 24:2', 'Joshua 22:8', 'Deuteronomy 28:22']
    },
    fear: {
      mustIncludeAny: ['Isaiah 41:10', '2 Timothy 1:7', '1 John 4:18', 'Psalms 27:1', 'Psalm 27:1'],
      mustNotInclude: ['Isaiah 24:2', 'Deuteronomy 28:22']
    },
    peace: {
      mustIncludeAny: ['John 14:27', 'Philippians 4:7', 'Isaiah 26:3'],
      mustNotInclude: ['Deuteronomy 28:22']
    },
    strength: {
      mustIncludeAny: ['Isaiah 40:31', 'Philippians 4:13', '2 Corinthians 12:9'],
      mustNotInclude: ['Isaiah 24:2']
    }
  };

  for (const [topic, rules] of Object.entries(FEELING_EXPECT)) {
    const verses = topicVerses(topic);
    if (!verses.length) {
      fail(`topics.${topic} has no verses array in script.js`);
      continue;
    }
    for (const ref of verses) {
      const t = kjvText(kjv, ref);
      if (!t || t.length < 12) {
        fail(`topics.${topic} verse missing KJV text: ${ref}`);
      }
    }
    const hit = rules.mustIncludeAny.some((r) =>
      verses.some((v) => primaryRef(v) === primaryRef(r) || v.replace(/^Psalms\s+/i, 'Psalm ') === r.replace(/^Psalms\s+/i, 'Psalm '))
    );
    if (!hit) {
      fail(`topics.${topic} missing expected anchors (got: ${verses.slice(0, 5).join(', ')})`);
    }
    for (const bad of rules.mustNotInclude) {
      if (verses.some((v) => primaryRef(v) === primaryRef(bad))) {
        fail(`topics.${topic} incorrectly includes ${bad}`);
      }
    }
  }

  // QUERY_TO_TOPIC maps overwhelmed → something with good anchors
  if (!/overwhelmed:\s*['"]anxiety['"]/.test(script) && !/overwhelmed:\s*['"]anxiety['"]/.test(script)) {
    // allow overwhelmed: 'anxiety' in various forms
    if (!/overwhelmed['"]?\s*:\s*['"]anxiety['"]/.test(script)) {
      fail('QUERY_TO_TOPIC should map overwhelmed → anxiety (or dedicated topic with care verses)');
    }
  }
}

/* ─── 3. Context speakers for famous refs ─── */
function auditContextSpeakers(resolve) {
  const cases = [
    { ref: 'Isaiah 40:31', aboutMust: /isaiah|lord|god/i, aboutMustNot: /^david$/i },
    { ref: 'Isaiah 24:2', aboutMust: /isaiah/i, aboutMustNot: /^david$/i },
    { ref: 'Joshua 22:8', aboutMust: /joshua|narrator/i, aboutMustNot: /^david$/i },
    { ref: 'Deuteronomy 28:22', aboutMust: /moses/i, aboutMustNot: /^david$/i },
    { ref: 'Matthew 11:28', aboutMust: /jesus/i, aboutMustNot: /^david$/i },
    { ref: 'Proverbs 16:3', aboutMust: /solomon/i, aboutMustNot: /^david$/i },
    { ref: 'Romans 8:28', aboutMust: /paul/i, aboutMustNot: /^david$/i },
    { ref: '1 Peter 5:7', aboutMust: /peter/i, aboutMustNot: /^david$/i }
  ];
  for (const c of cases) {
    const hit = resolve(c.ref) || {};
    const about = String(hit.about || '');
    if (c.aboutMust && !c.aboutMust.test(about)) {
      fail(`${c.ref} context about="${about}" fails must-match ${c.aboutMust}`);
    }
    if (c.aboutMustNot && c.aboutMustNot.test(about.trim())) {
      fail(`${c.ref} context about incorrectly "${about}"`);
    }
    if (!speakerBelongsToBook(about, c.ref)) {
      fail(`${c.ref} speaker/book contradiction: about="${about}"`);
    }
    const sit = String(hit.situation || hit.setting || '');
    if (sit.length < 20) {
      fail(`${c.ref} situation too thin: "${sit}"`);
    }
  }
}

/* ─── 4. Plain meaning quality for today’s verse + samples ─── */
function auditPlains(kjv) {
  const plainMap = loadVersePlainMeanings(root);
  const samples = [
    'Proverbs 16:3',
    'Philippians 4:6',
    'Matthew 11:28',
    'Isaiah 40:31',
    'John 3:16',
    'Psalm 23:1',
    'Psalms 23:1'
  ];
  for (const ref of samples) {
    const text = kjvText(kjv, ref);
    if (!text) continue;
    const plain = buildHeroLaymanPlain(ref.replace(/^Psalms\s+/i, 'Psalm '), text, plainMap, root);
    if (isWeakPlainStamp(plain)) {
      fail(`Weak plain for ${ref}: ${String(plain).slice(0, 120)}`);
    }
    // Plain must not be the raw ref
    if (plain && primaryRef(plain) === primaryRef(ref) && plain.length < 40) {
      fail(`Plain for ${ref} looks like a reference string`);
    }
  }
}

/* ─── 5. Topic pages integrity ─── */
function auditTopicPages(kjv, resolve) {
  const files = fs.readdirSync(root).filter((f) => /^topic-.*\.html$/i.test(f));
  if (files.length < 10) {
    fail(`Expected 13-ish topic-*.html pages, found ${files.length}`);
  }
  for (const file of files) {
    const html = fs.readFileSync(path.join(root, file), 'utf8');
    const cards = [...html.matchAll(/data-tdb-topic-vbd="1"/g)].length;
    const refs = [...html.matchAll(/<strong>([^<]*\d+:\d+[^<]*)<\/strong>/g)].map((m) =>
      primaryRef(m[1])
    );
    if (refs.length && cards < refs.length) {
      // hope page has porch + list; allow cards <= refs
      if (cards === 0) fail(`${file}: no topic-vbd context cards`);
    }
    // No sabbath under non-psalm-92 topic cards
    if (!/trauma|grief/i.test(file) && /Sabbath song of thanksgiving/i.test(html) && !/Psalm 92/i.test(html)) {
      fail(`${file}: contains Sabbath song situation without Psalm 92`);
    }
    // Spot-check KJV for first list ref
    const first = refs[0];
    if (first) {
      const t = kjvText(kjv, first);
      if (!t) fail(`${file}: first ref missing KJV: ${first}`);
      const ctx = resolve(first) || {};
      if (ctx.about && !speakerBelongsToBook(ctx.about, first)) {
        fail(`${file}: ${first} about="${ctx.about}" contradicts book`);
      }
    }
  }
}

/* ─── 6. Breakdown never uses ref as text (code contract) ─── */
function auditBreakdownContracts() {
  const vb = fs.readFileSync(path.join(root, 'verse-breakdown.js'), 'utf8');
  if (!vb.includes('Never treat the reference string')) {
    fail('verse-breakdown.js missing guard against ref-as-verse-body');
  }
  if (!vb.includes('Do not append the whole search box')) {
    fail('verse-breakdown.js still appends search box into UOG plan influence (poisons every card)');
  }
  if (!/\\bisaiah\\b/i.test(vb) && !vb.includes('\\bisaiah\\b')) {
    fail('verse-breakdown plainSpeaker should use word-boundary name matching');
  }
}

/* ─── 7. Random full-Bible context sample (stable by UTC day) ─── */
function auditRandomContextSample(kjv, resolve) {
  const keys = Object.keys(kjv || {}).filter((k) => /^\S.+\s+\d+:\d+$/.test(k));
  if (keys.length < 1000) {
    fail(`KJV map too small for random sample (${keys.length})`);
    return;
  }
  const seed = utcDayOfYear(new Date()) * 997 + 2026;
  const sample = sampleRefs(keys, 40, seed);
  let thinCount = 0;
  let missingAbout = 0;
  for (const ref of sample) {
    const hit = resolve(ref) || {};
    const about = String(hit.about || '');
    const sit = String(hit.situation || hit.setting || '');
    if (!about) missingAbout += 1;
    if (!speakerBelongsToBook(about, ref)) {
      fail(`Random sample ${ref}: about="${about}" contradicts book`);
    }
    if (isThinSpeakerLine(sit) && scoreSituationLine(sit) < 20) {
      thinCount += 1;
    }
  }
  /* Book-level fallbacks may still be thin; cap how many we tolerate in the sample. */
  if (thinCount > 28) {
    fail(
      `Random sample: ${thinCount}/40 situations are thin speaker-lines — expand verse-context ranges/chapters`
    );
  }
  if (missingAbout > 15) {
    fail(`Random sample: ${missingAbout}/40 refs missing about`);
  }
}

/* ─── 8. Home feeling chips all resolve to a curated topic or safe search path ─── */
function auditHomeFeelingChips(kjv) {
  const indexHtml = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
  const chips = [...indexHtml.matchAll(/data-topic="([^"]+)"/g)].map((m) => m[1].toLowerCase().trim());
  const unique = [...new Set(chips)].filter(Boolean);
  if (unique.length < 25) {
    fail(`Expected 25+ unique home feeling chips, found ${unique.length}`);
  }

  const script = fs.readFileSync(path.join(root, 'script.js'), 'utf8');
  const topicsChunk = script.match(/const topics = \{([\s\S]*?)\n\};\s*\n/);
  if (!topicsChunk) {
    fail('Could not parse const topics for chip audit');
    return;
  }
  const topicBody = topicsChunk[1];

  function topicHasVerses(name) {
    const re = new RegExp(
      name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + ':\\s*\\{[\\s\\S]*?verses:\\s*\\[',
      'i'
    );
    return re.test(topicBody);
  }

  const queryMap = script.match(/QUERY_TO_TOPIC\s*=\s*\{([\s\S]*?)\n\s*\};/);
  const qmap = queryMap ? queryMap[1] : '';

  function chipMapped(chip) {
    if (topicHasVerses(chip)) return true;
    /* QUERY_TO_TOPIC keys often match chip labels */
    const key = chip.replace(/\s+/g, ' ');
    if (new RegExp(key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + "\\s*:", 'i').test(qmap)) {
      return true;
    }
    /* multi-word chips like "difficult person" */
    if (qmap.toLowerCase().includes("'" + key + "'") || qmap.toLowerCase().includes('"' + key + '"')) {
      return true;
    }
    return false;
  }

  const unmapped = [];
  for (const chip of unique) {
    if (!chipMapped(chip)) unmapped.push(chip);
  }
  /* Allow a small set of free-text chips that fall through to keyword search */
  if (unmapped.length > 12) {
    fail(
      `Too many home chips without topics/QUERY_TO_TOPIC mapping (${unmapped.length}): ${unmapped.slice(0, 12).join(', ')}`
    );
  }

  /* Spot-check major chips have KJV-backed verse lists */
  const core = ['anxiety', 'fear', 'grief', 'hope', 'peace', 'strength', 'parenting', 'forgiveness'];
  for (const name of core) {
    if (!topicHasVerses(name)) {
      fail(`Core feeling topic "${name}" missing verses array in script.js`);
    }
  }
}

/* ─── 9. Topic page cards: no weak stamps, situation not thinner than resolver ─── */
function auditTopicCardQuality(resolve) {
  const plainMap = loadVersePlainMeanings(root);
  const files = fs.readdirSync(root).filter((f) => /^topic-.*\.html$/i.test(f));
  for (const file of files) {
    const html = fs.readFileSync(path.join(root, file), 'utf8');
    if (/In plain terms for life today:/i.test(html) || /Sit with that until one phrase lands/i.test(html)) {
      fail(`${file}: contains weak plain stamp in static HTML`);
    }
    const combinedBlocks = [
      ...html.matchAll(/tdb-topic-vbd__combined"[^>]*>([^<]*)</gi),
    ];
    for (const m of combinedBlocks.slice(0, 8)) {
      const body = stripHtml(m[1] || '');
      if (isWeakPlainStamp(body)) {
        fail(`${file}: topic-vbd combined is weak stamp: ${body.slice(0, 80)}`);
      }
      if (/ speaking to /i.test(body) && body.length < 120 && /What was going on:/i.test(body)) {
        /* thin speaker as situation inside combined */
        const sitPart = body.replace(/^What was going on:\s*/i, '').replace(/\.?\s*What it means:[\s\S]*$/i, '');
        if (isThinSpeakerLine(sitPart)) {
          fail(`${file}: thin speaker-line situation in topic card: ${sitPart.slice(0, 80)}`);
        }
      }
    }
    void plainMap;
    void resolve;
  }
}

/* ─── 10. Engine sample: load verse-breakdown in VM when possible ─── */
function auditEngineSample(kjv, resolve) {
  /* Static checks on buildThemeLaymanPlain output via hero-layman for random refs */
  const plainMap = loadVersePlainMeanings(root);
  const keys = Object.keys(kjv || {}).filter((k) => /^(John|Romans|Psalms?|Matthew|Proverbs|Isaiah)\s+\d+:\d+$/i.test(k));
  const sample = sampleRefs(keys, 25, utcDayOfYear(new Date()) + 42);
  for (const ref of sample) {
    const text = kjvText(kjv, ref);
    if (!text) continue;
    const plain = buildHeroLaymanPlain(ref.replace(/^Psalms\s+/i, 'Psalm '), text, plainMap, root);
    if (isWeakPlainStamp(plain)) {
      fail(`Engine sample weak plain for ${ref}: ${String(plain).slice(0, 100)}`);
    }
    const ctx = resolve(ref) || {};
    const sit = String(ctx.situation || ctx.setting || '');
    if (sit && isThinSpeakerLine(sit) && String(ctx.setting || '').length > sit.length + 20) {
      fail(`${ref}: situation is thin speaker-line while setting is richer`);
    }
  }
}

async function main() {
  console.log('Teaching integrity audit (fine-tooth comb)\n');
  const kjv = loadKjv();
  const resolve = loadVerseContextResolve();

  auditSourceContracts();
  auditBreakdownContracts();
  auditHeroInject(kjv, resolve);
  auditFeelingSearch(kjv);
  auditContextSpeakers(resolve);
  auditPlains(kjv);
  auditTopicPages(kjv, resolve);
  auditRandomContextSample(kjv, resolve);
  auditHomeFeelingChips(kjv);
  auditTopicCardQuality(resolve);
  auditEngineSample(kjv, resolve);

  console.log('Checks complete.\n');
  if (failures.length) {
    console.error(`FAIL: ${failures.length} teaching integrity issue(s):\n`);
    failures.forEach((f, i) => console.error(`  ${i + 1}. ${f}`));
    console.error('\nThese bugs must not ship. Fix before deploy.');
    process.exit(1);
  }
  console.log('PASS: teaching integrity gate clean.');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
