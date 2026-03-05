/**
 * Build an action Bible documentary dataset from characters.json.
 * Guarantees each entry has:
 * - character name
 * - key verse reference
 * - avatar prompt
 * - cartoon prompt
 */
const fs = require('fs');
const path = require('path');

const ROOT = __dirname;
const CHARACTERS_PATH = path.join(ROOT, 'characters.json');
const OUT_PATH = path.join(ROOT, 'action-bible-365.json');
const MIN_DAYS = 365;
const SCENES = ['dawn', 'storm', 'forest', 'night', 'river', 'forge', 'summit', 'golden'];
const BOOK_ORDER = [
  'Genesis', 'Exodus', 'Leviticus', 'Numbers', 'Deuteronomy', 'Joshua', 'Judges', 'Ruth',
  '1 Samuel', '2 Samuel', '1 Kings', '2 Kings', '1 Chronicles', '2 Chronicles',
  'Ezra', 'Nehemiah', 'Esther', 'Job', 'Psalms', 'Psalm', 'Proverbs', 'Ecclesiastes',
  'Song of Solomon', 'Isaiah', 'Jeremiah', 'Lamentations', 'Ezekiel', 'Daniel', 'Hosea',
  'Joel', 'Amos', 'Obadiah', 'Jonah', 'Micah', 'Nahum', 'Habakkuk', 'Zephaniah', 'Haggai',
  'Zechariah', 'Malachi', 'Matthew', 'Mark', 'Luke', 'John', 'Acts', 'Romans',
  '1 Corinthians', '2 Corinthians', 'Galatians', 'Ephesians', 'Philippians', 'Colossians',
  '1 Thessalonians', '2 Thessalonians', '1 Timothy', '2 Timothy', 'Titus', 'Philemon',
  'Hebrews', 'James', '1 Peter', '2 Peter', '1 John', '2 John', '3 John', 'Jude', 'Revelation'
];
const BOOK_ORDER_MAP = BOOK_ORDER.reduce(function (acc, book, idx) {
  acc[book] = idx;
  return acc;
}, {});

function normalizeBook(book) {
  var raw = String(book || '').trim();
  if (/^Psalm$/i.test(raw)) return 'Psalms';
  return raw;
}

function parseVerseRef(ref) {
  var value = String(ref || '').trim();
  var m = value.match(/^(.+?)\s+(\d+):(\d+)/);
  if (!m) {
    return { book: '', chapter: 999, verse: 999, order: 9999 };
  }
  var book = normalizeBook(m[1]);
  var chapter = Number(m[2] || 999);
  var verse = Number(m[3] || 999);
  var order = Object.prototype.hasOwnProperty.call(BOOK_ORDER_MAP, book) ? BOOK_ORDER_MAP[book] : 9999;
  return { book: book, chapter: chapter, verse: verse, order: order };
}

function testamentForBook(book) {
  var order = Object.prototype.hasOwnProperty.call(BOOK_ORDER_MAP, book) ? BOOK_ORDER_MAP[book] : 9999;
  return order <= BOOK_ORDER_MAP['Malachi'] ? 'Old Testament' : 'New Testament';
}

function seasonForBook(book) {
  var order = Object.prototype.hasOwnProperty.call(BOOK_ORDER_MAP, book) ? BOOK_ORDER_MAP[book] : 9999;
  if (order <= BOOK_ORDER_MAP['Deuteronomy']) return 'Origins and Covenant';
  if (order <= BOOK_ORDER_MAP['Esther']) return 'Kings and Exile';
  if (order <= BOOK_ORDER_MAP['Malachi']) return 'Prophets and Wisdom';
  if (order <= BOOK_ORDER_MAP['John']) return 'Life of Christ';
  if (order <= BOOK_ORDER_MAP['Jude']) return 'Church and Mission';
  return 'Revelation and Hope';
}

