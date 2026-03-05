// PWA for todaysdailybattle.com: cache today's verse, prayer, and audio offline. Offline-first.
// Bump CACHE_NAME when you deploy new HTML/CSS or want to invalidate (e.g. tdb-static-YYYYMMDD).
// script.js and config.js are NOT precached so updates deploy immediately.
const CACHE_NAME = 'tdb-static-20260305';
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
  '/kids/',
  '/kids/index.html',
  '/bible/',
  '/bible/index.html',
  '/bible/study.html',
  '/bible/tools.html',
  '/bible/bible-hub.css',
  '/bible/bible-hub.js',
  '/bible/bible-study.css',
  '/bible/bible-study.js',
  '/pastor/',
  '/pastor/index.html',
  '/pastor/library.html',
  '/pastor/builder.html',
  '/pastor/tools.html',
  '/pastor/pastor.css',
  '/pastor/pastor-hub.js',
  '/pastor/sermon-library.js',
  '/kids/parent.html',
  '/kids/kids-battle.css',
  '/kids/kids-battle.js',
  '/kids/kids-parent.js',
  '/kids/panel-david.svg',
  '/kids/panel-david-1.svg',
  '/kids/panel-david-2.svg',
  '/kids/panel-david-3.svg',
  '/kids/panel-noah.svg',
  '/kids/panel-noah-1.svg',
  '/kids/panel-noah-2.svg',
  '/kids/panel-noah-3.svg',
  '/kids/panel-jesus.svg',
  '/kids/panel-jesus-1.svg',
  '/kids/panel-jesus-2.svg',
  '/kids/panel-jesus-3.svg',
  '/kids/panel-jonah.svg',
  '/kids/panel-jonah-1.svg',
  '/kids/panel-jonah-2.svg',
  '/kids/panel-jonah-3.svg',
  '/kids/panel-daniel.svg',
  '/kids/panel-daniel-1.svg',
  '/kids/panel-daniel-2.svg',
  '/kids/panel-daniel-3.svg',
  '/kids/corner.html',
  '/kids/kids-corner.js',
  '/kids/kids-beta.html',
  '/church/',
  '/church/index.html',
  '/church/daily.html',
  '/church/church.css',
  '/church/church.js',
  '/styles.css',
  '/manifest.json',
  '/favicon.ico',
  '/icon.svg',
  '/world-map-source.svg',
  '/kjv.json',
  '/bible-characters.json',
  '/people-verse-map.js',
  '/daily-verses.js'
];

var AUDIO_ASSETS = [
  '/audio/psalm-23-1.mp3',
  '/audio/john-3-16.mp3',
  '/audio/philippians-4-6.mp3',
  '/audio/joshua-1-9.mp3',
  '/audio/isaiah-41-10.mp3'
];

self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function (cache) {
        return cache.addAll(CORE_ASSETS).then(function () {
          return cache.addAll(AUDIO_ASSETS).catch(function () {});
        });
      })
      .catch(function () {})
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

  // Bible data for offline
  if (url.pathname.endsWith('bible-characters.json') || url.pathname.endsWith('people-verse-map.js') || url.pathname.endsWith('daily-verses.js')) {
    event.respondWith(
      caches.match(event.request).then((cached) => cached || fetch(event.request).then((res) => {
        const clone = res.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone)).catch(() => {});
        return res;
      })).catch(() => fetch(event.request))
    );
    return;
  }

  // Only cache same-origin GETs; let cross-origin (fonts, analytics, images) load normally
  if (!sameOrigin) return;
  // Never cache script.js or config.js so deployments take effect immediately
  if (url.pathname.endsWith('script.js') || url.pathname.endsWith('config.js')) return;

  event.respondWith(
    caches.match(event.request).then((cached) => cached || fetch(event.request)).catch(() => fetch(event.request))
  );
});
