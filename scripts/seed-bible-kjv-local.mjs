#!/usr/bin/env node
/**
 * Seed public.bible_kjv from local data/kjv-full.json (no GitHub fetch).
 *
 * Run:
 *   SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... node scripts/seed-bible-kjv-local.mjs
 *
 * Prerequisites: run supabase-bible-kjv.sql in Supabase SQL Editor first.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createClient } from '@supabase/supabase-js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');

const SUPABASE_URL = process.env.SUPABASE_URL || '';
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const BATCH = Number(process.env.SEED_BATCH || 400);

function parseRef(ref) {
  const m = String(ref).match(/^((?:[1-3]\s)?[A-Za-z]+(?:\s[A-Za-z]+)?)\s+(\d+):(\d+)$/);
  if (!m) return null;
  return { book: m[1], chapter: parseInt(m[2], 10), verse: parseInt(m[3], 10), ref };
}

async function main() {
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    console.error('Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY');
    process.exit(1);
  }
  const fullPath = path.join(root, 'data', 'kjv-full.json');
  if (!fs.existsSync(fullPath)) {
    console.error('Missing data/kjv-full.json');
    process.exit(1);
  }
  const full = JSON.parse(fs.readFileSync(fullPath, 'utf8'));
  const rows = [];
  for (const ref of Object.keys(full)) {
    const parsed = parseRef(ref);
    if (!parsed) continue;
    rows.push({
      book: parsed.book,
      chapter: parsed.chapter,
      verse: parsed.verse,
      text: String(full[ref] || '').trim(),
      ref: parsed.ref
    });
  }
  console.log('Rows to upsert:', rows.length);

  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
  let inserted = 0;
  for (let i = 0; i < rows.length; i += BATCH) {
    const chunk = rows.slice(i, i + BATCH);
    const { error } = await supabase.from('bible_kjv').upsert(chunk, { onConflict: 'ref' });
    if (error) {
      console.error('Batch error at', i, error.message);
      if (/Could not find the table|schema cache|PGRST205/i.test(error.message)) {
        console.error('Run supabase-bible-kjv.sql in the Supabase SQL Editor, then retry.');
        process.exit(1);
      }
    } else {
      inserted += chunk.length;
      if (inserted % 2000 === 0 || i + BATCH >= rows.length) {
        console.log('Upserted', inserted, '/', rows.length);
      }
    }
  }
  console.log('Done. Upserted:', inserted);
  console.log('Next: HF_TOKEN=... node scripts/embed-bible-kjv.mjs  (optional semantic search)');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
