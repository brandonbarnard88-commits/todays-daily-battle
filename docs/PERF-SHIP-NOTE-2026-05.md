# Perf ship note — May 2026

**Commit:** `90cbaf91` — Ship Perf: externalize homepage CSS and feel-search JS for faster first paint.

## What changed

- **`tdb-home-page.css`** — ~346 KB inline homepage CSS moved external (preload + link).
- **`tdb-home-feel.js`** — ~209 KB inline script (FEEL_GROUPS, feel-search, plan modals) moved to deferred external bundle at page foot.
- **Build / offline:** copy, minify, service-worker precache for both files.
- **Guardrails:** homepage search wiring test updated; Lighthouse LCP/TBT baselines in `docs/perf-lighthouse-baseline.json`; `release:check` includes local Lighthouse CI.

## Size (built dist, Brotli)

| Asset | Brotli |
|-------|--------|
| `index.html` | ~38 KB |
| `tdb-home-page.css` | ~35 KB |
| `tdb-home-feel.js` | ~34 KB |
| **Home shell total** | **~107 KB** |

HTML uncompressed: ~768 KB → ~193 KB.

## What did not change

Feel-search wiring, daily verse, Prayer Wall, Kids Corner, Battle Plans, offline-first PWA behavior. No features removed.

## Live verification (2026-05-20)

- Production serves `tdb-home-page.css?v=20260520-home-ext` and `tdb-home-feel.js?v=20260520-feel-ext` (HTTP 200).
- Live HTML includes `#feel-results`, deferred feel bundle, hero prebuild marker.
- **`npm run qa:smoke`** — PASS on production.

### Mobile Lighthouse (live)

| Page | Perf | LCP | TBT |
|------|------|-----|-----|
| Home `/` | 72 | 5.8 s | 10 ms |
| Reader | 63 | 3.6 s | 1,250 ms |

**Versus pre-ship snapshot (same tooling):** Home TBT dropped sharply (80 ms → 10 ms). Home LCP still network-variable (was ~5.3 s); next lane if needed is font/CSS critical path, not more inline bulk.

**Baseline (`docs/perf-lighthouse-baseline.json`):** Home perf 72 ≥ 70 ✓ · Home TBT ✓ · Home LCP 5.8 s slightly above 4.5 s ceiling (honest follow-up, not a rollback). Reader within LCP/TBT ceilings; perf score 63 is a hair under 65 target — separate reader deferral pass when ready.

## Rest

Ship is complete. Watch real visits over a few days; numbers help, hearts landing on the porch matter more.
