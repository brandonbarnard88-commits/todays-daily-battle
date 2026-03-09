# Search Diagnosis Report

## Executive Summary

Based on code analysis of `script.js` and `index.html`, **all search functionality code is present and properly structured**. The issue is likely **runtime-related** rather than a code structure problem.

## Code Analysis Results ✅

All critical components verified:
- ✅ `runSearchWithInput` stub exists (prevents onclick failures)
- ✅ Real implementation `__tdbRunSearchReal` defined
- ✅ `renderQuickTopicButtons` function exists
- ✅ `TDB_TOPICS` array with 30 topics
- ✅ `wireSearchAndQuickTopics` wiring function
- ✅ Topic chip click handlers
- ✅ Form submit handlers
- ✅ Output element creation logic
- ✅ Emergency fallback rendering
- ✅ Inline bootstrap scripts in index.html

## Manual Testing Instructions

### Test 1: Search Bar ("hope")

**Steps:**
1. Open https://todaysdailybattle.com/
2. Open browser DevTools (F12) → Console tab
3. Type "hope" in the main search input (`#tdb-search`)
4. Click Search button or press Enter

**Expected Behavior:**
- URL should change to `/?q=hope`
- `#output` container should appear below search
- Verse cards with "hope" theme should render
- Console should show: `TDB: Hero loaded <version>`

**Things to Check:**
- Look for console errors mentioning:
  - `runSearchWithInput`
  - `script.js`
  - `bible.json`
  - CSP violations
- Check Network tab for failed requests
- Verify `window.runSearchWithInput` is a function in console

### Test 2: Quick-Topic Chips

**Steps:**
1. Scroll to quick-topic chips (Hope, Fear, Peace, etc.)
2. Click "Hope" chip
3. Wait 2 seconds, observe results
4. Click "Fear" chip
5. Wait 2 seconds, observe results
6. Click "Peace" chip
7. Wait 2 seconds, observe results

**Expected Behavior for Each Click:**
- URL changes to `/?q=<topic>` (e.g., `/?q=hope`)
- Main search input value updates to topic name
- Results render in `#output` container
- Verses related to clicked topic appear

**Things to Check:**
- Verify chips have `data-topic` attribute: 
  ```js
  document.querySelector('.topic-chip')?.dataset.topic
  ```
- Check if click event fires:
  ```js
  document.addEventListener('click', e => console.log('Clicked:', e.target))
  ```
- Verify click handler is wired:
  ```js
  typeof window.runSearchWithInput // should be 'function'
  ```

### Test 3: Console Inspection

**In Browser Console, Run These Commands:**

```javascript
// 1. Check if functions exist
typeof window.runSearchWithInput
// Expected: "function"

typeof window.__tdbRunSearchReal
// Expected: "function" (if fully loaded) or "undefined" (if still loading)

// 2. Check DOM elements
document.getElementById('tdb-search')
// Expected: <input> element

document.getElementById('quick-actions-hero')
// Expected: <div> with topic chips

document.querySelectorAll('.topic-chip').length
// Expected: 30 (or close to it)

// 3. Check if Bible data loaded
Object.keys(window.bible || {}).length
// Expected: > 0 (should be ~31000 verses)

// 4. Try manual search
window.runSearchWithInput('hope')
// Should trigger search

// 5. Check for pending search
window.__tdbPendingSearch
// Should be empty string or the last search term

// 6. Check script version
window.__tdb_script_version
// Expected: "20260311" or similar
```

## Likely Root Causes

Based on code structure being correct, the issue is likely one of these:

### 1. **CSP (Content Security Policy) Blocking**
- **Symptom:** Console shows CSP violation errors
- **Cause:** Inline scripts or external resources blocked
- **Check:** Look for `Content-Security-Policy` errors in console
- **Fix:** Verify `<script nonce="tdb2025">` is present and CSP allows it

### 2. **Script Load Timing**
- **Symptom:** `runSearchWithInput` is function but does nothing
- **Cause:** `__tdbRunSearchReal` hasn't replaced stub yet
- **Check:** Run `typeof window.__tdbRunSearchReal` in console
- **Fix:** Wait 2-3 seconds after page load, or check for script load errors

### 3. **Bible Data Not Loading**
- **Symptom:** Search runs but shows "Bible data didn't load"
- **Cause:** `bible.json` failed to fetch/parse
- **Check:** Network tab for `bible.json` request, or `Object.keys(window.bible).length` in console
- **Fix:** Verify `bible.json` is accessible and valid JSON

### 4. **Event Handler Not Wiring**
- **Symptom:** Clicking chips does nothing
- **Cause:** `wireSearchAndQuickTopics()` didn't run
- **Check:** Console errors during page load
- **Fix:** Check if `tdbInit()` completed successfully

### 5. **Network/CORS Issues**
- **Symptom:** Failed requests in Network tab
- **Cause:** Resources blocked by CORS or firewall
- **Check:** Network tab for red/failed requests
- **Fix:** Verify all resources load from same origin or have CORS headers

## Debugging Commands

### Check Search State
```javascript
// Full diagnostic
console.log({
  runSearchExists: typeof window.runSearchWithInput,
  realImplExists: typeof window.__tdbRunSearchReal,
  pendingSearch: window.__tdbPendingSearch,
  scriptVersion: window.__tdb_script_version,
  bibleLoaded: Object.keys(window.bible || {}).length,
  searchInput: !!document.getElementById('tdb-search'),
  outputElement: !!document.getElementById('output'),
  chipCount: document.querySelectorAll('.topic-chip').length
});
```

### Force Search
```javascript
// Bypass any timing issues
if (typeof window.__tdbRunSearchReal === 'function') {
  window.__tdbRunSearchReal('hope');
} else {
  window.runSearchWithInput('hope');
}
```

### Check Chip Attributes
```javascript
// Verify first 5 chips have data-topic
Array.from(document.querySelectorAll('.topic-chip')).slice(0, 5).map(chip => ({
  text: chip.textContent.trim(),
  dataTopic: chip.dataset.topic || chip.getAttribute('data-topic'),
  hasClickHandler: chip.onclick !== null
}));
```

## Next Steps

1. **Open the live site** in a browser
2. **Open DevTools Console**
3. **Run the diagnostic commands above**
4. **Perform manual tests** (type "hope", click 3 chips)
5. **Report back with:**
   - Any console errors (especially CSP, script.js, runSearchWithInput)
   - Results of diagnostic commands
   - What happened when clicking chips (URL change? Results shown? Nothing?)

## Test Files Created

1. **`test-search-diagnosis.html`** - Interactive HTML test tool with iframe
   - Open in browser to run automated tests against live site
   
2. **`scripts/diagnose-search-live.mjs`** - Node.js code analyzer (already run)
   - Verifies all code is present in script.js and index.html

---

**Status:** Code structure is ✅ healthy. Issue is likely runtime/browser-specific. Manual testing needed to identify exact failure point.
