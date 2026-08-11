# Site copy & phrasing audit

**Date:** 2026-08-11  
**Scope:** End-to-end user-facing wording — tools, plans, links, kids, family, pastor, footers, empty states.  
**Method:** Parallel read of core HTML/JS injects + pattern sweeps (~426 HTML pages; ~270 “that is all right” strings; product-name inventory).  
**Not in scope this pass:** Full rewrite of every plan day body, every life-lesson essay, non-English locales (except naming consistency).

---

## North star (how we want to sound)

1. **Say the thing** — headings and buttons carry the meaning; no lecture about what the UI is.
2. **One name per door** — same destination always gets the same label.
3. **Calm ministry tone** — short, kind, KJV-first; not sales, not therapy-script, not builder notes.
4. **One reassurance max** per surface — “no rush / free / on this device” once, not three times.
5. **Crisis pages use plain next steps first** — metaphor rooms second.

---

## Canonical names (adopt sitewide)

| Prefer (user-facing) | Stop using as primary |
|----------------------|------------------------|
| **Plans** | The Paths, Battle Plans (subtitle/history only if needed) |
| **Look up a verse** | The Library, Bible tool (mixed) |
| **When it’s hard** | Hard day, Calm room (unless truly different pages) |
| **How I feel** / **Find a verse** | bare “Ask” (nav) |
| **Ask the Word** | Only for the Q&A tool, not mood search |
| **Support** | Give vs Support flip-flop; no “paid plans” |
| **Kids** / **Bible stories** | Kids Battle, Kids play, Parent Dashboard (as primary) |
| **My Study** | Faith loop, desk/report-card language as primary |
| **Home** / **Today’s Daily Battle** | “← Today's Battle” truncate |
| **Grace Ribbon** | Only after plain step; not on SOS first paint |

---

## Highest priority findings

### A. Naming sprawl (sitewide)

