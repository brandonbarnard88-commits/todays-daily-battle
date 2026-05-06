# weekly-church-roundup

Sends the Weekly Church Roundup email every Monday at 9 AM UTC to church_subscribers.

**Data included:**
- Top reflection from last 7 days (church_reflections)
- Streak leader (adult_streaks for group members)
- Next sermon (most recent closed church_vote winner)
- Link to /church/daily.html

**Env vars:** MAILGUN_API_KEY, MAILGUN_DOMAIN, MAILGUN_FROM, SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY

**Deploy:** `supabase functions deploy weekly-church-roundup`

**Cron:** Run `supabase-weekly-church-roundup-cron.sql` in Supabase SQL Editor.
