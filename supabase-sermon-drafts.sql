-- =============================================================================
-- Sermon drafts for Pastor Hub Team Collab. Shareable draft links.
-- Run in Supabase SQL Editor.
-- RLS: anon SELECT (anyone with link can read), anon INSERT/UPDATE (share + edit).
-- =============================================================================

CREATE TABLE IF NOT EXISTS public.sermon_drafts (
  id uuid PRIMARY KEY,
  anon_id text NOT NULL,
  title text NOT NULL DEFAULT '',
  scripture text DEFAULT '',
  outline_json jsonb NOT NULL DEFAULT '[]',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.sermon_drafts IS 'Pastor Hub shareable sermon drafts. anon_id = device UUID. Anyone with link can read/edit.';

-- Add scripture column if table already existed
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'sermon_drafts' AND column_name = 'scripture') THEN
    ALTER TABLE public.sermon_drafts ADD COLUMN scripture text DEFAULT '';
  END IF;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

CREATE INDEX IF NOT EXISTS sermon_drafts_anon_id_idx ON public.sermon_drafts (anon_id);
CREATE INDEX IF NOT EXISTS sermon_drafts_created_at_idx ON public.sermon_drafts (created_at DESC);

ALTER TABLE public.sermon_drafts ENABLE ROW LEVEL SECURITY;

-- Anon can SELECT any row (load draft by id from share link)
DROP POLICY IF EXISTS "Anon can read sermon drafts by id" ON public.sermon_drafts;
CREATE POLICY "Anon can read sermon drafts by id"
  ON public.sermon_drafts FOR SELECT
  USING (true);

-- Anon can INSERT (creator shares draft)
DROP POLICY IF EXISTS "Anon can insert sermon drafts" ON public.sermon_drafts;
CREATE POLICY "Anon can insert sermon drafts"
  ON public.sermon_drafts FOR INSERT
  WITH CHECK (true);

-- Anon can UPDATE any row (team member with link can edit)
DROP POLICY IF EXISTS "Anon can update sermon drafts" ON public.sermon_drafts;
CREATE POLICY "Anon can update sermon drafts"
  ON public.sermon_drafts FOR UPDATE
  USING (true)
  WITH CHECK (true);

-- Optional: trigger to keep updated_at in sync
CREATE OR REPLACE FUNCTION public.sermon_drafts_updated_at()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;
DROP TRIGGER IF EXISTS sermon_drafts_updated_at ON public.sermon_drafts;
CREATE TRIGGER sermon_drafts_updated_at
  BEFORE UPDATE ON public.sermon_drafts
  FOR EACH ROW EXECUTE FUNCTION public.sermon_drafts_updated_at();
