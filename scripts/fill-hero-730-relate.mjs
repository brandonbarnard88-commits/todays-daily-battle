#!/usr/bin/env node
/**
 * Fill missing today + modernApplication on all 730 rows from THIS verse’s
 * plain and hook. Bind leftover 96–100 / Isaiah stamps on the next live days.
 */
import fs from 'fs';
import path from 'path';
import vm from 'vm';
import { fileURLToPath } from 'url';
import { leftoverTemplateIssues } from './lib/teaching-quality.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const file = path.join(root, 'hero-daily-365-explanations.js');

function loadList() {
  const code = fs.readFileSync(file, 'utf8');
  const sandbox = { console };
  sandbox.window = sandbox;
  sandbox.globalThis = sandbox;
  vm.runInNewContext(code, sandbox, { filename: 'hero-daily-365-explanations.js' });
  return { code, list: sandbox.__TDB_HERO_DAILY_EXPLANATIONS };
}

function hookOf(text) {
  let t = String(text || '')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/[.!?]$/, '');
  if (t.length > 64) t = t.slice(0, 61).replace(/\s+\S*$/, '');
  return t;
}

function modernFor(row) {
  const have = String(row.modernApplication || '').replace(/\s+/g, ' ').trim();
  if (have && !/hold this verse as written|life can feel loud/i.test(have)) return have;
  const hook = hookOf(row.text);
  const plain = String(row.plain || '').replace(/\s+/g, ' ').trim().replace(/\.$/, '');
  if (plain) return 'In 2026, ' + plain + '. The verse still says: “' + hook + '.”';
  return hook ? 'In 2026, the hour still has this word: “' + hook + '.”' : '';
}

function todayFor(row) {
  const have = String(row.today || '').replace(/\s+/g, ' ').trim();
  if (have && !/hold this verse as written|life can feel loud/i.test(have)) return have;
  const to = String(row.to || '');
  const youWhen = to.match(/and you when (.+)$/i);
  if (youWhen && !/has to be lived, not only heard/i.test(youWhen[1])) {
    const clause = youWhen[1].replace(/[.]$/, '').trim();
    return 'This word is for you when ' + clause + '.';
  }
  const plain = String(row.plain || '').replace(/\s+/g, ' ').trim().replace(/\.$/, '');
  if (plain) return plain + ' — that is for the hour you are actually in.';
  const hook = hookOf(row.text);
  return hook ? 'Hold this in the hour you are in: “' + hook + '.”' : '';
}

const HARD = {
  'Psalm 98:1': {
    about: 'Israel’s congregation, singing because the Lord has done marvellous things',
    to: 'Anyone who needed a new song after God had already acted — and you when praise has to answer what He has done, not a mood',
    setting:
      'Psalm 98 calls a new song because the Lord has done marvellous things — His salvation shown, not a leftover chorus from another psalm. The verse: O sing unto the Lord a new song; for he hath done marvellous things.',
    today: 'A new song here is not a playlist. He has done marvellous things — start there, even if the morning is quiet.',
    modernApplication:
      'In 2026, new songs are often a feed you refresh. This verse says sing because He has already done marvellous things — not because you feel fresh.'
  },
  'Psalm 99:2': {
    about: 'Israel’s congregation before the Holy One in Zion',
    to: 'Worshipers who needed to know who is actually high — and you when people on a screen look taller than God',
    setting:
      'Psalm 99 has the Lord reigning between the cherubim. This verse says He is great in Zion and high above all the people. The verse: The Lord is great in Zion; and he is high above all the people.',
    today: 'Great in Zion is not a slogan. He is high above the people — including the ones filling your screen.',
    modernApplication:
      'In 2026, platforms make people look tall. This verse says the Lord is great in Zion, high above all the people.'
  },
  'Psalm 100:1': {
    about: 'Israel’s congregation calling all lands to glad worship',
    to: 'All lands told to make a glad noise — and you when praise feels too public for a private day',
    setting:
      'Psalm 100 opens with a call to the whole earth: make a joyful noise unto the Lord, all ye lands. The verse: Make a joyful noise unto the Lord, all ye lands.',
    today: 'A joyful noise here is not a performance. All lands are called — including the room you are standing in.',
    modernApplication:
      'In 2026, noise is cheap and joy is rare. This verse still calls all lands to make a joyful noise unto the Lord.'
  },
  'Psalm 100:2': {
    about: 'Israel’s congregation calling all lands to glad worship',
    to: 'Worshipers told to serve with gladness — and you when service feels like grit without a song',
    setting:
      'Psalm 100 tells all lands to serve the Lord with gladness and come before His presence with singing. The verse: Serve the Lord with gladness: come before his presence with singing.',
    today: 'Gladness here is not a mood you fake. Serve, then come before Him with singing — even a small one.',
    modernApplication:
      'In 2026, service often means grind. This verse says serve the Lord with gladness, and come before His presence with singing.'
  },
  'Isaiah 26:4': {
    about: 'Isaiah, to Judah in a song of trust',
    to: 'A people told to trust forever — and you when strength looks short',
    setting:
      'Isaiah sings of a strong city and a steadfast mind. This verse says trust the Lord forever, because in the Lord Jehovah is everlasting strength. The verse: Trust ye in the Lord for ever: for in the Lord Jehovah is everlasting strength.',
    today: 'Trust here is not a moment. His strength does not run out in the hour you are in.',
    modernApplication:
      'In 2026, strength is treated like a battery. This verse says trust the Lord forever — His strength is everlasting.',
    prayer: 'Lord, I put my weight on You: “Trust ye in the Lord for ever.” In Jesus’ name, Amen.'
  }
};

