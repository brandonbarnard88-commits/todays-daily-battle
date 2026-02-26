# Capacity & scaling — todaysdailybattle.com

**Stack:** Cloudflare Pages (static) + Supabase (auth, prayers, streaks, daily_battles).  
**Bottleneck:** Supabase plan limits; Cloudflare handles high traffic.

---

## Short answer

| Who | Limit |
|-----|--------|
| **Registered users (signed-in)** | ~50,000 monthly active users (MAU) on Supabase Free. Comfortable for hundreds to a few thousand daily actives. |
| **Total visitors (anonymous + registered)** | Tens of thousands to low hundreds of thousands monthly page views—Cloudflare CDN has no hard cap; Supabase API/DB/egress are the constraints. |

---

## Supabase Free tier (typical 2026)

| Resource | Free tier |
|----------|-----------|
| **Auth MAU** | 50,000 |
| **Database** | 500 MB |
| **Egress** | 5 GB (+ 5 GB cached) |
| **Concurrent connections** | ~200 |
| **Realtime messages** | 2M/month |
| **API requests** | No hard quota |

**Practical:** Low traffic (hundreds daily) = no issues. Medium (thousands daily, hundreds of thousands registered) = still fine; watch MAU, DB size, egress. High (tens of thousands+ daily / viral) = consider Supabase Pro (~$25/mo: 100K MAU, 8 GB DB, 250 GB egress).

---

## Cloudflare Pages

Static hosting: high bandwidth allowance, no per-user cap. Verse loads, search, and static assets scale with CDN; not the limiting factor.

---

*Summary from Feb 26, 2026. Check [Supabase Dashboard](https://supabase.com/dashboard) for your project's exact limits and usage.*
