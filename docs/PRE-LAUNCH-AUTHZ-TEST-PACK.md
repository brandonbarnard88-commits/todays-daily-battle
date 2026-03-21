# Pre-launch authorization & abuse test pack

**Purpose:** Repeatable **go/no-go** checks for the risks that headers/meta do not fix: **RLS gaps**, **Edge Function authz**, **BOLA/IDOR**, **stored XSS**, **rate-limit bypass**, and **checkout/business-logic abuse**.

**Scope:** Aligns with tables and functions documented in `SUPABASE-SYNC-TABLES.md`, `SECURITY.md`, and `supabase/functions/*`.

**Conventions**

- `PROJECT_REF` — Supabase project ref (from Dashboard → Settings → API).
- `ANON_KEY` — **anon** public key (safe to use in test clients; never commit).
- `USER_A_JWT` / `USER_B_JWT` — short-lived **access** tokens for two **different** `auth.users` (e.g. from browser devtools or `supabase.auth.getSession()`).
- `ADMIN_JWT` — access token for a user with `app_metadata.role === 'admin'` (Dashboard-set only).
- Base URL: `https://PROJECT_REF.supabase.co`
- Edge base: `https://PROJECT_REF.supabase.co/functions/v1/<name>`

**Pass criteria (per test):** Result matches **Expected**; any deviation is a **finding** (severity per impact).

---

## 1. Role matrix (what “pass” means)

| Actor | REST (PostgREST) | Edge Functions |
|--------|-------------------|----------------|
| **Anon** (Bearer = anon key) | No reads of private tables unless **intentionally** public; insert-only where designed | Only unauthenticated flows allowed; writes that need auth → **401** |
| **User A** | Read/write **only** rows where policy ties row to `auth.uid()` (or group membership RPC) | JWT validated; **no** trusting `user_id` / `role` from body |
| **User B** | **Must not** read/update User A’s rows by changing `id` / `user_id` in query or body | Same |
| **Admin** | Extra read policies only if **explicit** and justified; prefer Dashboard + Edge for admin ops | Admin-only functions must verify **role** server-side |

Document your **intentional** public behaviors (e.g. prayer wall visibility) in the findings section so they are not mistaken for leaks.

---

## 2. Table-by-table REST tests (RLS)

Use `curl` or REST client. Headers for **anon**:

```http
apikey: ANON_KEY
Authorization: Bearer ANON_KEY
Prefer: return=representation
```

Headers for **User A**:

```http
apikey: ANON_KEY
Authorization: Bearer USER_A_JWT
```

### 2.1 Core sync / user-owned data

| # | Table | Method & path | Actor | Body / query | Expected |
|---|--------|----------------|-------|----------------|----------|
| T1 | `user_sync_data` | `GET /rest/v1/user_sync_data?select=*` | Anon | — | `[]` or **403** (no rows) |
| T2 | `user_sync_data` | `GET .../user_sync_data?user_id=eq.<USER_B_UUID>` | User A | — | **No** rows for B’s `user_id` (empty or 403) |
| T3 | `user_sync_data` | `PATCH /rest/v1/user_sync_data?user_id=eq.<USER_B_UUID>` | User A | `{ "sync_value": {} }` | **403** or 0 rows updated |
| T4 | `user_sync_data` | `POST` with `user_id` = B | User A | — | **Reject** (WITH CHECK fails) |

**Assertion:** User A cannot read/write B’s partition key `(user_id, sync_key)`.

### 2.2 Messages, newsletter, daily battles (post–`supabase-rls-quick.sql`)

| # | Table | GET `select=*` | Anon | Expected |
|---|--------|----------------|------|----------|
| T5 | `messages` | yes | Anon | `[]` or **403** (not public list) |
| T6 | `daily_battles` | yes | Anon | `[]` or **403** |
| T7 | `newsletter_signups` | yes | Anon | `[]` or **403** |

