# create-checkout-session

Creates a Stripe Checkout Session with `metadata.user_id` and `metadata.tier` so the **stripe-webhook** can upgrade the correct user after payment. Use this when the user is **signed in**; for anonymous users you can still use static Payment Links (without metadata).

## Env

- `STRIPE_SECRET_KEY` or `STRIPE_SECRET_KEY_TEST`
- `SUPABASE_URL`
- `SUPABASE_ANON_KEY` (to validate the user’s JWT via Auth API)

## Request

- **Method:** POST
- **Headers:** `Authorization: Bearer <session.access_token>`, `Content-Type: application/json`
- **Body:** `{ "price_id": "price_xxxx", "tier": "battle_pro" }`  
  - `price_id` — Stripe Price ID (Dashboard → Products → [product] → copy Price ID).  
  - `tier` — optional; `supporter` | `battle_pro` | `church`. Default `battle_pro`.

## Response

- **200:** `{ "url": "https://checkout.stripe.com/..." }` — redirect the user to `url`.
- **4xx/5xx:** `{ "error": "..." }`

## Frontend (pricing buttons)

When the user is signed in, call this function instead of opening a Payment Link:

```js
// After supabase.auth.getSession() or onAuthStateChange
const { data: { session } } = await supabase.auth.getSession();
if (!session?.access_token) {
  // Not signed in — redirect to Payment Link or show "Sign in to subscribe"
  window.location.href = TDB_GET_STRIPE_LINK('battle_pro', 'monthly');
  return;
}
const res = await fetch('https://<PROJECT_REF>.supabase.co/functions/v1/create-checkout-session', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + session.access_token },
  body: JSON.stringify({ price_id: 'price_xxxx', tier: 'battle_pro' })
});
const data = await res.json();
if (data.url) window.location.href = data.url;
else console.error(data.error);
```

Store your Stripe Price IDs in config (e.g. `STRIPE_PRICE_BATTLEPRO_MONTHLY`) or pass them from the button (e.g. `data-price-id="price_xxx"`).

## Deploy

```bash
supabase functions deploy create-checkout-session
```

Set secrets in Dashboard → Edge Functions → create-checkout-session → Secrets: `STRIPE_SECRET_KEY` (or `STRIPE_SECRET_KEY_TEST`), `SUPABASE_ANON_KEY` (optional if already set at project level).

## CORS

The function sends `Access-Control-Allow-Origin: *`. For production you may want to restrict to your domain.
