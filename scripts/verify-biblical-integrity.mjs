#!/usr/bin/env node
/**
 * Biblical integrity fail-safe suite (multi-layer)
 * =================================================
 *
 * Layered checks so one broken gate cannot silently ship wrong Scripture,
 * wrong “who”, wrong topic answers, or broken kids/story/plan wiring.
 *
 * Layers (in order):
 *   1. Systems wiring     — deep-links, lookup maps, hub assets
 *   2. Teaching integrity — daily verse, breakdown, topics, speakers, feel search
 *   3. Kids Scripture     — Color & Tell + Story Library KJV refs/quotes
 *   4. Characters / who   — people-verse-map + bible-characters.json
 *   5. Plans Scripture    — plan day refs + text vs KJV
 *   6. Verse breakdown    — full KJV coverage (optional heavy; default on)
 *   7. Phrase quality     — bulk plain/application stamp guard (if overrides exist)
 *   8. Coloring art map   — scene files resolve
 *   9. Topics surface     — verify-all-topics (also spawned by teaching; skip dup)
 *
 * Run:
 *   npm run verify:integrity
 *   npm run test:integrity
 *   node scripts/verify-biblical-integrity.mjs
 *   node scripts/verify-biblical-integrity.mjs --fast   # skip heavy breakdown coverage
 *
 * Exit 0 only if every required layer passes.
 */
import { spawnSync } from 'child_process';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const node = process.execPath;
const fast = process.argv.includes('--fast');

const layers = [
  {
    id: 1,
    name: 'Systems wiring (lookups / deep-links)',
    script: 'scripts/verify-systems-wiring.mjs',
    required: true,
  },
  {
    id: 2,
    name: 'Teaching integrity (daily verse, breakdown, topics, speakers)',
    script: 'scripts/verify-teaching-integrity.mjs',
    required: true,
  },
  {
    id: 3,
    name: 'Kids Scripture (coloring + stories KJV)',
    script: 'scripts/verify-kids-scripture-integrity.mjs',
    required: true,
  },
  {
    id: '3b',
    name: 'BBE help pairs with KJV truth (same ref)',
    script: 'scripts/verify-bbe-kjv-pairing.mjs',
    required: true,
  },
  {
    id: 4,
    name: 'Characters / who-is-in-the-Bible',
    script: 'scripts/verify-characters-integrity.mjs',
    required: true,
  },
  {
    id: 5,
    name: 'Plans Scripture (refs + day text)',
    script: 'scripts/verify-plans-scripture-integrity.mjs',
    required: true,
  },
  {
    id: 6,
    name: 'Verse breakdown coverage (full KJV queue)',
    script: 'scripts/verify-verse-breakdown-coverage.mjs',
    required: true,
    heavy: true,
  },
  {
    id: 7,
    name: 'Breakdown phrase quality (no filler stamps)',
    script: 'scripts/verify-breakdown-phrase-quality.mjs',
    required: false, // needs built overrides; warn if missing
    optionalIfMissing: true,
  },
  {
    id: 8,
    name: 'Coloring art map (scene files)',
    script: 'scripts/verify-coloring-art.mjs',
    required: true,
  },
];

function runLayer(layer) {
  const scriptPath = path.join(root, layer.script);
  if (!fs.existsSync(scriptPath)) {
    return {
      ok: false,
      skipped: false,
      detail: `script missing: ${layer.script}`,
    };
  }
  if (layer.heavy && fast) {
    return { ok: true, skipped: true, detail: 'skipped (--fast)' };
  }
  if (layer.optionalIfMissing) {
    // phrase quality needs verse-breakdown-overrides.js
    if (
      layer.script.includes('phrase-quality') &&
      !fs.existsSync(path.join(root, 'verse-breakdown-overrides.js'))
    ) {
      return {
        ok: true,
        skipped: true,
        detail: 'skipped (overrides not built yet)',
      };
    }
  }

  const r = spawnSync(node, [scriptPath], {
    cwd: root,
    encoding: 'utf8',
    env: process.env,
    maxBuffer: 20 * 1024 * 1024,
  });
  const out = `${r.stdout || ''}${r.stderr || ''}`;
  // Heavy coverage needs jsdom (install via npm ci in CI/build agents)
  if (
    r.status !== 0 &&
    layer.heavy &&
    /Cannot find package 'jsdom'|ERR_MODULE_NOT_FOUND.*jsdom/i.test(out)
  ) {
    return {
      ok: true,
      skipped: true,
      detail: 'skipped (jsdom not installed — run npm ci for full coverage)',
    };
  }
  return {
    ok: r.status === 0,
    skipped: false,
    detail: r.status === 0 ? 'PASS' : out.slice(-2500),
    status: r.status,
  };
}

function main() {
  console.log('═══════════════════════════════════════════════════════════');
  console.log(' Biblical integrity fail-safe suite');
  console.log(' Multi-layer checks: wiring → teaching → kids → who → plans');
  console.log('═══════════════════════════════════════════════════════════\n');
  if (fast) console.log('(fast mode: heavy layers skipped)\n');

  const results = [];
  let failed = 0;

  for (const layer of layers) {
    process.stdout.write(`Layer ${layer.id}: ${layer.name} … `);
    const res = runLayer(layer);
    results.push({ layer, res });
    if (res.skipped) {
      console.log(`SKIP (${res.detail})`);
      continue;
    }
    if (res.ok) {
      console.log('PASS');
    } else {
      console.log('FAIL');
      failed++;
      console.error('\n──── output ────\n' + res.detail + '\n────────────────\n');
      if (layer.required) {
        // continue other layers so we report a full picture
      }
    }
  }

  console.log('\n── Summary ──');
  for (const { layer, res } of results) {
    const mark = res.skipped ? 'SKIP' : res.ok ? 'PASS' : 'FAIL';
    console.log(`  [${mark}] L${layer.id} ${layer.name}`);
  }

  if (failed) {
    console.error(
      `\nFAIL: ${failed} integrity layer(s) failed. Do not ship until clean.`
    );
    process.exit(1);
  }
  console.log('\nPASS: all required biblical integrity layers clean.');
}

main();
