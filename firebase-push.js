/**
 * Firebase push notifications for todaysdailybattle.com — daily 9 AM verse + streak alert.
 * No UI. Backend logic only: register service worker, request permission, get FCM token, send to backend.
 * Load after Firebase SDK: firebase-app.js, firebase-messaging.js.
 * Call tdbFirebasePushSubscribe() when user opts in (e.g. from existing notification toggle).
 * Backend: send "Verse ready" at 9 AM and optionally "Streak alert" — see docs/DAILY-PUSH-AND-EMAIL.md.
 */
(function () {
  'use strict';

  var cfg = typeof window !== 'undefined' && window.TDB_CONFIG;
  var hasFirebaseConfig = cfg && cfg.FIREBASE_API_KEY && cfg.FIREBASE_PROJECT_ID && cfg.FIREBASE_MESSAGING_SENDER_ID && cfg.FIREBASE_APP_ID;
  var LAST_SENT_FCM_TOKEN_KEY = 'tdb_last_sent_fcm_token';
  var LAST_FCM_TOKEN_KEY = 'tdb_last_fcm_token';
  var FIREBASE_APP_SDK_URL = 'https://www.gstatic.com/firebasejs/10.7.0/firebase-app-compat.js';
  var FIREBASE_MESSAGING_SDK_URL = 'https://www.gstatic.com/firebasejs/10.7.0/firebase-messaging-compat.js';
  var _firebaseSdkPromise = null;

  function getReg() {
    if (!('serviceWorker' in navigator)) return Promise.resolve(null);
    return navigator.serviceWorker.register('/sw.js?v=20260330-sw-v113').then(function (reg) { return reg; }).catch(function () { return null; });
  }

  function requestPermission() {
    if (!('Notification' in window)) return Promise.resolve('unsupported');
    return Notification.requestPermission();
  }

  function loadScriptOnce(src) {
    return new Promise(function (resolve, reject) {
      var existing = document.querySelector('script[data-sdk-src="' + src + '"]');
      if (existing) {
        if (existing.dataset.loaded === 'true') {
          resolve();
          return;
        }
        existing.addEventListener('load', function onLoad() {
          existing.removeEventListener('load', onLoad);
          resolve();
        });
        existing.addEventListener('error', function onError() {
          existing.removeEventListener('error', onError);
          reject(new Error('SDK load failed: ' + src));
        });
        return;
      }
      var script = document.createElement('script');
      script.src = src;
      script.defer = true;
      script.crossOrigin = 'anonymous';
      script.dataset.sdkSrc = src;
      script.onload = function () {
        script.dataset.loaded = 'true';
        resolve();
      };
      script.onerror = function () {
        reject(new Error('SDK load failed: ' + src));
      };
      document.head.appendChild(script);
    });
  }

  function ensureFirebaseSdkLoaded() {
    if (!hasFirebaseConfig) return Promise.resolve(false);
    if (typeof window === 'undefined' || !document || !document.head) return Promise.resolve(false);
    if (typeof firebase !== 'undefined' && firebase.messaging) return Promise.resolve(true);
    if (_firebaseSdkPromise) return _firebaseSdkPromise;
    _firebaseSdkPromise = loadScriptOnce(FIREBASE_APP_SDK_URL)
      .then(function () { return loadScriptOnce(FIREBASE_MESSAGING_SDK_URL); })
      .then(function () {
        return !!(typeof firebase !== 'undefined' && firebase.messaging);
      })
      .catch(function () {
        return false;
      })
      .finally(function () {
        _firebaseSdkPromise = null;
      });
    return _firebaseSdkPromise;
  }

  /**
   * Register service worker, request notification permission, get FCM token, POST to backend.
   * Call this when user opts in (e.g. after they enable "9 AM verse" in settings).
   */
  function tdbFirebasePushSubscribe() {
    return getReg()
      .then(function (reg) {
        if (!reg) return null;
        return requestPermission().then(function (permission) {
          if (permission !== 'granted') return null;
          return reg;
        });
      })
      .then(function (reg) {
        if (!reg || !hasFirebaseConfig) return null;
        return ensureFirebaseSdkLoaded().then(function (ready) {
          return ready ? reg : null;
        });
      })
      .then(function (reg) {
        if (!reg) return null;
        if (typeof firebase === 'undefined' || !firebase.messaging) return null;
        try {
          var app = firebase.app();
          if (!app) app = firebase.initializeApp({
            apiKey: cfg.FIREBASE_API_KEY,
            authDomain: cfg.FIREBASE_AUTH_DOMAIN || cfg.FIREBASE_PROJECT_ID + '.firebaseapp.com',
            projectId: cfg.FIREBASE_PROJECT_ID,
            storageBucket: cfg.FIREBASE_STORAGE_BUCKET || cfg.FIREBASE_PROJECT_ID + '.appspot.com',
            messagingSenderId: cfg.FIREBASE_MESSAGING_SENDER_ID,
            appId: cfg.FIREBASE_APP_ID
          });
          var messaging = firebase.messaging();
          var opts = { serviceWorkerRegistration: reg };
          if (cfg.FIREBASE_VAPID_KEY) opts.vapidKey = cfg.FIREBASE_VAPID_KEY;
          return messaging.getToken(opts);
        } catch (e) {
          return Promise.reject(e);
        }
      })
      .then(function (token) {
        if (!token) return;
        try { localStorage.setItem(LAST_FCM_TOKEN_KEY, token); } catch (e) {}
        var lastSent = '';
        try { lastSent = localStorage.getItem(LAST_SENT_FCM_TOKEN_KEY) || ''; } catch (e) {}
        if (lastSent && lastSent === token) return;
        var url = (cfg && cfg.FCM_SUBSCRIBE_URL) || (cfg && cfg.PUSH_SUBSCRIBE_URL) || '';
        if (!url) return;
        return fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token: token, source: 'firebase', domain: 'todaysdailybattle.com' })
        }).then(function (res) {
          if (res && res.ok) {
            try { localStorage.setItem(LAST_SENT_FCM_TOKEN_KEY, token); } catch (e) {}
          }
        });
      })
      .catch(function () {});
  }

  function tdbFirebasePushUnsubscribe() {
    var url = (cfg && cfg.FCM_UNSUBSCRIBE_URL) || '';
    var token = '';
    try { token = localStorage.getItem(LAST_FCM_TOKEN_KEY) || localStorage.getItem(LAST_SENT_FCM_TOKEN_KEY) || ''; } catch (e) {}
    if (!url || !token) return Promise.resolve();
    return fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token: token, source: 'firebase', domain: 'todaysdailybattle.com' })
    }).then(function () {
      try { localStorage.removeItem(LAST_SENT_FCM_TOKEN_KEY); } catch (e) {}
    }).catch(function () {});
  }

  /**
   * Ensure service worker is registered (for push). Resolves with registration or null.
   */
  function ensureServiceWorkerRegistered() {
    if (!('serviceWorker' in navigator)) return Promise.resolve(null);
    if (navigator.serviceWorker.controller) return navigator.serviceWorker.ready;
    return getReg();
  }

  window.tdbFirebasePushSubscribe = tdbFirebasePushSubscribe;
  window.tdbFirebasePushUnsubscribe = tdbFirebasePushUnsubscribe;
  window.tdbFirebaseEnsureSW = ensureServiceWorkerRegistered;
})();
