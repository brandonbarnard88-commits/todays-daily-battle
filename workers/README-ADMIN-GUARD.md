# Admin route guard (Cloudflare Worker)

**Note:** Production static hosting maps `/admin` and `/admin.html` to **404** via `_redirects` (no public admin HTML). Use Supabase Dashboard for moderation. Deploy this Worker only if you **re-enable** a protected admin route and need header-based access on top of Cloudflare Access.

Protects `/admin` and `/admin.html` so only requests that include the secret header are allowed.

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
