#!/usr/bin/env node
/** Wire Batch 14 Revisited keys into kids-battle.js + kids-gentle-journey.js */
import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

const NEW_KEYS = [
  { key: 'lukeNativityRevisited', title: 'The Night Jesus Was Born', ref: 'Luke 2:7', apply: 'Jesus came because God loves you so much.' },
  { key: 'matthewGenealogyRevisited', title: 'Jesus’ Family Line', ref: 'Matthew 1:1', apply: 'Jesus came into a real family — He understands our families too.' },
  { key: 'markBeginningRevisited', title: 'The Good News Begins', ref: 'Mark 1:1', apply: 'The good news about Jesus is for everyone.' },
  { key: 'johnWordRevisited', title: 'Jesus the Word', ref: 'John 1:1', apply: 'Jesus was with God from the beginning and came to be with us.' },
  { key: 'actsChurchBeginsRevisited', title: 'The Church Begins', ref: 'Acts 2:42', apply: 'The church is a family that prays and cares for one another.' },
  { key: 'romansLoveRevisited', title: 'Nothing Separates God’s Love', ref: 'Romans 8:38-39', apply: 'Nothing can ever take God’s love away from you.' },
  { key: '1corinthiansLoveChapterRevisited', title: 'Love Is Greatest', ref: '1 Corinthians 13:13', apply: 'Love is the greatest thing — God’s love for us and our love for others.' },
  { key: 'galatiansFruitRevisited', title: 'Fruit of the Spirit', ref: 'Galatians 5:22-23', apply: 'The Holy Spirit helps us grow good fruit in our hearts.' },
  { key: 'ephesiansArmorRevisited', title: 'God’s Armor', ref: 'Ephesians 6:11', apply: 'We can put on God’s armor together every day.' },
  { key: 'philippiansJoyRevisited', title: 'Joy in the Lord', ref: 'Philippians 4:4', apply: 'We can rejoice in Jesus every day.' },
  { key: 'colossiansChristFirstRevisited', title: 'Jesus Is First', ref: 'Colossians 1:18', apply: 'Jesus is first in everything — that makes our hearts peaceful.' },
  { key: '1thessaloniansRaptureRevisited', title: 'Jesus Is Coming Back', ref: '1 Thessalonians 4:16', apply: 'Jesus is coming back — we can look forward to that day.' },
  { key: '2thessaloniansStandFirmRevisited', title: 'Stand Firm', ref: '2 Thessalonians 2:15', apply: 'Keep standing strong — Jesus is coming.' },
  { key: '1timothyYoungLeaderRevisited', title: 'Young Timothy', ref: '1 Timothy 4:12', apply: 'God can use you no matter how young you are.' },
  { key: '2timothyFaithPassedRevisited', title: 'Faith Passed Down', ref: '2 Timothy 1:5', apply: 'The faith of those who love you can help you be brave too.' },
  { key: 'titusGoodWorksRevisited', title: 'Eager to Do Good', ref: 'Titus 2:14', apply: 'Jesus saved us so we can do good things for others.' },
  { key: 'philemonForgivenessRevisited', title: 'Philemon Forgives', ref: 'Philemon 1:16', apply: 'Forgiveness opens the door to new friendship.' },
  { key: 'hebrewsFaithHeroesRevisited', title: 'Heroes of Faith', ref: 'Hebrews 11:1', apply: 'Faith is trusting God even when we can’t see what’s next.' },
  { key: 'jamesFaithWorksRevisited', title: 'Faith Shows in Kindness', ref: 'James 2:17', apply: 'Real faith shows itself by loving others.' },
  { key: '1peterHopeLivingRevisited', title: 'Living Hope', ref: '1 Peter 1:3', apply: 'We have a living hope because Jesus is alive.' },
  { key: '2peterKnowledge', title: 'Growing in Knowing Jesus', ref: '2 Peter 3:18', apply: 'We can keep growing in knowing Jesus every day.' },
  { key: '1johnLoveGod', title: 'Love One Another', ref: '1 John 4:7', apply: 'Love one another just like Jesus loves you.' },
  { key: '2johnTruth', title: 'Walking in Truth', ref: '2 John 1:6', apply: 'Walking in truth and love keeps us close to Jesus.' },
  { key: '3johnFaithful', title: 'Faithful Friends', ref: '3 John 1:5', apply: 'Being faithful friends who help others pleases God.' },
];

function escKey(k) {
  return k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function storyBlock({ key, title, ref, apply }) {
  return `    ${key}: {
      title: '${title.replace(/'/g, "\\'")}',
      panels: [
        { src: '/coloring-pages/colored/noah-s1.jpg', alt: '${title} — gentle Bible story' },
        { src: '/coloring-pages/colored/noah-s2.jpg', alt: 'Quiet moment' },
        { src: '/coloring-pages/colored/noah-s3.jpg', alt: 'God is near' }
      ],
      caption: 'Swipe through this calm story from God’s Word.',
      videoId: '',
      videoTitle: '',
      keywords: ['gentle', 'kjv', 'batch14'],
      kjvRef: '${ref}',
      kidContext: { who: 'The LORD', to: 'every listener', apply: '${apply.replace(/'/g, "\\'")}' },
      narration: '${title} — ${ref}. A gentle story from God’s Word for young hearts.'
    },`;
}

const battlePath = join(root, 'kids', 'kids-battle.js');
let battle = readFileSync(battlePath, 'utf8');
const marker = '    comeLordJesus: {';
let addedBattle = 0;
for (const s of NEW_KEYS) {
  if (new RegExp(`\\n    ${escKey(s.key)}: \\{`).test(battle)) continue;
  battle = battle.replace(marker, storyBlock(s) + '\n\n' + marker);
  addedBattle++;
}
writeFileSync(battlePath, battle, 'utf8');

const journeyPath = join(root, 'kids', 'kids-gentle-journey.js');
let journey = readFileSync(journeyPath, 'utf8');

const journeyKeys = [
  'revelationNewHeaven',
  ...NEW_KEYS.map((s) => s.key),
];
const lines = [];
for (const k of journeyKeys) {
  if (!journey.includes(`'${k}'`)) lines.push(`    '${k}',`);
}

const orderEnd = "    '1peterHopeLiving',\n  ];";
const orderEnd2 = "    '1peterHopeLivingRevisited',\n  ];";
const orderEnd3 = "    '3johnFaithful',\n  ];";
let markerJ = journey.includes(orderEnd3) ? orderEnd3 : journey.includes(orderEnd2) ? orderEnd2 : journey.includes(orderEnd) ? orderEnd : null;
if (!markerJ) {
  const m = journey.match(/    '[^']+',\n  \];/);
  if (m) markerJ = m[0];
}
if (!markerJ) {
  console.error('Could not find ORDER end for Batch 14');
  process.exit(1);
}

if (lines.length) {
  const block =
    '\n    /* Batch 14 – Remaining Stories + Cleanup 326–350 (Revisited keys) */\n' +
    lines.join('\n') +
    '\n';
  journey = journey.replace(markerJ, markerJ.replace(/,\n  \];$/, ',') + block + '  ];');
  writeFileSync(journeyPath, journey, 'utf8');
}

console.log(`Added ${addedBattle} stories to kids-battle.js`);
console.log(`Added ${lines.length} keys to kids-gentle-journey ORDER`);
