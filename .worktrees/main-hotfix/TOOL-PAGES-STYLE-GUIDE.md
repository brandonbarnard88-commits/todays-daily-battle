# Tool Pages Style Guide

Tool pages (e.g. `/mobius.html`) share a consistent look with the main site. Use this guide when adding new tools.

## Shared Assets

- **`tool-pages.css`** – Shared layout, header, footer, buttons, and CSS variables
- **`styles.css`** – Main site styles (optional; link if you need typography or components)

## Structure

```html
<body class="tool-page-shell">
  <header class="tool-page-header" role="banner">
    <a href="/" class="tool-header-home">← Home</a>
    <a href="/" class="tool-header-brand">Today's Daily Battle</a>
  </header>

  <main class="tool-page-main" role="main">
    <!-- Your tool content -->
  </main>

  <footer class="tool-page-footer" role="contentinfo">
    <p class="tool-footer-tagline">No ads • No tracking • Works offline</p>
    <nav class="tool-footer-links" aria-label="Footer links">
      <a href="privacy.html">Privacy</a>
      <a href="message.html">Prayer Wall</a>
      <a href="/">Home</a>
    </nav>
    <p class="tool-footer-copy">© Today&rsquo;s Daily Battle 2026</p>
  </footer>
</body>
```

## CSS Variables (from tool-pages.css)

| Variable | Use |
|----------|-----|
| `--tool-bg` | Page background (#0f1218) |
| `--tool-bg-soft` | Cards, panels (#171c25) |
| `--tool-text` | Primary text (#f5f7fb) |
| `--tool-muted` | Secondary text (#bcc5d6) |
| `--tool-gold` | Accent, borders (#e3bc67) |
| `--tool-gold-soft` | Hover, highlights (#f2dc98) |
| `--tool-line` | Borders (#2a3344) |

## Buttons

Use `.tool-btn` for primary actions (gold border, rounded, hover glow):

```html
<button type="button" class="tool-btn">Explore Fear → Faith Loop</button>
```

## Extracting Common CSS from index.html

If you need styles that exist only in `index.html`:

1. **Identify the block** – Search `index.html` for the relevant `<style>` or class names.
2. **Check for conflicts** – Ensure selectors don’t clash with `tool-pages.css` or `styles.css`.
3. **Prefer tool-pages.css** – Add shared tool styles to `tool-pages.css` so all tools benefit.
4. **Page-specific styles** – Keep tool-unique styles in an inline `<style>` block in the tool’s HTML.
5. **Build** – Add any new CSS files to `build-copy-static.js` `rootFiles` so they’re copied to `dist/`.
6. **Offline** – Add new CSS/HTML to `service-worker.js` `CORE_ASSETS` for offline use.

## Checklist for New Tool Pages

- [ ] Link `tool-pages.css` (and `styles.css` if needed)
- [ ] Use `.tool-page-shell`, `.tool-page-header`, `.tool-page-footer`
- [ ] Include "← Home" and brand link in header
- [ ] Include footer tagline, Privacy, Prayer Wall, Home links
- [ ] Use `.tool-btn` for primary buttons
- [ ] Use CSS variables for colors
- [ ] Add page to `build-copy-static.js` if it’s a new HTML file
- [ ] Add to `service-worker.js` CORE_ASSETS for offline
