# Usability tweaks — verification checklist

## 1. "Prayed" checkbox next to verse (~15 min) ✅

- **Done when:** Checkbox appears next to daily verse; tap → toast "Battle won!" and verse hides for the day.
- **How to verify:**
  1. Open homepage, wait for daily verse to load.
  2. Confirm "Prayed" checkbox appears below the verse card.
  3. Check the box → green toast "Battle won! See you tomorrow." and verse area shows "Battle won! See you tomorrow." banner.
  4. Refresh: verse stays hidden until next calendar day (localStorage `tdb_done_for_today` = today’s date key).
- **If stuck:** DevTools → Application → Local Storage; look for `tdb_done_for_today` and `dailyBattleStreak`. Ensure `daily-verse-prayed-cb` change listener is bound (see `wireQuickPrayAndMarkAsPrayed` in script.js).

---

## 2. Help modal on ? key (~5 min) ✅

- **Done when:** Press **?** (with focus not in an input) → shortcuts modal opens.
- **How to verify:**
  1. Focus anywhere except an input/textarea (e.g. click the page background).
  2. Press **?** → modal titled "Shortcuts" with list (? — Show this help, Enter — Submit prayer, Esc — Close).
  3. Press **Esc** or click Close → modal closes.
- **If stuck:** Ensure `wireHelpModal()` is called on DOMContentLoaded and that the listener checks `e.key === '?'` and ignores when `activeElement` is input/textarea.

---

## 3. Verify countdown (~2 min) ✅

- **Done when:** Top promo banner shows "Ends in X days!" (e.g. "Ends in 7 days!" or "Ends in 6 days!" after midnight); number updates (interval every 60s, or on next load).
- **How to verify:**
  1. Hard refresh: **Ctrl+F5** (Windows) or **Cmd+Shift+R** (Mac).
  2. Check top banner: `#promo-banner-days` should show "Ends in N days!" where N = days until `2026-03-07`.
  3. Tomorrow (or after midnight), reload → N should decrease by 1 (e.g. 6 days).
- **If stuck:** In script.js search for `endDate = new Date('2026-03-07'` and confirm the date; confirm `setInterval(updateCountdown, 60000)` runs. Clear cache / hard refresh so latest script loads.

---

**Quick commands**

- **Prayed:** `localStorage.getItem('tdb_done_for_today')` should equal today’s date string (e.g. `2026-02-28`) after marking prayed.
- **Help modal:** `document.getElementById('help-modal')` should have class `hidden` when closed and no `hidden` when open.
- **Countdown:** `document.getElementById('promo-banner-days').textContent` should be "Ends in 7 days!" (or current days left).
