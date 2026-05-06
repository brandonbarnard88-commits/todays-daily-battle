# RLS verification checklist (prayers + profiles)

Use this to confirm Row Level Security and grants for **prayers** and **profiles** in Supabase. Run through it in the dashboard (and optionally in SQL) after any RLS change.

---

## Where to look

- **Supabase Dashboard** → your project → **Authentication** → **Policies** (or **Table Editor** → select table → **RLS** / **Policies**).
- Or **SQL Editor**: run the queries under “Quick checks” below.

---

## 1. Table: `public.prayers`

### Expected state (after lockdown + anon-read fix)

- **RLS:** Enabled (and Force RLS if your Supabase version supports it).
- **Grants:**
  - **anon:** `SELECT`, `INSERT` only (for echo/wall + Quick Pray when not using submit-prayer).
  - **authenticated:** `SELECT`, `INSERT`, `UPDATE` (for own or amen_count).
  - **service_role:** full access (for submit-prayer Edge Function if you ever switch to it-only inserts).

### Policies to have

| Policy name | Command | Role | Purpose |
|-------------|---------|------|--------|
| `prayers_select_anon` | SELECT | anon | USING (true) — so echo/wall can read. |
| `prayers_insert_anon` | INSERT | anon | WITH CHECK (true) — so Quick Pray (direct insert) works without login. |
| `prayers_select_authenticated` | SELECT | authenticated | USING (true). |
| `prayers_insert_authenticated` | INSERT | authenticated | WITH CHECK (true). |
| `prayers_update_authenticated` | UPDATE | authenticated | USING (true) / WITH CHECK (true) — for amen_count etc. |

**Must NOT have:** anon `UPDATE` or `DELETE` (no policy, and no grant).

### Quick check (SQL Editor)

```sql
-- List policies on prayers
SELECT policyname, cmd, roles, qual::text, with_check::text
FROM pg_policies
WHERE schemaname = 'public' AND tablename = 'prayers';
```

Confirm: there is **no** policy that gives **anon** UPDATE or DELETE.

```sql
-- Grants on prayers
SELECT grantee, privilege_type
FROM information_schema.role_table_grants
WHERE table_schema = 'public' AND table_name = 'prayers'
ORDER BY grantee, privilege_type;
```

Confirm: **anon** has only SELECT and INSERT.

---

## 2. Table: `public.profiles`

### Expected state

- **RLS:** Enabled.
- **Grants:**
  - **authenticated:** `SELECT`, `UPDATE` only (own row via RLS).
  - **service_role:** `SELECT`, `INSERT`, `UPDATE` (for webhook tier updates).
  - **anon:** **no** grants (anon must not read or write profiles).

### Policies to have

| Policy name | Command | Role | Purpose |
|-------------|---------|------|--------|
| `profiles_select_own` | SELECT | authenticated | USING (auth.uid() = id). |
| `profiles_update_own` | UPDATE | authenticated | USING / WITH CHECK (auth.uid() = id). |
| `profiles_insert_service` | INSERT | service_role (or equivalent) | WITH CHECK (true) — so webhook can create profile on first payment. |
| `profiles_update_service` | UPDATE | service_role | USING (true) / WITH CHECK (true) — so webhook can set tier. |

**Must NOT have:** any policy that allows **anon** to SELECT, INSERT, or UPDATE.

### Quick check (SQL Editor)

```sql
-- List policies on profiles
SELECT policyname, cmd, roles, qual::text, with_check::text
FROM pg_policies
WHERE schemaname = 'public' AND tablename = 'profiles';
```

```sql
-- Grants on profiles
SELECT grantee, privilege_type
FROM information_schema.role_table_grants
WHERE table_schema = 'public' AND table_name = 'profiles'
ORDER BY grantee, privilege_type;
```

Confirm: **anon** does **not** appear in the grants for `profiles`.

---

## 3. If something is wrong

- **prayers:** If anon has UPDATE/DELETE, run your lockdown script again and then **supabase-prayers-anon-read.sql** so anon only gets SELECT (+ INSERT). See **supabase-rls-lockdown.sql** and **supabase-prayers-anon-read.sql** in the repo.
- **profiles:** If anon has any grant, revoke it:  
  `REVOKE ALL ON public.profiles FROM anon;`  
  Then ensure only **authenticated** and **service_role** have the grants from **supabase-profiles-tier.sql**.

---

## 4. One-line summary

- **prayers:** anon = SELECT + INSERT only; no anon UPDATE/DELETE.
- **profiles:** anon = no access; authenticated = read/update own row; service_role = insert/update for webhook.

After you’ve run the quick checks and fixed anything off, you’re aligned with **SECURITY-FORTRESS.md** for RLS.
