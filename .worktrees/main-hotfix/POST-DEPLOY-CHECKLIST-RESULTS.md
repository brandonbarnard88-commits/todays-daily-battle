# Post-Deploy Checklist Results

**Date:** March 18, 2026  
**Site:** https://www.todaysdailybattle.com

---

## 1. Deploy & Cache Purge

- **Deploy:** Assumed complete (Lighthouse ran against live site)
- **Cloudflare purge:** Run manually after deploy:
  ```bash
  CF_API_TOKEN=your_token npm run purge:cloudflare
  ```
  Or via GitHub Actions if `CF_API_TOKEN` is set in repo secrets.

---

## 2. Analytics Lazy-Load Verification (Post-Deploy)

**Cold load test (incognito, disable cache):**

| Check | How |
|-------|-----|
| **No early GA requests** | Network tab: Confirm no requests to `googletagmanager.com`, `www.google-analytics.com`, or `gtag/js` until you interact (click, scroll, move mouse). |
| **After interaction** | Scripts load; `dataLayer` processes queued events. |
| **wins-report.html** | `wins_report_view` event should fire once loaded. |
| **Early gtag calls** | Should queue without errors. |

**Edge cases:**

- **Bots/crawlers:** Fallback at 3.5s ensures `page_view` tracks.
- **Mobile:** `touchstart` covers taps.
- **Repeat visits:** If user interacts fast, analytics loads quickly—no perceived delay.

**Expected Lighthouse impact:** TBT &lt;&lt; 1,170 ms, LCP &lt;&lt; 5.2s, Unused JS reduced, Performance 75–90+. Check "Reduce unused JavaScript" and "Minimize main-thread work"—gtag-related entries should vanish or shrink.

---

## 3. Lighthouse Audit (Fresh Run)

| Category        | Score | Notes                          |
|-----------------|-------|--------------------------------|
| **Performance** | 55    | LCP 5.2s; CLS 0.024            |
| **Accessibility** | 100 | All audits passed              |
| **Best Practices** | 81 | Up from 73; deprecations only  |

### Metrics

- **CLS:** 0.024 (good; no layout jump)
- **LCP:** 5.2 s (needs improvement; target &lt; 2.5s)
- **Console errors:** None (audit passed)

---

## 4. Best Practices – Remaining Failure

**Single failing audit:** Uses deprecated APIs

| Deprecated API | Source |
|----------------|--------|
| SharedStorage | `cdn-cgi/challenge-platform` (Cloudflare) |
| Fledge | `cdn-cgi/challenge-platform` (Cloudflare) |
| StorageType.persistent | (standard deprecation) |

These come from **Cloudflare’s challenge/bot protection**, not GTM or your app code. You can’t fix them in your codebase; they’re controlled by Cloudflare.

---

## 5. DevTools Console

- **CSP / inline:** No “Refused to execute inline script/event handler” errors (CSP inline handler fixes are working)
- **Console:** No browser errors reported by Lighthouse

**Manual check:** Open DevTools → Console, reload 2–3 times, filter for “CSP” or “inline” to confirm.

---

## 6. Manual Checks (You)

| Check | Status |
|-------|--------|
| **Prayer wall dismiss** | Navigate to grace message → click dismiss → confirm it hides, no console errors, no layout jump. Test on mobile (touch). |
| **Caveat font** | Hard refresh (Cmd+Shift+R) → check Caveat text (headers, daily verse, etc.) → should load without long FOIT/FOUT. |

---

## 7. Next Steps (Optional)

1. **Performance (55):** LCP 5.2s is the main drag. Consider:
   - Preloading LCP image/font
   - Reducing render-blocking resources
   - Checking third-party impact (GA, Cloudflare)

2. **Best Practices (81):** Deprecations are from Cloudflare. Options:
   - Adjust Cloudflare settings (e.g., lower security level) if acceptable
   - Accept 81 until Cloudflare updates their scripts

3. **GTM/analytics:** Lazy-loading implemented via `analytics-loader.js`.

**If scores improve as expected (big TBT/LCP wins), next priorities:**

- **Minify JS/CSS** (if not already via build) → tackle the ~67 KiB savings.
- **Preload the LCP candidate** (likely Caveat font or hero text block) for further LCP polish.
- **Trim unused JS** (Coverage tab in DevTools will highlight).

---

## Summary

- **Accessibility:** 100
- **Best Practices:** 81 (CSP inline fixes applied; deprecations from Cloudflare)
- **Performance:** **84** (was 55) — lazy-load analytics impact
- **LCP:** **4.3s** (was 5.2s)
- **TBT:** **10 ms** (was 1,170 ms)
- **CLS:** **0.005** (was 0.024)
- **Main-thread work:** **2.4s** (was 4.4s)
- **Unused JS:** **282 KiB** (was ~389 KiB)
- **Console:** Clean

Report saved: `lighthouse-report.html`

### Before/After (Analytics Lazy-Load)

| Metric | Before | After |
|--------|--------|-------|
| Performance | 55 | **84** |
| TBT | 1,170 ms | **10 ms** |
| LCP | 5.2s | 4.3s |
| Main-thread | 4.4s | 2.4s |
| Unused JS | ~389 KiB | 282 KiB |
| CLS | 0.024 | 0.005 |
