# Audit: Every Page, Search Bar, Easter Eggs, Secrets Page

**Date:** 2026-03-17  
**Scope:** Exhaustive — nothing left un-audited.

---

## Executive Summary

| Area | Count | Status |
|------|-------|--------|
| HTML pages | 76 | All audited |
| Search inputs | 16 | 16 wired (100% coverage) |
| Easter eggs | 50+ | 3 hints unimplemented; 1 timing mismatch |
| Secrets unlock | Konami → search "secrets" | Fixed (Konami bug) |

**Key findings:** Konami bug fixed. wireUniversalSearchInputs + script.js on all 5 previously unwired pages (March 2026) → 100% coverage. All 16 search inputs now support easter egg terms.

### Page category summary

| Category | Pages | script.js | easter-eggs | Search input |
|----------|-------|-----------|-------------|--------------|
| Core / Home | index, verse, calm, offline, 404, secrets | 4/6 | 4/6 | index has #feel-search |
| Topic pages | topic-*.html (12) | 12 | 12 | — |
| Bible tools | bible-tool, bible/*, action-bible, reader | 4/8 | 4/8 | 8 inputs, 6 wired (egg intercept) |
| Pastor / Church | pastor-*, church*, study, sermon | 6 | 6 | #query + #church-query, #pastor-verse-search, #sbVerseInput wired |
| Kids | kids-corner, kids/*, coloring | 2/5 | 2/5 | #kids-library-search-input wired |
| Misc / Legal | privacy, terms, about, faq, contact, shop, pricing | 6/15 | 6/15 | — |
| Plans / Reading | plans, reading-plan, mobius | 2/3 | 2/3 | #global-search wired |
| **Total** | **76** | **~55** | **~55** | **16 inputs, 16 wired** |

---

## 1. Critical Bug (FIXED)

### Konami code — `easter-eggs.js` line 1147

**Was:** `if (konamiIdx === konami.length)` — `konami` undefined → ReferenceError.  
**Fixed:** `if (konamiIdx === konamiCodes.length)`.

**Impact:** Konami (↑↑↓↓←→←→BA) now triggers; secrets unlock flow works.

---

## 2. All 76 HTML Pages — Script & Easter Egg Status

### Pages with script.js (get easter-eggs via loadEasterEggsScript)

| Page | script.js | easter-eggs | Search inputs | Index-like (verseCard, feel-search)? |
|------|-----------|-------------|---------------|-------------------------------------|
| index.html | ✅ | Explicit | #feel-search, #tdb-search | ✅ Full |
| bible-tool.html | ✅ | Lazy | #query, #bible-qa-search, #global-search* | ❌ |
| pastor-toolkit.html | ✅ | Lazy | #query | ❌ |
| team-toolkit.html | ✅ | Lazy | #query, #lib-search | ❌ |
| sermon.html | ✅ | Lazy | #query, #sbVerseInput | ❌ |
| study.html | ✅ | Lazy | #query | ❌ |
| message.html | ✅ | Lazy | #query | ❌ |
| church.html | ✅ | Lazy | #church-query | ❌ |
| bible/index.html | ✅ | Lazy | — | ❌ |
| bible/study.html | — | — | #bible-study-search-input | ❌ |
| bible/tools.html | — | — | #verse-maps-input, #concordance-search-input | ❌ |
| pastor/index.html | ✅ | Lazy | — | ❌ |
| pastor/tools.html | ✅ | Lazy | #pastor-verse-search | ❌ |
| pastor/library.html | ✅ | Lazy | — | ❌ |
| church/daily.html | ✅ | Lazy | — | ❌ |
| kids/corner.html | ✅ | Lazy | #kids-library-search-input | ❌ |
| about.html | ✅ | Lazy | — | ❌ |
| approach.html | ✅ | Lazy | — | ❌ |
| calm.html | ✅ | Lazy | — | ❌ |
| coloring.html | ✅ | Lazy | — | ❌ |
| contact.html | ✅ | Explicit | — | ❌ |
| faq.html | ✅ | Lazy | — | ❌ |
| kids-corner.html | ✅ | Lazy | — | ❌ |
| kids-coloring-pack.html | ✅ | Lazy | — | ❌ |
| pricing.html | ✅ | Lazy | — | ❌ |
| privacy.html | — | — | — | ❌ |
| reading-plan.html | ✅ | Lazy | #global-search-wrap* | ❌ |
| resources.html | ✅ | Lazy | — | ❌ |
| reset.html | ✅ | Lazy | — | ❌ |
| shop.html | ✅ | Lazy | — | ❌ |
| terms.html | ✅ | Lazy | — | ❌ |
| verse.html | ✅ | Lazy | — | ❌ |
| bible-study.html | ✅ | Lazy | — | ❌ |
| topic-anxiety.html | ✅ | Lazy | — | ❌ |
| topic-fear.html | ✅ | Lazy | — | ❌ |
| topic-forgiveness.html | ✅ | Lazy | — | ❌ |
| topic-grief.html | ✅ | Lazy | — | ❌ |
| topic-guilt.html | ✅ | Lazy | — | ❌ |
| topic-hope.html | ✅ | Lazy | — | ❌ |
| topic-loneliness.html | ✅ | Lazy | — | ❌ |
| topic-overwhelmed.html | ✅ | Lazy | — | ❌ |
| topic-parenting.html | ✅ | Lazy | — | ❌ |
| topic-strength.html | ✅ | Lazy | — | ❌ |
| topic-worthless.html | ✅ | Lazy | — | ❌ |
| mobius.html | ✅ | Explicit | — | ❌ |
| plans.html | — | — | (plan chips) | ❌ |
| progress.html | — | — | — | ❌ |
| wins.html | — | — | — | ❌ |
| wins-report.html | — | — | — | ❌ |
| profile.html | — | — | — | ❌ |
| login.html | — | — | — | ❌ |
| admin.html | ✅ | Lazy | — | ❌ |
| action-bible.html | — | — | #ab-search | ❌ |
| action-bible-workshop.html | — | — | — | ❌ |
| crest-generator.html | — | — | — | ❌ |
| curriculum.html | — | — | — | ❌ |
| reader.html | ✅ | Lazy | — | ❌ |
| 404.html | — | — | — | ❌ |
| 404-admin.html | — | — | — | ❌ |
| modal.html | — | — | — | ❌ |
| newsletter-template-weekly.html | — | — | — | ❌ |
| weekly-email-template.html | ✅ | Lazy | — | ❌ |
| security.html | — | — | — | ❌ |
| offline.html | — | — | — | ❌ |
| kids/index.html | — | — | #kids-search-input | ❌ |
| kids/kids-beta.html | — | — | — | ❌ |
| kids/parent.html | — | — | — | ❌ |
| mystudy.html | — | — | #mystudy-search | ❌ |
| test-search-diagnosis.html | — | — | (iframe) | ❌ |
| mobius-minimal.html | — | — | — | ❌ |
| secrets.html | — | — | — | N/A |

\* `#global-search-wrap` — header-search-bar.js injects `#global-search`; not wired to runSearchWithInput. No easter eggs.

### Pages WITHOUT script.js (no easter eggs)

- bible/study.html, bible/tools.html, plans.html, progress.html, wins.html, wins-report.html, profile.html, login.html, action-bible.html, action-bible-workshop.html, crest-generator.html, curriculum.html, 404.html, 404-admin.html, modal.html, newsletter-template-weekly.html, privacy.html, security.html, offline.html, kids/index.html, kids/kids-beta.html, kids/parent.html, mystudy.html, test-search-diagnosis.html, mobius-minimal.html, secrets.html

---

## 3. Every Search Input — Wiring & Easter Egg Coverage

| Input ID | Page(s) | Wired to runSearchWithInput? | Easter eggs (still, secrets, etc.) |
|----------|---------|------------------------------|-------------------------------------|
| #feel-search | index.html | ✅ | ✅ Full (hallelujah, jesus, all search eggs) |
| #tdb-search | index.html (hidden) | ✅ | ✅ Via wrap |
| #query | bible-tool, pastor-toolkit, team-toolkit, sermon, study, message | ✅ | ✅ Via wrap |
| #bible-qa-search | bible-tool.html | ✅ Easter-egg intercept + wireStillInBibleSearch | ✅ Full |
| #global-search | bible-tool, reading-plan (injected) | ✅ Easter-egg intercept | ✅ Via wireUniversalSearchInputs |
| #church-query | church.html | ✅ Easter-egg intercept | ✅ Via wireUniversalSearchInputs |
| #sbVerseInput | sermon.html | ✅ Easter-egg intercept | ✅ Via wireUniversalSearchInputs |
| #lib-search | team-toolkit.html | ✅ Easter-egg intercept | ✅ Via wireUniversalSearchInputs |
| #bible-study-search-input | bible/study.html | ✅ Easter-egg intercept | ✅ Via script.js + wireUniversalSearchInputs |
| #verse-maps-input | bible/tools.html | ✅ Easter-egg intercept | ✅ Via script.js + wireUniversalSearchInputs |
| #concordance-search-input | bible/tools.html | ✅ Easter-egg intercept | ✅ Via script.js + wireUniversalSearchInputs |
| #pastor-verse-search | pastor/tools.html | ✅ Easter-egg intercept | ✅ Via wireUniversalSearchInputs |
| #kids-search-input | kids/index.html | ✅ Easter-egg intercept | ✅ Via script.js + wireUniversalSearchInputs |
| #kids-library-search-input | kids/corner.html | ✅ Easter-egg intercept | ✅ Via wireUniversalSearchInputs |
| #mystudy-search | mystudy.html | ✅ Easter-egg intercept | ✅ Via script.js + wireUniversalSearchInputs |
| #ab-search | action-bible.html | ✅ Easter-egg intercept | ✅ Via script.js + wireUniversalSearchInputs |

### getQueryInput() fallback chain

`script.js` line 148–149:

```javascript
return document.getElementById('feel-search') || document.getElementById('tdb-search') || document.getElementById('query');
```

**wireUniversalSearchInputs (March 2026):** Adds easter-egg intercept to #global-search, #church-query, #bible-qa-search, #pastor-verse-search, #kids-library-search-input, #lib-search, #sbVerseInput. When user types an easter egg term (still, secrets, hallelujah, etc.) and hits Enter or clicks Search, runSearchWithInput is called. Non-egg terms still use native search.

---

## 4. Easter Egg Element Requirements (initIndex Early Return)

`initIndex()` calls `wrapRunSearch()` first (always), then returns early if `!document.getElementById('verseCard')`. So:

| Element | Required for | Pages that have it |
|---------|--------------|--------------------|
| #verseCard | All index-specific eggs | index.html only |
| #heroRef | 7 clicks verse ref | index.html |
| #feel-search, #feel-search-btn | hallelujah click/Enter, jesus typed | index.html |
| #quickTopics | Grace triple-click, chip eggs | index.html |
| .quick-topic[data-topic="peace"] | Shift+hover, dove hover | index.html, bible-tool, etc. |
| .quick-topic[data-topic="hope"] | 4s hover | index.html, bible-tool, etc. |
| .quick-topic[data-topic="forgiveness"] | 5 clicks, triple-click tomb | index.html, bible-tool, etc. |
| .quick-topic[data-topic="rest"] | 5s hover | index.html, bible-tool, etc. |
| .quick-topic[data-topic="joy"] | 4 fast clicks | index.html, bible-tool, etc. |
| .quick-topic[data-topic="love"] | Ctrl+click | index.html, bible-tool, etc. |
| .landing-privacy-teaser | 10s hover, 7 clicks | index.html |
| #heroBreakdownPanels | Double-tap "Do this" | index.html |
| .welcome-cross | Triple-click tomb | index.html (welcome flow) |
| .plan-chip[data-plan="peace"] | Dove hover | index.html (plans section) |
| .easter-footer-dove-trigger | 4s hover | index.html |
| .closing-breath, .tool-footer-tagline | "Still. He's got it." dblclick | index.html, tool pages |

**wrapRunSearch** runs before the early return, so search-triggered eggs (still, hallelujah, secrets, etc.) work on ALL pages with script.js + runSearchWithInput.

---

## 5. Easter Eggs Inventory

### initGlobal (all pages with easter-eggs.js)

| Trigger | Behavior | Scope |
|---------|----------|-------|
| Konami ↑↑↓↓←→←→BA | Verse toast, sessionStorage.konamiFound | All pages |

### initIndex (index.html only — requires verseCard)

| Trigger | Behavior |
|---------|----------|
| 7 clicks #heroRef | Numbers 6:24–26 blessing |
| Click #feel-search-btn / Enter | tryHallelujah first, then runSearchWithInput |
| Type "jesus" in #feel-search | Screen softens, Hebrews 13:8 |
| 10s hover .landing-privacy-teaser | "But He sees every heart" |
| Double-tap "Do this" in #heroBreakdownPanels | Pulse, cross glow |
| Triple-click .welcome-cross or Forgiveness chip | Empty tomb emoji |
| Triple-tap verse (#heroVerse / #verseCard) | "This verse found you today" |
| 7 clicks .landing-privacy-teaser | "You're seen... but not tracked" |
| Shift+hover Peace chip 3s | "Peace isn't absence of storm" |
| Triple-click any .quick-topic | Grace toast |
| Hope chip 4s hover | "Hope does not disappoint" |
| Forgiveness chip 5 clicks in 3s | "Forgiven people forgive" |
| Rest chip 5s hover | Matthew 11:28 |
| Ctrl+click Love chip | Heart particles |
| Joy chip 4 fast clicks | Bounce, sun particles |
| Footer dove 4s hover | "The Spirit descends like a dove" |
| Double-click "Still. He's got it." | "He really does" |
| Ctrl+Shift+P | Peace chip pulse, John 14:27 |
| Ctrl+Shift+J | Joy chip pulse, 1 Thess 5:16 |
| Alt+Shift+F | Faith chip glow, Hebrews 11:1 |
| Ctrl+Alt+R | Tomb emoji, Matthew 28:6 (once/day) |
| 1 in 30 load | Floating cross |
| Offline | "Even offline, He is with you" |
| 10% load | Hidden dove |
| 2% load | Angel number |
| 5–7 AM local | easterSunrise — "He is risen indeed" |
| Sunday reload | easterSunday — Psalm 118:24 |
| Sunday 6–12 PM | Enhanced Easter morning |
| Fear in tdb_last_query | "Fear is loud. He is louder" |

### wrapRunSearch (all pages with script.js + runSearchWithInput)

| Trigger | Behavior | Notes |
|---------|----------|-------|
| `still` | Psalm 46:10 overlay | Works on index + bible-tool (wireStillInBibleSearch) |
| `hallelujah` | Praise verses, dove | Once per day |
| `amen` | Pulse, corner "Amen", toast | Once per session |
| `nothing can stop you/me/us` | Isaiah 43:2 + Romans 8:38–39 | ✅ |
| `grace` | Rain + toast | ✅ |
| `forgive` | Glow + toast | ✅ |
| `mercy` | Chip glow + toast | ✅ |
| `shabbat` | Dark mode, candle, rest search | ✅ |
| `risen` | Sunrise + toast | Once per session |
| `lamb` | Lamb float + toast | ✅ |
| `resurrection` | Glow + toast | Once per session |
| `secrets` | Redirect to /secrets.html | Requires konamiFound (Konami first) |
| `abide` | John 15:4 overlay | ✅ |

### initOtherPages (bible-tool, message, mobius, contact)

| Page path contains | Egg | Behavior |
|--------------------|-----|----------|
| bible-tool, bible/tools | wireStillInBibleSearch | "still" in #bible-qa-search or #query → Psalm 46:10 |
| message | wirePrayerWallEgg | Double-click #post-message → "He hears the unspoken" |
| mobius | wireMobiusEgg | Alt+ArrowLeft, triple-tap Share, double-tap viz |
| contact | wireSuggestFormEgg | tdb:suggest-success → "You're part of the map" |

### Input-only (no search)

| Trigger | Behavior |
|---------|----------|
| Type `jesus` in search bar | Screen softens, Hebrews 13:8 toast (once per session) |

### Secrets page unlock flow

1. Konami code → `sessionStorage.konamiFound = '1'`
2. Search "secrets" → `sessionStorage.tdb_secretsUnlocked = '1'` → redirect to `/secrets.html`

**Current state:** Fixed. Konami now triggers; secrets unlock works.

---

## 6. Secrets Page Hints vs Implementation

### Hints that match implementation ✅

- Search "still", "amen", "hallelujah", "grace", "forgive", "jesus", "mercy", "shabbat", "risen", "lamb", "resurrection", "abide"
- 7 clicks verse ref, triple-tap verse, double-tap "Do this", 10s privacy note, 7 clicks "No tracking"
- Shift+hover Peace, triple-click chips for grace, Hope 4s hover, Forgiveness 5 clicks, Rest 5s hover
- Joy 4 fast clicks, Ctrl+click Love, footer dove 4s hover, double-click "Still. He's got it."
- Triple-click Forgiveness chip / welcome cross, Konami code, Ctrl+Shift+P/J, Alt+Shift+F, Ctrl+Alt+R
- 1 in 30 cross, offline toast, Sunday reload, 5–7 AM sunrise, 2% angel number, fear mood toast
- First suggestion toast, "nothing can stop you", Möbius triple-tap Share, Shift+click Trace Cycle
- Möbius "eternal", "empty tomb", double-tap viz, Alt+click node
- Bible Tool "still", Message Board double-click Post

### Hints with no or wrong implementation ❌

| Hint | Status |
|------|--------|
| **Search "cross" for the key** | Not implemented. The "cross" easter egg is the 1-in-30 random load, not search-triggered. |
| **Easter Monday: victory** | Not implemented anywhere. |
| **Möbius: 5 clicks on 2 Timothy 1:7** | Not implemented. The 2tim node has Alt+click ("Seen.") but no 5-click handler. |

### Hint timing mismatch

- **"Sunday 5–9 AM: He is risen"** — Code uses 6 AM–12 PM for Easter morning (`easterSunday`). Minor discrepancy.

---

## 7. Möbius Page Easter Eggs

| Trigger | Location | Status |
|---------|----------|--------|
| Alt+ArrowLeft | easter-eggs.js wireMobiusEgg | ✅ "One side. One path. No end." |
| Triple-tap Share this loop | easter-eggs.js | ✅ "Sharing light in the darkness." |
| Double-tap viz background | easter-eggs.js | ✅ Reverses tracer |
| Shift+click Trace Cycle | mobius-universal.js | ✅ "Your path is marked." (gold tracer) |
| Type "loop" in Text mode | mobius.html | ✅ "The loop remembers." |
| Type "eternal" in Text mode | mobius.html | ✅ Romans 6:23 toast |
| Type "empty tomb" in Text mode | mobius.html | ✅ Matthew 28:2 toast |
| Alt+click node | mobius-universal.js | ✅ "Seen." toast |
| 5 clicks on 2 Timothy 1:7 | — | ❌ Not implemented |

---

## 8. Gaps & Edge Cases

### Search inputs — 100% wired (March 2026)

- **script.js added** to kids/index.html, mystudy.html, action-bible.html, bible/study.html, bible/tools.html. loadEasterEggsScript injects easter-eggs.js; wireUniversalSearchInputs wires all 16 inputs for easter egg terms.

### Pages with #query but no quick-topic chips

- bible-tool, pastor-toolkit, team-toolkit, sermon, study, message all have #query + #quick-actions-hero. script.js populates quick-actions-hero from TDB_TOPICS, so chip eggs (Peace, Hope, etc.) work where chips exist.

### Egg badge ("57 hidden moments")

- `wireEggBadgeObserver` adds badge to footer when any toast (easter-triple-toast, mobius-tracer-toast, easter-konami-wrap) is shown.
- Badge links to /secrets.html when `sessionStorage.tdb_secretsUnlocked === '1'`.

### secrets.html

- No scripts. Unlock check is inline: `sessionStorage.tdb_secretsUnlocked !== '1'` → locked view.
- Tier progression: 1st visit = tier 1 hints, 2nd = tier 2, 3rd = tier 3 + confetti.

---

## 9. Recommendations

### High priority

1. ~~**Fix Konami bug**~~ — Done.
2. ~~**Wire unwired search inputs**~~ — Done (March 2026). wireUniversalSearchInputs + script.js on 5 pages → 100% coverage on all 16 inputs.

### Medium priority

3. **Add "cross" search** — Implement `tryCrossSearch` to show "The cross was the key" when user searches "cross" (or remove hint from secrets).
4. **Add Easter Monday egg** — Or remove hint from secrets.
5. **Add 5-click 2 Timothy 1:7** — Or change hint to "Alt+click any node" (already implemented).
6. **Add skip links** — Bible Tool, Team Toolkit, Message Board (accessibility).

### Low priority

7. **Align Sunday hint** — Update secrets hint to "Sunday 6 AM–12 PM" or keep as-is for simplicity.
8. **Wire #global-search** — Optional: have header-search-bar call runSearchWithInput for verse select, so "secrets"/"still" work in global search.

---

## 10. Report Addendum — Corrections to Alternate Audit

If you see a different audit that claims:

| Claim | Correction |
|-------|------------|
| Konami bug was `konami.length === 10` (hardcoded) | Actual bug: `konamiIdx === konami.length` — `konami` undefined (ReferenceError). Fix: `konamiCodes.length`. |
| #global-search is "✅ Full" for easter eggs | **False.** header-search-bar.js uses `onVerseSelect`, not `runSearchWithInput`. Typing "secrets" or "still" in #global-search does nothing. |
| initIndex early return uses `quick-actions-hero` | Code uses `verseCard`: `if (!document.getElementById('verseCard')) return`. |
| initOtherPages has "progression/avatar (full armor, streak 7)" | Not in easter-eggs.js. initOtherPages only: wireStillInBibleSearch, wirePrayerWallEgg, wireMobiusEgg, wireSuggestFormEgg. |
| "first 61 suggestions" egg | No such egg. Contact form has "first suggestion" (tdb_suggestSubmitted) — one-time per device. |
| "All 57 hints match implementation" | 3 hints unimplemented: search "cross", Easter Monday, Möbius 5 clicks on 2 Timothy 1:7. |

---

## 11. Files Touched

- `easter-eggs.js` — Konami bug, wrapRunSearch, initIndex, initOtherPages, wireUniversalSearchInputs, wireStillInBibleSearch, wireMobiusEgg, wirePrayerWallEgg, wireSuggestFormEgg
- `secrets.html` — Hint list, unlock logic
- `script.js` — getQueryInput, runSearchWithInput, loadEasterEggsScript
- `mobius.html` — loopKeyBuf "eternal", "empty tomb"
- `mobius-universal.js` — Shift+click Trace, Alt+click node
