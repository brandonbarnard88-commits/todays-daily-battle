#!/usr/bin/env node
/**
 * Live homepage vs today’s official KJV.
 *
 * Fetches production HTML (not executed JS) and fails if first-paint is leftover:
 *  1. #heroRef is today’s queue verse
 *  2. #heroVerse is the official KJV (or a true in-order excerpt)
 *  3. Situation / meaning / who belong to that verse (not yesterday’s teaching)
 *  4. data-tdb-bound-ref on teaching blocks matches today’s ref
 *  5. /today-kjv-verse.json agrees when present
 *
 * Network only — not wired into npm run build.
 *
 *   LIVE_BASE_URL=https://todaysdailybattle.com npm run verify:live-hero
 *
 * Env:
 *   LIVE_BASE_URL          one origin (default: apex + www)
 *   LIVE_BASE_URLS         comma-separated origins
 *   LIVE_HERO_RETRIES      extra attempts after the first (default 4)
 *   LIVE_HERO_RETRY_MS     wait between attempts (default 20000)
 *   LIVE_FETCH_TIMEOUT_MS  per request (default 15000)
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  loadYear365,
  pickVerseForToday,
  utcDayOfYear,
  utcDaysSinceHeroEpoch,
} from './lib/hero-daily-verse-pick.mjs';
import {
  normalizeRef,
  situationLooksWrongForRef,
  speakerBelongsToBook,
  leadingSpeakerInText,
} from './lib/verse-teaching-guard.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');

const FETCH_TIMEOUT_MS = Math.max(1000, Number(process.env.LIVE_FETCH_TIMEOUT_MS || 15000));
const RETRIES = Math.max(0, parseInt(process.env.LIVE_HERO_RETRIES || '4', 10) || 4);
const RETRY_MS = Math.max(0, parseInt(process.env.LIVE_HERO_RETRY_MS || '20000', 10) || 20000);
const FETCH_UA =
  'Mozilla/5.0 (compatible; TDB-verify-live-hero/1.0; +https://todaysdailybattle.com) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';

const DEFAULT_ORIGINS = ['https://todaysdailybattle.com', 'https://www.todaysdailybattle.com'];
const BOUND_IDS = ['heroVotdBreakdown', 'heroVbdPrimary', 'heroSimpleBreakdown', 'heroDigDeeper'];

function origins() {
  const one = String(process.env.LIVE_BASE_URL || '').trim();
  const many = String(process.env.LIVE_BASE_URLS || '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
  if (one) return [one.replace(/\/$/, '')];
  if (many.length) return many.map((s) => s.replace(/\/$/, ''));
  return DEFAULT_ORIGINS;
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

function stripHtml(s) {
  return String(s || '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;|&apos;/gi, "'")
    .replace(/&ldquo;|&rdquo;/gi, '"')
    .replace(/&lsquo;|&rsquo;/gi, "'")
    .replace(/&#8216;|&#8217;/g, "'")
    .replace(/&#8220;|&#8221;/g, '"')
    .replace(/\s+/g, ' ')
    .trim();
}

function innerById(html, id) {
  const re = new RegExp(
    'id="' + id + '"[^>]*>([\\s\\S]*?)</(?:p|div|span|h[1-6]|strong|li)>',
    'i'
  );
  const m = String(html || '').match(re);
  return stripHtml(m ? m[1] : '');
}

function attrOnId(html, id, attr) {
  const block = String(html || '');
  const re1 = new RegExp('id="' + id + '"[^>]*\\b' + attr + '="([^"]*)"', 'i');
  const re2 = new RegExp('\\b' + attr + '="([^"]*)"[^>]*id="' + id + '"', 'i');
  const m = block.match(re1) || block.match(re2);
  return m ? String(m[1]).trim() : '';
}

function styleHidesId(html, id) {
  const style = attrOnId(html, id, 'style');
  return /display\s*:\s*none/i.test(style);
}

function loadKjv() {
  return JSON.parse(fs.readFileSync(path.join(root, 'data', 'kjv-full.json'), 'utf8'));
}

function officialSingle(kjv, ref) {
  const n = normalizeRef(ref);
  return kjv[n] || kjv[n.replace(/^Psalm /i, 'Psalms ')] || kjv[n.replace(/^Psalms /i, 'Psalm ')] || '';
}

function officialText(kjv, ref) {
  const n = normalizeRef(ref);
  const range = n.match(/^(.+?)\s+(\d+):(\d+)\s*[-–]\s*(\d+)$/);
  if (!range) return officialSingle(kjv, n);
  const book = range[1];
  const ch = range[2];
  const a = Number(range[3]);
  const b = Number(range[4]);
  const parts = [];
  for (let v = a; v <= b; v++) {
    const t = officialSingle(kjv, book + ' ' + ch + ':' + v);
    if (t) parts.push(t);
  }
  return parts.join(' ');
}

function normKjv(t) {
  return String(t || '')
    .replace(/[’‘‛`]/g, "'")
    .replace(/[“”]/g, '"')
    .replace(/\bLORD\b/g, 'Lord')
    .replace(/\bGOD\b/g, 'God')
    .replace(/longsuffering/gi, 'long suffering')
    .replace(/[^a-zA-Z0-9' ]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase();
}

function isTrueKjvExcerpt(display, official) {
  const d = normKjv(display);
  const o = normKjv(official);
  if (!d || !o) return false;
  if (o.includes(d)) return true;
  const dw = d.split(' ').filter(Boolean);
  const ow = o.split(' ').filter(Boolean);
  let j = 0;
  for (let i = 0; i < dw.length; i++) {
    const idx = ow.indexOf(dw[i], j);
    if (idx === -1) return false;
    j = idx + 1;
  }
  return true;
}

async function fetchText(url) {
  const res = await fetch(url, {
    redirect: 'follow',
    signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
    headers: {
      'User-Agent': FETCH_UA,
      Accept: 'text/html,application/xhtml+xml,application/json;q=0.9,*/*;q=0.8',
      'Cache-Control': 'no-cache',
      Pragma: 'no-cache',
    },
  });
  if (!res.ok) {
    throw new Error('HTTP ' + res.status + ' for ' + url);
  }
  return res.text();
}

