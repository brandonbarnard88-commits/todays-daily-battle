/**
 * Shared verse teaching guards — used by build-time fidelity checks.
 * Goal: never ship wrong speaker, wrong-chapter situation, or plain meaning
 * that has nothing to do with the KJV line.
 */

const STOP = new Set(
  (
    'a an the and or but if as to of in on at by for from with without into onto ' +
    'is are was were be been being am do does did done have has had having ' +
    'i me my we us our you your he him his she her it its they them their ' +
    'this that these those who whom whose which what when where why how ' +
    'not no nor so than then there here all any each every few more most other ' +
    'some such only own same both will would shall should can could may might must ' +
    'o oh lord god gods ye thou thee thy thine saith said say says saying ' +
    'unto upon also very just also'
  ).split(/\s+/)
);

export function bookOf(ref) {
  const m = String(ref || '').match(/^((?:[1-3]\s+)?[A-Za-z][A-Za-z\s.]+?)\s+\d+:/);
  return m ? m[1].replace(/\./g, '').replace(/\s+/g, ' ').trim() : '';
}

export function chapterOf(ref) {
  const m = String(ref || '').match(/\s+(\d+):\d+/);
  return m ? Number(m[1]) : 0;
}

export function normalizeRef(ref) {
  return String(ref || '')
    .replace(/\s*\(KJV\)\s*$/i, '')
    .replace(/^Psalms\s+/i, 'Psalm ')
    .replace(/\s+/g, ' ')
    .trim();
}

