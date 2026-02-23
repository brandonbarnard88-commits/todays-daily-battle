# Cloudflare setup checklist

PASTE THESE IN CLOUDFLARE (Workers & Pages → your project → Settings)

## 1. BUILD CONFIGURATION
- **Build command:** `npm run build`
- **Build output dir:** `.`

## 2. ENVIRONMENT VARIABLES (Production) — Add each

| Name | Value |
|------|--------|
| `SUPABASE_URL` | `https://rixsnhpwrlbvvymkfamj.supabase.co` |
| `SUPABASE_ANON_KEY` | [paste your anon key from your local config.js — the long eyJ... string] |
| `MASTER_EMAIL` | `brandon@todaysdailybattle.com` |

## 3. SAVE, then Deployments → ⋯ → Retry deployment

## 4. After build succeeds
Open https://todaysdailybattle.com/config.js — you should see `window.TDB_CONFIG = { ... }`. Then sign-in will work on the site.
