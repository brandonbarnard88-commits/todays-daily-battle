# Mobile-Friendly — Done (No FTP)

**What they said:** Site isn’t “mobile-friendly” — text too tiny, buttons hard to tap on phones.

**What we have:**

1. **Viewport meta** (every HTML page):
   ```html
   <meta name="viewport" content="width=device-width, initial-scale=1.0">
   ```
   → Tells the browser to scale to the device width. No zoom-out, no tiny text.

2. **Font & spacing** (`styles.css`):
   - `body { font-size: 18px; line-height: 1.6; }` — baseline legible.
   - `@media (max-width: 768px)`: `body { font-size: 20px; }`, `h1 { font-size: 2.5rem; }` — bigger on phones.

3. **Buttons & cards — thumb-proof**:
   - `.card { margin-bottom: 1.5rem; border-radius: 12px; }`; on mobile `.card { width: 100%; }`.
   - On mobile, main action buttons (`.daily-battle-actions .btn`, `.card-actions .btn`, `.verse-card .btn`, `.share-btn`, `.pray-btn`): `min-height: 60px`, `font-size: 1.2rem`, `padding: 1rem 2rem` — fat thumbs.

4. **Dark mode auto** (bonus):
   - `@media (prefers-color-scheme: dark)`: `body:not(.light-mode)` gets dark background/text; `.card` gets dark panel. Phones in system dark get dark theme unless user forces light (e.g. `body.light-mode`).

5. **Speed**: Service worker caches core assets; shop images use `loading="lazy"`. Add `loading="lazy"` to any other `<img>` below the fold.

6. **PWA**: `manifest.json` + service worker already in place; Add to Home Screen prompt can be surfaced next (see ROADMAP-PLAYBOOK.md).

**What to tell them:**

- *“We’re already mobile-friendly: viewport meta is in every page, and we use CSS media queries so on phones the text is 18px and buttons are big enough to tap. No FTP — it’s just the code we already have. If something still looks wrong on a specific phone or browser, tell me which one and I’ll check.”*

**Optional extra (if they use “flexible”):**

- *“‘Flexible’ = responsive design / media queries. We’ve got that — same code, no FTP.”*
