-- =============================================================================
-- Failed prayer sync attempts (offline queue retries)
-- Run in Supabase SQL Editor
-- =============================================================================

CREATE TABLE IF NOT EXISTS public.failed_prayer_attempts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  intent text NOT NULL,
  attempts integer NOT NULL DEFAULT 1,
  last_tried_at timestamptz,
  error_message text,
  source text,
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS failed_prayer_attempts_user_id_idx
  ON public.failed_prayer_attempts (user_id);

CREATE INDEX IF NOT EXISTS failed_prayer_attempts_created_at_desc
  ON public.failed_prayer_attempts (created_at DESC);

ALTER TABLE public.failed_prayer_attempts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "failed_prayer_attempts_select_own" ON public.failed_prayer_attempts;
CREATE POLICY "failed_prayer_attempts_select_own"
  ON public.failed_prayer_attempts FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "failed_prayer_attempts_insert_own" ON public.failed_prayer_attempts;
CREATE POLICY "failed_prayer_attempts_insert_own"
  ON public.failed_prayer_attempts FOR INSERT
  WITH CHECK (auth.uid() = user_id);

REVOKE UPDATE, DELETE ON public.failed_prayer_attempts FROM anon, authenticated;
GRANT SELECT, INSERT ON public.failed_prayer_attempts TO authenticated;
