# Make It Addictive (in a good way) — Product vision

Vision doc for retention, personalization, community, and Battle Pro. Use with **ACTIVATION.md** and **ROADMAP-STARS.md**.

---

## 1. Streak + viral loop ✅ (shipped)

- **Duolingo-style streak** on homepage: "Day 7 — keep it going! 🔥" with flame; milestone copy for 3/7/14/30/60 days.
- **Share my streak**: "Just hit 30 days with Today's Daily Battle—join me?" → native share or Twitter intent. Instant viral loop.

---

## 2. Personalize: Focus mode ✅ (shipped)

- **Focus mode** selector at top of search: **Morning Energy** (short, upbeat), **Evening Wind-Down** (reflective), **Warrior Mode** (battle verses only). Stored in `localStorage` (`tdb_focus_mode`).
- **Next step**: Serve custom verse + prayer based on mode (e.g. morning = shorter ref + upbeat prayer; warrior = battle-themed only). Requires content tagging or separate daily_battles columns per mode.

---

## 3. Prayer Wall (community without chaos)

- **Anonymous, one-line requests**: "Job interview tomorrow", "Healing for mom." No comments, no drama.
- **Heart click** to "pray" (count only). Top prayers highlighted daily.
- **Builds quiet loyalty**; optional push: "Someone prayed for you—check the wall."
- **Implementation**: Supabase table `prayer_wall` (id, body text, hearts count, created_at). RLS: anyone can read; insert anonymous; increment hearts via edge function or RPC to avoid double-count. Front-end: list + "Add request" + heart button per row. Optional: "Today’s top" section.

---

## 4. Audio upgrade

- **Recorded verse + reflection** — 30 seconds max (you or a calm voice). People listen while brushing teeth.
- **Background toggle**: lo-fi beats or ambient rain. "I'm not just reading, I'm experiencing."
- **Implementation**: Host 30s clips (e.g. S3/R2 + CDN) keyed by date or verse_ref; optional background tracks; simple audio player with play/pause and background selector.

---

## 5. Gamify: Badges

- **Unlock badges**: "First Week Warrior", "Hope Hero", "Obedience Overcomer." Tie to topics. "Beat Romans 6 streak? Get the 'Freedom Fighter' badge."
- **Collect and show in profile** (and optionally on share card).
- **Implementation**: Badge definitions in config; progress in Supabase (e.g. `user_badges`, streak per topic/plan); profile section + share image with badges.

---

## 6. Mobile-first polish

- **Push notifications**: "Your verse is ready—5 minutes left before the day starts." Or "Someone prayed for you—check the wall." (Requires PWA push + backend or one-time scheduled trigger.)
- **Offline mode**: Cache the day’s content (verse, reflection, prayer) so it works on flights or bad Wi‑Fi. (Service worker + Cache API; store today’s battle in cache on first load.)

---

## 7. Endgame: Battle Pro ($10/mo)

Make it worth paying for:

- **Custom verse playlists** (e.g. "Anxiety Killers").
- **Daily journal prompts** tied to the verse.
- **Private prayer sync** across devices.
- **No ads, ever.**

Implementation: Stripe Subscription or Payment Links; gate playlists/journal/synced prayer behind `subscription_tier === 'supporter'` (or Battle Pro product). See **pricing.html** and **CONFIG.md** for Stripe URLs.

---

## Next-level checklist (stack little wins)

| Item | Status | Notes |
|------|--------|--------|
| Streak notifications | Planned | Push at 8 AM: "Day 12—your verse is waiting." PWA push + cron. |
| Voice-over verse | Planned | One a week, 20s: verse + one-line takeaway. Record or AI. |
| Shareable cards | Done | "Save card for Instagram" one-tap; logo + branding. |
| Testimonials carousel | Done | Homepage; chemo, first time prayed daily, etc. Rotate 5s. |
| SEO (date in title) | Done | "Daily Bible Verse + Prayer – [date]" on homepage. |
| Beta testers | Done | Five get Supporter free; Apply opens mailto. |

---

## Quick reference

| Feature           | Status   | Notes |
|-------------------|----------|--------|
| Streak counter + share | Done     | Homepage streak block + "Share my streak" |
| Focus mode       | Done     | UI + localStorage; personalization logic next |
| Prayer Wall      | Planned  | Supabase table + RLS + heart count |
| Audio (30s + BG) | Planned  | Hosted clips + player |
| Badges           | Planned  | Definitions + user_badges + profile |
| Push             | Planned  | PWA push + backend |
| Offline cache    | Planned  | SW + today’s content |
| Battle Pro       | Config   | Stripe + feature gates |
