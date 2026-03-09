#!/usr/bin/env node
import fs from 'fs';
import path from 'path';

const PACKS = [
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

function cleanLine(value) {
  return String(value || '')
    .replace(/\u2013/g, '-')
    .replace(/\u2014/g, '-')
    .replace(/\s+/g, ' ')
    .trim();
}

function toThemeFromTitle(title) {
  const raw = cleanLine(title).toLowerCase();
  if (!raw) return 'faithful courage';
  if (raw.includes('resurrection')) return 'victory and living hope';
  if (raw.includes('forgive') || raw.includes('prodigal')) return 'grace and restoration';
  if (raw.includes('storm') || raw.includes('furnace') || raw.includes('den')) return 'faith under pressure';
  if (raw.includes('birth') || raw.includes('shepherd') || raw.includes('manger')) return 'wonder and worship';
  return 'faithful courage';
}

function extractCodeBlockText(sectionBody) {
  const m = sectionBody.match(/```text\s*([\s\S]*?)```/i);
  return m ? m[1].trim() : '';
}

function extractVerseOverlay(codeText, reference) {
  const lines = codeText.split('\n').map(cleanLine).filter(Boolean);
  const verse = lines.find((line) => /subtle\s+kjv\s+overlay/i.test(line));
  if (verse) {
    return verse
      .replace(/^[-\d.\s]*/g, '')
      .replace(/\s*end with.*$/i, '')
      .trim();
  }
  if (reference) {
    return 'Flash at 0:54-0:59 during climax/resolution: subtle KJV verse from ' + reference + '.';
  }
  return 'Flash at 0:54-0:59 during climax/resolution: subtle KJV verse overlay tied to the story turning point.';
}

function extractSceneLines(codeText) {
  const lines = codeText.split('\n').map(cleanLine);
  const out = [];
  let inSceneSequence = false;
  for (const line of lines) {
    if (!line) continue;
    if (/^scene sequence:/i.test(line)) {
      inSceneSequence = true;
      continue;
    }
    if (!inSceneSequence) continue;
    const numbered = line.match(/^\d+\.\s*(.+)$/);
    if (!numbered) continue;
    const cleaned = cleanLine(numbered[1]);
    if (/subtle\s+kjv\s+overlay/i.test(cleaned)) continue;
    out.push(cleaned);
  }
  return out;
}

function buildMasterStyleBible(title, reference) {
  return [
    'Pixar-quality cinematic 3D Bible short with reverent emotional power: expressive soulful eyes, premium textures, soft rim lighting, subtle film grain, and warm-to-hopeful color arcs.',
    'Camera language stays cinematic throughout: epic establishing wides, slow dolly-ins, intimate close-ups, gentle orbit pans, soft rack focus, and purposeful low-angle reveals.',
    'Story lock: keep visual continuity for primary figures and locations in ' + cleanLine(title) + ' (' + cleanLine(reference) + ') across every scene.'
  ].join('\n');
}

function buildScenes(sceneLines, title) {
  const theme = toThemeFromTitle(title);
  const titleText = cleanLine(title);
  const generatedCore = [
    titleText + ': open on the world and stakes with reverent atmosphere.',
    'Introduce the central conflict and emotional pressure around the main figures.',
    'Focus tightly on the faith decision point with expressive eyes and body language.',
    'Escalate momentum toward the decisive movement of obedience.',
    'Land the turning-point action with clarity, reverence, and emotional weight.',
    'Resolve into hope, restoration, or holy awe with visual calm.'
  ];
  const l = Array.isArray(sceneLines) && sceneLines.length >= 3 ? sceneLines.slice(0, 6) : generatedCore;
  return [
    'Epic wide establishing shot: ' + (l[0] || 'Set the world and stakes with reverent atmosphere.') + ' Slow crane-in with atmospheric depth and soft volumetric light.',
    'Character intent beat: ' + (l[1] || 'Focus on the central emotional conflict.') + ' Use gentle dolly movement and subtle rack focus.',
    'Intimate close-up: ' + (l[2] || 'Capture the faith decision through facial expression and eye-line.') + ' Keep shallow depth-of-field and warm rim light.',
    'Action build: ' + (l[3] || 'Momentum rises through purposeful movement and visual anticipation.') + ' Add controlled handheld texture for immediacy.',
    'Climactic motion beat: ' + (l[4] || 'Turning-point action lands with cinematic clarity and reverent impact.') + ' Use low-angle framing and soft light burst.',
    'Resolution beat: ' + (l[5] || 'Hope breaks through as tension resolves.') + ' Transition palette from contrast to gentle warmth.',
    'Closing tableau: faith-forward stillness anchored by "' + theme + '" with a loop-friendly 2-second hold and peaceful horizon glow.'
  ];
}

function buildPromptText({ title, reference, scenes, overlay }) {
  const lines = [];
  lines.push('1. Master Style Bible');
  lines.push(buildMasterStyleBible(title, reference));
  lines.push('');
  lines.push('2. Scene Prompts');
  scenes.forEach((s, i) => lines.push((i + 1) + '. ' + s));
  lines.push('');
  lines.push('3. Suggested Subtle KJV Verse Overlay Timing');
  lines.push(overlay);
  lines.push('');
  lines.push('4. Overall Video Prompt Enhancer Suffix');
  lines.push('cinematic 4K render, 24fps, shallow depth of field, volumetric god-rays, subtle film grain, polished color grading, premium Pixar-quality character animation');
  return lines.join('\n');
}

function transformSection(sectionMarkdown, headingLine) {
  const titleMatch = headingLine.match(/^##\s+(\d+)\.\s+(.+?)(?:\s+\(([^)]+)\))?\s*$/);
  const title = titleMatch ? titleMatch[2] : 'Story';
  const reference = titleMatch && titleMatch[3] ? titleMatch[3] : 'Scripture reference';
  const codeText = extractCodeBlockText(sectionMarkdown);
  const sceneLines = extractSceneLines(codeText);
  const overlay = extractVerseOverlay(codeText, reference);
  const scenes = buildScenes(sceneLines, title);
  const prompt = buildPromptText({ title, reference, scenes, overlay });
  return headingLine + '\n\n```text\n' + prompt + '\n```\n';
}

function transformPack(pathname) {
  const original = fs.readFileSync(pathname, 'utf8');
  const lines = original.split('\n');
  const headingIndexes = [];
  for (let i = 0; i < lines.length; i += 1) {
    if (/^##\s+\d+\.\s+/.test(lines[i])) headingIndexes.push(i);
  }
  if (!headingIndexes.length) return { changed: false, stories: 0 };

  const firstHeading = headingIndexes[0];
  let header = lines
    .slice(0, firstHeading)
    .join('\n')
    .trimEnd();
  while (header.includes('---\n\n---')) {
    header = header.replace('---\n\n---', '---');
  }
  const transformedSections = [];
  for (let i = 0; i < headingIndexes.length; i += 1) {
    const start = headingIndexes[i];
    const end = i + 1 < headingIndexes.length ? headingIndexes[i + 1] : lines.length;
    const sectionLines = lines.slice(start, end);
    const headingLine = sectionLines[0];
    const sectionMarkdown = sectionLines.join('\n');
    transformedSections.push(transformSection(sectionMarkdown, headingLine));
  }
  const rewritten = [header].concat(transformedSections).join('\n');
  const changed = rewritten !== original;
  if (changed) fs.writeFileSync(pathname, rewritten, 'utf8');
  return { changed, stories: transformedSections.length };
}

let totalStories = 0;
let changedFiles = 0;
for (const relative of PACKS) {
  const pathname = path.join(process.cwd(), relative);
  if (!fs.existsSync(pathname)) {
    console.warn('[upgrade-prompts] Missing file:', relative);
    continue;
  }
  const result = transformPack(pathname);
  totalStories += result.stories;
  if (result.changed) changedFiles += 1;
  console.log('[upgrade-prompts]', relative, '-', result.stories, 'stories', result.changed ? '(updated)' : '(no changes)');
}
console.log('[upgrade-prompts] Files updated:', changedFiles);
console.log('[upgrade-prompts] Total stories transformed:', totalStories);
