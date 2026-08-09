/**
 * Shared teaching-quality helpers (build + verify).
 * Keep in sync with runtime checks in verse-breakdown.js / hero-daily-first-paint.js.
 */

export function isThinSpeakerLine(s) {
  const t = String(s || '').replace(/\s+/g, ' ').trim();
  if (!t) return true;
  if (/ speaking to /i.test(t) && t.length < 100) return true;
  if (/^.{3,55}\s+speaking to\s+/i.test(t) && t.length < 120) return true;
  return false;
}

export function isWeakPlainStamp(plain) {
  const p = String(plain || '').replace(/\s+/g, ' ').trim();
  if (!p) return true;
  if (/^In plain terms for life today:/i.test(p)) return true;
  if (/Sit with that until one phrase lands/i.test(p)) return true;
  if (/^Read this verse slowly/i.test(p)) return true;
  if (/^God's care is for you today/i.test(p) && p.length < 80) return true;
  if (/^A steady truth from Scripture for real life today\.?$/i.test(p)) return true;
  if (/^What was going on:\s*.{0,60}speaking to/i.test(p)) return true;
  return false;
}

export function scoreSituationLine(s) {
  let t = String(s || '')
    .replace(/^What was going on:\s*/i, '')
    .replace(/\s+/g, ' ')
    .trim();
  if (!t) return 0;
  if (isThinSpeakerLine(t)) return 8;
  let score = t.length;
  if (t.length >= 55) score += 40;
  if (t.length >= 90) score += 30;
  if (/[.!?]/.test(t)) score += 15;
  if (/\b(commit|plans|work|proverb|psalm|sermon|cross|exile|disciple|covenant|temple|prison)/i.test(t)) {
    score += 20;
  }
  return score;
}

export function scoreMeaningLine(s) {
  let t = String(s || '')
    .replace(/^What was going on:[\s\S]*?What it means:\s*/i, '')
    .replace(/^What it means:\s*/i, '')
    .replace(/\s+/g, ' ')
    .trim();
  if (!t) return 0;
  if (isWeakPlainStamp(t)) return 5;
  return t.length + (t.length >= 40 ? 25 : 0);
}

export function pickBestText(candidates, scorer) {
  let best = '';
  let bestScore = 0;
  for (const raw of candidates || []) {
    const c = String(raw || '').replace(/\s+/g, ' ').trim();
    if (!c) continue;
    const sc = scorer(c);
    if (sc > bestScore) {
      bestScore = sc;
      best = c;
    }
  }
  return best;
}

/** Prefer narrative situation; drop thin speaker-lines when anything better exists. */
export function preferSituation(...candidates) {
  return pickBestText(candidates, scoreSituationLine);
}

/** Strip combined prefix so UI “Plain English” is meaning-only. */
export function meaningOnly(text) {
  return String(text || '')
    .replace(/^What was going on:[\s\S]*?What it means:\s*/i, '')
    .replace(/^What it means:\s*/i, '')
    .replace(/\s+/g, ' ')
    .trim();
}

/** Deterministic pseudo-random sample of refs from a list (stable by day seed). */
export function sampleRefs(list, count, seed) {
  const arr = Array.isArray(list) ? list.slice() : [];
  if (!arr.length || count <= 0) return [];
  let s = (Number(seed) || 1) >>> 0;
  function next() {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s;
  }
  for (let i = arr.length - 1; i > 0; i--) {
    const j = next() % (i + 1);
    const tmp = arr[i];
    arr[i] = arr[j];
    arr[j] = tmp;
  }
  return arr.slice(0, Math.min(count, arr.length));
}
