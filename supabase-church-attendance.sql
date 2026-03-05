-- =============================================================================
-- Church Hub — Attendance Check-in. Mark present, weekly count, pastor view.
-- Run after supabase-church-groups.sql.
-- =============================================================================

CREATE TABLE IF NOT EXISTS public.church_attendance (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id uuid NOT NULL REFERENCES public.church_groups(id) ON DELETE CASCADE,
  anon_id text NOT NULL,
  date date NOT NULL DEFAULT current_date,
  present boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (group_id, anon_id, date)
);

COMMENT ON TABLE public.church_attendance IS 'Church Hub attendance. One record per member per day.';

CREATE INDEX IF NOT EXISTS church_attendance_group_date_idx ON public.church_attendance (group_id, date DESC);
CREATE INDEX IF NOT EXISTS church_attendance_anon_idx ON public.church_attendance (anon_id);

ALTER TABLE public.church_attendance ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "church_attendance_service_only" ON public.church_attendance;
CREATE POLICY "church_attendance_service_only"
  ON public.church_attendance FOR ALL TO service_role USING (true) WITH CHECK (true);

-- RPC: Upsert attendance (mark present). One per day per member. Verifies membership.
CREATE OR REPLACE FUNCTION public.upsert_church_attendance(
  p_group_id uuid,
  p_anon_id text,
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

  INSERT INTO public.church_attendance (group_id, anon_id, date, present)
  VALUES (p_group_id, trim(p_anon_id), coalesce(p_date::date, current_date), true)
  ON CONFLICT (group_id, anon_id, date) DO UPDATE SET present = true, created_at = now();

  RETURN jsonb_build_object('ok', true);
END;
$$;

GRANT EXECUTE ON FUNCTION public.upsert_church_attendance(uuid, text, date) TO anon;
GRANT EXECUTE ON FUNCTION public.upsert_church_attendance(uuid, text, date) TO authenticated;

-- RPC: Get weekly attendance stats. X = unique members who checked in this week, Y = total members.
-- Returns: present_count, total_members, pct, present_anon_ids (for pastor list)
CREATE OR REPLACE FUNCTION public.get_church_attendance_week(p_group_id uuid)
RETURNS TABLE (
  present_count bigint,
  total_members int,
  pct numeric,
  present_anon_ids text[]
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_members jsonb;
  v_total int;
  v_week_start date;
BEGIN
  IF p_group_id IS NULL THEN
    RETURN;
  END IF;

  v_week_start := date_trunc('week', current_date)::date;
  IF v_week_start < current_date - 6 THEN
    v_week_start := current_date - 6;
  END IF;

  SELECT members, jsonb_array_length(members)::int
  INTO v_members, v_total
  FROM public.church_groups
  WHERE id = p_group_id
  LIMIT 1;

  IF v_members IS NULL OR v_total = 0 THEN
    RETURN QUERY SELECT 0::bigint, 0, 0::numeric, ARRAY[]::text[];
    RETURN;
  END IF;

  RETURN QUERY
  WITH present_ids AS (
    SELECT DISTINCT ca.anon_id
    FROM public.church_attendance ca
    WHERE ca.group_id = p_group_id
      AND ca.date >= v_week_start
      AND ca.present = true
  ),
  counts AS (
    SELECT
      (SELECT count(*) FROM present_ids)::bigint AS cnt,
      v_total AS tot
  )
  SELECT
    c.cnt,
    c.tot::int,
    CASE WHEN c.tot > 0 THEN round((c.cnt::numeric / c.tot) * 100, 1) ELSE 0 END,
    (SELECT array_agg(anon_id) FROM present_ids)
  FROM counts c;
END;
$$;

GRANT EXECUTE ON FUNCTION public.get_church_attendance_week(uuid) TO anon;
GRANT EXECUTE ON FUNCTION public.get_church_attendance_week(uuid) TO authenticated;

-- Add attendance columns to church_groups
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'church_groups' AND column_name = 'attendance_bonus_week') THEN
    ALTER TABLE public.church_groups ADD COLUMN attendance_bonus_week text;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'church_groups' AND column_name = 'group_attendance_bonus') THEN
    ALTER TABLE public.church_groups ADD COLUMN group_attendance_bonus numeric NOT NULL DEFAULT 0;
  END IF;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

-- RPC: Apply +0.5 group streak when 80%+ attendance this week. Once per week.
CREATE OR REPLACE FUNCTION public.apply_church_attendance_streak_bonus(
  p_group_id uuid,
  p_week_key text,
  p_pastor_anon_id text
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_pastor text;
  v_last text;
  v_pct numeric;
  v_present bigint;
  v_total int;
BEGIN
  IF p_group_id IS NULL OR length(trim(coalesce(p_pastor_anon_id, ''))) < 5 THEN
    RETURN jsonb_build_object('ok', false, 'reason', 'invalid');
  END IF;

  SELECT pastor_anon_id, attendance_bonus_week
  INTO v_pastor, v_last
  FROM public.church_groups
  WHERE id = p_group_id
  LIMIT 1;

  IF v_pastor IS NULL OR trim(v_pastor) != trim(p_pastor_anon_id) THEN
    RETURN jsonb_build_object('ok', false, 'reason', 'not_pastor');
  END IF;

  IF trim(coalesce(v_last, '')) = trim(p_week_key) THEN
    RETURN jsonb_build_object('ok', true, 'applied', false, 'reason', 'already_applied');
  END IF;

  SELECT present_count, total_members,
         CASE WHEN total_members > 0 THEN (present_count::numeric / total_members) * 100 ELSE 0 END
  INTO v_present, v_total, v_pct
  FROM get_church_attendance_week(p_group_id)
  LIMIT 1;

  IF v_total = 0 OR v_pct < 80 THEN
    RETURN jsonb_build_object('ok', true, 'applied', false, 'reason', 'below_threshold', 'pct', v_pct);
  END IF;

  UPDATE public.church_groups
  SET group_attendance_bonus = coalesce(group_attendance_bonus, 0) + 0.5,
      attendance_bonus_week = trim(p_week_key),
      updated_at = now()
  WHERE id = p_group_id;

  RETURN jsonb_build_object('ok', true, 'applied', true, 'bonus', 0.5, 'pct', v_pct);
END;
$$;

GRANT EXECUTE ON FUNCTION public.apply_church_attendance_streak_bonus(uuid, text, text) TO anon;
GRANT EXECUTE ON FUNCTION public.apply_church_attendance_streak_bonus(uuid, text, text) TO authenticated;
