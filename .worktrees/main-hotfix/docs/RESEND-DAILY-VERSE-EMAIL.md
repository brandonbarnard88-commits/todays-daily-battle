# Daily Verse Email (Resend)

Sign-ups for the daily verse and Battle Plan are stored in **Supabase** in `newsletter_signups` (email, `daily_opt_in`, `weekly_opt_in`, `preferred_time`). Use **Resend** (free tier: 3k emails/month) to send the daily verse to subscribers.

## 1. Supabase

- Run **supabase-newsletter-columns.sql** and **supabase-newsletter-anon-insert.sql** so the table exists and anon can INSERT.
- Columns used: `email`, `daily_opt_in`, `weekly_opt_in`, `preferred_time`, `created_at`.

## 2. Get today’s verse

- **Option A:** Query Supabase `daily_battles` for today (by date) and use `ref`, `verse`, `reflection`, `prayer`.
- **Option B:** If you don’t have `daily_battles` in Supabase, use the same source as the site (e.g. seed or API that returns today’s verse).

## 3. Resend setup

- Sign up at [resend.com](https://resend.com), add and verify your domain.
- Create an API key. Store it as `RESEND_API_KEY` (server-side only).
- Optional: create a template in Resend for “Daily verse” and reference it by ID.

## 4. Send daily verse (Node example)

Run this once per day via **cron** (e.g. 9 AM server time). It fetches signups with `daily_opt_in = true`, gets today’s verse, and sends via Resend.

```js
const { createClient } = require('@supabase/supabase-js');
const { Resend } = require('resend');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);
const resend = new Resend(process.env.RESEND_API_KEY);

async function getTodaysVerse() {
  const today = new Date().toISOString().slice(0, 10);
  const { data } = await supabase
    .from('daily_battles')
    .select('ref, verse, reflection, prayer')
    .eq('date', today)
    .single();
  return data || { ref: 'Psalm 23:1', verse: 'The Lord is my shepherd; I shall not want.', reflection: '', prayer: '' };
}

async function sendDailyVerse() {
  const verse = await getTodaysVerse();
  const { data: signups } = await supabase
    .from('newsletter_signups')
    .select('email, preferred_time')
    .eq('daily_opt_in', true);

  if (!signups?.length) return;

  const verseLine = (verse.ref || '') + (verse.verse ? ': ' + verse.verse.replace(/<[^>]+>/g, ' ').trim().slice(0, 200) : '');
  const html = `
    <h2>Today's verse</h2>
    <p><strong>${verse.ref || 'Today\'s verse'}</strong></p>
    <p>${(verse.verse || '').replace(/<[^>]+>/g, ' ').trim().slice(0, 400)}</p>
    <p><a href="https://todaysdailybattle.com">Open Today's Daily Battle</a></p>
    <p style="color:#94a3b8;font-size:12px;">You're getting this because you signed up for the daily verse. <a href="mailto:support@todaysdailybattle.com?subject=Unsubscribe">Unsubscribe</a>.</p>
  `;

  for (const row of signups) {
    await resend.emails.send({
      from: 'Today\'s Daily Battle <verse@todaysdailybattle.com>',
      to: row.email,
      subject: `Your daily verse: ${verse.ref || 'Today\'s verse'}`,
      html,
    });
  }
}
```

- **Preferred time:** To respect `preferred_time`, run the cron every hour and only send to rows where `preferred_time` matches (e.g. `"09:00"` or `"morning"`), or run once at 9 AM and send to all daily opt-ins.
- **Weekly:** For `weekly_opt_in`, add a separate job (e.g. Monday 9 AM) that sends a “Weekly encouragement” email with a few verses or a roundup.

## 5. Where to run

- **Vercel Cron:** Add a serverless function and set `vercel.json` cron to `0 9 * * *` (9 AM daily).
- **Supabase Edge Function:** Create a function that runs on a schedule (or call it from an external cron), fetches verse + signups, and calls Resend’s API (fetch to `https://api.resend.com/emails`).
- **GitHub Actions:** Schedule a workflow that runs a small Node script to do the above.

Once this is in place, the existing homepage forms (“Get tomorrow’s verse emailed” and “Join the Battle Plan” with daily checked) will have already stored emails in `newsletter_signups`; the cron + Resend will deliver the daily verse.
