# 🔍 Search Diagnosis - Comprehensive Report

## Summary

After thorough code analysis, **all search functionality code is properly structured**. However, there is a **CSP (Content Security Policy) mismatch** that could block inline scripts.

---

## ✅ Code Structure Analysis (All Passed)

### Core Functions Present
- ✅ `runSearchWithInput` stub (lines 36-73 in script.js)
- ✅ `__tdbRunSearchReal` implementation (line 12816)
- ✅ `renderQuickTopicButtons` (line 809)
- ✅ `wireSearchAndQuickTopics` (line 12655)
- ✅ `TDB_TOPICS` array with 30 topics (line 776)
- ✅ Form submit handlers
- ✅ Topic chip click handlers
- ✅ Output element creation logic
- ✅ Emergency fallback rendering

### HTML Elements Present
- ✅ `#tdb-search` input
- ✅ `#search-btn` button
- ✅ `#search-form` form
- ✅ `#quick-actions-hero` container
- ✅ Inline bootstrap scripts in index.html (lines 62-140)

---

## ⚠️  Potential Issue: CSP Mismatch

### Problem
There is a **Content-Security-Policy discrepancy** between `index.html` and `vercel.json`:

**index.html (line 6):**
```
script-src 'self' 'nonce-tdb2025' 'wasm-unsafe-eval' https://...
```
❌ Does **NOT** include `'unsafe-inline'`

**vercel.json (line 12):**
```
script-src 'self' 'unsafe-inline' 'nonce-tdb2025' https://...
```
✅ Does include `'unsafe-inline'`

### Impact
- If the **index.html meta tag** takes precedence, inline scripts without proper nonces may be blocked
- This could prevent the inline bootstrap script (lines 62-140 in index.html) from executing
- If the bootstrap script is blocked, search will not initialize

### Check This
In browser console, look for:
```
Refused to execute inline script because it violates the following Content Security Policy directive
```

---

## 🧪 Manual Testing Steps

### 1. Open Live Site
```
https://todaysdailybattle.com/
```

### 2. Open Browser DevTools
Press `F12` or `Cmd+Option+I` (Mac)

### 3. Check Console for Errors

Look for these specific errors:

**CSP Violations:**
```
Refused to execute inline script because it violates CSP directive 'script-src'
```

**Script Load Errors:**
```
Failed to load resource: script.js
Failed to load resource: config.js
Failed to load resource: bible.json
```

**Search Function Errors:**
```
runSearchWithInput is not defined
Cannot read property '__tdbRunSearchReal' of undefined
```

### 4. Check Function Availability

In the Console tab, type:
```javascript
typeof window.runSearchWithInput
```
**Expected:** `"function"`  
**If:** `"undefined"` → Scripts didn't load or CSP blocked them

```javascript
typeof window.__tdbRunSearchReal
```
**Expected:** `"function"` (after ~2 seconds of page load)  
**If:** `"undefined"` → Main script didn't fully initialize

```javascript
Object.keys(window.bible || {}).length
```
**Expected:** `> 30000` (KJV has ~31,000 verses)  
**If:** `0` → Bible data didn't load

```javascript
document.querySelectorAll('.topic-chip').length
```
**Expected:** `~30` chips  
**If:** `0` → Chips didn't render

### 5. Test Search Bar

1. Type **"hope"** in the search input
2. Press **Enter** or click **Search**
3. Observe:
   - **URL should change to:** `https://todaysdailybattle.com/?q=hope`
   - **#output container should appear** below search area
   - **Verse cards should render** with hope-related verses

**If nothing happens:**
- Check console for errors
- Run `window.runSearchWithInput('hope')` manually in console
- Check if `#output` element exists: `document.getElementById('output')`

### 6. Test Topic Chips

Click these chips in order:
1. **Hope**
2. **Fear**
3. **Peace**

For each click, observe:
- **URL changes** to `/?q=<topic>`
- **Search input updates** to topic name
- **Results render** in `#output`

**If chips don't work:**
- Check if they have `data-topic` attribute:
  ```javascript
  document.querySelector('.topic-chip')?.dataset.topic
  ```
- Check if click handler is attached:
  ```javascript
  document.querySelector('.topic-chip')?.onclick
  ```

### 7. Network Tab Check

Go to **Network** tab in DevTools:
- Look for **failed requests** (red text)
- Check if these loaded successfully:
  - `config.js` - 200 OK
  - `script.js` - 200 OK
  - `bible.json` - 200 OK
- If any failed with **404** or **403**, that's the issue

---

## 🔧 Likely Root Causes (In Order)

