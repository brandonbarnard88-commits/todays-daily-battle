#!/usr/bin/env node
import fs from 'fs';
import path from 'path';

const ROOT = process.cwd();
const manifestPath = path.join(ROOT, 'story-assets-manifest.json');
const packFiles = [
  'ACTIVE-BIBLE-PROMPTS-1-20.md',
  'ACTIVE-BIBLE-PROMPTS-21-40.md',
  'ACTIVE-BIBLE-PROMPTS-41-60.md',
  'ACTIVE-BIBLE-PROMPTS-61-80.md',
  'ACTIVE-BIBLE-PROMPTS-81-100.md',
  'ACTIVE-BIBLE-PROMPTS-101-119.md',
  'ACTIVE-BIBLE-PROMPTS-120.md',
  'ACTIVE-BIBLE-PROMPTS-121-140.md',
  'ACTIVE-BIBLE-PROMPTS-141-160.md'
];

const mentors = ['david', 'moses', 'esther', 'ruth', 'paul'];

function slugify(input) {
  return String(input || '')
    .toLowerCase()
    .replace(/\(.*?\)/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/-+/g, '-');
}

function normalizeTitle(title) {
  return String(title || '')
    .replace(/\s+recap variant/gi, '')
    .replace(/\s+variant/gi, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function deriveTheme(title) {
  const t = String(title || '').toLowerCase();
  if (t.includes('forgiv') || t.includes('prodigal')) return 'Forgiveness and restoration';
  if (t.includes('storm') || t.includes('shipwreck')) return 'Peace in chaos';
  if (t.includes('prayer') || t.includes('persistent')) return 'Persistent prayer';
  if (t.includes('resurrection') || t.includes('empty tomb')) return 'Living hope';
  if (t.includes('tempt') || t.includes('wilderness')) return 'Truth over temptation';
  if (t.includes('heal') || t.includes('lame') || t.includes('withered')) return 'Healing and faith';
  if (t.includes('parable')) return 'Kingdom wisdom';
  if (t.includes('armor')) return 'Stand firm in faith';
  if (t.includes('pentecost') || t.includes('spirit')) return 'Spirit-empowered boldness';
  return 'Faithful courage';
}

function deriveTags(title, reference) {
  const source = (String(title || '') + ' ' + String(reference || '')).toLowerCase();
  const tags = [];
  const map = [
    ['faith', ['faith', 'trust', 'obedience']],
    ['prayer', ['prayer', 'dependence', 'perseverance']],
    ['forgiv', ['forgiveness', 'grace', 'restoration']],
    ['heal', ['healing', 'mercy', 'hope']],
    ['storm', ['storm', 'peace', 'trust']],
    ['parable', ['parable', 'wisdom', 'kingdom']],
    ['paul', ['mission', 'endurance', 'grace']],
    ['jesus', ['discipleship', 'hope', 'truth']]
  ];
  map.forEach(function (entry) {
    if (source.includes(entry[0])) {
      entry[1].forEach(function (tag) {
        if (!tags.includes(tag)) tags.push(tag);
      });
    }
  });
  if (!tags.length) tags.push('faith', 'courage', 'hope');
  return tags.slice(0, 4);
}

function readAllHeadings() {
  const out = [];
  const headingRe = /^##\s+(\d+)\.\s+(.+?)\s+\(([^)]+)\)\s*$/gm;
  packFiles.forEach(function (file) {
    const full = path.join(ROOT, file);
    if (!fs.existsSync(full)) return;
    const text = fs.readFileSync(full, 'utf8');
    let match;
    while ((match = headingRe.exec(text))) {
      out.push({
        id: Number(match[1]),
        title: normalizeTitle(match[2]),
        reference: match[3].trim()
      });
    }
  });
  return out.sort(function (a, b) {
    return a.id - b.id;
  });
}

if (!fs.existsSync(manifestPath)) {
  console.error('[manifest-sync] Missing story-assets-manifest.json');
  process.exit(1);
}

const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
const stories = Array.isArray(manifest.stories) ? manifest.stories : [];
const byId = new Map();
const usedKeys = new Set();
stories.forEach(function (s) {
  if (s && typeof s.id === 'number') byId.set(s.id, s);
  if (s && s.story_key) usedKeys.add(String(s.story_key));
});

function uniqueKey(base, id) {
  let key = base || 'story-' + id;
  if (!usedKeys.has(key)) {
    usedKeys.add(key);
    return key;
  }
  key = key + '-' + id;
  if (!usedKeys.has(key)) {
    usedKeys.add(key);
    return key;
  }
  let n = 2;
  while (usedKeys.has(key + '-' + n)) n += 1;
  const finalKey = key + '-' + n;
  usedKeys.add(finalKey);
  return finalKey;
}

const headings = readAllHeadings();
if (!headings.length) {
  console.error('[manifest-sync] No prompt pack headings found.');
  process.exit(1);
}

let added = 0;
headings.forEach(function (h) {
  if (h.id < 1 || h.id > 160) return;
  if (byId.has(h.id)) return;
  const mentor = mentors[(h.id - 1) % mentors.length];
  const baseSlug = slugify(h.title);
  const storyKey = uniqueKey(baseSlug, h.id);
  const tags = deriveTags(h.title, h.reference);
  const story = {
    id: h.id,
    story_key: storyKey,
    title: h.title,
    reference: h.reference,
    battle_theme: deriveTheme(h.title),
    mentor: mentor,
    tags: tags,
    scene_moment: h.title + ' turning point framed with reverent faith and emotional clarity.',
    prompt_seed: 'Original cinematic Bible scene for ' + h.title + ' (' + h.reference + '), reverent and hopeful, animation-ready composition.',
    keyframes: [
      'Opening setup for ' + h.title + '.',
      'Faith decision moment intensifies.',
      'Hopeful resolution loop.'
    ],
    integration: {
      asset_slug: baseSlug || ('story-' + h.id),
      preferred_format: h.id % 2 === 0 ? 'svg+rive' : 'svg',
      motion_hook: 'soft-light pulse'
    },
    supabase: {
      rotation_key: tags[0] || 'faith',
      unlock_rule: 'story reflection completed'
    }
  };
  byId.set(h.id, story);
  added += 1;
});

const nextStories = [];
for (let id = 1; id <= 160; id += 1) {
  if (!byId.has(id)) {
    console.error('[manifest-sync] Missing story id ' + id + ' after sync.');
    process.exit(1);
  }
  nextStories.push(byId.get(id));
}

manifest.version = Math.max(Number(manifest.version || 1), 2);
manifest.updated_at = new Date().toISOString().slice(0, 10);
manifest.stories = nextStories;

fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2) + '\n', 'utf8');

console.log('[manifest-sync] Added:', added);
console.log('[manifest-sync] Total stories:', manifest.stories.length);
