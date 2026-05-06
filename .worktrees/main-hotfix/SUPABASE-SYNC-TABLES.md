# Supabase tables for cross-device sync

Run this in the Supabase SQL editor (Dashboard → SQL Editor) to enable syncing streaks, prayer list, badges, and streak repair across devices for logged-in users.

```sql
-- Single table for key/value sync (streak, prayer_list, badges, streak_repair, challenge30)
create table if not exists public.user_sync_data (
  user_id uuid not null references auth.users(id) on delete cascade,
  sync_key text not null,
  sync_value jsonb not null default '{}',
  updated_at timestamptz not null default now(),
  primary key (user_id, sync_key)
);

alter table public.user_sync_data enable row level security;

create policy "Users can read own sync data"
  on public.user_sync_data for select
  using (auth.uid() = user_id);

create policy "Users can insert own sync data"
  on public.user_sync_data for insert
  with check (auth.uid() = user_id);

create policy "Users can update own sync data"
  on public.user_sync_data for update
  using (auth.uid() = user_id);

create policy "Users can delete own sync data"
  on public.user_sync_data for delete
  using (auth.uid() = user_id);

create index if not exists user_sync_data_user_id_idx on public.user_sync_data(user_id);
```

**Sync keys used by the app:**

| sync_key            | Meaning                                      |
|---------------------|----------------------------------------------|
| `streak`            | `{ lastKey, count, dates }` (daily battle)   |
| `prayer_wall_streak`| `['2026-03-09', ...]` (days posted to wall)  |
| `prayer_list`       | `[{ text, ref? }]`                           |
| `badges`            | `["new-warrior", ...]`                       |
| `badge_dates`       | `{ "new-warrior": "Feb 23, 2026", ... }`     |
| `streak_repair`     | `{ month, used }` (1 free repair per month)  |
| `challenge30`       | `"1"` if 30-day challenge started            |

After running the SQL, the site will sync these when users are logged in and persist to Supabase on change; on other devices, the next login pulls the latest data into local storage so the UI behaves the same.

**Best practices:** RLS is enabled; policies restrict access to `auth.uid() = user_id`. The index on `user_id` keeps lookups fast. To add master/admin read-all, use a separate policy with a helper (e.g. `USING (auth.jwt() ->> 'email' = current_setting('app.master_email') OR auth.uid() = user_id)`); avoid complex joins in policies.

**Testing:** With the anon key, unauthenticated requests to `user_sync_data` should return no rows. Test sync: sign in on Device A, add streak + prayer list item; sign in on Device B with same account and confirm data appears. See TESTING-SYNC.md for the full test sequence.

**Sermons table:** For the Sermon Builder (list, save, PDF export), run `supabase-sermons-table.sql` in the SQL Editor. That creates the `sermons` table (with RLS) and adds `date`/`status` if the table already existed.

**Sermon drafts (Team Collab):** For Pastor Hub Share Draft (shareable links), run `supabase-sermon-drafts.sql`. Creates `sermon_drafts` (id, anon_id, title, scripture, outline_json). RLS: anon SELECT/INSERT/UPDATE so anyone with the link can view and edit.

**Bible reflections:** For Bible Hub Daily Reflection (localStorage + Supabase sync, PDF export, weekly email), run `supabase-bible-reflections.sql`. Creates `bible_reflections` and `bible_reflection_subscribers` tables, plus `upsert_bible_reflection` and `upsert_bible_reflection_subscriber` RPCs.

**Church Hub:** For Church groups (join by code, shared reflections, leaderboard), run `supabase-church-groups.sql`. Creates `church_groups`, `church_reflections`, plus RPCs: `join_group`, `create_church_group`, `insert_church_reflection`, `get_church_reflections`, `get_church_group_by_code`, `get_church_leaderboard`.

**Church Sermon Voting:** Run `supabase-church-votes.sql` after church-groups. Creates `church_votes`, plus RPCs: `create_church_vote`, `cast_church_vote`, `get_church_votes_open`, `close_church_vote`. Extends `join_group` and `get_church_group_by_code` to return `pastor_anon_id`.

**Church Weekly Roundup:** Run `supabase-church-subscribers.sql` after church-groups. Creates `church_subscribers` (group_id, email) and RPC `upsert_church_subscriber`. Edge function `weekly-church-roundup` (Mondays 9AM UTC) sends roundup email via Mailgun. Cron: `supabase-weekly-church-roundup-cron.sql`.

**Church Kid Leaderboard:** Run `supabase-church-group-kids.sql` after church-groups and supabase-kid-streaks. Creates `church_group_kids` (group_id, invite_code, kid_name) and RPCs `add_church_group_kid`, `get_church_kid_leaderboard`. Parents link family code to show kid streaks on /church/daily.html. **Group Doodle Gallery:** Uses church_group_kids invite_codes + kid-doodles bucket (`doodles/{familyCode}/*.png`) to show a shared grid of kids' doodles on /church/daily.html. Hidden when no kids in group.

**Church Prayer Wall:** Run `supabase-church-prayer-wall.sql` after church-groups. Creates `church_prayer_requests` (group_id, anon_id, text, likes jsonb) and `church_prayer_comments`. RPCs: `insert_church_prayer_request`, `toggle_church_prayer_like`, `insert_church_prayer_comment`, `get_church_prayer_requests`, `get_church_prayer_comments`. Members post requests, like (one per person), and comment.

