// PWA for todaysdailybattle.com: cache today's verse, prayer, and audio offline. Offline-first.
// Bump CACHE_NAME when you deploy new HTML/CSS or want to invalidate (e.g. tdb-static-YYYYMMDD).
// script.js and config.js are NOT precached so updates deploy immediately.
const CACHE_NAME = 'tdb-v188-20260403-reader-companion';
const CACHE_API = 'tdb-api-20260309c';
const OFFLINE_URL = '/offline.html';
const TODAY_VERSE_URL = '/today-kjv-verse.json';
const YESTERDAY_VERSE_URL = '/yesterday-kjv-verse.json';
const DAILY_KJV_POOL = [
  {
    ref: 'Philippians 4:6-7',
    text: 'Be careful for nothing; but in every thing by prayer and supplication with thanksgiving let your requests be made known unto God. And the peace of God, which passeth all understanding, shall keep your hearts and minds through Christ Jesus.',
    lines: ['Prayer + supplication + thanksgiving—not silent panic.', 'Peace stands guard over heart and mind.', 'Write it, pray it, thank three.'],
    app: 'Write down the one thing you\'re most worried about. Pray the verse over it. Thank God for 3 things (big or small).'
  },
  {
    ref: 'Matthew 11:28',
    text: 'Come unto me, all ye that labour and are heavy laden, and I will give you rest.',
    lines: ['Jesus welcomes the worn-out.', 'Rest starts with surrender.'],
    app: "Breathe and pray: 'Jesus, I come as I am. Give me rest today.'"
  },
  {
    ref: 'Isaiah 41:10',
    text: 'Fear thou not; for I am with thee: be not dismayed; for I am thy God: I will strengthen thee; yea, I will help thee; yea, I will uphold thee with the right hand of my righteousness.',
    lines: ['Fear loosens when God is near.', 'You are upheld, not alone.'],
    app: "Say, 'God is with me,' three times before your next hard task."
  },
  {
    ref: 'Psalm 118:24',
    text: 'This is the day which the LORD hath made; we will rejoice and be glad in it.',
    lines: ['Today is God-given.', 'Joy grows through gratitude.'],
    app: 'Write one thanks to God and carry it all day.'
  },
  {
    ref: 'Ephesians 4:26',
    text: 'Be ye angry, and sin not: let not the sun go down upon your wrath:',
    lines: ['Scripture names anger, not harm.', 'Surrender quickly to guard your heart.'],
    app: 'Pray first, then send one peaceful message.'
  },
  {
    ref: 'Romans 15:13',
    text: 'Now the God of hope fill you with all joy and peace in believing, that ye may abound in hope, through the power of the Holy Ghost.',
    lines: ['Hope is Spirit-powered.', 'Joy and peace grow in believing.'],
    app: 'Name one stuck place and ask God for fresh hope there.'
  }
];
const CORE_ASSETS = [
  '/',
  '/index.html',
  '/assets/perf-hint.js',
  '/hero-daily-365-data.js',
  '/hero-daily-first-paint.js',
  '/offline.html',
  '/plans.html',
  '/printables.html',
  '/site-guide.html',
  '/daily-quiet-time.html',
  '/psalms.html',
  '/he-is-risen.html',
  '/plans-data.js',
  '/easter-season.js',
  '/logo-shield-600.png',
  '/logo-crest.jpg',
  '/verse.html',
  '/calm.html',
  '/story.html',
  '/about.html',
  '/bible-tool.html',
  '/bible-study-companion.js',
  '/cross-refs.json',
  '/book-intros.json',
  '/kjv-word-notes.json',
  '/ask-the-word.js',
  '/share-page.js',
  '/vendor/dompurify.min.js',
  '/tt-bootstrap.js',
  '/sky-ip-geo.js',
  '/sky-ip-geo.js?v=20260327ipgeo',
  '/easter-eggs.js',
  '/easter-eggs.css',
  '/mobius-loop.js',
  '/mobius-universal.js',
  '/mobius-text-v2.js',
  '/mobius.html',
  '/tool-pages.css',
  '/reader.html',
  '/study.html',
  '/my-verses.html',
  '/sermon.html',
  '/message.html',
  '/wins-report.html',
  '/wins.html',
  '/progress.html',
  '/church.html',
  '/reading-plan.html',
  '/topic-anxiety.html',
  '/topic-worry.html',
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
  '/bible/bible-tools.css',
  '/bible/bible-tools.js',
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
  '/kids/kids-page-sky.css',
  '/kids/kids-page-sky.css?v=20260326playful',
  '/kids/kids-page-sky.js',
  '/kids/kids-page-sky.js?v=20260326playful',
  '/kids/kids-page-sky.js?v=20260327ipgeo',
  '/kids/kids-battle.js',
  '/kids/kids-verses-365.js',
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
  '/kids/all-stories.html',
  '/kids/kids-all-stories.js',
  '/kids-corner.html',
  '/kids-corner-daily-verse.js',
  '/kids-corner-daily-verse.js?v=2',
  '/kids-corner-daily-verse.js?v=3',
  '/family.html',
  '/family-activity-packs.html',
  '/family-youth-journal.html',
  '/mission-outreach-packs.html',
  '/mission-outreach-data.js',
  '/kids/story-library-fonts.css?v=1',
  '/assets/fonts/bangers-latin.woff2',
  '/kids/kids-corner.js',
  '/kids/kids-read-quiz-data.js',
  '/kids/kids-story-fuse-search.js',
  '/kids/bible-story-tool-index.js',
  '/kids/kids-read-quiz-loop-posters.js',
  '/kids/kids-beta.html',
  '/church/',
  '/church/index.html',
  '/church/daily.html',
  '/church/church.css',
  '/church/church.js',
  '/styles.css',
  '/pray.js',
  '/streak.js',
  '/cartoon.js',
  '/daily-tile.js',
  '/easter-eggs.js',
  '/easter-eggs.css',
  '/highlights.js',
  '/verse-breakdown.js',
  '/family-hierarchy.js',
  '/crest.js',
  '/avatar-progress.js',
  '/bible-progress.js',
  '/relations-dict.json',
  '/crest-generator.html',
  '/armor.js',
  '/lineage-tree.js',
  '/mystudy.css',
  '/mystudy.html',
  '/mystudy.js',
  '/what-god-has-done.css',
  '/what-god-has-done.html',
  '/what-god-has-done.js',
  '/modal.html',
  '/manifest.json',
  '/favicon.ico',
  '/icon.svg',
  '/world-map-source.svg',
  '/kjv.json',
  '/bible-characters.json',
  '/people-verse-map.js',
  '/daily-verses.js'
];

