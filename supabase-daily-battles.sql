-- Daily battles table + RLS
create table if not exists public.daily_battles (
  date date primary key,
  verse_ref text not null,
  reflection text,
  prayer text,
  created_at timestamptz default now()
);

alter table public.daily_battles enable row level security;

drop policy if exists "daily_battles_read_public" on public.daily_battles;
create policy "daily_battles_read_public"
on public.daily_battles for select
using (true);

drop policy if exists "daily_battles_write_master" on public.daily_battles;
drop policy if exists "daily_battles_insert_service" on public.daily_battles;
drop policy if exists "daily_battles_update_service" on public.daily_battles;
drop policy if exists "daily_battles_delete_service" on public.daily_battles;

create policy "daily_battles_insert_service"
on public.daily_battles for insert
to service_role
with check (true);

create policy "daily_battles_update_service"
on public.daily_battles for update
to service_role
using (true)
with check (true);

create policy "daily_battles_delete_service"
on public.daily_battles for delete
to service_role
using (true);

grant select on public.daily_battles to anon, authenticated;
grant select, insert, update, delete on public.daily_battles to service_role;
