/**
 * Shared layman-plain helpers for homepage hero inject + tests.
 * Goal: never ship a near-verbatim KJV echo as “Simple layman terms.”
 */
import fs from 'fs';
import path from 'path';

const ARCHAIC_TO_MODERN = {
  thee: 'you',
  thou: 'you',
  thy: 'your',
  thine: 'your',
  ye: 'you',
  hath: 'has',
  doth: 'does',
  shalt: 'shall',
  wilt: 'will',
  art: 'are',
  unto: 'to',
  saith: 'says',
  dwells: 'lives',
  dwelleth: 'lives',
  abide: 'stay',
  abideth: 'stays',
  labour: 'work',
  laden: 'burdened',
  mercy: 'kindness',
  rejoice: 'be glad',
};

export function normalizeHeroRef(ref) {
  let s = String(ref || '')
    .replace(/\uFEFF/g, '')
    .replace(/\*\*/g, '')
    .replace(/\s*\(KJV\)\s*$/i, '')
    .replace(/\s+/g, ' ')
    .trim();
  s = s.replace(/^Psalms\s+/i, 'Psalm ');
  s = s.replace(/^Ps\.?\s+/i, 'Psalm ');
  return s;
}

export function refLookupKeys(ref) {
  const n = normalizeHeroRef(ref);
  const keys = [];
  if (n) keys.push(n);
  if (/^Psalm\s+/i.test(n)) keys.push(n.replace(/^Psalm\s+/i, 'Psalms '));
  if (/^Psalms\s+/i.test(n)) keys.push(n.replace(/^Psalms\s+/i, 'Psalm '));
  const raw = String(ref || '').trim();
  if (raw && keys.indexOf(raw) === -1) keys.push(raw);
  return keys;
}

export function stripPlainPrefix(plain) {
  return String(plain || '')
    .replace(/^\s*In plain words:\s*/i, '')
    .replace(/^\s*Plain English:\s*/i, '')
    .replace(/^\s*Key idea:\s*/i, '')
    .trim();
}

export function normalizeForCompare(text) {
  let s = stripPlainPrefix(text).toLowerCase();
  Object.keys(ARCHAIC_TO_MODERN).forEach((k) => {
    s = s.replace(new RegExp('\\b' + k + '\\b', 'gi'), ARCHAIC_TO_MODERN[k]);
  });
  return s
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export function isWeakLaymanPlain(plain, verseText) {
  const pRaw = String(plain || '').replace(/\s+/g, ' ').trim();
  if (!pRaw) return true;
  if (/God can do what looks impossible to us\.?\s*$/i.test(pRaw)) return true;
  if (/^This word from Scripture meets you/i.test(pRaw)) return true;
  if (/A steady truth from Scripture for real life today\.?$/i.test(pRaw)) return true;
  if (/This verse says something true from God for real life today/i.test(pRaw)) return true;

  const p = normalizeForCompare(pRaw);
  const v = normalizeForCompare(verseText);
  if (!p) return true;
  if (v && p === v) return true;
  if (v && (p.indexOf(v) === 0 || v.indexOf(p) === 0) && Math.abs(p.length - v.length) < 48) {
    return true;
  }
  if (v) {
    const pTok = p.split(' ').filter(Boolean);
    const vTok = new Set(v.split(' ').filter(Boolean));
    if (pTok.length >= 6) {
      let hit = 0;
      pTok.forEach((t) => {
        if (vTok.has(t)) hit += 1;
      });
      if (hit / pTok.length >= 0.72) return true;
    }
  }
  return false;
}

export function buildThemeLaymanPlain(ref, text) {
  const body = String(text || '').replace(/\s+/g, ' ').trim();
  const lower = body.toLowerCase();
  const r = normalizeHeroRef(ref).toLowerCase();

  if (/91:1/.test(r) || /secret place|shadow of the almighty|dwell/.test(lower)) {
    return 'When you stay close to God, you rest under His protection — safe in His care.';
  }
  if (/11:28/.test(r) || /come unto me|heavy laden|give you rest/.test(lower)) {
    return 'Come to Jesus as you are, tired and carrying too much. He will give you rest.';
  }
  if (/23:1/.test(r) || /lord is my shepherd|shall not want/.test(lower)) {
    return 'The Lord takes care of me like a shepherd. With Him, I have what I need.';
  }
  if (/4:6/.test(r) && /philippians/.test(r)) {
    return "Don't let worry take over — pray, thank God, and tell Him what you need.";
  }
  if (/anxious|careful|worry|fear|afraid|dismay|terror/.test(lower)) {
    return 'You do not have to carry fear alone. Bring it to God and let Him steady you.';
  }
  if (/peace|rest|still|quiet|calm/.test(lower)) {
    return 'God offers real rest — a quiet place to set the day down with Him.';
  }
  if (/mercy|grace|forgiv|compassion|lovingkindness/.test(lower)) {
    return "God's kindness meets you as you are — not after you perform.";
  }
  if (/strength|strong|courage|weary|faint|renew|uphold/.test(lower)) {
    return 'When you feel empty, God gives strength beyond your own.';
  }
  if (/hope|trust|believe|faith|pray|cast|burden/.test(lower)) {
    return 'Hand the real weight to God. Trust that He hears and holds you.';
  }
  if (/love|shepherd|save|salvation|rejoice|glad|joy|bless/.test(lower)) {
    return "God's care is for you today — something solid to hold when the day feels thin.";
  }
  return 'Read this verse slowly. Let one clear phrase stay with you through the next hour.';
}

export function loadVersePlainMeanings(rootDir) {
  const scriptPath = path.join(rootDir, 'script.js');
  const s = fs.readFileSync(scriptPath, 'utf8');
  const start = s.indexOf('var VERSE_PLAIN_MEANINGS = {');
  if (start < 0) return {};
  const braceStart = s.indexOf('{', start);
  let depth = 0;
  let end = -1;
  for (let i = braceStart; i < s.length; i++) {
    const ch = s[i];
    if (ch === '{') depth += 1;
    else if (ch === '}') {
      depth -= 1;
      if (depth === 0) {
        end = i;
        break;
      }
    }
  }
  if (end < 0) return {};
  try {
    return Function('"use strict"; return (' + s.slice(braceStart, end + 1) + ');')();
  } catch (_) {
    return {};
  }
}

export function lookupCuratedPlain(ref, map) {
  const dict = map || {};
  const keys = refLookupKeys(ref);
  for (let i = 0; i < keys.length; i++) {
    const hit = dict[keys[i]];
    if (hit && String(hit).trim()) return String(hit).trim();
  }
  return '';
}

export function buildHeroLaymanPlain(ref, text, map) {
  const curated = lookupCuratedPlain(ref, map);
  if (curated && !isWeakLaymanPlain(curated, text)) return curated;
  const theme = buildThemeLaymanPlain(ref, text);
  if (theme && !isWeakLaymanPlain(theme, text)) return theme;
  return 'Read this verse slowly. Let one clear phrase stay with you through the next hour.';
}
