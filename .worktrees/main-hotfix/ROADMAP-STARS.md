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
4. **Maximize sharing** — Share Image preview thumbnail + X/FB/Instagram (copy-for-IG) below daily battle; hashtags #TodaysDailyBattle #DailyBattle #BibleHabit #SpiritualWarfare; test "Send to a friend" mailto; shareable verse graphics with branding. Post one battle daily on X/IG: "Today's win: [Topic]. Who's with me?"
5. **Promotion blitz** — DM 10–20 pastors: "Free Pastor Toolkit + Sermon Builder + new plans—feedback welcome!" Post daily battles on X/IG; Blaze for 10–15 graphics (verse promos, sermon builder story, mug tease).
6. **Target 100–500 active** — 50–100 waitlist/streak starts this week; track with CF Analytics once token set.

### Week 2–3: Revenue streams
7. **Battle Pro live** — Stripe Payment Links in config → banners auto-switch; "Notify Me" → checkout; first 50–100 perk copy on pricing.
8. **Shop live** — Set BATTLE_MUG_URL → "Buy now"; promote mug (Phil 4:6–7).
9. **Announce** — Email + social: "Battle Pro & Shop are here!"; Blaze launch graphics.

### Ongoing / scale
10. **Depth** — Reader: ESV/NIV toggle (free API e.g. API.Bible); "Why this verse?" blurb from public-domain commentary for scholarly cred; highlight daily verse on load.
11. **SEO/content** — Google Search Console verification (config meta); /blog (3–5 posts: "Winning Fear in 2026," Lent guide).
12. **Community** — Public prayer wall or "Battle Wins" story submissions.
13. **Metrics** — Daily actives, streak length, plan completions, share clicks, waitlist→subs (target 10–20%).

---

## Quick lifts (implemented or one-line config)

| Lift | Status / action |
|------|------------------|
| Share Image preview thumbnail | ✅ Next to X/FB buttons on daily battle |
| Share to Instagram | ✅ Copies verse + link + hashtags for Stories/post |
| #DailyBattle in shares | ✅ Included in daily battle share text |
| First 50 get free month (bold) | ✅ Pricing page: **First 50 subscribers get 1 month free.** |
| Newsletter alt line | "Sync everything now—never lose your progress!" (optional; full sync line in ACTIVATION) |
| Revenue flip | Set Stripe links → banner auto-changes; set BATTLE_MUG_URL → mug "Buy now" |
| Visibility | Verify Google Search Console (GOOGLE_SITE_VERIFICATION in config); post one battle daily; DM pastors—offer free Supporter trial for reviews |
| Depth (later) | Reader ESV/NIV toggle (free API); "Why this verse?" from public-domain commentary |

---

## Quick reference

- **Activation checklist + copy-paste:** ACTIVATION.md  
- **Phases & roadmap:** ROADMAP.md  
- **Config (keys, Stripe, analytics):** CONFIG.md  
- **Test flows:** TEST-CHECKLIST.md  
