#!/usr/bin/env node
/**
 * Grove rest-pass: unique verse-true steps, tighten formula settings,
 * unique verse-true audiences. Does not invent speakers.
 *
 *   node scripts/rewrite-hero-730-grove-rest.mjs
 */
import fs from 'fs';
import path from 'path';
import vm from 'vm';
import { fileURLToPath } from 'url';
import { loadYear365 } from './lib/hero-daily-verse-pick.mjs';
import { situationForChapter } from './lib/bible-situation-map.mjs';
import {
  bookOf,
  chapterOf,
  evaluateTeachingFields,
  leadingSpeakerInText,
  situationLooksWrongForRef,
  speakerBelongsToBook,
} from './lib/verse-teaching-guard.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const explPath = path.join(root, 'hero-daily-365-explanations.js');

function loadSrc() {
  return fs.readFileSync(explPath, 'utf8');
}

function extractArrayLiteral(src) {
  const marker = 'global.__TDB_HERO_DAILY_EXPLANATIONS = ';
  const start = src.indexOf(marker);
  if (start < 0) throw new Error('explanations array marker not found');
  const bracket = src.indexOf('[', start);
  let depth = 0;
  let end = -1;
  for (let i = bracket; i < src.length; i++) {
    if (src[i] === '[') depth += 1;
    else if (src[i] === ']') {
      depth -= 1;
      if (depth === 0) {
        end = i + 1;
        break;
      }
    }
  }
  if (end < 0) throw new Error('could not find end of explanations array');
  return { before: src.slice(0, bracket), arraySrc: src.slice(bracket, end), after: src.slice(end) };
}

function loadExplanations() {
  const code = loadSrc();
  const sandbox = { console };
  sandbox.window = sandbox;
  sandbox.globalThis = sandbox;
  vm.runInNewContext(code, sandbox, { filename: 'hero-daily-365-explanations.js' });
  return sandbox.__TDB_HERO_DAILY_EXPLANATIONS;
}

function stripSuperscription(s) {
  let t = String(s || '').replace(/\s+/g, ' ').trim();
  t = t.replace(/^[-–—]\s*(A Psalm[^.]*\.\s*)+/i, '');
  t = t.replace(/^[-–—]\s*(Of David[^.]*\.\s*)+/i, '');
  t = t.replace(/^[-–—]\s*(A Song[^.]*\.\s*)+/i, '');
  t = t.replace(/^To the chief Musician[^.]*\.\s*/i, '');
  t = t.replace(/^A Psalm of[^.]*\.\s*/i, '');
  t = t.replace(/^Maschil of[^.]*\.\s*/i, '');
  return t.replace(/\s+/g, ' ').trim();
}

function firstClause(s, max) {
  const cut = stripSuperscription(s).split(/(?<=[.!?])\s+/)[0] || stripSuperscription(s);
  const t = cut.length <= max ? cut : cut.slice(0, max).replace(/\s+\S*$/, '');
  return t.replace(/\s+/g, ' ').trim();
}

function endsSent(s) {
  const t = String(s || '').replace(/\s+/g, ' ').trim();
  if (!t) return t;
  return /[.!?]$/.test(t) ? t : t + '.';
}

function gospelBook(ref) {
  return /^(Matthew|Mark|Luke|John|Acts)\b/i.test(bookOf(ref));
}

function jesusOk(ref) {
  return /^(Matthew|Mark|Luke|John|Acts|Revelation|[123] John)\b/i.test(bookOf(ref));
}

function startsWrong(s, ref) {
  const t = String(s || '').trim();
  if (/^jesus\b/i.test(t) && !jesusOk(ref)) return true;
  const lead = leadingSpeakerInText(t);
  if (lead && !speakerBelongsToBook(lead, ref)) return true;
  return false;
}

function hashStyle(ref) {
  let h = 0;
  const s = String(ref || '');
  for (let i = 0; i < s.length; i++) h = (h * 33 + s.charCodeAt(i)) >>> 0;
  return h;
}

