-- =============================================================================
-- Core Supabase SQL — run in Supabase SQL Editor (Dashboard → SQL Editor)
-- Order: profiles (tier) → battle_pro_subscriptions → prayers → daily_battles
-- =============================================================================

-- 1. PROFILES (tier column for Stripe webhook)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text,
  updated_at timestamptz DEFAULT now()
);
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS tier text NOT NULL DEFAULT 'free';
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "profiles_select_own" ON public.profiles;
CREATE POLICY "profiles_select_own" ON public.profiles FOR SELECT USING (auth.uid() = id);
DROP POLICY IF EXISTS "profiles_update_own" ON public.profiles;
CREATE POLICY "profiles_update_own" ON public.profiles FOR UPDATE USING (auth.uid() = id) WITH CHECK (auth.uid() = id);
DROP POLICY IF EXISTS "profiles_insert_service" ON public.profiles;
CREATE POLICY "profiles_insert_service" ON public.profiles FOR INSERT TO service_role WITH CHECK (true);
DROP POLICY IF EXISTS "profiles_update_service" ON public.profiles;
CREATE POLICY "profiles_update_service" ON public.profiles FOR UPDATE TO service_role USING (true) WITH CHECK (true);
GRANT SELECT, UPDATE ON public.profiles TO authenticated;
GRANT SELECT, INSERT, UPDATE ON public.profiles TO service_role;

-- 2. BATTLE PRO SUBSCRIPTIONS
-- -----------------------------------------------------------------------------
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
CREATE INDEX IF NOT EXISTS battle_pro_subscriptions_user_id ON public.battle_pro_subscriptions (user_id);
CREATE INDEX IF NOT EXISTS battle_pro_subscriptions_stripe_sub ON public.battle_pro_subscriptions (stripe_subscription_id);
ALTER TABLE public.battle_pro_subscriptions ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "battle_pro_select_own" ON public.battle_pro_subscriptions;
CREATE POLICY "battle_pro_select_own" ON public.battle_pro_subscriptions FOR SELECT USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "battle_pro_insert_service" ON public.battle_pro_subscriptions;
CREATE POLICY "battle_pro_insert_service" ON public.battle_pro_subscriptions FOR INSERT WITH CHECK (true);
DROP POLICY IF EXISTS "battle_pro_update_service" ON public.battle_pro_subscriptions;
CREATE POLICY "battle_pro_update_service" ON public.battle_pro_subscriptions FOR UPDATE USING (true) WITH CHECK (true);
GRANT SELECT ON public.battle_pro_subscriptions TO authenticated;
GRANT SELECT, INSERT, UPDATE ON public.battle_pro_subscriptions TO service_role;
CREATE OR REPLACE FUNCTION public.battle_pro_updated_at() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$;
DROP TRIGGER IF EXISTS battle_pro_subscriptions_updated ON public.battle_pro_subscriptions;
CREATE TRIGGER battle_pro_subscriptions_updated BEFORE UPDATE ON public.battle_pro_subscriptions FOR EACH ROW EXECUTE FUNCTION public.battle_pro_updated_at();

-- 3. PRAYERS (table + RPCs for counter & echo)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.prayers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  intent text,
  family_name text,
  session_id text,
  amen_count integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS prayers_created_at_desc ON public.prayers (created_at DESC);
CREATE OR REPLACE FUNCTION public.get_prayer_presence_count() RETURNS integer LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT count(DISTINCT session_id)::integer FROM public.prayers WHERE created_at > (now() - interval '15 minutes') AND session_id IS NOT NULL;
$$;
CREATE OR REPLACE FUNCTION public.get_total_prayer_count() RETURNS bigint LANGUAGE sql SECURITY DEFINER SET search_path = public AS $$
  SELECT COUNT(*) FROM public.prayers;
$$;
CREATE OR REPLACE FUNCTION public.get_prayers_today_count() RETURNS bigint LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT COUNT(*) FROM public.prayers
  WHERE created_at >= date_trunc('day', now())
    AND created_at < date_trunc('day', now()) + interval '1 day';