### 1. CSP Blocking Inline Scripts (HIGH PROBABILITY)
**Symptom:** Console shows CSP violation errors  
**Cause:** index.html CSP doesn't have `'unsafe-inline'` for script-src  
**Check:** Look for "Refused to execute inline script" in console  
**Fix:** Either:
- Add `'unsafe-inline'` to index.html CSP `script-src` directive
- Ensure all inline scripts have `nonce="tdb2025"`
- Verify Vercel/Cloudflare headers match

### 2. Script Load Failure
**Symptom:** `runSearchWithInput` is undefined  
**Cause:** `script.js` didn't load (404, network error, CSP)  
**Check:** Network tab for script.js status  
**Fix:** Verify deployment includes script.js

### 3. Bible Data Not Loading
**Symptom:** Search runs but shows "Bible data didn't load"  
**Cause:** `bible.json` fetch failed  
**Check:** Network tab for bible.json, console for load errors  
**Fix:** Verify bible.json is accessible at `/bible.json`

### 4. Timing Issue
**Symptom:** Clicking search/chips immediately after page load does nothing  
**Cause:** `__tdbRunSearchReal` hasn't replaced stub yet  
**Check:** Wait 3 seconds and try again  
**Fix:** Already has fallback logic (stub queues searches for 900ms)

### 5. Event Handler Not Attached
**Symptom:** Chips have no click response  
**Cause:** `wireSearchAndQuickTopics()` didn't run  
**Check:** Console errors during init  
**Fix:** Check if `tdbInit()` completed (look for console.log "TDB: Hero loaded")

---

## 📊 Diagnostic Commands

### Full System Check
```javascript
console.log({
  runSearchExists: typeof window.runSearchWithInput === 'function',
  realImplExists: typeof window.__tdbRunSearchReal === 'function',
  pendingSearch: window.__tdbPendingSearch || 'none',
  scriptVersion: window.__tdb_script_version || 'not loaded',
  bibleVerses: Object.keys(window.bible || {}).length,
  searchInput: !!document.getElementById('tdb-search'),
  searchBtn: !!document.getElementById('search-btn'),
  outputElement: !!document.getElementById('output'),
  chipCount: document.querySelectorAll('.topic-chip, .quick-topic, [data-topic]').length,
  quickActionsHero: !!document.getElementById('quick-actions-hero')
});
```

### Force Search (Bypass Timing)
```javascript
if (typeof window.__tdbRunSearchReal === 'function') {
  window.__tdbRunSearchReal('hope');
} else if (typeof window.runSearchWithInput === 'function') {
  window.runSearchWithInput('hope');
} else {
  console.error('No search function available');
}
```

### Check Chip Data
```javascript
Array.from(document.querySelectorAll('.topic-chip')).slice(0, 5).map(chip => ({
  text: chip.textContent.trim(),
  dataTopic: chip.dataset.topic || chip.getAttribute('data-topic'),
  classes: chip.className
}));
```

### Check CSP
```javascript
// Check if CSP is blocking anything
// Look in Console tab for "Refused to..." messages
// Or check the HTTP headers:
fetch(window.location.href, {method: 'HEAD'})
  .then(r => r.headers.get('content-security-policy'))
  .then(csp => console.log('CSP Header:', csp || 'none'));
```

---

## 🎯 Recommended Fix (If CSP is the issue)

### Option A: Add unsafe-inline to index.html (Quick Fix)
Edit `index.html` line 6, change:
```html
script-src 'self' 'nonce-tdb2025' 'wasm-unsafe-eval' https://...
```
To:
```html
script-src 'self' 'unsafe-inline' 'nonce-tdb2025' 'wasm-unsafe-eval' https://...
```

### Option B: Ensure All Inline Scripts Have Nonce (Better Security)
Verify every `<script>` tag in index.html has `nonce="tdb2025"`:
```html
<script nonce="tdb2025">
  // ... code ...
</script>
```

### Option C: External Bootstrap Script (Best Security)
Move inline scripts to external file with proper loading order.

---

## 📁 Test Files Created

1. **`test-search-diagnosis.html`**  
   Interactive HTML tool that loads the live site in an iframe and runs automated tests

2. **`scripts/diagnose-search-live.mjs`**  
   Node.js script that analyzes local code (already run - all passed ✅)

3. **`SEARCH-DIAGNOSIS.md`**  
   This comprehensive report

---

## ✅ Next Steps

1. **Open https://todaysdailybattle.com/ in a browser**
2. **Open DevTools Console (F12)**
3. **Look for CSP violation errors first**
4. **Run the diagnostic commands above**
5. **Test search bar with "hope"**
6. **Click 3 topic chips**
7. **Report back with:**
   - Any console errors (especially CSP-related)
   - Results of diagnostic commands
   - What happened when testing (URL changes? Results shown? Nothing?)

---

**Status:** Code is ✅ healthy. Most likely issue is **CSP blocking inline scripts**. Manual browser testing needed to confirm.
