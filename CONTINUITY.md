# This can never die

Today's Daily Battle is built to **last**. This document makes sure the site, the data, and the mission can survive anything: account changes, handoff, disaster, or time.

---

## What “never die” means

- **The site stays up** — hosting and domain are documented; anyone with access can keep it running.
- **The data survives** — backups exist; Supabase and config can be restored.
- **The mission continues** — terms, privacy, and security are locked in; a successor can take over without starting from zero.

---

## Where everything lives

| What | Where | Who can restore |
|------|--------|------------------|
| **Code** | This repo (GitHub). Static HTML/CSS/JS, Supabase Edge Functions in `/supabase/functions`. | Anyone with repo access; deploy via Cloudflare Pages. |
| **Database** | Supabase (Postgres). Auth, profiles, messages, prayers, daily_battles, sync data, etc. | Project owner; backups via Supabase or pg_dump. |
| **Secrets** | Supabase Dashboard (API keys, Edge Function secrets); Cloudflare Pages env vars (build-time config); Stripe Dashboard. | Same; store backup of env vars in a secure, private place. |
| **Domain** | Cloudflare (DNS) or registrar. todaysdailybattle.com. | Domain owner; keep login and 2FA recoverable. |
| **Hosting** | Cloudflare Pages (static site). | Cloudflare account owner; redeploy from GitHub. |
| **Payments** | Stripe (subscriptions, webhook). | Stripe account owner; webhook URL points to Supabase Edge Function. |

---

## Backups (do these so it can never die)

### 1. Supabase

- **Dashboard:** Supabase → **Database** → **Backups** (if on a plan with automated backups). Enable and keep retention as long as possible.
- **Manual:** Periodically export critical tables or use **pg_dump** (Supabase gives you the connection string in Settings → Database). Store encrypted (e.g. password-protected archive in a second location).
- **What to back up:** `auth.users`, `public.profiles`, `public.user_sync_data`, `public.daily_battles`, `public.messages`, `public.prayers`, `public.newsletter_signups`, and any other tables you care about.

### 2. Config and secrets

- **Never commit** `config.js` or real keys to the repo (see **SECURITY-LOCKDOWN.md** and **SECURITY.md**).
- **Write down** (in a secure, private place only you or a successor can access):
  - Supabase project ref, `SUPABASE_URL`, `SUPABASE_ANON_KEY` (and that **service_role** is only in Supabase secrets / Edge Functions).
  - Cloudflare Pages env vars (list of names; values in a password manager or encrypted note).
  - Stripe webhook URL and that **STRIPE_WEBHOOK_SECRET** and Stripe secret live only in Supabase Edge Function secrets.
  - Domain registrar and Cloudflare login (or “where to find them”).
- **Build:** `build-config.js` + env vars in Cloudflare recreate `config.js` on deploy (see **DEPLOY-CLOUDFLARE.md**).

### 3. Repo

- **GitHub** is the source of truth. Ensure the repo is under an account or org that will outlast you (e.g. org with another owner, or instructions in a will/trust).
- **Branches/tags:** Tag releases if you want (e.g. `v1.0`). Main branch is deployable.

---

## Recovery (if something goes wrong)

- **Site down / blank:** Redeploy from Cloudflare Pages (Deployments → Retry, or push to GitHub). Confirm env vars are set so `config.js` is built.
- **Database lost:** Restore from Supabase backup or from your pg_dump. Re-run RLS scripts if you restored to a new project: **supabase-rls-lockdown.sql**, **supabase-rls-lockdown-extended.sql**, **supabase-profiles-tier.sql**, **SUPABASE-SYNC-TABLES.md**.
- **Domain lost:** Regain access via registrar/Cloudflare recovery; point DNS back to Cloudflare Pages. Doc the registrar and 2FA method in your secure note.
- **Secrets rotated:** Update Cloudflare env vars and Supabase Edge Function secrets; redeploy. See **SECURITY.md** (“If something is compromised”).

---

## Handoff (so someone else can keep it alive)

Give a **successor** (partner, org, buyer, family):

1. **This repo** — GitHub access (or a copy) and **DEPLOY-CLOUDFLARE.md**.
2. **One-page runbook** with:
   - Supabase project URL and how to get anon key (Dashboard → Settings → API).
   - Cloudflare: Pages project, build command, where env vars are.
   - Stripe: where webhook is configured, that the secret is in Supabase.
   - Domain: where it’s registered and where DNS is (Cloudflare).
3. **SECURITY-LOCKDOWN.md** and **CONTINUITY.md** (this file) — so they know how the app is locked down and how to back up and restore.
4. **Access:** Supabase owner/team, Cloudflare account, Stripe account, domain. Keep 2FA recovery options (e.g. backup codes) somewhere they can be found.

---

## What’s already done so it can never die

- **No critical secrets in the repo** — only anon key in build-time config; service_role and Stripe secrets stay in Supabase/Stripe.
- **Static front end** — works with any host that serves HTML/JS; Cloudflare Pages is one choice.
- **Database behind RLS** — **supabase-rls-lockdown.sql** and **supabase-rls-lockdown-extended.sql** ensure data stays protected even after a restore.
- **Legal and security docs** — **SECURITY-LOCKDOWN.md**, **terms.html**, **privacy.html** — so the rules and commitments are clear for you and any successor.

---

**Bottom line:** Back up Supabase and your secrets; document where everything lives and how to deploy and recover; and give one person (or org) a path to take over. Then the site, the data, and the mission can outlast any single person—**this can never die**.
