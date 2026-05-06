# Supabase RLS, OWASP Top 10 (2021), and TDB-specific risks

This document ties **Row Level Security (RLS)** patterns to **OWASP Top 10:2021** and **Supabase-specific** failure modes for Today's Daily Battle: local-first data, optional sync, anon prayer wall flows, church groups, profiles, and moderation via **Dashboard + service role** (never the browser).

**Authoritative implementation:** SQL in the repo (`supabase-*.sql`, especially `supabase-rls-lockdown.sql`, `supabase-rls-quick.sql`) and table inventory in **`SUPABASE-SYNC-TABLES.md`**. **`SECURITY.md`** is the high-level policy. Run **Dashboard → Security Advisor** after any policy change.

---

## 1. Non-negotiables

| Rule | Why |
|------|-----|
| **RLS enabled** on every user-facing table | Anon key is public; without RLS, PostgREST can expose rows. |
| **Never ship `service_role`** in the client | Service role **bypasses RLS** entirely. |
| **Prefer `auth.uid()` and JWT claims** in policies | Stable identity; avoid trusting client-sent `user_id` without `WITH CHECK`. |
| **Wrap `auth.uid()`** as `(select auth.uid())` in policies | Planner-friendly pattern (see Postgres/Supabase docs). |
| **Index** `user_id`, `group_id`, foreign keys used in `USING` | Policies slow down without indexes. |
| **Test with anon key only** | `GET /rest/v1/<table>?select=*` with `apikey` + `Authorization: Bearer <anon>` must return `[]` or 403 for protected tables. See **`SUPABASE-SYNC-TABLES.md`** § “Verify RLS”. |

---

## 2. Policy patterns (examples — adapt to your real columns)

Your production schemas evolved across many `supabase-*.sql` files. **Do not copy blindly:** confirm column names (`user_id`, `anon_id`, `group_id`, etc.) in Dashboard → Table Editor or the relevant SQL file.

### A. Owner-only (sync, private notes, user-scoped rows)

Typical for: `user_sync_data`, rows keyed by `user_id`.

```sql
-- Pattern: SELECT / INSERT / UPDATE / DELETE — authenticated, own rows only
create policy "sync_select_own" on public.user_sync_data
  for select to authenticated
  using ((select auth.uid()) = user_id);

create policy "sync_insert_own" on public.user_sync_data
  for insert to authenticated
  with check ((select auth.uid()) = user_id);

create policy "sync_update_own" on public.user_sync_data
  for update to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

create policy "sync_delete_own" on public.user_sync_data
  for delete to authenticated
  using ((select auth.uid()) = user_id);
```

Reference: **`SUPABASE-SYNC-TABLES.md`** (bootstrap for `user_sync_data`).

### B. Authenticated owner + **no** anon `SELECT` on PII

Typical for: `messages`, `daily_battles` (if per-user), `prayers` when rows are tied to `user_id`.

Use **`supabase-rls-lockdown.sql`** as the source of truth for how this repo locks down `messages`, `newsletter_signups`, etc. **Revoke** `anon` on sensitive tables explicitly if grants were ever opened.

### C. Public read / restricted write (if you add `status`, `is_public`)

If you model **approved** public content vs drafts:

- **SELECT** for `anon`: `status = 'approved'` (and whatever safety columns you use).
- **SELECT** for authenticated: own rows **or** approved public rows (split into two policies or one `USING` with `OR`).
- **INSERT**: `with check (user_id = (select auth.uid()))` and default `status = 'pending'` via trigger or constrained default.
- **UPDATE `status`**: **not** for arbitrary users — only **service_role** (Edge Function / Dashboard) or a tight policy on `app_metadata.role` (see below).

Wrong pattern: `using (true)` for `anon` **UPDATE** — that is full table takeover.

### D. Moderator / admin via JWT (prefer `app_metadata`)

Use **Supabase Dashboard** to set `app_metadata.role` (e.g. `admin`). In SQL, read role safely:

```sql
-- Example: role in app_metadata JSON
-- (select auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
```

**Do not** compare with broken JSON operators. The correct shape is `auth.jwt() -> 'app_metadata' ->> 'role'`, not `auth.jwt() ->> 'app_metadata' ->> 'role'`.

Admin policies should be **narrow**: `FOR UPDATE` on specific columns via triggers, or **only** service_role in Edge Functions for moderation queues.

### E. Church / group scoping

Tables like `church_groups`, `church_prayer_requests`, `church_reflections` must enforce **membership** (e.g. `group_id` + membership table), not “any authenticated user.” Use **RPCs** (`security definer`) where you already centralize joins — see **`supabase-church-groups.sql`**, **`supabase-church-prayer-wall.sql`**, and related files. RLS on base tables should still **deny by default** and align with RPC checks.

### F. Anon INSERT-only (no anon SELECT)

