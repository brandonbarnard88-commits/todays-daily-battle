# Fix prayer 404s (prayers table + get_prayer_presence_count)

The app uses the **Supabase JS client** only. There are **no** `fetch('/prayers')` or relative URLs in this repo — every prayer/presence call is `supabaseClient.from('prayers')` or `.rpc('get_prayer_presence_count')`, and the client is created with `TDB_CONFIG.SUPABASE_URL` and `TDB_CONFIG.SUPABASE_ANON_KEY`, so requests already go to `https://YOUR_REF.supabase.co/rest/v1/prayers` and `/rpc/get_prayer_presence_count`.

**If a guide says "replace relative URLs with full Supabase URLs" — that does not apply here.** The 404s are because the **Supabase project is missing the table and RPC**, not because the site is calling its own domain. The fix is to run the SQL below in Supabase (no script.js URL changes).

**If you see 404 in the Console:** open **DevTools → Network**, click one of the failed requests, and check **Request URL** in the Headers tab.

- **Request URL is `https://xxxx.supabase.co/rest/v1/prayers` (or `/rpc/get_prayer_presence_count`)**  
  → The project is missing the `prayers` table or the RPC. Fix: run the SQL below.

- **Request URL is your own site (e.g. `todaysdailybattle.com/prayers`)**  
  → Config is wrong or an old script is cached. Hard refresh (Ctrl+Shift+R / Cmd+Shift+R) or ensure `script.js?v=...` in `index.html` is the latest and redeploy; confirm Console shows `TDB: script loaded (prayers probe active)`.

**Do this once (for 404s from supabase.co):**

1. Open [Supabase Dashboard](https://supabase.com/dashboard) and select your project (the one whose URL matches `config.js` / `TDB_CONFIG.SUPABASE_URL`).
2. Go to **SQL Editor** → **New query**.
3. Paste the contents of **`supabase-prayers.sql`**.
4. Click **Run**.

That creates:

- Table `public.prayers` (id, intent, family_name, session_id, amen_count, created_at)
- RPC `get_prayer_presence_count()` (returns count of distinct sessions in last 15 minutes)
- RLS policies so anonymous users can SELECT, INSERT, and UPDATE (for echo, quick pray, and Amen)

After it runs successfully, reload the site; the 404s should stop and the prayer echo/counter will work.

**After you deploy (to stop 404 spam):**

1. Deploy the latest `index.html` and `script.js` (with `?v=20260227` or newer).
2. Purge cache (e.g. Cloudflare **Caching → Purge Everything**).
3. Reload in **incognito** and check **Network** — you should see at most **one** failed request to `prayers` (the probe). All other prayer/presence calls are blocked or faked.
4. To fix that one 404: run **`supabase-prayers.sql`** in your Supabase project (steps above). Then reload; the probe will return 200 and the counter/echo will work.
