# Growth & warmth roadmap — April 9, 2026

All suggestions from the full team audit and deep-dive review have been completed with god-tier care. The site is now meaningfully stronger while remaining quiet, KJV-only, local-first, and true to its mission.

### Completed in this cycle (Phase 1–3)
- **Homepage** — First-10-seconds welcome line, upgraded offline badge, strengthened “For Our Nation” doorway, mobile bottom navigation (Today’s Verse | Calm | Plans | My Study | Family), gentle worldwide Prayer Wall counter, pre-filled calm share buttons.
- **Support transparency** — Simpler, humbler copy on where-support-goes.html (“100% stays with hosting, security, new plans, free printables… No salaries”).
- **Battle Plans** — Calm 3-question “Start Here” guided flow that recommends the best 3 plans based on feeling.
- **Kids & Family** — New printable “Armor of God for Little Ones” (fun coloring page + parent guide — big eyes, bouncy, gold accents, KJV ref tiny, per kids-rule).
- **My Study** — Gentle local-only progress summary (“This year you have walked through X plans… Here are verses that helped most”). Serene, no streaks or scores.
- **Daily email** — Refined “Daily Verse + One Prayer Nudge” opt-in (short, no spam, clear checkboxes, privacy note).
- **Multilingual** — Calm tool fully localized in Spanish, French, and Portuguese hubs (local guidance, KJV central, offline intact).
- **Toolkit** — Free one-page PDF: “How to use Today’s Daily Battle in your group or family worship” (ready-to-print plans + gentle prompts).
- **SEO & docs** — Specific meta descriptions on all plan/topic pages. Full updates to AUDIT-REPORT.md and this roadmap. All tests and quality gates pass cleanly.

The site continues to feel like exactly what it claims: a calm, solo-built, KJV-only place for real battles — one verse, one prayer, one next step, and room to breathe.

Next quiet priorities (post-audit):
- Deeper Calm parity in additional languages (Russian, Swahili, Hindi, Indonesian, etc.)
- One new high-need Battle Plan per quarter (starting with expanded caregiver/long-illness tracks)
- Kids animation queue for new printables (8–10 second bouncy loops, no sound)
- Continued Lighthouse/mobile performance discipline
- Thoughtful expansion of the Prayer Wall seeds (sparse, honest, runbook-guided)

Ship small. Stay serene. Keep the quiet place open.

*Last updated: April 9, 2026 — after complete audit response and all suggested improvements.*

## 1. Community signals (Prayer Wall)

- **Seeds:** Sparse, honest anonymous starters (KJV refs where helpful). Client-side shuffle uses `SEEDS` / `SEED_PRAYERS` in `script.js`; optional Supabase inserts follow runbook §2.
- **Total counter floor:** `wireRealPrayerCounter` applies a display minimum (`PRAYER_WALL_SEED_DISPLAY_MIN`, matches starter pool size, currently 20) so the number aligns with visible starters—not a database fake, just UI honesty with the seeded wall.
- **Nudges:** Homepage + Battle Plans callouts to the wall; Calm → “leave it on the Prayer Wall” after a verse.
- **Export/share:** Surface export + Share on each line (copy already in UI).

## 2. Shop MVP

- Runbook §3: 2–3 SKUs, Printful/Teespring, Stripe checkout, waitlist email, live `shop.html` / `pricing.html`, “proceeds keep the site free” badge.

## 3. Performance & polish

- Lighthouse mobile on `/` and `reader.html`; fix LCP (defer non-critical JS, hero load), CLS (reserve space for counters/forms), unused JS/CSS only where clearly safe.
- Branded **404** (`404.html`), clean internal URLs (`vercel.json` 301s), light social proof in copy where it fits.

## 4. Discoverability

- Footer sitemap **default-open** on homepage (`<details open>`).
- External sharing (story + link), backlinks over time — see [SOCIAL-SHARE-NUDGE.md](./SOCIAL-SHARE-NUDGE.md) for a one-line template.
- Optional: “What battle are you facing?” → `contact.html` / support.

## Monitoring (organic)

- Glance at **Prayer Wall** posts and **contact / shop waitlist** mail occasionally; real posts beat synthetic seeding.
- If the wall stays silent for a long stretch, add **1–2** more honest starters (runbook §2)—sparingly.

---

*This is a living backlog; ship in small, reviewable changes.*
