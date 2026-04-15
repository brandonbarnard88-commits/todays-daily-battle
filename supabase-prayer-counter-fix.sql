-- =============================================================================
-- Fixes count/timestamp RPCs only. Raw `public.prayers` stays locked down.
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
ALTER TABLE public.prayers FORCE ROW LEVEL SECURITY;

-- Do not re-open raw table access here.
REVOKE ALL ON public.prayers FROM anon;
REVOKE ALL ON public.prayers FROM authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.prayers TO service_role;
