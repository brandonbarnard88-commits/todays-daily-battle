# Today's Daily Battle — Patterns Reference

**Last updated:** May 11, 2026  
**Audience:** builder, future self, any maintainer.  
Not public-facing. Everything here exists to keep quality consistent as the site grows.

---

## The Core Mental Model

Every decision should pass this test: **does this reduce friction for a weary person who got here at 10pm on a hard day?**

Not a feature checklist. Not a growth metric. One tired person on a mid-range Android in low light. If the change helps them — it ships. If it's clever but costs them attention, time, or trust — it doesn't.

---

## 1. Page Structure Patterns

### Static HTML + inline `<style>`
Every page keeps its critical styles in a `<style>` block above the fold — never fully deferred — so the page paints correctly before `styles.css` finishes loading. This is intentional and non-negotiable on high-traffic pages (`plans.html`, `index.html`, etc.).

### CSS variable token system
All color, spacing, and surface tokens live as `--var` tokens set in the page's `:root` block (or inline `<style>`). The full cascade is:
1. `plans.html` (or any page) defines its own critical tokens in `<style>` for immediate paint
2. `styles.css` (async loaded) extends with site-wide tokens
3. Theme overrides (`html[data-theme="light"]`, `html[data-theme="sepia"]`) always follow the same dark → light → sepia cascade

**Never** introduce a new color value without checking whether an existing token already covers it.

### Theme cascade order (always)
```
:root { /* dark/default */ }
html[data-theme="light"] { ... }
html[data-theme="sepia"] { ... }
```
Every new component needs all three if it uses color. Contrast check: dark is easy (light on dark); **light and sepia are the failure modes** — gold on cream is the recurring trap (`~1.8:1`; minimum 4.5:1 required for small text).

---

## 2. JavaScript Patterns

### Vanilla JS only. No frameworks.
No React, Vue, or build steps. Every file is either a plain script or an ES module. If a pattern requires a framework, it's the wrong pattern.

### IIFE module pattern (non-module scripts)
Standalone page scripts (e.g. `mystudy.js`, `highlights.js`) are wrapped in:
```javascript
(function () {
  'use strict';
  // ...
}());
```
This prevents global scope pollution without needing ES module syntax on every page.

### LocalStorage key conventions
| Prefix | Purpose |
|---|---|
| `tdb-plan-{id}-day` | Plan day progress (integer, 0 = not started) |
| `tdb_my_study_v1` | My Study session (verse, notes, prayer) |
| `tdb_shared_studies_v1` | Joined shared studies |
| `savedVerses` | Saved verse array (ref, text, note, date) |
| `tdb_bible_tool_notes` | Bible Tool battle log + verse notes |
| `tdb_memorize_lite_v1` | Memorize queue |
| `tdb_study_notes_meta_v1` | Study notes metadata |
| `tdb_daily_mood_notes_v1` | Daily mood/reflection notes |
| `tdb_reader_chapter_notes_v1` | Reader chapter notes |
| `tdb-cat-{id}` | Category accordion open/closed state |
| `tdb-theme` | Theme preference |
| `tdb_perf_mode` | Performance mode flag |

**Rule:** Always try/catch localStorage reads and writes. Never let a storage failure break the page.

### Event delegation on lists
Plan cards and search results use event delegation (one listener on the container, `e.target.closest('[data-plan]')`) rather than per-item listeners. Keep this pattern — it avoids memory leaks and works correctly when items are dynamically added.

### Offline fallback pattern
```javascript
try {
  var cached = localStorage.getItem(CACHE_KEY);
  if (cached) return JSON.parse(cached);
} catch (e) {}
// fetch, then cache on success
```
If a network fetch fails, always show the cached version with a quiet "Offline — still got you" strip. Never show a blank state.

---

## 3. UI Patterns

### Tap target minimum: 44×44px
Every interactive element must meet 44px minimum in both dimensions. Key places this matters:
- Plan card rows: `padding: 1.5rem` ensures height well over 44px ✓
- Category accordion summaries: `padding: 0.85rem 1rem` + icon = safe ✓
- Buttons: always `min-height: 44px` for standalone CTAs
- Mobile-specific overrides may reduce padding — always check the result meets 44px

