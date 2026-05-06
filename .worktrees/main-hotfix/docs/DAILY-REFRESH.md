# Daily Verse & Prayer Refresh

How today's verse and prayer are determined and updated.

## Data Flow

### 1. Daily verse (hero / Today's Battle)

| Source | When | Fallback |
|--------|------|----------|
| **Supabase `daily_battles`** | Fetched on load by date (`getDailyKey()` = YYYY-MM-DD) | Bundled refs (`getDailyVerseRefForKey`) |
| **Table** | `date`, `verse_ref`, `reflection`, `prayer` | — |
| **Fallback** | If fetch fails or times out (>3s): deterministic ref from `DAILY_VERSE_SAFE_REFS` + day seed | Philippians 4:6 |

### 2. Prayer of the day

- Same verse as daily battle.
- "Prayed by X warriors today" uses `get_prayers_today_count` RPC (if enabled).

### 3. Refresh logic

- **Date-based**: `getDailyKey()` returns `YYYY-MM-DD` (user's local date).
- **No cron**: Static site; verse is fetched client-side at runtime.
- **Supabase**: `daily_battles` table must be populated per date.

## Populating `daily_battles`

Options:

1. **Manual**: Insert rows in Supabase SQL Editor for each date.
2. **Cron / Edge Function**: Supabase cron or external scheduler (e.g. Vercel Cron) runs daily to insert/update.
3. **Seed script**: Run a script that inserts N days ahead.

## Verification

- Visit site at midnight (local): verse should change after date change.
- Check Network tab: `daily_battles?date=eq.2026-03-01` returns 200 with verse_ref, reflection, prayer.
- If 404: fallback uses bundled verse (deterministic by date).

## Files

- `script.js`: `fetchDailyBattleRaw`, `getDailyBattleFromSupabaseForKey`, `getDailyBattleFallback`
- `SUPABASE-SYNC-TABLES.md`: `daily_battles` schema
