#!/usr/bin/env node
/**
 * Registers Batch 12 gentle keys in kids-battle.js + kids-gentle-journey.js
 * (skips keys already present).
 */
import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

const NEW_KEYS = [
  { key: 'josiahReform', title: 'Young King Josiah', ref: '2 Kings 22:2', apply: 'God is happy when we choose to do what is right.' },
  { key: 'jeremiahCall', title: 'God Calls Young Jeremiah', ref: 'Jeremiah 1:5,7', apply: 'God knows you and will be with you.' },
  { key: 'ezekielDryBones', title: 'Ezekiel and the Dry Bones', ref: 'Ezekiel 37:4', apply: 'God can bring hope and life to any hard place.' },
  { key: 'ezraLaw', title: 'Ezra Reads God’s Word', ref: 'Nehemiah 8:8', apply: 'God’s Word makes our hearts glad when we listen.' },
  { key: 'nehemiahWallRevisited', title: 'Nehemiah Rebuilds the Wall', ref: 'Nehemiah 4:6', apply: 'With God’s help we can rebuild what is broken.' },
  { key: 'samsonStrength', title: 'Samson and God’s Strength', ref: 'Judges 14:6', apply: 'God’s strength is perfect when we feel weak.' },
  { key: 'gideonFleeceRevisited', title: 'Gideon and the Fleece', ref: 'Judges 6:36', apply: 'God is patient when we need to know He is near.' },
  { key: 'deborahJudgeRevisited', title: 'Deborah the Judge', ref: 'Judges 4:14', apply: 'God can use you to encourage others to be brave.' },
  { key: 'isaiahVision', title: 'Isaiah Sees the Lord', ref: 'Isaiah 6:3', apply: 'God is holy and good — He can still use us.' },
  { key: 'micahJustice', title: 'Micah Teaches Justice', ref: 'Micah 6:8', apply: 'God wants us to be fair and kind every day.' },
  { key: 'habakkukFaith', title: 'Habakkuk Trusts God', ref: 'Habakkuk 2:4', apply: 'We can trust God even when things are hard to understand.' },
  { key: 'haggaiTemple', title: 'Haggai and God’s House', ref: 'Haggai 1:4', apply: 'Putting God first brings blessing.' },
  { key: 'zechariahVision', title: 'Zechariah’s Hope', ref: 'Zechariah 1:3', apply: 'God gives us hope and new beginnings.' },
  { key: 'malachiMessenger', title: 'Malachi’s Messenger', ref: 'Malachi 3:1', apply: 'God sends help so we can come back to Him.' },
  { key: 'estherRevisited', title: 'Queen Esther Is Brave', ref: 'Esther 4:14', apply: 'God has a special time and place for you too.' },
  { key: 'boazRedeemer', title: 'Boaz the Redeemer', ref: 'Ruth 2:12', apply: 'God provides someone to take care of us and make us part of His family.' },
  { key: 'jobFriends', title: 'Job’s Friends Sit Quietly', ref: 'Job 2:13', apply: 'Sometimes the best thing we can do is just sit with someone who is hurting.' },
  { key: 'elijahAscension', title: 'Elijah Taken to Heaven', ref: '2 Kings 2:11', apply: 'God takes care of His people to the very end.' },
  { key: 'allHeroesPraise', title: 'All the Heroes Point to Jesus', ref: 'Hebrews 11:39-40', apply: 'All these heroes point us to Jesus, our greatest Hero.' },
  { key: 'psalm91', title: 'Safe in God’s Care', ref: 'Psalm 91:1-2', apply: 'God is our safe place — we can stay close to Him.' },
  { key: 'mosesRedSea', title: 'God Opens the Red Sea', ref: 'Exodus 14:21-22', apply: 'God can make a way when there seems to be no way.' },
];

function storyBlock({ key, title, ref, apply }) {
  const kw = key.replace(/([A-Z])/g, ' $1').toLowerCase().trim();
  return `    ${key}: {
      title: '${title.replace(/'/g, "\\'")}',
      panels: [
        { src: '/coloring-pages/colored/noah-s1.jpg', alt: '${title} — gentle Bible story' },
        { src: '/coloring-pages/colored/noah-s2.jpg', alt: 'Quiet moment in the story' },
        { src: '/coloring-pages/colored/noah-s3.jpg', alt: 'God is near and faithful' }
      ],
      caption: 'Swipe through this calm story from God’s Word.',
      videoId: '',
      videoTitle: '',
      keywords: ['${kw}', 'gentle', 'kjv', 'faith', 'kids'],
      kjvRef: '${ref}',
      kidContext: {
        who: 'The LORD',
        to: 'every listener',
        apply: '${apply.replace(/'/g, "\\'")}'
      },
      narration: '${title} — ${ref}. A gentle story from God’s Word for young hearts. For you: ${apply.replace(/'/g, "\\'")}'
    },`;
}

const battlePath = join(root, 'kids', 'kids-battle.js');
let battle = readFileSync(battlePath, 'utf8');
const marker = '    comeLordJesus: {';
if (!battle.includes(marker)) {
  console.error('Could not find insertion marker in kids-battle.js');
  process.exit(1);
}

let addedBattle = 0;
for (const s of NEW_KEYS) {
  if (new RegExp(`\\n    ${s.key}: \\{`).test(battle)) continue;
  const block = storyBlock(s) + '\n';
  battle = battle.replace(marker, block + '\n' + marker);
  addedBattle++;
}
writeFileSync(battlePath, battle, 'utf8');

const journeyPath = join(root, 'kids', 'kids-gentle-journey.js');
let journey = readFileSync(journeyPath, 'utf8');
const orderEnd = "    'johnLoveOneAnother'\n  ];";
if (!journey.includes(orderEnd)) {
  console.error('Could not find ORDER end in kids-gentle-journey.js');
  process.exit(1);
}

let addedJourney = 0;
const journeyLines = [];
for (const s of NEW_KEYS) {
  if (journey.includes(`'${s.key}'`)) continue;
  journeyLines.push(`    '${s.key}',`);
  addedJourney++;
}
if (journeyLines.length) {
  const batchBlock =
    '\n    /* Batch 12 – Old Testament Heroes (Continued) 276–300 */\n' +
    journeyLines.join('\n') +
    '\n';
  journey = journey.replace(orderEnd, "    'johnLoveOneAnother'," + batchBlock + '  ];');
  writeFileSync(journeyPath, journey, 'utf8');
}

console.log(`Added ${addedBattle} stories to kids-battle.js`);
console.log(`Added ${addedJourney} keys to kids-gentle-journey ORDER`);
