-- =============================================================================
-- Church Hub — groups, join flow, shared reflections, leaderboard.
-- Run in Supabase SQL Editor.
-- anon_id = device UUID from localStorage (churchHubAnonId).
-- =============================================================================

-- Church groups: pastor creates, members join via code
CREATE TABLE IF NOT EXISTS public.church_groups (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text NOT NULL UNIQUE,
  name text NOT NULL DEFAULT '',
  pastor_anon_id text NOT NULL,
  members jsonb NOT NULL DEFAULT '[]',
  created_at timestamptz NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.church_groups IS 'Church Hub groups. Pastor creates; members join via code. members = array of anon_ids.';

CREATE INDEX IF NOT EXISTS church_groups_code_idx ON public.church_groups (code);
CREATE INDEX IF NOT EXISTS church_groups_pastor_idx ON public.church_groups (pastor_anon_id);

ALTER TABLE public.church_groups ENABLE ROW LEVEL SECURITY;

-- RLS: service_role only (all access via RPCs)
DROP POLICY IF EXISTS "church_groups_service_only" ON public.church_groups;
CREATE POLICY "church_groups_service_only"
  ON public.church_groups FOR ALL TO service_role USING (true) WITH CHECK (true);

-- Church reflections: group members post "What God showed us today"
CREATE TABLE IF NOT EXISTS public.church_reflections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id uuid NOT NULL REFERENCES public.church_groups(id) ON DELETE CASCADE,
  anon_id text NOT NULL,
  text text NOT NULL DEFAULT '',
  reflection_date date NOT NULL DEFAULT current_date,
  created_at timestamptz NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.church_reflections IS 'Church Hub shared daily reflections. One per member per day per group.';

CREATE INDEX IF NOT EXISTS church_reflections_group_date_idx ON public.church_reflections (group_id, reflection_date DESC);
CREATE INDEX IF NOT EXISTS church_reflections_anon_idx ON public.church_reflections (anon_id);

ALTER TABLE public.church_reflections ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "church_reflections_service_only" ON public.church_reflections;
CREATE POLICY "church_reflections_service_only"
  ON public.church_reflections FOR ALL TO service_role USING (true) WITH CHECK (true);

-- RPC: Join a group by code. Anon can call.
CREATE OR REPLACE FUNCTION public.join_group(p_code text, p_member_id text)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_group_id uuid;
  v_members jsonb;
BEGIN
  IF length(trim(coalesce(p_code, ''))) < 3 THEN
    RETURN jsonb_build_object('ok', false, 'reason', 'invalid_code');
  END IF;
  IF length(trim(coalesce(p_member_id, ''))) < 5 THEN
    RETURN jsonb_build_object('ok', false, 'reason', 'invalid_member');
  END IF;

  SELECT id, members INTO v_group_id, v_members
  FROM public.church_groups
  WHERE lower(trim(code)) = lower(trim(p_code))
  LIMIT 1;

  IF v_group_id IS NULL THEN
    RETURN jsonb_build_object('ok', false, 'reason', 'not_found');
  END IF;

  -- Add member if not already in list (members is jsonb array)
  IF NOT (v_members @> jsonb_build_array(trim(p_member_id))) THEN
    v_members := v_members || jsonb_build_array(trim(p_member_id));
    UPDATE public.church_groups SET members = v_members, updated_at = now() WHERE id = v_group_id;
  END IF;

  RETURN jsonb_build_object('ok', true, 'group_id', v_group_id, 'name', (SELECT name FROM public.church_groups WHERE id = v_group_id));
END;
$$;

GRANT EXECUTE ON FUNCTION public.join_group(text, text) TO anon;
GRANT EXECUTE ON FUNCTION public.join_group(text, text) TO authenticated;

-- Add updated_at if missing (for future use)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'church_groups' AND column_name = 'updated_at') THEN
    ALTER TABLE public.church_groups ADD COLUMN updated_at timestamptz NOT NULL DEFAULT now();
  END IF;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

-- Unique: one reflection per member per day per group (needed for upsert)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'church_reflections_group_anon_date_key'
  ) THEN
    ALTER TABLE public.church_reflections
    ADD CONSTRAINT church_reflections_group_anon_date_key UNIQUE (group_id, anon_id, reflection_date);
  END IF;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

