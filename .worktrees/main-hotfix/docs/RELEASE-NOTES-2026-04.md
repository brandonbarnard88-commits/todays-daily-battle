# Release notes — April 2026 (v2026.04-complete and follow-ups)

This document captures **navigation patterns**, **performance choices**, and **ops checklists** so future changes stay safe and on-mission.

## Deploy and smoke (production)

1. **Merge to `main`** when CI and local gates pass: `npm run test`, `npm run test:site`, `npm run test:security`, `npm run build`.
2. **Vercel:** push `main` (or open the Vercel dashboard → Deploy). CLI (if linked): `npx vercel --prod` from the repo root.
3. **Smoke checklist (5–10 minutes):**
   - **Home:** hero verse, Feel search, quick topics, no duplicate `#output` / feel wiring regressions.
   - **Bible Tool:** hub nav, **Look up** a verse, confirm **Verse image** link includes `?ref=...&source=bible-tool` after a successful lookup.
   - **Verse of the Day:** **Verse image** button href updates with today’s reference (`?ref=...&source=votd`); listen/share still work.
   - **Offline (phone):** airplane mode, open cached pages; offline strip and core reading still usable where designed.
   - **Print (desktop):** Verse of the Day print sheet; optional **Verse image → Print / Save as PDF** (browser print to PDF).

## Performance notes

- **Home (Phase 6):** Deferred scripts are loaded on idle and user intent. Some leaves run **in parallel** where there is no dependency; **VOTM** still runs **after** `memory-verses.js` (global used for listen). See the dependency comment above `tdbScheduleDeferredVodAndReaderTooling` in `script.js`.
- **Reader / Verse / Verse image fonts:** Cormorant Garamond is **self-hosted** in `cormorant-latin-subset.css` (Latin + Latin-ext, `font-display: swap`, `unicode-range`). Google Fonts is used for **Playfair + Inter** only, reducing gstatic work versus loading Cormorant from the CDN.
- **Lighthouse (local multi-page):** `npm run audit:lighthouse:local:pages` (or `node scripts/lighthouse-local-pages.mjs`).

## Verse image v2 (incremental)

- **URL parameters:** `?ref=...` or `?verse=...` prefills the reference; `&autoload=1` loads KJV text (when online) and runs **Update preview** when possible. `?vi_v2=1` enables gentler KJV line wrapping on canvas.
- **Deep links:** `verse.html` and **Bible Tool** (after lookup) point to `verse-image.html` with the current reference.

## Build hygiene — do not clobber by hand

- **Do not hand-edit `dist/verse.html` (or other `dist/*`)** as the source of truth. Edits belong in the root HTML; run `npm run build` so `dist/` stays aligned with `build-copy-static.js`, `sync-js-assets`, and verifiers.
- If you add a new root **CSS/JS** asset, add it to `build-copy-static.js` (or the appropriate build step) so it lands in `dist/`.

## Optional backlog (not blocking ship)

- Prayer Wall refinements (after story freeze).
- Language hubs where analytics show demand.
- Family multi-verse print packs, deeper offline print caching.

When in doubt, **ship stable `main`**, run the smoke list, and let real use guide the next small pass.
