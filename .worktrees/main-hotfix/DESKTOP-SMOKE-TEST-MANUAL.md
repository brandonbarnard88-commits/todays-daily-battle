# Desktop Smoke Test Manual Checklist
**Site:** https://www.todaysdailybattle.com/  
**Viewport:** Desktop (1920x1080 or similar)  
**Date:** March 7, 2026

## Prerequisites
- Use Chrome, Firefox, or Safari in desktop mode
- Open DevTools (F12) Console tab to monitor for errors
- Use a fresh browser session or incognito window for best results

---

## Test Steps (7 Critical Flows)

### ✅ Step 1: Homepage Loads Without Blocking Errors
**Action:**
1. Navigate to `https://www.todaysdailybattle.com/`
2. Wait for page to fully load (2-3 seconds)
3. Check for any blocking error overlays

**Expected Result:**
- Page loads successfully
- No blocking error overlays visible
- Main content (search hero, quick topics, Daily Tile) is visible

**Pass Criteria:**
- [ ] Page loads without timeout
- [ ] No error overlays blocking the UI
- [ ] Console shows no critical JavaScript errors

**Console Errors to Check:**
- Open DevTools → Console tab
- Look for red error messages (warnings in yellow are OK)
- Document any errors found

---

### ✅ Step 2: Quick Topic Chips Visible and Clickable
**Action:**
1. Scroll to the "Search by what you feel right now" section
2. Locate the `#quick-actions-hero` container
3. Count visible topic chips (buttons)

**Expected Result:**
- At least 10-30 topic chips visible (Hope, Fear, Peace, Strength, Addiction, Trauma, etc.)
- Chips are styled with gold borders
- Chips respond to hover (scale effect, glow)

**Pass Criteria:**
- [ ] Topic chips are visible (Hope, Fear, Peace, Strength, etc.)
- [ ] At least 10 chips rendered
- [ ] Chips have proper styling (gold borders, centered text)
- [ ] Hover effects work (scale, border glow)

**Element to Inspect:**
- ID: `#quick-actions-hero`
- Look for buttons with class `.quick-topic` or `.topic-chip`

---

### ✅ Step 3: Quick Topic Chip Triggers Search
**Action:**
1. Click on the "Hope" or "Fear" chip
2. Wait 1-2 seconds for results to load
3. Verify search results appear below

**Expected Result:**
- Verse cards appear in the `#output` section
- Results should show 3-10+ verse cards initially
- Search input at top should show the clicked topic

**Pass Criteria:**
- [ ] Clicked chip triggers search
- [ ] Verse cards (.verse-card) render in #output section
- [ ] At least 1 verse card appears
- [ ] No JavaScript errors in console

**Elements to Check:**
- Clicked chip text (e.g., "Hope", "Fear")
- Results container: `#output`
- Verse cards: `.verse-card`

---

### ✅ Step 4: Main Search Input Works
**Action:**
1. Locate the main search input at the top of the page
2. Type "hope" into the search input (`#tdb-search`)
3. Click the "Search" button (`#search-btn`)
4. Wait for results to render

**Expected Result:**
- Verse cards appear in the `#output` section
- Results should show verses related to "hope"
- "Show more" button appears if many results

**Pass Criteria:**
- [ ] Search input accepts text
- [ ] Search button is clickable
- [ ] Verse cards render after submit
- [ ] At least 3-5 verse cards appear
- [ ] No console errors

**Elements:**
- Search input: `#tdb-search` or `#query`
- Search button: `#search-btn`
- Results: `#output .verse-card`

---

### ✅ Step 5: Daily Tile Watch Button Opens Story Overlay
**Action:**
1. Scroll to the "Today's Battle" section (Daily Tile)
2. Locate the "Watch" button (`#daily-tile-watch-btn`)
3. Click the Watch button
4. Wait 1-2 seconds for overlay to open

**Expected Result:**
- Story/cartoon overlay opens
- Overlay shows story panels with text and visuals
- Overlay has close button (X) in top corner

**Pass Criteria:**
- [ ] Watch button is visible in Today's Battle section
- [ ] Watch button is clickable
- [ ] Story overlay opens after click
- [ ] Overlay is not hidden (check for `.hidden` class removed)
- [ ] Story content is visible

