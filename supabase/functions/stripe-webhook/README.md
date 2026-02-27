# stripe-webhook

Updates `profiles.tier` when Stripe sends `checkout.session.completed`.

## Stripe Dashboard

1. **Developers** → **Webhooks** → **Add endpoint**
2. **Endpoint URL:** `https://<YOUR_PROJECT_REF>.supabase.co/functions/v1/stripe-webhook`
3. **Events to send:** `checkout.session.completed` (add `customer.subscription.*` if you want to handle renewals/cancellations)
4. **Signing secret:** Copy it; set as `STRIPE_WEBHOOK_SECRET` in Supabase Edge Function secrets.

## Supabase secrets

In **Project Settings** → **Edge Functions** → **Secrets** (or via CLI):

- `STRIPE_WEBHOOK_SECRET` — from Stripe webhook endpoint (whsec_...)
- `STRIPE_SECRET_KEY` or `STRIPE_SECRET_KEY_TEST` — Stripe API secret key
- `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` are usually set by default.

## Payment Link metadata

When creating Payment Links in Stripe, add **metadata** so the webhook can identify the user and tier:

- `user_id` — Supabase auth user UUID (required). Pass it from your frontend when redirecting to Checkout (e.g. append to success_url or use Stripe Customer Portal / Checkout client_options).
- `tier` (optional) — `supporter` | `battle_pro` | `church`. Defaults to `battle_pro` if omitted. For **military discount** Payment Links ($1/mo, $10/yr), set `tier` to `battle_pro` so the webhook grants the same Pro access.

If you use Stripe Checkout with `client_reference_id` or allow signed-in users to pass `user_id` via the success URL, you may need a small frontend step that redirects to the Payment Link with that id in session; Stripe Payment Links support prefilled customer email but not custom metadata from the URL. Alternative: use Stripe Checkout API (create session server-side) so you can set `metadata.user_id` from the server.

## Deploy

```bash
supabase functions deploy stripe-webhook
```

## Test

Use Stripe CLI to forward events:

```bash
stripe listen --forward-to https://<PROJECT_REF>.supabase.co/functions/v1/stripe-webhook
```

Then trigger a test checkout; the CLI will show the signing secret to use for local testing.
