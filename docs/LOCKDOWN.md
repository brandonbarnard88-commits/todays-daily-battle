# Lockdown — No Weak Spots

**Goal:** Build so lawyers and attackers have no angle to get in or tear down what we built. Every layer is documented and verified. This doc is the single source for “what must be true” before and after launch.

**Live site check (Feb 27, 2026):** Homepage loads over HTTPS with no errors; skip-link, auth CTAs, offline banner, prayer counters, invite, email opt-in, Stories of Hope, and footer polish visible. Privacy and terms (third-parties, retention, indemnity, liability cap, governing law) are in place. Quick wins before full launch: confirm RLS on all user tables, test webhook with Stripe CLI, verify headers in DevTools, add rate limiting/CAPTCHA if spam appears, use GA/Cloudflare for monitoring. See **SECURITY-CHECKLIST-PRE-LAUNCH.md** for the full quick-wins list.

---

## What we never do

- **Never** expose the Supabase `service_role` key in the frontend or in public repos. Use it only in Edge Functions (e.g. stripe-webhook) and server-side scripts.
- **Never** store or handle card numbers. Stripe tokenizes; we only receive webhook events and update tier.
- **Never** sell, rent, or trade user data. Stated in Privacy and Terms.
- **Never** promise uptime, security, or fitness for a particular purpose. Terms: “as is,” limitation of liability, indemnification.
- **Never** allow anon clients to read other users’ data. RLS on every user-data table; anon sees only what policy explicitly allows (e.g. prayer count RPCs, anon INSERT for quick-pray).

---

## Defense layers (check every one)

### 1. Transport and hosting

| Check | Where |
|-------|--------|
| HTTPS only | Cloudflare: SSL/TLS Full or Full Strict; redirect HTTP → HTTPS |
| Security headers | CSP (CLOUDFLARE-CSP-FIX.md), X-Frame-Options: DENY, X-Content-Type-Options: nosniff, Referrer-Policy, Strict-Transport-Security (HSTS) |

### 2. Database (Supabase)

| Check | Where |
|-------|--------|
| RLS enabled on every user-data table | Supabase Dashboard → Tables → Enable RLS |
| Policies: anon cannot read others’ data | supabase-rls-lockdown.sql, supabase-profiles-tier.sql, SUPABASE-SYNC-TABLES.md |
| Auth role forced to member on signup | supabase-rls-lockdown.sql (force_member_role trigger); admin only via app_metadata |
| No anon SELECT on profiles, user_sync_data, newsletter (except anon INSERT where intended) | Run RLS verification; anon key → SELECT from profiles → [] or 403 |

**Tables that must have RLS:** `profiles`, `user_sync_data`, `newsletter_signups`, `daily_battles`, `messages`, `message_reports`, `prayers` (and any `saved_verses` / `saved_collections` when used).

### 3. Payments (Stripe)

| Check | Where |
|-------|--------|
| Webhook signature verified | stripe-webhook uses `constructEventAsync`; invalid signature → 400 |
| Fulfill only on confirmed events | Tier updated only on `checkout.session.completed` |
| Secrets only in Edge Function env | STRIPE_WEBHOOK_SECRET, Stripe secret key never in client |
| Idempotent fulfillment | Upsert on profiles by id |

### 4. Auth and identity

| Check | Where |
|-------|--------|
| Email confirmation on signup | Supabase Auth; VERIFICATION-EMAIL-TROUBLESHOOTING.md |
| Redirect URLs allowlist | Supabase Auth → URL Configuration |
| Passwords never in our code | Supabase Auth only |
| Client uses anon key only | config.js / build-config; no service_role in frontend |

### 5. Legal (Terms and Privacy)

| Check | Where |
|-------|--------|
| Acceptance and lawful use | terms.html |
| No warranty; “as is” | terms.html |
| Limitation of liability (cap: fees paid or $100) | terms.html |
| Indemnification (user indemnifies us for misuse) | terms.html |
| Governing law and disputes | terms.html |
| No selling data; breach notification | privacy.html |
| Third parties named (Supabase, Stripe, analytics); data retention and deletion | privacy.html |
| Footer links to Privacy and Terms on every page | All main HTML pages |

**Recommendation:** Have a lawyer review Terms and Privacy for your jurisdiction before heavy traffic or paid plans.

### 6. Application hardening

| Check | Where |
|-------|--------|
| Errors never leak stack traces or secrets to client | script.js, Edge Functions |
| Rate limiting (optional) | Cloudflare or Supabase Edge; signup, login, webhook |
| CAPTCHA / spam protection (optional) | Newsletter, message board if abuse appears |
| Input sanitization | DOMPurify / safe inserts; no raw HTML from users |

---

## Pre-launch lockdown checklist

Run this before going live with auth sync and payments:

1. [ ] **RLS:** Run `supabase-rls-lockdown.sql` and `supabase-profiles-tier.sql` in Supabase SQL Editor. Enable RLS on `user_sync_data` per SUPABASE-SYNC-TABLES.md.
2. [ ] **Verify anon:** With anon key, `SELECT * FROM public.profiles` and `user_sync_data` → expect empty or permission denied.
3. [ ] **Headers:** Add X-Frame-Options, X-Content-Type-Options, Referrer-Policy, HSTS via Cloudflare (see CLOUDFLARE-CSP-FIX.md).
4. [ ] **Webhook:** Test with `stripe listen --forward-to .../stripe-webhook`; confirm signature verification and tier update.
5. [ ] **Terms/Privacy:** Confirm indemnity, limitation of liability, breach notice, third parties, and data retention are in place. Links in footer.
6. [ ] **Manual test:** Run docs/MANUAL-TESTING-CHECKLIST.md (§3 Auth, §4 Pricing, §5 key pages).

---

## If something is attacked or questioned

- **Legal:** Point to Terms (acceptance, limitation of liability, indemnification, governing law) and Privacy (what we collect, no selling, breach notice, third parties). Have a lawyer for jurisdiction-specific advice.
- **Security:** Point to RLS (no cross-user data), webhook verification (no fake payments), headers (no clickjacking/MIME sniffing), HTTPS (no plaintext transit).
- **Data:** We minimize (local-first, anonymous where possible), don’t sell, and notify on breach. Users can request deletion.

---

## Summary

Every layer—transport, database, payments, auth, legal, and app hardening—is defined and checkable. No single point of failure. Run the pre-launch checklist and keep this doc updated when you add tables or features. **Have a lawyer review Terms and Privacy.** Then build and run with confidence.
