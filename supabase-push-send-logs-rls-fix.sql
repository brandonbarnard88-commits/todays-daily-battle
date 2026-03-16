-- =============================================================================
-- Push send logs — Enable RLS and lock down access (service_role only)
-- Run in Supabase SQL Editor if push_send_logs exists but RLS is missing
-- =============================================================================

-- Enable RLS (blocks all access until policies exist)
ALTER TABLE public.push_send_logs ENABLE ROW LEVEL SECURITY;

-- Block anon and authenticated from all operations (service_role bypasses RLS)
DROP POLICY IF EXISTS "push_send_logs_no_client_select" ON public.push_send_logs;
CREATE POLICY "push_send_logs_no_client_select"
  ON public.push_send_logs FOR SELECT USING (false);

DROP POLICY IF EXISTS "push_send_logs_no_client_insert" ON public.push_send_logs;
CREATE POLICY "push_send_logs_no_client_insert"
  ON public.push_send_logs FOR INSERT WITH CHECK (false);

DROP POLICY IF EXISTS "push_send_logs_no_client_update" ON public.push_send_logs;
CREATE POLICY "push_send_logs_no_client_update"
  ON public.push_send_logs FOR UPDATE USING (false) WITH CHECK (false);

DROP POLICY IF EXISTS "push_send_logs_no_client_delete" ON public.push_send_logs;
CREATE POLICY "push_send_logs_no_client_delete"
  ON public.push_send_logs FOR DELETE USING (false);

-- Revoke table privileges from client roles
REVOKE ALL ON public.push_send_logs FROM anon, authenticated;
