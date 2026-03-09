-- =============================================================================
-- Push send run logs for daily verse notifications
-- Run in Supabase SQL Editor
-- =============================================================================

CREATE TABLE IF NOT EXISTS public.push_send_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  date_key text NOT NULL,
  status text NOT NULL CHECK (status IN ('ok', 'empty', 'error')),
  sent_count integer NOT NULL DEFAULT 0,
  failed_count integer NOT NULL DEFAULT 0,
  pruned_count integer NOT NULL DEFAULT 0,
  error_message text
);

CREATE INDEX IF NOT EXISTS push_send_logs_created_at_desc
  ON public.push_send_logs (created_at DESC);

CREATE INDEX IF NOT EXISTS push_send_logs_date_key_idx
  ON public.push_send_logs (date_key);

ALTER TABLE public.push_send_logs ENABLE ROW LEVEL SECURITY;

-- Service-role only table. Do not expose to anon/authenticated directly.
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

REVOKE ALL ON public.push_send_logs FROM anon, authenticated;
