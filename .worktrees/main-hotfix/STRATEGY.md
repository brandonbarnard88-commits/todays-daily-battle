# Strategy: todaysdailybattle.com

Product and growth direction relative to top Bible sites (BibleGateway, YouVersion, BibleHub, Blue Letter Bible) and the goal of being the daily Bible habit people choose over feeds.

---

## Where we are vs. benchmark

| Area | Leaders (2026) | todaysdailybattle.com today |
|------|----------------|------------------------------|
| **Positioning** | Free core + premium upsells; daily engagement | Free, no paywall; “one verse, two minutes”; daily battle + streaks |
| **Core content** | Multi-version, audio, reading plans, devotionals | Single version, daily verse + reflection/prayer, 30-Day Battle Plan, reader, search by topic |
| **Engagement** | Plans, highlights, notes, shareable verse images | Streaks + milestones (3/7/14/30/60), verse image share, “Read full chapter” + “More on topic,” micro-testimonies |
| **UX** | Clean home, search, mobile app, offline | PWA (install), dark mode, minimal UI, offline-capable, reduced-motion support |
| **Community** | Forums, groups, shared plans | Stories of Hope, micro-testimonies; no forums/friend streaks yet |
| **Monetization** | Freemium subs (e.g. Bible Gateway Plus), donations | None yet; CONFIG notes Stripe as future |

**Differentiator:** We are a daily companion and habit anchor, not a full Bible platform. Depth (one verse → chapter → topic) and gamification (streaks, share) are built for retention without competing on 50+ versions or full commentary stacks.

---

## Next 6–12 months (prioritized)

1. **SEO & discoverability**
   - Target queries: “free Bible verse of the day,” “daily Bible habit,” “Bible in two minutes,” “less scroll more soul.”
   - Keep sitemap and meta keywords updated; add blog or topical pages if you expand content.
   - Use Search Console (and optional Ahrefs/similar) to track rankings and refine.

2. **Email & retention**
   - Newsletter and “daily battle alert” signups already go to Supabase.
   - Add a sender (Resend, SendGrid, Mailchimp, etc.) and a scheduled job (e.g. Supabase Edge Function) to send:
     - Weekly recap (highlights, saved verses, encouragement), and/or
     - Daily verse email for alert subscribers.
   - See CONFIG.md “Email sending” for technical steps.

3. **Performance & accessibility**
   - Keep PWA, offline, and reduced-motion behavior; run PageSpeed (and Lighthouse) periodically.
   - Fix any quick wins (images, caching, critical CSS) so mobile stays fast.

4. **Monetization (when ready)**
   - Stripe Payment Links are referenced in CONFIG; wire Supporter/Church tiers when you want paid plans.
   - Start with clear free vs paid (e.g. free: daily verse, search, one plan; paid: ad-free, extra plans, notes sync, exclusive content).
   - Consider donations or partnerships before or alongside subscriptions.

5. **Community (optional, later)**
   - Light social: e.g. optional friend streaks, “send verse to a friend,” or small battle groups.
   - Document in CONFIG or product backlog; implement when it fits roadmap and capacity.

---

## Out of scope for now

- **50+ translations / full Bible platform** — We focus on one version and daily habit, not replacing BibleGateway/YouVersion.
- **Full commentary suite / interlinear / Greek–Hebrew** — Deep study is not core; “Read full chapter” and topic search cover most depth needs.
- **AI personalization / chatbots** — Can revisit when budget and use cases are clear.
- **Live groups / video studies** — Not in current scope; CONFIG/docs can note as future.

---

## Success focus

- **Retention:** Streaks, milestones, and email bring people back daily or weekly.
- **Shareability:** Verse images and clear share CTA (“One tap to share—post to your story or send to a friend”) drive word of mouth.
- **Simplicity:** “Two minutes that fill you up” stays the core promise; new features should support that, not dilute it.

For technical setup (Stripe, analytics, email senders, service worker, daily battle seeding), see **CONFIG.md**. For the full phased roadmap (Phase 1–3, themed plans, Battle Pro), see **ROADMAP.md**.

---

## Implementation checklist (done in codebase)

- [x] **SEO:** Meta keywords include "free Bible verse of the day," "daily Bible habit," "Bible in two minutes," "less scroll more soul," "free Bible study online"; topic pages use "Free Bible verses…" in descriptions; sitemap includes all key pages + weekly-email-template.
- [x] **Email retention:** Hero CTA "Get today's verse by email" → #newsletter; newsletter heading "Weekly Encouragement & Daily Verse" and invite-a-friend line; CONFIG links retention goals to STRATEGY.
- [x] **Performance:** theme-color and preconnect (Unsplash) for PWA/share; reduced-motion and existing PWA/offline unchanged.
- [x] **Pricing clarity:** Free vs paid one-liner on pricing page.
- [ ] **You:** Wire email sender + scheduled job (Resend/SendGrid + Edge Function or cron); add Stripe Payment Links when ready; run Search Console and PageSpeed periodically.
