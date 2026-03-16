-- =============================================================================
-- Profile Family & Groups — Kids, Bible Study Groups, Church connections.
-- Run in Supabase SQL Editor after supabase-profiles-tier.sql.
-- RLS: users only see their own kids, groups they own/join, and their church.
-- =============================================================================

-- Extend profiles with display_name if missing (only if profiles table exists)
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_catalog.pg_class c
    JOIN pg_catalog.pg_namespace n ON n.oid = c.relnamespace
    WHERE c.relname = 'profiles' AND n.nspname = 'public'
  ) THEN
    ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS display_name text;
  END IF;
END $$;

-- Kids: children linked to parent (auth user)
CREATE TABLE IF NOT EXISTS public.profile_kids (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  parent_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  age_range text,
  avatar_url text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS profile_kids_parent_id_idx ON public.profile_kids(parent_id);
ALTER TABLE public.profile_kids ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "profile_kids_select_own" ON public.profile_kids;
CREATE POLICY "profile_kids_select_own" ON public.profile_kids
  FOR SELECT USING (auth.uid() = parent_id);

DROP POLICY IF EXISTS "profile_kids_insert_own" ON public.profile_kids;
CREATE POLICY "profile_kids_insert_own" ON public.profile_kids
  FOR INSERT WITH CHECK (auth.uid() = parent_id);

DROP POLICY IF EXISTS "profile_kids_update_own" ON public.profile_kids;
CREATE POLICY "profile_kids_update_own" ON public.profile_kids
  FOR UPDATE USING (auth.uid() = parent_id) WITH CHECK (auth.uid() = parent_id);

DROP POLICY IF EXISTS "profile_kids_delete_own" ON public.profile_kids;
CREATE POLICY "profile_kids_delete_own" ON public.profile_kids
  FOR DELETE USING (auth.uid() = parent_id);

-- Bible study groups: user-created, join via invite code
CREATE TABLE IF NOT EXISTS public.profile_bible_study_groups (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  invite_code text UNIQUE NOT NULL,
  created_by uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS profile_bible_study_groups_created_by_idx ON public.profile_bible_study_groups(created_by);
CREATE INDEX IF NOT EXISTS profile_bible_study_groups_invite_code_idx ON public.profile_bible_study_groups(invite_code);
ALTER TABLE public.profile_bible_study_groups ENABLE ROW LEVEL SECURITY;

-- RLS: creator can do all; members can select (via group_members join)
DROP POLICY IF EXISTS "profile_bible_groups_select_creator" ON public.profile_bible_study_groups;
CREATE POLICY "profile_bible_groups_select_creator" ON public.profile_bible_study_groups
  FOR SELECT USING (auth.uid() = created_by);

DROP POLICY IF EXISTS "profile_bible_groups_select_member" ON public.profile_bible_study_groups;
CREATE POLICY "profile_bible_groups_select_member" ON public.profile_bible_study_groups
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.profile_group_members WHERE group_id = id AND user_id = auth.uid())
  );

DROP POLICY IF EXISTS "profile_bible_groups_insert_own" ON public.profile_bible_study_groups;
CREATE POLICY "profile_bible_groups_insert_own" ON public.profile_bible_study_groups
  FOR INSERT WITH CHECK (auth.uid() = created_by);

DROP POLICY IF EXISTS "profile_bible_groups_update_creator" ON public.profile_bible_study_groups;
CREATE POLICY "profile_bible_groups_update_creator" ON public.profile_bible_study_groups
  FOR UPDATE USING (auth.uid() = created_by) WITH CHECK (auth.uid() = created_by);

DROP POLICY IF EXISTS "profile_bible_groups_delete_creator" ON public.profile_bible_study_groups;
CREATE POLICY "profile_bible_groups_delete_creator" ON public.profile_bible_study_groups
  FOR DELETE USING (auth.uid() = created_by);

