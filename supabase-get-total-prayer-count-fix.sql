-- =============================================================================
-- Fix: get_total_prayer_count — count all rows, no filters (RETURNS bigint)
-- Run in Supabase SQL Editor if counter is stuck or shows wrong number.
-- Step 1: Check current count → SELECT COUNT(*) FROM prayers;
-- Step 2: Run this file (redefines RPC). Optional: run supabase-prayers-seed.sql
--         to add 5 rows, or insert manually in Table Editor until count matches.
-- Step 3: Hard refresh site (Ctrl+Shift+R); tap ♥ → wait 10s → count should update.
-- =============================================================================

CREATE OR REPLACE FUNCTION public.get_total_prayer_count()
RETURNS bigint
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COUNT(*) FROM public.prayers;
$$;

-- Ensure anon can still call it (no change if already granted)
GRANT EXECUTE ON FUNCTION public.get_total_prayer_count() TO anon;
GRANT EXECUTE ON FUNCTION public.get_total_prayer_count() TO authenticated;

-- -----------------------------------------------------------------------------
-- If ♥ taps don't stick: anon needs explicit INSERT policy + GRANT.
-- Run this block so quick-pray (anonymous) inserts are allowed.
-- -----------------------------------------------------------------------------
ALTER TABLE public.prayers ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "prayers_anon_insert" ON public.prayers;
DROP POLICY IF EXISTS "prayers_insert_anon" ON public.prayers;
CREATE POLICY "prayers_anon_insert" ON public.prayers
  FOR INSERT TO anon WITH CHECK (true);

GRANT INSERT ON public.prayers TO anon;

-- Optional: if you need more rows to reach 14, run the block below once (adds 5).
-- INSERT INTO public.prayers (intent, created_at)
-- VALUES
--   ('peace', now() - interval '5 minutes'),
--   ('strength', now() - interval '4 minutes'),
--   ('healing', now() - interval '3 minutes'),
--   ('gratitude', now() - interval '2 minutes'),
--   ('hope', now() - interval '1 minute');
