# Battle Pro — Quick reference (config, deploy, test)

Copy-paste prompts and one-place answers for: filling config, deploy/secrets, and test checkout.

---

## 1. Fill config.js with your 6 Stripe Price IDs

When you have the 6 `price_1...` IDs from Stripe (test mode), use either the script or paste the block below.

### Option A: Run the fill script (recommended)

From project root (replace with your real IDs):

```bash
node scripts/fill-stripe-ids.js price_1SupporterMo price_1SupporterYr price_1BattleProMo price_1BattleProYr price_1ChurchMo price_1ChurchYr
```

Or with env vars:

```bash
STRIPE_SUPPORTER_MONTHLY=price_xxx STRIPE_SUPPORTER_YEARLY=price_xxx \
STRIPE_BATTLEPRO_MONTHLY=price_xxx STRIPE_BATTLEPRO_YEARLY=price_xxx \
STRIPE_CHURCH_MONTHLY=price_xxx STRIPE_CHURCH_YEARLY=price_xxx \
node scripts/fill-stripe-ids.js
```

Then commit: `git add config.js && git commit -m "Add Stripe Price IDs" && git push`

### Option B: Paste this block into config.js (replace placeholders)

Replace each `price_1...` with your actual Price ID from Stripe Dashboard → Products → [price] → ID.

```js
// Price IDs for create-checkout-session (signed-in flow with metadata).
window.TDB_CONFIG.STRIPE_PRICE_IDS = {
  supporter:  { monthly: 'price_1...', yearly: 'price_1...' },
  battle_pro: { monthly: 'price_1...', yearly: 'price_1...' },
  church:     { monthly: 'price_1...', yearly: 'price_1...' }
};
```

### Payment Link placeholders (fallback when not signed in)

Your `config.js` already has these keys; leave them empty or paste Stripe Payment Link URLs if you use them:

- `STRIPE_SUPPORTER_MONTHLY_LINK`, `STRIPE_SUPPORTER_YEARLY_LINK`
- `STRIPE_BATTLEPRO_MONTHLY_LINK`, `STRIPE_BATTLEPRO_YEARLY_LINK`
- `STRIPE_CHURCH_MONTHLY_LINK`, `STRIPE_CHURCH_YEARLY_LINK`

Structure matches `TDB_CONFIG`: `CREATE_CHECKOUT_SESSION_URL` is set from `SUPABASE_URL` in config.js (no change needed).

---

## 2. Deploy and secrets review

### Deploy commands

```bash
supabase functions deploy create-checkout-session
supabase functions deploy stripe-webhook
```

Run from project root (where `supabase/functions` lives). If not linked: `supabase link` and choose project **rixsnhpwrlbvvymkfamj**.

### Function URLs (project ref: rixsnhpwrlbvvymkfamj)

| Function | URL |
|----------|-----|
| create-checkout-session | `https://rixsnhpwrlbvvymkfamj.supabase.co/functions/v1/create-checkout-session` |
| stripe-webhook | `https://rixsnhpwrlbvvymkfamj.supabase.co/functions/v1/stripe-webhook` |

Use the **stripe-webhook** URL in Stripe Dashboard → Developers → Webhooks → Add endpoint.

### Secrets to set (Supabase Dashboard → Edge Functions → [function] → Secrets)

**create-checkout-session**

| Secret | Value | Notes |
|--------|--------|--------|
| `STRIPE_SECRET_KEY` | `sk_test_...` | From Stripe → Developers → API keys (test mode) |
| `SUPABASE_ANON_KEY` | `eyJ...` | Same as in config.js; used to validate user JWT |

**stripe-webhook**

| Secret | Value | Notes |
|--------|--------|--------|
| `STRIPE_SECRET_KEY` | `sk_test_...` | Same Stripe test secret |
| `STRIPE_WEBHOOK_SECRET` | `whsec_...` | From Stripe → Webhooks → [your endpoint] → Signing secret |
| `SUPABASE_SERVICE_ROLE_KEY` | `eyJ...` | From Supabase → Settings → API → `service_role` (not anon). **Required** so webhook can upsert `profiles.tier`. |

