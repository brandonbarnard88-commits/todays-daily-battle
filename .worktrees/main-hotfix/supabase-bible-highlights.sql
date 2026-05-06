-- Bible Study highlights — synced from client for cross-device (future).
-- anon_id = device UUID from localStorage.
-- =============================================================================

CREATE TABLE IF NOT EXISTS public.bible_highlights (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  anon_id text NOT NULL,
  verse_ref text NOT NULL,
  note text DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(anon_id, verse_ref)
);

COMMENT ON TABLE public.bible_highlights IS 'Bible Hub study highlights. anon_id = device UUID.';

CREATE INDEX IF NOT EXISTS bible_highlights_anon_idx ON public.bible_highlights (anon_id);

ALTER TABLE public.bible_highlights ENABLE ROW LEVEL SECURITY;

-- No direct SELECT for anon (privacy). Service role can read.
DROP POLICY IF EXISTS "bible_highlights_service_only" ON public.bible_highlights;
CREATE POLICY "bible_highlights_service_only"
  ON public.bible_highlights
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- RPC: Client upserts highlight. Anon can call.
CREATE OR REPLACE FUNCTION public.upsert_bible_highlight(
  p_anon_id text,
  p_verse_ref text,
  p_note text
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
  IF length(trim(coalesce(p_verse_ref, ''))) < 3 THEN
    RETURN jsonb_build_object('ok', false, 'reason', 'invalid');
  END IF;

  INSERT INTO public.bible_highlights (anon_id, verse_ref, note, updated_at)
  VALUES (trim(p_anon_id), trim(p_verse_ref), coalesce(trim(p_note), ''), now())
  ON CONFLICT (anon_id, verse_ref) DO UPDATE SET
    note = coalesce(trim(p_note), ''),
    updated_at = now();

  RETURN jsonb_build_object('ok', true);
END;
$$;

GRANT EXECUTE ON FUNCTION public.upsert_bible_highlight(text, text, text) TO anon;
GRANT EXECUTE ON FUNCTION public.upsert_bible_highlight(text, text, text) TO authenticated;
