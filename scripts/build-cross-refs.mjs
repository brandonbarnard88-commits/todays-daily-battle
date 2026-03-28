#!/usr/bin/env node
/**
 * Builds cross-refs.json for Bible Tool + Hub concordance.
 * Run: node scripts/build-cross-refs.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const out = path.join(__dirname, '..', 'cross-refs.json');

/** @type {Record<string, string[]>} */
const refs = {};

function add(k, arr) {
  const key = k.replace(/\s+/g, ' ').trim();
  if (!key) return;
  const seen = new Set();
  const merged = [...(refs[key] || []), ...arr]
    .map((r) => r.replace(/\s+/g, ' ').trim())
    .filter(Boolean)
    .filter((r) => {
      if (seen.has(r) || r === key) return false;
      seen.add(r);
      return true;
    });
  refs[key] = merged;
}

// --- Core gospel & salvation ---
add('John 3:16', ['Romans 5:8', 'Romans 10:9', '1 John 4:9', '1 John 4:10']);
add('John 1:1', ['Genesis 1:1', 'Colossians 1:16', 'Hebrews 1:3']);
add('John 14:6', ['Acts 4:12', '1 Timothy 2:5', 'Hebrews 7:25']);
add('John 10:28', ['John 10:11', 'Romans 8:38', 'Philippians 1:6']);
add('John 15:5', ['John 15:1', 'Galatians 2:20', 'Philippians 4:13']);
add('Matthew 11:28', ['Jeremiah 6:16', 'John 7:37', 'Isaiah 55:1']);
add('Matthew 5:3', ['Luke 6:20', 'Isaiah 61:1', 'James 2:5']);
add('Matthew 5:4', ['Isaiah 61:2', '2 Corinthians 1:3', 'Psalm 34:18']);
add('Matthew 5:6', ['Psalm 42:1', 'John 4:14', 'Isaiah 55:2']);
add('Matthew 5:8', ['Psalm 24:3', 'Hebrews 12:14', '1 John 3:2']);
add('Matthew 5:9', ['James 3:18', 'Romans 12:18', 'Hebrews 12:14']);
add('Matthew 28:18', ['Daniel 7:14', 'Ephesians 1:20', 'Philippians 2:9']);
add('Mark 10:45', ['Matthew 20:28', 'John 10:11', '1 Timothy 2:6']);
add('Luke 23:34', ['Acts 7:60', 'Romans 12:14', '1 Peter 2:23']);
add('Luke 15:24', ['Luke 15:7', 'Romans 8:32', 'Ephesians 2:4']);

// --- Romans ---
add('Romans 1:16', ['Romans 1:17', '1 Corinthians 1:18', '2 Timothy 1:8']);
add('Romans 3:23', ['Romans 3:10', 'Isaiah 53:6', '1 John 1:8']);
add('Romans 3:24', ['Ephesians 2:8', 'Titus 3:7', 'Romans 5:15']);
add('Romans 5:1', ['Romans 5:2', 'Philippians 4:7', 'John 14:27']);
add('Romans 5:8', ['John 3:16', '1 John 4:10', 'Galatians 2:20']);
add('Romans 5:12', ['1 Corinthians 15:21', 'Romans 6:23', 'Genesis 3:17']);
add('Romans 6:23', ['Romans 5:12', 'John 3:16', 'Ephesians 2:8']);
add('Romans 8:1', ['Romans 8:34', 'John 3:18', 'Galatians 5:1']);
add('Romans 8:28', ['Romans 8:31', 'Jeremiah 29:11', 'Genesis 50:20']);
add('Romans 8:31', ['Romans 8:32', 'Isaiah 54:17', 'Psalm 118:6']);
add('Romans 8:38', ['Romans 8:39', 'John 10:28', '1 Peter 1:5']);
add('Romans 10:9', ['Romans 10:10', 'Acts 16:31', 'Philippians 2:11']);
add('Romans 10:17', ['Romans 1:16', 'Hebrews 4:12', 'Psalm 119:130']);
add('Romans 12:1', ['Romans 6:13', '1 Corinthians 6:20', 'Hebrews 13:15']);
add('Romans 12:2', ['Ephesians 4:23', 'Colossians 3:10', 'Philippians 4:8']);
add('Romans 12:12', ['James 1:2', '1 Thessalonians 5:16', 'Habakkuk 3:17']);
add('Romans 12:18', ['Hebrews 12:14', 'Matthew 5:9', 'Psalm 34:14']);
add('Romans 15:13', ['Romans 5:5', 'Galatians 5:5', 'Isaiah 26:4']);

