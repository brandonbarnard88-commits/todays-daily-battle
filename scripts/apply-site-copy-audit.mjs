#!/usr/bin/env node
/**
 * Safe site-copy audit pass. No period-collapse (that broke `...` spreads).
 * Only touches .html and .js (skips huge generated data blobs and vendor).
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SKIP_DIR = new Set([
  'node_modules', 'dist', 'next-app', '.git', 'lighthouse-runs',
  'firebase-functions', 'coverage', 'vendor', 'functions',
]);
const SKIP_BASENAME = new Set([
  'plans-data.js',
  'kids-read-quiz-data.js',
  'ask-the-word-answers.json',
  'package-lock.json',
  'tree.json',
  'apply-site-copy-audit.mjs',
  'SITE-COPY-PHRASING-AUDIT.md',
]);

const RULES = [
  // Plans naming
  [/Update: these tracks are The Paths \(KJV Battle Plans\)\./g, 'Short KJV reading tracks—open any day.'],
  [/The Paths \(KJV Battle Plans\)/g, 'Plans'],
  [/Maps into The Paths/g, 'Related maps'],
  [/nested under The Paths/g, 'linked from Plans'],
  [/Open The Paths/g, 'Open Plans'],
  [/>The Paths</g, '>Plans<'],
  [/The Paths/g, 'Plans'],

  [/KJV Battle Plans/g, 'KJV Plans'],
  [/Open Battle Plans/g, 'Open Plans'],
  [/All Battle Plans/g, 'All Plans'],
  [/Back to Battle Plans/g, 'Back to Plans'],
  [/Battle Plans &rarr;/g, 'Plans &rarr;'],
  [/Battle Plans →/g, 'Plans →'],
  [/Battle Plans ·/g, 'Plans ·'],
  [/Battle Plans\./g, 'Plans.'],
  [/Battle Plans,/g, 'Plans,'],
  [/Battle Plans—/g, 'Plans—'],
  [/Battle Plans –/g, 'Plans –'],
  [/Battle Plans -/g, 'Plans -'],
  [/Battle Plans"/g, 'Plans"'],
  [/Battle Plans'/g, "Plans'"],
  [/Battle Plans</g, 'Plans<'],
  [/Battle Plans /g, 'Plans '],
  [/ Battle Plans/g, ' Plans'],
  [/"Battle Plans"/g, '"Plans"'],
  [/'Battle Plans'/g, "'Plans'"],

  // Look up
  [/Under The Library/g, 'Verse look-up'],
  [/nested under The Library/g, 'verse look-up tools'],
  [/Open in The Library/g, 'Look up this verse'],
  [/open The Library/g, 'look up a verse'],
  [/The Library for Ask the Word/g, 'Ask the Word'],
  [/>The Library</g, '>Look up a verse<'],
  [/The Library/g, 'Look up a verse'],

  // When it's hard (title-case UI labels only)
  [/>Hard day</g, ">When it's hard<"],
  [/"Hard day"/g, "\"When it's hard\""],
  [/'Hard day'/g, "'When it's hard'"],
  [/Hard day/g, "When it's hard"],
  [/>Calm room</g, ">When it's hard<"],
  [/"Calm room"/g, "\"When it's hard\""],
  [/'Calm room'/g, "'When it's hard'"],
  [/Calm room/g, "When it's hard"],

  [/Open Grace Ribbon Journal/g, 'Open Grace Ribbon'],
  [/>Walk the loop</g, '>A quieter path<'],
  [/Walk the loop/g, 'A quieter path'],

  // Dig deeper / Ask
  [/Who is He \/ she talking to\?/g, 'Who hears this?'],
  [/Who is He \/ she talking to/g, 'Who hears this'],
  [/How does this hit you today\?/g, 'A short answer from Scripture'],
  [/>FREE WILL</g, '>Free will<'],
  [/"FREE WILL"/g, '"Free will"'],
  [/'FREE WILL'/g, "'Free will'"],

  // Builder / defensive (do not use period-collapse afterward)
  [/—that is all right\. If you are the builder[^.]*\./g, '. Please try again.'],
  [/—that is all right\. Try again in a moment\./g, '. Try again in a moment.'],
  [/—that is all right\. Try again\./g, '. Try again.'],
  [/—that is all right\. Check the code\./g, '. Check the code.'],
  [/—that is all right\. Type your message instead\./g, '. You can type instead.'],
  [/—that is all right\. You can still read aloud quietly\./g, '. You can still read aloud quietly.'],
  [/—that is all right\. Refresh when you are online\./g, '. Refresh when you are online.'],
  [/—that is all right\. Use Download Current Output instead\./g, '. Use Download instead.'],
  [/—that is all right\. Use “Open email app” below\./g, '. Use “Open email app” below.'],
  [/—that is all right\. Use “Open email app”\./g, '. Use “Open email app”.'],
  [/—that is all right\. Try again or use “Open email app”\./g, '. Try again or use “Open email app”.'],
  [/—that is all right\. Try again or use the home page newsletter\./g, '. Try again or join the newsletter on the home page.'],
  [/—that is all right\. Join the Friday recap on the home page instead\./g, '. Join the Friday recap on the home page instead.'],
  [/—that is all right\. Select and copy manually\./g, '. Select and copy manually.'],
  [/—that is all right\. You can copy the URL from the address bar\./g, '. You can copy the URL from the address bar.'],
  [/—that is all right\. Try again or save another way if your device allows\./g, '. Try again if your device allows.'],
  [/—that is all right\. Please try again\./g, '. Please try again.'],
  [/—that is all right\. Check config\./g, '. Check config.'],
  [/—that is all right\. Add MP3 files to \/audio\/ when you are building offline audio\./g, '.'],
  [/—that is all right\./g, '.'],
  [/—that is all right/g, ''],

  // Search / welcome
  [
    /You&rsquo;re already welcome here&mdash;exactly as you are\. This porch keeps a hand-built map of pages; it isn&rsquo;t a live crawl, and your filter never leaves this browser\./g,
    'Find a page—plans, tools, or topics. Search stays on this device.',
  ],
  [
    /You&rsquo;re already welcome here&mdash;fun first, short moments, tiny KJV line\. No rush\./g,
    'No rush—pick one thing.',
  ],
  [
    /You're already welcome here—exactly as you are\. This porch keeps a hand-built map of pages; it isn't a live crawl, and your filter never leaves this browser\./g,
    'Find a page—plans, tools, or topics. Search stays on this device.',
  ],
  [
    /You're already welcome here—fun first, short moments, tiny KJV line\. No rush\./g,
    'No rush—pick one thing.',
  ],
  [/Laying out the gentle map&mdash;no rush\./g, 'Ready when you are.'],
  [/Laying out the gentle map—no rush\./g, 'Ready when you are.'],

  [/&larr; Today's Battle/g, '&larr; Home'],
  [/← Today's Battle/g, '← Home'],
  [/← Today’s Battle/g, '← Home'],

  [/>Faith loop</g, '>When a plan pauses<'],
  [/Faith loop/g, 'When a plan pauses'],
  [/porch tools/g, 'tools on this site'],
  [/Also on the porch:/g, 'Also:'],

  [/Kids Battle Home/g, 'Kids home'],
  [/Kids Battle/g, 'Kids'],
  [/Parent Dashboard/g, 'Family quiet view'],
  [/hard-refresh once\./g, 'refresh the page once.'],
  [/hard-refresh/g, 'refresh the page'],

  [/Open Grace Ribbon Journal/g, 'Open Grace Ribbon'],
];

function walk(dir, out = []) {
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    if (ent.name.startsWith('.') && ent.name !== '.github') continue;
    const p = path.join(dir, ent.name);
    if (ent.isDirectory()) {
      if (SKIP_DIR.has(ent.name)) continue;
      walk(p, out);
    } else {
      const ext = path.extname(ent.name);
      if (ext !== '.html' && ext !== '.js' && ext !== '.mjs' && ext !== '.cjs') continue;
      if (SKIP_BASENAME.has(ent.name)) continue;
      out.push(p);
    }
  }
  return out;
}

let filesChanged = 0;
for (const file of walk(ROOT)) {
  let raw;
  try {
    raw = fs.readFileSync(file, 'utf8');
  } catch {
    continue;
  }
  if (!raw || raw.length > 12_000_000) continue;
  let out = raw;
  for (const [pat, rep] of RULES) out = out.replace(pat, rep);
  if (out !== raw) {
    fs.writeFileSync(file, out);
    filesChanged++;
    console.log('updated', path.relative(ROOT, file));
  }
}
console.log('\nFiles changed:', filesChanged);
