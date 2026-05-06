# Lighthouse Results Interpretation Guide

**How to run:** Chrome DevTools → Lighthouse tab → Generate report (Performance, Accessibility, Best Practices).

Or CLI: `npm run audit:lighthouse` (production) or `npm run audit:lighthouse:local` (local build).

---

## Score Ranges (0–100)

| Category | Green (Good) | Orange (Needs Work) | Red (Poor) |
|----------|--------------|---------------------|------------|
| Performance | 90–100 | 50–89 | 0–49 |
| Accessibility | 90–100 | 50–89 | 0–49 |
| Best Practices | 90–100 | 50–89 | 0–49 |

---

## Trusted Types Patch Impact

**Expected:** Neutral or slightly positive.

- **Performance:** No impact. The patch runs once at load; no ongoing overhead.
- **Accessibility:** No impact. Semantic HTML and ARIA unchanged.
- **Best Practices:** May improve. Trusted Types + DOMPurify reduce XSS risk; Lighthouse may flag fewer security concerns.

---

## Common Findings & What to Do

### Performance

| Finding | Action |
|---------|--------|
| LCP (Largest Contentful Paint) > 2.5s | Preload hero fonts; ensure critical CSS inline or early. |
| CLS (Cumulative Layout Shift) > 0.1 | Add explicit dimensions to images; avoid layout shifts from dynamic content. |
| TBT (Total Blocking Time) high | Defer non-critical JS; use `loadDeferredScriptsOnIdle` pattern. |

### Accessibility

| Finding | Action |
|---------|--------|
| Contrast ratio | Ensure text meets WCAG AA (4.5:1 normal, 3:1 large). |
| Form labels | Every input has `aria-label` or associated `<label>`. |
| Focus visible | Interactive elements have visible focus states. |

### Best Practices

| Finding | Action |
|---------|--------|
| HTTPS | Ensure all resources load over HTTPS. |
| Console errors | Fix any red errors; TrustedHTML violations should be gone post-patch. |
| Deprecations | Address any deprecated API warnings. |

---

## Post-Patch Baseline

After deploying Trusted Types + Möbius polish:

1. Run Lighthouse on **index.html** (home).
2. Run on **mobius.html** (D3 + viz).
3. Run on **calm.html** (verse load).

Compare scores to pre-patch. The patch should not regress any category. If Best Practices improves, note it for the X thread.
