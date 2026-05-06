-- Add private flag to notes (excluded from shared links; sync with app when used)
alter table public.notes
  add column if not exists private boolean default false;
