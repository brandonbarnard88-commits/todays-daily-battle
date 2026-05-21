# Porch Visual Audit — May 2026

Three pages reviewed for the 90-day polish pass. Each lists what already rests well, what added subtle strain, and the tweak shipped in this pass.

---

## Homepage (`index.html` → `#hero-verse-wrap`)

**Already restful**

- Porch card surface on today’s verse; dawn wash is gentle.
- “More from the Word” stays in `<details>`—no wall of breakdown by default.
- Font preload for Cormorant; verse body has A− / A+ controls.

**Subtle strain**

- Verse body line-height felt slightly tight on small phones after external CSS split.
- Toolbar row dense above the fast-feel grid.
- No quiet way to sense “did this help?” without analytics pressure.

**Tweaks shipped**

- Verse body: `line-height: 1.62`, slight letter-spacing (`tdb-visual-tokens.css`).
- Inner verse shell padding softened; breath divider clarified.
- Local-only restfulness note (`tdb-porch-restfulness.js`)—one question, device-only, dismisses for 14 days.

---

## Battle Plans (`plans.html` → `.plans-hero`)

**Already restful**

- Soar-dawn hero band matches home/explore language.
- Plans stay text-forward; categories are scannable.

**Subtle strain**

- Subtitle line length stretched wide on desktop—harder to read in one calm glance.

**Tweaks shipped**

- Subtitle `max-width: 36rem`, centered, `line-height: 1.55`.
- Slightly more space under hero before plan grid.

---

## Kids Corner landing (`kids/index.html`)

**Already restful**

- “You’re already welcome here” porch line sets tone.
- Little Shepherd bubble is warm without sermon chrome.

**Subtle strain**

- Welcome line floated without a visual “porch mat”—easy to miss on busy sky background.

**Tweaks shipped**

- `.kids-site-porch` gentle band: soft border, rounded pad, readable on sky (`kids/kids-kids-world.css`).

---

## Verse image generator (`verse-image.html`)

**Already restful**

- Free starter cards; UOG prompt library is copy-only, no hype.

**Subtle strain**

- Builders hunting “porch calm” presets had to dig through long UOG list.

**Tweaks shipped**

- New **Porch polish presets** section (five direction prompts + two extra free starter cards).

---

## Performance notes (same pass)

- Home shell externalized (~107 KB Brotli total): HTML + CSS + deferred feel JS.
- Live mobile TBT ~10 ms (May 2026); LCP still font/CSS path—next small wins only when ready.

**Next optional lane:** critical font subset trim, not new features.
