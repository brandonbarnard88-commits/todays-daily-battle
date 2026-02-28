# stripe-webhook

Updates `profiles.tier` when Stripe sends subscription events:

- **checkout.session.completed** — Grant Pro (or supporter/church) when checkout succeeds.
- **customer.subscription.deleted** — Revoke access when the user cancels.
- **customer.subscription.updated** — Revoke access when status is `canceled`, `unpaid`, or `past_due` (e.g. failed payment).

## Stripe Dashboard

1. **Developers** → **Webhooks** → **Add endpoint**
2. **Endpoint URL:** `https://<YOUR_PROJECT_REF>.supabase.co/functions/v1/stripe-webhook`
3. **Events to send:** `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`
4. **Signing secret:** Copy it; set as `STRIPE_WEBHOOK_SECRET` in Supabase Edge Function secrets.

## Supabase secrets

In **Project Settings** → **Edge Functions** → **Secrets** (or via CLI):

- `STRIPE_WEBHOOK_SECRET` — from Stripe webhook endpoint (whsec_...)
- `STRIPE_SECRET_KEY` or `STRIPE_SECRET_KEY_TEST` — Stripe API secret key
- `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` are usually set by default.

## Payment Link metadata

When creating Payment Links in Stripe, add **metadata** so the webhook can identify the user and tier:

- `user_id` — Supabase auth user UUID (required). Pass it from your frontend when redirecting to Checkout (e.g. append to success_url or use Stripe Customer Portal / Checkout client_options).
- `tier` (optional) — `supporter` | `battle_pro` | `church`. Defaults to `battle_pro` if omitted. For **military discount** Payment Links ($1/mo, $10/yr), set `tier` to `battle_pro` so the webhook grants the same Pro access. Set the Payment Link **success URL** to include `&military=1` (e.g. `https://yoursite.com/pricing.html?success=1&military=1`) so returning subscribers see "Welcome Home" on the thank-you message.

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

**Quick sanity check:**

- Ensure `STRIPE_WEBHOOK_SECRET` is set in Supabase Edge Function secrets (from Stripe Dashboard → Developers → Webhooks → your endpoint).
- create-checkout-session already passes `metadata: { user_id, tier }` and `subscription_data.metadata`, so the webhook knows who to unlock/revoke.
- Test with Stripe CLI in test mode; watch logs for "Battle Pro unlocked" (checkout) and "tier: free" (cancel/updated).
- After it works: deploy, flip Stripe to live, test a real sub in incognito, confirm user gets instant access.

## Security

**RLS reminder (other tables):** For `newsletter_signups`, use anon INSERT only and no anon SELECT. Example: see `supabase-newsletter-anon-insert.sql` in the repo.

- **Webhook signature verification:** Required. Every request is verified with `stripe.webhooks.constructEventAsync(body, signature, webhookSecret)`; invalid signature returns 400. Do not process payloads without verifying the signature.
- **No user_id:** If the event has no `user_id` in metadata, we return 200 with an error body so we don’t leak internals and Stripe doesn’t retry.
- **Idempotency:** Tier updates are done via upsert on `profiles` by `id`, so duplicate events don’t double-grant.
