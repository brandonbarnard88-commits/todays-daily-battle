-- Add invite_code to kids_beta_waitlist for email automation.
-- Run in Supabase SQL Editor after supabase-kids-beta-waitlist.sql.
-- =============================================================================

ALTER TABLE public.kids_beta_waitlist
  ADD COLUMN IF NOT EXISTS invite_code text;

COMMENT ON COLUMN public.kids_beta_waitlist.invite_code IS '6-char code for parent to share with kid. Sent via email on signup.';
