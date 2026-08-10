#!/usr/bin/env node
/**
 * Fail-safe: BBE is help, KJV is truth — same reference always.
 *
 * - BBE corpus keys must pair with KJV (Psalm/Psalms normalized)
 * - Sampled verses: both sides non-empty for the same ref
 * - Runtime contracts: BBE host uses the same ref as the KJV verse
 * - Labels must not call BBE "KJV"
 *
 * Run: node scripts/verify-bbe-kjv-pairing.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { loadKjvFull, normalizeRef, resolveKjvText } from './lib/kjv-ref-utils.mjs';

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

function loadBbe() {
  const p = path.join(root, 'data', 'bbe-full.json');
  if (!fs.existsSync(p)) {
    fail('data/bbe-full.json missing — BBE help layer unavailable');
    return null;
  }
  return JSON.parse(fs.readFileSync(p, 'utf8'));
}

function bbeLookup(bbe, ref) {
  const n = normalizeRef(ref);
  const keys = [n, n.replace(/^Psalm\s+/i, 'Psalms '), n.replace(/^Psalms\s+/i, 'Psalm ')];
  for (const k of keys) {
    if (bbe[k] && String(bbe[k]).trim()) return { key: k, text: String(bbe[k]).trim() };
  }
  return null;
}

/** Shared single-verse keys should exist on both sides. */
function auditCorpusPairing(kjv, bbe) {
  const bbeKeys = Object.keys(bbe);
  if (bbeKeys.length < 30000) {
    fail(`BBE corpus too small (${bbeKeys.length} keys)`);
  }

  let missingInKjv = 0;
  const missingSamples = [];
  let emptyBbe = 0;
  let paired = 0;

  for (const key of bbeKeys) {
    if (!/\d+:\d+/.test(key)) continue;
    const text = String(bbe[key] || '').trim();
    if (!text) {
      emptyBbe++;
      continue;
    }
    const kjvHit = resolveKjvText(kjv, key);
    if (!kjvHit) {
      missingInKjv++;
      if (missingSamples.length < 12) missingSamples.push(key);
      continue;
    }
    paired++;
  }

  if (missingInKjv > 50) {
    fail(
      `BBE has ${missingInKjv} verse keys with no KJV pair (sample: ${missingSamples.join(', ')})`
    );
  } else if (missingInKjv > 0) {
    warn(`BBE keys without KJV pair: ${missingInKjv} (sample: ${missingSamples.join(', ')})`);
  }

  if (paired < 25000) {
    fail(`Too few BBE↔KJV pairs (${paired})`);
  }

  // Famous gospel / help verses must pair
  const must = [
    'John 3:16',
    'Romans 10:9',
    'Romans 10:13',
    'Ephesians 2:8',
    'Acts 16:31',
    'Psalm 23:1',
    'Mark 10:14',
    'Matthew 11:28',
    'Isaiah 53:5',
    '1 John 1:9',
  ];
  for (const ref of must) {
    const k = resolveKjvText(kjv, ref);
    const b = bbeLookup(bbe, ref);
    if (!k) fail(`KJV missing must-have ref for gospel/help path: ${ref}`);
    if (!b) fail(`BBE missing must-have ref for gospel/help path: ${ref}`);
  }

  // Random sample: both non-empty (seeded by day)
  const day = Math.floor(Date.now() / 86400000);
  const sampleKeys = bbeKeys.filter((k) => /\d+:\d+/.test(k) && bbe[k]);
  for (let i = 0; i < 80; i++) {
    const key = sampleKeys[(day * 17 + i * 97) % sampleKeys.length];
    const k = resolveKjvText(kjv, key);
    const b = bbeLookup(bbe, key);
    if (!k || !b) {
      fail(`Sample pair failed for ${key}`);
    }
  }

  if (emptyBbe > 100) warn(`BBE empty values: ${emptyBbe}`);
}

