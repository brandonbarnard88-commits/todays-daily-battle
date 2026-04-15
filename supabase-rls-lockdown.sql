-- Supabase RLS lockdown for sensitive user data.
-- Goal: owner-only reads/writes by default; no anon access to personal rows.
-- Run in Supabase SQL editor as an admin.

-- Helper note:
-- These policies assume user ownership columns are `user_id` (uuid).
-- If your table uses a different owner column, adjust USING/WITH CHECK.

-- prayers (if present)
-- Raw table should stay service-role only. Public prayer features use SECURITY DEFINER
-- RPCs from `supabase-prayers.sql` (`get_total_prayer_count`, `get_prayer_presence_count`,
-- `get_prayers_today_count`, `get_last_prayer_created_at`, `get_recent_prayers`,
-- `get_prayer_echo_match_count`, `get_prayer_intent_suggestions`, `increment_prayer_amen`).
alter table if exists public.prayers enable row level security;
alter table if exists public.prayers force row level security;
do $$
declare
  r record;
begin
  for r in (
    select policyname
    from pg_policies
    where schemaname = 'public'
      and tablename = 'prayers'
  ) loop
    execute format('drop policy if exists %I on public.prayers', r.policyname);
  end loop;
end $$;
revoke all on table public.prayers from anon;
revoke all on table public.prayers from authenticated;
grant select, insert, update, delete on table public.prayers to service_role;

-- adult streaks
alter table if exists public.adult_streaks enable row level security;
drop policy if exists adult_streaks_select_own on public.adult_streaks;
drop policy if exists adult_streaks_insert_own on public.adult_streaks;
drop policy if exists adult_streaks_update_own on public.adult_streaks;
drop policy if exists adult_streaks_delete_own on public.adult_streaks;
create policy adult_streaks_select_own on public.adult_streaks for select to authenticated using (auth.uid() = user_id);
create policy adult_streaks_insert_own on public.adult_streaks for insert to authenticated with check (auth.uid() = user_id);
create policy adult_streaks_update_own on public.adult_streaks for update to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy adult_streaks_delete_own on public.adult_streaks for delete to authenticated using (auth.uid() = user_id);

-- kid streaks
alter table if exists public.kid_streaks enable row level security;
drop policy if exists kid_streaks_select_own on public.kid_streaks;
drop policy if exists kid_streaks_insert_own on public.kid_streaks;
drop policy if exists kid_streaks_update_own on public.kid_streaks;
drop policy if exists kid_streaks_delete_own on public.kid_streaks;
create policy kid_streaks_select_own on public.kid_streaks for select to authenticated using (auth.uid() = user_id);
create policy kid_streaks_insert_own on public.kid_streaks for insert to authenticated with check (auth.uid() = user_id);
create policy kid_streaks_update_own on public.kid_streaks for update to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy kid_streaks_delete_own on public.kid_streaks for delete to authenticated using (auth.uid() = user_id);

-- church prayer wall
alter table if exists public.church_prayer_wall enable row level security;
drop policy if exists church_prayer_wall_select_own on public.church_prayer_wall;
drop policy if exists church_prayer_wall_insert_own on public.church_prayer_wall;
drop policy if exists church_prayer_wall_update_own on public.church_prayer_wall;
drop policy if exists church_prayer_wall_delete_own on public.church_prayer_wall;
create policy church_prayer_wall_select_own on public.church_prayer_wall for select to authenticated using (auth.uid() = user_id);
create policy church_prayer_wall_insert_own on public.church_prayer_wall for insert to authenticated with check (auth.uid() = user_id);
create policy church_prayer_wall_update_own on public.church_prayer_wall for update to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy church_prayer_wall_delete_own on public.church_prayer_wall for delete to authenticated using (auth.uid() = user_id);

-- Lock down public/anon by default for these tables.
revoke all on table public.prayers from anon;
revoke all on table public.adult_streaks from anon;
revoke all on table public.kid_streaks from anon;
revoke all on table public.church_prayer_wall from anon;
-- =============================================================================
-- Supabase RLS Lockdown: only authenticated users read/write their own data.
-- No anon read on any table. Run in Supabase SQL Editor (or via migration).
-- Tables: daily_battles, messages, message_reports, newsletter_signups, prayers
--
-- After running: test with anon key → SELECT from any table → must return [] or deny.
-- =============================================================================

