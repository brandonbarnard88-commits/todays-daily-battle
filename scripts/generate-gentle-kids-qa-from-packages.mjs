#!/usr/bin/env node
/**
 * Generates BOTH:
 *   1. Gentle kid-friendly Q&A (for ages 3-8) from the user-written package.md files
 *   2. Adult / family reflection prompts (4 thoughtful questions per story)
 *
 * These use the EXACT text the user supplies in each *-package.md
 * (Emotional Focus, Key KJV, Gentle Retelling, Read-Along Flow + Response).
 *
 * Run after adding any new batch of packages:
 *   node scripts/generate-gentle-kids-qa-from-packages.mjs
 *
 * Then (recommended):
 *   node scripts/generate-kids-read-quiz-data.mjs
 */

import { readdirSync, readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const storiesDir = join(root, 'kids', 'stories');

const kidsOutFile = join(root, 'kids', 'read-quiz-gentle-from-packages.cjs');
const adultOutFile = join(root, 'kids', 'stories', 'adult-story-reflection-prompts.json');

const files = readdirSync(storiesDir).filter(f => f.endsWith('-package.md'));

function parsePackage(md) {
  const titleMatch = md.match(/^# (.+?)(?:\s*\(|$)/m);
  const title = titleMatch ? titleMatch[1].trim() : 'Bible Story';

  const emotional = (md.match(/## Emotional Focus\s*\n+([\s\S]*?)(?=\n## |$)/) || [])[1]?.trim() || '';
  const keyKjv = (md.match(/## Key KJV\s*\n+([\s\S]*?)(?=\n## |$)/) || [])[1]?.trim() || '';
  const retelling38 = (md.match(/## Gentle Retelling \(3–8\)\s*\n+([\s\S]*?)(?=\n## |$)/) || [])[1]?.trim() || '';
  let retelling912 = (md.match(/## Gentle Retelling \(9–12\)\s*\n+([\s\S]*?)(?=\n## |$)/) || [])[1]?.trim() || '';
  let retelling1317 = (md.match(/## Gentle Retelling \(13–17\)\s*\n+([\s\S]*?)(?=\n## |$)/) || [])[1]?.trim() || '';
  const retelling = retelling38 || (md.match(/## Gentle Retelling\s*\n+([\s\S]*?)(?=\n## |$)/) || [])[1]?.trim() || ''; // fallback to single retelling
  // Sanitize: if an "empty" higher section captured the *next* heading (fragile regex on blank sections), treat as empty
  if (/^##\s/.test(retelling912)) retelling912 = '';
  if (/^##\s/.test(retelling1317)) retelling1317 = '';
  const response = (md.match(/## Read-Along Flow \+ Response\s*\n+([\s\S]*?)(?=\n\*\*|$)/) || [])[1]?.trim() || '';
  const verseLine = (md.match(/\*\*Verse:\*\*\s*([^\n]+)/) || [])[1]?.trim() || keyKjv;

  const refMatch = keyKjv.match(/\(([^)]+)\)$/) || verseLine.match(/\(([^)]+)\)$/);
  const ref = refMatch ? refMatch[1] : verseLine;

  // Richer adult sections (optional)
  const adultReflection = (md.match(/## Adult Reflection\s*\n+([\s\S]*?)(?=\n## |$)/) || [])[1]?.trim() || '';
  const relatesToday = (md.match(/## How It Relates Today\s*\n+([\s\S]*?)(?=\n## |$)/) || [])[1]?.trim() || '';
  const takeaways = (md.match(/## Key Takeaways\s*\n+([\s\S]*?)(?=\n## |$)/) || [])[1]?.trim() || '';

  return { 
    title, emotional, keyKjv, retelling, response, ref,
    retelling38, retelling912, retelling1317,
    adultReflection, relatesToday, takeaways 
  };
}

// === KIDS (3-8 gentle) ===
function makeGentleParagraphs(retelling, response) {
  const sentences = retelling
    .replace(/([.!?])\s+/g, '$1|')
    .split('|')
    .map(s => s.trim())
    .filter(Boolean);
  const paras = sentences.slice(0, 5);
  if (response) paras.push(response.replace(/^["“]|["”]$/g, ''));
  paras.push('Reference: ' + (paras.ref || ''));
  return paras;
}

function makeKidsQuestions(title, emotional, retelling, response) {
  const qs = [];
  const cleanTitle = title.replace(/\(.*\)/, '').trim();

  // Q1
  qs.push({
    question: `What happened in the story of ${cleanTitle}?`,
    choices: [
      'Something scary with no happy ending.',
      retelling.split(/[.!?]/)[0].trim() + '.',
      'Everyone was perfect and nothing hard happened.',
      'A mean person won.'
    ],
    correctIndex: 1,
    correctFeedback: 'Yes — you remembered the story well!',
    wrongFeedback: 'Listen again for the kind or brave part.'
  });

  // Q2 - emotional focus
  if (emotional) {
    qs.push({
      question: `What does this story especially help us feel or understand?`,
      choices: [
        emotional,
        'We only need to be kind when we feel like it.',
        'God only cares about big important people.',
        'It is okay to stay angry forever.'
      ],
      correctIndex: 0,
      correctFeedback: 'Yes! That is the heart of the story.',
      wrongFeedback: 'The story shows us how God wants our hearts to be.'
    });
  }

  // Q3 - the user's response line
  if (response) {
    const clean = response.replace(/^["“]|["”]$/g, '');
    qs.push({
      question: `What does the story want us to remember and do?`,
      choices: [
        clean,
        'We should never forgive.',
        'Only grown-ups have to be kind.',
        'It does not matter how we treat friends.'
      ],
      correctIndex: 0,
      correctFeedback: 'Exactly — that is what Jesus wants us to carry in our hearts.',
      wrongFeedback: 'Ask God to help you live this out today.'
    });
  }

  // Q4 - personal application
  qs.push({
    question: `How can you live this story today?`,
    choices: [
      'By showing kindness or forgiveness in a small way, even when it feels a little hard.',
      'By staying quiet and never helping anyone.',
      'By only being nice to people who are nice first.',
      'By telling God I can do it all by myself.'
    ],
    correctIndex: 0,
    correctFeedback: 'Yes — little acts of love please Jesus.',
    wrongFeedback: 'God is happy to help you be gentle and brave.'
  });

  // Q5 - tie to God / Jesus
  qs.push({
    question: `Who is the one who always shows us perfect kindness and forgiveness?`,
    choices: [
      'Jesus — He is our forever friend who loves us.',
      'Only the strongest people.',
      'People who never make mistakes.',
      'We have to earn it by being perfect.'
    ],
    correctIndex: 0,
    correctFeedback: 'Yes! Jesus is the best example and He helps us.',
    wrongFeedback: 'Jesus is the one who forgives us first and shows us how.'
  });

  return qs;
}

// === ADULT / FAMILY REFLECTION (supports richer user-provided content) ===
function makeAdultPrompts(data) {
  const { emotional, retelling, response, relatesToday, adultReflection, takeaways } = data;

  // If user provided rich adult sections in the package, use them
  if (relatesToday || adultReflection || takeaways) {
    const prompts = [];
    if (relatesToday) prompts.push(relatesToday);
    if (adultReflection) prompts.push(adultReflection);
    if (takeaways) prompts.push(takeaways);
    return prompts.slice(0, 6); // allow a bit more when rich content is supplied
  }

  // Fallback to the original generated style
  const prompts = [];

  if (emotional) {
    prompts.push(`How does this story speak to the feeling of "${emotional.toLowerCase()}" in your own life right now?`);
  }

  prompts.push(`What does this story reveal about God’s heart toward people who feel small, scared, left out, or guilty?`);

  if (response) {
    const clean = response.replace(/^["“]|["”]$/g, '');
    prompts.push(`The story ends with this line: “${clean}” — what would it look like for you (or your family) to live that out this week?`);
  }

  prompts.push(`Is there one specific person God is bringing to mind as you read this story? What is one small, concrete way you can show them the kindness or forgiveness shown here?`);

  return prompts.slice(0, 4);
}

const kidsPacks = {};
const adultPrompts = {};
let count = 0;

for (const file of files) {
  const full = readFileSync(join(storiesDir, file), 'utf8');
  const data = parsePackage(full);
  if (!data.retelling) continue;

  const base = file.replace(/-package\.md$/, '');
  const key = base
    .split('-')
    .map((w, i) => i === 0 ? w : w[0].toUpperCase() + w.slice(1))
    .join('');

  // Kids version
  const paragraphs = makeGentleParagraphs(data.retelling, data.response);
  const questions = makeKidsQuestions(data.title, data.emotional, data.retelling, data.response);

  kidsPacks[key] = {
    kjvRef: data.keyKjv || data.ref,
    verseExcerpt: data.keyKjv,
    readAlongTitle: data.title,
    quizWrongHumilityHint: data.emotional || 'Listen for the kind heart in the story.',
    hintAboveQuiz: 'Use the pictures while you read. Tap each part slowly.',
    paragraphs,
    questions,
    retelling38: data.retelling38 || data.retelling,
    retelling912: data.retelling912 || '',
    retelling1317: data.retelling1317 || '',
    readAlongSections: [
      { text: (data.retelling38 || data.retelling).slice(0, 140) + ((data.retelling38 || data.retelling).length > 140 ? '…' : ''), caption: data.title, image: '/coloring-pages/colored/noah-s1.jpg' }
    ],
    readAlongImages: []
  };

  // Aliases for common stories
  if (key === 'unforgivingServant') kidsPacks.forgive70x7 = kidsPacks[key];
  if (key === 'widowMite' || key === 'widowsMite') {
    kidsPacks.widowMite = kidsPacks[key];
    kidsPacks.widowsMite = kidsPacks[key];
  }

  // Adult version (supports multi-age retellings + richer reflection)
  adultPrompts[key] = {
    title: data.title,
    ref: data.ref,
    emotionalFocus: data.emotional || '',
    gentleRetelling38: data.retelling38 || data.retelling || '',
    gentleRetelling912: data.retelling912 || '',
    gentleRetelling1317: data.retelling1317 || '',
    relatesToday: data.relatesToday || '',
    adultReflection: data.adultReflection || '',
    keyTakeaways: data.takeaways || '',
    prompts: makeAdultPrompts(data)
  };

  count++;
}

const kidsHeader = `/**
 * AUTO-GENERATED gentle kid Q&A (ages 3–8) from kids/stories/*-package.md
 * Uses the exact warm retellings + "Read-along flow + response" the user wrote.
 *
 * Generated: ${new Date().toISOString()}
 * Stories covered: ${count}
 *
 * Merged automatically via read-quiz-handcrafted.cjs
 */
'use strict';
const gentlePacks = ${JSON.stringify(kidsPacks, null, 2)};
module.exports = gentlePacks;
`;

writeFileSync(kidsOutFile, kidsHeader, 'utf8');
console.log(`✓ Wrote ${kidsOutFile} with ${count} gentle kid Q&A packs (5 questions each).`);

const adultHeader = {
  _meta: {
    description: "Adult & family reflection prompts for the gentle Bible stories. 4 questions per story drawn directly from the user's Emotional Focus + Gentle Retelling + Read-Along Response. Perfect for table time, small groups, or personal quiet time.",
    generated: new Date().toISOString(),
    source: "kids/stories/*-package.md via generate-gentle-kids-qa-from-packages.mjs",
    totalStories: count
  },
  ...adultPrompts
};

writeFileSync(adultOutFile, JSON.stringify(adultHeader, null, 2), 'utf8');
console.log(`✓ Wrote ${adultOutFile} with ${count} adult reflection prompt sets (4 prompts each).`);

console.log('\nNext recommended steps:');
console.log('  node scripts/generate-kids-read-quiz-data.mjs');
console.log('  (then rebuild + test the story modal)');