-- RPC: Insert church reflection. Verifies member is in group.
CREATE OR REPLACE FUNCTION public.insert_church_reflection(
  p_group_id uuid,
  p_anon_id text,
  p_text text,
  p_date date DEFAULT current_date
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_members jsonb;
BEGIN
  IF p_group_id IS NULL OR length(trim(coalesce(p_anon_id, ''))) < 5 THEN
    RETURN jsonb_build_object('ok', false, 'reason', 'invalid');
  END IF;

  SELECT members INTO v_members FROM public.church_groups WHERE id = p_group_id LIMIT 1;
  IF v_members IS NULL THEN
    RETURN jsonb_build_object('ok', false, 'reason', 'group_not_found');
  END IF;
  IF NOT (v_members @> jsonb_build_array(trim(p_anon_id))) THEN
    RETURN jsonb_build_object('ok', false, 'reason', 'not_member');
  END IF;

  INSERT INTO public.church_reflections (group_id, anon_id, text, reflection_date)
  VALUES (p_group_id, trim(p_anon_id), coalesce(trim(p_text), ''), coalesce(p_date::date, current_date))
  ON CONFLICT (group_id, anon_id, reflection_date) DO UPDATE SET text = coalesce(trim(p_text), ''), created_at = now();

  RETURN jsonb_build_object('ok', true);
END;
$$;

GRANT EXECUTE ON FUNCTION public.insert_church_reflection(uuid, text, text, date) TO anon;
GRANT EXECUTE ON FUNCTION public.insert_church_reflection(uuid, text, text, date) TO authenticated;

-- RPC: Get last N reflections for a group. Anon can call (anyone with code can read).
CREATE OR REPLACE FUNCTION public.get_church_reflections(p_group_id uuid, p_limit int DEFAULT 5)
RETURNS TABLE (
  anon_id text,
  text text,
  reflection_date date,
  created_at timestamptz
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
  SELECT cr.anon_id, cr.text, cr.reflection_date, cr.created_at
  FROM public.church_reflections cr
  WHERE cr.group_id = p_group_id
  ORDER BY cr.created_at DESC
  LIMIT greatest(1, least(coalesce(p_limit, 5), 50));
END;
$$;

GRANT EXECUTE ON FUNCTION public.get_church_reflections(uuid, int) TO anon;
GRANT EXECUTE ON FUNCTION public.get_church_reflections(uuid, int) TO authenticated;

-- RPC: Get group by code (for daily page to resolve group_id from localStorage code)
CREATE OR REPLACE FUNCTION public.get_church_group_by_code(p_code text)
RETURNS TABLE (id uuid, name text)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF length(trim(coalesce(p_code, ''))) < 3 THEN
    RETURN;
  END IF;
  RETURN QUERY
  SELECT cg.id, cg.name
  FROM public.church_groups cg
  WHERE lower(trim(cg.code)) = lower(trim(p_code))
  LIMIT 1;
END;
$$;

GRANT EXECUTE ON FUNCTION public.get_church_group_by_code(text) TO anon;
GRANT EXECUTE ON FUNCTION public.get_church_group_by_code(text) TO authenticated;

-- RPC: Leaderboard — top 5 by streak + reflection count. Uses adult_streaks.
CREATE OR REPLACE FUNCTION public.get_church_leaderboard(p_group_id uuid, p_limit int DEFAULT 5)
RETURNS TABLE (
  anon_id text,
  streak_count int,
  reflection_count bigint,
  rank int
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_members jsonb;
  v_member text;
BEGIN
  IF p_group_id IS NULL THEN
    RETURN;
  END IF;
  SELECT members INTO v_members FROM public.church_groups WHERE id = p_group_id LIMIT 1;
  IF v_members IS NULL OR jsonb_array_length(v_members) = 0 THEN
    RETURN;
  END IF;

  RETURN QUERY
  WITH member_streaks AS (
    SELECT
      m.member_id AS anon_id,
      coalesce(s.streak_count, 0)::int AS streak_count,
      coalesce(r.reflection_count, 0)::bigint AS reflection_count
    FROM (
      SELECT jsonb_array_elements_text(v_members) AS member_id
    ) m
    LEFT JOIN public.adult_streaks s ON s.anon_id = m.member_id
    LEFT JOIN (
      SELECT cr.anon_id, count(*)::bigint AS reflection_count
      FROM public.church_reflections cr
      WHERE cr.group_id = p_group_id
      GROUP BY cr.anon_id
    ) r ON r.anon_id = m.member_id
  ),
  ranked AS (
    SELECT
      ms.anon_id,
      ms.streak_count,
      ms.reflection_count,
      row_number() OVER (ORDER BY ms.streak_count DESC, ms.reflection_count DESC)::int AS rank
    FROM member_streaks ms
  )
  SELECT r.anon_id, r.streak_count, r.reflection_count, r.rank
  FROM ranked r
  ORDER BY r.rank
  LIMIT greatest(1, least(coalesce(p_limit, 5), 20));
END;
$$;

GRANT EXECUTE ON FUNCTION public.get_church_leaderboard(uuid, int) TO anon;
GRANT EXECUTE ON FUNCTION public.get_church_leaderboard(uuid, int) TO authenticated;

-- RPC: Create church group (pastor). Anon can call.
CREATE OR REPLACE FUNCTION public.create_church_group(p_code text, p_name text, p_pastor_anon_id text)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_id uuid;
  v_members jsonb;
BEGIN
  IF length(trim(coalesce(p_code, ''))) < 3 THEN
    RETURN jsonb_build_object('ok', false, 'reason', 'invalid_code');
  END IF;
  IF length(trim(coalesce(p_pastor_anon_id, ''))) < 5 THEN
    RETURN jsonb_build_object('ok', false, 'reason', 'invalid_pastor');
  END IF;

  -- Check code not taken
  IF EXISTS (SELECT 1 FROM public.church_groups WHERE lower(trim(code)) = lower(trim(p_code))) THEN
    RETURN jsonb_build_object('ok', false, 'reason', 'code_taken');
  END IF;

  v_members := jsonb_build_array(trim(p_pastor_anon_id));
  INSERT INTO public.church_groups (code, name, pastor_anon_id, members)
  VALUES (trim(p_code), coalesce(trim(p_name), ''), trim(p_pastor_anon_id), v_members)
  RETURNING id INTO v_id;

  RETURN jsonb_build_object('ok', true, 'group_id', v_id, 'code', trim(p_code));
END;
$$;

GRANT EXECUTE ON FUNCTION public.create_church_group(text, text, text) TO anon;
GRANT EXECUTE ON FUNCTION public.create_church_group(text, text, text) TO authenticated;
