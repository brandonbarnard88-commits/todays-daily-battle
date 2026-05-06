-- =============================================================================
-- RLS Lockdown Extended: all remaining user-data tables + profiles tier lock.
-- Run AFTER supabase-rls-lockdown.sql and supabase-profiles-tier.sql.
-- Ensures: anon has no access to user data; authenticated only own rows;
-- profiles tier can ONLY be set by service_role (webhook).
--
-- If a table does not exist yet (e.g. notes, saved_verses), skip or comment out
-- that section, or create the table first.
-- =============================================================================

-- -----------------------------------------------------------------------------
-- PROFILES: Only service_role may INSERT/UPDATE (tier lock)
-- Client only SELECTs own row; no client-side profile update.
-- -----------------------------------------------------------------------------
REVOKE UPDATE ON public.profiles FROM authenticated;
DROP POLICY IF EXISTS "profiles_update_own" ON public.profiles;
-- Service_role only: webhook inserts/updates profiles (including tier)
DROP POLICY IF EXISTS "profiles_insert_service" ON public.profiles;
DROP POLICY IF EXISTS "profiles_update_service" ON public.profiles;
CREATE POLICY "profiles_insert_service"
  ON public.profiles FOR INSERT TO service_role WITH CHECK (true);
CREATE POLICY "profiles_update_service"
  ON public.profiles FOR UPDATE TO service_role USING (true) WITH CHECK (true);
-- Authenticated: read own profile only
GRANT SELECT ON public.profiles TO authenticated;

-- -----------------------------------------------------------------------------
-- notes (user_id = owner)
-- -----------------------------------------------------------------------------
REVOKE ALL ON public.notes FROM anon;
ALTER TABLE public.notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notes FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "notes_select_own" ON public.notes;
DROP POLICY IF EXISTS "notes_insert_own" ON public.notes;
DROP POLICY IF EXISTS "notes_update_own" ON public.notes;
DROP POLICY IF EXISTS "notes_delete_own" ON public.notes;
CREATE POLICY "notes_select_own" ON public.notes FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "notes_insert_own" ON public.notes FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
CREATE POLICY "notes_update_own" ON public.notes FOR UPDATE TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
CREATE POLICY "notes_delete_own" ON public.notes FOR DELETE TO authenticated USING (user_id = auth.uid());
GRANT SELECT, INSERT, UPDATE, DELETE ON public.notes TO authenticated;

-- -----------------------------------------------------------------------------
-- saved_verses (user_id = owner)
-- -----------------------------------------------------------------------------
REVOKE ALL ON public.saved_verses FROM anon;
ALTER TABLE public.saved_verses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saved_verses FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "saved_verses_select_own" ON public.saved_verses;
DROP POLICY IF EXISTS "saved_verses_insert_own" ON public.saved_verses;
DROP POLICY IF EXISTS "saved_verses_update_own" ON public.saved_verses;
DROP POLICY IF EXISTS "saved_verses_delete_own" ON public.saved_verses;
CREATE POLICY "saved_verses_select_own" ON public.saved_verses FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "saved_verses_insert_own" ON public.saved_verses FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
CREATE POLICY "saved_verses_update_own" ON public.saved_verses FOR UPDATE TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
CREATE POLICY "saved_verses_delete_own" ON public.saved_verses FOR DELETE TO authenticated USING (user_id = auth.uid());
GRANT SELECT, INSERT, UPDATE, DELETE ON public.saved_verses TO authenticated;

