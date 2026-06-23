# seed-daily-battle

Ensures today's row exists in `daily_battles`. If there is no row for today, inserts one with a default verse (Psalm 46:1).

## Recommended: Use the guided deploy script (one command)

From the repo root:

```bash
./scripts/deploy-seed-function.sh
```

This script will:
- Check for the Supabase CLI and log you in
- Deploy the function
- Interactively help you set the two required secrets (`SUPABASE_URL` + `SUPABASE_SERVICE_ROLE_KEY`)

After it finishes, verify with:

```bash
./scripts/test-seed-function.sh
```

## Manual / Advanced

### Deploy only

```bash
supabase functions deploy seed-daily-battle --project-ref rixsnhpwrlbvvymkfamj
```

### Secrets

The function requires these two environment variables (set at project level or on the specific Edge Function):

- `SUPABASE_URL` = `https://rixsnhpwrlbvvymkfamj.supabase.co`
- `SUPABASE_SERVICE_ROLE_KEY` = (from Supabase Dashboard → Settings → API → `service_role` key)

You can set them via the dashboard (Edge Functions → seed-daily-battle → Secrets tab) or with the CLI:

```bash
supabase secrets set --project-ref rixsnhpwrlbvvymkfamj \
  SUPABASE_URL=https://rixsnhpwrlbvvymkfamj.supabase.co \
  SUPABASE_SERVICE_ROLE_KEY=eyJ...
```

## Schedule / Invocation

The function is currently called by the GitHub Action `.github/workflows/seed-daily-battle.yml` (daily at ~00:05 UTC, with manual trigger support).

**Response format:** `{ "ok": true, "date": "YYYY-MM-DD", "action": "inserted" | "already_exists" }`

For reference only (not recommended as primary method):
- You can also add a Supabase pg_cron or external scheduler (cron-job.org, etc.) that POSTs to `https://rixsnhpwrlbvvymkfamj.supabase.co/functions/v1/seed-daily-battle`.

See the main project `DEPLOY-2026-05-31-SWOOP-AND-FIXES.md` for the full context of the 2026-05-31 recovery session.
