#!/usr/bin/env node
/**
 * Audit Story Library: coloring art paths + read-quiz key/content checks.
 *
 * Usage:
 *   node scripts/audit-story-library-art-qa.mjs
 *   node scripts/audit-story-library-art-qa.mjs --strict   # exit 1 on forbidden art
 *
 * Writes kids/STORY-ART-QA-AUDIT.json
 */
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const strict = process.argv.includes('--strict');

function loadBattleAndQuiz() {
  const battleSrc = fs.readFileSync(path.join(root, 'kids/kids-battle.js'), 'utf8');
  const quizSrc = fs.readFileSync(path.join(root, 'kids/kids-read-quiz-data.js'), 'utf8');
  const sandbox = {
    window: {},
    document: {
      getElementById: () => null,
      querySelector: () => null,
      createElement: () => ({
        style: {},
        setAttribute() {},
        appendChild() {},
        addEventListener() {},
      }),
      addEventListener() {},
      body: { appendChild() {} },
    },
    localStorage: { getItem: () => null, setItem() {}, removeItem() {} },
    sessionStorage: { getItem: () => null, setItem() {} },
    navigator: { userAgent: 'node' },
    console: { log() {}, warn() {}, error() {}, info() {} },
    setTimeout,
    clearTimeout,
    location: { href: '', search: '', pathname: '/kids/' },
    history: { replaceState() {}, pushState() {} },
    Image: function () {},
    HTMLElement: function () {},
    CustomEvent: function () {},
    SpeechSynthesisUtterance: function () {},
    speechSynthesis: { speak() {}, cancel() {} },
  };
  sandbox.global = sandbox;
  sandbox.self = sandbox;
  sandbox.window = sandbox;
  sandbox.window.addEventListener = () => {};
  try {
    vm.runInNewContext(battleSrc, sandbox, { timeout: 30000, filename: 'kids-battle.js' });
  } catch {
    /* init side-effects may throw; stories export still runs */
  }
  try {
    vm.runInNewContext(quizSrc, sandbox, { timeout: 60000, filename: 'kids-read-quiz-data.js' });
  } catch {
    /* ignore */
  }
  return {
    stories: sandbox.window.TDB_BIBLE_STORIES || {},
    quiz: sandbox.TDB_KIDS_READ_QUIZ || sandbox.window.TDB_KIDS_READ_QUIZ || {},
  };
}

function loadColoringHelpers() {
  const corner = fs.readFileSync(path.join(root, 'kids/kids-corner.js'), 'utf8');
  const fnStart = corner.indexOf('function tdbColoringSlugForLibraryKey');
  const fnEnd = corner.indexOf(
    '/* ────────────────────────────────────────────────────\n   * COLORING MODULE'
  );
  if (fnStart < 0 || fnEnd < 0) throw new Error('Cannot extract coloring helpers from kids-corner.js');
  const helperSandbox = {};
  vm.runInNewContext(
    corner.slice(fnStart, fnEnd) +
      '\nthis.tdbColoringSlugForLibraryKey=tdbColoringSlugForLibraryKey;' +
      'this.getColoringArtUrlsForLibraryKey=getColoringArtUrlsForLibraryKey;' +
      'this.isSafeColoringPagePath=isSafeColoringPagePath;',
    helperSandbox
  );
  return helperSandbox;
}

