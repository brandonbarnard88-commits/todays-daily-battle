-- =============================================================================
-- Seed one prayer for TODAY so "prayers today" count shows 1+
-- Run in Supabase SQL Editor. Safe to run daily (inserts one new row).
-- Requires: prayers table + get_prayers_today_count RPC.
-- =============================================================================

INSERT INTO public.prayers (intent, created_at)
VALUES ('Lord, keep me in truth today.', now());

-- After this, get_prayers_today_count() returns at least 1.
-- Homepage shows "1 prayed today—you're not alone." instead of the zero nudge.
