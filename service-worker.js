// PWA for todaysdailybattle.com: cache today's verse, prayer, and audio offline. Offline-first.
// Bump CACHE_NAME when you deploy new HTML/CSS or want to invalidate (e.g. tdb-static-YYYYMMDD).
// script.js is network-first with a cache fallback (not precached) so online users get fresh JS immediately; offline users get the last successful fetch until CACHE_NAME clears.
// config.js is NOT intercepted so updates deploy immediately.
const CACHE_NAME = 'tdb-cache-v20260823desk42';
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
  /* Root `/` omitted: WebKit sometimes logs "Cannot load ." during precache; offline `/` uses `/index.html` in fetch handler. */
  /* Trailing-only hub URLs (/kids/, /bible/, /pastor/, /church/) omitted for the same reason; index.html + navigate fallback covers offline. */
  '/index.html',
  '/assets/perf-hint.js',
  '/hero-hero-pools.js',
  '/red-letter.js',
  '/offline.html',
  '/plans.html',
  '/custom-plan-builder.html',
  '/js/custom-plan-builder.js',
  '/js/backup-reminder.js',
  '/js/feel-combo-presets.js',
  '/js/mystudy-mobile.js',
  '/embeddable-widgets.html',
  '/printables.html',
  '/print-pack-generator.html',
  '/explore.html',
  '/gods-university-of-life.html',
  '/university.html',
  '/daily-quiet-time.html',
  '/kjv-story.html',
  '/psalms.html',
  '/he-is-risen.html',
  '/plans-data.js',
  '/university-plan-extensions.js',
  '/easter-season.js',
  '/logo-shield-600.png',
  '/logo-crest.jpg',
  '/verse.html',
  '/calm.html',
  '/calm-rest-kit.js',
  '/emergency-calm-pack.html',
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
  '/sky-ip-geo.js?v=20260817-skysolar',
  '/easter-eggs.js',
  '/easter-eggs.css',
  '/mobius-loop.js',
  '/mobius-universal.js',
  '/mobius-text-v2.js',
  '/mobius.html',
  '/red-letters.html',
  '/one-family-in-christ.html',
  '/bible-heritage-data.js',
  '/one-family-tree.js',
  '/one-family-tree.css',
  '/tool-pages.css',
  '/reader.html',
  '/study.html',
  '/my-verses.html',
  '/sermon.html',
  '/message.html',
  '/prayer-wall.html',
  '/search.html',
  '/contact.html',
  '/privacy.html',
  '/faq.html',
  '/explore.html',
  '/seasonal.html',
  '/give.html',
  '/journal/index.html',
  '/wins-report.html',
  '/wins.html',
  '/progress.html',
  '/sos.html',
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
  '/kids/index.html',
  '/bible/index.html',
  '/bible/study.html',
  '/bible/tools.html',
  '/bible/bible-hub.css',
  '/bible/bible-hub.js',
  '/bible/bible-study.css',
  '/bible/bible-study.js',
  '/bible/bible-tools.css',
  '/bible/bible-tools.js',
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
  '/kids/kids-page-sky.css?v=20260817-skylife',
  '/kids/kids-page-sky.js',
  '/kids/kids-page-sky.js?v=20260326playful',
  '/kids/kids-page-sky.js?v=20260817-shootvar',
  '/kids/kids-battle.js',
  '/kids/kids-verses-365.js',
  '/kids/kids-parent.js',
  '/kids/kids-gentle-journey.js',
  '/kids/kids-gentle-shepherd.js',
  '/kids/kids-hub-play.css',
  '/kids/kids-hub-play.js',
  '/kids/kids-wins-recap.js',





























  '/kids/corner.html',
  '/kids/all-stories.html',
  '/kids/kids-all-stories.js',
  '/kids-corner.html',
  '/kids-corner-daily-verse.js',
  '/kids-corner-daily-verse.js?v=2',
  '/kids-corner-daily-verse.js?v=3',
  '/family.html',
  '/family-armor.html',
  '/family-armor-little-ones.html',
  '/little-ones.html',
  '/coloring.html',
  '/church-starter-pack.html',
  '/for-pastors.html',
  '/yearly-rhythm.html',
  '/year-at-a-glance.html',
  '/one-week-rhythm.html',
  '/one-week-rhythm-kids.html',
  '/verse-image.html',
  '/site-search-index.json',
  '/tdb-quiet-luxury.css',
  '/tdb-calm-hubs.css',
  '/tdb-home-page.css',
  '/tdb-home-feel.js',
  '/tdb-porch-restfulness.js',
  '/tdb-visual-tokens.css',
  '/fonts/cormorant-garamond-hero-latin.woff2',
  '/tdb-home-hero-lcp-critical.css',
  '/family-activity-packs.html',
  '/print-pack-generator.js',
  '/embed-verse-widget.js',
  '/embeddable-widgets-page.js',
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
  '/verse-context.js',
  '/verse-breakdown.js',
  '/verse-breakdown-overrides.js',
  '/gentle-suggest.js',
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
  '/memorize.html',
  '/tdb-offline-strip.js',
  '/memorize.js',
  '/word-study.js',
  '/verse-study.js',
  '/verse-narration.js',
  '/kjv-lexicon.json',
  '/modal.html',
  '/manifest.json',
  '/favicon.ico',
  '/icon.svg',
  '/world-map-source.svg',
  '/kjv.json',
  '/assets/data/kjv.json',
  '/data/kjv-full.json',
  /* Simpler English (BBE) — offline after first SW install; KJV remains primary. */
  '/data/bbe-full.json',
  '/bbe-simple.js',
  '/data/kjv-verses.json',
  '/data/ask-the-word-answers.json',
  '/ask-the-word-answers.json',
  '/ask-the-word-core.js',
  '/learn-the-word.html',
  '/bible-characters.json',
  '/people-verse-map.js',
  '/daily-verses.js',
  '/register-sw.js'
];

