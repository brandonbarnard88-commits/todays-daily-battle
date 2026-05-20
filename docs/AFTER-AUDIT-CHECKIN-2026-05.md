# After-audit check-in — May 2026

Quiet reflection after the experience audit shipped to production. Use this when deciding what to touch next — not a backlog promise list.

**Related:** `docs/EXPERIENCE-AUDIT-2026-05.md` · `docs/PROJECT_CONTEXT.md`

---

## What feels lighter (protect this)

| Win | Why it matters |
|-----|----------------|
| **Verse-first home** | A weary visitor meets KJV + breakdown + prayer before choosing anything else. |
| **One Ask the Teacher doorway** | Mood chips + search feel like one path, not three competing feel UIs. |
| **Seven calm doors** | Home, Explore, Plans, and Family now share the same mental map. |
| **Disclosures instead of deletion** | Porch grid, family mode, email, tools — all still reachable, not shouting. |
| **First-visit banner** | Gentle, skippable, localStorage — honors “no pressure.” |
| **Core 7 nav** | Site flyout matches the porch story; “More tools” holds depth. |
| **Authentic voice intact** | Still you — not corporate, not hype, not performance. |

---

## What still nags (optional polish)

| Item | Notes | Status |
|------|-------|--------|
| **Desktop grid** | Sidebar plan progress beside verse/search; disclosures pushed below primary stack. | Shipped May 2026 (pass 2) |
| **Explore density** | Start here simplified; core-7 strip added; full walkthrough stays in `<details>`. | Shipped pass 2 |
| **Plans hero** | Featured lanes + long hint blocks collapsed behind disclosure. | Shipped pass 2 |
| **Family hub hero** | “More about this hub” + kid doorways map in disclosures. | Shipped pass 2 |
| **Contrast on cream/light theme** | Shared `--tdb-section-note-color` + porch card tokens in light themes. | Shipped visual tokens B |
| **Returning visitor chrome** | First-visit banner hidden after `tdb-home-first-visit-seen`; full porch after `has_visited_porch`. | Shipped pass 3 |

---

## What to protect going forward

1. **North star four** — KJV-only, privacy-first, offline-first, practical tools. No feature should trade these away.
2. **Never remove, relocate** — Tools overlap by design (different entry points). Collapse or link deeper; do not delete.
3. **Homepage feel search** — One wiring path (`feelSuggestDropdown` gate). Run `npm run test` before ship.
4. **Surface vs depth** — Surface stays calm; depth lives in Explore, Plans, Family, More tools.
5. **Builder sustainability** — Small diffs, honest docs, tests green. Rest between passes.

---

## Personal check-in prompts (for Brandon)

Answer when you have a quiet minute — no scores, no streaks:

1. When **you** open the home page on your phone, do you exhale or tense?
2. Can you describe the site in **one sentence** to a tired friend without apologizing for clutter?
3. Which page still makes **you** feel lost? (That’s the next honest pass.)
4. What tool are you **proudest** of that new visitors might miss? (Surface it in Explore or core-7, not the hero.)
5. What did you **not** build this month that you’re glad you didn’t? (Protect margin.)

---

## Shipped passes log

