-- Optional: store Church Center data in Supabase for cross-device / shared access.
-- Run only if you want to move off localStorage. App currently uses localStorage keyed by church id.

-- Church verse of the day (pastor-set reference per church)
create table if not exists public.church_verse_of_day (
  church_id uuid not null,
  verse_ref text not null,
  set_by_user_id uuid,
  set_at timestamptz default now(),
  primary key (church_id)
);

-- Shared prayer list items per church
create table if not exists public.church_prayer_list (
  id uuid primary key default gen_random_uuid(),
  church_id uuid not null,
  item text not null,
  prayed boolean default false,
  added_by_user_id uuid,
  created_at timestamptz default now()
);

-- Assigned readings (passage + group; completion tracked per user)
create table if not exists public.church_assignments (
  id uuid primary key default gen_random_uuid(),
  church_id uuid not null,
  passage text not null,
  group_name text,
  assigned_to_user_id uuid,
  created_at timestamptz default now(),
  completed_at timestamptz
);

create index if not exists church_prayer_list_church_id_idx on public.church_prayer_list(church_id);
create index if not exists church_assignments_church_id_idx on public.church_assignments(church_id);

-- Enable RLS and add policies as needed (e.g. church members can read/write their church's data).
alter table public.church_verse_of_day enable row level security;
alter table public.church_prayer_list enable row level security;
alter table public.church_assignments enable row level security;
