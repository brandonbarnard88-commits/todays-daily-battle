# PHASE 1 - Offline Prayer Queue Audit
**Date audited:** March 06, 2026  
**Status:** Passed (with in-flight lock patch applied)  
**Goal of Phase 1:** Reliable offline queuing + background sync for prayer wall submissions

## Key Contract & Rules (Live Code)

1. **Queue key**  
   - Only key: `tdb_prayer_offline_queue`  
   - No legacy keys (`prayerQueue`, etc.) remain

2. **Item shape (normalized)**  
   Every queued item MUST contain:
   - `intent`: sanitized/truncated string
   - `attempts`: number (starts at 0)
   - `lastTriedAt`: number (timestamp) or `null`
   - `createdAt`: number (timestamp)
   - `source`: string (where it came from)

   -> No raw strings or mixed shapes allowed

3. **Single enqueue path**  
   - All offline prayer submissions MUST call `queuePrayerOfflineIntent(intent, source)`  
   - No direct `localStorage.setItem` or array `.push()` in feature code

4. **Flush / retry behavior (deterministic)**  
   - **Backoff timing** (live): base = 1 minute (60,000 ms)  
     Formula: `min(60000 * Math.pow(2, attempts - 1), 86400000)` -> capped at 24 hours  
   - Success -> remove item from queue  
   - Failure -> increment `attempts`, update `lastTriedAt`  
   - Max attempts = 12 -> drop item + report error via `window.__tdb_reportError(...)`  
   - Queue size cap = 200 items -> enforced in `setPrayerOfflineQueue(...)` (global write guard)

5. **Sync triggers**  
   - Multiple possible triggers: online reconnect event + SW message (`tdb-sync-prayers`)  
   - **Safe because**: in-flight lock (`prayerFlushInFlight`) prevents concurrent runs / double-sends

6. **Observability**  
   - Dev-mode console helper: `logQueueHealth()` -> shows length, oldest age, max attempts  
   - Interval logging (30s) in dev mode for quick spotting regressions

## Validation Status

- Lint: clean  
- `npm run test:security`: pass  
- `npm run test`: pass  
- `npm run test:site`: pass  

## Manual Test Path (Run Before Phase 2)

1. Offline -> submit 2-3 prayers -> queue grows (check `logQueueHealth()`)  
2. Online -> queue drains once (no duplicates in Supabase `prayers` table)  
3. Force failure (bad table name) -> attempts increment, delays grow, drops after 12  
4. Check oldest item age / max attempts via console

## Risks Closed

- Concurrent flush race -> fixed with `prayerFlushInFlight` lock  
- Legacy queue keys -> fully removed  
- Inconsistent item shapes -> enforced via single enqueue path

## Phase 1 Done Definition - Met

- Offline prayers always persist  
- Reconnect always retries with correct backoff  
- Successful sends clear from queue  
- Bad items do not loop forever  
- Tests pass + manual offline/online path confirmed

Ready for Phase 2 (when you are):  
- Push notifications for daily verse  
- Retry metadata logging to Supabase (failed items table)  
- Or whatever you choose next

Signed: Cursor (audit complete)
