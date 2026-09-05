#!/usr/bin/env node
/**
 * Every live Color story must have a `hear` script: place, story, one KJV line, one idea.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const listenPath = path.join(root, 'kids', 'data', 'coloring-listen.json');
const catPath = path.join(root, 'kids', 'color-and-tell.js');

const CITE = /\b(?:Genesis|Exodus|Leviticus|Numbers|Deuteronomy|Joshua|Judges|Ruth|Samuel|Kings|Chronicles|Ezra|Nehemiah|Esther|Job|Psalm|Psalms|Proverbs|Ecclesiastes|Isaiah|Jeremiah|Ezekiel|Daniel|Hosea|Joel|Amos|Obadiah|Jonah|Micah|Nahum|Habakkuk|Zephaniah|Haggai|Zechariah|Malachi|Matthew|Mark|Luke|John|Acts|Romans|Corinthians|Galatians|Ephesians|Philippians|Colossians|Thessalonians|Timothy|Titus|Philemon|Hebrews|James|Peter|Jude|Revelation)\b[^.\n]{0,24}\d+:\d+/i;
const QUOTE = /[“"][^”"]{8,}[”"]/;

function parseStoryIds(src) {
  const a = src.indexOf('var STORIES = ');
  const i = src.indexOf('[', a);
  if (a < 0 || i < 0) throw new Error('STORIES missing');
  let depth = 0;
  let end = i;
  for (let j = i; j < src.length; j++) {
    if (src[j] === '[') depth++;
    else if (src[j] === ']') {
      depth--;
      if (depth === 0) {
        end = j + 1;
        break;
      }
    }
  }
  const STORIES = Function('"use strict"; return (' + src.slice(i, end) + ')')();
  return STORIES.map((st) => st.id);
}

const fail = [];
if (!fs.existsSync(listenPath)) {
  console.error('verify-coloring-hear: missing kids/data/coloring-listen.json');
  process.exit(1);
}
const data = JSON.parse(fs.readFileSync(listenPath, 'utf8'));
const hear = (data && data.hear) || {};
const ids = parseStoryIds(fs.readFileSync(catPath, 'utf8'));

for (const id of ids) {
  const text = typeof hear[id] === 'string' ? hear[id].trim() : '';
  if (!text) {
    fail.push(id + ': missing hear');
    continue;
  }
  const words = text.split(/\s+/).filter(Boolean).length;
  if (words < 24) fail.push(id + ': hear too short (' + words + ' words)');
  if (words > 140) fail.push(id + ': hear too long (' + words + ' words) — keep one coloring-length listen');
  if (!QUOTE.test(text)) fail.push(id + ': hear needs one spoken KJV line in quotes');
  if (!CITE.test(text)) fail.push(id + ': hear must cite the KJV (book chapter:verse)');
  const beats = text.split(/\n+/).map((b) => b.trim()).filter(Boolean);
  if (beats.length < 4) fail.push(id + ': hear needs four beats (place, what happened, KJV, one idea)');
}

const extra = Object.keys(hear).filter((id) => !ids.includes(id));
if (extra.length) fail.push('hear has unknown keys: ' + extra.join(', '));

if (fail.length) {
  console.error('verify-coloring-hear FAIL');
  fail.forEach((m) => console.error('  -', m));
  process.exit(1);
}
console.log('verify-coloring-hear: OK — ' + ids.length + ' live Color hear scripts, KJV-cited');
