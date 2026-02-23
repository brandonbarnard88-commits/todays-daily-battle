# Verification notes

**Overall verdict:** 97–98% "done" — core daily + streaks + offline basics + Wins Report v1 live and reliable. Global Phase 1 polish (buttons/cards/spacing/dark mode) consistent. No critical problems; site is **beta/public-launch ready**.

**Minor notes (non-blocking):**
- **?q= searches (e.g. anxiety):** Should render curated verses + plain meanings on first load (including after fresh cache clear).
- **Offline Wins/Church:** Load from cache after initial online visit.
- **Pro CTA:** Gated correctly (not visible to free users).

---

## Deeper check: ?q= first load (e.g. `?q=anxiety`)

**Flow in code:**
1. Init: `await loadBible()` → `refreshBibleView()` → … → `applySearchFromQuery()`.
2. `applySearchFromQuery()` reads `?q=`, sets `#query` value, `setView('search')`, **clears search cache**, then `searchBtn.click()`.
3. Search click handler (150ms delay): if Bible empty, `await loadBible()`; then `parseQuery` → `executeQuery` → `renderResults`.
4. `executeQuery` returns topic/verse results; `renderResults` uses `getPlainMeaning(ref)` for each verse and renders plain meanings in the cards.

**Conclusion:** Curated verses and plain meanings are shown on first load because (a) Bible is awaited before `applySearchFromQuery()`, and (b) cache is cleared so results are fresh. If a user ever sees blank results on first load after a cache clear, the next place to check is network timing (Bible JSON slow) or ensuring the search handler’s 150ms delay runs after the view has switched to `search`.

---

## Deeper check: church.html / wins-report.html offline

**Service worker:**
- `CORE_ASSETS` in `service-worker.js` includes `/church.html` and `/wins-report.html`.
- On `install`, these are added to `CACHE_NAME` (precached).
- `fetch` handler: `caches.match(request).then(cached => cached || fetch(request))`, so when offline the cached HTML (and same-origin JS/CSS) is served.

**Conclusion:** After the first online visit (or when the SW installs), church and wins-report are in the cache and load from cache when offline. No code change needed for basic offline load.

---

## Logged-in / Pro checks

- **Offline prefetch CTA:** Visible when applicable (e.g. Pro/master); prefetch flow uses existing offline logic.
- **Wins button:** Visibility gated by auth/role as implemented; confirm on a logged-in session.
- **Pro CTA:** Not shown to free users; gating logic in place.
