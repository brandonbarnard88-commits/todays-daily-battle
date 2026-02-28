-- =============================================================================
-- RPC: count of prayers created today (server date, UTC)
-- Run in Supabase SQL Editor after supabase-prayers.sql (prayers table must exist).
-- =============================================================================

CREATE OR REPLACE FUNCTION public.get_prayers_today_count()
RETURNS bigint
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COUNT(*) FROM public.prayers
  WHERE created_at >= date_trunc('day', now())
    AND created_at < date_trunc('day', now()) + interval '1 day';
$$;

GRANT EXECUTE ON FUNCTION public.get_prayers_today_count() TO anon;
GRANT EXECUTE ON FUNCTION public.get_prayers_today_count() TO authenticated;