**Auth read:** With `USER_A_JWT`, `GET` may return rows **only** if product intent is “any logged-in user reads” — confirm against your policy; if only staff should read `newsletter_signups`, tighten policy.

### 2.3 Public insert–only tables

| # | Table | Op | Anon | Expected |
|---|--------|-----|------|----------|
| T8 | `feeling_suggestions` | `SELECT` | Anon | **403** or `[]` (no anon read) |
| T9 | `feeling_suggestions` | `INSERT` valid row | Anon | **201** (if form enabled) |

Repeat pattern for `contact_messages`, `shop_waitlist` per `supabase-contact-messages.sql` / `supabase-shop-waitlist.sql`.

### 2.4 Prayers (intentional public read?)

Your deployment may use `supabase-prayers-anon-read.sql` or locked-down variants.

| # | Check | Expected |
|---|--------|----------|
| T10 | Anon `GET /rest/v1/prayers?select=*&limit=5` | Document: either **curated public wall** (OK) or **no rows** — must match product + privacy policy |

### 2.5 RPC / views (security definer)

For each RPC in `supabase-*.sql` (e.g. `join_group`, `get_church_group_by_code`, `insert_church_prayer_request`):

| # | Check | Expected |
|---|--------|----------|
| T11 | Call with **anon** and minimal args | Only documented behavior; **no** full-table dump |
| T12 | Call with **User A** and **B’s** `group_id` / `user_id` in args (if applicable) | **Deny** or no cross-tenant data |

---

## 3. Edge Function tests (authz & abuse)

Common headers:

```http
Content-Type: application/json
Authorization: Bearer <JWT or omit>
```

### 3.1 `create-checkout-session`

| # | Case | Body | Expected |
|---|------|------|----------|
| E1 | No `Authorization` | `{ "price_id": "price_..." }` | **401** |
| E2 | Valid `USER_A_JWT` | `price_id` **not** in allowlist (see `ALLOWED_PRICE_IDS` in `index.ts`) | **400** “Price not allowed” |
| E3 | Valid JWT | `metadata.user_id` in body (if client ever sends) | **Ignored** — session metadata uses **JWT user only** (verify in Stripe Dashboard test mode: metadata.user_id = A) |
| E4 | Valid JWT | Allowed `price_id` | **200** + `{ "url": "https://checkout.stripe.com/..." }` |

### 3.2 `create-donation-session`

| # | Case | Expected |
|---|------|----------|
| E5 | Unauthenticated donation flow per README | Works only as designed; **no** elevation of arbitrary `user_id` in metadata |

### 3.3 `post-message`

| # | Case | Expected |
|---|------|----------|
| E6 | No JWT | **401** |
| E7 | `USER_A_JWT` + oversized `text` (> 2000) | Truncated or **400** (per implementation) |
| E8 | `USER_A_JWT` + XSS payload (see §5) | Stored value **HTML-stripped**; no script execution when rendered |

### 3.4 `submit-prayer`

| # | Case | Expected |
|---|------|----------|
| E9 | Missing Turnstile | **400** / error per function |
| E10 | Valid Turnstile + spam volume | Rate limit triggers (**429** or error code) after threshold |

### 3.5 `save-push-subscription` / `remove-push-subscription`

| # | Case | Expected |
|---|------|----------|
| E11 | JWT for A saves subscription | Row tied to A only |
| E12 | B’s JWT tries to **update** A’s subscription by ID (if exposed) | **Deny** |

### 3.6 `stripe-webhook`

| # | Case | Expected |
|---|------|----------|
| E13 | POST without Stripe signature | **401** or **400** |
| E14 | Forged body with fake `user_id` | **No** tier change without valid Stripe event |

### 3.7 Read-only / cron-style functions

`seed-daily-battle`, `send-reminders`, `weekly-*`, `bible-qa` (if public):

| # | Case | Expected |
|---|------|----------|
| E15 | Unauthenticated `POST` to admin/cron endpoints | **401** unless explicitly public; **verify** each function’s `verify_jwt` / secret header in Dashboard |

