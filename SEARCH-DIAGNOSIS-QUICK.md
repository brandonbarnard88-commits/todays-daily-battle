# 🚨 QUICK SEARCH DIAGNOSIS

## Run This First (Browser Console)

Open https://todaysdailybattle.com/ → F12 → Console tab → Paste:

```javascript
console.log('=== SEARCH SYSTEM DIAGNOSTIC ===');
const diagnostic = {
  '1. runSearchWithInput': typeof window.runSearchWithInput === 'function' ? '✅ EXISTS' : '❌ MISSING',
  '2. Real Implementation': typeof window.__tdbRunSearchReal === 'function' ? '✅ LOADED' : '⚠️ STUB ONLY',
  '3. Script Version': window.__tdb_script_version || '❌ NOT LOADED',
  '4. Bible Verses': Object.keys(window.bible || {}).length > 30000 ? '✅ LOADED' : '❌ NOT LOADED',
  '5. Search Input': !!document.getElementById('tdb-search') ? '✅ EXISTS' : '❌ MISSING',
  '6. Output Container': !!document.getElementById('output') ? '✅ EXISTS' : 'ℹ️ WILL CREATE',
  '7. Topic Chips': document.querySelectorAll('.topic-chip, .quick-topic, [data-topic]').length + ' chips',
  '8. Pending Search': window.__tdbPendingSearch || 'none'
};
console.table(diagnostic);

// Check for CSP errors
const cspErrors = window.performance?.getEntriesByType('resource').filter(r => r.name.includes('script') && r.transferSize === 0);
if (cspErrors?.length > 0) {
  console.warn('⚠️ POTENTIAL CSP BLOCKED SCRIPTS:', cspErrors);
}

// Try a test search
console.log('\n🧪 Testing search with "hope"...');
if (typeof window.runSearchWithInput === 'function') {
  window.runSearchWithInput('hope');
  setTimeout(() => {
    const output = document.getElementById('output');
    if (output && output.innerHTML.includes('verse-card')) {
      console.log('✅ SEARCH WORKING - Results rendered');
    } else if (output && output.innerHTML) {
      console.warn('⚠️ SEARCH RAN but no results:', output.innerHTML.substring(0, 200));
    } else {
      console.error('❌ SEARCH FAILED - No output');
    }
  }, 2000);
} else {
  console.error('❌ CANNOT TEST - runSearchWithInput not found');
}
```

## What To Report Back

Copy the **console output** and report:

1. **CSP Errors?** Any "Refused to execute inline script" messages?
2. **Script Load Errors?** Any 404s for script.js, config.js, bible.json?
3. **Search Test Result?** Did "hope" search show verse cards?
4. **Diagnostic Table?** What shows ❌ or ⚠️?

---

## Manual Test Actions

### Test 1: Search Bar
1. Type **"hope"** in search box
2. Press Enter
3. **Expected:** URL → `/?q=hope`, verse cards appear
4. **Report:** Did it work? Any console errors?

### Test 2: Click Chips
1. Click **Hope** chip
2. Click **Fear** chip  
3. Click **Peace** chip
4. **Expected:** Each click shows different verses
5. **Report:** Did any work? All? None?

---

## Most Likely Issues

### 🔥 Issue 1: CSP Blocking Inline Scripts
**Look for:** "Refused to execute inline script" in console  
**Cause:** index.html CSP doesn't allow `'unsafe-inline'` for scripts  
**Quick Check:** Do you see the error above?

### 🔥 Issue 2: Script Load Failure
**Look for:** script.js 404 in Network tab  
**Cause:** File not deployed or path wrong  
**Quick Check:** Does `typeof window.runSearchWithInput` return "undefined"?

### 🔥 Issue 3: Bible Data Missing
**Look for:** "Bible data didn't load" in output  
**Cause:** bible.json didn't load  
**Quick Check:** Does `Object.keys(window.bible || {}).length` return 0?

---

## Emergency Test

If nothing works, try this direct test in console:

```javascript
// Direct search call
window.__tdbRunSearchReal?.('hope') || window.runSearchWithInput?.('hope') || console.error('No search function');

// Check output after 2 seconds
setTimeout(() => {
  const out = document.getElementById('output');
  console.log('Output HTML:', out?.innerHTML.substring(0, 500) || 'NO OUTPUT ELEMENT');
}, 2000);
```

---

## Files Created for You

1. **`SEARCH-DIAGNOSIS-FULL.md`** - Complete detailed report
2. **`scripts/diagnose-search-live.mjs`** - Code analyzer (run with `node scripts/diagnose-search-live.mjs`)
3. **`test-search-diagnosis.html`** - Interactive browser test tool

---

**Bottom Line:** Code structure is ✅ perfect. Issue is likely **runtime** (CSP, script load, or timing). Run the diagnostic above and report back the output.