const CDN_FUSE_JS = 'https://cdn.jsdelivr.net/npm/fuse.js@7.0.0/dist/fuse.min.js';

var AUDIO_ASSETS = [
  '/audio/psalm-23-1.mp3',
  '/audio/john-3-16.mp3',
  '/audio/philippians-4-6.mp3',
  '/audio/joshua-1-9.mp3',
  '/audio/isaiah-41-10.mp3'
];

/**
 * Cache lookup: exact request URL first, then pathname-only for .js/.css so
 * kids-read-quiz-data.js?v=… hits precached /kids/kids-read-quiz-data.js.
 * Prevents offline fallback from serving HTML/text as script (parse errors).
 */
function matchCachedSameOriginAsset(cacheName, request, url) {
  return caches.open(cacheName).then(function (cache) {
    return cache.match(request).then(function (hit) {
      if (hit) return hit;
      if (/\.(js|css)$/i.test(url.pathname)) {
        return cache.match(url.pathname);
      }
      return null;
    });
  });
}

function daySeed(offsetDays) {
  const date = new Date();
  date.setUTCDate(date.getUTCDate() + offsetDays);
  return Math.floor(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()) / 86400000);
}

function pickDailyVerse(offsetDays) {
  const idx = ((daySeed(offsetDays) % DAILY_KJV_POOL.length) + DAILY_KJV_POOL.length) % DAILY_KJV_POOL.length;
  return DAILY_KJV_POOL[idx];
}

function buildVersePayload(offsetDays) {
  return {
    ...pickDailyVerse(offsetDays),
    dateKey: daySeed(offsetDays)
  };
}

function seedVerseCache() {
  return caches.open(CACHE_API).then(function (cache) {
    const options = { headers: { 'content-type': 'application/json; charset=utf-8' } };
    return Promise.all([
      cache.put(TODAY_VERSE_URL, new Response(JSON.stringify(buildVersePayload(0)), options)),
      cache.put(YESTERDAY_VERSE_URL, new Response(JSON.stringify(buildVersePayload(-1)), options))
    ]);
  }).catch(function () {});
}

