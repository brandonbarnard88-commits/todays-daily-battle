#!/usr/bin/env node
/**
 * Seed bible_kjv from aruljohn/Bible-kjv (GitHub).
 * Run: SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... node scripts/seed-bible-kjv.mjs
 */
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.SUPABASE_URL || '';
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const BASE = 'https://raw.githubusercontent.com/aruljohn/Bible-kjv/master';

const BOOK_FILES = [
  'Genesis', 'Exodus', 'Leviticus', 'Numbers', 'Deuteronomy', 'Joshua', 'Judges', 'Ruth', '1Samuel', '2Samuel',
  '1Kings', '2Kings', '1Chronicles', '2Chronicles', 'Ezra', 'Nehemiah', 'Esther', 'Job', 'Psalm', 'Proverbs',
  'Ecclesiastes', 'Song of Solomon', 'Isaiah', 'Jeremiah', 'Lamentations', 'Ezekiel', 'Daniel', 'Hosea', 'Joel',
  'Amos', 'Obadiah', 'Jonah', 'Micah', 'Nahum', 'Habakkuk', 'Zephaniah', 'Haggai', 'Zechariah', 'Malachi',
  'Matthew', 'Mark', 'Luke', 'John', 'Acts', 'Romans', '1Corinthians', '2Corinthians', 'Galatians', 'Ephesians',
  'Philippians', 'Colossians', '1Thessalonians', '2Thessalonians', '1Timothy', '2Timothy', 'Titus', 'Philemon',
  'Hebrews', 'James', '1Peter', '2Peter', '1John', '2John', '3John', 'Jude', 'Revelation'
];

function bookToDisplay(book) {
  const map = { '1Samuel': '1 Samuel', '2Samuel': '2 Samuel', '1Kings': '1 Kings', '2Kings': '2 Kings',
    '1Chronicles': '1 Chronicles', '2Chronicles': '2 Chronicles', 'Song of Solomon': 'Song of Solomon',
    '1Corinthians': '1 Corinthians', '2Corinthians': '2 Corinthians', '1Thessalonians': '1 Thessalonians',
    '2Thessalonians': '2 Thessalonians', '1Timothy': '1 Timothy', '2Timothy': '2 Timothy',
    '1Peter': '1 Peter', '2Peter': '2 Peter', '1John': '1 John', '2John': '2 John', '3John': '3 John' };
  return map[book] || book;
}

async function fetchBook(book) {
  const url = `${BASE}/${book}.json`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed ${url}: ${res.status}`);
  return res.json();
}

async function main() {
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    console.error('Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY');
    process.exit(1);
  }
  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
  let inserted = 0;
  for (const book of BOOK_FILES) {
    try {
      const data = await fetchBook(book);
      const displayBook = data.book || bookToDisplay(book);
      const rows = [];
      const chapters = data.chapters || [];
      for (const chObj of chapters) {
        const ch = parseInt(chObj.chapter, 10);
        if (isNaN(ch)) continue;
        const verses = chObj.verses || [];
        for (const vObj of verses) {
          const v = parseInt(vObj.verse, 10);
          const text = vObj.text || '';
          if (isNaN(v) || !text) continue;
          const ref = `${displayBook} ${ch}:${v}`;
          rows.push({ book: displayBook, chapter: ch, verse: v, text: String(text).trim(), ref });
        }
      }
      if (rows.length) {
        const { error } = await supabase.from('bible_kjv').upsert(rows, { onConflict: 'ref' });
        if (error) console.error(book, error.message);
        else { inserted += rows.length; console.log(book, rows.length); }
      }
    } catch (e) {
      console.error(book, e.message);
    }
  }
  console.log('Done. Inserted:', inserted);
}

main().catch(console.error);
