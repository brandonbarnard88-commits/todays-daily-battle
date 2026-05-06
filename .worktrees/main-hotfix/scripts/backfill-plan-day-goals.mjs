/**
 * One-shot maintainer: add optional "goal" to plan day objects that have "prayer"
 * but no "goal" in data/plans-battle-shared.json (blocks + internal arrays + cap objects).
 *
 * Run: node scripts/backfill-plan-day-goals.mjs
 * Then: npm run build:plans-data && npm run test
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const jsonPath = path.join(root, 'data', 'plans-battle-shared.json');

const KID_KEYS = new Set([
  'kidsAnxiety7',
  'sowerKids7',
  'lordsPrayerKids7',
  'beatitudesKids9',
  'familyWorshipTrenches7',
  'psalmsComfortFamily7',
]);

const ADULT_GOALS = [
  'If you want, you could return to this verse once when the noise rises — no score.',
  'If it feels right, try today\'s gentle step once this week — rest days still count.',
  'If it helps, whisper the prayer line again once; short is enough.',
  'If you want, bring today\'s honest question to Him again — you are already welcome here.',
  'If it feels right, pause on one phrase from the verse before the day hurries on.',
  'If you want, let today\'s action be small — porch steps, not a stage.',
  'If it helps, name one true thing you noticed from the verse before you fix anything.',
  'If it feels right, come back to this day when the fight feels loud — bookmark welcome.',
  'If you want, read the verse once aloud, slowly — perfection not required.',
  'If it helps, sit one minute with the Lord after the prayer — silence is prayer too.',
  'If you want, try the day\'s prompt once when you have margin — skip if you have none.',
  'If it feels right, thank Him once for speaking before you ask for more — optional.',
  'If you want, carry one line from today\'s text as a quiet anchor this week.',
  'If it helps, hand Him today\'s worry without a speech — one sentence counts.',
  'If it feels right, let the Lord remind you: He saw this day coming.',
  'If you want, share today\'s verse with one safe person — or keep it between you and Him.',
  'If it helps, trade five minutes of scroll for five with the Word — gentle swap.',
  'If it feels right, end the day with the prayer you already prayed once more.',
  'If you want, let today be enough — no extra homework from your own soul.',
  'If it helps, picture Him beside you in the very room today\'s verse names.',
  'If it feels right, choose the smallest obedience and let Him multiply it.',
  'If you want, write one word from the verse on a card — tuck it in your Bible.',
  'If it helps, breathe once with His mercies in mind before you rehearse the fail list.',
  'If it feels right, return when you need to — the porch does not close.',
];

const KID_GOALS = [
  'If you want, try the fun step once — a grown-up can help.',
  'If it helps, say part of the verse out loud one time — silly voices are okay.',
  'If you feel shy, you can just listen — Jesus listens too.',
  'If you want, draw one picture from the story — small is great.',
  'If it helps, ask a grown-up to pray with you — or whisper to Jesus alone.',
  'If you want, do the kind thing once — no show needed.',
  'If it feels scary, tell Jesus the scared feeling — He stays close.',
  'If you want, come back to this day another time — no rush.',
  'If it helps, hug or high-five after prayer — bodies like happy endings.',
  'If you want, pick the smallest brave thing — He sees it.',
  'If it feels right, thank God for one real thing before bed — tiny thanks count.',
  'If you want, let a grown-up read it again — hearing twice is smart.',
];

const CLOSING_GOALS = [
  'If it feels right, bookmark this stretch of days and return when you need quiet — you\'re already welcome here.',
  'If you want, end with thanks for one way He carried you — even a small way counts.',
  'If it helps, whisper "thank You" once for the days behind you — no speech required.',
];

const KID_CLOSING = [
  'If you want, high-five heaven and come back another day — Jesus likes seeing you.',
  'If it helps, thank Him for one thing from this week — tiny is big to Him.',
];

function hashPick(seed, mod) {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = ((h << 5) - h + seed.charCodeAt(i)) | 0;
  return Math.abs(h) % mod;
}

function pickGoal(blockKey, index, isLast, title, isKid) {
  const goals = isKid ? KID_GOALS : ADULT_GOALS;
  const closings = isKid ? KID_CLOSING : CLOSING_GOALS;
  if (isLast && (isKid ? index >= 4 : index >= 6)) {
    return closings[hashPick(`${blockKey}|${title}|last`, closings.length)];
  }
  const seed = `${blockKey}|${index}|${title || ''}`;
  return goals[hashPick(seed, goals.length)];
}

function backfillDay(blockKey, day, index, len) {
  if (!day || typeof day !== 'object' || !day.prayer || day.goal) return false;
  const isKid = KID_KEYS.has(blockKey);
  const isLast = index === len - 1;
  day.goal = pickGoal(blockKey, index, isLast, day.title, isKid);
  return true;
}

const raw = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
let added = 0;

for (const [blockKey, val] of Object.entries(raw.blocks || {})) {
  if (Array.isArray(val)) {
    val.forEach((day, i) => {
      if (backfillDay(blockKey, day, i, val.length)) added++;
    });
  } else if (val && typeof val === 'object' && val.prayer && !val.goal) {
    if (backfillDay(blockKey, val, 0, 1)) added++;
  }
}

for (const [ik, val] of Object.entries(raw.internal || {})) {
  if (!Array.isArray(val)) continue;
  const blockKey = `internal.${ik}`;
  val.forEach((day, i) => {
    if (backfillDay(blockKey, day, i, val.length)) added++;
  });
}

fs.writeFileSync(jsonPath, JSON.stringify(raw, null, 2) + '\n', 'utf8');
console.log('backfill-plan-day-goals: added goal to', added, 'day objects');
