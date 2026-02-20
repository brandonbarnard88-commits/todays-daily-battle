# Optional configuration

## config.js (optional)

To override Supabase or master emails without editing `script.js`:

1. Copy `config.example.js` to `config.js`.
2. Set your values in `config.js`.
3. Load `config.js` before `script.js` (index.html already includes `<script src="config.js"></script>`).

If `config.js` is missing, the app uses built-in defaults and still works. Add `config.js` to `.gitignore` if you don’t want to commit your keys (it’s already listed there).

## Service worker cache

When you deploy new JS or CSS, bump the cache name in `service-worker.js` (e.g. `CACHE_NAME = 'tdb-static-YYYYMMDD'`) so returning visitors get the latest assets.
