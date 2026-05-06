# Monitoring & Review Cadence

---

## 1. Uptime Monitoring (5 min setup)

**UptimeRobot** (free): [uptimerobot.com](https://uptimerobot.com)

1. Sign up
2. Add monitor:
   - **URL:** `https://todaysdailybattle.com`
   - **Type:** HTTP(s)
   - **Interval:** 5 minutes
3. Add monitor:
   - **URL:** `https://todaysdailybattle.com/pricing.html`
4. Set alert contacts (email/SMS)
5. Alert when: Down, or HTTP 5xx

**Alternatives:** Pingdom, Better Uptime, Cronitor

---

## 2. Calendar Reminder (Every 1–2 Months)

**Set a recurring reminder:**

> **Review Today's Daily Battle cadence**
> - Run `docs/REVIEW-CADENCE-CHECKLIST.md`
> - `SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... npm run suggest:fetch`
> - Paste "Top 8 for mapping" → map phrases in one pass
> - Deploy

**Suggested cadence:** 1st of each month, or every 6 weeks.

---

## 3. Quick Health Checks

| Check | How |
|-------|-----|
| Prayer counter | Home or Message Board shows number, not "Loading…" |
| Daily verse | Homepage shows today's verse |
| Pricing | /pricing loads, Subscribe buttons open Stripe |
| Search | Type "hope" → verses + breakdowns |
| Offline | Disconnect → "Offline—still got you" appears |

---

## 4. When Suggest-Form Has Data

```bash
SUPABASE_URL=https://YOUR_PROJECT.supabase.co \
SUPABASE_SERVICE_ROLE_KEY=your_key \
npm run suggest:fetch
```

Paste the "Top 8 for mapping" line into chat → we map in one pass.
