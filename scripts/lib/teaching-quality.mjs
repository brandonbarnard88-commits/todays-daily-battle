/**
 * Shared teaching-quality helpers (build + verify).
 * Keep in sync with runtime checks in verse-breakdown.js / hero-daily-first-paint.js.
 */


export function cleanSituationStamp(s) {
  let t = String(s || '').replace(/\s+/g, ' ').trim();
  t = t.replace(/^In this passage of Scripture, the focus is this:\s*/i, '');
  const spoken = t.match(/^(.{2,80}?)\s+[—–-]\s+spoken by\s+(.+?)\s+to\s+(.+?)\.?$/i);
  if (spoken) {
    const title = spoken[1].replace(/\s+/g, ' ').trim();
    const who = spoken[2].replace(/\s+/g, ' ').trim().replace(/^The\s+/, 'the ');
    const audience = spoken[3].replace(/\s+/g, ' ').trim().replace(/^The\s+/, 'the ');
    if (who && audience && title) {
      return who.charAt(0).toUpperCase() + who.slice(1) + ' said this to ' + audience + ': ' + title.replace(/[.!?]$/, '') + '.';
    }
  }
  return t;
}

export function isThinSpeakerLine(s) {
  const t = cleanSituationStamp(s);
  if (!t) return true;
  if (/^In this passage of Scripture/i.test(t)) return true;
  if (/ speaking to /i.test(t) && t.length < 100) return true;
  if (/^.{3,55}\s+speaking to\s+/i.test(t) && t.length < 120) return true;
  if (/^.{3,70}\s+[—–-]\s+spoken by\s+.+\s+to\s+/i.test(t) && t.length < 180) return true;
  return false;
}

export function isWeakPlainStamp(plain) {
  const p = String(plain || '').replace(/\s+/g, ' ').trim();
  if (!p) return true;
  if (/^In plain terms for life today:/i.test(p)) return true;
  if (/Sit with that until one phrase lands/i.test(p)) return true;
  if (/^Read this verse slowly/i.test(p)) return true;
  if (/God'?s care is for you today/i.test(p) && /day feels thin/i.test(p)) return true;
  if (/kindness meets you as you are/i.test(p) && /not after you perform/i.test(p)) return true;
  if (/take the verse as it stands/i.test(p)) return true;
  if (/This word is for you in the day you are actually living/i.test(p)) return true;
  if (/^A steady truth from Scripture for real life today\.?$/i.test(p)) return true;
  if (/^What was going on:\s*.{0,60}speaking to/i.test(p)) return true;
  return false;
}

/**
 * Leftover Grove templates that sneak past exact-string uniqueness
 * by appending a unique verse snippet. Hard-fail these in the 730 gate.
 */
export function leftoverTemplateIssues(row) {
  const ref = String((row && row.ref) || '');
  const setting = String((row && row.setting) || '');
  const to = String((row && row.to) || '');
  const plain = String((row && row.plain) || '');
  const today = String((row && row.today) || '');
  const issues = [];
  if (/This verse is the [a-z]+(?: [a-z]+){0,4}:/i.test(setting) || /Here the [a-z]+ is this:/i.test(setting)) {
    issues.push('role-factory setting');
  }
  if (/you have failed and still need to come/i.test(to + ' ' + today + ' ' + plain)) {
    issues.push('leftover failure-frame audience');
  }
  if (/kindness meets you as you are/i.test(plain) && /not after you perform/i.test(plain)) {
    issues.push('leftover kindness stamp');
  }
  if (/Mercy is not a prize for finishing strong/i.test(today + ' ' + plain + ' ' + to)) {
    issues.push('leftover finishing-strong mercy stamp');
  }
  if (/take the verse as it stands/i.test(plain)) {
    issues.push('as-it-stands leftover meaning');
  }
  if (/Lord, i bless/i.test(String((row && row.prayer) || ''))) {
    issues.push('leftover lowercase-i prayer');
  }
  if (/,\.\s*$/.test(setting) || /,\.\s*$/.test(plain)) {
    issues.push('truncated leftover comma-period');
  }
  if (/^1 Peter 1:/.test(ref) && /cornerstone/i.test(setting)) {
    issues.push('chapter-2 cornerstone leftover on 1 Peter 1');
  }
  const leftoverWhen = [
    'praise has to last past the morning',
    'love feels like a mood you cannot make',
    'you need somewhere that will hold',
    'you only have light for the next step',
    'gladness feels like a command you cannot feel',
    'you have no more push left',
    'your mind will not sit down',
    'hope has worn thin',
    'the Father feels hidden',
    'you are tired of forcing the next thing',
    'you need to be tended, not driven',
    'you need a path, not a feeling',
    'you need rescue that is still good today',
    'the request is still in your chest',
    'your own mind looks smarter than trust',
    'the heart is still broken',
    'you cannot sleep',
    'the day has not started clean',
    'you have forgotten who you are',
    'the next person will get your sharp edge',
    'the tears are still here',
    'you need someone else to hold you steady',
    'fear is loud'
  ];
  const toLow = to.toLowerCase();
  leftoverWhen.forEach((w) => {
    if (toLow.indexOf(w) !== -1) issues.push('leftover audience suffix: ' + w);
  });
  const taut = to.match(/needed to hear “([^”]+)”[\s\S]*you when you need to hear “([^”]+)”/i);
  if (taut && taut[1] && taut[2] && taut[1].slice(0, 18) === taut[2].slice(0, 18)) {
    issues.push('tautological leftover audience');
  }
  return issues;
}

function normTeachingLine(s) {
  return String(s || '')
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/** True when “What it means” is just the verse or the BBE restated. */
export function isNearVerbatimPlain(plain, verseText) {
  const p = normTeachingLine(plain);
  const v = normTeachingLine(verseText);
  if (!p) return true;
  if (v && p === v) return true;
  if (v && (p.indexOf(v) === 0 || v.indexOf(p) === 0) && Math.abs(p.length - v.length) < 48) return true;
  if (v && p.length >= Math.max(24, v.length * 0.72)) {
    const pTok = p.split(' ').filter(Boolean);
    const vSet = new Set(v.split(' ').filter(Boolean));
    if (pTok.length >= 6) {
      const hit = pTok.filter((tok) => vSet.has(tok)).length;
      if (hit / pTok.length >= 0.78) return true;
    }
  }
  return false;
}

export function isBbeEcho(plain, bbeText) {
  const p = String(plain || '').replace(/\s+/g, ' ').trim();
  const b = String(bbeText || '').replace(/\s+/g, ' ').trim();
  if (!p || !b) return false;
  return isNearVerbatimPlain(p, b);
}

export function scoreSituationLine(s) {
  let t = cleanSituationStamp(s)
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
