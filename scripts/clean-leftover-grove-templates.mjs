#!/usr/bin/env node
/**
 * Strip leftover Grove templates from the 730 explanation rows.
 * Writes hero-daily-365-explanations.js in place.
 */
import fs from 'fs';
import path from 'path';
import vm from 'vm';
import { fileURLToPath } from 'url';
import { modernizeKjvText } from './lib/hero-layman-plain.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const file = path.join(root, 'hero-daily-365-explanations.js');

const LEFTOVER_WHEN = [
  'praise has to last past the morning',
  'love feels like a mood you cannot make',
  'you need somewhere that will hold',
  'you only have light for the next step',
  'gladness feels like a command you cannot feel',
  'you have no more push left',
  'your mind will not sit down',
  'hope has worn thin',
  'the Father feels hidden',
  'you are tired of forcing the next thing',
  'you need to be tended, not driven',
  'you need a path, not a feeling',
  'you need rescue that is still good today',
  'the request is still in your chest',
  'your own mind looks smarter than trust',
  'the heart is still broken',
  'you cannot sleep',
  'the day has not started clean',
  'you have forgotten who you are',
  'the next person will get your sharp edge',
  'the tears are still here',
  'you need someone else to hold you steady',
  'fear is loud',
  'mercy still has to reach you today'
];

const PET1 = {
  '1 Peter 1:8':
    'Peter writes to elect exiles who love Christ without seeing Him. The verse: Whom having not seen, ye love; in whom, though now ye see him not, yet believing, ye rejoice.',
  '1 Peter 1:13':
    'Peter tells elect exiles to gird up their minds and hope to the end for the grace at the revelation of Jesus Christ. The verse: gird up the loins of your mind, be sober, and hope to the end.',
  '1 Peter 1:16':
    'Peter writes to elect exiles the holiness charge of Leviticus. The verse: Be ye holy; for I am holy.'
};

const HARD_PLAIN = {
  '1 Corinthians 6:19':
    'Your body is the temple of the Holy Ghost which is in you, which you have of God — you are not your own.'
};

const HARD_SET_EXTRA = {
  '1 Corinthians 6:19':
    'Paul writes Corinth about holiness in a pagan city. The verse: know ye not that your body is the temple of the Holy Ghost which is in you?'
};

const PET2 = {
  '1 Peter 2:2':
    'Peter tells elect exiles to desire the sincere milk of the word, as newborn babes. The verse: desire the sincere milk of the word, that ye may grow thereby.',
  '1 Peter 2:24':
    'Peter writes that Christ bare our sins in His own body on the tree, that we being dead to sins should live unto righteousness. The verse: by whose stripes ye were healed.'
};

function firstClause(s, max) {
  let t = String(s || '').replace(/\s+/g, ' ').trim();
  const cut = t.split(/(?<=[.!?;:])\s+/)[0] || t;
  t = cut.length <= max ? cut : cut.slice(0, max).replace(/\s+\S*$/, '');
  return t.replace(/\s+/g, ' ').trim();
}

function hookOf(text, n) {
  return firstClause(text, n || 48).replace(/[.!?]$/, '');
}

function cleanSetting(row) {
  if (HARD_SET_EXTRA[row.ref]) return HARD_SET_EXTRA[row.ref];
  if (PET1[row.ref]) return PET1[row.ref];
  if (PET2[row.ref]) return PET2[row.ref];
  let s = String(row.setting || '').replace(/\s+/g, ' ').trim();
  s = s.replace(/\s*This verse is the [a-z]+(?: [a-z]+){0,4}:\s*/gi, ' The verse: ');
  s = s.replace(/\s*Here the [a-z]+ is this:\s*/gi, ' The verse: ');
  if (/^1 Peter 1:/.test(row.ref)) {
    s = s.replace(
      /Peter encourages elect exiles: living hope, holy living, and Christ the cornerstone\.\s*/i,
      'Peter writes to elect exiles about living hope and holy living. '
    );
  }
  s = s.replace(/,\./g, '.').replace(/\s+/g, ' ').trim();
  if (!/\bThe verse:/i.test(s) && row.text) {
    s = (s.replace(/[.!?]$/, '') + '. The verse: ' + hookOf(row.text, 70) + '.').replace(/\s+/g, ' ').trim();
  }
  return s;
}

function cleanTo(row) {
  let to = String(row.to || '').replace(/\s+/g, ' ').trim();
  const hook = hookOf(row.text, 42);
  const lived = '“' + hook + '” has to be lived, not only heard';
  to = to.replace(/ — and you when you need to hear “([^”]+)”\.?$/i, ' — and you when ' + lived);
  LEFTOVER_WHEN.forEach((w) => {
    const re = new RegExp(w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'ig');
    if (re.test(to)) to = to.replace(re, lived);
  });
  return to.replace(/\s+/g, ' ').trim();
}