function slugify(value) {
  return String(value || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function ensureArray(value) {
  return Array.isArray(value) ? value : [];
}

function buildAvatarPrompt(name, tier, scene, verseRef) {
  return [
    'cinematic Bible character portrait',
    name + ' (' + tier + ')',
    'scene: ' + scene,
    'armor progression style, reverent, high detail',
    'inspired by KJV reference ' + verseRef
  ].join(', ');
}

function buildCartoonPrompt(name, scene, verseRef) {
  return [
    'action Bible panel sequence',
    'character: ' + name,
    'scene style: ' + scene,
    'dramatic faith-forward composition',
    'key verse anchor: ' + verseRef,
    'clean lines, rich lighting, print-ready'
  ].join(', ');
}

function pickVerseRef(character, fallbackDay) {
  const ref = String(character.keyKJVVerse || '').trim();
  if (ref) return ref;
  // Safe fallback that still maps to known KJV anchor.
  return fallbackDay % 2 === 0 ? 'Joshua 1:9' : 'Philippians 4:13';
}

function buildDayEntry(character, day) {
  const name = String(character.name || '').trim();
  const tier = String(character.tier || 'Tier 2').trim();
  const scene = SCENES[(day - 1) % SCENES.length];
  const verseRef = pickVerseRef(character, day);
  const refInfo = parseVerseRef(verseRef);
  const key = slugify(name) || ('character-' + day);

  return {
    day: day,
    characterKey: key,
    characterName: name,
    tier: tier,
    scene: scene,
    keyVerseRef: verseRef,
    keyVerseBook: refInfo.book,
    keyVerseChapter: refInfo.chapter,
    keyVerseVerse: refInfo.verse,
    testament: testamentForBook(refInfo.book),
    documentarySeason: seasonForBook(refInfo.book),
    avatarPrompt: buildAvatarPrompt(name, tier, scene, verseRef),
    cartoonPrompt: buildCartoonPrompt(name, scene, verseRef)
  };
}

function validate(entries, expectedCount) {
  if (!Array.isArray(entries) || entries.length !== expectedCount) {
    throw new Error('action-bible validation failed: expected exactly ' + expectedCount + ' entries.');
  }
  for (let i = 0; i < entries.length; i++) {
    const row = entries[i];
    if (!row.characterName || !row.keyVerseRef || !row.avatarPrompt || !row.cartoonPrompt) {
      throw new Error('action-bible validation failed at day ' + (i + 1) + ': missing required fields.');
    }
  }
}

function main() {
  if (!fs.existsSync(CHARACTERS_PATH)) {
    throw new Error('Missing characters.json. Run `npm run characters` first.');
  }
  const raw = JSON.parse(fs.readFileSync(CHARACTERS_PATH, 'utf8'));
  const characters = ensureArray(raw.characters).filter(function (c) {
    return c && String(c.name || '').trim();
  }).sort(function (a, b) {
    var ra = parseVerseRef(pickVerseRef(a, 1));
    var rb = parseVerseRef(pickVerseRef(b, 1));
    if (ra.order !== rb.order) return ra.order - rb.order;
    if (ra.chapter !== rb.chapter) return ra.chapter - rb.chapter;
    if (ra.verse !== rb.verse) return ra.verse - rb.verse;
    return String(a.name || '').localeCompare(String(b.name || ''));
  });
  if (!characters.length) {
    throw new Error('No characters found in characters.json.');
  }

  const totalEntries = Math.max(MIN_DAYS, characters.length);
  const entries = [];
  for (let day = 1; day <= totalEntries; day++) {
    const character = characters[(day - 1) % characters.length];
    entries.push(buildDayEntry(character, day));
  }

  validate(entries, totalEntries);

  const uniqueNames = new Set(entries.map(function (row) { return row.characterName; }));
  const payload = {
    meta: {
      totalDays: totalEntries,
      minimumDays: MIN_DAYS,
      uniqueCharactersUsed: uniqueNames.size,
      source: 'characters.json',
      guarantee: 'Every entry includes avatarPrompt and cartoonPrompt.',
      mode: 'Unlimited archive (minimum 365 entries)',
      documentarySeasons: [
        'Origins and Covenant',
        'Kings and Exile',
        'Prophets and Wisdom',
        'Life of Christ',
        'Church and Mission',
        'Revelation and Hope'
      ]
    },
    days: entries
  };

  fs.writeFileSync(OUT_PATH, JSON.stringify(payload, null, 2), 'utf8');
  console.log('Wrote action-bible-365.json with', entries.length, 'entries and', uniqueNames.size, 'unique characters.');
}

main();
