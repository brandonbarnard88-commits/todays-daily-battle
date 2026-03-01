-- Rate limiting table for Edge Functions (submit-prayer, post-message).
-- Only service_role can read/write. Run in Supabase SQL Editor.
CREATE TABLE IF NOT EXISTS public.rate_limit (
  bucket_key text PRIMARY KEY,
  count int NOT NULL DEFAULT 0,
  window_start timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.rate_limit ENABLE ROW LEVEL SECURITY;

-- No GRANT to anon or authenticated: only service_role can access.
-- Edge Functions use service_role, so they can insert/update/select.

COMMENT ON TABLE public.rate_limit IS 'Server-side rate limit buckets; key format prayer_<hash> or message_<user_id>.';
