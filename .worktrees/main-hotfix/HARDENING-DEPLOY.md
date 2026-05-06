# Deploying maximum security hardening

After pulling the latest code, apply these steps so all hardening is active.

## 1. Rate limit table (Supabase)

Run in Supabase SQL Editor:

- **File:** `supabase-rate-limit-table.sql`

This creates `public.rate_limit` for submit-prayer (per-IP) and post-message (per-user). Only service_role can read/write; no RLS policies for anon/authenticated.

## 2. Edge Functions

Deploy and set secrets:

- **submit-prayer** — Already has Turnstile + sanitization; now includes per-IP rate limit (30/min). No new secrets required; optional: `RATE_LIMIT_SALT` for IP hashing.
- **post-message** — New. Deploy: `supabase functions deploy post-message`. Secrets: `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`. Client uses `POST_MESSAGE_URL` (set from SUPABASE_URL in config.js) when available.

## 3. CSP (already in repo)

- **index.html**, **pricing.html**, **message.html** — script-src no longer includes `'unsafe-inline'`; only `'nonce-tdb2025'`. All inline scripts that were missing a nonce (bible-tool.html, bible-study.html) now have it. If you add new HTML pages with inline scripts, add `nonce="tdb2025"` and ensure your CSP (meta or Cloudflare) allows it.

## 4. Admin route protection (optional)

- **Worker:** `workers/admin-guard.js` — Deploy to Cloudflare with a route for `*/admin*`. Set secret `TDB_ADMIN_SECRET`. See `workers/README-ADMIN-GUARD.md`.
- **Cloudflare Access** — Alternatively, use Access for `/admin*` and skip the Worker.

## 5. Verification

- **RLS:** Anon key only → `GET /rest/v1/messages?select=*` returns `[]` or 403.
- **submit-prayer:** >30 requests in 1 min from same IP → 429.
- **post-message:** When POST_MESSAGE_URL is used, >10 posts in 1 min per user → 429.
- **CSP:** No inline script without nonce on index, pricing, message, bible-tool, bible-study.
