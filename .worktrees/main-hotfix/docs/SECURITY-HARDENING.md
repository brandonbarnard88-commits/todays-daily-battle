# Security Hardening — Post-Scan Checklist

Based on external security scan (Feb 2026). Prioritized fixes.

---

## 1. Role / privilege (done in code)

- **Risk:** Client could self-assign elevated role at signup.
- **Fix applied:** Signup **always** sends `role: 'member'` in `options.data`; the account-type dropdown is not used for signup. Promote users to pastor/admin **server-side only** (Supabase dashboard, trigger, or admin tool).
- **Supabase:** Add a trigger or policy so new users get `user_metadata.role = 'member'` and only an admin can set `pastor` or other roles.

---

## 2. Security headers (Cloudflare / server)

**In use:** Project root `_headers` is read by Cloudflare Pages and sends HSTS, CSP, X-Frame-Options, X-Content-Type-Options (see `_headers` in repo). If scripts or styles from CDNs (Supabase, jsDelivr, Google Fonts) are blocked, extend CSP in `_headers` as below.

Add or adjust at the edge (e.g. Cloudflare → Transform Rules, or `_headers` for Pages):

| Header | Value |
|--------|--------|
| `Strict-Transport-Security` | `max-age=31536000; includeSubDomains` |
| `X-Frame-Options` | `DENY` (or `SAMEORIGIN` if you embed your own pages) |
| `Content-Security-Policy` | Start with e.g. `default-src 'self'; script-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net https://www.googletagmanager.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; img-src 'self' https: data:; font-src 'self' https://fonts.gstatic.com; connect-src 'self' https://*.supabase.co https://www.google-analytics.com; frame-ancestors 'none';` — then tighten as needed. |
| `Permissions-Policy` | `geolocation=(), microphone=(), camera=()` |

**Where:** Cloudflare Dashboard → Rules → Transform Rules → Modify response header (or Page Rules / Config if you use that).

---

## 3. Admin identity (MASTER_EMAIL) — reduce exposure

- **Risk:** `MASTER_EMAIL` / `MASTER_EMAILS` in public JS/config lets attackers know admin accounts.
- **Fix (recommended):** Remove admin emails from client config. Resolve “is admin?” **server-side**:
  - **Option A:** Supabase RPC, e.g. `get_my_app_role()` that returns `{ role: 'member' \| 'pastor' \| 'admin' }` based on `auth.uid()` and a server-side table (e.g. `app_admins` or `profiles.role`). Client calls it after auth and caches result; no emails in client.
  - **Option B:** Keep a minimal client check for UX only, but **never** trust it for sensitive actions — enforce in RLS and Edge Functions.
- **Immediate:** If real admin emails are in public HTML/JS, **rotate** those emails or use a dedicated security contact (e.g. security@) and document in `security.txt` (already added at `/.well-known/security.txt`).

---

## 4. Access-Control-Allow-Origin: * on HTML routes

- **Risk:** HTML pages (/, /admin, /verse, etc.) returning `Access-Control-Allow-Origin: *` allow any site to embed or call them; can aid CSRF or data leak if combined with other issues.
- **Fix:** Remove `ACAO: *` from **HTML** responses. If you need CORS for an API, allow it only on the specific API routes (e.g. Supabase handles its own CORS). In Cloudflare, do not add a blanket “Add CORS header” rule for HTML; restrict to API endpoints only.

---

## 5. security.txt (done)

- **File:** `/.well-known/security.txt` (in repo).
- **Content:** Contact (mailto), Preferred-Languages, Expires, Canonical. Update `Expires` and contact as needed.
- **Hosting:** Ensure your host serves `/.well-known/security.txt` from the site root (many static hosts do this by default).

---

## Summary

| Item | Status | Owner |
|------|--------|--------|
| Signup role forced to `member` | Done (script.js) | Code |
| security.txt | Done | Code |
| HSTS, X-Frame-Options, CSP, X-Content-Type-Options | Done (`_headers`) | Code + Cloudflare Pages |
| Remove MASTER_EMAIL from client / use RPC | Recommended | Code + Supabase |
| Remove ACAO: * from HTML routes | To do | Cloudflare / server |
| Supabase: default new user role to member | Recommended | Supabase |

After changing headers, verify: DevTools → Network → select document → Response Headers.
