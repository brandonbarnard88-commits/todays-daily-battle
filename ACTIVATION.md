# Activation checklist — ROADMAP execution

Execute in order to unlock sync/sharing value, then monetization. See **ROADMAP.md** for phases; **CONFIG.md** for keys and tech setup; **ROADMAP-STARS.md** for the full "roadmap to the stars" (prioritized week-by-week).

---

## 1. Activate Supabase accounts (#1 — do immediately)

**Goal:** Sign-in and cross-device sync work so “Sign In Free – Save Your Streak Forever & Sync Devices” delivers.

### 1.1 Set real keys
- [ ] Copy `config.example.js` → `config.js` (if not done).
- [ ] Set `SUPABASE_URL` and `SUPABASE_ANON_KEY` in `config.js` (from Supabase Dashboard → Settings → API).
- [ ] Ensure `config.js` is loaded before `script.js` on all pages (already in index.html).

### 1.2 E2E test (same device)
- [ ] **Sign up** — New email → Sign Up → no console errors; session persists after refresh.
- [ ] **Build value** — Start a streak (open site, mark day), add a favorite verse (Study Tools), add a note.
- [ ] **Log out** — Log Out → session cleared; streak/favorites/notes may show local-only until re-login.
- [ ] **Log in again** — Same email → data (streak, favorites, notes) still there if sync is working.

### 1.3 E2E test (cross-device / new tab)
- [ ] On **Device A**: Sign in, build streak, save a verse, add note.
- [ ] On **Device B** (or incognito): Sign in with same email.
- [ ] **Persistence** — Streak, saved verses, and notes appear (Supabase-backed). If not, check RLS and table names.

### 1.4 Troubleshooting
- [ ] **Console** — No auth or CORS errors.
- [ ] **Supabase Dashboard** — Auth → Users (sign-up succeeded); Table Editor → `profiles` / streak tables if you use them.
- [ ] **RLS** — Policies allow `auth.uid()` read/write for the user’s rows; public read where needed (e.g. `daily_battles`).
- [ ] **Forgot password?** — Test flow: request reset → email link → new password → login. Fix in Dashboard → Auth if needed.

### 1.5 Themed plan progress saving
- [ ] Sign in → go to **Reading Plan** → start **Battle Anxiety in 40 Days** (or Victory Over Fear / Lent 2026).
- [ ] Check off a day → refresh or reopen on another tab (same account) → progress persists (if plans are synced via Supabase). If plans are localStorage-only, note that for later sync.

### 1.6 Go live
- [ ] Once E2E passes: **Newsletter blast** — “Accounts are live—sign in free to sync streaks, drafts, prayers, and plans across phone and computer!” (Full copy in Copy-paste section below; send when ready.)

---

## 2. Test & promote new sharing / engagement

**Goal:** Sharing and new plans work; manual traction toward 50–100 waitlist/streak starts this week.

### 2.1 End-to-end tests
- [ ] **Send to a friend** — Homepage → daily battle → “Send to a friend” → mailto opens with verse, ref, and link; pre-fill looks good.
- [ ] **Verse image / Share** — “Share image” → image and/or share sheet; link and verse text correct.
- [ ] **Hashtags & link** — Share to X/FB → hashtags `#TodaysDailyBattle` `#BibleHabit` `#SpiritualWarfare` and site link present (check `.social-share-links` and `updateSocialShareLinks`).
- [ ] **Themed plans** — Reading Plan → “Victory Over Fear (21 Days)” and “Lent 2026 (40 Days)” → Start → plan loads; verse list and check-offs work.

### 2.2 Manual traction
- [ ] Post **today’s battle** + **one new plan** (e.g. Victory Over Fear or Lent) on your socials.
- [ ] **DM 3–5 pastors:** “Free Pastor Toolkit + new themed plans (Victory Over Fear, Lent 2026)—would love your feedback!”
- [ ] **Target:** 50–100 waitlist signups or streak starts this week.

---

## 3. Launch Battle Pro + shop elements (1–2 weeks)

**Goal:** Real checkout on /pricing; banner shows “Battle Pro Now Available”; shop has Buy now when mug is live.

### 3.1 Stripe (test then live)
- [ ] **Stripe test mode** — Create Payment Links for Supporter (monthly/yearly) and Church (monthly/yearly).
- [ ] **config.js** — Set `STRIPE_SUPPORTER_MONTHLY_URL`, `STRIPE_SUPPORTER_YEARLY_URL`, `STRIPE_CHURCH_MONTHLY_URL`, `STRIPE_CHURCH_YEARLY_URL`.
- [ ] **/pricing** — Buttons show “Subscribe …” and open Stripe Checkout (not “Notify me”). Test a test-card checkout.
- [ ] **Banner** — Homepage banner auto-updates to **“Battle Pro Now Available – Unlock Offline + More”** when all four Stripe URLs are set (see script.js).
- [ ] **First 50–100 perk** — Pricing page includes copy: first 50–100 subscribers get 1 month free or an exclusive devotional (added in pricing.html).

### 3.2 Shop
- [ ] **BATTLE_MUG_URL** — When Battle Mug is live, set product URL in `config.js` → `BATTLE_MUG_URL`.
- [ ] **Test** — Open shop.html → Battle Mug card shows “Buy now” and opens link in new tab.

### 3.3 Announce
- [ ] Email waitlist + social: “Battle Pro is here—join the deeper fight!”
- [ ] Use Blaze (or similar) for promo graphics: new plans, mug tease, Battle Pro launch.

---

