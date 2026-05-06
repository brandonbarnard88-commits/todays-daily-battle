-- =============================================================================
-- Feeling suggestions — anonymous crowdsourced phrases for search expansion
-- Run in Supabase SQL Editor. Anon can INSERT only; no anon SELECT.
-- Used by "Suggest a feeling" form on contact.html.
-- =============================================================================

create table if not exists public.feeling_suggestions (
  id uuid not null default gen_random_uuid(),
  phrase text not null,
  created_at timestamptz not null default now(),
  primary key (id)
);

alter table public.feeling_suggestions enable row level security;

-- Anon can insert (no auth required). Phrase is user-provided; sanitize on display.
drop policy if exists "feeling_suggestions_insert_anon" on public.feeling_suggestions;
create policy "feeling_suggestions_insert_anon"
  on public.feeling_suggestions
  for insert
  to anon
  with check (length(trim(phrase)) >= 2 and length(trim(phrase)) <= 200);

-- No anon SELECT — only service_role or authenticated admin can read for review
grant insert on public.feeling_suggestions to anon;

create index if not exists feeling_suggestions_created_at_idx on public.feeling_suggestions(created_at desc);

comment on table public.feeling_suggestions is 'Anonymous feeling/phrase suggestions for search expansion. Anon INSERT only.';
