# Deploying to Cloudflare Pages (with GitHub)

Your site is static and `config.js` is in `.gitignore`, so the live site never gets Supabase credentials unless we create `config.js` at build time from **environment variables**.

## 1. Build script (already in repo)

`build-config.js` reads env vars and writes `config.js` during the build. It only runs when `SUPABASE_URL` and `SUPABASE_ANON_KEY` are set (so local dev is unchanged).

## 2. Cloudflare Pages settings

In **Cloudflare Dashboard** → **Workers & Pages** → your project → **Settings** → **Builds & deployments** (or **Build configuration**):

| Setting | Value |
|--------|--------|
| **Framework preset** | **None** |
| **Build command** | `npm run build` |
| **Build output directory** | `dist` (build writes all files to dist/) |

The repo has a `package.json` so `npm run build` runs the script that creates `config.js`. Without these settings, the build never runs and `config.js` is never created (404 on the live site).

## 3. Environment variables

In **Pages** → your project → **Settings** → **Environment variables** (or **Build** → **Environment variables**), add:

| Variable | Value | Notes |
|----------|--------|--------|
| `SUPABASE_URL` | `https://xxxx.supabase.co` | Your Supabase project URL |
| `SUPABASE_ANON_KEY` | `eyJ...` | Your Supabase anon (public) key |
| `MASTER_EMAIL` | `brandon@todaysdailybattle.com` | Optional; for Admin panel access |

Recommended for analytics: `GA_MEASUREMENT_ID` = `G-NFQ5GWJXCB`.

**Push notifications (daily verse):** Generate keys with `node scripts/generate-vapid-keys.mjs`, then add:
- `VAPID_PUBLIC_KEY` (public key only; private stays in Supabase secrets)
- `PUSH_SUBSCRIBE_URL` = `https://YOUR_PROJECT.supabase.co/functions/v1/save-push-subscription`
- `PUSH_UNSUBSCRIBE_URL` = `https://YOUR_PROJECT.supabase.co/functions/v1/remove-push-subscription`

Optional (add later if you use them):  
`MASTER_EMAILS`, `STATS_PASSWORD`, `WALKTHROUGH_VIDEO_URL`, `STRIPE_*`, `ERROR_REPORT_URL`, `CF_ANALYTICS_TOKEN`, `GOOGLE_SITE_VERIFICATION`, `BATTLE_MUG_URL`.

For **MASTER_EMAILS** (array), set the value as JSON, e.g. `["brandon@todaysdailybattle.com"]`.

## 4. Redeploy

After saving the build command and env vars:

- **Redeploy**: **Deployments** → **⋯** on latest → **Retry deployment**, or push a small commit to GitHub so Cloudflare runs a new build.

Once the build runs with the new command, it will write `config.js` from the env vars and the live site will have sign-in and streaks.

## Quick check

After a successful deploy, open your site and try **Sign in**. If the form appears and you can log in (or see “Invalid email or password” instead of “Sign-in is optional. Log in to save your streak…”), config is working.
