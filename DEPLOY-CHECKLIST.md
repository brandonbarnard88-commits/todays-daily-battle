# Deploy checklist — Before each release

Use this list so deployments stay secure and users get fresh code.

---

## 1. Config (production)

- [ ] **No placeholders in production** — Deployed `config.js` must not contain `your-project-ref` or `your-anon-key`. Use real Supabase URL and anon key (from Supabase Dashboard → Settings → API). Keep `config.js` in `.gitignore` or use build-time env so secrets are never committed.
- [ ] **Script will warn in dev** — On localhost, if `TDB_CONFIG` still has placeholders, `script.js` logs a console warning. Fix before deploying.

---

## 2. Security test

```bash
node test-security.js
# or: npm run test:security
```

- [ ] All defense checks pass (exit code 0). Fix any FAIL before release. Review warnings (placeholder, innerHTML, MASTER_EMAIL) as in AUDIT-REPORT.md.

---

## 3. Site test (optional but recommended)

```bash
# Terminal 1: serve the site
python3 -m http.server 8765

# Terminal 2: run tests
node test-site.js
# or: npm run test:site
```

- [ ] All listed pages return 200 and contain expected content. Fix any FAIL.

---

## 4. Cache & service worker

- [ ] After changing **script.js** or **config.js**, deploy and do a hard refresh (or clear site data) once — the service worker does **not** cache `script.js` or `config.js`, so new versions load on next visit.
- [ ] After changing **HTML or styles**, bump `CACHE_NAME` in `service-worker.js` (e.g. `tdb-static-YYYYMMDD`) so returning users get the new shell. Already bumped when you bump `?v=` on script/styles in HTML.

---

## 5. Lighthouse (manual)

- [ ] Run [Lighthouse](https://developers.google.com/web/tools/lighthouse) (Chrome DevTools → Lighthouse) on:
  - `/` (home)
  - `/bible-tool.html`
  - `/verse.html`
- [ ] Aim for green on Performance, Accessibility, Best Practices. Fix the top 2–3 issues if anything is red.

---

## 6. 404s and analytics

- [ ] After deploy, review **server logs** or **analytics** for 404 paths to find broken links or old URLs. The 404 page does not send analytics by default; configure your server or error tracking (e.g. Cloudflare, Vercel) to log 404s if desired.

---

## 7. Quick post-deploy check

- [ ] Open home, Bible Tool, Reader, Study Tools — no console errors, dropdowns and tools work.
- [ ] Turn off network (DevTools → Network → Offline), reload — offline banner appears on home, Bible Tool, Reader.

---

*Last updated March 2026.*
