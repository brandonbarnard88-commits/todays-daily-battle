#!/usr/bin/env node
/**
 * Maps each bible story key to its read-quiz source:
 * - handcrafted: full pack from kids/read-quiz-handcrafted.cjs (incl. David pack)
 * - generator_narration: npm run kids:generate-read-quiz → buildPack() using narration: in kids-battle.js
 * - generator_fallback: buildPack() with no narration (panel alts + kidContext.apply only)
 *
 * Run: node scripts/audit-kids-read-quiz-sources.mjs
 * Writes: kids/READ-QUIZ-SOURCE-AUDIT.md
 */
import { readFileSync, writeFileSync } from 'fs';
import { createRequire } from 'module';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const require = createRequire(import.meta.url);
const HANDCRAFTED = require(join(root, 'kids', 'read-quiz-handcrafted.cjs'));

const battlePath = join(root, 'kids', 'kids-battle.js');
const outMd = join(root, 'kids', 'READ-QUIZ-SOURCE-AUDIT.md');

const s = readFileSync(battlePath, 'utf8');
const startTag = 'var bibleStories = {';
const endTag =
  '\n  };\n\n  /** Export stories before any init() so defer + sync-ready pages always have window.TDB_BIBLE_STORIES (Kids Corner, coloring, RPC helpers). */';
const si = s.indexOf(startTag);
const ei = s.indexOf(endTag);
if (si < 0 || ei < 0) {
  console.error('Could not locate bibleStories block in kids-battle.js');
  process.exit(1);
}
const bibleSlice = s.slice(si + startTag.length, ei);

const storyRe = /\n    ([a-zA-Z][a-zA-Z0-9_]*): \{\n      title:/g;
const rowStarts = [];
let m;
while ((m = storyRe.exec(bibleSlice))) {
  rowStarts.push({ key: m[1], idx: m.index });
}

const byKey = new Map();
for (let i = 0; i < rowStarts.length; i++) {
  const { key, idx } = rowStarts[i];
  if (byKey.has(key)) continue;
  const end = i + 1 < rowStarts.length ? rowStarts[i + 1].idx : bibleSlice.length;
  byKey.set(key, bibleSlice.slice(idx, end));
}

function readQuoted(str, start) {
  const q = str[start];
  if (q !== "'" && q !== '"') return { text: '', end: start };
  let i = start + 1;
  let out = '';
  while (i < str.length) {
    const c = str[i];
    if (c === '\\') {
      i++;
      out += str[i] || '';
      i++;
      continue;
    }
    if (c === q) return { text: out, end: i + 1 };
    out += c;
    i++;
  }
  return { text: out, end: i };
}

function extractNarration(chunk) {
  const i = chunk.indexOf('narration:');
  if (i < 0) return '';
  const rest = chunk.slice(i + 'narration:'.length).trimStart();
  const r = readQuoted(rest, 0);
  return r.text;
}

const handcraftedKeys = Object.keys(HANDCRAFTED).sort();
const allKeys = [...byKey.keys()].sort((a, b) => a.localeCompare(b));

const generatorKeys = allKeys.filter((k) => !HANDCRAFTED[k]);
const withNarration = [];
const fallbackOnly = [];

for (const key of generatorKeys) {
  const chunk = byKey.get(key);
  const nar = (extractNarration(chunk) || '').trim();
  if (nar.length > 0) withNarration.push(key);
  else fallbackOnly.push(key);
}

const when = new Date().toISOString().slice(0, 10);

const md = `# Kids read-quiz source map

Generated: **${when}** (run \`npm run kids:audit-read-quiz-sources\` to refresh)

**Note:** This file describes **today’s** pipeline only: what \`generate-kids-read-quiz-data.mjs\` would do on the next \`npm run kids:generate-read-quiz\`. Older commits may have edited \`kids-read-quiz-data.js\` directly for batches of stories; unless those edits were **moved into** \`read-quiz-handcrafted.cjs\` (or into \`narration:\` / panel / \`kidContext\` in \`kids-battle.js\`), a full regen would rebuild those keys from the generator.

## How to read this

- **Handcrafted full pack** — \`kids/read-quiz-handcrafted.cjs\` (and \`read-quiz-david-pack.cjs\` for David). These keys **replace** \`buildPack()\` entirely when you run \`npm run kids:generate-read-quiz\`. Edit those files, then regenerate.
- **Generator + narration** — Story text in \`kids/kids-battle.js\` includes a \`narration:\` string. The generator splits/shapes it into paragraphs and builds the five multiple-choice questions from that block + metadata. **Your battle copy is the source of truth** for those keys.
- **Generator, no narration** — No \`narration:\` field (or empty). Read-aloud paragraphs are built only from **panel \`alt\` text** and **kidContext.apply** in \`kids-battle.js\` (no invented facts in the generator). Quizzes still use the same five-question pattern.

## Summary

| Category | Count |
|----------|------:|
| Total \`bibleStories\` keys | ${allKeys.length} |
| **Handcrafted** full-pack override | ${handcraftedKeys.length} |
| **Generator** (\`buildPack\`) | ${generatorKeys.length} |
| …with non-empty \`narration:\` in battle | ${withNarration.length} |
| …no narration (alt + apply path) | ${fallbackOnly.length} |

## Handcrafted keys (${handcraftedKeys.length})

Shared packs (same object used for two library cards each):

- **David:** \`david\`, \`davidGoliath\` → \`read-quiz-david-pack.cjs\`
- **Jericho:** \`jerichoWalls\`, \`fallOfJericho\` → \`buildJerichoReadQuiz()\` in \`read-quiz-handcrafted.cjs\`

Keys:

${handcraftedKeys.map((k) => `- \`${k}\``).join('\n')}

## Generator keys with \`narration:\` (${withNarration.length})

${withNarration.map((k) => `- \`${k}\``).join('\n')}

## Generator keys without narration — alt/apply only (${fallbackOnly.length})

${fallbackOnly.map((k) => `- \`${k}\``).join('\n')}
`;

writeFileSync(outMd, md, 'utf8');
console.log('Wrote', outMd);
console.log(
  JSON.stringify(
    {
      total: allKeys.length,
      handcrafted: handcraftedKeys.length,
      generator: generatorKeys.length,
      generatorWithNarration: withNarration.length,
      generatorFallbackOnly: fallbackOnly.length
    },
    null,
    2
  )
);