-- -----------------------------------------------------------------------------
-- saved_collections (user_id = owner)
-- -----------------------------------------------------------------------------
REVOKE ALL ON public.saved_collections FROM anon;
ALTER TABLE public.saved_collections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saved_collections FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "saved_collections_select_own" ON public.saved_collections;
DROP POLICY IF EXISTS "saved_collections_insert_own" ON public.saved_collections;
DROP POLICY IF EXISTS "saved_collections_update_own" ON public.saved_collections;
DROP POLICY IF EXISTS "saved_collections_delete_own" ON public.saved_collections;
CREATE POLICY "saved_collections_select_own" ON public.saved_collections FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "saved_collections_insert_own" ON public.saved_collections FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
CREATE POLICY "saved_collections_update_own" ON public.saved_collections FOR UPDATE TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
CREATE POLICY "saved_collections_delete_own" ON public.saved_collections FOR DELETE TO authenticated USING (user_id = auth.uid());
GRANT SELECT, INSERT, UPDATE, DELETE ON public.saved_collections TO authenticated;

-- -----------------------------------------------------------------------------
-- saved_verse_collections (user_id = owner; or via collection ownership)
-- -----------------------------------------------------------------------------
REVOKE ALL ON public.saved_verse_collections FROM anon;
ALTER TABLE public.saved_verse_collections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saved_verse_collections FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "saved_verse_collections_select_own" ON public.saved_verse_collections;
DROP POLICY IF EXISTS "saved_verse_collections_insert_own" ON public.saved_verse_collections;
DROP POLICY IF EXISTS "saved_verse_collections_update_own" ON public.saved_verse_collections;
DROP POLICY IF EXISTS "saved_verse_collections_delete_own" ON public.saved_verse_collections;
-- Allow if user owns the collection (join via saved_collections)
CREATE POLICY "saved_verse_collections_select_own" ON public.saved_verse_collections FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM public.saved_collections c WHERE c.id = saved_verse_collections.collection_id AND c.user_id = auth.uid()));
CREATE POLICY "saved_verse_collections_insert_own" ON public.saved_verse_collections FOR INSERT TO authenticated
  WITH CHECK (EXISTS (SELECT 1 FROM public.saved_collections c WHERE c.id = saved_verse_collections.collection_id AND c.user_id = auth.uid()));
CREATE POLICY "saved_verse_collections_update_own" ON public.saved_verse_collections FOR UPDATE TO authenticated
  USING (EXISTS (SELECT 1 FROM public.saved_collections c WHERE c.id = saved_verse_collections.collection_id AND c.user_id = auth.uid()))
  WITH CHECK (EXISTS (SELECT 1 FROM public.saved_collections c WHERE c.id = saved_verse_collections.collection_id AND c.user_id = auth.uid()));
CREATE POLICY "saved_verse_collections_delete_own" ON public.saved_verse_collections FOR DELETE TO authenticated
  USING (EXISTS (SELECT 1 FROM public.saved_collections c WHERE c.id = saved_verse_collections.collection_id AND c.user_id = auth.uid()));
GRANT SELECT, INSERT, UPDATE, DELETE ON public.saved_verse_collections TO authenticated;

-- -----------------------------------------------------------------------------
-- sermons (user_id = owner)
-- -----------------------------------------------------------------------------
REVOKE ALL ON public.sermons FROM anon;
ALTER TABLE public.sermons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sermons FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "sermons_select_own" ON public.sermons;
DROP POLICY IF EXISTS "sermons_insert_own" ON public.sermons;
DROP POLICY IF EXISTS "sermons_update_own" ON public.sermons;
DROP POLICY IF EXISTS "sermons_delete_own" ON public.sermons;
CREATE POLICY "sermons_select_own" ON public.sermons FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "sermons_insert_own" ON public.sermons FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
CREATE POLICY "sermons_update_own" ON public.sermons FOR UPDATE TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
CREATE POLICY "sermons_delete_own" ON public.sermons FOR DELETE TO authenticated USING (user_id = auth.uid());
GRANT SELECT, INSERT, UPDATE, DELETE ON public.sermons TO authenticated;

