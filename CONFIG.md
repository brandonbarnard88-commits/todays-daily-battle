# Optional configuration

For product and growth strategy (benchmark vs. leaders, next 6–12 months, monetization), see **STRATEGY.md**.

## config.js (optional)

To override Supabase or other public config without editing `script.js`:

1. Copy `config.example.js` to `config.js`.
2. Set your values in `config.js`.
3. Load `config.js` before `script.js` (index.html already includes `<script src="config.js"></script>`).

If `config.js` is missing, the app uses built-in defaults and still works. Add `config.js` to `.gitignore` if you don’t want to commit your keys (it’s already listed there).

**User accounts (login/sync):** Set `SUPABASE_URL` and `SUPABASE_ANON_KEY` in `config.js` so sign-in works out of the box. Test E2E: sign up → login → build streak/favorite/note → logout/reopen on another tab or device → verify persistence. Troubleshoot: console errors, Supabase dashboard (auth enabled? RLS policies?), test "Forgot password?" flow. Once stable, ensure the "Sign In Free – Save Your Streak Forever & Sync Devices" button is visible (`.daily-battle-signin-cta` in index.html). Promote in next newsletter: "Accounts are live—sign in free to never lose your streak!"

**Google & Apple sign-in:** The site shows "Sign in with Google" and "Sign in with Apple" buttons. To enable them: Supabase Dashboard → Authentication → Providers → enable Google and/or Apple, add OAuth client IDs/secrets from Google Cloud Console and Apple Developer. Add your site URL (e.g. `https://todaysdailybattle.com`) to Redirect URLs in Supabase Auth settings.

**503 on /authorize (Google OAuth):** Usually a redirect URI mismatch. Supabase uses `https://<project-ref>.supabase.co/auth/v1/callback` as the OAuth callback. In **Google Cloud Console** → APIs & Services → Credentials → your OAuth 2.0 Client ID → Authorized redirect URIs, add this exact URL (replace `<project-ref>` with your Supabase project ref, e.g. `abcdefghijk`). Also add your site URLs in **Supabase Dashboard** → Authentication → URL Configuration → Site URL and Redirect URLs (e.g. `https://todaysdailybattle.com`, `https://todaysdailybattle.com/**`). Retest Google sign-in.

## Immediate next steps (activation focus)

1. **Activate Supabase (today/this week):** Add real `SUPABASE_URL` and `SUPABASE_ANON_KEY` to `config.js`. Test E2E; then flip from "promising prototype" to "growing habit platform."
2. **Sharing:** Test share flow end-to-end (Share image/verse → confirm hashtags, link, card quality). X/FB links are in `.social-share-links` (X: twitter.com/intent/tweet, FB: facebook.com/sharer). Manual push: post today's battle on your X/FB/IG; DM 3–5 pastors/small group leaders: "Check out the free Pastor Toolkit—would love your feedback!" **Target:** 50–100 waitlist signups or streak starts in the next week.
3. **Battle Pro / Stripe (target: 1–2 weeks):** Stripe in test mode → real subscribe buttons on /pricing (replace "Notify Me" with checkout). When live: update banners to **"Battle Pro Now Available – Unlock Offline + More"**. Add launch perk to /pricing copy: first 50–100 get 1 month free or exclusive devotional. Announce: email waitlist + social ("Battle Pro is here—join the deeper fight!"); use Blaze AI for promo graphics/emails.
4. **Polish & tracking:** Google Analytics (or CF_ANALYTICS_TOKEN) for uniques, /pricing visits, streak engagement. Blaze: 5–7 pieces (daily verse promos, "Why I Built This" story, toolkit spotlight). Monitor waitlist growth—once 100+ active users/streaks, subs will convert naturally. Post-activation: fine-tune promo copy, announcement timing, or features like email reminders.

## Admin panel

The **Admin** panel (`admin.html`) is only for accounts with **admin** in Supabase Auth **app metadata** (`role: admin`). The client does not use email allowlists.

