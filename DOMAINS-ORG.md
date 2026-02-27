# Using todaysdailybattle.org

You own both **todaysdailybattle.com** and **todaysdailybattle.org**. To have login and verification work on .org as well:

## Option A: Python script (Management API)

You can set redirect URLs from your machine with Python and a Supabase **Personal Access Token**:

1. Create a token at [Supabase Account → Tokens](https://supabase.com/dashboard/account/tokens) with **auth_config_read** and **auth_config_write** (or use a token with project admin).
2. Run:
   ```bash
   export SUPABASE_PAT="sbp_xxxx..."
   python scripts/set_supabase_redirect_urls.py
   ```
   Optional: `SUPABASE_PROJECT_REF` (default is `rixsnhpwrlbvvymkfamj`).

The script GETs the current auth config, merges in the .com and .org redirect URLs, and PATCHes `uri_allow_list` so both domains are allowed.

**If you get 403:** Use the real token from the dashboard (Create → copy the long `sbp_...` value). Your account must be **Owner** or **Administrator** on the project; **Developer** cannot update auth config. If the API still fails, add the URLs manually (Option B).

## Option B: Supabase Dashboard (manual)

In **Supabase** → **Authentication** → **URL Configuration** → **Redirect URLs**, add:

- `https://todaysdailybattle.org`
- `https://todaysdailybattle.org/`
- `https://todaysdailybattle.org/reset.html`

(The script also adds the .com URLs if they’re missing.)

## Hosting .org

- **Same app, two domains:** In Cloudflare Pages (or your host), add **todaysdailybattle.org** as a custom domain to the same project as .com. Same build, both URLs serve the site.
- **CSP:** `index.html` already allows both `todaysdailybattle.com` and `todaysdailybattle.org` in `script-src` for the CSP.

## Canonical / SEO

Canonical URLs and og:url in HTML still point to **.com** as the primary domain. If you want .org to be the primary, we can switch those; otherwise keep .com as canonical and .org as an alias.
