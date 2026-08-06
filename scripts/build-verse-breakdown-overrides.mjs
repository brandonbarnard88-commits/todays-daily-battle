import fs from 'fs/promises';
import path from 'path';
import vm from 'vm';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');
const manifestPath = path.join(repoRoot, 'data', 'verse-breakdown-manifest.json');
const runtimePath = path.join(repoRoot, 'verse-breakdown-overrides.js');
const kjvFullPath = path.join(repoRoot, 'data', 'kjv-full.json');
const kjvPath = path.join(repoRoot, 'kjv.json');
const scriptPath = path.join(repoRoot, 'script.js');
const verseContextPath = path.join(repoRoot, 'verse-context.js');

let resolveVerseContextFn = null;

async function loadVerseContextResolver() {
  if (resolveVerseContextFn) return resolveVerseContextFn;
  const code = await fs.readFile(verseContextPath, 'utf8');
  const sandbox = { console };
  sandbox.window = sandbox;
  sandbox.globalThis = sandbox;
  vm.runInNewContext(code, sandbox, { filename: 'verse-context.js' });
  if (typeof sandbox.TDB_resolveVerseContext !== 'function') {
    throw new Error('build-verse-breakdown-overrides: TDB_resolveVerseContext missing');
  }
  resolveVerseContextFn = sandbox.TDB_resolveVerseContext;
  return resolveVerseContextFn;
}

function contextForRef(ref) {
  if (!resolveVerseContextFn) {
    return { about: 'The biblical writer', to: 'God’s people in their time (and you today)' };
  }
  const hit = resolveVerseContextFn(ref) || {};
  const about = String(hit.about || '').trim();
  const to = String(hit.to || '').trim();
  if (about && to) return { about, to };
  const book = parseBook(ref);
  const ctx = BOOK_CONTEXT[book] || { s: 'The biblical writer', a: 'God’s people in their time (and you today)' };
  return { about: ctx.s, to: ctx.a };
}

