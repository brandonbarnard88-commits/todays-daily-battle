# Fine-tooth-comb audit report

**Date:** March 2026  
**Scope:** All tools, pages, security, and critical paths.

---

## 1. Page & script inventory

| Area | Status |
|------|--------|
| **38 HTML pages** | All accounted for; no orphan pages. |
| **script.js** | Loaded on 35 pages (exceptions: wins-report, 404, message.html inline-only where applicable). |
| **config.js** | Loaded where script.js is used; config.example.js has no secrets. |
| **wins-report.html** | Intentionally standalone (config only, inline script for Wins Report UI). |
| **404.html** | Static + small inline redirect for topic paths; no script.js needed. |

---

## 2. Null safety & getElementById

| Check | Result |
|-------|--------|
| **script.js** | Only 2 places use `getElementById(...).value` without storing element: both guard with `document.getElementById('email') && document.getElementById('email').value` before use. |
| **bible-tool.html** | `doLookup()` now guards `#book`, `#chapter`, `#verse` before reading `.value`. |
| **wins-report.html** | `statsEl.innerHTML` only set when `statsEl` exists; `lastKey` escaped before insertion (XSS defense). |
| **addEventListener** | All critical handlers either run only when element exists or are inside DOMContentLoaded after DOM is ready. |

---

## 3. Security (SECURITY.md & PRIVACY-ANALYTICS.md)

| Check | Result |
|-------|--------|
| **Secrets in client** | No `service_role`, Stripe secret, or Turnstile secret in script.js or config.js. Only in docs and Edge Functions. |
| **config.example.js** | Placeholders only; no real keys. |
| **Sanitization** | `sanitizeUserInput()` and `truncateForDb()` used for prayer intents, family name, message board, newsletter email, display name. |
| **escapeHtml** | Used widely (114+ references) for dynamic content in script.js. |
| **Search analytics** | Only `trackSearchAnalytics()` used for search events; no `trackEvent('quick_search'|'search_query')` with raw query. Allowlist enforced. |
| **CSP** | Present in index.html; DOMPurify loaded. |
| **_headers** | X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Strict-Transport-Security present. |
| **security.txt** | .well-known/security.txt has Contact and Expires. |

**test-security.js:** Run `node test-security.js` — all defense and offense checks pass. Current warnings: 0.

---

## 4. Tools & dropdowns

| Tool / page | Fixes applied (this audit or earlier) |
|-------------|----------------------------------------|
| **Bible Tool** | Book select: `ensureBookSelectPopulated()` + DOMContentLoaded retry; "Select book" placeholder; `doLookup()` null guards. |
| **Study Tools** | `renderCollectionSelect()` and `updateNoteSelect(null)` in catch block and after try/catch; `ensureStudyRenders()` repopulates collection, note-verse, and curriculum-week. |
| **Chapter Reader** | `populateReaderBooks()` fallback to `Object.keys(READER_CHAPTER_COUNTS)` when `getBibleBookOrder()` empty; `ensureReaderPickers()` at 0 ms, 400 ms, 1500 ms with first-book fallback. |
| **Bible Study** | No selects; cards from loadStudies() or inline fallback. |
| **Coloring** | `populateColoringStories()` on DOMContentLoaded; story-select only on coloring.html. |

---

## 5. Forms & links

| Check | Result |
|-------|--------|
| **Form submit** | Main form handlers use `event.preventDefault()` (e.g. search, auth, sermon). |
| **Internal links** | All `.html` hrefs point to existing pages (verse, study, reader, church, pricing, etc.). |
| **404 redirect** | Paths like `/hope` redirect to `topic-hope.html`. |

---

## 6. Wins Report (wins-report.html)

| Change | Description |
|--------|-------------|
| **XSS** | `lastKey` from localStorage is escaped (`, <, >, ") before being used in `innerHTML`. |
| **Null safety** | `statsEl.innerHTML = html` only when `statsEl` is truthy. |

This addresses the test-security.js warning: "wins-report.html: innerHTML from localStorage (lastKey) — consider escaping".

---

## 7. Tests run

| Test | Command | Result |
|------|---------|--------|
| **Security** | `node test-security.js` | Pass (exit 0). Warnings: 0. |
| **Site (optional)** | `node test-site.js` | Requires server at http://127.0.0.1:8765; run manually if desired. |

---

## 8. Recommendations

1. **Deploy** — Ensure production uses real config (no `your-project-ref` / `your-anon-key`) and that config.js is not committed with secrets (it’s in .gitignore).
2. **Manual pass** — Test auth flows (sign up, login, logout, reset), one Bible Tool lookup, Study Tools collection/note select, and Reader book/chapter on a slow or failing network to confirm fallbacks.
3. **innerHTML** — Keep any new dynamic HTML using user/API data behind `escapeHtml()` or `sanitizeHtml()`. Re-run `node test-security.js` after changes.

---

## 9. V2 enforcement baseline

- `V2-QUALITY-BASELINE.md` is the mandatory release gate for all work (legacy + new).
- If a flow is below bar, it must be improved in the same pass rather than justified.

---

*Audit complete. All tools, security baseline, and critical paths reviewed.*
