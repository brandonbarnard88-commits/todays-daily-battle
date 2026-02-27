# Site guard — what’s keeping it safe

When you step away, this is what’s already in place. Nothing here runs by itself; it’s what you’ve already built and deployed.

---

## Deployed site

- **Hosting:** Cloudflare Pages (or your current host). The live site is the last deployment; it doesn’t change until you push again.
- **HTTPS:** Enforced. Traffic is encrypted.
- **CSP:** Content-Security-Policy in HTML (and Cloudflare if configured). Limits where scripts/styles load from. See `CLOUDFLARE-CSP-FIX.md` if styles are blocked.

---

## Data & auth

- **Supabase:** DB and Auth run in your project. No one else has your keys. RLS is on for sensitive tables; anon only gets what you allowed (e.g. prayer count RPCs, insert for quick-pray). See `supabase-prayers.sql`, `supabase-rls-lockdown.sql`, `docs/SECURITY-SUMMARY.md`.
- **Secrets:** `config.js` is in `.gitignore` (or equivalent); real keys stay local. Use `config.example.js` for templates.

---

## If you’re worried when you come back

1. **Site down or blank:** Check Cloudflare status, then your deployment (Pages → Deployments). Re-deploy or rollback if needed.
2. **Counter wrong / “9” stuck:** Follow `PRAYER-COUNTER-SYNC.md` (DB count → RPC → RLS).
3. **Styles blocked / CSP errors:** Follow `CLOUDFLARE-CSP-FIX.md` (add `'unsafe-inline'` to style-src in Cloudflare or remove the overriding CSP rule).
4. **Auth or payments:** Check Supabase Auth and Stripe dashboard for errors; logs will point to the issue.

---

## Docs that back this up

- `docs/SECURITY-SUMMARY.md` — RLS, CSP, CORS, document.write fix.
- `PRAYER-COUNTER-SYNC.md` — Counter vs DB sync.
- `CLOUDFLARE-CSP-FIX.md` — CSP blocking styles.
- `SECURITY.md` / `HARDENING.md` — Broader security notes.

You’ve already put the guardrails in place. Rest. When you’re back, open this file and run the checklist for whatever feels off.
