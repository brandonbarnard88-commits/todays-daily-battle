# Lighthouse-style audit

Quick checklist for performance, SEO, and accessibility on key pages. Run Lighthouse in Chrome DevTools (Lighthouse tab → URL) for real scores.

## What we checked and changed

### Performance
- **Critical CSS**: `index.html` already preloads `styles.css`; added `rel="preload" href="styles.css" as="style"` on `bible-tool.html`, `verse.html`, `study.html` so above-the-fold paint isn’t blocked.
- **Fonts**: Google Fonts use `&display=swap` on index, pricing, message, bible-tool, bible-study; preconnect to `fonts.googleapis.com` / `fonts.gstatic.com` where used.
- **Images**: Shop and 404-admin use `loading="lazy"` and descriptive `alt` on all `<img>`; hero/og image on index is meta-only (no LCP image in body to preload). No other static `<img>` above the fold without lazy.
- **Scripts**: Third-party (Firebase, Stripe, confetti, etc.) are deferred or async where possible; main app script uses `data-cfasync="false"` for Cloudflare.

### SEO
- **Meta**: Key pages have unique `<title>`, `<meta name="description">`, and canonical where applicable.
- **Schema**: index has Organization, WebSite, WebApplication JSON-LD.
- **Headings**: Logical order (single h1, then h2) on audited pages.

### Accessibility
- **Focus / semantics**: Buttons have `aria-label` where needed (e.g. “Clear local data”); footer has `role="contentinfo"` and `aria-label`.
- **Image alt text**: Prayer map world background (SVG `<image>`) has `role="img"` and `aria-label="World map background"`. Share card preview (JS-created img) has descriptive `alt="Share card preview with today's verse"`. Print coloring img has `alt="Coloring page"`. Shop and 404-admin images have descriptive alt.
- **Contrast**: Dark theme (background `#0a0c14`, text `#e2e8f0`) meets contrast requirements for body text.
- **Forms**: Turnstile and form controls are labeled; errors surfaced to users.

### Optional follow-ups
- Run Lighthouse on `/`, `/pricing`, `/bible-tool`, `/verse`, `/study` and fix any remaining “opportunities” (e.g. unused CSS, image dimensions).
- If you add a visible hero image on the homepage, preload it with `<link rel="preload" href="/hero.png" as="image">` for LCP.
- **PWA install**: Add `icon-192.png` and `icon-512.png` to the site root and reference them in `manifest.json` for better “Add to Home Screen” icons on Android/iOS (manifest already lists them).
- **Unused JavaScript**: Lighthouse may report ~40% of `script.js` as unused (single bundle for all pages). To improve: use “Remove unused JavaScript” in the report to find dead code, or split non-core logic (e.g. reader, admin, wins-report, coloring) into separate files and load them only on the pages that need them (e.g. `<script src="reader-bundle.js" defer></script>` on reader.html). Keep core (verse fetch, notes, auth, prayer wall) in the main script.

## How to run

1. Open Chrome DevTools → Lighthouse.
2. Select Performance, Accessibility, Best Practices, SEO (and optionally PWA).
3. Run against a production or local build; use **Mobile** first for `/` and `reader.html` (realistic for this site).
4. Address reported issues and re-run to confirm.

**Quick pass (when you have ~10 minutes):** Fix only meaningful regressions — LCP if poor on 3G throttle, render-blocking CSS/JS, largest unused bundle hints. Ignore vanity scores if the app feels fine on a mid-range phone. See `docs/SITE-OPS-RUNBOOK.md` §4.

No automated Lighthouse CI is configured; this doc is a manual checklist and log of changes made.

### Scripts (optional)

- `npm run audit:lighthouse` — remote run against production (requires Chrome path on macOS in `package.json`).
- `npm run audit:lighthouse:local` — local server via `scripts/lighthouse-local.mjs` when present.
- For CI-style gates, `scripts/assert-lighthouse.mjs` / `scripts/lighthouse-ci.mjs` can wrap Lighthouse with thresholds (run in your environment when Chrome is available).

**Note:** Homepage and other heavy pages may report “unused JavaScript” for `script.js` because one bundle serves many routes; splitting non-core bundles (reader, admin) is a longer-term optimization—see “Unused JavaScript” above.

### Snapshot log (automated mobile, production)

Run: `npm run audit:lighthouse:live` (writes `lighthouse-home.json` / `lighthouse-reader.json`, gitignored).

| Date | Page | Perf score | LCP (approx) | Notes |
|------|------|------------|--------------|--------|
| 2026-03-20 | `/` | ~69 | ~4.9s | Baseline before font + reader tweaks |
| 2026-03-20 | `reader.html` | ~45 | very high | Dominated by late content paint + CLS; meta images pointed at remote Unsplash before fix |

**Shipped mitigations (2026-03-20):** Combined Google Fonts on index into one non-blocking stylesheet (`preload` + `onload` → `stylesheet`); `reader.html` og/twitter image → site logo; `#reader-output` min-height for CLS; reader `script.js` cache bump + `fetchpriority="low"` on module.