const SCANABLE_EXTENSIONS = new Set(['.html', '.js', '.json']);
const EXCLUDED_DIRS = new Set([
  '.git',
  '.cursor',
  'dist',
  'docs',
  'node_modules',
  'scripts',
  'tests',
  'test-results',
  'playwright-report',
  '.worktrees',
  'next-app',
  'tmp',
  'backup',
  'firebase-functions',
  'api'
]);
const LARGE_FILE_ALLOWLIST = new Set([
  'hero-daily-365-data.js',
  'kids-verses-365.js',
  'plans-data.js',
  'plans.html',
  'index.html',
  'script.js'
]);
const LARGE_FILE_LIMIT = 600 * 1024;
const BOOKS = [
  'Genesis', 'Exodus', 'Leviticus', 'Numbers', 'Deuteronomy', 'Joshua', 'Judges', 'Ruth',
  '1 Samuel', '2 Samuel', '1 Kings', '2 Kings', '1 Chronicles', '2 Chronicles', 'Ezra', 'Nehemiah', 'Esther', 'Job',
  'Psalm', 'Psalms', 'Proverbs', 'Ecclesiastes', 'Song of Solomon', 'Isaiah', 'Jeremiah', 'Lamentations', 'Ezekiel', 'Daniel',
  'Hosea', 'Joel', 'Amos', 'Obadiah', 'Jonah', 'Micah', 'Nahum', 'Habakkuk', 'Zephaniah', 'Haggai', 'Zechariah', 'Malachi',
  'Matthew', 'Mark', 'Luke', 'John', 'Acts', 'Romans', '1 Corinthians', '2 Corinthians', 'Galatians', 'Ephesians', 'Philippians',
  'Colossians', '1 Thessalonians', '2 Thessalonians', '1 Timothy', '2 Timothy', 'Titus', 'Philemon', 'Hebrews', 'James',
  '1 Peter', '2 Peter', '1 John', '2 John', '3 John', 'Jude', 'Revelation'
];
const BOOK_CONTEXT = {
  Genesis: { s: 'Moses', a: 'Israel' }, Exodus: { s: 'Moses', a: 'Israel' }, Leviticus: { s: 'Moses', a: 'Israel' }, Numbers: { s: 'Moses', a: 'Israel' }, Deuteronomy: { s: 'Moses', a: 'Israel' },
  Joshua: { s: 'Joshua', a: 'Israel' }, Judges: { s: 'Unknown', a: 'Israel' }, Ruth: { s: 'Unknown', a: 'Israel' },
  '1 Samuel': { s: 'Samuel', a: 'Israel' }, '2 Samuel': { s: 'Nathan', a: 'Israel' }, '1 Kings': { s: 'Unknown', a: 'Israel' }, '2 Kings': { s: 'Unknown', a: 'Israel' },
  '1 Chronicles': { s: 'Chronicler', a: 'Exiles' }, '2 Chronicles': { s: 'Chronicler', a: 'Exiles' }, Ezra: { s: 'Ezra', a: 'Exiles' }, Nehemiah: { s: 'Nehemiah', a: 'Exiles' }, Esther: { s: 'Unknown', a: 'Israel' },
  Job: { s: 'Job and the Lord', a: 'All' }, Psalm: { s: 'David or another psalm writer', a: 'Everyone hurting or thankful' }, Psalms: { s: 'David or another psalm writer', a: 'Everyone hurting or thankful' },
  Proverbs: { s: 'Solomon giving wisdom', a: 'Everyone seeking guidance' }, Ecclesiastes: { s: 'Solomon', a: 'All' }, 'Song of Solomon': { s: 'Solomon', a: 'All' },
  Isaiah: { s: 'Isaiah', a: 'Judah' }, Jeremiah: { s: 'Jeremiah', a: 'Judah and the exiles' }, Lamentations: { s: 'Jeremiah', a: 'Exiles' }, Ezekiel: { s: 'Ezekiel', a: 'Exiles' }, Daniel: { s: 'Daniel', a: 'Exiles' },
  Hosea: { s: 'Hosea', a: 'Israel' }, Joel: { s: 'Joel', a: 'Judah' }, Amos: { s: 'Amos', a: 'Israel' }, Obadiah: { s: 'Obadiah', a: 'Edom' }, Jonah: { s: 'Jonah', a: 'Nineveh' }, Micah: { s: 'Micah', a: 'Judah' }, Nahum: { s: 'Nahum', a: 'Nineveh' }, Habakkuk: { s: 'Habakkuk', a: 'Judah' }, Zephaniah: { s: 'Zephaniah', a: 'Judah' }, Haggai: { s: 'Haggai', a: 'Exiles' }, Zechariah: { s: 'Zechariah', a: 'Exiles' }, Malachi: { s: 'Malachi', a: 'Israel' },
  Matthew: { s: 'Jesus', a: 'Believers' }, Mark: { s: 'Jesus', a: 'Believers' }, Luke: { s: 'Jesus', a: 'Believers' }, John: { s: 'Jesus', a: 'Believers' }, Acts: { s: 'Luke', a: 'Church' },
  Romans: { s: 'Paul', a: 'Rome' }, '1 Corinthians': { s: 'Paul', a: 'Corinth' }, '2 Corinthians': { s: 'Paul', a: 'Corinth' }, Galatians: { s: 'Paul', a: 'Galatia' }, Ephesians: { s: 'Paul', a: 'Ephesus' }, Philippians: { s: 'Paul', a: 'Philippi' }, Colossians: { s: 'Paul', a: 'Colosse' }, '1 Thessalonians': { s: 'Paul', a: 'Thessalonica' }, '2 Thessalonians': { s: 'Paul', a: 'Thessalonica' }, '1 Timothy': { s: 'Paul', a: 'Timothy' }, '2 Timothy': { s: 'Paul', a: 'Timothy' }, Titus: { s: 'Paul', a: 'Titus' }, Philemon: { s: 'Paul', a: 'Philemon' }, Hebrews: { s: 'Unknown', a: 'Hebrew believers' }, James: { s: 'James', a: 'Believers' }, '1 Peter': { s: 'Peter', a: 'Believers' }, '2 Peter': { s: 'Peter', a: 'Believers' }, '1 John': { s: 'John', a: 'Believers' }, '2 John': { s: 'John', a: 'Believers' }, '3 John': { s: 'John', a: 'Gaius' }, Jude: { s: 'Jude', a: 'Believers' }, Revelation: { s: 'John', a: 'Seven churches' }
};
const ARCHAIC = {
  careful: 'worried', beseech: 'ask', supplication: 'prayer', thee: 'you', thou: 'you', thy: 'your', ye: 'you',
  hath: 'has', doth: 'does', believeth: 'believes', loveth: 'loves', giveth: 'gives', knoweth: 'knows', maketh: 'makes',
  strengtheneth: 'strengthens', keepeth: 'keeps', worketh: 'works', unto: 'to', saith: 'says', begotten: 'only', perish: 'be lost',
  everlasting: 'eternal', labour: 'labor', laden: 'burdened', dismayed: 'discouraged', whosoever: 'whoever', whatsoever: 'whatever',
  verily: 'truly', behold: 'look', passeth: 'passes', brethren: 'brothers'
};

