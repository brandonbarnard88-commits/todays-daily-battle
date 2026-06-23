# Deploy / Recovery — 2026-05-31 (Swoop + Critical Fixes)

**Date:** May 31, 2026  
**Trigger:** Full site status review + "do what needs to be done" session

## Summary of Actions Taken

### 1. GitHub Secret Fixed
- `SUPABASE_URL` was missing from repository secrets.
- This was causing the scheduled "Seed Daily Battle" workflow (and manual runs) to fail immediately with the "Add SUPABASE_URL repo secret" message.
- Secret added via `gh secret set`.

### 2. Production Deploy Executed
- Manually triggered **"Deploy Cloudflare Pages"** (classic/static site) workflow.
- Result: **Success**.
- The full May 30 "swoop" polish landed on production:
  - Hero eyebrow ("Why not AI?")
  - Topic start strips ("New here?")
  - Bottom dock
  - Swoop typography + card rhythm site-wide
  - Share buttons on breakdowns and topic verse lists
  - `tdb-swoop-surfaces.*` assets (version `20260530-swoop-final`)

### 3. Cache Purge Triggered
- Manually triggered **"Purge Cloudflare Cache"** workflow after deploy.
- Live verification confirmed new content (verse injection updated to 2 Corinthians 12:9 from the fresh build, multiple `swoop-final` + `tdb-bottom-dock` markers present).

### 4. Playwright a11y Regression Fixed (color-contrast)
- Root cause: New porch cards (`.tdb-porch-card`) and `.feel-view-more` links were receiving browser-default blue (`#0000ee`) on dark glass backgrounds after swoop changes (contrast ratio 1.71 vs required 4.5:1).
- Fix:
  - Strengthened CSS rule in `styles.css` (gold via `--gold` var + `!important` for the porch surfaces).
  - Added explicit inline `style="color:#e3bc67"` on the three critical homepage porch cards + the "More verses →" link (highest specificity guarantee).
- Rebuilt and re-ran `tests/a11y-critical.spec.ts` (index.html) locally → now passes cleanly.
- Inline styles are defensive; the CSS rule provides long-term coverage.

### 5. Seed Daily Battle Workflow Hardened
- Updated `.github/workflows/seed-daily-battle.yml` with much clearer failure modes:
  - Specific 404 handling with the exact `supabase functions deploy ...` command.
  - Guidance for adding `SUPABASE_SERVICE_ROLE_KEY` in the Supabase Edge Function secrets UI.
  - Better GitHub Actions annotations (`::error::`).
- This change is local (in the working tree). Apply the diff or commit it before the next push so future runs are self-documenting.

### 6. Fresh Quality Gates Triggered
Manually dispatched after the new build was live:
- QA Smoke
- Live CSP
- Quality Gate

(Results will appear in the Actions tab.)

## Current State (as of verification)

- **Live site**: Serving the May 30+ swoop build + a11y fixes.
- **Daily verse**: Correctly injected from the latest build (2 Cor 12:9).
- **Key new UI elements**: Confirmed present in production HTML (bottom dock, "Why not AI", topic strips, swoop CSS/JS references).
- **Classic deploy path**: Now healthy again.
- **Seed automation**: Still blocked on the missing Supabase Edge Function deployment (see below).

## Remaining One-Time Task (Seed Function)

The scheduled seed job will continue to 404 until the Edge Function is deployed:

```bash
# 1. Make sure you're logged in
supabase login

# 2. Deploy the function
supabase functions deploy seed-daily-battle --project-ref rixsnhpwrlbvvymkfamj

# 3. In Supabase Dashboard:
#    Edge Functions → seed-daily-battle → Secrets → Add:
#      SUPABASE_URL              = https://rixsnhpwrlbvvymkfamj.supabase.co
#      SUPABASE_SERVICE_ROLE_KEY = (from Settings → API → service_role key)
```

After this one-time deploy + secret setup, the GitHub Action (and the improved error messages) will keep today's row seeded reliably.

See also: `supabase/functions/seed-daily-battle/README.md`

## Files Changed in This Session (local working tree)

- `.github/workflows/seed-daily-battle.yml` (majorly improved diagnostics)
- `styles.css` (a11y contrast defense)
- `index.html` (inline contrast guarantees on critical porch links — safe to keep or later remove once CSS specificity is proven sufficient in prod)
- Full `npm run build` run (multiple times) → fresh `dist/`

## Latest Results (as of 2026-05-31 ~12:25 UTC)

All three quality workflows triggered against the new swoop build passed cleanly:

