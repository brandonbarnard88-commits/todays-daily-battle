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

  function getReg() {
    if (!('serviceWorker' in navigator)) return Promise.resolve(null);
    return navigator.serviceWorker.register('/service-worker.js').then(function (reg) { return reg; }).catch(function () { return null; });
  }

  function requestPermission() {
    if (!('Notification' in window)) return Promise.resolve('unsupported');
    return Notification.requestPermission();
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
        var url = (cfg && cfg.FCM_SUBSCRIBE_URL) || (cfg && cfg.PUSH_SUBSCRIBE_URL) || '';
        if (!url) return;
        return fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token: token, source: 'firebase', domain: 'todaysdailybattle.com' })
        });
      })
      .catch(function () {});
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
  window.tdbFirebaseEnsureSW = ensureServiceWorkerRegistered;
})();
