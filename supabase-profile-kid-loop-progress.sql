-- =============================================================================
-- Profile Kid Loop Progress — per-kid stars/watch counts for Kids Corner.
-- Run after supabase-profile-family-groups.sql.
-- Links profile_kids to loop library state (starredIds, watchCounts, sundayRefreshTag).
-- =============================================================================

CREATE TABLE IF NOT EXISTS public.profile_kid_loop_progress (
  kid_id uuid PRIMARY KEY REFERENCES public.profile_kids(id) ON DELETE CASCADE,
  starred_ids jsonb NOT NULL DEFAULT '[]',
  watch_counts jsonb NOT NULL DEFAULT '{}',
  sunday_refresh_tag text NOT NULL DEFAULT '',
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS profile_kid_loop_progress_kid_id_idx ON public.profile_kid_loop_progress(kid_id);
ALTER TABLE public.profile_kid_loop_progress ENABLE ROW LEVEL SECURITY;

-- RLS: parent can read/write their kids' progress (via profile_kids join)
DROP POLICY IF EXISTS "profile_kid_loop_select_parent" ON public.profile_kid_loop_progress;
CREATE POLICY "profile_kid_loop_select_parent" ON public.profile_kid_loop_progress
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.profile_kids k WHERE k.id = kid_id AND k.parent_id = auth.uid())
  );

DROP POLICY IF EXISTS "profile_kid_loop_insert_parent" ON public.profile_kid_loop_progress;
CREATE POLICY "profile_kid_loop_insert_parent" ON public.profile_kid_loop_progress
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.profile_kids k WHERE k.id = kid_id AND k.parent_id = auth.uid())
  );

DROP POLICY IF EXISTS "profile_kid_loop_update_parent" ON public.profile_kid_loop_progress;
CREATE POLICY "profile_kid_loop_update_parent" ON public.profile_kid_loop_progress
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.profile_kids k WHERE k.id = kid_id AND k.parent_id = auth.uid())
  ) WITH CHECK (
    EXISTS (SELECT 1 FROM public.profile_kids k WHERE k.id = kid_id AND k.parent_id = auth.uid())
  );

COMMENT ON TABLE public.profile_kid_loop_progress IS 'Per-kid Kids Corner loop progress (stars, watch counts). Parent-only access via profile_kids.';
