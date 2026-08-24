#!/usr/bin/env node
/**
 * Fail-safe layer: Plans Scripture integrity
 *
 * Every plan day `ref` in shared battle data (and weary/season packs when present)
 * must resolve to real KJV text — no empty or invented references.
 *
 * Run: node scripts/verify-plans-scripture-integrity.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { loadKjvFull, resolveKjvText } from './lib/kjv-ref-utils.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const failures = [];

function fail(msg) {
  failures.push(msg);
}

function collectRefsFromJson(obj, acc = []) {
  if (!obj || typeof obj !== 'object') return acc;
  if (typeof obj.ref === 'string' && obj.ref.trim()) {
    acc.push({ ref: obj.ref.trim(), text: obj.text || '' });
  }
  if (Array.isArray(obj)) {
    for (const item of obj) collectRefsFromJson(item, acc);
  } else {
    for (const v of Object.values(obj)) collectRefsFromJson(v, acc);
  }
  return acc;
}

function auditFile(kjv, rel) {
  const p = path.join(root, rel);
  if (!fs.existsSync(p)) {
    fail(`missing plans data: ${rel}`);
    return 0;
  }
  const raw = fs.readFileSync(p, 'utf8');
  let data;
  try {
    data = JSON.parse(raw);
  } catch {
    // plans-data.js embeds JSON string — skip non-json
    return 0;
  }
  const rows = collectRefsFromJson(data);
  let ok = 0;
  for (const row of rows) {
    const resolved = resolveKjvText(kjv, row.ref);
    if (!resolved) {
      fail(`${rel}: plan ref not in KJV: ${row.ref}`);
      continue;
    }
    ok++;
    // If day includes full text, it must match KJV (allow range join)
    if (row.text && row.text.length > 40) {
      const a = row.text.toLowerCase().replace(/[^a-z0-9\s]/g, ' ').replace(/\s+/g, ' ');
      const b = resolved.text.toLowerCase().replace(/[^a-z0-9\s]/g, ' ').replace(/\s+/g, ' ');
      // first 30 alpha words of plan text should appear heavily in kjv
      const words = a.split(' ').filter((w) => w.length > 3).slice(0, 12);
      if (words.length >= 6) {
        const hits = words.filter((w) => b.includes(w)).length;
        if (hits / words.length < 0.5) {
          fail(`${rel}: plan text for ${row.ref} does not match KJV wording`);
        }
      }
    }
  }
  return ok;
}

function auditPlansDataJs(kjv) {
  // Embedded JSON in plans-data.js
  const p = path.join(root, 'plans-data.js');
  if (!fs.existsSync(p)) return 0;
  const src = fs.readFileSync(p, 'utf8');
  const m = src.match(/JSON\.parse\("([\s\S]+?)"\)\s*;/);
  if (!m) return 0;
  let jsonStr;
  try {
    jsonStr = JSON.parse(`"${m[1]}"`);
  } catch {
    // already escaped content inside parse("...")
    try {
      jsonStr = eval(`"${m[1]}"`); // last resort for the generated escape form
    } catch {
      return 0;
    }
  }
  let data;
  try {
    data = typeof jsonStr === 'string' ? JSON.parse(jsonStr) : jsonStr;
  } catch {
    return 0;
  }
  const rows = collectRefsFromJson(data);
  let ok = 0;
  for (const row of rows) {
    if (!resolveKjvText(kjv, row.ref)) fail(`plans-data.js ref not in KJV: ${row.ref}`);
    else ok++;
  }
  return ok;
}

function main() {
  console.log('Plans Scripture integrity (fail-safe layer)\n');
  const kjv = loadKjvFull(root);

  let total = 0;
  total += auditFile(kjv, 'data/plans-battle-shared.json');
  // optional season packs
  for (const rel of [
    'data/plans-weary-season.json',
    'data/weary-season-plans.json',
  ]) {
    if (fs.existsSync(path.join(root, rel))) total += auditFile(kjv, rel);
  }
  total += auditPlansDataJs(kjv);

  // Catalog lives in plans-app.js (was inline in plans.html)
  const plansApp = path.join(root, 'plans-app.js');
  const plansHtml = path.join(root, 'plans.html');
  const catalogSrc = fs.existsSync(plansApp)
    ? fs.readFileSync(plansApp, 'utf8')
    : (fs.existsSync(plansHtml) ? fs.readFileSync(plansHtml, 'utf8') : '');
  if (catalogSrc) {
    const refs = [...catalogSrc.matchAll(/ref:\s*['"]([^'"]+\d+:\d+[^'"]*)['"]/g)].map((m) => m[1]);
    let sample = 0;
    for (const ref of refs.slice(0, 80)) {
      // Multi-ref: resolveKjvText handles "Romans 3:23; 6:23" book inheritance
      if (!resolveKjvText(kjv, ref)) fail(`plans-app.js ref not in KJV: ${ref}`);
      else sample++;
    }
    total += sample;
  }

  if (total < 50) fail(`plans integrity: too few refs validated (${total})`);

  if (failures.length) {
    console.error(`FAIL: ${failures.length} plans Scripture issue(s):\n`);
    failures.forEach((f, i) => console.error(`  ${i + 1}. ${f}`));
    process.exit(1);
  }
  console.log(`PASS: plans Scripture integrity clean (${total} refs checked).`);
}

main();