function verseQuote(text, max) {
  let t = stripSuperscription(text);
  const semi = t.split(/\s*;\s*/)[0].trim();
  if (semi.length >= 16 && semi.length <= (max || 72)) t = semi;
  else t = firstClause(t, max || 72);
  t = t.replace(/[.!?]$/, '');
  t = t
    .replace(/\bthy\b/gi, 'your')
    .replace(/\bthou\b/gi, 'you')
    .replace(/\bthee\b/gi, 'you')
    .replace(/\bthine\b/gi, 'your')
    .replace(/\bhath\b/gi, 'has')
    .replace(/\bshalt\b/gi, 'shall')
    .replace(/\bsaith\b/gi, 'says')
    .replace(/\bshew\b/gi, 'show')
    .replace(/\bdwelleth\b/gi, 'dwells')
    .replace(/\bcometh\b/gi, 'comes')
    .replace(/\bWatch ye\b/gi, 'Watch')
    .replace(/\bye\b/g, 'you');
  t = t.replace(/\s+/g, ' ').trim();
  t = t.replace(/[,:;]+$/, '').trim();
  while (
    /\b(in|of|the|and|or|to|for|a|with|under|from|by|who|which|that|my|his|your|our|their|through)\.?$/i.test(
      t
    ) &&
    t.split(/\s+/).length > 4
  ) {
    t = t.replace(/\s+\S+$/, '').trim();
  }
  t = t.replace(/[,:;]+$/, '').trim();
  return t;
}

function pickBandClause(sit, text) {
  const raw = String(sit || '')
    .replace(/\s+/g, ' ')
    .trim();
  if (!raw) return '';
  const parts = raw
    .split(/\s*[;—–]\s+/)
    .map((p) => p.replace(/:+$/, '').trim())
    .filter((p) => p.length >= 16);
  if (parts.length < 2) return raw.replace(/:+$/, '').trim();
  const vTok = new Set(
    String(text || '')
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, ' ')
      .split(/\s+/)
      .filter((w) => w.length >= 4)
  );
  let best = parts[0];
  let bestN = -1;
  for (const p of parts) {
    let n = 0;
    for (const w of p.toLowerCase().split(/[^a-z0-9]+/)) {
      if (vTok.has(w)) n += 1;
    }
    if (n > bestN) {
      bestN = n;
      best = p;
    }
  }
  if (bestN === 0) {
    const skipTitle = parts.find(
      (p) =>
        p.length >= 22 &&
        !/^(Hallelujah|Hall of|Songs of|Short proverbs|Letter to|A new song|Jericho falls)/i.test(p)
    );
    best = skipTitle || parts[0];
  }
  return best;
}

function chapterFrame(ref, text) {
  const book = bookOf(ref);
  const ch = chapterOf(ref);
  const band = situationForChapter(book === 'Psalms' ? 'Psalm' : book, ch);
  return firstClause(pickBandClause(band && band.situation, text), 100);
}

