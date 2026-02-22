# Security: Today's Daily Battle

This document describes how the site and your account holders are protected, and what you need to do to keep security at the highest level.

---

## What the app already does

| Area | Protection |
|------|------------|
| **Secrets** | No Supabase URL or keys in the repo. They live only in `config.js` (gitignored). |
| **Admin** | Only one master admin (your email). Non-admin visitors to `/admin` are shown a 404-style page; they never see admin data. |
| **Moderation** | Message delete/hide/unhide require the master account. |
| **XSS** | User content (e.g. message board) is escaped before display. |
| **Referrer** | `referrer` meta set to `strict-origin-when-cross-origin` so full URLs are not sent to third parties. |
| **Auth** | Passwords are handled by Supabase Auth; the app never sees or stores plaintext passwords. |

---

## What you must do (Swiss-bank level)

### 1. Keep config and keys off the repo

- **Never** commit `config.js`. It is in `.gitignore`; do not `git add config.js` or `git add -A` without checking.
- On the server, keep one `config.js` with real values. Rotate the Supabase anon key if it was ever exposed (e.g. repo was public).

### 2. Supabase: Row Level Security (RLS)

Your database is the vault. RLS ensures users only see and change their own data.

- In Supabase Dashboard → **Authentication → Policies** (or **Table Editor → each table → RLS**):
  - **Enable RLS** on every table that holds user or sensitive data.
- Recommended pattern:
  - **notes, saved_verses, saved_collections, sermons, lessons**: `SELECT/INSERT/UPDATE/DELETE` only where `auth.uid() = user_id`.
  - **messages**: `SELECT` for all (or for non-hidden only); `INSERT` for authenticated users; `UPDATE` (e.g. hidden) and `DELETE` only for a dedicated admin role or your master user (e.g. by email in `auth.jwt() ->> 'email'` or a custom claim).
  - **daily_battles**: `SELECT` for all; `INSERT/UPDATE/DELETE` only for admin (e.g. same role/email check).
  - **newsletter_signups, supporter_waitlist**: `INSERT` for anyone (or anonymous); `SELECT` only for admin if needed.

If you want, we can add a separate `.sql` file with example RLS policies you can paste into Supabase.

### 3. HTTPS only

- Serve the site over **HTTPS** only (todaysdailybattle.com).
- If you use Cloudflare, Vercel, Netlify, or similar, HTTPS is usually default. Enable “Force HTTPS” or “Always use HTTPS” if available.
- In Cloudflare: **SSL/TLS → Edge Certificates → Always Use HTTPS = On**.

### 4. Security headers (host / CDN)

Set these at your host or CDN (e.g. Cloudflare Transform Rules, or your server config):

| Header | Value | Purpose |
|--------|--------|--------|
| **Strict-Transport-Security** | `max-age=31536000; includeSubDomains` | Force HTTPS for 1 year. |
| **X-Content-Type-Options** | `nosniff` | Prevent MIME sniffing. |
| **X-Frame-Options** | `DENY` or `SAMEORIGIN` | Reduce clickjacking. |
| **Referrer-Policy** | `strict-origin-when-cross-origin` | Limit referrer leakage (matches the meta tag). |
| **Permissions-Policy** | `camera=(), microphone=(), geolocation=()` | Disable unneeded features. |

Optional: **Content-Security-Policy** — only add after testing; it can break inline scripts (e.g. contact form). Start with `default-src 'self'; script-src 'self' https://cdn.jsdelivr.net https://unpkg.com https://*.supabase.co; style-src 'self' https://fonts.googleapis.com; font-src https://fonts.gstatic.com; img-src 'self' https: data:; connect-src 'self' https://*.supabase.co;` and adjust as needed.

### 5. Your admin account

- Use a **strong, unique password** for the master admin (and for Supabase dashboard).
- Prefer a **dedicated email** for admin (e.g. admin@ or a personal address) and use it only in `MASTER_EMAIL` in `config.js`.
- If Supabase supports it, enable **MFA** on the project for the dashboard.

### 6. Account holders (users)

- Auth is handled by **Supabase** (secure, standard practice). Passwords are hashed; the app never stores them.
- **Password reset** goes through Supabase; users get a time-limited link. No reset tokens in the app code.
- The **Privacy** page states: no selling data, secure auth, HTTPS, access control, and data export/deletion on request. Keep that true in practice.

---

## Quick checklist

- [ ] `config.js` never committed; only on your machine and server.
- [ ] RLS enabled on all Supabase tables with user/sensitive data; policies restrict by `user_id` or admin.
- [ ] Site served over HTTPS only; “Always use HTTPS” enabled if using a CDN.
- [ ] Security headers set (HSTS, X-Content-Type-Options, X-Frame-Options, Referrer-Policy, Permissions-Policy).
- [ ] Strong, unique password and (if available) MFA for Supabase and admin.
- [ ] Privacy page and contact path for data requests; you respond to export/deletion requests.

---

## If something is compromised

1. **Rotate Supabase anon key** (and service role if exposed) in Supabase Dashboard → Settings → API.
2. Update **config.js** on the server with the new anon key.
3. If a user’s account was compromised, they can use **Forgot password** to regain control; consider notifying them if you have a way to do so safely.
4. Review Supabase **Logs** for unusual access; tighten RLS if needed.

Doing the items above keeps the site and your account holders as safe as possible for this stack—like a Swiss bank, and in some ways safer (no physical branch risk, encryption in transit, and you control the data and access).
