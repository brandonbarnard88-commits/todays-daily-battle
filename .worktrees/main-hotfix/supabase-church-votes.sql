-- =============================================================================
-- Church Hub — Sermon Voting. Pastor publishes draft, members vote.
-- Run after supabase-church-groups.sql.
-- =============================================================================

CREATE TABLE IF NOT EXISTS public.church_votes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id uuid NOT NULL REFERENCES public.church_groups(id) ON DELETE CASCADE,
  draft_id uuid NOT NULL,
  title text NOT NULL DEFAULT '',
  scripture text DEFAULT '',
  votes jsonb NOT NULL DEFAULT '{}',
  status text NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'closed')),
  ends_at timestamptz NOT NULL,
  winner_draft_id uuid,
  created_at timestamptz NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.church_votes IS 'Church sermon votes. votes = {anon_id: 1|-1} for thumbs up/down.';

CREATE INDEX IF NOT EXISTS church_votes_group_idx ON public.church_votes (group_id);
CREATE INDEX IF NOT EXISTS church_votes_status_idx ON public.church_votes (status);
CREATE INDEX IF NOT EXISTS church_votes_ends_idx ON public.church_votes (ends_at);

ALTER TABLE public.church_votes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "church_votes_service_only" ON public.church_votes;
CREATE POLICY "church_votes_service_only"
  ON public.church_votes FOR ALL TO service_role USING (true) WITH CHECK (true);

-- Extend join_group to return pastor_anon_id (for storing, isPastor check)
CREATE OR REPLACE FUNCTION public.join_group(p_code text, p_member_id text)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_group_id uuid;
  v_members jsonb;
  v_name text;
  v_pastor text;
BEGIN
  IF length(trim(coalesce(p_code, ''))) < 3 THEN
    RETURN jsonb_build_object('ok', false, 'reason', 'invalid_code');
  END IF;
  IF length(trim(coalesce(p_member_id, ''))) < 5 THEN
    RETURN jsonb_build_object('ok', false, 'reason', 'invalid_member');
  END IF;

  SELECT id, members, name, pastor_anon_id INTO v_group_id, v_members, v_name, v_pastor
  FROM public.church_groups
  WHERE lower(trim(code)) = lower(trim(p_code))
  LIMIT 1;

  IF v_group_id IS NULL THEN
    RETURN jsonb_build_object('ok', false, 'reason', 'not_found');
  END IF;

  IF NOT (v_members @> jsonb_build_array(trim(p_member_id))) THEN
    v_members := v_members || jsonb_build_array(trim(p_member_id));
    UPDATE public.church_groups SET members = v_members, updated_at = now() WHERE id = v_group_id;
  END IF;

  RETURN jsonb_build_object('ok', true, 'group_id', v_group_id, 'name', v_name, 'pastor_anon_id', v_pastor);
END;
$$;

-- Extend get_church_group_by_code to return pastor_anon_id
CREATE OR REPLACE FUNCTION public.get_church_group_by_code(p_code text)
RETURNS TABLE (id uuid, name text, pastor_anon_id text)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF length(trim(coalesce(p_code, ''))) < 3 THEN
    RETURN;
  END IF;
  RETURN QUERY
  SELECT cg.id, cg.name, cg.pastor_anon_id
  FROM public.church_groups cg
  WHERE lower(trim(cg.code)) = lower(trim(p_code))
  LIMIT 1;
END;
$$;

