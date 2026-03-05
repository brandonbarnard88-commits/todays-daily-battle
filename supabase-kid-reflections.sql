-- Kid reflections — synced from Kids Battle when kid is connected via invite code.
-- Parent dashboard fetches via get_kid_reflections(p_code). RLS: anon read via code.
-- =============================================================================

CREATE TABLE IF NOT EXISTS public.kid_reflections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  invite_code text NOT NULL,
  reflection_date date NOT NULL,
  verse_ref text DEFAULT '',
  reflection text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(invite_code, reflection_date)
);

COMMENT ON TABLE public.kid_reflections IS 'Kids Battle daily reflections. Synced when kid has family code.';

CREATE INDEX IF NOT EXISTS kid_reflections_code_idx ON public.kid_reflections (invite_code);
CREATE INDEX IF NOT EXISTS kid_reflections_date_idx ON public.kid_reflections (reflection_date);

ALTER TABLE public.kid_reflections ENABLE ROW LEVEL SECURITY;

-- Service role: full access
DROP POLICY IF EXISTS "kid_reflections_service_only" ON public.kid_reflections;
CREATE POLICY "kid_reflections_service_only"
  ON public.kid_reflections FOR ALL TO service_role USING (true) WITH CHECK (true);

-- RPC: Client upserts reflection. Anon can call when kid has valid code.
CREATE OR REPLACE FUNCTION public.upsert_kid_reflection(
  p_code text,
  p_date date,
  p_verse text,
  p_text text
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  code_upper text;
BEGIN
  code_upper := upper(trim(coalesce(p_code, '')));
  IF length(code_upper) <> 6 THEN
    RETURN jsonb_build_object('ok', false, 'reason', 'invalid');
  END IF;

  INSERT INTO public.kid_reflections (invite_code, reflection_date, verse_ref, reflection, updated_at)
  VALUES (code_upper, coalesce(p_date::date, current_date), coalesce(trim(p_verse), ''), coalesce(trim(p_text), ''), now())
  ON CONFLICT (invite_code, reflection_date) DO UPDATE SET
    verse_ref = coalesce(trim(p_verse), ''),
    reflection = coalesce(trim(p_text), ''),
    updated_at = now();

  RETURN jsonb_build_object('ok', true);
END;
$$;

GRANT EXECUTE ON FUNCTION public.upsert_kid_reflection(text, date, text, text) TO anon;
GRANT EXECUTE ON FUNCTION public.upsert_kid_reflection(text, date, text, text) TO authenticated;

-- RPC: Anon read via code — returns reflections for that invite code.
CREATE OR REPLACE FUNCTION public.get_kid_reflections(p_code text)
RETURNS TABLE(reflection_date date, verse_ref text, reflection text)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  code_upper text;
BEGIN
  code_upper := upper(trim(coalesce(p_code, '')));
  IF length(code_upper) <> 6 THEN
    RETURN;
  END IF;

  RETURN QUERY
  SELECT k.reflection_date, k.verse_ref, k.reflection
  FROM public.kid_reflections k
  WHERE k.invite_code = code_upper
  ORDER BY k.reflection_date DESC
  LIMIT 30;
END;
$$;

GRANT EXECUTE ON FUNCTION public.get_kid_reflections(text) TO anon;
GRANT EXECUTE ON FUNCTION public.get_kid_reflections(text) TO authenticated;
