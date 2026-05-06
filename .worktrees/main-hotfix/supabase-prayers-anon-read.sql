-- =============================================================================
-- Re-allow anon SELECT on prayers (verse echo + prayer wall for anonymous users)
-- Run in Supabase SQL Editor after supabase-rls-lockdown.sql
--
-- Why: RLS lockdown revokes anon SELECT on prayers. The verse echo
-- ("A household just prayed this verse") and prayer wall list use
-- anon-key SELECTs. Without this, those requests get 403 and the browser
-- may show "access control checks" / "offline" errors.
-- =============================================================================

-- Grant anon permission to read (in addition to existing INSERT)
GRANT SELECT ON public.prayers TO anon;

-- Policy: anon can read all rows (same as original supabase-prayers.sql;
-- intent/family_name are optional and public by design for echo/wall)
DROP POLICY IF EXISTS "prayers_select_anon" ON public.prayers;
CREATE POLICY "prayers_select_anon"
  ON public.prayers
  FOR SELECT
  TO anon
  USING (true);
