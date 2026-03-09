# Active Bible Prompt Master Index

Master operations file for prompt packs, production status, and next actions.

## Pack Registry

- `ACTIVE-BIBLE-PROMPTS-1-20.md`
- `ACTIVE-BIBLE-PROMPTS-21-40.md`
- `ACTIVE-BIBLE-PROMPTS-41-60.md`
- `ACTIVE-BIBLE-PROMPTS-61-80.md`
- `ACTIVE-BIBLE-PROMPTS-81-100.md`
- `ACTIVE-BIBLE-PROMPTS-101-119.md`
- `ACTIVE-BIBLE-PROMPTS-120.md`
- `ACTIVE-BIBLE-PROMPTS-121-140.md`
- `ACTIVE-BIBLE-PROMPTS-141-160.md`

## Story Range Status

| Range | Prompt Pack | Drafted | Generated | Vectorized | Integrated |
|---|---|---|---|---|---|
| 1-20 | `ACTIVE-BIBLE-PROMPTS-1-20.md` | [x] | [ ] | [ ] | [ ] |
| 21-40 | `ACTIVE-BIBLE-PROMPTS-21-40.md` | [x] | [ ] | [ ] | [ ] |
| 41-60 | `ACTIVE-BIBLE-PROMPTS-41-60.md` | [x] | [ ] | [ ] | [ ] |
| 61-80 | `ACTIVE-BIBLE-PROMPTS-61-80.md` | [x] | [ ] | [ ] | [ ] |
| 81-100 | `ACTIVE-BIBLE-PROMPTS-81-100.md` | [x] | [ ] | [ ] | [ ] |
| 101-119 | `ACTIVE-BIBLE-PROMPTS-101-119.md` | [x] | [ ] | [ ] | [ ] |
| 120 | `ACTIVE-BIBLE-PROMPTS-120.md` | [x] | [ ] | [ ] | [ ] |
| 121-140 | `ACTIVE-BIBLE-PROMPTS-121-140.md` | [x] | [ ] | [ ] | [ ] |
| 141-160 | `ACTIVE-BIBLE-PROMPTS-141-160.md` | [x] | [ ] | [ ] | [ ] |

## Production Workflow (Required)

1. Generate clips from prompt pack in your chosen model.
2. QA each clip for reverence, consistency, and no modern overlays.
3. Export keyframes/stills and vectorize where needed.
4. Name assets with stable slugs (story key aligned).
5. Map into runtime via `story-assets-manifest.json`.
6. Integrate in UI (Daily Tile / mentor cards / autoplay queues).
7. Mark status table boxes as complete.

## Recommended Naming Convention

- Video: `active-bible-<story-slug>.mp4`
- Poster: `active-bible-<story-slug>-poster.png`
- Vector key art: `active-bible-<story-slug>.svg`
- Motion file (optional): `<story-slug>.riv`

## Runtime Helpers Already Available

Use `window.TDBStoryManifest` APIs:

- `buildVideoPromptByKey(storyKey)`
- `buildAllVideoPrompts()`
- `buildCinematicPromptByKey(storyKey)`
- `buildAllCinematicPrompts()`
- `pickDaily({ topic|tag, date })`
- `filterByTag(tag)`
- `filterByTheme(themeText)`

## Cinematic Exports

- Generate all cinematic director prompts:
  - `npm run prompts:cinematic`
- Sync `story-assets-manifest.json` to full 160 stories from pack headings:
  - `npm run prompts:sync-manifest-160`
- Upgrade all `ACTIVE-BIBLE-PROMPTS-*` packs to cinematic format:
  - `npm run prompts:upgrade-packs`
- Output files:
  - `cinematic-story-prompts.json`
  - `cinematic-story-prompts.md`

## Known Gaps / Notes

- Some entries are intentional "variant" placeholders and should be expanded before generation.

## Completion Definition

A story range is considered complete only when:

- `Drafted` = checked
- `Generated` = checked
- `Vectorized` = checked
- `Integrated` = checked

Use this index as the source of truth during production.

