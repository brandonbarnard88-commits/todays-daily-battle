# Porch Visual Principles

**Purpose:** Every visual decision on Today's Daily Battle should help tired eyes rest on Scripture—not compete with it.

These principles protect the four foundations ([NORTH-STAR-PRINCIPLES.md](./NORTH-STAR-PRINCIPLES.md)). They do not add features; they remove visual strain.

---

## 1. Scripture first

- KJV text is the hero. Decoration, color, and motion never outrank the verse.
- One primary focal block per screen (usually today’s verse or the page’s one honest heading).
- Breakdown copy uses plain language; headings stay short and calm.

## 2. Breathing room

- Generous vertical rhythm between sections (`--tdb-porch-gap-stack`, `--tdb-porch-space-*` in `tdb-visual-tokens.css`).
- Line length stays readable on phones (~40–46rem max for long prose).
- Cards use soft porch surfaces—not sharp boxes or loud borders.

## 3. Soft edges, quiet depth

- Rounded porch cards (`--tdb-porch-card-radius`), subtle shadow, thin gold-tinted border.
- No bounce animations, confetti-as-default, or “engagement” motion on spiritual content.
- Dawn wash on the home hero is **once per session**, low opacity—invitation, not spectacle.

## 4. Typography like a well-loved page

- Display headings: Cormorant Garamond (preloaded on home).
- Body: system stack with comfortable line-height (1.55+ for notes, 1.62+ for verse body).
- Font-size controls on verse blocks stay reachable (44px+ tap targets).

## 5. Contrast without harshness

- Dark mode: soft blues/grays, gold accents sparingly.
- Light/parchment: warm off-white, readable muted copy (`--tdb-section-note-color`).
- Focus rings stay visible (`--tdb-focus-ring`); never hide keyboard paths.

## 6. Nothing demands attention

- Below-fold sections may collapse behind `<details>`; core tools stay discoverable via Explore and porch map.
- No streaks, scores, or red badges on spiritual progress.
- Optional widgets (restfulness note, newsletter) invite—they do not guilt.

## 7. Kids Corner exception (bounded)

- Playful sky, mascot, and gold accents are allowed **only** in Kids paths.
- KJV reference stays tiny and honest; fun first, no sermon pressure.

## 8. Measure success by rest, not dazzle

Ask: *Can someone take a slow breath here?*  
Not: *Does this look like a trending app?*

---

**Implementation home:** `tdb-visual-tokens.css` (shared tokens + porch polish pass), `tdb-home-page.css` (home layout), `styles.css` (inner pages).

**Related:** [PORCH-DISCOVERABILITY-PRINCIPLES.md](./PORCH-DISCOVERABILITY-PRINCIPLES.md) · [visual-north-star.html](../visual-north-star.html) · [PORCH-VISUAL-AUDIT-2026-05.md](./PORCH-VISUAL-AUDIT-2026-05.md) · [PORCH-VISUAL-SYSTEM.md](./PORCH-VISUAL-SYSTEM.md)
