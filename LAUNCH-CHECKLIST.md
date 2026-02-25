# Launch checklist — what to do and how

Step-by-step breakdown so you can execute and ship. Do **Phase 0** first, then **Phase 1** for Battle Pro, then **Phase 2** to confirm everything works.

---

## Phase 0 — Already done (no action)

- [x] **CSP** — Inline scripts/styles use nonce; `fetch-prayer-guard.js` external; 404 and print pages fixed.
- [x] **Deploy** — Push all changes (including `fetch-prayer-guard.js`, `_headers`, HTML/JS) and deploy to Cloudflare Pages.

---

## Phase 1 — Battle Pro (Stripe + Pro detection)

### 1.1 Create Stripe products and Payment Links

**What:** Six Stripe Payment Links so users can pay for Supporter, Battle Pro, and Church plans.

**How:**

1. Log in to [Stripe Dashboard](https://dashboard.stripe.com) → **Product catalog** → **Add product**.
2. Create these products/prices (you can do 3 products with 2 prices each, or 6 separate products):

   | Product       | Price 1    | Price 2   |
   |---------------|------------|-----------|
   | Supporter     | $5/month   | $50/year  |
   | Battle Pro    | $10/month  | $100/year |
   | Church (beta) | $10/month  | $100/year |

3. For each price: **Create Payment Link**.
   - Set **After payment** → “Go to a website” → e.g. `https://todaysdailybattle.com/pricing.html?success=1`.
   - Copy the link URL (looks like `https://buy.stripe.com/...`).

4. You’ll have **6 URLs**. Keep them handy for the next step.

---

### 1.2 Put Stripe URLs in config

**What:** Site reads Stripe Payment Link URLs from config so “Upgrade” buttons open checkout.

**How:**

1. Open **`config.js`** in the repo (or set env vars in Cloudflare Pages if you use `build-config.js`).
2. Set these (use your real Payment Link URLs):

```js
STRIPE_SUPPORTER_MONTHLY_LINK: 'https://buy.stripe.com/xxxxx',
STRIPE_SUPPORTER_YEARLY_LINK: 'https://buy.stripe.com/xxxxx',
STRIPE_BATTLEPRO_MONTHLY_LINK: 'https://buy.stripe.com/xxxxx',
STRIPE_BATTLEPRO_YEARLY_LINK: 'https://buy.stripe.com/xxxxx',
STRIPE_CHURCH_MONTHLY_LINK: 'https://buy.stripe.com/xxxxx',
STRIPE_CHURCH_YEARLY_LINK: 'https://buy.stripe.com/xxxxx',
```

3. **If you deploy with env:** In Cloudflare Pages → **Settings** → **Environment variables**, add the same names with `_LINK` or `_URL` (script accepts both). Ensure your build runs `node build-config.js` so `config.js` is generated from env.
4. Redeploy after changing config.

---

### 1.3 Pro detection: Supabase table + who writes to it

**What:** When someone pays, they must get a row in `battle_pro_subscriptions` so the site shows them as Pro (Wins Report, offline, etc.).

**How:**

1. **Create the table (if not already):**
   - Supabase Dashboard → **SQL Editor** → New query.
   - Paste and run the contents of **`supabase-battle-pro.sql`** in this repo.
   - That creates `battle_pro_subscriptions` and RLS.

2. **Decide how rows get created after payment (pick one):**

   **Option A — Stripe webhook (recommended for scale)**  
   - In Stripe Dashboard → **Developers** → **Webhooks** → **Add endpoint**.  
   - URL: your Supabase Edge Function or a small backend that has the **service_role** key.  
   - Event: `checkout.session.completed`.  
   - In the handler: get customer email (and optionally `client_reference_id` = user_id). Create or get Supabase user_id from email, then INSERT into `battle_pro_subscriptions` (user_id, email, stripe_customer_id, plan, etc.). Use Supabase **service_role** so the insert is allowed.

   **Option B — Manual for first subscribers**  
   - After a customer pays, open Supabase Dashboard → **Table Editor** → `battle_pro_subscriptions` → **Insert row**.  
   - Fill: `user_id` (from **Authentication** → Users → copy their UUID), `email`, `plan` = `'supporter'` or `'pro'` or `'church'`, `wins_report_unlocked` = true, `offline_downloads_enabled` = true.

3. **Plan values:** The app treats `subscriptionTier` as `pro`, `supporter`, or `church_team`. It reads `plan` from the table. Right now it maps:
   - `church` / `church_team` → `church_team`
   - `supporter` → `supporter`
   - Anything else leaves tier as-is (free). So if you want “Battle Pro” to show as Pro, either:
   - Insert `plan = 'supporter'` for Battle Pro customers (they’ll get Pro features), or  
   - Insert `plan = 'pro'` and add a line in `script.js` in `fetchBattleProStatus` where it sets `subscriptionTier` (e.g. `row.plan === 'pro' || row.plan === 'battlepro' ? 'pro' : ...`) so `pro` is recognized.

---

### 1.4 Test checkout and Pro experience

**What:** Confirm payment flow and that Pro users see gated features.

**How:**

1. **Test card:** Use Stripe test card `4242 4242 4242 4242`, any future expiry, any CVC.
2. On **pricing.html** click a plan (e.g. Supporter monthly) → should open Stripe Checkout.
3. Complete payment → should redirect back to your success URL (e.g. `pricing.html?success=1`).
4. Sign in with the same email you used in Checkout.
5. Add a row in `battle_pro_subscriptions` for that user (Option B above) with `plan = 'supporter'` (or `pro` if you added the mapping).
6. Refresh the site (or re-open in incognito and sign in again). You should see:
   - “Battle Pro: Active” (or similar) badge,
   - Wins Report unlocked,
   - “Download for offline (Pro)” visible and working when online.
7. Optional: turn on “Battle Pro now available” banner in script if all Stripe URLs are set (see NEXT-STEPS-MARCH § ACTIVATION).

---

## Phase 2 — Verification (site ready for users)

**What:** Quick pass so the live site feels solid.

**How:** Open the site in **incognito**, do a **hard refresh** (Cmd+Shift+R / Ctrl+Shift+R), then run through:

| Check | How |
|-------|-----|
| **Total prayers** | Home or Prayer Wall shows a number or "—", not stuck "Loading…". |
| **Map** | Map area shows gradient + gold border, no 404 for an image. |
| **KJV audio** | Click audio on a verse → opens Bible Gateway (e.g. Philippians 4:7). |
| **Echo / presence** | Prayer Wall shows real numbers or "You're alone with Him" when empty. |
| **Armor modal, Kids Corner, Patriotic Scriptures** | Open each from the UI; they load and behave. |
| **Light mode** | Toggle to light mode; buttons have gold hover. |
| **Mobile footer** | Resize to &lt;480px; footer links stack vertically. |

**If something fails:**

- **Prayer counter / echo:** Ensure **`supabase-prayers.sql`** has been run in Supabase (SQL Editor). It defines `get_total_prayer_count` and `get_prayer_presence_count`.
- **KJV audio 404:** In script.js find where the verse audio link is built (Bible Gateway URL) and fix the pattern so it matches the verse reference.

---

## Phase 3 — Daily verse content (so “today” always has a verse)

**What:** The homepage “daily battle” uses the `daily_battles` table. If today’s row is missing, the app falls back to a client-side default. To avoid that, seed today every day.

**How:**

1. **Table:** Ensure **`supabase-daily-battles.sql`** (and any seed script you use) has been run in Supabase.
2. **Seed function:** You have a Supabase Edge Function `seed-daily-battle` that inserts today’s row if missing (e.g. default verse Psalm 46:1 + default reflection/prayer).
3. **Cron:** Call that function **once per day** (e.g. midnight UTC):
   - **Option A:** Supabase cron (if available in your plan) to trigger the Edge Function.
   - **Option B:** External cron (e.g. cron-job.org, GitHub Actions) that does `POST https://your-project.supabase.co/functions/v1/seed-daily-battle` with the right auth.
4. **Optional:** Use a spreadsheet or admin UI to set `verse_ref`, `reflection`, `prayer` for specific dates so key days are curated.

---

## Phase 4 — Optional before announce

| Item | How |
|------|-----|
| **Walkthrough video** | Record a short Loom/YouTube; put URL in config as `WALKTHROUGH_VIDEO_URL`. |
| **Homepage banner** | When Stripe URLs are set, script can show “Battle Pro now available” (see NEXT-STEPS-MARCH § ACTIVATION). |
| **Announce** | Email waitlist + one social post when you’re ready (copy ideas in NEXT-STEPS-MARCH). |

---

## Summary order

1. **Phase 0** — Already done (CSP + deploy).
2. **Phase 1** — Stripe products & Payment Links → config → Supabase table + webhook or manual insert → test checkout and Pro.
3. **Phase 2** — Run verification list in incognito; fix prayer RPC/map/audio if needed.
4. **Phase 3** — Daily cron for `seed-daily-battle` so today always has a verse.
5. **Phase 4** — Optional video/banner/announce when you’re ready for the masses.

Once Phase 1–3 are done and Phase 2 passes, the site is ready for the masses from a stability and payments standpoint.