// --- Ephesians–Colossians ---
add('Ephesians 2:8', ['Romans 3:24', 'Titus 3:5', 'Galatians 2:16']);
add('Ephesians 2:10', ['Philippians 2:13', 'Matthew 5:16', 'Titus 2:14']);
add('Ephesians 4:32', ['Colossians 3:13', 'Matthew 6:14', 'Luke 6:36']);
add('Ephesians 6:10', ['Ephesians 6:11', '2 Timothy 2:1', '2 Corinthians 10:4']);
add('Ephesians 6:11', ['Ephesians 6:12', '1 Peter 5:8', 'James 4:7']);
add('Ephesians 6:12', ['Daniel 10:13', '2 Corinthians 10:3', '1 John 4:4']);
add('Ephesians 6:13', ['Ephesians 6:14', 'James 4:7', '1 Peter 5:9']);
add('Ephesians 6:14', ['John 8:32', 'Isaiah 59:17', 'Psalm 132:9']);
add('Ephesians 6:15', ['Romans 10:15', 'Isaiah 52:7', 'Nahum 1:15']);
add('Ephesians 6:16', ['1 Peter 5:9', 'Genesis 15:1', 'Psalm 3:3']);
add('Ephesians 6:17', ['Hebrews 4:12', 'Isaiah 49:2', 'Revelation 1:16']);
add('Ephesians 6:18', ['Romans 8:26', '1 Thessalonians 5:17', 'Luke 18:1']);
add('Philippians 4:6', ['Philippians 4:19', '1 Peter 5:7', 'Matthew 6:25']);
add('Philippians 4:7', ['Isaiah 26:3', 'John 14:27', 'Colossians 3:15']);
add('Philippians 4:13', ['2 Timothy 4:17', 'Isaiah 40:31', '2 Corinthians 12:9']);
add('Colossians 3:23', ['Ephesians 6:7', '1 Corinthians 10:31', 'Ecclesiastes 9:10']);

// --- Hebrews–James–Peter–John ---
add('Hebrews 4:12', ['Jeremiah 23:29', 'Isaiah 55:11', 'Ephesians 6:17']);
add('Hebrews 11:1', ['Romans 4:20', '2 Corinthians 5:7', 'Hebrews 11:6']);
add('Hebrews 11:6', ['Romans 10:17', 'Hebrews 11:1', 'James 1:6']);
add('Hebrews 12:1', ['Hebrews 10:36', '1 Corinthians 9:24', 'Philippians 3:14']);
add('Hebrews 12:2', ['Psalm 16:8', 'Isaiah 53:3', 'Philippians 2:8']);
add('Hebrews 13:5', ['Joshua 1:5', 'Matthew 28:20', 'Deuteronomy 31:6']);
add('James 1:2', ['Romans 5:3', '1 Peter 1:6', 'James 1:12']);
add('James 1:5', ['Proverbs 2:6', 'Matthew 7:7', 'James 3:17']);
add('James 1:12', ['Revelation 2:10', '1 Corinthians 9:25', '2 Timothy 4:8']);
add('James 4:7', ['1 Peter 5:9', 'Ephesians 6:11', 'Luke 4:8']);
add('James 4:8', ['Zechariah 1:3', '2 Corinthians 7:1', 'Psalm 24:3']);
add('1 Peter 2:24', ['Isaiah 53:5', 'Romans 4:25', '1 Corinthians 15:3']);
add('1 Peter 5:7', ['Psalm 55:22', 'Matthew 11:28', 'Philippians 4:6']);
add('1 Peter 5:8', ['Job 1:7', 'Ephesians 6:11', '1 Timothy 3:6']);
add('1 John 1:9', ['Psalm 32:5', 'Psalm 103:12', 'Hebrews 10:22']);
add('1 John 4:18', ['Romans 8:15', '2 Timothy 1:7', 'Psalm 34:4']);

