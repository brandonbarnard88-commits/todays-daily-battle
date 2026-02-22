-- Add reminder preferences and preferred time to newsletter_signups
alter table public.newsletter_signups
  add column if not exists daily_opt_in boolean default false,
  add column if not exists weekly_opt_in boolean default true,
  add column if not exists preferred_time text;

-- Preferred send time (e.g. "morning", "evening", or HH:MM). Used when you send Daily Battle / newsletter.
alter table public.newsletter_signups
  add column if not exists preferred_time text;
