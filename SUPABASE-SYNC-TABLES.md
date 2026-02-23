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

| sync_key        | Meaning                                      |
|-----------------|----------------------------------------------|
| `streak`        | `{ lastKey, count, dates }` (daily battle)   |
| `prayer_list`   | `[{ text, ref? }]`                           |
| `badges`        | `["new-warrior", ...]`                       |
| `badge_dates`   | `{ "new-warrior": "Feb 23, 2026", ... }`     |
| `streak_repair` | `{ month, used }` (1 free repair per month)  |
| `challenge30`   | `"1"` if 30-day challenge started            |

After running the SQL, the site will sync these when users are logged in and persist to Supabase on change; on other devices, the next login pulls the latest data into local storage so the UI behaves the same.
