# Hardening summary (Fort Knox pass)

Changes made to make the site robust and secure against common failures and XSS.

---

## 1. Safe storage helpers (script.js)

- **safeSetItem(key, value)** — `localStorage.setItem` in try/catch; no-op if key invalid or storage throws (e.g. private mode, quota).
- **safeGetItem(key)** — `localStorage.getItem` in try/catch; returns `null` on error.
- **safeSessionSet(key, value)** / **safeSessionGet(key)** — same for `sessionStorage`.

Used in: message display name, message name map, amen counts, offline banner session flag, and other critical paths so one storage failure doesn’t break the app.

---

## 2. Offline banner and init

- Removed top-level `document.getElementById('offline-banner')?.classList.add('hidden')` that ran before DOM was ready.
- At the start of **DOMContentLoaded**, if the element exists and `navigator.onLine !== false`, the banner is hidden. Online/offline listeners unchanged.

---

## 3. XSS / innerHTML safety

- **Daily battle “Next steps” links:** `readerUrl` and `searchUrl` are escaped for HTML attributes (`"` → `&quot;`, `<` / `>` escaped). Visible text `topicOfDay` uses `escapeHtml()`.
- **Topic and reflection question:** `getTopicOfDay()` and `getBattleQuestionOfDay()` output is passed through `escapeHtml()` before being put in innerHTML.
- **Admin panel:** Health, overview, and stats blocks now use `escapeHtml()` for label and value (including `currentUserEmail`) so admin UI is safe if data is ever compromised or malformed.

---

## 4. localStorage / sessionStorage

- **saveMessagesLocal** — wrapped in try/catch; only writes when `items` is a non-null array.
- **savePrayerList** — same; sync still called via `setSyncData` when available.
- **saveMessageNameMap** / **saveMessageDisplayName** — use `safeSetItem` or try/catch.
- **loadMessageDisplayName** / **loadMessageNameMap** — use `safeGetItem` or try/catch.
- **saveAmenCounts** — uses `safeSetItem` in try/catch; only writes when `map` is a non-null object.
- **wireOfflineBanner** — uses `safeSessionGet` / `safeSessionSet` for the offline-view-sent flag.

Other existing try/catch around storage (e.g. streak, badges, armor) left as-is.

---

## 5. Service worker (service-worker.js)

- **install:** `cache.addAll(CORE_ASSETS)` is followed by `.catch(() => {})` so a single failed asset (e.g. 404) doesn’t leave the SW in a broken state.
- **activate:** Same for `caches.keys()` / `caches.delete()` chain.
- **fetch:**  
  - KJV and daily_battles: `cache.put` is followed by `.catch(() => {})` so failed cache write doesn’t break the response.  
  - Top-level `respondWith` chain ends with `.catch(() => fetch(event.request))` so cache match or network errors still result in a network fallback.  
  - Same pattern for audio and the final network-first fallback.

---

## 6. What was not changed

- **CSP / _headers:** Security headers in `_headers` remain commented; CSP and black-screen issues are handled via Cloudflare (see `CLOUDFLARE-CSP-FIX.md`). Uncommenting _headers could be done later if deploy pipeline applies them.
- **escapeHtml** is already used for verse refs, verse text, template titles, church names, etc. No change to existing usage.
- **textContent** is used for user/API content where no HTML is needed (e.g. reflection, prayer, message text in admin); that remains safe.

---

## 7. Manual checks

- Load site with **localStorage disabled** or **private mode** — no uncaught errors; graceful degradation.
- **Offline** — banner shows when going offline; hides again when online; first hide happens after DOM is ready.
- **Daily battle** — “Next steps” links and topic/question text render correctly and don’t inject script when topic/question strings contain `<` or `"`.
- **Service worker** — force-update SW; if one asset fails to cache, install still completes; fetch still returns network response when cache fails.
