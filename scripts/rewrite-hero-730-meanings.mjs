#!/usr/bin/env node
/**
 * Rewrite hero “What it means” for every queue day whose plain is BBE echo,
 * KJV reprint, or a generic comfort stamp. Leaves good plains alone.
 *
 *   node scripts/rewrite-hero-730-meanings.mjs
 */
import fs from 'fs';
import path from 'path';
import vm from 'vm';
import { fileURLToPath } from 'url';
import { loadYear365 } from './lib/hero-daily-verse-pick.mjs';
import { isWeakPlainStamp, isBbeEcho, isNearVerbatimPlain } from './lib/teaching-quality.mjs';
import {
  buildFamousVersePlain,
  modernizeKjvText,
  lookupBbeText,
  isWeakLaymanPlain,
} from './lib/hero-layman-plain.mjs';
import { situationLooksWrongForRef } from './lib/verse-teaching-guard.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const explPath = path.join(root, 'hero-daily-365-explanations.js');

function loadExplanations() {
  const code = fs.readFileSync(explPath, 'utf8');
  const sandbox = { console };
  sandbox.window = sandbox;
  sandbox.globalThis = sandbox;
  vm.runInNewContext(code, sandbox, { filename: 'hero-daily-365-explanations.js' });
  return sandbox.__TDB_HERO_DAILY_EXPLANATIONS;
}

function bbeOf(ref) {
  return lookupBbeText(ref, root);
}

function needsRewrite(plain, text, bbe) {
  const p = String(plain || '').trim();
  if (!p) return true;
  if (isWeakPlainStamp(p)) return true;
  if (isWeakLaymanPlain(p, text)) return true;
  if (bbe && isBbeEcho(p, bbe)) return true;
  if (text && isNearVerbatimPlain(p, text)) return true;
  if (/carry fear alone/i.test(p)) return true;
  if (/care is for you today/i.test(p) && /day feels thin/i.test(p)) return true;
  if (/hold what the words actually say/i.test(p)) return true;
  if (/^held in the words/i.test(p)) return true;
  if (/that is the point —/i.test(p) && /hath |thou |ye |unto /.test(p)) return true;
  return false;
}

function firstClause(s, max) {
  let t = String(s || '').replace(/\s+/g, ' ').trim();
  t = t.replace(/^[-–—]\s*(A Psalm[^.]*\.\s*)+/i, '');
  t = t.replace(/^[-–—]\s*(Of David[^.]*\.\s*)+/i, '');
  t = t.replace(/^[-–—]\s*(A Song[^.]*\.\s*)+/i, '');
  const cut = t.split(/(?<=[.!?;:])\s+/)[0] || t;
  t = cut.length <= max ? cut : cut.slice(0, max).replace(/\s+\S*$/, '');
  return t.replace(/\s+/g, ' ').trim();
}

