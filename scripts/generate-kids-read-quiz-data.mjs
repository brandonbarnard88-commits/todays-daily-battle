#!/usr/bin/env node
/**
 * Generates kids/kids-read-quiz-data.js from kids/kids-battle.js bibleStories
 * (same unique keys as bibleStories in kids-battle.js / animation queue).
 * Hand-tuned packs live in kids/read-quiz-handcrafted.cjs (david, noah, jonah, daniel).
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
const outPath = join(root, 'kids', 'kids-read-quiz-data.js');

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

const storyRe = /\n    ([a-zA-Z][a-zA-Z0-9_]*): \{\n      title:/g;
const rowStarts = [];
let m;
while ((m = storyRe.exec(bibleSlice))) {
  rowStarts.push({ key: m[1], idx: m.index });
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
  byKey.set(key, bibleSlice.slice(idx, end));
}

const SILLY = [
  'A spaceship landed in the parking lot.',
  'Everyone decided to never sleep again.',
  'A talking toaster became king of the city.',
  'People only ate dessert for forty years.',
  'The river turned into grape juice forever.',
  'A giant robot built the temple in one minute.'
];

const WRONG_LESSONS = [
  'God never hears when kids pray.',
  'The Bible is only pretend stories.',
  'We should hide from God when we mess up.',
  'Being kind only matters on birthdays.'
];

function hashSeed(str) {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = (Math.imul(31, h) + str.charCodeAt(i)) | 0;
  }
  return h >>> 0;
}

function shuffleIndices(n, seedStr) {
  const order = Array.from({ length: n }, (_, i) => i);
  let h = hashSeed(seedStr);
  for (let i = n - 1; i > 0; i--) {
    h = (Math.imul(1103515245, h) + 12345) >>> 0;
    const j = h % (i + 1);
    [order[i], order[j]] = [order[j], order[i]];
  }
  return order;
}

function distinctStrings(preferred, pool, need, exclude) {
  const seen = new Set();
  (exclude || []).forEach((x) => {
    if (x) seen.add(x);
  });
  const out = [];
  for (const p of preferred) {
    if (p && !seen.has(p)) {
      seen.add(p);
      out.push(p);
      if (out.length >= need) return out;
    }
  }
  for (const p of pool) {
    if (p && !seen.has(p)) {
      seen.add(p);
      out.push(p);
      if (out.length >= need) return out;
    }
  }
  let i = 0;
  while (out.length < need) {
    out.push('Option ' + String.fromCharCode(88 + i));
    i++;
  }
  return out.slice(0, need);
}

function shuffleChoices(correct, wrongs, seedStr) {
  const wrongsU = distinctStrings(wrongs, SILLY.concat(WRONG_LESSONS), 3, [correct]);
  const arr = [correct, ...wrongsU];
  const order = shuffleIndices(arr.length, seedStr);
  const choices = order.map((i) => arr[i]);
  const correctIndex = choices.indexOf(correct);
  return { choices, correctIndex };
}

function readQuoted(s, start) {
  const q = s[start];
  if (q !== "'" && q !== '"') return { text: '', end: start };
  let i = start + 1;
  let out = '';
  while (i < s.length) {
    const c = s[i];
    if (c === '\\') {
      i++;
      out += s[i] || '';
      i++;
      continue;
    }
    if (c === q) return { text: out, end: i + 1 };
    out += c;
    i++;
  }
  return { text: out, end: i };
}

function extractProp(chunk, name) {
  const re = new RegExp('\\b' + name + ':');
  const fm = chunk.match(re);
  if (!fm) return '';
  const pos = fm.index + fm[0].length;
  const rest = chunk.slice(pos).trimStart();
  const r = readQuoted(rest, 0);
  return r.text;
}

function parseKidContextBlock(chunk) {
  const i = chunk.indexOf('kidContext:');
  if (i < 0) return { who: '', to: '', apply: '' };
  let j = chunk.indexOf('{', i);
  if (j < 0) return { who: '', to: '', apply: '' };
  let depth = 0;
  let k = j;
  for (; k < chunk.length; k++) {
    if (chunk[k] === '{') depth++;
    else if (chunk[k] === '}') {
      depth--;
      if (depth === 0) {
        k++;
        break;
      }
    }
  }
  const inner = chunk.slice(j + 1, k - 1);
  return {
    who: extractProp(inner, 'who'),
    to: extractProp(inner, 'to'),
    apply: extractProp(inner, 'apply')
  };
}

function extractNarration(chunk) {
  const i = chunk.indexOf('narration:');
  if (i < 0) return '';
  const rest = chunk.slice(i + 'narration:'.length).trimStart();
  const r = readQuoted(rest, 0);
  return r.text;
}

function extractKjvRef(chunk) {
  return extractProp(chunk, 'kjvRef') || 'the Bible';
}

function extractPanelAlts(chunk) {
  const alts = [];
  let pos = 0;
  while (true) {
    const i = chunk.indexOf('alt:', pos);
    if (i < 0) break;
    const rest = chunk.slice(i + 4).trimStart();
    const r = readQuoted(rest, 0);
    if (r.text) alts.push(r.text);
    pos = i + 4;
  }
  return alts;
}

function extractKeywords(chunk) {
  const m = chunk.match(/keywords:\s*\[([\s\S]*?)\]/);
  if (!m) return [];
  const inner = m[1];
  const out = [];
  const re = /'((?:\\.|[^'\\])*)'/g;
  let mm;
  while ((mm = re.exec(inner))) {
    out.push(mm[1].replace(/\\'/g, "'"));
  }
  return out;
}

function shortenWho(w) {
  if (!w) return "God's people";
  const cut = w.split(/[,(]/)[0].trim();
  return cut.length > 42 ? cut.slice(0, 39) + '…' : cut;
}

function splitSentences(text) {
  const t = text.replace(/\s+/g, ' ').trim();
  if (!t) return [];
  const parts = t.split(/(?<=[.!?])\s+/).filter((x) => x.length > 2);
  return parts.length ? parts : [t];
}

function buildParagraphs(title, kjvRef, narration, apply, who, to) {
  let body = (narration || '').trim();
  if (!body) {
    body =
      `${title}. We read about this in ${kjvRef}. ` +
      (apply ||
        "God's Word shows us who He is and how we can trust Him every day.") +
      (who && to
        ? ` We learn from ${shortenWho(who)} and how God cares for ${shortenWho(to)}.`
        : '');
  }
  body = body.replace(/\s+/g, ' ').trim();
  let sentences = splitSentences(body);
  if (sentences.length < 6) {
    const extra = splitSentences(
      apply ||
        'We can talk to God in prayer. We can remember what the Bible says is true. God is good and He keeps His promises.'
    );
    sentences = [...sentences, ...extra.filter((x) => !sentences.includes(x))];
  }
  if (sentences.length < 5) {
    sentences.push(
      'Even when we feel small, God sees us and loves us.',
      'Praying helps our hearts remember what is true.',
      'We can obey God one step at a time with His help.'
    );
  }
  const target = 5;
  const paras = [];
  let idx = 0;
  const n = sentences.length;
  for (let p = 0; p < target; p++) {
    const remaining = target - p;
    const take = Math.max(1, Math.ceil((n - idx) / remaining));
    const part = sentences.slice(idx, idx + take).join(' ');
    paras.push(part.trim());
    idx += take;
  }
  return paras.map((p) => (p.endsWith('.') || p.endsWith('!') || p.endsWith('?') ? p : p + '.'));
}

function forYouPart(narration) {
  const i = narration.indexOf('For you:');
  if (i < 0) return '';
  return narration.slice(i + 'For you:'.length).trim();
}

function pickWrongRefs(allRefs, current, key, n) {
  const pool = [...new Set(allRefs)].filter((r) => r && r !== current);
  const h = hashSeed(key + '-refs');
  const out = [];
  const used = new Set();
  let tries = 0;
  while (out.length < n && pool.length > 0 && tries < pool.length * 4) {
    const idx = (h + tries * 17) % pool.length;
    const r = pool[idx];
    if (!used.has(r)) {
      used.add(r);
      out.push(r);
    }
    tries++;
  }
  const fallback = ['Psalm 23', 'John 3:16', 'Genesis 1:1', 'Romans 8:28', 'Acts 1:8', 'Isaiah 40:8'];
  let fi = 0;
  while (out.length < n) {
    const r = fallback[fi % fallback.length];
    fi++;
    if (r !== current && !used.has(r)) {
      used.add(r);
      out.push(r);
    }
  }
  return out.slice(0, n);
}

function pickWrongWhos(allWhos, current, key, n) {
  const cur = shortenWho(current);
  const pool = [...new Set(allWhos.map(shortenWho))].filter((w) => w && w !== cur && w.length < 40);
  const h = hashSeed(key + '-who');
  const out = [];
  const used = new Set();
  let tries = 0;
  while (out.length < n && pool.length > 0 && tries < pool.length * 4) {
    const idx = (h + tries * 13) % pool.length;
    const w = pool[idx];
    if (!used.has(w)) {
      used.add(w);
      out.push(w);
    }
    tries++;
  }
  const fallback = [
    'A shepherd in a field',
    'A traveler on the road',
    'A worker in the market',
    'A child at home',
    'A teacher by the river',
    'Friends praying together'
  ];
  let fi = 0;
  while (out.length < n) {
    const w = fallback[fi % fallback.length];
    fi++;
    if (w !== cur && !used.has(w)) {
      used.add(w);
      out.push(w);
    }
  }
  return out.slice(0, n);
}

function truncate(s, max) {
  if (s.length <= max) return s;
  const cut = s.slice(0, max - 1);
  const sp = cut.lastIndexOf(' ');
  return (sp > 40 ? cut.slice(0, sp) : cut) + '…';
}

function buildImagePrompts(title, panelAlts, keywords) {
  const style =
    'Hand-drawn bouncy cartoon for kids, KJV Bible-story mood, soft blues and gold accents, friendly not scary, no text in image: ';
  const base = panelAlts.length
    ? panelAlts
    : [
        `Opening scene — ${title}`,
        `Middle moment — ${title}`,
        `Hopeful ending — ${title}`
      ];
  const five = [];
  for (let i = 0; i < 5; i++) {
    const alt = base[i % base.length];
    const kw = keywords[i % keywords.length];
    five.push(style + alt + (kw ? ` (${kw})` : ''));
  }
  return five;
}

function buildPack(key, chunk, meta) {
  const title = parseTitle(chunk) || key;
  const kjvRef = extractKjvRef(chunk);
  const narration = extractNarration(chunk);
  const { who, to, apply } = parseKidContextBlock(chunk);
  const keywords = extractKeywords(chunk);
  const panelAlts = extractPanelAlts(chunk);
  const paragraphs = buildParagraphs(title, kjvRef, narration, apply, who, to);
  const fy = forYouPart(narration);
  const lessonLine = truncate(apply || fy || 'God loves us and we can trust Him.', 140);
  const appLine = truncate(
    fy || apply || 'Talk to God today and take one small step of obedience.',
    120
  );

  const mainWho = shortenWho(who) || title.split(/[&–-]/)[0].trim() || "God's people";

  const q1 = shuffleChoices(
    kjvRef,
    pickWrongRefs(meta.allKjvRefs, kjvRef, key, 3),
    key + '-q1'
  );
  const q2 = shuffleChoices(
    mainWho,
    pickWrongWhos(meta.allWhos, who || mainWho, key, 3),
    key + '-q2'
  );
  const q3 = shuffleChoices(
    lessonLine,
    WRONG_LESSONS,
    key + '-q3'
  );

  const detailCorrect = truncate(
    panelAlts[0] || paragraphs[0] || narration || title || 'This Bible story',
    100
  );
  const q4 = shuffleChoices(detailCorrect, SILLY, key + '-q4');

  const q5 = shuffleChoices(
    appLine,
    [
      'Ignore God until we are older.',
      'Only be kind to people who are exactly like us.',
      'Never say sorry when we do wrong.'
    ],
    key + '-q5'
  );

  const questions = [
    {
      question: 'Where is this story found in the Bible?',
      choices: q1.choices,
      correctIndex: q1.correctIndex,
      correctFeedback: "Yes—that matches this story's place in God's Word.",
      wrongFeedback:
        'Skim the line under the title in the story block, or check the first paragraph’s Bible note. (Answer: ' +
        kjvRef +
        '.)'
    },
    {
      question: 'Who do we mainly learn from or watch in this story?',
      choices: q2.choices,
      correctIndex: q2.correctIndex,
      correctFeedback: 'Right—keep that person (or group) in mind as you think about God.',
      wrongFeedback:
        'Look for who the story follows first—names in the title often help. (Answer: ' + mainWho + '.)'
    },
    {
      question: 'Which choice sounds most like what this story teaches?',
      choices: q3.choices,
      correctIndex: q3.correctIndex,
      correctFeedback: 'Exactly—that lines up with the story and the “For you” heart of it.',
      wrongFeedback:
        "Reread the last paragraph slowly. Which option matches God's kindness and truth? (Answer: " +
        truncate(lessonLine, 90) +
        '.)'
    },
    {
      question: 'Which detail belongs in this Bible story (not a silly made-up one)?',
      choices: q4.choices,
      correctIndex: q4.correctIndex,
      correctFeedback: 'Yes—that detail comes from the story God gave us.',
      wrongFeedback:
        'Cross out the joke answers. Which one matches the comic pictures or the paragraphs you read? (Answer: the story detail, not the silly line.)'
    },
    {
      question: 'What is one good way to respond to God after this story?',
      choices: q5.choices,
      correctIndex: q5.correctIndex,
      correctFeedback: 'Beautiful—that is faith with feet: small, real, and pleasing to God.',
      wrongFeedback:
        'Think: does this choice show trust, kindness, or saying sorry to God? Pick the one that honors Him. (Answer: ' +
        truncate(appLine, 90) +
        '.)'
    }
  ];

  return {
    kjvRef,
    hintAboveQuiz: 'Use the comic pictures above while you read.',
    paragraphs,
    quizHeading: 'Quiz — think it through',
    questions,
    doneHeading: 'You did it!',
    doneMessage: "Great job reading " + title + " with God's Word today.",
    takeaway: truncate(apply || lessonLine, 200),
    prayer:
      'God, thank You for the Bible. Help me remember what You showed me in ' +
      title +
      '. Amen.',
    imagePrompts: buildImagePrompts(title, panelAlts, keywords)
  };
}

const storyEntries = [...byKey.entries()].sort((a, b) => a[0].localeCompare(b[0]));
const allKjvRefs = storyEntries.map(([, ch]) => extractKjvRef(ch));
const allWhos = storyEntries.map(([, ch]) => parseKidContextBlock(ch).who).filter(Boolean);

const meta = { allKjvRefs, allWhos };
const merged = {};

for (const [key] of storyEntries) {
  if (HANDCRAFTED[key]) {
    merged[key] = HANDCRAFTED[key];
    continue;
  }
  const chunk = byKey.get(key);
  merged[key] = buildPack(key, chunk, meta);
}

const keys = Object.keys(merged).sort((a, b) => a.localeCompare(b));
const jsonBody = JSON.stringify(merged, null, 2);

const header = `/**
 * Read-aloud story blocks + multiple-choice quiz (pedagogical wrong-answer hints).
 * Keys match TDB_BIBLE_STORIES (${keys.length} stories).
 * Regenerate: npm run kids:generate-read-quiz
 * Hand-tuned packs: kids/read-quiz-handcrafted.cjs (david, noah, jonah, daniel).
 */
