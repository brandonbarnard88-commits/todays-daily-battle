/**
 * Add about/to context to hero-daily-365-explanations.js from verse-context resolver.
 * Usage: node scripts/enrich-hero-365-context.mjs
 */
import fs from 'fs/promises';
import path from 'path';
import vm from 'vm';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const explanationsPath = path.join(root, 'hero-daily-365-explanations.js');
const contextPath = path.join(root, 'verse-context.js');

async function loadResolver() {
  const code = await fs.readFile(contextPath, 'utf8');
  const sandbox = { console };
  sandbox.window = sandbox;
  sandbox.globalThis = sandbox;
  vm.runInNewContext(code, sandbox, { filename: 'verse-context.js' });
  if (typeof sandbox.TDB_resolveVerseContext !== 'function') {
    throw new Error('TDB_resolveVerseContext missing after loading verse-context.js');
  }
  return sandbox.TDB_resolveVerseContext;
}

function extractArrayLiteral(src) {
  const marker = 'global.__TDB_HERO_DAILY_EXPLANATIONS = ';
  const start = src.indexOf(marker);
  if (start < 0) throw new Error('explanations array marker not found');
  const bracket = src.indexOf('[', start);
  let depth = 0;
  let end = -1;
  for (let i = bracket; i < src.length; i++) {
    const ch = src[i];
    if (ch === '[') depth += 1;
    else if (ch === ']') {
      depth -= 1;
      if (depth === 0) {
        end = i + 1;
        break;
      }
    }
  }
  if (end < 0) throw new Error('could not find end of explanations array');
  return { before: src.slice(0, bracket), arraySrc: src.slice(bracket, end), after: src.slice(end) };
}

async function main() {
  const resolve = await loadResolver();
  const src = await fs.readFile(explanationsPath, 'utf8');
  const parts = extractArrayLiteral(src);
  const list = JSON.parse(parts.arraySrc);
  let filled = 0;
  const enriched = list.map((row) => {
    const ctx = resolve(row.ref) || {};
    const about = String(row.about || '').trim() || String(ctx.about || '').trim();
    const to = String(row.to || '').trim() || String(ctx.to || '').trim();
    const existingSetting = String(row.setting || '').trim();
    const setting = existingSetting.length >= 24 ? existingSetting : String(ctx.setting || '').trim();
    if (about && to) filled += 1;
    const out = {
      ref: row.ref,
      text: row.text,
      plain: row.plain,
      step: row.step,
      about,
      to
    };
    if (setting) out.setting = setting;
    if (row.prayer) out.prayer = String(row.prayer).trim();
    return out;
  });
  const header = `/**
 * High-quality plain meaning + one step for each of the 365 hero daily verses.
 * Built for Grove first-paint (anxious night visitor). Not bulk stamp text.
 * Free forever — explanations never gated.
 * Four pillars (2026-08): verse-grounded plains, varied steps.
 * Context (2026-08): about/to from verse-context cascade (range → chapter → book).
 */
(function (global) {
  'use strict';
  global.__TDB_HERO_DAILY_EXPLANATIONS = `;
  const footer = `;
  global.TDB_GET_HERO_DAY_EXPLANATION = function (dayIndex) {
    var list = global.__TDB_HERO_DAILY_EXPLANATIONS || [];
    if (!list.length) return null;
    var i = ((Number(dayIndex) % list.length) + list.length) % list.length;
    return list[i] || null;
  };
  global.TDB_GET_HERO_EXPLANATION_BY_REF = function (ref) {
    var list = global.__TDB_HERO_DAILY_EXPLANATIONS || [];
    var r = String(ref || '').replace(/\\s+/g, ' ').replace(/^Psalms\\s+/i, 'Psalm ').trim();
    for (var j = 0; j < list.length; j++) {
      var lr = String(list[j].ref || '').replace(/\\s+/g, ' ').replace(/^Psalms\\s+/i, 'Psalm ').trim();
      if (lr === r) return list[j];
    }
    return null;
  };
  try {
    if (typeof global.TDB_registerVerseContextMap === 'function') {
      var map = Object.create(null);
      (global.__TDB_HERO_DAILY_EXPLANATIONS || []).forEach(function (row) {
        if (!row || !row.ref || !row.about || !row.to) return;
        map[row.ref] = { about: row.about, to: row.to, setting: row.setting || '' };
      });
      global.TDB_registerVerseContextMap(map);
    }
  } catch (eReg) { /* non-fatal */ }
})(typeof window !== 'undefined' ? window : globalThis);
`;
  const out = header + JSON.stringify(enriched, null, 2) + footer;
  await fs.writeFile(explanationsPath, out, 'utf8');
  console.log('enrich-hero-365-context: filled', filled, '/', enriched.length);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
