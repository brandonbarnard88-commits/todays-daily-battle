-- =============================================================================
-- Fixes full count RPC, enables anon inserts for quick-pray ♥, public read for map/counter.
-- Run once in Supabase → SQL Editor → Run.
-- =============================================================================

DROP FUNCTION IF EXISTS public.get_total_prayer_count();
DROP FUNCTION IF EXISTS public.get_last_prayer_created_at();

CREATE OR REPLACE FUNCTION public.get_total_prayer_count()
RETURNS bigint
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COUNT(*) FROM public.prayers;
$$;

GRANT EXECUTE ON FUNCTION public.get_total_prayer_count() TO anon;
GRANT EXECUTE ON FUNCTION public.get_total_prayer_count() TO authenticated;

CREATE OR REPLACE FUNCTION public.get_last_prayer_created_at()
RETURNS timestamptz
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT MAX(created_at) FROM public.prayers;
$$;

GRANT EXECUTE ON FUNCTION public.get_last_prayer_created_at() TO anon;
GRANT EXECUTE ON FUNCTION public.get_last_prayer_created_at() TO authenticated;

ALTER TABLE public.prayers ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "prayers_anon_insert" ON public.prayers;
DROP POLICY IF EXISTS "prayers_insert_anon" ON public.prayers;
CREATE POLICY "prayers_anon_insert"
  ON public.prayers
  FOR INSERT
  TO anon
  WITH CHECK (true);

DROP POLICY IF EXISTS "prayers_anon_select" ON public.prayers;
CREATE POLICY "prayers_anon_select"
  ON public.prayers
  FOR SELECT
  TO anon
  USING (true);

GRANT SELECT, INSERT ON public.prayers TO anon;
