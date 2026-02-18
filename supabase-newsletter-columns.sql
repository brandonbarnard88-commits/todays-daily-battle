-- Add reminder preferences to newsletter_signups
alter table public.newsletter_signups
  add column if not exists daily_opt_in boolean default false,
  add column if not exists weekly_opt_in boolean default true;
