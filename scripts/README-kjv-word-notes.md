# KJV word notes (`kjv-word-notes.json`)

Human-curated glosses for KJV wording that often misleads modern readers. Built by `scripts/build-kjv-words.mjs` (source: `scripts/kjv-word-notes-entries.mjs`).

## Schema (version 2)

| Field | Required | Max | Description |
|--------|----------|-----|-------------|
| `version` | yes | — | Integer; bump when shape changes. |
| `about` | yes | — | Short description for maintainers. |
| `words[]` | yes | — | Ordered list of entries. |
| `word` | yes | — | Display headword (lowercase lemma). |
| `note` | yes | ~400 chars | Plain explanation; calm, specific; no hype. |
| `concordance` | yes | — | Key passed to Hub concordance (`bible/tools.html?q=`). Usually equals `word`; override if the concordance indexes a different lemma. |
| `examples` | yes | **3–5** | KJV verse references (strings) illustrating the note. |
| `step` | no | ~180 chars | One small, practical step for the reader (optional). |

## Rules

- **KJV only** for examples and wording.
- **3–5 example refs** per entry (not full verse text in JSON — keeps file small; verses load in Bible Tool / reader).
- No Greek/Hebrew jargon unless briefly plain-English.
- Tone: quiet friend at dawn — warm, direct, no fluff.

## Build

```bash
npm run build:kjv-words
```

(`node scripts/build-kjv-words.mjs` — source entries live in `scripts/kjv-word-notes-entries.mjs`.)

Writes `kjv-word-notes.json` at repo root. Run after editing entries; commit both the source and generated JSON.