| Issue | Where | Fix |
|-------|--------|-----|
| Plans / Battle Plans / The Paths | `plans.html`, My Study, Life Lessons, topics, church | One name: **Plans** |
| Look up / The Library / Bible tool | `reader.html`, home, nav | **Look up a verse** |
| When it’s hard / Hard day / Calm room | nav, dock, topics, calm | **When it’s hard** |
| University of God / God’s University of Life | about, university hubs | One umbrella name |
| Kids / Kids Battle / Kids play / Quiet view / Dashboard | kids/* | **Kids** + **Family quiet view** |

### B. Meta / lecture copy (user-confusing)

| Issue | Where | Fix |
|-------|--------|-----|
| ~~“This is not two different stories…”~~ | Kids story modal | **Fixed** in #177 |
| Search porch architecture lecture | `search.html` | Short lead + one privacy line |
| My Study “What’s new” release note | `mystudy.html` | One plain “new tracks” line |
| Plans “Update: these tracks are The Paths…” | `plans.html` | Remove rebrand strip |
| Dig-deeper duplicates “What was going on” | Home hero | One situation block; “More from the Word” = extras only |
| “Who is He / she talking to?” | Home dig-deeper | **Who hears this?** |
| Hard-refresh / builder / supabase notes | kids, profile.js | Parent-only or remove from UI |

### C. Wrong or competing doors

| Issue | Where | Fix |
|-------|--------|-----|
| “7-day peace plan” → `anxiety7` | `plans.html` | Match label to plan id (or link `peace`) |
| Dual Surprise story controls | `kids/corner.html` | One **Surprise me** |
| Dual match games | match-buddies / memory-flock | One primary match game |
| Near-duplicate plans (loneliness ×2, school ×2) | plans catalog | Merge or clearly angle-subtitle |
| FAQ “paid plans” vs free-forever | `faq.html` | Align with Support / free forever |
| Give page truncated “and.” | `give.html` | Finish sentence |

### D. Pattern debt (volume, not one-off)

| Pattern | Scale | Direction |
|---------|-------|-----------|
| “—that is all right” | ~270 strings | Prefer short recovery: “Try again.” / “Nothing here yet.” |
| “You’re already welcome here…” | Many entry pages | Keep on heavy doors; unique line on topics |
| Free forever ×3 above verse | Home | One free line |
| TDB_BUILD_DATE visible if inject fails | ~236 footers | Ensure inject; fallback “Updated regularly” |
| “If you are the builder…” | profile.js ×4 | Dev-only console, never user status |

---

## Surface-by-surface summary

### Home (`index.html` + hero inject)
- Duplicate dig-deeper / More from the Word situation text.
- Free-forever stack; free will chip ALL CAPS.
- Hard-day label mismatch with dock.
- Share + Share more.
- Ask chips / answer kicker “How does this hit you today?”

### Explore / Start / Site guide
- Title “Quiet Campus Doorways” vs H1 “All pages.”
- Start/site-guide “moved” changelog tone.

### Search
- Long reassurance + map architecture before the filter.

### Plans
- Three product names; rebrand banner; crowded hard-day CTAs; mislabeled peace plan; duplicate emotional tracks.

### My Study / Reader
- Möbius station jargon on desk; What’s new dump; Faith loop; “that is all right” empties; Library naming.

### Life Lessons / University / Printables
- Porch / Paths product spaghetti; dual University maps; print leads that explain the whole site.

### Kids
- Dual surprise, dual match, naming chaos, KJV apology (partially fixed), hard-refresh in kid path, T-codes on porch reads, shepherd snack line.

### Family / Calm / SOS / Topics
- Stacked no-guilt; Grace Ribbon before plain steps on SOS; topic sidebar legacy names; “Walk the loop.”

### FAQ / Give / Pricing / Support
- Paid-plans contradiction; Give vs Support; give.html broken “and.”; pricing filename vs free story.

### Pastor / Church
- Nested / moved / demoted mixed messages; dense “for pastors” IA speak.

### Errors & system
- Uniform “that is all right” voice; builder SQL leaks; optional TDB_BUILD_DATE raw.

---

## Phased fix plan

### Phase 1 — Trust & naming (1–2 PRs) — **start here**
1. Canonical rename map applied to nav, footers, H1s, key CTAs (Plans, Look up, When it’s hard, Support, Kids).
2. FAQ free/paid + Give broken sentence + Support label.
3. Plans rebrand strip removed; peace-plan link/label aligned.
4. Home dig-deeper de-dupe + “Who hears this?”
5. Search lead shortened.

### Phase 2 — Dual doors
1. Kids: one Surprise, one primary match game, Family quiet view naming.
2. Plans: loneliness / school near-duplicates clarified or merged.
3. Hard-day CTAs on plans: one primary + one secondary.

### Phase 3 — Tone cleanup (scripted bulk)
1. Replace top-frequency “that is all right” in user toasts (profile, contact, shop, memorize, reader).
2. Trim welcome mantra on topic pages (keep unique feeling line).
3. My Study What’s new + Faith loop + Möbius desk copy.

### Phase 4 — Deep catalog (ongoing)
1. Plan titles/descriptions quality pass (Fear Not double “14 days”, etc.).
2. Life-lesson / university print leads.
3. Non-English chip labels consistency.
4. Optional automated lint: forbid “The Paths” / “The Library” / “If you are the builder” in user-facing strings.

---

## Automated checks to add later

```text
# Fail CI if user-facing files contain:
The Paths
The Library
If you are the builder
This is not two different stories
paid plans add tools
```

(Exclude docs/, scripts/, comments carefully.)

---

## Already fixed recently (related)

- Kids dual Read-to-me / Shepherd → one button (#174).
- Kids “not two different stories” KJV/plain preamble → removed (#177).
- Noah camel head on rainbow panel (#176).

---

## How to continue

Work Phase 1 as a single focused PR stack, then re-scan live home + plans + kids + FAQ.  
Full site body copy (every plan day, every essay) is multi-week; use this doc as the living checklist.
