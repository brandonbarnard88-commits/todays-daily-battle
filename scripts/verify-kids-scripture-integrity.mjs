#!/usr/bin/env node
/**
 * Fail-safe layer: Kids Scripture integrity
 *
 * Ensures Color & Tell, Story Library cards, and kids daily prompts do not
 * ship wrong book/verse pairings or invented “KJV” quotes.
 *
 * Run: node scripts/verify-kids-scripture-integrity.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import {
  loadKjvFull,
  normalizeRef,
  resolveKjvText,
  quoteAgreesWithKjv,
} from './lib/kjv-ref-utils.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const failures = [];
const warnings = [];

function fail(msg) {
  failures.push(msg);
}

function warn(msg) {
  warnings.push(msg);
}

function extractRefFromVerseLine(line) {
  const s = String(line || '').trim();
  // "… — John 3:16 (KJV)" or "John 3:16 (KJV)"
  const m = s.match(
    /((?:[1-3]\s+)?[A-Za-z][A-Za-z.\s]+?\s+\d+:\d+(?:\s*-\s*(?:\d+:)?\d+)?)\s*(?:\(KJV\))?\s*$/i
  );
  if (m) return normalizeRef(m[1]);
  const m2 = s.match(
    /^((?:[1-3]\s+)?[A-Za-z][A-Za-z.\s]+?\s+\d+:\d+(?:\s*-\s*(?:\d+:)?\d+)?)/
  );
  return m2 ? normalizeRef(m2[1]) : '';
}

function quoteBodyFromVerseLine(line) {
  const s = String(line || '').trim();
  const cut = s.replace(/\s*[—–-]\s*((?:[1-3]\s+)?[A-Za-z].+?\d+:\d+.*)$/i, '').trim();
  return cut.replace(/^[“"]|[”"]$/g, '').trim();
}

/** Color & Tell STORIES: verse + scene verses */
function auditColorAndTell(kjv) {
  const src = fs.readFileSync(path.join(root, 'kids/color-and-tell.js'), 'utf8');
  // Story-level verses
  const storyBlocks = [
    ...src.matchAll(
      /\{\s*id:\s*'([a-z0-9-]+)'\s*,\s*\n\s*title:\s*'((?:\\'|[^'])*)'[\s\S]{0,400}?verse:\s*'((?:\\'|[^'])*)'/g
    ),
  ];
  let checked = 0;
  for (const m of storyBlocks) {
    const id = m[1];
    const verseLine = m[3].replace(/\\'/g, "'");
    const ref = extractRefFromVerseLine(verseLine);
    if (!ref) {
      // some verses are pure quote without ref on story level — warn
      if (verseLine.length > 20) warn(`color-and-tell ${id}: story verse has no parseable ref`);
      continue;
    }
    const resolved = resolveKjvText(kjv, ref);
    if (!resolved) {
      fail(`color-and-tell story "${id}" verse ref not in KJV: ${ref}`);
      continue;
    }
    checked++;
    const body = quoteBodyFromVerseLine(verseLine);
    if (body && body.length >= 16 && !quoteAgreesWithKjv(body, resolved.text)) {
      fail(
        `color-and-tell story "${id}" quote does not match KJV ${ref}: “${body.slice(0, 60)}…”`
      );
    }
  }

  // Scene-level: refs must exist in KJV. Quotes often reuse the story's
  // anchor line under every panel (by design) — do not require quote↔ref match.
  const sceneVerses = [...src.matchAll(/verse:\s*'((?:\\'|[^']){8,200})'/g)].map((m) =>
    m[1].replace(/\\'/g, "'")
  );
  let sceneOk = 0;
  for (const line of sceneVerses) {
    const ref = extractRefFromVerseLine(line);
    if (!ref || !/\d+:\d+/.test(ref)) continue;
    const resolved = resolveKjvText(kjv, ref);
    if (!resolved) {
      fail(`color-and-tell scene verse ref missing from KJV: ${ref}`);
      continue;
    }
    sceneOk++;
  }

  if (checked + sceneOk < 30) {
    warn(`color-and-tell: only ${checked} story + ${sceneOk} scene refs validated`);
  }
}

/** Story Library kjvRef fields */
function auditKidsBattleRefs(kjv) {
  const src = fs.readFileSync(path.join(root, 'kids/kids-battle.js'), 'utf8');
  const refs = [...src.matchAll(/kjvRef:\s*['"]([^'"]+)['"]/g)].map((m) => m[1]);
  let ok = 0;
  let soft = 0;
  for (const raw of refs) {
    // Overview / multi-book strings
    if (/gospels overview|overview|various|selected/i.test(raw)) {
      soft++;
      continue;
    }
    // Multi-ref with commas — check first viable segment
    const segments = raw.split(/[;,]|\band\b/i).map((s) => s.trim());
    let found = false;
    for (const seg of segments) {
      if (!/\d/.test(seg)) continue;
      // Strip parenthetical notes
      const cleaned = seg.replace(/\([^)]*\)/g, '').trim();
      if (resolveKjvText(kjv, cleaned)) {
        found = true;
        break;
      }
      // Chapter-only ranges Genesis 6–9
      if (resolveKjvText(kjv, cleaned.replace(/[–—]/g, '-'))) {
        found = true;
        break;
      }
    }
    // Chapter–chapter spans: "Revelation 6–8:1" / "Genesis 6–9"
    const span = raw.replace(/[–—]/g, '-').match(
      /^((?:[1-3]\s+)?[A-Za-z][A-Za-z.\s]*?)\s+(\d+)\s*-\s*(\d+)(?::(\d+))?$/
    );
    if (!found && span) {
      const tryRef = `${span[1].trim()} ${span[2]}:1`;
      if (resolveKjvText(kjv, tryRef)) found = true;
    }
    if (!found && /\d+:\d+/.test(raw)) {
      if (!resolveKjvText(kjv, raw)) {
        fail(`kids-battle kjvRef not found in KJV: ${raw}`);
        continue;
      }
      found = true;
    }
    if (found || resolveKjvText(kjv, raw)) ok++;
    else if (/\d/.test(raw)) soft++;
  }
  if (ok < 50) fail(`kids-battle: too few valid kjvRef hits (${ok})`);
}

/** Speaker / who map: speakers must not contradict famous books */
function auditKidsWhoMap() {
  const src = fs.readFileSync(path.join(root, 'kids/kids-battle.js'), 'utf8');
  // who maps like: isaiah: { who: '...', to: '...' }
  const pairs = [
    ...src.matchAll(
      /\n\s{2,6}([a-z][a-z0-9]*)\s*:\s*\{\s*who:\s*'((?:\\'|[^'])*)'/g
    ),
  ];
  const contradictions = [
    { key: /isaiah/, whoMustNot: /^david\b/i },
    { key: /paul|romans|ephesians/, whoMustNot: /^moses\b/i },
    { key: /moses|exodus|deuteronomy/, whoMustNot: /^paul\b/i },
    { key: /jesus|matthew|mark|luke|john/, whoMustNot: /^david\b.*king/i },
  ];
  for (const m of pairs) {
    const key = m[1];
    const who = m[2].replace(/\\'/g, "'");
    for (const c of contradictions) {
      if (c.key.test(key) && c.whoMustNot.test(who) && !/jesus|christ/i.test(who)) {
        fail(`kids who-map "${key}" who="${who}" looks contradictory`);
      }
    }
  }
}

/** Kids mini-games verse bank (kids-game-kit.js) */
function auditKidsGames(kjv) {
  const p = path.join(root, 'kids/kids-game-kit.js');
  if (!fs.existsSync(p)) {
    warn('kids-game-kit.js missing — skip games verse bank');
    return;
  }
  const src = fs.readFileSync(p, 'utf8');
  const cards = [
    ...src.matchAll(
      /\{\s*id:\s*'[^']+'\s*,\s*plain:\s*'((?:\\'|[^'])*)'\s*,\s*kjv:\s*'((?:\\'|[^'])*)'\s*,\s*ref:\s*'([^']+)'/g
    ),
  ];
  if (cards.length < 5) {
    // alternate shape
    const refs = [...src.matchAll(/ref:\s*'([^']+\d+:\d+[^']*)'/g)].map((m) => m[1]);
    for (const ref of refs) {
      if (!resolveKjvText(kjv, ref)) fail(`kids-game-kit ref not in KJV: ${ref}`);
    }
    return;
  }
  for (const m of cards) {
    const kjvQuote = m[2].replace(/\\'/g, "'");
    const ref = m[3];
    const resolved = resolveKjvText(kjv, ref);
    if (!resolved) {
      fail(`kids-game-kit ref not in KJV: ${ref}`);
      continue;
    }
    if (!quoteAgreesWithKjv(kjvQuote, resolved.text, 10)) {
      fail(`kids-game-kit quote mismatch for ${ref}: “${kjvQuote.slice(0, 50)}…”`);
    }
  }
}

/** Kids daily prompts / short verses on coloring.html */
function auditColoringPageVerses(kjv) {
  const html = fs.readFileSync(path.join(root, 'coloring.html'), 'utf8');
  // Short Verses for Kids list
  const items = [
    ...html.matchAll(
      /<strong>([^<]+)<\/strong>\s*<p>([^<]{10,200})<\/p>/g
    ),
  ];
  for (const m of items) {
    const label = m[1].trim();
    const text = m[2].trim();
    if (!/\d+:\d+/.test(label)) continue;
    const resolved = resolveKjvText(kjv, label);
    if (!resolved) {
      fail(`coloring.html short verse ref missing: ${label}`);
      continue;
    }
    if (!quoteAgreesWithKjv(text, resolved.text, 10)) {
      fail(`coloring.html short verse text mismatch for ${label}`);
    }
  }
}

function main() {
  console.log('Kids Scripture integrity (fail-safe layer)\n');
  const kjv = loadKjvFull(root);

  auditColorAndTell(kjv);
  auditKidsBattleRefs(kjv);
  auditKidsWhoMap();
  auditKidsGames(kjv);
  auditColoringPageVerses(kjv);

  if (warnings.length) {
    console.log(`Warnings (${warnings.length}):`);
    warnings.slice(0, 20).forEach((w) => console.log('  WARN  ' + w));
    console.log('');
  }

  if (failures.length) {
    console.error(`FAIL: ${failures.length} kids Scripture issue(s):\n`);
    failures.forEach((f, i) => console.error(`  ${i + 1}. ${f}`));
    process.exit(1);
  }
  console.log('PASS: kids Scripture integrity clean.');
}

main();
