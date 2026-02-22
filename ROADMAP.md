# Roadmap: todaysdailybattle.com

Prioritized evolution from "quick daily verse tool" to a habit-forming Bible companion with depth, community, and sustainable monetization. Keeps the "battle" angle (spiritual warfare + daily wins) as the differentiator.

**See also:** [STRATEGY.md](STRATEGY.md) for benchmark comparison and 6–12 month focus. [CONFIG.md](CONFIG.md) for technical setup.

---

## What we have today (vs. top Bible sites)

| Area | We have | Gap / next |
|------|---------|------------|
| **Bible access** | One daily verse, topic search, **full KJV reader** (book/chapter) on [reader.html](reader.html), Listen (TTS), KJV Audio link | Multi-version selector, parallel view |
| **Engagement** | Streaks + milestones (3/7/14/30/60), verse image share, 7-day + custom 7–30-day plans, **themed plan (Battle Anxiety 40 Days)** | PWA push for verse-of-the-day, more themed series |
| **Personalization** | Prayer list (device), optional Supabase login, saved verses/notes in Study Tools | Cross-device sync finalized, "My Battles Won" profile |
| **Plans** | 7-day default, custom 7/14/21/30-day, Battle Anxiety in 40 Days | Longer thematic journeys (e.g. Lent, 365-day) |
| **Community** | Stories of Hope, Message Board (Encourage Someone) | Public testimonies feed, prayer wall, small groups |
| **Monetization** | Pricing page, Stripe placeholders, waitlist | Live Stripe, Battle Pro tier, trials |
| **Depth** | Reader, topic search, Sermon Builder, Study Tools | Cross-refs, commentary snippets, multimedia |

---

## Phase 1: Core enhancements (1–3 months)

**Goal:** Retention + virality. Make full Bible obvious, sharing effortless, and plans stickier.

1. **Full Bible visibility**
   - Homepage and nav already link to Chapter Reader (full book/chapter). Optional: one-line CTA "Read any chapter" so reviewers and users see it.
   - **Done:** Reader exists; optional copy added on site.

2. **Verse images & sharing**
   - Verse images already shareable (daily battle + Study Tools). Add social buttons (X, Instagram, Facebook) or clearer "Post to story" CTA if desired.

3. **Plans & engagement**
   - **Done:** Themed plan "Battle Anxiety in 40 Days" (40 verses on anxiety/peace/fear) on Reading Plan page.
   - Expand: More themed series (e.g. "Victory Over Fear," "Lent 2026"). Use same pattern as Anxiety 40.
   - Streaks + badges: Already have milestones (3/7/14/30/60). Optional: push notifications for streak reminder (PWA).

4. **PWA verse-of-the-day push**
   - Enable PWA notifications for "Today's verse is ready" (requires permission + backend or scheduled job). Document in CONFIG.

5. **Supabase sync**
   - Finalize login: cross-device streaks, saved favorites, custom plans, notes. Add simple profile ("My Battles Won"). Partially in place; polish and test.

---

## Phase 2: Depth & community (3–6 months)

6. **Study layers**
   - Cross-references, simple commentary (e.g. public domain), Strong's links for key words.
   - Multimedia: Short audio devotionals, or embed BibleProject-style explainers for tough verses.

7. **Community**
   - Stories of Hope → expand into a small feed (user-submitted testimonies, moderated).
   - Prayer wall: Public/shared prayers (moderated).
   - Small groups: Invite-only threads on daily verse, or Discord link for "battle groups."

8. **Inclusivity & tech**
   - More languages (e.g. Spanish via API).
   - Accessibility: Screen-reader tweaks, larger text defaults.
   - Optional: Basic verse recommendations ("Based on your anxiety searches…") via simple rules or AI.

---

## Phase 3: Subscription & growth (6+ months)

9. **Freemium (Battle Pro)**
   - **Free:** Current site + full Bible + basic plans (already).
   - **Battle Pro** ($4.99/mo or $49/yr): Unlimited custom plans, offline downloads, exclusive content (premium devotionals, sermon templates, spiritual warfare series), priority prayer, advanced streaks/analytics ("Your 2026 Battle Wins Report").
   - Launch with 14-day free trial; value previews ("Unlock this plan…").
   - Extra: Donations, affiliate Bible resources, premium kids/pastor packs.

10. **Marketing at scale**
    - SEO: "daily Bible verse for anxiety," "spiritual warfare devotional." Blog or topical pages.
    - Social: Auto-generated verse graphics and posts (e.g. Blaze AI or similar).
    - Partnerships: Church/pastor toolkits, influencer "battle" challenges.
    - Target: 10K+ daily users, then 10–20% conversion to paid.

---

## Activation & launch checklist (momentum toward 1K users)

Order: impact/ease. Do in this order.

1. **Get user accounts live & tested (this week)**  
   Add real Supabase URL + anon key to `config.js` (use config.example.js as template). Test: create account → streak saves/syncs across browser or device → favorite a verse → persists after logout/reopen. Fix any bugs (clear error/help link if login fails). Homepage has prominent **Sign In (Free) to Save Your Streak & Sync Everything** button near streak. Once stable, email early users: "Your streak is saved—keep the battle going!"

2. **Activate sharing for virality (1–2 days)**  
   **Done:** Share text includes verse + "Less scroll. More soul. #TodaysDailyBattle #BibleHabit #SpiritualWarfare"; **Share to X** and **Share to Facebook** one-tap links below daily content. Share image button generates verse card with branding. Post today's battle from your own X/Instagram to seed: "Today's battle: [theme] ([ref]). Join the fight: [link]." Track shares via analytics.

3. **Launch Battle Pro subscriptions (target: 2–4 weeks)**  
   Integrate Stripe (see CONFIG.md)—start in test mode. Update /pricing to "Subscribe Now" when live (script shows "Notify me" until Stripe URLs are set). Homepage has Battle Pro banner ("Coming soon—join the waitlist") and 30-Day section tease. Optional: first 100 subscribers get 1 month free or exclusive devotional. Announce in newsletter: "Subscriptions launching soon—here's what you'll get."

4. **Minor polish & growth (ongoing)**  
   **Reader:** Optional version selector (KJV + one more via API), verse highlight when opening from daily link. **Analytics:** Google Analytics or Cloudflare to track uniques, streak engagement, shares, /pricing visits. **Marketing:** Blaze AI or similar for 7–10 social posts/emails; email waitlist "Accounts live, Pro coming—try it!"; reach out to 5–10 small churches with toolkit link. **SEO/blog:** 2–3 short posts (e.g. "Winning the Daily Battle Against Anxiety") with verse + tool links.

---

## Summary

- **Phase 1:** Full Bible visible, verse sharing, themed plans (Anxiety 40 done), PWA push, Supabase sync.
- **Phase 2:** Study depth, community (testimonies feed, prayer wall, groups), languages, accessibility, light AI.
- **Phase 3:** Battle Pro subscription, trials, marketing, partnerships.

The site already has heart and a clear niche. This roadmap keeps "two minutes that fill you up" at the center while adding depth and revenue when ready.
