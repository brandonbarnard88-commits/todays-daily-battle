# Test results — full run

**Date:** 2026-02-26  
**Server:** `python3 -m http.server 8765` (local)  
**Commands run:** `node test-site.js`, `python3 test-site.py`, extended route checks

---

## Automated tests (all passed)

### 1. `node test-site.js` (extended)

- **Pages (16):** Home, Terms, Pricing, Privacy, Study, Verse of the Day, Church, Sermon, Reading plan, FAQ, Contact, **Message / Prayer Wall**, **Wins Report**, **About**, **Topic Anxiety**, **Manifest (PWA)**.
- Each page: HTTP 200 and required content present (IDs, titles, key text).
- **Search logic:** selfless→love synonym, singleWord handling, fallback verses (hope) in `script.js`.
- **Prayer counter:** `id="prayer-counter"`, “Total prayers”, `wireRealPrayerCounter`, `formatCount`/`toLocaleString`, `__fetchPrayerCount`.

**Result:** All checks passed.

### 2. `python3 test-site.py`

- Same 11 core pages + search logic check.
**Result:** All checks passed.

### 3. Extra route checks (Node `http.get`)

- `/`, `/message.html`, `/wins-report.html`, `/about.html`, `/manifest.json`, `/topic-anxiety.html` → all **200**.

### 4. Script and references

- `script.js` loads without parse error.
- Critical IDs referenced: `daily-battle-card`, `query`, `search-btn`, `offline-banner`, `auth-section`, `sidebar-toggle`.

---

## Manual testing (recommended)

Browser MCP was not available in this session. For full coverage, run manually:

1. **Start server:** `python3 -m http.server 8765`
2. **Open:** http://localhost:8765/
3. **Use:** `TEST-CHECKLIST.md` and `docs/SMOKE-TEST-CHECKLIST.md` for search, auth, tools, nav, mobile.

Quick manual checks:

- Search: empty, “selfless”, “John 3:16”, “xyzzz” (fallback).
- Nav: sidebar (Menu), main links, Terms/Privacy in footer.
- Daily battle card loads (or fallback verse).
- Dark mode toggle.

---

## Summary

| Suite              | Status  | Notes                                      |
|--------------------|---------|--------------------------------------------|
| test-site.js       | Pass    | 16 pages + search + prayer counter         |
| test-site.py       | Pass    | 11 pages + search logic                    |
| Extra routes       | Pass    | 6 routes → 200                             |
| script.js / refs   | Pass    | No parse error; critical IDs present       |
| Browser (automated)| Skipped | MCP not available; use manual checklist   |

**Overall:** All automated tests passed. Run manual tests in a real browser for search, auth, and interactions.