| Date | Pass | Summary |
|------|------|---------|
| May 2026 | Audit pass 1 | Home flow reorder, onboarding, core 7 nav, disclosures, `tdb-home-experience.js` |
| May 2026 | Audit pass 2 | Desktop grid, Explore/Plans/Family polish, `tdb-core-seven.css`, this check-in doc |
| May 2026 | Audit pass 3 | First-visit crisis surface: verse + Ask + one step; `has_visited_porch` unlocks full porch |
| May 2026 | Visual tokens B | `tdb-visual-tokens.css` — porch spacing, heading rhythm, card surface bridge (Home + Explore) |
| May 2026 | Visual tokens A | Global `.section-divider` calmed; inner-page `.section-note` uses porch contrast tokens |
| May 2026 | Raw audit pass | Heavy-now fast path (Home/Explore/Plans/topics), topic depth, Family widget hint, CSP cdn-cgi fix, porch widget verify |
| May 2026 | Homepage Pass 4 | Calmer hero: extra verse air, one Battle Plan CTA + breath divider, returning-visitor doorway disclosure; nothing removed |
| May 2026 | Homepage Pass 5 | Copy trim (what's new, builder note, porch voice), mid-page visual rest, sync honesty lines, optional-row disclosure, compact first-visit HeavyNow |

---

## Pass 4 shipped — calmer first breath (May 2026)

**Goal:** Someone arriving on a heavy day gets verse + prayer + one honest step before the rest of the porch.

| Everyone | Returning visitor (`has_visited_porch`) |
|----------|----------------------------------------|
| Verse + breakdown + prayer | Same calm hero rhythm |
| Lead: *When you're ready—one small step in the Word.* | Fast-feel row + Start My Day tucked in existing disclosures |
| **Open today's Battle Plan** (single primary CTA) | *After today* nav + porch signs in **Quiet invitations — when you want another room** (collapsed) |
| Soft gradient breath divider → Ask the Teacher | `html.tdb-home-calm-hero` |

**First visit:** unchanged pass-3 surface — *See the rest of the porch when you're ready ↓* holds full porch in DOM.

**Commit:** `6c8dc383` · Live spot-check May 2026 (mobile hero, CTA tap target, disclosures).

---

## External Review Mirror (May 2026)

A detailed third-party review confirmed our north-star priorities. We will fiercely protect privacy, gentleness, and offline-first design. We'll improve KJV accessibility through clearer breakdowns, listen features, and plain-language helps (never by adding translations). We'll soften sync friction with honest, low-pressure copy. Visual calm polish continues in the right season. We intentionally decline gamification, social loops, rich media, and "app polish" that would trade away the high scores people thank us for. **This narrowness is on purpose.**

### Optional next lanes (porch pace — not promises)

| Lane | Intent |
|------|--------|
| **Sync honesty pass** | My Study + plan trackers: one sentence that progress lives on this device; sign-in optional, never nagging |
| **Dig deeper (collapsed)** | Optional breakdown/Bible Tool expansion: *What this word meant then*, one *See also*, Listen — default view unchanged |
| **Visual refresh** | Typography, card rhythm, subtle rest — not chrome or app polish |

Draft copy patterns captured in builder notes May 2026; implement when a pass feels light.

---

## Pass 3 shipped — first-visit progressive disclosure

**Goal:** Someone landing in crisis sees help in ~10 seconds, not a workshop menu.

| First visit (`has_visited_porch` unset) | Returning visitor |
|----------------------------------------|-------------------|
| Today's verse + breakdown | Full pass-2 layout |
| Ask the Teacher (feel search) | Core-7 doors visible |
| One small step (Calm + optional plan link) | Nested disclosures as before |
| Everything else in **More quiet rooms on the porch** (closed `<details>`) | Next-step band hidden |

**Pass 3 micro-polish (May 2026):** Summary → “See the rest of the porch when you’re ready ↓”; expanded one-line lead; 44px+ summary tap target; 1.25rem margin above/below disclosure on mobile.

**Unlock triggers:** first feel search, quick-topic tap, Calm/plan CTA, Start My Day, or **I know my way around the porch**. All content stays in DOM for SEO, crawlers, and sr-only tooling.

**Keys:** `has_visited_porch` (full porch); existing `tdb-home-first-visit-seen` (banner only).

---

## When to revisit

- After **two weeks** of live traffic (gut check + any reader notes).
- Before adding a **new major hub** (ask: where does it live in the seven doors?).
- When a page starts feeling like the **old homepage** again (density creep).

No rush. The porch is in a good place.

---

## External review — May 19, 2026

Independent full-site pass after audit passes 1–2. Verdict: moved from **“sincere but messy workshop”** to **“improving workshop with clearer paths.”** Soul strong; experience layer catching up but gap remains for crisis first-impression.

### Validated improvements

- Homepage verse-first on mobile; less firehose; calm tone lands faster
- Explore Start here + five-minute tour = gentle on-ramp
- Content depth (Plans, Möbius, One Family, pastor/family tools) still the superpower
- Offline/privacy/no-pressure philosophy unchanged
- New University plans and seasonal work feel organic, not bolted-on

### Remaining gaps (honest)

| Gap | Detail |
|-----|--------|
| **Homepage still dense** | Pass 4 eased first impression (one CTA, breath divider, returning doorway disclosure). Mid-page density may still grow — watch for creep. |
| **Visual hierarchy** | Cleaner but dated; desktop reads long-document; typography/spacing/cards don’t fully sell “quiet porch” |
| **Navigation** | Explore helps; power users fine; pained first-timers may still wander; gems buried |
| **Feature sprawl** | Thin language pilots; duplication across plans/tools; needs tighter editing at surface |
| **10-second relief bar** | Improved approachability, not yet instant “ah, calm” for random crisis Googler |
| **Hero tools under-surfaced** | Möbius, Sermon Builder, deep plans reward exploration over guided entry |
| **Polish debt** | Functional/sincere; load, mobile feel, visual consistency could tighten |

### Pass 3 candidates (max impact, when energy allows)

1. **Ruthless homepage edit** — one hero path, more whitespace, stronger calm visuals (below verse: feel OR one next step, not both + teasers) | **Shipped Pass 4** (one CTA + disclosures; feel row hidden first-visit / calm-hero)
2. **Visual refresh** — typography scale, card rhythm, contrast tokens (keep warm porch; not corporate)
3. **Progressive disclosure for first visits** — `localStorage` hides advanced blocks until return visit or explicit “Show more tools” | **Shipped pass 3** (`has_visited_porch`, `#tdbFirstVisitNextStep`, `#tdb-first-visit-more-porch`)
4. **One hero entry experience** — refined 3-minute calm onboarding (verse → feel → one plan link; optional, skippable)

### Who it serves well today vs. not yet

| Serves well | Not yet instant for |
|-------------|---------------------|
| Motivated pastors, homeschool parents, KJV-aware users | Random hurting person in crisis via search |
| Return visitors who learned the map | Daily habit without effort on first visit |

**Foundation verdict:** Excellent and rare. Not starting over — iterating. Mission not compromised.

