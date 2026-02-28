# Bare minimum: cool site → "I can quit my job"

**Immediate Next Steps (Today / Tomorrow, ~30–45 min total)**  
Do in order. Tick when done.

---

- [ ] **Add one visible prayer (~2 min)**  
  **Why:** Shows "1 warrior prayed today" → site feels used, not static.  
  **Done when:** Homepage prayer wall shows "1 warrior prayed today" after refresh.  
  **Stuck?** If count doesn't update, run **supabase-get-prayers-today-count.sql** in Supabase (RPC must exist). Clear browser cache if needed.

- [ ] **Fix countdown if stuck (~5 min, verify only)**  
  **Why:** Real ticking urgency = higher conversions.  
  **Done when:** Banner says "Ends in X days" and auto-updates (e.g. tomorrow → "6 days").  
  **Stuck?** Ctrl+F5 (or Cmd+Shift+R). In `script.js`: `endDate = new Date('2026-03-07T23:59:59Z')` and `updateCountdown()` on load.

- [ ] **Create & send one Stripe link (~15 min)**  
  **Why:** One real payment = proof, revenue, valuation jump.  
  **Done when:** At least one $9.99 Battle Pro payment (or test) in Stripe dashboard.  
  **Stuck?** Stripe → Payment Links → $9.99/mo, 7-day trial. Paste link into `config.js` as `STRIPE_BATTLEPRO_MONTHLY_LINK`. Send via DM/email.

- [ ] **Done**

---

## What’s next (after these)

- **Daily pulse:** Add 1 prayer/reflection every morning (5 min/day). Keep adding one a day.
- **Push doc:** [DAILY-PUSH-AND-EMAIL.md](DAILY-PUSH-AND-EMAIL.md) — Verse ready + Streak alert backend.
- **Email test:** Resend setup — [RESEND-DAILY-VERSE-EMAIL.md](RESEND-DAILY-VERSE-EMAIL.md).
- **Share-streak card:** In-app "Share your streak" card (streak ≥ 1) → button to generate image + link.

Tick 'em off as you go. Once the first two are done, retest and recheck value.

You're making it stupid-easy on yourself. That's smart.

---

## Reference (same three, more detail)

<details>
<summary>Expand: Stripe, daily pulse, countdown (full steps)</summary>

### 1. One paying user — ~15 min

- **Stripe:** Create Battle Pro → Add price $9.99/mo recurring → Create **Payment link** (optional: 7-day free trial) → Copy link
- **Project:** In `config.js` set `STRIPE_BATTLEPRO_MONTHLY_LINK: 'https://buy.stripe.com/your-link'`
- **Deploy** so pricing page "Battle Pro — $9.99/mo" opens that link
- **Share** link with yourself, a friend, or one engaged follower

**Stuck?** See `config.example.js`. Pricing page shows a note if the link is missing.

### 2. Daily pulse — 5 min/day

- **Once:** Supabase → SQL Editor → run **supabase-get-prayers-today-count.sql**
- **Every day:** Add one real prayer on the site or one row in `prayers` in Supabase. Refresh → "1 warrior prayed today" (or more).

**Stuck?** `prayers` table must exist first (supabase-prayers.sql).

### 3. Countdown — verify only

- Banner shows "Ends in X days!" and number updates. If stuck: hard refresh or ensure deploy has `script.js?v=20260301`.

**Stuck?** `script.js`: `endDate`, `updateCountdown`. Default HTML is "Ends soon!".

</details>

---

**Result:** $10 in revenue + live counters + real FOMO. Then repeat.
