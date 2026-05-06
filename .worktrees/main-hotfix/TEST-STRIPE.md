# Test Stripe

Quick reference for testing Stripe (Payment Links, Checkout Session, webhook).

---

## 1. Automated check

```bash
node test-stripe.js
```

Verifies:

- `config.js` has **STRIPE_PRICE_IDS** (supporter, battle_pro, church × monthly, yearly).
- **create-checkout-session** URL is reachable (401/400/500 = expected without valid auth or keys).
- **pricing.html** has Subscribe/plan content.
- **script.js** wires `TDB_GO_TO_CHECKOUT` and create-checkout-session.

---

## 2. Test mode in Stripe

- Dashboard: [dashboard.stripe.com](https://dashboard.stripe.com) → turn **Test mode** ON (top-right).
- Use **test** Payment Links and **test** Price IDs in config.

---

## 3. Test cards (Stripe test mode)

| Card number         | Result        |
|---------------------|---------------|
| 4242 4242 4242 4242 | Success       |
| 4000 0000 0000 0002 | Declined      |
| 4000 0000 0000 9995 | Insufficient  |

Use any future expiry (e.g. 12/34), any CVC (e.g. 123), any postal code.

---

## 4. Payment Links (no sign-in)

1. Set **STRIPE_SUPPORTER_MONTHLY_LINK** (and others) in `config.js` to your Stripe Payment Link URLs.
2. Open **pricing.html** → click a Subscribe button → should redirect to Stripe Checkout.
3. Pay with **4242 4242 4242 4242**.
4. Redirect should land on `pricing.html?success=1`.

If links are empty, buttons show “Notify me” and scroll to waitlist.

---

## 5. Signed-in checkout (create-checkout-session)

1. Deploy the Edge Function and set secrets:
   ```bash
   supabase functions deploy create-checkout-session
   ```
   Secrets: **STRIPE_SECRET_KEY** (or STRIPE_SECRET_KEY_TEST), **SUPABASE_ANON_KEY**.

2. Sign in on the site → open **pricing.html** → click e.g. **Battle Pro $10/mo**.
3. In DevTools → Network: POST to `.../functions/v1/create-checkout-session` → **200** and body `{ "url": "https://checkout.stripe.com/..." }`.
4. Redirect to Stripe Checkout → pay with test card.
5. After redirect back, refresh; **profiles.tier** in Supabase should update (or wait for webhook).

See **BATTLE-PRO-TEST-CHECKLIST.md** for full steps and troubleshooting.

---

## 6. Webhook (stripe-webhook)

1. In Stripe Dashboard → **Developers → Webhooks** → Add endpoint:
   - URL: `https://<PROJECT_REF>.supabase.co/functions/v1/stripe-webhook`
   - Events: `checkout.session.completed`
2. Copy the **Signing secret** (`whsec_...`) into Supabase Edge Function secrets as **STRIPE_WEBHOOK_SECRET**.
3. Set **STRIPE_SECRET_KEY** (or _TEST) and **SUPABASE_SERVICE_ROLE_KEY** on the stripe-webhook function.

**Test webhook locally with Stripe CLI:**

```bash
stripe listen --forward-to https://<PROJECT_REF>.supabase.co/functions/v1/stripe-webhook
# In another terminal:
stripe trigger checkout.session.completed
```

Use the CLI’s webhook signing secret when testing locally.

---

## 7. Summary

| What              | How |
|-------------------|-----|
| Config & wiring   | `node test-stripe.js` |
| Payment Links     | Set links in config → click Subscribe on pricing.html → pay with 4242... |
| Signed-in flow    | Deploy create-checkout-session, set secrets, sign in → Subscribe → 200 + redirect |
| Webhook           | Stripe Dashboard endpoint + secrets; optional: `stripe listen` + `stripe trigger` |
