-- =============================================================================
-- RPC: count of kids_beta_waitlist signups. Returns a single number (no row data).
-- Run in Supabase SQL Editor after supabase-kids-beta-waitlist.sql.
-- Anon can call; used for "Only X spots left!" counter.
-- =============================================================================

CREATE OR REPLACE FUNCTION public.get_waitlist_count()
RETURNS bigint
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COUNT(*)::bigint FROM public.kids_beta_waitlist;
$$;

GRANT EXECUTE ON FUNCTION public.get_waitlist_count() TO anon;
GRANT EXECUTE ON FUNCTION public.get_waitlist_count() TO authenticated;