function refsEqual(a, b) {
  return normalizeRef(a) === normalizeRef(b);
}

function auditHtml(html, expect, official, label) {
  const fails = [];
  const shownRef = normalizeRef(innerById(html, 'heroRef'));
  const shownVerse = innerById(html, 'heroVerse').replace(/^[“"]|[”"]$/g, '');
  const sit = innerById(html, 'heroSimpleSituation');
  const meaning = innerById(html, 'heroSimpleMeaning');
  const who = innerById(html, 'heroDeepWho');

  if (!shownRef) {
    fails.push(label + ': #heroRef missing');
  } else if (!refsEqual(shownRef, expect.ref)) {
    fails.push(label + ': first-paint ref is "' + shownRef + '" but today is ' + expect.ref);
  }

  if (!shownVerse) {
    fails.push(label + ': #heroVerse missing');
  } else if (!isTrueKjvExcerpt(shownVerse, official)) {
    fails.push(
      label + ': displayed KJV is not official ' + expect.ref + ': "' + shownVerse.slice(0, 110) + '"'
    );
  }

  if (!sit || sit.length < 12) {
    fails.push(label + ': situation missing or too thin');
  } else if (situationLooksWrongForRef(sit, expect.ref)) {
    fails.push(label + ': leftover/wrong situation under ' + expect.ref + ': "' + sit.slice(0, 120) + '"');
  }
  const sitLead = leadingSpeakerInText(sit);
  if (sitLead && !speakerBelongsToBook(sitLead, expect.ref)) {
    fails.push(label + ': situation leads with the wrong speaker (' + sitLead + ')');
  }

  if (!meaning || meaning.length < 12) {
    fails.push(label + ': meaning missing or too thin');
  } else if (situationLooksWrongForRef(meaning, expect.ref)) {
    fails.push(label + ': leftover/wrong meaning under ' + expect.ref + ': "' + meaning.slice(0, 120) + '"');
  }

  if (who && !speakerBelongsToBook(who, expect.ref)) {
    fails.push(label + ': who does not fit ' + expect.ref + ': "' + who + '"');
  }

  BOUND_IDS.forEach((id) => {
    const bound = normalizeRef(attrOnId(html, id, 'data-tdb-bound-ref'));
    if (!bound) {
      fails.push(label + ': #' + id + ' missing data-tdb-bound-ref');
      return;
    }
    if (!refsEqual(bound, expect.ref)) {
      fails.push(label + ': #' + id + ' bound-ref is "' + bound + '" but today is ' + expect.ref);
    }
    if (shownRef && !refsEqual(bound, shownRef)) {
      fails.push(label + ': #' + id + ' bound-ref "' + bound + '" does not match shown ref "' + shownRef + '"');
    }
  });

  ['heroSimpleSituation', 'heroSimpleMeaning', 'heroVbdPrimary', 'heroDigDeeper'].forEach((id) => {
    if (styleHidesId(html, id)) {
      fails.push(label + ': #' + id + ' is hidden — leftover lock is still firing on first paint');
    }
  });

  return fails;
}

