# Security check — Today's Daily Battle

Quick reference from a codebase audit. Use this to stay consistent and fix gaps.

---

## Fort Knox checklist (max hardening)

| Control | Status |
|--------|--------|
| **CSP** on index, pricing, message | ✅ Meta CSP + nonces on key pages |
| **Referrer** | ✅ `strict-origin-when-cross-origin` on index, pricing, message |
| **Checkout redirect allowlist** | ✅ script.js only redirects to Stripe or same-origin pricing URL |
| **XSS** | ✅ escapeHtml/sanitizeUserInput; textContent for user content; reading-plan esc() |
| **RLS** | ✅ Documented; anon key only; verify with SUPABASE-SYNC-TABLES.md |
| **Secrets** | ✅ No service_role/Stripe secret in frontend; .env in .gitignore |
| **Search privacy** | ✅ trackSearchAnalytics() allowlist only |
| **Server headers** | ⚠️ Add at host/CDN (see below) |
| **Turnstile** | ⚠️ Enable for production Quick Pray |

---

## Server security headers (add at host/CDN)

Set these in Cloudflare (Transform Rules / Page Rules), Netlify (`_headers`), Vercel (`vercel.json`), or your server config so every response gets them.

```
Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: geolocation=(), microphone=(self), camera=()
```

- **Strict-Transport-Security:** HTTPS only; browsers won’t downgrade.
- **X-Content-Type-Options: nosniff:** Stops MIME sniffing.
- **X-Frame-Options: DENY:** Matches repo `_headers` and `npm run test:live-csp` (stricter than SAMEORIGIN; CSP also uses `frame-ancestors 'none'`).
- **Referrer-Policy:** Matches meta referrer; don’t send full URL to third parties.
- **Permissions-Policy:** Restrict sensitive APIs; allow microphone only for “Call God” if needed.

**Cloudflare Pages (Headers in dashboard or `_headers`):**
```
/*
  Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
  X-Content-Type-Options: nosniff
  X-Frame-Options: DENY
  Referrer-Policy: strict-origin-when-cross-origin
```

**Netlify `public/_headers`:**
```
/*
  Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
  X-Content-Type-Options: nosniff
  X-Frame-Options: DENY
  Referrer-Policy: strict-origin-when-cross-origin
```

---

## ✅ In good shape

### Content Security Policy (CSP)
- **index.html** has a strict CSP meta tag: `default-src 'self'`, script/style nonces (`nonce-tdb2025`), allowlisted script/style/font/connect sources (Supabase, Stripe, GA, Plausible, Cloudflare, etc.).
- **pricing.html** and **message.html** now have the same CSP (pricing includes Stripe script/frame/connect) and `referrer` meta; stylesheet and vendor script use nonce where applicable.
- Inline scripts that need to run use the same nonce. Third-party scripts (e.g. Firebase, confetti) are from allowlisted origins.

### XSS — User content and DOM
- **script.js** uses `escapeHtml()` for any data (refs, verse text, topic names, etc.) before setting `innerHTML`. Covers `& < > " '`.
- **sanitizeUserInput()** strips tags, `javascript:`, `on*=`, and entities for prayer intent, family name, and message text before DB or display.
- **Message board:** User text and display names are rendered with **textContent** (createElement + textContent), not innerHTML — safe.
- **Prayer echo / intent:** Rendered with **textContent**; intent is sanitized before insert.
- **DOMPurify** is loaded on index and used in `sanitizeHtml()` when available; fallback is `escapeHtml()`.
- **reading-plan.html:** Plan data (ref, theme) from localStorage is now escaped with a small `esc()` in the inline script before use in innerHTML (defense in depth).

### Auth & secrets
- **Supabase anon key** is public by design; **config.js** documents that RLS protects data. No service_role or secret keys in frontend code.
- **Stripe:** Only publishable key and payment link URLs belong in config; no secret keys in repo. config.js says to keep production secrets in env or .gitignore.
- **.gitignore** includes `.env`, `token*`, `*.key`; `config.js` is **not** ignored (intentional for anon key and empty Stripe placeholders).
- **MASTER_EMAIL** is HTML-entity obfuscated in config; decoded only at runtime for admin/Pro checks.