function whoLead(about, ref) {
  const a = String(about || '')
    .replace(/\s+/g, ' ')
    .trim()
    .split(/[—–(]/)[0]
    .trim();
  if (!a || a.length > 48) return '';
  if (startsWrong(a, ref)) return '';
  if (situationLooksWrongForRef(a, ref)) return '';
  return a;
}

function roleFor(text) {
  const l = String(text || '').toLowerCase();
  if (/fear|afraid|dismay/.test(l)) return 'hold';
  if (/praise|sing|bless|thanks|hallelujah|joyful noise/.test(l)) return 'song';
  if (/wait|patient/.test(l)) return 'wait';
  if (/ask|seek|knock|pray|prayer|supplication/.test(l)) return 'ask';
  if (/\blove\b|charity|beloved/.test(l)) return 'call';
  if (/trust|refuge|rock|shield|fortress|shadow/.test(l)) return 'hold';
  if (/shepherd|pasture/.test(l)) return 'care';
  if (/forgiv|mercy|compassion/.test(l)) return 'mercy';
  if (/word|law|statute|precept|commandment|lamp|testimon/.test(l)) return 'path';
  if (/rejoice|glad|joy/.test(l)) return 'gladness';
  if (/peace|still|rest/.test(l)) return 'rest';
  if (/strength|strong|courage|might/.test(l)) return 'charge';
  if (/hope/.test(l)) return 'hope';
  if (/light/.test(l)) return 'light';
  if (/save|salvation|redeem/.test(l)) return 'rescue';
  return 'line';
}

function isThinSetting(s) {
  const t = String(s || '').replace(/\s+/g, ' ').trim();
  if (!t) return true;
  if (/This verse says[,:]/i.test(t)) return true;
  if (/the line is,/i.test(t)) return true;
  if (/The words are,/i.test(t)) return true;
  if (/The line on the page/i.test(t)) return true;
  if (/,\s*”/.test(t) || /,.”/.test(t)) return true;
  if (/in that moment/i.test(t)) return true;
  if (/in that setting/i.test(t)) return true;
  if (/^On that day —/i.test(t)) return true;
  if (/^In this psalm —/i.test(t)) return true;
  if (/Jericho falls by faith/i.test(t)) return true;
  if (/,\s*”/.test(t) || /,.”/.test(t)) return true;
  return false;
}

function isGenericStep(s) {
  const t = String(s || '').replace(/\s+/g, ' ').trim();
  if (!t || t.length < 24) return true;
  if (/hand on your chest/i.test(t)) return true;
  if (/leave one worry with God/i.test(t)) return true;
  if (/Name one honest need this verse meets/i.test(t)) return true;
  if (/Ask God for strength for the next hour only/i.test(t)) return true;
  if (/Do the next honest task while holding one phrase/i.test(t)) return true;
  if (/Read this verse once more, slowly, before you stand/i.test(t)) return true;
  if (/Write one line of this verse where you will see it today/i.test(t)) return true;
  if (/Say this verse out loud, then take the next right step/i.test(t)) return true;
  if (/phone face down/i.test(t) && !/be still/i.test(t)) return true;
  if (/Take one small action today that matches what this verse asks/i.test(t)) return true;
  if (/Before you open messages, pray this verse once/i.test(t)) return true;
  if (/List one mercy you can thank God for that fits this verse/i.test(t)) return true;
  if (/Read the verse slowly three times/i.test(t)) return true;
  if (/End the day by reading this verse again/i.test(t)) return true;
  if (/When fear returns, repeat one short clause/i.test(t)) return true;
  if (/Tell God one honest sentence about what this verse touches/i.test(t)) return true;
  if (/Text one line of this verse to someone/i.test(t)) return true;
  if (/Choose one person to treat gently because of this verse/i.test(t)) return true;
  if (/Write one short phrase from this verse where you will see it tonight/i.test(t)) return true;
  if (/Before a hard conversation, read this verse once/i.test(t)) return true;
  if (/So do this:/i.test(t)) return true;
  if (/,\s*”/.test(t) || /,.”/.test(t)) return true;
  return false;
}

const HARD_SET = {
  'Psalm 96:2':
    'Israel is calling every land to sing a new song to the Lord as King. This verse is the daily work of that song: bless His name and show His salvation today, then again tomorrow.',
};

const HARD_STEP = {
  'Psalm 96:2':
    'Bless His name out loud once. Then name one place His salvation is still good today.',
  'Psalm 90:14':
    'Before you open messages, pray once: “Satisfy me early with Your mercy.” Then name one thing you can be glad for today.',
  'Psalm 23:1':
    'Say once: “The Lord is my shepherd.” Then hand Him one want you have been carrying.',
  'Psalm 23:4':
    'Name the valley you are walking. Then say: I will not fear, for You are with me.',
  'Psalm 119:105':
    'Write “a lamp unto my feet” where you will see the next doorway you walk through.',
  'Psalm 119:11':
    'Hide this line in your mouth before the day gets loud: “Your word have I hid in my heart.”',
  'Psalm 46:10':
    'Phone face down. Be still for sixty seconds. Say: I know that You are God.',
  'Psalm 46:1':
    'When the next alarm hits, say: God is my refuge and strength — a very present help.',
  'Philippians 4:13':
    'Name the thing that feels too big. Then say: Christ strengthens me — and take only the next small step.',
  'Philippians 4:6':
    'Tell God one request out loud, then thank Him for one thing before you pick the worry back up.',
  'Philippians 4:7':
    'After one honest prayer, sit still and let His peace keep your mind for the next hour.',
  'Matthew 7:7':
    'Ask the Father one honest thing. Then seek once more in prayer before you try to fix it yourself.',
  'John 3:16':
    'Thank God out loud that He gave His Son. Then name one person you want to believe that too.',
  'Psalm 91:1':
    'Sit still and picture the secret place. Then say: I will dwell under the shadow of the Almighty.',
  'Proverbs 3:5':
    'Name one plan you have been leaning on. Hand it to the Lord, and do not lean on your own understanding for the next hour.',
  'Isaiah 40:31':
    'Wait five minutes before you force the next thing. Say: they that wait upon the Lord shall renew their strength.',
  'Romans 8:31':
    'When the accuser speaks, answer once: if God be for us, who can be against us?',
  'Hebrews 12:2':
    'Look away from the scroll of the day. Say: I am looking unto Jesus, the author and finisher of my faith.',
  '1 John 4:18':
    'Name the fear that is sitting in your chest. Then say: perfect love casts out fear.',
  '1 Peter 5:7':
    'Cast one real care on Him out loud — then leave it there, because He cares for you.',
  'Joshua 1:9':
    'Before the hard room, say: be strong and of a good courage; the Lord is with me wherever I go.',
  'Matthew 5:3':
    'Admit one place you are poor in spirit. Then thank Him that the kingdom is for that poverty, not for your act.',
  'Psalm 27:1':
    'When the next scare comes, say: the Lord is my light and my salvation; whom shall I fear?',
  'Psalm 56:3':
    'The next time fear shows up, do not wait: say, “What time I am afraid, I will trust in You.”',
  '2 Timothy 1:7':
    'When timidity rises, name it, then say: God has not given me the spirit of fear.',
  'Jeremiah 29:11':
    'Tell God you will not demand tomorrow. Then thank Him that His thoughts toward you are peace, and a future.',
  'Micah 6:8':
    'Do one just thing, one merciful thing, and one humble walk today — because that is what He requires.',
  'Nehemiah 8:10':
    'If the Word has made you weep, eat something, then say: the joy of the Lord is my strength.',
  'Psalm 100:4':
    'Before you enter the next doorway, thank Him out loud, then bless His name as you go in.',
  'Matthew 6:33':
    'Put the kingdom first in the next decision — food and clothes after, not first.',
  'John 14:6':
    'When you want another way, say: Jesus is the way, the truth, and the life — then take the next step toward Him.',
  'Romans 8:28':
    'Name one hard thing. Then say: God is working this together for good to them that love Him.',
  'Psalm 34:8':
    'Taste one concrete kindness of the Lord today — then say out loud that He is good.',
  '1 Samuel 17:47':
    'Name the giant in front of you. Then say: the battle is the Lord’s — and take only the step that is yours.',
  'Isaiah 41:10':
    'When fear speaks, answer: fear not, for I am with you. Then take the next step with that hold.',
  'Psalm 139:14':
    'Look in the mirror once and say: I am fearfully and wonderfully made — not an accident.',
  'Ephesians 3:20':
    'Ask God for more than you have dared. Then thank Him that He can do exceeding abundantly above it.',
  'Colossians 3:23':
    'Do the next ordinary task heartily, as to the Lord — not as a show for the person watching.',
  'Galatians 5:22':
    'Ask the Spirit to grow one fruit today — love, joy, or peace — in one real conversation.',
  'Psalm 118:24':
    'Say out loud: this is the day the Lord has made. Then choose one glad act in it.',
  'Revelation 3:20':
    'Open the door in prayer: tell Him He may come in. Then sit still as if He did.',
  'Nahum 1:7':
    'When the day is trouble, run to Him as a strong hold. Say: the Lord is good, and He knows them that trust Him.',
  'Psalm 121:7':
    'As you go out, say: the Lord shall preserve me from all evil — He keeps my soul.',
  '1 Chronicles 16:34':
    'Give thanks out loud once: He is good; His mercy endures forever.',
  'Psalm 103:2':
    'Name one benefit you almost forgot. Then bless the Lord, O my soul — do not forget it.',
  'Psalm 118:1':
    'Open this Hallel with thanks out loud: “O give thanks unto the Lord, for He is good.”',
  'Psalm 136:1':
    'Begin the long mercy refrain: give thanks — then say the next clause as the point: His mercy endures forever.',
};

const HARD_TO = {
  'Psalm 96:2':
    'Every land called to show His salvation today — and you when praise has to last past the morning',
  'Psalm 23:1':
    'Anyone who needs a Shepherd — and you when want is loud',
  'Psalm 23:4':
    'Anyone walking a dark valley — and you when you need Him beside you, not only ahead',
  'Psalm 119:105':
    'A pilgrim who needs a lamp for the next step — and you when the rest of the road is dark',
  'Psalm 119:11':
    'Anyone hiding the Word so they will not sin — and you when temptation is close',
  'Psalm 46:10':
    'A people in an earthquake of nations — and you when striving will not save the day',
  'Philippians 4:13':
    'Friends in Philippi hearing a man in prison — and you when the next thing feels too big',
  'Philippians 4:6':
    'A church told not to be anxious — and you when the request is still in your chest',
  'Matthew 7:7':
    'Disciples on the mount learning to ask — and you when the Father feels hidden',
  'John 3:16':
    'Nicodemus in the night — and you when you need to know God actually loved the world',
  'Proverbs 3:5':
    'A son learning not to lean on his own mind — and you when the plan looks smarter than trust',
  'Isaiah 40:31':
    'Weary exiles who thought God had fainted — and you when strength has run out',
  'Romans 8:31':
    'Believers in Rome under accusation — and you when you need to know God is for you',
  'Hebrews 12:2':
    'A pressured church told to keep running — and you when your eyes have left Jesus',
  '1 John 4:18':
    'Beloved children learning perfect love — and you when fear is still sitting in the room',
  '1 Peter 5:7':
    'Elect exiles under a heavy hand — and you when the care is too much to carry',
  'Joshua 1:9':
    'Joshua at the edge of a land without Moses — and you when the new season is too big',
  'Jeremiah 29:11':
    'Exiles in Babylon, not going home tomorrow — and you when the future feels cancelled',
  'Revelation 3:20':
    'Laodicea at the door — and you when He is knocking and the latch is still yours',
  'Revelation 1:17':
    'John on his face before the risen Christ — and you when His glory knocks you down and His right hand lifts you',
  'Psalm 118:1':
    'Israel opening the Hallel after rescue — and you when thanks has to be the first word',
  'Psalm 136:1':
    'The congregation walking the long mercy refrain — and you when you need the line that does not run out',
};

function okField(line, ref, text, min, max) {
  const p = String(line || '')
    .replace(/\s+/g, ' ')
    .trim();
  if (!p || p.length < min || p.length > max) return false;
  if (startsWrong(p, ref)) return false;
  if (situationLooksWrongForRef(p, ref)) return false;
  const judged = evaluateTeachingFields({ ref, setting: p, to: p, verseText: text });
  if (!judged.ok) return false;
  return true;
}

function buildSetting(ref, text, about) {
  if (HARD_SET[ref] && okField(HARD_SET[ref], ref, text, 40, 220)) return HARD_SET[ref];
  const frame = chapterFrame(ref, text).replace(/[.!?]$/, '');
  const who = whoLead(about, ref);
  const role = roleFor(text);
  const hook = verseQuote(text, 70);
  const whoBit = who && !new RegExp('^' + who.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i').test(frame) ? who + ' — ' : '';
  const candidates = [
    whoBit + frame + '. This verse is the ' + role + ': ' + hook + '.',
    frame + '. Here the ' + role + ' is this: ' + hook + '.',
    (who ? who + ' in that hour. ' : '') + 'This verse is the ' + role + ': ' + hook + '.',
  ];
  for (const c of candidates) {
    const line = endsSent(String(c).replace(/\s+/g, ' ').trim());
    if (okField(line, ref, text, 40, 220) && !isThinSetting(line)) return line;
  }
  const rescue = endsSent(frame + '. This verse is the ' + role + ': ' + hook);
  return rescue.slice(0, 220);
}

function buildStep(ref, text) {
  if (HARD_STEP[ref] && okField(HARD_STEP[ref], ref, text, 24, 180)) return HARD_STEP[ref];
  const h = verseQuote(text, 48);
  const l = String(text || '').toLowerCase();
  const style = hashStyle(ref) % 3;
  const cands = [];
  if (/bless|praise|sing|thanks|hallelujah|joyful noise/.test(l)) {
    cands.push('Say this praise out loud once: “' + h + '.”');
    cands.push('Before the next task, bless His name with these words: “' + h + '.”');
    cands.push('Thank Him out loud using this line, then start the next honest work: “' + h + '.”');
  }
  if (/fear|afraid|dismay|terror/.test(l)) {
    cands.push('When fear returns, speak this once: “' + h + '.” Then take the next small step.');
    cands.push('Name the fear, then answer it with: “' + h + '.”');
  }
  if (/trust|refuge|rock|shield|fortress|shadow/.test(l)) {
    cands.push('Put your weight on this line for the next hour: “' + h + '.”');
    cands.push('When you want another rescue, return to: “' + h + '.”');
  }
  if (/pray|prayer|ask|seek|knock|supplication/.test(l)) {
    cands.push('Pray this line as your whole request: “' + h + '.”');
    cands.push('Ask once more with these words before you try to fix it: “' + h + '.”');
  }
  if (/word|law|statute|precept|commandment|lamp|testimon/.test(l)) {
    cands.push('Write this where you will see it: “' + h + '.”');
    cands.push('Carry this clause in your mouth until noon: “' + h + '.”');
  }
  if (/wait|patient/.test(l)) {
    cands.push('Wait ten minutes before you force the next thing. Hold this: “' + h + '.”');
  }
  if (/\blove\b|mercy|forgiv|kind|compassion/.test(l)) {
    cands.push('Do one concrete kindness today because of this: “' + h + '.”');
    cands.push('Ask mercy with this line, then give one person a share of it: “' + h + '.”');
  }
  if (/strength|strong|courage|might/.test(l)) {
    cands.push('Ask God for strength for the next hour, using this line: “' + h + '.”');
  }
  if (/peace|still|rest/.test(l)) {
    cands.push('Sit still sixty seconds and let this be the only sentence: “' + h + '.”');
  }
  if (/shepherd|pasture|want/.test(l)) {
    cands.push('Hand Him one want, then rest on: “' + h + '.”');
  }
  if (/light|lamp|path/.test(l)) {
    cands.push('Walk to the next doorway holding: “' + h + '.”');
  }
  if (/save|salvation|redeem/.test(l)) {
    cands.push('Name one place His salvation is still good, then say: “' + h + '.”');
  }
  cands.push('Read this once out loud, then do the next honest thing it names: “' + h + '.”');
  cands.push('Stop once today and return to these words: “' + h + '.”');
  cands.push('Keep this clause until the next meal: “' + h + '.”');
  const ordered = [];
  if (cands[style]) ordered.push(cands[style]);
  for (const c of cands) if (ordered.indexOf(c) === -1) ordered.push(c);
  for (const c of ordered) {
    const line = String(c).replace(/\s+/g, ' ').trim();
    if (okField(line, ref, text, 24, 180) && !isGenericStep(line)) return line;
  }
  return ('Keep this clause with you through the next hour: “' + h + '.”').slice(0, 180);
}

function needWhen(text) {
  const l = String(text || '').toLowerCase();
  if (/fear|afraid/.test(l)) return 'fear is loud';
  if (/lamp|light|path of/.test(l)) return 'you only have light for the next step';
  if (/shepherd|shall not want/.test(l)) return 'you need to be tended, not driven';
  if (/wait/.test(l)) return 'you are tired of forcing the next thing';
  if (/ask|seek|knock/.test(l)) return 'the Father feels hidden';
  if (/\blove\b/.test(l)) return 'love feels like a mood you cannot make';
  if (/trust|refuge|rock/.test(l)) return 'you need somewhere that will hold';
  if (/mercy|forgiv/.test(l)) return 'you have failed and still need to come';
  if (/peace|still/.test(l)) return 'your mind will not sit down';
  if (/strength|courage/.test(l)) return 'you have no more push left';
  if (/praise|thanks|sing|bless/.test(l)) return 'praise has to last past the morning';
  if (/word|law|statute|precept/.test(l)) return 'you need a path, not a feeling';
  if (/hope/.test(l)) return 'hope has worn thin';
  if (/save|salvation/.test(l)) return 'you need rescue that is still good today';
  if (/rejoice|glad|joy/.test(l)) return 'gladness feels like a command you cannot feel';
  if (/pray|prayer/.test(l)) return 'the request is still in your chest';
  if (/wisdom|understand/.test(l)) return 'your own mind looks smarter than trust';
  if (/heal|broken/.test(l)) return 'the heart is still broken';
  if (/peace|lay me down/.test(l)) return 'you cannot sleep';
  if (/morning/.test(l)) return 'the day has not started clean';
  if (/chosen|priesthood/.test(l)) return 'you have forgotten who you are';
  if (/kind|tender/.test(l)) return 'the next person will get your sharp edge';
  if (/wipe away|tears/.test(l)) return 'the tears are still here';
  if (/faithful|stablish/.test(l)) return 'you need someone else to hold you steady';
  return '';
}

function buildAudience(ref, text, about) {
  if (HARD_TO[ref] && okField(HARD_TO[ref], ref, text, 24, 160)) return HARD_TO[ref];
  const hook = verseQuote(text, 42);
  const when = needWhen(text) || 'you need to hear “' + hook + '”';
  const book = bookOf(ref);
  const who = whoLead(about, ref);
  const cands = [];
  if (/^Psalm/i.test(book)) {
    cands.push('Worshipers who needed to hear “' + hook + '” — and you when ' + when);
    cands.push('A soul in this psalm’s hour — and you when ' + when);
  } else if (gospelBook(ref)) {
    cands.push('The people in front of Jesus when He said “' + hook + '” — and you when ' + when);
    cands.push('Disciples hearing this from His mouth — and you when ' + when);
  } else if (/^(Romans|[12] Corinthians|Galatians|Ephesians|Philippians|Colossians|[12] Thessalonians|[12] Timothy|Titus|Philemon)\b/i.test(book)) {
    cands.push('The first church that opened this letter — hearing “' + hook + '” — and you when ' + when);
    cands.push('The first hearers of this line — and you when ' + when);
  } else if (/^Proverb/i.test(book)) {
    cands.push('A son learning wisdom, starting with “' + hook + '” — and you when ' + when);
  } else if (/^(Isaiah|Jeremiah|Lamentations|Ezekiel|Daniel|Hosea|Joel|Amos|Obadiah|Jonah|Micah|Nahum|Habakkuk|Zephaniah|Haggai|Zechariah|Malachi)\b/i.test(book)) {
    cands.push('The first people who had to hear “' + hook + '” — and you when ' + when);
  } else {
    cands.push('The first hearers of “' + hook + '” — and you when ' + when);
    if (who) cands.push('Those who first received this word — and you when ' + when);
  }
  for (const c of cands) {
    const line = String(c).replace(/\s+/g, ' ').trim();
    if (okField(line, ref, text, 24, 160)) return line;
  }
  return ('Anyone who needs this line today — and you when ' + when).slice(0, 160);
}

function uniquify(line, extra, ref, used, min, max) {
  const keyOf = (s) =>
    String(s || '')
      .toLowerCase()
      .replace(/\s+/g, ' ')
      .trim();
  let next = String(line || '').replace(/\s+/g, ' ').trim();
  if (!used[keyOf(next)] || used[keyOf(next)] === ref) return next;
  const tries = [
    next.replace(/[.!?]$/, '') + ' — “' + extra + '.”',
    next.replace(/[.!?]$/, '') + ' (' + extra + ')',
  ];
  for (const t of tries) {
    const line2 = String(t).replace(/\s+/g, ' ').trim().slice(0, max);
    if (line2.length >= min && (!used[keyOf(line2)] || used[keyOf(line2)] === ref)) return line2;
  }
  return (next.replace(/[.!?]$/, '') + ' — “' + extra + '.”').slice(0, max);
}

function main() {
  const year = loadYear365(root);
  const src = loadSrc();
  const parts = extractArrayLiteral(src);
  const rows = JSON.parse(parts.arraySrc);
  const byRef = Object.create(null);
  for (const row of rows) {
    if (row && row.ref) byRef[String(row.ref).replace(/\s*\(KJV\)\s*$/i, '').trim()] = row;
  }

  const stepCounts = Object.create(null);
  const toCounts = Object.create(null);
  for (const row of rows) {
    const st = String(row.step || '').replace(/\s+/g, ' ').trim();
    const to = String(row.to || '').replace(/\s+/g, ' ').trim();
    if (st) stepCounts[st] = (stepCounts[st] || 0) + 1;
    if (to) toCounts[to] = (toCounts[to] || 0) + 1;
  }

  let setN = 0;
  let stepN = 0;
  let toN = 0;
  const setUsed = Object.create(null);
  const stepUsed = Object.create(null);
  const toUsed = Object.create(null);

  for (let i = 0; i < year.length; i++) {
    const cal = year[i];
    const ref = String(cal.ref || '')
      .replace(/\s*\(KJV\)\s*$/i, '')
      .trim();
    const row = byRef[ref];
    if (!row) continue;
    const text = String(cal.text || row.text || '').trim();
    const extra = verseQuote(text, 36);

    let setting = String(row.setting || '').replace(/\s+/g, ' ').trim();
    if (HARD_SET[ref] || isThinSetting(setting) || !okField(setting, ref, text, 40, 220)) {
      setting = uniquify(buildSetting(ref, text, row.about), extra, ref, setUsed, 40, 220);
      row.setting = setting;
      setN += 1;
    }
    setUsed[setting.toLowerCase()] = ref;

    let step = String(row.step || '').replace(/\s+/g, ' ').trim();
    if (HARD_STEP[ref] || isGenericStep(step) || (stepCounts[step] || 0) > 1 || !okField(step, ref, text, 24, 180)) {
      step = uniquify(buildStep(ref, text), extra, ref, stepUsed, 24, 180);
      row.step = step;
      stepN += 1;
    }
    stepUsed[step.toLowerCase()] = ref;

    let to = String(row.to || '').replace(/\s+/g, ' ').trim();
    if (
      HARD_TO[ref] ||
      (toCounts[to] || 0) > 1 ||
      /,\s*”/.test(to) ||
      /this line is the one you actually need/i.test(to) ||
      !okField(to, ref, text, 24, 160)
    ) {
      to = uniquify(buildAudience(ref, text, row.about), extra, ref, toUsed, 24, 160);
      row.to = to;
      toN += 1;
    }
    toUsed[to.toLowerCase()] = ref;
  }

  fs.writeFileSync(explPath, parts.before + JSON.stringify(rows, null, 2) + parts.after);

  const fresh = loadExplanations();
  const count = (key) => {
    const m = Object.create(null);
    for (const r of fresh) {
      const k = String(r[key] || '')
        .toLowerCase()
        .replace(/\s+/g, ' ')
        .trim();
      m[k] = (m[k] || 0) + 1;
    }
    const reused = Object.values(m).filter((n) => n > 1).reduce((a, b) => a + b, 0);
    return { unique: Object.keys(m).length, reusedDays: reused };
  };
  const st = count('step');
  const se = count('setting');
  const to = count('to');
  let thin = 0;
  let generic = 0;
  for (const r of fresh) {
    if (isThinSetting(r.setting)) thin += 1;
    if (isGenericStep(r.step)) generic += 1;
  }
  console.log(
    'rewrite-hero-730-grove-rest: settings',
    setN,
    se,
    'steps',
    stepN,
    st,
    'audiences',
    toN,
    to,
    'thin-left',
    thin,
    'generic-steps',
    generic
  );
  if (se.unique < fresh.length || st.unique < fresh.length || to.unique < fresh.length || thin || generic) {
    process.exitCode = 1;
  }
}

main();
