/**
 * Gregorian Easter window + shared dismissible banner wiring.
 * Used by index.html, plans.html, verse.html (same localStorage key).
 */
(function (global) {
  'use strict';

  var DEFAULT_KEY = 'tdb-easter-banner-dismissed';

  function easterSunday(y) {
    var a = y % 19;
    var b = Math.floor(y / 100);
    var c = y % 100;
    var d = Math.floor(b / 4);
    var e = b % 4;
    var f = Math.floor((b + 8) / 25);
    var g = Math.floor((b - f + 1) / 3);
    var h = (19 * a + b - d - g + 15) % 30;
    var i = Math.floor(c / 4);
    var k = c % 4;
    var l = (32 + 2 * e + 2 * i - h - k) % 7;
    var m = Math.floor((a + 11 * h + 22 * l) / 451);
    var month = Math.floor((h + l - 7 * m + 114) / 31);
    var day = ((h + l - 7 * m + 114) % 31) + 1;
    return new Date(y, month - 1, day);
  }

  /**
   * @param {Date} [when] - defaults to now
   * @param {number} [daysBefore] - default 14
   * @param {number} [daysAfter] - default 7
   */
  function inEasterWindow(when, daysBefore, daysAfter) {
    var now = when ? new Date(when) : new Date();
    now.setHours(12, 0, 0, 0);
    var before = typeof daysBefore === 'number' ? daysBefore : 14;
    var after = typeof daysAfter === 'number' ? daysAfter : 7;
    var sun = easterSunday(now.getFullYear());
    sun.setHours(12, 0, 0, 0);
    var start = new Date(sun);
    start.setDate(sun.getDate() - before);
    var end = new Date(sun);
    end.setDate(sun.getDate() + after);
    return now >= start && now <= end;
  }

  function hideBanner(banner) {
    banner.classList.add('hidden');
    banner.setAttribute('hidden', '');
  }

  function showBanner(banner) {
    banner.classList.remove('hidden');
    banner.removeAttribute('hidden');
  }

  /** When the Easter banner is visible, hide the optional Morning doorway hint (index). */
  function syncMorningDoorwayHint(banner) {
    var hint = document.getElementById('tdbMorningDoorwayHint');
    if (!hint || !banner) return;
    var bannerHidden = banner.classList.contains('hidden') || banner.hasAttribute('hidden');
    if (bannerHidden) {
      hint.removeAttribute('hidden');
    } else {
      hint.setAttribute('hidden', '');
    }
  }

  /**
   * @param {string} bannerId
   * @param {string} dismissId
   * @param {string} [storageKey]
   */
  function initEasterBanner(bannerId, dismissId, storageKey) {
    var key = storageKey || DEFAULT_KEY;
    var banner = document.getElementById(bannerId);
    var dismiss = dismissId ? document.getElementById(dismissId) : null;
    if (!banner) return;

    if (!inEasterWindow() || (typeof global.localStorage !== 'undefined' && global.localStorage.getItem(key) === '1')) {
      hideBanner(banner);
    } else {
      showBanner(banner);
    }

    syncMorningDoorwayHint(banner);

    if (dismiss) {
      dismiss.addEventListener('click', function () {
        try {
          global.localStorage.setItem(key, '1');
        } catch (_) {}
        hideBanner(banner);
        syncMorningDoorwayHint(banner);
      });
    }
  }

  global.TDB_EASTER_SEASON = {
    easterSunday: easterSunday,
    inEasterWindow: inEasterWindow,
    initEasterBanner: initEasterBanner,
    DEFAULT_STORAGE_KEY: DEFAULT_KEY
  };
})(typeof window !== 'undefined' ? window : globalThis);
