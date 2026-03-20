# Deploy & Launch Checklist

Use this before or after each deploy to keep the site healthy and ready for real traffic.

## Quick wins (do once)

### 1. Cache-bust after deploy
- Bump `script.js?v=YYYYMMDD` in all HTML when you change script (e.g. `20260301`). Prevents users stuck on old JS (404s, `shareStreakBtn`, etc.). `/*.js` is cached long-term in `_headers`; the **query string** is the real cache buster.
- **Before deploy:** run `npm run test` (or `python3 test-site.py --offline`) so all page checks pass.
- After deploy: hard refresh (Cmd+Shift+R) and confirm Console shows latest behavior.
- **Verify origin (not your browser cache):** use **`curl -sSL`** (capital **L** = follow redirects). Some paths return **308** to a canonical URL; without `-L`, `curl` gets an empty body and greps find nothing—easy to mistake for “not deployed.”  
  `curl -sSL https://todaysdailybattle.com/ | grep script.js` → should show `script.js?v=…` on `modulepreload` and `<script type="module">`.  
  `curl -sSL https://todaysdailybattle.com/ | grep data-daily-verse` → should show `data-daily-verse="true"` on `#verseCard`.  
  `curl -sSL https://todaysdailybattle.com/mobius.html | grep mobius-kjv-banner` → should find the hero banner line.  
  `curl -sS "https://todaysdailybattle.com/script.js?v=THAT_VERSION" | grep 'readChapterLink'` → should show the early-return guard in `mountRotatingHeroVerse` (script URL returns **200**; both `?v=20260320a` and `?v=20260320b` may still exist while caches roll forward).  
  If HTML is new but behavior is old, purge Cloudflare cache (`npm run purge:cloudflare` with `CF_API_TOKEN`) or **Purge Everything** in the dashboard.

### 2. “Prayed by X warriors today” (optional)
- Run `supabase-get-prayers-today-count.sql` in Supabase SQL Editor (creates `get_prayers_today_count` RPC).
- In `config.js` set `PRAYERS_TODAY_COUNT_ENABLED = true`.
- Redeploy so home shows live count instead of “—”.

### 3. Supabase forms + retention (after deploy)
- Run SQL for `contact_messages`, `shop_waitlist`, and optional `pg_cron` cleanup — see **`docs/SITE-OPS-RUNBOOK.md` §1**.
- Verify cron: `SELECT * FROM cron.job WHERE jobname = 'cleanup-old-contact-shop';`

### 4. One test payment (Stripe)
- Stripe Dashboard → Payment Links → open your **$9.99/mo, 7-day trial** link.
- Send the link to yourself or a friend; complete one test payment.
- Confirms checkout, webhooks, and Pro access end-to-end.

---

## RLS (Supabase)

- **prayers**: anonymous insert allowed; select for “recent” and counts; RLS so users only see what you intend (e.g. no PII in public list).
- **sermons**: RLS so users see/update only their own rows (`auth.uid() = user_id`).
- **bible_studies**: public read; restrict write to admin if you add an editor later.
- **supporter_waitlist** / **newsletter**: restrict by role or use service key for admin reads.

See `SUPABASE-SYNC-TABLES.md` and Supabase docs for exact policies.

---

## Error reporting (optional)

- Set `ERROR_REPORT_URL` in config to a backend endpoint that accepts POST JSON `{ message, stack, url }`.
- Script already calls `__tdb_reportError()` in key catch blocks and on unhandled rejection; with a URL set, those are sent server-side for debugging.

---

## First 50 promo

- Countdown uses `TDB_CONFIG.PROMO_END_DATE` (home + pricing stay in sync).
- When promo ends, banner auto-hides and shows “Promo ended” where applicable.
- To show “X of 50 spots claimed”: use total prayer count or a dedicated Pro signup count and cap at 50 in the copy (e.g. in `updateBetaWarriorsCount` or promo section).

---

## Related

- **Operations (cron, shop launch, Lighthouse, prayer seeding ethics):** `docs/SITE-OPS-RUNBOOK.md`
