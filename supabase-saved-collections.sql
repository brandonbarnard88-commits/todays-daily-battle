-- Saved verse collections
create table if not exists public.saved_collections (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  name text not null,
  created_at timestamptz default now()
);

create table if not exists public.saved_verse_collections (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  collection_id uuid not null references public.saved_collections(id) on delete cascade,
  ref text not null,
  text text not null,
  created_at timestamptz default now()
);

create index if not exists saved_collections_user_id_idx on public.saved_collections(user_id);
create index if not exists saved_verse_collections_user_id_idx on public.saved_verse_collections(user_id);
create index if not exists saved_verse_collections_collection_id_idx on public.saved_verse_collections(collection_id);

alter table public.saved_collections enable row level security;
alter table public.saved_verse_collections enable row level security;

create policy "saved_collections_owner_read" on public.saved_collections
  for select to authenticated
  using (user_id = auth.uid());

create policy "saved_collections_owner_write" on public.saved_collections
  for all to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

create policy "saved_verse_collections_owner_read" on public.saved_verse_collections
  for select to authenticated
  using (user_id = auth.uid());

create policy "saved_verse_collections_owner_write" on public.saved_verse_collections
  for all to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());
