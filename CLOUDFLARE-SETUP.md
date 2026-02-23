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

## 3. SAVE, then Deployments → ⋯ → Retry deployment

## 4. After build succeeds
Open https://todaysdailybattle.com/config.js — you should see `window.TDB_CONFIG = { ... }`. Then sign-in will work on the site.
