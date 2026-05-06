-- =============================================================================
-- Battle Pro: subscriptions table for Stripe + Supabase auth
-- Run in Supabase SQL Editor. Use with Stripe webhook or Edge Function to set
-- stripe_subscription_id, plan, wins_report_unlocked on payment success.
-- =============================================================================

-- 1. Subscriptions table (one row per user with active Battle Pro)
CREATE TABLE IF NOT EXISTS public.battle_pro_subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  email text,
  stripe_customer_id text,
  stripe_subscription_id text,
  plan text NOT NULL DEFAULT 'supporter',
  wins_report_unlocked boolean NOT NULL DEFAULT true,
  offline_downloads_enabled boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

-- 2. Index for lookup by user
CREATE INDEX IF NOT EXISTS battle_pro_subscriptions_user_id ON public.battle_pro_subscriptions (user_id);
CREATE INDEX IF NOT EXISTS battle_pro_subscriptions_stripe_sub ON public.battle_pro_subscriptions (stripe_subscription_id);

-- 3. RLS: users can read their own row only
ALTER TABLE public.battle_pro_subscriptions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "battle_pro_select_own" ON public.battle_pro_subscriptions;
CREATE POLICY "battle_pro_select_own" ON public.battle_pro_subscriptions
  FOR SELECT USING (auth.uid() = user_id);

-- 4. Service role (or webhook) can insert/update; anon cannot.
-- For Stripe webhook / Edge Function: use service role key to INSERT or UPDATE
-- after checkout.session.completed (map stripe customer email to user_id, or
-- store stripe_customer_id and link on first login).
DROP POLICY IF EXISTS "battle_pro_insert_service" ON public.battle_pro_subscriptions;
CREATE POLICY "battle_pro_insert_service" ON public.battle_pro_subscriptions
  FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "battle_pro_update_service" ON public.battle_pro_subscriptions;
CREATE POLICY "battle_pro_update_service" ON public.battle_pro_subscriptions
  FOR UPDATE USING (true) WITH CHECK (true);

-- 5. Grant SELECT to authenticated users (for their own row via RLS)
GRANT SELECT ON public.battle_pro_subscriptions TO authenticated;
GRANT SELECT, INSERT, UPDATE ON public.battle_pro_subscriptions TO service_role;

-- 6. Optional: updated_at trigger
CREATE OR REPLACE FUNCTION public.battle_pro_updated_at()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;
DROP TRIGGER IF EXISTS battle_pro_subscriptions_updated ON public.battle_pro_subscriptions;
CREATE TRIGGER battle_pro_subscriptions_updated
  BEFORE UPDATE ON public.battle_pro_subscriptions
  FOR EACH ROW EXECUTE FUNCTION public.battle_pro_updated_at();
