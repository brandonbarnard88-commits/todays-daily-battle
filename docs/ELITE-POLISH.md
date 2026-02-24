# Elite UX Polish — Today's Daily Battle

Summary of site-wide polish for CSP, dark mode, loading/error states, mobile, accessibility, and speed.

## Done

### CSP-safe
- **index.html, verse.html, contact.html, message.html**: Inline `TDB_CONFIG` replaced with `<script src="inline-bootstrap.js"></script>`.
- **contact.html**: Inline form script moved to `contact-form.js` (event listeners only).
- **Font load**: `media="print" onload="this.media='all'"` remains (common pattern; CSP may allow or use nonce later).

### Dark mode
- **styles.css**: `--text` alias added in `:root` and `.dark-mode` so components can use `var(--text)` consistently.
- Existing `--color-text`, `--card-dark`, `--bg-dark` unchanged; dark mode already applied site-wide.

### Loading & error
- **styles.css**: `.tdb-spinner` (animated circle) and `.tdb-error-message` (muted block) for dynamic sections.
- **daily-verse-widget.js**: Already shows "Loading verse…" and "Verse unavailable—try again later."
- **script.js**: Daily battle card and search already use loading/empty/error copy.

### Mobile
- **&lt;600px**: `overflow-x: hidden` on `html`, `body`, `.app-content`, `.content-inner`; cards and controls already responsive.
- **#daily-verse-widget**: `max-width: 100%`; `margin: 0 auto` in media query.

### Accessibility
- **index.html**: `#search-widget` has `role="search"` and `aria-label="Floating search bar"`.
- **verse.html**: `#verse-of-day` has `role="region"`, `aria-live="polite"`, `aria-label="Verse of the day"`; `#daily-verse-card` has `aria-live="polite"`.
- **contact.html**: Form has `aria-label="Contact form"`; submit button has `aria-label="Open email to send"`.
- **Daily verse widget**: Container has `role="region"`, `aria-live="polite"`, `aria-label="Verse of the day"`.

### Speed
- **Firebase & confetti**: Already loaded with `defer`.
- **Unsplash**: Shop images use `loading="lazy"`; 404-admin image set to `loading="lazy"`.
- **preconnect**: index has `preconnect` for images.unsplash.com and fonts.

### Touch-up
- Glass cards, shadows, and button styles already in `styles.css` (`.glass`, `.verse-card`, `.btn`, etc.).
- No inline script for styling; all in external CSS.

## Optional next steps

1. **Remaining HTML pages**: Replace inline `TDB_CONFIG` with `<script src="inline-bootstrap.js"></script>` on: pricing.html, church.html, reading-plan.html, study.html, reader.html, about.html, faq.html, shop.html, sermon.html, resources.html, pastor-toolkit.html, team-toolkit.html, coloring.html, reset.html, terms.html, privacy.html, topic-*.html. Same pattern: remove the two `<script>...</script>` blocks, add `<script src="inline-bootstrap.js"></script>` before `config.js`.
2. **Font loading**: If you drop `'unsafe-inline'` in CSP, replace `onload="this.media='all'"` with a small external script that sets `link.media = 'all'` after load, or use a nonce.
3. **reading-plan.html**: Contains an inline `<script>` block; move to e.g. `reading-plan.js` and use addEventListener if you want it CSP-strict.

## Testing

- Reload index, verse, message, contact: no inline script errors; config and search work.
- Dark mode: consistent text and card colors.
- Resize to &lt;600px: no horizontal scroll; widgets and cards readable.
- Screen reader: landmarks (search, region) and live regions announced.
- Network: lazy images load on scroll; critical path scripts load first.
