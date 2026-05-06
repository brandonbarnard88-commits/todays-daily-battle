# Release Runbook (Fort Knox Mode)

Use this exact order for a secure release.

## A) Preflight

```bash
cd "/Users/brandonbarnard/Desktop/todaysdailybattle-site"
git status --short --branch
```

If you see unexpected files, pause and review before continuing.

## B) Build and test

```bash
npm run build
npm run test:site
```

Expected: `All checks passed.`

## C) Security scan (quick)

```bash
rg "service_role|SUPABASE_SERVICE_ROLE|STRIPE_SECRET|sk_live_|TURNSTILE_SECRET|BEGIN PRIVATE" .
```

Expected: docs/edge-functions references only, no frontend secret literals.

## D) Supabase migration (SQL Editor)

Run the full file:

- `supabase-rls-lockdown.sql`

This includes `user_prayers` and owner-only RLS policies.

## E) RLS verification commands

Set vars:

```bash
export SUPABASE_URL="https://YOUR_PROJECT_REF.supabase.co"
export ANON_KEY="YOUR_ANON_KEY"
export USER_JWT="USER_ACCESS_TOKEN"
```

Anon should not read private rows:

```bash
curl -s "$SUPABASE_URL/rest/v1/user_prayers?select=*&limit=1" \
  -H "apikey: $ANON_KEY" \
  -H "Authorization: Bearer $ANON_KEY"
```

Authenticated should only read own rows:

```bash
curl -s "$SUPABASE_URL/rest/v1/user_prayers?select=user_id,created_at,village_code&order=created_at.desc&limit=3" \
  -H "apikey: $ANON_KEY" \
  -H "Authorization: Bearer $USER_JWT"
```

## F) Manual smoke (mobile first)

1. **Pray flow**
   - Tap Pray
   - Overlay shows for ~3s
   - Counter increases after overlay ends (not earlier)

2. **Prayer badge modal**
   - Tap badge -> modal opens
   - Close with X / backdrop / Escape

3. **Catch-up (5+ missed days)**
   - Prompt appears
   - Uses avatar progression from `avatar-progress`
   - Swipe and auto progression both work

## G) Commit + push

```bash
git add -A
git commit -m "Harden prayer counter timing, avatar catch-up progression, RLS and release safeguards"
git push origin main
```

## H) Rollback plan

If production issue appears:

```bash
git log --oneline -n 5
git revert <bad_commit_hash>
git push origin main
```

Do not use force push on `main`.
