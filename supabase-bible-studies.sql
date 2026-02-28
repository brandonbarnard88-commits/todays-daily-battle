-- =============================================================================
-- Bible Studies: topic-based short studies (e.g. 5–7 days)
-- Run in Supabase SQL Editor. Enables /bible-study page to load cards from DB.
-- =============================================================================

create table if not exists public.bible_studies (
  id bigint primary key generated always as identity,
  title text not null,
  topic text,
  description text,
  days integer default 7,
  image_url text,
  created_at timestamptz default now()
);

alter table public.bible_studies enable row level security;

create policy "bible_studies_anon_select"
  on public.bible_studies for select
  using (true);

grant select on public.bible_studies to anon;
grant select on public.bible_studies to authenticated;

-- Seed 3 starter studies (run once; no-op if table already has rows)
insert into public.bible_studies (title, topic, description, days)
select 'Armor of God', 'Strength', '7 days to equip yourself—Ephesians 6.', 7
union all select 'Hope in Hard Times', 'Hope', 'Psalms & Romans—find light when it''s dark.', 5
union all select 'Forgiveness Flow', 'Forgiveness', 'Matthew 18—let go, move on.', 7
where not exists (select 1 from public.bible_studies limit 1);
