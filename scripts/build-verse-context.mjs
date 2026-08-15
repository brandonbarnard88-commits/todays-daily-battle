/**
 * Build full-Bible verse context packs + verse-context.js resolver.
 * Chapter defaults cover every KJV chapter; ranges override for known passages.
 *
 * Usage: node scripts/build-verse-context.mjs
 */
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { situationForChapter, composeSituationLine } from './lib/bible-situation-map.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const kjvFullPath = path.join(root, 'data', 'kjv-full.json');
const kjvPath = path.join(root, 'kjv.json');
const rangesPath = path.join(root, 'data', 'verse-context-ranges.json');
const chaptersOutPath = path.join(root, 'data', 'verse-context-chapters.json');
const jsOutPath = path.join(root, 'verse-context.js');

/** Warmer book-level speaker/audience (shared with breakdown fallback tone). */
const BOOK_WARM = {
  Genesis: { about: 'Moses (recording God’s Word)', to: 'Israel — and you hearing the beginning of the story' },
  Exodus: { about: 'Moses (recording God’s Word)', to: 'Israel remembering deliverance' },
  Leviticus: { about: 'Moses (recording God’s Word)', to: 'Israel learning holiness before God' },
  Numbers: { about: 'Moses (recording God’s Word)', to: 'Israel in the wilderness' },
  Deuteronomy: { about: 'Moses', to: 'Israel on the edge of the land' },
  Joshua: { about: 'Joshua (and the narrator)', to: 'Israel entering the land' },
  Judges: { about: 'The narrator of Judges', to: 'Israel in the days when every man did what was right in his own eyes' },
  Ruth: { about: 'The narrator of Ruth', to: 'Israel remembering kindness and redemption' },
  '1 Samuel': { about: 'The narrator of Samuel (with Samuel, Saul, and David)', to: 'Israel in the days of the first kings' },
  '2 Samuel': { about: 'The narrator of Samuel (with David’s story)', to: 'Israel watching David’s reign' },
  '1 Kings': { about: 'The narrator of Kings', to: 'Israel and Judah under the kings' },
  '2 Kings': { about: 'The narrator of Kings', to: 'Israel and Judah under the kings' },
  '1 Chronicles': { about: 'The chronicler', to: 'Exiles remembering God’s story' },
  '2 Chronicles': { about: 'The chronicler', to: 'Exiles remembering God’s story' },
  Ezra: { about: 'Ezra (and the narrator)', to: 'Returned exiles rebuilding' },
  Nehemiah: { about: 'Nehemiah', to: 'Returned exiles rebuilding walls and faith' },
  Esther: { about: 'The narrator of Esther', to: 'God’s people under foreign rule' },
  Job: { about: 'Job, his friends, and the Lord (through the narrator)', to: 'Anyone sitting with suffering and questions' },
  Psalm: { about: 'A named voice in the Psalms — David, Asaph, Moses, or Israel’s worship', to: 'Everyone hurting, thankful, or seeking God' },
  Psalms: { about: 'A named voice in the Psalms — David, Asaph, Moses, or Israel’s worship', to: 'Everyone hurting, thankful, or seeking God' },
  Proverbs: { about: 'Solomon giving wisdom', to: 'Everyone seeking guidance' },
  Ecclesiastes: { about: 'Solomon (the Preacher)', to: 'Anyone asking what lasts under the sun' },
  'Song of Solomon': { about: 'Solomon', to: 'Readers hearing covenant love sung aloud' },
  Isaiah: { about: 'Isaiah', to: 'Judah — and all who need comfort and warning' },
  Jeremiah: { about: 'Jeremiah', to: 'Judah and the exiles' },
  Lamentations: { about: 'Jeremiah', to: 'Exiles mourning Jerusalem' },
  Ezekiel: { about: 'Ezekiel', to: 'Exiles by the river Chebar' },
  Daniel: { about: 'Daniel (and the narrator)', to: 'Exiles learning faithfulness under pressure' },
  Hosea: { about: 'Hosea', to: 'Israel called back to faithful love' },
  Joel: { about: 'Joel', to: 'Judah facing the day of the Lord' },
  Amos: { about: 'Amos', to: 'Israel under God’s justice' },
  Obadiah: { about: 'Obadiah', to: 'Edom — and all who exalt themselves' },
  Jonah: { about: 'The narrator of Jonah (and the Lord)', to: 'Jonah — and anyone running from mercy' },
  Micah: { about: 'Micah', to: 'Judah hearing what the Lord requires' },
  Nahum: { about: 'Nahum', to: 'Nineveh under judgment' },
  Habakkuk: { about: 'Habakkuk', to: 'Judah waiting for God’s answer' },
  Zephaniah: { about: 'Zephaniah', to: 'Judah in the day of the Lord' },
  Haggai: { about: 'Haggai', to: 'Returned exiles rebuilding the house' },
  Zechariah: { about: 'Zechariah', to: 'Returned exiles needing hope' },
  Malachi: { about: 'Malachi', to: 'Israel called to return to the Lord' },
  Matthew: { about: 'Jesus (through Matthew)', to: 'His disciples and the crowds (and you today)' },
  Mark: { about: 'Jesus (through Mark)', to: 'His disciples and those listening (and you today)' },
  Luke: { about: 'Jesus (through Luke)', to: 'His disciples and those listening (and you today)' },
  John: { about: 'Jesus (through John)', to: 'His disciples and those listening (and you today)' },
  Acts: { about: 'Luke', to: 'The early church — and Theophilus’ readers' },
  Romans: { about: 'Paul', to: 'believers in Rome (and you today)' },
  '1 Corinthians': { about: 'Paul', to: 'the church at Corinth (and you today)' },
  '2 Corinthians': { about: 'Paul', to: 'the church at Corinth (and you today)' },
  Galatians: { about: 'Paul', to: 'the churches of Galatia (and you today)' },
  Ephesians: { about: 'Paul', to: 'believers in Ephesus (and you today)' },
  Philippians: { about: 'Paul', to: 'the church at Philippi (and you today)' },
  Colossians: { about: 'Paul', to: 'believers in Colosse (and you today)' },
  '1 Thessalonians': { about: 'Paul', to: 'believers in Thessalonica (and you today)' },
  '2 Thessalonians': { about: 'Paul', to: 'believers in Thessalonica (and you today)' },
  '1 Timothy': { about: 'Paul', to: 'Timothy (and every young believer)' },
  '2 Timothy': { about: 'Paul', to: 'Timothy (and every timid heart)' },
  Titus: { about: 'Paul', to: 'Titus (and church leaders)' },
  Philemon: { about: 'Paul', to: 'Philemon (and the church in his house)' },
  Hebrews: { about: 'The writer of Hebrews', to: 'Hebrew believers holding fast to Christ' },
  James: { about: 'James', to: 'scattered believers under trial' },
  '1 Peter': { about: 'Peter', to: 'believers in suffering and hope' },
  '2 Peter': { about: 'Peter', to: 'believers growing in grace and knowledge' },
  '1 John': { about: 'John', to: 'beloved children walking in the light' },
  '2 John': { about: 'John', to: 'the elect lady and her children' },
  '3 John': { about: 'John', to: 'Gaius' },
  Jude: { about: 'Jude', to: 'believers called to contend for the faith' },
  Revelation: { about: 'John (from Jesus Christ)', to: 'the seven churches — and every reader' }
};