// --- Corinthians–Galatians–Thessalonians ---
add('1 Corinthians 10:13', ['Hebrews 4:15', 'James 1:12', '2 Peter 2:9']);
add('1 Corinthians 13:4', ['1 Corinthians 13:13', 'Galatians 5:22', 'Colossians 3:12']);
add('1 Corinthians 15:3', ['Romans 4:25', '1 Peter 2:24', 'Isaiah 53:5']);
add('1 Corinthians 15:58', ['Galatians 6:9', 'Hebrews 6:10', '2 Chronicles 15:7']);
add('2 Corinthians 5:17', ['Galatians 6:15', 'Ephesians 2:10', 'Ezekiel 36:26']);
add('2 Corinthians 5:21', ['Romans 3:22', '1 Peter 2:24', 'Isaiah 53:6']);
add('2 Corinthians 12:9', ['Philippians 4:13', 'Isaiah 40:29', 'Psalm 73:26']);
add('Galatians 2:20', ['Romans 6:6', 'Galatians 5:24', '2 Corinthians 5:15']);
add('Galatians 5:22', ['Ephesians 5:9', 'Colossians 3:12', '2 Peter 1:5']);
add('Galatians 5:16', ['Romans 8:4', 'Romans 8:14', 'Galatians 5:25']);
add('Galatians 6:9', ['Hebrews 12:3', 'Psalm 126:5', 'Isaiah 40:31']);
add('1 Thessalonians 4:13', ['1 Corinthians 15:51', 'John 11:25', 'Revelation 21:4']);
add('1 Thessalonians 5:16', ['Philippians 4:4', 'Psalm 97:12', 'Nehemiah 8:10']);
add('1 Thessalonians 5:17', ['Luke 18:1', 'Romans 12:12', 'Ephesians 6:18']);
add('2 Thessalonians 3:3', ['2 Timothy 4:18', 'Psalm 37:39', 'John 10:29']);

// --- OT: Psalms & wisdom ---
add('Psalm 1:1', ['Psalm 119:1', 'Jeremiah 17:7', 'Matthew 5:6']);
add('Psalm 4:8', ['Proverbs 3:24', 'Psalm 127:2', 'Philippians 4:7']);
add('Psalm 9:9', ['Psalm 46:1', 'Nahum 1:7', '2 Samuel 22:3']);
add('Psalm 16:8', ['Acts 2:25', 'Hebrews 12:2', 'Psalm 73:25']);
add('Psalm 19:7', ['Psalm 119:105', '2 Timothy 3:16', 'Romans 10:17']);
add('Psalm 23:1', ['John 10:11', 'Isaiah 40:11', 'Ezekiel 34:15']);
add('Psalm 23:4', ['Psalm 27:1', 'Isaiah 43:2', 'John 16:33']);
add('Psalm 27:1', ['Psalm 118:6', 'Isaiah 12:2', 'John 8:12']);
add('Psalm 32:5', ['Psalm 51:10', '1 John 1:9', 'Isaiah 43:25']);
add('Psalm 34:4', ['Psalm 56:3', '2 Timothy 1:7', 'Isaiah 41:10']);
add('Psalm 34:18', ['Psalm 147:3', 'Matthew 5:4', '2 Corinthians 1:3']);
add('Psalm 37:4', ['Psalm 37:5', 'Matthew 6:33', 'Proverbs 3:5']);
add('Psalm 37:5', ['Proverbs 3:6', 'Psalm 23:3', 'Isaiah 48:17']);
add('Psalm 40:1', ['Psalm 130:5', 'Lamentations 3:25', 'Isaiah 40:31']);
add('Psalm 42:5', ['Psalm 43:5', 'Lamentations 3:21', '2 Corinthians 4:16']);
add('Psalm 46:1', ['Psalm 62:7', 'Proverbs 18:10', 'Nahum 1:7']);
add('Psalm 46:10', ['Exodus 14:14', 'Zechariah 2:13', 'Mark 4:39']);
add('Psalm 51:10', ['Ezekiel 36:26', '2 Corinthians 5:17', 'Psalm 32:5']);
add('Psalm 55:22', ['1 Peter 5:7', 'Matthew 6:25', 'Philippians 4:6']);
add('Psalm 56:3', ['Psalm 56:4', 'Isaiah 26:3', 'John 14:1']);
add('Psalm 61:2', ['Psalm 18:2', 'Psalm 91:2', '2 Samuel 22:3']);
add('Psalm 73:26', ['Psalm 18:32', 'Isaiah 40:29', '2 Corinthians 12:9']);
add('Psalm 91:1', ['Psalm 91:4', 'Psalm 57:1', 'Isaiah 25:4']);
add('Psalm 103:12', ['Isaiah 43:25', 'Micah 7:19', 'Hebrews 8:12']);
add('Psalm 119:105', ['Proverbs 6:23', '2 Peter 1:19', 'John 8:12']);
add('Psalm 121:1', ['Psalm 121:3', 'Isaiah 41:10', 'Deuteronomy 31:8']);
add('Psalm 121:3', ['Psalm 37:24', 'Proverbs 3:26', '1 Peter 1:5']);
add('Psalm 130:5', ['Lamentations 3:25', 'Isaiah 40:31', 'Romans 8:25']);
add('Psalm 139:23', ['Psalm 26:2', 'Jeremiah 17:10', '1 Corinthians 4:5']);

