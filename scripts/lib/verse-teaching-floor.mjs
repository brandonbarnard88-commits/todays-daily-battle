/**
 * Catalog floor for the 730-day queue.
 *
 * Bound Grove rows stay. Any missing or leftover field is filled from
 * data/breakdown/{book}.json + TDB_resolveVerseContext so a queue day
 * cannot paint empty or leftover.
 */
import fs from 'fs';
import path from 'path';
import vm from 'vm';
import { leftoverTemplateIssues, isWeakPlainStamp, isLeftoverRelateLine } from './teaching-quality.mjs';
import { normalizeHeroRef } from './hero-layman-plain.mjs';

const FIELDS = ['plain', 'step', 'about', 'to', 'setting', 'prayer', 'modernApplication', 'today'];
const packCache = new Map();
let ctxResolver = undefined;
let kjvCache = null;

export function hookOf(text, maxLen) {
  const limit = maxLen || 64;
  let t = String(text || '')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/[.!?]$/, '');
  if (t.length > limit) t = t.slice(0, limit - 3).replace(/\s+\S*$/, '');
  return t;
}

/** Full KJV line for “The verse:” / step / prayer — never a chopped tail. */
export function verseQuoteFull(text) {
  return String(text || '')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/[.!?]$/, '');
}

export function bookSlug(book) {
  return String(book || '')
    .replace(/^Psalms$/i, 'Psalm')
    .toLowerCase()
    .replace(/\s+/g, '-');
}

export function splitRef(ref) {
  const n = normalizeHeroRef(ref);
  const m = n.match(/^(.+?)\s+(\d+):(\d+)$/);
  if (!m) return null;
  let book = m[1];
  if (/^Psalms$/i.test(book)) book = 'Psalm';
  return { book, cv: m[2] + ':' + m[3], ref: book + ' ' + m[2] + ':' + m[3] };
}

export function fieldNeedsFloor(value, field) {
  const t = String(value || '')
    .replace(/\s+/g, ' ')
    .trim();
  if (!t) return true;
  if (isLeftoverRelateLine(t)) return true;
  if (/hold this verse as written|life can feel loud/i.test(t)) return true;
  if (/has to be lived, not only heard/i.test(t)) return true;
  if (/His way is for your good/i.test(t)) return true;
  if (/kindness meets you as you are/i.test(t) && /not after you perform/i.test(t)) return true;
  if (/take the verse as it stands/i.test(t)) return true;
  if (/,\.\s*$/.test(t)) return true;
  if (field === 'plain' && isWeakPlainStamp(t)) return true;
  if (field === 'prayer' && /sink .+ into my heart/i.test(t)) return true;
  if ((field === 'setting' || field === 'plain') && t.length < 12) return true;
  return false;
}

function loadKjv(root) {
  if (kjvCache) return kjvCache;
  const full = path.join(root, 'data', 'kjv-full.json');
  const fallback = path.join(root, 'kjv.json');
  kjvCache = JSON.parse(fs.readFileSync(fs.existsSync(full) ? full : fallback, 'utf8'));
  return kjvCache;
}

export function kjvTextForRef(root, ref) {
  const kjv = loadKjv(root);
  const n = normalizeHeroRef(ref);
  return (
    kjv[n] ||
    kjv[n.replace(/^Psalm /i, 'Psalms ')] ||
    kjv[n.replace(/^Psalms /i, 'Psalm ')] ||
    ''
  );
}

export function loadCatalogPlain(root, ref) {
  const parts = splitRef(ref);
  if (!parts) return '';
  const slug = bookSlug(parts.book);
  if (!packCache.has(slug)) {
    const p = path.join(root, 'data', 'breakdown', slug + '.json');
    try {
      packCache.set(slug, fs.existsSync(p) ? JSON.parse(fs.readFileSync(p, 'utf8')) : {});
    } catch (e) {
      packCache.set(slug, {});
    }
  }
  const pack = packCache.get(slug) || {};
  return String(pack[parts.cv] || '')
    .replace(/\s+/g, ' ')
    .trim();
}

export function loadContextResolver(root) {
  if (ctxResolver !== undefined) return ctxResolver;
  try {
    const code = fs.readFileSync(path.join(root, 'verse-context.js'), 'utf8');
    const sandbox = { console };
    sandbox.window = sandbox;
    sandbox.globalThis = sandbox;
    vm.runInNewContext(code, sandbox, { filename: 'verse-context.js' });
    ctxResolver = typeof sandbox.TDB_resolveVerseContext === 'function' ? sandbox.TDB_resolveVerseContext : null;
  } catch (e) {
    ctxResolver = null;
  }
  return ctxResolver;
}

