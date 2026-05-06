#!/usr/bin/env node
import fs from 'fs';
import path from 'path';

const ROOT = process.cwd();
const MANIFEST_PATH = path.join(ROOT, 'story-assets-manifest.json');
const OUTPUT_DIR = path.join(ROOT, 'media', 'active-bible');
const FORCE = process.argv.includes('--force');

const PALETTES = [
  ['#0f172a', '#1d4ed8', '#a78bfa', '#fbbf24'],
  ['#1e1b4b', '#0f766e', '#22d3ee', '#f59e0b'],
  ['#111827', '#7c2d12', '#fb7185', '#fde68a'],
  ['#172554', '#0f766e', '#67e8f9', '#facc15'],
  ['#1f2937', '#4c1d95', '#a855f7', '#fcd34d'],
  ['#082f49', '#0c4a6e', '#38bdf8', '#fde68a'],
  ['#0b1022', '#1d3557', '#457b9d', '#a8dadc']
];

function fail(message) {
  console.error('[story-svg] ERROR:', message);
  process.exit(1);
}

function normalizeSlug(value) {
  return String(value || '')
    .toLowerCase()
    .trim()
    .replace(/_/g, '-')
    .replace(/[^a-z0-9-]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function hashText(value) {
  const str = String(value || '');
  let h = 0;
  for (let i = 0; i < str.length; i += 1) {
    h = ((h << 5) - h + str.charCodeAt(i)) | 0;
  }
  return Math.abs(h);
}

function clamp(n, min, max) {
  return Math.max(min, Math.min(max, n));
}

function pickPalette(slug) {
  const idx = hashText(slug) % PALETTES.length;
  return PALETTES[idx];
}

function sceneSeed(story) {
  const source = [
    story && story.story_key,
    story && story.title,
    story && story.reference,
    story && story.battle_theme,
    story && story.mentor
  ].join('|');
  return hashText(source);
}

function wavePath(seed, yBase, amp, segments) {
  const step = 1280 / segments;
  let d = `M 0 ${yBase}`;
  for (let i = 1; i <= segments; i += 1) {
    const jitter = ((seed >> (i % 16)) & 31) - 15;
    const y = clamp(yBase + jitter * amp * 0.08, 40, 670);
    const x = i * step;
    d += ` L ${x.toFixed(1)} ${y.toFixed(1)}`;
  }
  d += ' L 1280 720 L 0 720 Z';
  return d;
}

function symbolSet(story, seed) {
  const mentor = normalizeSlug(story && story.mentor);
  const tags = Array.isArray(story && story.tags) ? story.tags.map(normalizeSlug) : [];
  const has = (t) => tags.includes(normalizeSlug(t));

  const x1 = 220 + (seed % 120);
  const x2 = 1040 - (seed % 140);
  const y = 170 + (seed % 80);

  if (mentor === 'david' || has('courage') || has('fear')) {
    return `<path d="M ${x1} ${y} L ${x1 + 60} ${y + 28} L ${x1 + 140} ${y - 16}" stroke="rgba(255,255,255,.44)" stroke-width="6" fill="none" stroke-linecap="round"/>`;
  }
  if (mentor === 'moses' || has('deliverance') || has('calling')) {
    return `<path d="M ${x1} ${y + 36} L ${x1 + 30} ${y - 36} L ${x1 + 62} ${y + 36}" stroke="rgba(255,255,255,.38)" stroke-width="6" fill="none" stroke-linecap="round"/>`;
  }
  if (mentor === 'esther' || has('identity') || has('wisdom')) {
    return `<path d="M ${x1} ${y + 28} L ${x1 + 24} ${y - 30} L ${x1 + 48} ${y + 28}" stroke="rgba(255,255,255,.4)" stroke-width="5" fill="none"/><circle cx="${x1 + 24}" cy="${y - 36}" r="6" fill="rgba(255,255,255,.46)"/>`;
  }
  if (mentor === 'ruth' || has('family') || has('hope')) {
    return `<path d="M ${x1} ${y + 28} C ${x1 + 28} ${y - 28}, ${x1 + 58} ${y - 14}, ${x1 + 74} ${y + 24}" stroke="rgba(255,255,255,.36)" stroke-width="5" fill="none"/>`;
  }
  if (mentor === 'paul' || has('mission') || has('endurance')) {
    return `<path d="M ${x1} ${y + 10} L ${x1 + 92} ${y + 10}" stroke="rgba(255,255,255,.4)" stroke-width="5"/><circle cx="${x1 + 108}" cy="${y + 10}" r="7" fill="rgba(255,255,255,.44)"/>`;
  }
  return `<circle cx="${x2}" cy="${y}" r="34" fill="rgba(255,255,255,.16)"/><circle cx="${x2}" cy="${y}" r="16" fill="rgba(255,255,255,.22)"/>`;
}

function buildSvg(story) {
  const slug = normalizeSlug(story && story.integration && story.integration.asset_slug) || normalizeSlug(story && story.story_key) || 'story';
  const seed = sceneSeed(story);
  const [c0, c1, c2, c3] = pickPalette(slug);

  const backWave = wavePath(seed, 520 - (seed % 42), 34, 11);
  const frontWave = wavePath(seed >> 1, 590 - (seed % 26), 22, 10);
  const stars = Array.from({ length: 18 }, (_, i) => {
    const s = seed + i * 97;
    const x = 80 + (s % 1120);
    const y = 50 + ((s >> 3) % 240);
    const r = 0.8 + ((s % 9) / 10);
    const o = 0.15 + ((s % 6) * 0.07);
    return `<circle cx="${x}" cy="${y}" r="${r.toFixed(2)}" fill="rgba(255,255,255,${o.toFixed(2)})"/>`;
  }).join('');

  const haloX = 220 + (seed % 840);
  const haloY = 145 + (seed % 120);
  const haloR = 130 + (seed % 70);

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1280 720" role="img" aria-label="Story backdrop">',
    '  <defs>',
    `    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">`,
    `      <stop offset="0%" stop-color="${c0}"/>`,
    `      <stop offset="48%" stop-color="${c1}"/>`,
    `      <stop offset="82%" stop-color="${c2}"/>`,
    `      <stop offset="100%" stop-color="${c3}"/>`,
    '    </linearGradient>',
    `    <radialGradient id="halo" cx="${(haloX / 1280).toFixed(3)}" cy="${(haloY / 720).toFixed(3)}" r="${(haloR / 720).toFixed(3)}">`,
    '      <stop offset="0%" stop-color="rgba(255,255,255,.34)"/>',
    '      <stop offset="100%" stop-color="rgba(255,255,255,0)"/>',
    '    </radialGradient>',
    '    <linearGradient id="mist" x1="0" y1="0" x2="0" y2="1">',
    '      <stop offset="0%" stop-color="rgba(255,255,255,0)"/>',
    '      <stop offset="100%" stop-color="rgba(255,255,255,.14)"/>',
    '    </linearGradient>',
    '  </defs>',
    '  <rect width="1280" height="720" fill="url(#bg)"/>',
    `  <rect width="1280" height="720" fill="url(#halo)"/>`,
    `  <g>${stars}</g>`,
    '  <path d="' + backWave + '" fill="rgba(8,15,35,.36)"/>',
    '  <path d="' + frontWave + '" fill="rgba(4,10,24,.52)"/>',
    '  <rect y="510" width="1280" height="210" fill="url(#mist)"/>',
    '  <g opacity=".95">',
    '    ' + symbolSet(story, seed),
    '  </g>',
    '</svg>',
    ''
  ].join('\n');
}

function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

if (!fs.existsSync(MANIFEST_PATH)) fail('Missing story-assets-manifest.json');
const manifest = JSON.parse(fs.readFileSync(MANIFEST_PATH, 'utf8'));
const stories = Array.isArray(manifest && manifest.stories) ? manifest.stories : [];
if (!stories.length) fail('No stories found in manifest');

ensureDir(OUTPUT_DIR);

let created = 0;
let skipped = 0;
stories.forEach((story) => {
  const slug = normalizeSlug(story && story.integration && story.integration.asset_slug) || normalizeSlug(story && story.story_key);
  if (!slug) return;
  const outPath = path.join(OUTPUT_DIR, `${slug}.svg`);
  if (!FORCE && fs.existsSync(outPath)) {
    skipped += 1;
    return;
  }
  fs.writeFileSync(outPath, buildSvg(story), 'utf8');
  created += 1;
});

console.log('[story-svg] Output dir:', path.relative(ROOT, OUTPUT_DIR));
console.log('[story-svg] Created:', created);
console.log('[story-svg] Skipped existing:', skipped);