const bookPattern = BOOKS.slice().sort((a, b) => b.length - a.length).map(escapeRegExp).join('|');
const refRegex = new RegExp(`\\b(?:${bookPattern})\\s+\\d+:\\d+(?:[-–](?:\\d+:)?\\d+)?\\b`, 'g');

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function normalizeRef(ref) {
  return String(ref || '')
    .replace(/\s+/g, ' ')
    .replace(/\\u2013|\\u2014/gi, '-')
    .replace(/[–—]/g, '-')
    .replace(/^Psalms\s+/i, 'Psalm ')
    .replace(/\s*\(KJV\)\s*$/i, '')
    .trim();
}

function parseBook(ref) {
  const match = normalizeRef(ref).match(/^(.+?)\s+\d+:\d+/);
  if (!match) return '';
  return /^Psalms?$/i.test(match[1]) ? 'Psalm' : match[1].trim();
}

function isPlausibleVerseRef(ref) {
  const normalized = normalizeRef(ref);
  if (!normalized || normalized.length > 80) return false;
  if (/[+{}()=]|String\(|item\.|function|typeof|=>/.test(normalized)) return false;
  if (!/^(?:[1-3]\s+)?[A-Za-z][A-Za-z\s]+\s+\d+:\d+(?:[-–]\d+(?::\d+)?)?$/.test(normalized)) return false;
  const book = parseBook(normalized);
  if (!book || !BOOKS.includes(book) && book !== 'Psalm') return false;
  return true;
}

function decodeSingleQuoted(value) {
  return value.replace(/\\'/g, '\'').replace(/\\\\/g, '\\').replace(/\\n/g, '\n').replace(/\\r/g, '\r').replace(/\\t/g, '\t');
}

function decodeDoubleQuoted(value) {
  try {
    return JSON.parse(`"${value.replace(/\\/g, '\\\\').replace(/"/g, '\\"')}"`);
  } catch {
    return value;
  }
}

function rephraseArchaic(text) {
  let out = String(text || '');
  for (const [from, to] of Object.entries(ARCHAIC)) {
    out = out.replace(new RegExp(`\\b${escapeRegExp(from)}\\b`, 'gi'), to);
  }
  return out.replace(/\s+/g, ' ').trim();
}

function hashRef(ref) {
  let h = 0;
  const s = String(ref || '');
  for (let i = 0; i < s.length; i += 1) h = ((h << 5) - h + s.charCodeAt(i)) | 0;
  return Math.abs(h);
}

/** Varied "For today" lines — avoid one stamp across thousands of verses. */
const FALLBACK_APPLICATIONS = [
  'Sit with one phrase from this verse before you move on.',
  'Take one honest step today that matches what this verse says.',
  'Return to this line when the day gets loud.',
  'Pray this verse once, then act as if God heard you.',
  'Share one sentence of this verse with someone who needs steady words.',
  'Write one word from this verse where you will see it later.',
  'Let this verse set the pace of your next conversation.',
  'Hold this truth when you feel pressed to hurry past God.',
  'Use this verse as a quiet answer when worry starts talking first.',
  'End the day by reading this line again, slowly.'
];

function inferApplies(text, ref) {
  const lower = String(text || '').toLowerCase();
  if (/\b(careful|worry|anxious|fear|afraid|troubled)\b/.test(lower)) return 'This verse meets anxious moments with steady help instead of more noise.';
  if (/\b(hope|wait|waiting|trust)\b/.test(lower)) return 'This verse keeps your eyes up when the day feels slow, heavy, or unfinished.';
  if (/\b(peace|rest|quiet)\b/.test(lower)) return 'This verse makes room to breathe, slow down, and let God settle your heart.';
  if (/\b(strength|strong|strengthen|power)\b/.test(lower)) return 'This verse reminds you that God gives strength that does not start with your own reserves.';
  if (/\b(love|loveth|charity|mercy|forgive)\b/.test(lower)) return 'This verse calls you to live with the same mercy and steadiness you need from God.';
  return FALLBACK_APPLICATIONS[hashRef(ref || text) % FALLBACK_APPLICATIONS.length];
}

function isNearVerbatimPlain(plain, verseText) {
  const strip = (s) => String(s || '')
    .replace(/^\s*In plain words:\s*/i, '')
    .replace(/^\s*Plain English:\s*/i, '')
    .replace(/^\s*Key idea:\s*/i, '')
    .trim();
  const norm = (s) => rephraseArchaic(strip(s))
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  const p = norm(plain);
  const v = norm(verseText);
  if (!p) return true;
  if (v && p === v) return true;
  if (v && (p.indexOf(v) === 0 || v.indexOf(p) === 0) && Math.abs(p.length - v.length) < 48) return true;
  /* Short summaries share keywords; only flag near-same-length echoes. */
  if (v && p.length >= Math.max(24, v.length * 0.72)) {
    const pTok = p.split(' ').filter(Boolean);
    const vSet = new Set(v.split(' ').filter(Boolean));
    if (pTok.length >= 6) {
      let hit = 0;
      pTok.forEach((tok) => { if (vSet.has(tok)) hit += 1; });
      if (hit / pTok.length >= 0.78) return true;
    }
  }
  return false;
}

/** Theme / meaning restatement — never a KJV word-swap. Used for all surfaced refs. */
function buildThemeLaymanPlain(ref, text) {
  const body = String(text || '').replace(/\s+/g, ' ').trim();
  const lower = body.toLowerCase();
  const r = normalizeRef(ref).toLowerCase();

  if (/genesis\s+1:1/.test(r) || /^in the beginning\s+god\s+created/.test(lower)) {
    return 'God made everything. He started it all — heaven, earth, and life.';
  }
  if (/john\s+3:16/.test(r) || /for god so loved the world/.test(lower)) {
    return 'God loved the world so much He gave His Son so you can have life with Him forever.';
  }
  if (/91:1/.test(r) || /secret place|shadow of the almighty/.test(lower) ||
      (/dwell/.test(lower) && /most high|almighty/.test(lower))) {
    return 'When you stay close to God, you rest under His protection — safe in His care.';
  }
  if (/11:28/.test(r) || /come unto me|heavy laden|give you rest/.test(lower)) {
    return 'Come to Jesus as you are, tired and carrying too much. He will give you rest.';
  }
  if (/23:1/.test(r) || /lord is my shepherd|shall not want/.test(lower)) {
    return 'The Lord takes care of me like a shepherd. With Him, I have what I need.';
  }
  if (/begat|son of|daughter of|father of|generations?\s+of/i.test(body) && body.length < 160) {
    return 'This verse keeps track of family lines inside God\'s larger story, showing that real names and real lives matter to Him.';
  }
  if (/\bcreat(ed|e|ion|or)\b|\bmade the heaven|\bmade heaven and earth\b/.test(lower)) {
    return 'God is the Maker. Nothing exists outside His hand.';
  }
  if (/\banxious|careful for nothing|worry|fear|afraid|dismay|terror|troubled\b/.test(lower)) {
    return 'You do not have to carry fear alone. Bring it to God and let Him steady you.';
  }
  if (/\bpeace|rest|still|quiet|calm|be still\b/.test(lower)) {
    return 'God offers real rest — a quiet place to set the day down with Him.';
  }
  if (/\bmercy|grace|forgiv|compassion|lovingkindness|longsuffering\b/.test(lower)) {
    return "God's kindness meets you as you are — not after you perform.";
  }
  if (/\bstrength|strong|courage|weary|faint|renew|uphold|power\b/.test(lower)) {
    return 'When you feel empty, God gives strength beyond your own.';
  }
  if (/\bhope|trust|believe|faith|pray|prayer|cast.*care|burden\b/.test(lower)) {
    return 'Hand the real weight to God. Trust that He hears and holds you.';
  }
  if (/\blove|charity|shepherd|save|salvation|rejoice|glad|joy|bless\b/.test(lower)) {
    return "God's care is for you today — something solid to hold when the day feels thin.";
  }
  if (/\brepent|turn ye|turn to the lord|return unto me\b/.test(lower)) {
    return 'Turn back to God. He welcomes the one who comes home.';
  }
  if (/\bworship|praise|sing unto|glorify|hallelujah|give thanks|thanksgiving\b/.test(lower)) {
    return 'Give God your attention and thanks — He is worthy of it.';
  }
  if (/\bwisdom|wise|understand|understanding|knowledge|instruction|proverb\b/.test(lower)) {
    return 'Real wisdom starts with taking God seriously and walking in His way.';
  }
  if (/\bcommand|thou shalt|ye shall|statute|precept|ordinance|law of the lord\b/.test(lower)) {
    return 'God shows a clear way to live. His instructions are for your good.';
  }
  if (/\bword of the lord|thus saith|it is written|thy word|my words|scripture\b/.test(lower)) {
    return "God's Word is not empty talk. It teaches, steadies, and leads.";
  }
  if (/\bholy|sanctify|clean|pure|righteous|upright\b/.test(lower)) {
    return 'God calls His people to a clean, set-apart life with Him.';
  }
  if (/\bneighbou?r|brother|one another|enemy|friend|stranger\b/.test(lower)) {
    return 'This verse shapes how you treat people — close, hard, and everyday.';
  }
  if (/\bkingdom|reign|throne|king of kings\b/.test(lower)) {
    return 'God rules. His kingdom is real, and it still shapes how we live today.';
  }
  if (/\bcross|crucif|blood of|resurrection|risen|die for|gave himself\b/.test(lower)) {
    return 'Jesus gave Himself so you could be brought near to God. Hold that gift carefully.';
  }
  if (/\bdeath|grave|die|dust|mortality\b/.test(lower)) {
    return 'Life and death are in view here. God is not far from either one.';
  }
  if (/\blight\b/.test(lower) && /\bdark|darkness\b/.test(lower)) {
    return 'God brings light into dark places — and that light is for you too.';
  }
  if (/\bmoney|riches|poor|tithe|offering|give alms|mammon\b/.test(lower)) {
    return 'How you handle what you have is part of walking with God.';
  }
  if (/\bangel|heaven|eternal|everlasting|forever\b/.test(lower)) {
    return 'This verse lifts your eyes past the moment — God holds what lasts.';
  }
  if (/\bjudg(e|ment)|wrath|punish|condemn|vengeance\b/.test(lower)) {
    return 'God takes wrong seriously. This verse keeps justice and holiness in view.';
  }
  if (/\bhear(ken)?|listen|ears|cry unto|call upon\b/.test(lower)) {
    return 'God invites you to call on Him — and to listen when He speaks.';
  }
  if (/\bwait|patience|patient|endure|persevere\b/.test(lower)) {
    return 'Waiting with God is not wasted time. Stay steady; He is still at work.';
  }

  /** Last-resort plains — rotated by ref so bulk coverage is not one generic stamp. */
  const FALLBACK_PLAINS = [
    'Read this verse slowly. Let one clear phrase stay with you through the next hour.',
    'God is speaking something steady here — hold the part that meets you today.',
    'This line of Scripture is for real life, not only for a quiet moment later.',
    'Keep one truth from this verse close when the day pulls your attention everywhere.',
    'God\'s Word here is practical: receive it, then walk a little differently.',
    'Pause on this verse until it feels less like noise and more like a handhold.',
    'Something true from God is on the page — take the part that steadies you first.',
    'This verse is short enough to carry. Let it shape one choice you make next.',
    'Scripture meets ordinary hours here. Stay with it until one sentence lands.',
    'God is not far from this moment. Let this verse name what you need from Him.'
  ];
  return FALLBACK_PLAINS[hashRef(ref || r) % FALLBACK_PLAINS.length];
}

function getPlainExplanation(ref, text, plainMeanings) {
  const raw = String(text || '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
  if (!raw) return 'A steady truth from Scripture for the day in front of you.';

  const keys = [normalizeRef(ref)];
  if (/^Psalm\s+/i.test(keys[0])) keys.push(keys[0].replace(/^Psalm\s+/i, 'Psalms '));
  if (/^Psalms\s+/i.test(keys[0])) keys.push(keys[0].replace(/^Psalms\s+/i, 'Psalm '));
  let curated = '';
  for (const key of keys) {
    if (plainMeanings[key] && String(plainMeanings[key]).trim()) {
      curated = String(plainMeanings[key]).trim();
      break;
    }
  }
  if (curated && !isNearVerbatimPlain(curated, raw)) return curated;
  return buildThemeLaymanPlain(ref, raw);
}

function resolveVerseText(ref, kjv, pairedText) {
  const normalized = normalizeRef(ref);
  if (pairedText) return pairedText.replace(/\s+/g, ' ').trim();
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

function shouldScanFile(relativePath, stats) {
  const ext = path.extname(relativePath);
  const base = path.basename(relativePath);
  if (!SCANABLE_EXTENSIONS.has(ext)) return false;
  if (relativePath.split(path.sep).some((part) => EXCLUDED_DIRS.has(part))) return false;
  if (stats.size > LARGE_FILE_LIMIT && !LARGE_FILE_ALLOWLIST.has(base)) return false;
  if (/(\.min\.js|package-lock\.json)$/i.test(base)) return false;
  if (/^verse-breakdown-overrides\.js$/i.test(base)) return false;
  if (/^verse-breakdown-manifest\.json$/i.test(base)) return false;
  if (/^(kjv|cross-refs|book-intros|kjv-lexicon|site-search-index)\.json$/i.test(base)) return false;
  return true;
}

async function walk(dir, bucket = []) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    if (EXCLUDED_DIRS.has(entry.name)) continue;
    const absolute = path.join(dir, entry.name);
    const relative = path.relative(repoRoot, absolute);
    if (entry.isDirectory()) {
      await walk(absolute, bucket);
      continue;
    }
    const stats = await fs.stat(absolute);
    if (shouldScanFile(relative, stats)) bucket.push({ absolute, relative });
  }
  return bucket;
}

function extractRefTextPairs(content) {
  const pairs = [];
  const patterns = [
    /ref\s*:\s*'([^']+)'[\s\S]{0,2200}?text\s*:\s*'((?:\\.|[^'])*)'/g,
    /ref\s*:\s*"([^"]+)"[\s\S]{0,2200}?text\s*:\s*"((?:\\.|[^"])*)"/g,
    /"ref"\s*:\s*"([^"]+)"[\s\S]{0,2200}?"text"\s*:\s*"((?:\\.|[^"])*)"/g
  ];
  patterns.forEach((pattern, index) => {
    let match;
    while ((match = pattern.exec(content))) {
      const ref = normalizeRef(match[1]);
      const text = index === 0 ? decodeSingleQuoted(match[2]) : decodeDoubleQuoted(match[2]);
      if (ref && text) pairs.push({ ref, text });
    }
  });
  return pairs;
}

function extractPlainMeanings(content) {
  const match = content.match(/var\s+VERSE_PLAIN_MEANINGS\s*=\s*\{([\s\S]*?)\n\};/);
  if (!match) return {};
  const map = {};
  const entryRegex = /'([^']+)'\s*:\s*'((?:\\.|[^'])*)'/g;
  let entry;
  while ((entry = entryRegex.exec(match[1]))) {
    map[normalizeRef(entry[1])] = decodeSingleQuoted(entry[2]).replace(/\s+/g, ' ').trim();
  }
  return map;
}

function buildManifest(surfacedRefs, textByRef, plainMeanings, kjv, sourceCounts) {
  const overrides = {};
  const sourceTexts = {};
  const validSurfacedRefs = [];
  surfacedRefs.forEach((ref) => {
    const normalized = normalizeRef(ref);
    if (!isPlausibleVerseRef(normalized)) return;
    const pairedText = textByRef.get(normalized) || '';
    const text = resolveVerseText(normalized, kjv, pairedText);
    if (!text) return;
    validSurfacedRefs.push(normalized);
    if (pairedText && !kjv[normalized]) sourceTexts[normalized] = pairedText;
    const book = parseBook(normalized);
    const ctx = contextForRef(normalized);
    overrides[normalized] = {
      general: {
        plainExplanation: getPlainExplanation(normalized, text, plainMeanings),
        modernApplication: inferApplies(text, normalized),
        about: ctx.about,
        to: ctx.to
      }
    };
  });
  return {
    generatedAt: new Date().toISOString(),
    surfacedRefCount: validSurfacedRefs.length,
    overrideCount: Object.keys(overrides).length,
    sourceCounts,
    surfacedRefs: validSurfacedRefs,
    sourceTexts,
    overrides
  };
}

async function main() {
  await loadVerseContextResolver();
  const kjvSourcePath = await fs.stat(kjvFullPath).then(() => kjvFullPath).catch(() => kjvPath);
  const [files, kjvRaw, scriptRaw] = await Promise.all([
    walk(repoRoot),
    fs.readFile(kjvSourcePath, 'utf8'),
    fs.readFile(scriptPath, 'utf8')
  ]);
  const kjvParsed = JSON.parse(kjvRaw);
  const kjv = Array.isArray(kjvParsed)
    ? kjvParsed.reduce((acc, entry) => {
        if (entry && entry.ref && entry.text) acc[normalizeRef(entry.ref)] = String(entry.text).replace(/\s+/g, ' ').trim();
        return acc;
      }, {})
    : kjvParsed;
  const plainMeanings = extractPlainMeanings(scriptRaw);
  const surfacedRefSet = new Set();
  const textByRef = new Map();
  const sourceCounts = {};

  for (const file of files) {
    const content = await fs.readFile(file.absolute, 'utf8');
    const pairHits = extractRefTextPairs(content);
    pairHits.forEach(({ ref, text }) => {
      surfacedRefSet.add(ref);
      const current = textByRef.get(ref) || '';
      if (!current || text.length > current.length) textByRef.set(ref, text.replace(/\s+/g, ' ').trim());
    });
    const matches = content.match(refRegex) || [];
    matches.forEach((match) => surfacedRefSet.add(normalizeRef(match)));
    if (pairHits.length || matches.length) {
      sourceCounts[file.relative] = { refs: new Set(matches.map((item) => normalizeRef(item))).size, pairs: pairHits.length };
    }
  }

  const surfacedRefs = Array.from(surfacedRefSet).filter(Boolean).sort();
  const manifest = buildManifest(surfacedRefs, textByRef, plainMeanings, kjv, sourceCounts);
  const runtimeData = {
    surfacedRefs: manifest.surfacedRefs,
    overrides: manifest.overrides
  };

  await fs.mkdir(path.dirname(manifestPath), { recursive: true });
  await fs.writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`, 'utf8');
  await fs.writeFile(
    runtimePath,
    `(function (global) {
  'use strict';
  var data = ${JSON.stringify(runtimeData)};
  global.TDB_VERSE_BREAKDOWN_DATA = data;
  global.TDB_SURFACED_VERSE_REFS = data.surfacedRefs.slice();
  global.TDB_VERSE_BREAKDOWN_OVERRIDES = Object.assign({}, global.TDB_VERSE_BREAKDOWN_OVERRIDES || {}, data.overrides || {});
  if (typeof global.__tdbRegisterVerseBreakdownSeedData === 'function') {
    global.__tdbRegisterVerseBreakdownSeedData(data);
  }
})(typeof window !== 'undefined' ? window : globalThis);
`,
    'utf8'
  );

  console.log(`verse-breakdown seeds: ${manifest.surfacedRefCount} surfaced refs, ${manifest.overrideCount} overrides`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
