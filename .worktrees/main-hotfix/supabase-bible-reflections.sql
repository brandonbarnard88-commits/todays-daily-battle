-- Bible Hub daily reflections — synced from client for cross-device + weekly email.
-- anon_id = device UUID from localStorage (bibleHubAnonId).
-- =============================================================================

CREATE TABLE IF NOT EXISTS public.bible_reflections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  anon_id text NOT NULL,
  reflection_date date NOT NULL,
  verse_ref text DEFAULT '',
  reflection text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(anon_id, reflection_date)
);

COMMENT ON TABLE public.bible_reflections IS 'Bible Hub daily reflections. anon_id = device UUID. Used for PDF export + weekly reflection email.';

CREATE INDEX IF NOT EXISTS bible_reflections_anon_idx ON public.bible_reflections (anon_id);
CREATE INDEX IF NOT EXISTS bible_reflections_date_idx ON public.bible_reflections (reflection_date);

ALTER TABLE public.bible_reflections ENABLE ROW LEVEL SECURITY;

-- No direct SELECT for anon (privacy). Service role / edge functions can read.
DROP POLICY IF EXISTS "bible_reflections_service_only" ON public.bible_reflections;
CREATE POLICY "bible_reflections_service_only"
  ON public.bible_reflections
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- RPC: Client upserts reflection. Anon can call.
CREATE OR REPLACE FUNCTION public.upsert_bible_reflection(
  p_anon_id text,
  p_date date,
  p_reflection text,
  p_verse_ref text DEFAULT ''
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF length(trim(coalesce(p_anon_id, ''))) < 5 THEN
    RETURN jsonb_build_object('ok', false, 'reason', 'invalid');
  END IF;

  INSERT INTO public.bible_reflections (anon_id, reflection_date, verse_ref, reflection, updated_at)
  VALUES (trim(p_anon_id), coalesce(p_date::date, current_date), coalesce(trim(p_verse_ref), ''), coalesce(trim(p_reflection), ''), now())
  ON CONFLICT (anon_id, reflection_date) DO UPDATE SET
    verse_ref = coalesce(trim(p_verse_ref), ''),
    reflection = coalesce(trim(p_reflection), ''),
    updated_at = now();

  RETURN jsonb_build_object('ok', true);
END;
$$;

GRANT EXECUTE ON FUNCTION public.upsert_bible_reflection(text, date, text, text) TO anon;
GRANT EXECUTE ON FUNCTION public.upsert_bible_reflection(text, date, text, text) TO authenticated;

-- Optional: For weekly reflection email. Users opt in on Bible Hub.
CREATE TABLE IF NOT EXISTS public.bible_reflection_subscribers (
  anon_id text PRIMARY KEY,
  email text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
COMMENT ON TABLE public.bible_reflection_subscribers IS 'Bible Hub users who opted in for weekly reflection recap email.';
ALTER TABLE public.bible_reflection_subscribers ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "bible_reflection_subscribers_service_only" ON public.bible_reflection_subscribers;
CREATE POLICY "bible_reflection_subscribers_service_only"
  ON public.bible_reflection_subscribers FOR ALL TO service_role USING (true) WITH CHECK (true);

-- RPC: Client opts in for weekly reflection email. Anon can call.
CREATE OR REPLACE FUNCTION public.upsert_bible_reflection_subscriber(
  p_anon_id text,
  p_email text
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF length(trim(coalesce(p_anon_id, ''))) < 5 THEN
    RETURN jsonb_build_object('ok', false, 'reason', 'invalid');
  END IF;
  IF length(trim(coalesce(p_email, ''))) < 5 OR trim(p_email) !~ '^[^@]+@[^@]+\.[^@]+$' THEN
    RETURN jsonb_build_object('ok', false, 'reason', 'invalid_email');
  END IF;

  INSERT INTO public.bible_reflection_subscribers (anon_id, email)
  VALUES (trim(p_anon_id), lower(trim(p_email)))
  ON CONFLICT (anon_id) DO UPDATE SET email = lower(trim(p_email));

  RETURN jsonb_build_object('ok', true);
END;
$$;
GRANT EXECUTE ON FUNCTION public.upsert_bible_reflection_subscriber(text, text) TO anon;
GRANT EXECUTE ON FUNCTION public.upsert_bible_reflection_subscriber(text, text) TO authenticated;
