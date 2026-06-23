# March Push Readiness Plan

**Goal:** Ship Battle Pro in early March 2026 (Stripe payments, Supporter/Battle Pro/Church tiers, offline features, Wins Report, Armor of God series). Site is stable; this plan breaks prep into immediate wins, core implementation, and final polish.

**Timeline:** This week → quick wins. Next 1–2 weeks → Stripe + isProUser + webhook + cron. Last week → polish + soft launch. Early March → go live.

---

## 1. Immediate / Quick Wins (This Week — Low Risk)

- **Supabase Dashboard:** Log in → check plan (Free), MAUs, DB size (<500 MB), egress (<5 GB). Enable **pg_cron** (Database → Extensions) for daily seeding.
- **Monitoring:** Sign up UptimeRobot (or similar); add monitor for todaysdailybattle.com + /pricing (alert on 5xx/slow).
- **Stripe prep:** Test mode on. Create products/prices: Supporter $5/mo & $50/yr, Battle Pro $10/mo & $100/yr, Church $10/mo & $100/yr. Note Price IDs. Create restricted API key for webhooks.
- **Quick verification (incognito + hard refresh):** Prayer counter shows 9 (not "Loading"); map gradient/gold, no 404; KJV audio opens Bible Gateway; echo/presence shows numbers or "You're alone with Him"; offline Quick Pray saves locally, syncs on reconnect.
- **Local:** Run server 127.0.0.1:8765 → run test-site.js. Confirm CLOUDFLARE-CSP-FIX applied; use MESSENGER-SHARE-TROUBLESHOOTING if shares glitch.

---

## 2. Core Implementation (Next 1–2 Weeks)

**Order:** Stripe links → isProUser() → webhook → cron → E2E test (per NEXT-STEPS-MARCH.md).

### 2.1 Stripe Payment Links in config.js

- Add 6 URLs to `config.js`: `STRIPE_SUPPORTER_MONTHLY_LINK`, `STRIPE_SUPPORTER_YEARLY_LINK`, `STRIPE_BATTLEPRO_MONTHLY_LINK`, `STRIPE_BATTLEPRO_YEARLY_LINK`, `STRIPE_CHURCH_MONTHLY_LINK`, `STRIPE_CHURCH_YEARLY_LINK` (from Stripe Payment Links).
- On pricing.html: Subscribe buttons open Stripe Checkout (redirect to these links).

### 2.2 Pro detection (isProUser())

- **Option A:** Supabase `profiles` table — add `tier` column (text, default `'free'`). Query on load: `supabase.from('profiles').select('tier').eq('id', user.id).single()`; treat `tier === 'battle_pro'` or `tier === 'supporter'` (etc.) as Pro.
- **Option B:** `auth.users` `app_metadata.role === 'pro'` (set via webhook or Dashboard).
- In script.js: call `isProUser()` on load; if true → show Wins Report, offline PDFs, Armor access. Test by manually setting a test user's tier in Supabase.

### 2.3 Webhook → Supabase

- **Supabase Edge Function** (e.g. `stripe-webhook`): Verify Stripe signature with `STRIPE_WEBHOOK_SECRET`; on `checkout.session.completed` or `customer.subscription.created`, read `metadata.user_id` (pass from frontend at checkout), then `supabase.from('profiles').update({ tier: 'battle_pro' }).eq('id', userId)` (or update `auth.users` app_metadata via Admin API).
- **Stripe Dashboard:** Add webhook endpoint (Edge Function URL); subscribe to `checkout.session.completed`, `customer.subscription.*`. Test with Stripe CLI forwarding.

### 2.4 Daily battles cron

- **Seed function**: Run `npm run seed:deploy` to deploy the guided `seed-daily-battle` Edge Function + set secrets. The GitHub Action (`.github/workflows/seed-daily-battle.yml`) now calls it daily with good error handling. pg_cron is optional.

### 2.5 E2E test

- Test mode: create test user → checkout via Payment Link → webhook fires → tier updated → sign in → Pro features visible (Wins Report, offline). Use Stripe test card 4242 4242 4242 4242.

---

## 3. Final Polish & Launch Week (Last Week of Feb)

- **Beta outreach:** Email/DM early users (e.g. free 3 months Supporter).
- **Promo:** Update PROMO-COPY.md with Battle Pro launch tease; post on X/FB.
- **Backup:** Export Supabase schema/data.
- **Soft launch:** Roll out to small group first.
- **Monitor:** Supabase usage + Stripe dashboard for first payments.

---

## Reference

- **Task list & scope:** NEXT-STEPS-MARCH.md  
- **Capacity:** CAPACITY.md  
- **Implementation order:** NEXT-STEPS-MARCH.md § "Suggested implementation order"  
- Code snippets for webhook, isProUser(), cron SQL on request.
