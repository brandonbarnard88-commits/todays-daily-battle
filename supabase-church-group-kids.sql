-- =============================================================================
-- Church Hub — Kid Leaderboard. Parents link family invite_code to group.
-- Run after supabase-church-groups.sql and supabase-kid-streaks.sql.
-- =============================================================================

CREATE TABLE IF NOT EXISTS public.church_group_kids (
  group_id uuid NOT NULL REFERENCES public.church_groups(id) ON DELETE CASCADE,
  invite_code text NOT NULL,
  kid_name text DEFAULT 'Kiddo',
  created_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (group_id, invite_code)
);

COMMENT ON TABLE public.church_group_kids IS 'Church group kids: parents add family invite_code to show kid streak on leaderboard.';

CREATE INDEX IF NOT EXISTS church_group_kids_group_idx ON public.church_group_kids (group_id);

ALTER TABLE public.church_group_kids ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "church_group_kids_service_only" ON public.church_group_kids;
CREATE POLICY "church_group_kids_service_only"
  ON public.church_group_kids FOR ALL TO service_role USING (true) WITH CHECK (true);

-- RPC: Add kid to group. Verifies caller is member, invite_code exists and used.
CREATE OR REPLACE FUNCTION public.add_church_group_kid(
  p_group_id uuid,
  p_invite_code text,
  p_anon_id text,
  p_kid_name text DEFAULT 'Kiddo'
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_members jsonb;
  v_code text;
BEGIN
  IF p_group_id IS NULL OR length(trim(coalesce(p_anon_id, ''))) < 5 THEN
    RETURN jsonb_build_object('ok', false, 'reason', 'invalid');
  END IF;

  v_code := upper(trim(coalesce(p_invite_code, '')));
  IF length(v_code) <> 6 THEN
    RETURN jsonb_build_object('ok', false, 'reason', 'invalid_code');
  END IF;

  SELECT members INTO v_members FROM public.church_groups WHERE id = p_group_id LIMIT 1;
  IF v_members IS NULL THEN
    RETURN jsonb_build_object('ok', false, 'reason', 'group_not_found');
  END IF;
  IF NOT (v_members @> jsonb_build_array(trim(p_anon_id))) THEN
    RETURN jsonb_build_object('ok', false, 'reason', 'not_member');
  END IF;

  IF NOT EXISTS (SELECT 1 FROM public.kids_beta_waitlist WHERE invite_code = v_code AND used = true) THEN
    RETURN jsonb_build_object('ok', false, 'reason', 'invalid_code');
  END IF;

  INSERT INTO public.church_group_kids (group_id, invite_code, kid_name)
  VALUES (p_group_id, v_code, coalesce(nullif(trim(p_kid_name), ''), 'Kiddo'))
  ON CONFLICT (group_id, invite_code) DO UPDATE SET kid_name = coalesce(nullif(trim(p_kid_name), ''), 'Kiddo');

  RETURN jsonb_build_object('ok', true);
END;
$$;

GRANT EXECUTE ON FUNCTION public.add_church_group_kid(uuid, text, text, text) TO anon;
GRANT EXECUTE ON FUNCTION public.add_church_group_kid(uuid, text, text, text) TO authenticated;

-- RPC: Get kid leaderboard for group. Top 5 by streak desc, updated_at desc.
CREATE OR REPLACE FUNCTION public.get_church_kid_leaderboard(p_group_id uuid, p_limit int DEFAULT 5)
RETURNS TABLE (
  invite_code text,
  kid_name text,
  streak_count int,
  rank int
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF p_group_id IS NULL THEN
    RETURN;
  END IF;
  RETURN QUERY
  WITH linked AS (
    SELECT cgk.invite_code, cgk.kid_name
    FROM public.church_group_kids cgk
    WHERE cgk.group_id = p_group_id
  ),
  joined AS (
    SELECT
      l.invite_code,
      l.kid_name,
      coalesce(ks.streak_count, 0)::int AS streak_count,
      ks.updated_at
    FROM linked l
    LEFT JOIN public.kid_streaks ks ON ks.invite_code = l.invite_code
  ),
  ranked AS (
    SELECT
      j.invite_code,
      j.kid_name,
      j.streak_count,
      row_number() OVER (ORDER BY j.streak_count DESC, j.updated_at DESC NULLS LAST)::int AS rank
    FROM joined j
  )
  SELECT r.invite_code, r.kid_name, r.streak_count, r.rank
  FROM ranked r
  ORDER BY r.rank
  LIMIT greatest(1, least(coalesce(p_limit, 5), 20));
END;
$$;

GRANT EXECUTE ON FUNCTION public.get_church_kid_leaderboard(uuid, int) TO anon;
GRANT EXECUTE ON FUNCTION public.get_church_kid_leaderboard(uuid, int) TO authenticated;
