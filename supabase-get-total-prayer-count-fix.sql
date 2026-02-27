-- =============================================================================
-- Fix: get_total_prayer_count — count all rows, no filters (RETURNS bigint)
-- Run in Supabase SQL Editor if counter is stuck. Then reload page; tap ♥ → wait 10s → count +1.
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