const CDN_FUSE_JS = 'https://cdn.jsdelivr.net/npm/fuse.js@7.0.0/dist/fuse.min.js';

var AUDIO_ASSETS = [];

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

/** Precache each URL alone so one failure does not roll back the entire batch (Cache.addAll is atomic). Reduces WebKit install noise. */
function precacheUrlsLenient(cache, urls) {
  return Promise.all(
    urls.map(function (path) {
      if (!path || typeof path !== 'string') return Promise.resolve();
      var p = path.trim();
      /* WebKit sometimes surfaces "." / "./" in precache paths and logs "Cannot load ." — skip quietly. */
      if (!p || p === '.' || p === './') return Promise.resolve();
      return cache.add(p).catch(function () {});
    })
  );
}

/** Offline document navigation when the exact path is not in cache (hub slash URLs). */
function offlineNavigateFallbackPath(pathname) {
  if (!pathname) return null;
  var map = {
    '/kids': '/kids/index.html',
    '/kids/': '/kids/index.html',
    '/bible': '/bible/index.html',
    '/bible/': '/bible/index.html',
    '/pastor': '/church-hub.html',
    '/pastor/': '/church-hub.html',
    '/church': '/church/index.html',
    '/church/': '/church/index.html'
  };
  return map[pathname] || null;
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
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function (cache) {
        return precacheUrlsLenient(cache, CORE_ASSETS).then(function () {
          return Promise.all([
            cache.add(CDN_FUSE_JS).catch(function () {}),
            precacheUrlsLenient(cache, AUDIO_ASSETS),
            seedVerseCache()
          ]);
        });
      })
      .then(function () {
        self.skipWaiting();
      })
      .catch(function () {
        self.skipWaiting();
      })
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
  var rawUrl = String((data && data.url) || '/').trim();
  var safeUrl = !rawUrl || rawUrl === '.' ? '/' : rawUrl;
  if (safeUrl !== '/' && !safeUrl.startsWith('/') && !/^https:\/\//i.test(safeUrl)) safeUrl = '/';
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
  var raw = (event.notification.data && event.notification.data.url) || '/';
  var url = typeof raw === 'string' ? raw.trim() : '/';
  if (!url || url === '.') url = '/';
  else if (url !== '/' && !url.startsWith('/') && !/^https:\/\//i.test(url)) url = '/';
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((list) => {
      function openTarget() {
        return clients.openWindow ? clients.openWindow(url) : Promise.resolve();
      }
      if (!list.length) return openTarget();
      var client = list[0];
      return client.focus().then(function () {
        if (typeof client.navigate === 'function') {
          return client.navigate(url).catch(function () {
            return openTarget();
          });
        }
        return openTarget();
      }).catch(function () {
        return openTarget();
      });
    })
  );
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  var rawReq = event.request.url;
  /* Safari/WebKit: bogus "." requests during SW update or precache show "Cannot load ." — do not intercept. */
  if (!rawReq || rawReq === '.' || /^\s*\.\s*$/.test(String(rawReq))) {
    return;
  }
  let url;
  try {
    url = new URL(event.request.url);
  } catch (e) {
    return;
  }
  if (url.pathname === '.' || url.pathname === '/.') {
    return;
  }
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

  // Full KJV corpus (~31k) + legacy stub – offline-first: cache then network
  if (
    url.pathname.endsWith('kjv-full.json') ||
    url.pathname.endsWith('/data/kjv-full.json') ||
    url.pathname.endsWith('kjv-verses.json') ||
    url.pathname.endsWith('/data/kjv-verses.json') ||
    url.pathname.endsWith('kjv.json') ||
    url.pathname.endsWith('/kjv.json') ||
    url.pathname.endsWith('/assets/data/kjv.json')
  ) {
    event.respondWith(
      caches.match(event.request).then((cached) => {
        if (cached) return cached;
        return fetch(event.request).then((res) => {
          if (res && res.ok) {
            const clone = res.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone)).catch(() => {});
            return res;
          }
          /* Prefer full corpus alts, then stub */
          return fetch('/data/kjv-full.json')
            .then((fullRes) => {
              if (fullRes && fullRes.ok) {
                const fullClone = fullRes.clone();
                caches.open(CACHE_NAME).then((cache) => cache.put('/data/kjv-full.json', fullClone)).catch(() => {});
                return fullRes;
              }
              return fetch('/assets/data/kjv.json').then((altRes) => {
                if (altRes && altRes.ok) {
                  const altClone = altRes.clone();
                  caches.open(CACHE_NAME).then((cache) => cache.put('/assets/data/kjv.json', altClone)).catch(() => {});
                }
                return altRes;
              });
            })
            .catch(() =>
              fetch('/assets/data/kjv.json').catch(() => fetch('/kjv.json'))
            );
        });
      }).catch(() => fetch('/data/kjv-full.json').catch(() => fetch('/assets/data/kjv.json')))
    );
    return;
  }

  // Today's verse + prayer (daily_battles API) – offline-first: cache then network
  if (url.href.includes('daily_battles')) {
    event.respondWith(
      caches.match(event.request).then((cached) => {
        if (cached) return cached;
        return fetch(event.request).then((res) => {
          if (res && res.ok) {
            const clone = res.clone();
            caches.open(CACHE_API).then((cache) => cache.put(event.request, clone)).catch(() => {});
          }
          return res;
        });
      }).catch(() => new Response('[]', {
        status: 200,
        headers: { 'content-type': 'application/json; charset=utf-8' }
      }))
    );
    return;
  }

  // Verse endpoint requests (same-origin + JSON feeds): stale-while-revalidate.
  const isVerseRequest = (
    url.pathname.includes('/verse') ||
    url.pathname.includes('/daily-verse') ||
    url.pathname.endsWith('/daily-verses.js') ||
    url.pathname.endsWith('/kjv.json') ||
    url.pathname.endsWith('/assets/data/kjv.json') ||
    url.pathname.endsWith('/data/kjv-full.json') ||
    url.pathname.endsWith('/kjv-full.json') ||
    url.pathname.endsWith('/data/kjv-verses.json')
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

  // Same-origin images & SVG: stale-while-revalidate (fast paint from cache, refresh in background)
  if (sameOrigin && /\.(png|jpe?g|gif|webp|svg|ico)(\?|$)/i.test(url.pathname)) {
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

  // Only cache same-origin GETs; let cross-origin (analytics, third-party CDN) load normally
  if (!sameOrigin) return;

  // Hero teaching calendar / lock files: never serve yesterday from precache.
  if (
    url.pathname.endsWith('/hero-daily-365-data.js') ||
    url.pathname.endsWith('/hero-daily-365-explanations.js') ||
    url.pathname.endsWith('/hero-daily-first-paint.js') ||
    url.pathname.endsWith('/verse-breakdown-standard.js') ||
    url.pathname.endsWith('/ask-the-word-core.js') ||
    url.pathname.endsWith('/core-home.js') ||
    url.pathname.endsWith('/bbe-simple.js') ||
    url.pathname.endsWith('/tdb-home-feel.js') ||
    url.pathname.endsWith('/tdb-verse-accuracy.js')
  ) {
    event.respondWith(
      fetch(event.request)
        .then(function (res) {
          if (res && res.ok) {
            var clone = res.clone();
            caches.open(CACHE_NAME).then(function (cache) {
              cache.put(event.request, clone).catch(function () {});
            });
          }
          return res;
        })
        .catch(function () {
          return matchCachedSameOriginAsset(CACHE_NAME, event.request, url).then(function (hit) {
            if (hit) return hit;
            return new Response('/* Offline — hero teaching unavailable */', {
              status: 503,
              headers: { 'content-type': 'application/javascript; charset=utf-8' }
            });
          });
        })
    );
    return;
  }

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

  // script.js: network-first; stash last OK response as /script.js for offline recovery. CACHE_NAME bump invalidates.
  if (url.pathname === '/script.js' || url.pathname.endsWith('/script.js')) {
    event.respondWith(
      fetch(event.request)
        .then((res) => {
          if (res && res.ok) {
            const clone = res.clone();
            const keyReq = new Request(new URL('/script.js', self.location.origin).toString(), { method: 'GET' });
            caches.open(CACHE_NAME).then((cache) => cache.put(keyReq, clone)).catch(() => {});
          }
          return res;
        })
        .catch(() =>
          caches
            .open(CACHE_NAME)
            .then((cache) => cache.match('/script.js', { ignoreSearch: true }))
            .then((cached) => {
              if (cached) return cached;
              return new Response('// Offline — script unavailable. Reconnect to load the app bundle.', {
                status: 503,
                headers: { 'content-type': 'application/javascript; charset=utf-8' }
              });
            })
        )
    );
    return;
  }

  /*
   * Kids Story Library JS/CSS must be network-first.
   * Cache-first + pathname match was serving stale kids-corner.js / kids-battle.css
   * (precache /kids/kids-corner.js ignored ?v= cache-bust), so open-story kept stick
   * panels and unreadable text after deploys shipped full-color art.
   */
  if (
    sameOrigin &&
    /\.(js|css)$/i.test(url.pathname) &&
    (
      url.pathname.indexOf('/kids/') === 0 ||
      /\/kids-(battle|corner|gentle|hub|read|story|verses)/i.test(url.pathname) ||
      /\/loop-library-coloring\.js$/i.test(url.pathname)
    )
  ) {
    event.respondWith(
      fetch(event.request)
        .then(function (res) {
          if (res && res.ok) {
            var clone = res.clone();
            caches.open(CACHE_NAME).then(function (cache) {
              cache.put(event.request, clone).catch(function () {});
              /* Also refresh pathname-only key used by offline match */
              try {
                cache.put(url.pathname, res.clone()).catch(function () {});
              } catch (_e) {}
            });
          }
          return res;
        })
        .catch(function () {
          return matchCachedSameOriginAsset(CACHE_NAME, event.request, url).then(function (hit) {
            if (hit) return hit;
            return new Response('/* Offline — kids asset unavailable */', {
              status: 503,
              headers: { 'content-type': /\.css$/i.test(url.pathname) ? 'text/css; charset=utf-8' : 'application/javascript; charset=utf-8' }
            });
          });
        })
    );
    return;
  }

  // Never cache config.js or footer-build-stamp.js so deployments take effect immediately
  if (url.pathname.endsWith('config.js') || url.pathname.endsWith('footer-build-stamp.js')) return;

  // Home teaching must be network-first. Stale-while-revalidate kept yesterday’s
  // relate-line on returning visits even after a refresh.
  if (
    event.request.mode === 'navigate' &&
    (url.pathname === '/' || url.pathname === '/index.html' || url.pathname === '')
  ) {
    event.respondWith(
      fetch(event.request)
        .then(function (res) {
          if (res && res.ok && !res.redirected) {
            var clone = res.clone();
            caches.open(CACHE_NAME).then(function (cache) {
              cache.put(event.request, clone).catch(function () {});
              try {
                cache.put('/index.html', res.clone()).catch(function () {});
              } catch (_eHome) {}
            });
          }
          return res;
        })
        .catch(function () {
          return caches.open(CACHE_NAME).then(function (cache) {
            return cache.match(event.request).then(function (hit) {
              if (hit && !hit.redirected) return hit;
              return cache.match('/index.html').then(function (idx) {
                return (idx && !idx.redirected) ? idx : cache.match(OFFLINE_URL);
              });
            });
          });
        })
    );
    return;
  }

  // HTML navigations: stale-while-revalidate for instant repeat-visit loads.
  // Cached HTML is served immediately on return visits; network refreshes the cache in background.
  // On first visit or when offline, falls back to the full offline chain.
  // NOTE: Never serve or cache a redirected response — WebKit/Safari rejects them from SW cache.
  if (event.request.mode === 'navigate') {
    event.respondWith(
      caches.open(CACHE_NAME).then(function (cache) {
        // Try exact match first, then /pathname.html fallback (handles /about → /about.html).
        // Discard any cached response that is itself a redirect (legacy stale entries).
        return cache.match(event.request).then(function (cached) {
          var validCached = (cached && !cached.redirected) ? cached : null;
          var htmlFallbackFetch = !validCached
            ? cache.match(url.pathname.replace(/\/?$/, '.html').replace(/\/\.html$/, '/index.html'))
            : Promise.resolve(null);
          return htmlFallbackFetch.then(function (htmlFallback) {
            var bestCached = validCached || (htmlFallback && !htmlFallback.redirected ? htmlFallback : null);
            var networkFetch = fetch(event.request)
              .then(function (res) {
                // Only cache a final, non-redirected 2xx response to avoid storing redirect chains.
                if (res && res.ok && !res.redirected) {
                  cache.put(event.request, res.clone()).catch(function () {});
                  return res;
                }
                // WebKit/Safari rejects redirected responses served from a SW.
                // When the network follows a redirect (e.g. /explore → /explore.html),
                // re-fetch the final URL directly so the browser gets a clean 200.
                if (res && res.redirected && res.ok && res.url) {
                  return fetch(res.url).then(function (finalRes) {
                    if (finalRes && finalRes.ok && !finalRes.redirected) {
                      cache.put(event.request, finalRes.clone()).catch(function () {});
                    }
                    return finalRes;
                  }).catch(function () { return res; });
                }
                return res;
              })
              .catch(function () {
                // Offline: walk the fallback chain
                var base = bestCached
                  ? Promise.resolve(bestCached)
                  : (url.pathname === '/' || url.pathname === '')
                    ? cache.match('/index.html')
                    : (function () {
                        var alt = offlineNavigateFallbackPath(url.pathname);
                        return alt ? cache.match(alt) : Promise.resolve(null);
                      }());
                return base.then(function (hit) {
                  if (hit) return hit;
                  return cache.match(OFFLINE_URL).then(function (op) {
                    return op || new Response('You are offline. Check back later.', { status: 503 });
                  });
                });
              });
            // Serve cached immediately; let network fetch update the cache in background
            if (bestCached) {
              networkFetch.catch(function () {});
              return bestCached;
            }
            return networkFetch;
          });
        });
      })
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