`;

/** Same decode-first behavior as kids-battle.js tdbPlainTextForUi — run once at load on all packs. */
const READ_QUIZ_NORMALIZE_UI = `
  function _tdbPlainTextForUiReadQuiz(s) {
    if (s == null || s === '') return '';
    var str = String(s);
    var prev;
    for (var n = 0; n < 12; n++) {
      prev = str;
      str = str.replace(/&amp;/g, '&');
      if (str === prev) break;
    }
    try {
      var t = document.createElement('textarea');
      t.innerHTML = str;
      var out = t.value;
      if (typeof out === 'string') return out;
    } catch (_) {}
    return str;
  }
  function _normalizeTdbKidsReadQuizInPlace(rq) {
    if (!rq || typeof rq !== 'object') return;
    var rk = Object.keys(rq);
    for (var ri = 0; ri < rk.length; ri++) {
      var pack = rq[rk[ri]];
      if (!pack || typeof pack !== 'object') continue;
      if (pack.kjvRef != null) pack.kjvRef = _tdbPlainTextForUiReadQuiz(pack.kjvRef);
      if (pack.hintAboveQuiz != null) pack.hintAboveQuiz = _tdbPlainTextForUiReadQuiz(pack.hintAboveQuiz);
      if (pack.quizHeading != null) pack.quizHeading = _tdbPlainTextForUiReadQuiz(pack.quizHeading);
      if (pack.doneHeading != null) pack.doneHeading = _tdbPlainTextForUiReadQuiz(pack.doneHeading);
      if (pack.doneMessage != null) pack.doneMessage = _tdbPlainTextForUiReadQuiz(pack.doneMessage);
      if (pack.takeaway != null) pack.takeaway = _tdbPlainTextForUiReadQuiz(pack.takeaway);
      if (pack.prayer != null) pack.prayer = _tdbPlainTextForUiReadQuiz(pack.prayer);
      if (Array.isArray(pack.paragraphs)) {
        for (var pj = 0; pj < pack.paragraphs.length; pj++) {
          pack.paragraphs[pj] = _tdbPlainTextForUiReadQuiz(pack.paragraphs[pj]);
        }
      }
      if (Array.isArray(pack.imagePrompts)) {
        for (var ip = 0; ip < pack.imagePrompts.length; ip++) {
          pack.imagePrompts[ip] = _tdbPlainTextForUiReadQuiz(pack.imagePrompts[ip]);
        }
      }
      if (Array.isArray(pack.questions)) {
        for (var qi = 0; qi < pack.questions.length; qi++) {
          var q = pack.questions[qi];
          if (!q || typeof q !== 'object') continue;
          if (q.question != null) q.question = _tdbPlainTextForUiReadQuiz(q.question);
          if (q.correctFeedback != null) q.correctFeedback = _tdbPlainTextForUiReadQuiz(q.correctFeedback);
          if (q.wrongFeedback != null) q.wrongFeedback = _tdbPlainTextForUiReadQuiz(q.wrongFeedback);
          if (Array.isArray(q.choices)) {
            for (var ci = 0; ci < q.choices.length; ci++) {
              q.choices[ci] = _tdbPlainTextForUiReadQuiz(q.choices[ci]);
            }
          }
        }
      }
    }
  }
  _normalizeTdbKidsReadQuizInPlace(global.TDB_KIDS_READ_QUIZ);
`;

const file =
  header +
  `(function (global) {
  'use strict';

  global.TDB_KIDS_READ_QUIZ = ${jsonBody};
` +
  READ_QUIZ_NORMALIZE_UI +
  `})(typeof window !== 'undefined' ? window : this);
`;

writeFileSync(outPath, file, 'utf8');
console.log('Wrote', outPath, '—', keys.length, 'story keys');
