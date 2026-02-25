-- =============================================================================
-- Prayers table + presence count RPC (fixes 404s for prayer echo & counter)
-- Run in Supabase SQL Editor: Dashboard → SQL Editor → New query → paste → Run
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

-- 2. Index for echo (recent first) and count
CREATE INDEX IF NOT EXISTS prayers_created_at_desc ON public.prayers (created_at DESC);
CREATE INDEX IF NOT EXISTS prayers_created_at_presence ON public.prayers (created_at) WHERE created_at > (now() - interval '15 minutes');

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

-- 4. RLS: allow anon to read (echo), insert (quick pray), update (amen_count only)
ALTER TABLE public.prayers ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "prayers_anon_select" ON public.prayers;
CREATE POLICY "prayers_anon_select" ON public.prayers
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "prayers_anon_insert" ON public.prayers;
CREATE POLICY "prayers_anon_insert" ON public.prayers
  FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "prayers_anon_update_amen" ON public.prayers;
CREATE POLICY "prayers_anon_update_amen" ON public.prayers
  FOR UPDATE USING (true)
  WITH CHECK (true);

-- 5. Grant RPC to anon (so frontend can call get_prayer_presence_count)
GRANT EXECUTE ON FUNCTION public.get_prayer_presence_count() TO anon;
GRANT EXECUTE ON FUNCTION public.get_prayer_presence_count() TO authenticated;

-- 6. Grant table access
GRANT SELECT, INSERT, UPDATE ON public.prayers TO anon;
GRANT SELECT, INSERT, UPDATE ON public.prayers TO authenticated;