*(In Supabase Dashboard → Edge Functions → each function → confirm **JWT verification** and **authorization** expectations.)*

---

## 4. BOLA / IDOR patterns (manual)

Repeat for **messages**, **profiles**, **sermons**, **church_*`, **profile_***:

1. As User A, note a resource `id` visible in UI or network tab.
2. As User B, call `GET/PATCH/DELETE` with A’s `id` in path or filter.
3. **Expected:** 0 rows, **403**, or RLS error — never A’s content.

**Metadata tampering:** In Stripe success redirect or client, attempt to pass `user_id`, `tier`, `email` as query params — **server** must ignore for entitlement; only webhook + DB state count.

---

## 5. Stored XSS fuzz strings (copy-paste)

Use in message board, prayer intent, church prayer, display name fields. **Expected:** stripped or escaped everywhere (Edge + `escapeHtml` / DOMPurify on client).

```
"><img src=x onerror=alert(1)>
<svg/onload=alert(1)>
javascript:alert(1)
&#60;script&#62;alert(1)&#60;/script&#62;
${alert(1)}
\"-alert(1)-\"
```

If **any** payload renders executable JS in another user’s browser → **High** finding.

---

## 6. Rate limit & bypass

| # | Test | Expected |
|---|------|----------|
| R1 | Same IP, burst `post-message` | Block after `MESSAGE_RATE_MAX` per window |
| R2 | Rotate **User-Agent** only | Still keyed by user/IP as implemented — no bypass |
| R3 | `submit-prayer` from many IPs (VPN) | Turnstile + IP hash limit still holds |
| R4 | Oversized JSON body | **413** or **400**, no crash |

---

## 7. CORS on Edge Functions

Functions use `Access-Control-Allow-Origin: *` (see `create-checkout-session`, `post-message`, `submit-prayer`). **Risk:** low for **credentialed** flows if browser only sends `Authorization` to your origin; **higher** if secrets in query string.

| # | Check |
|---|--------|
| C1 | Confirm **no** tokens in URL for any flow |
| C2 | Optional hardening: restrict `Access-Control-Allow-Origin` to `https://todaysdailybattle.com` and `https://www.todaysdailybattle.com` if cookie-based auth is ever added |

---

## 8. Service worker / cache (spot check)

| # | Check |
|---|--------|
| SW1 | After **logout**, reload app — no admin UI from stale shell without new session |
| SW2 | `admin.html` / `stats.html` — verify `Cache-Control` behavior matches `_headers` (HTML `no-cache`) |

---

## 9. CI / automation hooks (recommended)

### Automated smoke script (repo)

`scripts/authz-smoke.sh` runs **T1, T5, T8** (anon REST) and **E1, E2, E6, E6b** (Edge Functions) via `curl`. **E6b** sends a **malformed** `Authorization: Bearer` on `post-message` and expects **401**.

```bash
export SUPABASE_URL='https://YOUR_PROJECT_REF.supabase.co'
export SUPABASE_ANON_KEY='eyJ...'   # anon key
# Optional: JWT for E2 (disallowed price_id → 400)
# export AUTHZ_ACCESS_TOKEN='eyJ...'
# Optional: fail if tables/functions missing (fully provisioned staging)
# export AUTHZ_STRICT=1

npm run test:authz-smoke
```

**GitHub Actions:** `.github/workflows/authz-smoke.yml` runs the same command on `push` to `main` and `workflow_dispatch`, with `SUPABASE_URL`, `SUPABASE_ANON_KEY`, and optional `AUTHZ_ACCESS_TOKEN` from repository **Secrets**; `AUTHZ_STRICT=1` is set so missing tables/functions fail the job (release-style gate).

- **Missing tables** (PostgREST 404 “Could not find the table”) → **WARN** by default; **`AUTHZ_STRICT=1`** → **fail** (use after SQL is applied).
- **Missing Edge Functions** (404 `NOT_FOUND`) → **WARN** by default; **`AUTHZ_STRICT=1`** → **fail** (use after `supabase functions deploy`).
- **E1/E2** need **`create-checkout-session`** deployed with Stripe secret for meaningful auth/price checks; otherwise you may see WARN (Stripe not configured) or missing function.

