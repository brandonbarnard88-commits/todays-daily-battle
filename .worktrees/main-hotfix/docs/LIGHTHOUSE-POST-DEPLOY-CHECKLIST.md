# Lighthouse Post-Deploy Checklist

Run after each deploy to verify performance, accessibility, and best practices.

## 1. Run Lighthouse (mobile)

```bash
npm run audit:lighthouse
```

Opens report in browser. Or use Chrome DevTools → Lighthouse tab (mobile, incognito).

## 2. Target scores

| Category | Target | Notes |
|----------|--------|-------|
| Performance | 85+ | FCP/LCP improve with deferred 3P scripts |
| Accessibility | 95–100 | 36+ aria-label fixes applied |
| Best Practices | 95–100 | Cache + no console errors |

## 3. Key metrics to watch

| Metric | Target | If low |
|--------|--------|--------|
| FCP | < 2.0s | Defer more scripts; preload critical CSS |
| LCP | < 2.5s | `preconnect` to fonts.googleapis + stylesheet (index: no font CSS preload — avoids unused-preload warnings) |
| TBT | < 200ms | Already 0; maintain |
| CLS | < 0.1 | Already 0; maintain |
| Speed Index | < 3.4s | Reduce unused JS |

**Fonts:** index.html uses `preconnect` + stylesheet for Caveat + Cormorant (no duplicate font CSS preload). calm.html may still preload Cormorant + Inter where it helps without unused-preload noise.

## 4. Quick checks

- [ ] No 404s in Network tab (purify.min.js.map, etc.)
- [ ] No console errors (Trusted Types, etc.)
- [ ] Cache headers: static assets return `max-age=31536000`
- [ ] Third-party scripts load after window load (Plausible, Cloudflare)

## 5. PageSpeed Insights (optional)

https://pagespeed.web.dev/ → enter live URL

Uses real CrUX data once traffic builds. Good for production monitoring.

## 6. When to run

- After deploy: quick sanity check
- Weekly: if iterating on performance
- Before major release: full pass

## 7. If scores regress

1. Check `_headers` for cache headers
2. Verify Plausible/Cloudflare load on window load
3. Run `npm run quality:gate` locally
4. Compare to previous report (save `lighthouse-report.html`)
