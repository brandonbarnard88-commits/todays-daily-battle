# Phase 4 — Kid-Linked Progress in Kids Corner

**Status:** Implemented.

---

## What Was Added

### 1. Database (`supabase-profile-kid-loop-progress.sql`)

- **Table:** `profile_kid_loop_progress` (kid_id, starred_ids, watch_counts, sunday_refresh_tag)
- **RLS:** Parent can read/write only their kids' rows (via profile_kids join)
- **Run after:** `supabase-profile-family-groups.sql`

### 2. Kids Corner UI (`kids-corner.html`)

- **Kid selector:** Dropdown "Track progress for:" with options "This device" | Kid 1 | Kid 2 | ...
- **Visibility:** Shown only when signed in and user has profile_kids
- **Supabase:** Uses CDN (`@supabase/supabase-js@2.99.2` with SRI) for auth + profile_kids

### 3. Loop Library Logic (`script.js`)

- **selectedKidId:** When set, state loads from/saves to `profile_kid_loop_progress` instead of localStorage only
- **"This device":** Uses localStorage (unchanged behavior)
- **Kid selected:** Fetches from Supabase, merges into state; on writeState, upserts to Supabase
- **initLoopKidSelector:** Runs after loadLoops; fetches profile_kids, populates dropdown, wires change handler

---

## Flow

1. User signs in → has kids in profile
2. Visits Kids Corner → dropdown appears
3. Selects "This device" → progress from localStorage
4. Selects a kid → progress loads from Supabase (or empty if new)
5. Earns stars, watches loops → writeState saves to localStorage + Supabase (when kid selected)
6. Switches device → signs in, selects same kid → sees same progress

---

## Deploy Steps

1. Run `supabase-profile-kid-loop-progress.sql` in Supabase SQL Editor
2. Build & deploy as usual
3. Test: Sign in → add kid in profile → visit Kids Corner → see dropdown → select kid → earn star → switch to "This device" → back to kid → star persists