/** Chapter-specific polish for famous chapters (key: Book:chapter). */
const CHAPTER_OVERRIDES = {
  'Genesis:1': { about: 'Moses (recording God’s Word)', to: 'Israel — and anyone hearing creation’s beginning', setting: 'Creation' },
  'Genesis:2': { about: 'Moses (recording God’s Word)', to: 'Israel — and anyone hearing how God formed people', setting: 'Eden and the first people' },
  'Genesis:3': { about: 'The serpent, Eve, Adam, and the Lord God', to: 'Adam and Eve — and all of us after the fall', setting: 'The fall' },
  'Genesis:6': { about: 'Moses (recording God’s Word)', to: 'Israel — and all who need warning and mercy', setting: 'Noah and the flood begins' },
  'Genesis:12': { about: 'The Lord and Abram (through Moses)', to: 'Abram — and all who walk by promise', setting: 'Call of Abram' },
  'Genesis:22': { about: 'The Lord and Abraham (through Moses)', to: 'Abraham — and all who trust God with what they love', setting: 'Abraham and Isaac' },
  'Genesis:37': { about: 'Moses (recording Joseph’s story)', to: 'Israel — and anyone betrayed yet held by God', setting: 'Joseph sold by his brothers' },
  'Genesis:50': { about: 'Joseph (through Moses)', to: 'His brothers — and all who need forgiveness after harm', setting: 'Joseph forgives' },
  'Exodus:3': { about: 'The Lord and Moses', to: 'Moses — and all who feel too small for a call', setting: 'Burning bush' },
  'Exodus:14': { about: 'Moses (recording the Lord\'s deliverance)', to: 'Israel at the sea — and all who need a way through', setting: 'Red Sea crossing' },
  'Exodus:20': { about: 'God', to: 'Israel at Sinai', setting: 'Ten Commandments' },
  'Joshua:1': { about: 'The Lord to Joshua', to: 'Joshua — and anyone stepping into a hard new season', setting: 'Be strong and courageous' },
  'Ruth:1': { about: 'The narrator of Ruth (with Naomi and Ruth)', to: 'Families under loss — and all who choose loyal love', setting: 'Ruth stays with Naomi' },
  '1 Samuel:17': { about: 'The narrator of Samuel (with David and Goliath)', to: 'Israel facing a giant — and anyone facing what feels too big', setting: 'David and Goliath' },
  'Psalm:1': { about: 'A psalm writer', to: 'Anyone choosing a path for life', setting: 'Two ways' },
  'Psalm:23': { about: 'David', to: 'Anyone who needs a Shepherd', setting: 'The Lord is my shepherd' },
  'Psalm:27': { about: 'David', to: 'Anyone fighting fear with faith', setting: 'The Lord is my light' },
  'Psalm:34': { about: 'David', to: 'Anyone tasting that the Lord is good', setting: 'Taste and see' },
  'Psalm:46': { about: 'A psalm writer', to: 'Anyone in trouble who needs a refuge', setting: 'God is our refuge' },
  'Psalm:51': { about: 'David', to: 'God — and any heart needing mercy', setting: 'Repentance' },
  'Psalm:91': { about: 'A psalm writer', to: 'Those who trust under His wings', setting: 'Refuge' },
  'Psalm:119': { about: 'A psalm writer devoted to God’s Word', to: 'Anyone learning to walk by Scripture', setting: 'Love for God’s law' },
  'Psalm:139': { about: 'David', to: 'Anyone who needs to know they are known by God', setting: 'Wonderfully made' },
  'Proverbs:3': { about: 'Solomon giving wisdom', to: 'Anyone learning to trust the Lord with the whole heart', setting: 'Trust and acknowledge Him' },
  'Isaiah:40': { about: 'Isaiah (comfort from God)', to: 'Weary Judah — and anyone waiting on the Lord', setting: 'Comfort' },
  'Isaiah:41': { about: 'Isaiah (the Lord speaking)', to: 'Fearful people — and you when fear is loud', setting: 'Fear not; I am with you' },
  'Isaiah:53': { about: 'Isaiah', to: 'Israel — and all who look to the Suffering Servant', setting: 'Suffering Servant' },
  'Jeremiah:29': { about: 'Jeremiah (letter from the Lord)', to: 'Exiles in Babylon — and all waiting for hope', setting: 'Plans for peace and a future' },
  'Lamentations:3': { about: 'Jeremiah', to: 'Exiles in grief — and anyone whose mercies need renewing', setting: 'New every morning' },
  'Daniel:3': { about: 'The narrator of Daniel', to: 'Exiles under pressure — and all who refuse to bow', setting: 'Fiery furnace' },
  'Daniel:6': { about: 'The narrator of Daniel', to: 'Faithful servants under threat', setting: 'Daniel in the lions’ den' },
  'Matthew:5': { about: 'Jesus', to: 'His disciples on the mount (and you today)', setting: 'Sermon on the Mount' },
  'Matthew:6': { about: 'Jesus', to: 'His disciples learning prayer and trust (and you today)', setting: 'Lord’s Prayer and do not worry' },
  'Matthew:11': { about: 'Jesus', to: 'The weary and heavy laden (and you today)', setting: 'Come to Me and rest' },
  'Mark:4': { about: 'Jesus (through Mark)', to: 'Disciples in the storm (and you today)', setting: 'Peace, be still' },
  'Luke:15': { about: 'Jesus (through Luke)', to: 'Sinners and seekers (and you today)', setting: 'Lost sheep, coin, and son' },
  'John:3': { about: 'Jesus (through John)', to: 'Nicodemus — and anyone needing new birth', setting: 'Born again; God so loved' },
  'John:14': { about: 'Jesus (through John)', to: 'Troubled disciples (and you today)', setting: 'Let not your heart be troubled' },
  'John:15': { about: 'Jesus (through John)', to: 'Disciples abiding in Him (and you today)', setting: 'The true vine' },
  'Acts:2': { about: 'Luke (with Peter’s preaching)', to: 'Jerusalem at Pentecost — and the church ever since', setting: 'Pentecost' },
  'Romans:5': { about: 'Paul', to: 'Believers justified by faith (and you today)', setting: 'Peace with God' },
  'Romans:8': { about: 'Paul', to: 'Believers in the Spirit (and you today)', setting: 'No condemnation; more than conquerors' },
  'Romans:12': { about: 'Paul', to: 'Believers offering their lives (and you today)', setting: 'Living sacrifice; renewed mind' },
  '1 Corinthians:10': { about: 'Paul', to: 'The church at Corinth facing temptation (and you today)', setting: 'God is faithful in temptation' },
  '1 Corinthians:13': { about: 'Paul', to: 'A gifted but unloving church (and you today)', setting: 'Love never fails' },
  '2 Corinthians:12': { about: 'Paul', to: 'Weak believers who need grace (and you today)', setting: 'Strength in weakness' },
  'Galatians:5': { about: 'Paul', to: 'Churches learning freedom in the Spirit (and you today)', setting: 'Fruit of the Spirit' },
  'Ephesians:2': { about: 'Paul', to: 'Believers saved by grace (and you today)', setting: 'Saved by grace through faith' },
  'Ephesians:6': { about: 'Paul', to: 'Believers in spiritual battle (and you today)', setting: 'Armor of God' },
  'Philippians:4': { about: 'Paul', to: 'The church at Philippi (and you today)', setting: 'Rejoice; do not worry; peace of God' },
  'Colossians:3': { about: 'Paul', to: 'Believers setting minds above (and you today)', setting: 'Life hidden with Christ' },
  '2 Timothy:1': { about: 'Paul', to: 'Timothy — and every timid heart', setting: 'Power, love, and a sound mind' },
  'Hebrews:11': { about: 'The writer of Hebrews', to: 'Hebrew believers holding faith', setting: 'Hall of faith' },
  'Hebrews:12': { about: 'The writer of Hebrews', to: 'Believers running with patience', setting: 'Cloud of witnesses' },
  'James:1': { about: 'James', to: 'Scattered believers under trial', setting: 'Faith under pressure' },
  '1 Peter:5': { about: 'Peter', to: 'Believers casting care on God', setting: 'Humble under God’s hand' },
  '1 John:4': { about: 'John', to: 'Beloved children learning God’s love', setting: 'God is love' },
  'Revelation:21': { about: 'John (from God)', to: 'The church hoping for the new creation', setting: 'New heaven and new earth' },
  'Matthew:6': { about: 'Jesus', to: 'His disciples learning prayer and trust', setting: 'Sermon on the Mount' },
  'Matthew:7': { about: 'Jesus', to: 'His disciples on the mount (and you today)', setting: 'Sermon on the Mount' },
  'John:3': { about: 'Jesus', to: 'Nicodemus (and every seeker of new birth)', setting: 'New birth' },
  'John:14': { about: 'Jesus', to: 'His disciples the night before the cross', setting: 'Upper room' },
  'John:15': { about: 'Jesus', to: 'His disciples abiding in Him', setting: 'True vine' },
  'Romans:8': { about: 'Paul', to: 'Believers learning life in the Spirit', setting: 'Life in the Spirit' },
  '1 Corinthians:13': { about: 'Paul', to: 'The church at Corinth learning real love', setting: 'Love' },
  'Philippians:4': { about: 'Paul', to: 'the church at Philippi (and you today)', setting: 'Rejoice and pray' },
  'Hebrews:11': { about: 'The writer of Hebrews', to: 'Hebrew believers holding faith', setting: 'Hall of faith' },
  'Revelation:21': { about: 'John (from God)', to: 'The church hoping for the new creation', setting: 'New heaven and earth' }
};

