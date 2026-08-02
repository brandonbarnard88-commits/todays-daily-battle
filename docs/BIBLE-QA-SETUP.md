# Ask the Word — Bible Q&A Setup

**Primary path (2026-08):** offline-first curated answers + full KJV on device.  
**Optional online path:** Supabase Edge `bible-qa` with the same knowledge packs + verse pocket (works even when `bible_kjv` is missing).

## Architecture

| Layer | Role |
|-------|------|
| `ask-the-word-core.js` | Unified brain: curated JSON → full KJV keyword → next steps |
| `data/ask-the-word-answers.json` | ~300 human answers with verse text (built from `script.js`) |
| `data/kjv-full.json` | Full KJV map (ref → text) for offline search |
| Homepage `TDB_BIBLICAL_ANSWERS` | Same catalog in `script.js` for Home Ask the Word |
| Edge `bible-qa` | Curated knowledge first; table/embeddings optional |

Rebuild data anytime:

```bash
npm run build:ask-the-word
```

## 1. Run SQL (optional semantic search)

In Supabase SQL Editor, run:

- `supabase-bible-kjv.sql` — creates `bible_kjv` table + `match_bible_verses` RPC

**Production note:** If this table is missing, Edge Q&A still works via bundled knowledge packs.

## 2. Seed KJV Data (optional)

**Preferred (local full text):**

```bash
SUPABASE_URL=https://YOUR_PROJECT.supabase.co \
SUPABASE_SERVICE_ROLE_KEY=your_key \
node scripts/seed-bible-kjv-local.mjs
```

Legacy GitHub fetch: `scripts/seed-bible-kjv.mjs`.

## 3. Generate Embeddings (optional)

```bash
HF_TOKEN=your_huggingface_token node scripts/embed-bible-kjv.mjs
```

Uses `sentence-transformers/all-MiniLM-L6-v2` (384-dim).

## 4. Deploy bible-qa Edge Function

```bash
# Rebuild knowledge.json + verse-pocket.json first
npm run build:ask-the-word
supabase functions deploy bible-qa
```

Secrets:

- `HF_TOKEN` — optional (embeddings + polish)
- `HF_MODEL` — optional, default `microsoft/Phi-3-mini-4k-instruct`
- `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` — auto-injected

## 5. Test

### Offline / client (must pass without Edge)

1. Open `bible-tool.html`
2. Ask: `Who was Ruth?` → curated answer + Ruth verses + **Keep walking** links
3. Ask: `Why did Jesus weep?` → John 11:35 teaching
4. Ask: `What is grace?` → Ephesians 2:8 etc.

### Edge (after deploy)

```bash
curl -sS -X POST "$SUPABASE_URL/functions/v1/bible-qa" \
  -H "Authorization: Bearer $SUPABASE_ANON_KEY" \
  -H "Content-Type: application/json" \
  -d '{"query":"Why did Jesus weep?"}'
```

Expect `from: "curated"`, non-empty `verses[].text`, and `next_steps`.

## Teaching loops

Every solid answer should offer:

- Related Battle Plan (when tagged)
- Life Lesson / Life Lessons hub
- Full chapter reader
- [Learn the Word](../learn-the-word.html) spine

## Fallbacks

1. Curated knowledge pack  
2. Full KJV / verse-pocket keyword search  
3. Honest empty state → Learn the Word  

Server generic fluff without verse text is **rejected** by the client in favor of local curated/search.