function auditTodayJson(body, expect, official, label) {
  const fails = [];
  let data;
  try {
    data = JSON.parse(body);
  } catch {
    fails.push(label + ': today-kjv-verse.json is not JSON');
    return fails;
  }
  const ref = normalizeRef(data && data.ref);
  const text = String((data && data.text) || '').trim();
  if (!ref) {
    fails.push(label + ': today-kjv-verse.json missing ref');
  } else if (!refsEqual(ref, expect.ref)) {
    fails.push(label + ': today-kjv-verse.json is "' + ref + '" but today is ' + expect.ref);
  }
  if (!text) {
    fails.push(label + ': today-kjv-verse.json missing text');
  } else if (!isTrueKjvExcerpt(text, official)) {
    fails.push(label + ': today-kjv-verse.json is not official KJV: "' + text.slice(0, 110) + '"');
  }
  return fails;
}

async function checkOrigin(base, expect, official) {
  const fails = [];
  let html;
  try {
    html = await fetchText(base + '/');
  } catch (e) {
    fails.push(base + '/: fetch failed — ' + (e.message || e));
    return fails;
  }
  fails.push(...auditHtml(html, expect, official, base + '/'));

  try {
    const jsonBody = await fetchText(base + '/today-kjv-verse.json');
    fails.push(...auditTodayJson(jsonBody, expect, official, base));
  } catch (e) {
    fails.push(base + '/today-kjv-verse.json: fetch failed — ' + (e.message || e));
  }
  return fails;
}

async function runOnce(expect, official) {
  const fails = [];
  for (const base of origins()) {
    fails.push(...(await checkOrigin(base, expect, official)));
  }
  return fails;
}

async function main() {
  const year = loadYear365(root);
  const expect = pickVerseForToday(year);
  if (!expect || !expect.ref) {
    console.error('verify-live-hero-today: could not pick today’s verse from the local queue');
    process.exit(2);
  }
  const kjv = loadKjv();
  const official = officialText(kjv, expect.ref);
  if (!official) {
    console.error('verify-live-hero-today: no official KJV for', expect.ref);
    process.exit(2);
  }

  const doy = utcDayOfYear();
  const offset = utcDaysSinceHeroEpoch();
  const attempts = RETRIES + 1;
  let lastFails = [];

  for (let i = 1; i <= attempts; i++) {
    console.log(
      'verify-live-hero-today: attempt ' +
        i +
        '/' +
        attempts +
        ' — expect ' +
        expect.ref +
        ' (UTC doy ' +
        doy +
        ', offset ' +
        offset +
        ')'
    );
    lastFails = await runOnce(expect, official);
    if (!lastFails.length) {
      console.log(
        'verify-live-hero-today: PASS — live first-paint is official ' +
          expect.ref +
          ' on ' +
          origins().join(', ')
      );
      process.exit(0);
    }
    lastFails.forEach((f) => console.error(' • ' + f));
    if (i < attempts) {
      console.log('verify-live-hero-today: waiting ' + RETRY_MS + 'ms (stamp / CDN lag)…');
      await sleep(RETRY_MS);
    }
  }

  console.error(
    '\nverify-live-hero-today: FAIL — production does not match today’s official KJV (' +
      expect.ref +
      ').\n' +
      '  • Run the midnight stamp: node scripts/inject-home-hero.mjs\n' +
      '  • Confirm Cloudflare is serving the stamped index.html, not a stale cache.\n' +
      '  • Confirm leftover teaching is hidden until data-tdb-bound-ref matches the shown verse.'
  );
  process.exit(1);
}

main();
