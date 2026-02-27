# Optional configuration

For product and growth strategy (benchmark vs. leaders, next 6–12 months, monetization), see **STRATEGY.md**.

## config.js (optional)

To override Supabase or master emails without editing `script.js`:

1. Copy `config.example.js` to `config.js`.
2. Set your values in `config.js`.
3. Load `config.js` before `script.js` (index.html already includes `<script src="config.js"></script>`).

If `config.js` is missing, the app uses built-in defaults and still works. Add `config.js` to `.gitignore` if you don’t want to commit your keys (it’s already listed there).

**User accounts (login/sync):** Set `SUPABASE_URL` and `SUPABASE_ANON_KEY` in `config.js` so sign-in works out of the box. **Test E2E:** See **docs/E2E-AUTH-TEST.md** for step-by-step signup → email verification → login → streak across incognito/browser. If something is glitchy, use the Cursor prompt in that doc. Troubleshoot: console errors, Supabase dashboard (auth enabled? RLS policies?), **VERIFICATION-EMAIL-TROUBLESHOOTING.md** for email delivery.

## Immediate next steps (activation focus)

1. **Activate Supabase (today/this week):** Add real `SUPABASE_URL` and `SUPABASE_ANON_KEY` to `config.js`. Test E2E; then flip from "promising prototype" to "growing habit platform."
2. **Sharing:** Test share flow end-to-end (Share image/verse → confirm hashtags, link, card quality). X/FB links are in `.social-share-links` (X: twitter.com/intent/tweet, FB: facebook.com/sharer). Manual push: post today's battle on your X/FB/IG; DM 3–5 pastors/small group leaders: "Check out the free Pastor Toolkit—would love your feedback!" **Target:** 50–100 waitlist signups or streak starts in the next week.
3. **Battle Pro / Stripe (target: 1–2 weeks):** See **docs/STRIPE-LIVE-CHECKLIST.md**: plug real Payment Link URLs into config → test with card 4242 4242 4242 4242 → confirm webhook updates user tier → then go live. Banners flip to "Battle Pro now available" when links are set.
4. **Polish & tracking:** **Analytics (optional):** Set `GA_MEASUREMENT_ID` (Google Analytics 4) and/or `CF_ANALYTICS_TOKEN` (Cloudflare Web Analytics) in config for traffic insights; no code change needed. See config.example.js. For search topic insights see docs/SEARCH-ANALYTICS-GA4.md. **Newsletter/daily verse signups without login:** Run **supabase-newsletter-anon-insert.sql** in Supabase SQL Editor (or add an anon INSERT policy on `newsletter_signups` in the dashboard) so unauthenticated users can submit the daily-verse and newsletter forms. **Seed & share:** See **docs/LAUNCH-MONITOR.md** for bumping prayer counters, test testimonies, and sharing on X/Facebook.

## Admin panel

The **Admin** panel (admin.html) is only available to the **master account**. To view it:

1. **Set your master email in config.js**  
   In `config.js`, set `MASTER_EMAIL` to the email you use to sign in (e.g. `MASTER_EMAIL: 'support@todaysdailybattle.com'`). You can use `config.example.js` as a template. If `MASTER_EMAIL` is missing or wrong, the Admin link will not appear and visiting admin.html will redirect to the access-denied page.

2. **Sign in with that email**  
   On the site, use **Sign In Free** (or the header login) and log in with the same email you set as `MASTER_EMAIL`.

3. **Open Admin**  
   After login, an **Admin** link appears in the sidebar (only for the master account). You can also go directly to `admin.html`. If you're not the master user, you'll be redirected to the access-denied page.

**If you still can't get in:** Confirm `config.js` exists and is loaded before `script.js`, and that the email in `MASTER_EMAIL` matches your login email exactly (case doesn't matter). Check the browser console for errors.

## Web Push (8 AM streak reminder)

Users are prompted for notification permission **once** when they click **Start Day 1** (optional). Set **VAPID_PUBLIC_KEY** in config.js (generate with `npx web-push generate-vapid-keys`). The client subscribes and, if **PUSH_SUBSCRIBE_URL** is set in config.js, POSTs the subscription JSON to your backend so you can send 8 AM pushes. To send at 8 AM: your backend stores subscriptions (e.g. in Supabase), then uses the VAPID private key and a Web Push library to send a payload like `{ "title": "Day 2—your battle verse is ready! 🔥", "body": "Your verse is waiting.", "url": "/" }`. Schedule a cron (e.g. 8:00 AM) to trigger the send. Firebase Cloud Messaging (FCM) or any Web Push–compatible service works.

## Service worker cache (deploy checklist)

When you deploy new JS or CSS, bump the cache name in `service-worker.js` (e.g. `CACHE_NAME = 'tdb-static-YYYYMMDD'`) so returning visitors get the latest assets.

