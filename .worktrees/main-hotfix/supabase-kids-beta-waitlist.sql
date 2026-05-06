-- Kids Battle Beta waitlist. Run in Supabase SQL Editor.
-- Anon can INSERT; no anon SELECT. Authenticated/admin can read for export.
-- =============================================================================

CREATE TABLE IF NOT EXISTS public.kids_beta_waitlist (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL,
  age_range text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS kids_beta_waitlist_email_idx
  ON public.kids_beta_waitlist (lower(email));

ALTER TABLE public.kids_beta_waitlist ENABLE ROW LEVEL SECURITY;

-- Anon can insert (signup form)
DROP POLICY IF EXISTS "kids_beta_waitlist_insert_anon" ON public.kids_beta_waitlist;
CREATE POLICY "kids_beta_waitlist_insert_anon"
  ON public.kids_beta_waitlist
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Authenticated (admin) can read for export
DROP POLICY IF EXISTS "kids_beta_waitlist_select_auth" ON public.kids_beta_waitlist;
CREATE POLICY "kids_beta_waitlist_select_auth"
  ON public.kids_beta_waitlist
  FOR SELECT
  TO authenticated
  USING (true);

COMMENT ON TABLE public.kids_beta_waitlist IS 'Kids Battle beta signups. email, age_range (5-8|9-12|13+), created_at.';
