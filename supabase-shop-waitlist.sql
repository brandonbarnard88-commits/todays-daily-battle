-- =============================================================================
-- Shop waitlist — email + optional product interest. Anon INSERT only.
-- Run in Supabase SQL. Used by shop.html (shop-waitlist.js).
-- =============================================================================

create table if not exists public.shop_waitlist (
  id uuid not null default gen_random_uuid(),
  email text not null,
  product_hint text,
  created_at timestamptz not null default now(),
  primary key (id)
);

alter table public.shop_waitlist enable row level security;

drop policy if exists "shop_waitlist_insert_anon" on public.shop_waitlist;
create policy "shop_waitlist_insert_anon"
  on public.shop_waitlist
  for insert
  to anon
  with check (
    length(trim(email)) >= 3
    and length(trim(email)) <= 320
    and (product_hint is null or length(trim(product_hint)) <= 120)
  );

grant insert on public.shop_waitlist to anon;

create index if not exists shop_waitlist_created_at_idx on public.shop_waitlist(created_at desc);

comment on table public.shop_waitlist is 'Shop launch interest signups. Anon INSERT only.';