self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function (cache) {
        return cache.addAll(CORE_ASSETS).then(function () {
          return Promise.all([
            cache.add(CDN_FUSE_JS).catch(function () {}),
            cache.addAll(AUDIO_ASSETS).catch(function () {}),
            seedVerseCache()
          ]);
        });
      })
      .catch(function () {})
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    Promise.all([
      clients.claim(),
      seedVerseCache(),
      caches.keys().then((keys) => Promise.all(
        keys.filter((k) => k !== CACHE_NAME && k !== CACHE_API).map((k) => caches.delete(k))
      )).catch(() => {})
    ])
  );
});

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') self.skipWaiting();
  if (event.data && event.data.type === 'TDB_REQUEST_PRAYER_SYNC') {
    event.waitUntil(
      self.registration.sync.register('tdb-sync-prayers').catch(() => {})
    );
  }
});

self.addEventListener('sync', (event) => {
  if (event.tag !== 'tdb-sync-prayers') return;
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((list) => {
      list.forEach((client) => {
        try { client.postMessage({ type: 'TDB_FLUSH_PRAYER_QUEUE' }); } catch (e) {}
      });
    }).catch(() => {})
  );
});

self.addEventListener('push', (event) => {
  let data = { title: 'Your verse is ready! 🔥', body: 'Day 12/30—your verse is waiting.', url: '/', tag: 'daily-verse' };
  try {
    if (event.data) data = { ...data, ...event.data.json() };
  } catch (_) {}
  const safeTitle = String(data.title || 'Today\'s Daily Battle');
  const safeBody = String(data.body || 'Your verse is ready. Tap to open.');
  const safeTag = String(data.tag || data.type || 'daily-verse');
  const safeUrl = String((data && data.url) || '/');
  event.waitUntil(
    self.registration.showNotification(safeTitle, {
      body: safeBody,
      icon: '/icon.svg',
      badge: '/icon.svg',
      tag: safeTag,
      renotify: true,
      data: { url: safeUrl },
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

  // Sky geolocation JSON — always network (edge IP must be current; do not cache in SW).
  if (sameOrigin && url.pathname === '/api/sky-geo') {
    event.respondWith(fetch(event.request));
    return;
  }

  if (sameOrigin && (url.pathname === TODAY_VERSE_URL || url.pathname === YESTERDAY_VERSE_URL)) {
    event.respondWith(
      seedVerseCache().then(function () {
        return caches.open(CACHE_API).then(function (cache) {
          return cache.match(url.pathname).then(function (cached) {
            if (cached) return cached;
            const payload = url.pathname === TODAY_VERSE_URL ? buildVersePayload(0) : buildVersePayload(-1);
            return new Response(JSON.stringify(payload), {
              status: 200,
              headers: { 'content-type': 'application/json; charset=utf-8' }
            });
          });
        });
      }).catch(function () {
        const payload = url.pathname === TODAY_VERSE_URL ? buildVersePayload(0) : buildVersePayload(-1);
        return new Response(JSON.stringify(payload), {
          status: 200,
          headers: { 'content-type': 'application/json; charset=utf-8' }
        });
      })
    );
    return;
  }

  // External verse API: network-first with cached fallback while offline.
  if (url.href.includes('bible-api.com')) {
    event.respondWith(
      fetch(event.request)
        .then((res) => {
          const clone = res.clone();
          caches.open(CACHE_API).then((cache) => cache.put(event.request, clone)).catch(() => {});
          return res;
        })
        .catch(() => caches.match(event.request).then((cached) => cached || new Response('Offline - verse unavailable', { status: 503 })))
    );
    return;
  }

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

  // Verse endpoint requests (same-origin + JSON feeds): stale-while-revalidate.
  const isVerseRequest = (
    url.pathname.includes('/verse') ||
    url.pathname.includes('/daily-verse') ||
    url.pathname.endsWith('/daily-verses.js') ||
    url.pathname.endsWith('/kjv.json')
  );
  if (isVerseRequest) {
    event.respondWith(
      caches.match(event.request).then((cached) => {
        var networkFetch = fetch(event.request).then((res) => {
          if (res && res.ok) {
            var clone = res.clone();
            caches.open(CACHE_API).then((cache) => cache.put(event.request, clone)).catch(() => {});
          }
          return res;
        }).catch(() => cached);
        return cached || networkFetch;
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

  // Self-hosted WOFF2 (Story Library / site fonts): stale-while-revalidate — paint from cache, refresh in background.
  if (sameOrigin && url.pathname.startsWith('/assets/fonts/') && /\.woff2(\?|$)/i.test(url.pathname + url.search)) {
    event.respondWith(
      caches.open(CACHE_NAME).then(function (cache) {
        return cache.match(event.request).then(function (cached) {
          var net = fetch(event.request).then(function (res) {
            if (res && res.ok) cache.put(event.request, res.clone()).catch(function () {});
            return res;
          });
          if (cached) {
            net.catch(function () {});
            return cached;
          }
          return net;
        });
      })
    );
    return;
  }

  // Fuse.js for offline kids search (CDN — cache-first when precache succeeded)
  if (url.origin === 'https://cdn.jsdelivr.net' && /\/fuse\.min\.js$/i.test(url.pathname)) {
    event.respondWith(
      caches.open(CACHE_NAME).then(function (cache) {
        return cache.match(event.request).then(function (hit) {
          if (hit) return hit;
          return fetch(event.request).then(function (res) {
            if (res && res.ok) cache.put(event.request, res.clone()).catch(function () {});
            return res;
          });
        });
      })
    );
    return;
  }

  // Only cache same-origin GETs; let cross-origin (analytics, third-party CDN) load normally
  if (!sameOrigin) return;

  // tt-bootstrap.js: network-first so Trusted Types / DOMPurify wiring updates deploy immediately;
  // precache (CORE_ASSETS) still seeds offline. Avoids stale innerHTML policy stuck in CACHE_NAME.
  if (url.pathname.endsWith('/tt-bootstrap.js')) {
    event.respondWith(
      fetch(event.request)
        .then((res) => {
          if (res && res.ok) {
            const clone = res.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone)).catch(() => {});
          }
          return res;
        })
        .catch(() => matchCachedSameOriginAsset(CACHE_NAME, event.request, url).then((hit) => {
          if (hit) return hit;
          return new Response('Offline — refresh when you are back online.', { status: 503, headers: { 'content-type': 'text/plain; charset=utf-8' } });
        }))
    );
    return;
  }

  // Never cache script.js, config.js, or footer-build-stamp.js so deployments take effect immediately
  if (url.pathname.endsWith('script.js') || url.pathname.endsWith('config.js') || url.pathname.endsWith('footer-build-stamp.js')) return;

  // HTML navigations should prefer network so deploys are visible immediately.
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .then((res) => {
          if (res && res.ok) {
            const clone = res.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone)).catch(() => {});
          }
          return res;
        })
        .catch(() => caches.match(event.request).then((cached) => {
          if (cached) return cached;
          return caches.match(OFFLINE_URL).then((offlinePage) => offlinePage || new Response('You are offline. Check back later.', { status: 503 }));
        }))
    );
    return;
  }

  event.respondWith(
    matchCachedSameOriginAsset(CACHE_NAME, event.request, url).then((cached) => {
      if (cached) return cached;
      return fetch(event.request).then((res) => {
        if (res && res.ok) {
          const clone = res.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone)).catch(() => {});
        }
        return res;
      });
    }).catch(() => {
      if (event.request.mode === 'navigate') {
        return caches.match(OFFLINE_URL).then((offlinePage) => offlinePage || new Response('You are offline. Check back later.', { status: 503 }));
      }
      if (/\.(js|css)$/i.test(url.pathname)) {
        return caches.open(CACHE_NAME).then((cache) => cache.match(url.pathname)).then((pathHit) => {
          if (pathHit) return pathHit;
          /* Never serve HTML/text as JS — breaks parsing. Stub only the read-quiz bundle so the page can recover. */
          if (/\/kids\/kids-read-quiz-data\.js$/i.test(url.pathname)) {
            return new Response(
              "(function(g){'use strict';try{if(!g.TDB_KIDS_READ_QUIZ||typeof g.TDB_KIDS_READ_QUIZ!=='object')g.TDB_KIDS_READ_QUIZ={};}catch(e){}})(typeof window!=='undefined'?window:this);",
              { status: 200, headers: { 'content-type': 'application/javascript; charset=utf-8' } }
            );
          }
          return new Response('You are offline. Check back later.', { status: 503 });
        });
      }
      return new Response('You are offline. Check back later.', { status: 503 });
    })
  );
});
