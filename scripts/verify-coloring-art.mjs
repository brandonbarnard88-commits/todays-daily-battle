#!/usr/bin/env node
/**
 * Verify Color & Tell art is wired to the correct stories/scenes.
 *
 * Checks:
 *  1. Every STORIES scene resolves to a real file on disk
 *  2. No thin placeholder SVGs remain in the resolved path
 *  3. Embedded TDB_SCENE_ART matches kids/coloring-scene-art-map.json
 *  4. Scene file basename matches story id (or an explicit map override)
 *  5. kids/coloring-story-expectations.json rules for high-risk titles
 *  6. Optional SVG content heuristics (wrong drawing comments)
 *
 * Usage:
 *   node scripts/verify-coloring-art.mjs
 *   node scripts/verify-coloring-art.mjs --report
 *
 * Exit 0 = pass, 1 = fail.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const catPath = path.join(root, 'kids', 'color-and-tell.js');
const mapJsonPath = path.join(root, 'kids', 'coloring-scene-art-map.json');
const expectPath = path.join(root, 'kids', 'coloring-story-expectations.json');
const cp = path.join(root, 'coloring-pages');
const reportMode = process.argv.includes('--report');

const PLACEHOLDER_SVG_MAX = 2500;
const MIN_RASTER = 10000;

function fail(msg, list) {
  list.push(msg);
}

function parseStories(src) {
  const a = src.indexOf('var STORIES = [');
  const b = src.lastIndexOf('applyRealColoringArt()');
  if (a < 0 || b < 0) throw new Error('Could not locate STORIES in color-and-tell.js');
  const part = src.slice(a, b);
  const stories = [];
  const blocks = part.split(/\n    \{\n      id: '/).slice(1);
  for (const block of blocks) {
    const id = block.match(/^([^']+)'/)?.[1];
    const title = block.match(/title:\s*'((?:\\'|[^'])*)'/)?.[1]?.replace(/\\'/g, "'");
    const scenes = [];
    const re =
      /\{\s*\n\s*id:\s*'([^']+)'\s*,\s*\n\s*src:\s*'([^']+)'\s*,\s*\n\s*alt:\s*'((?:\\'|[^'])*)'/g;
    let m;
    while ((m = re.exec(block))) {
      scenes.push({
        id: m[1],
        src: m[2],
        alt: m[3].replace(/\\'/g, "'"),
      });
    }
    if (id && scenes.length) stories.push({ id, title: title || id, scenes });
  }
  return stories;
}

function parseEmbeddedMap(src) {
  const m = src.match(/var TDB_SCENE_ART = (\{[\s\S]*?\});\n  \/\/ TDB_SCENE_ART_END/);
  if (!m) throw new Error('Could not parse embedded TDB_SCENE_ART map');
  return JSON.parse(m[1]);
}

function diskPath(urlPath) {
  // /coloring-pages/foo.jpg → coloring-pages/foo.jpg
  return path.join(root, urlPath.replace(/^\//, ''));
}

function fileMeta(urlPath) {
  const p = diskPath(urlPath);
  try {
    const st = fs.statSync(p);
    return { exists: true, size: st.size, abs: p };
  } catch {
    return { exists: false, size: 0, abs: p };
  }
}

function isRaster(url) {
  return /\.(jpe?g|png|webp)(\?|$)/i.test(url);
}

function basenameTokens(url) {
  const base = path.basename(url).toLowerCase().replace(/\.(svg|jpe?g|png|webp)$/i, '');
  return base.split(/[-_.]+/).filter(Boolean);
}

function storyTokens(storyId) {
  return String(storyId)
    .toLowerCase()
    .split(/[-_]+/)
    .filter((t) => t.length > 1 && !/^\d+$/.test(t));
}

/** At least one meaningful story token should appear in the resolved art path. */
function pathRelatedToStory(storyId, resolvedUrl) {
  const sTok = storyTokens(storyId);
  const pTok = new Set(basenameTokens(resolvedUrl));
  // path may be bible-stories/foo — include full path segments
  const full = resolvedUrl.toLowerCase();
  for (const t of sTok) {
    if (pTok.has(t) || full.includes(t)) return true;
  }
  // known alias bridges
  const aliases = {
    david: ['goliath'],
    'daniel-lions': ['daniel', 'lions'],
    'jesus-children': ['jesus', 'children'],
    'empty-tomb': ['tomb'],
    'feeding-5000': ['feeding', '5000', 'five'],
    'moses-red-sea': ['moses', 'red', 'sea'],
    'll-honesty': ['honesty'],
    'll-commandments': ['commandments'],
  };
  for (const a of aliases[storyId] || []) {
    if (full.includes(a)) return true;
  }
  return false;
}

