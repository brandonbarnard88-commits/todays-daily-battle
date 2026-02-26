# UptimeRobot setup (~5–10 min)

Free monitoring for todaysdailybattle.com so you get alerts if the site goes down or slows.

---

## 1. Sign up

1. Go to [uptimerobot.com](https://uptimerobot.com) and click **Sign Up Free**.
2. Create an account (email + password). Free tier: 50 monitors, 5-min check interval.

---

## 2. Add monitors

1. **Dashboard** → **+ Add New Monitor**.
2. **Monitor Type:** HTTP(s).
3. **Friendly Name:** e.g. `TDB Homepage`.
4. **URL:** `https://todaysdailybattle.com`
5. **Monitoring Interval:** 5 minutes (default).
6. Click **Create Monitor**.
7. Repeat: add a second monitor for **URL:** `https://todaysdailybattle.com/pricing.html`, name e.g. `TDB Pricing`.

---

## 3. Alerts

1. **My Settings** (or account menu) → **Alert Contacts**.
2. Add your email (and optionally SMS or Slack) so UptimeRobot can notify you when a monitor goes down or comes back up.
3. By default, new monitors use your first alert contact. You can edit each monitor to choose contacts.

---

## 4. Done

You’ll get an email when either URL fails (e.g. 5xx, timeout) or when it recovers. No code changes; all configuration is in UptimeRobot.