function closerFor(text) {
  const l = String(text || '').toLowerCase();
  if (/east is from the west/.test(l)) return 'gone, not stored next door';
  if (/heaven is high above the earth/.test(l)) return 'not a thin layer';
  if (/from day to day|as long as i live|while i have my being/.test(l)) return 'not a one-day song';
  if (/good shepherd|giveth his life for the sheep/.test(l)) return 'He does not leave the flock';
  if (/author and finisher|looking unto jesus/.test(l)) return 'He finishes what He starts';
  if (/ask, and it shall be given|seek, and ye shall find/.test(l)) return 'the Father is not hiding';
  if (/if god be for us/.test(l)) return 'the last word is His, not the accuser’s';
  if (/little flock/.test(l)) return 'the Father is not stingy with the kingdom';
  if (/made us, and not we ourselves/.test(l)) return 'we are His, not our own project';
  if (/gates with thanksgiving|courts with praise/.test(l)) return 'enter with thanks, not after you feel ready';
  if (/light of the world/.test(l)) return 'you do not have to walk in the dark';
  if (/casteth out fear|no fear in love/.test(l)) return 'perfect love drives fear out';
  if (/everlasting strength|unchanging rock/.test(l)) return 'His strength does not run out';
  if (/slow to anger/.test(l)) return 'He is not quick to finish you';
  if (/giveth wisdom|out of his mouth/.test(l)) return 'not a private cleverness';
  if (/worketh in you both to will/.test(l)) return 'the wanting and the doing are His work';
  if (/destitute|not despise their prayer/.test(l)) return 'He does not despise an empty-handed cry';
  if (/lively hope|resurrection/.test(l)) return 'living hope, not a mood';
  if (/new song/.test(l)) return 'praise that answers what He has already done';
  if (/joyful noise|all ye lands|all the earth/.test(l)) return 'not a private whisper only';
  if (/serve the lord with gladness/.test(l)) return 'not a dragged foot';
  if (/bless the lord, o my soul/.test(l)) return 'all that is in you, not only the polite part';
  if (/forgiveth all thine iniquities|healeth all thy diseases/.test(l)) return 'mercy that deals with the real wound';
  if (/renewed like the eagle/.test(l)) return 'life given, not squeezed out';
  if (/from everlasting to everlasting/.test(l)) return 'mercy that outlasts the family line';
  if (/thou art very great/.test(l)) return 'honor is His, not ours';
  if (/make known his deeds/.test(l)) return 'so other people hear His deeds, not only you';
  if (/praise is comely|praise is beautiful/.test(l)) return 'praise is fitting, not extra';
  if (/light is sown/.test(l)) return 'joy that grows, not a flash';
  if (/great in zion|high above all the people/.test(l)) return 'worship that knows who is actually King';
  if (/mercy endureth for ever|he is good: for his mercy/.test(l)) return 'He is good, and His mercy does not run out';
  if (/with my whole heart|with all my heart/.test(l)) return 'with the whole heart, not a private mutter';
  if (/blessed is the man that feareth/.test(l)) return 'the one who fears Him is the one who is blessed';
  if (/the battle is the lord/.test(l)) return 'the battle is His, not yours to finish alone';
  if (/exceeding abundantly|above all that we ask/.test(l)) return 'He can do more than you asked or imagined';
  if (/faithful is he that calleth you/.test(l)) return 'the One who called you will also do it';
  if (/keep yourselves from idols/.test(l)) return 'keep yourselves from anything that takes His place';
  if (/law of the lord is perfect/.test(l)) return 'His law is perfect — it converts the soul';
  if (/sing unto|praise|give thanks|thanksgiving|worship/.test(l)) return 'praise aimed at Him, not at the room';
  if (/mercy|forgiv|transgression|iniquit/.test(l)) return 'mercy that actually moves the sin';
  if (/trust|rock|strength|refuge/.test(l)) return 'put your weight where it will hold';
  if (/wisdom|understand|knowledge/.test(l)) return 'wisdom from His mouth, not a private trick';
  if (/fear not|be not afraid|afraid/.test(l)) return 'do not let fear have the last word';
  if (/shepherd|flock|sheep/.test(l)) return 'He keeps the flock Himself';
  if (/pray|prayer|ask|seek|knock/.test(l)) return 'bring the real request; He hears';
  if (/word|statute|command|law of the lord/.test(l)) return 'His way is for your good';
  if (/light|lamp|dark/.test(l)) return 'enough light for the next step';
  if (/preserve|keep you from evil|keep you from/.test(l)) return 'He keeps you; that is His work';
  if (/instruct you and teach you/.test(l)) return 'He will show the way, not leave you guessing';
  if (/good to all/.test(l)) return 'His goodness is not a private club';
  if (/father pitieth/.test(l)) return 'He pities those who fear Him as a father pities his child';
  if (/wait you only upon god|wait thou only/.test(l)) return 'wait on God only — not on every other rescue';
  if (/daily loadeth us with benefits/.test(l)) return 'daily benefits, not a rare leftover';
  if (/little children to come/.test(l)) return 'let the children come; do not stop them';
  if (/redeemeth thy life|redeemeth your life/.test(l)) return 'He redeems your life from the pit';
  if (/strong hold in the day of trouble/.test(l)) return 'a strong hold when the day is trouble';
  if (/all grace abound/.test(l)) return 'He can make grace overflow for every good work';
  if (/gladness in my heart/.test(l)) return 'gladness He put there — more than their grain and wine';
  return 'take the verse as it stands';
}

function okLine(line, text, bbe, ref) {
  const p = String(line || '').replace(/\s+/g, ' ').trim();
  if (!p || p.length < 24 || p.length > 220) return false;
  if (needsRewrite(p, text, bbe)) return false;
  if (situationLooksWrongForRef(p, ref)) return false;
  return true;
}

const HARD = {
  'Nahum 1:7':
    'When the day is trouble, run to the Lord — He is good, and He knows the people who trust Him.',
};

