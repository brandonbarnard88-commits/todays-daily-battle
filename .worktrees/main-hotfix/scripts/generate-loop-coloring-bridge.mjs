/**
 * Builds kids/loop-library-coloring.js — maps Bible Story Library keys that appear
 * in loops.json to COLORING_OUTLINES keys (via OUTLINE_ALIAS fallbacks).
 *
 * Run: node scripts/generate-loop-coloring-bridge.mjs
 * Bump script ?v= in kids/corner.html when this output changes.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const LOOPS = path.join(ROOT, 'loops.json');
const CORNER = path.join(ROOT, 'kids', 'kids-corner.js');
const OUT = path.join(ROOT, 'kids', 'loop-library-coloring.js');

function extractOutlineKeys(js) {
  const start = js.indexOf('var COLORING_OUTLINES = (function () {');
  if (start < 0) throw new Error('COLORING_OUTLINES not found');
  const slice = js.slice(start, start + 400000);
  const re = /^\s{6}([a-zA-Z][a-zA-Z0-9]*):\s*svg\(/gm;
  const keys = new Set();
  let m;
  while ((m = re.exec(slice))) keys.add(m[1]);
  keys.delete('_default');
  return keys;
}

function extractOutlineAlias(js) {
  const m = /var OUTLINE_ALIAS = \{([\s\S]*?)\n  \};/m.exec(js);
  if (!m) throw new Error('OUTLINE_ALIAS not found');
  const body = m[1];
  const alias = {};
  const lineRe = /^\s*([a-zA-Z][a-zA-Z0-9]*):\s*'([a-zA-Z][a-zA-Z0-9]*)'/gm;
  let lm;
  while ((lm = lineRe.exec(body))) {
    alias[lm[1]] = lm[2];
  }
  return alias;
}

function resolveOutlineKey(libraryKey, alias, valid) {
  var seen = Object.create(null);
  var k = libraryKey;
  for (var i = 0; i < 30 && k; i++) {
    if (valid.has(k)) return k;
    if (seen[k]) break;
    seen[k] = true;
    k = alias[k] || '';
  }
  return '';
}

function main() {
  const loops = JSON.parse(fs.readFileSync(LOOPS, 'utf8'));
  const cornerJs = fs.readFileSync(CORNER, 'utf8');
  const valid = extractOutlineKeys(cornerJs);
  const alias = extractOutlineAlias(cornerJs);

  const byLib = {};
  for (var i = 0; i < loops.length; i++) {
    var L = loops[i].libraryKey;
    if (!L || typeof L !== 'string') continue;
    if (byLib[L]) continue;
    var outline = resolveOutlineKey(L, alias, valid);
    if (outline) byLib[L] = outline;
  }

  /** Keys not present in loops.json but needed for deep links / alternate story keys. */
  var EXTRA_LIB_TO_OUTLINE = { jesusAndChildren: 'jesusBlessKids', jesusAndZacchaeus: 'zacchaeus' };
  var ek = Object.keys(EXTRA_LIB_TO_OUTLINE);
  for (var ei = 0; ei < ek.length; ei++) {
    var lk = ek[ei];
    var ov = EXTRA_LIB_TO_OUTLINE[lk];
    if (!byLib[lk] && valid.has(ov)) byLib[lk] = ov;
  }

  var keys = Object.keys(byLib).sort();
  var lines = keys.map(function (k) {
    return '  ' + JSON.stringify(k) + ': ' + JSON.stringify(byLib[k]);
  });

  var out =
    '/**\n' +
    ' * Auto-generated from loops.json + OUTLINE_ALIAS in kids-corner.js.\n' +
    ' * Regenerate: node scripts/generate-loop-coloring-bridge.mjs\n' +
    ' */\n' +
    '(function (g) {\n' +
    "  'use strict';\n" +
    '  g.TDB_LOOP_COLORING_OUTLINE = {\n' +
    lines.join(',\n') +
    '\n  };\n' +
    '})(typeof window !== "undefined" ? window : globalThis);\n';

  fs.writeFileSync(OUT, out, 'utf8');
  console.log('generate-loop-coloring-bridge:', keys.length, 'library keys → outline, wrote', path.relative(ROOT, OUT));
}

main();
