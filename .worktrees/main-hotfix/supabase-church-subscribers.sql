-- =============================================================================
-- Church Hub — Weekly Roundup Email subscribers.
-- Run after supabase-church-groups.sql.
-- =============================================================================

CREATE TABLE IF NOT EXISTS public.church_subscribers (
  group_id uuid NOT NULL REFERENCES public.church_groups(id) ON DELETE CASCADE,
  email text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (group_id, email)
);

COMMENT ON TABLE public.church_subscribers IS 'Church Hub members who opted in for weekly roundup email.';

CREATE INDEX IF NOT EXISTS church_subscribers_group_idx ON public.church_subscribers (group_id);

ALTER TABLE public.church_subscribers ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "church_subscribers_service_only" ON public.church_subscribers;
CREATE POLICY "church_subscribers_service_only"
  ON public.church_subscribers FOR ALL TO service_role USING (true) WITH CHECK (true);

-- RPC: Opt in for weekly roundup. Verifies caller is a group member.
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

  INSERT INTO public.church_subscribers (group_id, email)
  VALUES (p_group_id, lower(trim(p_email)))
  ON CONFLICT (group_id, email) DO NOTHING;

  RETURN jsonb_build_object('ok', true);
END;
$$;

GRANT EXECUTE ON FUNCTION public.upsert_church_subscriber(uuid, text, text) TO anon;
GRANT EXECUTE ON FUNCTION public.upsert_church_subscriber(uuid, text, text) TO authenticated;
