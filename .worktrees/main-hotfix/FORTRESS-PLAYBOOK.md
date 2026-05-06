# Fortress playbook — todaysdailybattle.com

Do these in order, test after each. ~45 mins to bulletproof.

---

## 1. Supabase RLS — Lock profiles tight

**Goal:** No one reads or writes tiers except the signed-in user (read own) and the webhook (service_role).

Your `profiles` table uses **`id`** (uuid, primary key), not `user_id`. Use this SQL in **Supabase Dashboard → SQL Editor**:

```sql
-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Read: only own row (id = auth.uid())
DROP POLICY IF EXISTS "profiles_select_own" ON public.profiles;
CREATE POLICY "profiles_select_own" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

-- Tier updates ONLY via service_role (webhook). Revoke client updates.
REVOKE UPDATE ON public.profiles FROM authenticated;
DROP POLICY IF EXISTS "profiles_update_own" ON public.profiles;
DROP POLICY IF EXISTS "profiles_insert_service" ON public.profiles;
DROP POLICY IF EXISTS "profiles_update_service" ON public.profiles;
CREATE POLICY "profiles_insert_service" ON public.profiles
  FOR INSERT TO service_role WITH CHECK (true);
CREATE POLICY "profiles_update_service" ON public.profiles
  FOR UPDATE TO service_role USING (true) WITH CHECK (true);

GRANT SELECT ON public.profiles TO authenticated;
GRANT SELECT, INSERT, UPDATE ON public.profiles TO service_role;
```

**If you already ran** `supabase-profiles-tier.sql` and `supabase-rls-lockdown-extended.sql`, you’re set—they do the same thing.

**Test:** Log out. In Supabase SQL Editor with anon key (or REST: `GET /rest/v1/profiles?select=*` with anon key) → 403 or `[]`. Log in as a user → you see only that user’s row.

---

## 2. Webhook auth — Block random hits

**Do not** add a check like `signature === STRIPE_WEBHOOK_SECRET`. Stripe does not send the secret in a header; they send a **signature** (e.g. `t=123,v0=abc...`). The webhook already verifies every request with `stripe.webhooks.constructEventAsync(body, signature, webhookSecret)`. Invalid or missing signature → 400. That is the only auth you need.

**Checklist:**
- Stripe Dashboard → Webhooks → your endpoint → copy **Signing secret** (whsec_...).
- Supabase → Edge Functions → stripe-webhook → Secrets → set `STRIPE_WEBHOOK_SECRET` to that value.

**Test:** `curl -X POST https://<ref>.supabase.co/functions/v1/stripe-webhook` → 400 (missing signature). Stripe CLI `stripe listen --forward-to ...` + trigger event → 200.

---

## 3. Rate limiting

- **Supabase Auth:** Dashboard → Authentication → Rate Limiting → Enable (e.g. 10 req/min per IP).
- **Prayer / search:** If you use Cloudflare, add a Rate Limiting rule (e.g. 5 req/10 sec per IP for `/api/*` or your prayer endpoint). Free tier supports this.

**Test:** Spam login attempts → after limit, requests are throttled or blocked.

---

## 4. Headers & CSP

CSP and security headers apply to **your site** (HTML pages), not the webhook. Set them at your **host/CDN** (Cloudflare, Netlify, etc.) so every page response includes them. Your repo already has:

- **Meta CSP** on index, pricing, message (see `index.html` and SECURITY-CHECK.md).
- **Server header snippets** in SECURITY-CHECK.md (Strict-Transport-Security, X-Content-Type-Options, X-Frame-Options, Referrer-Policy).

Add those headers in Cloudflare Transform Rules, Netlify `_headers`, or equivalent. Do **not** add CSP to the Stripe webhook response—the webhook returns JSON; CSP is for the site.

**Test:** DevTools → Network → pick a page → Response headers show CSP, X-Content-Type-Options, etc.

---

## 5. Data & cache

- **kjv.json:** Static, no user data. Safe.
- **Service worker** (`service-worker.js`): Caches static assets (HTML, CSS, script.js, kjv.json, manifest, icon) and public API responses (daily_battles, audio). It does **not** cache Supabase auth or same-origin `/api/*` user-specific endpoints (Supabase is on a different origin). Keep as-is; ensure any future same-origin auth/API paths are excluded from the fetch handler if you add them.

**Test:** DevTools → Application → Cache Storage → only public/static resources listed.

---

## 6. Monitoring & alerts

- **Stripe:** Dashboard → Settings → Email notifications → enable fraud, failed payments, disputes.
- **Supabase:** Logs → optionally set an alert or log filter for `profiles` / `tier` changes.
- **Cloudflare:** Add site (if not already) → enable WAF, Bot Fight Mode (free).

---

## Final lockdown checklist

- [ ] RLS policies live and tested (anon cannot read profiles; only service_role updates tier).
- [ ] Webhook: STRIPE_WEBHOOK_SECRET set in Supabase secrets; no extra “header equals secret” check (signature verification only).
- [ ] Rate limiting: Supabase Auth + Cloudflare (if used) on login/prayer.
- [ ] CSP/headers: Applied at host/CDN for the site (see SECURITY-CHECK.md).
- [ ] Cache: Service worker caches only static/public assets.
- [ ] Monitoring: Stripe emails, Supabase logs, Cloudflare WAF/Bot Fight Mode.

**Quick test sequence:** Anon access → blocked. Bot spam → throttled. Fake webhook (curl no signature) → 400. Real Stripe event (CLI or live) → 200, tier flips, no user_id in response.

*Last updated Feb 2026. Matches supabase-profiles-tier.sql + supabase-rls-lockdown-extended.sql and stripe-webhook signature verification.*
