const KJV_CACHE = "tdb-kjv-v1";

self.addEventListener("install", (event) => {
  self.skipWaiting();
  event.waitUntil(Promise.resolve());
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

/**
 * Cache the full KJV verse map after first successful fetch so chapter reading can work offline.
 * All other requests stay on the network (Next static export + Cloudflare handle HTML).
 */
self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;

  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;
  if (url.pathname !== "/kjv-full.json") return;

  event.respondWith(
    caches.open(KJV_CACHE).then(async (cache) => {
      try {
        const res = await fetch(req);
        if (res.ok) cache.put(req, res.clone());
        return res;
      } catch {
        const stale = await cache.match(req);
        if (stale) return stale;
        throw new Error("offline");
      }
    }),
  );
});
