# Roadmap to the Stars — 10K+ users, viral shares, recurring revenue

Feedback summary as of **February 22, 2026**. Use with **ACTIVATION.md** and **ROADMAP.md**.

---

## 1. Strengths to double down on

- **Unique positioning** — "Battle" framing + anti-scroll hook; anxiety/fear/obedience themes; testimonials feel authentic.
- **Tool depth for pastors** — End-to-end flows (topic → toolkit → sermon draft → print/email/share); standalone Church Center (prayer, assignments) without barriers.
- **Freemium readiness** — Generous free tier; Supporter/Church add clear value; first 50–100 perk is a smart launch incentive.
- **Minimalist UX** — Fast, mobile-first, PWA, dark mode, TTS/audio, no ads.
- **Expansion hooks** — Themed plans (Anxiety 40d, Fear 21d, Lent 2026), shop mug, send-to-friend, verse cards.

---

## 2. Gaps / opportunities for star-level growth

| Area | Gap | Fix |
|------|-----|-----|
| **Onboarding** | Sign-in optional → streaks/notes lost on new device; plans device-only until sync | Activate Supabase; prominent sign-in CTA; "Streak saved!" on login |
| **Virality** | Sharing exists but not maximized; no prominent X/FB/IG; limited community | Visible social icons; auto verse graphics; promotion blitz |
| **Depth** | KJV-only reader; one-verse/day plans | Optional version toggle; cross-refs/commentary snippets (later) |
| **Monetization** | Battle Pro "coming soon"; shop "Notify me" only | Stripe live; BATTLE_MUG_URL; announce |
| **Visibility** | No Search Console; limited blog/content; no external buzz | Google verification; /blog posts; Reddit/X presence |
| **Analytics** | CF token ready but not set | Set token; track drop-offs, share rates, plan completions |

---

## 3. Prioritized actions (1–4 weeks)

Execute in this order. **ACTIVATION.md** has the checklist and copy-paste announcements.

### Week 1: Activate & retain (make it sticky)
1. **Flip Supabase live** — Real keys in config.js → E2E test (sign up → streak/favorite/note/plan → cross-device). Then blast: "Accounts are live—sign in free to never lose your streak & sync plans!"
2. **Sign-in CTA** — Big button near streak + header: "Sign In Free – Save Everything Forever." Optional benefits popup: "Sync streaks, drafts, prayers, plans—across phone/computer."
3. **Daily habit loop** — PWA push reminders (when ready); "Streak saved!" toast on login.

### Week 1–2: Virality (shares & users)
4. **Maximize sharing** — Visible X/FB (and IG where possible) below daily battle; hashtags #TodaysDailyBattle #BibleHabit #SpiritualWarfare; test "Send to a friend" mailto; shareable verse graphics with branding.
5. **Promotion blitz** — DM 10–20 pastors: "Free Pastor Toolkit + Sermon Builder + new plans—feedback welcome!" Post daily battles on X/IG; Blaze for 10–15 graphics (verse promos, sermon builder story, mug tease).
6. **Target 100–500 active** — 50–100 waitlist/streak starts this week; track with CF Analytics once token set.

### Week 2–3: Revenue streams
7. **Battle Pro live** — Stripe Payment Links in config → banners auto-switch; "Notify Me" → checkout; first 50–100 perk copy on pricing.
8. **Shop live** — Set BATTLE_MUG_URL → "Buy now"; promote mug (Phil 4:6–7).
9. **Announce** — Email + social: "Battle Pro & Shop are here!"; Blaze launch graphics.

### Ongoing / scale
10. **Depth** — Reader: version toggle (KJV + public domain); highlight daily verse on load.
11. **SEO/content** — Google verification; /blog (3–5 posts: "Winning Fear in 2026," Lent guide).
12. **Community** — Public prayer wall or "Battle Wins" story submissions.
13. **Metrics** — Daily actives, streak length, plan completions, share clicks, waitlist→subs (target 10–20%).

---

## Quick reference

- **Activation checklist + copy-paste:** ACTIVATION.md  
- **Phases & roadmap:** ROADMAP.md  
- **Config (keys, Stripe, analytics):** CONFIG.md  
- **Test flows:** TEST-CHECKLIST.md  