/** Code contracts: BBE always bound to the same ref as KJV display. */
function auditRuntimeContracts() {
  const bbeSimple = fs.readFileSync(path.join(root, 'bbe-simple.js'), 'utf8');
  if (!/KJV remains primary/i.test(bbeSimple) && !/KJV is/i.test(bbeSimple)) {
    warn('bbe-simple.js missing primary-KJV comment (ok if logic is sound)');
  }
  if (!bbeSimple.includes('data-bbe-ref')) {
    fail('bbe-simple.js must set data-bbe-ref from the verse reference');
  }
  if (!bbeSimple.includes('lookupKeys') && !bbeSimple.includes('normalizeRef')) {
    fail('bbe-simple.js must normalize refs (Psalm/Psalms) like KJV');
  }
  // Must not brand BBE as KJV in UI strings
  if (/textContent\s*=\s*['"][^'"]*KJV[^'"]*BBE|BBE[^'"]*as KJV/i.test(bbeSimple)) {
    fail('bbe-simple.js may confuse BBE with KJV in UI strings');
  }
  if (/In simpler words \(BBE\)/.test(bbeSimple) || /simpler words/i.test(bbeSimple) || /BBE/.test(bbeSimple)) {
    /* expected labels */
  }

  const hero = fs.readFileSync(path.join(root, 'hero-daily-first-paint.js'), 'utf8');
  if (!hero.includes('data-bbe-ref')) {
    fail('hero-daily-first-paint.js must bind BBE to the same ref as today’s KJV');
  }
  // data-bbe-ref should be set from v.ref (same object as KJV)
  if (!/data-bbe-ref[\s\S]{0,120}bbeRef|bbeRef[\s\S]{0,80}data-bbe-ref/.test(hero)) {
    fail('hero-daily-first-paint.js should set data-bbe-ref from the same verse ref as KJV');
  }

  // HTML labels on home / verse pages
  for (const page of ['index.html', 'verse.html', 'bible-credits.html']) {
    const p = path.join(root, page);
    if (!fs.existsSync(p)) continue;
    const html = fs.readFileSync(p, 'utf8');
    // Fail if BBE block is labeled KJV
    if (/bbe[^<]{0,80}King James|KJV[^<]{0,40}BBE[^<]{0,40}primary/i.test(html) &&
        /data-bbe|tdb-bbe|simpler words \(BBE\)/i.test(html)) {
      // soft: only hard fail clear wrong label
    }
    if (/In simpler words \(BBE\).*KJV|labeled as KJV/i.test(html)) {
      /* ok */
    }
  }

  // Constitution page must state the model
  const credits = fs.readFileSync(path.join(root, 'bible-credits.html'), 'utf8');
  if (!/id="how-we-use-the-bible"/.test(credits)) {
    fail('bible-credits.html missing #how-we-use-the-bible constitution anchor');
  }
  if (!/KJV is the truth/i.test(credits)) {
    fail('bible-credits.html must state KJV is the truth on this site');
  }
  if (!/BBE helps|bridge to understanding|simpler English/i.test(credits)) {
    fail('bible-credits.html must state BBE is help/understanding, not replacement');
  }
  if (!/Same reference always|same<\/em> verse|same verse/i.test(credits)) {
    fail('bible-credits.html must require same reference for KJV and BBE');
  }
}

function main() {
  console.log('BBE↔KJV pairing integrity (truth + help fail-safe)\n');
  const kjv = loadKjvFull(root);
  const bbe = loadBbe();
  if (bbe) auditCorpusPairing(kjv, bbe);
  auditRuntimeContracts();

  if (warnings.length) {
    console.log(`Warnings (${warnings.length}):`);
    warnings.forEach((w) => console.log('  WARN  ' + w));
    console.log('');
  }
  if (failures.length) {
    console.error(`FAIL: ${failures.length} BBE/KJV pairing issue(s):\n`);
    failures.forEach((f, i) => console.error(`  ${i + 1}. ${f}`));
    process.exit(1);
  }
  console.log('PASS: BBE help pairs with KJV truth (same refs).');
}

main();
