# Mobile & desktop check summary

Quick audit of viewport, responsive CSS, and touch/desktop behavior. No automated browser was run; this is based on code review.

---

## Viewport & meta

- **index.html** has `<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0">` — correct for mobile and zoom.
- **theme-color** is set for browser chrome.

---

## Desktop (≈769px+)

- **Layout:** Grid with sidebar (268px → 248px @1200px, 232px @1024px) + main content. Footer in grid.
- **Header:** Full `.header-nav` visible (Home, Search, Verse of the Day, Prayer Wall, etc.). Brand, nav, Family Armor, theme toggle, Add family, Bless, auth, Menu (sidebar toggle) in top bar.
- **Sidebar:** Always visible; `.side-nav` links, sidebar options (Sound when a household prays, Sacred silence, Red letters).
- **Dark/Light toggle:** Fixed bottom-right (`position: fixed; bottom: 20px; right: 20px`), z-index 50.
- **Floating voice pray:** Fixed bottom-right at `right: 90px` so it sits left of the dark toggle — no overlap.
- **Touch targets:** Buttons/inputs generally have adequate size; 44px+ used in several places.

---

## Mobile (≤768px)

- **Layout:** Single column. Sidebar removed from grid; content full width.
- **Sidebar:** Becomes overlay: `position: fixed`, `transform: translateX(-100%)`, 240px wide. `.app-shell.sidebar-open` slides it in; `.app-content::before` is a dark backdrop (z-index 8) that closes on outside click (wired in script.js).
- **Header:** `.header-nav` hidden. Menu icon (≡) shown, “Menu” text hidden. Brand, icon buttons (Family Armor 48×48, theme, Add family, Bless), then sidebar toggle, then auth. Top bar uses `padding-top: max(0.75rem, env(safe-area-inset-top))` for notches.
- **Tap targets:** Header menu link and theme toggle 44×44; family button 48×48. Search input and primary buttons 48px+ height; many CTAs 48–56px. `-webkit-tap-highlight-color: transparent` on key controls.
- **No horizontal scroll:** `html`, `body`, `.app-content`, `.content-inner`, `#main-search`, `.controls.glass` get `overflow-x: hidden` and `max-width: 100%` where needed.
- **Font size:** Root 16px in the 768px block; search input gets `font-size: 16px` in a later 768px block to reduce iOS zoom on focus.
- **Safe areas:** Top bar, footer, floating voice pray, and fixed dark toggle use `env(safe-area-inset-*)` where appropriate.
- **Fixed elements:**  
  - **Dark toggle:** At 480px it moves to fixed bottom-right (56×56, icon only).  
  - **Silent offering button:** Fixed bottom-right; at 768px it’s `bottom: 5rem` so it sits above the dark toggle and they don’t overlap.  
  - **Floating voice pray:** Center bottom at 768px (`left: 50%`, `translateX(-50%)`).

---

## Breakpoints in use

| Breakpoint   | Use |
|-------------|-----|
| 1200px      | Narrower sidebar, content-inner full width |
| 1024px      | Slightly narrower sidebar, content padding |
| 768px       | Mobile: overlay sidebar, single column, larger taps, overflow control, safe areas |
| 600px       | Daily verse widget max-width 100% |
| 480px       | Dark toggle to fixed bottom-right icon-only; extra polish |

---

## Accessibility

- **Skip link:** `.skip-link` is off-screen (`top: -3rem`) and moves into view on `:focus` / `:focus-visible` with visible outline.
- **Focus:** `:focus-visible` and outline used on header links, buttons, and form controls.
- **ARIA:** Sidebar toggle has `aria-label="Open menu"`; other header controls have labels or titles.

---

## Manual testing suggestions

1. **Desktop:** Resize from ~1400px down to 769px — nav should hide and menu icon appear; sidebar should stay visible until 768px.
2. **Mobile (portrait):** Open menu, tap backdrop to close; confirm search doesn’t zoom on focus (iOS); scroll long pages for horizontal scroll or overflow.
3. **Mobile (480px):** Confirm dark toggle is fixed bottom-right and doesn’t cover silent-offering or floating voice button.
4. **Notched devices:** Check top bar and bottom fixed buttons with safe-area insets (e.g. iPhone X+).
5. **Touch:** Tap all header buttons and primary CTAs — no tiny hit areas; key controls should be 44px+.

---

## Notes

- **Browser MCP** was not available in this session, so no live screenshots or DevTools checks were done. Running the site locally and testing in Chrome DevTools device toolbar (e.g. iPhone SE, iPad, Desktop) is recommended.
- **CSP:** If the site is black or styles are blocked, see `CLOUDFLARE-CSP-FIX.md` (Cloudflare CSP can override the meta tag).
