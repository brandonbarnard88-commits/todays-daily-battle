-- =============================================================================
-- RPC: count of prayers created today (server date, UTC)
-- Run in Supabase SQL Editor after supabase-prayers.sql (prayers table must exist).
--
-- After creating the function: add 1–2 real prayers (e.g. via the app or SQL)
-- so the homepage "X warriors prayed today" shows live proof instead of 0.
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
