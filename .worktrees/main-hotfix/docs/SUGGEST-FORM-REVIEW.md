# Suggest-Form Review — Step-by-Step

When you have entries in `feeling_suggestions`, use this process to map them into the search system.

---

## 1. Pull recent submissions

**Option A — Script (recommended):**

```bash
SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... npm run suggest:fetch
```

Last 30 days only:

```bash
SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... npm run suggest:fetch -- --days 30
```

Outputs anonymized top phrases by frequency, plus a "Top 8" line for copy-paste.

**Option B — Supabase SQL Editor** (run as service_role or admin):

```sql
SELECT created_at, phrase
FROM public.feeling_suggestions
ORDER BY created_at DESC
LIMIT 50;
```

Filter by date:

```sql
WHERE created_at > now() - interval '30 days'
```

---

## 2. Anonymize & cluster

- Remove any PII (names, locations, emails if slipped in).
- Group similar phrases (e.g. "my boss is toxic" + "hate my manager" → workplace anger).
- Look for patterns: new clusters? (e.g. divorce pain, pet died grief, postpartum depression).

---

## 3. Map top phrases

For each high-frequency or novel phrase:

| Action | Where |
|--------|------|
| Add to phrase map | `PHRASE_SEMANTIC_MAP` in script.js |
| Add token expansion | `PHRASE_TO_TOKENS` in script.js |
| Add heartfelt message | `HEARTFELT_INQUIRY_MESSAGES` in script.js |
| Add blended template | `BLENDED_HEARTFELT_TEMPLATES` for multi-topic |
| Add topic synonyms | `topics[topic].synonyms` in script.js |

**Example mappings:**

```javascript
// PHRASE_SEMANTIC_MAP
'divorce hurts': 'grief',
'postpartum depression bible': 'suffering',
'pet died': 'grief', 'pet loss': 'grief',

// PHRASE_TO_TOKENS (for blends)
'divorce hurts': ['grief', 'anger', 'loneliness'],
'postpartum depression bible': ['suffering', 'grief', 'hope'],
'pet died': ['grief'],

// HEARTFELT_INQUIRY_MESSAGES
{ patterns: ['divorce hurts', 'divorce pain'], message: "When your marriage ends—God sees the grief. He is near the brokenhearted and offers healing." },
{ patterns: ['pet died', 'pet loss', 'dog died', 'cat died'], message: "When a beloved pet is gone—God sees your grief. He cares for every creature and comforts those who mourn." },
```

---

## 4. Deploy & verify

1. Add mappings to script.js
2. `npm run test:site` and `npm run test:security`
3. `npm run build` then deploy
4. Test new phrases in incognito
5. Confirm verses, messages, and badges

---

## 5. Optional: mark reviewed

If you add a `reviewed_at` column later:

```sql
ALTER TABLE public.feeling_suggestions ADD COLUMN IF NOT EXISTS reviewed_at timestamptz;
UPDATE public.feeling_suggestions SET reviewed_at = now() WHERE id IN (...);
```

---

*See REVIEW-CADENCE-CHECKLIST.md for the 1–2 month rhythm. Add this to the cadence: "Review feeling_suggestions → add top 10–20 phrases."*
