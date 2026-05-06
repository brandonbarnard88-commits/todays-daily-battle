-- Make invite codes 1-use. Add used column + RPCs for redeem and status check.
-- Run in Supabase SQL Editor after supabase-kids-beta-invite-code.sql.
-- =============================================================================

ALTER TABLE public.kids_beta_waitlist
  ADD COLUMN IF NOT EXISTS used boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS used_at timestamptz;

COMMENT ON COLUMN public.kids_beta_waitlist.used IS 'True when kid has redeemed this invite code.';
COMMENT ON COLUMN public.kids_beta_waitlist.used_at IS 'When the code was redeemed.';

-- RPC: kid redeems code. Returns { ok: true } or { ok: false, reason: 'used'|'invalid' }. Anon can call.
CREATE OR REPLACE FUNCTION public.redeem_invite_code(code text)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  row_id uuid;
  code_upper text;
BEGIN
  code_upper := upper(trim(coalesce(code, '')));
  IF length(code_upper) <> 6 THEN
    RETURN jsonb_build_object('ok', false, 'reason', 'invalid');
  END IF;

  SELECT id INTO row_id
  FROM public.kids_beta_waitlist
  WHERE invite_code = code_upper AND used = false
  LIMIT 1;

  IF row_id IS NULL THEN
    -- Check if code exists but used
    IF EXISTS (SELECT 1 FROM public.kids_beta_waitlist WHERE invite_code = code_upper) THEN
      RETURN jsonb_build_object('ok', false, 'reason', 'used');
    END IF;
    RETURN jsonb_build_object('ok', false, 'reason', 'invalid');
  END IF;

  UPDATE public.kids_beta_waitlist
  SET used = true, used_at = now()
  WHERE id = row_id;

  RETURN jsonb_build_object('ok', true);
END;
$$;

GRANT EXECUTE ON FUNCTION public.redeem_invite_code(text) TO anon;
GRANT EXECUTE ON FUNCTION public.redeem_invite_code(text) TO authenticated;

-- RPC: check if code is used. Parent dashboard calls this. Returns { found: true, used: true|false } or { found: false }
CREATE OR REPLACE FUNCTION public.check_invite_code_status(code text)
RETURNS jsonb
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  is_used boolean;
  code_upper text;
BEGIN
  code_upper := upper(trim(coalesce(code, '')));
  IF length(code_upper) <> 6 THEN
    RETURN jsonb_build_object('found', false);
  END IF;

  SELECT used INTO is_used
  FROM public.kids_beta_waitlist
  WHERE invite_code = code_upper
  LIMIT 1;

  IF is_used IS NULL THEN
    RETURN jsonb_build_object('found', false);
  END IF;

  RETURN jsonb_build_object('found', true, 'used', is_used);
END;
$$;

GRANT EXECUTE ON FUNCTION public.check_invite_code_status(text) TO anon;
GRANT EXECUTE ON FUNCTION public.check_invite_code_status(text) TO authenticated;