function cleanPlain(row) {
  if (HARD_PLAIN[row.ref]) return HARD_PLAIN[row.ref];
  let p = String(row.plain || '').replace(/\s+/g, ' ').trim();
  p = p.replace(/,\./g, '.');
  if (!/take the verse as it stands/i.test(p) && p.length >= 12) return p;
  const modern = firstClause(modernizeKjvText(row.text || p), 110).replace(/[.!?]$/, '');
  if (modern.length >= 18) return modern + '.';
  return firstClause(row.text || p, 110).replace(/[.!?]$/, '') + '.';
}

function cleanPrayer(row) {
  let pr = String(row.prayer || '').replace(/\s+/g, ' ').trim();
  if (!pr) return pr;
  if (/Lord, I set these words before You:/i.test(pr) && !/from [1-3]?\s?[A-Za-z]/.test(pr)) {
    const q = (pr.match(/[“"]([^”"]+)[”"]/) || [])[1] || hookOf(row.text, 48);
    pr =
      'Lord, I set these words before You from ' +
      row.ref +
      ': “' +
      String(q).replace(/[.!?]$/, '') +
      '.” In Jesus’ name, Amen.';
    return pr;
  }
  if (/Lord, i bless/i.test(pr)) {
    const q = (pr.match(/[“"]([^”"]+)[”"]/) || [])[1] || hookOf(row.text, 48);
    return (
      'Lord, I set these words before You from ' +
      row.ref +
      ': “' +
      q.replace(/[.!?]$/, '') +
      '.” In Jesus’ name, Amen.'
    );
  }
  return pr;
}

const code = fs.readFileSync(file, 'utf8');
const sandbox = { console, window: {}, globalThis: {} };
sandbox.window = sandbox;
sandbox.globalThis = sandbox;
vm.runInNewContext(code, sandbox, { filename: 'hero-daily-365-explanations.js' });
const list = sandbox.__TDB_HERO_DAILY_EXPLANATIONS;

let n = { set: 0, to: 0, plain: 0, pray: 0 };
for (const row of list) {
  const s = cleanSetting(row);
  if (s !== row.setting) {
    row.setting = s;
    n.set += 1;
  }
  const t = cleanTo(row);
  if (t !== row.to) {
    row.to = t;
    n.to += 1;
  }
  const p = cleanPlain(row);
  if (p !== row.plain) {
    row.plain = p;
    n.plain += 1;
  }
  const pr = cleanPrayer(row);
  if (pr !== row.prayer) {
    row.prayer = pr;
    n.pray += 1;
  }
}

function keyOf(s) {
  return String(s || '')
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trim();
}

function uniquifyField(field) {
  const buckets = new Map();
  for (const row of list) {
    const k = keyOf(row[field]);
    if (!k) continue;
    if (!buckets.has(k)) buckets.set(k, []);
    buckets.get(k).push(row);
  }
  for (const rows of buckets.values()) {
    if (rows.length < 2) continue;
    rows.forEach((row) => {
      const extra = hookOf(row.text, 80);
      if (field === 'to') {
        row.to = String(row.to || '').replace(/[.]$/, '') + ' — ' + extra + ' (' + row.ref + ').';
      } else if (field === 'prayer') {
        row.prayer = String(row.prayer || '').replace(/ Amen\.?$/i, '') + ' (' + row.ref + '). Amen.';
      } else if (field === 'setting') {
        row.setting = String(row.setting || '').replace(/[.]$/, '') + ' (' + row.ref + ').';
      } else if (field === 'plain') {
        row.plain = String(row.plain || '').replace(/[.]$/, '') + ' (' + row.ref + ').';
      }
      n[field === 'prayer' ? 'pray' : field === 'setting' ? 'set' : field === 'plain' ? 'plain' : 'to'] += 1;
    });
  }
}

uniquifyField('to');
uniquifyField('prayer');
uniquifyField('setting');
uniquifyField('plain');

const start = code.indexOf('  global.__TDB_HERO_DAILY_EXPLANATIONS = [');
const end = code.indexOf('\n];\n  global.TDB_GET_HERO_DAY_EXPLANATION');
if (start < 0 || end < 0) throw new Error('could not find explanations array bounds');
const json = JSON.stringify(list, null, 2)
  .replace(/^\[/, '')
  .replace(/\]$/, '')
  .split('\n')
  .map((line, i) => (i === 0 ? line : '  ' + line))
  .join('\n');
fs.writeFileSync(
  file,
  code.slice(0, start) + '  global.__TDB_HERO_DAILY_EXPLANATIONS = [' + json + code.slice(end)
);
console.log(JSON.stringify({ ...n, total: list.length }, null, 2));
