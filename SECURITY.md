# Security — Today's Daily Battle

**Security is the top priority.** This document summarizes how we protect users and data, and what to do when adding features.

---

## Principles

1. **User and builder safety first** — Security is the top priority for everyone. For users: especially in sensitive moments (grief, anxiety, faith). For builders: never expose secrets, always RLS and sanitize. See PRIVACY-ANALYTICS.md for search privacy.
2. **User-friendliness second** — After security, prioritize clear copy, accessible UI, helpful errors, and smooth flows so the app is easy and reassuring to use.
3. **Least privilege** — Supabase anon key is public by design; **Row Level Security (RLS)** enforces who can read/write what.
4. **No secrets in the client** — Only the Supabase **anon** (publishable) key and Turnstile **site** key belong in the frontend. Service role, Stripe secret, and Turnstile secret key stay on the server (Edge Functions / env).
5. **Defense in depth** — Validate and sanitize on both client and server; assume client can be tampered with.

---

## What we do today

### Authentication & authorization

- **Supabase Auth** for sign-up, login, password reset. Session is JWT-based; refresh is handled by the client.
- **RLS on all synced tables** — `user_sync_data`, `messages`, `message_reports`, `newsletter_signups`, `prayers`, `daily_battles`. Policies restrict access by `auth.uid()` or role. See `supabase-rls-lockdown.sql` and `supabase-rls-quick.sql`.
- **Public write-only helpers** — `feeling_suggestions`, `contact_messages`, and `shop_waitlist` allow **anon INSERT only** (no anon SELECT), with length checks in RLS. Run `supabase-feeling-suggestions.sql`, `supabase-contact-messages.sql`, and `supabase-shop-waitlist.sql` in Supabase. Review rows in Dashboard or via `service_role`. Periodically delete old rows (e.g. &gt;90 days) via SQL job or manual review to match `privacy.html` retention. **Optional:** run `supabase-cron-cleanup-contact-shop.sql` in the SQL Editor to schedule daily deletes with `pg_cron` (requires extension enabled on the project). Verification query and fallbacks: **`docs/SITE-OPS-RUNBOOK.md`**.
- **Signup role** — Trigger `auth.force_member_role_trigger` ensures new users get `role: member`; admin is set only via Supabase Dashboard `app_metadata`, never from the client.
- **Admin / moderation** — **No public HTML admin surface.** Production maps `/admin`, `/admin.html`, `/admin/*`, and other internal paths to **`blocked.html`** with **404** via `_redirects` (Cloudflare Pages) — minimal HTML (`Not found.`), no login links, no auth hints. `auth.js` does **not** redirect guests away from `/admin` to `login.html` (that previously leaked “sensitive route” intent). Moderation uses **Supabase Dashboard** + **service role** only. Legacy `admin.html` stays in the repo for local use; it is not served live.  
  - Optional extra layer: deploy the Worker in `workers/admin-guard.js` (see `workers/README-ADMIN-GUARD.md`) or Cloudflare Access if you ever reintroduce a protected admin route.  
  - **Roles:** `app_metadata.role === 'admin'` is still set only in Supabase Dashboard, never from client input. Do not ship admin email allowlists in `config.js` or HTML.

### Client-side hardening