$$;
CREATE OR REPLACE FUNCTION public.get_last_prayer_created_at() RETURNS timestamptz LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT max(created_at) FROM public.prayers;
$$;
CREATE OR REPLACE FUNCTION public.get_recent_prayers(p_limit integer DEFAULT 3) RETURNS TABLE (
  id uuid,
  intent text,
  created_at timestamptz,
  amen_count integer,
  family_name text
) LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT p.id, p.intent, p.created_at, p.amen_count, p.family_name
  FROM public.prayers p
  WHERE nullif(btrim(p.intent), '') IS NOT NULL
  ORDER BY p.created_at DESC
  LIMIT LEAST(GREATEST(COALESCE(p_limit, 3), 1), 10);
$$;
CREATE OR REPLACE FUNCTION public.get_prayer_echo_match_count(p_query text) RETURNS integer LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT COUNT(*)::integer
  FROM public.prayers
  WHERE nullif(btrim(COALESCE(p_query, '')), '') IS NOT NULL
    AND intent ILIKE '%' || left(btrim(p_query), 120) || '%';
$$;
CREATE OR REPLACE FUNCTION public.get_prayer_intent_suggestions(p_limit integer DEFAULT 10) RETURNS TABLE (intent text) LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT p.intent
  FROM public.prayers p
  WHERE nullif(btrim(p.intent), '') IS NOT NULL
  GROUP BY p.intent
  ORDER BY max(p.created_at) DESC
  LIMIT LEAST(GREATEST(COALESCE(p_limit, 10), 1), 20);
$$;
CREATE OR REPLACE FUNCTION public.increment_prayer_amen(p_prayer_id uuid) RETURNS integer LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  next_count integer;
BEGIN
  UPDATE public.prayers
  SET amen_count = COALESCE(amen_count, 0) + 1
  WHERE id = p_prayer_id
  RETURNING amen_count INTO next_count;
  RETURN next_count;
END;
$$;
ALTER TABLE public.prayers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.prayers FORCE ROW LEVEL SECURITY;
DO $$
DECLARE
  r RECORD;
BEGIN
  FOR r IN (
    SELECT policyname
    FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'prayers'
  ) LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON public.prayers', r.policyname);
  END LOOP;
END $$;
GRANT EXECUTE ON FUNCTION public.get_prayer_presence_count() TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.get_total_prayer_count() TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.get_prayers_today_count() TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.get_last_prayer_created_at() TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.get_recent_prayers(integer) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.get_prayer_echo_match_count(text) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.get_prayer_intent_suggestions(integer) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.increment_prayer_amen(uuid) TO anon, authenticated;
REVOKE ALL ON public.prayers FROM anon;
REVOKE ALL ON public.prayers FROM authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.prayers TO service_role;

-- 4. DAILY BATTLES
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.daily_battles (
  date date PRIMARY KEY,
  verse_ref text NOT NULL,
  reflection text,
  prayer text,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE public.daily_battles ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "daily_battles_read_public" ON public.daily_battles;
CREATE POLICY "daily_battles_read_public" ON public.daily_battles FOR SELECT USING (true);
DROP POLICY IF EXISTS "daily_battles_write_master" ON public.daily_battles;
DROP POLICY IF EXISTS "daily_battles_insert_service" ON public.daily_battles;
DROP POLICY IF EXISTS "daily_battles_update_service" ON public.daily_battles;
DROP POLICY IF EXISTS "daily_battles_delete_service" ON public.daily_battles;
CREATE POLICY "daily_battles_insert_service" ON public.daily_battles FOR INSERT TO service_role WITH CHECK (true);
CREATE POLICY "daily_battles_update_service" ON public.daily_battles FOR UPDATE TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "daily_battles_delete_service" ON public.daily_battles FOR DELETE TO service_role USING (true);
GRANT SELECT ON public.daily_battles TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.daily_battles TO service_role;
