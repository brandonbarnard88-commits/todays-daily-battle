# PROJECT_CONTEXT — Today's Daily Battle

Persistent context for Cursor / Composer sessions. Reference with **`@docs/PROJECT_CONTEXT.md`** at the start of significant work.

**Related:** `.cursorrules` · `.cursor/rules/00-mission-collaborator.mdc` · `.cursor/composer-2.5-custom-instructions.md` · `docs/NORTH-STAR-PRINCIPLES.md` · `docs/VERSE-BREAKDOWN-RULE.md`

---

## What this site is

**todaysdailybattle.com** is a quiet, pressure-free, ad-free, **KJV-only digital porch** for people carrying real battles — anxiety, parenting young children, grief, fear, exhaustion, family strain, and hard ordinary days. It should feel like a gentle resting place, not a performance space or content farm.

**Heart:** One calm daily KJV verse + Battle Plans (short themed KJV paths) + Ask the Teacher (mood/topic search) + My Study + Kids Corner + Prayer Wall + family tools + verse image generator + creative tools (Möbius, etc.).

**Language:** English primary; some language pilots exist. Core tools stay KJV English.

---

## Non-negotiable principles

| Principle | Rule |
|-----------|------|
| **Tone** | Calm, empathetic, gentle, honest, non-hype, judgment-free, restful. Never salesy, never Instagram-perfect, never pressure. |
| **Scripture** | Strictly King James Version. Quote accurately and reverently. Never paraphrase or alter. |
| **Technical ethos** | Simple, fast, mobile-first, PWA-style. Offline after first visit where possible (`localStorage` for My Study, notes, progress, saved verses). Privacy-first (no account required for core experience). Minimal dependencies. Vanilla JS only — no React/Vue. |
| **User focus** | Design for exhausted, hurting, or weary people — not power users. Clarity, breathing room, one gentle next step over feature density. |
| **Verse display** | Every surfaced verse follows `docs/VERSE-BREAKDOWN-RULE.md` (`verse-breakdown-container`, helpers in `verse-breakdown-standard.js`). |
| **AI boundary** | The live site is never an AI spiritual advisor. Cursor is a development/curation tool only. |

Full foundations: **`docs/NORTH-STAR-PRINCIPLES.md`**

---

## Current priorities (honest feedback)

The soul and philosophy are strong. Main gaps to address in surface-layer work:

1. **Homepage information overload** — too much competing for attention
2. **Weak visual hierarchy** — dated/low-contrast visuals in places
3. **Navigation feels like a maze** — too many doors without one obvious path
4. **Weak first-time onboarding** — tour exists but needs calmer surfacing
5. **Feature sprawl** — tools are intentional; simplify *how* they are reached, never remove core tools

**Homepage north star:** Today's verse + one primary **“How are you feeling?”** / mood search as the clear hero. One obvious primary path. More whitespace. Stronger (still gentle) hierarchy. De-emphasize or collapse secondary CTAs.

**Preserve:** Offline-first, local data, privacy stance, authentic voice, Möbius, Ask the Teacher, pastor/family resources, Emergency Calm Pack, quick-topic chips (all 30+ reachable), search hero, tool links.

**Full diagnosis + phased roadmap:** **`docs/EXPERIENCE-AUDIT-2026-05.md`**

**After-audit check-in (what to protect, what nags):** **`docs/AFTER-AUDIT-CHECKIN-2026-05.md`**

Tracked backlog: **`docs/FRIEND-AUDIT-BACKLOG.md`**

---

## Site map (key hubs)

