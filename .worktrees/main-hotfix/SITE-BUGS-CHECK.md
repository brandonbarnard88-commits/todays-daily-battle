# Site-wide bug check (code audit)

Quick audit across HTML, JS, CSS, and build. No browser automation was run.

---

## Build & deploy

- **`npm run build`** — Completes successfully; copies all root HTML, topic-*.html, script.js, styles.css, config.js, vendor, etc. to `dist/`.
- **kjv.json** — Listed in `build-copy-static.js` but **not present** in repo root. If missing, the build now logs a warning. Verse search and daily verse load Bible from `kjv.json` (or fallback `https://todaysdailybattle.com/kjv.json`). Ensure `kjv.json` is in root before build, or that production serves it from origin.
- **Topic pages** — All 7 topic-*.html files are force-copied to dist; no 503 from missing topic pages.

---

## Links & anchors

- **Internal links** — Checked from sample pages; `.html` links point to existing files (verse.html, pricing.html, message.html, study.html, etc.).
- **Anchors** — `#main-content`, `#main-search`, `#newsletter`, `#daily-battle-section` exist on index.html. `index.html#newsletter` and `/#main-search` are valid.
- **Footer / pricing** — `index.html#newsletter` and `pricing.html` → `index.html#newsletter` are correct.

---

## Script & DOM

- **Duplicate IDs** — None found on index.html.
- **script.js on other pages** — Loaded on pricing and others; search/quick-search wiring runs only when `#search-btn`, `#query`, `#quick-actions-hero` exist (index only). Other pages only get global helpers; no throw from missing elements.
- **handleSearchFilterChange** — Defined before use; wired in early `wireSearchAndQuickTopics` with null checks for testamentFilter/bookFilter.
- **contact-form.js** — Guards with `if (!form) return` and null-safe reads for name/email/msg.
- **search-widget.js** — Uses getElementById with guards; redirects to index with `?q=` when not on index.

---

## Linting & syntax

- **script.js, index.html, pricing.html** — No linter errors reported.

---

## Optional checks for production

1. **Bible data** — Confirm `kjv.json` is in repo or served at `https://todaysdailybattle.com/kjv.json` so verse search and daily verse work.
2. **Config** — Production build may skip writing config.js if SUPABASE_URL/SUPABASE_ANON_KEY are not set; ensure CI or deploy injects config or that config.js is committed for production.
3. **Stripe** — Pricing buttons call `TDB_GO_TO_CHECKOUT` or open payment links; ensure STRIPE_* links are set in config when going live.
4. **Manual test** — After deploy: home → search bar + quick topics → verse loads; pricing → Battle Pro CTA; contact → submit opens mailto.

---

*Last run: build + grep/lint audit. Re-run after large changes.*
