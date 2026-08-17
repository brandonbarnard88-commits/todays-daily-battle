#!/usr/bin/env node
/**
 * Unique verse-true Grove prayers for every queue day.
 * Replaces the “Lord, sink [ref] into my heart” stamp.
 *
 *   node scripts/rewrite-hero-730-prayers.mjs
 */
import fs from 'fs';
import path from 'path';
import vm from 'vm';
import { fileURLToPath } from 'url';
import { loadYear365 } from './lib/hero-daily-verse-pick.mjs';
import {
  bookOf,
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
  return String(s || '')
    .replace(/\s+/g, ' ')
    .replace(/^To the chief Musician[^.]*\.\s*/i, '')
    .replace(/^A Psalm of[^.]*\.\s*/i, '')
    .trim();
}

function firstClause(s, max) {
  const cut = stripSuperscription(s).split(/(?<=[.!?])\s+/)[0] || stripSuperscription(s);
  const t = cut.length <= max ? cut : cut.slice(0, max).replace(/\s+\S*$/, '');
  return t.replace(/\s+/g, ' ').trim();
}

function verseQuote(text, max) {
  let t = stripSuperscription(text);
  const semi = t.split(/\s*;\s*/)[0].trim();
  if (semi.length >= 14 && semi.length <= (max || 64)) t = semi;
  else t = firstClause(t, max || 64);
  t = t
    .replace(/[.!?]$/, '')
    .replace(/\bthy\b/gi, 'your')
    .replace(/\bthou\b/gi, 'you')
    .replace(/\bthee\b/gi, 'you')
    .replace(/\bthine\b/gi, 'your')
    .replace(/\bhath\b/gi, 'has')
    .replace(/\bye\b/g, 'you')
    .replace(/\s+/g, ' ')
    .replace(/[,:;]+$/, '')
    .trim();
  while (
    /\b(in|of|the|and|or|to|for|a|with|under|from|by|who|which|that|my|his|your|our|their|through)\.?$/i.test(t) &&
    t.split(/\s+/).length > 4
  ) {
    t = t.replace(/\s+\S+$/, '').trim();
  }
  return t.replace(/[,:;]+$/, '').trim();
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

function isStampPrayer(s) {
  const t = String(s || '').replace(/\s+/g, ' ').trim();
  if (!t) return true;
  if (/sink .+ into my heart/i.test(t)) return true;
  if (/not as noise/i.test(t)) return true;
  if (/,\s*”/.test(t) || /,.”/.test(t)) return true;
  return false;
}

const HARD = {
  'Psalm 96:2':
    'Lord, I bless Your name today. Help me show Your salvation again tomorrow — not a one-day song. In Jesus’ name, Amen.',
  'Psalm 90:14':
    'Lord, satisfy me early with Your mercy, so I can be glad in You all day long. In Jesus’ name, Amen.',
  'Psalm 23:1':
    'Lord, You are my Shepherd. I bring You the want I have been carrying — tend me today. In Jesus’ name, Amen.',
  'Psalm 23:4':
    'Lord, I am in a valley. Walk with me and take the fear, because You are with me. In Jesus’ name, Amen.',
  'Psalm 119:105':
    'Lord, let Your word be a lamp for my next step — I do not need the whole road, only enough light to walk. In Jesus’ name, Amen.',
  'Psalm 46:10':
    'Lord, I stop striving. Be still my heart, and let me know that You are God. In Jesus’ name, Amen.',
  'Philippians 4:13':
    'Lord Jesus, the next thing feels too big. Strengthen me for this hour only. Amen.',
  'Philippians 4:6':
    'Father, here is my request. I thank You before I pick the worry back up. In Jesus’ name, Amen.',
  'Matthew 7:7':
    'Father, I ask. I seek. I knock. Do not let me treat You as hidden. In Jesus’ name, Amen.',
  'John 3:16':
    'Father, thank You for giving Your Son. Help me believe that love is for me today. In Jesus’ name, Amen.',
  'Proverbs 3:5':
    'Lord, I stop leaning on my own understanding. I trust You with this plan. In Jesus’ name, Amen.',
  'Isaiah 40:31':
    'Lord, I wait on You. Renew my strength — I have no more push left. In Jesus’ name, Amen.',
  'Romans 8:31':
    'Lord, when the accuser speaks, remind me: if You are for me, who can be against me? In Jesus’ name, Amen.',
  'Hebrews 12:2':
    'Lord Jesus, I look to You — author and finisher. Keep my eyes on You through this stretch. Amen.',
  '1 John 4:18':
    'Lord, perfect love casts out fear. Drive this fear out of my chest today. In Jesus’ name, Amen.',
  '1 Peter 5:7':
    'Lord, I cast this care on You, because You care for me. I leave it here. In Jesus’ name, Amen.',
  'Joshua 1:9':
    'Lord, make me strong and of good courage. You are with me wherever I go. In Jesus’ name, Amen.',
  'Jeremiah 29:11':
    'Lord, I will not demand tomorrow. Hold me in Your thoughts of peace and a future. In Jesus’ name, Amen.',
  'Psalm 91:1':
    'Lord, I want to dwell in Your secret place and rest under the shadow of the Almighty. In Jesus’ name, Amen.',
  'Psalm 27:1':
    'Lord, You are my light and my salvation. Whom shall I fear today? In Jesus’ name, Amen.',
  'Psalm 56:3':
    'Lord, what time I am afraid, I will trust in You — not later, now. In Jesus’ name, Amen.',
  'Matthew 6:33':
    'Lord, I seek Your kingdom first in the next decision. Food and clothes after, not first. In Jesus’ name, Amen.',
  'John 14:6':
    'Lord Jesus, You are the way, the truth, and the life. I take the next step toward You. Amen.',
  'Romans 8:28':
    'Lord, work this hard thing together for good. I love You — help me trust the working. In Jesus’ name, Amen.',
  'Psalm 100:4':
    'Lord, I enter with thanksgiving. I bless Your name as I come in. In Jesus’ name, Amen.',
  'Psalm 118:24':
    'Lord, this is the day You have made. Teach me to rejoice and be glad in it. In Jesus’ name, Amen.',
  'Isaiah 41:10':
    'Lord, I will not fear. You are with me — strengthen me and uphold me. In Jesus’ name, Amen.',
  '2 Timothy 1:7':
    'Lord, You have not given me a spirit of fear. Give me power, love, and a sound mind today. In Jesus’ name, Amen.',
  'Nehemiah 8:10':
    'Lord, if Your Word has made me weep, let Your joy be my strength. In Jesus’ name, Amen.',
  'Micah 6:8':
    'Lord, help me do justly, love mercy, and walk humbly with You today. In Jesus’ name, Amen.',
  'Revelation 3:20':
    'Lord Jesus, You are at the door. I open. Come in. Amen.',
  'Psalm 139:14':
    'Lord, I am fearfully and wonderfully made. Teach me to receive that as true today. In Jesus’ name, Amen.',
  '1 Samuel 17:47':
    'Lord, this battle is Yours. I take only the step that is mine. In Jesus’ name, Amen.',
  'Psalm 34:8':
    'Lord, I taste and see that You are good. Let that be more than a sentence today. In Jesus’ name, Amen.',
  'Ephesians 3:20':
    'Lord, do exceeding abundantly above what I have asked. I open my hands. In Jesus’ name, Amen.',
  'Colossians 3:23':
    'Lord, I will do the next task heartily, as unto You — not as a show. In Jesus’ name, Amen.',
  '1 Chronicles 16:34':
    'Lord, I give thanks: You are good, and Your mercy endures forever. In Jesus’ name, Amen.',
};

function amen(body) {
  let t = String(body || '')
    .replace(/\s+/g, ' ')
    .trim();
  t = t.replace(/\s*In Jesus[’']? name,?\s*Amen\.?$/i, '').trim();
  t = t.replace(/[.!?]$/, '');
  if (!/^Lord\b/i.test(t) && !/^Father\b/i.test(t)) t = 'Lord, ' + t.charAt(0).toLowerCase() + t.slice(1);
  return t + '. In Jesus’ name, Amen.';
}

function okPrayer(line, ref, text) {
  const p = String(line || '')
    .replace(/\s+/g, ' ')
    .trim();
  if (!p || p.length < 36 || p.length > 220) return false;
  if (isStampPrayer(p)) return false;
  if (!/Amen\.?$/i.test(p)) return false;
  if (startsWrong(p, ref)) return false;
  if (situationLooksWrongForRef(p, ref)) return false;
  const judged = evaluateTeachingFields({ ref, setting: p, verseText: text });
  if (!judged.ok) return false;
  return true;
}

function buildPrayer(ref, text) {
  if (HARD[ref] && okPrayer(HARD[ref], ref, text)) return HARD[ref];
  const hook = verseQuote(text, 52);
  const l = String(text || '').toLowerCase();
  const cands = [];
  if (/bless|praise|sing|thanks|joyful noise/.test(l)) {
    cands.push(amen('I bless Your name with these words: “' + hook + '”'));
    cands.push(amen('Receive this thanks: “' + hook + '”'));
  }
  if (/fear|afraid|dismay/.test(l)) {
    cands.push(amen('When fear rises, hold me with “' + hook + '”'));
    cands.push(amen('I bring You this fear. Be my hold: “' + hook + '”'));
  }
  if (/trust|refuge|rock|shield|fortress|shadow/.test(l)) {
    cands.push(amen('I put my weight on You: “' + hook + '”'));
  }
  if (/pray|prayer|ask|seek|knock|supplication/.test(l)) {
    cands.push(amen('Hear this as my whole request: “' + hook + '”'));
  }
  if (/word|law|statute|precept|lamp|testimon/.test(l)) {
    cands.push(amen('Write this on my path today: “' + hook + '”'));
  }
  if (/wait|patient/.test(l)) {
    cands.push(amen('Teach me to wait. I hold “' + hook + '”'));
  }
  if (/\blove\b|mercy|forgiv|compassion/.test(l)) {
    cands.push(amen('Let this mercy reach me, then go out from me: “' + hook + '”'));
  }
  if (/strength|strong|courage|might/.test(l)) {
    cands.push(amen('Give me strength for this hour: “' + hook + '”'));
  }
  if (/peace|still|rest/.test(l)) {
    cands.push(amen('Still my heart with “' + hook + '”'));
  }
  if (/shepherd|pasture|want/.test(l)) {
    cands.push(amen('Shepherd me. I bring You this want: “' + hook + '”'));
  }
  if (/save|salvation|redeem/.test(l)) {
    cands.push(amen('Show me Your salvation again today: “' + hook + '”'));
  }
  if (/light|path/.test(l)) {
    cands.push(amen('Light the next step: “' + hook + '”'));
  }
  cands.push(amen('Let this word be true in me today: “' + hook + '”'));
  cands.push(amen('I receive this line as Yours: “' + hook + '”'));
  for (const c of cands) {
    if (okPrayer(c, ref, text)) return c;
  }
  return amen('Let “' + hook + '” change how I walk today');
}

function uniquify(line, extra, ref, used) {
  const keyOf = (s) =>
    String(s || '')
      .toLowerCase()
      .replace(/\s+/g, ' ')
      .trim();
  let next = String(line || '').replace(/\s+/g, ' ').trim();
  if (!used[keyOf(next)] || used[keyOf(next)] === ref) return next;
  const tries = [
    next.replace(/\s*In Jesus[’']? name,?\s*Amen\.?$/i, '') + ' — “' + extra + '.” In Jesus’ name, Amen.',
    amen(next.replace(/\s*In Jesus[’']? name,?\s*Amen\.?$/i, '') + ' Keep me in “' + extra + '”'),
  ];
  for (const t of tries) {
    const line2 = String(t).replace(/\s+/g, ' ').trim().slice(0, 220);
    if (line2.length >= 36 && (!used[keyOf(line2)] || used[keyOf(line2)] === ref)) return line2;
  }
  return amen('Keep me in “' + extra + '” today').slice(0, 220);
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

  const used = Object.create(null);
  let n = 0;
  for (let i = 0; i < year.length; i++) {
    const cal = year[i];
    const ref = String(cal.ref || '')
      .replace(/\s*\(KJV\)\s*$/i, '')
      .trim();
    const row = byRef[ref];
    if (!row) continue;
    const text = String(cal.text || row.text || '').trim();
    const extra = verseQuote(text, 36);
    const next = uniquify(buildPrayer(ref, text), extra, ref, used);
    row.prayer = next;
    used[next.toLowerCase()] = ref;
    n += 1;
  }

  fs.writeFileSync(explPath, parts.before + JSON.stringify(rows, null, 2) + parts.after);

  const fresh = loadExplanations();
  const m = Object.create(null);
  let stamp = 0;
  let bad = 0;
  for (const r of fresh) {
    const p = String(r.prayer || '')
      .replace(/\s+/g, ' ')
      .trim();
    const k = p.toLowerCase();
    m[k] = (m[k] || 0) + 1;
    if (isStampPrayer(p) || !okPrayer(p, r.ref, r.text)) {
      bad += 1;
      if (stamp < 8) {
        console.log('bad', r.ref, '|', p.slice(0, 110));
        stamp += 1;
      }
    }
  }
  const reused = Object.values(m).filter((c) => c > 1).reduce((a, b) => a + b, 0);
  console.log(
    'rewrite-hero-730-prayers: wrote',
    n,
    'unique',
    Object.keys(m).length,
    '/',
    fresh.length,
    'reuse-days',
    reused,
    'bad',
    bad
  );
  if (Object.keys(m).length < fresh.length || reused || bad) process.exitCode = 1;
}

main();
