# Site operations runbook

One place for **post-deploy Supabase**, **optional prayer-wall seeding ethics**, **shop launch**, and **perf checks**. Legal/retention language lives in `privacy.html` and `SECURITY.md`.

---

## 1. Supabase — forms + 90-day cleanup (do in order)

Run in **Supabase → SQL Editor** when setting up or after major changes.

| Step | File / action |
|------|----------------|
| Tables | `supabase-contact-messages.sql`, `supabase-shop-waitlist.sql` (if not already applied). |
| Daily deletes | `supabase-cron-cleanup-contact-shop.sql` (requires **pg_cron** — enable under **Database → Extensions** if available on your plan/region). |

**Verify cron job** (10 seconds, peace of mind):

```sql
SELECT jobname, schedule, command, active
FROM cron.job
WHERE jobname = 'cleanup-old-contact-shop';
```

Expect: **one row**, `schedule` = `0 0 * * *` (daily, usually **UTC**), `command` containing both `DELETE` statements on `public.contact_messages` and `public.shop_waitlist`, `active` true (column name may vary by pg_cron version).

- **Empty result:** Re-run the cleanup SQL or check extension; use **manual** `DELETE` occasionally until fixed.
- **pg_cron unavailable:** Keep privacy policy; run deletes manually or add **Edge Function + external cron** (Vercel/Cron/Workers) later.

---

## 2. Prayer Wall — seeding (optional)

**Default:** An empty wall is honest. **Do not** fabricate engagement.

If you add starters, they must feel **authentic** (your voice, anonymized, no fake metrics). Prefer **real submissions** over filler. Never imply fake “live” counts.

Technical options: insert via **admin** tooling if you have it, or **service_role** SQL in SQL Editor only (never in client). Respect RLS and `SUPABASE-SYNC-TABLES.md`.

---

## 3. Shop launch (when ready)

Not blocking daily value; use when fulfillment and headspace align.

- [ ] **MVP SKUs** — 1–3 (e.g. mug, journal, tee) aligned with `shop.html` copy.
- [ ] **Fulfillment** — Printful/Teespring/similar; test print + shipping.
- [ ] **Stripe** — Live Checkout links or Edge Function flow; test 4242…
- [ ] **Waitlist** — One email to `shop_waitlist` + newsletter segment (“checkout is open”).
- [ ] **pricing.html** — Tiers match what you sell; no bait-and-switch.
- [ ] **Announce** — Homepage strip or story post; keep tone calm (no hype).
- [ ] **Remove or soften** prolonged “Coming Soon” once SKUs ship.

---

## 4. Performance — Lighthouse (optional, ~10 min)

When you care about scores or slow devices:

1. Chrome DevTools → Lighthouse → **Mobile**.
2. URLs: `/`, `reader.html`.
3. Fix only **real pain**: LCP &gt; ~2.5s, render-blocking assets, largest unused bundles. See `LIGHTHOUSE-AUDIT.md` — splitting `script.js` is a **larger** refactor; don’t block shipping on it.

---

## 5. Cloudflare

If HTML looks stale after deploy: **Caching → Purge Everything** or purge `/`, `/index.html`, `/contact.html`, `/shop.html`, `/privacy.html`, `/service-worker.js`, `/script.js`.

Use `curl -sSL` for origin checks — see `docs/CHECKLIST-DEPLOY.md`.
