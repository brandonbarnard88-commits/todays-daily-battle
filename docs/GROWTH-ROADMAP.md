# Growth & warmth roadmap

Prioritized levers to make the site feel **alive**, **complete**, and **discoverable**—without noisy hype. Operational detail lives in [SITE-OPS-RUNBOOK.md](./SITE-OPS-RUNBOOK.md) (prayer seeding ethics, shop launch, Lighthouse pass).

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
