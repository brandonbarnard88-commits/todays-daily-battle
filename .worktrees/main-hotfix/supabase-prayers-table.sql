-- One-time: create table for the prayer counter / echo backing data.
-- Run in Supabase SQL Editor, then use `supabase-prayers.sql` for the protected
-- RPC + RLS setup. Do not leave raw table access open to anon.

create table if not exists public.prayers (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now()
);

-- GOD mode: add intent, amen_count, session_id (run after table exists)
alter table public.prayers add column if not exists intent text;
alter table public.prayers add column if not exists amen_count int not null default 0;
alter table public.prayers add column if not exists session_id text;
alter table public.prayers add column if not exists family_name text;

-- Presence: distinct sessions in last 60 minutes (anon-safe)
create or replace function public.get_prayer_presence_count()
returns int language sql stable as $$
  select count(distinct session_id)::int from public.prayers
  where created_at > (now() - interval '60 minutes') and session_id is not null;
$$;

-- Optional historical note only: raw anon table access is no longer recommended.
-- alter table public.prayers enable row level security;
-- create policy "anon_insert_prayers" on public.prayers for insert to anon with check (true);
-- create policy "anon_count_prayers" on public.prayers for select to anon using (true);
