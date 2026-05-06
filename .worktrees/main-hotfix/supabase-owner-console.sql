-- =============================================================================
-- Owner console tables + hardened owner write path
-- Run after the base auth/message/prayer/daily battle tables already exist.
-- =============================================================================

create extension if not exists pgcrypto;

-- -----------------------------------------------------------------------------
-- 1) Prayer moderation queue
-- -----------------------------------------------------------------------------
create table if not exists public.prayer_reports (
  id uuid primary key default gen_random_uuid(),
  prayer_id text,
  prayer_text text not null,
  reason text not null default 'Needs review',
  details text,
  status text not null default 'open',
  created_at timestamptz not null default now(),
  reviewed_at timestamptz,
  reviewed_by uuid references auth.users(id)
);

alter table public.prayer_reports enable row level security;
alter table public.prayer_reports force row level security;

drop policy if exists "prayer_reports_insert_anon" on public.prayer_reports;
create policy "prayer_reports_insert_anon"
  on public.prayer_reports
  for insert
  to anon
  with check (
    length(trim(prayer_text)) between 1 and 600
    and length(trim(reason)) between 1 and 120
    and (details is null or length(trim(details)) <= 600)
  );

grant insert on public.prayer_reports to anon;

-- -----------------------------------------------------------------------------
-- 2) Structured owner content entries
-- -----------------------------------------------------------------------------
create table if not exists public.owner_content_entries (
  content_key text primary key,
  title text not null default '',
  summary text not null default '',
  body text not null default '',
  metadata jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  updated_by uuid references auth.users(id)
);

alter table public.owner_content_entries enable row level security;
alter table public.owner_content_entries force row level security;

-- -----------------------------------------------------------------------------
-- 3) Owner audit log
-- -----------------------------------------------------------------------------
create table if not exists public.owner_audit_log (
  id uuid primary key default gen_random_uuid(),
  actor_user_id uuid references auth.users(id),
  action text not null,
  target_type text not null default '',
  target_id text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

alter table public.owner_audit_log enable row level security;
alter table public.owner_audit_log force row level security;

-- -----------------------------------------------------------------------------
-- 4) Harden daily_battles writes so owner updates happen through server actions
-- -----------------------------------------------------------------------------
drop policy if exists "daily_battles_write_master" on public.daily_battles;
drop policy if exists "daily_battles_insert_service" on public.daily_battles;
drop policy if exists "daily_battles_update_service" on public.daily_battles;
drop policy if exists "daily_battles_delete_service" on public.daily_battles;

create policy "daily_battles_insert_service"
  on public.daily_battles
  for insert
  to service_role
  with check (true);

create policy "daily_battles_update_service"
  on public.daily_battles
  for update
  to service_role
  using (true)
  with check (true);

create policy "daily_battles_delete_service"
  on public.daily_battles
  for delete
  to service_role
  using (true);

-- -----------------------------------------------------------------------------
-- 5) Service role grants for owner console APIs
-- -----------------------------------------------------------------------------
grant select, insert, update on public.prayer_reports to service_role;
grant select, insert, update on public.owner_content_entries to service_role;
grant select, insert on public.owner_audit_log to service_role;
grant select, insert, update, delete on public.daily_battles to service_role;

create index if not exists prayer_reports_created_at_idx on public.prayer_reports(created_at desc);
create index if not exists prayer_reports_status_idx on public.prayer_reports(status);
create index if not exists owner_content_entries_updated_at_idx on public.owner_content_entries(updated_at desc);
create index if not exists owner_audit_log_created_at_idx on public.owner_audit_log(created_at desc);
