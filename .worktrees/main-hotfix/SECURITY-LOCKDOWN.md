# Security lockdown: no weak spots

This document is the single source of truth for locking down Today's Daily Battle so **no one can get in and destroy what we built**—whether that’s attackers, abuse, or legal exposure. Use it for audits, onboarding, and “fortress” hardening.

---

## 1. What we protect

- **User data:** Streaks, prayer lists, messages, notes, saved verses, church data, profiles, payments.
- **Integrity:** No one can read or change another user’s data. No one can escalate to admin or alter tier without going through Stripe + webhook.
- **Legal:** Clear terms, privacy, limitation of liability, indemnification, breach notification.
- **Availability:** Headers, WAF, rate limiting, and abuse controls so the site stays up and usable.

---

## 2. Database: Row Level Security (RLS)

**Rule:** Every table that holds user or app data has RLS enabled. **anon** and **authenticated** only get the minimum they need; **service_role** is used only in Edge Functions and never in the client.

### Tables and access

| Table | anon | authenticated | service_role | Notes |
|-------|------|---------------|--------------|--------|
| **profiles** | none | SELECT, UPDATE own | SELECT, INSERT, UPDATE | Tier updates **only** via webhook (service_role). |
| **user_sync_data** | none | SELECT/INSERT/UPDATE/DELETE own | full | Streaks, prayer list, badges. |
| **daily_battles** | none | SELECT | full | Writes only via seed function. |
| **messages** | none | SELECT all, INSERT/UPDATE/DELETE own | full | Message board. |
| **message_reports** | none | SELECT own, INSERT own | full | Reports. |
| **newsletter_signups** | none* | SELECT/INSERT/UPDATE own (by email) | full | *Anon INSERT only if you use open signup. |
| **prayers** | SELECT, INSERT | SELECT, INSERT, UPDATE | full | Quick Pray anon INSERT; no anon UPDATE/DELETE. |
| **notes** | none | own only | full | User notes. |
| **saved_verses** | none | own only | full | |
| **saved_collections** | none | own only | full | |
| **saved_verse_collections** | none | own only | full | |
| **sermons** | none | own only | full | |
| **lessons** | none | own only | full | |
| **shares** | SELECT by id | — | full | Public read by share id only. |
| **churches** | none | SELECT (listings) | full | As needed for church features. |
| **church_members** | none | own / church member | full | |
| **church_prayer_list** | none | church member | full | |
| **church_verse_of_day** | none | church member | full | |
| **church_sermons** | none | church member | full | |
| **battle_pro_subscriptions** | none | SELECT own | full | |
| **supporter_waitlist** | INSERT only | — | full | Email signup; no anon SELECT. |

### Critical: profiles tier

- **Only service_role** may INSERT or UPDATE `profiles` for tier changes (Stripe webhook).
- Authenticated users may only SELECT and UPDATE **their own** row (e.g. email/preferences), **not** `tier`.
- If your existing policies allow authenticated to update any row, run **supabase-rls-profiles-service-role-only.sql** (or the equivalent in **supabase-rls-lockdown-extended.sql**) to restrict INSERT/UPDATE-by-tier to **TO service_role** only.

**Files:**

- **supabase-rls-lockdown.sql** — daily_battles, messages, message_reports, newsletter_signups, prayers; auth trigger force_member_role.
- **supabase-rls-lockdown-extended.sql** — notes, saved_verses, sermons, lessons, saved_collections, saved_verse_collections, churches, church_*, battle_pro_subscriptions, shares, supporter_waitlist; profiles service_role-only fix.
- **SUPABASE-SYNC-TABLES.md** — user_sync_data.
- **supabase-profiles-tier.sql** — profiles base; ensure service_role-only for tier updates.
- **RLS-VERIFICATION.md** — how to verify prayers and profiles.

---

## 3. Auth

- **Supabase Auth only.** No service_role or Stripe secrets in client. Only anon key in config/TDB_CONFIG.
- **Redirect URLs** allowlisted in Supabase (production + reset).
- **Role:** Signup forces `role: member` via trigger (**supabase-rls-lockdown.sql**). Admin only via Supabase Dashboard `app_metadata.role = 'admin'`.
- **MFA:** Optional for master account in Supabase Auth.

---

## 4. Stripe