function normalizeBook(book) {
  const b = String(book || '').trim();
  if (/^Psalms?$/i.test(b)) return 'Psalm';
  return b;
}

function parseCv(cv) {
  const m = String(cv || '').match(/^(\d+):(\d+)$/);
  if (!m) return null;
  return { c: +m[1], v: +m[2] };
}

function verseKey(book, c, v) {
  return normalizeBook(book) + ' ' + c + ':' + v;
}

async function loadKjv() {
  const p = await fs.stat(kjvFullPath).then(() => kjvFullPath).catch(() => kjvPath);
  return JSON.parse(await fs.readFile(p, 'utf8'));
}

function chapterMapFromKjv(kjv) {
  const chapters = {};
  for (const ref of Object.keys(kjv)) {
    const m = ref.match(/^(.+?)\s+(\d+):(\d+)$/);
    if (!m) continue;
    const book = normalizeBook(m[1]);
    const ch = +m[2];
    chapters[book] = Math.max(chapters[book] || 0, ch);
  }
  return chapters;
}

function buildChapters(chapterCounts) {
  const out = {};
  for (const [book, maxCh] of Object.entries(chapterCounts)) {
    const warm = BOOK_WARM[book] || BOOK_WARM.Psalm || { about: 'The biblical writer', to: 'God’s people in their time (and you today)' };
    for (let ch = 1; ch <= maxCh; ch++) {
      const key = book + ':' + ch;
      const ov = CHAPTER_OVERRIDES[key];
      const band = situationForChapter(book, ch);
      const about = (ov && ov.about) || band.about || warm.about;
      const to = (ov && ov.to) || band.to || warm.to;
      /* Prefer full narrative situation over short title-only settings. */
      let setting = (band && band.situation) || (ov && ov.setting) || '';
      if (ov && ov.setting && band && band.situation && ov.setting.length > band.situation.length) {
        setting = ov.setting;
      }
      if (ov && ov.setting && !band.situation) setting = ov.setting;
      out[key] = {
        about,
        to,
        setting: setting || composeSituationLine('', about, to)
      };
    }
  }
  return out;
}

