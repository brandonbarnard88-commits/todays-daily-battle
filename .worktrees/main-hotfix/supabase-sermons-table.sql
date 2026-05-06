-- =============================================================================
-- Sermons table for Sermon Builder (Supporter/Pro). Run in Supabase SQL Editor.
-- RLS: users can only see/edit/delete their own sermons.
-- =============================================================================

-- Create table if not exists (matches script.js: id, user_id, title, theme, text_ref, outline, points, application, prayer, updated_at)
CREATE TABLE IF NOT EXISTS public.sermons (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title text NOT NULL DEFAULT '',
  theme text DEFAULT '',
  text_ref text DEFAULT '',
  outline text DEFAULT '',
  points text DEFAULT '',
  application text DEFAULT '',
  prayer text DEFAULT '',
  date date,
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Add columns if table already existed with older schema (run once; ignore errors if column exists)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'sermons' AND column_name = 'date') THEN
    ALTER TABLE public.sermons ADD COLUMN date date;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'sermons' AND column_name = 'status') THEN
    ALTER TABLE public.sermons ADD COLUMN status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published'));
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'sermons' AND column_name = 'created_at') THEN
    ALTER TABLE public.sermons ADD COLUMN created_at timestamptz NOT NULL DEFAULT now();
  END IF;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

-- Index for listing user's sermons
CREATE INDEX IF NOT EXISTS sermons_user_id_updated_at_idx ON public.sermons(user_id, updated_at DESC);

-- RLS
ALTER TABLE public.sermons ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users own sermons" ON public.sermons;
CREATE POLICY "Users own sermons"
  ON public.sermons
  FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Optional: trigger to keep updated_at in sync
CREATE OR REPLACE FUNCTION public.sermons_updated_at()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;
DROP TRIGGER IF EXISTS sermons_updated_at ON public.sermons;
CREATE TRIGGER sermons_updated_at
  BEFORE UPDATE ON public.sermons
  FOR EACH ROW EXECUTE FUNCTION public.sermons_updated_at();
