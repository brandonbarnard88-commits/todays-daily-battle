# Launch monitor & early warriors

Short checklist for seeding and sharing once the site is live.

---

## Seed / bump counters (optional)

- **Prayers:** Use **Quick pray** on the homepage a few times (different intentions) so “Total prayers” and the map show activity. Or insert test rows into `prayers` via Supabase Table Editor (if you have the schema).
- **Stories / testimonies:** Add 1–2 test “victory” submissions (or use **Share your victory** mailto) and paste a sentence or two into a visible spot (e.g. about page or a “Stories” line on the homepage) so social proof is real.
- **Daily battle:** Ensure **daily_battles** has a row for today (run **seed-daily-battle** Edge Function or your SQL seed) so the daily verse isn’t fallback-only.

---

## Share on personal networks

- **X (Twitter):** Post the site + one verse + “Less scroll, more soul” and #30DayBattle (or your hashtag). Pin the tweet if you want.
- **Facebook:** Share the homepage or pricing page with a one-line hook (e.g. “Daily verse + streak—free”).
- **Email:** If you have a small list, one “We’re live” with link to the site and “Create account to save your streak.”

---

## Analytics (optional)

Traffic is already wired for:

- **Google Analytics 4:** Set `GA_MEASUREMENT_ID` in config (e.g. `G-XXXXXXXXXX`). The site loads gtag and sends page views and events via `trackEvent()`. See **CONFIG.md** and **docs/SEARCH-ANALYTICS-GA4.md**.
- **Cloudflare Web Analytics:** Set `CF_ANALYTICS_TOKEN` in config; the beacon script loads when set.

No code change needed—add the ID/token to **config.js** (or build env vars) and redeploy. Then use GA4 or Cloudflare dashboard for traffic and (for GA4) search topic insights.

**Plausible:** If you prefer Plausible, add a single script tag to `index.html` (and other key pages) per Plausible’s snippet; no `trackEvent` integration unless you add custom events.

---

## Quick checklist

| Item | Done |
|------|------|
| Seed today’s daily_battles row (or run seed function) | |
| Add a few test prayers / bump prayer counter | |
| Add 1–2 testimonies or “Stories” lines | |
| Post site on X and/or Facebook | |
| (Optional) Set GA_MEASUREMENT_ID or CF_ANALYTICS_TOKEN for analytics | |
