# Verse Breakdown Rule (NON-NEGOTIABLE)

Every verse **shown** or **looked up** anywhere on **todaysdailybattle.com** must follow **one** coherent pattern: full KJV text first, then plain teaching in the same voice as the rest of the porch—simple, relational, and useful in real life—not academic, preachy, or “app generic.”

This is how we keep the site warm, clear, and personal. It aligns with **`docs/NORTH-STAR-PRINCIPLES.md`** (KJV-only, practical battle plans).

---

## Required content (in order)

For each verse surface, ship **all** of the following sections. Copy may vary by context (kids vs adults) but **the sections and intent stay**.

1. **Reference + KJV label** — e.g. `John 3:16 (KJV)` with the verse reference clearly marked.
2. **Full KJV verse** — exact text, quoted faithfully (no alternate translations).
3. **Simple layman terms** — short, plain English that unpacks meaning without slangy hype.
4. **Who’s talking?** — speaker / voice (Jesus, Paul, David, narrator, etc.), stated simply.
5. **Who is He/she talking to?** — original audience first; include “for us too” where helpful.
6. **How it relates today** — anchored to the **current calendar year** in the heading (e.g. “How it relates today (2026)”). Body: honest, culturally aware, steady—not fear-mongering or political.
7. **How it relates to you right now** — gentle, personal application for the reader’s daily battle.
8. **One small step today** — one practical, doable action.
9. **A simple prayer** — short, honest words the user can pray immediately.

---

## Required HTML shape (when building UI)

Use the shared structure so hydration, styles, and future tools stay predictable:

- Wrapper: **`verse-breakdown-container`**
- Reference line: **`big-kjv`** (`<strong>Book Chapter:Verse (KJV)</strong>`)
- Verse line: **`verse-body`** with the full verse in quotation marks
- Teaching block: **`verse-breakdown`** containing **`h4` + `p`** pairs in the order above (layman → speaker → audience → relates today → relates to you)
- **`next-step`** — line beginning with **One small step today:**
- **`prayer-block`** — **A simple prayer:** then the prayer text

Implementation helpers live in **`verse-breakdown-standard.js`** (`TDB_verseBreakdownStandard`: year line, prayer text, ref fill, class names). Homepage first paint wires through **`hero-daily-first-paint.js`**; inline lookup/breakdown panels use **`verse-breakdown.js`**.

---

## Where this applies (no exceptions for “ship” paths)

Rolling adoption is expected across legacy surfaces, but **new work** and **any page you touch for verses** must move toward this standard:

- Daily verse on the homepage  
- Battle Plans and plan content that quotes verses  
- Bible reader / lookup / Ask the Teacher flows  
- Search results that show verse + breakdown  
- Memory verses / My Verses surfaces  
- Printables / PDFs that include verse study blocks  
- Kids & Family verses where a breakdown appears (tone adjusted for age; structure stays)  

Standalone **reference-only** snippets (e.g. a citation line with link) may omit the breakdown **only** if the UX immediately opens or links to the full structured breakdown—never as an excuse to leave raw verse dumps long-term.

---

## Why this is strict

- **Consistency** — One porch; one voice; verses feel like they belong to the same place.  
- **Usefulness** — Users get meaning, context, today, self, step, and prayer—not a wall of text.  
- **Protection** — Your voice stays simple and pastoral, not cluttered by trends or jargon.  
- **Maintainability** — Future-you (and collaborators) follow a single spec instead of inventing layouts per page.

Skipping this format for shipped verse UX is **out of bounds** unless you are deliberately migrating an old screen—and then the migration plan should land on this rule.
