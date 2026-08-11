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

/** Speaker string must not contradict the book. */
export function speakerBelongsToBook(about, ref) {
  const a = String(about || '').toLowerCase();
  const book = bookOf(ref).toLowerCase();
  if (!a || !book) return true;
  if (/^isaiah\b/.test(book) && /\bdavid\b/.test(a) && !/isaiah/.test(a)) return false;
  if (/^joshua\b/.test(book) && /\bdavid\b/.test(a) && !/joshua/.test(a)) return false;
  if (/^deuteronomy\b/.test(book) && /\bdavid\b/.test(a) && !/moses/.test(a)) return false;
  if (/^matthew\b|^mark\b|^luke\b|^john\b/.test(book) && /\bdavid\b/.test(a) && !/jesus/.test(a)) return false;
  if (/^proverbs\b|^ecclesiastes\b/.test(book) && /\bdavid\b/.test(a) && !/solomon/.test(a)) return false;
  if (
    /^romans\b|^corinthians\b|^galatians\b|^ephesians\b|^philippians\b|^colossians\b|^timothy\b/.test(book) &&
    /\bdavid\b/.test(a) &&
    !/paul/.test(a)
  ) {
    return false;
  }
  if (/\bsolomon\b/.test(a)) {
    /* Psalm 72 may be framed as a prayer for Solomon / the king — not “Solomon wrote every psalm.” */
    if (/^psalm/.test(book)) {
      const ch = chapterOf(ref);
      if (ch === 72 && /prayer for solomon|for the king|solomon \(or/i.test(a)) return true;
      return false;
    }
    if (/^matthew\b|^mark\b|^luke\b|^john\b|^acts\b/.test(book)) return false;
    if (
      /^romans\b|^corinthians\b|^galatians\b|^ephesians\b|^philippians\b|^colossians\b|^thessalonians\b|^timothy\b|^titus\b|^philemon\b|^hebrews\b|^james\b|^peter\b|^jude\b|^revelation\b/.test(
        book
      )
    ) {
      return false;
    }
  }
  if (/\bpaul\b/.test(a) && /^psalm|^matthew\b|^mark\b|^luke\b|^john\b/.test(book) && !/paul/.test(book)) {
    return false;
  }
  return true;
}

/** Situation line must not be a known blurb from a different chapter cluster. */
export function situationLooksWrongForRef(sit, ref) {
  const s = String(sit || '');
  const r = String(ref || '');
  if (!s || !r) return false;
  if (!/^Psalm(s)?\s+92:/i.test(r) && /Sabbath song of thanksgiving/i.test(s)) return true;
  if (/floods,\s*thrones,\s*and idols|floods and noise cannot unseat/i.test(s)) {
    if (!/^Psalm(s)?\s+(93|95|96|97):/i.test(r)) return true;
  }
  if (/straight path for work and plans|learning a straight path/i.test(s) && !/^Proverbs\b/i.test(r)) {
    return true;
  }
  return false;
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
