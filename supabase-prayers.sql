-- =============================================================================
-- Prayers table + presence count RPC (fixes 404s for prayer echo & counter)
-- Run in Supabase SQL Editor: Dashboard → SQL Editor → New query → paste → Run
-- Optional: run supabase-prayers-seed.sql to insert 5 sample rows so the counter shows real data.
-- =============================================================================

-- 1. Create prayers table (if not exists)
CREATE TABLE IF NOT EXISTS public.prayers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  intent text,
  family_name text,
  session_id text,
  amen_count integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- 2. Index for echo (recent first)
CREATE INDEX IF NOT EXISTS prayers_created_at_desc ON public.prayers (created_at DESC);

-- 3. RPC: presence = distinct sessions in last 15 minutes
CREATE OR REPLACE FUNCTION public.get_prayer_presence_count()
RETURNS integer
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT count(DISTINCT session_id)::integer
  FROM public.prayers
  WHERE created_at > (now() - interval '15 minutes')
    AND session_id IS NOT NULL;
$$;

-- 3b. RPC: total prayers ever (all rows, no filters—counts everything)
CREATE OR REPLACE FUNCTION public.get_total_prayer_count()
RETURNS bigint
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COUNT(*) FROM public.prayers;
$$;

-- 3c. RPC: prayers created today (UTC)
CREATE OR REPLACE FUNCTION public.get_prayers_today_count()
RETURNS bigint
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COUNT(*)
  FROM public.prayers
  WHERE created_at >= date_trunc('day', now())
    AND created_at < date_trunc('day', now()) + interval '1 day';
$$;

-- 3d. RPC: last prayer timestamp
CREATE OR REPLACE FUNCTION public.get_last_prayer_created_at()
RETURNS timestamptz
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT max(created_at) FROM public.prayers;
$$;

-- 3e. RPC: recent prayers for the public echo
CREATE OR REPLACE FUNCTION public.get_recent_prayers(p_limit integer DEFAULT 3)
RETURNS TABLE (
  id uuid,
  intent text,
  created_at timestamptz,
  amen_count integer,
  family_name text
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT
    p.id,
    p.intent,
    p.created_at,
    p.amen_count,
    p.family_name
  FROM public.prayers p
  WHERE nullif(btrim(p.intent), '') IS NOT NULL
  ORDER BY p.created_at DESC
  LIMIT LEAST(GREATEST(COALESCE(p_limit, 3), 1), 10);
$$;

-- 3f. RPC: "someone just prayed this verse" indicator
CREATE OR REPLACE FUNCTION public.get_prayer_echo_match_count(p_query text)
RETURNS integer
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COUNT(*)::integer
  FROM public.prayers
  WHERE nullif(btrim(COALESCE(p_query, '')), '') IS NOT NULL
    AND intent ILIKE '%' || left(btrim(p_query), 120) || '%';
$$;

-- 3g. RPC: distinct prayer suggestions for quick-pray datalist
CREATE OR REPLACE FUNCTION public.get_prayer_intent_suggestions(p_limit integer DEFAULT 10)
RETURNS TABLE (intent text)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT p.intent
  FROM public.prayers p
  WHERE nullif(btrim(p.intent), '') IS NOT NULL
  GROUP BY p.intent
  ORDER BY max(p.created_at) DESC
  LIMIT LEAST(GREATEST(COALESCE(p_limit, 10), 1), 20);
$$;

-- 3h. RPC: amen increment without exposing direct table updates
CREATE OR REPLACE FUNCTION public.increment_prayer_amen(p_prayer_id uuid)
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
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

-- 4. RLS: raw table is service-role only; public features read via RPCs above
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

-- 5. Grant RPCs to anon/authenticated; raw table stays locked down
GRANT EXECUTE ON FUNCTION public.get_prayer_presence_count() TO anon;
GRANT EXECUTE ON FUNCTION public.get_prayer_presence_count() TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_total_prayer_count() TO anon;
GRANT EXECUTE ON FUNCTION public.get_total_prayer_count() TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_prayers_today_count() TO anon;
GRANT EXECUTE ON FUNCTION public.get_prayers_today_count() TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_last_prayer_created_at() TO anon;
GRANT EXECUTE ON FUNCTION public.get_last_prayer_created_at() TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_recent_prayers(integer) TO anon;
GRANT EXECUTE ON FUNCTION public.get_recent_prayers(integer) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_prayer_echo_match_count(text) TO anon;
GRANT EXECUTE ON FUNCTION public.get_prayer_echo_match_count(text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_prayer_intent_suggestions(integer) TO anon;
GRANT EXECUTE ON FUNCTION public.get_prayer_intent_suggestions(integer) TO authenticated;
GRANT EXECUTE ON FUNCTION public.increment_prayer_amen(uuid) TO anon;
GRANT EXECUTE ON FUNCTION public.increment_prayer_amen(uuid) TO authenticated;

-- 6. Grant table access only to service role
REVOKE ALL ON public.prayers FROM anon;
REVOKE ALL ON public.prayers FROM authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.prayers TO service_role;