-- -----------------------------------------------------------------------------
-- lessons (user_id = owner)
-- -----------------------------------------------------------------------------
REVOKE ALL ON public.lessons FROM anon;
ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lessons FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "lessons_select_own" ON public.lessons;
DROP POLICY IF EXISTS "lessons_insert_own" ON public.lessons;
DROP POLICY IF EXISTS "lessons_update_own" ON public.lessons;
DROP POLICY IF EXISTS "lessons_delete_own" ON public.lessons;
CREATE POLICY "lessons_select_own" ON public.lessons FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "lessons_insert_own" ON public.lessons FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
CREATE POLICY "lessons_update_own" ON public.lessons FOR UPDATE TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
CREATE POLICY "lessons_delete_own" ON public.lessons FOR DELETE TO authenticated USING (user_id = auth.uid());
GRANT SELECT, INSERT, UPDATE, DELETE ON public.lessons TO authenticated;

-- -----------------------------------------------------------------------------
-- shares (public read by id only; insert by authenticated)
-- -----------------------------------------------------------------------------
REVOKE ALL ON public.shares FROM anon;
ALTER TABLE public.shares ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shares FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "shares_select_any" ON public.shares;
DROP POLICY IF EXISTS "shares_insert_authenticated" ON public.shares;
CREATE POLICY "shares_select_any" ON public.shares FOR SELECT TO authenticated USING (true);
CREATE POLICY "shares_select_anon" ON public.shares FOR SELECT TO anon USING (true);
CREATE POLICY "shares_insert_authenticated" ON public.shares FOR INSERT TO authenticated WITH CHECK (true);
GRANT SELECT ON public.shares TO anon;
GRANT SELECT, INSERT ON public.shares TO authenticated;

-- -----------------------------------------------------------------------------
-- supporter_waitlist (anon INSERT only; no anon SELECT)
-- -----------------------------------------------------------------------------
REVOKE ALL ON public.supporter_waitlist FROM anon;
ALTER TABLE public.supporter_waitlist ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.supporter_waitlist FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "supporter_waitlist_insert_anon" ON public.supporter_waitlist;
DROP POLICY IF EXISTS "supporter_waitlist_select_service" ON public.supporter_waitlist;
CREATE POLICY "supporter_waitlist_insert_anon" ON public.supporter_waitlist FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "supporter_waitlist_select_service" ON public.supporter_waitlist FOR SELECT TO service_role USING (true);
GRANT INSERT ON public.supporter_waitlist TO anon;
GRANT SELECT ON public.supporter_waitlist TO service_role;

-- -----------------------------------------------------------------------------
-- battle_pro_subscriptions (user_id = owner; read only for client)
-- -----------------------------------------------------------------------------
REVOKE ALL ON public.battle_pro_subscriptions FROM anon;
ALTER TABLE public.battle_pro_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.battle_pro_subscriptions FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "battle_pro_subscriptions_select_own" ON public.battle_pro_subscriptions;
CREATE POLICY "battle_pro_subscriptions_select_own" ON public.battle_pro_subscriptions FOR SELECT TO authenticated USING (user_id = auth.uid());
GRANT SELECT ON public.battle_pro_subscriptions TO authenticated;

-- -----------------------------------------------------------------------------
-- churches (authenticated can read for listings; writes via service or RPC)
-- -----------------------------------------------------------------------------
REVOKE ALL ON public.churches FROM anon;
ALTER TABLE public.churches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.churches FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "churches_select_authenticated" ON public.churches;
CREATE POLICY "churches_select_authenticated" ON public.churches FOR SELECT TO authenticated USING (true);
GRANT SELECT ON public.churches TO authenticated;

