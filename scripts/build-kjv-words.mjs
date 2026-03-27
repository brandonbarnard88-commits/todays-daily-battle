#!/usr/bin/env node
/**
 * Human-written one-line KJV word notes (no AI). Concordance deep-link word key.
 * Run: node scripts/build-kjv-words.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const out = path.join(__dirname, '..', 'kjv-word-notes.json');

const words = [
  { w: 'charity', note: 'Often means self-giving love (caritas), not fundraising. See 1 Corinthians 13.' },
  { w: 'conversation', note: 'Usually “manner of life” or conduct, not two people talking (Philippians 1:27).' },
  { w: 'quick', note: 'Often “living” (Hebrews 4:12 — the word is quick and powerful), not fast.' },
  { w: 'peculiar', note: 'Special possession (Titus 2:14), not odd — God’s own treasured people.' },
  { w: 'ghost', note: 'Holy Ghost = Holy Spirit; older English for the same Person (John 14:26).' },
  { w: 'prevent', note: 'Often “go before” or meet (1 Thessalonians 4:15), not stop.' },
  { w: 'suffer', note: 'Sometimes “allow” (Matthew 19:14 — suffer little children), not only endure pain.' },
  { w: 'virtue', note: 'Moral strength or power going out from Christ (Luke 8:46), not only modesty.' },
  { w: 'meat', note: 'Often solid food (Hebrews 5:12), not only animal flesh.' },
  { w: 'corn', note: 'Grain in general (e.g. wheat), not only maize.' },
  { w: 'replenish', note: 'Fill or populate (Genesis 1:28), not refill after emptying.' },
  { w: 'comprehend', note: 'Sometimes overcome or grasp (John 1:5 — darkness comprehended it not).' },
  { w: 'closet', note: 'Private room (Matthew 6:6 — pray to thy Father in secret), not a wardrobe.' },
  { w: 'bowels', note: 'Deep inward feeling (Philippians 2:1), not intestines as we stress the word today.' },
  { w: 'careful', note: 'Often “full of care” or anxious (Philippians 4:6 — be careful for nothing).' },
  { w: 'communicate', note: 'Share or give (Hebrews 13:16), not only speak.' },
  { w: 'flesh', note: 'Body, human nature, or kinship — context decides (John 1:14; Romans 8:5).' },
  { w: 'hell', note: 'Sheol, grave, or Gehenna by context — not always the same place.' },
  { w: 'heart', note: 'Will and inner person, not only emotion — “as he thinketh in his heart” (Proverbs 23:7).' },
  { w: 'soul', note: 'Living being or life (Matthew 16:26); overlaps with heart and spirit by context.' },
  { w: 'spirit', note: 'Breath, attitude, unclean spirit, or Holy Spirit — let the verse rule which.' },
  { w: 'repent', note: 'Change of mind that shows in turning — not mere regret (Acts 26:20).' },
  { w: 'justified', note: 'Declared righteous before God by faith (Romans 5:1), not “made perfect in behavior” first.' },
  { w: 'sanctified', note: 'Set apart for God; positional and growing (1 Corinthians 6:11).' },
  { w: 'propitiation', note: 'Wrath absorbed; mercy seat reality (Romans 3:25; 1 John 2:2).' },
  { w: 'imputation', note: 'Counted to your account (Romans 4 — not the English word, but the idea of reckoned righteousness).' },
  { w: 'covenant', note: 'Binding promise God makes and keeps; cut in blood in the old; new in Christ’s blood.' },
  { w: 'tabernacle', note: 'Tent of meeting; God dwelling among a moving camp; shadow of Christ (Hebrews).' },
  { w: 'atonement', note: 'Covering of sin; day of atonement; fulfilled in the one sacrifice (Hebrews 10).' },
  { w: 'redemption', note: 'Bought back out of bondage (Ephesians 1:7) — price paid.' },
  { w: 'grace', note: 'God’s favor you did not earn (Ephesians 2:8) — not license (Romans 6).' },
  { w: 'faith', note: 'Trust resting on God’s word (Hebrews 11:1) — shown in what you do (James 2).' },
  { w: 'works', note: 'Deeds; “not of works” for salvation (Ephesians 2:9); “faith without works” dead (James 2).' },
  { w: 'world', note: 'Often the age, order, or people of earth (John 3:16) — context narrows meaning.' },
  { w: 'church', note: 'Assembly — local or universal body of Christ (Matthew 16:18).' },
  { w: 'bishop', note: 'Overseer; office of care and teaching (1 Timothy 3) — same office as elder in many passages.' },
  { w: 'devils', note: 'Demons, evil spirits (Matthew 8:31) — not cartoon jokes; Christ has authority.' },
  { w: 'wine', note: 'Often fermented drink; “new wine” also; wisdom says beware excess (Proverbs 20:1).' },
  { w: 'winepress', note: 'Judgment image (Revelation 14:19) — God’s wrath pressed out.' },
  { w: 'temple', note: 'Building, body of Christ, or believer (1 Corinthians 6:19) — track the referent.' }
];

const payload = {
  version: 1,
  about: 'Short KJV glosses; use Hub concordance for every occurrence.',
  words: words.map(function (x) {
    return { word: x.w, note: x.note, concordance: x.w };
  })
};

fs.writeFileSync(out, JSON.stringify(payload, null, 0) + '\n', 'utf8');
console.log('Wrote', out, payload.words.length, 'words');
