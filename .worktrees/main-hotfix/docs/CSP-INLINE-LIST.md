# CSP: Inline Scripts & Styles (for dropping 'unsafe-inline')

When you're ready to remove `'unsafe-inline'` from CSP, you need to either **nonce** or **move** every inline script and style. Here's what exists.

---

## Inline scripts (every HTML page)

| Location | Content | Action |
|----------|--------|--------|
| **1. Fallback** | `window.TDB_CONFIG = window.TDB_CONFIG \|\| {};` | One short line. Can move to first line of config.js or leave + nonce. |
| **2. Config blob** | `window.TDB_CONFIG = { ... };` (Supabase URL, anon key, etc.) | Same on every page. **Option C:** Move to `/inline-bootstrap.js` (or build step that injects from env). Then `script-src 'self'` allows it. Or add `nonce="…"` to both inline blocks. |
| **index.html only** | Same two blocks (lines ~27–28). Plus two `<script type="application/ld+json">` (lines ~38, 41) — JSON-LD, not code; CSP may still require nonce/hash for them. | Nonce all four, or move TDB_CONFIG to file and nonce only the two ld+json blocks. |

**Pages with inline scripts:** index, verse, pricing, message, church, reading-plan, study, about, reader, admin, coloring, contact, faq, pastor-toolkit, team-toolkit, resources, sermon, shop, terms, privacy, reset, topic-anxiety, topic-fear, topic-forgiveness, topic-grief, topic-hope, topic-parenting, topic-strength (and any others that use the same head block).

**Pattern:** Every page has at least:
1. `<script>window.TDB_CONFIG = window.TDB_CONFIG || {};</script>`
2. `<script>window.TDB_CONFIG=window.TDB_CONFIG||{...};</script>`

---

## Inline styles

- **index.html:** No inline `<style>` blocks in the scan; styles are in `styles.css` or on elements (e.g. `style="display:none"`). Element `style` attributes are allowed unless you use `style-src-attr 'none'` (rare).
- Other pages: Same — no bulk inline `<style>` blocks found. If any page has `<style>...</style>`, add `nonce` to it and to CSP `style-src`.

---

## CSP options (recap)

- **Option A – Nonces:** Set a static nonce (e.g. `abc123`) in _headers: `script-src 'self' 'nonce-abc123'` (and CDN hosts you need). Add `nonce="abc123"` to every inline `<script>`. Same for `style-src` if you add inline styles. Generate a random nonce per request for stronger security (requires server/edge to inject it).
- **Option B – Move config:** Put TDB_CONFIG in `/inline-bootstrap.js` (or similar), load with `<script src="/inline-bootstrap.js"></script>`. Then no nonce needed for that block; only ld+json or other true inline scripts need nonce or hash.
- **Option C – Hash:** For each inline script, compute SHA-256 of its content and add `'sha256-...'` to `script-src`. Fragile when content changes; nonce or move is usually easier.

---

## _headers draft (with nonce; keep your CDNs)

Current CSP in _headers already has script-src, style-src, etc. To **drop** `'unsafe-inline'` and use a **static nonce**:

```
Content-Security-Policy: default-src 'self'; script-src 'self' 'nonce-abc123' https://www.gstatic.com https://cdn.jsdelivr.net https://static.cloudflareinsights.com; style-src 'self' 'nonce-abc123' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https://images.unsplash.com; connect-src 'self' https://*.supabase.co https://rixsnhpwrlbvvymkfamj.supabase.co wss://*.supabase.co; worker-src 'self' blob:; frame-ancestors 'none'; base-uri 'self'; form-action 'self'
```

Then in every HTML file, add `nonce="abc123"` to:
- Each inline `<script>...</script>` (the two TDB_CONFIG blocks).
- Each `<script type="application/ld+json">` if your CSP treats them as scripts.
- Any `<style>...</style>` if present.

Use a **random nonce per request** (e.g. Cloudflare Transform Rules or a small worker) for production; static `abc123` is only for testing.
