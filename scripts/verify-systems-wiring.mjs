#!/usr/bin/env node
/**
 * Systems wiring check — static “circuit” audit for deep-links, lookup maps,
 * critical assets, and story-id bridges (Color & Tell + Story Library).
 *
 * Catches the class of bugs found in the full-site wiring audit:
 *   - dead hash targets (#topics)
 *   - missing kids panel art
 *   - corner.html?story= / coloring.html?story= that do not resolve
 *   - wrong Story Library aliases (e.g. good-shepherd → wrong card)
 *   - TDB_SCENE_ART map targets missing on disk
 *
 * Run: node scripts/verify-systems-wiring.mjs
 *      npm run test:systems
 *      npm run verify:systems
 *
 * Reads source (not dist/). Exit 0 only when all circuits pass.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');

const errors = [];
const warnings = [];

function rel(p) {
  return path.relative(root, p);
}

function exists(relPath) {
  return fs.existsSync(path.join(root, relPath.replace(/^\//, '')));
}

function read(relPath) {
  const p = path.join(root, relPath);
  if (!fs.existsSync(p)) {
    errors.push(`missing file: ${relPath}`);
    return '';
  }
  return fs.readFileSync(p, 'utf8');
}

function walkFiles(dir, acc = [], exts = new Set(['.html', '.js', '.mjs'])) {
  let entries;
  try {
    entries = fs.readdirSync(dir, { withFileTypes: true });
  } catch {
    return acc;
  }
  for (const e of entries) {
    if (['node_modules', '.git', 'dist', 'next-app', '.cache', 'coverage'].includes(e.name)) {
      continue;
    }
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walkFiles(p, acc, exts);
    else if (exts.has(path.extname(e.name))) acc.push(p);
  }
  return acc;
}

function extractBalancedObject(src, startNeedle) {
  const start = src.indexOf(startNeedle);
  if (start < 0) return null;
  const brace = src.indexOf('{', start);
  if (brace < 0) return null;
  let depth = 0;
  for (let i = brace; i < src.length; i++) {
    const ch = src[i];
    if (ch === '{') depth++;
    else if (ch === '}') {
      depth--;
      if (depth === 0) return src.slice(brace + 1, i);
    }
  }
  return null;
}

/** Parse JS object body key: 'value' | "key": "value" | bareKey: 'value' */
function parseStringMap(body) {
  const map = Object.create(null);
  if (!body) return map;
  const re = /(?:['"]([^'"]+)['"]|([a-zA-Z_][a-zA-Z0-9_-]*))\s*:\s*['"]([^'"]+)['"]/g;
  let m;
  while ((m = re.exec(body))) {
    const key = m[1] || m[2];
    map[key] = m[3];
  }
  return map;
}

// —— 1. Critical pages present ——
function checkCriticalPages() {
  const pages = [
    'index.html',
    'explore.html',
    'coloring.html',
    'kids/corner.html',
    'kids/index.html',
    'kids-corner.html',
    'little-ones.html',
    'family.html',
    'plans.html',
    'verse.html',
  ];
  for (const p of pages) {
    if (!exists(p)) errors.push(`critical page missing: ${p}`);
  }
}

