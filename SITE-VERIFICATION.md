# Site verification — quick checklist

Run through this in **incognito** after a **hard refresh** (Cmd+Shift+R / Ctrl+Shift+R) on https://todaysdailybattle.com

---

## Automated checks (done)

- **Home page** — Returns HTTP 200; CSP header includes `'unsafe-inline'` for script/style.
- **Key pages** — verse, pricing, message, study, etc. return 3xx/200 (reachable).
- **Wiring** — All `wire*` functions are called from init (prayer counter, echo, search, modals, offline, etc.).
- **Prayer counter** — `fetch-prayer-guard.js` lets total-count RPC through and returns `0` when API is 404 so the counter shows a number or "—".

---

## Manual checks (do in browser)

| Check | How | Pass? |
|-------|-----|-------|
| **Page loads** | No black screen; styles and layout visible. | ☐ |
| **Total prayers** | "Total prayers:" shows a number or "—", not stuck "Loading…". | ☐ |
| **Search** | Type a topic (e.g. "hope"), click Search → verses appear. | ☐ |
| **Quick topic** | Click a quick topic (e.g. Anxiety) → results load. | ☐ |
| **Today's Battle** | "Featured Today's Battle" shows a verse and reflection (or loading then content). | ☐ |
| **Quick pray** | Enter a name, click Pray → feedback appears; counter can refresh. | ☐ |
| **Echo / presence** | "Loading recent prayers…" resolves to a number or "You're alone with Him." | ☐ |
| **Menu** | Click Menu (or sidebar toggle) → sidebar opens; click a nav link → page or section changes. | ☐ |
| **Theme** | Site is dark-only; buttons have gold hover. | ☐ |
| **Pricing** | Open pricing.html → plans and Upgrade buttons visible; click Upgrade → Stripe or config message. | ☐ |
| **Family Armor / Kids** | Open Family Armor & Stories or Kids Activities → modal or page loads. | ☐ |
| **Patriotic Scriptures / Hymns** | Sections render; no 404 for assets. | ☐ |
| **Map** | "Prayers from around the world" area shows map UI (gradient/border). | ☐ |
| **KJV Audio** | On a verse, click "KJV Audio" → opens Bible Gateway in new tab. | ☐ |
| **Console** | DevTools → Console: no red CSP or script errors. | ☐ |

---

## If something fails

- **Prayer counter / echo stuck** — Run **`supabase-prayers.sql`** in Supabase SQL Editor (defines `get_total_prayer_count`, `get_prayer_presence_count`).
- **CSP errors** — Ensure latest `_headers` and `fetch-prayer-guard.js` are deployed; purge Cloudflare cache.
- **Search / verse empty** — Check Supabase `daily_battles` and verse/search API; run **`supabase-daily-battles.sql`** if needed.
- **Stripe / Upgrade** — Add Payment Link URLs to `config.js` (see LAUNCH-CHECKLIST.md Phase 1).

---

## Summary

Once the manual checks pass, core functions (load, search, daily verse, prayer counter, echo, nav, theme, pricing, armor/kids) are working. Use LAUNCH-CHECKLIST.md for Stripe, Pro detection, and daily verse cron.
