# Growth wins — sticky, shareable, launch-ready

Targeted low-effort upgrades (pick 2–3, test in MANUAL-TESTING-CHECKLIST, deploy). Feedback source: Feb 27, 2026.

---

## 1. Daily email reminders live

**Current:** "Get tomorrow's verse emailed?" form is wired (Supabase insert) but gated ("when daily emails are live").

**Quick wins:**
- Run **supabase-newsletter-anon-insert.sql** (anon policy) if not done → test signup from incognito.
- Add "Confirm" toast after signup + **Unsubscribe anytime** link in footer. *(Unsubscribe link added in footer.)*

**Why:** Daily push = habit lock-in. One email could double streaks.

---

## 2. Make prayer wall feel alive

**Current:** "Total prayers: N" can feel static.

**Done:** "Join N warriors right now" line added next to prayer counter (script.js + prayer-count-promo).

**Optional next:**
- "Last prayer: X min ago" (needs Supabase realtime or last-prayer timestamp).
- "Top emotion today: Grateful" badge (if you track emotion on pray).
- Seed 5–10 prayers manually so the map/counter looks lived-in.

**Done:** "Last prayer: X min ago" badge — run **supabase-get-last-prayer-at.sql** in Supabase SQL Editor (creates `get_last_prayer_created_at()` RPC). The homepage shows "Last prayer: X min ago" and updates with the counter.

---

## 3. Social proof & invites (high impact)

**Done:**
- **Share your streak** copies tweet-style message: "Day X on todaysdailybattle.com—join me! 🔥" and toast "Paste to share on X or anywhere."
- Invite section: "Share your link—you both get 1 streak repair."

**Optional next:**
- Feature 1–2 Stories of Hope on homepage (pull from mailto submissions).
- Optional: open X/tweet intent after copy: `window.open('https://twitter.com/intent/tweet?text=' + encodeURIComponent(msg))`.

**Why:** Word-of-mouth for faith apps is everything—turn users into warriors.

---

## 4. Battle Pro tease → micro-launch

**Current:** Pricing live, tiers clear; banner says "launching soon."

**Quick wins:**
- Flip config to real Stripe links (test mode first) → add "Upgrade now" on homepage.
- "Early Bird: First 50 get 1 month free" countdown (simple JS timer).

**Cursor prompt:** *"Add Stripe Checkout redirect from homepage 'Upgrade now' button, show success toast. Add optional Early Bird countdown (first 50 get 1 month free)."*

---

## 5. Accessibility & SEO polish

**Done:**
- Prayer map SVG: **&lt;title&gt;** "Prayer map: gold crosses show where households prayed worldwide" for screen readers.

**Optional next:**
- Meta title/desc tuned: e.g. "Today's Daily Battle: KJV Verse + Prayer to Fight Your Battles."
- Schema for devotional site (you have some already in index).

**Cursor prompt:** *"Optimize homepage for SEO: add/update meta tags and schema for devotional site (verse of the day, prayer, KJV)."*

---

## 6. Mobile / PWA

**Current:** PWA prompts "Add to Home Screen."

**Quick wins:**
- Test offline: save a prayer → airplane mode → reload → still there?
- Splash screen icon/text: "Less scroll, more soul."

**Check:** docs/PWA-ICONS.md, manifest.json.

---

## Suggested order

Start with **#1** (daily email / unsubscribe) or **#3** (share streak + invite)—fastest, highest impact. Then run **docs/MANUAL-TESTING-CHECKLIST.md**, push, and watch counters climb.
