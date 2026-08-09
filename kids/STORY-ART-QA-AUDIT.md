# Story Library — art + Q&A audit

Run: `node scripts/audit-story-library-art-qa.mjs --strict`  
Color & Tell: `node scripts/verify-coloring-art.mjs`

## Latest results (2026-08-09)

| Check | Result |
|-------|--------|
| Bible stories | 427 |
| Read-quiz packs | 413 |
| Coloring art paths exist (when mapped) | **all OK** |
| **Wrong art mismatches (forbidden list)** | **0** |
| Quiz answer index / joke-correct issues | **0** |
| Quiz correct-answer “foreign story” contamination | **0** |
| Color & Tell (82 stories / 324 scenes) | **pass** |

### Q&A
- Packs are keyed to the same library keys as `TDB_BIBLE_STORIES`.
- No pack was found with a correct answer naming a different famous story (Goliath/Noah/Jonah/etc.) than the story’s own text.
- 16 library keys lack a dedicated pack (mostly short epistle “revisited” cards); the UI builds a runtime quiz from title + KJV when needed.
- 2 quiz-only keys without a library story: `davidRepentance`, `simonOfCyrene`.

### Art
- Prefer **no** Color & Tell image over the **wrong** image.
- Removed bad aliases (e.g. Solomon→boy-David was already fixed; also garden prayer→temptation, Mary/Martha→children, passion→empty-tomb only, etc.).
- Wired more keys to real pages (Naaman, Jericho, Emmaus, Samson, Elijah chariot, etc.).
- ~268 stories still have no dedicated coloring page → legacy panel SVGs (shared placeholders). Not wrong Q&A; art is generic until a page is drawn.

### Ongoing
Re-run both scripts after changing maps, quizzes, or coloring-pages.