// --- Proverbs & Ecclesiastes ---
add('Proverbs 3:5', ['Proverbs 3:6', 'Jeremiah 17:7', 'Psalm 37:5']);
add('Proverbs 3:6', ['Isaiah 48:17', 'Psalm 32:8', 'James 1:5']);
add('Proverbs 4:23', ['Matthew 15:19', 'Luke 6:45', 'Philippians 4:7']);
add('Proverbs 15:1', ['James 1:19', 'Colossians 4:6', 'Ecclesiastes 10:12']);
add('Proverbs 17:22', ['Nehemiah 8:10', 'Proverbs 15:13', 'Romans 15:13']);
add('Proverbs 18:10', ['Psalm 61:3', 'Nahum 1:7', 'Psalm 91:2']);
add('Proverbs 22:6', ['Deuteronomy 6:7', 'Ephesians 6:4', '2 Timothy 3:15']);
add('Ecclesiastes 3:11', ['Romans 8:28', 'Isaiah 55:8', 'Psalm 104:24']);

// --- Isaiah–Jeremiah ---
add('Isaiah 26:3', ['Philippians 4:7', 'John 14:27', 'Colossians 3:15']);
add('Isaiah 40:31', ['Psalm 27:14', 'Galatians 6:9', '2 Corinthians 4:16']);
add('Isaiah 41:10', ['Joshua 1:9', 'Deuteronomy 31:6', 'Matthew 28:20']);
add('Isaiah 43:2', ['Psalm 66:12', 'Daniel 3:25', '1 Corinthians 10:13']);
add('Isaiah 53:5', ['1 Peter 2:24', 'Matthew 8:17', 'Romans 4:25']);
add('Isaiah 55:1', ['John 7:37', 'Revelation 22:17', 'Matthew 5:6']);
add('Jeremiah 29:11', ['Romans 8:28', 'Jeremiah 29:13', 'Proverbs 3:5']);
add('Jeremiah 33:3', ['Psalm 50:15', 'James 1:5', 'Matthew 7:7']);
add('Lamentations 3:22', ['Lamentations 3:23', 'Psalm 103:8', 'Micah 7:18']);

// --- Genesis–Joshua ---
add('Genesis 1:1', ['John 1:1', 'Psalm 90:2', 'Hebrews 11:3']);
add('Genesis 15:6', ['Romans 4:3', 'Galatians 3:6', 'James 2:23']);
add('Genesis 50:20', ['Romans 8:28', 'Acts 3:15', '1 Corinthians 2:7']);
add('Exodus 14:14', ['Exodus 14:13', '2 Chronicles 20:17', 'Deuteronomy 3:22']);
add('Exodus 20:1', ['Deuteronomy 5:6', 'Matthew 22:37', 'Romans 13:9']);
add('Deuteronomy 6:5', ['Matthew 22:37', 'Mark 12:30', 'Luke 10:27']);
add('Deuteronomy 31:6', ['Joshua 1:9', 'Hebrews 13:5', 'Isaiah 41:10']);
add('Joshua 1:9', ['Isaiah 41:10', '2 Timothy 1:7', 'Deuteronomy 31:6']);
add('Joshua 24:15', ['Ruth 1:16', 'Acts 16:31', 'Psalm 16:8']);

