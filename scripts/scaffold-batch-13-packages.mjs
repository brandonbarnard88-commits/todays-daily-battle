#!/usr/bin/env node
/**
 * Batch 13 – New Testament Stories & Early Church (301–325)
 * Creates multi-age skeleton package.md files (3–8 sections empty, ready to fill).
 */
import { writeFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const storiesDir = join(dirname(fileURLToPath(import.meta.url)), '..', 'kids', 'stories');

const BATCH13 = [
  { key: 'pentecostSpirit', title: 'Pentecost — God’s Spirit Comes', ref: 'Acts 2:4' },
  { key: 'paulRoadDamascus', title: 'Paul Meets Jesus on the Road', ref: 'Acts 9:6' },
  { key: 'peterCornelius', title: 'Peter and Cornelius', ref: 'Acts 10:34-35' },
  { key: 'philipSamaria', title: 'Philip in Samaria', ref: 'Acts 8:12' },
  { key: 'ananiasHelpsPaul', title: 'Ananias Helps Paul See', ref: 'Acts 9:17' },
  { key: 'timothyJoinsPaul', title: 'Timothy Joins Paul', ref: 'Acts 16:1-3' },
  { key: 'silasSingsInJail', title: 'Paul and Silas Sing in Jail', ref: 'Acts 16:25' },
  { key: 'stephenHeaven', title: 'Stephen Sees Heaven', ref: 'Acts 7:56' },
  { key: 'thomasBelieves', title: 'Thomas Believes', ref: 'John 20:28' },
  { key: 'roadToEmmaus', title: 'Road to Emmaus', ref: 'Luke 24:30-31' },
  { key: 'matthiasChosen', title: 'Matthias Is Chosen', ref: 'Acts 1:26' },
  { key: 'agabusFamine', title: 'Agabus Warns of Hard Days', ref: 'Acts 11:28' },
  { key: 'jailBreakPeter', title: 'Peter Freed from Prison', ref: 'Acts 12:7' },
  { key: 'marsHillPaul', title: 'Paul at Mars Hill', ref: 'Acts 17:23' },
  { key: 'corinthChurch', title: 'Church in Corinth', ref: 'Acts 18:10' },
  { key: 'ephesusTeaching', title: 'Paul Teaches in Ephesus', ref: 'Acts 19:20' },
  { key: 'eutychusRaised', title: 'Eutychus Raised Up', ref: 'Acts 20:12' },
  { key: 'paulShipwreck', title: 'Paul on the Stormy Sea', ref: 'Acts 27:25' },
  { key: 'romePaulPreaches', title: 'Paul Preaches in Rome', ref: 'Acts 28:31' },
  { key: 'jamesFaithWorks', title: 'Faith That Helps Others', ref: 'James 2:17' },
  { key: 'peterFirstLetter', title: 'Peter Encourages the Church', ref: '1 Peter 5:7' },
  { key: 'johnLoveLetter', title: 'God Is Love', ref: '1 John 4:8' },
  { key: 'judeStandFirm', title: 'Stand Firm in the Faith', ref: 'Jude 1:3' },
  { key: 'hebrewsHeroes', title: 'Heroes of Faith', ref: 'Hebrews 11:1' },
  { key: 'earlyChurchPraise', title: 'The Early Church Praised God', ref: 'Acts 2:47' },
];

function kebab(key) {
  return key.replace(/([A-Z])/g, '-$1').toLowerCase().replace(/^-/, '');
}

function skeleton({ title, ref }) {
  return `# ${title} (${ref})

## Emotional Focus
[Paste emotional focus — calm, specific, ages 3–8]

## Key KJV
[Paste exact KJV line with reference in parentheses]

## Gentle Retelling (3–8)
[Paste short warm read-aloud]

## Gentle Retelling (9–12)


## Gentle Retelling (13–17)


## Coloring Prompt
[One peaceful coloring scene — bold outlines, large open spaces]

## Read-Along Flow + Response
[Paste one warm closing line in quotes]

**Search tags:** batch-13, nt, early-church, gentle
**Verse:** ${ref}
**Flow:** color → listen → gentle loop or next
`;
}

let created = 0;
for (const s of BATCH13) {
  const file = join(storiesDir, `${kebab(s.key)}-package.md`);
  if (existsSync(file)) continue;
  writeFileSync(file, skeleton(s), 'utf8');
  created++;
}
console.log(`Batch 13: created ${created} new skeleton packages (${BATCH13.length} keys in plan).`);
