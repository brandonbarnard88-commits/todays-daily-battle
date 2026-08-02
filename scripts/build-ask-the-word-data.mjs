#!/usr/bin/env node
/**
 * Build Ask the Word offline data:
 * - data/ask-the-word-answers.json (from script.js TDB_BIBLICAL_ANSWERS + extras)
 * - data/kjv-verses.json (array form of data/kjv-full.json)
 * - data/ask-the-word-knowledge.json
 * - data/ask-the-word-verse-pocket.json
 * - root ask-the-word-answers.json
 * - supabase/functions/bible-qa/knowledge.json + verse-pocket.json
 *
 * Run: node scripts/build-ask-the-word-data.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');

const EXTRA_PACKS = [
  {
    id: 'why-did-jesus-weep',
    type: 'knowledge',
    triggers: [
      'why did jesus weep', 'why does jesus weep', 'jesus wept why', 'why did jesus cry',
      'shortest verse in the bible', 'what is the shortest verse', 'john 11:35',
      'why was jesus weeping', 'jesus wept meaning', 'why jesus wept at lazarus'
    ],
    answer: 'John 11:35 simply says "Jesus wept." He stood at the tomb of His friend Lazarus, with Mary and Martha grieving, and He entered their sorrow even though He was about to raise Lazarus. His tears show that the Son of God is not distant from real loss. Isaiah 53:3 calls Him "a man of sorrows, and acquainted with grief." The verse is short; the comfort is deep: God does not scold honest tears — He shares them, and He still holds resurrection hope.',
    verses: ['John 11:35', 'John 11:33', 'Isaiah 53:3', 'Hebrews 4:15'],
    plan: 'griefhope',
    prayer: 'Lord Jesus, thank You that You weep with those who weep. Meet me in this grief and hold me in Your hope. Amen.'
  },
  {
    id: 'dinosaurs-creation',
    type: 'knowledge',
    triggers: [
      'what does the bible say about dinosaurs', 'dinosaurs in the bible', 'are dinosaurs in the bible',
      'bible and dinosaurs', 'did dinosaurs exist bible', 'creation dinosaurs', 'behemoth dinosaur'
    ],
    answer: 'The Bible does not use the modern word "dinosaur." It does speak clearly of God as Creator of all things: "In the beginning God created the heaven and the earth" (Genesis 1:1). Job describes great creatures such as behemoth and leviathan (Job 40–41) in poetic, awe-filled language — not a modern field guide. Stay honest: Scripture centers on who made the world and why we exist, not on every scientific category.',
    verses: ['Genesis 1:1', 'Genesis 1:21', 'Job 40:15', 'Psalm 104:24', 'John 1:3'],
    plan: null,
    prayer: 'Lord, keep me under what You have actually said. Give me wonder at Your creation and humility where mystery remains. Amen.'
  }
];

function extractAnswersFromScript() {
  const s = fs.readFileSync(path.join(root, 'script.js'), 'utf8');
  const start = s.indexOf('TDB_BIBLICAL_ANSWERS = [');
  if (start < 0) throw new Error('TDB_BIBLICAL_ANSWERS not found');
  let depth = 0;
  let end = -1;
  const bracketStart = s.indexOf('[', start);
  for (let i = bracketStart; i < s.length; i++) {
    if (s[i] === '[') depth++;
    else if (s[i] === ']') {
      depth--;
      if (depth === 0) {
        end = i;
        break;
      }
    }
  }
  if (end < 0) throw new Error('Could not close TDB_BIBLICAL_ANSWERS');
  const arrSrc = s.slice(bracketStart, end + 1);
  return Function('"use strict"; return (' + arrSrc + ');')();
}

function resolveText(full, ref) {
  if (!ref) return '';
  const r = String(ref).trim();
  if (full[r]) return full[r];
  if (r.startsWith('Psalms ')) {
    const alt = 'Psalm ' + r.slice(7);
    if (full[alt]) return full[alt];
  }
  if (r.startsWith('Psalm ')) {
    const alt = 'Psalms ' + r.slice(6);
    if (full[alt]) return full[alt];
  }
  const m = r.match(/^(.+?\s\d+:\d+)-\d+$/);
  if (m && full[m[1]]) return full[m[1]];
  return '';
}

function main() {
  const full = JSON.parse(fs.readFileSync(path.join(root, 'data', 'kjv-full.json'), 'utf8'));
  let answers = extractAnswersFromScript();
  // Avoid exact-phrase collisions (e.g. Paul pack vs who-wrote-romans)
  function stripRomansCollision(entry) {
    if (!entry || (entry.id !== 'who-was-paul-apostle' && entry.id !== 'who-was-paul')) return entry;
    entry.triggers = (entry.triggers || []).filter((t) => {
      const n = String(t).toLowerCase().trim();
      return n !== 'who wrote romans' && n !== 'who wrote the book of romans' && n !== 'author of romans';
    });
    return entry;
  }
  answers = answers.map(stripRomansCollision);
  const byId = new Map(answers.map((a) => [a.id, a]));
  for (const e of EXTRA_PACKS) {
    if (!byId.has(e.id)) {
      answers.push(e);
      byId.set(e.id, e);
    }
  }

  const enriched = answers.map((entry) => {
    const verseObjs = (entry.verses || []).map((ref) => {
      const r = typeof ref === 'string' ? ref : ref?.ref;
      const text = (typeof ref === 'object' && ref?.text) || resolveText(full, r);
      return { ref: r, text };
    }).filter((v) => v.ref);
    return {
      id: entry.id,
      type: entry.type || 'life',
      triggers: entry.triggers || [],
      answer: entry.answer || '',
      verses: verseObjs,
      sources: verseObjs.map((v) => v.ref),
      plan: entry.plan || null,
      lesson: entry.lesson || null,
      prayer: entry.prayer || entry.prayer_prompt || null
    };
  });

  fs.mkdirSync(path.join(root, 'data'), { recursive: true });
  fs.writeFileSync(path.join(root, 'data', 'ask-the-word-answers.json'), JSON.stringify(enriched));
  fs.writeFileSync(path.join(root, 'ask-the-word-answers.json'), JSON.stringify(enriched));

  const ordered = Object.keys(full).map((ref) => ({ ref, text: full[ref] }));
  fs.writeFileSync(path.join(root, 'data', 'kjv-verses.json'), JSON.stringify(ordered));

  const knowledge = enriched.filter(
    (e) => e.type === 'knowledge' || (e.triggers || []).some((t) => /^(who|what|why|how|where|when)\b/i.test(t))
  );
  fs.writeFileSync(path.join(root, 'data', 'ask-the-word-knowledge.json'), JSON.stringify(knowledge));

  const refSet = new Map();
  for (const e of enriched) {
    for (const v of e.verses || []) {
      if (v.ref && v.text) refSet.set(v.ref, v.text);
    }
  }
  const anchors = [
    'John 3:16', 'John 11:35', 'John 14:6', 'Ephesians 2:8', 'Romans 8:28', 'Genesis 1:1',
    'Psalm 23:1', 'Matthew 11:28', 'Philippians 4:6', 'Philippians 4:7', 'Ruth 1:16',
    'Isaiah 41:10', '1 Peter 5:7', 'Romans 10:9', 'Acts 16:31', 'John 1:1', 'Romans 3:23'
  ];
  for (const r of anchors) {
    const t = resolveText(full, r);
    if (t) refSet.set(r, t);
  }
  const pocket = [...refSet.entries()].map(([ref, text]) => ({ ref, text }));
  fs.writeFileSync(path.join(root, 'data', 'ask-the-word-verse-pocket.json'), JSON.stringify(pocket));

  const edgeDir = path.join(root, 'supabase', 'functions', 'bible-qa');
  fs.mkdirSync(edgeDir, { recursive: true });
  fs.writeFileSync(path.join(edgeDir, 'knowledge.json'), JSON.stringify(knowledge));
  fs.writeFileSync(path.join(edgeDir, 'verse-pocket.json'), JSON.stringify(pocket));

  console.log('Ask the Word data built:', {
    answers: enriched.length,
    knowledge: knowledge.length,
    pocket: pocket.length,
    kjvVerses: ordered.length
  });
}

main();
