/**
 * Save Life Lesson anchor verses to My Study (same localStorage as script.js).
 */
(function () {
  'use strict';

  var COLLECTIONS_KEY = 'savedCollections';
  var ITEMS_KEY = 'savedCollectionItems';

  function uuid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = (Math.random() * 16) | 0;
      var v = c === 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  }

  function loadCollections() {
    try {
      return JSON.parse(localStorage.getItem(COLLECTIONS_KEY) || '[]');
    } catch (e) {
      return [];
    }
  }

  function saveCollections(items) {
    try {
      localStorage.setItem(COLLECTIONS_KEY, JSON.stringify(items));
    } catch (e) { /* ignore */ }
  }

  function loadItems() {
    try {
      return JSON.parse(localStorage.getItem(ITEMS_KEY) || '[]');
    } catch (e) {
      return [];
    }
  }

  function saveItems(items) {
    try {
      localStorage.setItem(ITEMS_KEY, JSON.stringify(items));
    } catch (e) { /* ignore */ }
  }

  function ensureDefaultCollection() {
    var collections = loadCollections();
    if (collections.length) return collections[0].id;
    var general = { id: uuid(), name: 'General' };
    saveCollections([general]);
    return general.id;
  }

  function saveAnchor(refRaw, textRaw) {
    if (typeof window.tdbSaveDailyVerseToMyVerses === 'function') {
      return window.tdbSaveDailyVerseToMyVerses(refRaw, textRaw);
    }
    var ref = String(refRaw || '')
      .replace(/\s*\(KJV\)\s*$/i, '')
      .trim();
    var text = String(textRaw || '')
      .replace(/<[^>]+>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
    if (!ref || !text) return Promise.resolve({ ok: false, reason: 'empty' });
    var collectionId = ensureDefaultCollection();
    var items = loadItems();
    var exists = items.some(function (item) {
      return item.ref === ref && item.collection_id === collectionId;
    });
    if (exists) return Promise.resolve({ ok: true, already: true });
    items.unshift({
      id: uuid(),
      ref: ref,
      text: text,
      collection_id: collectionId,
      saved_at: Date.now(),
    });
    saveItems(items);
    try {
      window.dispatchEvent(new CustomEvent('tdb-my-verses-updated'));
    } catch (e2) { /* ignore */ }
    return Promise.resolve({ ok: true, already: false });
  }

  function wireSaveButton() {
    var btn = document.getElementById('tdb-ll-save-mystudy');
    if (!btn) return;
    var ref = btn.getAttribute('data-tdb-ll-save-ref') || '';
    var text = btn.getAttribute('data-tdb-ll-save-text') || '';
    var status = document.getElementById('tdb-ll-save-status');
    var collectionId = ensureDefaultCollection();

    function refresh() {
      var items = loadItems();
      var exists = items.some(function (item) {
        return item.ref === ref && item.collection_id === collectionId;
      });
      if (exists) {
        btn.textContent = 'Saved in My Study';
        btn.disabled = true;
        btn.setAttribute('aria-label', 'This verse is already in My Study');
      }
    }

    btn.addEventListener('click', function () {
      btn.disabled = true;
      saveAnchor(ref, text).then(function (res) {
        if (res.ok && res.already) {
          if (status) status.textContent = 'Already in My Study on this device.';
          btn.textContent = 'Saved in My Study';
        } else if (res.ok) {
          if (status) status.textContent = 'Saved privately on this device.';
          btn.textContent = 'Saved in My Study';
          if (typeof window.trackEvent === 'function') {
            window.trackEvent('life_lesson_save_mystudy', { ref: ref });
          }
        } else {
          btn.disabled = false;
          if (status) status.textContent = 'Could not save just now. Try again in a moment.';
        }
        refresh();
      });
    });
    refresh();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', wireSaveButton);
  } else {
    wireSaveButton();
  }
})();
