# Stripe live checklist (Payment Links → webhook → user status)

Use this after you’ve created products/prices and Payment Links in the Stripe Dashboard.

---

## 1. Plug in Stripe links (config)

1. In **Stripe Dashboard** → **Product catalog** (or **Payment Links**), create or copy:
   - Supporter: monthly + yearly Payment Link URLs
   - Battle Pro: monthly + yearly
   - Church: monthly + yearly
   - (Optional) Military: $1/mo and $10/yr Payment Links

2. In **config.js** (or env vars that build-config.js uses), set:
   - `STRIPE_SUPPORTER_MONTHLY_LINK` (or `STRIPE_SUPPORTER_MONTHLY_URL`)
   - `STRIPE_SUPPORTER_YEARLY_LINK`
   - `STRIPE_BATTLEPRO_MONTHLY_LINK`
   - `STRIPE_BATTLEPRO_YEARLY_LINK`
   - `STRIPE_CHURCH_MONTHLY_LINK`
   - `STRIPE_CHURCH_YEARLY_LINK`
   - (Optional) `STRIPE_BATTLEPRO_MILITARY_MONTHLY_LINK`, `STRIPE_BATTLEPRO_MILITARY_YEARLY_LINK`

3. Redeploy or refresh so the live site has these values. The homepage Battle Pro banner will switch from “Launching soon” to “Battle Pro now available—Unlock now” when all main links are set.

---

## 2. Test with test card (test mode)

1. Put Stripe in **Test mode** (toggle in Dashboard).
2. On your site, go to **Pricing** and click e.g. **Subscribe $10/mo (beta)** for Battle Pro.
3. You should land on **Stripe Checkout**. Use test card **4242 4242 4242 4242**, any future expiry, any CVC, any billing details.
4. Complete payment.

**For “Apply upgrade to my account” you need either:**

- **Option A — Payment Links with metadata:** When creating the Payment Link, add metadata `user_id` (and optionally `tier`) if your flow can pass the logged-in user’s ID (e.g. via success_url or a server step). The webhook reads `metadata.user_id` and updates that user’s tier.
- **Option B — Checkout Session API:** Use the **create-checkout-session** Edge Function (and `STRIPE_PRICE_IDS` + `CREATE_CHECKOUT_SESSION_URL` in config) so the app creates a session with `metadata.user_id` from the current Supabase user. Then the webhook flips that user to Pro.

If you’re using **Payment Links only** (no create-checkout-session), the redirect after payment may not attach the current user. In that case, document “Subscribe then log in; we’ll match by email or send a manual upgrade” until you add Option B or pass `user_id` into the link.

---

## 3. Webhook sync (flip user status)

1. **Stripe Dashboard** → **Developers** → **Webhooks** → **Add endpoint**.
2. **URL:** `https://YOUR-PROJECT.supabase.co/functions/v1/stripe-webhook` (replace with your Supabase project ref).
3. **Events:** `checkout.session.completed` (and optionally `customer.subscription.created` / `updated` / `deleted`).
4. Copy the **Signing secret** (starts with `whsec_`).
5. In **Supabase** → **Edge Functions** → **stripe-webhook** → **Secrets**, set:
   - `STRIPE_WEBHOOK_SECRET` = that signing secret
   - `STRIPE_SECRET_KEY` or `STRIPE_SECRET_KEY_TEST` = your Stripe secret key

6. Deploy the function:  
   `supabase functions deploy stripe-webhook`

When a subscription is paid, Stripe sends `checkout.session.completed`. The webhook reads `metadata.user_id` and `metadata.tier` (or defaults to `battle_pro`) and updates `profiles.tier` (and optionally `battle_pro_subscriptions`) so the user gets Pro.

**Test:** After a test payment, check Supabase **profiles** (or **battle_pro_subscriptions**) for the test user; tier should be updated. Then log in on the site and confirm the “Battle Pro: Active” badge or Pro features appear.

---

## 4. Live mode (when ready)

1. Create **live** products/prices and **live** Payment Links in Stripe (switch off Test mode).
2. Update **config** with the **live** Payment Link URLs.
3. Add a **live** webhook endpoint in Stripe (same URL, live signing secret) and set `STRIPE_WEBHOOK_SECRET` and `STRIPE_SECRET_KEY` (live) in Supabase secrets.
4. Run one real payment (small amount or annual) and confirm webhook runs and user status flips.

---

## Quick checklist

| Step | Done |
|------|------|
| Payment Link URLs in config (Supporter, Battle Pro, Church; optional Military) | |
| Test payment with 4242 4242 4242 4242 → Checkout completes | |
| Webhook endpoint added in Stripe, secret in Supabase | |
| After test payment, user’s tier updated in Supabase | |
| Site shows “Battle Pro: Active” (or Pro features) for that user | |
| (Optional) Live mode: live links + live webhook → real payment test | |
