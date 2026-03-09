-- =============================================================================
-- Push health RPC for Stats page (latest safe summary only)
-- Run in Supabase SQL Editor
-- =============================================================================

CREATE OR REPLACE FUNCTION public.get_push_health_latest()
RETURNS TABLE (
  created_at timestamptz,
  date_key text,
  status text,
  sent_count integer,
  failed_count integer,
  pruned_count integer
)
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT
    l.created_at,
    l.date_key,
    l.status,
    l.sent_count,
    l.failed_count,
    l.pruned_count
  FROM public.push_send_logs l
  ORDER BY l.created_at DESC
  LIMIT 1
$$;

REVOKE ALL ON FUNCTION public.get_push_health_latest() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_push_health_latest() TO anon;
GRANT EXECUTE ON FUNCTION public.get_push_health_latest() TO authenticated;
