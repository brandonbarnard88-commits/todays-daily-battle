-- Adult Bible Hub streaks — synced from client for habit tracking.
-- Anon users identified by anon_id (UUID from localStorage).
-- =============================================================================

CREATE TABLE IF NOT EXISTS public.adult_streaks (
  anon_id text PRIMARY KEY,
  streak_count int NOT NULL DEFAULT 0,
  last_day date NOT NULL,
  updated_at timestamptz NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.adult_streaks IS 'Bible Hub read streaks. anon_id = device UUID from localStorage.';

ALTER TABLE public.adult_streaks ENABLE ROW LEVEL SECURITY;

-- No direct SELECT for anon (privacy). Service role / edge functions can read.
DROP POLICY IF EXISTS "adult_streaks_service_only" ON public.adult_streaks;
CREATE POLICY "adult_streaks_service_only"
  ON public.adult_streaks
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- RPC: Client upserts streak. Anon can call with their anon_id.
CREATE OR REPLACE FUNCTION public.upsert_adult_streak(
  p_anon_id text,
  p_streak_count int,
  p_last_day date
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

  INSERT INTO public.adult_streaks (anon_id, streak_count, last_day, updated_at)
  VALUES (trim(p_anon_id), greatest(0, coalesce(p_streak_count, 0)), coalesce(p_last_day::date, current_date), now())
  ON CONFLICT (anon_id) DO UPDATE SET
    streak_count = greatest(0, coalesce(p_streak_count, 0)),
    last_day = coalesce(p_last_day::date, current_date),
    updated_at = now();

  RETURN jsonb_build_object('ok', true);
END;
$$;

GRANT EXECUTE ON FUNCTION public.upsert_adult_streak(text, int, date) TO anon;
GRANT EXECUTE ON FUNCTION public.upsert_adult_streak(text, int, date) TO authenticated;
