-- =============================================================================
-- Profiles table with tier column (for Stripe webhook → tier update)
-- Run in Supabase SQL Editor. Supabase Auth may already create public.profiles
-- via a trigger; this adds/ensures the tier column.
-- =============================================================================

-- Create profiles if not exists (Supabase often creates it from Auth template)
CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text,
  updated_at timestamptz DEFAULT now()
);

-- Add tier column: 'free' | 'supporter' | 'battle_pro' | 'church'
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS tier text NOT NULL DEFAULT 'free';

-- RLS: users can read/update own row; service role (webhook) can update any
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "profiles_select_own" ON public.profiles;
CREATE POLICY "profiles_select_own" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

DROP POLICY IF EXISTS "profiles_update_own" ON public.profiles;
CREATE POLICY "profiles_update_own" ON public.profiles
  FOR UPDATE USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

-- Webhook (service role) needs to INSERT or UPDATE by user_id; allow insert for new users, update for tier.
-- CRITICAL: Only service_role may INSERT/UPDATE (TO service_role) so tier cannot be set from client.
DROP POLICY IF EXISTS "profiles_insert_service" ON public.profiles;
CREATE POLICY "profiles_insert_service" ON public.profiles
  FOR INSERT TO service_role WITH CHECK (true);

DROP POLICY IF EXISTS "profiles_update_service" ON public.profiles;
CREATE POLICY "profiles_update_service" ON public.profiles
  FOR UPDATE TO service_role USING (true) WITH CHECK (true);

GRANT SELECT, UPDATE ON public.profiles TO authenticated;
GRANT SELECT, INSERT, UPDATE ON public.profiles TO service_role;

-- Optional: ensure a row exists for each auth user (trigger from auth.users)
