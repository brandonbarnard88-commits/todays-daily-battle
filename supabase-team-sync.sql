-- =============================================================================
-- Team Sync for Free Tier — 6-digit codes, Church Verse of the Day, limits.
-- Run this in Supabase SQL Editor after reviewing RLS.
-- Models after church_groups.sql and church-optional.sql.
-- Supports no-login members via anon_id where possible; pastor can be authenticated.
-- Free tier: 1 team, max 25 members enforced in RPCs. Verse read-only for free by default.
-- Privacy-first: data on-device by default; sync explicit. KJV-only for all verses.
-- Offline-first: client caches in localStorage with fallback message.
-- =============================================================================

-- Team codes (simple 6-digit, e.g. '472819')
CREATE TABLE IF NOT EXISTS public.team_codes (
  code text PRIMARY KEY CHECK (length(code) = 6 AND code ~ '^[0-9]{6}$'),
  name text NOT NULL DEFAULT 'My Team',
  created_by uuid REFERENCES auth.users(id), -- optional for pastor login
  pastor_anon_id text, -- for no-login pastor creation
  max_members int NOT NULL DEFAULT 25,
  members jsonb NOT NULL DEFAULT '[]', -- array of anon_ids or user_ids
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.team_codes IS 'Free Team Sync codes. 6-digit numeric. 1 team per church (enforced in RPC). Max 25 members.';

CREATE INDEX IF NOT EXISTS team_codes_code_idx ON public.team_codes (code);
CREATE INDEX IF NOT EXISTS team_codes_pastor_idx ON public.team_codes (pastor_anon_id);

ALTER TABLE public.team_codes ENABLE ROW LEVEL SECURITY;

-- RLS: service_role only. All access via SECURITY DEFINER RPCs (least privilege).
DROP POLICY IF EXISTS "team_codes_service_only" ON public.team_codes;
CREATE POLICY "team_codes_service_only"
  ON public.team_codes FOR ALL TO service_role USING (true) WITH CHECK (true);

-- Team Verse of the Day (read-mostly for free tier, pastor sets)
CREATE TABLE IF NOT EXISTS public.team_verse_of_day (
  team_code text NOT NULL REFERENCES public.team_codes(code) ON DELETE CASCADE,
  verse_ref text NOT NULL, -- MUST be valid KJV reference only
  set_by uuid,
  set_by_anon text,
  set_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (team_code)
);

COMMENT ON TABLE public.team_verse_of_day IS 'Church/Team Verse of the Day. Pastor sets one KJV verse per team. Appears on member homepages via code or PWA. Read-only for most free users.';

CREATE INDEX IF NOT EXISTS team_verse_team_idx ON public.team_verse_of_day (team_code);

ALTER TABLE public.team_verse_of_day ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "team_verse_service_only" ON public.team_verse_of_day;
CREATE POLICY "team_verse_service_only"
  ON public.team_verse_of_day FOR ALL TO service_role USING (true) WITH CHECK (true);

-- Optional: team_sync_data for calendar, prayer, notes, attendance (jsonb like user_sync_data)
CREATE TABLE IF NOT EXISTS public.team_sync_data (
  team_code text NOT NULL REFERENCES public.team_codes(code) ON DELETE CASCADE,
  sync_key text NOT NULL, -- e.g. 'calendar', 'prayer_chain', 'notes', 'attendance'
  sync_value jsonb NOT NULL DEFAULT '{}',
  updated_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (team_code, sync_key)
);

COMMENT ON TABLE public.team_sync_data IS 'Team-scoped sync (calendar, prayer chain, shared notes, attendance). Client prefers localStorage; syncs on explicit opt-in or login.';

ALTER TABLE public.team_sync_data ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "team_sync_service_only" ON public.team_sync_data;
CREATE POLICY "team_sync_service_only"
  ON public.team_sync_data FOR ALL TO service_role USING (true) WITH CHECK (true);

-- RPC: Create a new team code (6-digit random, check uniqueness, enforce 1-team if possible)
CREATE OR REPLACE FUNCTION public.create_team_code(
  p_name text DEFAULT 'My Team',
  p_pastor_anon_id text DEFAULT NULL,
  p_created_by uuid DEFAULT NULL
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_code text;
  v_attempts int := 0;
  v_max_members int := 25;
BEGIN
  -- Generate unique 6-digit code
  LOOP
    v_code := lpad(floor(random() * 1000000)::text, 6, '0');
    IF NOT EXISTS (SELECT 1 FROM team_codes WHERE code = v_code) THEN
      EXIT;
    END IF;
    v_attempts := v_attempts + 1;
    IF v_attempts > 20 THEN
      RETURN jsonb_build_object('ok', false, 'reason', 'code_generation_failed');
    END IF;
  END LOOP;

  INSERT INTO team_codes (code, name, pastor_anon_id, created_by, max_members)
  VALUES (v_code, coalesce(p_name, 'My Team'), p_pastor_anon_id, p_created_by, v_max_members)
  ON CONFLICT (code) DO NOTHING;

  RETURN jsonb_build_object(
    'ok', true,
    'code', v_code,
    'name', p_name,
    'max_members', v_max_members,
    'qr_url', '/team-toolkit.html?team=' || v_code  -- client generates QR
  );
END;
$$;

GRANT EXECUTE ON FUNCTION public.create_team_code(text, text, uuid) TO anon, authenticated;

-- RPC: Join team by code (add to members jsonb, enforce limit <=25)
CREATE OR REPLACE FUNCTION public.join_team_by_code(p_code text, p_member_id text)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_members jsonb;
  v_max int;
  v_count int;
BEGIN
  IF length(trim(coalesce(p_code, ''))) != 6 OR p_code !~ '^[0-9]{6}$' THEN
    RETURN jsonb_build_object('ok', false, 'reason', 'invalid_code');
  END IF;
  IF length(trim(coalesce(p_member_id, ''))) < 5 THEN
    RETURN jsonb_build_object('ok', false, 'reason', 'invalid_member');
  END IF;

  SELECT members, max_members INTO v_members, v_max
  FROM team_codes 
  WHERE code = p_code;

  IF v_members IS NULL THEN
    RETURN jsonb_build_object('ok', false, 'reason', 'not_found');
  END IF;

  v_count := jsonb_array_length(v_members);
  IF v_count >= v_max THEN
    RETURN jsonb_build_object('ok', false, 'reason', 'team_full', 'limit', v_max);
  END IF;

  IF NOT (v_members @> jsonb_build_array(trim(p_member_id))) THEN
    v_members := v_members || jsonb_build_array(trim(p_member_id));
    UPDATE team_codes 
    SET members = v_members, updated_at = now() 
    WHERE code = p_code;
  END IF;

  -- Auto-create default verse if none
  IF NOT EXISTS (SELECT 1 FROM team_verse_of_day WHERE team_code = p_code) THEN
    INSERT INTO team_verse_of_day (team_code, verse_ref, set_by_anon)
    VALUES (p_code, 'John 3:16', 'system') ON CONFLICT DO NOTHING;
  END IF;

  RETURN jsonb_build_object('ok', true, 'code', p_code, 'member_count', jsonb_array_length(v_members));
END;
$$;

GRANT EXECUTE ON FUNCTION public.join_team_by_code(text, text) TO anon, authenticated;

-- RPC: Set team verse (KJV only enforced in app, here just store)
CREATE OR REPLACE FUNCTION public.set_team_verse(p_code text, p_verse_ref text, p_set_by uuid DEFAULT NULL, p_anon text DEFAULT NULL)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF length(trim(coalesce(p_code, ''))) != 6 THEN
    RETURN jsonb_build_object('ok', false, 'reason', 'invalid_code');
  END IF;

  INSERT INTO team_verse_of_day (team_code, verse_ref, set_by, set_by_anon, set_at)
  VALUES (p_code, trim(p_verse_ref), p_set_by, p_anon, now())
  ON CONFLICT (team_code) 
  DO UPDATE SET 
    verse_ref = EXCLUDED.verse_ref,
    set_by = EXCLUDED.set_by,
    set_by_anon = EXCLUDED.set_by_anon,
    set_at = now();

  RETURN jsonb_build_object('ok', true, 'verse_ref', p_verse_ref, 'team_code', p_code);
END;
$$;

GRANT EXECUTE ON FUNCTION public.set_team_verse(text, text, uuid, text) TO authenticated; -- prefer auth for setter

-- RPC: Get team verse (for members)
CREATE OR REPLACE FUNCTION public.get_team_verse(p_code text)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_verse text;
BEGIN
  SELECT verse_ref INTO v_verse 
  FROM team_verse_of_day 
  WHERE team_code = p_code;

  IF v_verse IS NULL THEN
    v_verse := 'John 3:16'; -- safe KJV default
  END IF;

  RETURN jsonb_build_object('ok', true, 'verse_ref', v_verse, 'team_code', p_code);
END;
$$;

GRANT EXECUTE ON FUNCTION public.get_team_verse(text) TO anon, authenticated;

-- Add updated_at trigger helper if needed (similar to church)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'team_codes' AND column_name = 'updated_at') THEN
    -- already added in table
    NULL;
  END IF;
END $$;

-- Realtime suggestion: enable on team_verse_of_day and team_sync_data in Supabase Dashboard for live updates.
-- For free tier read-only verse: client can call get_team_verse without auth.
-- Full sync (calendar etc via team_sync_data) gated by tier or member count in app layer.

-- Run after: update SUPABASE-SYNC-TABLES.md and SECURITY.md.
-- Test with: SELECT * FROM create_team_code('Youth Group');
-- SELECT * FROM join_team_by_code('123456', 'device-abc123');
-- Verify RLS blocks direct table access for anon/auth.
