#!/usr/bin/env node
/** Wire Batch 13 gentle keys into kids-battle.js + kids-gentle-journey.js */
import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

const NEW_KEYS = [
  { key: 'pentecostHolySpirit', title: 'Pentecost — God’s Spirit Comes', ref: 'Acts 2:4', apply: 'God’s Spirit is with you to help you every day.' },
  { key: 'philipEthiopianRevisited', title: 'Philip and the Ethiopian', ref: 'Acts 8:29', apply: 'God can use you to help one person at a time.' },
  { key: 'saulConversion', title: 'Saul Meets Jesus', ref: 'Acts 9:4', apply: 'Jesus can change any heart and make it new.' },
  { key: 'dorcasHelpingRevisited', title: 'Dorcas Helps Others', ref: 'Acts 9:36', apply: 'God can use your hands to show love every day.' },
  { key: 'peterCornelius', title: 'Peter and Cornelius', ref: 'Acts 10:34', apply: 'Jesus welcomes everyone into His family.' },
  { key: 'barnabasEncouragesRevisited', title: 'Barnabas the Encourager', ref: 'Acts 11:23', apply: 'You can be someone’s encourager just like Barnabas.' },
  { key: 'lydiaConversion', title: 'Lydia Believes', ref: 'Acts 16:14', apply: 'God can open our hearts when we listen to His Word.' },
  { key: 'silasPaulSingingRevisited', title: 'Paul and Silas Sing in Jail', ref: 'Acts 16:25', apply: 'Praise opens the way for God’s power.' },
  { key: 'eutychusFallenRevisited', title: 'Eutychus Is Safe', ref: 'Acts 20:10', apply: 'Friends stay close when you need help.' },
  { key: 'paulShipwreckRevisited', title: 'Paul in the Storm', ref: 'Acts 27:22', apply: 'God can keep you safe even in the biggest storm.' },
  { key: 'onesiphorusPaulRevisited', title: 'Onesiphorus Visits Paul', ref: '2 Timothy 1:16', apply: 'True friends stick close no matter what.' },
  { key: 'timothyPaulFriendshipRevisited', title: 'Timothy and Paul', ref: 'Philippians 2:20', apply: 'Friends help each other grow closer to Jesus.' },
  { key: 'aquilaPriscillaRevisited', title: 'Aquila and Priscilla', ref: 'Romans 16:3', apply: 'Families who love Jesus can help each other grow.' },
  { key: 'epaphrasPrayerRevisited', title: 'Epaphras Prays for Friends', ref: 'Colossians 4:12', apply: 'Praying for friends is one of the kindest things we can do.' },
  { key: 'philemonOnesimusRevisited', title: 'Philemon Welcomes Onesimus', ref: 'Philemon 1:16', apply: 'Forgiveness opens the door to new friendship.' },
  { key: 'titusEncouragementRevisited', title: 'Titus Brings Joy', ref: '2 Corinthians 7:15', apply: 'Good friends bring joy to each other’s hearts.' },
  { key: 'nymphasHouseChurchRevisited', title: 'Church in Nymphas’ Home', ref: 'Colossians 4:15', apply: 'Your home can be a place of kindness and friendship.' },
  { key: 'gaiusHospitalityRevisited', title: 'Gaius Welcomes Travelers', ref: '3 John 1:5', apply: 'Welcoming others is a beautiful way to show God’s love.' },
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
      keywords: ['${kw}', 'gentle', 'kjv', 'acts', 'kids'],
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
  if (new RegExp(`\\n    ${s.key}: \\{`).test(battle)) continue;
  battle = battle.replace(marker, storyBlock(s) + '\n\n' + marker);
  addedBattle++;
}
writeFileSync(battlePath, battle, 'utf8');

const journeyPath = join(root, 'kids', 'kids-gentle-journey.js');
let journey = readFileSync(journeyPath, 'utf8');
const orderEnd = "    'mosesRedSea',\n  ];";
const altEnd = "    'mosesRedSea'\n  ];";
let markerJ = journey.includes(orderEnd) ? orderEnd : altEnd;
if (!journey.includes(markerJ)) {
  console.error('Could not find ORDER end for Batch 13');
  process.exit(1);
}

const journeyLines = [];
for (const s of NEW_KEYS) {
  if (journey.includes(`'${s.key}'`)) continue;
  journeyLines.push(`    '${s.key}',`);
}
let addedJourney = journeyLines.length;
if (addedJourney) {
  const block =
    '\n    /* Batch 13 – NT Stories & Early Church 301–325 */\n' +
    journeyLines.join('\n') +
    '\n';
  journey = journey.replace(markerJ, markerJ.replace(/\n  \];$/, ',') + block + '  ];');
  writeFileSync(journeyPath, journey, 'utf8');
}

console.log(`Added ${addedBattle} stories to kids-battle.js`);
console.log(`Added ${addedJourney} keys to kids-gentle-journey ORDER`);
