import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { JSDOM } from 'jsdom';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');
const manifestPath = path.join(repoRoot, 'data', 'verse-breakdown-manifest.json');
const kjvFullPath = path.join(repoRoot, 'data', 'kjv-full.json');
const kjvPath = path.join(repoRoot, 'kjv.json');
const runtimePath = path.join(repoRoot, 'verse-breakdown.js');
const heroFirstPaintPath = path.join(repoRoot, 'hero-daily-first-paint.js');
const distRoot = path.join(repoRoot, 'dist');
const distSeedPath = path.join(distRoot, 'verse-breakdown-overrides.js');
const CURRENT_BREAKDOWN_TOKEN = '20260417-hydration';
const GROUPS = ['general', 'kid', 'teen', 'family', 'pastor', 'church-leader', 'missionary', 'street-preacher', 'bible-study-group'];
const STATIC_PAGE_CHECKS = [
  'dist/verse.html',
  'dist/calm.html',
  'dist/family.html',
  'dist/family-armor.html',
  'dist/kids-corner.html',
  'dist/bible/index.html',
  'dist/church/daily.html'
];

function normalizeRef(ref) {
  return String(ref || '')
    .replace(/\s+/g, ' ')
    .replace(/[–—]/g, '-')
    .replace(/^Psalms\s+/i, 'Psalm ')
    .replace(/\s*\(KJV\)\s*$/i, '')
    .trim();
}

function resolveVerseText(ref, kjv, sourceTexts) {
  const normalized = normalizeRef(ref);
  if (sourceTexts && sourceTexts[normalized]) return sourceTexts[normalized];
  if (kjv[normalized]) return kjv[normalized];
  const rangeMatch = normalized.match(/^(.+?)\s+(\d+):(\d+)-(?:(\d+):)?(\d+)$/);
  if (!rangeMatch) return '';
  const book = rangeMatch[1];
  const startChapter = Number(rangeMatch[2]);
  const startVerse = Number(rangeMatch[3]);
  const endChapter = Number(rangeMatch[4] || rangeMatch[2]);
  const endVerse = Number(rangeMatch[5]);
  if (!book || !startChapter || !startVerse || !endChapter || !endVerse) return '';
  if (endChapter < startChapter) return '';
  const verses = [];
  for (let chapter = startChapter; chapter <= endChapter; chapter += 1) {
    const verseStart = chapter === startChapter ? startVerse : 1;
    const verseEnd = chapter === endChapter ? endVerse : 300;
    for (let verse = verseStart; verse <= verseEnd; verse += 1) {
      const key = `${book} ${chapter}:${verse}`;
      if (!kjv[key]) {
        if (chapter === endChapter && verse > endVerse) break;
        if (verse === verseStart) return '';
        break;
      }
      verses.push(kjv[key]);
      if (chapter === endChapter && verse === endVerse) return verses.join(' ');
    }
  }
  return verses.join(' ');
}

function createDom(html, data) {
  const sanitizedHtml = String(html || '').replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '');
  const dom = new JSDOM(sanitizedHtml, {
    runScripts: 'outside-only',
    url: 'https://www.todaysdailybattle.com/'
  });
  const { window } = dom;
  window.requestAnimationFrame = (cb) => cb();
  window.cancelAnimationFrame = () => {};
  window.MutationObserver = undefined;
  window.matchMedia = window.matchMedia || function () {
    return { matches: false, addListener() {}, removeListener() {}, addEventListener() {}, removeEventListener() {} };
  };
  window.TDB_VERSE_BREAKDOWN_DATA = data;
  return dom;
}

async function loadRuntime(dom) {
  const runtimeCode = await fs.readFile(runtimePath, 'utf8');
  dom.window.eval(runtimeCode);
  dom.window.document.dispatchEvent(new dom.window.Event('DOMContentLoaded', { bubbles: true }));
}

function assertBreakdownShape(ref, group, breakdown) {
  if (!breakdown || typeof breakdown !== 'object') {
    throw new Error(`No breakdown returned for ${ref} [${group}]`);
  }
  ['plainExplanation', 'groupApplication', 'modernApplication'].forEach((field) => {
    const value = String(breakdown[field] || '').trim();
    if (!value) throw new Error(`Missing ${field} for ${ref} [${group}]`);
  });
}

async function verifySurfacedRefs(manifest, kjv) {
  const data = { surfacedRefs: manifest.surfacedRefs, overrides: manifest.overrides };
  const dom = createDom('<!doctype html><html><body></body></html>', data);
  await loadRuntime(dom);
  const api = dom.window.TDBVerseBreakdown;
  manifest.surfacedRefs.forEach((ref) => {
    const text = resolveVerseText(ref, kjv, manifest.sourceTexts);
    if (!text) {
      throw new Error(`Missing verse text for surfaced ref ${ref}`);
    }
    GROUPS.forEach((group) => {
      assertBreakdownShape(ref, group, api.getBreakdown(ref, text, { group }));
    });
  });
}

