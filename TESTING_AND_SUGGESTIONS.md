# Today's Daily Battle — Testing Notes & Suggestions

Summary from testing the live site (todaysdailybattle.com) and reviewing the codebase. Use this as a checklist for improvements.

---

## What’s Working Well

- **Homepage** loads with clear hero, quick topics, filters, and “Featured Today’s Battle” section.
- **Search flow**: Empty state message, “No results” with topic suggestions, and “Bible data not loaded” message when fetch fails.
- **Chapter Reader**: Book/chapter dropdowns, prev/next, Open Chapter, Listen, KJV Audio; URL params (`?book=John&chapter=3` or `?ref=John 3:16`) apply on load and highlight the verse.
- **Mobile**: Sidebar toggles at 768px, overlay behavior and close-on-nav are wired.
- **Auth**: Redirect error/confirmation messages read from URL params; Master badge and admin link visibility are correct.
- **Daily Battle**: Renders from Supabase with fallback; reflection, prayer, red-letter styling, streak, share/listen buttons are present.

---

## Suggestions (by priority)

### High impact

1. **Support `?q=` on the homepage**  
   Schema.org already declares `SearchAction` with `?q={search_term_string}`. On load, read `q` from the URL, pre-fill the search input, and optionally run the search so “search from address bar” works and SEO/sitelinks search is honored.

2. **Loading state for Featured Today’s Battle**  
   `renderDailyBattleCard()` runs after `loadBible()` and can take a moment. Show a small “Loading…” or skeleton in `#daily-battle-card` until the verse is rendered so the section doesn’t look empty or broken on slow connections.

3. **Bible fetch and CORS**  
   `loadBible()` uses `fetch()` for `kjv.json`. If the site is opened from `file://` or a host that blocks the request, users see “Bible data not loaded.” The message already suggests “use a local server.” Consider: (a) a one-line note in the UI on first visit if `bible` is empty after load (e.g. “Having trouble? Open from https://todaysdailybattle.com”), or (b) ensuring the JSON is always served from the same origin (e.g. same path or CDN) to avoid CORS issues.

4. **Reader: open chapter from URL without clicking**  
   `applyReaderFromQuery()` runs after `refreshBibleView()` and correctly sets book/chapter and calls `selectReaderChapter()`. Verify on reader.html with `?book=John&chapter=3` (and optionally `&ref=John 3:16`) that the chapter opens and scrolls to the verse without requiring “Open Chapter” — it should already be open.

### Medium impact

5. **Search: reduce artificial delay**  
   Search click handler uses `setTimeout(..., 600)`. Consider a shorter delay (e.g. 100–150ms) or no delay, and rely on the existing loading spinner so the UI feels snappier.

6. **Reader: optional red-letter toggle**  
   index.html has a “Red letters” toggle; reader.html does not. If you want consistent behavior, add the same toggle (and shared state, e.g. localStorage) on the reader page so chapter text can show/hide Jesus’ words there too.

7. **Accessibility**  
   - Add a “Skip to main content” link at the top (visually hidden until focused) so keyboard/screen-reader users can jump past the header/nav.  
   - Ensure the loading spinner has `aria-live="polite"` (or similar) and that “Seeking God’s truth…” is associated so screen readers announce when search starts/finishes.

8. **Duplicate IDs across pages**  
   Multiple pages use the same `id` values (e.g. `email`, `password`, `sidebar-toggle`). They’re on different pages so only one is in the DOM at a time; no bug found, but be aware if you ever merge pages or use a SPA. Prefer unique IDs or avoid relying on IDs for shared components.

### Nice to have

9. **Empty Featured Battle**  
   If Supabase and fallback both fail, the card shows “Verse not available.” You could add a “Try again” button that re-runs `renderDailyBattleCard()` (and optionally refetches from Supabase).

10. **Today’s Battle section: KJV Audio**  
   Homepage has both “Listen (KJV)” (TTS) and “KJV Audio” (external link). Consider a short tooltip or label (e.g. “Listen here” vs “Open audio in new tab”) so the difference is clear.

11. **Stripe / pricing**  
   When Stripe URLs are missing, pricing buttons are disabled and the note shows “Subscriptions open soon — join the waitlist below.” That’s clear; when you go live, double-check env/config so the correct URLs are injected and the note updates or hides.

12. **60-second walkthrough**  
   The “How It Works (60 Seconds)” section says “A short walkthrough is coming soon.” When the video is ready, add the embed and optional transcript for accessibility.

---

## Quick manual test checklist

- [ ] Homepage: run a search (topic + reference like “John 3:16”); check empty search and “no results” states.
- [ ] Homepage: click a quick-topic button; confirm results and that filters (Audience, Testament, Book) apply.
- [ ] Homepage: toggle “Red letters”; run “Jesus Said” or a Gospel verse search; confirm red styling.
- [ ] Homepage: Featured Today’s Battle — confirm verse, reflection, prayer, streak, Share/Listen/KJV Audio.
- [ ] reader.html: open with `?book=Psalm&chapter=23` and with `?ref=John 3:16`; confirm chapter opens and (for ref) verse is highlighted.
- [ ] reader.html: Prev/Next, Listen, KJV Audio.
- [ ] Mobile: open sidebar, navigate to another page; confirm sidebar closes.
- [ ] Auth: sign up, confirm email (if enabled), log in, log out; confirm redirect messages and Master/Admin visibility for your test account.
- [ ] Newsletter: submit email; confirm success/error message and (if applicable) Supabase or local storage.

---

## Technical notes

- **Bible data**: Loaded from `versionFiles[version]` (e.g. `kjv.json`); `buildChapterIndex()` and `populateReaderBooks()` run in `refreshBibleView()` after load. Reader and search both depend on `bible` and `chapterIndex`/`bookIndex`.
- **Daily battle**: `getDailyBattleFromSupabase()` then `getDailyBattleFallback()`; result is rendered and stored in `currentDailyBattle` for share/listen.
- **Service worker**: Registered at `/service-worker.js`; ensure it doesn’t cache stale `kjv.json` when you update the file (cache version or name in SW).

If you want, we can implement any of the high-impact items next (e.g. `?q=` support and daily battle loading state).
