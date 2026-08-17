/**
 * Fetch approximate lat/lon from same-origin /api/sky-geo (Cloudflare edge IP geolocation).
 * Caches per calendar day in sessionStorage (tdbSkyGeoIp). GPS opt-in still wins (tdbSkyGeoGps / tdbSkyGeo).
 */
(function () {
  'use strict';
  var URL = '/api/sky-geo';

  function todayStr() {
    return new Date().toDateString();
  }

  function needsFetch() {
    try {
      var raw = sessionStorage.getItem('tdbSkyGeoIp');
      if (!raw) return true;
      var o = JSON.parse(raw);
      if (!o || typeof o.lat !== 'number' || typeof o.lon !== 'number') return true;
      return o.saved !== todayStr();
    } catch (e) {
      return true;
    }
  }

  window.tdbFetchSkyGeoFromIp = function (done) {
    if (typeof done !== 'function') done = function () {};
    if (typeof fetch !== 'function') {
      done(false);
      return;
    }
    if (!needsFetch()) {
      done(false);
      return;
    }
    var ctrl = typeof AbortController !== 'undefined' ? new AbortController() : null;
    var tid = ctrl ? setTimeout(function () {
      try {
        ctrl.abort();
      } catch (a) {}
    }, 4500) : null;
    fetch(URL, { credentials: 'same-origin', cache: 'no-store', signal: ctrl ? ctrl.signal : undefined })
      .then(function (r) {
        if (tid) clearTimeout(tid);
        return r && r.ok ? r.json() : null;
      })
      .catch(function () {
        if (tid) clearTimeout(tid);
        return null;
      })
      .then(function (j) {
        if (!j || typeof j.lat !== 'number' || typeof j.lon !== 'number' || !isFinite(j.lat) || !isFinite(j.lon)) {
          done(false);
          return;
        }
        var saved = todayStr();
        var payload = JSON.stringify({ lat: j.lat, lon: j.lon, saved: saved, source: j.source || 'ip' });
        try {
          sessionStorage.setItem('tdbSkyGeoIp', payload);
        } catch (e2) {}
        try {
          localStorage.setItem('tdbSkyGeoIp', payload);
        } catch (e3) {}
        done(true);
      });
  };
})();