// —— 2. Hash targets: every #fragment on same-page or explore must exist ——
function checkExploreTopicsHash() {
  const explore = read('explore.html');
  const ids = new Set();
  for (const m of explore.matchAll(/\bid=["']([^"']+)["']/g)) ids.add(m[1]);

  // Sitewide links to explore.html#topics (or /explore.html#topics)
  let topicsLinkCount = 0;
  for (const file of walkFiles(root)) {
    const t = fs.readFileSync(file, 'utf8');
    const n = (t.match(/(?:explore\.html|#)\/?explore\.html#topics\b|href=["']\/explore\.html#topics["']|href=["']explore\.html#topics["']|#topics\b/g) || []).length;
    // Count only explicit explore#topics or bare #topics on explore page refs
    const exploreTopics = (t.match(/explore\.html#topics\b/g) || []).length;
    topicsLinkCount += exploreTopics;
  }

  if (topicsLinkCount > 0 && !ids.has('topics')) {
    errors.push(
      `explore.html missing id="topics" but ${topicsLinkCount} link(s) use explore.html#topics ` +
        `(has: ${['topics-en', 'topics-es'].filter((x) => ids.has(x)).join(', ') || 'no topics-* ids'})`
    );
  }

  // Self-check explore internal #topics
  if (/href=["']#topics["']/.test(explore) && !ids.has('topics')) {
    errors.push('explore.html links to #topics but has no id="topics"');
  }
}

// —— 3. Absolute asset refs on key hub pages ——
function checkHubAssets() {
  const hubs = ['kids-corner.html', 'coloring.html', 'little-ones.html', 'kids/corner.html', 'kids/index.html'];
  for (const page of hubs) {
    if (!exists(page)) continue;
    // Strip comments so optional/pre-upload examples do not fail the gate
    const t = read(page)
      .replace(/<!--[\s\S]*?-->/g, '')
      .replace(/\/\*[\s\S]*?\*\//g, '');
    const pageDir = path.dirname(path.join(root, page));
    for (const m of t.matchAll(/(?:src|href)=["']([^"'#?]+(?:\?[^"']*)?)["']/g)) {
      let ref = m[1];
      if (/^(https?:|\/\/|data:|mailto:|tel:)/i.test(ref)) continue;
      ref = ref.split('?')[0];
      if (!ref || ref.endsWith('/')) continue;
      // Scripts + styles always required; images only when not marked optional in path
      if (!/\.(js|css|svg|png|jpe?g|webp|json|woff2?)$/i.test(ref)) continue;
      let abs;
      if (ref.startsWith('/')) abs = path.join(root, ref.slice(1));
      else abs = path.normalize(path.join(pageDir, ref));
      if (!fs.existsSync(abs)) {
        errors.push(`${page}: missing asset ${ref} (resolved ${rel(abs)})`);
      }
    }
  }
}

// —— 4. Known broken asset from audit ——
function checkKnownAssets() {
  const mustExist = [
    // If kids-corner references panel-storm, file must exist (checked via hub scan);
    // also assert the path we fixed for:
  ];
  const kidsCorner = exists('kids-corner.html') ? read('kids-corner.html') : '';
  if (kidsCorner.includes('panel-storm')) {
    /* stick panels removed */
  }
  for (const p of mustExist) {
    if (!exists(p)) errors.push(`required asset missing: ${p}`);
  }
}

// —— 5. Color & Tell: STORIES + aliases + site deep-links ——
function checkColorAndTellWiring() {
  const src = read('kids/color-and-tell.js');
  if (!src) return;

  const storyIds = [...src.matchAll(/\{\s*id:\s*'([a-z0-9-]+)'\s*,\s*\n\s*title:/g)].map((m) => m[1]);
  const storySet = new Set(storyIds);
  if (storyIds.length < 20) {
    errors.push(`color-and-tell STORIES suspiciously small (${storyIds.length})`);
  }

  const aliasBody = extractBalancedObject(src, 'var STORY_QUERY_ALIASES');
  const aliases = parseStringMap(aliasBody);
  for (const [from, to] of Object.entries(aliases)) {
    if (!storySet.has(to)) {
      errors.push(`STORY_QUERY_ALIASES ${from} → ${to} (target not a STORIES id)`);
    }
  }

  function normalizeStoryQuery(raw) {
    if (!raw) return '';
    const val = String(raw).trim().toLowerCase();
    if (!val) return '';
    if (aliases[val]) return aliases[val];
    const compact = val.replace(/[^a-z0-9]+/g, '');
    if (aliases[compact]) return aliases[compact];
    if (storySet.has(val)) return val;
    for (const id of storyIds) {
      if (id.replace(/[^a-z0-9]+/g, '') === compact) return id;
    }
    return '';
  }

  // Critical aliases that must work (user-facing short names)
  const mustAlias = {
    jesus: 'jesus-children',
    daniel: 'daniel-lions',
    resurrection: 'empty-tomb',
    storm: 'jesus-storm',
  };
  for (const [from, to] of Object.entries(mustAlias)) {
    const got = normalizeStoryQuery(from);
    if (got !== to) {
      errors.push(`coloring alias ${from} should resolve to ${to}, got '${got || '(empty)'}'`);
    }
  }

  // Sitewide coloring.html?story=
  const used = new Set();
  for (const file of walkFiles(root)) {
    const t = fs.readFileSync(file, 'utf8');
    for (const m of t.matchAll(/coloring\.html\?story=([a-zA-Z0-9_-]+)/g)) {
      used.add(m[1]);
    }
  }
  const bad = [];
  for (const param of used) {
    const id = normalizeStoryQuery(param);
    if (!id || !storySet.has(id)) bad.push(param);
  }
  if (bad.length) {
    errors.push(`coloring.html?story= does not resolve: ${bad.sort().join(', ')}`);
  }

  // TDB_SCENE_ART targets
  const mapBody = extractBalancedObject(src, 'TDB_SCENE_ART');
  if (mapBody) {
    const pairs = [...mapBody.matchAll(/"([^"]+)"\s*:\s*"([^"]+)"/g)];
    let missing = 0;
    const samples = [];
    for (const [, , to] of pairs) {
      if (!exists(to.replace(/^\//, ''))) {
        missing++;
        if (samples.length < 8) samples.push(to);
      }
    }
    if (missing) {
      errors.push(`TDB_SCENE_ART missing ${missing} target file(s): ${samples.join(', ')}`);
    }
  } else {
    warnings.push('TDB_SCENE_ART map not found (skip target check)');
  }
}

// —— 6. Story Library (kids-battle + kids-corner resolveStoryKey) ——
function extractBibleStoryKeys(battleSrc) {
  const keys = new Set();
  // Prefer published key list when present
  const listMatch = battleSrc.match(
    /TDB_BIBLE_STORY_KEYS\s*=\s*Object\.keys\(\s*bibleStories\s*\)/
  );
  // Object keys that look like story cards (title / kjvRef / kidContext nearby)
  for (const m of battleSrc.matchAll(
    /\n\s{2,8}([a-z][a-zA-Z0-9]+)\s*:\s*\{/g
  )) {
    const key = m[1];
    // Skip obvious non-story maps
    if (
      /^(if|for|while|switch|return|function|const|let|var|true|false|null|window|document)$/.test(
        key
      )
    ) {
      continue;
    }
    const slice = battleSrc.slice(m.index, m.index + 500);
    if (/title\s*:|kjvRef\s*:|kidContext\s*:|panels\s*:|keywords\s*:/.test(slice)) {
      keys.add(key);
    }
  }
  // Legacy aliases bibleStories.foo = bibleStories.bar
  for (const m of battleSrc.matchAll(/bibleStories\.([a-zA-Z0-9_]+)\s*=/g)) {
    keys.add(m[1]);
  }
  // Quiet unused
  void listMatch;
  return keys;
}

function extractResolveAliases(cornerSrc) {
  const fnStart = cornerSrc.indexOf('function resolveStoryKey');
  if (fnStart < 0) return Object.create(null);
  // aliases object inside function
  const slice = cornerSrc.slice(fnStart, fnStart + 8000);
  const body = extractBalancedObject(slice, 'var aliases =') || extractBalancedObject(slice, 'aliases =');
  return parseStringMap(body);
}

function resolveCornerStory(param, storyKeys, aliases) {
  if (!param || typeof param !== 'string') return null;
  const raw = param.trim();
  if (!raw) return null;
  if (storyKeys.has(raw)) return raw;
  const rawLower = raw.toLowerCase();
  if (aliases[rawLower] && storyKeys.has(aliases[rawLower])) return aliases[rawLower];
  const slug = rawLower.replace(/[^a-z0-9]/g, '');
  if (slug && aliases[slug] && storyKeys.has(aliases[slug])) return aliases[slug];
  for (const k of storyKeys) {
    if (k.toLowerCase() === rawLower) return k;
  }
  for (const k of storyKeys) {
    if (String(k).replace(/[^a-z0-9]/gi, '').toLowerCase() === slug) return k;
  }
  return null;
}

function checkStoryLibraryWiring() {
  const battle = read('kids/kids-battle.js');
  const corner = read('kids/kids-corner.js');
  if (!battle || !corner) return;

  const storyKeys = extractBibleStoryKeys(battle);
  if (storyKeys.size < 50) {
    errors.push(`bible story keys suspiciously small (${storyKeys.size})`);
  }

  const aliases = extractResolveAliases(corner);

  // Critical alias accuracy
  const expectAlias = {
    'good-shepherd': 'psalm23Shepherd',
    goodshepherd: 'psalm23Shepherd',
    storm: 'jesusCalmsStorm',
    'jesus-children': 'jesus',
  };
  for (const [from, to] of Object.entries(expectAlias)) {
    const got = aliases[from] || aliases[from.toLowerCase()];
    // storm may be a real key via bibleStories.storm =
    if (from === 'storm' && storyKeys.has('storm')) continue;
    if (from === 'storm' && storyKeys.has('jesusCalmsStorm') && !got) {
      // alias optional if key exists under another path — still require resolve
      continue;
    }
    if (got && got !== to) {
      errors.push(
        `resolveStoryKey alias '${from}' → '${got}' (expected '${to}' — wrong card risk)`
      );
    }
  }

  // Must-resolve deep links (from live site / audit)
  const mustResolve = [
    'jesus',
    'noah',
    'david',
    'jesusCalmsStorm',
    'psalm23Shepherd',
    'storm', // must alias or exist
    'doNotFearIsaiah41',
    'good-shepherd',
    'jesus-children',
    'davidGoliath',
  ];
  for (const param of mustResolve) {
    const resolved = resolveCornerStory(param, storyKeys, aliases);
    if (!resolved) {
      errors.push(`corner.html?story=${param} does not resolve to a bible story key`);
    }
  }

  // Sitewide corner.html?story=
  const used = new Set();
  for (const file of walkFiles(root)) {
    const t = fs.readFileSync(file, 'utf8');
    for (const m of t.matchAll(/corner\.html\?story=([a-zA-Z0-9_-]+)/g)) {
      used.add(m[1]);
    }
  }
  const bad = [];
  for (const param of used) {
    if (!resolveCornerStory(param, storyKeys, aliases)) bad.push(param);
  }
  if (bad.length) {
    errors.push(`corner.html?story= unresolved (${bad.length}): ${bad.sort().join(', ')}`);
  }
}

// —— 7. Color ↔ Library handoff targets ——
function checkHandoffs() {
  const cat = read('kids/color-and-tell.js');
  const battle = read('kids/kids-battle.js');
  const corner = read('kids/kids-corner.js');
  if (!cat) return;
  const storyKeys = extractBibleStoryKeys(battle);
  const aliases = extractResolveAliases(corner);
  const handoffBody = extractBalancedObject(cat, 'var STORY_RETURN_HANDOFFS');
  if (!handoffBody) return;
  for (const m of handoffBody.matchAll(/storyHref:\s*'([^']*corner\.html\?story=([^'&]+))'/g)) {
    const param = m[2];
    if (!resolveCornerStory(param, storyKeys, aliases)) {
      errors.push(`STORY_RETURN_HANDOFFS storyHref does not resolve: ${m[1]}`);
    }
  }
}

// —— main ——

// —— Gospel porch doors (mission: help people know Jesus) ——
function checkGospelPathMarkers() {
  const fs = read('first-steps.html');
  if (!/id=["']come-to-christ["']/.test(fs)) {
    errors.push('first-steps.html missing #come-to-christ gospel doorway');
  }
  if (!/John 3:16/.test(fs) || !/Romans 10:9/.test(fs) || !/Romans 10:13/.test(fs)) {
    errors.push('first-steps.html gospel doorway should include John 3:16 and Romans 10:9, 10:13 (KJV)');
  }
  if (!/data-bbe-ref=["']John 3:16["']/.test(fs)) {
    errors.push('first-steps.html should offer BBE for the same John 3:16 ref under KJV');
  }
  const calm = read('calm.html');
  if (!/calm-gospel-door|first-steps\.html#come-to-christ/.test(calm)) {
    errors.push('calm.html missing gentle gospel door to first-steps / salvation path');
  }
  const home = read('index.html');
  if (!/first-steps\.html#come-to-christ|first-steps\.html/.test(home) || !/roadtosalvation/.test(home)) {
    errors.push('index.html should soft-link first-steps and Road to Salvation for seekers');
  }
  const little = read('little-ones.html');
  if (!/littleOnesBbeSimple/.test(little)) {
    errors.push('little-ones.html should show optional BBE under daily KJV verse');
  }
}

function main() {
  checkCriticalPages();
  checkGospelPathMarkers();
  checkExploreTopicsHash();
  checkHubAssets();
  checkKnownAssets();
  checkColorAndTellWiring();
  checkStoryLibraryWiring();
  checkHandoffs();

  if (warnings.length) {
    console.log('verify-systems-wiring: warnings');
    for (const w of warnings) console.log('  WARN  ' + w);
  }

  if (errors.length) {
    console.error('verify-systems-wiring: FAILED (' + errors.length + ' issue(s))\n');
    for (const e of errors) console.error('  FAIL  ' + e);
    console.error('\nFix wiring before deploy. Run: npm run test:systems');
    process.exit(1);
  }

  console.log('verify-systems-wiring: OK (all circuits)');
}

main();
