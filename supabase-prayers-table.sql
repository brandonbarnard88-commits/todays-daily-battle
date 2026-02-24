-- One-time: create table for real ongoing prayer counter (anon insert, no auth).
-- Run in Supabase SQL Editor. RLS left OFF so anon can insert and count.

create table if not exists public.prayers (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now()
);

-- Optional: allow anon to insert (if RLS is later enabled)
-- alter table public.prayers enable row level security;
-- create policy "anon_insert_prayers" on public.prayers for insert to anon with check (true);
-- create policy "anon_count_prayers" on public.prayers for select to anon using (true);
