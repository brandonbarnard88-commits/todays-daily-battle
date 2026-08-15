#!/usr/bin/env node
/**
 * Strip the factory “In this passage of Scripture, the focus is this”
 * stamp and humanize leftover “Title — spoken by X to Y” lines.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { cleanSituationStamp } from './lib/teaching-quality.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');

function rewriteText(src) {
  const factory = /In this passage of Scripture, the focus is this:\s*/gi;
  let next = src.replace(factory, '');
  next = next.replace(
    /([^<>"\n]{2,80}?)\s+[—–-]\s+spoken by\s+([^<>"\n]+?)\s+to\s+([^<>"\n]+?)\./g,
    (full, title, who, audience) => cleanSituationStamp(full)
  );
  return next;
}

function rewriteFile(rel) {
  const full = path.join(root, rel);
  const src = fs.readFileSync(full, 'utf8');
  const next = rewriteText(src);
  if (next === src) return 0;
  fs.writeFileSync(full, next, 'utf8');
  const before = (src.match(/In this passage of Scripture, the focus is this/g) || []).length;
  const after = (next.match(/In this passage of Scripture, the focus is this/g) || []).length;
  const spokenBefore = (src.match(/spoken by /g) || []).length;
  const spokenAfter = (next.match(/spoken by /g) || []).length;
  console.log('rewrote', rel, 'factory', before, '→', after, 'spoken-by', spokenBefore, '→', spokenAfter);
  return 1;
}

const files = ['verse-context.js', 'hero-daily-365-explanations.js'];
for (const name of fs.readdirSync(root)) {
  if (/^topic-.*\.html$/.test(name)) files.push(name);
}

let changed = 0;
for (const rel of files) changed += rewriteFile(rel);
console.log('rewrite-factory-situation-stamps:', changed, 'files changed');
