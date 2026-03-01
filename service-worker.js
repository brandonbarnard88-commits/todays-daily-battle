// PWA for todaysdailybattle.com: cache today's verse, prayer, and audio offline. Offline-first.
// Bump CACHE_NAME when you deploy new JS/CSS (e.g. tdb-static-YYYYMMDD).
const CACHE_NAME = 'tdb-static-20260228';
const CACHE_API = 'tdb-api-20260221';
const CORE_ASSETS = [
  '/',
  '/index.html',
  '/verse.html',
  '/bible-tool.html',
  '/reader.html',
  '/study.html',
  '/sermon.html',
  '/message.html',
  '/wins-report.html',
  '/church.html',
  '/reading-plan.html',
  '/topic-anxiety.html',
  '/topic-hope.html',
  '/topic-strength.html',
  '/topic-forgiveness.html',
  '/topic-fear.html',
  '/topic-grief.html',
  '/topic-parenting.html',
  '/styles.css',
  '/script.js',
  '/manifest.json',
  '/icon.svg',
  '/kjv.json'
];

self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(CORE_ASSETS)).catch(() => {})
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    Promise.all([
      clients.claim(),
      caches.keys().then((keys) => Promise.all(
        keys.filter((k) => k !== CACHE_NAME && k !== CACHE_API).map((k) => caches.delete(k))
      )).catch(() => {})
    ])
  );
});

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') self.skipWaiting();
});

self.addEventListener('push', (event) => {
  let data = { title: 'Your verse is ready! 🔥', body: 'Day 12/30—your verse is waiting.', url: '/' };
  try {
    if (event.data) data = { ...data, ...event.data.json() };
  } catch (_) {}
  event.waitUntil(
    self.registration.showNotification(data.title || 'Today\'s Daily Battle', {
      body: data.body || 'Your verse is ready. Tap to open.',
      icon: '/icon.svg',
      badge: '/icon.svg',
      tag: 'streak-reminder',
      renotify: true,
      data: { url: data.url || '/' },
      requireInteraction: false
    })
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const url = event.notification.data?.url || '/';
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((list) => {
      if (list.length) list[0].focus().then(() => list[0].navigate(url));
      else if (clients.openWindow) clients.openWindow(url);
    })
  );
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  const url = new URL(event.request.url);
  const sameOrigin = url.origin === self.location.origin;

  // Today's verse (KJV text) – offline-first: cache then network
  if (url.pathname.endsWith('kjv.json') || url.pathname.endsWith('/kjv.json')) {
    event.respondWith(
      caches.match(event.request).then((cached) => {
        if (cached) return cached;
        return fetch(event.request).then((res) => {
          const clone = res.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone)).catch(() => {});
          return res;
        });
      }).catch(() => fetch(event.request))
    );
    return;
  }

  // Today's verse + prayer (daily_battles API) – offline-first: cache then network
  if (url.href.includes('daily_battles')) {
    event.respondWith(
      caches.match(event.request).then((cached) => {
        if (cached) return cached;
        return fetch(event.request).then((res) => {
          const clone = res.clone();
          caches.open(CACHE_API).then((cache) => cache.put(event.request, clone)).catch(() => {});
          return res;
        });
      }).catch(() => fetch(event.request))
    );
    return;
  }

  // Same-origin audio – cache for offline (e.g. /audio/* or *.mp3)
  const isAudio = sameOrigin && (
    /\.(mp3|wav|m4a|ogg|aac)(\?|$)/i.test(url.pathname) ||
    url.pathname.startsWith('/audio/')
  );
  if (isAudio) {
    event.respondWith(
      fetch(event.request)
        .then((res) => {
          const clone = res.clone();
          caches.open(CACHE_API).then((cache) => cache.put(event.request, clone)).catch(() => {});
          return res;
        })
        .catch(() => caches.match(event.request))
    );
    return;
  }

  // Only cache same-origin GETs; let cross-origin (fonts, analytics, images) load normally
  if (!sameOrigin) return;

  event.respondWith(
    caches.match(event.request).then((cached) => cached || fetch(event.request)).catch(() => fetch(event.request))
  );
});