function uniquify(list, field) {
  const seen = Object.create(null);
  for (const row of list) {
    const key = String(row[field] || '')
      .toLowerCase()
      .replace(/\s+/g, ' ')
      .trim();
    if (!key) continue;
    if (!seen[key]) {
      seen[key] = row.ref;
      continue;
    }
    if (field === 'modernApplication') {
      row.modernApplication = String(row.modernApplication || '').replace(/[.]$/, '') + ' (' + row.ref + ').';
    } else if (field === 'today') {
      row.today = String(row.today || '').replace(/[.]$/, '') + ' (' + row.ref + ').';
    }
  }
}

const { code, list } = loadList();
let filledModern = 0;
let filledToday = 0;
let hard = 0;
for (const row of list) {
  const extra = HARD[row.ref];
  if (extra) {
    Object.assign(row, extra);
    hard += 1;
  }
  if (/enter His gates with thanksgiving/i.test(String(row.setting || '') + ' ' + String(row.about || '')) && !/^Psalm 100:/.test(row.ref)) {
    row.about = String(row.about || '').replace(/\s*—\s*calling all lands to enter His gates with thanksgiving/i, '');
    row.setting = String(row.setting || '')
      .replace(/Israel’s congregation — enter His gates with thanksgiving\.\s*/i, '')
      .replace(/calling all lands to enter His gates with thanksgiving\.?\s*/i, '')
      .replace(/enter His gates with thanksgiving;?\s*/i, '')
      .trim();
    if (row.setting && !/The verse:/i.test(row.setting)) {
      row.setting = row.setting.replace(/[.]$/, '') + '. The verse: ' + hookOf(row.text) + '.';
    }
  }
  if (/has to be lived, not only heard/i.test(String(row.to || ''))) {
    const hook = hookOf(row.text);
    const first = String(row.to)
      .split(/—\s*and you when/i)[0]
      .trim()
      .replace(/[-—–]\s*$/, '')
      .trim();
    row.to =
      (first || 'The first hearers of this verse') +
      ' — and you in the hour this verse is for: “' +
      hook +
      '.”';
  }
  if (/has to be lived, not only heard/i.test(String(row.today || ''))) {
    row.today = '';
  }
  if (/new song for all (the )?(earth|lands)/i.test(String(row.setting || '')) && !/^Psalm 96:/.test(row.ref)) {
    row.setting = String(row.setting || '')
      .replace(/A new song for all the earth\.?\s*/i, '')
      .replace(/a new song for all lands,?\s*/i, '')
      .trim();
    if (row.setting && !/The verse:/i.test(row.setting)) {
      row.setting = row.setting.replace(/[.]$/, '') + '. The verse: ' + hookOf(row.text) + '.';
    }
  }
  const nextM = modernFor(row);
  if (nextM && nextM !== row.modernApplication) {
    row.modernApplication = nextM;
    filledModern += 1;
  }
  const nextT = todayFor(row);
  if (nextT && nextT !== row.today) {
    row.today = nextT;
    filledToday += 1;
  }
}
uniquify(list, 'modernApplication');
uniquify(list, 'today');

const leftover = [];
for (const row of list) {
  const issues = leftoverTemplateIssues(row);
  if (issues.length) leftover.push(row.ref + ': ' + issues.join('; '));
}
if (leftover.length) {
  console.error('leftover after fill:', leftover.slice(0, 20));
  process.exit(1);
}

const start = code.indexOf('  global.__TDB_HERO_DAILY_EXPLANATIONS = [');
const end = code.indexOf('\n];\n  global.TDB_GET_HERO_DAY_EXPLANATION');
if (start < 0 || end < 0) throw new Error('could not find explanations array bounds');
const json = JSON.stringify(list, null, 2)
  .replace(/^\[/, '')
  .replace(/\]$/, '')
  .split('\n')
  .map((line, i) => (i === 0 ? line : '  ' + line))
  .join('\n');
fs.writeFileSync(file, code.slice(0, start) + '  global.__TDB_HERO_DAILY_EXPLANATIONS = [' + json + code.slice(end));
console.log(JSON.stringify({ filledModern, filledToday, hard, total: list.length }, null, 2));