function normalizeRanges(raw) {
  return (Array.isArray(raw) ? raw : []).map((r) => {
    const book = normalizeBook(r.book);
    const from = parseCv(r.from);
    const thru = parseCv(r.thru || r.to);
    const audience = String(r.audience || r.hearers || '').trim();
    if (!book || !from || !thru || !r.about || !audience) return null;
    return {
      book,
      fromC: from.c,
      fromV: from.v,
      toC: thru.c,
      toV: thru.v,
      about: String(r.about || '').trim(),
      to: audience,
      setting: String(r.setting || '').trim()
    };
  }).filter(Boolean);
}

function buildRuntimeJs(chapters, ranges, bookWarm) {
  return `/**
 * Full-Bible verse context resolver (who is talking / to whom).
 * Generated by scripts/build-verse-context.mjs — do not hand-edit the data block.
 * Cascade: verse map (optional) → passage range → chapter → book.
 */
(function (global) {
  'use strict';

  var CHAPTERS = ${JSON.stringify(chapters)};
  var RANGES = ${JSON.stringify(ranges)};
  var BOOK_WARM = ${JSON.stringify(bookWarm)};
  var VERSE_MAP = Object.create(null);

  function sanitize(s) {
    return String(s == null ? '' : s).replace(/\\s+/g, ' ').trim();
  }

  function normalizeBook(book) {
    var b = sanitize(book);
    if (/^Psalms?$/i.test(b)) return 'Psalm';
    return b;
  }

  function normalizeRef(ref) {
    return sanitize(ref)
      .replace(/\\u2013|\\u2014/g, '-')
      .replace(/[–—]/g, '-')
      .replace(/^Psalms\\s+/i, 'Psalm ')
      .replace(/\\s*\\(KJV\\)\\s*$/i, '');
  }

  function parseRef(ref) {
    var n = normalizeRef(ref);
    var m = n.match(/^(.+?)\\s+(\\d+):(\\d+)(?:\\s*-\\s*(?:(\\d+):)?(\\d+))?$/);
    if (!m) return null;
    var book = normalizeBook(m[1]);
    var c1 = +m[2];
    var v1 = +m[3];
    var c2 = m[4] ? +m[4] : c1;
    var v2 = m[5] ? +m[5] : v1;
    return { book: book, c: c1, v: v1, c2: c2, v2: v2, key: book + ' ' + c1 + ':' + v1 };
  }

  function pos(c, v) {
    return c * 1000 + v;
  }

  function matchRange(book, c, v) {
    var p = pos(c, v);
    var best = null;
    for (var i = 0; i < RANGES.length; i++) {
      var r = RANGES[i];
      if (r.book !== book) continue;
      var a = pos(r.fromC, r.fromV);
      var b = pos(r.toC, r.toV);
      if (p < a || p > b) continue;
      var span = b - a;
      if (!best || span < best._span) {
        best = { about: r.about, to: r.to, setting: r.setting || '', source: 'range', _span: span };
      }
    }
    if (best) {
      delete best._span;
      return best;
    }
    return null;
  }

  function isWeakContext(about, toAudience) {
    var a = sanitize(about).toLowerCase();
    var t = sanitize(toAudience).toLowerCase();
    if (!a || !t) return true;
    if (a === 'bible writer' || a === 'the biblical author' || a === 'the biblical writer') return true;
    if (t === 'people who first heard these words' || t === 'original audience') return true;
    return false;
  }

  function isWeakSetting(setting) {
    var sit = sanitize(setting);
    if (!sit) return true;
    /* Full narrative: long enough with real sentence shape */
    if (sit.length >= 55 && sit.split(/\\s+/).length >= 10) return false;
    if (sit.length >= 40 && /[.!?]/.test(sit) && sit.split(/\\s+/).length >= 8) return false;
    return true;
  }

  function cleanSituationStamp(s) {
    var t = sanitize(s);
    t = t.replace(/^In this passage of Scripture, the focus is this:\\s*/i, '');
    var spoken = t.match(/^(.{2,80}?)\\s+[—–-]\\s+spoken by\\s+(.+?)\\s+to\\s+(.+?)\\.?$/i);
    if (spoken) {
      var title = spoken[1].replace(/\\s+/g, ' ').trim();
      var who = spoken[2].replace(/\\s+/g, ' ').trim().replace(/^The\\s+/, 'the ');
      var audience = spoken[3].replace(/\\s+/g, ' ').trim().replace(/^The\\s+/, 'the ');
      if (who && audience && title) {
        return who.charAt(0).toUpperCase() + who.slice(1) + ' said this to ' + audience + ': ' + title.replace(/[.!?]$/, '') + '.';
      }
    }
    return t;
  }

  function composeSituation(setting, about, to) {
    var sit = cleanSituationStamp(setting);
    var a = sanitize(about);
    var t = sanitize(to);
    if (sit && !isWeakSetting(sit)) {
      return /[.!?]$/.test(sit) ? sit : sit + '.';
    }
    /* Short title only — name speaker and audience without the factory stamp */
    if (sit && a && t) {
      var who = a.replace(/^The\s+/, 'the ');
      var audience = t.replace(/^The\s+/, 'the ');
      return who.charAt(0).toUpperCase() + who.slice(1) + ' said this to ' + audience + ': ' + sit.replace(/[.!?]$/, '') + '.';
    }
    if (a && t) return a + ' said this to ' + t + '.';
    if (sit) return /[.!?]$/.test(sit) ? sit : sit + '.';
    return 'God’s Word spoken into a real moment in history — still true for you.';
  }

  function packContext(about, to, setting, source) {
    var a = sanitize(about);
    var t = sanitize(to);
    var s = cleanSituationStamp(setting);
    return {
      about: a,
      to: t,
      setting: s,
      situation: composeSituation(s, a, t),
      source: source || 'none'
    };
  }

  function resolveVerseContext(ref) {
    var parsed = parseRef(ref);
    if (!parsed) {
      return packContext('', '', '', 'none');
    }
    var chap = CHAPTERS[parsed.book + ':' + parsed.c];
    var chapSetting = chap && chap.setting ? sanitize(chap.setting) : '';
    var verseHit = VERSE_MAP[parsed.key];
    if (verseHit && verseHit.about && verseHit.to && !isWeakContext(verseHit.about, verseHit.to)) {
      var vSet = sanitize(verseHit.setting || '');
      if (isWeakSetting(vSet) && !isWeakSetting(chapSetting)) vSet = chapSetting;
      return packContext(verseHit.about, verseHit.to, vSet, 'verse');
    }
    var rangeHit = matchRange(parsed.book, parsed.c, parsed.v);
    if (rangeHit && !isWeakContext(rangeHit.about, rangeHit.to)) {
      var rSet = sanitize(rangeHit.setting || '');
      if (isWeakSetting(rSet) && !isWeakSetting(chapSetting)) rSet = chapSetting;
      return packContext(rangeHit.about, rangeHit.to, rSet, 'range');
    }
    if (chap && chap.about && chap.to && !isWeakContext(chap.about, chap.to)) {
      return packContext(chap.about, chap.to, chap.setting || '', 'chapter');
    }
    var book = BOOK_WARM[parsed.book] || BOOK_WARM.Psalm;
    if (book) {
      return packContext(book.about, book.to, chapSetting || '', 'book');
    }
    return packContext(
      'The biblical writer',
      'God’s people in their time (and you today)',
      '',
      'fallback'
    );
  }

  function registerVerseContext(ref, about, toAudience, setting) {
    var parsed = parseRef(ref);
    if (!parsed) return false;
    var a = sanitize(about);
    var t = sanitize(toAudience);
    if (!a || !t || isWeakContext(a, t)) return false;
    VERSE_MAP[parsed.key] = { about: a, to: t, setting: sanitize(setting || '') };
    return true;
  }

  function registerVerseContextMap(map) {
    if (!map || typeof map !== 'object') return 0;
    var n = 0;
    Object.keys(map).forEach(function (ref) {
      var row = map[ref];
      if (!row) return;
      if (registerVerseContext(ref, row.about || row.speaker, row.to || row.audience, row.setting)) n += 1;
    });
    return n;
  }

  global.TDB_resolveVerseContext = resolveVerseContext;
  global.TDB_registerVerseContext = registerVerseContext;
  global.TDB_registerVerseContextMap = registerVerseContextMap;
  global.TDB_isWeakVerseContext = isWeakContext;
  global.__TDB_VERSE_CONTEXT_READY = true;

  try {
    var heroList = global.__TDB_HERO_DAILY_EXPLANATIONS;
    if (heroList && heroList.length) {
      var heroMap = Object.create(null);
      for (var hi = 0; hi < heroList.length; hi++) {
        var hr = heroList[hi];
        if (!hr || !hr.ref || !hr.about || !hr.to) continue;
        heroMap[hr.ref] = { about: hr.about, to: hr.to, setting: hr.setting || '' };
      }
      registerVerseContextMap(heroMap);
    }
  } catch (eHeroMap) { /* non-fatal */ }
})(typeof window !== 'undefined' ? window : typeof globalThis !== 'undefined' ? globalThis : this);
`;
}

