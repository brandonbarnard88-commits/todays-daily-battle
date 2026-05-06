# Site Audit Response (Summary)

This doc tracks the audit findings and what’s done vs. placeholder-by-design vs. to-do.

---

## How the checklist improves during an audit

When you run or receive an audit, use it to make checklists better so the same gaps don't recur:

1. **Turn findings into checklist items**  
   For each finding (e.g. "Run Lighthouse," "Add RLS on table X," "Add Copy summary button"), add a concrete checkbox to the right checklist:
   - **Security / RLS / headers** → **docs/SECURITY-CHECKLIST-PRE-LAUNCH.md** or **docs/LOCKDOWN.md**
   - **Manual flows (auth, pricing, key pages)** → **docs/MANUAL-TESTING-CHECKLIST.md**
   - **Deploy / build (503s, topic pages)** → **docs/POST-PUSH-CHECKLIST.md** or **DEPLOY_AND_TEST.md**
   - **Supabase schema / tables** → **admin.html** "Supabase Checklist" (add missing table/column so future deploys verify it)

2. **Cross-reference this doc**  
   Keep "Recommended next" and "Quick wins" in **SITE-AUDIT-RESPONSE.md** and add a line like "Added to MANUAL-TESTING-CHECKLIST §5" when you've turned an item into a recurring check.

3. **Close the loop**  
   After fixing an audit item, run the updated checklist once (e.g. MANUAL-TESTING or SECURITY-CHECKLIST) so the new item is validated and the checklist stays accurate.

4. **Re-scan / re-audit**  
   When you run a follow-up audit (e.g. security scanner, Lighthouse), treat new findings the same way: add to the appropriate checklist and document in this file or SECURITY-SCAN-FOLLOWUP.md.

Your **SECURITY-CHECKLIST-PRE-LAUNCH.md** already does this pattern ("this doc turns [reviewer feedback] into a concrete checklist"). Reuse that pattern for every audit so checklists stay the single source of "what we verify" and improve over time.

### During fine-tooth-comb testing

When you run thorough testing (e.g. **docs/FULL-SITE-TEST-CHECKLIST.md**, **docs/MANUAL-TESTING-CHECKLIST.md**, **TEST-CHECKLIST.md**, or **SITE-TEST-REPORT.md**–style pass):

- **Log every miss.** Any broken link, missing CTA, wrong state, or "I had to think about it" moment is a candidate for a new checklist item. Don't rely on memory—note the page, element, and expected behavior.
- **Add regression checks.** If you found a bug during fine-tooth-comb testing, add a one-line check to the right checklist (e.g. "Pricing: Stripe links open in new tab" or "Church: search results show after 2+ chars") so you re-verify it before the next release.
- **Tighten existing items.** If a checklist line was vague and you had to guess what "works" meant, replace it with a concrete step (e.g. "Click Subscribe → success toast and no console errors").
- **Cross-check with audit.** If fine-tooth-comb testing surfaces the same area an audit did (e.g. accessibility, 503s), ensure both the audit follow-up and the test checklist have a corresponding item so neither is dropped next time.

---

## 503 on topic-anxiety (and topic pages) (and topic pages)

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
