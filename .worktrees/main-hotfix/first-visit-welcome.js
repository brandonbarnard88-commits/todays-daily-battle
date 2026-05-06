/**
 * One-time first-visit welcome on Home — links to #feel-section and site tour; dismiss saves localStorage.
 */
(function () {
  'use strict';

  var KEY = 'tdb_welcome_calm_campus_v1';

  function markSeen() {
    try {
      localStorage.setItem(KEY, '1');
    } catch (e) {}
  }

  function hasSeen() {
    try {
      return localStorage.getItem(KEY) === '1';
    } catch (e) {
      return true;
    }
  }

  function tryOpenTour() {
    var tour = document.getElementById('tdb-tour-open-btn') || document.querySelector('.tdb-tour-open-btn');
    if (tour) {
      tour.click();
      return;
    }
    window.location.href = '/explore.html#first-visit-tour';
  }

  document.addEventListener('DOMContentLoaded', function () {
    if (hasSeen()) return;
    var d = document.getElementById('tdbFirstVisitDialog');
    if (!d || typeof d.showModal !== 'function') return;

    setTimeout(function () {
      if (hasSeen()) return;
      d.showModal();
    }, 700);

    var feel = document.getElementById('tdbFirstVisitFeel');
    var tour = document.getElementById('tdbFirstVisitTour');
    var notNow = document.getElementById('tdbFirstVisitNotNow');
    if (feel) {
      feel.addEventListener('click', function () {
        markSeen();
        d.close();
      });
    }
    if (tour) {
      tour.addEventListener('click', function () {
        markSeen();
        d.close();
        tryOpenTour();
      });
    }
    if (notNow) {
      notNow.addEventListener('click', function () {
        markSeen();
        d.close();
      });
    }
    d.addEventListener('close', function () {
      markSeen();
    });
  });
})();
