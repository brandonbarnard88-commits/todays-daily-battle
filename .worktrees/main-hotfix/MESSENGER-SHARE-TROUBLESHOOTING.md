# Messenger / Facebook link “not pulling up”

When a friend says the link “isn’t pulling up” in Messenger, it usually means one of two things:

1. **No preview** – They paste the link and no card (title, image, description) appears.
2. **Link won’t open** – They tap the link and nothing happens, or they get a blank/error page.

---

## For your buddy (quick fixes)

- **Open in external browser:** In Messenger, long‑press the link → “Open in browser” / “Open in Safari” (or Chrome). If it opens fine there, the issue is Messenger’s in‑app browser or cache.
- **Update Messenger** and the device OS; then try again.
- **Clear Messenger cache:** Android: Settings → Apps → Messenger → Storage → Clear cache. iOS: Offload app or reinstall.
- **Try the plain URL** in Safari/Chrome first: `https://todaysdailybattle.com` — if that works, the link itself is fine.

---

## For you (site / server)

### 1. Refresh Facebook’s cache and check preview

- Go to [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/).
- Enter `https://todaysdailybattle.com` and click **Debug**.
- Click **Scrape Again** so Meta re-fetches the page.
- Check for errors (e.g. “Could not resolve URL”, “Redirect”, or missing image). Fix any reported issues.

### 2. Don’t block Meta’s crawler

- **Cloudflare:** Security → Bots → avoid blocking **facebookexternalhit** / Meta crawlers. If “Bot Fight Mode” or high security is on, add an exception for Meta’s crawler so it gets a normal 200 HTML response (not a challenge page).
- **robots.txt** – Your repo already has `Allow: /` for all; no change needed.

### 3. Homepage OG tags

- The site already has `og:title`, `og:description`, `og:url`, `og:type`, and `og:image` on the homepage.
- Adding `og:image:width` and `og:image:height` (e.g. 1200×630) can improve preview reliability; see index.html.

---

## If the link opens in browser but not in Messenger

This is often app cache, WebView, or Data Saver. Have them:

- Open the same link in the device’s default browser (Safari/Chrome).
- In Messenger, use “Open in browser” instead of opening in the in‑app viewer.

Once the Sharing Debugger shows a successful scrape and your buddy can open the URL in a normal browser, the rest is usually on the app/device side.
