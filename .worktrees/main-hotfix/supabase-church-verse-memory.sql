-- =============================================================================
-- Church Hub — Group Verse Memory. Collective fill-the-blank, +1 week streak.
-- Run after supabase-church-groups.sql.
-- =============================================================================

-- Add group streak columns to church_groups
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'church_groups' AND column_name = 'group_streak_count') THEN
    ALTER TABLE public.church_groups ADD COLUMN group_streak_count int NOT NULL DEFAULT 0;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'church_groups' AND column_name = 'group_streak_last_week') THEN
    ALTER TABLE public.church_groups ADD COLUMN group_streak_last_week text;
  END IF;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

COMMENT ON COLUMN public.church_groups.group_streak_count IS 'Weeks of perfect Group Verse Challenge.';
COMMENT ON COLUMN public.church_groups.group_streak_last_week IS 'Last week key (YYYY-Www) when streak was incremented.';

-- RPC: Increment group streak when perfect. One per week per group.
CREATE OR REPLACE FUNCTION public.increment_church_group_streak(
  p_group_id uuid,
  p_week_key text,
  p_anon_id text
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_members jsonb;
  v_last text;
  v_count int;
BEGIN
  IF p_group_id IS NULL OR length(trim(coalesce(p_anon_id, ''))) < 5 THEN
    RETURN jsonb_build_object('ok', false, 'reason', 'invalid');
  END IF;
  IF length(trim(coalesce(p_week_key, ''))) < 5 THEN
    RETURN jsonb_build_object('ok', false, 'reason', 'invalid_week');
  END IF;

  SELECT members, group_streak_last_week, group_streak_count
  INTO v_members, v_last, v_count
  FROM public.church_groups WHERE id = p_group_id LIMIT 1;

  IF v_members IS NULL THEN
    RETURN jsonb_build_object('ok', false, 'reason', 'group_not_found');
  END IF;
  IF NOT (v_members @> jsonb_build_array(trim(p_anon_id))) THEN
    RETURN jsonb_build_object('ok', false, 'reason', 'not_member');
  END IF;

  IF trim(v_last) = trim(p_week_key) THEN
    RETURN jsonb_build_object('ok', true, 'incremented', false, 'group_streak_count', coalesce(v_count, 0));
  END IF;

  UPDATE public.church_groups
  SET group_streak_count = coalesce(group_streak_count, 0) + 1,
      group_streak_last_week = trim(p_week_key),
      updated_at = now()
  WHERE id = p_group_id;

  RETURN jsonb_build_object('ok', true, 'incremented', true, 'group_streak_count', coalesce(v_count, 0) + 1);
END;
$$;

GRANT EXECUTE ON FUNCTION public.increment_church_group_streak(uuid, text, text) TO anon;
GRANT EXECUTE ON FUNCTION public.increment_church_group_streak(uuid, text, text) TO authenticated;
