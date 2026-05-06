# Turnstile go-live checklist

Use this when you’re ready to turn on abuse protection for Quick Pray. Code is already in place; you only need keys, deploy, and one test.

---

## Step 1: Create Turnstile widget (~5 min)

1. Go to [dash.cloudflare.com](https://dash.cloudflare.com) → select the account that owns **todaysdailybattle.com**.
2. In the left sidebar, open **Turnstile** (under "Website" or "Products").
3. Click **Add site** (or **Create widget**).
4. **Widget name:** e.g. `Quick Pray - todaysdailybattle`.
5. **Domain:** Add `todaysdailybattle.com` (and `localhost` if you test locally).
6. **Widget type:** **Managed** (recommended) or **Non-interactive** (fewer clicks, slightly less strict).
7. Click **Create**.
8. Copy and save:
   - **Site key** (public) → for `config.js`.
   - **Secret key** (private) → for Supabase Edge Function secrets only.

---

## Step 2: Set site key in config (~1 min)

- **Local / deploy:** In **config.js** set:
  ```js
  window.TDB_CONFIG.TURNSTILE_SITE_KEY = '0x4AAAAAAA...';  // your actual site key
  ```
- If you use **Cloudflare Pages env** or another build-time config, set `TURNSTILE_SITE_KEY` there and ensure it’s injected into the client config (e.g. same variable name in the blob that sets `TDB_CONFIG`).
- Commit and push **only if** you’re okay with the site key being in the repo (it’s public). Otherwise keep it in env / uncommitted config.

---

## Step 3: Deploy submit-prayer and set secrets (~5 min)

1. In the project root (where `supabase/functions` lives):
   ```bash
   supabase functions deploy submit-prayer
   ```
2. In [Supabase Dashboard](https://supabase.com/dashboard) → your project → **Edge Functions** → **submit-prayer** → **Secrets** (or **Manage** → **Secrets**).
3. Add these three (create new or edit):

   | Name | Value |
   |------|--------|
   | `TURNSTILE_SECRET_KEY` | Your Turnstile **secret** key from Step 1 |
   | `SUPABASE_URL` | `https://rixsnhpwrlbvvymkfamj.supabase.co` (or your project URL) |
   | `SUPABASE_SERVICE_ROLE_KEY` | From **Settings** → **API** → **Project API keys** → **service_role** (secret) |

4. Save. No need to redeploy the function after changing secrets; they’re read at runtime.

---

## Step 4: Deploy site (if config changed)

- If you changed **config.js** and deploy via git: push and wait for Cloudflare Pages (or your host) to finish.
- Purge cache if needed: **Caching** → **Configuration** → **Purge Everything**.

---

## Step 5: One end-to-end test (~2 min)

1. Open **https://todaysdailybattle.com** in a normal or incognito window. Hard refresh (Cmd+Shift+R).
2. Scroll to **Quick pray**.
3. **Check:** You should see the Turnstile widget (small Cloudflare box) under the Pray / Call God / Speak row.
4. **Without** completing the widget, type an intention and tap **Pray** → you should see a toast like *"Complete the verification below, then tap Pray."*
5. **Complete** the Turnstile challenge (tick or automatic), type an intention again, tap **Pray**.
6. **Check:** Toast "Added!"; prayer appears in the list; counter / echo / map update if you have those on the page.
7. **Optional:** Open Supabase → **Table Editor** → **prayers** → confirm the new row (intent, created_at).

If the widget never appears, confirm `TURNSTILE_SITE_KEY` is set in the config that the live site loads and that `SUBMIT_PRAYER_URL` is set (it’s derived from `SUPABASE_URL` in config). If verification always fails, check the three Edge Function secrets and Supabase **submit-prayer** logs.

---

## Done

Quick Pray is now protected by Turnstile and the **submit-prayer** Edge Function. For more detail see **ABUSE-PROTECTION.md** and **supabase/functions/submit-prayer/README.md**.
