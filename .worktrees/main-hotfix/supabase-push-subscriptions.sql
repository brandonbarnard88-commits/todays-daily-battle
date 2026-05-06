-- =============================================================================
-- Web Push subscriptions (VAPID) for daily verse notifications
-- Run in Supabase SQL Editor
-- =============================================================================

CREATE TABLE IF NOT EXISTS public.push_subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  endpoint text NOT NULL UNIQUE,
  p256dh text NOT NULL,
  auth text NOT NULL,
  source text NOT NULL DEFAULT 'webpush',
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  timezone text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS push_subscriptions_user_id_idx
  ON public.push_subscriptions (user_id);

CREATE INDEX IF NOT EXISTS push_subscriptions_updated_at_idx
  ON public.push_subscriptions (updated_at DESC);

ALTER TABLE public.push_subscriptions ENABLE ROW LEVEL SECURITY;

-- Lock this table to service-role managed writes via Edge Functions.
DROP POLICY IF EXISTS "push_subscriptions_no_client_select" ON public.push_subscriptions;
CREATE POLICY "push_subscriptions_no_client_select"
  ON public.push_subscriptions FOR SELECT USING (false);

DROP POLICY IF EXISTS "push_subscriptions_no_client_insert" ON public.push_subscriptions;
CREATE POLICY "push_subscriptions_no_client_insert"
  ON public.push_subscriptions FOR INSERT WITH CHECK (false);

DROP POLICY IF EXISTS "push_subscriptions_no_client_update" ON public.push_subscriptions;
CREATE POLICY "push_subscriptions_no_client_update"
  ON public.push_subscriptions FOR UPDATE USING (false) WITH CHECK (false);

DROP POLICY IF EXISTS "push_subscriptions_no_client_delete" ON public.push_subscriptions;
CREATE POLICY "push_subscriptions_no_client_delete"
  ON public.push_subscriptions FOR DELETE USING (false);

REVOKE ALL ON public.push_subscriptions FROM anon, authenticated;
