-- =============================================================================
-- Quick RLS lock: disable anon read, auth-only read
-- =============================================================================

-- 0. Enable RLS
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_battles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.newsletter_signups ENABLE ROW LEVEL SECURITY;

-- 1. Drop old anon_read policies (safe if missing)
DROP POLICY IF EXISTS "anon_read" ON public.messages;
DROP POLICY IF EXISTS "anon_read" ON public.daily_battles;
DROP POLICY IF EXISTS "anon_read" ON public.newsletter_signups;

-- 2. Auth-only read (drop first so script is safe to re-run)
DROP POLICY IF EXISTS "auth_read_messages" ON public.messages;
CREATE POLICY "auth_read_messages" ON public.messages
FOR SELECT USING (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "auth_read_battles" ON public.daily_battles;
CREATE POLICY "auth_read_battles" ON public.daily_battles
FOR SELECT USING (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "auth_read_newsletter_signups" ON public.newsletter_signups;
CREATE POLICY "auth_read_newsletter_signups" ON public.newsletter_signups
FOR SELECT USING (auth.uid() IS NOT NULL);
