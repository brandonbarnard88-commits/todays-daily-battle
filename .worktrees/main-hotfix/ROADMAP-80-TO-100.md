# Roadmap: 80% → 100% (Every Plane)

What it takes to push Today's Daily Battle to elite status across every dimension. Current baseline: Performance 70, Accessibility 100, Best Practices 92, Security strong.

---

## 1. Performance (70 → 95+)

**Root cause:** Slow FCP (4.3s) and LCP (4.7s). TBT and CLS are perfect.

| Action | Impact | Effort |
|--------|--------|--------|
| **Defer non-critical JS** | Analytics, Plausible, Cloudflare beacon, Easter eggs, verse-breakdown — load after first paint or on idle | Medium |
| **Preload critical resources** | Hero verse, above-fold CSS, Caveat font (already preloaded) | Low |
| **Reduce unused JS (189 KiB)** | Code-split or lazy-load: kids-corner.js, bible-tools.js, sermon builder, mobius, etc. Only load what the current page needs | High |
| **Minify JS (65 KiB savings)** | Ensure build minifies all scripts; verify no unminified vendor scripts ship | Low |
| **Reduce unused CSS (16 KiB)** | Split CSS by route; critical CSS inline or preloaded; defer non-critical | Medium |
| **Minify CSS (7 KiB)** | Verify minification covers all stylesheets | Low |
| **Cache lifetimes** | Add long cache headers for static assets (JS, CSS, images); versioned filenames for cache busting | Low |
| **Third-party impact** | GA4, Plausible, Cloudflare — load after interaction or use facade pattern | Medium |
| **Fix forced reflow** | Audit layout thrashing; batch DOM reads/writes; avoid sync layout in hot paths | Medium |

**Target:** FCP < 1.8s, LCP < 2.5s, Speed Index < 3.4s.

---

## 2. Accessibility (100 — maintain)

| Action | Notes |
|--------|-------|
| **Fix label-content-name-mismatch** | Lighthouse flags elements where visible text ≠ accessible name. Audit and align `aria-label` / `aria-labelledby` with visible text. |
| **Keep contrast, focus, keyboard** | No regressions. Run axe or Lighthouse accessibility on every major change. |

---

## 3. Best Practices (92 → 100)

| Action | Notes |
|--------|-------|
| **Fix console errors** | Trusted Types (if any remain), 404s (purify.min.js.map), third-party script errors. Suppress or fix. |
| **Fix Inspector issues** | Chrome DevTools Issues panel — resolve deprecations, mixed content, cookie warnings. |
| **HSTS** | Ensure `Strict-Transport-Security` is set (already in _headers). |
| **COOP** | `Cross-Origin-Opener-Policy: same-origin` (already present). |

---

## 4. Security (already strong — maintain)

| Action | Notes |
|--------|-------|
| **Keep test:security at 0 warnings** | No regressions. |
| **RLS + sanitization** | Every new table/input path. |
| **Secrets** | Never in client. Rotate if exposed. |
| **Admin guard** | Cloudflare Worker or Access for /admin in production. |

---

## 5. SEO

| Action | Notes |
|--------|-------|
| **Schema** | Organization, WebSite, Article (verse), ItemList (plans) — already present. Add BreadcrumbList where useful. |
| **Meta** | Title, description, canonical, OG, Twitter — done. Per-page meta for topic/verse pages. |
| **Sitemap** | Keep updated. |
| **Core Web Vitals** | LCP, FID/INP, CLS — performance work above. |

---

## 6. UX / Polish (Phase 2–3)

| Action | Notes |
|--------|-------|
| **Legacy surface uplift** | Homepage search, quick topics, search cards, Kids Battle — match God-tier bar. |
| **Micro-interactions** | Feedback timing, motion restraint, clarity. |
| **Error/retry flows** | Explicit, reassuring, actionable. |
| **Empty states** | Mission-consistent, actionable. |
| **Mobile tap targets** | 44px minimum. |

---

## 7. Reliability / Offline

| Action | Notes |
|--------|-------|
| **Service worker** | All key routes precached. Verse/loop cache for offline. |
| **Offline fallback** | "Offline—still got you" with cached verse. |
| **Retry logic** | Bible fetch, prayer submit, sync — retry + dismiss. |
| **Error boundaries** | Graceful degradation; no blank screens. |

---

## 8. Auth & Payments

| Action | Notes |
|--------|-------|
| **Manual smoke** | Sign up → login → logout → forgot password → checkout → success. |
| **Webhook verification** | Stripe event → tier update in profiles. |
| **Session persistence** | Refresh, tab switch. |
| **Edge cases** | Expired session, network failure during checkout. |

---

## 9. Analytics & Observability

| Action | Notes |
|--------|-------|
| **GA4 events** | patriotic_pray, patriotic_share, search, plan complete, etc. |
| **Error tracking** | Optional: Sentry or similar for JS errors in production. |
| **Core Web Vitals** | Report to GA4 or analytics endpoint. |
| **Privacy** | No raw query text, no identity leakage. |

---

## 10. CI / DevOps

| Action | Notes |
|--------|-------|
| **Playwright in CI** | Fix spawn/Chrome in GitHub Actions; run qa:smoke on PR. |
| **Lighthouse in CI** | Optional: run on deploy, fail if Performance < 80. |
| **Quality gate** | Already runs build, audit, test. Keep as gate. |
| **Deploy** | Cloudflare Pages / Netlify. Purge cache on release. |

---

## 11. Code Quality / Maintainability

| Action | Notes |
|--------|-------|
| **Split script.js** | 22k+ lines — consider route-based or feature-based chunks. |
| **Dead code** | Remove unused modules, styles. |
| **Consistency** | Shared patterns for escape, sanitize, API calls. |
| **Documentation** | SECURITY.md, SUPABASE-SYNC-TABLES.md, runbooks. |

---

## 12. Push / Notifications (Phase 3–5)

| Action | Notes |
|--------|-------|
| **VAPID key** | Set real key in config. |
| **Push subscribe/unsubscribe** | Verify DB rows, removal path. |
| **Daily cron** | seed-daily-verse, send-daily-verse-push. |
| **Monitoring** | push_send_logs, dashboard query. |

---

## Priority Order (Suggested)

1. **Quick wins (1–2 days):** Minify JS/CSS, cache headers, fix console errors, label-content-name-mismatch.
2. **Performance core (3–5 days):** Defer third-party scripts, preload critical path, reduce unused JS.
3. **Manual verification (1 day):** Auth smoke, checkout, QA smoke locally.
4. **Polish (ongoing):** Legacy uplift, micro-interactions, empty states.
5. **Advanced (as capacity):** Code-split, error tracking, Playwright in CI, push verification.

---

## Definition of "100%"

- **Performance:** 90+ mobile
- **Accessibility:** 100 (maintain)
- **Best Practices:** 100
- **Security:** 0 warnings, manual auth verified
- **SEO:** Schema, meta, sitemap, Core Web Vitals
- **UX:** God-tier on all high-traffic paths
- **Reliability:** Offline verse, retry, no blank failures
- **CI:** Quality gate + smoke (and optionally Lighthouse) pass on every PR

---

*Last updated: March 2026*