export function floorFromParts({ ref, text, plain, about, to, setting, year }) {
  const r = normalizeHeroRef(ref);
  const body = String(text || '').replace(/\s+/g, ' ').trim();
  const full = verseQuoteFull(body);
  const hook = hookOf(body);
  const yr = year || new Date().getUTCFullYear() || 2026;
  let meaning = String(plain || '')
    .replace(/\s+/g, ' ')
    .trim();
  if (!meaning || fieldNeedsFloor(meaning, 'plain')) {
    meaning = hook ? hook.charAt(0).toUpperCase() + hook.slice(1) + '.' : '';
  }
  const who = String(about || '')
    .replace(/\s+/g, ' ')
    .trim();
  let hear = String(to || '')
    .replace(/\s+/g, ' ')
    .trim();
  if (!hear) hear = 'The first hearers of this verse';
  let sit = String(setting || '')
    .replace(/\s+/g, ' ')
    .trim();
  if (full && (!sit || !/The verse:/i.test(sit))) {
    sit = (sit ? sit.replace(/[.]$/, '') + '. ' : '') + 'The verse: ' + full + '.';
  } else if (full && /The verse:/i.test(sit)) {
    sit = sit.replace(/The verse:[\s\S]*$/, 'The verse: ' + full + '.').trim();
  } else if (sit && !/[.!?]$/.test(sit)) {
    sit += '.';
  }
  const meaningBare = meaning.replace(/[.]$/, '');
  return {
    ref: r,
    text: body,
    plain: meaning,
    about: who,
    to: hear,
    setting: sit,
    today: meaning || (hook ? 'This word is for you in the hour this verse is for: “' + hook + '.”' : ''),
    modernApplication: full
      ? 'In ' + yr + ', ' + (meaningBare || hook) + '. The verse still says: “' + full + '.”'
      : meaning,
    step: full
      ? 'Write this where you will see it: “' + full + '.”'
      : 'Read this verse once more, then take the next small step it names.',
    prayer: full
      ? 'Lord, let this word be true in me today: “' + full + '.” In Jesus’ name, Amen.'
      : 'Lord, let this word be true in me today. In Jesus’ name, Amen.'
  };
}

export function mergeFloor(existing, floor) {
  const row = existing && typeof existing === 'object' ? existing : {};
  const out = Object.assign({}, floor, row);
  out.ref = normalizeHeroRef(row.ref || floor.ref);
  out.text = String(row.text || floor.text || '').replace(/\s+/g, ' ').trim();
  FIELDS.forEach((field) => {
    if (fieldNeedsFloor(row[field], field)) {
      out[field] = floor[field] || '';
    } else {
      out[field] = String(row[field]).replace(/\s+/g, ' ').trim();
    }
  });
  return out;
}

export function teachingForRef(root, ref, text, existing) {
  const n = normalizeHeroRef(ref);
  const body = String(text || (existing && existing.text) || kjvTextForRef(root, n) || '')
    .replace(/\s+/g, ' ')
    .trim();
  const catalogPlain = loadCatalogPlain(root, n);
  let about = '';
  let to = '';
  let setting = '';
  const resolve = loadContextResolver(root);
  if (typeof resolve === 'function') {
    try {
      const hit = resolve(n) || {};
      about = String(hit.about || '').replace(/\s+/g, ' ').trim();
      to = String(hit.to || '').replace(/\s+/g, ' ').trim();
      setting = String(hit.situation || hit.setting || '').replace(/\s+/g, ' ').trim();
    } catch (e) {
      /* non-fatal */
    }
  }
  const floor = floorFromParts({
    ref: n,
    text: body,
    plain: catalogPlain,
    about,
    to,
    setting
  });
  const merged = mergeFloor(existing || { ref: n, text: body }, floor);
  const issues = leftoverTemplateIssues(merged);
  if (issues.length) {
    FIELDS.forEach((field) => {
      if (fieldNeedsFloor(merged[field], field)) merged[field] = floor[field];
    });
  }
  return merged;
}

export function rowIsComplete(row) {
  if (!row || !row.ref) return false;
  for (let i = 0; i < FIELDS.length; i++) {
    if (fieldNeedsFloor(row[FIELDS[i]], FIELDS[i])) return false;
  }
  return leftoverTemplateIssues(row).length === 0;
}
