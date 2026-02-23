# Cloudflare setup checklist

PASTE THESE IN CLOUDFLARE (Workers & Pages → your project → Settings)

## 1. BUILD CONFIGURATION (important)

Because **config.js is now in the repo**, you do **not** need a build step. Set:

- **Build command:** leave **empty** (or type `exit 0`)
- **Build output directory:** leave **empty**

That way Cloudflare deploys the whole repo as-is and config.js is included. If you have a build command like `npm run build`, Cloudflare may only deploy "build output" and omit config.js, causing 404.

## 2. ENVIRONMENT VARIABLES (Production) — Add each

| Name | Value |
|------|--------|
| `SUPABASE_URL` | `https://rixsnhpwrlbvvymkfamj.supabase.co` |
| `SUPABASE_ANON_KEY` | [paste your anon key from your local config.js — the long eyJ... string] |
| `MASTER_EMAIL` | `brandon@todaysdailybattle.com` |
| `GA_MEASUREMENT_ID` | (optional) Your Google Analytics 4 ID, e.g. `G-XXXXXXXXXX` |
| `GOOGLE_SITE_VERIFICATION` | (optional) Code from Google Search Console for domain verification |

## 3. SAVE, then Deployments → ⋯ → Retry deployment

## 4. After build succeeds
Open https://todaysdailybattle.com/config.js — you should see `window.TDB_CONFIG = { ... }`. Then sign-in will work on the site.

## 5. Supabase Auth (Dashboard)
- **Redirect URLs:** In Supabase → Authentication → URL Configuration, add your site URL and the reset page, e.g. `https://todaysdailybattle.com` and `https://todaysdailybattle.com/reset.html`, so sign-up and “Forgot password” links work.
- **Optional – instant sign-in:** If you want new users to use the app without verifying email first, in Authentication → Providers → Email turn **off** “Confirm email”. Otherwise they must click the link in the verification email before they can log in.

## 6. Analytics and Search Console
- **Google Analytics 4:** Set `GA_MEASUREMENT_ID` in config (e.g. `G-XXXXXXXXXX`). The site will load gtag and send page views. You can set it in Cloudflare env or in local `config.js`.
- **Cloudflare Web Analytics:** Set `CF_ANALYTICS_TOKEN` to enable the existing beacon (no GA required).
- **Google Search Console:** In Search Console add your property (todaysdailybattle.com), then get the verification meta tag content value and set `GOOGLE_SITE_VERIFICATION` in config. The site injects the meta tag when this is set. Then submit your sitemap: `https://todaysdailybattle.com/sitemap.xml`.
