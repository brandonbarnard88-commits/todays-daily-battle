# Porch Visual System — Reference

Single map for builders: tokens, files, checks, and how we measure polish.

---

## Token source

| File | Role |
|------|------|
| `tdb-visual-tokens.css` | Spacing, heading rhythm, porch card surfaces, **polish pass overrides** |
| `tdb-home-page.css` | Home-only layout (large; not loaded on inner pages) |
| `styles.css` | Inner pages; `@import` visual tokens |
| `tdb-quiet-luxury.css` / `tdb-calm-hubs.css` | Hub-specific calm surfaces |

Key CSS variables: `--tdb-porch-space-*`, `--tdb-porch-card-*`, `--tdb-heading-*`, `--tdb-section-note-color`.

---

## Principles & audit

- [PORCH-VISUAL-PRINCIPLES.md](./PORCH-VISUAL-PRINCIPLES.md) — decision filter  
- [PORCH-VISUAL-AUDIT-2026-05.md](./PORCH-VISUAL-AUDIT-2026-05.md) — page notes + shipped tweaks  
- [PERF-SHIP-NOTE-2026-05.md](./PERF-SHIP-NOTE-2026-05.md) — load-size + Lighthouse context  

---

## UI components (visual)

| Surface | Class / ID | Notes |
|---------|------------|--------|
| Daily verse card | `#hero-verse-wrap`, `.tdb-micro-hero-dawn` | Primary LCP element |
| Porch cards | `.tdb-porch-card`, `.tdb-porch-paper-glass` | Explore, signposts |
| Section rhythm | `.section-divider`, `.section-note` | Eyebrow + muted copy |
| Kids welcome | `.kids-site-porch` | Playful band, not adult chrome |
| Restfulness (local) | `#tdbPorchRestfulness` | Optional; no server |

---

## Verse images

- **Free starters:** `verse-image.html#verse-image-free-starters`  
- **Porch polish prompts:** `verse-image.html#verse-image-porch-polish-presets`  
- **UOG library:** `verse-image.html#verse-image-uog-prompts`  

Tone: reverent, empty room, no legible text in generated backgrounds.

---

## Restfulness signal (device-only)

- Script: `tdb-porch-restfulness.js`  
- Storage: `localStorage` key `tdb_porch_restfulness_v1`  
- No analytics event; optional aggregate only if Brandon reads local counts manually  
- Dismiss 14 days after any answer  

Question: *“Did this feel like a slow breath?”*

---

## Quality gates (visual-adjacent)

| Check | Command |
|-------|---------|
| Full site markers | `npm run test && npm run test:site` |
| CSS preload pairs | part of `test:site` → `verify-performance.mjs` |
| Dist HTML sanity | all ~388 pages |
| Live smoke | `npm run qa:smoke` |
| Lighthouse baseline | `docs/perf-lighthouse-baseline.json` |

---

## Changelog surface

Public: [updates.html](../updates.html) — “Porch polish (May 2026)” under May section.

---

## When adding a new page

1. Match `tdb-visual-tokens.css` spacing and `.section-note` color.  
2. One hero focal point; collapse secondary blocks in `<details>` when long.  
3. Preload + link pattern for any new local CSS.  
4. Run `npm run test:site` before ship.
