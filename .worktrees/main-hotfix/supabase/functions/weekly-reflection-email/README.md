# weekly-reflection-email

Sends a weekly email to Bible Hub users who opted in: "Your reflection last week: 'God is always with me...' – keep going!"

**Prerequisites:**
1. Run `supabase-bible-reflections.sql` (creates `bible_reflections` table)
2. Run the SQL below to create the opt-in table
3. Add opt-in UI on Bible Hub: "Get weekly reflection recap" → store anon_id + email

**Opt-in table SQL:**
```sql
CREATE TABLE IF NOT EXISTS public.bible_reflection_subscribers (
  anon_id text PRIMARY KEY,
  email text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.bible_reflection_subscribers ENABLE ROW LEVEL SECURITY;
-- Service role only for edge function
```

**Env:** MAILGUN_API_KEY, MAILGUN_DOMAIN, MAILGUN_FROM, SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY

**Cron:** e.g. Mondays 9 AM UTC — `0 9 * * 1`

**Flow:**
1. Query `bible_reflections` for last 7 days
2. Join with `bible_reflection_subscribers` to get email per anon_id
3. For each subscriber with at least one reflection last week, send email with their most recent reflection

**Invoke:**
```bash
curl -X POST "https://<project-ref>.supabase.co/functions/v1/weekly-reflection-email" \
  -H "Authorization: Bearer <anon-key>"
```