// --- 2 Timothy–Titus–Revelation ---
add('2 Timothy 1:7', ['Romans 8:15', '1 John 4:18', 'Isaiah 41:10']);
add('2 Timothy 3:16', ['Romans 15:4', 'Hebrews 4:12', 'Psalm 119:9']);
add('2 Timothy 4:7', ['Acts 20:24', '1 Corinthians 9:24', 'Philippians 3:14']);
add('Titus 3:5', ['Ephesians 2:8', 'John 3:5', 'Ezekiel 36:25']);
add('Revelation 21:4', ['Isaiah 25:8', '1 Corinthians 15:54', 'John 16:22']);
add('Revelation 22:17', ['Isaiah 55:1', 'John 7:37', 'Matthew 11:28']);

// --- Curated battle-minded chains (fear / grief / prayer) — each verse links to the rest of its chain ---
const fearTrust = [
  'Psalm 56:3',
  'Isaiah 41:10',
  '2 Timothy 1:7',
  'Philippians 4:6',
  'Philippians 4:7',
  'Psalm 34:4',
  'Psalm 27:1',
  '1 Peter 5:7'
];
fearTrust.forEach(function (k) {
  add(k, fearTrust.filter(function (x) {
    return x !== k;
  }));
});

const griefHope = [
  'Psalm 147:3',
  'Revelation 21:4',
  'Matthew 5:4',
  '2 Corinthians 1:3',
  '2 Corinthians 1:4',
  'Psalm 34:18',
  '1 Thessalonians 4:13',
  '1 Thessalonians 4:14'
];
griefHope.forEach(function (k) {
  add(k, griefHope.filter(function (x) {
    return x !== k;
  }));
});

const prayerSupplication = [
  'Philippians 4:6',
  'Ephesians 6:18',
  '1 Thessalonians 5:17',
  '1 Timothy 2:1',
  'Psalm 55:22',
  'Jeremiah 29:12'
];
prayerSupplication.forEach(function (k) {
  add(k, prayerSupplication.filter(function (x) {
    return x !== k;
  }));
});

/** Optional: theme blurbs for Bible Tool (verse in chain → show gentle note). Order: prayer checked before fear when a verse sits in two chains. */
const chains = {
  'prayer-supplication': {
    title: 'Prayer & Supplication',
    anchor: 'Philippians 4:6',
    verses: prayerSupplication,
    blurb:
      'Prayer is not performance. These verses invite simple, honest bringing of every burden — with thanksgiving mixed in. One small step: turn one worry into a short prayer using the anchor wording.'
  },
  'fear-trust': {
    title: 'Fear to Trust',
    anchor: 'Psalm 56:3',
    verses: fearTrust,
    blurb:
      'When fear feels loud, these verses remind you that trust is not a feeling — it is a choice to cast your care on the One who cares for you. One small step: speak the anchor verse out loud when anxiety rises.'
  },
  'grief-hope': {
    title: 'Grief to Hope',
    anchor: 'Psalm 147:3',
    verses: griefHope,
    blurb:
      'Grief is heavy and real. These verses do not rush you — they point to the God who heals the brokenhearted and promises a day with no more tears. One small step: let one verse sit with you today without trying to fix everything.'
  }
};

const payload = {
  version: 1,
  about: 'Human-curated KJV cross-references for Today\'s Daily Battle. Expand over time; JSON over inline script.',
  refs,
  chains
};

fs.writeFileSync(out, JSON.stringify(payload, null, 0) + '\n', 'utf8');
const keys = Object.keys(refs).length;
let edges = 0;
for (const k of Object.keys(refs)) edges += refs[k].length;
console.log('Wrote', out, '—', keys, 'anchor verses,', edges, 'links');
