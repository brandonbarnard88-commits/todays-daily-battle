# Next steps — March 2026 (Battle Pro + polish)

Concrete breakdown for: **Battle Pro MVP**, **bugs/polish**, **scope to park**, and **content pipeline**. Use this to ship Pro and feel "done" without dragging.

---

## 1. Battle Pro — exact MVP for March

**Goal:** Real checkout, clear value (offline + Wins Report), no scope creep.

### In scope for March (ship these)

| Item | Status | Action |
|------|--------|--------|
| **Stripe Payment Links** | Config keys empty | Create in Stripe: Supporter $5/mo & $50/yr, Battle Pro $10/mo & $100/yr, Church $10/mo (beta) & $100/yr. Paste URLs into `config.js`: `STRIPE_SUPPORTER_MONTHLY_LINK`, `STRIPE_SUPPORTER_YEARLY_LINK`, `STRIPE_BATTLEPRO_MONTHLY_LINK`, `STRIPE_BATTLEPRO_YEARLY_LINK`, `STRIPE_CHURCH_MONTHLY_LINK`, `STRIPE_CHURCH_YEARLY_LINK`. |
| **Checkout flow** | Wired in script.js | Verify: pricing.html + upgrade modal buttons open Stripe Checkout and return URL works. Test with 4242… |
| **Pro detection** | `isProUser()` in script.js | Today: true for master email or Stripe customer (if you wire it). Option A: set `app_metadata.role = 'pro'` in Supabase after payment. Option B: Stripe webhook → Supabase `subscriptions` or `profiles.tier` → frontend reads once per session. |
| **Offline download (Pro)** | UI exists, gated by `isProUser()` | Keep as-is: "Download for offline (Pro)" shows only when Pro. Ensure 7-day prefetch works when online and serves from cache when offline. |
| **Wins Report** | Page exists; shows "Loading your wins" or locked message | Pro users see stats + shareable graphic. Free sees "Unlock with Battle Pro." No change needed unless you want richer stats. |
| **Banner copy** | "Battle Pro — Wins Report, offline PDFs…" | When all Stripe URLs set, optionally switch to "Battle Pro now available" (see script.js / ACTIVATION §3.1). |

### Out of scope for March (park until after Pro)

- **Premium devotionals (7-day series)** — Keep "Unlock with Battle Pro" on the lock card; build the actual series later.
- **Offline PDF export** — Tease only; implement after Pro launch.
- **Shop (Battle Mug, etc.)** — Leave "Coming soon" on shop.html; no BATTLE_MUG_URL required for Pro launch.
- **Realtime / presence** — QA report noted "realtime not yet live"; park.

### Tasks list (copy to your tracker)

1. [ ] Create Stripe products/prices: Supporter (5/50), Battle Pro (10/100), Church (10/100 beta).
2. [ ] Create Payment Links for each; add all 6 URLs to `config.js` (or env on Cloudflare).
3. [ ] Decide Pro detection: Supabase `app_metadata` vs Stripe webhook → table.
4. [ ] Implement one: webhook that sets user as Pro in Supabase, or manual "mark as Pro" in Dashboard for first subscribers.
5. [ ] Test: checkout → return to site → sign in → `isProUser()` true → offline wrap + Wins Report visible.
6. [ ] Update homepage banner to "Battle Pro now available" when Stripe URLs present (optional; see ACTIVATION).
7. [ ] Announce: email waitlist + one social post (copy in ACTIVATION § "When Battle Pro goes live").

---

## 2. Bugs / polish

**Goal:** Fix niggles so the live site feels solid; no new features.

| Area | Issue | Fix |
|------|--------|-----|
| **Prayer counter** | Was not counting / 404 | Done: RPC `get_total_prayer_count()` + always-wire counter + 60s retry. Ensure `supabase-prayers.sql` (with `get_total_prayer_count`) is run. |
| **Map** | Background image 404 | Done: gradient + gold border only; no image URL. |
| **KJV audio** | 404 if link wrong | Verify verse link opens Bible Gateway (e.g. Philippians 4:7). Fix in script if URL pattern is wrong. |
| **Echo / presence** | "—" or not updating | Same prayers API; if counter works, echo should. If not, check `get_prayer_presence_count` RPC and Supabase logs. |
| **Light mode** | Button hover | Done: gold shadow on buttons (per earlier polish). |
| **Mobile footer** | Links layout | Done: stack vertical <480px (per earlier polish). |
| **Walkthrough** | "Video coming soon" | Optional: record 60s Loom/YouTube; set `WALKTHROUGH_VIDEO_URL` in config (ACTIVATION §4.1). |

