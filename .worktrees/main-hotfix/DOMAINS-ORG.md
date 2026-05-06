# Using todaysdailybattle.org

You own both **todaysdailybattle.com** and **todaysdailybattle.org**. Same codebase, different positioning:

- **.com** = the product (app, daily verse, Battle Pro, shop).
- **.org** = the movement (who we are, our story, for churches). Same app and tools, but with movement-focused messaging: tagline "A daily verse movement for you and your church," top CTA bar (Use the app → .com | Our story | For churches), and footer note. Promo banner is hidden on .org.

Host detection is automatic: when `location.hostname === 'todaysdailybattle.org'`, `TDB_IS_ORG` is true and the variant runs (see `config.js` and the DOMContentLoaded block in `script.js`).

## Login and verification on .org

To have sign-up and "Forgot password" work on .org as well:

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

- **.com:** Canonical and meta point to `https://todaysdailybattle.com/`.
- **.org:** When loaded on .org, an inline script sets canonical to `https://todaysdailybattle.org/`, and the page title and meta description to movement-focused copy. Each domain is canonical for itself.
