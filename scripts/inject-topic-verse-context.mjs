#!/usr/bin/env node
/**
 * Inject “What was going on & what it means” (+ who / audience) into every
 * Key Verses list-item on topic-*.html feeling pages.
 *
 * Uses verse-context.js situation cascade + hero-layman plain meanings.
 * Re-runnable: replaces existing .tdb-topic-vbd blocks.
 *
 * Usage: node scripts/inject-topic-verse-context.mjs
 */
import fs from 'fs';
import path from 'path';
import vm from 'vm';
import { fileURLToPath } from 'url';
import {
  buildHeroLaymanPlain,
  loadVersePlainMeanings,
  normalizeHeroRef,
} from './lib/hero-layman-plain.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');

function loadResolver() {
  const code = fs.readFileSync(path.join(root, 'verse-context.js'), 'utf8');
  const sandbox = { console };
  sandbox.window = sandbox;
  sandbox.globalThis = sandbox;
  vm.runInNewContext(code, sandbox, { filename: 'verse-context.js' });
  if (typeof sandbox.TDB_resolveVerseContext !== 'function') {
    throw new Error('TDB_resolveVerseContext missing — run build-verse-context first');
  }
  return sandbox.TDB_resolveVerseContext;
}

function escapeHtml(s) {
  return String(s == null ? '' : s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function decodeBasicEntities(s) {
  return String(s || '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&mdash;/g, '—')
    .replace(/&ndash;/g, '–')
    .replace(/&rsquo;/g, '\u2019')
    .replace(/&lsquo;/g, '\u2018')
    .replace(/&rdquo;/g, '\u201d')
    .replace(/&ldquo;/g, '\u201c')
    .replace(/&amp;/g, '&')
    .replace(/&hellip;/g, '…')
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(+n))
    .replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCharCode(parseInt(h, 16)));
}

function stripTags(html) {
  return decodeBasicEntities(String(html || '').replace(/<[^>]+>/g, ' ')).replace(/\s+/g, ' ').trim();
}

function primaryRef(refLabel) {
  const n = normalizeHeroRef(String(refLabel || '').replace(/\(KJV\)/gi, ''));
  // Philippians 4:6-7 → Philippians 4:6 for context lookup
  const m = n.match(/^(.+?\s+\d+:\d+)/);
  return m ? m[1].trim() : n;
}

function composeCombined(situation, plain) {
  const sit = String(situation || '').replace(/\s+/g, ' ').trim();
  const p = String(plain || '')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/^What was going on:[\s\S]*?What it means:\s*/i, '')
    .replace(/^What it means:\s*/i, '');
  if (sit && p) {
    return (
      'What was going on: ' +
      sit.replace(/\.$/, '') +
      '. What it means: ' +
      p
    );
  }
  return p || sit || '';
}

let bbeMapCache = null;
function loadBbeMap() {
  if (bbeMapCache) return bbeMapCache;
  const p = path.join(root, 'data', 'bbe-full.json');
  try {
    bbeMapCache = JSON.parse(fs.readFileSync(p, 'utf8'));
  } catch (e) {
    bbeMapCache = {};
  }
  return bbeMapCache;
}

function bbeForRef(ref) {
  const map = loadBbeMap();
  const r = primaryRef(ref);
  if (map[r]) return String(map[r]).replace(/\s+/g, ' ').trim();
  const alt = r.replace(/^Psalm\s+/i, 'Psalms ').replace(/^Psalms\s+/i, 'Psalm ');
  if (map[alt]) return String(map[alt]).replace(/\s+/g, ' ').trim();
  return '';
}

/**
 * KISS stack after the KJV paragraph:
 * BBE → What was going on → What it means
 * (KJV already sits above as the verse body.)
 */