-- RPC: Create vote (pastor only). Verifies caller is pastor.
CREATE OR REPLACE FUNCTION public.create_church_vote(
  p_group_id uuid,
  p_draft_id uuid,
  p_title text,
  p_scripture text,
  p_pastor_anon_id text,
  p_days_open int DEFAULT 7
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_pastor text;
  v_id uuid;
BEGIN
  IF p_group_id IS NULL OR p_draft_id IS NULL OR length(trim(coalesce(p_pastor_anon_id, ''))) < 5 THEN
    RETURN jsonb_build_object('ok', false, 'reason', 'invalid');
  END IF;

  SELECT pastor_anon_id INTO v_pastor FROM public.church_groups WHERE id = p_group_id LIMIT 1;
  IF v_pastor IS NULL THEN
    RETURN jsonb_build_object('ok', false, 'reason', 'group_not_found');
  END IF;
  IF trim(v_pastor) != trim(p_pastor_anon_id) THEN
    RETURN jsonb_build_object('ok', false, 'reason', 'not_pastor');
  END IF;

  INSERT INTO public.church_votes (group_id, draft_id, title, scripture, status, ends_at)
  VALUES (
    p_group_id,
    p_draft_id,
    coalesce(trim(p_title), 'Untitled'),
    coalesce(trim(p_scripture), ''),
    'open',
    now() + (greatest(1, least(coalesce(p_days_open, 7), 30)) || ' days')::interval
  )
  RETURNING id INTO v_id;

  RETURN jsonb_build_object('ok', true, 'vote_id', v_id);
END;
$$;

GRANT EXECUTE ON FUNCTION public.create_church_vote(uuid, uuid, text, text, text, int) TO anon;
GRANT EXECUTE ON FUNCTION public.create_church_vote(uuid, uuid, text, text, text, int) TO authenticated;

-- RPC: Cast vote (member). votes jsonb: anon_id -> 1 (up) or -1 (down). One vote per member.
CREATE OR REPLACE FUNCTION public.cast_church_vote(
  p_vote_id uuid,
  p_anon_id text,
  p_vote int
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
  IF p_vote_id IS NULL OR length(trim(coalesce(p_anon_id, ''))) < 5 THEN
    RETURN jsonb_build_object('ok', false, 'reason', 'invalid');
  END IF;
  IF p_vote NOT IN (1, -1) THEN
    RETURN jsonb_build_object('ok', false, 'reason', 'invalid_vote');
  END IF;

  SELECT group_id INTO v_group_id FROM public.church_votes WHERE id = p_vote_id AND status = 'open' LIMIT 1;
  IF v_group_id IS NULL THEN
    RETURN jsonb_build_object('ok', false, 'reason', 'vote_closed');
  END IF;

  SELECT members INTO v_members FROM public.church_groups WHERE id = v_group_id LIMIT 1;
  IF v_members IS NULL OR NOT (v_members @> jsonb_build_array(trim(p_anon_id))) THEN
    RETURN jsonb_build_object('ok', false, 'reason', 'not_member');
  END IF;

  UPDATE public.church_votes
  SET votes = jsonb_set(coalesce(votes, '{}'), jsonb_build_array(trim(p_anon_id)), to_jsonb(p_vote::int))
  WHERE id = p_vote_id;

  RETURN jsonb_build_object('ok', true);
END;
$$;

GRANT EXECUTE ON FUNCTION public.cast_church_vote(uuid, text, int) TO anon;
GRANT EXECUTE ON FUNCTION public.cast_church_vote(uuid, text, int) TO authenticated;

-- RPC: Get open votes for group (with up/down counts)
CREATE OR REPLACE FUNCTION public.get_church_votes_open(p_group_id uuid)
RETURNS TABLE (
  id uuid,
  draft_id uuid,
  title text,
  scripture text,
  votes_up int,
  votes_down int,
  ends_at timestamptz
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
    cv.id,
    cv.draft_id,
    cv.title,
    cv.scripture,
    (SELECT count(*)::int FROM jsonb_each_text(coalesce(cv.votes, '{}')) WHERE value = '1'),
    (SELECT count(*)::int FROM jsonb_each_text(coalesce(cv.votes, '{}')) WHERE value = '-1'),
    cv.ends_at
  FROM public.church_votes cv
  WHERE cv.group_id = p_group_id AND cv.status = 'open' AND cv.ends_at > now()
  ORDER BY cv.created_at DESC;
END;
$$;

GRANT EXECUTE ON FUNCTION public.get_church_votes_open(uuid) TO anon;
GRANT EXECUTE ON FUNCTION public.get_church_votes_open(uuid) TO authenticated;

-- RPC: Get my vote for a vote (for UI to show current selection)
CREATE OR REPLACE FUNCTION public.get_my_church_vote(p_vote_id uuid, p_anon_id text)
RETURNS int
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_val jsonb;
BEGIN
  IF p_vote_id IS NULL OR length(trim(coalesce(p_anon_id, ''))) < 5 THEN
    RETURN 0;
  END IF;
  SELECT (votes->trim(p_anon_id))::int INTO v_val
  FROM public.church_votes WHERE id = p_vote_id LIMIT 1;
  RETURN coalesce((v_val::text)::int, 0);
END;
$$;

-- Update get_church_votes_open to return votes (for client to show "my vote")
DROP FUNCTION IF EXISTS public.get_church_votes_open(uuid);
CREATE OR REPLACE FUNCTION public.get_church_votes_open(p_group_id uuid)
RETURNS TABLE (
  id uuid,
  draft_id uuid,
  title text,
  scripture text,
  votes_up int,
  votes_down int,
  votes jsonb,
  ends_at timestamptz
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
    cv.id,
    cv.draft_id,
    cv.title,
    cv.scripture,
    (SELECT count(*)::int FROM jsonb_each_text(coalesce(cv.votes, '{}')) WHERE value = '1'),
    (SELECT count(*)::int FROM jsonb_each_text(coalesce(cv.votes, '{}')) WHERE value = '-1'),
    coalesce(cv.votes, '{}'),
    cv.ends_at
  FROM public.church_votes cv
  WHERE cv.group_id = p_group_id AND cv.status = 'open' AND cv.ends_at > now()
  ORDER BY cv.created_at DESC;
END;
$$;

GRANT EXECUTE ON FUNCTION public.get_church_votes_open(uuid) TO anon;
GRANT EXECUTE ON FUNCTION public.get_church_votes_open(uuid) TO authenticated;

-- RPC: Close vote (pastor only). Returns winner.
CREATE OR REPLACE FUNCTION public.close_church_vote(
  p_vote_id uuid,
  p_pastor_anon_id text
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_pastor text;
  v_group_id uuid;
  v_draft_id uuid;
  v_title text;
BEGIN
  IF p_vote_id IS NULL OR length(trim(coalesce(p_pastor_anon_id, ''))) < 5 THEN
    RETURN jsonb_build_object('ok', false, 'reason', 'invalid');
  END IF;

  SELECT cv.group_id, cv.draft_id, cv.title, cg.pastor_anon_id
  INTO v_group_id, v_draft_id, v_title, v_pastor
  FROM public.church_votes cv
  JOIN public.church_groups cg ON cg.id = cv.group_id
  WHERE cv.id = p_vote_id AND cv.status = 'open' LIMIT 1;

  IF v_group_id IS NULL THEN
    RETURN jsonb_build_object('ok', false, 'reason', 'not_found');
  END IF;
  IF trim(v_pastor) != trim(p_pastor_anon_id) THEN
    RETURN jsonb_build_object('ok', false, 'reason', 'not_pastor');
  END IF;

  UPDATE public.church_votes
  SET status = 'closed', winner_draft_id = v_draft_id
  WHERE id = p_vote_id;

  RETURN jsonb_build_object('ok', true, 'winner', v_title, 'draft_id', v_draft_id);
END;
$$;

GRANT EXECUTE ON FUNCTION public.close_church_vote(uuid, text) TO anon;
GRANT EXECUTE ON FUNCTION public.close_church_vote(uuid, text) TO authenticated;