// Bump this when you deploy new JS/CSS so clients get fresh assets (e.g. tdb-static-YYYYMMDD).
const CACHE_NAME = 'tdb-static-20260224';
const CACHE_API = 'tdb-api-20260221';
const CORE_ASSETS = [
  '/',
  '/index.html',
  '/wins-report.html',
  '/church.html',
  '/styles.css',
  '/script.js',
  '/manifest.json',
  '/icon.svg'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(CORE_ASSETS))
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(
      keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
    ))
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
  const url = new URL(event.request.url);
  if (url.pathname.endsWith('kjv.json') || url.pathname.endsWith('/kjv.json')) {
    event.respondWith(
      fetch(event.request)
        .then((res) => {
          const clone = res.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
          return res;
        })
        .catch(() => caches.match(event.request))
    );
    return;
  }
  if (event.request.method === 'GET' && url.href.includes('daily_battles')) {
    event.respondWith(
      fetch(event.request)
        .then((res) => {
          const clone = res.clone();
          caches.open(CACHE_API).then((cache) => cache.put(event.request, clone));
          return res;
        })
        .catch(() => caches.match(event.request))
    );
    return;
  }
  event.respondWith(
    caches.match(event.request).then((cached) => cached || fetch(event.request))
  );
});
