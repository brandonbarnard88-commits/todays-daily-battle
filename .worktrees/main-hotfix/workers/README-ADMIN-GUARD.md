# Admin route guard (Cloudflare Worker)

**Note:** Production now rewrites `/admin` to `admin.html` in `_redirects`, but that route and any future `/admin/...` paths are meant to stay protected by this Worker plus Cloudflare Access. Do not expose `/admin` without both the edge gate and the in-page Supabase admin-role check.

Protects `/admin`, `/admin.html`, and any `/admin/...` path so only requests that include the secret header are allowed.

## Setup

1. **Create the secret** (e.g. 24-byte hex):
   ```bash
   openssl rand -hex 24
   ```

2. **Deploy the Worker** to your Cloudflare account and add a route:
   - Route: `todaysdailybattle.com/admin*` (or `*todaysdailybattle.com/admin*`)
   - Worker: `admin-guard`

3. **Set the Worker secret** in Dashboard → Workers & Pages → admin-guard → Settings → Variables:
   - Variable: `TDB_ADMIN_SECRET`
   - Value: the hex string from step 1

4. **Allow your browser to send the header** using one of:

   - **Cloudflare Access** (recommended): Create an Access Application for path `/admin*`. In the policy, add a custom header:
     - Header name: `X-TDB-Admin`
     - Value: same as `TDB_ADMIN_SECRET`
     Then only users who pass Access (e.g. your email) will have the header added and reach admin.

   - **Browser extension**: Use an extension that can add a header to requests to your site (e.g. "ModHeader") and set `X-TDB-Admin` to your secret for `todaysdailybattle.com/admin`. Less secure (secret in browser).

## Behavior

- Requests to paths starting with `/admin` without the correct `X-TDB-Admin` header receive **403 Forbidden**.
- All other requests are passed through unchanged.

## Recommended final shape

- Layer 1: **Cloudflare Access** only allows your email(s) onto `/admin*`.
- Layer 2: **This Worker** requires the matching `X-TDB-Admin` secret header.
- Layer 3: **`admin.html`** still checks `app_metadata.role === 'admin'` in Supabase before showing operator controls.

## Quick verification

1. Open `/admin` without the Access/header gate: you should get **403**.
2. Open `/admin` with Access/header but while signed out of Supabase: the page may load, but the operator controls should stay unavailable until admin auth is present.
3. Sign in with your real admin user: the dashboard should render and the deploy/browser diagnostics should populate.
