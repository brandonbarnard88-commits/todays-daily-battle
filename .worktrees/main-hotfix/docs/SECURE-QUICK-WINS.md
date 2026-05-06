# Secure quick wins — no shortcuts

Quick wins are implemented so they **do not create weak points**. Everything stays locked down: RLS enforced, no exposed keys, HTTPS only, minimal data, auth checks where needed.

---

## Daily email reminders live

- **Anon INSERT only** on `newsletter_signups` — no `user_id` or sensitive fields in the insert. Policy: `WITH CHECK (true)` for INSERT.
- **Anon SELECT denied** — emails stay hidden (RLS from supabase-rls-lockdown.sql; no anon SELECT policy).
- **Footer unsubscribe:** mailto link only (client-side, no server hit).
- **Test:** Incognito signup → confirm toast "You're on the list!" → no data leak in console.

**Files:** `supabase-newsletter-anon-insert.sql`, footer + daily verse form "Unsubscribe anytime" link.

---

## Prayer wall pop (seeded)

- **Seed in Supabase SQL Editor only** (admin/dashboard) — not via anon INSERT. Use `supabase-seed-prayers.sql`.
- **Counter:** Uses RPC `get_total_prayer_count()` (returns a single number — no table read by anon). Copy: "Total prayers: N — join N warriors right now."
- **Last prayer badge:** Uses RPC `get_last_prayer_created_at()` (returns one timestamp). No row data exposed.
- **No Supabase realtime** for now — avoids auth-gated subscriptions. All anonymous counts only.

**Files:** `supabase-seed-prayers.sql`, `supabase-get-last-prayer-at.sql`, script.js (wireRealPrayerCounter, updateLastPrayerBadge).

---

## Social & invites

- **Share streak:** Copies message + URL. Invite param `?invite=X` is client-side only (for referral/streak repair); no server-side tracking.
- **Auto-tweet:** Client-side only (`window.open` to twitter.com/intent/tweet). No backend.
- **Stories card:** One hardcoded quote (anonymized). Mailto for new submissions — no form to DB yet.

**No auth required, no server-side logging for these actions.**

---

## Battle Pro micro-launch

- **Stripe:** Use real Checkout URLs from dashboard (test mode first). Redirect to Stripe hosted page — no card data on your site.
- **Homepage button:** Redirect only. Success: verify via **webhook only** (signature check, idempotency, async fulfill). See `supabase/functions/stripe-webhook/README.md`.
- **Timer:** Pure JS countdown — no DB. Early Bird "ends in X days" runs client-side.

---

## Polish & SEO

- **Alt text / meta:** Static in HTML. No new endpoints, no auth.
- **Schema:** JSON-LD in head (WebApplication, WebSite). No dynamic data.

---

## Security lock-in before push

1. **Run** `npm run test` — all green.
2. **Run** `docs/MANUAL-TESTING-CHECKLIST.md` — focus §3 Auth, §4 Pricing, §7 mobile.
3. **DevTools:** Check response headers (CSP, HSTS), no console errors or leaked keys.
4. **Supabase:** Confirm RLS on all tables — anon cannot SELECT from `profiles`, `user_sync_data`, `newsletter_signups`, etc. (Only anon INSERT on `newsletter_signups` and `prayers` as intended.)
5. **Git:** `git add -A`, **skip config.js** if it has live keys (`git reset config.js`), then:
   ```bash
   git commit -m "Secure quick wins: email anon policy, seeded wall, share button, Pro button, SEO"
   git push
   ```

No shortcuts. Start with the email policy (run `supabase-newsletter-anon-insert.sql` in dashboard — 5 min). Then seed, test, push.
