# Ask the Bible — Bible Q&A Setup

Bible Q&A uses semantic search over KJV verses (pgvector + HuggingFace embeddings). No paid LLM.

## 1. Run SQL

In Supabase SQL Editor, run:

- `supabase-bible-kjv.sql` — creates `bible_kjv` table + `match_bible_verses` RPC

## 2. Seed KJV Data

Use the seed script to fetch KJV from GitHub and insert into `bible_kjv`:

```bash
SUPABASE_URL=https://YOUR_PROJECT.supabase.co SUPABASE_SERVICE_ROLE_KEY=your_key node scripts/seed-bible-kjv.mjs
```

Or run `scripts/seed-bible-kjv.mjs` after setting env vars. The script fetches from [aruljohn/Bible-kjv](https://github.com/aruljohn/Bible-kjv) and inserts `book`, `chapter`, `verse`, `text`, `ref`.

## 3. Generate Embeddings

Run the embed Edge Function (or use `scripts/embed-bible-kjv.mjs`) to fill the `embedding` column:

```bash
supabase functions deploy embed-kjv
# Then invoke with a trigger or run the script
```

Or use the Node script:

```bash
HF_TOKEN=your_huggingface_token node scripts/embed-bible-kjv.mjs
```

Requires `HF_TOKEN` (HuggingFace) and `SUPABASE_SERVICE_ROLE_KEY`. Uses `sentence-transformers/all-MiniLM-L6-v2` (384-dim).

## 4. Deploy bible-qa Edge Function

```bash
supabase functions deploy bible-qa
```

Set secrets:

- `HF_TOKEN` — HuggingFace token (Inference API, for embeddings + text generation)
- `HF_MODEL` — (optional) Text-generation model, default `HuggingFaceH4/zephyr-7b-beta`
- `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` — auto-injected by Supabase

The function uses two LLM calls after vector search: one for the answer, one for the prayer prompt.

## 5. Test

1. Open `bible-tool.html`
2. Type "Why did Jesus weep?" → Ask
3. Expect: "The Word says: John 11:35 – Jesus wept. …" + clickable sources

**Note:** The frontend uses a direct `fetch` fallback when the Supabase client isn't ready, so Q&A works as soon as the function is deployed—no client init race.

## Fallbacks

- No `HF_TOKEN` or embed fails → returns "Not sure—try 'hope' or read John 14."
- Empty table or RPC error → same fallback
- Frontend shows "Search coming soon" if Supabase client unavailable

## Rate Limits

HuggingFace free tier: ~30k chars/min. Consider caching embeddings or batching.
