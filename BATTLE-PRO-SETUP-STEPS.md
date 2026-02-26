# Battle Pro setup — step-by-step

Do these **in order**. Allow about 30–60 minutes total.

**Before you start:** Use Stripe **Test mode** (toggle top-right) the whole time. Keep DevTools open (F12 → Network, filter by "checkout" or "functions") during the test. Have your test user **signed in** before step 5.

---

## Step 1: Get the 6 Price IDs from Stripe

**New to Stripe?** Sign up at [stripe.com](https://stripe.com) (email + password; no card required). Confirm email, then in the dashboard switch **Test mode** on (toggle top-right). Go to **Developers → API keys** and copy your **Secret key** (`sk_test_...`) — you’ll use it later as `STRIPE_SECRET_KEY` in Supabase. Then create the products below.

1. Go to [Stripe Dashboard](https://dashboard.stripe.com).
2. Turn **Test mode** on (toggle top right).
3. Open **Products** → **+ Add product** (or use existing products).
4. Create or use **3 products**, each with **2 prices** (monthly recurring, yearly recurring):

   | Product     | Monthly price | Yearly price |
   |------------|----------------|--------------|
   | Supporter  | $5/month       | $50/year     |
   | Battle Pro | $10/month      | $100/year    |
   | Church     | $10/month      | $100/year    |

5. For **each price**, open the price → copy the **Price ID** (starts with `price_1...`). You need **6** IDs total.
6. Optional: for each price you can also create a **Payment Link** (Products → price → **Create Payment Link**) and copy the URL — used as fallback for users not signed in.

---

## Step 2: Fill config.js

1. Open **`config.js`** in your project.
2. Find **`STRIPE_PRICE_IDS`** (around line 29).
3. Paste your 6 Price IDs:

   ```js
   window.TDB_CONFIG.STRIPE_PRICE_IDS = {
     supporter: { monthly: 'price_1XXXX...', yearly: 'price_1XXXX...' },
     battle_pro: { monthly: 'price_1XXXX...', yearly: 'price_1XXXX...' },
     church:     { monthly: 'price_1XXXX...', yearly: 'price_1XXXX...' }
   };
   ```

4. If you created Payment Links, paste their URLs into the matching keys:
   - `STRIPE_SUPPORTER_MONTHLY_LINK`, `STRIPE_SUPPORTER_YEARLY_LINK`
   - `STRIPE_BATTLEPRO_MONTHLY_LINK`, `STRIPE_BATTLEPRO_YEARLY_LINK`
   - `STRIPE_CHURCH_MONTHLY_LINK`, `STRIPE_CHURCH_YEARLY_LINK`
5. Save the file.
6. Commit and push (Cloudflare will deploy automatically):

   ```bash
   git add config.js
   git commit -m "Add Stripe Price IDs and optional Payment Links"
   git push
   ```

**Alternative — script fills config for you:** From project root, run (replace with your real `price_1...` IDs):

```bash
node scripts/fill-stripe-ids.js price_1SupporterMo price_1SupporterYr price_1BattleProMo price_1BattleProYr price_1ChurchMo price_1ChurchYr
```

Then commit and push `config.js` as above. Payment Link URLs still need to be pasted by hand into the `STRIPE_*_LINK` keys if you use them.

---

## Step 3: Run both SQL scripts in Supabase

1. Go to [Supabase Dashboard](https://supabase.com/dashboard) and open your project (**rixsnhpwrlbvvymkfamj**).
2. Open **SQL Editor** → **New query**.
3. Open **`supabase-profiles-tier.sql`** from your repo. Copy its full contents, paste into the SQL Editor, click **Run**. Check for errors (none = good).
4. New query again. Open **`supabase-prayers-anon-read.sql`**, copy all, paste, **Run**. No errors = done.

Takes under 2 minutes.

---

## Step 4: Deploy both Edge Functions and set secrets

### 4a. Deploy from terminal

In your project root (where `supabase/functions` lives):

```bash
supabase functions deploy create-checkout-session
supabase functions deploy stripe-webhook
```

If you’re not linked to the project, run `supabase link` first and choose your project.

### 4b. Set secrets in Supabase Dashboard

1. In Supabase Dashboard go to **Edge Functions**.
2. Click **create-checkout-session** → **Secrets** (or **Manage** → **Secrets**).
3. Add:
   - **STRIPE_SECRET_KEY** = your Stripe test secret key (`sk_test_...` from Stripe Dashboard → Developers → API keys).
   - **SUPABASE_ANON_KEY** = your Supabase anon key (same as in `config.js`: `SUPABASE_ANON_KEY`).
4. Click **stripe-webhook** → **Secrets**.
5. Add:
   - **STRIPE_SECRET_KEY** = same `sk_test_...`.
   - **STRIPE_WEBHOOK_SECRET** = from Stripe: **Developers** → **Webhooks** → **Add endpoint**:
     - **Endpoint URL:** `https://rixsnhpwrlbvvymkfamj.supabase.co/functions/v1/stripe-webhook`
     - **Events:** select `checkout.session.completed` (and optionally `customer.subscription.created` for renewals).
     - After saving, open the endpoint and copy the **Signing secret** (`whsec_...`). Paste that as **STRIPE_WEBHOOK_SECRET**.
   - **SUPABASE_SERVICE_ROLE_KEY** = from Supabase Dashboard → **Settings** → **API** → **Project API keys** → `service_role` (secret). Required so the webhook can upsert `profiles.tier`; do not use the anon key here.

---

## Step 5: Run one signed-in test checkout

1. Open **https://todaysdailybattle.com/pricing.html** (or your staging URL).
2. **Sign in** with your account.
3. Open DevTools → **Network** tab (F12 → Network).
4. Click **Subscribe** on e.g. **Battle Pro — $10/month**.
5. Check:
   - A **POST** request to **`/functions/v1/create-checkout-session`** returns **200**.
   - You are **redirected** to `checkout.stripe.com`.
6. On Stripe Checkout use the test card:
   - **Card:** `4242 4242 4242 4242`
   - **Expiry:** e.g. `12/34`
   - **CVC:** e.g. `123`
7. Complete payment. You should be redirected back to your site.
8. Wait **10–60 seconds**, then **refresh** the page.
9. Confirm:
   - **Wins Report** is visible (or Pro content unlocked).
   - **Offline / Armor** (or other Pro-only areas) are accessible.
   - In **Supabase** → **Table Editor** → **profiles** → find your row → **tier** = `battle_pro` (or the tier you bought).

If anything fails (no redirect, 401/400/500, tier not updating):

- **No POST or 401** → wrong secrets or JWT validation; check STRIPE_SECRET_KEY and SUPABASE_ANON_KEY.
- **400 from function** → Price ID invalid or missing; check STRIPE_PRICE_IDS in config.
- **Tier not updating** → webhook not firing or wrong secrets; check Supabase → Edge Functions → stripe-webhook → **Logs**. Ensure **STRIPE_WEBHOOK_SECRET** and **STRIPE_SECRET_KEY** are set, and **SUPABASE_SERVICE_ROLE_KEY** (not anon) is set so the webhook can update `profiles`.

Share the exact status code, response body, or webhook log and we can fix it fast.

---

## After the test passes

- **Battle Pro is live in test mode.**  
- When ready for real payments: switch to **live** keys in Stripe, set live **STRIPE_SECRET_KEY** and **STRIPE_WEBHOOK_SECRET** (new webhook endpoint for live mode) in Supabase.
- Update site banner/copy to “Battle Pro now available” and post one announcement (e.g. from PROMO-COPY.md).
