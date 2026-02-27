# Security checklist before full launch (auth + Stripe + sync)

Feedback from a trusted reviewer (Feb 2026): *"You're doing a lot right. As you activate full auth sync and Battle Pro, lock in these defenses—mostly RLS, webhook security, and headers. No major red flags; these layers make it bulletproof."* Not taken personally—this doc turns that into a concrete checklist with references to your repo.

---

## What’s already solid

- **Local/offline-first:** Prayers and many features save on device; no forced server send for anonymous use.
- **No sensitive exposure in frontend:** No plaintext passwords, no service_role or Stripe secret in client code; anon key only.
- **Stripe:** Checkout/Payment Links only—no card data on your server (Stripe tokenizes).
- **Webhook:** `stripe-webhook` verifies **signature** (HMAC via `constructEventAsync`) and returns **200** quickly; fulfills **only** on `checkout.session.completed` (not on redirect).
- **RLS in place:** `user_sync_data` (streaks) and `profiles` (tier) have RLS; see **SUPABASE-SYNC-TABLES.md** and **supabase-profiles-tier.sql**. Lockdown for other tables: **supabase-rls-lockdown.sql**.
- **Privacy & Terms:** Footer links to **privacy.html** and **terms.html**; privacy covers Supabase Auth, no selling data, HTTPS, local data. Optional: add one line for payments (see below).

---

## 1. Supabase Row Level Security (RLS) — critical

**Goal:** Every table that holds user data has RLS enabled and policies so **anon** cannot read/write other users’ data; **authenticated** users only see/change their own rows.

| Table | Where it’s defined | Quick check |
|-------|--------------------|-------------|
| **user_sync_data** (streaks, prayer list, badges) | **SUPABASE-SYNC-TABLES.md** | Policies: `auth.uid() = user_id` for SELECT/INSERT/UPDATE/DELETE. Anon has no grant. |
| **profiles** (tier for Battle Pro) | **supabase-profiles-tier.sql** | SELECT/UPDATE own; INSERT/UPDATE by service_role only. Anon has no grant. |
| **newsletter_signups** | **supabase-rls-lockdown.sql** + **supabase-newsletter-anon-insert.sql** | Authenticated: own row by email. Anon: INSERT only (for open signup). |
| **daily_battles, messages, message_reports, prayers** | **supabase-rls-lockdown.sql** | Anon: no SELECT; prayers allow anon INSERT for quick-pray. |

**Action:** In Supabase Dashboard → **Database** → **Tables**, for each table above confirm **Enable Row Level Security** is on. Test with anon key: `SELECT * FROM public.profiles` → expect empty or 403. See **RLS-VERIFICATION.md** and **SUPABASE-SYNC-TABLES.md** (Verify RLS section).

**Never:** Expose **service_role** key in frontend. Use it only in Edge Functions (e.g. stripe-webhook) and server-side.

---

## 2. Supabase Auth

- **Email confirmation:** Already in use; see **VERIFICATION-EMAIL-TROUBLESHOOTING.md** and **docs/E2E-AUTH-TEST.md**.
- **Redirect URLs:** Supabase Auth → URL Configuration → add your production and reset URLs (and optional `AUTH_REDIRECT_BASE` in config).
- **Keys:** No hardcoded secrets in repo; use **config.js** / env (e.g. **build-config.js** for deploy).
- **Optional:** MFA (TOTP) for admin/master account in Supabase Auth.

---

## 3. Stripe webhooks — PCI & fraud

- **Signature verification:** Done in **supabase/functions/stripe-webhook/index.ts** via `stripe.webhooks.constructEventAsync(body, signature, webhookSecret)`. Invalid signature → 400, no DB change.
- **Return 2xx quickly:** Webhook returns 200 after updating `profiles` (or 200 with error body for “no user_id” so Stripe doesn’t retry unnecessarily).
- **Fulfill only on completed payment:** Tier is updated only on `checkout.session.completed`, not on redirect or other events.
- **Idempotency:** Upsert on `profiles` by `id` is idempotent; duplicate events don’t double-grant.
- **Secrets:** `STRIPE_WEBHOOK_SECRET` and Stripe secret key live in Supabase Edge Function secrets only.
- **3D Secure / Radar:** Use Stripe defaults; optional: review Stripe Radar rules in Dashboard.
- **Trust:** On pricing page you already mention test card; when live, Stripe’s “Powered by Stripe” or lock icon is good for trust.

See **docs/STRIPE-LIVE-CHECKLIST.md** for test mode and live steps.

---

## 4. General web / app defenses

- **HTTPS:** Enforce everywhere (Cloudflare: SSL/TLS → Full or Full Strict; redirect HTTP → HTTPS).
- **Security headers:**  
  - **CSP:** Documented in **CLOUDFLARE-CSP-FIX.md** (Transform Rule in Cloudflare; include `'unsafe-inline'` for style-src/script-src as needed).  
  - **X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Strict-Transport-Security:** Add via Cloudflare **Transform Rules** (Modify response header) or **Configuration Rules** if you use Workers/Pages. Example: `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, `Strict-Transport-Security: max-age=31536000; includeSubDomains`.
- **Rate limiting:** Optional on Supabase Edge Functions or Cloudflare (WAF or Rate limiting rules) for signup/login and webhook.
- **CAPTCHA:** Optional; you have Turnstile on quick-pray; add to newsletter/signup if spam appears.
- **Errors:** Avoid leaking stack traces or internal details to the client; log server-side only.
- **Analytics:** Use GA4/Cloudflare for traffic; no PII in events (see **PRIVACY-ANALYTICS.md**).

---

## 5. Privacy & Terms

- **Existing:** **privacy.html** and **terms.html** linked in footer; privacy covers Supabase Auth, no selling data, HTTPS, local data, anonymous usage.
- **Optional addition:** In **privacy.html**, under “How we protect your data” or “What we collect,” add one line: *“Payments are processed by Stripe. We do not see or store your card number; Stripe handles it securely.”* (You can add this in the **Payments** subsection below if you add it.)
- **Streaks/sync:** Privacy already says local data and account data; you can add: *“When you sign in, your streak and saved data sync across devices via our secure database (Supabase).”*

---

## 6. Quick action plan (today / next session)

| # | Action | Where |
|---|--------|--------|
| 1 | Run RLS check: anon key → SELECT from profiles, user_sync_data, newsletter_signups → expect [] or 403 | **SUPABASE-SYNC-TABLES.md**, **RLS-VERIFICATION.md** |
| 2 | Test Stripe webhook in test mode: `stripe listen --forward-to https://YOUR-PROJECT.supabase.co/functions/v1/stripe-webhook` | **docs/STRIPE-LIVE-CHECKLIST.md** |
| 3 | Confirm privacy/terms mention (or add) payments (Stripe, no card storage) and optional sync sentence | **privacy.html** |
| 4 | Add security headers (X-Frame-Options, etc.) in Cloudflare if not already | Dashboard or **CLOUDFLARE-CSP-FIX.md** |
| 5 | E2E auth + subscription test: signup → verify → login → streak → test payment → tier flips | **docs/E2E-AUTH-TEST.md**, **docs/STRIPE-LIVE-CHECKLIST.md** |

---

## If something feels off — Cursor prompt

*"Add CSP header and RLS policy example for [table name] in Supabase for todaysdailybattle.com. Reference docs/SECURITY-CHECKLIST-PRE-LAUNCH.md and supabase-rls-lockdown.sql."*

---

**Summary:** You’re in a good spot. Locking in RLS on all user tables, webhook verification (already done), and headers gives you a production-solid base so users’ data and your mission stay protected.
