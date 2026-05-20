# Experience audit — May 2026

Full-site, no-fluff feedback from a deep pass (homepage, Explore, Story, About, Möbius, One Family, plans, family tools, pastor tools, privacy, structure). **Source of truth for surface-layer redesign.** Composer sessions: read with `@docs/PROJECT_CONTEXT.md`.

**Bottom line:** Soul and foundation are strong — stronger than most Christian web projects. The gap is **information architecture, visual hierarchy, and ruthless editing of the surface layer**, not mission or content quality.

---

## The good (protect these)

| Strength | Why it matters |
|----------|----------------|
| **Authentic voice** | Story and About feel raw, human, credible — not ministry marketing. |
| **Philosophy is rare** | No ads, no account, no pressure. Offline-first + local data by default. Threading a narrow, valuable needle. |
| **Creative tools that fit** | Möbius Loop (breath + ribbon + endurance), One Family in Christ, Ask the Teacher mood search. |
| **Real use cases** | Pastor tools, family hub, Emergency Calm Pack, printables — built for exhausted parents, weary pastors, crisis. |
| **Privacy stance** | Said and mostly done. Consistent. |

---

## The bad (fix in order)

| Problem | Detail |
|---------|--------|
| **Homepage overload** | Verse + search + plans + family mode + patriotic blocks + what's new + duplicate paths to the same thing. Gentle tone cannot save bad IA. |
| **Navigation maze** | Explore tries with Start here, but still a wall of links. Organic growth → workshop feel. Good tools buried. |
| **Visual design** | Calm aesthetic on paper; in practice often reads as plain/low-contrast 2015 blog. Weak hierarchy amplifies density. Mobile = endless scroll. |
| **Weak onboarding** | Start here and 5-minute tour exist but aren't prominent. Site assumes goodwill casual visitors don't have. |
| **Feature sprawl** | Thin language pilots; some tools half-finished or duplicated in spirit. Solo-builder inflection point. |

---

## The ugly (what actually hurts)

- **Weak first impression** — Value prop is quiet help when life is heavy; homepage doesn't deliver calm or clarity fast. Hurting people may bounce.
- **Poor discoverability** — Möbius, best plans, pastor tools not surfaced well even for motivated users.
- **Experience debt** — Underlying philosophy and content outrun how it *feels* to use the site. Limits word-of-mouth and return visits.
- **Quiet failure risk** — Low-pressure model won't crash the site, but mediocre UX keeps it from reaching people who need it most.

---

## Prioritized recommendations (reviewer)

1. **Fix homepage first** — Ruthless density cut. Daily verse + mood search as hero. One primary path. De-emphasize secondary CTAs. Whitespace. Clear sections.
2. **Navigation / content audit** — Core 5–7 experiences obvious; everything else one–two clicks deeper. Simpler top nav + strong “I need help with…” hub.
3. **Visual hierarchy without losing soul** — Stronger typography, spacing, sectioning. Not corporate — intentional calm sanctuary.
4. **First-time user flow** — Prominent Start here / quick tour; optional calm first-visit modal or landing.
5. **Brutal scope discipline** — Pause or consolidate thin language pilots and smaller tools so core can breathe.

---

## Builder roadmap (actionable, repo-aligned)

**Shipped May 2026:** Homepage flow reorder (`tdb-home-experience.js`), first-visit banner, core-7 doors strip, collapsed duplicate feel surfaces, hero extras + mid-page clutter in disclosures, nav partials aligned to core 7, Explore Start here simplified, visual hierarchy CSS.

Phased work that **preserves every core tool** (relocate/collapse, never remove per project rules).

### Phase 1 — Homepage surface (highest impact)

**Goal:** One breath — verse, then “How are you feeling?”, then one next step.

| Keep above fold / primary | Collapse / move deeper |
|---------------------------|-------------------------|
| Today's verse + breakdown | Duplicate word search on hero (points to Ask the Teacher — pick one primary) |
| Ask the Teacher / `#quick-search-hero` | Long “What's new” prose → Explore or changelog |
| Quick mood doorway (4–6 chips max visible) | Patriotic / mission blocks → About or dedicated hub |
| One clear CTA: Plans *or* Explore | Full `#quick-links` grid → Explore quick doors |
| | Kids ribbon → Family hub or one calm line |

**Files:** `index.html`, `styles.css`, `script.js` (feel search wiring — do not break `feelSuggestDropdown` gate).

**Success:** New visitor answers “What do I do?” in under 5 seconds without scrolling past three screenfuls on mobile.

### Phase 2 — Core 7 experiences (navigation)

Proposed **primary doors** (everything else links from these):

1. **Today's verse / Home** — `/`
2. **How I'm feeling** — home `#quick-search-hero` or `/calm.html`
3. **Battle Plans** — `/plans.html`
4. **My Study** — `/mystudy.html`
5. **Family & Kids** — `/family.html` + `/kids/`
6. **Explore** — `/explore.html` (map + Start here)
7. **For pastors & leaders** — one hub tile → sermon/lesson tools

**Files:** global nav sync scripts (`sync-primary-site-nav.mjs`, `sync-global-header-nav.mjs`), `explore.html`, `site-guide.html`.

**Success:** Top nav + Explore “Start here” tell the same story.

### Phase 3 — Visual calm pass

- Typography scale: clearer `h1`/`h2`/body contrast (still soft, not sharp corporate).
- Section rhythm: consistent vertical spacing tokens in `styles.css`.
- Contrast audit: cream-on-cream links, muted section notes.
- Mobile: cap homepage sections visible before “Show more tools” disclosure.

**Success:** Screenshots feel intentional, not default blog.

### Phase 4 — Onboarding

- First-visit: calm banner or one-step “New here? Start here” → `site-guide.html` or inline 3-step (verse → feel → plan).
- Tour button more visible without pressure (already in quickbar — test prominence).
- Returning visitors: hide first-visit chrome (`localStorage` flag).

**Success:** Site guide gets meaningful traffic from home without modal fatigue.

### Phase 5 — Scope breathing room

- Language pilots: link from Explore `#languages` only; no homepage promotion until content depth matches EN core.
- Audit duplicate entry points (verse lookup on home hero vs Ask the Teacher vs Bible tool) — same feature, one *primary* door each context.

**Success:** Surface feels curated; depth remains one click away.

---

## Homepage-specific notes (current repo)

Observed duplication to resolve in Phase 1:

- Hero word search (`#hero-votd-word-search`) mirrors Ask the Teacher below.
- “Quick mood doorway” + full quick-topic chips + `#quick-search-hero` = three feel-search surfaces.
- `#whats-new-study-hint` and `#whats-new-spring-2026` compete with hero for attention.
- `#quick-links` tool grid adds another decision layer before Explore.

---

## References

- `docs/PROJECT_CONTEXT.md` — Composer session API
- `docs/FRIEND-AUDIT-BACKLOG.md` — ongoing shipped/backlog items
- `.cursor/composer-2.5-custom-instructions.md` — agent guardrails