-- -----------------------------------------------------------------------------
-- 0. Revoke anon grants (explicit revoke so anon cannot read)
-- -----------------------------------------------------------------------------
REVOKE ALL ON public.daily_battles FROM anon;
REVOKE ALL ON public.messages FROM anon;
REVOKE ALL ON public.message_reports FROM anon;
REVOKE ALL ON public.newsletter_signups FROM anon;
REVOKE ALL ON public.prayers FROM anon;

-- Re-grant only what authenticated needs (RLS policies will further restrict)
GRANT SELECT ON public.daily_battles TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.messages TO authenticated;
GRANT SELECT, INSERT ON public.message_reports TO authenticated;
GRANT SELECT, INSERT, UPDATE ON public.newsletter_signups TO authenticated;
GRANT SELECT, INSERT, UPDATE ON public.prayers TO authenticated;

-- -----------------------------------------------------------------------------
-- 0b. Drop any existing policies that might allow anon (run first)
-- -----------------------------------------------------------------------------
DO $$
DECLARE
  r RECORD;
BEGIN
  FOR r IN (
    SELECT schemaname, tablename, policyname
    FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename IN ('daily_battles', 'messages', 'message_reports', 'newsletter_signups', 'prayers')
  ) LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON %I.%I', r.policyname, r.schemaname, r.tablename);
  END LOOP;
END $$;

-- -----------------------------------------------------------------------------
-- 1. daily_battles (global "battle of the day" – no user_id)
--    Authenticated read only; writes via service role (e.g. seed edge function).
-- -----------------------------------------------------------------------------
ALTER TABLE public.daily_battles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_battles FORCE ROW LEVEL SECURITY;

-- Only authenticated users can read. No anon. No write policy = only service role can insert/update/delete.
CREATE POLICY "daily_battles_select_authenticated"
  ON public.daily_battles
  FOR SELECT
  TO authenticated
  USING (true);

-- -----------------------------------------------------------------------------
-- 2. messages (user_id = author; users can CRUD own, read all for board)
-- -----------------------------------------------------------------------------
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages FORCE ROW LEVEL SECURITY;

-- No anon: only authenticated
CREATE POLICY "messages_select_authenticated"
  ON public.messages
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "messages_insert_own"
  ON public.messages
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "messages_update_own"
  ON public.messages
  FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "messages_delete_own"
  ON public.messages
  FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());

-- -----------------------------------------------------------------------------
-- 3. message_reports (user_id = reporter; add column and trigger if missing)
-- -----------------------------------------------------------------------------
ALTER TABLE public.message_reports ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users(id);

-- Auto-set user_id on insert so the app does not need to send it
CREATE OR REPLACE FUNCTION public.set_message_reports_user_id()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.user_id IS NULL THEN
    NEW.user_id := auth.uid();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS set_message_reports_user_id_trigger ON public.message_reports;
CREATE TRIGGER set_message_reports_user_id_trigger
  BEFORE INSERT ON public.message_reports
  FOR EACH ROW EXECUTE PROCEDURE public.set_message_reports_user_id();

ALTER TABLE public.message_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.message_reports FORCE ROW LEVEL SECURITY;

CREATE POLICY "message_reports_select_own"
  ON public.message_reports
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "message_reports_insert_own"
  ON public.message_reports
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid() OR user_id IS NULL);

-- -----------------------------------------------------------------------------
-- 4. newsletter_signups ("own data" = email = auth.email())
-- -----------------------------------------------------------------------------
ALTER TABLE public.newsletter_signups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.newsletter_signups FORCE ROW LEVEL SECURITY;

CREATE POLICY "newsletter_signups_select_own"
  ON public.newsletter_signups
  FOR SELECT
  TO authenticated
  USING (email = (SELECT email FROM auth.users WHERE id = auth.uid()));

CREATE POLICY "newsletter_signups_insert_own"
  ON public.newsletter_signups
  FOR INSERT
  TO authenticated
  WITH CHECK (email = (SELECT email FROM auth.users WHERE id = auth.uid()));