function buildMeaning(ref, text) {
  const kjv = String(text || '').replace(/\s+/g, ' ').trim();
  const bbe = bbeOf(ref);
  if (HARD[ref] && okLine(HARD[ref], kjv, bbe, ref)) return HARD[ref];
  const famous = buildFamousVersePlain(ref, kjv);
  if (okLine(famous, kjv, bbe, ref)) return famous;

  const modern = firstClause(modernizeKjvText(kjv), 92);
  const close = closerFor(kjv);
  const candidates = [
    modern.replace(/[.!?]$/, '') + ' — ' + close + '.',
    close.charAt(0).toUpperCase() + close.slice(1) + ': ' + modern.replace(/[.!?]$/, '') + '.',
    modern.replace(/[.!?]$/, '') + '. That is the point — ' + close + '.'
  ];
  for (const c of candidates) {
    const line = c.replace(/\s+/g, ' ').trim();
    if (okLine(line, kjv, bbe, ref)) return line;
  }
  const hook = firstClause(kjv, 48).replace(/[.!?]$/, '');
  const last =
    close.charAt(0).toUpperCase() +
    close.slice(1) +
    ' — “' +
    hook +
    '.”';
  if (okLine(last, kjv, bbe, ref)) return last;
  const modernShort = firstClause(modernizeKjvText(kjv), 70).replace(/[.!?]$/, '');
  const rescue = close.charAt(0).toUpperCase() + close.slice(1) + ': ' + modernShort + '.';
  if (okLine(rescue, kjv, bbe, ref)) return rescue;
  const words = modernizeKjvText(kjv)
    .replace(/[^a-zA-Z\s']/g, ' ')
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 9)
    .join(' ');
  const forced =
    close.charAt(0).toUpperCase() +
    close.slice(1) +
    '. The line itself is this: ' +
    words +
    '.';
  if (okLine(forced, kjv, bbe, ref)) return forced;
  return forced;
}

function escapeJsString(s) {
  return String(s)
    .replace(/\\/g, '\\\\')
    .replace(/"/g, '\\"');
}

function main() {
  const year = loadYear365(root);
  const rows = loadExplanations();
  const byRef = Object.create(null);
  for (const row of rows) {
    if (row && row.ref) byRef[String(row.ref).replace(/\s*\(KJV\)\s*$/i, '').trim()] = row;
  }

  const updates = Object.create(null);
  let need = 0;
  let kept = 0;
  for (let i = 0; i < year.length; i++) {
    const cal = year[i];
    const ref = String(cal.ref || '').replace(/\s*\(KJV\)\s*$/i, '').trim();
    const row = byRef[ref];
    if (!row) continue;
    const text = String(cal.text || row.text || '').trim();
    const bbe = bbeOf(ref);
    const old = String(row.plain || '').trim();
    if (!needsRewrite(old, text, bbe)) {
      kept += 1;
      continue;
    }
    const next = buildMeaning(ref, text);
    updates[ref] = next;
    need += 1;
  }

  const used = Object.create(null);
  for (const [ref, plain] of Object.entries(updates)) {
    const key = plain.toLowerCase();
    if (!used[key]) {
      used[key] = ref;
      continue;
    }
    const row = byRef[ref] || {};
    const text = String((year.find((v) => v && v.ref === ref) || {}).text || row.text || '').trim();
    const hook = firstClause(modernizeKjvText(text), 56).replace(/[.!?]$/, '');
    const uniq = plain.replace(/[.!?]$/, '') + ' (“' + hook + '”).';
    updates[ref] = uniq.slice(0, 220);
  }

  let src = fs.readFileSync(explPath, 'utf8');
  let written = 0;
  for (const [ref, plain] of Object.entries(updates)) {
    const re = new RegExp(
      '("ref":\\s*"' + ref.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '",\\s*"text":\\s*"(?:\\\\.|[^"\\\\])*",\\s*"plain":\\s*")((?:\\\\.|[^"\\\\])*)(")'
    );
    if (!re.test(src)) {
      console.error('rewrite-hero-730-meanings: could not patch', ref);
      continue;
    }
    src = src.replace(re, '$1' + escapeJsString(plain) + '$3');
    written += 1;
  }
  fs.writeFileSync(explPath, src);

  let still = 0;
  const fresh = loadExplanations();
  const by2 = Object.create(null);
  for (const row of fresh) {
    if (row && row.ref) by2[String(row.ref).replace(/\s*\(KJV\)\s*$/i, '').trim()] = row;
  }
  const leftover = [];
  for (let i = 0; i < year.length; i++) {
    const cal = year[i];
    const ref = String(cal.ref || '').replace(/\s*\(KJV\)\s*$/i, '').trim();
    const row = by2[ref] || {};
    const text = String(cal.text || row.text || '').trim();
    const p = String(row.plain || '').trim();
    if (needsRewrite(p, text, bbeOf(ref))) {
      still += 1;
      if (leftover.length < 12) leftover.push(ref + ' | ' + p.slice(0, 90));
    }
  }

  console.log(
    'rewrite-hero-730-meanings: kept',
    kept,
    'rewrote',
    written,
    'still-bad',
    still
  );
  leftover.forEach((l) => console.log(' •', l));
  if (still) process.exit(1);
}

main();
