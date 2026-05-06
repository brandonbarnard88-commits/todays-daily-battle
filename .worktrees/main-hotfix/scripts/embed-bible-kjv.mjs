#!/usr/bin/env node
/**
 * Generate embeddings for bible_kjv rows (HuggingFace all-MiniLM-L6-v2).
 * Run: HF_TOKEN=... SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... node scripts/embed-bible-kjv.mjs
 */
import { createClient } from '@supabase/supabase-js';

const HF_TOKEN = process.env.HF_TOKEN || '';
const SUPABASE_URL = process.env.SUPABASE_URL || '';
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const EMBED_URL = 'https://api-inference.huggingface.co/pipeline/feature-extraction/sentence-transformers/all-MiniLM-L6-v2';
const BATCH = 32;

async function embed(texts) {
  const res = await fetch(EMBED_URL, {
    method: 'POST',
    headers: { Authorization: `Bearer ${HF_TOKEN}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ inputs: texts }),
  });
  if (!res.ok) throw new Error(`HF ${res.status}: ${await res.text()}`);
  const data = await res.json();
  if (Array.isArray(data) && data[0] && Array.isArray(data[0])) return data;
  if (Array.isArray(data) && typeof data[0] === 'number') return [data];
  return [];
}

async function main() {
  if (!HF_TOKEN || !SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    console.error('Set HF_TOKEN, SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY');
    process.exit(1);
  }
  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
  let { data: rows } = await supabase.from('bible_kjv').select('id, text').is('embedding', null).limit(5000);
  if (!rows?.length) {
    console.log('No rows to embed.');
    return;
  }
  let done = 0;
  for (let i = 0; i < rows.length; i += BATCH) {
    const batch = rows.slice(i, i + BATCH);
    const texts = batch.map((r) => (r.text || '').slice(0, 512));
    try {
      const vectors = await embed(texts);
      for (let j = 0; j < batch.length; j++) {
        const vec = vectors[j];
        if (vec && vec.length === 384) {
          await supabase.from('bible_kjv').update({ embedding: vec }).eq('id', batch[j].id);
          done++;
        }
      }
      console.log('Embedded', done, '/', rows.length);
    } catch (e) {
      console.error('Batch error:', e.message);
    }
    await new Promise((r) => setTimeout(r, 500));
  }
  console.log('Done. Embedded', done);
}

main().catch(console.error);
