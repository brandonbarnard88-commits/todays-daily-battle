/**
 * Today’s Daily Battle — calm offline layer (no third-party libs).
 * - Stale-while-revalidate: /kjv-full.json (instant from cache, refresh in background when online)
 * - Cache-first: /_next/static/*, manifest, favicon, offline shell
 * - Navigate: network-first, cache HTML on success, fallback to offline.html
 */
const CACHE_SHELL = "tdb-shell-v3";
const CACHE_KJV = "tdb-kjv-v3";
const CACHE_STATIC = "tdb-static-v3";
/** Retire old caches from earlier sw versions */
const LEGACY_PREFIXES = ["tdb-kjv-v1", "tdb-kjv-v2", "tdb-shell-v1", "tdb-shell-v2", "tdb-static-v1", "tdb-static-v2"];

const PRECACHE_URLS = ["/offline.html", "/manifest.webmanifest", "/favicon.ico"];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_SHELL)
      .then((cache) =>
        Promise.all(
          PRECACHE_URLS.map((url) =>
            cache.add(new Request(url, { cache: "reload" })).catch(() => {
              /* Precache best-effort: favicon or manifest may 404 in some dev setups */
            }),
          ),
        ),
      )
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys.map((key) => {
            if (LEGACY_PREFIXES.includes(key)) return caches.delete(key);
            if (key.startsWith("tdb-") && key !== CACHE_SHELL && key !== CACHE_KJV && key !== CACHE_STATIC) {
              return caches.delete(key);
            }
            return undefined;
          }),
        ),
      )
      .then(() => self.clients.claim()),
  );
});

function isStaticAssetPath(pathname) {
  return (
    pathname.startsWith("/_next/static/") ||
    pathname === "/manifest.webmanifest" ||
    pathname === "/favicon.ico" ||
    pathname === "/offline.html"
  );
}

/** Stale-while-revalidate: return cache immediately if present; always try to refresh when online. */
function kjvStaleWhileRevalidate(event) {
  return caches.open(CACHE_KJV).then(async (cache) => {
    const cached = await cache.match(event.request);
    const networkPromise = fetch(event.request)
      .then((res) => {
        if (res.ok) cache.put(event.request, res.clone());
        return res;
      })
      .catch(() => null);

    if (cached) {
      event.waitUntil(networkPromise);
      return cached;
    }
    const fresh = await networkPromise;
    if (fresh) return fresh;
    throw new Error("kjv-offline");
  });
}

/** Cache-first for hashed build assets; background update when online. */
function cacheFirstStatic(event) {
  return caches.open(CACHE_STATIC).then(async (cache) => {
    const cached = await cache.match(event.request);
    if (cached) {
      event.waitUntil(
        fetch(event.request)
          .then((res) => {
            if (res.ok) cache.put(event.request, res.clone());
          })
          .catch(() => {}),
      );
      return cached;
    }
    const res = await fetch(event.request);
    if (res.ok) await cache.put(event.request, res.clone());
    return res;
  });
}

/** HTML navigations: try network; cache successful pages; offline → cached page or offline.html */
function networkFirstNavigate(event) {
  return caches.open(CACHE_SHELL).then(async (cache) => {
    try {
      const res = await fetch(event.request);
      if (res.ok) {
        const ct = res.headers.get("content-type") || "";
        if (ct.includes("text/html")) {
          await cache.put(event.request, res.clone());
        }
      }
      return res;
    } catch {
      const shell = await cache.match(event.request);
      if (shell) return shell;
      const offline = await cache.match("/offline.html");
      if (offline) return offline;
      return new Response("Offline", { status: 503, statusText: "Offline" });
    }
  });
}

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;

  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;

  const path = url.pathname;

  if (path === "/kjv-full.json") {
    event.respondWith(
      kjvStaleWhileRevalidate(event).catch(
        () => new Response(null, { status: 503, statusText: "Offline" }),
      ),
    );
    return;
  }

  if (isStaticAssetPath(path)) {
    event.respondWith(cacheFirstStatic(event));
    return;
  }

  if (req.mode === "navigate") {
    event.respondWith(networkFirstNavigate(event));
    return;
  }

  /* Let the browser handle everything else (same-origin non-navigate). */
});