function main() {
  const errors = [];
  const warnings = [];
  const rows = [];

  if (!fs.existsSync(catPath)) {
    console.error('FAIL missing', catPath);
    process.exit(1);
  }

  const src = fs.readFileSync(catPath, 'utf8');
  const stories = parseStories(src);
  const embedded = parseEmbeddedMap(src);

  let diskMap = {};
  if (fs.existsSync(mapJsonPath)) {
    diskMap = JSON.parse(fs.readFileSync(mapJsonPath, 'utf8'));
  } else {
    fail('Missing kids/coloring-scene-art-map.json — run npm run build:coloring-art-map', errors);
  }

  // Map drift
  const embKeys = Object.keys(embedded).sort();
  const diskKeys = Object.keys(diskMap).sort();
  if (JSON.stringify(embKeys) !== JSON.stringify(diskKeys)) {
    fail(
      `Embedded TDB_SCENE_ART keys differ from coloring-scene-art-map.json (embedded ${embKeys.length} vs json ${diskKeys.length}). Run: npm run build:coloring-art-map`,
      errors
    );
  } else {
    for (const k of embKeys) {
      if (embedded[k] !== diskMap[k]) {
        fail(`Map drift for ${k}: embedded=${embedded[k]} json=${diskMap[k]}`, errors);
      }
    }
  }

  let expectations = { stories: {} };
  if (fs.existsSync(expectPath)) {
    expectations = JSON.parse(fs.readFileSync(expectPath, 'utf8'));
  }

  let placeholderCount = 0;
  let missingCount = 0;
  let mismatchCount = 0;

  for (const story of stories) {
    const exp = expectations.stories?.[story.id] || {};
    if (exp.titleMustInclude) {
      const title = (story.title || '').toLowerCase();
      for (const kw of exp.titleMustInclude) {
        if (!title.includes(String(kw).toLowerCase())) {
          fail(
            `Story "${story.id}" title "${story.title}" missing expected keyword "${kw}"`,
            errors
          );
        }
      }
    }

    for (const scene of story.scenes) {
      const resolved = embedded[scene.src] || scene.src;
      const meta = fileMeta(resolved);
      const kind = isRaster(resolved)
        ? 'raster'
        : meta.exists && meta.size < PLACEHOLDER_SVG_MAX
          ? 'placeholder'
          : 'svg';

      rows.push({
        story: story.id,
        title: story.title,
        scene: scene.id,
        declared: scene.src,
        resolved,
        kind,
        bytes: meta.size,
        alt: scene.alt,
      });

      if (!meta.exists) {
        missingCount++;
        fail(
          `[${story.id} s${scene.id}] missing file: ${resolved} (from ${scene.src})`,
          errors
        );
        continue;
      }

      if (kind === 'placeholder') {
        placeholderCount++;
        fail(
          `[${story.id} s${scene.id}] placeholder SVG still in use (${meta.size} bytes): ${resolved}`,
          errors
        );
      }

      if (kind === 'raster' && meta.size < MIN_RASTER) {
        fail(
          `[${story.id} s${scene.id}] raster too small (${meta.size} bytes): ${resolved}`,
          errors
        );
      }

      if (!pathRelatedToStory(story.id, resolved)) {
        mismatchCount++;
        fail(
          `[${story.id} s${scene.id}] resolved art does not look related to story id — "${resolved}" (title: ${story.title})`,
          errors
        );
      }

      // Explicit expectations
      if (exp.resolvedPathIncludesAny?.length) {
        const ok = exp.resolvedPathIncludesAny.some((k) =>
          resolved.toLowerCase().includes(String(k).toLowerCase())
        );
        if (!ok) {
          fail(
            `[${story.id} s${scene.id}] path must include one of [${exp.resolvedPathIncludesAny.join(', ')}] but got ${resolved}`,
            errors
          );
        }
      }
      if (exp.resolvedPathExcludes?.length) {
        for (const k of exp.resolvedPathExcludes) {
          if (resolved.toLowerCase().includes(String(k).toLowerCase())) {
            fail(
              `[${story.id} s${scene.id}] path must NOT include "${k}" but got ${resolved}`,
              errors
            );
          }
        }
      }

      // SVG content heuristics
      if (!isRaster(resolved) && exp.svgContentExcludes?.length) {
        const body = fs.readFileSync(meta.abs, 'utf8');
        for (const bad of exp.svgContentExcludes) {
          if (body.toLowerCase().includes(String(bad).toLowerCase())) {
            fail(
              `[${story.id} s${scene.id}] SVG content looks wrong for this story (found "${bad}"): ${resolved}`,
              errors
            );
          }
        }
      }

      // Scene basename vs story: declared src should use story id prefix (or known alias)
      const declaredBase = path.basename(scene.src);
      const prefix = declaredBase.replace(/-s\d+\.svg$/i, '').replace(/\.svg$/i, '');
      if (prefix !== story.id && !declaredBase.startsWith(story.id)) {
        // Allow when story id is alias of file prefix (daniel → daniel-lions files are story id daniel-lions)
        // Only warn when completely unrelated
        if (!story.id.includes(prefix.split('-')[0]) && !prefix.includes(story.id.split('-')[0])) {
          warnings.push(
            `[${story.id} s${scene.id}] declared src prefix "${prefix}" differs from story id "${story.id}" (${scene.src})`
          );
        }
      }
    }
  }

  // Orphan map keys not in STORIES
  const declaredSrcs = new Set();
  for (const s of stories) for (const sc of s.scenes) declaredSrcs.add(sc.src);
  for (const k of Object.keys(embedded)) {
    if (!declaredSrcs.has(k)) {
      warnings.push(`Map has unused key (not in STORIES): ${k}`);
    }
  }

  if (reportMode) {
    console.log('story\tscene\tkind\tbytes\tresolved\talt');
    for (const r of rows) {
      console.log(
        [r.story, r.scene, r.kind, r.bytes, r.resolved, JSON.stringify(r.alt)].join('\t')
      );
    }
    console.log('');
  }

  console.log(`Color & Tell art audit`);
  console.log(`  stories: ${stories.length}`);
  console.log(`  scenes:  ${rows.length}`);
  console.log(`  map keys: ${Object.keys(embedded).length}`);
  console.log(`  missing files: ${missingCount}`);
  console.log(`  placeholders: ${placeholderCount}`);
  console.log(`  path mismatches: ${mismatchCount}`);
  console.log(`  warnings: ${warnings.length}`);
  console.log(`  errors: ${errors.length}`);

  if (warnings.length) {
    console.log('\nWarnings:');
    for (const w of warnings.slice(0, 40)) console.log('  WARN', w);
    if (warnings.length > 40) console.log(`  ... +${warnings.length - 40} more`);
  }

  if (errors.length) {
    console.log('\nFailures:');
    for (const e of errors) console.log('  FAIL', e);
    console.log(
      '\nFix tips:\n  - npm run build:coloring-art-map\n  - put art at coloring-pages/{story-id}.jpg or {story-id}-sN.jpg\n  - add/adjust kids/coloring-story-expectations.json for special cases\n'
    );
    process.exit(1);
  }

  console.log('\nColoring art verification passed.');
}

try {
  main();
} catch (e) {
  console.error('FAIL', e.message || e);
  process.exit(1);
}