Important: the webhook uses **SUPABASE_SERVICE_ROLE_KEY**, not `SUPABASE_ANON_KEY`. Without it, the function returns 500 and tier won’t update.

### Common deploy/test gotchas

- **Wrong region** — Supabase Edge Functions run in the project region; no need to set region for these commands.
- **Secret typos** — Names are case-sensitive: `STRIPE_WEBHOOK_SECRET`, `SUPABASE_SERVICE_ROLE_KEY`.
- **Webhook events** — In Stripe, add event `checkout.session.completed` (optionally `customer.subscription.created` for renewals).
- **Live vs test** — Use test-mode keys and test-mode webhook endpoint until you switch to live.

---

## 3. Signed-in test checkout checklist

Use this when running one end-to-end test (sign in → button → function → Checkout → pay → webhook → tier).

- [ ] **Sign in** to the site (same user you’ll check in `profiles`).
- [ ] Open **/pricing.html** (e.g. https://todaysdailybattle.com/pricing.html).
- [ ] Open **DevTools → Network** (filter by “create-checkout-session” or “fetch”).
- [ ] Click **Battle Pro $10/mo** (or any Subscribe button).
- [ ] **Network:** POST to `.../functions/v1/create-checkout-session` → **200**, body `{ "url": "https://checkout.stripe.com/..." }`.
- [ ] **Redirect** to `checkout.stripe.com`.
- [ ] **Pay** with test card: **4242 4242 4242 4242** | **12/34** | **123**.
- [ ] After redirect back, wait **10–60 s** → **refresh**.
- [ ] **Confirm:** Wins Report / Pro content visible; **Supabase → Table Editor → profiles** → your row → **tier** = `battle_pro`.

### Test card (Stripe test mode)

| Field | Value |
|-------|--------|
| Card | 4242 4242 4242 4242 |
| Expiry | 12/34 (any future date) |
| CVC | 123 |

### Where to check after payment

- **profiles.tier**: Supabase Dashboard → Table Editor → **profiles** → find your user row → column **tier** = `battle_pro` (or the tier you bought).
- **Webhook logs**: Supabase → Edge Functions → **stripe-webhook** → Logs.

### Common failure modes and fixes

| Symptom | Likely cause | Fix |
|--------|----------------|-----|
| **401** on create-checkout-session | Missing/invalid JWT or wrong secrets | Set **STRIPE_SECRET_KEY** and **SUPABASE_ANON_KEY** on create-checkout-session. Ensure user is signed in and request sends `Authorization: Bearer <access_token>`. |
| **400** on create-checkout-session | Invalid or missing `price_id` | Check **STRIPE_PRICE_IDS** in config.js; use test-mode `price_1...` IDs. |
| **No webhook / tier not updating** | Webhook not called or wrong secret / missing service key | Stripe: endpoint URL = stripe-webhook URL above; events include `checkout.session.completed`. Supabase: **stripe-webhook** secrets = **STRIPE_SECRET_KEY**, **STRIPE_WEBHOOK_SECRET**, **SUPABASE_SERVICE_ROLE_KEY**. Check stripe-webhook Logs. |
| **500** from stripe-webhook | Missing **SUPABASE_SERVICE_ROLE_KEY** or RLS | Add **SUPABASE_SERVICE_ROLE_KEY** to stripe-webhook secrets; ensure `supabase-profiles-tier.sql` was run so `profiles` has `tier` column and RLS allows service role. |

---

## If you hit a snag

Paste the error or log and say which step you’re on, e.g.:

- **Deploy:** “I ran `supabase functions deploy create-checkout-session` and got: [paste]”
- **Test:** “POST to create-checkout-session returned 401 with body [paste]”
- **Webhook:** “Tier didn’t update; stripe-webhook logs: [paste]”

See also: **BATTLE-PRO-SETUP-STEPS.md** (full order of steps), **BATTLE-PRO-TEST-CHECKLIST.md** (concise checklist + debug table).
