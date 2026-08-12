#!/usr/bin/env node
/**
 * Build kids/coloring-scene-art-map.json — maps placeholder SVG scene paths
 * to real line-art JPG/PNG when those assets exist on disk.
 *
 * Priority per scene:
 *   1. Matching panel file  (story-s1.jpg / .png)
 *   2. Story hero full-page (when the SVG is still a thin placeholder)
 *   3. Keep the SVG (detailed hand-drawn or last-resort placeholder)
 *
 * Run: node scripts/build-coloring-scene-map.mjs
 * Then: node scripts/inject-coloring-scene-map.mjs  (embeds into color-and-tell.js)
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const cp = path.join(root, 'coloring-pages');
const catPath = path.join(root, 'kids', 'color-and-tell.js');
const outPath = path.join(root, 'kids', 'coloring-scene-art-map.json');

/**
 * Full-page line art for multi-panel stories.
 * Named overrides first; any other `{prefix}.jpg` on disk is auto-discovered
 * when the panel SVG is still a thin placeholder.
 *
 * FORCE_HERO: always use this full-page art even when detailed multi-panel
 * SVGs exist (featured doors that should match the classic coloring-book look).
 */
const HERO = {
  'daniel-lions': 'bible-stories/daniel-in-the-lions-den-coloring-page.jpg',
  creation: 'bible-stories/creation-six-days-coloring-page.jpg',
  david: 'bible-stories/david-and-goliath-v2.jpg',
  'jesus-children': 'bible-stories/jesus-and-the-children-coloring-page.jpg',
  'empty-tomb': 'bible-stories/empty-tomb-coloring-page.jpg',
  jonah: 'jonah-and-the-great-fish.jpg',
  noah: 'noahs-ark.jpg',
  'feeding-5000': 'feeding-of-the-five-thousand.jpg',
  'moses-red-sea': 'moses-and-the-red-sea.jpg',
  'jesus-storm': 'jesus-calms-the-storm.jpg',
  'good-samaritan': 'good-samaritan.jpg',
  nativity: 'nativity.jpg',
  'prodigal-son': 'prodigal-son.jpg',
};

/** Always prefer full-page hero over multi-panel detailed SVGs. */
const FORCE_HERO = new Set(['creation', 'jesus-children', 'empty-tomb', 'david']);

/** Resolve hero art for a story prefix: explicit HERO map, else `{prefix}.jpg`. */
function heroFor(prefix) {
  if (HERO[prefix] && existsGood(HERO[prefix])) return HERO[prefix];
  const auto = prefix + '.jpg';
  if (existsGood(auto)) return auto;
  return null;
}

function existsGood(rel) {
  const p = path.join(cp, rel);
  try {
    return fs.statSync(p).size > 10000;
  } catch {
    return false;
  }
}

function fileSize(rel) {
  try {
    return fs.statSync(path.join(cp, rel)).size;
  } catch {
    return 0;
  }
}

const text = fs.readFileSync(catPath, 'utf8');
const srcs = [...text.matchAll(/src:\s*'(\/coloring-pages\/[^']+)'/g)].map((m) => m[1]);
const ordered = [];
const seen = new Set();
for (const s of srcs) {
  if (!seen.has(s)) {
    seen.add(s);
    ordered.push(s);
  }
}

const mapping = {};
for (const svgUrl of ordered) {
  const rel = svgUrl.slice('/coloring-pages/'.length);
  const stem = path.basename(rel, path.extname(rel));
  const m = stem.match(/^(.+)-s(\d+)$/);
  const prefix = m ? m[1] : stem;

  let chosen = null;
  for (const ext of ['.jpg', '.jpeg', '.png', '.webp']) {
    const cand = stem + ext;
    if (existsGood(cand)) {
      chosen = '/coloring-pages/' + cand;
      break;
    }
  }
  if (!chosen) {
    const hero = heroFor(prefix);
    // Force full-page heroes for featured doors; otherwise only replace thin placeholders.
    if (hero && (FORCE_HERO.has(prefix) || fileSize(rel) < 2500)) {
      chosen = '/coloring-pages/' + hero;
    }
  }
  if (chosen) mapping[svgUrl] = chosen;
}

// Prefer panel raster over detailed SVG whenever a real JPG/PNG exists.
for (const svgUrl of ordered) {
  const rel = svgUrl.slice('/coloring-pages/'.length);
  const stem = path.basename(rel, path.extname(rel));
  for (const ext of ['.jpg', '.jpeg', '.png']) {
    const cand = stem + ext;
    if (existsGood(cand)) {
      mapping[svgUrl] = '/coloring-pages/' + cand;
      break;
    }
  }
}

fs.writeFileSync(outPath, JSON.stringify(mapping, null, 2) + '\n');

let stillPlaceholder = 0;
for (const s of ordered) {
  const final = mapping[s] || s;
  if (final.endsWith('.svg')) {
    const rel = final.slice('/coloring-pages/'.length);
    if (fileSize(rel) < 2500) stillPlaceholder += 1;
  }
}

console.log(`build-coloring-scene-map: ${Object.keys(mapping).length} overrides → ${path.relative(root, outPath)}`);
console.log(`  total scenes: ${ordered.length}`);
console.log(`  good art: ${ordered.length - stillPlaceholder}`);
console.log(`  still placeholder: ${stillPlaceholder}`);
