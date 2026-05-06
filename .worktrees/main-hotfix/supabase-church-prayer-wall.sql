-- =============================================================================
-- Church Hub — Prayer Wall. Members post requests, like, comment.
-- Run after supabase-church-groups.sql.
-- =============================================================================

CREATE TABLE IF NOT EXISTS public.church_prayer_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id uuid NOT NULL REFERENCES public.church_groups(id) ON DELETE CASCADE,
  anon_id text NOT NULL,
  text text NOT NULL DEFAULT '',
  likes jsonb NOT NULL DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.church_prayer_requests IS 'Church Prayer Wall. likes = {anon_id: true} for one like per person.';

CREATE INDEX IF NOT EXISTS church_prayer_requests_group_idx ON public.church_prayer_requests (group_id);
CREATE INDEX IF NOT EXISTS church_prayer_requests_created_idx ON public.church_prayer_requests (created_at DESC);

ALTER TABLE public.church_prayer_requests ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "church_prayer_requests_service_only" ON public.church_prayer_requests;
CREATE POLICY "church_prayer_requests_service_only"
  ON public.church_prayer_requests FOR ALL TO service_role USING (true) WITH CHECK (true);

CREATE TABLE IF NOT EXISTS public.church_prayer_comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  prayer_id uuid NOT NULL REFERENCES public.church_prayer_requests(id) ON DELETE CASCADE,
  anon_id text NOT NULL,
  text text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.church_prayer_comments IS 'Comments on church prayer requests.';

CREATE INDEX IF NOT EXISTS church_prayer_comments_prayer_idx ON public.church_prayer_comments (prayer_id);

ALTER TABLE public.church_prayer_comments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "church_prayer_comments_service_only" ON public.church_prayer_comments;
CREATE POLICY "church_prayer_comments_service_only"
  ON public.church_prayer_comments FOR ALL TO service_role USING (true) WITH CHECK (true);