async function main() {
  const kjv = await loadKjv();
  const chapterCounts = chapterMapFromKjv(kjv);
  const chapters = buildChapters(chapterCounts);
  const rangesRaw = JSON.parse(await fs.readFile(rangesPath, 'utf8'));
  const ranges = normalizeRanges(rangesRaw);

  await fs.writeFile(chaptersOutPath, JSON.stringify(chapters, null, 2) + '\n', 'utf8');
  await fs.writeFile(jsOutPath, buildRuntimeJs(chapters, ranges, BOOK_WARM), 'utf8');

  // Spot-check a few refs
  const checks = ['John 3:16', 'Philippians 4:6', 'Psalm 23:1', 'Genesis 1:1', '3 John 1:1'];
  const vm = { CHAPTERS: chapters, RANGES: ranges, BOOK_WARM };
  function quickResolve(ref) {
    const m = ref.match(/^(.+?)\s+(\d+):(\d+)$/);
    const book = normalizeBook(m[1]);
    const c = +m[2];
    const v = +m[3];
    const p = c * 1000 + v;
    let best = null;
    for (const r of ranges) {
      if (r.book !== book) continue;
      const a = r.fromC * 1000 + r.fromV;
      const b = r.toC * 1000 + r.toV;
      if (p >= a && p <= b) {
        const span = b - a;
        if (!best || span < best.span) best = { ...r, span, source: 'range' };
      }
    }
    if (best) return { about: best.about, to: best.to, source: 'range' };
    const ch = chapters[book + ':' + c];
    if (ch) return { ...ch, source: 'chapter' };
    return { ...(BOOK_WARM[book] || {}), source: 'book' };
  }

  console.log('build-verse-context: chapters', Object.keys(chapters).length, 'ranges', ranges.length);
  for (const ref of checks) {
    const r = quickResolve(ref);
    console.log(' ', ref, '→', r.source, '|', r.about, '→', r.to);
  }
  console.log('Wrote', path.relative(root, chaptersOutPath));
  console.log('Wrote', path.relative(root, jsOutPath));
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