/** Light stem so slippeth/slipping/slip match. */
export function stemToken(w) {
  let t = String(w || '').toLowerCase().replace(/[^a-z0-9']/g, '');
  if (t.length <= 3) return t;
  if (t.endsWith('eth') && t.length > 5) t = t.slice(0, -3);
  else if (t.endsWith('est') && t.length > 5) t = t.slice(0, -3);
  else if (t.endsWith('ing') && t.length > 5) t = t.slice(0, -3);
  else if (t.endsWith('ied') && t.length > 5) t = t.slice(0, -3) + 'y';
  else if (t.endsWith('ed') && t.length > 4) t = t.slice(0, -2);
  else if (t.endsWith('es') && t.length > 4) t = t.slice(0, -2);
  else if (t.endsWith('s') && t.length > 4 && !t.endsWith('ss')) t = t.slice(0, -1);
  return t;
}

export function contentTokens(text) {
  const raw = String(text || '')
    .toLowerCase()
    .replace(/[“”"']/g, '')
    .split(/[^a-z0-9]+/)
    .filter(Boolean);
  const out = new Set();
  for (const w of raw) {
    if (STOP.has(w)) continue;
    if (w.length < 3) continue;
    const st = stemToken(w);
    if (st.length < 3 || STOP.has(st)) continue;
    out.add(st);
  }
  return out;
}

/**
 * Plain meaning must share content with the KJV (or explicit BBE-style restatement).
 * @returns {{ ok: boolean, overlap: number, need: number, shared: string[] }}
 */
export function plainOverlapsVerse(plain, verseText) {
  const p = contentTokens(plain);
  const v = contentTokens(verseText);
  if (v.size === 0) {
    return { ok: true, overlap: 0, need: 0, shared: [] };
  }
  const shared = [];
  for (const t of p) {
    if (v.has(t)) shared.push(t);
  }
  const overlap = shared.length;
  /* Short verses (e.g. “Jesus wept.”) need fewer hits. */
  const need = v.size <= 3 ? 1 : v.size <= 6 ? 2 : Math.max(2, Math.ceil(v.size * 0.28));
  return { ok: overlap >= need, overlap, need, shared };
}

/**
 * If a teaching line names this person as the voice, the book must be on the allow list.
 * Serialized into tdb-verse-accuracy.js so build and the live page cannot drift.
 */
export const SPEAKER_RULES = [
  {
    id: 'solomon',
    name: /\bsolomon\b/,
    allow: /^(proverbs|ecclesiastes|song of solomon|[12] kings|[12] chronicles)\b/,
    psalmCh: [72, 127]
  },
  {
    id: 'paul',
    name: /\bpaul\b/,
    allow: /^(romans|[12] corinthians|galatians|ephesians|philippians|colossians|[12] thessalonians|[12] timothy|titus|philemon|acts|hebrews)\b/
  },
  {
    id: 'david',
    name: /\bdavid\b/,
    allow: /^(psalm|[12] samuel|[12] kings|[12] chronicles|matthew|mark|luke|john|acts)\b/,
    unless: /\bjesus\b/
  },
  {
    id: 'peter',
    name: /\bpeter\b/,
    allow: /^([12] peter|matthew|mark|luke|john|acts)\b/,
    unless: /\bjesus\b/
  },
  {
    id: 'james',
    name: /\bjames\b/,
    allow: /^(james|matthew|mark|luke|john|acts)\b/,
    unless: /\bjesus\b/
  },
  {
    id: 'jude',
    name: /\bjude\b/,
    allow: /^(jude|matthew|mark|luke|john|acts)\b/
  },
  {
    id: 'isaiah',
    name: /\bisaiah\b/,
    allow: /^(isaiah|[12] kings|[12] chronicles|matthew|mark|luke|john|acts|romans)\b/
  },
  {
    id: 'moses',
    name: /\bmoses\b/,
    allow: /^(genesis|exodus|leviticus|numbers|deuteronomy|joshua|psalm|matthew|mark|luke|john|acts|hebrews|jude|revelation)\b/
  },
  {
    id: 'john',
    name: /\bjohn\b/,
    allow: /^(john|[123] john|revelation|matthew|mark|luke|acts)\b/,
    unless: /\bjohnson\b/
  }
];

/** Speaker string must not contradict the book. */
export function speakerBelongsToBook(about, ref) {
  const a = String(about || '').toLowerCase();
  const book = bookKey(bookOf(ref));
  if (!a || !book) return true;
  const ch = chapterOf(ref);
  let matched = 0;
  let allowed = 0;
  for (let i = 0; i < SPEAKER_RULES.length; i++) {
    const rule = SPEAKER_RULES[i];
    if (!rule.name.test(a)) continue;
    if (rule.unless && rule.unless.test(a)) continue;
    matched += 1;
    if (rule.allow.test(book)) {
      allowed += 1;
      continue;
    }
    if (rule.psalmCh && /^psalm/.test(book) && rule.psalmCh.indexOf(ch) !== -1) {
      allowed += 1;
    }
  }
  if (!matched) return true;
  return allowed > 0;
}

/**
 * Distinctive teaching stamps that may only sit under a matching ref.
 * `allow: null` means the phrase is never legal (mashup / contamination).
 */
export const PHRASE_LOCKS = [
  { id: '1jn-mashup', re: /Love one another;\s*test the spirits/i, allow: null },
  { id: '1jn-test-spirits', re: /test the spirits/i, allow: /^1 John\s+4:[1-6]\b/i },
  { id: '1jn-victory', re: /victory that overcomes the world/i, allow: /^1 John\s+5:/i },
  { id: '1jn-urges-love', re: /John urges the church to love one another/i, allow: /^1 John\s+4:/i },
  { id: 'ps92-sabbath', re: /Sabbath song of thanksgiving/i, allow: /^Psalm(s)?\s+92:/i },
  { id: 'ps93-floods', re: /floods and noise cannot unseat|floods,\s*thrones/i, allow: /^Psalm(s)?\s+93:/i },
  { id: 'ps94-slip', re: /when (his |the )?foot slipp/i, allow: /^Psalm(s)?\s+94:/i },
  { id: 'prov-path', re: /straight path for work and plans|learning a straight path/i, allow: /^Proverbs\b/i },
  { id: 'solomon-under-wrong', re: /\bSolomon giving wisdom\b/i, allow: /^(Proverbs|Ecclesiastes|Song of Solomon)\b/i },
  /* Leftover Grove templates that unique-ify themselves with a verse snippet. */
  { id: 'leftover-song-template', re: /This verse is the song/i, allow: /^Psalm(s)?\s+/i },
  { id: 'leftover-failed-come', re: /you have failed and still need to come/i, allow: null },
  { id: 'leftover-kindness-stamp', re: /kindness meets you as you are/i, allow: null }
];

export function refAllowsLock(ref, lock) {
  if (!lock) return true;
  if (lock.allow == null) return false;
  return lock.allow.test(normalizeRef(ref));
}

/** First named speaker in a teaching line (“John urges…”, “Paul writes…”). */
export function leadingSpeakerInText(text) {
  const t = String(text || '')
    .replace(/^What was going on:\s*/i, '')
    .replace(/^What it means:\s*/i, '')
    .trim();
  const m = t.match(
    /^(?:the\s+apostle\s+|the\s+prophet\s+)?(solomon|paul|david|peter|james|jude|isaiah|moses|john)\b/i
  );
  return m ? m[1] : '';
}

/** Situation / audience / plain must not carry a locked stamp from another verse. */
export function situationLooksWrongForRef(sit, ref) {
  const s = String(sit || '');
  const r = normalizeRef(ref);
  if (!s || !r) return false;
  for (let i = 0; i < PHRASE_LOCKS.length; i++) {
    const lock = PHRASE_LOCKS[i];
    if (!lock.re.test(s)) continue;
    if (!refAllowsLock(r, lock)) return true;
  }
  const lead = leadingSpeakerInText(s);
  if (lead && !speakerBelongsToBook(lead, r)) return true;
  return false;
}

/**
 * Per-book chapter-band fingerprints: tokens unique to one band in that book.
 * Used so a 1 John 5 “victory” line cannot sit under 1 John 4:7 without a new wanted-poster.
 */
export function buildBandFingerprints(map) {
  const out = [];
  const books = map && typeof map === 'object' ? Object.keys(map) : [];
  for (let b = 0; b < books.length; b++) {
    const book = books[b];
    const bands = map[book] || [];
    const tokenSets = bands.map((band) => contentTokens(band && band.situation));
    for (let i = 0; i < bands.length; i++) {
      const others = new Set();
      for (let j = 0; j < tokenSets.length; j++) {
        if (j === i) continue;
        tokenSets[j].forEach((t) => others.add(t));
      }
      const distinctive = [];
      tokenSets[i].forEach((t) => {
        if (!others.has(t) && t.length >= 4) distinctive.push(t);
      });
      if (distinctive.length >= 2) {
        out.push({
          book,
          from: bands[i].from,
          thru: bands[i].thru,
          tokens: distinctive,
          situation: String(bands[i].situation || '')
        });
      }
    }
  }
  return out;
}

function bookKey(name) {
  return String(name || '')
    .replace(/^Psalms$/i, 'Psalm')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase();
}

/** Tokens in `text` that belong only to a different chapter-band of the same book. */
export function foreignBandHits(text, ref, fingerprints) {
  const book = bookKey(bookOf(ref));
  const ch = chapterOf(ref);
  if (!book || !ch || !Array.isArray(fingerprints)) return [];
  const sit = String(text || '')
    .replace(/\s+/g, ' ')
    .trim();
  const hits = [];
  for (let i = 0; i < fingerprints.length; i++) {
    const fp = fingerprints[i];
    if (bookKey(fp.book) !== book) continue;
    if (ch >= fp.from && ch <= fp.thru) continue;
    const otherSit = String(fp.situation || '')
      .replace(/\s+/g, ' ')
      .trim();
    if (otherSit.length >= 40 && sit === otherSit) {
      hits.push('exact:' + fp.book + ' ' + fp.from + '-' + fp.thru);
    }
  }
  return hits;
}

/**
 * One answer for “may this teaching sit under this ref?”
 * Hard errors only — missing is not an error here (callers require fields separately).
 */
export function evaluateTeachingFields(input) {
  const ref = normalizeRef(input && input.ref);
  const about = String((input && input.about) || '');
  const to = String((input && input.to) || '');
  const setting = String((input && (input.setting || input.situation)) || '');
  const plain = String((input && (input.plain || input.plainExplanation)) || '');
  const verseText = String((input && (input.verseText || input.text)) || '');
  const fingerprints = (input && input.fingerprints) || null;
  const errors = [];
  if (!ref) {
    errors.push('missing ref');
    return { ok: false, errors };
  }
  if (about && !speakerBelongsToBook(about, ref)) {
    errors.push('speaker does not fit book: "' + about.slice(0, 80) + '"');
  }
  ['setting', 'audience', 'plain'].forEach((slot) => {
    const val = slot === 'setting' ? setting : slot === 'audience' ? to : plain;
    if (val && situationLooksWrongForRef(val, ref)) {
      errors.push(slot + ' carries a locked phrase that does not belong to ' + ref);
    }
  });
  if (fingerprints && setting) {
    /* Exact paste of another chapter-band’s full situation — not shared letter-level words. */
    const foreign = foreignBandHits(setting, ref, fingerprints).filter((h) => /exact:/.test(h));
    if (foreign.length) {
      errors.push('setting is another chapter’s situation: ' + foreign.join('; '));
    }
  }
  if (verseText && plain) {
    const ov = plainOverlapsVerse(plain, verseText);
    if (ov.overlap === 0 && /Scripture meets ordinary hours|Stay until one sentence lands|Trust God with what you cannot control|a place to set the day down|God's care is not abstract/i.test(plain)) {
      errors.push('plain is a reusable pastoral stamp with 0 KJV overlap');
    }
  }
  return { ok: errors.length === 0, errors };
}

/**
 * Setting should match (or refine) the chapter-map situation for this book+chapter.
 * @returns {{ ok: boolean, reason?: string, mapSit?: string }}
 */
export function settingFitsChapterMap(setting, mapSituation) {
  const sit = String(setting || '')
    .replace(/\s+/g, ' ')
    .trim();
  const map = String(mapSituation || '')
    .replace(/\s+/g, ' ')
    .trim();
  if (!map) return { ok: true, mapSit: map };
  if (!sit) return { ok: false, reason: 'empty_setting', mapSit: map };
  if (sit === map) return { ok: true, mapSit: map };
  /* Allow curated refinement that still contains the map core. */
  const mapCore = map.replace(/\.$/, '').slice(0, 48).toLowerCase();
  if (mapCore.length >= 24 && sit.toLowerCase().includes(mapCore.slice(0, 36))) {
    return { ok: true, mapSit: map };
  }
  const mt = contentTokens(map);
  const st = contentTokens(sit);
  if (mt.size === 0) return { ok: true, mapSit: map };
  let shared = 0;
  for (const t of st) {
    if (mt.has(t)) shared += 1;
  }
  const ratio = shared / mt.size;
  if (shared >= 3 || ratio >= 0.35) return { ok: true, mapSit: map };
  return {
    ok: false,
    reason: `setting_mismatch shared=${shared}/${mt.size}`,
    mapSit: map
  };
}
