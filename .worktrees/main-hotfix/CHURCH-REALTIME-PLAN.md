# Church Center Realtime – Phased Plan

## Schema (Supabase)

Uses existing `supabase-church-optional.sql`:

- **church_prayer_list**: `id` (uuid), `church_id` (uuid), `item` (text), `prayed` (boolean), `added_by_user_id` (uuid), `created_at` (timestamptz). RLS enabled.
- **church_verse_of_day**: `church_id`, `verse_ref`, `set_by_user_id`, `set_at`. (Phase 4.)

Realtime: Enable on `church_prayer_list` in Supabase Dashboard (Replication → tables).

---

## Phase 1 – Realtime Shared Prayer List Listener ✅

**Goal:** Live updates when anyone in the church adds/updates/deletes a shared prayer (no refresh).

**script.js**
- Add `churchPrayerRealtimeChannel` (ref for unsubscribe).
- Add `sharedPrayersFromSupabase` (in-memory list for realtime; when Supabase-backed, this drives the list).
- Add `subscribeToSharedPrayers(churchId)`:
  - If already subscribed, unsubscribe first.
  - `supabase.channel('shared-prayers-' + churchId).on('postgres_changes', { event: '*', schema: 'public', table: 'church_prayer_list', filter: 'church_id=eq.' + churchId }, updatePrayerListFromPayload).subscribe()`.
  - Fetch initial list from `supabase.from('church_prayer_list').select('*').eq('church_id', churchId).order('created_at')` and set `sharedPrayersFromSupabase`, then render.
  - Store channel ref for unsubscribe.
- Add `updatePrayerListFromPayload(payload)`: handle INSERT (push `payload.new`), UPDATE (find by id, update prayed), DELETE (remove by `payload.old.id`); then call `renderChurchPrayerListUI()`.
- Add `renderChurchPrayerListUI(items)`: render items to `#church-prayer-list` (same structure as current list: text + Prayed toggle). Items = `sharedPrayersFromSupabase` if length else show empty message. Add `aria-live="polite"` for list container for accessibility.
- Add `unsubscribeFromSharedPrayers()`: if channel exists, `supabase.removeChannel(channel)`; set ref to null.
- In church init block (where `document.getElementById('church-verse-of-day')`): if `currentChurch && currentChurch.id && currentUserId && canUseSupabase()`, call `subscribeToSharedPrayers(currentChurch.id)`; fire `trackEvent('church_prayer_viewed')` once on load.
- On `beforeunload`, call `unsubscribeFromSharedPrayers()`. On auth logout (when we're on church page or globally), call unsubscribe so no leak.

**church.html**
- Add `aria-live="polite"` to `#church-prayer-list` (or wrap) so new prayers are announced.

**styles.css**
- Optional: `.church-prayer-item { transition: opacity 0.2s ease; }` for future fade-in (Phase 5).

**Behavior**
- If Supabase table/RLS not set up: fetch fails, keep showing localStorage list; no realtime. No errors thrown.
- If table exists and user has access: initial fetch + subscription; list stays in sync across devices.

---

## Phase 2 – Add Prayer & Mark Prayed (Realtime)

- "Add" button: insert into `church_prayer_list` (church_id, item, prayed: false, added_by_user_id: currentUserId). On success: clear input, toast "Prayer added – shared live.", trackEvent('church_prayer_added'). Realtime will push INSERT to all clients.
- Each list item: "Prayed" toggle → `supabase.from('church_prayer_list').update({ prayed: true/false }).eq('id', id)`. Realtime pushes UPDATE to all.
- When using Supabase list, hide or replace localStorage write for shared prayers (or dual-write during migration).

---

## Phase 3 – Group Progress Display

- Section "Group Prayer Progress" below list.
- Query: `supabase.from('church_prayer_list').select('id', { count: 'exact', head: true }).eq('church_id', churchId)` and same with `.eq('prayed', true)` or count in JS. Show "X of Y prayed" and a thin progress bar.
- On each `updatePrayerListFromPayload`, call `refreshChurchProgress()` to re-query and update bar.
- CSS: `.church-progress-bar` (track), `.church-progress-fill` (fill #4CAF50), transition on width.

---

## Phase 4 – Admin Verse Setter (Pastors Only)

- Show verse setter form if `currentUserRole === 'pastor' || isMasterUser`.
- Submit: upsert `church_verse_of_day` (church_id, verse_ref, set_by_user_id). Realtime subscribe to `church_verse_of_day` for this church_id; on change, update displayed verse.
- Toast: "Verse updated – shared with your church.", trackEvent('church_verse_updated').

---

## Phase 5 – Polish & Offline

- Fade-in new list items (CSS opacity transition).
- Offline: show last-known list + note "Changes will sync when online."
- ARIA live region for list; keyboard focus on add/mark.
- Analytics already added in Phase 2/4.

---

## File Change Summary

| Phase | script.js | church.html | styles.css |
|-------|-----------|-------------|------------|
| 1 | subscribeToSharedPrayers, updatePrayerListFromPayload, renderChurchPrayerListUI, unsubscribe; init + beforeunload | aria-live on list | (optional) .church-prayer-item |
| 2 | Add/Mark Prayed write to Supabase; use shared list when Supabase active | - | - |
| 3 | refreshChurchProgress, progress section | Progress markup | .church-progress-bar, .church-progress-fill |
| 4 | Verse setter submit to Supabase; subscribe church_verse_of_day | - | - |
| 5 | Offline check; last-known list | Note text | Fade-in, focus |

---

Phase 1 implemented below. Phases 2–5 await approval.
