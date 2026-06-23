# Deploy All 5 — Stripe, Supabase, Cron, Suggest, Monitoring

One-stop checklist for the 5 remaining launch items. Run in order.

---

## 1. Stripe Webhook

**What:** Deploy `stripe-webhook` Edge Function so payments unlock Pro.

**Steps:**

```bash
# 1. Log in to Supabase (if not already)
npx supabase login

# 2. Link project (if not already)
npx supabase link --project-ref YOUR_PROJECT_REF

# 3. Set secrets (get these from Stripe Dashboard + Supabase)
npx supabase secrets set STRIPE_WEBHOOK_SECRET=whsec_xxx
npx supabase secrets set STRIPE_SECRET_KEY=sk_live_xxx
npx supabase secrets set STRIPE_SECRET_KEY_TEST=sk_test_xxx   # for test mode
# SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are usually auto-set

# 4. Deploy
npx supabase functions deploy stripe-webhook
```

**Stripe Dashboard:**
- Developers → Webhooks → Add endpoint
- URL: `https://YOUR_PROJECT_REF.supabase.co/functions/v1/stripe-webhook`
- Events: `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`
- Copy signing secret → use as `STRIPE_WEBHOOK_SECRET`

**Test:** `stripe listen --forward-to https://YOUR_PROJECT_REF.supabase.co/functions/v1/stripe-webhook` then `stripe trigger checkout.session.completed`

---

## 2. Supabase SQL (Core Tables)

**What:** Create `profiles` (tier), `battle_pro_subscriptions`, `prayers` + RPCs, `daily_battles`.

**Steps:**

1. Supabase Dashboard → SQL Editor → New query
2. Copy-paste contents of `scripts/run-supabase-core.sql`
3. Run

Or run the individual files in order:
- `supabase-profiles-tier.sql`
- `supabase-battle-pro.sql`
- `supabase-prayers.sql`
- `supabase-daily-battles.sql`

---

## 3. Daily Verse Cron

**What:** Ensure today's verse exists every day at midnight UTC.

**Option A — GitHub Actions (recommended):**

1. Add repo secrets: `SUPABASE_URL` (e.g. `https://xxxx.supabase.co`)
2. The workflow `.github/workflows/seed-daily-battle.yml` runs daily at 00:05 UTC
3. It calls `seed-daily-battle` Edge Function

**Deploy the function first (recommended):**
```bash
./scripts/deploy-seed-function.sh
```

This guided script handles deployment + secret setup. See also `supabase/functions/seed-daily-battle/README.md`.

**Option B — pg_cron (Supabase Pro):**

Run `supabase-push-daily-verse-cron.sql` but change the URL to `seed-daily-battle` and the schedule to `0 0 * * *` (midnight UTC).

---

## 4. Suggest-Form Review

**What:** When submissions arrive, pull anonymized phrases and map them.

**Steps:**

```bash
SUPABASE_URL=https://YOUR_PROJECT.supabase.co \
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key \
npm run suggest:fetch
```

For last 30 days only:
```bash
SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... npm run suggest:fetch -- --days 30
```

**Output:** "Top 8 for mapping" line — paste into chat for one-pass mapping.

---

## 5. Monitoring + Cadence Reminder

**UptimeRobot (or similar):**
- Add monitor: `https://todaysdailybattle.com` (HTTP 200)
- Add monitor: `https://todaysdailybattle.com/pricing.html`
- Alert on 5xx or downtime

**Calendar reminder (every 1–2 months):**
- Run `docs/REVIEW-CADENCE-CHECKLIST.md`
- Pull suggest-form: `npm run suggest:fetch`
- Add mappings for top phrases

---

## Summary Order

| # | Item              | Time   | Blocks |
|---|-------------------|--------|--------|
| 1 | Stripe webhook    | 15 min | Payments → Pro |
| 2 | Supabase SQL      | 5 min  | Tables exist   |
| 3 | Daily cron        | 5 min  | Today's verse  |
| 4 | Suggest review    | On data| Coverage       |
| 5 | Monitoring        | 10 min | Alerts         |
