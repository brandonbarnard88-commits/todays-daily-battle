# Bare minimum: cool site → "I can quit my job"

Three actions. Do them in order.

---

## 1. One paying user (today or tomorrow)

**In Stripe Dashboard:**
- **Product** → Create or select **Battle Pro**
- **Add price**: $9.99/mo, recurring
- **Payment link** → Create link → enable **7-day free trial** (optional but reduces friction)
- Copy the link (e.g. `https://buy.stripe.com/...`)

**In your project:**
- Open **config.js** (or the inline config on pricing.html if you use that)
- Set:
  - `STRIPE_BATTLEPRO_MONTHLY_LINK: 'https://buy.stripe.com/your-link'`
- Save. Deploy so pricing page **Battle Pro — $9.99/mo** opens that link.

**Then:** Send the link to yourself, a friend, or one person who liked your post. When they pay → $9.99 in your pocket. Proof.

---

## 2. Daily pulse (5 min/day)

- **Once:** In **Supabase → SQL Editor**, run **supabase-get-prayers-today-count.sql** (creates the RPC so the homepage can show "X warriors prayed today").
- **Every day:** Add one real prayer on the site (e.g. "Lord, thank you for today.") or insert one row in `prayers` in Supabase.
- Refresh the site → "1 warrior prayed today" (or more). **Keep adding one a day**—counters climb, site feels alive.

---

## 3. Countdown (already fixed in code)

- **script.js** uses `endDate = new Date('2026-03-07T23:59:59Z')` (UTC) and calls `updateCountdown()` on load + every 60s.
- Default banner text is "Ends soon!" so cache never shows a stale "7 days".
- **If you still see 7 days:** Hard refresh (Cmd+Shift+R / Ctrl+Shift+R) or clear cache. After deploy, the new `script.js?v=20260301` forces fresh JS.

---

**Result:** $10 in revenue, live counters, real FOMO. Then repeat: more payments, more prayers, more shares.