-- Optional: allow update/delete of own signup
CREATE POLICY "newsletter_signups_update_own"
  ON public.newsletter_signups
  FOR UPDATE
  TO authenticated
  USING (email = (SELECT email FROM auth.users WHERE id = auth.uid()))
  WITH CHECK (email = (SELECT email FROM auth.users WHERE id = auth.uid()));

-- -----------------------------------------------------------------------------
-- 5. prayers (raw table locked down; public prayer features use RPCs only)
-- -----------------------------------------------------------------------------
ALTER TABLE public.prayers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.prayers FORCE ROW LEVEL SECURITY;

DO $$
DECLARE
  r RECORD;
BEGIN
  FOR r IN (
    SELECT policyname
    FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'prayers'
  ) LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON public.prayers', r.policyname);
  END LOOP;
END $$;

-- RPCs remain callable by anon/authenticated; the raw table is not.
GRANT EXECUTE ON FUNCTION public.get_prayer_presence_count() TO anon;
GRANT EXECUTE ON FUNCTION public.get_total_prayer_count() TO anon;
GRANT EXECUTE ON FUNCTION public.get_prayers_today_count() TO anon;
GRANT EXECUTE ON FUNCTION public.get_last_prayer_created_at() TO anon;
GRANT EXECUTE ON FUNCTION public.get_recent_prayers(integer) TO anon;
GRANT EXECUTE ON FUNCTION public.get_prayer_echo_match_count(text) TO anon;
GRANT EXECUTE ON FUNCTION public.get_prayer_intent_suggestions(integer) TO anon;
GRANT EXECUTE ON FUNCTION public.increment_prayer_amen(uuid) TO anon;
GRANT EXECUTE ON FUNCTION public.get_prayer_presence_count() TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_total_prayer_count() TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_prayers_today_count() TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_last_prayer_created_at() TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_recent_prayers(integer) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_prayer_echo_match_count(text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_prayer_intent_suggestions(integer) TO authenticated;
GRANT EXECUTE ON FUNCTION public.increment_prayer_amen(uuid) TO authenticated;
REVOKE ALL ON public.prayers FROM anon;
REVOKE ALL ON public.prayers FROM authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.prayers TO service_role;

-- -----------------------------------------------------------------------------
-- 6. saved_verses (user_id = owner) — UNCOMMENT when table exists
-- -----------------------------------------------------------------------------
-- ALTER TABLE public.saved_verses ENABLE ROW LEVEL SECURITY;
-- CREATE POLICY "saved_verses_select_own" ON public.saved_verses FOR SELECT TO authenticated USING (user_id = auth.uid());
-- CREATE POLICY "saved_verses_insert_own" ON public.saved_verses FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
-- CREATE POLICY "saved_verses_update_own" ON public.saved_verses FOR UPDATE TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
-- CREATE POLICY "saved_verses_delete_own" ON public.saved_verses FOR DELETE TO authenticated USING (user_id = auth.uid());

-- -----------------------------------------------------------------------------
-- 6. saved_collections — UNCOMMENT when table exists
-- -----------------------------------------------------------------------------
-- ALTER TABLE public.saved_collections ENABLE ROW LEVEL SECURITY;
-- DROP POLICY IF EXISTS "saved_collections_owner_read" ON public.saved_collections;
-- DROP POLICY IF EXISTS "saved_collections_owner_write" ON public.saved_collections;
-- CREATE POLICY "saved_collections_select_own" ON public.saved_collections FOR SELECT TO authenticated USING (user_id = auth.uid());
-- CREATE POLICY "saved_collections_insert_own" ON public.saved_collections FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
-- CREATE POLICY "saved_collections_update_own" ON public.saved_collections FOR UPDATE TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
-- CREATE POLICY "saved_collections_delete_own" ON public.saved_collections FOR DELETE TO authenticated USING (user_id = auth.uid());

-- -----------------------------------------------------------------------------
-- 7. saved_verse_collections — UNCOMMENT when table exists
-- -----------------------------------------------------------------------------
-- ALTER TABLE public.saved_verse_collections ENABLE ROW LEVEL SECURITY;
-- DROP POLICY IF EXISTS "saved_verse_collections_owner_read" ON public.saved_verse_collections;
-- DROP POLICY IF EXISTS "saved_verse_collections_owner_write" ON public.saved_verse_collections;
-- CREATE POLICY "saved_verse_collections_select_own" ON public.saved_verse_collections FOR SELECT TO authenticated USING (user_id = auth.uid());
-- CREATE POLICY "saved_verse_collections_insert_own" ON public.saved_verse_collections FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
-- CREATE POLICY "saved_verse_collections_update_own" ON public.saved_verse_collections FOR UPDATE TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
-- CREATE POLICY "saved_verse_collections_delete_own" ON public.saved_verse_collections FOR DELETE TO authenticated USING (user_id = auth.uid());

-- =============================================================================
-- AUTH: Force role = 'member' on signup (prevent client-side role escalation)
-- Run in Supabase SQL Editor. Requires permission on auth schema.
-- =============================================================================
CREATE OR REPLACE FUNCTION auth.force_member_role()
RETURNS TRIGGER AS $$
BEGIN
  -- Overwrite any client-supplied role; only server can set admin via app_metadata
  NEW.raw_user_meta_data := COALESCE(NEW.raw_user_meta_data, '{}'::jsonb) || '{"role":"member"}'::jsonb;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS force_member_role_trigger ON auth.users;
CREATE TRIGGER force_member_role_trigger
  BEFORE INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION auth.force_member_role();
-- (If your Postgres version errors, use EXECUTE PROCEDURE instead of EXECUTE FUNCTION.)

-- Admin: set app_metadata in Dashboard (Auth > Users > [user] > Edit > app_metadata: {"role":"admin"}).
-- Client uses session.user.app_metadata?.role === 'admin'; never store admin email in client.

-- =============================================================================
-- Notes:
-- - Anon key cannot read or write any of these tables; only authenticated users.
-- - daily_battles: writes (insert/update/delete) must use service role (e.g. seed
--   edge function or dashboard). No policy = denied for anon and authenticated.
-- - messages: admin hide/delete of others’ messages requires service role or an
--   RPC with SECURITY DEFINER that checks admin and performs the operation.
-- - message_reports: if the table has no user_id, add it and set it on insert
--   from the client (currentUserId), or use a single “authenticated only” policy
--   and restrict admin visibility via an RPC.
--
-- Verification (run with anon key; expect empty or permission denied):
--   select * from public.daily_battles limit 1;
--   select * from public.messages limit 1;
--   select * from public.newsletter_signups limit 1;
--
-- After lockdown: verse echo and prayer wall need anon SELECT on prayers.
-- Run supabase-prayers-anon-read.sql to re-allow anon read for those features.
-- =============================================================================

-- =============================================================================
-- Hardening add-on: user_prayers (private prayer counter history)
-- Table fields requested:
--   user_id uuid, created_at timestamptz, village_code text
-- RLS: auth.uid() = user_id for select/insert/update
-- =============================================================================

create table if not exists public.user_prayers (
  id bigserial primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  village_code text
);

create index if not exists user_prayers_user_id_idx on public.user_prayers(user_id);
create index if not exists user_prayers_village_code_idx on public.user_prayers(village_code);
create index if not exists user_prayers_created_at_idx on public.user_prayers(created_at desc);

alter table public.user_prayers enable row level security;
alter table public.user_prayers force row level security;

drop policy if exists user_prayers_select_own on public.user_prayers;
drop policy if exists user_prayers_insert_own on public.user_prayers;
drop policy if exists user_prayers_update_own on public.user_prayers;

create policy user_prayers_select_own
  on public.user_prayers
  for select
  to authenticated
  using (auth.uid() = user_id);

create policy user_prayers_insert_own
  on public.user_prayers
  for insert
  to authenticated
  with check (auth.uid() = user_id);

create policy user_prayers_update_own
  on public.user_prayers
  for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

revoke all on table public.user_prayers from anon;
grant select, insert, update on public.user_prayers to authenticated;

-- Seed one dummy row for testing (first available user only).
insert into public.user_prayers (user_id, created_at, village_code)
select u.id, now(), 'TEST-VILLAGE'
from auth.users u
where not exists (
  select 1 from public.user_prayers p where p.user_id = u.id and p.village_code = 'TEST-VILLAGE'
)
order by u.created_at asc
limit 1;