-- -----------------------------------------------------------------------------
-- church_members (user sees own membership and their church's members)
-- -----------------------------------------------------------------------------
REVOKE ALL ON public.church_members FROM anon;
ALTER TABLE public.church_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.church_members FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "church_members_select_own" ON public.church_members;
DROP POLICY IF EXISTS "church_members_insert_own" ON public.church_members;
CREATE POLICY "church_members_select_own" ON public.church_members FOR SELECT TO authenticated
  USING (user_id = auth.uid() OR church_id IN (SELECT church_id FROM public.church_members WHERE user_id = auth.uid()));
CREATE POLICY "church_members_insert_own" ON public.church_members FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
GRANT SELECT, INSERT ON public.church_members TO authenticated;

-- -----------------------------------------------------------------------------
-- church_prayer_list, church_verse_of_day, church_sermons
-- (church members only; add columns church_id / user_id as in your schema)
-- -----------------------------------------------------------------------------
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'church_prayer_list') THEN
    REVOKE ALL ON public.church_prayer_list FROM anon;
    ALTER TABLE public.church_prayer_list ENABLE ROW LEVEL SECURITY;
    ALTER TABLE public.church_prayer_list FORCE ROW LEVEL SECURITY;
    DROP POLICY IF EXISTS "church_prayer_list_select_member" ON public.church_prayer_list;
    DROP POLICY IF EXISTS "church_prayer_list_insert_member" ON public.church_prayer_list;
    DROP POLICY IF EXISTS "church_prayer_list_update_member" ON public.church_prayer_list;
    CREATE POLICY "church_prayer_list_select_member" ON public.church_prayer_list FOR SELECT TO authenticated
      USING (church_id IN (SELECT church_id FROM public.church_members WHERE user_id = auth.uid()));
    CREATE POLICY "church_prayer_list_insert_member" ON public.church_prayer_list FOR INSERT TO authenticated
      WITH CHECK (church_id IN (SELECT church_id FROM public.church_members WHERE user_id = auth.uid()));
    CREATE POLICY "church_prayer_list_update_member" ON public.church_prayer_list FOR UPDATE TO authenticated
      USING (church_id IN (SELECT church_id FROM public.church_members WHERE user_id = auth.uid()));
    GRANT SELECT, INSERT, UPDATE ON public.church_prayer_list TO authenticated;
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'church_verse_of_day') THEN
    REVOKE ALL ON public.church_verse_of_day FROM anon;
    ALTER TABLE public.church_verse_of_day ENABLE ROW LEVEL SECURITY;
    ALTER TABLE public.church_verse_of_day FORCE ROW LEVEL SECURITY;
    DROP POLICY IF EXISTS "church_verse_of_day_select_member" ON public.church_verse_of_day;
    CREATE POLICY "church_verse_of_day_select_member" ON public.church_verse_of_day FOR SELECT TO authenticated
      USING (church_id IN (SELECT church_id FROM public.church_members WHERE user_id = auth.uid()));
    GRANT SELECT ON public.church_verse_of_day TO authenticated;
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'church_sermons') THEN
    REVOKE ALL ON public.church_sermons FROM anon;
    ALTER TABLE public.church_sermons ENABLE ROW LEVEL SECURITY;
    ALTER TABLE public.church_sermons FORCE ROW LEVEL SECURITY;
    DROP POLICY IF EXISTS "church_sermons_select_member" ON public.church_sermons;
    DROP POLICY IF EXISTS "church_sermons_insert_member" ON public.church_sermons;
    CREATE POLICY "church_sermons_select_member" ON public.church_sermons FOR SELECT TO authenticated
      USING (church_id IN (SELECT church_id FROM public.church_members WHERE user_id = auth.uid()));
    CREATE POLICY "church_sermons_insert_member" ON public.church_sermons FOR INSERT TO authenticated
      WITH CHECK (church_id IN (SELECT church_id FROM public.church_members WHERE user_id = auth.uid()));
    GRANT SELECT, INSERT ON public.church_sermons TO authenticated;
  END IF;
END $$;

-- =============================================================================
-- Verification: with anon key, SELECT from profiles, notes, saved_verses, etc.
-- should return [] or 403. Only prayers (and shares/supporter_waitlist per policy)
-- allow anon as designed.
-- =============================================================================
