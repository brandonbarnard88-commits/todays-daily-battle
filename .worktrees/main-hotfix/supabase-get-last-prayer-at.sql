-- =============================================================================
-- RPC: last prayer timestamp (for "Last prayer: X min ago" badge)
-- Run in Supabase SQL Editor. Grant EXECUTE to anon/authenticated.
-- =============================================================================

CREATE OR REPLACE FUNCTION public.get_last_prayer_created_at()
RETURNS timestamptz
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT max(created_at) FROM public.prayers;
$$;

GRANT EXECUTE ON FUNCTION public.get_last_prayer_created_at() TO anon;
GRANT EXECUTE ON FUNCTION public.get_last_prayer_created_at() TO authenticated;
