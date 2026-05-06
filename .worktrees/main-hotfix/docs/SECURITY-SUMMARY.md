# Security Remediation Summary

This document summarizes the security changes applied per the audit (anon read, DOM injection, CSP, CORS, package.json, /admin).

---

## 1. Files Changed

| File | Change |
|------|--------|
| `supabase-rls-lockdown.sql` | **New.** RLS migration: revoke anon read, enable RLS on all target tables, per-role policies. |
| `_headers` | **Modified.** CSP: removed `'unsafe-inline'` from script-src and style-src; added `base-uri 'self'`, `object-src 'none'`; kept `frame-ancestors 'none'`, `upgrade-insecure-requests`. |
| `_redirects` | **Modified.** Added rule: `/package.json` → `/404.html` with status 404 (block public access). |
| `script.js` | **Modified.** Added `openPrintWindow(html)`; replaced all four `document.write` print flows with blob-URL + `openPrintWindow`. No new `innerHTML`; existing innerHTML audit remains as documented in SECURITY-SCAN-REMEDIATION.md. |

---

## 2. RLS SQL Generated

**File:** `supabase-rls-lockdown.sql`

- **Revoke anon:** `REVOKE ALL ON public.daily_battles | messages | message_reports | newsletter_signups | prayers FROM anon;`
- **Grants:** Only `authenticated` (and service_role by default) get SELECT/INSERT/UPDATE/DELETE as needed per table. `prayers`: anon keeps only `INSERT` (quick-pray) and `EXECUTE` on `get_prayer_presence_count()` / `get_total_prayer_count()`.
- **Policy drop block:** Drops all existing policies on those five tables, then creates:
  - **daily_battles:** RLS + FORCE RLS; SELECT for authenticated only; no anon; writes via service role only.
  - **messages:** SELECT for authenticated; INSERT/UPDATE/DELETE with `user_id = auth.uid()`.
  - **message_reports:** `user_id` column + trigger; SELECT/INSERT for authenticated (own rows).
  - **newsletter_signups:** SELECT/INSERT/UPDATE for authenticated using `email = (SELECT email FROM auth.users WHERE id = auth.uid())`.
  - **prayers:** SELECT/UPDATE for authenticated; INSERT for anon and authenticated; counts via RPC only (no anon SELECT on table).
- **Auth trigger:** `auth.force_member_role()` ensures new users get `role: member`; admin is set via Dashboard `app_metadata`.

Run in Supabase SQL Editor (or as a migration). After applying, verify with anon key: `SELECT` on these tables should return empty or permission denied.

---

## 3. Header Changes

**File:** `_headers` (Cloudflare Pages)

- **Content-Security-Policy**
  - Removed `'unsafe-inline'` from `script-src` and `style-src`.
  - Added `base-uri 'self'`, `object-src 'none'`.
  - Left `frame-ancestors 'none'` and `upgrade-insecure-requests` as-is.
- **Other:** No change to HSTS, X-Frame-Options, X-Content-Type-Options, Permissions-Policy.

**Note:** Removing `'unsafe-inline'` can break pages that rely on inline scripts or styles. Any such content must be moved to external files or served with nonces/hashes (e.g. via a Worker). Nonce/hash implementation was not added in-repo.

---

## 4. Security Diff (Summary)

| Area | Before | After |
|------|--------|--------|
| **Supabase anon read** | anon could read daily_battles, messages, message_reports, newsletter_signups (and prayers if exposed) | anon has no SELECT on those tables; only authenticated (and service_role) per RLS policies |
| **DOM injection (document.write)** | Four print flows used `document.write` | Replaced with `openPrintWindow(html)` (Blob + object URL + print on load); no document.write |
| **CSP** | script-src/style-src included `'unsafe-inline'` | Removed; added base-uri 'self', object-src 'none' |
| **CORS** | access-control-allow-origin: * (Supabase/Cloudflare) | **No code change.** Must be configured in Supabase Dashboard (Settings → API) and/or Cloudflare: set allowed origin to `https://www.todaysdailybattle.com` (and `https://todaysdailybattle.com` if used) |
| **package.json** | Publicly reachable | `_redirects`: `/package.json` → 404; build does not copy package.json to dist root |
| **/admin** | UI-gated only, route publicly reachable | **No backend in repo.** Protect at edge: e.g. Cloudflare Access, or Worker that checks signed cookie/header before serving /admin |

---

## 5. External / Follow-up

- **CORS:** Configure in Supabase (API settings) and Cloudflare so `Access-Control-Allow-Origin` is not `*`; use explicit origin(s) for the production domain.
- **/admin:** Enforce server-side (or edge) auth: Cloudflare Access, or a Worker that validates a verified JWT/session before allowing access to `/admin` and `/admin.html`.
- **CSP nonces/hashes:** If any page breaks after removing `'unsafe-inline'`, add nonce-based (or hash-based) CSP; nonce injection typically requires a Worker or server-side template.
- **innerHTML:** Many uses remain in `script.js` and other files; high-risk (user/API content) should use `textContent`/`createElement`/`escapeHtml`/sanitize as described in `docs/SECURITY-SCAN-REMEDIATION.md`.
