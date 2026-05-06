# Final Sprint to 100%

**Top pick:** Church Center Phase 3 — complete the realtime hub so pastors/groups can use it. Turns the tier tease into real product value.

---

## Church Center Phase 3 – Group Progress + Admin Verse Setter ✓

- **Scope:** "% prayed" bar or counter (query counts from Supabase), admin form to set daily verse (update verse table, realtime display).
- **Implemented:** Group Prayer Progress section (X of Y prayers prayed + progress bar), admin verse setter writes to `church_verse_of_day` (upsert), realtime subscription for verse updates, toast "Verse updated – shared with your church."
- **Supabase:** Enable Realtime for table `church_verse_of_day` in dashboard (Replication → add table) so verse updates broadcast to all clients.

---

## Wins Report Final Touches

- Add 1–2 richer stats (e.g. top topics from search history if tracked, prayer count trend).
- Optional: Auto-generate graphic URL for social sharing.

---

## Beta Prep / Launch Readiness

- Quick GA dashboard check (events firing correctly).
- One more offline test: church.html add prayer → offline → reconnect sync.
- Optional: Simple feedback form (e.g. "How's this helping?") on index.html.