### Plan card: full-width tappable area
Plan rows are `<div data-plan="...">` with `width: 100%; cursor: pointer` and click delegation on the parent list. The entire card surface — padding included — is the tap target. Never use narrow anchor text inside a div card.

### "Show More" expander pattern (per-category lists)
When a list within an accordion has >5 items:
- Show first 5 rows (plus any in-progress rows regardless of position)
- Add a `.plan-cat-show-more` button: dashed gold border, `min-height: 44px`, full width
- Hidden remainder lives in `.plan-cat-more-wrap[hidden]`
- On click: reveal the wrap, hide the button — no collapse, no re-hide
- Threshold constant: `SHOW_MORE_THRESHOLD = 5`

### Details/Summary for progressive disclosure
Use native `<details>/<summary>` for:
- Category accordion groups (plans page)
- Verse thread panel (plan day view)
- "What stays on this device" disclosure (My Study)
- Gentle suggestions

Persist open/closed state in localStorage where appropriate (`tdb-cat-{id}`).

### Verse thread collapsed label
Always give the collapsed `<summary>` meaningful context:
```
Not started:   "This plan's verse thread · 7 days"
In progress:   "This plan's verse thread · Day 4 of 7 highlighted"  
Complete:      "This plan's verse thread · 7 days — complete"
```
Never show a generic label when richer context is available at render time.

### Toast notifications
Use `window.showEliteToast(message)` for non-blocking feedback. Never use `alert()` in new code (exception: legacy export confirmation can still use it; migrate opportunistically).

---

## 4. Content Patterns

### KJV only — no exceptions
Every verse, reference, breakdown, and prayer uses the King James Version. No other translations anywhere in the UI, copy, or plans content.

### Tone: quiet friend at dawn
- Direct without being blunt
- Warm without being sentimental
- No hype words: "manifest," "breakthrough," "destiny," prosperity gospel framing, politics
- No filler: every sentence earns its place
- Grace for the reader always — never pressure, never guilt, never a score

### Verse breakdown structure (non-negotiable)
Every surfaced verse follows this structure:
1. **Plain meaning** — what it actually says in plain English
2. **Context** — who said it, to whom, what was happening
3. **Today** — how it meets the reader right now
4. **One small step** — a specific, optional action
5. **Prayer** — a short, honest closing prayer

See `docs/VERSE-BREAKDOWN-RULE.md` for the full spec. Always use `verse-breakdown-standard.js` helpers when building new surfaces.

### "One Small Step" callout
The action panel (`day-bp.action-panel`) uses:
- 4px solid gold left border
- Gold-tinted background (`color-mix 13%`)
- Label: `color: var(--gold)` — but **in light/sepia themes use `#7a5010`** (dark amber) for contrast

### Privacy copy standard
Whenever data storage or export is mentioned, use this exact framing:
> "All your data stays on this device — completely private."

Follow it with what that means practically: no upload, no account, no tracking. The person reading this is already weary and may already distrust apps. Make it concrete, not abstract.

---

## 5. Plan Architecture

### Plan data structure
```javascript
{
  id: 'planid',
  icon: '🕊️',
  label: 'Display Name',
  desc: 'Short description.',
  key: 'tdb-plan-planid-day',   // localStorage key
  max: 7,                        // total days
  days: [ { title, ref, text, speaker, plain, today, action, prayer, goal }, ... ]
}
```
Special case: the original battle plan uses `key: 'tdb-plan-day'` (no id in the key).

### Plan day progress
Progress is stored as a single integer (current day index, 0-based... well, it represents "days completed"). `getDayProgress(plan)` returns it; `setDayProgress(plan, day)` saves it.
- `0` = not started
- `1..max-1` = in progress  
- `>= max` = complete