function buildVbdHtml(refLabel, verseText, plainMap, resolve) {
  const ref = primaryRef(refLabel);
  const text = stripTags(verseText);
  const ctx = resolve(ref) || {};
  const situation = String(ctx.situation || ctx.setting || '').replace(/\s+/g, ' ').trim();
  let plain = buildHeroLaymanPlain(ref, text, plainMap, root);
  plain = String(plain || '')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/^What was going on:[\s\S]*?What it means:\s*/i, '')
    .replace(/^What it means:\s*/i, '');
  const bbeNow = bbeForRef(ref);
  if (
    bbeNow &&
    plain &&
    plain.replace(/[^a-z0-9\s]/gi, ' ').replace(/\s+/g, ' ').trim().toLowerCase() ===
      bbeNow.replace(/[^a-z0-9\s]/gi, ' ').replace(/\s+/g, ' ').trim().toLowerCase()
  ) {
    plain = '';
  }
  if (
    !plain ||
    plain.length < 12 ||
    /^In plain terms for life today:/i.test(plain) ||
    /Sit with that until one phrase lands/i.test(plain)
  ) {
    plain = buildHeroLaymanPlain(ref, text, plainMap, root) ||
      'God’s Word here is steady for real life — hold one clear phrase and walk with it.';
    if (
      bbeNow &&
      plain.replace(/[^a-z0-9\s]/gi, ' ').replace(/\s+/g, ' ').trim().toLowerCase() ===
        bbeNow.replace(/[^a-z0-9\s]/gi, ' ').replace(/\s+/g, ' ').trim().toLowerCase()
    ) {
      plain = 'God’s Word here is steady for real life — hold one clear phrase and walk with it.';
    }
  }
  let sit = situation;
  if (/ speaking to /i.test(sit) && sit.length < 100) {
    const setAlt = String(ctx.setting || '').replace(/\s+/g, ' ').trim();
    sit = setAlt && setAlt.length >= 55 ? setAlt : '';
  }
  if (!sit && !plain) return '';

  const bbe = bbeForRef(ref);
  let html = '<div class="tdb-topic-vbd tdb-kiss-verse tdb-kiss-verse--topic" data-tdb-topic-vbd="1">';
  if (bbe) {
    html +=
      '<div class="tdb-kiss-verse__block tdb-kiss-verse__block--bbe">' +
      '<h4 class="tdb-kiss-verse__label">In simpler words</h4>' +
      '<p class="tdb-kiss-verse__bbe">' +
      escapeHtml(bbe) +
      '</p></div>';
  }
  if (sit) {
    html +=
      '<div class="tdb-kiss-verse__block">' +
      '<h4 class="tdb-kiss-verse__label">What was going on</h4>' +
      '<p class="tdb-kiss-verse__sit">' +
      escapeHtml(sit) +
      '</p></div>';
  }
  if (plain) {
    html +=
      '<div class="tdb-kiss-verse__block">' +
      '<h4 class="tdb-kiss-verse__label">What it means</h4>' +
      '<p class="tdb-kiss-verse__mean">' +
      escapeHtml(plain) +
      '</p></div>';
  }
  html += '</div>';
  return html;
}

/** Remove every <div class="tdb-topic-vbd"…>…</div> with balanced tags. */
function stripAllTopicVbd(html) {
  const marker = 'class="tdb-topic-vbd"';
  let out = '';
  let i = 0;
  while (i < html.length) {
    const start = html.indexOf('<div', i);
    if (start === -1) {
      out += html.slice(i);
      break;
    }
    const openEnd = html.indexOf('>', start);
    if (openEnd === -1) {
      out += html.slice(i);
      break;
    }
    const openTag = html.slice(start, openEnd + 1);
    if (!openTag.includes(marker) && !openTag.includes("class='tdb-topic-vbd'")) {
      out += html.slice(i, openEnd + 1);
      i = openEnd + 1;
      continue;
    }
    // Skip this whole balanced div
    out += html.slice(i, start);
    let depth = 1;
    let j = openEnd + 1;
    while (j < html.length && depth > 0) {
      const nextOpen = html.indexOf('<div', j);
      const nextClose = html.indexOf('</div>', j);
      if (nextClose === -1) {
        j = html.length;
        break;
      }
      if (nextOpen !== -1 && nextOpen < nextClose) {
        depth += 1;
        j = nextOpen + 4;
      } else {
        depth -= 1;
        j = nextClose + 6;
      }
    }
    i = j;
  }
  return out;
}

/**
 * Process one list-item inner HTML (content inside the wrapper div).
 * Pattern: <strong>Ref</strong><p>KJV</p>[optional note]
 */
