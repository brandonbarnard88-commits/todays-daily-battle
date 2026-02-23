# Elite prompts for building pending features

Use these in Cursor Composer (or Agent). **This project uses Supabase (auth + `user_sync_data`), not Firebase.** See `SUPABASE-SYNC-TABLES.md` and existing `script.js` Supabase usage.

**Tip:** Paste one prompt, run it, review the plan and Phase 1 diff, then say "Implement phase 2" to continue. Use `@script.js` `@index.html` in the prompt for focus.

---

## 1. Cross-Device Sync (start here – foundational)

**Paste this first.** Sync is already partially designed: `user_sync_data` table and sync keys (streak, prayer_list, badges, streak_repair, challenge30). Auth exists via Supabase; wire read/write and merge so logged-in users see data across devices.

```
You are an expert in vanilla JS PWAs and Supabase (Auth + Postgres/Realtime).

Context: todaysdailybattle.com uses Supabase Auth and has a sync design in SUPABASE-SYNC-TABLES.md (table user_sync_data with keys: streak, prayer_list, badges, streak_repair, challenge30). Data is currently in localStorage (script.js: streak in STATS_KEY, prayer list in PRAYER_LIST_KEY, etc.). GA4 uses trackEvent() (e.g. streak_started, prayer_list_add). UI has "Saved on this device" and "syncs when you're signed in" teasers.

Goal: Implement cross-device sync for logged-in users so streaks, prayer list, badges, and streak repair sync via Supabase and work offline-queue friendly.

Phased plan:
1. In script.js, add functions to read/write user_sync_data (getSyncData/setSyncData) using existing supabaseClient. On login, load sync data from Supabase and merge into localStorage (last updated_at wins). On relevant user actions (streak update, prayer list change, etc.), upsert to user_sync_data. Ensure RLS from SUPABASE-SYNC-TABLES.md is in place.
2. On app load, if user is logged in, pull sync data once and apply to local state; update UI (e.g. renderPrayerList, updateDailyBattleStreak). Replace or hide "Saved on this device" when signed in; show "Synced" or similar.
3. Optional: use Supabase Realtime on user_sync_data so other tabs/devices update without refresh. Otherwise poll or re-pull on focus.
4. Offline: keep writing to localStorage; queue sync (e.g. flag "dirty" keys) and flush when online. Handle conflicts by last-modified or server-wins.
5. Analytics: trackEvent('sync_completed') after successful load; trackEvent('sync_failed', { error }) on error.
6. Keep UI minimal: no new modal for sync; use existing auth and section notes. Add a small "Synced" indicator only when logged in.

Constraints: Vanilla JS only. No new frameworks. Use existing supabaseClient and config (SUPABASE_URL, SUPABASE_ANON_KEY). Secure with RLS (table already has policies in doc). Prefer minimal file changes; integrate in script.js.

Output: Step-by-step plan with file list, then implement phase 1 (getSyncData/setSyncData + wire streak and prayer_list), show diff, wait for approval before phase 2.
```

---

## 2. Offline mode (Battle Pro)

Use **after** sync is in place. Service worker + cache for shell and key assets; cache daily verse and next 7 days in IndexedDB or localStorage. Show "Offline – using cached content" when `navigator.onLine === false`. Gate "Download for offline" (e.g. 7-day buffer) behind Pro/tier flag. `trackEvent('offline_view')` when serving from cache. Vanilla JS; see existing service-worker registration in script.js if present.

---

## 3. Church Center hub (Church/Team tier)

New page or section (e.g. church.html enhancement or church-hub.html) for Church/Team users. Admins set group verse/announcement; shared prayer list; optional group reading plan. Use Supabase (new tables or existing) for group data; realtime if available. UI: simple dashboard, tabs or sections (Verse / Plans / Prayer), mobile-friendly. `trackEvent('church_verse_set')`, `trackEvent('group_prayer_add')`. Gate by tier. Assume auth/sync exists.

---

## 4. Sermon / Lesson builders (Supporter+)

Enhance sermon.html and study.html: template selector, simple editor (contenteditable or textarea), insert verse/topic from site search, save drafts (Supabase or sync when built), export PDF/share. Clean UI: sidebar for inserts, preview. `trackEvent('sermon_exported')`. Vanilla JS; Pro-gate exports/saves.

---

## 5. 2026 Wins Report (Battle Pro)

Aggregate from sync data (streaks, prayers, topics). Report page or modal: infographic (e.g. top topics, streak calendar). "Share Report" → image or PDF. `trackEvent('wins_report_generated')`. Pro-only. Prefer vanilla JS + lightweight SVG or small chart lib if needed.

---

## Order of operations

1. **Sync** (prompt 1) – fixes device-only pain, enables Pro.
2. **Offline** (prompt 2) – Battle Pro value.
3. **Church Center** (prompt 3) – Church tier value.
4. **Builders / Wins Report** (4, 5) – as needed.

Reference `.cursorrules` so Cursor keeps vanilla JS, Supabase, and minimalist UI in mind.
