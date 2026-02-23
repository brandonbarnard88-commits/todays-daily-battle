-- =============================================================================
-- Supabase RLS Lockdown: only authenticated users read/write their own data.
-- No anon access. Run in Supabase SQL Editor (or via migration).
-- Tables: daily_battles, messages, message_reports, newsletter_signups, saved_*
-- =============================================================================

-- -----------------------------------------------------------------------------
-- 1. daily_battles (global "battle of the day" – no user_id)
--    Authenticated read only; writes via service role (e.g. seed edge function).
-- -----------------------------------------------------------------------------
ALTER TABLE public.daily_battles ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they grant anon or public access (adjust names if different)
DROP POLICY IF EXISTS "daily_battles_read_public" ON public.daily_battles;
DROP POLICY IF EXISTS "daily_battles_write_master" ON public.daily_battles;

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
-- 5. saved_verses (user_id = owner)
-- -----------------------------------------------------------------------------
ALTER TABLE public.saved_verses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "saved_verses_select_own"
  ON public.saved_verses
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "saved_verses_insert_own"
  ON public.saved_verses
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "saved_verses_update_own"
  ON public.saved_verses
  FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "saved_verses_delete_own"
  ON public.saved_verses
  FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());

-- -----------------------------------------------------------------------------
-- 6. saved_collections (already has user_id; ensure no anon, owner-only)
-- -----------------------------------------------------------------------------
ALTER TABLE public.saved_collections ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "saved_collections_owner_read" ON public.saved_collections;
DROP POLICY IF EXISTS "saved_collections_owner_write" ON public.saved_collections;

CREATE POLICY "saved_collections_select_own"
  ON public.saved_collections
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "saved_collections_insert_own"
  ON public.saved_collections
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "saved_collections_update_own"
  ON public.saved_collections
  FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "saved_collections_delete_own"
  ON public.saved_collections
  FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());

-- -----------------------------------------------------------------------------
-- 7. saved_verse_collections (user_id = owner)
-- -----------------------------------------------------------------------------
ALTER TABLE public.saved_verse_collections ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "saved_verse_collections_owner_read" ON public.saved_verse_collections;
DROP POLICY IF EXISTS "saved_verse_collections_owner_write" ON public.saved_verse_collections;

CREATE POLICY "saved_verse_collections_select_own"
  ON public.saved_verse_collections
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "saved_verse_collections_insert_own"
  ON public.saved_verse_collections
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "saved_verse_collections_update_own"
  ON public.saved_verse_collections
  FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "saved_verse_collections_delete_own"
  ON public.saved_verse_collections
  FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());

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
-- =============================================================================
