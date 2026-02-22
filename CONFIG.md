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

The featured verse is date-based: the app loads today's row from the `daily_battles` table (Supabase). If there is no row for today’s date, the app shows a fallback verse. To avoid that, ensure “today” is always seeded: run your seed script or SQL (e.g. from `supabase-daily-battles-seed.sql`) **on a schedule**—e.g. cron or a Supabase Edge Function that runs daily and inserts/updates the row for today (and optionally a few days ahead). Without this, users may see the fallback verse on unseeded days.

## Stripe (paid plans)

Subscribe buttons use Stripe Checkout. In **script.js** (top of file), set these constants to your Stripe Payment Link URLs:

- `STRIPE_SUPPORTER_MONTHLY_URL`
- `STRIPE_SUPPORTER_YEARLY_URL`
- `STRIPE_CHURCH_MONTHLY_URL`
- `STRIPE_CHURCH_YEARLY_URL`

If any are empty, the buttons show "Notify me" and scroll to the waitlist instead of opening checkout.

## Walkthrough video

The homepage shows "Watch the 60-second walkthrough (video coming soon)." When you have a video URL (e.g. Loom or YouTube), set `WALKTHROUGH_VIDEO_URL` in **config.js** (see `config.example.js`). The link will then open your video and the "(video coming soon)" text will be hidden.

## Analytics

Cloudflare Web Analytics is wired in **script.js**. Set `CF_ANALYTICS_TOKEN` (top of script.js) to your Cloudflare Web Analytics beacon token. If empty, the analytics script is not loaded.

## Search Console / verification

To verify the site with Google Search Console or Bing Webmaster Tools, add their meta tag or HTML file as instructed by each service. A common approach is to add a meta tag in `<head>` of `index.html`, e.g. `<meta name="google-site-verification" content="YOUR_CODE">`. Submit `https://todaysdailybattle.com/sitemap.xml` in the Search Console sitemaps section (sitemap is already referenced in `robots.txt`).

## Email sending (newsletter & daily verse)

Newsletter and "Daily battle alert" signups are stored in Supabase (`newsletter_signups`; optional `preferred_time` column). The site does **not** send emails itself. To send weekly or daily emails you need:

1. **A sender**: e.g. Resend, SendGrid, Mailchimp, or ConvertKit.
2. **A scheduled job**: e.g. a Supabase Edge Function (or cron) that runs on a schedule, reads from `newsletter_signups` and optionally `daily_battles`, and calls your email provider's API. Use `preferred_time` when building the send schedule if you want time-of-day delivery.
3. (Optional) A simple "daily verse" Edge Function that runs once per day, fetches today's row from `daily_battles`, and emails subscribers who opted into the daily alert.