**Church Prayer Answered:** Run `supabase-church-prayer-answered.sql` after church-prayer-wall and church-subscribers. Adds `status` ('active'|'answered') to church_prayer_requests, `anon_id` to church_subscribers. RPCs: `mark_church_prayer_answered` (pastor only), updated `get_church_prayer_requests` with p_filter (active/answered/all). Edge function `notify-prayer-answered` sends email to poster when pastor marks answered (if poster subscribed).

**Church Verse Memory:** Run `supabase-church-verse-memory.sql` after church-groups. Adds `group_streak_count`, `group_streak_last_week` to church_groups. RPC `increment_church_group_streak(group_id, week_key, anon_id)` — one increment per week per group when perfect. Group Verse Challenge: fill-the-blank modal, 1/week (localStorage), confetti on perfect.

**Church Attendance Check-in:** Run `supabase-church-attendance.sql` after church-groups. Creates `church_attendance` (group_id, anon_id, date, present). RPCs: `upsert_church_attendance`, `get_church_attendance_week`, `apply_church_attendance_streak_bonus`. Members mark "I'm Here!" once/day (localStorage); pastor sees full list + "80%+ → +0.5 group streak" toast.

**Profile Family & Groups:** Run `supabase-profile-family-groups.sql` after supabase-profiles-tier.sql. Creates `profile_kids` (child profiles linked to parent), `profile_bible_study_groups` (user-created groups, join via invite code), `profile_group_members` (many-to-many), `profile_user_churches` (user church connection). RPCs: `profile_join_group_by_code`, `profile_generate_invite_code`. Used by `/profile.html` for account management.

**Profile Kid Loop Progress:** Run `supabase-profile-kid-loop-progress.sql` after supabase-profile-family-groups.sql. Creates `profile_kid_loop_progress` (kid_id, starred_ids, watch_counts, sunday_refresh_tag) for per-kid Kids Corner stars. Parent-only RLS via profile_kids join. Used by `/kids-corner.html` when signed in with kids.

---

**Web Push (VAPID, no Firebase lock-in):** Run `supabase-push-subscriptions.sql`. This creates `push_subscriptions` for browser push endpoints/keys. Writes are service-role only via Edge Functions (`save-push-subscription`, `remove-push-subscription`), then `send-daily-verse-push` sends daily verse notifications and prunes stale endpoints.

**Offline prayer failure logging:** Run `supabase-failed-prayer-attempts.sql`. This creates `failed_prayer_attempts` for retry failures from the offline prayer queue. Authenticated users can insert/select their own rows; app uses this for queue observability and troubleshooting.

**Push send observability:** Run `supabase-push-send-logs.sql`. This creates `push_send_logs`, where `send-daily-verse-push` records each run (`status`, `sent_count`, `failed_count`, `pruned_count`, `error_message`) for monitoring. If the table exists but RLS is missing, run `supabase-push-send-logs-rls-fix.sql` to enable RLS and lock down access (service_role only).

**Push health RPC (Stats page):** Run `supabase-push-health-rpc.sql`. This creates `get_push_health_latest()` (security definer) so `stats.html` can read only a safe latest summary row (status/sent/failed/pruned) without exposing full logs.

**Push daily schedule:** Run `supabase-push-daily-verse-cron.sql` (replace placeholders first) to schedule daily POST requests to `send-daily-verse-push` via `pg_cron` + `pg_net`.

**Bible Q&A (Ask the Bible):** Run `supabase-bible-kjv.sql` to create `bible_kjv` table (pgvector) and `match_bible_verses` RPC. Seed with `scripts/seed-bible-kjv.mjs`, embed with `scripts/embed-bible-kjv.mjs`, deploy `bible-qa` Edge Function. See `docs/BIBLE-QA-SETUP.md`.

**Feeling suggestions:** Run `supabase-feeling-suggestions.sql`. Creates `feeling_suggestions` (phrase, created_at). Anon INSERT only; no anon SELECT. Used by "Suggest a feeling" form on contact.html for crowdsourcing new search phrases.

**Plan suggestions:** Run `supabase-plan-suggestions.sql`. Creates `plan_suggestions` (phrase, created_at). Anon INSERT only; no anon SELECT. Used by the "Suggest a 7-day plan" form on `plans.html` for quiet topic requests without collecting email.

---

### Verify RLS (anon key test)

After running `supabase-rls-quick.sql`, confirm anon cannot read public tables:

1. **Incognito** (or a REST client). Use your **anon** key only (Supabase → Project Settings → API → anon public).
2. Request each URL (replace `YOUR-PROJECT` with your Supabase project ref):
   - `https://YOUR-PROJECT.supabase.co/rest/v1/messages?select=*`
   - `https://YOUR-PROJECT.supabase.co/rest/v1/daily_battles?select=*`
   - `https://YOUR-PROJECT.supabase.co/rest/v1/newsletter_signups?select=*`
3. Headers: `apikey: YOUR_ANON_KEY` and `Authorization: Bearer YOUR_ANON_KEY`.

**Secure result:** Each returns `[]` or **403** (no rows). If any returns real data, RLS is not applied for that table—re-run the quick SQL or check policies.

**Note:** The project ref is not exposed on the site (good). Use it only in your own browser or `curl` for this check; never commit it.