**Quick verification list (incognito, hard refresh)**

- [ ] Total prayers: number or "—" (no stuck "Loading…").
- [ ] Map: gradient + gold border, no 404.
- [ ] KJV audio: opens Bible Gateway.
- [ ] Echo: real numbers or "You're alone with Him" when empty.
- [ ] Armor modal, Kids Corner, Patriotic Scriptures: load and work.
- [ ] Light mode: buttons have gold hover.
- [ ] Mobile: footer links stack vertically.

---

## 3. Scope to park (until after Pro)

**Goal:** Less drag; ship Pro first, then iterate.

| Park | Notes |
|------|--------|
| **Shop (mug, journal, etc.)** | Keep "Coming soon"; add BATTLE_MUG_URL and "Buy now" when ready. |
| **60-second walkthrough video** | Nice-to-have; set `WALKTHROUGH_VIDEO_URL` when you have it. |
| **Premium devotionals (7-day series)** | Tease only; build content + UI after Pro revenue. |
| **Church/Team sync** | Church Center prayer list etc. can stay local-only until post-Pro. |
| **Realtime presence** | Optional polish; not required for Pro. |
| **Fancy animations** | Any non-critical motion can wait. |
| **Extra reading plans** | You have Victory Over Fear, Lent, etc.; no need to add more before Pro. |

**Rule:** If it doesn’t block Stripe checkout or Pro visibility, it can ship after "Battle Pro is live."

---

## 4. Content pipeline — daily verses/reflections

**Goal:** Lock in how today’s battle gets its verse/reflection/prayer so it’s maintainable.

### Current flow

1. **Table:** `public.daily_battles` (date PK, verse_ref, reflection, prayer). RLS: public read; insert restricted (e.g. master email in `daily_battles_write_master`).
2. **Frontend:** `fetchDailyBattleRaw(dateKey)` → `GET /rest/v1/daily_battles?date=eq.YYYY-MM-DD`. Sets `currentDailyBattle` (ref, verse from bible[ref], reflection, prayer). Fallback: `getDailyVerseRefForKey(key)` + generic reflection/prayer if no row.
3. **Seeding:** Supabase Edge Function `seed-daily-battle`: if today missing, insert one row with default (Psalm 46:1 + default reflection/prayer). Call via **cron once per day** (e.g. `0 0 * * *` UTC) or manually.

### What to lock in

| Task | Action |
|------|--------|
| **Cron** | Ensure `seed-daily-battle` is invoked daily (Supabase cron or external scheduler). Otherwise today’s row may be missing and the site falls back to client-side verse only. |
| **Curated content** | Default in the edge function is one verse. To have unique content per day: either (a) maintain a spreadsheet → export to SQL or JSON and run a script to insert into `daily_battles`, or (b) add an admin UI (master-only) to set verse_ref, reflection, prayer for a given date. |
| **Verse text** | Verse text comes from `bible[ref]` in script.js (KJV). Reflection and prayer come from `daily_battles`. So you only need to maintain date → verse_ref, reflection, prayer. |
| **Send-reminders** | `send-reminders` edge function reads `daily_battles` for today for email body. Same source of truth. |

### Minimal "maintainable" setup

1. **Daily cron** runs `seed-daily-battle` so today always has a row (even if default).
2. **Optional:** Weekly or monthly batch-update `daily_battles` from a sheet (verse_ref, reflection, prayer per date). No need for a full CMS for March.
3. **Optional:** One master-only page or SQL script to set tomorrow’s verse/reflection/prayer so you can curate key dates.

---

## Summary

- **Battle Pro March:** Stripe links in config → Pro detection (webhook or metadata) → test checkout → announce. Park premium series, shop, extra plans.
- **Bugs/polish:** Prayer counter + map fixed; run through verification list above.
- **Park:** Shop, walkthrough video, extra devotionals, realtime, non-critical animation.
- **Content:** Cron `seed-daily-battle` daily; optionally batch or manual updates to `daily_battles` for curated days.

Once Stripe is live and Pro detection works, you can call v1 launched and shift to growth and content.
