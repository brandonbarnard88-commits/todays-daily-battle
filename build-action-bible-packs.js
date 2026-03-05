/**
 * Build weekly Action Bible production packs.
 * Output targets leaders, parents, and students with structured rollout guidance.
 */
const fs = require('fs');
const path = require('path');

const ROOT = __dirname;
const SOURCE_PATH = path.join(ROOT, 'action-bible-365.json');
const OUT_PATH = path.join(ROOT, 'action-bible-weekly-packs.json');

function ensureArray(value) {
  return Array.isArray(value) ? value : [];
}

function seasonOf(entry) {
  return String((entry && entry.documentarySeason) || 'Archive').trim() || 'Archive';
}

function buildPack(week, entries) {
  const first = entries[0] || {};
  const last = entries[entries.length - 1] || {};
  const season = seasonOf(first);
  return {
    week,
    season,
    range: {
      startEntry: Number(first.day || 0),
      endEntry: Number(last.day || 0)
    },
    leaderFocus: {
      objective: 'Teach covenant courage and faithful obedience through weekly arc review.',
      discussionPrompts: [
        'What does this week reveal about God\'s character?',
        'Where do we see courage under pressure?',
        'What step of obedience is required this week?'
      ]
    },
    parentGuide: {
      familyPrompt: 'Review one entry per day and close with a one-minute family prayer.',
      memoryVerse: String(first.keyVerseRef || 'Joshua 1:9')
    },
    studentChallenge: {
      mission: 'Write one sentence each day on how the entry applies to real life.',
      recapCheckpoint: 'Share one lesson from this week in class or at home.'
    },
    entries: entries.map(function (entry) {
      return {
        day: Number(entry.day || 0),
        characterName: String(entry.characterName || ''),
        keyVerseRef: String(entry.keyVerseRef || ''),
        documentarySeason: seasonOf(entry)
      };
    })
  };
}

function main() {
  if (!fs.existsSync(SOURCE_PATH)) {
    throw new Error('Missing action-bible-365.json. Run `npm run actionbible` first.');
  }
  const source = JSON.parse(fs.readFileSync(SOURCE_PATH, 'utf8'));
  const rows = ensureArray(source.days);
  if (!rows.length) {
    throw new Error('No Action Bible entries found.');
  }

  const packs = [];
  const chunkSize = 7;
  let week = 1;
  for (let i = 0; i < rows.length; i += chunkSize) {
    const chunk = rows.slice(i, i + chunkSize);
    packs.push(buildPack(week, chunk));
    week += 1;
  }

  const payload = {
    meta: {
      source: 'action-bible-365.json',
      totalEntries: rows.length,
      totalWeeks: packs.length,
      chunkSize: chunkSize,
      generatedAt: new Date().toISOString()
    },
    weeks: packs
  };

  fs.writeFileSync(OUT_PATH, JSON.stringify(payload, null, 2), 'utf8');
  console.log('Wrote action-bible-weekly-packs.json with', packs.length, 'weeks.');
}

main();