function fileExists(url) {
  return fs.existsSync(path.join(root, String(url).replace(/^\//, '')));
}

/** Story key/title must not resolve to clearly unrelated art. */
const FORBIDDEN = [
  { storyRe: /solomon/i, artRe: /boy-david|david-and-goliath|goliath/i, why: 'Solomon must not use David art' },
  { storyRe: /mephibosheth/i, artRe: /boy-david|goliath/i, why: 'Mephibosheth must not use boy-david' },
  { storyRe: /bathsheba/i, artRe: /boy-david|goliath/i, why: 'Bathsheba story must not use boy-david' },
  { storyRe: /gardenPrayer|garden prayer/i, artRe: /jesus-tempted|tempt/i, why: 'Gethsemane ≠ wilderness temptation' },
  { storyRe: /elijahHoreb|still small/i, artRe: /elijah-ravens|ravens/i, why: 'Horeb ≠ ravens' },
  { storyRe: /maryMartha|marthaServe|marySit/i, artRe: /jesus-children|children/i, why: 'Mary & Martha ≠ children blessing' },
  { storyRe: /figTree|jesusWeeps|jesusAuthority/i, artRe: /triumphal/i, why: 'Must not use triumphal-entry art' },
  { storyRe: /crucifix|crossCarry|peterDenial|jesusArrest|trialBefore|trial$/i, artRe: /empty-tomb/i, why: 'Passion ≠ empty tomb art' },
  { storyRe: /parableNet/i, artRe: /fishers/i, why: 'Net parable ≠ fishers of men' },
  { storyRe: /absalom/i, artRe: /spares-saul|boy-david/i, why: 'Absalom ≠ Saul cave' },
];

const GENERIC_CORRECT = [
  /something scary with no happy ending/i,
  /a mean person won/i,
  /everyone was perfect/i,
];

const { stories, quiz } = loadBattleAndQuiz();
const { tdbColoringSlugForLibraryKey: slugFor, getColoringArtUrlsForLibraryKey: artUrls, isSafeColoringPagePath: safe } =
  loadColoringHelpers();

const storyKeys = Object.keys(stories);
const quizKeys = Object.keys(quiz);

const missingArt = [];
const noSlug = [];
const forbiddenHits = [];
const unsafePaths = [];
const artOk = [];
const missingQuiz = [];
const quizNoStory = [];
const quizTitleMismatch = [];
const quizAnswerIssues = [];

for (const key of storyKeys) {
  const s = stories[key];
  const title = (s && s.title) || key;
  const slug = slugFor(key);
  const urls = artUrls(key);
  if (!slug) {
    noSlug.push({ key, title });
  } else {
    let anyExist = false;
    for (const u of urls) {
      if (!safe(u)) unsafePaths.push({ key, u });
      if (fileExists(u)) anyExist = true;
      else missingArt.push({ key, title, slug, u });
    }
    if (anyExist) artOk.push(key);
    const pathStr = urls.join(' ');
    for (const rule of FORBIDDEN) {
      if (rule.storyRe.test(key) || rule.storyRe.test(title)) {
        if (rule.artRe.test(pathStr) || rule.artRe.test(slug || '')) {
          forbiddenHits.push({ key, title, slug, path: pathStr, why: rule.why });
        }
      }
    }
  }

  const q = quiz[key];
  if (!q) {
    missingQuiz.push({ key, title });
  } else if (Array.isArray(q.questions)) {
    for (let i = 0; i < q.questions.length; i++) {
      const qq = q.questions[i];
      if (!qq || !Array.isArray(qq.choices)) continue;
      const ci = qq.correctIndex;
      if (typeof ci !== 'number' || ci < 0 || ci >= qq.choices.length) {
        quizAnswerIssues.push({ key, title, q: i, issue: 'bad correctIndex ' + ci });
        continue;
      }
      const correct = String(qq.choices[ci] || '');
      if (qq.choices.some((c, idx) => idx !== ci && c === correct)) {
        quizAnswerIssues.push({ key, title, q: i, issue: 'duplicate correct choice' });
      }
      if (GENERIC_CORRECT.some((r) => r.test(correct))) {
        quizAnswerIssues.push({
          key,
          title,
          q: i,
          issue: 'generic joke marked correct: ' + correct.slice(0, 60),
        });
      }
    }
    const qBlob = JSON.stringify(q).toLowerCase();
    const narr = ((s.narration || '') + ' ' + title + ' ' + (s.kjvRef || '') + ' ' + key).toLowerCase();
    const foreign = [
      ['goliath', /\bgoliath\b/],
      ['noah', /\bnoah\b/],
      ['jonah', /\bjonah\b/],
      ['daniel', /\bdaniel\b/],
      ['moses', /\bmoses\b/],
      ['solomon', /\bsolomon\b/],
      ['esther', /\besther\b/],
      ['zacchaeus', /\bzacchaeus\b/],
      ['lazarus', /\blazarus\b/],
    ];
    for (const [name, re] of foreign) {
      if (!re.test(qBlob) || re.test(narr)) continue;
      const correctText = (q.questions || [])
        .map((x) => (x.choices && x.choices[x.correctIndex]) || '')
        .join(' ')
        .toLowerCase();
      if (re.test(correctText)) {
        quizTitleMismatch.push({ key, title, foreign: name, sample: correctText.slice(0, 80) });
      }
    }
  }
}

for (const k of quizKeys) {
  if (!stories[k]) quizNoStory.push(k);
}

const report = {
  generated: new Date().toISOString(),
  counts: {
    stories: storyKeys.length,
    quiz: quizKeys.length,
    artOk: artOk.length,
    noSlug: noSlug.length,
    missingArt: missingArt.length,
    forbiddenHits: forbiddenHits.length,
    unsafePaths: unsafePaths.length,
    missingQuiz: missingQuiz.length,
    quizNoStory: quizNoStory.length,
    quizTitleMismatch: quizTitleMismatch.length,
    quizAnswerIssues: quizAnswerIssues.length,
  },
  forbiddenHits,
  missingArt: [...new Map(missingArt.map((x) => [x.key + '|' + x.u, x])).values()],
  noSlug,
  quizTitleMismatch,
  quizAnswerIssues,
  missingQuiz,
  quizNoStory,
  notes: [
    'Color & Tell (color-and-tell.js) is audited separately by scripts/verify-coloring-art.mjs',
    'noSlug stories fall back to legacy panel-*.svg (often shared placeholders) — not wrong Q&A',
    'Prefer empty coloring map over wrong art so openStory uses legacy panels or empty',
  ],
};

const outPath = path.join(root, 'kids/STORY-ART-QA-AUDIT.json');
fs.writeFileSync(outPath, JSON.stringify(report, null, 2));

const c = report.counts;
console.log('Story Library art + Q&A audit');
console.log('  stories:', c.stories);
console.log('  quiz packs:', c.quiz);
console.log('  coloring art OK:', c.artOk);
console.log('  no coloring slug:', c.noSlug);
console.log('  missing art files:', c.missingArt);
console.log('  FORBIDDEN art mismatches:', c.forbiddenHits);
console.log('  quiz answer issues:', c.quizAnswerIssues);
console.log('  quiz foreign contamination:', c.quizTitleMismatch);
console.log('  missing quiz packs:', c.missingQuiz);
console.log('  quiz keys without story:', c.quizNoStory);
console.log('Wrote', path.relative(root, outPath));

if (c.forbiddenHits) {
  console.log('\nForbidden hits:');
  forbiddenHits.forEach((h) => console.log(' -', h.key, '→', h.slug, '|', h.why));
}
if (c.quizAnswerIssues) {
  console.log('\nQuiz answer issues:');
  quizAnswerIssues.slice(0, 20).forEach((h) => console.log(' -', JSON.stringify(h)));
}
if (c.quizTitleMismatch) {
  console.log('\nQuiz foreign contamination:');
  quizTitleMismatch.slice(0, 20).forEach((h) => console.log(' -', JSON.stringify(h)));
}

const hardFail =
  c.missingArt > 0 ||
  c.unsafePaths > 0 ||
  c.quizAnswerIssues > 0 ||
  c.quizTitleMismatch > 0 ||
  (strict && c.forbiddenHits > 0);

if (hardFail) {
  console.error('\nAUDIT FAILED');
  process.exit(1);
}
console.log('\nAUDIT PASSED (no wrong Q&A; no missing mapped art files' + (strict ? '; no forbidden art' : '') + ')');
process.exit(0);
