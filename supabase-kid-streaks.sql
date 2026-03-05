-- Kid streaks — synced from client for streak-drop reminder emails.
-- Run after supabase-kids-beta-invite-used.sql.
-- =============================================================================

CREATE TABLE IF NOT EXISTS public.kid_streaks (
  invite_code text PRIMARY KEY,
  streak_count int NOT NULL DEFAULT 0,
  last_day date NOT NULL,
  updated_at timestamptz NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.kid_streaks IS 'Streak data synced from kid device. Used for daily reminder emails.';

ALTER TABLE public.kid_streaks ENABLE ROW LEVEL SECURITY;

-- Service role / edge functions only (no direct client access)
DROP POLICY IF EXISTS "kid_streaks_no_anon" ON public.kid_streaks;
CREATE POLICY "kid_streaks_service_only"
  ON public.kid_streaks
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- RPC: Client upserts streak. Anon can call — code is the "secret".
-- Validates code exists in kids_beta_waitlist.
CREATE OR REPLACE FUNCTION public.upsert_kid_streak(
  p_code text,
  p_streak_count int,
  p_last_day date
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

  IF NOT EXISTS (SELECT 1 FROM public.kids_beta_waitlist WHERE invite_code = code_upper) THEN
    RETURN jsonb_build_object('ok', false, 'reason', 'invalid');
  END IF;

  INSERT INTO public.kid_streaks (invite_code, streak_count, last_day, updated_at)
  VALUES (code_upper, greatest(0, coalesce(p_streak_count, 0)), coalesce(p_last_day, current_date), now())
  ON CONFLICT (invite_code) DO UPDATE SET
    streak_count = greatest(0, coalesce(p_streak_count, 0)),
    last_day = coalesce(p_last_day, current_date),
    updated_at = now();

  RETURN jsonb_build_object('ok', true);
END;
$$;

GRANT EXECUTE ON FUNCTION public.upsert_kid_streak(text, int, date) TO anon;
GRANT EXECUTE ON FUNCTION public.upsert_kid_streak(text, int, date) TO authenticated;
