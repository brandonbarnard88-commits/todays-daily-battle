# Stripe / Battle Pro — step by step

Follow in order. Every action is spelled out.

---

## Step 1: Get 6 Price IDs from Stripe

### 1.1 Open Stripe and turn on test mode

1. Go to **https://dashboard.stripe.com** and log in.
2. In the **top-right** of the page, find the toggle that says **Test mode**.
3. Turn it **on** (it should show “Test mode” or an indicator that you’re in test mode).

### 1.2 Create products and prices (or use existing)

1. In the left sidebar, click **Product catalog** (or **Products**).
2. Click **+ Add product**.
3. **Name:** `Supporter`.
4. Add **two prices**:
   - **First price:** $5, **Monthly** recurring → Save → copy the **Price ID** (starts with `price_1...`) and label it “Supporter monthly.”
   - **Second price:** $50, **Yearly** recurring → Save → copy the **Price ID** and label it “Supporter yearly.”
5. Click **Save product** (if needed).
6. Repeat for:
   - **Battle Pro:** $10/month and $100/year → copy both Price IDs.
   - **Church:** $10/month and $100/year → copy both Price IDs.

You should have **6** Price IDs written down (e.g. in a note):

- Supporter monthly: `price_1...`
- Supporter yearly: `price_1...`
- Battle Pro monthly: `price_1...`
- Battle Pro yearly: `price_1...`
- Church monthly: `price_1...`
- Church yearly: `price_1...`

---

## Step 2: Put the 6 Price IDs into config.js

### 2.1 Open your project

1. Open the project in your editor (e.g. Cursor) at the folder that contains `config.js` and `scripts/`.

### 2.2 Option A — Use the script (recommended)

1. Open a terminal in the **project root** (the folder that has `config.js` and `scripts/`).
2. Run (replace the six values with your real Price IDs in this order: supporter monthly, supporter yearly, battle pro monthly, battle pro yearly, church monthly, church yearly):

   ```bash
   node scripts/fill-stripe-ids.js price_1XXX price_1XXX price_1XXX price_1XXX price_1XXX price_1XXX
   ```

3. You should see: `Updated config.js with STRIPE_PRICE_IDS.`
4. Open `config.js` and confirm the block `STRIPE_PRICE_IDS` has your six IDs.

### 2.3 Option B — Paste by hand

1. Open **config.js**.
2. Find the line that says `window.TDB_CONFIG.STRIPE_PRICE_IDS = {`.
3. Replace the whole block so it looks like this (with your real IDs):

   ```js
   window.TDB_CONFIG.STRIPE_PRICE_IDS = {
     supporter:  { monthly: 'price_1...', yearly: 'price_1...' },
     battle_pro: { monthly: 'price_1...', yearly: 'price_1...' },
     church:     { monthly: 'price_1...', yearly: 'price_1...' }
   };
   ```

4. Save the file.

### 2.4 Deploy the site

1. If you deploy via git: run `git add config.js`, `git commit -m "Add Stripe Price IDs"`, `git push`.
2. Wait for your host (e.g. Cloudflare Pages) to finish deploying.

---

## Step 3: Deploy the two Edge Functions

### 3.1 Open terminal in project root

1. Terminal should be in the folder that contains `supabase/` (and `supabase/functions/`).

### 3.2 Link Supabase (if not already)

1. Run: `supabase link`
2. If prompted, choose your project (e.g. **rixsnhpwrlbvvymkfamj**).
3. If it says already linked, continue.

### 3.3 Deploy create-checkout-session

1. Run: `supabase functions deploy create-checkout-session`
2. Wait until it says the function was deployed (and note the URL if shown).

### 3.4 Deploy stripe-webhook

1. Run: `supabase functions deploy stripe-webhook`
2. Wait until it says deployed.

---

## Step 4: Set secrets in Supabase

### 4.1 Open Supabase Dashboard

1. Go to **https://supabase.com/dashboard** and log in.
2. Open the project that matches your site (ref **rixsnhpwrlbvvymkfamj** or yours).

### 4.2 Get your Stripe secret key

1. In another tab, go to **https://dashboard.stripe.com** (still in **Test mode**).
2. Click **Developers** in the left sidebar → **API keys**.
3. Under **Standard keys**, copy the **Secret key** (starts with `sk_test_...`). Keep it somewhere safe (you’ll paste it twice in Supabase).

### 4.3 Get your Supabase anon key

1. Back in **Supabase Dashboard** → your project.
2. Click the **Settings** (gear) icon in the left sidebar → **API**.
3. Under **Project API keys**, copy the **anon** **public** key (long string starting with `eyJ...`). It should match what’s in your `config.js`.

### 4.4 Get your Supabase service_role key

