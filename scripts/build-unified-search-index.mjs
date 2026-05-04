import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const outDir = path.join(root, 'data');
const outFile = path.join(outDir, 'unified-search-index.json');
const rootMirrorFile = path.join(root, 'unified-search-index.json');

const SOURCE_PATHS = {
  wordHelps: path.join(root, 'kjv-word-notes.json'),
  siteSearch: path.join(root, 'data', 'site-search-index.json'),
  kjvVerses: path.join(root, 'kjv.json'),
  canonDailyVerse: path.join(root, 'api', 'src', 'pilot-data', 'canon-daily-verse.json'),
  canonDailyVerseAlt: path.join(root, 'next-app', 'data', 'canon-daily-verse.json')
};

function readJson(filePath, fallback) {
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch (_) {
    return fallback;
  }
}

function slugify(value) {
  return String(value || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function tokenize(value) {
  return String(value || '')
    .toLowerCase()
    .replace(/[^a-z0-9:\s'-]+/g, ' ')
    .split(/\s+/)
    .map(function (token) { return token.trim(); })
    .filter(function (token) { return token && token.length > 2; });
}

function uniqueStrings(values) {
  const seen = new Set();
  return (values || []).reduce(function (acc, value) {
    const cleaned = String(value || '').trim();
    if (!cleaned) return acc;
    const key = cleaned.toLowerCase();
    if (seen.has(key)) return acc;
    seen.add(key);
    acc.push(cleaned);
    return acc;
  }, []);
}

function uniqueTokens(values) {
  const seen = new Set();
  return (values || []).reduce(function (acc, value) {
    tokenize(value).forEach(function (token) {
      if (seen.has(token)) return;
      seen.add(token);
      acc.push(token);
    });
    return acc;
  }, []);
}

function buildWordHelpSummary(entry) {
  return String(entry.shortGloss || entry.note || '').trim();
}

function buildWordHelpFullSummary(entry) {
  const deep = entry.deepDive || {};
  return String(deep.studyNotes || '').trim();
}

function buildWordHelpSmallStep(entry) {
  const direct = String(entry.step || entry.howToRead || '').trim();
  if (direct) return direct;
  const deep = entry.deepDive || {};
  const studyNotes = String(deep.studyNotes || '').trim();
  if (!studyNotes) return 'Open this word slowly and let Scripture set the meaning.';
  const match = studyNotes.match(/(?:Small step|One small step):\s*([^.]*(?:\.[^.]*)?)/i);
  return match && match[1] ? match[1].trim() : 'Open this word slowly and let Scripture set the meaning.';
}

function buildWordHelpEntry(entry) {
  const word = String(entry.word || '').trim();
  if (!word) return null;
  const deep = entry.deepDive || {};
  const refs = uniqueStrings([]
    .concat(Array.isArray(deep.keyCrossRefs) ? deep.keyCrossRefs : [])
    .concat(Array.isArray(entry.examples) ? entry.examples : []));
  return {
    id: 'word-' + slugify(word),
    type: 'word_help',
    key: word.toLowerCase(),
    title: word,
    summary: buildWordHelpSummary(entry),
    fullSummary: buildWordHelpFullSummary(entry),
    keywords: uniqueTokens([
      word,
      entry.note,
      entry.shortGloss,
      entry.why,
      entry.whyToday,
      entry.step,
      entry.howToRead,
      deep.kjvEraUsage,
      deep.studyNotes,
      Array.isArray(deep.relatedWords) ? deep.relatedWords.join(' ') : '',
      Array.isArray(entry.examples) ? entry.examples.join(' ') : ''
    ]),
    refs: refs,
    href: '/bible/tools.html#kjv-word-help-' + slugify(word),
    smallStep: buildWordHelpSmallStep(entry),
    deepAvailable: Boolean(
      String(deep.kjvEraUsage || '').trim() ||
      String(deep.studyNotes || '').trim() ||
      (Array.isArray(deep.keyCrossRefs) && deep.keyCrossRefs.length)
    ),
    priority: 88,
    sourceRoom: 'workshop'
  };
}

function inferPageType(url) {
  const href = String(url || '');
  if (/\/plans\.html\?plan=/i.test(href)) return 'plan';
  if (/\/(?:bible-tool|bible\/tools|reader|study|memorize|mystudy|my-verses|prayer-wall|search)\b/i.test(href)) return 'tool';
  return 'page';
}

function inferSourceRoom(url, type) {
  if (type === 'plan') return 'plans';
  const href = String(url || '');
  if (/\/bible\/tools/i.test(href)) return 'workshop';
  if (/\/bible-tool/i.test(href)) return 'bible-tool';
  if (/\/reader/i.test(href)) return 'reader';
  if (/\/mystudy|\/my-verses/i.test(href)) return 'mystudy';
  if (/\/search/i.test(href)) return 'search';
  return 'site';
}

function buildSiteEntrySummary(entry, type) {
  const title = String(entry.t || '').trim();
  if (type === 'plan') return 'A gentle battle plan door inside the site.';
  if (type === 'tool') {
    if (/study workshop/i.test(title)) return 'Open the Study workshop for word helps, concordance, and deeper study.';
    if (/bible tool/i.test(title)) return 'Open the Bible Tool for lookup, reading, and verse study.';
    return 'Open this tool and keep your next step calm and simple.';
  }
  return 'A quiet page door inside the site map.';
}

function buildSiteEntrySmallStep(entry, type) {
  if (type === 'plan') return 'Open one day only if it helps today.';
  if (type === 'tool') return 'Open the room you need and leave the rest for later.';
  return 'Open one quiet door and let the rest wait.';
}

function buildSiteEntry(entry) {
  const title = String(entry.t || '').trim();
  const href = String(entry.u || '').trim();
  if (!title || !href) return null;
  const type = inferPageType(href);
  return {
    id: type + '-' + slugify(href),
    type: type,
    key: slugify(title),
    title: title,
    summary: buildSiteEntrySummary(entry, type),
    fullSummary: '',
    keywords: uniqueTokens([title, entry.k, href]),
    refs: [],
    href: href,
    smallStep: buildSiteEntrySmallStep(entry, type),
    deepAvailable: false,
    priority: type === 'plan' ? 72 : type === 'tool' ? 64 : 56,
    sourceRoom: inferSourceRoom(href, type)
  };
}

function buildVerseEntry(entry, basePriority, todayRef) {
  const ref = String(entry && (entry.ref || entry.reference) || '').trim();
  const text = String(entry && entry.text || '').trim();
  if (!ref || !text) return null;
  return {
    id: 'verse-' + slugify(ref),
    type: 'verse',
    key: ref.toLowerCase(),
    title: ref,
    summary: text,
    fullSummary: '',
    keywords: uniqueTokens([ref, text]),
    refs: [ref],
    href: '/bible-tool.html?q=' + encodeURIComponent(ref),
    smallStep: ref === todayRef
      ? 'Let today\'s verse stay close and carry only the next step.'
      : 'Open the verse and let it rest with you for a minute.',
    deepAvailable: false,
    priority: ref === todayRef ? Math.min(basePriority + 10, 98) : basePriority,
    sourceRoom: 'bible-tool'
  };
}

function buildVerseEntries() {
  const canonDaily = readJson(SOURCE_PATHS.canonDailyVerse, null) || readJson(SOURCE_PATHS.canonDailyVerseAlt, {});
  const kjvVerses = readJson(SOURCE_PATHS.kjvVerses, []);
  const todayRef = canonDaily && canonDaily.today && canonDaily.today.reference
    ? String(canonDaily.today.reference).trim()
    : '';
  const rawEntries = []
    .concat(Array.isArray(kjvVerses) ? kjvVerses : [])
    .concat(canonDaily && canonDaily.today ? [canonDaily.today] : [])
    .concat(Array.isArray(canonDaily && canonDaily.catalog) ? canonDaily.catalog : []);
  const byRef = new Map();
  rawEntries.forEach(function (entry) {
    const built = buildVerseEntry(entry, 78, todayRef);
    if (!built) return;
    const existing = byRef.get(built.id);
    if (!existing || built.priority > existing.priority || built.summary.length > existing.summary.length) {
      byRef.set(built.id, built);
    }
  });
  return Array.from(byRef.values());
}

function main() {
  const wordNotes = readJson(SOURCE_PATHS.wordHelps, {});
  const siteSearch = readJson(SOURCE_PATHS.siteSearch, {});
  const wordEntries = Array.isArray(wordNotes.words) ? wordNotes.words : [];
  const siteEntries = Array.isArray(siteSearch.entries) ? siteSearch.entries : [];
  const unifiedEntries = [];
  const seen = new Set();

  function push(entry) {
    if (!entry || !entry.id || seen.has(entry.id)) return;
    seen.add(entry.id);
    unifiedEntries.push(entry);
  }

  wordEntries.forEach(function (entry) { push(buildWordHelpEntry(entry)); });
  buildVerseEntries().forEach(push);
  siteEntries.forEach(function (entry) { push(buildSiteEntry(entry)); });

  unifiedEntries.sort(function (a, b) {
    return (b.priority || 0) - (a.priority || 0) || String(a.title || '').localeCompare(String(b.title || ''));
  });

  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
  const payload = {
    v: 1,
    generatedAt: new Date().toISOString(),
    entries: unifiedEntries
  };
  fs.writeFileSync(outFile, JSON.stringify(payload, null, 2), 'utf8');
  fs.writeFileSync(rootMirrorFile, JSON.stringify(payload, null, 2), 'utf8');
  console.log(
    'Wrote',
    path.relative(root, outFile),
    '(' + unifiedEntries.length + ' entries:',
    wordEntries.length + ' word helps,',
    buildVerseEntries().length + ' verses,',
    siteEntries.length + ' site doors)'
  );
}

main();
