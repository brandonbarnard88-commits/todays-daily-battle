-- Lock down raw public.prayers access.
-- Shared prayer writes must go through submit-prayer (service role),
-- while public reads/amen actions continue through SECURITY DEFINER RPCs.

DROP FUNCTION IF EXISTS public.get_prayer_presence_count();
DROP FUNCTION IF EXISTS public.get_total_prayer_count();
DROP FUNCTION IF EXISTS public.get_prayers_today_count();
DROP FUNCTION IF EXISTS public.get_last_prayer_created_at();
DROP FUNCTION IF EXISTS public.get_recent_prayers(integer);
DROP FUNCTION IF EXISTS public.get_prayer_echo_match_count(text);
DROP FUNCTION IF EXISTS public.get_prayer_intent_suggestions(integer);
DROP FUNCTION IF EXISTS public.increment_prayer_amen(uuid);

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

CREATE OR REPLACE FUNCTION public.get_total_prayer_count()
RETURNS bigint
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COUNT(*) FROM public.prayers;
$$;

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

CREATE OR REPLACE FUNCTION public.get_last_prayer_created_at()
RETURNS timestamptz
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT max(created_at) FROM public.prayers;
$$;

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

REVOKE ALL ON public.prayers FROM anon;
REVOKE ALL ON public.prayers FROM authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.prayers TO service_role;

GRANT EXECUTE ON FUNCTION public.get_prayer_presence_count() TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.get_total_prayer_count() TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.get_prayers_today_count() TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.get_last_prayer_created_at() TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.get_recent_prayers(integer) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.get_prayer_echo_match_count(text) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.get_prayer_intent_suggestions(integer) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.increment_prayer_amen(uuid) TO anon, authenticated;