**Elements:**
- Watch button: `#daily-tile-watch-btn`
- Overlay: `#tdb-cartoon-overlay` or `#tdb-story-overlay`
- Close button: `.story-close-btn`, `#tdb-story-close`

---

### ✅ Step 6: Story Overlay Advances Panels
**Action:**
1. With story overlay open (from Step 5)
2. Look for "Next" button or wait for auto-advance
3. Observe if story content changes
4. Verify at least one panel transition occurs

**Expected Result:**
- Story advances to next panel (text/visuals change)
- Either manual "Next" button or auto-advance after 3-5 seconds
- Panel counter updates (e.g., "1 of 5" → "2 of 5")

**Pass Criteria:**
- [ ] Story panels change (new text/visuals appear)
- [ ] At least one panel advance detected
- [ ] Navigation controls work (Next button or auto-advance)
- [ ] No errors during panel transition

**Elements:**
- Next button: `#tdb-story-next`, `.story-next-btn`
- Story panels: `.story-panel`, `.cartoon-panel`
- Panel counter: may show "Panel 1 of 5" text

---

### ✅ Step 7: Close Story Overlay (Setup for Step 7)
**Action:**
1. Locate the close button (X) on the story overlay
2. Click to close the overlay
3. Verify overlay closes and homepage is visible again

**Pass Criteria:**
- [ ] Close button found and clickable
- [ ] Overlay closes when clicked
- [ ] Homepage visible after close

**Elements:**
- Close button: `#tdb-story-close`, `.story-close-btn`, `.modal-close`

---

### ✅ Step 8: Quick Pray Flow Completes
**Action:**
1. Scroll to the "Quick Pray" section (near top, below hero verse)
2. Locate the prayer input (`#quick-pray`)
3. Type a short prayer phrase: "Thank you Lord for this day"
4. Click the "Pray" button (`#quick-pray-btn`)
5. Wait 2-3 seconds for feedback

**Expected Result:**
- Success message or feedback appears
- Prayer counter badge updates (shows "Prayers: 1" or increments)
- Input clears after submission
- Visual feedback (pulse, toast, or badge update)

**Pass Criteria:**
- [ ] Prayer input is visible and accepts text
- [ ] Pray button is clickable
- [ ] Success feedback appears (toast, badge, or message)
- [ ] Prayer counter increments (check `#prayer-history-badge`)
- [ ] No console errors during submission

**Elements:**
- Prayer input: `#quick-pray`
- Pray button: `#quick-pray-btn`
- Prayer badge: `#prayer-history-badge` (shows "Prayers: N")
- Success feedback: `.prayer-success`, toast notification, or badge increment

---

## Final Verdict Criteria

### PASS
All 7 steps (1-7) pass with no critical failures.

### FAIL - Critical
Steps 1, 2, or 4 fail (homepage load, quick topics, or main search broken).

### FAIL - Non-Critical
Steps 3, 5, 6, or 7 fail (nice-to-have features broken but core search works).

---

## Console Error Log
**Instructions:** Copy any red errors from DevTools Console here.

```
[Paste console errors here]
```

---

## Test Results Summary

| Step | Status | Notes |
|------|--------|-------|
| 1. Homepage loads | ☐ PASS ☐ FAIL | |
| 2. Quick topic chips visible | ☐ PASS ☐ FAIL | |
| 3. Quick topic chip triggers search | ☐ PASS ☐ FAIL | |
| 4. Main search works | ☐ PASS ☐ FAIL | |
| 5. Daily Tile watch button | ☐ PASS ☐ FAIL | |
| 6. Story overlay advances | ☐ PASS ☐ FAIL | |
| 7. Quick Pray flow | ☐ PASS ☐ FAIL | |

**Final Verdict:** ☐ PASS ☐ FAIL (Critical) ☐ FAIL (Non-Critical)

---

## Notes / Observations
- Any UX issues observed:
- Any regressions from previous versions:
- Browser tested:
- Screen resolution:
- Any additional feedback:

---

## Automated Test Script
For future reference, an automated Playwright script exists at:
- `scripts/qa-desktop-smoke.mjs`

To run (requires Playwright installed):
```bash
npx playwright install chromium
node scripts/qa-desktop-smoke.mjs
```

Environment variable to test different URLs:
```bash
QA_URL=https://staging.todaysdailybattle.com/ node scripts/qa-desktop-smoke.mjs
```
