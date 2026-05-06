/**
 * Stable short slugs for /v?ref=… links (verse handout QR).
 * Encode: display reference → slug. Decode: slug → bible-api.com style reference.
 */
(function (global) {
  'use strict';

  /** Book abbreviation → canonical name for bible-api.com queries */
  var ABBR_TO_BOOK = {
    gen: 'Genesis',
    exo: 'Exodus',
    lev: 'Leviticus',
    num: 'Numbers',
    deu: 'Deuteronomy',
    jos: 'Joshua',
    jdg: 'Judges',
    rut: 'Ruth',
    '1sa': '1 Samuel',
    '2sa': '2 Samuel',
    '1ki': '1 Kings',
    '2ki': '2 Kings',
    '1ch': '1 Chronicles',
    '2ch': '2 Chronicles',
    ezr: 'Ezra',
    neh: 'Nehemiah',
    est: 'Esther',
    job: 'Job',
    ps: 'Psalms',
    pro: 'Proverbs',
    ecc: 'Ecclesiastes',
    sng: 'Song of Solomon',
    isa: 'Isaiah',
    jer: 'Jeremiah',
    lam: 'Lamentations',
    eze: 'Ezekiel',
    dan: 'Daniel',
    hos: 'Hosea',
    joe: 'Joel',
    amo: 'Amos',
    oba: 'Obadiah',
    jon: 'Jonah',
    mic: 'Micah',
    nah: 'Nahum',
    hab: 'Habakkuk',
    zep: 'Zephaniah',
    hag: 'Haggai',
    zec: 'Zechariah',
    mal: 'Malachi',
    mat: 'Matthew',
    mrk: 'Mark',
    luk: 'Luke',
    jhn: 'John',
    act: 'Acts',
    rom: 'Romans',
    '1co': '1 Corinthians',
    '2co': '2 Corinthians',
    gal: 'Galatians',
    eph: 'Ephesians',
    php: 'Philippians',
    col: 'Colossians',
    '1th': '1 Thessalonians',
    '2th': '2 Thessalonians',
    '1ti': '1 Timothy',
    '2ti': '2 Timothy',
    tit: 'Titus',
    phm: 'Philemon',
    heb: 'Hebrews',
    jam: 'James',
    '1pe': '1 Peter',
    '2pe': '2 Peter',
    '1jn': '1 John',
    '2jn': '2 John',
    '3jn': '3 John',
    jde: 'Jude',
    rev: 'Revelation'
  };

  /** Normalized book phrase (lowercase) → abbreviation */
  var NAME_TO_ABBR = {};
  Object.keys(ABBR_TO_BOOK).forEach(function (abbr) {
    var book = ABBR_TO_BOOK[abbr];
    NAME_TO_ABBR[book.toLowerCase()] = abbr;
  });
  NAME_TO_ABBR.psalm = 'ps';
  NAME_TO_ABBR.psalms = 'ps';

  var REF_PARSE =
    /^((?:(?:[123]\s+)?[A-Za-z][A-Za-z\s'.]*?))\s+(\d+)\s*[:\u003a.](\d+)(?:\s*[-\u2013\u2014]\s*(\d+))?\s*$/;
  var SLUG_PARSE = /^((?:[123][a-z]{2,3}|[a-z]{2,4}))(\d+)-(\d+)(?:-(\d+))?$/;

  function normSpaces(s) {
    return String(s || '')
      .replace(/\s+/g, ' ')
      .replace(/\u00a0/g, ' ')
      .trim();
  }

  function encode(displayRef) {
    var r = normSpaces(displayRef);
    var m = r.match(REF_PARSE);
    if (!m) return null;
    var bookPart = normSpaces(m[1]);
    var ch = m[2];
    var v1 = m[3];
    var v2 = m[4];
    var abbr = NAME_TO_ABBR[bookPart.toLowerCase()];
    if (!abbr) return null;
    if (v2) return abbr + ch + '-' + v1 + '-' + v2;
    return abbr + ch + '-' + v1;
  }

  function decode(slug) {
    var s = String(slug || '')
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9-]/g, '');
    if (!s || s.length > 48) return null;
    var m = s.match(SLUG_PARSE);
    if (!m) return null;
    var abbr = m[1];
    var book = ABBR_TO_BOOK[abbr];
    if (!book) return null;
    var ch = m[2];
    var a = m[3];
    var b = m[4];
    if (b) return book + ' ' + ch + ':' + a + '-' + b;
    return book + ' ' + ch + ':' + a;
  }

  global.TDB_VERSE_SLUG = {
    encode: encode,
    decode: decode
  };
})(typeof window !== 'undefined' ? window : globalThis);
