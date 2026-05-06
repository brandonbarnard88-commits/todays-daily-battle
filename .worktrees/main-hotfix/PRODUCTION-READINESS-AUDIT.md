# Production Readiness Audit — March 2026

**Scope:** Prayer wall XSS, auth + payments code paths, Lighthouse, QA smoke.

---

## 1. Prayer Wall & Message Board — XSS Audit ✅

### Message Board (post-message)

| Layer | Sanitization | Rendering |
|-------|--------------|-----------|
| **Client** (`postMessage`) | `sanitizeUserInput()` + `truncateForDb()` on text and display_name | — |
| **Edge Function** (`post-message`) | `sanitizeForDb()` strips `<*>`, `javascript:`, `vbscript:`, `data:`, `on*=`, HTML entities | — |
| **Render** (`renderMessages`) | — | `strong.textContent = displayName`; `p.textContent = text` |

**Verdict:** Safe. User content never reaches `innerHTML`; `textContent` prevents script execution.

### Prayer Echo (Quick Pray / submit-prayer)

| Layer | Sanitization | Rendering |
|-------|--------------|-----------|
| **Client** (direct insert) | `sanitizeUserInput()` + `truncateForDb()` on intent, family_name | — |
| **Edge Function** (`submit-prayer`) | `sanitizeForDb()` on intent and family_name | — |
| **Render** (`wireGodModePrayerEcho`) | — | `textSpan.textContent = pre + who + ' just prayed: ' + intent` |

**Verdict:** Safe. Prayer intent and family_name rendered via `textContent` only.

### Adversarial Payloads (Expected Behavior)

| Payload | Stored | Rendered |
|---------|--------|----------|
| `<script>alert(1)</script>` | Stripped to empty or `alert(1)` (no tags) | Displayed as plain text |
| `javascript:alert(1)` | Stripped | Displayed as plain text |
| `&#60;script&#62;` | Stripped (HTML entities → space) | Displayed as plain text |
| Long string (10k chars) | Truncated to 2000 (message) / 2000 (intent) | Safe |

---

## 2. Auth + Payments Code-Path Review ✅

### Auth

- **auth.js:** Guards `/admin`, `/debug`; redirects guests to `/login.html`
- **Supabase Auth:** JWT-based; `detectSessionInUrl: true` for password reset
- **RLS:** `auth.uid()` used for user-scoped data; admin via `app_metadata.role`
- **Admin:** Optional Cloudflare Worker (`workers/admin-guard.js`) for server-side gate

### Checkout (create-checkout-session)

- **Identity:** `user_id` from JWT only; never from client body
- **price_id allowlist:** `ALLOWED_PRICE_IDS` Set; rejects unknown IDs with 400
- **tier:** Allowlist `supporter`, `battle_pro`, `church`; default `battle_pro`
- **metadata:** `user_id` and `tier` set server-side for webhook

### Webhook (stripe-webhook)

- **Verification:** `stripe.webhooks.constructEventAsync(body, signature, webhookSecret)`
- **No client trust:** All billing logic driven by Stripe event payload

### Manual Test Checklist

- [ ] Sign up → session persists on refresh
- [ ] Log in / log out → session cleared
- [ ] Forgot password → email link works
- [ ] Checkout (signed in) → redirects to Stripe; success URL returns with `?success=1`
- [ ] Webhook → tier updated in `profiles` after payment

---

## 3. Lighthouse

Run: `npm run audit:lighthouse`

Target: 90+ for performance, accessibility, best-practices.

Requires: Chrome installed locally, network access. (Lighthouse uses Chrome/Chromium; CI/sandbox may not have it.)

---

## 4. QA Smoke

Run: `npm run qa:smoke`

Covers: Welcome overlay, prayer counter increment, search by feeling, quick topics, daily verse load, plan progress, PWA manifest.

Requires: Playwright browsers installed (`npx playwright install`), network access. Run locally—browser launch may fail in headless CI.

---

## Summary

| Check | Status |
|-------|--------|
| Prayer wall XSS | ✅ Safe (textContent, client + server sanitization) |
| Message board XSS | ✅ Safe (textContent, client + server sanitization) |
| Auth code paths | ✅ JWT-only, RLS, admin guard documented |
| Checkout security | ✅ price_id allowlist, user_id from JWT |
| Lighthouse | ⏳ Run locally: `npm run audit:lighthouse` |
| QA smoke | ⏳ Run locally: `npm run qa:smoke` |

---

*Last updated: March 2026*
