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

-- Seed starter studies (run once; no-op if table already has rows)
insert into public.bible_studies (title, topic, description, days)
select 'Armor of God', 'Spiritual warfare', 'A 7-day look at Ephesians 6:10–18. Belt of truth, breastplate of righteousness, shield of faith—one piece per day.', 7
union all select 'Peace in the Storm', 'Anxiety & peace', 'Short daily verses and reflections on finding calm when life is chaotic. 5 days.', 5
union all select 'Fruit of the Spirit', 'Character & growth', 'Galatians 5:22–23—love, joy, peace, longsuffering, gentleness, goodness, faith, meekness, temperance. One fruit per day.', 9
union all select 'Forgiveness Flow', 'Forgiveness', 'Matthew 18, Psalm 51, and more. Let go, move on, and receive God''s mercy. 7 days.', 7
union all select 'Psalms of Comfort', 'Comfort & refuge', 'Psalm 23, 27, 46, 91, and more. When you need a refuge, these verses meet you there. 7 days.', 7
union all select 'Faith Over Fear', 'Courage', '2 Timothy 1:7, Isaiah 41:10, Joshua 1:9—replace fear with faith. 5 days.', 5
union all select 'Hope in Hard Times', 'Hope', 'Psalms and Romans—find light when it''s dark. God of hope fills you with joy and peace. 5 days.', 5
union all select 'Love One Another', 'Love', 'John 13:34, 1 John 4—how to love as Christ loved. 5 days.', 5
union all select 'The Beatitudes', 'Blessed life', 'Matthew 5:3–11—Jesus'' portrait of the blessed. Poor in spirit, meek, merciful, peacemakers. 9 days.', 9
where not exists (select 1 from public.bible_studies limit 1);
