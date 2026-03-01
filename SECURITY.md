# Security — Today's Daily Battle

**Security is the top priority.** This document summarizes how we protect users and data, and what to do when adding features.

---

## Principles

1. **User safety first** — especially for sensitive moments (grief, anxiety, faith). See PRIVACY-ANALYTICS.md for search privacy.
2. **Least privilege** — Supabase anon key is public by design; **Row Level Security (RLS)** enforces who can read/write what.
3. **No secrets in the client** — Only the Supabase **anon** (publishable) key and Turnstile **site** key belong in the frontend. Service role, Stripe secret, and Turnstile secret key stay on the server (Edge Functions / env).
4. **Defense in depth** — Validate and sanitize on both client and server; assume client can be tampered with.

---

## What we do today

### Authentication & authorization

- **Supabase Auth** for sign-up, login, password reset. Session is JWT-based; refresh is handled by the client.
- **RLS on all synced tables** — `user_sync_data`, `messages`, `message_reports`, `newsletter_signups`, `prayers`, `daily_battles`. Policies restrict access by `auth.uid()` or role. See `supabase-rls-lockdown.sql` and `supabase-rls-quick.sql`.
- **Signup role** — Trigger `auth.force_member_role_trigger` ensures new users get `role: member`; admin is set only via Supabase Dashboard `app_metadata`, never from the client.
- **Admin** — Determined by `app_metadata.role === 'admin'` or email match to a server/config-controlled list. Do not add admin emails from user input. For production, protect `/admin` with the Cloudflare Worker in `workers/admin-guard.js` (see `workers/README-ADMIN-GUARD.md`) or Cloudflare Access.

### Client-side hardening

- **CSP** — `Content-Security-Policy` in `index.html` (and pricing/message) restricts script, style, connect, and frame sources. **script-src uses nonces only** (no `'unsafe-inline'`); all inline scripts have `nonce="tdb2025"`. Use `nonce="tdb2025"` for inline scripts/styles where allowed.
- **Referrer** — `referrer: no-referrer` so nothing follows users when they leave the site.
- **XSS** — User/API content is never written raw to the DOM. Use `escapeHtml()`, `sanitizeHtml()` (DOMPurify when available), or `sanitizeUserInput()` before storing or displaying. Prefer `textContent` when HTML is not needed.
- **Input** — `sanitizeUserInput()` strips tags and script-like patterns. `truncateForDb()` enforces length limits before Supabase. Use both for prayer intents, family name, message board, etc.

### Supabase

- **Anon key** — Safe to be in repo and in frontend; RLS and auth determine what rows are visible.
- **Service role key** — Must **never** be in the repo or client. Use only in Edge Functions, cron, or backend; store in Supabase secrets or env.
- **Edge Functions** — `submit-prayer` verifies Turnstile server-side and rate-limits per IP; `create-checkout-session` uses service role and attaches `user_id` from the authenticated session only; `post-message` rate-limits per user and sanitizes server-side.

### Payments (Stripe)

- Payment links and publishable key can be in config. **Secret key** and webhook signing secret only in server/env.
- Checkout session is created by an Edge Function that reads the authenticated user from the JWT; never trust client-supplied `user_id` for billing.

### Privacy & analytics

- Search: we **never** send raw query text or user identity. Only anonymous topic counts via `trackSearchAnalytics()`. See PRIVACY-ANALYTICS.md.

---

## Checklist when adding features

- [ ] **New Supabase table** — Enable RLS; add policies so only intended roles (e.g. `authenticated`, or anon only for specific actions) can read/write. Prefer `auth.uid() = user_id` for per-user data.
- [ ] **New user input** — Run through `sanitizeUserInput()` and/or `escapeHtml()`/`sanitizeHtml()` before display or send to DB. Enforce length with `truncateForDb()`.
- [ ] **New API/Edge Function** — Validate inputs; use `auth.getUser()` (or equivalent) for identity; never trust client for privileges. Use Edge Function secrets for keys.
- [ ] **New third-party script** — Allow it in CSP only if necessary; prefer minimal, documented domains.
- [ ] **Secrets** — Never commit service role key, Stripe secret, or Turnstile secret. Use Supabase secrets or build-time env for production overrides.

---

## Verification

- **RLS** — With the anon key only, unauthenticated requests to protected tables should return no rows or 403. See SUPABASE-SYNC-TABLES.md “Verify RLS (anon key test)”.
- **Auth** — Test sign-up, login, logout, forgot password; confirm session persists and RLS returns data only when logged in.
- **Payments** — Test checkout with Stripe test keys; confirm metadata is set server-side from session.

---

## If something is compromised

- **Service role key or Supabase project:** Rotate the service_role key in Supabase Dashboard (Settings → API → Regenerate). Update Edge Function secrets (`SUPABASE_SERVICE_ROLE_KEY`). Revoke existing sessions if needed (Auth → Users → sign out all).
- **Stripe secret or webhook secret:** Rotate in Stripe Dashboard (API keys / Webhooks). Update Edge Function secrets (`STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`). Re-deploy functions.
- **Turnstile secret:** Regenerate in Cloudflare Turnstile; set new `TURNSTILE_SECRET_KEY` in submit-prayer Edge Function secrets.
- **Admin account:** Change password; ensure app_metadata.role is set only in Dashboard. Remove any admin email from client config if it was added by mistake.
- **Audit:** Check Supabase Auth and API logs, Stripe dashboard events, and Cloudflare analytics for suspicious activity.

---

## Optional: Subresource Integrity (SRI)

For pinned vendor scripts (e.g. from cdn.jsdelivr.net), you can add `integrity` and `crossorigin="anonymous"` to `<script src="...">`. Use the hash provided by the CDN or generate with `openssl dgst -sha384 -binary < file.js | openssl base64 -A`. Update the hash whenever you change the script version.

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

---

*Security is the top priority. When in doubt, restrict access and sanitize input. Last updated 2026.*

**Last security audit:** March 2026. See SECURITY-AUDIT.md for defense/offense improvements and checklist.