- **CSP (where it lives)** — The authoritative policy for **Cloudflare Pages** is the **`_headers`** file in this repo (copied to `dist/` on build). If you also set **Transform Rules → Modify Response Header** in the Cloudflare dashboard, treat that as an **override**: document it here and keep repo `_headers` in sync so local/preview matches production. Requesting `https://…/_headers` in a browser **404s** — that is normal; headers are applied by the platform, not served as a public file.
- **CSP** — `Content-Security-Policy` in `_headers` restricts script, style, connect, and frame sources. **script-src** includes `'nonce-tdb2025s'` and `'unsafe-inline'` for compatibility with JSON-LD, third-party scripts (Stripe, Turnstile, analytics), and legacy inline bootstraps; **style-src** includes `'unsafe-inline'` for component styles. Inline executable scripts use `nonce="tdb2025s"` where applicable. `wasm-unsafe-eval` was removed (no WebAssembly in app scripts). **Trusted Types:** `trusted-types default dompurify` allowlists the default sanitizer policy and DOMPurify’s pass-through policy; **`require-trusted-types-for 'script'` is not used** so third-party scripts (e.g. Google tag) do not trip browser TrustedHTML errors—first-party code still loads **`tt-bootstrap.js`** early to wrap HTML sinks with DOMPurify. Tightening further (nonce/hash-only, drop `'unsafe-inline'` on script-src, `report-uri` / `report-to`) is a follow-up. See CLOUDFLARE-CSP-FIX.md if the site goes black after CSP changes.
- **Headers** — `_headers` (Netlify/Cloudflare Pages): `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `Referrer-Policy: no-referrer`, `Strict-Transport-Security: max-age=31536000; includeSubDomains; preload`, `Permissions-Policy: geolocation=(self), microphone=(), camera=(), payment=(), usb=(), battery=()` (homepage/kids sky: **default** uses same-origin `GET /api/sky-geo` (Cloudflare Pages Function) for approximate lat/lon from **CDN edge IP geolocation**; response is cached per calendar day in `sessionStorage` as `tdbSkyGeoIp` only. **Optional** precise GPS: `localStorage` `tdbSkyGeoOptIn === '1'` → `getCurrentPosition` once; stored as `tdbSkyGeoGps` / legacy `tdbSkyGeo`. Coordinates are not sent to our app servers. If the geo endpoint is missing (e.g. static-only host), sky falls back to fixed clock bands.), `X-XSS-Protection: 1; mode=block`.
- **CSP violation reporting** — `script.js` listens for `securitypolicyviolation` and logs to console for debugging.
- **Referrer** — `referrer: no-referrer` so nothing follows users when they leave the site.
- **XSS** — User/API content is never written raw to the DOM. Use `escapeHtml()`, `sanitizeHtml()` (DOMPurify when available), or `sanitizeUserInput()` before storing or displaying. Prefer `textContent` when HTML is not needed.
- **Input** — `sanitizeUserInput()` strips tags and script-like patterns. `truncateForDb()` enforces length limits before Supabase. Use both for prayer intents, family name, message board, etc.
- **LocalStorage** — Keys prefixed with `tdb_` and versioned (e.g. `tdb_prayer_list_v1`). "Clear local data" button with confirm + toast. No secrets in JS; config placeholder check warns on load.

### Supabase

- **RLS & OWASP mapping** — See **`docs/SUPABASE-RLS-OWASP.md`** for policy patterns (owner-only, anon insert-only, JWT roles), OWASP Top 10 (2021) mapping, and Supabase-specific breach patterns. Table inventory stays in **`SUPABASE-SYNC-TABLES.md`**; SQL sources are `supabase-*.sql`.
- **Anon key** — Safe to be in repo and in frontend; RLS and auth determine what rows are visible.
- **Service role key** — Must **never** be in the repo or client. Use only in Edge Functions, cron, or backend; store in Supabase secrets or env.
- **Edge Functions** — `submit-prayer` verifies Turnstile server-side and rate-limits per IP; `create-checkout-session` uses service role and attaches `user_id` from the authenticated session only; `post-message` rate-limits per user and sanitizes server-side.

### Payments (Stripe)

- Payment links and publishable key can be in config. **Secret key** and webhook signing secret only in server/env.
- Checkout session is created by an Edge Function that reads the authenticated user from the JWT; never trust client-supplied `user_id` for billing.

### Privacy & analytics

- Search: we **never** send raw query text or user identity. Only anonymous topic counts via `trackSearchAnalytics()`. See PRIVACY-ANALYTICS.md.

### Traffic anomalies (e.g. one country or path spiking bandwidth)

Edge analytics (Cloudflare **Analytics & logs** → HTTP traffic, or **Security** → Events) sometimes show a country or “empty” content-type bucket out of proportion. That is usually **bots**, **prefetch**, **health checks**, or a **single asset** being hammered—not necessarily real readers.

**When a region spikes (example: Netherlands + high MB):**

1. In Cloudflare Dashboard, open **Traffic** or **Log Explorer** (if enabled), filter by **country** and **time range**, then sort by **URL** or **edge status code**.
2. Note whether hits cluster on **`/`**, **`/kjv.json`**, **`/script.js`**, **`/assets/*`**, or a **single HTML** path. One path + steady interval often indicates a crawler.
3. Compare **cached vs uncached** share: if most requests are **dynamic HTML** (`no-cache` hubs), low cache hit rate is expected; static assets use long `Cache-Control` in `_headers` (`/vendor/*`, `/*.css`, `/*.js`, images). After deploy, purge only what changed (`scripts/cloudflare-purge.mjs`).
4. If the pattern is abusive (high 404 rate, same ASN), use **Security** → **WAF** / **Bots** (e.g. managed rules, rate limiting) or block by **ASN** after confirming it is not a CDN or partner.

**“Empty” or unknown content-type in reports:** Often **204/304**, **HEAD**, **challenge** responses, or **favicon/manifest** before explicit headers. `_headers` sets **Content-Type** and **Cache-Control** for `manifest.json`, `icon.svg`, `favicon.ico`, `robots.txt`, `sitemap.xml`, and **`/.well-known/security.txt`** so common edge responses are typed.

**Cached requests % vs cached bandwidth % (Cloudflare):** These often diverge. **HTML** for `/`, hubs, and topical pilots is **`no-cache`** by design—so **most request rows** are uncached even though each row is small. **JS, CSS, JSON, images, fonts, and media** are fewer requests but **most bytes**; when the CDN serves them from cache, **cached bandwidth** looks healthy (e.g. ~50–60%+) while **cached request count** can still be **under ~15%**. That is **not** a misconfiguration by itself; it reflects “many small fresh HTML hits + fewer large asset hits.”

**High MB from one country with modest request count:** Divide **bandwidth ÷ requests** for that country vs the US. If the average is **much larger** (e.g. hundreds of KB per request vs tens of KB), suspect **repeated full downloads** of **large static files** (`kjv.json`, media, a single script without `?v=` cache bust) or **non-browser** clients—not only “popular in that country.” Confirm in **Log Explorer** by **URL** and **client ASN** before blocking.

---

## Checklist when adding features

- [ ] **New Supabase table** — Enable RLS; add policies so only intended roles (e.g. `authenticated`, or anon only for specific actions) can read/write. Prefer `auth.uid() = user_id` for per-user data.
- [ ] **New user input** — Run through `sanitizeUserInput()` and/or `escapeHtml()`/`sanitizeHtml()` before display or send to DB. Enforce length with `truncateForDb()`.
- [ ] **New API/Edge Function** — Validate inputs; use `auth.getUser()` (or equivalent) for identity; never trust client for privileges. Use Edge Function secrets for keys.
- [ ] **New third-party script** — Allow it in CSP only if necessary; prefer minimal, documented domains.
- [ ] **Secrets** — Never commit service role key, Stripe secret, or Turnstile secret. Use Supabase secrets or build-time env for production overrides.

---

## Verification

- **RLS** — With the anon key only, unauthenticated requests to protected tables should return no rows or 403. See SUPABASE-SYNC-TABLES.md “Verify RLS (anon key test)”. For **prayers** / **moderation** tables: confirm in Supabase Dashboard → **Authentication → Policies** (or SQL) that anon cannot `SELECT` bulk rows, authenticated users only see **own** rows where applicable, and **service_role** is used only from Dashboard/Edge Functions—not the browser.
- **Pre-deploy authz boundary smoke** — `scripts/authz-smoke.sh` via `npm run test:authz-smoke`; use **`AUTHZ_STRICT=1`** against staging (or production project ref) after tables and Edge Functions are provisioned so missing RLS or undeployed functions fail before release. See `docs/PRE-LAUNCH-AUTHZ-TEST-PACK.md` §9 for expected output.
- **Auth** — Test sign-up, login, logout, forgot password; confirm session persists and RLS returns data only when logged in.
- **Payments** — Test checkout with Stripe test keys; confirm metadata is set server-side from session.
- **V2 quality gate** — Run `npm run quality:gate` (or `npm run quality:gate:full` when browser automation is available) and follow `V2-QUALITY-BASELINE.md` before shipping.

---

## If something is compromised

- **Service role key or Supabase project:** Rotate the service_role key in Supabase Dashboard (Settings → API → Regenerate). Update Edge Function secrets (`SUPABASE_SERVICE_ROLE_KEY`). Revoke existing sessions if needed (Auth → Users → sign out all).
- **Stripe secret or webhook secret:** Rotate in Stripe Dashboard (API keys / Webhooks). Update Edge Function secrets (`STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`). Re-deploy functions.
- **Turnstile secret:** Regenerate in Cloudflare Turnstile; set new `TURNSTILE_SECRET_KEY` in submit-prayer Edge Function secrets.
- **Admin account:** Change password; ensure app_metadata.role is set only in Dashboard. Remove any admin email from client config if it was added by mistake.
- **Audit:** Check Supabase Auth and API logs, Stripe dashboard events, and Cloudflare analytics for suspicious activity.

---

## Canonical hostname (www vs apex)

Both `https://todaysdailybattle.com` and `https://www.todaysdailybattle.com` must not serve duplicate 200s long term. **Prefer a single 301/308** from one host to the other (match `<link rel="canonical">`, sitemap, and `robots.txt` — currently apex). This is enforced at **Cloudflare** (Redirect Rules or Bulk Redirects), not in static `_redirects` (same-origin only). Step-by-step: **`docs/CLOUDFLARE-HOST-CANONICAL.md`**.

---

## Subresource Integrity (SRI)

External scripts (Firebase, DOMPurify, canvas-confetti) include `integrity="sha384-..."` and `crossorigin="anonymous"`. Regenerate hashes when updating versions: `curl -sL "URL" | openssl dgst -sha384 -binary | openssl base64 -A`. Or use [srihash.org](https://www.srihash.org/).

---

## Files to reference

| File | Purpose |
|------|--------|
| `config.js` | Anon key, URLs, Stripe links. No secrets. |
| `SECURITY-AUDIT.md` | Defense/offense audit and improvement checklist |
| `SUPABASE-SYNC-TABLES.md` | RLS and sync table setup |
| `supabase-rls-lockdown.sql` | Full RLS lockdown and auth trigger |
| `supabase-rate-limit-table.sql` | Rate-limit table for submit-prayer and post-message |
| `workers/README-ADMIN-GUARD.md` | Admin route protection (Cloudflare Worker) |
| `HARDENING-DEPLOY.md` | Steps to deploy rate-limit table, Edge Functions, and admin Worker |
| `PRIVACY-ANALYTICS.md` | Search analytics and user safety rules |
| `script.js` | `sanitizeUserInput`, `escapeHtml`, `sanitizeHtml`, `truncateForDb` |
| `docs/PRE-LAUNCH-AUTHZ-TEST-PACK.md` | Repeatable RLS / Edge Function / IDOR / XSS / rate-limit checks before launch |
| `scripts/authz-smoke.sh` | `npm run test:authz-smoke` — curl smoke for T1/T5/T8 + E1/E2/E6/E6b (set `SUPABASE_*`, optional `AUTHZ_ACCESS_TOKEN`, `AUTHZ_STRICT`) |
| `BACKLASH-PREP.md` | Anticipated critiques, response copy, escalation notes |

---

*Security is the top priority. When in doubt, restrict access and sanitize input. Last updated 2026.*

**Last security audit:** March 2026. See SECURITY-AUDIT.md for defense/offense improvements and checklist.
