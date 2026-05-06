-- =============================================================================
-- Contact form messages — anon INSERT only (no anon SELECT). Run in Supabase SQL.
-- Used by contact.html via contact-form.js → public.contact_messages
-- =============================================================================

create table if not exists public.contact_messages (
  id uuid not null default gen_random_uuid(),
  email text not null,
  name text,
  body text not null,
  created_at timestamptz not null default now(),
  primary key (id)
);

alter table public.contact_messages enable row level security;

drop policy if exists "contact_messages_insert_anon" on public.contact_messages;
create policy "contact_messages_insert_anon"
  on public.contact_messages
  for insert
  to anon
  with check (
    length(trim(email)) >= 3
    and length(trim(email)) <= 320
    and length(trim(body)) >= 1
    and length(trim(body)) <= 8000
    and (name is null or length(trim(name)) <= 200)
  );

grant insert on public.contact_messages to anon;

create index if not exists contact_messages_created_at_idx on public.contact_messages(created_at desc);

comment on table public.contact_messages is 'Contact form submissions. Anon INSERT only; review via service_role or Dashboard.';
