# Stripe go-live — no code change

Your create-checkout-session and webhook already use env for keys and the frontend sends `price_id` from config. To flip from waitlist to real payments:

---

## 1. Stripe Dashboard (live mode)

- Turn **Test mode** off (toggle top-right).
- **Products** → Battle Pro Monthly ($9.99) → copy the **Price ID** (e.g. `price_1ABC...`). Do the same for Battle Pro Yearly ($99) if you use it.
- **Developers** → **Webhooks** → Add endpoint (or use existing) for **live**:
  - URL: `https://<YOUR_PROJECT_REF>.supabase.co/functions/v1/stripe-webhook`
  - Events: `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`
  - Copy the **Signing secret** (whsec_...) for this **live** endpoint.

---

## 2. Frontend: live price IDs

In `config.js`, set **STRIPE_PRICE_IDS** to your **live** price IDs (from step 1):

```js
window.TDB_CONFIG.STRIPE_PRICE_IDS = {
  supporter: { monthly: 'price_xxx', yearly: 'price_xxx' },
  battle_pro: { monthly: 'price_XXX_LIVE', yearly: 'price_XXX_LIVE' },  // paste live IDs
  church: { monthly: 'price_xxx', yearly: 'price_xxx' }
};
```

If you use a build or env, inject the live price IDs there instead so you don’t commit them.

---

## 3. Supabase Edge Function secrets

In **Supabase** → **Project Settings** → **Edge Functions** → **Secrets** (or CLI):

| Secret | Value |
|--------|--------|
| `STRIPE_SECRET_KEY` | Your **live** secret key (sk_live_...) from Stripe Dashboard → Developers → API keys |
| `STRIPE_WEBHOOK_SECRET` | The **live** webhook signing secret (whsec_...) from step 1 |

For **create-checkout-session**: it uses `STRIPE_SECRET_KEY` first, so once that’s live, checkout is live.  
For **stripe-webhook**: same `STRIPE_SECRET_KEY` and `STRIPE_WEBHOOK_SECRET` so it verifies and processes live events.

---

## 4. Redeploy

```bash
supabase functions deploy create-checkout-session
supabase functions deploy stripe-webhook
```

---

## 5. Test (incognito)

1. Open todaysdailybattle.com in incognito.
2. Sign in (or sign up).
3. Go to Pricing → click **Join Battle Pro – Start Your Free Month**.
4. You should land on Stripe **Checkout** (live), not the waitlist form.
5. Pay $9.99 (use a real card or Stripe test in live mode if you have test clocks).
6. After success redirect, confirm `profiles.tier` is updated (e.g. refresh and see Pro features or “Battle Pro: Active”).

If the button still opens the waitlist, the frontend is not calling the Edge Function (e.g. no session or CREATE_CHECKOUT_SESSION_URL/STRIPE_PRICE_IDS not set). Check the browser network tab when you click: you should see a POST to `.../functions/v1/create-checkout-session` with 200 and `{ url: "https://checkout.stripe.com/..." }`.

---

**Summary:** No checkout session “tweak code” is required. Flip by setting live price IDs in config, live secret + live webhook secret in Supabase, and redeploying the two functions.