-- Group members: many-to-many (must come after group table)
CREATE TABLE IF NOT EXISTS public.profile_group_members (
  group_id uuid NOT NULL REFERENCES public.profile_bible_study_groups(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role text NOT NULL DEFAULT 'member',
  joined_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (group_id, user_id)
);

CREATE INDEX IF NOT EXISTS profile_group_members_user_id_idx ON public.profile_group_members(user_id);
ALTER TABLE public.profile_group_members ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "profile_group_members_select_own" ON public.profile_group_members;
CREATE POLICY "profile_group_members_select_own" ON public.profile_group_members
  FOR SELECT USING (
    auth.uid() = user_id
    OR EXISTS (SELECT 1 FROM public.profile_bible_study_groups g WHERE g.id = group_id AND g.created_by = auth.uid())
  );

DROP POLICY IF EXISTS "profile_group_members_insert_creator" ON public.profile_group_members;
CREATE POLICY "profile_group_members_insert_creator" ON public.profile_group_members
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.profile_bible_study_groups g WHERE g.id = group_id AND g.created_by = auth.uid())
    OR auth.uid() = user_id
  );

DROP POLICY IF EXISTS "profile_group_members_delete_own" ON public.profile_group_members;
CREATE POLICY "profile_group_members_delete_own" ON public.profile_group_members
  FOR DELETE USING (
    auth.uid() = user_id
    OR EXISTS (SELECT 1 FROM public.profile_bible_study_groups g WHERE g.id = group_id AND g.created_by = auth.uid())
  );

-- Church: user-linked (one per user)
CREATE TABLE IF NOT EXISTS public.profile_user_churches (
  user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  church_name text,
  church_location text,
  pastor_email text,
  verified boolean NOT NULL DEFAULT false,
  joined_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.profile_user_churches ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "profile_user_churches_select_own" ON public.profile_user_churches;
CREATE POLICY "profile_user_churches_select_own" ON public.profile_user_churches
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "profile_user_churches_insert_own" ON public.profile_user_churches;
CREATE POLICY "profile_user_churches_insert_own" ON public.profile_user_churches
  FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "profile_user_churches_update_own" ON public.profile_user_churches;
CREATE POLICY "profile_user_churches_update_own" ON public.profile_user_churches
  FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "profile_user_churches_delete_own" ON public.profile_user_churches;
CREATE POLICY "profile_user_churches_delete_own" ON public.profile_user_churches
  FOR DELETE USING (auth.uid() = user_id);

-- RPC: Join group by invite code (authenticated user)
CREATE OR REPLACE FUNCTION public.profile_join_group_by_code(p_invite_code text)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_group_id uuid;
  v_uid uuid;
BEGIN
  v_uid := auth.uid();
  IF v_uid IS NULL THEN
    RETURN jsonb_build_object('ok', false, 'reason', 'not_authenticated');
  END IF;
  IF length(trim(coalesce(p_invite_code, ''))) < 4 THEN
    RETURN jsonb_build_object('ok', false, 'reason', 'invalid_code');
  END IF;

  SELECT id INTO v_group_id
  FROM public.profile_bible_study_groups
  WHERE lower(trim(invite_code)) = lower(trim(p_invite_code))
  LIMIT 1;

  IF v_group_id IS NULL THEN
    RETURN jsonb_build_object('ok', false, 'reason', 'not_found');
  END IF;

  INSERT INTO public.profile_group_members (group_id, user_id, role)
  VALUES (v_group_id, v_uid, 'member')
  ON CONFLICT (group_id, user_id) DO NOTHING;

  RETURN jsonb_build_object('ok', true, 'group_id', v_group_id);
END;
$$;

GRANT EXECUTE ON FUNCTION public.profile_join_group_by_code(text) TO authenticated;

-- RPC: Generate unique invite code (8 chars, no collisions)
CREATE OR REPLACE FUNCTION public.profile_generate_invite_code()
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  code text;
BEGIN
  LOOP
    code := upper(substring(md5(random()::text || clock_timestamp()::text), 1, 8));
    IF NOT EXISTS (SELECT 1 FROM public.profile_bible_study_groups WHERE lower(invite_code) = lower(code)) THEN
      RETURN code;
    END IF;
  END LOOP;
END;
$$;

GRANT EXECUTE ON FUNCTION public.profile_generate_invite_code() TO authenticated;

COMMENT ON TABLE public.profile_kids IS 'Child profiles linked to parent auth user.';
COMMENT ON TABLE public.profile_bible_study_groups IS 'Bible study groups for authenticated users. Join via invite code.';
COMMENT ON TABLE public.profile_group_members IS 'Group membership. Creator can add; members can leave.';
COMMENT ON TABLE public.profile_user_churches IS 'User church connection. One per user.';
