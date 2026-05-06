/**
 * Build characters.json from a large KJV proper-name TSV source.
 * Source file: .tmp-names.tsv (downloaded from biblical-names-data).
 * Output: characters.json (1000+ alphabetical names with simple curriculum fields).
 */
const fs = require('fs');
const path = require('path');

const ROOT = __dirname;
const SOURCE = path.join(ROOT, '.tmp-names.tsv');
const OUT = path.join(ROOT, 'characters.json');

const BOOK_MAP = {
  GEN: 'Genesis', EXO: 'Exodus', LEV: 'Leviticus', NUM: 'Numbers', DEU: 'Deuteronomy',
  JOS: 'Joshua', JDG: 'Judges', RUT: 'Ruth', '1SA': '1 Samuel', '2SA': '2 Samuel',
  '1KI': '1 Kings', '2KI': '2 Kings', '1CH': '1 Chronicles', '2CH': '2 Chronicles',
  EZR: 'Ezra', NEH: 'Nehemiah', EST: 'Esther', JOB: 'Job', PSA: 'Psalms', PRO: 'Proverbs',
  ECC: 'Ecclesiastes', SNG: 'Song of Solomon', ISA: 'Isaiah', JER: 'Jeremiah', LAM: 'Lamentations',
  EZK: 'Ezekiel', DAN: 'Daniel', HOS: 'Hosea', JOL: 'Joel', AMO: 'Amos', OBA: 'Obadiah',
  JON: 'Jonah', MIC: 'Micah', NAM: 'Nahum', HAB: 'Habakkuk', ZEP: 'Zephaniah', HAG: 'Haggai',
  ZEC: 'Zechariah', MAL: 'Malachi', MAT: 'Matthew', MRK: 'Mark', LUK: 'Luke', JHN: 'John',
  ACT: 'Acts', ROM: 'Romans', '1CO': '1 Corinthians', '2CO': '2 Corinthians', GAL: 'Galatians',
  EPH: 'Ephesians', PHP: 'Philippians', COL: 'Colossians', '1TH': '1 Thessalonians',
  '2TH': '2 Thessalonians', '1TI': '1 Timothy', '2TI': '2 Timothy', TIT: 'Titus', PHM: 'Philemon',
  HEB: 'Hebrews', JAS: 'James', '1PE': '1 Peter', '2PE': '2 Peter', '1JN': '1 John',
  '2JN': '2 John', '3JN': '3 John', JUD: 'Jude', REV: 'Revelation'
};

const STOP = new Set([
  'LORD', 'Lord', 'God', 'Yahweh', 'Spirit', 'Holy Spirit', 'Father', 'Son'
]);

const TIER_1_ORDER = [
  'Adam', 'Eve', 'Noah', 'Abraham', 'Sarah', 'Isaac', 'Jacob', 'Joseph', 'Moses', 'Aaron',
  'Miriam', 'Joshua', 'Rahab', 'Deborah', 'Gideon', 'Ruth', 'Hannah', 'Samuel', 'Saul', 'David',
  'Solomon', 'Elijah', 'Elisha', 'Isaiah', 'Hezekiah', 'Josiah', 'Jeremiah', 'Ezekiel', 'Daniel', 'Ezra',
  'Nehemiah', 'Esther', 'Job', 'Jonah', 'Hosea', 'Joel', 'Amos', 'Zechariah', 'Malachi', 'James',
  'Mary', 'Joseph', 'Jesus', 'Peter', 'John', 'Paul', 'Timothy', 'Luke', 'Barnabas', 'Silas'
];

function parseRef(raw) {
  // Example: GEN 2:11!9 -> Genesis 2:11
  const m = String(raw || '').match(/^([A-Z0-9]{3})\s+(\d+:\d+)/);
  if (!m) return '';
  const book = BOOK_MAP[m[1]] || m[1];
  return book + ' ' + m[2];
}

function sentence(name, kind) {
  if (kind === 'pre') return `${name} lived an ordinary life before God's purpose became clear in Scripture.`;
  if (kind === 'impact') return `God met ${name} and changed direction through calling, correction, or covenant.`;
  if (kind === 'post') return `${name}'s account now points readers to the faithfulness and holiness of God.`;
  return '';
}

function main() {
  if (!fs.existsSync(SOURCE)) {
    throw new Error('Missing .tmp-names.tsv source file.');
  }
  const text = fs.readFileSync(SOURCE, 'utf8');
  const lines = text.split(/\r?\n/).filter(Boolean);
  const header = lines[0].split('\t');
  const engIdx = header.indexOf('engulb');
  const refIdx = header.indexOf('ref');
  if (engIdx < 0 || refIdx < 0) throw new Error('Unexpected TSV header format.');

  const byName = new Map();
  for (let i = 1; i < lines.length; i++) {
    const cols = lines[i].split('\t');
    const rawName = (cols[engIdx] || '').trim().replace(/\s+/g, ' ');
    if (!rawName) continue;
    if (STOP.has(rawName)) continue;
    if (!/^[A-Za-z][A-Za-z' -]+$/.test(rawName)) continue;
    const ref = parseRef(cols[refIdx] || '');
    if (!ref) continue;
    if (!byName.has(rawName)) byName.set(rawName, { name: rawName, keyKJVVerse: ref });
  }

  const rows = Array.from(byName.values())
    .map((x) => ({
      name: x.name,
      tier: TIER_1_ORDER.indexOf(x.name) !== -1 ? 'Tier 1' : 'Tier 2',
      preGodBrief: sentence(x.name, 'pre'),
      impact: sentence(x.name, 'impact'),
      postGodBrief: sentence(x.name, 'post'),
      keyKJVVerse: x.keyKJVVerse,
      quick: `Today tie-in: ${x.name}'s story reminds us to trust God one step at a time.`,
      pastor: `Context + hook: ${x.name} in ${x.keyKJVVerse}. What does faithful obedience look like in this season?`,
      kid: `Jesus loves you and gives hope. ${x.name}'s story helps us trust and obey with joy.`,
      teen: `${x.name}'s story speaks to school pressure, friendships, and choosing truth when it is hard.`,
      comicPrompt: `comic ${x.name} node, gold line connect, dark bg`
    }));

  const tier1 = [];
  TIER_1_ORDER.forEach((name) => {
    const row = rows.find((r) => r.name === name);
    if (row) tier1.push(row);
  });
  const tier2 = rows
    .filter((r) => r.tier === 'Tier 2')
    .sort((a, b) => a.name.localeCompare(b.name));
  const ordered = tier1.concat(tier2);

  const out = {
    meta: {
      source: 'biblical-names-data TSV (engulb column)',
      totalCharacters: ordered.length,
      tier1Count: tier1.length,
      tier2Count: tier2.length,
      order: 'Tier 1 majors first (~50), then Tier 2 alphabetical',
      cycle: 'Days 1-50: Tier 1 sequence. Day 51+: Tier 2 alphabetical loop.'
    },
    characters: ordered
  };
  fs.writeFileSync(OUT, JSON.stringify(out, null, 2), 'utf8');
  console.log('Wrote characters.json with', rows.length, 'characters.');
}

main();
