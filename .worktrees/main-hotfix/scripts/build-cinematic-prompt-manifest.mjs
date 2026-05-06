#!/usr/bin/env node
import fs from 'fs';
import path from 'path';

const root = process.cwd();
const inputPath = path.join(root, 'story-assets-manifest.json');
const outJsonPath = path.join(root, 'cinematic-story-prompts.json');
const outMdPath = path.join(root, 'cinematic-story-prompts.md');

function normalize(value) {
  return String(value || '')
    .toLowerCase()
    .trim()
    .replace(/\s+/g, ' ')
    .replace(/[^a-z0-9 _-]/g, '');
}

function mentorLockLine(mentor) {
  var m = normalize(mentor || '');
  if (m === 'david') return 'Character lock: David is a young olive-skinned shepherd with curly dark hair, humble courage, beige tunic, sling silhouette.';
  if (m === 'moses') return 'Character lock: Moses is an elder prophet with white beard, weathered kindness, staff, and grounded authority posture.';
  if (m === 'esther') return 'Character lock: Esther is regal and courageous with dark wavy hair, refined crown silhouette, and compassionate strength.';
  if (m === 'ruth') return 'Character lock: Ruth is warm and loyal with gentle eyes, harvest-earth palette, and calm resilient presence.';
  if (m === 'paul') return 'Character lock: Paul is steadfast and intense with short dark hair, scarred hands, and grace-shaped resolve.';
  return 'Character lock: keep all primary figures visually consistent across scenes with stable facial structure, clothing silhouette, and emotional arc.';
}

function safeFrame(list, idx, fallback) {
  if (!Array.isArray(list)) return fallback;
  return String(list[idx] || fallback).trim();
}

function refText(story) {
  return String((story && story.reference) || '').trim();
}

function buildMasterStyleBible(story) {
  return [
    'Pixar-quality cinematic 3D Bible short with reverent emotional power: expressive soulful eyes, premium textures, soft rim lighting, subtle film grain, and warm-to-hopeful color arcs.',
    'Camera language stays cinematic throughout: epic establishing wides, slow dolly-ins, intimate close-ups, gentle orbit pans, soft rack focus, and purposeful low-angle reveals.',
    mentorLockLine(story && story.mentor)
  ].join('\n');
}

function buildCinematicScenes(story) {
  var kf = Array.isArray(story && story.keyframes) ? story.keyframes : [];
  var moment = String((story && story.scene_moment) || '').trim() || 'Key faith-driven turning point unfolds with reverent cinematic momentum.';
  var theme = String((story && story.battle_theme) || 'Faithful courage').trim();
  return [
    'Epic wide establishing shot: ' + moment + ' Slow crane-in with atmospheric depth, soft volumetric light, and grounded emotional tension.',
    'Character intent beat: gentle dolly toward primary faces as expressions shift from uncertainty to faith-led resolve; subtle rack focus between foreground and background stakes.',
    'Intimate close-up: soulful eyes and micro-expressions carry the spiritual decision point; warm rim light and shallow depth-of-field isolate heart posture.',
    'Action build: ' + safeFrame(kf, 0, 'Momentum rises through purposeful movement and visual anticipation.') + ' Use controlled handheld texture for emotional immediacy.',
    'Climactic motion beat: ' + safeFrame(kf, 1, 'Turning-point action lands with cinematic clarity and reverent impact.') + ' Layer dramatic low-angle framing and soft light burst.',
    'Resolution beat: ' + safeFrame(kf, 2, 'Hope breaks through as tension resolves.') + ' Transition palette from contrast to gentle warmth while preserving continuity.',
    'Closing tableau: faith-forward stillness anchored by "' + theme + '" with a loop-friendly 2-second hold, subtle environment motion, and peaceful horizon glow.'
  ];
}

function buildCinematicOverlayTiming(story) {
  var ref = refText(story) || 'Scripture reference';
  return 'Flash at 0:54-0:59 during climax/resolution: subtle KJV verse from ' + ref + '.';
}

function buildCinematicEnhancerSuffix() {
  return 'cinematic 4K render, 24fps, shallow depth of field, volumetric god-rays, subtle film grain, polished color grading, premium Pixar-quality character animation';
}

function buildPromptText(pack) {
  const lines = [];
  lines.push('1. Master Style Bible');
  lines.push(pack.master_style_bible);
  lines.push('');
  lines.push('2. Scene Prompts');
  pack.scenes.forEach((s, idx) => lines.push((idx + 1) + '. ' + s));
  lines.push('');
  lines.push('3. Suggested Subtle KJV Verse Overlay Timing');
  lines.push(pack.verse_overlay_timing);
  lines.push('');
  lines.push('4. Overall Video Prompt Enhancer Suffix');
  lines.push(pack.enhancer_suffix);
  return lines.join('\n');
}

if (!fs.existsSync(inputPath)) {
  console.error('[cinematic-prompts] Missing story-assets-manifest.json');
  process.exit(1);
}

const manifest = JSON.parse(fs.readFileSync(inputPath, 'utf8'));
const stories = Array.isArray(manifest.stories) ? manifest.stories : [];

const packs = stories.map((story) => {
  const out = {
    id: story.id,
    story_key: story.story_key,
    title: story.title,
    reference: story.reference,
    master_style_bible: buildMasterStyleBible(story),
    scenes: buildCinematicScenes(story),
    verse_overlay_timing: buildCinematicOverlayTiming(story),
    enhancer_suffix: buildCinematicEnhancerSuffix()
  };
  out.prompt = buildPromptText(out);
  return out;
});

fs.writeFileSync(outJsonPath, JSON.stringify({ version: 1, generated_at: new Date().toISOString(), count: packs.length, prompts: packs }, null, 2), 'utf8');

const md = [];
md.push('# Cinematic Story Prompts');
md.push('');
md.push('Auto-generated cinematic director prompts for all stories in `story-assets-manifest.json`.');
md.push('');
packs.forEach((p) => {
  md.push('## ' + p.id + '. ' + p.title + ' (' + p.reference + ')');
  md.push('');
  md.push('```text');
  md.push(p.prompt);
  md.push('```');
  md.push('');
});
fs.writeFileSync(outMdPath, md.join('\n'), 'utf8');

console.log('[cinematic-prompts] Wrote', outJsonPath);
console.log('[cinematic-prompts] Wrote', outMdPath);
console.log('[cinematic-prompts] Count:', packs.length);
