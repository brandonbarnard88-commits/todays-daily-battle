# Kids Architecture – Consolidated (April 2026)

## Final Structure (Preserves All Intentional Experiences)

**Core Experiences (never remove):**
- **Kids Battle Home** (`kids/index.html`): Daily 2-minute habit (verse, prayer, doodle), streaks, badges, playful sky theme. Entry point for families.
- **Bible Story Library** (`kids/corner.html`): The rich hub. ~70 stories / **280+ scenes**. Searchable grid, read-along, read-and-quiz, comic panels, coloring integration (`color-and-tell.js`), Story Master progress. Primary deep experience for stories.
- **Bible Loop Library** (`kids-corner.html`): Short 10–15s hand-drawn KJV animated loops with ukulele SFX, gold stars, calm replay focus. Distinct pace (per kids-rule.mdc).
- **Coloring & Printables** (`coloring.html` + `kids-coloring-pack.html`): Digital Color & Tell canvas (save art, slideshow of child's own work), printable pack, and perfected master prompt for parents/teachers to generate additional pages at home.

All 280+ scenes, loops, quizzes, streaks, badges, offline behavior, and coloring canvas remain fully intact.

## Key Files & Responsibilities

- `kids/index.html` + `kids-battle.js/css` + `kids-page-sky.*` — Daily battle home + shared sky effects.
- `kids/corner.html` + `kids-corner.js` + `kids-all-stories.js` + `kids-story-fuse-search.js` + `kids-read-quiz-data.js` + `color-and-tell.js` — Story library (main hub for 280+ scenes).
- `kids-corner.html` + `kids-corner.css` + loop player — Loop library (distinct calm experience).
- `coloring.html` + `kids-coloring-pack.html` + `color-and-tell.js` — Coloring experience + parent master prompt tool.
- Shared: `coloring-pages/*.svg` (280+ scenes), `kids/kids-digital-coloring-book.*`, sky utilities, quiz data.

## Deprecated / Consolidated
- `kids-beta.html`, `parent.html`, `all-stories.html` — Redirect or remove (functionality lives in corner.html or coloring.html).
- Duplicate redirect logic — Consolidated into shared utilities.
- Overlapping CSS (multiple sky/coloring/rule files) — Merged where safe; distinct personalities preserved (playful battle vs serene loops vs clean coloring).
- Old audit/PROMPTS/generation scripts — Knowledge moved here; scripts updated or deprecated with clear comments.
- Legacy duplicate panel SVGs — Cleaned.

## Navigation Principles
- Clear hierarchy: Home → Story Library (rich) or Loop Library (calm) or Coloring.
- All pages link to each other and back to main site.
- Parent/teacher tools prominent on coloring.html and in story library.
- Mobile-first, 44px+ tap targets, accessible ARIA, offline-first, KJV-only.

## Quality Gates
- God-tier copy: quiet dawn tone, warm/direct/humble, reverent, specific, no hype/fluff.
- Every change: `npm run test:site` (includes homepage search wiring guard), mobile/small-phone review, print preview, accessibility, offline.
- No features removed. Duplication reduced only where it does not thin experience.

## Maintenance Notes
- New stories/loops added via `kids/corner.html` grid + assets.
- Master prompt on coloring.html allows parents to create more pages at home (thick bold line art, large areas, exact KJV verse in decorative lettering).
- See `.cursor/rules/kids-rule.mdc`, `KIDS-FULL-STORY-MEDIA.md`, and `color-and-tell.js` for story/quiz/asset patterns.
- All changes must level-up nearby legacy parts to match elite standard.

Last updated: April 2026. Built to serve families with truth, clarity, and beauty.

**We battle. He wins.**