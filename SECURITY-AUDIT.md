# Security Audit — Protocol, Defense & Offense

**Audit date:** March 2026  
**Scope:** Protocol (policies, docs), defense (hardening, validation), offense (proactive controls).

---

## Executive summary

The project has **strong foundations**: RLS on synced tables, client-side sanitization, CSP, Turnstile for Quick Pray, JWT-based checkout, and clear SECURITY.md / PRIVACY-ANALYTICS.md. This audit identifies **gaps and improvements** in defense-in-depth and proactive controls.

| Area | Current state | Priority improvements |
|------|----------------|------------------------|
| **Defense** | Client sanitize + escape; RLS; CSP | Server-side sanitization in Edge Functions; tighten CSP; allowlist Stripe price_id |
| **Offense** | Turnstile (Quick Pray); auth-only admin | Rate/abuse signals; server-side admin gate (optional); price_id allowlist |
| **Protocol** | SECURITY.md, checklist, verification steps | Add incident/rotation notes; document audit findings |

---

## 1. Defense (hardening)

### 1.1 ✅ Already strong

- **RLS:** All synced tables use RLS; anon has no SELECT on messages, daily_battles, newsletter_signups, etc. Prayers: anon can only INSERT; counts via RPC only.
- **Auth:** Signup forces `role: member`; admin only via `app_metadata.role` or server-controlled list. No client-supplied `user_id` for checkout.
- **Client sanitization:** `sanitizeUserInput()` + `truncateForDb()` used for message text, display name, prayer intent, family name, newsletter email. `escapeHtml()` / `sanitizeHtml()` used where content is rendered; message/prayer wall use `textContent` for user content.
- **Search analytics:** `trackSearchAnalytics()` strict allowlist; no query text or user identity (PRIVACY-ANALYTICS.md).
- **CSP:** Present in index.html and docs; referrer strict; nonce used for some inline scripts.

### 1.2 Gaps and improvements

| # | Finding | Risk | Recommendation |
|---|---------|------|----------------|
| D1 | **submit-prayer** does not sanitize `intent` or `family_name` server-side. | Stored XSS if client is bypassed or compromised; defense-in-depth missing. | Sanitize and length-limit `intent` and `family_name` in the Edge Function before insert (strip tags, script-like patterns, enforce max length). |
| D2 | **create-checkout-session** accepts any `price_id` that starts with `price_`. | User could pass a different Stripe price ID (e.g. another product in same account). | Allowlist `price_id` server-side (env or hardcoded list of allowed price IDs). Reject if not in list. |
| D3 | **CSP** uses `'unsafe-inline'` for script-src. | Weakens XSS protection if a script injection occurs. | Prefer nonces for all inline scripts; remove `'unsafe-inline'` from script-src where possible. Document in SECURITY.md. |
| D4 | **wins-report.html** builds HTML from `lastKey` (localStorage). | `lastKey` is already escaped manually; low risk. | Use a shared `escapeHtml()` (e.g. from script.js or inline) for consistency and future-proofing. |
| D5 | **sanitizeUserInput** does not strip `data:` or `vbscript:` in strings. | Edge case; current regex catches `javascript:` and `on*=`. | Optionally add `data:\s*` and `vbscript:` to the strip list for defense in depth. |

---

## 2. Offense (proactive controls)

### 2.1 ✅ Already in place

- **Turnstile** on Quick Pray (when configured) reduces bot abuse.
- **Admin** gated by `isMasterUser` (app_metadata or email); admin.html redirects to 404-admin if not master.
- **Checkout** identity from JWT only; no client-supplied user_id.

### 2.2 Gaps and improvements

| # | Finding | Risk | Recommendation |
|---|---------|------|----------------|
| O1 | **create-checkout-session**: `price_id` not allowlisted. | Abuse: user could start checkout for unintended product/price. | Allowlist allowed price IDs in the Edge Function; reject others (see D2). |
| O2 | **Admin panel** is client-side only (visibility + redirect). | Determined user could open admin.html and call Supabase with anon key; RLS still blocks other users’ data, but admin-only tables/RPCs could be probed. | Prefer server-side gate (e.g. Cloudflare Access, or Edge Function that checks JWT and returns 403 for non-admin) for `/admin` and admin-only API. Document in SECURITY.md as recommended hardening. |
| O3 | **Message board** has no rate limit on inserts. | Flooding or spam (authenticated users). | Consider Supabase rate limiting, Edge Function for message post with rate check, or application-level throttle. |
| O4 | **Silent / offline prayer** (ABUSE-PROTECTION.md) still use direct Supabase insert without Turnstile. | Bot or script could insert many rows. | Optional: add Turnstile or rate limit for those paths; document as known gap until then. |

---

## 3. Protocol (docs and process)

### 3.1 ✅ Already strong

- SECURITY.md: principles, checklist for new features, verification steps, file reference.
- PRIVACY-ANALYTICS.md: search analytics rules; non-negotiable.
- SUPABASE-SYNC-TABLES.md: RLS verification (anon key test).

### 3.2 Improvements

| # | Recommendation |
|---|----------------|
| P1 | **Incident / rotation:** Add a short “If something is compromised” to SECURITY.md: rotate service_role, Stripe secret, Turnstile secret; revoke sessions if needed; check audit logs. |
| P2 | **Audit trail:** Note “Last security audit: March 2026” in SECURITY.md and re-audit after major features or annually. |
| P3 | **Admin hardening:** Document that admin is client-gated and recommend Cloudflare Access (or equivalent) for production in SECURITY.md and LAUNCH-GUIDE. |

---

## 4. Implementation checklist

### High priority (do first)

- [x] **D1:** Add server-side sanitization and length limits for `intent` and `family_name` in `supabase/functions/submit-prayer/index.ts`.
- [x] **D2 / O1:** Allowlist `price_id` in `supabase/functions/create-checkout-session/index.ts` (env or hardcoded list); return 400 if not allowed.

### Medium priority

- [ ] **D3:** Plan CSP tightening: assign nonces to all inline scripts, remove `'unsafe-inline'` from script-src.
- [ ] **D4:** Use shared escape for `lastKey` in wins-report.html (or ensure one place defines it).
- [ ] **P1:** Add “If something is compromised” and rotation steps to SECURITY.md.

### Lower priority

- [ ] **O2:** Document server-side admin gate as recommended; implement Cloudflare Access or Edge guard when feasible.
- [ ] **O3 / O4:** Consider rate limiting for message inserts and optional Turnstile/rate for offline prayer.
- [ ] **D5:** Optionally extend `sanitizeUserInput()` with `data:` and `vbscript:` stripping.
- [ ] **P2 / P3:** Add audit date and admin-hardening note to SECURITY.md and launch docs.

---

## 5. Verification (after changes)

- **RLS:** With anon key only, `GET /rest/v1/messages?select=*` (and other protected tables) returns `[]` or 403.
- **submit-prayer:** Send body with `intent: "<script>alert(1)</script> hello"`; confirm stored value is sanitized (no tags).
- **create-checkout-session:** Send `price_id: "price_unknown"` (not in allowlist); expect 400.
- **Auth:** Sign up new user; confirm `app_metadata.role` is `member`; admin only after setting in Dashboard.

---

*Security is the top priority. This audit should be revisited after major features or at least annually. Last audit: March 2026.*
