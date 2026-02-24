# Security Scan Remediation (Feb 2026)

## Fix #1: RLS locked down (high)

- **Done in repo:** `supabase-rls-lockdown.sql` now:
  - Drops any existing policies on `daily_battles`, `messages`, `message_reports`, `newsletter_signups` then recreates **authenticated-only** policies.
  - Enables **FORCE ROW LEVEL SECURITY** on those tables so table owners are subject to RLS.
  - No policies for `anon`; only `TO authenticated` with appropriate `USING`/`WITH CHECK`.
- **You must run it:** In Supabase SQL Editor, run the full `supabase-rls-lockdown.sql` again (including the new block 0 and FORCE RLS).
- **Verify:** With the **anon** key, run `select * from public.daily_battles limit 1` (and same for `messages`, `newsletter_signups`). Expect `[]` or permission denied, not data.

## Fix #2: XSS surface reduced (high)

- **Done in repo:** 
  - **DOMPurify:** Added via CDN on `index.html` and `message.html`. `script.js` has `sanitizeHtml(str)` — uses `DOMPurify.sanitize(str, { ALLOWED_TAGS: [] })` when available, else `escapeHtml(str)`. Use for any `innerHTML` with user/API content.
  - **Sermon print:** All draft fields escaped before `document.write`. Daily encouragement and pinned item use `escapeHtml(ref/verseText)`. Sermon template card uses `escapeHtml(template.title/theme)`.
  - **Verse/ref in DOM:** Unescaped ref/text in innerHTML now use `escapeHtml()` or safe construction. Message board uses `textContent` for user messages.
- **Still to do:** Many `innerHTML` usages remain (static UI, admin). For any that touch user input, use `sanitizeHtml()` or `textContent`. `grep -n innerHTML script.js` to find the rest.

## Fix #3: CSP tightened (medium)

- **Done in repo:** `_headers` Content-Security-Policy updated:
  - **Removed** `'unsafe-inline'` from `script-src` and `style-src`.
  - Added `'strict-dynamic'` to `script-src` (trusted scripts can load others).
  - Kept required origins: `https://www.gstatic.com`, `https://cdn.jsdelivr.net`, `https://static.cloudflareinsights.com`, `https://*.supabase.co`.
- **If the site breaks:** Inline scripts/styles will be blocked. Add **nonces** to trusted inline script/style tags and include that nonce in CSP (e.g. `script-src 'nonce-xyz'`). See Cloudflare or your host’s CSP docs.

## Low-hanging fruit

| Item | Action |
|------|--------|
| **security.txt 404** | File is at `.well-known/security.txt` in repo. `.gitignore` had `*.txt`; added exception `!.well-known/security.txt` so it is committed and deployed. Ensure your host serves `/.well-known/security.txt` (Cloudflare Pages does by default). |
| **package.json 200** | Do not serve it in production. In Cloudflare: Page Rule or Transform Rule to return 404/403 for `/package.json`, or add it to a “block path” list so it’s not deployed. |
| **/admin exposed** | Admin is protected client-side (redirect to 404-admin.html if not admin). To hide the URL: use a Cloudflare Worker or Transform Rule to return 404 for `/admin` and `/admin.html` unless a signed cookie/header indicates admin, or accept that the URL is reachable but shows “access denied” for non-admins. |
| **CORS * on HTML** | If the scanner sees `Access-Control-Allow-Origin: *` on HTML, remove it in Cloudflare (Page Rules / Response Headers). Set `https://todaysdailybattle.com` only where needed. |
| **/package.json** | Block in Cloudflare → 404 for `/package.json`. |
| **/admin** | Optionally 404 `/admin` and `/admin.html` unless auth'd (Worker/cookie). |
| **WAF** | Free = Leak Credential. Pro ($20/mo) = OWASP Core; or rely on DOMPurify + RLS. |

## Already solid

- HTTPS redirect, HSTS, X-Frame-Options, X-Content-Type-Options, Referrer-Policy.
- CSP has `frame-ancestors 'none'`.
- Signup roles forced to `member` server-side; admin via `app_metadata` only.
- No admin email in client config.

## After deploy

1. Run **full** `supabase-rls-lockdown.sql` in Supabase (including block 0 and FORCE RLS).
2. Verify anon queries return no data.
3. If CSP breaks inline scripts, add nonces and update CSP in `_headers`.
4. Block `package.json` and optionally `/admin` in Cloudflare if desired.
5. Re-scan.
