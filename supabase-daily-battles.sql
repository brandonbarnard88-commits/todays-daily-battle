-- Daily battles table + RLS
create table if not exists public.daily_battles (
  date date primary key,
  verse_ref text not null,
  reflection text,
  prayer text,
  created_at timestamptz default now()
);

alter table public.daily_battles enable row level security;

create policy "daily_battles_read_public"
on public.daily_battles for select
using (true);

create policy "daily_battles_write_master"
on public.daily_battles for insert
to authenticated
with check (
  exists (
    select 1 from auth.users
    where auth.users.id = auth.uid()
      and lower(auth.users.email) = 'brandonbarnard88@yahoo.com'
  )
);
