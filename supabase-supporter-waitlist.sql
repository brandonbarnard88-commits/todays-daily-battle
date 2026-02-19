create table if not exists public.supporter_waitlist (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  created_at timestamptz not null default now()
);

create unique index if not exists supporter_waitlist_email_idx
  on public.supporter_waitlist (email);

alter table public.supporter_waitlist enable row level security;

create policy "supporter_waitlist_insert" on public.supporter_waitlist
  for insert with check (true);
