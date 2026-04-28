# Verse breakdown — migration queue (prioritized)

Canon: **`VERSE-BREAKDOWN-RULE.md`**. Migrate surfaces so every shipped verse UX uses **`verse-breakdown-container`** semantics (or programmatic equivalent) plus helpers in **`verse-breakdown-standard.js`**.

**Status (main, merged PR #12):** Homepage hero, first-paint, and **`verse-breakdown.js`** inline panels emit the locked **`verse-breakdown-container`** + **`h4` + `span[data-bk]`** pattern and load **`verse-breakdown-standard.js`** before **`verse-breakdown.js`** where the lazy stack applies. Rolling migration below still applies to reader rows, plans day copy, memorize, printables, and feel-result cards until each surface matches the Rule doc.

---

## Priority 1 — High visibility, scripture-first

| Area | Typical files / hosts | Migration goal |
|------|-----------------------|----------------|
| Chapter **reader** verse rows | `reader.html`, `script.js` reader host(s), verse toolbars | Structured breakdown injected per verse tap / focus; same headings as Rule doc |
| **Bible tool** lookup / Ask the Teacher result | `bible-tool.html`, `#lookup-result` — already uses **`TDBVerseBreakdown`** | Audit for stray legacy panels; ensure next-step + prayer where inline UX shows full breakdown |
| **Search** verse cards (homepage + `#feel-results`) | `script.js`, `feel-results` markup | Every card that exposes “full” verse content uses standard sections or collapses into inline breakdown |

## Priority 2 — Plans & rhythm content

| Area | Notes |
|------|-------|
| **Battle Plans** (`plans.html`, plan day JSON/HTML) | Day steps that quote KJV — wrap in **`verse-breakdown-container`** blocks or reuse inline injector with plan-specific copy overrides |
| **Reading plan / curriculum** shells | **`reading-plan.html`**, **`curriculum`** widgets — verse quotes get standard blocks |

## Priority 3 — Study, memory, offline niches

| Area | Notes |
|------|-------|
| **Memorize** | `memorize.html` + **`memory-verses.js`**: verses shown for rehearsal match structure (may shorten copy for kid mode — sections stay) |
| **My Verses / My Study** | Cards and export strings align with headings for saved items |
| **Printables / PDF shells** | University one-pagers — print-specific CSS hides chrome but keeps headings legible |

## Priority 4 — Kids / Family (tone, not laziness)

| Area | Notes |
|------|-------|
| **Kids Corner** loops | Layman wording stays playful; **`h4` labels unchanged** |
| **Family dashboards** verse blurbs | Same structure; shorten body text |

## Engineering checklist (repeat per surface)

1. Prefer **`fillBigKjvStrong`**, **`prayerForRef`**, **`nextStepFallback`** from **`TDB_verseBreakdownStandard`**.  
2. No raw verse-only panels where users expect teaching — either full structure or explicit link to **`verse.html?q=`** style deep link + label.  
3. After edits: **`npm run test`**, **`npm run test:site`**, **`npm run test:security`**, **`npm run build`**.