-- RPC: Post prayer request. Verifies member.
CREATE OR REPLACE FUNCTION public.insert_church_prayer_request(
  p_group_id uuid,
  p_anon_id text,
  p_text text
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_members jsonb;
  v_id uuid;
BEGIN
  IF p_group_id IS NULL OR length(trim(coalesce(p_anon_id, ''))) < 5 THEN
    RETURN jsonb_build_object('ok', false, 'reason', 'invalid');
  END IF;
  IF length(trim(coalesce(p_text, ''))) < 3 THEN
    RETURN jsonb_build_object('ok', false, 'reason', 'text_too_short');
  END IF;
  IF length(trim(p_text)) > 1000 THEN
    RETURN jsonb_build_object('ok', false, 'reason', 'text_too_long');
  END IF;

  SELECT members INTO v_members FROM public.church_groups WHERE id = p_group_id LIMIT 1;
  IF v_members IS NULL THEN
    RETURN jsonb_build_object('ok', false, 'reason', 'group_not_found');
  END IF;
  IF NOT (v_members @> jsonb_build_array(trim(p_anon_id))) THEN
    RETURN jsonb_build_object('ok', false, 'reason', 'not_member');
  END IF;

  INSERT INTO public.church_prayer_requests (group_id, anon_id, text)
  VALUES (p_group_id, trim(p_anon_id), trim(p_text))
  RETURNING id INTO v_id;

  RETURN jsonb_build_object('ok', true, 'id', v_id);
END;
$$;

GRANT EXECUTE ON FUNCTION public.insert_church_prayer_request(uuid, text, text) TO anon;
GRANT EXECUTE ON FUNCTION public.insert_church_prayer_request(uuid, text, text) TO authenticated;

-- RPC: Toggle like. One like per person per prayer (jsonb key).
CREATE OR REPLACE FUNCTION public.toggle_church_prayer_like(
  p_prayer_id uuid,
  p_anon_id text
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_members jsonb;
  v_group_id uuid;
  v_likes jsonb;
  v_key text;
BEGIN
  IF p_prayer_id IS NULL OR length(trim(coalesce(p_anon_id, ''))) < 5 THEN
    RETURN jsonb_build_object('ok', false, 'reason', 'invalid');
  END IF;

  SELECT group_id INTO v_group_id FROM public.church_prayer_requests WHERE id = p_prayer_id LIMIT 1;
  IF v_group_id IS NULL THEN
    RETURN jsonb_build_object('ok', false, 'reason', 'not_found');
  END IF;

  SELECT members INTO v_members FROM public.church_groups WHERE id = v_group_id LIMIT 1;
  IF v_members IS NULL OR NOT (v_members @> jsonb_build_array(trim(p_anon_id))) THEN
    RETURN jsonb_build_object('ok', false, 'reason', 'not_member');
  END IF;

  v_key := trim(p_anon_id);
  SELECT likes INTO v_likes FROM public.church_prayer_requests WHERE id = p_prayer_id LIMIT 1;
  v_likes := coalesce(v_likes, '{}');

  IF (v_likes ? v_key) AND ((v_likes->>v_key) = 'true') THEN
    v_likes := v_likes - v_key;
  ELSE
    v_likes := jsonb_set(coalesce(v_likes, '{}'), array[v_key], 'true'::jsonb);
  END IF;

  UPDATE public.church_prayer_requests SET likes = v_likes WHERE id = p_prayer_id;

  RETURN jsonb_build_object('ok', true, 'likes', (SELECT count(*) FROM jsonb_each_text(v_likes) WHERE value = 'true'));
END;
$$;

GRANT EXECUTE ON FUNCTION public.toggle_church_prayer_like(uuid, text) TO anon;
GRANT EXECUTE ON FUNCTION public.toggle_church_prayer_like(uuid, text) TO authenticated;

-- RPC: Add comment.
CREATE OR REPLACE FUNCTION public.insert_church_prayer_comment(
  p_prayer_id uuid,
  p_anon_id text,
  p_text text
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_members jsonb;
  v_group_id uuid;
BEGIN
  IF p_prayer_id IS NULL OR length(trim(coalesce(p_anon_id, ''))) < 5 THEN
    RETURN jsonb_build_object('ok', false, 'reason', 'invalid');
  END IF;
  IF length(trim(coalesce(p_text, ''))) < 1 THEN
    RETURN jsonb_build_object('ok', false, 'reason', 'text_empty');
  END IF;
  IF length(trim(p_text)) > 500 THEN
    RETURN jsonb_build_object('ok', false, 'reason', 'text_too_long');
  END IF;

  SELECT group_id INTO v_group_id FROM public.church_prayer_requests WHERE id = p_prayer_id LIMIT 1;
  IF v_group_id IS NULL THEN
    RETURN jsonb_build_object('ok', false, 'reason', 'not_found');
  END IF;

  SELECT members INTO v_members FROM public.church_groups WHERE id = v_group_id LIMIT 1;
  IF v_members IS NULL OR NOT (v_members @> jsonb_build_array(trim(p_anon_id))) THEN
    RETURN jsonb_build_object('ok', false, 'reason', 'not_member');
  END IF;

  INSERT INTO public.church_prayer_comments (prayer_id, anon_id, text)
  VALUES (p_prayer_id, trim(p_anon_id), trim(p_text));

  RETURN jsonb_build_object('ok', true);
END;
$$;

GRANT EXECUTE ON FUNCTION public.insert_church_prayer_comment(uuid, text, text) TO anon;
GRANT EXECUTE ON FUNCTION public.insert_church_prayer_comment(uuid, text, text) TO authenticated;

-- RPC: Get prayer requests for group with like count and i_liked.
CREATE OR REPLACE FUNCTION public.get_church_prayer_requests(
  p_group_id uuid,
  p_anon_id text,
  p_limit int DEFAULT 20
)
RETURNS TABLE (
  id uuid,
  anon_id text,
  text text,
  created_at timestamptz,
  like_count bigint,
  comment_count bigint,
  i_liked boolean
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
    (coalesce(pr.likes, '{}') ? trim(coalesce(p_anon_id, ''))) AND ((pr.likes->trim(coalesce(p_anon_id, '')))::text = 'true')
  FROM public.church_prayer_requests pr
  WHERE pr.group_id = p_group_id
  ORDER BY pr.created_at DESC
  LIMIT greatest(1, least(coalesce(p_limit, 20), 50));
END;
$$;

GRANT EXECUTE ON FUNCTION public.get_church_prayer_requests(uuid, text, int) TO anon;
GRANT EXECUTE ON FUNCTION public.get_church_prayer_requests(uuid, text, int) TO authenticated;

-- RPC: Get comments for a prayer.
CREATE OR REPLACE FUNCTION public.get_church_prayer_comments(p_prayer_id uuid, p_limit int DEFAULT 20)
RETURNS TABLE (
  id uuid,
  anon_id text,
  text text,
  created_at timestamptz
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF p_prayer_id IS NULL THEN
    RETURN;
  END IF;
  RETURN QUERY
  SELECT c.id, c.anon_id, c.text, c.created_at
  FROM public.church_prayer_comments c
  WHERE c.prayer_id = p_prayer_id
  ORDER BY c.created_at ASC
  LIMIT greatest(1, least(coalesce(p_limit, 20), 50));
END;
$$;

GRANT EXECUTE ON FUNCTION public.get_church_prayer_comments(uuid, int) TO anon;
GRANT EXECUTE ON FUNCTION public.get_church_prayer_comments(uuid, int) TO authenticated;