## 4. Polish & track

**Goal:** Analytics and verification in place; content for ongoing promotion.

### 4.1 Analytics & verification
- [ ] **CF_ANALYTICS_TOKEN** — Set in `config.js` (Cloudflare Web Analytics). Script loads beacon when set.
- [ ] **Google Search Console** — Add verification meta tag to index.html when you have the code (see CONFIG.md). Or set `GOOGLE_SITE_VERIFICATION` in config (script injects meta when set).
- [ ] **60-second walkthrough** — Record a short Loom/YouTube; set `WALKTHROUGH_VIDEO_URL` in config so the homepage link opens it and "(video coming soon)" hides.

### 4.2 Blaze (or equivalent) — 5–7 pieces
- [ ] Themed plan spotlights (Victory Over Fear, Lent 2026, Battle Anxiety 40).
- [ ] Mug tease (“Less scroll. More soul.” on the product).
- [ ] “Send to a friend” encouragement (share today’s verse).
- [ ] Battle Pro launch / Unlock offline + more.
- [ ] “Why I built this” / story.
- [ ] Pastor Toolkit spotlight.

### 4.3 Monitor & tune
- [ ] **Waitlist growth** and **streak starts** (Supabase + optional analytics).
- [ ] Once 100+ active users/streaks, refine: promo copy, email reminder timing, announcement timing.

---

## Immediate wins (this week — low effort, high retention/virality)

- [ ] **Activate Supabase** — Real SUPABASE_URL + ANON_KEY in config.js → run §1 E2E (sign up → streak/draft/prayer/plan → cross-device). Test RLS + Forgot password. Then send the newsletter blast below.
- [ ] **Test sharing** — Click Share to X / Share to Facebook on daily battle → confirm pre-fill (verse + link + #TodaysDailyBattle #BibleHabit #SpiritualWarfare). Test "Send to a friend" mailto.
- [ ] **Post today's battle** — Use the social post template below. DM 5–10 pastors with the short pastor DM below.

---

## Copy-paste: announcements

Use these when you hit each milestone. Edit verse/link/names as needed.

### When Supabase accounts go live (newsletter / social)
**Subject (email):** Accounts are live — sign in free, never lose your streak

**Body (short):**  
Accounts are live—sign in free to sync streaks, drafts, prayers, and plans across phone and computer! [Sign in free here →](https://todaysdailybattle.com)

Less scroll. More soul. ⚔️

---

### Post today's battle (social — edit verse/ref to match today)
**Copy-paste:**  
Today's battle: Obedience (Romans 15:13). Less scroll, more soul. Join me: https://todaysdailybattle.com ⚔️

#TodaysDailyBattle #BibleHabit #SpiritualWarfare

**Alternate (shorter):**  
Today's win: Obedience. Who's with me? https://todaysdailybattle.com #TodaysDailyBattle #DailyBattle

---

### Pastor DM (short — for 5–10 people)
**Copy-paste:**  
Free Pastor Toolkit + Sermon Builder + new plans (Victory Over Fear, Lent 2026)—would love your feedback! https://todaysdailybattle.com/pastor-toolkit.html

---

### Pastor DM (offer free Supporter trial for reviews)
**Copy-paste:**  
Free Pastor Toolkit + Sermon Builder + new plans. I’d love your feedback—happy to comp a free Supporter trial for an honest review. https://todaysdailybattle.com/pastor-toolkit.html

---

### Pastor DM (longer pitch)
**Copy-paste:**  
Hey [Name], I run a free Bible companion called Today's Daily Battle — one verse, one moment, every day. We just added a full Pastor Toolkit (build a sermon from a topic in one click) and new reading plans like Victory Over Fear (21 days) and Lent 2026 (40 days). Would love your feedback if you have 5 minutes. [Check it out →](https://todaysdailybattle.com/pastor-toolkit.html)

---

### Social post (today’s battle + plan)
**Copy-paste:**  
Today’s verse hit different. [Link to todaysdailybattle.com or share the verse image from the site.]

New: 21-day “Victory Over Fear” and 40-day Lent plans — one verse a day, no app required. Less scroll. More soul. [Start a plan →](https://todaysdailybattle.com/reading-plan.html)

#TodaysDailyBattle #BibleHabit #SpiritualWarfare

---

### When Battle Pro goes live (email / social)
**Subject:** Battle Pro is here — unlock offline, premium devotionals, and your 2026 Wins Report

**Body (short):**  
Battle Pro just launched. Get offline downloads, premium devotionals, and your year-in-review “2026 Wins Report.” First 50–100 subscribers get [1 month free / an exclusive devotional]. [Unlock now →](https://todaysdailybattle.com/pricing.html)

---

## Quick reference

| Item                    | Where / how |
|-------------------------|-------------|
| Supabase keys           | `config.js` (SUPABASE_URL, SUPABASE_ANON_KEY) |
| Stripe Payment Links    | `config.js` (STRIPE_*_URL) |
| Battle Pro banner copy  | Auto when Stripe URLs set (index.html + script.js) |
| First 50–100 perk       | pricing.html |
| Battle Mug buy link     | `config.js` BATTLE_MUG_URL |
| Analytics               | `config.js` CF_ANALYTICS_TOKEN |
| Google verification     | index.html meta or config.js GOOGLE_SITE_VERIFICATION + script |
| Newsletter blast line   | “Accounts are live—sign in free to sync streaks, drafts, prayers, and plans across phone and computer!” |

Once accounts are live, the full loop (sync + plans + sharing + subs) clicks.
