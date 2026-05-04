#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const verifyDist = process.argv.includes('--verify-dist');

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function readText(filePath) {
  return fs.readFileSync(filePath, 'utf8');
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

function verifySet(baseDir, label) {
  const notesPath = path.join(baseDir, 'kjv-word-notes.json');
  const lexPath = path.join(baseDir, 'kjv-lexicon.json');
  const toolsPath = path.join(baseDir, 'bible', 'tools.html');
  const mystudyPath = path.join(baseDir, 'mystudy.html');

  assert(fs.existsSync(notesPath), `${label}: missing kjv-word-notes.json`);
  assert(fs.existsSync(lexPath), `${label}: missing kjv-lexicon.json`);
  assert(fs.existsSync(toolsPath), `${label}: missing bible/tools.html`);
  assert(fs.existsSync(mystudyPath), `${label}: missing mystudy.html`);

  const notes = readJson(notesPath);
  const lex = readJson(lexPath);
  const toolsHtml = readText(toolsPath);
  const mystudyHtml = readText(mystudyPath);

  const words = Array.isArray(notes.words) ? notes.words : [];
  const deepEntries = words.filter((entry) => entry && entry.deepDive && typeof entry.deepDive === 'object');
  assert(deepEntries.length >= 100, `${label}: expected at least 100 deep-dive entries, found ${deepEntries.length}`);

  ['charity', 'grace', 'faith', 'cross', 'resurrection'].forEach((word) => {
    const entry = words.find((item) => item && item.word === word);
    assert(entry, `${label}: missing seeded word "${word}"`);
    assert(entry.shortGloss && entry.howToRead && entry.whyToday, `${label}: ${word} is missing calm layer aliases`);
    assert(entry.deepDive && entry.deepDive.studyNotes, `${label}: ${word} is missing deep study notes`);
    assert(Array.isArray(entry.deepDive.keyCrossRefs) && entry.deepDive.keyCrossRefs.length >= 2, `${label}: ${word} is missing deep cross references`);
    const lexEntry = lex.words && lex.words[word];
    assert(lexEntry, `${label}: lexicon missing "${word}"`);
    assert(lexEntry.d && lexEntry.d.studyNotes, `${label}: lexicon missing deep block for "${word}"`);
  });

  ['abide', 'cast', 'supplication', 'watch', 'faint', 'reins', 'stedfast', 'temperance', 'vexed'].forEach((word) => {
    const entry = words.find((item) => item && item.word === word);
    assert(entry, `${label}: missing expanded word "${word}"`);
    assert(entry.shortGloss && entry.howToRead && entry.whyToday, `${label}: ${word} is missing calm layer fields`);
    assert(entry.deepDive && entry.deepDive.studyNotes, `${label}: ${word} is missing deep study notes`);
    const lexEntry = lex.words && lex.words[word];
    assert(lexEntry, `${label}: lexicon missing expanded word "${word}"`);
    assert(lexEntry.d && Array.isArray(lexEntry.d.keyCrossRefs) && lexEntry.d.keyCrossRefs.length >= 2, `${label}: lexicon missing deep cross references for "${word}"`);
  });

  ['quit', 'mammon', 'publican', 'physician', 'strait'].forEach((word) => {
    const entry = words.find((item) => item && item.word === word);
    assert(entry, `${label}: missing promoted word "${word}"`);
    assert(entry.whyToday, `${label}: ${word} is missing whyToday`);
    assert(entry.deepDive && entry.deepDive.studyNotes, `${label}: ${word} is missing promoted deep study notes`);
    const lexEntry = lex.words && lex.words[word];
    assert(lexEntry, `${label}: lexicon missing promoted word "${word}"`);
    assert(lexEntry.d && lexEntry.d.theologicalWeight, `${label}: lexicon missing promoted deep metadata for "${word}"`);
  });

  ['reprobate', 'lucre', 'concupiscence', 'chambering', 'riot', 'carefulness', 'emulation', 'revellings', 'variance', 'talent'].forEach((word) => {
    const entry = words.find((item) => item && item.word === word);
    assert(entry, `${label}: missing maturity word "${word}"`);
    assert(entry.shortGloss && entry.howToRead && entry.whyToday, `${label}: ${word} is missing maturity calm fields`);
    assert(entry.deepDive && Array.isArray(entry.deepDive.relatedWords) && entry.deepDive.relatedWords.length >= 2, `${label}: ${word} is missing maturity deep related words`);
    const lexEntry = lex.words && lex.words[word];
    assert(lexEntry, `${label}: lexicon missing maturity word "${word}"`);
    assert(lexEntry.d && lexEntry.d.studyNotes && lexEntry.d.theologicalWeight, `${label}: lexicon missing maturity deep block for "${word}"`);
  });

  ['hearken', 'haughty', 'meet', 'leasing', 'sundry', 'convenient', 'matrix', 'penny', 'cloak', 'napkin'].forEach((word) => {
    const entry = words.find((item) => item && item.word === word);
    assert(entry, `${label}: missing quiet-depth word "${word}"`);
    assert(entry.shortGloss && entry.howToRead && entry.whyToday, `${label}: ${word} is missing quiet-depth calm fields`);
    assert(entry.deepDive && Array.isArray(entry.deepDive.keyCrossRefs) && entry.deepDive.keyCrossRefs.length >= 2, `${label}: ${word} is missing quiet-depth cross references`);
    const lexEntry = lex.words && lex.words[word];
    assert(lexEntry, `${label}: lexicon missing quiet-depth word "${word}"`);
    assert(lexEntry.d && lexEntry.d.studyNotes && Array.isArray(lexEntry.d.relatedWords) && lexEntry.d.relatedWords.length >= 2, `${label}: lexicon missing quiet-depth deep block for "${word}"`);
  });

  ['chasten', 'constrained', 'earnest', 'fain', 'froward', 'gainsay', 'hale', 'intreat', 'jot', 'notwithstanding'].forEach((word) => {
    const entry = words.find((item) => item && item.word === word);
    assert(entry, `${label}: missing fresh deep-dive word "${word}"`);
    assert(entry.shortGloss && entry.howToRead && entry.whyToday, `${label}: ${word} is missing fresh calm fields`);
    assert(entry.deepDive && entry.deepDive.studyNotes, `${label}: ${word} is missing fresh deep study notes`);
    assert(entry.deepDive && Array.isArray(entry.deepDive.keyCrossRefs) && entry.deepDive.keyCrossRefs.length >= 2, `${label}: ${word} is missing fresh cross references`);
    const lexEntry = lex.words && lex.words[word];
    assert(lexEntry, `${label}: lexicon missing fresh word "${word}"`);
    assert(lexEntry.d && lexEntry.d.theologicalWeight && Array.isArray(lexEntry.d.relatedWords) && lexEntry.d.relatedWords.length >= 2, `${label}: lexicon missing fresh deep block for "${word}"`);
  });

  const husbandman = words.find((item) => item && item.word === 'husbandman');
  assert(husbandman, `${label}: missing refreshed word "husbandman"`);
  assert(husbandman.deepDive && husbandman.deepDive.theologicalWeight === 'High', `${label}: husbandman did not receive refreshed deep-dive weight`);

  assert(toolsHtml.includes('id="kjv-word-helps-deep-toggle"'), `${label}: workshop deep mode toggle missing`);
  assert(toolsHtml.includes('Short help for everyday reading. Deep Dive for longer study. Both stay on this device.'), `${label}: workshop intro line missing`);
  assert(toolsHtml.includes('Choose how this shelf opens on this device.'), `${label}: workshop mode label missing`);
  assert(toolsHtml.includes('Short Helps'), `${label}: workshop short-helps label missing`);
  assert(toolsHtml.includes('Deep Dive Mode'), `${label}: workshop deep-mode label missing`);
  assert(mystudyHtml.includes('id="mystudy-word-study-selected"'), `${label}: My Study deep handoff missing`);
}

verifySet(root, 'source');
if (verifyDist) {
  verifySet(path.join(root, 'dist'), 'dist');
}

console.log(`verify-kjv-word-depth: ok${verifyDist ? ' (source + dist)' : ' (source)'}`);