1. **In Supabase Dashboard** → Authentication → Users → your user → User Metadata / App Metadata: set `role` to `admin` under **app_metadata** (or use SQL / Admin API as your policy allows).
2. **Sign in** on the site with that account (**Sign In Free** or header login).
3. **Open Admin** — After login, an **Admin** link appears in the sidebar. You can also open `admin.html`. Non-admin users see the access-denied flow.

**If you still can't get in:** Confirm the JWT shows `app_metadata.role === 'admin'` (Supabase Dashboard or a decoded session). Check the browser console for auth errors. Do not put admin email addresses in `config.js`.

## Web Push (8 AM streak reminder)

Users are prompted for notification permission **once** when they click **Start Day 1** (optional). Set **VAPID_PUBLIC_KEY** in config.js (generate with `npx web-push generate-vapid-keys`). The client subscribes and, if **PUSH_SUBSCRIBE_URL** is set in config.js, POSTs the subscription JSON to your backend so you can send 8 AM pushes. To send at 8 AM: your backend stores subscriptions (e.g. in Supabase), then uses the VAPID private key and a Web Push library to send a payload like `{ "title": "Day 2—your battle verse is ready! 🔥", "body": "Your verse is waiting.", "url": "/" }`. Schedule a cron (e.g. 8:00 AM) to trigger the send. Firebase Cloud Messaging (FCM) or any Web Push–compatible service works.

## Service worker cache (deploy checklist)

When you deploy new JS or CSS, bump the cache name in `service-worker.js` (e.g. `CACHE_NAME = 'tdb-static-YYYYMMDD'`) so returning visitors get the latest assets.

## Daily battle seeding

The featured verse is date-based: the app loads today's row from the `daily_battles` table (Supabase). If there is no row for today’s date, the app shows a fallback verse.

**Recommended:** Use the guided script:

```bash
./scripts/deploy-seed-function.sh
```

This deploys `seed-daily-battle` and helps set the required secrets.

After deployment, the GitHub Action `.github/workflows/seed-daily-battle.yml` calls it daily (~00:05 UTC). You can also trigger it manually with `gh workflow run "Seed Daily Battle"`.

See `supabase/functions/seed-daily-battle/README.md` and the session notes in `DEPLOY-2026-05-31-SWOOP-AND-FIXES.md` for full details.

**Plain-English meaning:** The app shows a short **Plain English:** paraphrase for many verses (daily card + search/topic results) using **script.js** (`VERSE_PLAIN_MEANINGS`; label `PLAIN_MEANING_LABEL`). Daily card: collapsible "Tap for plain meaning". Search cards: inline below KJV when the verse is in the map. To add more: batch-write ref + paraphrase in a spreadsheet, then paste into `VERSE_PLAIN_MEANINGS`. Optional DB: add `plain_meaning text` to `daily_battles` and include it in `getDailyBattleFromSupabase()` select to override per day. **Rollout:** Search results show meanings first (high visibility); daily card is toggleable to keep the card minimal. **Monetization (optional):** Free = 1-sentence meaning; Battle Pro = deeper notes, side-by-side translation, or expert insights.

## Stripe (paid plans)

Subscribe buttons use Stripe Checkout. Set these in **config.js** (see `config.example.js`) or at the top of **script.js**: `STRIPE_SUPPORTER_MONTHLY_URL`, `STRIPE_SUPPORTER_YEARLY_URL`, `STRIPE_CHURCH_MONTHLY_URL`, `STRIPE_CHURCH_YEARLY_URL`. If any are empty, the buttons show "Notify me" and scroll to the waitlist instead of opening checkout.

## Walkthrough video (unused)

`WALKTHROUGH_VIDEO_URL` in **config.js** is reserved for a future on-page walkthrough link if you add matching markup (`#walkthrough-wrap` / `#walkthrough-para`). The homepage no longer ships a 60-second walkthrough clip or teaser.

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
