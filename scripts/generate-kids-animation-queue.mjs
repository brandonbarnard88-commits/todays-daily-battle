#!/usr/bin/env node
/**
 * Builds docs/KIDS-STORY-ANIMATION-QUEUE.md from kids/kids-battle.js bibleStories.
 * One row per story: work through in order (or follow suggested waves at top).
 */
import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const battlePath = join(root, 'kids', 'kids-battle.js');
const outPath = join(root, 'docs', 'KIDS-STORY-ANIMATION-QUEUE.md');

const s = readFileSync(battlePath, 'utf8');

const startTag = 'var bibleStories = {';
const endTag = '\n  };\n\n  function getCartoonForVerse';
const si = s.indexOf(startTag);
const ei = s.indexOf(endTag);
if (si < 0 || ei < 0) {
  console.error('Could not locate bibleStories block in kids-battle.js');
  process.exit(1);
}
const bibleSlice = s.slice(si + startTag.length, ei);

/** Same top-level detector as generate-kids-full-story-assets.js (avoids kidContext: { … }). */
const storyRe = /\n    ([a-zA-Z][a-zA-Z0-9_]*): \{\n      title:/g;
const rowStarts = [];
let m;
while ((m = storyRe.exec(bibleSlice))) {
  rowStarts.push({ key: m[1], idx: m.index });
}

function kebab(k) {
  return k.replace(/([A-Z])/g, (_, c) => '-' + c.toLowerCase());
}

function parseTitle(chunk) {
  const m1 = chunk.match(/title:\s*'((?:\\'|[^'])*)'/);
  if (m1) return m1[1].replace(/\\'/g, "'").replace(/\\\\/g, '\\');
  const m2 = chunk.match(/title:\s*"((?:\\"|[^"])*)"/);
  if (m2) return m2[1].replace(/\\"/g, '"').replace(/\\\\/g, '\\');
  return '';
}

const byKey = new Map();
for (let i = 0; i < rowStarts.length; i++) {
  const { key, idx } = rowStarts[i];
  if (byKey.has(key)) continue;
  const end = i + 1 < rowStarts.length ? rowStarts[i + 1].idx : bibleSlice.length;
  const chunk = bibleSlice.slice(idx, end);
  const title = parseTitle(chunk);
  byKey.set(key, { key, title, slug: kebab(key) });
}

const stories = [...byKey.values()].sort((a, b) => a.key.localeCompare(b.key));

const suggestedFirst = ['david', 'noah', 'jonah', 'daniel', 'jesus'];

let md = `# Kids full-story animation queue (one at a time)

Auto-generated from \`kids/kids-battle.js\`. **${stories.length}** stories. Ship **one MP4 + VTT pair** per story, then append its key to \`FULL_STORY_LIVE_KEYS_SEED\` in \`scripts/generate-kids-full-story-assets.js\`, run \`npm run kids:generate-full-story-assets\`, \`npm run build\`, deploy.

Full pipeline: [\`docs/KIDS-FULL-STORY-MEDIA.md\`](./KIDS-FULL-STORY-MEDIA.md).

## Suggested first five (hub + familiar stories)

Then continue **one story at a time** down the numbered table (alphabetical by key).

`;

for (const k of suggestedFirst) {
  const st = stories.find((x) => x.key === k);
  if (!st) continue;
  md += `- **\`${st.key}\`** — ${st.title || '(no title)'} → \`${st.slug}.mp4\` + \`${st.slug}.vtt\`\n`;
}
md += '\n';

md += `## Full checklist (alphabetical by key)

Update this file by running: \`npm run kids:generate-animation-queue\`

| Done | # | Key | Files (kebab) | Title |
|------|---|-----|---------------|-------|
`;

stories.forEach((st, i) => {
  md += `| ☐ | ${i + 1} | \`${st.key}\` | \`${st.slug}.mp4\` / \`${st.slug}.vtt\` | ${String(st.title).replace(/\|/g, '\\|')} |\n`;
});

md += '\n';

writeFileSync(outPath, md, 'utf8');
console.log('Wrote', outPath.replace(root + '/', ''), '—', stories.length, 'stories.');