### HOME_SEARCH_PLAN_LIBRARY
The feel/topic search on the homepage uses a parallel `HOME_SEARCH_PLAN_LIBRARY` array in `script.js` — separate from the `PLANS` object in `plans.html`. When adding a new plan to `plans.html`, also add it to `HOME_SEARCH_PLAN_LIBRARY` with rich `topics` arrays (10–15 words covering the plan's emotional territory). Omitting this makes the plan invisible to the homepage search.

### SITUATION_TO_TOPICS map
Also in `script.js`. Maps real-life keyword clusters ("boss", "divorce", "cancer", "addiction") to topic arrays so that natural-language queries route to the right plans. When adding a new plan that covers a novel life situation, add the relevant situation keywords here too.

---

## 6. Search Architecture

The site has **two distinct search systems** — do not confuse them:

| System | File | Purpose |
|---|---|---|
| Feel/verse search | `script.js` (`getHomeSearchActiveTopics`, `HOME_SEARCH_PLAN_LIBRARY`) | Homepage "How do you feel?" — maps to KJV verses + plan suggestions |
| Site navigation search | `search.js` + `data/site-search-index.json` | `/search.html` — finds pages and plans by title/keyword |

When adding a new plan or page, update **both**:
1. `HOME_SEARCH_PLAN_LIBRARY` + `SITUATION_TO_TOPICS` in `script.js`
2. `data/site-search-index.json` with rich keyword field

### Site search index format
```json
{ "t": "Plan Title (N days)", "u": "/plans.html?plan=id", "k": "keyword1 keyword2 specific phrase life situation" }
```
Keywords should include: topic words, emotional states, life situations, common phrasing someone might type at 10pm. Aim for 12–20 words per entry.

---

## 7. Accessibility Baseline

These are non-negotiable on every page and component:

- **Semantic HTML**: use `<button>` for actions, `<a>` for navigation, `<nav>`, `<main>`, `<section>`, `<article>` appropriately
- **Focus states**: all interactive elements must have visible `:focus-visible` styles (ring or border)
- **ARIA labels**: every icon-only button needs `aria-label`; live regions need `aria-live="polite"` and `aria-atomic="true"`
- **Skip link**: `<a href="#main-content" class="skip-link">` at top of every page
- **Color contrast**: 4.5:1 minimum for normal text, 3:1 for large text (≥18px or ≥14px bold). Check both light and dark themes.
- **44px tap targets**: no exceptions on interactive elements
- **Keyboard reachability**: every feature usable without a mouse

---

## 8. Security Baseline

See `SECURITY.md` for the full spec. Minimum for any new feature:

- **Never `innerHTML` with user data** — use `textContent` or `escapeHtml()` (in `mystudy.js` and similar helpers)
- **Never commit secrets** — no service_role key, Stripe secret, Turnstile secret
- **RLS on all Supabase tables** — every new table needs row-level security
- **Sanitize all form input** — DOMPurify for anything that touches the DOM as HTML
- **Run before shipping**: `npm run test:security && npm run test && npm run test:site`

---

## 9. Testing Gate

Before any change is done, all three must pass:

```bash
npm run test:security   # checks for innerHTML patterns, exposed secrets
npm run test            # homepage search wiring, quick-topic buttons, link checks
npm run test:site       # full site content checks
```

And syntax-check any modified JS:
```bash
node --check mystudy.js
node --check script.js
```

If tests add warnings: either fix them or document the exception explicitly. Silent regressions are not acceptable.

---

## 10. Dist Copy Pattern

The source files live in the repo root; deployed files live in `/dist`. After any source change:

```bash
cp plans.html dist/plans.html
cp mystudy.html dist/mystudy.html
cp mystudy.js dist/mystudy.js
cp mystudy.css dist/mystudy.css
# etc.
```

The `npm run test:site` suite checks `dist/` files, so always copy before running it.

---

## 11. Quality Gate Checklist (before marking done)

- [ ] Secure — no innerHTML with user data, no exposed secrets
- [ ] Accessible — focus states, ARIA labels, 44px targets, semantic HTML
- [ ] Mobile — tested mentally at 375px width; tap targets, readable text, no overflow
- [ ] Contrast — light and sepia themes checked (not just dark)
- [ ] Copy — specific, calm, non-generic; no placeholder text
- [ ] Offline — does it degrade gracefully? Cached fallback present?
- [ ] Tests — all three test commands pass clean
- [ ] Dist — relevant files copied to `/dist`