| Hub | Path | Role |
|-----|------|------|
| **Home** | `/` (`index.html`) | Daily verse, Ask the Teacher / Feel search, quick topics, tool teasers |
| **Explore** | `/explore.html` | Quiet map — Start here, quick doors, full page list |
| **Battle Plans** | `/plans.html` | 7/21/40-day KJV paths by life battle |
| **Calm** | `/calm.html` | One verse by feeling; Emergency Calm Pack |
| **Verse of the Day** | `/verse.html` | Standalone daily verse |
| **Bible tool** | `/bible-tool.html` | Lookup, reader, verse image |
| **My Study** | `/mystudy.html` | Notes, saved verses, local-first |
| **Kids play** | `/kids/` | Kid door: story, color, one game |
| **Family hub** | `/family.html`, printables | Parent hub: verse, plans, print |
| **Prayer Wall** | `/message.html` | Community prayers |
| **Möbius** | `/mobius.html` | Fear/faith metaphor loop |
| **Pastor tools** | sermon/lesson builders | Self-contained ministry workflows |
| **Start here** | `/explore.html#start-here` | Onboarding / wayfinding (`/site-guide` aliases here) |
| **About / Story** | about pages | Mission and builder story |
| **Search** | `/search.html` | Client-side site-wide search index |

Explore **`explore.html#start-here`** for the canonical “where to begin” walkthrough.

---

## Key code & patterns

| Area | Files |
|------|-------|
| **Core logic** | `script.js` — search, topics, daily verse, auth hooks |
| **Homepage feel search** | `#feel-search`, `#quickTopics`, `feelSuggestDropdown` gate — see `.cursor/rules/homepage-feel-search.mdc` |
| **Verse breakdown** | `verse-breakdown-standard.js`, `verse-breakdown.js`, `hero-daily-first-paint.js` |
| **Styles** | `styles.css` — design tokens, dark mode, mobile-first |
| **Offline** | `service-worker.js` — CORE_ASSETS cache |
| **Build** | `npm run build` → `dist/` via `build-copy-static.js` |
| **Kids gentle journey** | `kids/kids-gentle-journey.js` — 365 distinct story goal |
| **Plans data** | `scripts/compile-plans-data.mjs`, plans HTML/JSON |
| **Security** | `SECURITY.md`, RLS on Supabase tables, `npm run test:security` |
| **Analytics** | `trackEvent()` for GA4; search uses `trackSearchAnalytics()` only — see `PRIVACY-ANALYTICS.md` |
| **Auth / sync** | Supabase — see `SUPABASE-SYNC-TABLES.md` |

**Do not remove:** `#search-hero`, `#quick-actions-hero`, `#quick-links`, `TDB_TOPICS`, `renderQuickTopicButtons`, `wireSearchAndQuickTopics`, `runSearchWithInput`.

**Do not put** `id="output"` inside sr-only `#main-search`. Do not add parallel listeners on `#feel-search` without the feel-suggest gate.

---

## How to work in Composer

1. **Significant tasks** (homepage, nav, new hub): Read this file + custom instructions. Propose a calm plan first. Proceed in small, reviewable steps.
2. **Before every change:** Emotional impact · information architecture · visual calm · mobile · offline · privacy · accessibility (44px+ targets, focus states, contrast).
3. **Prefer:** Minimal, high-impact edits. Precise diffs over large refactors unless asked.
4. **For homepage/nav:** Ruthlessly reduce density on the surface; protect the heart and all tools behind calmer doors.
5. **Quality gate before done:** `npm run test:security` · `npm run test` · `npm run test:site`

### Example session opener

> Read @docs/PROJECT_CONTEXT.md and the custom instructions. Let's start with simplifying the homepage per the feedback while keeping the gentle soul. First, propose a calm plan.

---

## Strengths to protect

- Authenticity and reverent KJV voice
- Offline-first + on-device data
- Privacy-first (no ads, minimal analytics)
- Thoughtful real-use tools (Emergency Calm Pack, Sermon Builder, family printables, Möbius, pastor/family entry points)
- Verse breakdown standard — warm, plain, one step + prayer

---

## Expand this file over time

Add as needed: file lists for a feature area, recent deploy notes, A/B decisions, copy patterns, or links to feedback summaries. Keep sections scannable; link to detailed docs rather than duplicating them.
