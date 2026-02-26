# Battle Pro — test checklist & debug

Use this when running the signed-in test checkout or when debugging deploy/test errors.

---

## Test checklist (Step 5)

- [ ] **Sign in** to the site (same user you’ll check in `profiles`).
- [ ] Open **https://todaysdailybattle.com/pricing.html** (or your deploy URL).
- [ ] Open **DevTools → Network** (filter by "fetch" or "create-checkout-session").
- [ ] Click **Battle Pro $10/mo** (or any Subscribe button).
- [ ] **Network:** POST to `/functions/v1/create-checkout-session` → **200**.
- [ ] **Redirect** to `checkout.stripe.com`.
- [ ] **Pay** with test card: `4242 4242 4242 4242` | `12/34` | `123`.
- [ ] After redirect back, wait **10–60 sec** → **refresh** page.
- [ ] **Confirm:** Wins Report / Offline / Armor visible; **Supabase → profiles** → your row → **tier** = `battle_pro`.

---

## What to watch in Network tab

| Request | Expected |
|--------|--------|
| POST `.../functions/v1/create-checkout-session` | Status **200**, response body `{ "url": "https://checkout.stripe.com/..." }` |
| Redirect | Browser goes to `checkout.stripe.com`. |
| After payment | Redirect back to your success/cancel URL. |

---

## Deploy URLs (project ref: rixsnhpwrlbvvymkfamj)

- **create-checkout-session:** `https://rixsnhpwrlbvvymkfamj.supabase.co/functions/v1/create-checkout-session`
- **stripe-webhook:** `https://rixsnhpwrlbvvymkfamj.supabase.co/functions/v1/stripe-webhook`

Stripe webhook endpoint: use the **stripe-webhook** URL above when adding the endpoint in Stripe Dashboard → Developers → Webhooks.

---

## Common failures and fixes

| Symptom | Likely cause | Fix |
|--------|----------------|-----|
| **No POST** or **401** on create-checkout-session | Wrong or missing secrets; JWT invalid | Set **STRIPE_SECRET_KEY** and **SUPABASE_ANON_KEY** on the function. Ensure user is signed in and token is sent as `Authorization: Bearer <token>`. |
| **400** from create-checkout-session | Invalid or missing Price ID | Check **STRIPE_PRICE_IDS** in config; use test-mode `price_1...` IDs. |
| **Redirect to Checkout** but **tier not updating** | Webhook not firing or wrong secret | In Stripe: Webhooks → endpoint URL = stripe-webhook URL above; events include `checkout.session.completed`. In Supabase: **stripe-webhook** secrets = **STRIPE_SECRET_KEY**, **STRIPE_WEBHOOK_SECRET** (`whsec_...`), **SUPABASE_SERVICE_ROLE_KEY** (service_role key, not anon). Check **stripe-webhook** Logs in Supabase. |
| **CORS** or **blocked request** | Function CORS / domain | create-checkout-session allows origin; if you restrict later, add your domain. |

---

## If you need to paste an error for debug

Paste:

- **Deploy:** Full terminal output of `supabase functions deploy ...`.
- **Test:** Status code + response body of the POST to create-checkout-session (or the failing request).
- **Webhook:** Supabase → Edge Functions → stripe-webhook → **Logs** (last few lines).

Plus: “I’m on step X” or “test checkout / deploy / secrets.”
