# Stripe Payment Links → config.js

Add your Stripe Payment Link URLs to `config.js` so the pricing page buttons open Stripe Checkout.

---

## 1. Create products and Payment Links in Stripe

1. Log in to [dashboard.stripe.com](https://dashboard.stripe.com); turn **Test mode** on (toggle top-right) for testing.
2. **Product catalog** → **+ Add product** for each tier:
   - **Supporter:** $5/month recurring, $50/year recurring.
   - **Battle Pro:** $10/month recurring, $100/year recurring.
   - **Church/Team:** $10/month recurring, $100/year recurring (beta).
3. For each price, create a **Payment Link:** open the product/price → **Create payment link** → set success URL (e.g. `https://todaysdailybattle.com/pricing.html?success=1`) → copy the link URL (`https://buy.stripe.com/...`).

---

## 2. Paste URLs into config.js

Open `config.js` and set (replace empty strings with your links):

```js
STRIPE_SUPPORTER_MONTHLY_LINK: 'https://buy.stripe.com/...',  // Supporter $5/mo
STRIPE_SUPPORTER_YEARLY_LINK: 'https://buy.stripe.com/...',   // Supporter $50/yr
STRIPE_BATTLEPRO_MONTHLY_LINK: 'https://buy.stripe.com/...', // Battle Pro $10/mo
STRIPE_BATTLEPRO_YEARLY_LINK: 'https://buy.stripe.com/...',   // Battle Pro $100/yr
STRIPE_CHURCH_MONTHLY_LINK: 'https://buy.stripe.com/...',     // Church $10/mo
STRIPE_CHURCH_YEARLY_LINK: 'https://buy.stripe.com/...',      // Church $100/yr
```

**Do not commit secret keys.** Use env vars or a build step for production if config.js is in the repo; keep `STRIPE_SECRET_KEY` server-side only (e.g. webhook).

---

## 3. Wire checkout return URL

In each Payment Link (Stripe Dashboard → Payment Links → [link] → edit), set **After payment** → **Redirect to a URL** to:

`https://todaysdailybattle.com/pricing.html?success=1`

(Use your real domain; for local testing you can use a local URL.)

---

## 4. Test

Open `/pricing.html`, click each Subscribe button. You should be sent to Stripe Checkout. Use test card `4242 4242 4242 4242`. After payment, redirect should show the “Thank you! Sign in above to unlock Battle Pro” message.

Next: webhook to write to `battle_pro_subscriptions` on payment (see NEXT-STEPS-MARCH.md).

---

## 5. Signed-in users: Price IDs + create-checkout-session (optional)

When the user is **signed in**, the pricing buttons call the **create-checkout-session** Edge Function so Stripe receives `metadata.user_id` and the webhook can update `profiles.tier` correctly.

1. In Stripe Dashboard → **Products** → each price has a **Price ID** (e.g. `price_1ABC...`). Copy all 6 (Supporter/Battle Pro/Church × monthly/yearly).
2. In `config.js`, set **STRIPE_PRICE_IDS** (already present as placeholders):
   ```js
   STRIPE_PRICE_IDS: {
     supporter: { monthly: 'price_xxx', yearly: 'price_xxx' },
     battle_pro: { monthly: 'price_xxx', yearly: 'price_xxx' },
     church: { monthly: 'price_xxx', yearly: 'price_xxx' }
   }
   ```
3. Deploy the Edge Function and set secrets (see `supabase/functions/create-checkout-session/README.md`):
   ```bash
   supabase functions deploy create-checkout-session
   ```
   Secrets: `STRIPE_SECRET_KEY` (or `_TEST`), `SUPABASE_ANON_KEY`.

**Flow:** Click Subscribe → if signed in and Price IDs + function URL exist → `TDB_GO_TO_CHECKOUT(tier, period)` calls the function with `session.access_token` and `price_id` → function returns Checkout URL with metadata → user pays → webhook updates `profiles.tier` → user refreshes and gets Pro. If not signed in or Price IDs missing, the button falls back to the Payment Link (no metadata).
