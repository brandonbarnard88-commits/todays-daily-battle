/**
 * Generates clean curriculum.json for the Deep tab.
 * Schema per day:
 * - name
 * - preGodBrief
 * - impact
 * - postGodBrief
 * - keyVerse: { ref, text, translation }
 * - kidSafeVersion
 * - teenVersion
 * - pastorVersion
 */
const fs = require('fs');
const path = require('path');

const root = __dirname;
const charsPath = path.join(root, 'bible-characters.json');
const kjvPath = path.join(root, 'kjv.json');
const outPath = path.join(root, 'curriculum.json');
const MAX_UNIQUE = 250;
const TOTAL_DAYS = 365;
const START_ORDER = ['Abraham', 'Moses', 'David', 'Ruth', 'Esther', 'Jesus', 'Paul'];

function sentenceOne(text) {
  const t = String(text || '').replace(/\s+/g, ' ').trim();
  if (!t) return '';
  const m = t.match(/^[^.!?]+[.!?]/);
  return m ? m[0] : t;
}

function clampSentence(text, fallback) {
  const s = sentenceOne(text);
  return s || fallback;
}

function extractRef(text) {
  const t = String(text || '');
  const m = t.match(/\b(?:[1-3]\s)?[A-Z][a-z]+(?:\s[A-Z][a-z]+)?\s\d+:\d+(?:-\d+)?\b/);
  return m ? m[0].trim() : null;
}

function normalizeName(name) {
  return String(name || '').trim();
}

function safeKid(text) {
  return String(text || '')
    .replace(/\b(killed|slain|blood|war|battle|destroyed|wrath|fear|beheaded|demons?)\b/gi, 'hope')
    .replace(/\s+/g, ' ')
    .trim();
}

function orderedNames(list) {
  const seen = new Set();
  const start = [];
  for (const n of START_ORDER) {
    const found = list.find((x) => x.name === n);
    if (found && !seen.has(found.name)) {
      start.push(found);
      seen.add(found.name);
    }
  }
  const rest = list
    .filter((x) => !seen.has(x.name))
    .sort((a, b) => (a.name < b.name ? -1 : a.name > b.name ? 1 : 0));
  return start.concat(rest);
}

function buildVersePool(kjvRows) {
  const pool = [];
  for (const row of kjvRows) {
    if (!row || !row.ref || !row.text) continue;
    pool.push({ ref: row.ref, text: row.text, translation: 'KJV' });
  }
  return pool;
}

function main() {
  const characters = JSON.parse(fs.readFileSync(charsPath, 'utf8'));
  const kjvRows = JSON.parse(fs.readFileSync(kjvPath, 'utf8'));
  const versePool = buildVersePool(kjvRows);
  const verseMap = new Map(versePool.map((v) => [v.ref, v]));

  const dedup = new Map();
  for (const c of characters) {
    const name = normalizeName(c.name);
    if (!name || dedup.has(name)) continue;
    dedup.set(name, c);
  }

  const ordered = orderedNames(Array.from(dedup.values()))
    .slice(0, MAX_UNIQUE);

  const uniqueEntries = ordered.map((c, idx) => {
    const refFromDid = extractRef(c.did);
    const verse = (refFromDid && verseMap.get(refFromDid)) || versePool[idx % versePool.length] || { ref: 'John 3:16', text: 'For God so loved the world, that he gave his only begotten Son.', translation: 'KJV' };
    const preGod = clampSentence(c.who, 'Before meeting the Lord in this calling, life was ordinary and uncertain.');
    const impact = clampSentence(c.did, 'God met this person and changed direction through obedience.');
    const postGod = clampSentence(c.impact, 'After God moved, this life became a witness to His faithfulness.');
    return {
      name: normalizeName(c.name),
      preGodBrief: preGod,
      impact: impact,
      postGodBrief: postGod,
      keyVerse: {
        ref: verse.ref,
        text: verse.text,
        translation: 'KJV'
      },
      kidSafeVersion: safeKid('Jesus loves us, gives hope, and helps us trust Him today through this story.'),
      teenVersion: 'At school and with friends, this reminds you to stay real, choose truth, and trust God under pressure.',
      pastorVersion: 'Context: ' + impact + ' Sermon hook: What changes when this same truth is preached for today\'s battle?'
    };
  });

  const days = [];
  for (let i = 0; i < TOTAL_DAYS; i++) {
    const base = uniqueEntries[i % uniqueEntries.length];
    days.push({
      day: i + 1,
      name: base.name,
      preGodBrief: base.preGodBrief,
      impact: base.impact,
      postGodBrief: base.postGodBrief,
      keyVerse: base.keyVerse,
      kidSafeVersion: base.kidSafeVersion,
      teenVersion: base.teenVersion,
      pastorVersion: base.pastorVersion
    });
  }

  const payload = {
    meta: {
      totalDays: TOTAL_DAYS,
      uniqueFigures: uniqueEntries.length,
      maxUniqueFigures: MAX_UNIQUE,
      order: 'Abraham, Moses, David, Ruth, Esther, Jesus, Paul first; then alphabetical'
    },
    days
  };

  fs.writeFileSync(outPath, JSON.stringify(payload, null, 2), 'utf8');
  console.log('Wrote curriculum.json with ' + TOTAL_DAYS + ' days and ' + uniqueEntries.length + ' unique figures.');
}

main();
