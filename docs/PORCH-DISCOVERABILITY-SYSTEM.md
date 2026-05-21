# Porch Discoverability System — Reference

Map for builders: pattern, tokens, files, and quality gates. Pairs with the visual system ([PORCH-VISUAL-SYSTEM.md](./PORCH-VISUAL-SYSTEM.md)).

---

## Principles & audit

- [PORCH-DISCOVERABILITY-PRINCIPLES.md](./PORCH-DISCOVERABILITY-PRINCIPLES.md) — decision filter  
- [PORCH-DISCOVERABILITY-AUDIT-2026-05.md](./PORCH-DISCOVERABILITY-AUDIT-2026-05.md) — seven moments + Pass 2 order  

---

## Reusable path card (`.tdb-porch-path-card`)

One honest next door. Primary link visible; extras in `<details>` only.

### HTML pattern

```html
<div class="tdb-porch-path-card" role="region" aria-labelledby="examplePathHeading">
  <p class="tdb-porch-path-card__eyebrow" id="examplePathHeading">If today feels like this&hellip;</p>
  <p class="tdb-porch-path-card__invitation">Little ones at the table and the day already feels long?</p>
  <a class="tdb-porch-path-card__primary" href="kids/index.html">Gentle read-alouds and coloring for the hearts in your home &rarr;</a>
  <details class="tdb-porch-path-card__secondary">
    <summary>Other quiet doors</summary>
    <p class="section-note util-mb-0">
      <a href="plans.html?plan=parentweary">When parenting feels exhausting</a>
      &middot;
      <a href="family-armor-little-ones.html">Family Armor for little ones</a>
    </p>
  </details>
</div>
```

### CSS home

| Class | Role |
|-------|------|
| `.tdb-porch-path-card` | Soft porch surface, breathing room |
| `.tdb-porch-path-card__eyebrow` | Muted eyebrow (feeling context) |
| `.tdb-porch-path-card__invitation` | One honest sentence |
| `.tdb-porch-path-card__primary` | 44px+ tap target, primary door |
| `.tdb-porch-path-card__secondary` | Optional `<details>` — never required |

Styles live in `tdb-visual-tokens.css` (shared across Home, Plans, Explore).

---

## Existing porch paths (do not duplicate)

| Surface | ID / class | Notes |
|---------|------------|--------|
| Home porch signs | `#tdb-home-doorways`, `.tdb-porch-sign-quick-chip` | Feeling-first chips |
| Companion doors | `#tdb-home-companion-doors` | Four quiet doorways |
| Explore start | `#start-here`, `#explore-hub` | Map + tiles |
| Print porch map | `porch-map-one-page-print.html` | Offline fridge copy |
| Gentle next steps | `#tdbGentleNextSteps` | Post-search hint |

New path cards **bridge** these — they do not replace them.

---

## Quality gates

| Check | Command |
|-------|---------|
| Markers (when IDs added) | `npm run test && npm run test:site` |
| Mobile two-tap | Manual: Home → plan or Kids in ≤2 taps |
| Tone | Feeling-first; no “complete” or “discover all tools” |

---

## Changelog surface

Public: [updates.html](../updates.html) — “Discoverability (June 2026)” when Pass 3 ships.