async function verifyStaticPages(manifest) {
  const data = { surfacedRefs: manifest.surfacedRefs, overrides: manifest.overrides };
  const failures = [];
  for (const relativePath of STATIC_PAGE_CHECKS) {
    const absolute = path.join(repoRoot, relativePath);
    let html;
    try {
      html = await fs.readFile(absolute, 'utf8');
    } catch {
      continue;
    }
    const dom = createDom(html, data);
    await loadRuntime(dom);
    dom.window.TDBVerseBreakdown.enhanceVisibleVerseContainers(dom.window.document);
    const missing = dom.window.TDBVerseBreakdown.getMissingVisibleBreakdowns(dom.window.document);
    if (missing.length) {
      failures.push(`${relativePath}: ${missing.map((item) => item.ref || item.id || item.className || 'unknown host').join(', ')}`);
    }
  }
  if (failures.length) {
    throw new Error(`Visible verse hosts missing breakdowns:\n${failures.join('\n')}`);
  }
}

async function verifyHydrationAssets() {
  const [seedAsset, heroFirstPaint, indexHtml, verseHtml] = await Promise.all([
    fs.readFile(distSeedPath, 'utf8'),
    fs.readFile(heroFirstPaintPath, 'utf8'),
    fs.readFile(path.join(repoRoot, 'index.html'), 'utf8'),
    fs.readFile(path.join(repoRoot, 'verse.html'), 'utf8')
  ]);
  if (!seedAsset.includes('TDB_VERSE_BREAKDOWN_DATA')) {
    throw new Error('verse-breakdown-overrides.js did not build into dist with seed data.');
  }
  ['__TDB_applyHeroVotdFromInputs', 'heroSimpleBreakdown', 'HERO_BOOK_CTX'].forEach((token) => {
    if (!heroFirstPaint.includes(token)) {
      throw new Error(
        `hero-daily-first-paint.js is missing "${token}" (homepage verse-of-the-day simple + deep breakdown).`
      );
    }
  });
  if (!indexHtml.includes('id="heroSimpleBreakdown"') || !indexHtml.includes('id="heroDeepBreakdown"')) {
    throw new Error('index.html must include #heroSimpleBreakdown and #heroDeepBreakdown (homepage VOTD).');
  }
  if (!indexHtml.includes(`verse-breakdown-overrides.js?v=${CURRENT_BREAKDOWN_TOKEN}`)) {
    throw new Error('index.html is missing the current verse-breakdown override seed include.');
  }
  if (!indexHtml.includes(`verse-breakdown.js?v=${CURRENT_BREAKDOWN_TOKEN}`)) {
    throw new Error('index.html is missing the current verse-breakdown runtime token.');
  }
  if (!indexHtml.includes(`hero-daily-first-paint.js?v=${CURRENT_BREAKDOWN_TOKEN}`)) {
    throw new Error('index.html is missing the current hero first-paint token.');
  }
  if (!verseHtml.includes(`verse-breakdown-overrides.js?v=${CURRENT_BREAKDOWN_TOKEN}`)) {
    throw new Error('verse.html is missing the current verse-breakdown override seed include.');
  }
  if (!verseHtml.includes(`verse-breakdown.js?v=${CURRENT_BREAKDOWN_TOKEN}`)) {
    throw new Error('verse.html is missing the current verse-breakdown runtime token.');
  }
}

async function ensureDistExists() {
  const stats = await fs.stat(distRoot).catch(() => null);
  if (!stats || !stats.isDirectory()) {
    throw new Error('dist/ is missing. Run npm run build before verifying verse breakdown coverage.');
  }
}

async function main() {
  const kjvSourcePath = await fs.stat(kjvFullPath).then(() => kjvFullPath).catch(() => kjvPath);
  const [manifestRaw, kjvRaw] = await Promise.all([
    fs.readFile(manifestPath, 'utf8'),
    fs.readFile(kjvSourcePath, 'utf8')
  ]);
  const manifest = JSON.parse(manifestRaw);
  const kjvParsed = JSON.parse(kjvRaw);
  const kjv = Array.isArray(kjvParsed)
    ? kjvParsed.reduce((acc, entry) => {
        if (entry && entry.ref && entry.text) acc[normalizeRef(entry.ref)] = String(entry.text).replace(/\s+/g, ' ').trim();
        return acc;
      }, {})
    : kjvParsed;
  if (!Array.isArray(manifest.surfacedRefs) || !manifest.surfacedRefs.length) {
    throw new Error('Verse breakdown manifest is empty.');
  }
  await verifySurfacedRefs(manifest, kjv);
  await ensureDistExists();
  await verifyStaticPages(manifest);
  await verifyHydrationAssets();
  console.log(`verify-verse-breakdown-coverage: ${manifest.surfacedRefs.length} surfaced refs verified across ${GROUPS.length} groups + hydration assets`);
}

main().catch((error) => {
  console.error(error.message || error);
  process.exit(1);
});