### Expected output (`authz-smoke.sh`)

Use this to tell **healthy** vs **partially provisioned** vs **broken** at a glance.

**A — Healthy (staging/prod fully wired, `AUTHZ_STRICT=1` passing)**  
All lines are **`OK`** (green). No **`WARN`**. Typical pattern:

- `OK   T1 anon GET user_sync_data → 200 []` (or `→ 403`)
- `OK   T5 anon GET messages → 200 []` (or `→ 403`)
- `OK   T8 anon GET feeling_suggestions → 403` (or `200 []` if policy allows empty public read)
- `OK   E1 POST create-checkout-session without Bearer → 401`
- `OK   E2 POST create-checkout-session … → 400` (with `AUTHZ_ACCESS_TOKEN` set)
- `OK   E6 POST post-message without Bearer → 401`
- `OK   E6b POST post-message with malformed JWT → 401`
- `OK   authz-smoke finished` — **exit code 0**

**B — Partial / dev (tolerant default, `AUTHZ_STRICT` unset)**  
Mix of **`OK`** and **`WARN`**, **exit code 0** — *by design* so fresh projects do not fail CI. Examples:

- `WARN T1 user_sync_data: table not deployed (404)` — run `SUPABASE-SYNC-TABLES.md` SQL for `user_sync_data` when you need sync.
- `WARN E1 create-checkout-session: Edge Function not deployed (404)` — deploy Edge functions.
- `WARN E2 skipped: set AUTHZ_ACCESS_TOKEN` — optional JWT not set; E2 not exercised.

**C — Broken (security or misconfiguration)**  
**`FAIL`** (red) and **exit code 1**. Examples:

- Anon `GET user_sync_data` returns **200 with JSON objects** (rows visible) → RLS leak.
- `E1` returns **200** without `Authorization` → checkout session created unauthenticated (critical).
- `E6` returns **200** without JWT → message posted anonymously when it should not.

**Optional follow-ups (low effort, later):** if `feeling_suggestions` policy changes to auth-only, update T8 to expect **401** for anon; add `GET` smokes for any new **intentionally public** tables. Malformed JWT on `post-message` is covered by **E6b** in the script.

1. **Supabase CLI** or **pgTAP** tests applying policies — run in CI against a **branch** project or seeded DB.
2. **Scripted curls** — store env in CI secrets: `SUPABASE_URL`, `SUPABASE_ANON_KEY`, optional `AUTHZ_ACCESS_TOKEN`; run nightly or on release branches.
3. **Dependency audit:** `npm audit` (or `pnpm audit`) on every PR; block on critical until triaged.
4. **Secret scan:** `gitleaks` or GitHub secret scanning on push.

---

## 10. Launch gate sign-off (copy for checklist)

- [ ] **T1–T12** executed; anomalies documented or fixed  
- [ ] **E1–E15** executed for every deployed Edge Function  
- [ ] **§4** IDOR matrix done for user-owned and group-owned tables  
- [ ] **§5** XSS fuzz — no execution  
- [ ] **§6** rate limits — no trivial bypass  
- [ ] **Stripe** — webhook-only tier changes; spot-check Dashboard test events  
- [ ] **Monitoring** — alert on Edge 5xx spike, auth failure rate, unusual `rate_limit` growth  
- [ ] **Restore drill** — RPO/RTO recorded  

---

## References

- `SUPABASE-SYNC-TABLES.md` — table list & RLS intent  
- `supabase-rls-lockdown.sql`, `supabase-rls-quick.sql` — policy baselines  
- `supabase/functions/*/index.ts` — JWT checks, allowlists, sanitization  
- `SECURITY.md` — principles and verification  

**Owner:** _______________ **Date:** _______________ **Result:** PASS / FAIL  