1. On the same **Settings → API** page in Supabase.
2. Under **Project API keys**, find **service_role** and click **Reveal** (or copy). Copy the **service_role** key (also starts with `eyJ...`).  
   ⚠️ This is secret; never put it in frontend code or commit it. Only use it in Supabase Edge Function secrets.

### 4.5 Set secrets for create-checkout-session

1. In Supabase left sidebar, click **Edge Functions**.
2. Click the function **create-checkout-session**.
3. Open the **Secrets** (or **Manage** → **Secrets**) tab.
4. Add or edit:
   - **Name:** `STRIPE_SECRET_KEY` → **Value:** your `sk_test_...` key → Save.
   - **Name:** `SUPABASE_ANON_KEY` → **Value:** your anon key (`eyJ...`) → Save.

### 4.6 Set secrets for stripe-webhook (webhook secret comes in Step 5)

1. Click the function **stripe-webhook**.
2. Open **Secrets**.
3. Add or edit:
   - **Name:** `STRIPE_SECRET_KEY` → **Value:** same `sk_test_...` as above → Save.
   - **Name:** `SUPABASE_SERVICE_ROLE_KEY` → **Value:** the **service_role** key you copied → Save.
   - **Name:** `STRIPE_WEBHOOK_SECRET` → leave empty for now; you’ll paste it in Step 5 after creating the webhook.

---

## Step 5: Add the webhook endpoint in Stripe

### 5.1 Create the endpoint

1. Go to **https://dashboard.stripe.com** → **Developers** → **Webhooks** (still in **Test mode**).
2. Click **+ Add endpoint**.
3. **Endpoint URL:** paste exactly:
   ```text
   https://rixsnhpwrlbvvymkfamj.supabase.co/functions/v1/stripe-webhook
   ```
   (If your project ref is different, replace `rixsnhpwrlbvvymkfamj` with yours.)
4. Under **Events to send**, click **Select events**.
5. Search for or select **checkout.session.completed**. Optionally add **customer.subscription.created**.
6. Click **Add endpoint**.

### 5.2 Copy the signing secret

1. On the new endpoint’s page, find **Signing secret**.
2. Click **Reveal** and copy the value (starts with `whsec_...`).

### 5.3 Put it in Supabase

1. Go back to **Supabase Dashboard** → **Edge Functions** → **stripe-webhook** → **Secrets**.
2. Add or edit: **Name** = `STRIPE_WEBHOOK_SECRET`, **Value** = the `whsec_...` you just copied → Save.

---

## Step 6: Run one test checkout

### 6.1 Sign in on the site

1. Open **https://todaysdailybattle.com** (or your live URL).
2. Sign in with an account you can look up in Supabase (e.g. the email you use for the dashboard).

### 6.2 Open pricing and DevTools

1. Go to **https://todaysdailybattle.com/pricing.html**.
2. Open **DevTools** (F12 or right‑click → Inspect).
3. Open the **Network** tab. Optional: type `create-checkout` in the filter box.

### 6.3 Click Subscribe

1. Click the button for **Battle Pro $10/mo** (or any “Subscribe” button).
2. In Network, you should see a **POST** request to `create-checkout-session` with status **200** and a response like `{ "url": "https://checkout.stripe.com/..." }`.
3. The page should **redirect** to **checkout.stripe.com**.

### 6.4 Pay with test card

1. On Stripe Checkout, use:
   - **Card number:** `4242 4242 4242 4242`
   - **Expiry:** `12/34` (any future date)
   - **CVC:** `123`
2. Fill any other required fields, then complete the payment.

### 6.5 Confirm redirect and tier

1. You should be redirected back to your site (e.g. pricing page with a success message).
2. Wait **about 30 seconds**.
3. **Refresh** the page.
4. Open **Supabase Dashboard** → your project → **Table Editor** → **profiles**.
5. Find the row for your user (by email or id). The **tier** column should be **battle_pro** (or the plan you bought).

If anything doesn’t match (e.g. 401, 400, no redirect, tier not updated), see **BATTLE-PRO-QUICK-PROMPTS.md** → “Common failure modes and fixes.”

---

## Quick reference

| Step | What you do |
|------|------------------|
| 1 | Stripe test mode → create 3 products, 2 prices each → copy 6 Price IDs. |
| 2 | Run fill script or paste IDs into config.js → deploy site. |
| 3 | Terminal: `supabase link`, then deploy `create-checkout-session` and `stripe-webhook`. |
| 4 | Supabase: set secrets for both functions (Stripe key, anon key, service_role key; webhook secret in Step 5). |
| 5 | Stripe: Add webhook endpoint (stripe-webhook URL) → copy signing secret → set STRIPE_WEBHOOK_SECRET in Supabase. |
| 6 | Sign in → pricing → Subscribe → pay 4242… → check profiles.tier in Supabase. |