- **Webhook:** Signature verified with `STRIPE_WEBHOOK_SECRET` via `constructEventAsync`. Invalid signature → 400, no DB change.
- **Fulfill only** on `checkout.session.completed`. Return 200 quickly; no tier change on redirect or other events.
- **Secrets:** `STRIPE_WEBHOOK_SECRET` and Stripe secret key only in Supabase Edge Function secrets. Never in repo or client.
- **Idempotency:** Upsert on `profiles` by `id` is idempotent.

---

## 5. Application layer

- **Config / client:** No service_role, no Stripe secret, no Turnstile **secret** in config.js or HTML. Only public keys (anon, Turnstile site key, Stripe publishable if used).
- **XSS:** User-generated content (message text, display names, prayer intents, notes, verses) is rendered with **textContent** or **escapeHtml**/sanitizeHtml. Message board uses textContent; DOMPurify used where HTML is allowed (e.g. message.html).
- **Input:** Validate and bound length on all user payloads (message text, prayer intent, display name, etc.) before sending to Supabase or Edge Functions. Reject or truncate oversize input.
- **HTTPS:** Enforced (Cloudflare SSL/TLS Full or Full Strict; HTTP → HTTPS redirect).

---

## 6. Headers and WAF (Cloudflare)

- **CSP:** One policy (Cloudflare Transform Rule or meta). Include `'unsafe-inline'` for style-src/script-src only as needed; allow only required origins. See **CLOUDFLARE-CSP-FIX.md** and **CLOUDFLARE-SECURITY-HEADERS.md**.
- **Other headers:** X-Content-Type-Options: nosniff, X-Frame-Options: DENY, Referrer-Policy: strict-origin-when-cross-origin, Strict-Transport-Security (HSTS). Optional: Permissions-Policy.
- **WAF:** Security level Medium or High; Bot Fight Mode on.
- **Rate limiting:** On signup/login and on high-value endpoints (e.g. submit-prayer, webhook) if exposed. See **CLOUDFLARE-WAF-RATE-LIMIT.md**.

---

## 7. Abuse and forms

- **Quick Pray:** Turnstile + submit-prayer Edge Function when used; otherwise anon INSERT with rate limit/WAF.
- **Newsletter / waitlist:** Optional Turnstile or rate limit if spam appears.
- **Message board:** Authenticated only; report flow; admin hide/delete via service_role or SECURITY DEFINER RPC.

---

## 8. Legal and trust

- **Terms (terms.html):** Acceptance, lawful use, subscriptions/refunds, content/copyright, disclaimer, **limitation of liability**, **indemnification**, governing law, changes, contact.
- **Privacy (privacy.html):** What we collect, no selling data, Supabase Auth, HTTPS, payments (Stripe, no card storage), **breach notification**, analytics (no PII in events).
- **No warranty:** Service “as is”; Scripture and tools not legal/medical/professional advice.

---

## 9. Verification checklist (run periodically)

- [ ] **RLS:** With anon key, SELECT from profiles, user_sync_data, newsletter_signups, messages → expect [] or 403. Same for other user tables; only prayers allow anon SELECT/INSERT as designed.
- [ ] **Profiles tier:** Only webhook (service_role) can update tier; authenticated cannot update another user’s tier.
- [ ] **Stripe:** Webhook verifies signature; no tier change without valid event.
- [ ] **Client:** No service_role or Stripe secret in repo or built assets; only anon key in config.
- [ ] **Headers:** CSP, X-Frame-Options, X-Content-Type-Options, HSTS present on production.
- [ ] **Input:** Message/prayer/display name length limits enforced; user content escaped when rendered.
- [ ] **Terms/Privacy:** Limitation of liability, indemnification, breach notification, payments mentioned.

---

## 10. If something is wrong

- **RLS:** Re-run **supabase-rls-lockdown.sql** and **supabase-rls-lockdown-extended.sql**; then **RLS-VERIFICATION.md**.
- **Headers:** **CLOUDFLARE-CSP-FIX.md**, **CLOUDFLARE-SECURITY-HEADERS.md**.
- **Stripe:** **docs/SECURITY-CHECKLIST-PRE-LAUNCH.md**, **supabase/functions/stripe-webhook/README.md**.
- **Overall:** **SECURITY-FORTRESS.md**, **docs/SECURITY-CHECKLIST-PRE-LAUNCH.md**.

---

**Summary:** RLS on every table, service_role only in backend, webhook signature verification, strong headers, input validation and escaping, and clear legal docs. That’s the lockdown—no weak spots for lawyers or enemies to exploit.

For **backup, recovery, and handoff** so the project and mission can outlast anything, see **CONTINUITY.md** — *this can never die*.
