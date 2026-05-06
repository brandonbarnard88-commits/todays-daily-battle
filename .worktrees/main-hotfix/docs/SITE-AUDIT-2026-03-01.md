# Full Site Audit — March 1, 2026

**Scope:** Security, code quality, build, UX, and critical paths across the entire site.

---

## Executive summary

The site has **strong security foundations** (RLS, sanitization, CSP, Turnstile, JWT checkout) and a well-documented security posture. One **critical bug** was found and fixed. Several minor improvements are recommended.

| Area | Status |
|------|--------|
| **Security** | ✅ Strong — RLS, sanitization, CSP, Turnstile, price allowlist |
| **Privacy** | ✅ `trackSearchAnalytics()` enforced; no query/user identity sent |
| **Build** | ✅ Passes; topic pages, quick-search, core tools verified |
| **Tests** | ✅ `test-security.js` and `test-site.js` pass |
| **Bug fixed** | ✅ `getQueryInput()` infinite recursion on pages without `#tdb-search` |

---

## 1. Security

### 1.1 Defense (verified)

| Check | Result |
|-------|--------|
| **Secrets** | No `service_role`, Stripe secret, or Turnstile secret in client. `config.js` in `.gitignore`. |
| **Sanitization** | `sanitizeUserInput()`, `truncateForDb()`, `escapeHtml()` used for prayer intents, family name, message board, newsletter, display name. |
| **Search analytics** | Only `trackSearchAnalytics()` for search events; allowlist strips `query`, `user_id`, etc. |
| **CSP** | Present in `index.html`; nonces for inline scripts; DOMPurify loaded. |
| **Headers** | `_headers` has X-Frame-Options, X-Content-Type-Options, HSTS, Referrer-Policy, Permissions-Policy. |
| **security.txt** | `.well-known/security.txt` with Contact and Expires. |
| **Edge Functions** | `submit-prayer`: Turnstile + rate limit + server-side sanitization. `create-checkout-session`: JWT-only identity, price_id allowlist. |

### 1.2 Known warnings (test-security.js)

- **Config placeholder:** Ensure production uses real Supabase URL/anon key (not `your-project-ref`).
- **6 innerHTML lines:** Concatenation without inline `escapeHtml` — escaping done in surrounding code; verify on any new innerHTML.
- **MASTER_EMAIL client-side:** Documented; prefer server-side admin gate (Cloudflare Access / Worker) for production.

---

## 2. Bug fixed

### `getQueryInput()` infinite recursion

**Before:** `return document.getElementById('tdb-search') || getQueryInput();`  
**After:** `return document.getElementById('tdb-search') || document.getElementById('query');`

On pages without `#tdb-search` (e.g. `study.html`, `pastor-toolkit.html`, `sermon.html`), the function recursively called itself, causing a stack overflow. The fallback should be `#query`, not a recursive call.

---

## 3. Pages & structure

| Count | Notes |
|-------|------|
| **39 HTML pages** | All accounted for; no orphans. |
| **Core tools** | Bible Tool, Pastor Toolkit, Team Toolkit, Study, Sermon, Bible Studies, Message Board, Kids Corner, Today's Battle — all present and linked. |
| **Topic pages** | 7 topic-*.html; build forces copy to dist/. |
| **approach.html** | Exists; footer links correctly. |

---

## 4. Build & tests

| Command | Result |
|---------|--------|
| `npm run build` | ✅ Passes |
| `node test-security.js` | ✅ All defense checks pass; 3 documented warnings |
| `node test-site.js --offline` | ✅ All pages and search logic pass |

**test-site.js:** Updated to accept either `id="query"` or `id="tdb-search"` on home (index uses `tdb-search`).

---

## 5. Config & deployment

| Item | Status |
|------|--------|
| **config.js** | In `.gitignore`; use `config.example.js` as template. Production must set real Supabase, Stripe, Turnstile. |
| **build-copy-static.js** | Copies `config.js` to dist if present; build-config.js can override from env. |
| **voice-message.js** | In rootFiles; file exists. |

---

## 6. Stripe & military discount

- **Signed-in checkout:** `create-checkout-session` uses `STRIPE_PRICE_IDS`; allowlist has 6 prices (supporter, battle_pro, church).
- **Military:** Uses Payment Links (`STRIPE_BATTLEPRO_MILITARY_*_LINK`) when configured. For signed-in military checkout, add military price IDs to `ALLOWED_PRICE_IDS` in the Edge Function and `STRIPE_PRICE_IDS` in config.

---

## 7. Recommendations

### High priority

1. **Deploy verification:** Confirm `config.js` in production has real keys (not placeholders).
2. **Admin protection:** Use Cloudflare Access or `workers/admin-guard.js` for `/admin` in production.

### Medium priority

3. **Lighthouse:** Run on `/`, `/pricing`, `/bible-tool`, `/verse` for performance and accessibility.
4. **Manual flows:** Test auth (sign up, login, reset), Bible Tool lookup, and checkout on a real or staging environment.

### Lower priority

5. **Code splitting:** `script.js` is large (~13.7k lines); consider lazy-loading non-core paths (reader, admin, coloring) on page load.
6. **Military signed-in checkout:** Add military price IDs to create-checkout-session when Stripe products exist.

---

## 8. Files referenced

| File | Purpose |
|------|---------|
| `SECURITY.md` | Principles, checklist, verification |
| `PRIVACY-ANALYTICS.md` | Search analytics rules |
| `SUPABASE-SYNC-TABLES.md` | RLS and sync tables |
| `AUDIT-REPORT.md` | Previous fine-tooth-comb audit |
| `docs/SITE-AUDIT-RESPONSE.md` | Audit follow-up tracking |
| `SECURITY-AUDIT.md` | Defense/offense protocol |

---

*Audit complete. Critical bug fixed. Security baseline and build verified.*
