# Cloudflare setup checklist

PASTE THESE IN CLOUDFLARE (Workers & Pages → your project → Settings)

## 1. BUILD CONFIGURATION (important)

Use the repo build so **every file** (including topic-anxiety.html and all topic pages) is in the deploy:

- **Build command:** `npm run build`
- **Build output directory:** `dist`

The build runs `build-config.js` (writes config.js from env) then `build-copy-static.js` (copies all HTML, CSS, JS, _redirects, vendor, etc. into `dist/`). This fixes 503 on topic pages when the host was only deploying "build output" and topic-*.html was missing.

**If you prefer deploying the repo root with no build:** set Build command to **empty** (or `exit 0`) and Build output directory to **empty**. Then the whole repo is deployed as-is; ensure topic-*.html and config.js are in the repo and not ignored.

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
- **Redirect URLs:** In Supabase → Authentication → URL Configuration, add your site URLs and reset pages, e.g. `https://todaysdailybattle.com`, `https://todaysdailybattle.com/reset.html`, `https://todaysdailybattle.org`, `https://todaysdailybattle.org/reset.html`, so sign-up and “Forgot password” links work on both domains.
- **Optional – instant sign-in:** If you want new users to use the app without verifying email first, in Authentication → Providers → Email turn **off** “Confirm email”. Otherwise they must click the link in the verification email before they can log in.

## 6. Analytics and Search Console
- **Google Analytics 4:** Set `GA_MEASUREMENT_ID` in config (e.g. `G-XXXXXXXXXX`). The site will load gtag and send page views. You can set it in Cloudflare env or in local `config.js`.
- **Cloudflare Web Analytics:** Set `CF_ANALYTICS_TOKEN` to enable the existing beacon (no GA required).
- **Google Search Console:** In Search Console add your property (todaysdailybattle.com), then get the verification meta tag content value and set `GOOGLE_SITE_VERIFICATION` in config. The site injects the meta tag when this is set. Then submit your sitemap: `https://todaysdailybattle.com/sitemap.xml`.

## 7. Reliability rule for scanner/crawler access (required)

If external audits show reliability failures or `sitemap.xml` challenge pages, add the skip-challenge custom WAF rule documented in:

- `CLOUDFLARE-RELIABILITY-BYPASS.md`

This prevents challenge pages on public machine-readable files (`robots.txt`, sitemap, manifest, build date) that black-box tools depend on.

## 8. Reading Analytics (4xx rate, cache, “empty” content type)

Account-wide numbers mix all zones; use **per-site** analytics when you want truth for one property.

- **4xx (~2–3%):** Often normal — bots, typos, old bookmarks, crawlers. In **Traffic** / **Events**, filter **status 404** and check **top paths**. If the same real URL repeats, add a **`_redirects`** rule or fix the source link. Run **`node scripts/audit-links.mjs`** after **`npm run build`** to catch broken **internal** links in `dist/` (does not see live-only 404s).
- **Cache:** Low **cached request %** but high **cached bandwidth %** is common: HTML and API-like requests miss cache; large JS/CSS/fonts hit cache and dominate bytes. Optional: long TTL for **`/_next/static/*`** and large static JSON (see **`DEPLOY-SMOKE-CHECKLIST.md`** in `next-app/` for the Next pilot).
- **“empty” content type:** Often beacons, RUM, or small responses — correlate by **path** and **hostname** in the dashboard if something looks off.