### Backend / RLS
- **SUPABASE-SYNC-TABLES.md** and **SUPABASE-SETUP.md** describe RLS: policies restrict `user_sync_data` and other tables to `auth.uid()`. Anon key cannot read other users’ data when RLS is applied.
- **ABUSE-PROTECTION.md** documents Turnstile for Quick Pray; secret key lives in Edge Function secrets, not frontend.

### Redirects
- **Stripe checkout:** The **create-checkout-session** Edge Function returns a URL; **script.js** now allowlists it before redirect: only `https://checkout.stripe.com/`, `https://pay.stripe.com/`, or same-origin URLs containing `pricing` (e.g. success redirect). Any other URL is ignored and the static payment link is used instead.
- Other redirects are to fixed paths (`/`, `index.html`, `sermon.html`, mailto) or use `encodeURIComponent` for query params only — no open redirect from user-controlled URLs.

### Privacy / analytics
- **PRIVACY-ANALYTICS.md** and **script.js** restrict search analytics to `trackSearchAnalytics()` with a strict allowlist (no raw query text, no user identifiers). Enforced by design.

---

## ⚠️ Recommendations

1. **CSP on remaining pages**  
   Add the same CSP (or a minimal safe subset) to other HTML pages (verse, study, church, etc.) via meta tag so XSS and script injection are limited everywhere.

2. **Edge Function: allowlist checkout URL**  
   In create-checkout-session, only return URLs that start with `https://checkout.stripe.com/` or your success page. The client now double-checks with an allowlist; server-side validation is still required.

3. **Turnstile when going live**  
   For production, configure Turnstile (ABUSE-PROTECTION.md) so Quick Pray is protected against bots and abuse; keep the secret in Edge Function secrets only.

4. **RLS verification**  
   Periodically re-run the anon-key test from SUPABASE-SYNC-TABLES.md to confirm unauthenticated requests cannot read other users’ data.

5. **Server security headers**  
   Add the headers in the “Server security headers” section above at your host or CDN so every response is hardened (HSTS, X-Content-Type-Options, X-Frame-Options, Referrer-Policy).

---

## Pre-launch security (live subs)

Before flipping Stripe to live, confirm:

| Check | Action |
|-------|--------|
| **RLS on profiles** | Run `supabase-profiles-tier.sql` then `supabase-rls-lockdown-extended.sql` in Supabase SQL Editor. Result: anon cannot read/write profiles; authenticated can only SELECT own row; only service_role can INSERT/UPDATE (webhook). Verify: with anon key, `GET /rest/v1/profiles?select=*` returns 403 or `[]`. |
| **Webhook auth** | Stripe webhooks are authenticated by signature (`stripe.webhooks.constructEventAsync`). No extra secret header needed. Optional: Stripe Dashboard → Webhooks → restrict to Stripe IPs if your host supports it. |
| **No userId in webhook response** | Webhook returns only `{ ok: true, tier }` on success so user IDs are never in response bodies. |
| **Rate limiting** | Supabase Dashboard → Auth → Rate Limiting (enable). Cloudflare WAF or rate rules on login/prayer if available. |
| **PWA / service worker** | Cache only static assets (CSS, verse JSON, images). Do not cache user-specific API responses (streaks, prayers, profile). |

**RLS verification (anon test):** With anon key only: `GET .../rest/v1/profiles?select=*`. Secure result: empty array or 403. If you see rows, RLS is not applied—re-run the SQL.

---

## Summary

- **XSS:** Mitigated via escapeHtml/sanitizeUserInput, textContent for user content, and reading-plan escape.
- **CSP:** Strong on index, pricing, and message; same policy + referrer + nonces.
- **Redirects:** Checkout URL allowlisted in script.js (Stripe or same-origin pricing); no open redirect from user input.
- **Secrets:** Only public/allowlisted values in repo; RLS and Edge Function secrets protect backend.
- **Fort Knox:** Use the checklist and server headers above for maximum hardening.

*Last audit: Feb 2026. Fort Knox polish: CSP + referrer on pricing/message; checkout URL allowlist; SECURITY-CHECK server headers.*
