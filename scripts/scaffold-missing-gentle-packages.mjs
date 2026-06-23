#!/usr/bin/env node
/**
 * Creates clean skeleton package.md files for gentle stories that are in the
 * Gentle Journey ORDER but do not yet have a user-written package.
 *
 * This makes it trivial for the user to paste in previous batch text
 * (Emotional Focus, Gentle Retelling, Key KJV, Read-Along Response, etc.)
 * from earlier deliveries.
 *
 * Usage:
 *   node scripts/scaffold-missing-gentle-packages.mjs
 *
 * Then drop your previous exact text into the new files and re-run:
 *   npm run gentle:qa
 */

import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');

const journeyPath = join(root, 'kids', 'kids-gentle-journey.js');
const battlePath = join(root, 'kids', 'kids-battle.js');
const storiesDir = join(root, 'kids', 'stories');

const content = readFileSync(journeyPath, 'utf8');
const orderMatch = content.match(/var ORDER = \[([\s\S]*?)\];/);
const allOrderKeys = orderMatch[1].match(/'([a-zA-Z0-9]+)'/g).map(k => k.replace(/'/g, ''));

// Load titles from bibleStories where possible
let titles = {};
try {
  const battle = readFileSync(battlePath, 'utf8');
  const storyRe = /([a-zA-Z][a-zA-Z0-9_]*):\s*\{\s*title:\s*['"]([^'"]+)['"]/g;
  let m;
  while ((m = storyRe.exec(battle))) {
    titles[m[1]] = m[2];
  }
} catch (_) {}

const existingFiles = new Set();
try {
  const files = require('fs').readdirSync(storiesDir);
  files.forEach(f => {
    if (f.endsWith('-package.md')) {
      const base = f.replace('-package.md', '').replace(/-/g, '').toLowerCase();
      existingFiles.add(base);
    }
  });
} catch (_) {}

const missing = allOrderKeys.filter(k => {
  const lower = k.toLowerCase();
  return !existingFiles.has(lower);
});

console.log(`Found ${missing.length} gentle journey keys without package.md files.`);

let created = 0;
for (const key of missing.slice(0, 30)) { // limit to first 30 for this run to keep it reasonable
  const kebab = key.replace(/([A-Z])/g, '-$1').toLowerCase().replace(/^-/, '');
  const file = join(storiesDir, `${kebab}-package.md`);

  if (existsSync(file)) continue;

  const title = titles[key] || key.replace(/([A-Z])/g, ' $1').trim();

  const skeleton = `# ${title}

## Emotional Focus
[PASTE the Emotional Focus line the user wrote for this story here]

## Key KJV
[PASTE the exact Key KJV verse the user provided]

## Gentle Retelling
[PASTE the full gentle retelling the user wrote for ages 3–8]

## Coloring Prompt
[PASTE the coloring prompt the user wrote]

## Read-Along Flow + Response
[PASTE the exact short response line the user wrote]

**Search tags:** ${kebab}, gentle, kindness, ${title.toLowerCase().split(' ').slice(0,3).join(', ')}
**Verse:** [Reference]
**Flow:** color → listen → gentle loop or next
`;

  writeFileSync(file, skeleton, 'utf8');
  created++;
  console.log(`  Created skeleton: ${kebab}-package.md`);
}

console.log(`\nCreated ${created} skeleton package files.`);
console.log('Next: Paste the exact previous batch text into them, then run:');
console.log('  npm run gentle:qa');
console.log('\nTip: The first 100 keys in the Gentle Journey ORDER are the priority gentle stories.');