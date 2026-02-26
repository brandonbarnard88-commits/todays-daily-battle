# Monitoring setup (UptimeRobot + Supabase)

Minimal monitoring so you notice outages and usage spikes. Free tier is enough to start.

---

## 1. UptimeRobot (site uptime)

1. Go to [uptimerobot.com](https://uptimerobot.com) and sign up (free).
2. **Dashboard** → **Add New Monitor**.
3. **Monitor type:** HTTP(s).
4. **Friendly name:** e.g. `TDB Homepage`.
5. **URL:** `https://todaysdailybattle.com`
6. **Monitoring interval:** 5 minutes (free tier).
7. **Alert contacts:** Add your email (and optionally SMS or Slack if you upgrade).
8. Click **Create Monitor**.
9. Add a second monitor for **Pricing**: URL `https://todaysdailybattle.com/pricing.html` (same type, interval, alerts).

You’ll get an email when a check fails (and when it recovers). Free tier allows a limited number of monitors; homepage + pricing is usually enough.

---

## 2. Supabase usage alerts

1. Go to [supabase.com/dashboard](https://supabase.com/dashboard) → your project (**rixsnhpwrlbvvymkfamj** or your ref).
2. Open **Settings** (gear) → **Billing** or **Usage** (or **Project Settings** → **Billing**).
3. Look for **Usage alerts**, **Spend alerts**, or **Email notifications**.
4. Enable:
   - **Database size** or **egress** approaching your plan limit (e.g. 80% of free tier).
   - **Auth MAU** (monthly active users) if you care about approaching a limit.
   - Any **billing** alert if you’re on a paid plan.

Exact labels depend on Supabase’s current UI; the goal is to get an email before you hit limits or unexpected usage.

---

## 3. Optional: Edge Function logs

- **Supabase** → **Edge Functions** → **submit-prayer** (and **stripe-webhook**) → **Logs**.
- Check periodically for 5xx or repeated 4xx. No built-in “alert on error” in free tier; you can use a cron or external monitor that hits the function and checks status code if you want automation later.

---

## 4. Quick summary

| What | Where | Action |
|------|--------|--------|
| Site up | UptimeRobot | Monitor homepage + pricing; email on failure. |
| Supabase usage | Supabase Dashboard | Turn on usage/billing alerts. |
| Function errors | Supabase → Edge Functions → Logs | Manual check when debugging. |

After this you’re set for **SECURITY-FORTRESS.md** item #5 (monitoring). When you’re ready, you can add Stripe webhook monitoring or more monitors as needed.
