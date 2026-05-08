# Performance Ops Runbook

This runbook keeps mobile performance high without removing content, KJV focus, offline behavior, or privacy defaults.

## 1) Cloudflare Challenge Tuning (Highest Leverage)

Lighthouse and low-end mobile TBT are currently dominated by Cloudflare challenge script execution on public read pages.

### Goal
- Keep bot protection on sensitive routes.
- Reduce challenge overhead on read-only core routes:
  - `/`
  - `/index.html`
  - `/reader`
  - `/reader.html`

### Recommended Rule Set
Create or update WAF custom rules in this order:

1. **Allow / skip challenge for read-only core pages**
   - If `http.request.method eq "GET"` and path is one of the four routes above
   - Action: `Skip` managed challenge/bot challenge
   - Keep baseline security headers and cache behavior unchanged

2. **Keep challenge/rate limit for sensitive surfaces**
   - Auth endpoints
   - Supabase function proxies
   - Form submissions / POST routes
   - Admin paths

3. **Rate-limit noisy clients on sensitive paths only**
   - Do not apply strict rate-limit to homepage or reader GET route

### Verify After Change
- Re-run:
  - `npm run audit:lighthouse:live`
- Confirm:
  - Reader TBT drops sharply
  - Long tasks from `cdn-cgi/challenge-platform/...` are reduced or gone

## 2) Lighthouse CI Guardrail

The repository now includes mobile Lighthouse CI checks in GitHub Actions:
- Workflow: `.github/workflows/lighthouse-ci.yml`
- Script: `npm run audit:lighthouse:ci`
- Thresholds:
  - Performance: `>= 70`
  - Accessibility: `>= 90`
  - Best Practices: `>= 85`

If scores regress below threshold, CI fails.

## 3) Reader Architecture Split (Phase 1 Complete)

Reader now has a dedicated core bootstrap:
- `reader-core.js`

Phase 1 extraction includes:
- Fallback chapter rendering
- Reader control wiring
- Deferred enhancement module loading trigger

This keeps initial reader payload focused and makes deeper module splitting safer in follow-up phases.

## 4) Operational Checklist Before Shipping Performance Changes

Run:
- `npm run test:site`
- `npm run audit:lighthouse:live`

Record:
- Home + Reader Performance, LCP, TBT, CLS
- Largest long-task URL source

If regressions appear:
- Check for new render-blocking scripts in `reader.html` or `index.html`
- Check if challenge script is reappearing on read-only routes
- Verify deferred modules are still intent/idle loaded
