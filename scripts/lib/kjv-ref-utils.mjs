/**
 * Shared KJV reference helpers for integrity fail-safes.
 */
import fs from 'fs';
import path from 'path';

export function loadKjvFull(root) {
  const p = path.join(root, 'data', 'kjv-full.json');
  return JSON.parse(fs.readFileSync(p, 'utf8'));
}

/** Normalize "Psalms" ↔ "Psalm", collapse spaces, strip (KJV). */
export function normalizeRef(ref) {
  return String(ref || '')
    .replace(/\s*\(KJV\)\s*$/i, '')
    .replace(/[–—]/g, '-')
    .replace(/\s+/g, ' ')
    .replace(/^Psalms\s+/i, 'Psalm ')
    .trim();
}

export function bookChapterVerse(ref) {
  const n = normalizeRef(ref);
  const m = n.match(/^((?:[1-3]\s+)?[A-Za-z][A-Za-z.\s]*?)\s+(\d+):(\d+)\b/);
  if (!m) return null;
  const book = m[1].replace(/\./g, '').replace(/\s+/g, ' ').trim();
  return { book, chapter: Number(m[2]), verse: Number(m[3]), display: `${book} ${m[2]}:${m[3]}` };
}

/**
 * Resolve a ref (or short range like John 3:16-17) to KJV text.
 * Returns { text, keys[] } or null if nothing found.
 */
export function resolveKjvText(kjv, ref) {
  if (!ref || !kjv) return null;
  const raw = normalizeRef(ref);
  // Single verse — try Psalm/Psalms variants
  const candidates = [
    raw,
    raw.replace(/^Psalm\s+/i, 'Psalms '),
    raw.replace(/^Psalms\s+/i, 'Psalm '),
  ];
  for (const c of candidates) {
    if (kjv[c]) return { text: kjv[c], keys: [c] };
  }

  // Chapter only: Genesis 3
  const chapOnly = raw.match(/^((?:[1-3]\s+)?[A-Za-z][A-Za-z.\s]*?)\s+(\d+)$/);
  if (chapOnly) {
    const book = chapOnly[1].replace(/\./g, '').replace(/\s+/g, ' ').trim();
    const ch = Number(chapOnly[2]);
    const keys = [];
    const parts = [];
    for (let v = 1; v <= 200; v++) {
      for (const b of [book, book.replace(/^Psalm$/i, 'Psalms'), book.replace(/^Psalms$/i, 'Psalm')]) {
        const k = `${b} ${ch}:${v}`;
        if (kjv[k]) {
          keys.push(k);
          parts.push(kjv[k]);
          break;
        }
      }
      if (parts.length && !kjv[`${book} ${ch}:${v + 1}`] && !kjv[`Psalms ${ch}:${v + 1}`] && !kjv[`Psalm ${ch}:${v + 1}`]) {
        // allow sparse; stop after gap of 3
      }
      if (v > 5 && parts.length === 0) break;
      if (parts.length && v > parts.length + 3) break;
    }
    if (parts.length) return { text: parts.join(' '), keys };
  }

  // Range: John 3:16-18 or Genesis 6:1-3
  const range = raw.match(
    /^((?:[1-3]\s+)?[A-Za-z][A-Za-z.\s]*?)\s+(\d+):(\d+)\s*-\s*(?:(\d+):)?(\d+)\b/
  );
  if (range) {
    const book0 = range[1].replace(/\./g, '').replace(/\s+/g, ' ').trim();
    const startCh = Number(range[2]);
    const startV = Number(range[3]);
    const endCh = Number(range[4] || range[2]);
    const endV = Number(range[5]);
    const keys = [];
    const parts = [];
    for (let ch = startCh; ch <= endCh; ch++) {
      const v0 = ch === startCh ? startV : 1;
      const v1 = ch === endCh ? endV : 200;
      for (let v = v0; v <= v1; v++) {
        let hit = null;
        for (const b of [book0, book0.replace(/^Psalm$/i, 'Psalms'), book0.replace(/^Psalms$/i, 'Psalm')]) {
          const k = `${b} ${ch}:${v}`;
          if (kjv[k]) {
            hit = k;
            break;
          }
        }
        if (!hit) {
          if (ch === endCh) break;
          break;
        }
        keys.push(hit);
        parts.push(kjv[hit]);
      }
    }
    if (parts.length) return { text: parts.join(' '), keys };
  }

  // Multi-ref "1 Samuel 17:1-11, 32-51" — take first segment
  if (raw.includes(',')) {
    const first = raw.split(',')[0].trim();
    return resolveKjvText(kjv, first);
  }

  // En-dash chapter ranges Genesis 6–9 or Revelation 6-8:1
  const chRange = raw.match(
    /^((?:[1-3]\s+)?[A-Za-z][A-Za-z.\s]*?)\s+(\d+)\s*-\s*(\d+)(?::(\d+))?$/
  );
  if (chRange) {
    return resolveKjvText(kjv, `${chRange[1]} ${chRange[2]}:1`);
  }

  // Multi-ref "Romans 3:23; 6:23" or "John 3:16; Romans 5:8"
  if (/[;]/.test(raw)) {
    let lastBook = '';
    for (const part of raw.split(';')) {
      let p = part.trim();
      if (!p) continue;
      // Inherit book for bare "6:23" segments
      if (/^\d+:\d+/.test(p) && lastBook) {
        p = `${lastBook} ${p}`;
      }
      const bcv = p.match(/^((?:[1-3]\s+)?[A-Za-z][A-Za-z.\s]*?)\s+\d+:/);
      if (bcv) lastBook = bcv[1].replace(/\s+/g, ' ').trim();
      const got = resolveKjvText(kjv, p);
      if (got) return got;
    }
  }

  return null;
}

