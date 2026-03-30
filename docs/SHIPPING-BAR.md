# Internal shipping bar — “done everywhere”

This is the **definition of done** for tool pages and calm hubs. Ship **A** work only when a hub is being upgraded; otherwise use this as a **dimension pass** checklist (offline, a11y, copy, analytics) rather than one giant project.

## Definition of done (release bar)

Before marking a release or major pass **complete**, confirm:

1. **Offline or honest** — Every tool works from cache / local storage where promised, or states clearly what does not work offline and why.
2. **Labels + focus** — Every interactive control has a visible or screen-reader name; `:focus-visible` is never removed for primary actions.
3. **Saves** — On-device saves use calm copy that confirms **on this device** / **privately**; signed-in sync paths say when data syncs across devices.
4. **No silent failures** — Errors use `aria-live` or visible copy; retry / export / reconnect when reasonable.
5. **Copy** — First screen, empty, success, and error strings match the **quiet friend at dawn** tone (site rules); no fluff or generic filler.
6. **Analytics** — New or changed controls use **`trackEvent`** with **privacy-safe** params only, documented in `PRIVACY-ANALYTICS.md`; search uses **`trackSearchAnalytics`** only.

**Automated gate (static + wiring):** `npm run build` then `npm run test:site -- --offline` (and `npm run test`, `npm run test:security` per `.cursorrules`).

## Non‑negotiables (every tool)

1. **Offline or honest** — Either core value works from cache / local storage, or one clear line explains what failed and what still works. No blank panels after network or storage errors.
2. **Labeled + focusable** — Every interactive control has a visible or screen-reader name; `:focus-visible` is never removed.
3. **Saves are honest** — On-device saves say they stay on the device; sync-dependent flows say when sync will resume.
4. **No silent failures** — Errors surface in copy or a live region; recovery (retry, export, reconnect) when reasonable.
5. **Overlays / sheets** — Focus trap, Escape to dismiss, `aria-modal="true"` where appropriate, live region for async status (match the best modal on the site).
6. **Analytics** — Meaningful controls use `trackEvent` with **privacy-safe** params only (see `PRIVACY-ANALYTICS.md`). Search flows use **`trackSearchAnalytics` only**, never raw query text.
7. **Security** — Paths touching storage, auth, or user text follow `SECURITY.md`; “client-only” is stated calmly in UI where it matters.

## Passes (run by dimension)

| Pass | Question |
|------|----------|
| Surface parity | For Study this verse, Listen, word study, save / memorize / journal / print, offline line — does this page match the best shipped version? |
| Offline + error honesty | One reviewed string per tool when offline or storage fails; fallback path (cache, last good state). |
| Accessibility | Mobile width, keyboard, screen reader; diff against the strongest sheet (e.g. word study / verse study). |
| Performance | Defer non-critical scripts where safe; no duplicate listeners; one narration / study init path per page. |
| Copy | First screen, error, success, empty — specific, quiet tone; banned fluff per site rules. |
| Analytics hygiene | Event names consistent; docs updated in `PRIVACY-ANALYTICS.md` when adding events. |
| Security + docs | Quick scan vs `SECURITY.md` / RLS notes for new behavior. |
| Lexicon | Ongoing content wave by theme (comfort, prayer, fear, …); build via `npm run build` pipeline. |

## Manual smoke (~5 minutes per tool)

1. Open the page cold.  
2. Primary user action (search, save, listen, etc.).  
3. DevTools offline (or airplane mode).  
4. Narrow viewport (~360px).  
5. Tab through primary actions; Escape from any overlay you opened.

### Verse Study overlay (manual smoke, ~2 minutes)

Run on a page that opens the sheet (e.g. **`bible-tool.html`** after a successful lookup → **Study this verse**, or **Study workspace** paths that call `TDBVerseStudy.open`):

1. **Open** — Sheet appears; focus moves sensibly; **Escape** or backdrop closes it.  
2. **Keyword** — Tap a word in the verse or a chip; gloss / preview opens without a blank panel.  
3. **Listen** — **Listen** starts on-device narration; **Stop** stops; **Repeat** (if shown) restarts; optional speed / undertone controls persist without errors.  
4. **Saves** — **Save to My Study**, **Add to your memory list**, **Save to What God has done** (if used): status confirms **privately / on this device** (or equivalent).  
5. **Offline** — DevTools → **Offline**; top strip or page copy states offline honestly; cached verse / notes behavior matches expectations (no silent empty crash).

Full dimension passes remain in the table below; this block is the **regression anchor** for Verse Study.

## Grade (optional hub audit)

**A** — Meets all non‑negotiables for that hub.  
**B** — Usable; gaps documented with owner and pass name.  
**C** — Do not ship new features here until raised to B.

“100% done” here means **no weak room in the house** — not a single finish line. Prefer **dimension-first** passes (e.g. offline everywhere, then a11y everywhere) over random polish.
