# Teaching & Q&A upgrade (2026-08)

Shipped after full-site evaluation: make todaysdailybattle.com better at **teaching** and **answering Bible questions** without abandoning KJV-only, offline-first, no-fake-certainty North Star.

## Best-porch path (shipped)

| Item | Status |
|------|--------|
| Full KJV retrieval (`/data/kjv-full.json`) | P0 — live in loaders |
| Psalm ↔ Psalms body fix | `resolveBibleTextFromMap` |
| Home Ask = same core as Bible Tool | `ask-the-word-core.js` on `index.html`; `getHomeQaResponse` offline-first |
| No HF pastor voice default | Edge only if `ENABLE_HF_PASTOR=1`; client rejects fluff |
| Grow path (no new app) | Home + Explore: Explore → University → Plans → Life Lessons; story spine = Learn the Word |

## P0 — Full KJV retrieval (shipped after PR 19)

| Before | After |
|--------|--------|
| `loadBible` / search used root **`/kjv.json` (44 verses)** | Prefer **`/data/kjv-full.json` (~31k)** |
| `Psalm 23:1` empty (corpus keys are `Psalms N:M`) | `resolveBibleTextFromMap` tries **Psalm ↔ Psalms** |
| Stub accepted as success | Reject corpus **&lt; 1000** keys until full tried; stub last resort |

Smoke: `npm run test:full-kjv`

### Unified Ask the Word brain
- **`ask-the-word-core.js`** — curated answers → full KJV keyword search → honest empty state + next steps
- **`ask-the-word.js`** — bible-tool UI; offline-first; rejects weak server fluff
- **`data/ask-the-word-answers.json`** — ~323 enriched answers (verse text included)
- Homepage **`TDB_BIBLICAL_ANSWERS`** expanded (Jesus wept, dinosaurs/creation honesty, Romans author, covenant, justification, etc.)

### Edge function that works without `bible_kjv`
- **`supabase/functions/bible-qa`** loads **knowledge.json** + **verse-pocket.json**
- Curated packs first; optional table/embeddings only if present
- Always returns `verses: [{ ref, text }]` when known
- Includes **`next_steps`** (plan, lesson, chapter, Learn the Word)

### Learn the Word spine
- **`learn-the-word.html`** — six rooms: creation → fall → Israel → Christ → church → hope
- Linked from Home shelf, Explore, Site guide, footer, bible-tool note

### Teaching loops
- Homepage answer cards: **Keep walking** (chapter · Life Lessons · Learn the Word)
- Bible Tool answers: pill links for plan / chapter / study / spine

### Tooling
```bash
npm run build:ask-the-word   # regenerate JSON + edge packs
npm run test:ask-the-word    # smoke curated matches
```

Build pipeline runs `build:ask-the-word` before static copy.

## Deploy checklist

1. **Static site** — normal `npm run build` + host deploy (includes new JS/HTML/JSON under `data/`).
2. **Optional but recommended — Supabase table** (semantic search later):
   - Run `supabase-bible-kjv.sql` in SQL Editor
   - `SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... node scripts/seed-bible-kjv-local.mjs`
   - Optional: `HF_TOKEN=... node scripts/embed-bible-kjv.mjs`
3. **Edge function**:
   ```bash
   npm run build:ask-the-word
   supabase functions deploy bible-qa
   ```
4. Smoke live:
   - Home: “Why did Jesus weep?” / “Who was Ruth?”
   - `/bible-tool.html#ask-the-word-section` same questions offline
   - `/learn-the-word.html` loads

## Intentionally not done
- Free-form LLM as the product center (still optional polish only)
- Replacing porch tone with study-Bible density everywhere
- Auto-generating thousands of template breakdowns

## Files to know
| Path | Role |
|------|------|
| `ask-the-word-core.js` | Shared offline Q&A |
| `ask-the-word.js` | Bible Tool wire-up |
| `learn-the-word.html` | Teaching spine |
| `scripts/build-ask-the-word-data.mjs` | Data build |
| `scripts/seed-bible-kjv-local.mjs` | Seed from `data/kjv-full.json` |
| `docs/BIBLE-QA-SETUP.md` | Ops setup |
| `supabase/functions/bible-qa/index.ts` | Edge handler |
