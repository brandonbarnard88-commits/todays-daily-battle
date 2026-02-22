# Optional configuration

## config.js (optional)

To override Supabase or master emails without editing `script.js`:

1. Copy `config.example.js` to `config.js`.
2. Set your values in `config.js`.
3. Load `config.js` before `script.js` (index.html already includes `<script src="config.js"></script>`).

If `config.js` is missing, the app uses built-in defaults and still works. Add `config.js` to `.gitignore` if you don’t want to commit your keys (it’s already listed there).

## Service worker cache (deploy checklist)

When you deploy new JS or CSS, bump the cache name in `service-worker.js` (e.g. `CACHE_NAME = 'tdb-static-YYYYMMDD'`) so returning visitors get the latest assets.

## Daily battle seeding

The featured verse comes from the `daily_battles` table (Supabase). If there is no row for today’s date, the app shows a fallback verse. To avoid that, ensure “today” is always seeded: run your seed script or SQL (e.g. from `supabase-daily-battles-seed.sql`) on a schedule (e.g. cron or Supabase Edge Function) so each day has a row before users hit the site.

## Stripe (paid plans)

Subscribe buttons use Stripe Checkout. In **script.js** (top of file), set these constants to your Stripe Payment Link URLs:

- `STRIPE_SUPPORTER_MONTHLY_URL`
- `STRIPE_SUPPORTER_YEARLY_URL`
- `STRIPE_CHURCH_MONTHLY_URL`
- `STRIPE_CHURCH_YEARLY_URL`

If any are empty, the buttons show "Notify me" and scroll to the waitlist instead of opening checkout.

## Analytics

Cloudflare Web Analytics is wired in **script.js**. Set `CF_ANALYTICS_TOKEN` (top of script.js) to your Cloudflare Web Analytics beacon token. If empty, the analytics script is not loaded.

## Search Console / verification

To verify the site with Google Search Console or Bing Webmaster Tools, add their meta tag or HTML file as instructed by each service. A common approach is to add a meta tag in `<head>` of `index.html`, e.g. `<meta name="google-site-verification" content="YOUR_CODE">`. Submit your sitemap (e.g. `sitemap.xml` if you add one) in the Search Console sitemaps section.
