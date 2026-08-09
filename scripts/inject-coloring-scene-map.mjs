#!/usr/bin/env node
/**
 * Embed kids/coloring-scene-art-map.json into kids/color-and-tell.js
 * between // TDB_SCENE_ART_START and // TDB_SCENE_ART_END markers.
 *
 * Run after build-coloring-scene-map.mjs:
 *   node scripts/build-coloring-scene-map.mjs && node scripts/inject-coloring-scene-map.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const mapPath = path.join(root, 'kids', 'coloring-scene-art-map.json');
const catPath = path.join(root, 'kids', 'color-and-tell.js');

const START = '// TDB_SCENE_ART_START';
const END = '// TDB_SCENE_ART_END';

if (!fs.existsSync(mapPath)) {
  console.error('inject-coloring-scene-map: missing', mapPath);
  console.error('Run: node scripts/build-coloring-scene-map.mjs first');
  process.exit(1);
}

const map = JSON.parse(fs.readFileSync(mapPath, 'utf8'));
const mapJs = JSON.stringify(map, null, 2);
const block =
  START +
  '\n' +
  '  var TDB_SCENE_ART = ' +
  mapJs +
  ';\n' +
  '  ' +
  END;

let src = fs.readFileSync(catPath, 'utf8');
const startIdx = src.indexOf(START);
const endIdx = src.indexOf(END);
if (startIdx < 0 || endIdx < 0 || endIdx < startIdx) {
  console.error('inject-coloring-scene-map: markers not found in color-and-tell.js');
  process.exit(1);
}

const before = src.slice(0, startIdx);
const after = src.slice(endIdx + END.length);
// Drop leading newline after END if present so we don't double blank lines
const afterTrim = after.replace(/^\r?\n/, '\n');
src = before + block + afterTrim;
fs.writeFileSync(catPath, src);

console.log(
  `inject-coloring-scene-map: embedded ${Object.keys(map).length} overrides into kids/color-and-tell.js`
);
