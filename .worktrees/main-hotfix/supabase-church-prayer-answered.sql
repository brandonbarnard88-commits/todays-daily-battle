-- =============================================================================
-- Church Hub — Prayer Answered. Pastor marks requests resolved, email nudge.
-- Run after supabase-church-prayer-wall.sql and supabase-church-subscribers.sql.
-- =============================================================================

-- Add status to church_prayer_requests
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'church_prayer_requests' AND column_name = 'status') THEN
    ALTER TABLE public.church_prayer_requests ADD COLUMN status text NOT NULL DEFAULT 'active';
  END IF;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

ALTER TABLE public.church_prayer_requests DROP CONSTRAINT IF EXISTS church_prayer_requests_status_check;
ALTER TABLE public.church_prayer_requests ADD CONSTRAINT church_prayer_requests_status_check
  CHECK (status IN ('active', 'answered'));

CREATE INDEX IF NOT EXISTS church_prayer_requests_status_idx ON public.church_prayer_requests (status);

-- Add anon_id to church_subscribers (for prayer-answered email lookup)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'church_subscribers' AND column_name = 'anon_id') THEN
    ALTER TABLE public.church_subscribers ADD COLUMN anon_id text;
  END IF;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

-- Update upsert to store anon_id when subscribing
CREATE OR REPLACE FUNCTION public.upsert_church_subscriber(
  p_group_id uuid,
  p_email text,
  p_anon_id text
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
  IF length(trim(coalesce(p_email, ''))) < 5 OR trim(p_email) !~ '^[^@]+@[^@]+\.[^@]+$' THEN
    RETURN jsonb_build_object('ok', false, 'reason', 'invalid_email');
  END IF;

  SELECT members INTO v_members FROM public.church_groups WHERE id = p_group_id LIMIT 1;
  IF v_members IS NULL THEN
    RETURN jsonb_build_object('ok', false, 'reason', 'group_not_found');
  END IF;
  IF NOT (v_members @> jsonb_build_array(trim(p_anon_id))) THEN
    RETURN jsonb_build_object('ok', false, 'reason', 'not_member');
  END IF;

  INSERT INTO public.church_subscribers (group_id, email, anon_id)
  VALUES (p_group_id, lower(trim(p_email)), trim(p_anon_id))
  ON CONFLICT (group_id, email) DO UPDATE SET anon_id = EXCLUDED.anon_id;

  RETURN jsonb_build_object('ok', true);
END;
$$;

-- RPC: Mark prayer as answered. Pastor only.
CREATE OR REPLACE FUNCTION public.mark_church_prayer_answered(
  p_prayer_id uuid,
  p_pastor_anon_id text
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_group_id uuid;
  v_pastor text;
  v_poster_anon_id text;
  v_text text;
  v_poster_email text;
BEGIN
  IF p_prayer_id IS NULL OR length(trim(coalesce(p_pastor_anon_id, ''))) < 5 THEN
    RETURN jsonb_build_object('ok', false, 'reason', 'invalid');
  END IF;

  SELECT group_id, anon_id, text INTO v_group_id, v_poster_anon_id, v_text
  FROM public.church_prayer_requests WHERE id = p_prayer_id LIMIT 1;
  IF v_group_id IS NULL THEN
    RETURN jsonb_build_object('ok', false, 'reason', 'not_found');
  END IF;

  SELECT pastor_anon_id INTO v_pastor FROM public.church_groups WHERE id = v_group_id LIMIT 1;
  IF v_pastor IS NULL OR trim(v_pastor) != trim(p_pastor_anon_id) THEN
    RETURN jsonb_build_object('ok', false, 'reason', 'not_pastor');
  END IF;

  UPDATE public.church_prayer_requests SET status = 'answered' WHERE id = p_prayer_id;

  SELECT email INTO v_poster_email FROM public.church_subscribers
  WHERE group_id = v_group_id AND anon_id = trim(v_poster_anon_id) AND email IS NOT NULL AND trim(email) != ''
  LIMIT 1;

  RETURN jsonb_build_object('ok', true, 'poster_email', v_poster_email, 'poster_anon_id', v_poster_anon_id, 'text_preview', left(coalesce(v_text, ''), 80));
END;
$$;

GRANT EXECUTE ON FUNCTION public.mark_church_prayer_answered(uuid, text) TO anon;
GRANT EXECUTE ON FUNCTION public.mark_church_prayer_answered(uuid, text) TO authenticated;

-- Update get_church_prayer_requests to return status, order answered last
CREATE OR REPLACE FUNCTION public.get_church_prayer_requests(
  p_group_id uuid,
  p_anon_id text,
  p_limit int DEFAULT 20,
  p_filter text DEFAULT 'active'
)
RETURNS TABLE (
  id uuid,
  anon_id text,
  text text,
  created_at timestamptz,
  like_count bigint,
  comment_count bigint,
  i_liked boolean,
  status text
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
  SELECT
    pr.id,
    pr.anon_id,
    pr.text,
    pr.created_at,
    (SELECT count(*) FROM jsonb_each_text(coalesce(pr.likes, '{}')) WHERE value = 'true'),
    (SELECT count(*) FROM public.church_prayer_comments c WHERE c.prayer_id = pr.id),
    (coalesce(pr.likes, '{}') ? trim(coalesce(p_anon_id, ''))) AND ((pr.likes->trim(coalesce(p_anon_id, '')))::text = 'true'),
    coalesce(pr.status, 'active')
  FROM public.church_prayer_requests pr
  WHERE pr.group_id = p_group_id
    AND (
      p_filter = 'all'
      OR (p_filter = 'active' AND coalesce(pr.status, 'active') = 'active')
      OR (p_filter = 'answered' AND coalesce(pr.status, 'active') = 'answered')
    )
  ORDER BY
    CASE WHEN coalesce(pr.status, 'active') = 'answered' THEN 1 ELSE 0 END,
    pr.created_at DESC
  LIMIT greatest(1, least(coalesce(p_limit, 20), 50));
END;
$$;

GRANT EXECUTE ON FUNCTION public.get_church_prayer_requests(uuid, text, int, text) TO anon;
GRANT EXECUTE ON FUNCTION public.get_church_prayer_requests(uuid, text, int, text) TO authenticated;