function injectIntoListItemInner(inner, plainMap, resolve) {
  const body = stripAllTopicVbd(inner);

  const strongM = body.match(/<strong>([^<]+)<\/strong>/i);
  if (!strongM || !/\d+:\d+/.test(strongM[1])) return inner;

  const refLabel = strongM[1];
  const pMatch = body.match(/<\/strong>\s*<p(?![^>]*class="tdb-topic)([^>]*)>([\s\S]*?)<\/p>/i);
  if (!pMatch) return inner;

  const verseHtml = pMatch[2];
  const vbd = buildVbdHtml(refLabel, verseHtml, plainMap, resolve);
  if (!vbd) return body;

  /* Label the KJV block, then BBE + context — same order as home chips. */
  return body.replace(
    /(<strong>[^<]+<\/strong>)\s*<p(?![^>]*class="tdb-topic)([^>]*)>([\s\S]*?)<\/p>/i,
    function (_full, strong, _pAttrs, pInner) {
      return (
        strong +
        '\n            <div class="tdb-kiss-verse__block tdb-kiss-verse__block--kjv">' +
        '<h4 class="tdb-kiss-verse__label">KJV</h4>' +
        '<p class="tdb-kiss-verse__kjv"' +
        _pAttrs +
        '>' +
        pInner +
        '</p></div>\n            ' +
        vbd
      );
    }
  );
}

/**
 * Walk <div class="list-item"><div>…</div></div> with balanced inner divs.
 */
function processTopicHtml(html, plainMap, resolve) {
  let working = stripAllTopicVbd(html);
  let count = 0;
  const openMarker = '<div class="list-item">';
  let out = '';
  let i = 0;

  while (i < working.length) {
    const start = working.indexOf(openMarker, i);
    if (start === -1) {
      out += working.slice(i);
      break;
    }
    out += working.slice(i, start);

    // Parse from list-item open through matching close of outer list-item
    const afterOpen = start + openMarker.length;
    // Expect optional whitespace + inner <div>
    const innerOpenRel = working.slice(afterOpen).search(/<div\b/i);
    if (innerOpenRel < 0) {
      out += openMarker;
      i = afterOpen;
      continue;
    }
    const innerOpen = afterOpen + innerOpenRel;
    const innerOpenEnd = working.indexOf('>', innerOpen);
    if (innerOpenEnd < 0) {
      out += working.slice(start);
      break;
    }

    // Find end of inner div (balanced), then outer </div>
    let depth = 1;
    let j = innerOpenEnd + 1;
    let innerCloseEnd = -1;
    while (j < working.length && depth > 0) {
      const nextOpen = working.indexOf('<div', j);
      const nextClose = working.indexOf('</div>', j);
      if (nextClose === -1) break;
      if (nextOpen !== -1 && nextOpen < nextClose) {
        depth += 1;
        j = nextOpen + 4;
      } else {
        depth -= 1;
        if (depth === 0) {
          innerCloseEnd = nextClose + 6;
          break;
        }
        j = nextClose + 6;
      }
    }
    if (innerCloseEnd < 0) {
      out += working.slice(start, innerOpenEnd + 1);
      i = innerOpenEnd + 1;
      continue;
    }

    const inner = working.slice(innerOpenEnd + 1, innerCloseEnd - 6);
    // Skip trailing outer </div>
    let k = innerCloseEnd;
    while (k < working.length && /\s/.test(working[k])) k += 1;
    if (working.slice(k, k + 6).toLowerCase() === '</div>') {
      k += 6;
    }

    if (/<strong>[^<]*\d+:\d+/i.test(inner)) {
      const next = injectIntoListItemInner(inner, plainMap, resolve);
      if (next !== inner) count += 1;
      out += '<div class="list-item"><div>' + next + '</div></div>';
    } else {
      out += working.slice(start, k);
    }
    i = k;
  }

  return { html: out, count };
}

function main() {
  const resolve = loadResolver();
  const plainMap = loadVersePlainMeanings(root);
  const files = fs
    .readdirSync(root)
    .filter((f) => /^topic-.*\.html$/i.test(f))
    .sort();

  let totalCards = 0;
  let filesTouched = 0;

  for (const file of files) {
    const full = path.join(root, file);
    const before = fs.readFileSync(full, 'utf8');
    const { html, count } = processTopicHtml(before, plainMap, resolve);
    if (html !== before) {
      fs.writeFileSync(full, html, 'utf8');
      filesTouched += 1;
      totalCards += count;
      console.log('inject-topic-verse-context:', file, '→', count, 'cards');
    } else {
      console.log('inject-topic-verse-context:', file, '→ no change');
    }
  }

  console.log(
    'inject-topic-verse-context: done —',
    filesTouched,
    'files,',
    totalCards,
    'verse cards'
  );
}

main();