## Daily battle seeding

The featured verse is date-based: the app loads today's row from the `daily_battles` table (Supabase). If there is no row for today’s date, the app shows a fallback verse. To avoid that, ensure “today” is always seeded: (1) Deploy and schedule the **seed-daily-battle** Edge Function — see `supabase/functions/seed-daily-battle/README.md` (e.g. schedule `0 0 * * *` or `0 6 * * *` UTC). (2) Or run SQL from `supabase-daily-battles-seed.sql` on a cron. Without this, users may see the fallback verse on unseeded days.

**Plain-English meaning:** The app shows a short **Plain English:** paraphrase for many verses (daily card + search/topic results) using **script.js** (`VERSE_PLAIN_MEANINGS`; label `PLAIN_MEANING_LABEL`). Daily card: collapsible "Tap for plain meaning". Search cards: inline below KJV when the verse is in the map. To add more: batch-write ref + paraphrase in a spreadsheet, then paste into `VERSE_PLAIN_MEANINGS`. Optional DB: add `plain_meaning text` to `daily_battles` and include it in `getDailyBattleFromSupabase()` select to override per day. **Rollout:** Search results show meanings first (high visibility); daily card is toggleable to keep the card minimal. **Monetization (optional):** Free = 1-sentence meaning; Battle Pro = deeper notes, side-by-side translation, or expert insights.

## Stripe (paid plans)

Subscribe buttons use Stripe Checkout. Set these in **config.js** (see `config.example.js`) or at the top of **script.js**: `STRIPE_SUPPORTER_MONTHLY_URL`, `STRIPE_SUPPORTER_YEARLY_URL`, `STRIPE_CHURCH_MONTHLY_URL`, `STRIPE_CHURCH_YEARLY_URL`. If any are empty, the buttons show "Notify me" and scroll to the waitlist instead of opening checkout.

## Walkthrough video

The homepage shows "Watch the 60-second walkthrough (video coming soon)." When you have a video URL (e.g. Loom or YouTube), set `WALKTHROUGH_VIDEO_URL` in **config.js** (see `config.example.js`). The link will then open your video and the "(video coming soon)" text will be hidden.

## Analytics

Cloudflare Web Analytics is wired in **script.js**. Set `CF_ANALYTICS_TOKEN` in **config.js** (see `config.example.js`) or at the top of script.js. If empty, the analytics script is not loaded.

## Stats page (private)

**/stats** (e.g. `stats.html`) shows a simple dashboard: "Today: X active, Y shares." It is password-protected. Set **STATS_PASSWORD** in config.js; if unset, the stats page asks you to set it. After login (stored in sessionStorage for the session), the page shows placeholders; plug in Cloudflare API or your own analytics to display real numbers (see Cloudflare Analytics API or Workers Analytics if you use CF).

## Search Console / verification

To verify the site with Google Search Console or Bing Webmaster Tools, add their meta tag in `<head>` of `index.html`, e.g. `<meta name="google-site-verification" content="YOUR_CODE">`. You can set `GOOGLE_SITE_VERIFICATION` in config.js and the site can inject it if you add the hook in index.html. Submit `https://todaysdailybattle.com/sitemap.xml` in the Search Console sitemaps section (sitemap is already referenced in `robots.txt`).

## PWA verse-of-the-day push (optional)

To send a daily push notification ("Today's verse is ready"), you need: (1) request notification permission in the PWA (e.g. in script.js when user opts in), (2) a backend or scheduled job that triggers the push (e.g. Supabase Edge Function + VAPID/web-push). Document your chosen provider in CONFIG when you implement.

## Email sending (newsletter & daily verse)

Newsletter and "Daily battle alert" signups are stored in Supabase (`newsletter_signups`; optional `preferred_time` column). The site does **not** send emails itself. To send weekly or daily emails you need:

1. **A sender**: e.g. Resend, SendGrid, Mailchimp, or ConvertKit. The existing **send-reminders** Edge Function uses SMTP (set `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `SMTP_FROM` in Supabase secrets). For Resend, you can swap the send logic to use Resend's API instead of SMTP.
2. **A scheduled job**: Call the Edge Function on a schedule. In Supabase Dashboard → Edge Functions → send-reminders, add a cron trigger (e.g. daily at 6:00 AM for daily verse: `POST` with `{ "type": "daily" }`; weekly: `{ "type": "weekly" }`). Or use an external cron (e.g. cron-job.org) that POSTs to your function URL with the correct body.
3. **Database**: Ensure `newsletter_signups` has `daily_opt_in` and `weekly_opt_in` columns (see `supabase-newsletter-columns.sql`). The send-reminders function reads from `daily_battles` for today's verse and from `newsletter_signups` for recipients.

To hit retention goals (see **STRATEGY.md**), prioritize sending a weekly recap and/or the daily verse to subscribers.
