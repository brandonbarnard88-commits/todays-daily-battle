/**
 * One interrupt max per visit — coordinates quiet-update, first-visit, backup, and optional modals.
 * Load early (defer is fine). Sets html.tdb-interrupt-active while a primary notice owns the slot.
 */
(function () {
  'use strict';

  var SLOT_KEY = 'tdb_interrupt_slot_v1';
  var claimed = false;

  function lsGet(k) {
    try {
      return localStorage.getItem(k);
    } catch (e) {
      return null;
    }
  }

  function lsSet(k, v) {
    try {
      localStorage.setItem(k, v);
    } catch (e) {}
  }

  function sessionClaimed() {
    try {
      return sessionStorage.getItem(SLOT_KEY) === '1';
    } catch (e) {
      return claimed;
    }
  }

  function claim(name) {
    if (sessionClaimed()) return false;
    claimed = true;
    try {
      sessionStorage.setItem(SLOT_KEY, '1');
      sessionStorage.setItem(SLOT_KEY + '_name', name || '1');
    } catch (e) {}
    try {
      document.documentElement.classList.add('tdb-interrupt-active');
      document.documentElement.setAttribute('data-tdb-interrupt', name || '1');
    } catch (e2) {}
    return true;
  }

  function release() {
    claimed = false;
    try {
      sessionStorage.removeItem(SLOT_KEY);
      sessionStorage.removeItem(SLOT_KEY + '_name');
    } catch (e) {}
    try {
      document.documentElement.classList.remove('tdb-interrupt-active');
      document.documentElement.removeAttribute('data-tdb-interrupt');
    } catch (e2) {}
  }

  window.TDB_oneInterrupt = {
    canShow: function () {
      return !sessionClaimed();
    },
    claim: claim,
    release: release,
    isActive: sessionClaimed
  };

  function wireQuietUpdate() {
    var strip = document.getElementById('quiet-update') || document.getElementById('plans-quiet-update');
    if (!strip) return;
    if (document.documentElement.classList.contains('tdb-quiet-update-dismissed')) {
      strip.hidden = true;
      return;
    }
    if (!claim('quiet-update')) {
      strip.hidden = true;
      return;
    }
    var btn = strip.querySelector('[id$="quiet-update-dismiss"], .tdb-quiet-update-strip__dismiss');
    if (btn) {
      btn.addEventListener('click', function () {
        release();
      });
    }
  }

  function blockExtraModals() {
    /* First-visit welcome modal: never auto-open if something else claimed the slot. */
    var d = document.getElementById('tdbFirstVisitDialog');
    if (!d) return;
    var orig = d.showModal;
    if (typeof orig !== 'function') return;
    d.showModal = function () {
      if (!window.TDB_oneInterrupt.canShow() && !d.open) return;
      if (!d.open && !claim('first-visit')) return;
      return orig.apply(d, arguments);
    };
    d.addEventListener('close', function () {
      release();
    });
  }

  function boot() {
    wireQuietUpdate();
    blockExtraModals();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot, { once: true });
  } else {
    boot();
  }
})();