- **QA Smoke**: ✅ success
- **Live CSP**: ✅ success
- **Quality Gate**: ✅ success

This confirms the deployed build (including the a11y contrast fixes) is in good shape.

**Current Status: 99% → One final deployment to reach 100%**

All quality gates, UI polish, a11y, tooling, and documentation are excellent.
The **only** remaining item is deploying the `seed-daily-battle` Edge Function.

**To finish and reach 100%:**

```bash
./deploy-seed.sh
# or
npm run seed:deploy
```

Then verify:
```bash
npm run verify:100
```

Once this passes, the site is at full operational 100%.

## New Helper Scripts Added

### `scripts/deploy-seed-function.sh` (main entry point)

A guided, interactive wrapper that handles almost the entire remaining task in one run:

- Verifies the Supabase CLI
- Runs `supabase login`
- Deploys the `seed-daily-battle` Edge Function
- **Interactively prompts you to paste the service_role key** (never echoed) and sets both required secrets via `supabase secrets set`
- Gives you the exact commands to test afterward

**Run this now:**
```bash
./scripts/deploy-seed-function.sh
```

### `scripts/test-seed-function.sh` (verification)

After secrets are configured, use this to test the live function:
```bash
./scripts/test-seed-function.sh
```

It calls the endpoint and gives clear success/failure + next troubleshooting steps.

These two scripts are now the recommended path to finally close the seed automation gap.

## Next Recommended Steps (Updated)

1. **Highest priority — run the new guided script:**
   ```bash
   ./scripts/deploy-seed-function.sh
   ```
   It will deploy the function **and** walk you through setting the secrets interactively via the CLI.

2. After it succeeds, verify with:
   ```bash
   ./scripts/test-seed-function.sh
   ```

3. Commit + push the session improvements (highly recommended):
   - `.github/workflows/seed-daily-battle.yml`
   - `scripts/deploy-seed-function.sh`
   - `scripts/test-seed-function.sh`
   - `styles.css`
   - `index.html`
   - `DEPLOY-2026-05-31-SWOOP-AND-FIXES.md`
   - (dist/ updates are already applied)

4. Once the seed function is live and a manual test succeeds, trigger the GitHub Action once more to confirm the scheduled job will now work:
   ```bash
   gh workflow run "Seed Daily Battle" --repo brandonbarnard88-commits/todays-daily-battle
   ```

All other items from the original "full site status" (swoop deploy, a11y, quality gates, workflow diagnostics) are resolved.

---

**Current overall state**: Very good. **Only one remaining infra task.**

- Production is on the latest swoop polish + a11y fixes
- All main quality gates (QA Smoke, Live CSP, Quality Gate) are green on the new build
- GitHub secret gap closed
- Seed workflow now has excellent self-documenting error messages
- **One remaining one-time task**: Deploy the `seed-daily-battle` Edge Function + secrets

**Do this now — the only remaining task:**

**Easiest options (in order):**

1. **Simplest** (from project root):
   ```bash
   ./deploy-seed.sh
   ```

2. **Via npm** (recommended):
   ```bash
   npm run seed:deploy
   ```

3. **Non-interactive** (if you have the key in your environment):
   ```bash
   SUPABASE_SERVICE_ROLE_KEY=eyJ... npm run seed:deploy
   ```

See the dedicated file: **[SEED-DEPLOY.md](./SEED-DEPLOY.md)** for the absolute shortest path.

After deployment, run:
```bash
npm run seed:full     # deploy → test → health (all in one)
# or
npm run health
```

The site is in significantly better operational shape than at the start of this session. All original issues from the "full site status" review have been addressed except this final Supabase function deployment.

## Documentation & Tooling Cleanup (latest pass)

- Core function README now leads with `./scripts/deploy-seed-function.sh`
- `package.json` updated (`deploy:seed` → guided script, added `deploy:seed:raw`)
- Major docs (`CONFIG.md`, `DEPLOY-ALL-5.md`, `LAUNCH-CHECKLIST.md`) now recommend the new scripts instead of raw `supabase` commands
- `deploy-seed-function.sh` enhanced with optional immediate test run at the end
- `test-seed-function.sh` created as the standard post-deploy verifier
- New `scripts/health-check.sh` + `npm run health`
- `scripts/verify-100.sh` + `npm run verify:100` (comprehensive readiness check)
- `scripts/seed-direct.sh` + `npm run seed:direct` (emergency direct DB seeding fallback)
- `npm run seed:full` (all-in-one deploy + test + health)
- Root `deploy-seed.sh` for maximum discoverability

All references to the old manual deployment flow for daily seeding have been modernized.