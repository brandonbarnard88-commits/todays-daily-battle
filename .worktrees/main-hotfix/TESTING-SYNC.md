# Sync testing checklist

Use this to confirm cross-device sync works end-to-end.

## Test sequence (two devices or two browsers)

**Device A (e.g. phone Chrome):**
1. Sign in.
2. Complete today’s verse so the streak increments (e.g. Day 1).
3. Add a Prayer List item (e.g. “Peace for family”).
4. Optionally add a Prayer Wall intention.
5. Wait 10–30 seconds (for sync to persist).

**Device B (e.g. laptop Firefox or incognito):**
1. Sign in with the **same account**.
2. Refresh or load the site.

**Verify on Device B:**
- [ ] Streak shows (e.g. Day 1).
- [ ] Prayer List item is present.
- [ ] Prayer Wall submission visible (if applicable).
- [ ] Prayer Wall note: “Synced across devices.”
- [ ] Prayer List intro: “Synced across devices.”
- [ ] Sign-in note: “Synced. Your streak, prayer list, and plans are saved across devices.”

## Edge cases

- [ ] **Offline add on Device A** → go back online → open Device B and confirm new data appears after sync.
- [ ] **Logout** on one device → UI reverts to “Saved on this device.”
- [ ] **Master user** → sees dashboard on load; **normal user** → sees search/daily verse on load.

## Analytics

- [ ] In GA4 real-time (or Events), see `sync_completed` after load when logged in.

If all of the above pass, sync is production-ready.
