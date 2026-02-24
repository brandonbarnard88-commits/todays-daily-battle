# Site Audit Response (Summary)

This doc tracks the audit findings and what’s done vs. placeholder-by-design vs. to-do.

---

## 503 on topic-anxiety (and topic pages)

- **Repo:** `topic-anxiety.html` exists and is in `service-worker.js` CORE_ASSETS.
- **503 on live:** Usually deployment or host (e.g. Cloudflare Pages build, cache, or transient error). Check:
  - Cloudflare Pages build logs: confirm `topic-anxiety.html` is in the build output.
  - Dashboard → Pages → your project → Deployments → latest build → “Build output” or “Output directory.”
  - Re-deploy if the file was added after the last deploy.
- **No code change needed** unless the file is excluded by build config.

---

## Already functional (audit may have missed)

| Item | Where |
|------|--------|
| **Generate Share Card** | Button `#generate-share-card-30` is wired to `generateShareCard30()` in script.js. |
| **Quick Pray** | Saves to prayer list (localStorage), shows “Added!” toast, has Share after pray. |
| **Add to Home Screen** | PWA install prompt exists (`#install-cta`); shows when `beforeinstallprompt` fires and user hasn’t dismissed. |
| **Repair Streak** | Button `#streak-repair-btn` exists; visibility controlled by `checkStreakRepairVisibility()`. |
| **Verse size / Listen** | `#verse-font-size`, `#tts-rate`, `#tts-voice`, “Hear it” / TTS are wired in script.js. |
| **Tap for plain meaning** | Toggle exists; script shows/hides plain meaning. |
| **Clear Filters** | `#clear-filters` is wired. |

---

## Placeholder / coming-soon by design

- **Battle Pro** (March 2026): waitlist link only; no signup form in repo yet.
- **Notify me** (Pricing): links to waitlist; no embedded form yet.
- **Church / Prayer Wall**: Add prayer and church search are implemented (Supabase/local); if “non-functional,” check RLS and that the right pages (church.html, message.html) were tested.
- **Wins Report share**: “Quick Shareable Summary” can be improved with an explicit Share/Copy button (see below).

---

## Quick wins done in repo

- **Pray button:** `aria-label="Submit quick prayer"` added to `#quick-pray-btn` for accessibility.

---

## Recommended next (short-term)

1. **503:** Confirm topic pages are in the deployed build; re-deploy if needed.
2. **Accessibility:** Run Lighthouse (Chrome DevTools) and fix any remaining ARIA/focus issues.
3. **Wins Report:** Add a “Copy summary” or “Share” button that copies streak/summary text to clipboard.
4. **Performance:** script.js is large; consider code-splitting or lazy-loading non-critical paths later.
5. **Placeholders:** When ready, add a simple email-capture form for “Notify me” / waitlist and point it to your backend or a service.

---

## Audit sections (for reference)

- **Main page:** Placeholders called out; many are wired (see “Already functional” above). Polish: ARIA, tooltips, mobile stacking.
- **Church Center:** Add/Search are in church.html and script; verify Supabase and RLS if they don’t work live.
- **Pricing:** Notify me = waitlist link; add form when ready.
- **Wins Report:** Share button suggested; add copy-to-clipboard for summary.
- **Topic pages:** Fix 503 via deploy; then same polish as rest of site.

Use Lighthouse and GTmetrix for ongoing performance and accessibility scores.