Typical for: `feeling_suggestions`, `contact_messages` (patterns in **`supabase-feeling-suggestions.sql`**, **`supabase-contact-messages.sql`**).

- `INSERT` allowed for `anon` with `WITH CHECK` length / format constraints.
- **No** `SELECT` for `anon` (prevents harvesting others’ submissions).

### G. Storage (avatars, kid doodles)

If you use **Storage** buckets: policies on `storage.objects` must scope to **folder = user id** or **signed path** — not `bucket` wide open. See **`supabase-kid-doodles-bucket.sql`** and church doodle notes in **`SUPABASE-SYNC-TABLES.md`**.

---

## 3. OWASP Top 10 (2021) → Your stack

| ID | Risk | How it shows up here | Mitigations |
|----|------|----------------------|-------------|
| **A01** | Broken Access Control | Missing or wrong RLS; “open” policies; client-trusted `user_id` | RLS on all tables; `auth.uid()` ownership; RPCs for cross-table rules; Security Advisor |
| **A02** | Cryptographic Failures | Leaked **service_role**; secrets in repo | Service role only in Edge / CI; anon key only in client; `.gitignore` on `config.js` |
| **A03** | Injection | XSS in prayer/message HTML; rare SQLi if you bypass client and run raw SQL | DOMPurify + CSP; parameterized Supabase client; no string-built SQL in Edge without binding |
| **A04** | Insecure Design | “Public prayer wall” without rate limits / abuse model | Turnstile on submit-prayer Edge path; rate limits; short `truncateForDb` |
| **A05** | Security Misconfiguration | RLS off; `USING (true)` for anon; CORS `*` on custom APIs | Enable RLS; review policies; lock Edge CORS to your origins |
| **A06** | Vulnerable components | Outdated Supabase JS / Edge runtime | Pin versions; periodic `npm audit` |
| **A07** | Identification & Auth Failures | Weak passwords; session fixation | Supabase Auth settings; optional MFA for sensitive accounts |
| **A08** | Software / data integrity | Tampered client claiming admin | **Never** trust client for role; JWT `app_metadata` from Auth only |
| **A09** | Logging / monitoring failures | No visibility into abuse | Supabase logs; minimal app analytics (no raw prayer text — see **`PRIVACY-ANALYTICS.md`**) |
| **A10** | SSRF | Edge Functions fetching arbitrary URLs | Allowlist URLs in Edge; no user-controlled fetch hosts |

---

## 4. Supabase-specific threats (common in real incidents)

| Threat | What goes wrong | What to do |
|--------|-----------------|------------|
| **RLS off** | Anon `select=*` returns entire table | `alter table … enable row level security;` + policies on every table |
| **Over-permissive policy** | `USING (true)` on UPDATE/DELETE | Replace with scoped `USING` / `WITH CHECK`; test anon |
| **Service role in browser** | Full bypass of RLS | Rotate key; remove from client; audit bundle |
| **Leaked anon key** (expected public) | Key alone is OK **if** RLS is correct | Treat RLS as the real boundary |
| **Security Definer RPC too powerful** | Single RPC reads all rows | Narrow `SECURITY DEFINER`; validate `auth.uid()` inside; minimal `GRANT EXECUTE` |
| **Storage bucket misconfig** | List/download all objects | Per-prefix policies; private buckets; signed URLs |
| **Realtime channel** | Subscribe to all inserts | Channel filters + RLS on underlying table |
| **Copy-paste policies** | Wrong table/column names | Apply to **your** schema from Dashboard |

---

## 5. Quick test checklist (repeat after migrations)

1. **Anon key** → `GET` each sensitive table → `[]` or 403 (see **`SUPABASE-SYNC-TABLES.md`**).
2. **Authenticated user A** → cannot `SELECT` user B’s `user_id` rows.
3. **Dashboard Security Advisor** → zero critical issues.
4. **Edge Functions** → only **service_role** where bypass is intentional; logged and rate-limited.
5. **No** `service_role` in client bundle (search build output / repo).

---

## 6. Where to go next in this repo

| Topic | File / doc |
|-------|------------|
| Table list & features | **`SUPABASE-SYNC-TABLES.md`** |
| Lockdown patterns | **`supabase-rls-lockdown.sql`**, **`supabase-rls-lockdown-extended.sql`** |
| Quick verify | **`supabase-rls-quick.sql`** |
| Client security | **`SECURITY.md`**, **`PRIVACY-ANALYTICS.md`** |
| Pre-launch authz tests | **`docs/PRE-LAUNCH-AUTHZ-TEST-PACK.md`**, `npm run test:authz-smoke` |

If you paste a **specific** `CREATE TABLE` + current policies from Dashboard, you can diff them against the patterns above in a code review — but production changes should always be applied in **Supabase SQL Editor** or migrations after staging validation.
