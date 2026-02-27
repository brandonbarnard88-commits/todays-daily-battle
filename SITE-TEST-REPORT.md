# Site Test Report — Fine-Tooth Comb

**Date:** February 27, 2026  
**Scope:** Full static site + critical JS/CSS/assets + code audit.

---

## 1. Automated page & asset tests

**Command:** `node scripts/test-site.js`

| Category | Count | Result |
|----------|--------|--------|
| HTML pages | 36 | All 200 |
| Critical assets | 9 | All 200 |

**Pages verified:** `/`, index, verse, study, message, church, coloring, kids-corner, reading-plan, reader, about, faq, pricing, privacy, terms, contact, shop, sermon, pastor-toolkit, team-toolkit, resources, wins-report, admin, reset, 404, 404-admin, stats, kids-activities-print, kids-coloring-pack, topic-* (anxiety, fear, hope, grief, strength, forgiveness, parenting).

**Assets verified:** script.js, config.js, styles.css, manifest.json, icon.svg, world-map-source.svg, inline-bootstrap.js, daily-verse-widget.js, voice-pray.js.

---

## 2. Code audit summary

### 2.1 DOM & IDs

- **script.js** uses 100+ `getElementById` / `querySelector` calls. All critical targets exist in index.html or are created dynamically (e.g. `auth-status`, `auth-resend-wrap`, `auth-forgot-in-error`, `master-badge` are created by auth init when missing).
- **armor-builder-modal:** Script references `#armor-builder-modal`; index has `#family-armor-stories-modal`. Code only runs `renderArmorModal()` when the element exists (`if (modal && ...)`), so this is optional/legacy — no runtime error.
- **verse.html** has `#daily-verse-card` and `#pray-this-with-me-verse`; **reset.html** has `#auth-status`, `#reset-status`. All used by script on those pages.

### 2.2 Search & privacy (PRIVACY-ANALYTICS.md)

- **trackSearchAnalytics(eventName, params)** is the single entry point for search analytics.
- Allowed events: `quick_search`, `search_query` only.
- Allowed params: `topic`, `search_type` (raw query and user identifiers are stripped).
- Call sites: quick topic buttons use `trackSearchAnalytics('quick_search', { topic })`; search flow uses `trackSearchAnalytics('search_query', params)` with safe params only. **Compliant.**

### 2.3 Error handling

- **script.js** has 125+ try/catch or .catch usages; offline banner, Supabase fetch, and auth flows handle errors.
- **exportMessagesCsv** / **exportReportsCsv** use `supabaseClient` correctly and fall back to local data when needed.

### 2.4 Config & CSP

- **config.js** exposes `TDB_CONFIG` (Supabase URL/anon key, Stripe placeholders, Turnstile key). Anon key is public by design; RLS protects data.
- **CSP** in index.html includes `'nonce-tdb2025'` for script/style; inline blocks and key pages use `nonce="tdb2025"` consistently.
- External script/style sources (gstatic, jsdelivr, Cloudflare, Supabase, etc.) are listed in CSP.

### 2.5 Links & anchors

- **index.html** internal links point to existing pages (verse, message, church, pricing, study, sermon, reading-plan, about, faq, privacy, terms, contact, shop). Anchor `#main-content`, `#main-search`, `#newsletter`, `#invite-section`, `#daily-battle-section`, `#prayer-wall` exist on index.

---

## 3. Manual testing checklist (recommended)

Use **TEST-CHECKLIST.md** and **docs/MANUAL-TESTING-CHECKLIST.md** for browser verification. Priority:

1. **Home & nav** — Skip link, header nav, sidebar (mobile), footer links.
2. **Search** — Empty search message; topic "hope"/"anxiety"; reference "John 3:16"; quick topics.
3. **Auth** — Sign up, log in, log out, forgot password (Supabase configured).
4. **Daily battle** — Today’s verse loads; streak block; quick pray; share buttons.
5. **Pricing** — Plans visible; Stripe links (if configured) or “add link” message.
6. **Key pages** — Privacy, Terms, Contact, Verse of the Day, Message Board, Church Center, Kids Corner.
7. **Mobile** — Viewport ~375px; no horizontal scroll; touch targets; sidebar.

For a quick visual pass: **docs/SMOKE-TEST-CHECKLIST.md** (index, church, wins-report, pricing; light/dark; desktop + mobile).

---

## 4. Optional improvements

- **Sitemap:** Consider adding `wins-report.html` and `kids-corner.html` to sitemap.xml if you want them indexed (currently 28 URLs; site has 36+ HTML pages).
- **Python content test:** `test-site.py` expects a server on port 8765 and checks for critical strings (e.g. `id="query"`, “Today's Daily Battle”, “Terms of Service”). Run with: `python3 -m http.server 8765` in one terminal, then `python3 test-site.py` in another — or use a different port and set `BASE` in the script.
- **armor-builder-modal:** If any page is supposed to show a dedicated “Armor Builder” modal, ensure that page has an element with `id="armor-builder-modal"`; otherwise the current optional check is fine.

---

## 5. Summary

| Area | Status |
|------|--------|
| All HTML pages load (200) | Pass |
| Critical JS/CSS/assets load (200) | Pass |
| DOM IDs vs script (index + key pages) | Pass |
| Search analytics (trackSearchAnalytics only, allowlist) | Pass |
| Auth UI elements (dynamic creation) | Pass |
| Config & CSP (nonce, sources) | Pass |
| Internal links & anchors | Pass |
| Error handling (try/catch, fallbacks) | Pass |

**Verdict:** Site passes a fine-tooth-comb automated and code audit. Run manual checks (TEST-CHECKLIST.md + MANUAL-TESTING-CHECKLIST.md) in a real browser and on a real device before release.