/** Normalize for quote containment checks. */
export function normalizeForCompare(s) {
  return String(s || '')
    .toLowerCase()
    // Straight + curly quotes/apostrophes (LORD's / LORD's)
    .replace(/[\u2018\u2019\u201c\u201d"'`]/g, '')
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * True if quote is a substantial substring of KJV text (or vice versa for short tags).
 */
export function quoteAgreesWithKjv(quote, kjvText, minLen = 12) {
  const q = normalizeForCompare(quote);
  const k = normalizeForCompare(kjvText);
  if (!q || !k) return true; // nothing to check
  if (q.length < minLen) return true; // tags like "fear not" too short to gate hard
  if (k.includes(q)) return true;
  // Allow quote to be slightly longer narrative with KJV core
  if (q.length >= 24) {
    // sliding window: take middle 40 chars of quote
    const core = q.slice(0, Math.min(48, q.length));
    if (k.includes(core)) return true;
    // word overlap ratio
    const qw = new Set(q.split(' ').filter((w) => w.length > 3));
    const kw = new Set(k.split(' ').filter((w) => w.length > 3));
    if (qw.size >= 4) {
      let hit = 0;
      for (const w of qw) if (kw.has(w)) hit++;
      if (hit / qw.size >= 0.7) return true;
    }
  }
  return false;
}

/** Extract refs like "John 3:16" from free text. */
export function extractRefsFromText(text) {
  const s = String(text || '');
  const out = [];
  const re =
    /\b((?:[1-3]\s+)?[A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)\s+(\d{1,3}):(\d{1,3})(?:\s*-\s*(?:(\d{1,3}):)?(\d{1,3}))?\b/g;
  let m;
  while ((m = re.exec(s))) {
    let ref = `${m[1]} ${m[2]}:${m[3]}`;
    if (m[5]) {
      ref += m[4] ? `-${m[4]}:${m[5]}` : `-${m[5]}`;
    }
    out.push(ref);
  }
  return out;
}
