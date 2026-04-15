# PWA Audit — Today's Daily Battle

Quick verification checklist for Progressive Web App behavior.

## Manifest (`manifest.json`)

| Check | Status |
|-------|--------|
| `name`, `short_name`, `description` | ✅ Present |
| `start_url`: `/` | ✅ |
| `display`: `standalone` | ✅ |
| `theme_color`, `background_color` | ✅ |
| Icons: 192×192, 512×512 (any + maskable) | ✅ |
| `scope`: `/` | ✅ |

## Icons

| File | Status |
|------|--------|
| `/icons/icon-192.png` | ✅ In repo; copied to dist/ |
| `/icons/icon-512.png` | ✅ In repo; copied to dist/ |
| `/icon.svg` | ✅ Root favicon |

## Service Worker (`sw.js` -> `service-worker.js`)

**Version bump:** Repo root `SW-VERSION` (single line, e.g. `20260416-perf-offline`) is the cache-bust token. `register-sw.js` is the single registration path and keeps `/sw.js?v=<that token>` aligned for shared callers like `tdbRegisterServiceWorker()`.

| Check | Status |
|-------|--------|
| Registers at `/` | ✅ Centralized in `register-sw.js` via `tdbRegisterServiceWorker()` |
| `CACHE_NAME` bumped on deploy | ✅ Bump when HTML/CSS changes |
| Core HTML/CSS precached | ✅ CORE_ASSETS |
| `script.js`, `config.js` NOT precached | ✅ Updates deploy immediately |
| Offline fallback for kjv.json | ✅ |

## Add to Home Screen

| Check | Status |
|-------|--------|
| `#install-app` button | ✅ `index.html` |
| `beforeinstallprompt` listener | ✅ `script.js` |
| Prompt stored, shown on button click | ✅ |
| Dismiss / "Not now" | ✅ `#install-not-now` |

## Verification Steps

1. **Chrome DevTools** → Application → Manifest: no errors.
2. **Application** → Service Workers: registered, activated.
3. **Lighthouse** → PWA: run audit.
4. **Mobile**: Visit site, trigger "Add to Home Screen" (Chrome/Safari).

## Notes

- Safari iOS: Add to Home Screen works; service worker support is limited.
- `maskable` icons help with adaptive icons on Android.
