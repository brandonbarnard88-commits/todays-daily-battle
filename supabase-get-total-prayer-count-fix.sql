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
-- Keep the raw table locked down. Shared prayer writes should continue to flow
-- through the protected submit-prayer Edge Function / service role only.
-- -----------------------------------------------------------------------------
ALTER TABLE public.prayers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.prayers FORCE ROW LEVEL SECURITY;
REVOKE ALL ON public.prayers FROM anon;
REVOKE ALL ON public.prayers FROM authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.prayers TO service_role;

-- Optional: if you need more rows to reach 14, run the block below once (adds 5).
-- INSERT INTO public.prayers (intent, created_at)
-- VALUES
--   ('peace', now() - interval '5 minutes'),
--   ('strength', now() - interval '4 minutes'),
--   ('healing', now() - interval '3 minutes'),
--   ('gratitude', now() - interval '2 minutes'),
--   ('hope', now() - interval '1 minute');
