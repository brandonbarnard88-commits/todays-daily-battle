# KJV word notes (`kjv-word-notes.json`)

Human-curated glosses for KJV wording that often misleads modern readers. Built by `scripts/build-kjv-words.mjs` (source: `scripts/kjv-word-notes-entries.mjs`).

## Schema (version 3)

| Field | Required | Max | Description |
|--------|----------|-----|-------------|
| `version` | yes | — | Integer; bump when shape changes. |
| `about` | yes | — | Short description for maintainers. |
| `words[]` | yes | — | Ordered list of entries. |
| `word` | yes | — | Display headword (lowercase lemma). |
| `note` | yes | ~400 chars | Plain explanation; calm, specific; no hype. Legacy calm-gloss field, still shipped for current consumers. |
| `shortGloss` | yes | ~400 chars | Same content as `note`, exposed for new two-layer consumers. |
| `concordance` | yes | — | Key passed to Hub concordance (`bible/tools.html?q=`). Usually equals `word`; override if the concordance indexes a different lemma. |
| `examples` | yes | **3–5** | KJV verse references (strings) illustrating the note. |
| `step` | no | ~180 chars | One small, practical step for the reader (optional). Legacy field kept for current consumers. |
| `howToRead` | no | ~180 chars | Same content as `step`, exposed for the newer calm/deep split. |
| `why` | no | ~220 chars | “Why it matters today” blurb for lexicon UI (`kjv-lexicon.json` field `w`). In source entries use `why`; rebuild also carries forward existing `why` from the previous JSON when omitted. |
| `whyToday` | no | ~220 chars | Same content as `why`, exposed for the newer calm/deep split. |
| `deepDive` | no | — | Optional richer study block for the flagship word-help flow. |
| `deepDive.kjvEraUsage` | no | ~260 chars | Brief note about how the word often functioned in KJV-era English. |
| `deepDive.keyCrossRefs` | no | **2–5** | Key KJV references for deeper study. |
| `deepDive.studyNotes` | no | ~420 chars | 2–4 sentence deeper note in the site’s calm voice. |
| `deepDive.relatedWords` | no | **0–6** | Related headwords already present in the curated word-help set. |
| `deepDive.theologicalWeight` | no | — | Short prioritization label such as `High` or `Medium`; use only when it genuinely helps. |
| `c` | no | — | Optional concordance lemma override on source objects (`w` headword still indexes the entry). |

## Rules

- **KJV only** for examples and wording.
- **3–5 example refs** per entry (not full verse text in JSON — keeps file small; verses load in Bible Tool / reader).
- No Greek/Hebrew jargon unless briefly plain-English.
- Tone: quiet friend at dawn — warm, direct, no fluff.
- Keep the default layer calm: short gloss first, deep content always optional.
- Preserve backward compatibility for existing consumers: `note` / `step` / `why` still ship even when `shortGloss` / `howToRead` / `whyToday` are present.

## Build

```bash
npm run build:kjv-words
```

(`node scripts/build-kjv-words.mjs` — source entries live in `scripts/kjv-word-notes-entries.mjs`.)

Writes `kjv-word-notes.json` at repo root. Run after editing entries; commit both the source and generated JSON.
