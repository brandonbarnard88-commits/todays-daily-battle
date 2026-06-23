# Seed Daily Battle Function — Final Deployment

**Status:** This is currently the **only remaining infrastructure blocker**.

Once this is done, the daily `seed-daily-battle` Edge Function will keep the `daily_battles` table populated, the GitHub Action will succeed, and the recurring 404s will stop.

---

## One Command (Recommended)

From the project root, the absolute simplest way:

```bash
./deploy-seed.sh
```

Or via npm:

```bash
npm run seed:deploy
```

**Non-interactive** (if you already have the key):

```bash
SUPABASE_SERVICE_ROLE_KEY=eyJ... ./deploy-seed.sh
# or
SUPABASE_SERVICE_ROLE_KEY=eyJ... npm run seed:deploy
```

These run the guided script that:
- Deploys the Edge Function
- Helps you set the two required secrets (interactively or from env var)
- Offers to immediately test the result

---

## Alternative Commands

| Command                | Purpose                                      |
|------------------------|----------------------------------------------|
| `npm run seed:deploy`  | Full guided deploy + secrets (recommended)   |
| `npm run seed:test`    | Test the function after deployment           |
| `npm run seed:full`    | Deploy → Test → Health check (all-in-one)    |
| `npm run deploy:seed:raw` | Raw supabase deploy only                  |

---

## What the Function Needs

Two secrets (set at project level or on the Edge Function):

- `SUPABASE_URL` = `https://rixsnhpwrlbvvymkfamj.supabase.co`
- `SUPABASE_SERVICE_ROLE_KEY` = (from Dashboard → Settings → API → service_role key)

The guided script (`npm run seed:deploy`) will prompt you for the service role key and set them safely.

---

## After Deployment

1. Run `npm run seed:test`
2. (Recommended) Run the full health check:
   ```bash
   npm run health
   ```
3. Manually trigger the GitHub Action once to confirm:
   ```bash
   gh workflow run "Seed Daily Battle" --repo brandonbarnard88-commits/todays-daily-battle
   ```
4. Watch the scheduled run the next day (~00:05 UTC).

---

## Background

- The GitHub workflow `.github/workflows/seed-daily-battle.yml` calls this function daily.
- The function was never deployed to the live Supabase project (hence the 404s).
- Full context: see `DEPLOY-2026-05-31-SWOOP-AND-FIXES.md`

---

**Do this now:** `npm run seed:deploy`

Everything else from the May 2026 site status recovery is complete and green.