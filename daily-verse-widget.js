/**
 * Daily Verse widget — self-contained, CSP-safe (no inline script).
 * Drop-in: add <div id="daily-verse-widget"></div> and <script src="daily-verse-widget.js"></script>.
 * Uses event listeners on IDs; pulls today's verse from kjv.json (date-based).
 */
(function () {
  'use strict';

  var WIDGET_ID = 'daily-verse-widget';
  var KJV_URL = (typeof window !== 'undefined' && window.TDB_CONFIG && window.TDB_CONFIG.kjvPath) ? window.TDB_CONFIG.kjvPath : 'kjv.json';
  var SAFE_REFS = [
    'Psalms 23:1', 'Psalms 23:4', 'Psalms 27:1', 'Psalms 34:4', 'Psalms 46:1', 'Psalms 91:1', 'Psalms 121:1', 'Psalms 138:3',
    'Proverbs 3:5', 'Proverbs 12:25', 'Proverbs 16:3', 'Proverbs 22:6',
    'Isaiah 40:31', 'Isaiah 41:10', 'Isaiah 43:2', 'Isaiah 54:10',
    'Jeremiah 29:11', 'Jeremiah 33:3', 'Joshua 1:9', 'Deuteronomy 31:6',
    'Matthew 5:14', 'Matthew 6:34', 'Matthew 11:28', 'Matthew 28:20',
    'John 3:16', 'John 14:27', 'John 15:12', 'John 16:33',
    'Romans 8:28', 'Romans 8:38', 'Romans 12:12', 'Romans 15:13',
    'Philippians 4:6', 'Philippians 4:7', 'Philippians 4:13', 'Philippians 4:19',
    'Colossians 3:2', 'Colossians 3:23', '2 Timothy 1:7', 'Hebrews 11:1', 'Hebrews 13:5', 'James 1:2', 'James 1:12',
    '1 Peter 5:7', '1 John 4:18', '1 John 4:19', 'Revelation 21:4',
    'Ephesians 6:10', 'Ephesians 6:11', 'Galatians 5:22', 'Romans 8:1'
  ];

  function getDailyKey() {
    var now = new Date();
    return now.getFullYear() + '-' + String(now.getMonth() + 1).padStart(2, '0') + '-' + String(now.getDate()).padStart(2, '0');
  }

  function getRefForDay(bible) {
    var key = getDailyKey();
    var seed = key.split('').reduce(function (a, c) { return a + c.charCodeAt(0); }, 0);
    var safe = SAFE_REFS.filter(function (ref) { return bible[ref]; });
    return safe.length ? safe[seed % safe.length] : null;
  }

  function render(widget, ref, text) {
    widget.innerHTML = '';
    widget.setAttribute('aria-busy', 'false');
    widget.classList.remove('daily-verse-widget-loading', 'daily-verse-widget-error');
    widget.classList.add('daily-verse-widget-loaded');

    var title = document.createElement('p');
    title.className = 'daily-verse-widget-title';
    title.textContent = 'Verse of the day';

    var refEl = document.createElement('strong');
    refEl.className = 'daily-verse-widget-ref';
    refEl.id = 'daily-verse-widget-ref';
    refEl.textContent = ref || '';

    var textEl = document.createElement('p');
    textEl.className = 'daily-verse-widget-text';
    textEl.id = 'daily-verse-widget-text';
    textEl.textContent = text || '';

    var actions = document.createElement('div');
    actions.className = 'daily-verse-widget-actions';

    var prayBtn = document.createElement('a');
    prayBtn.id = 'daily-verse-widget-pray';
    prayBtn.className = 'daily-verse-widget-btn daily-verse-widget-pray';
    prayBtn.href = document.querySelector('#quick-pray') ? '#quick-pray' : 'message.html';
    prayBtn.textContent = 'Pray';

    var shareBtn = document.createElement('button');
    shareBtn.type = 'button';
    shareBtn.id = 'daily-verse-widget-share';
    shareBtn.className = 'daily-verse-widget-btn daily-verse-widget-share';
    shareBtn.textContent = 'Share';

    actions.appendChild(prayBtn);
    actions.appendChild(shareBtn);
    widget.appendChild(title);
    widget.appendChild(refEl);
    widget.appendChild(textEl);
    widget.appendChild(actions);

    shareBtn.addEventListener('click', function () {
      var r = document.getElementById('daily-verse-widget-ref');
      var t = document.getElementById('daily-verse-widget-text');
      var str = (r && t) ? (r.textContent + ' — ' + t.textContent) : '';
      if (str && navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(str);
        shareBtn.textContent = 'Copied';
        setTimeout(function () { shareBtn.textContent = 'Share'; }, 2000);
      }
    });
  }

  function showError(widget, msg) {
    widget.innerHTML = '';
    widget.setAttribute('aria-busy', 'false');
    widget.classList.remove('daily-verse-widget-loading', 'daily-verse-widget-loaded');
    widget.classList.add('daily-verse-widget-error');
    var p = document.createElement('p');
    p.className = 'daily-verse-widget-error-msg';
    p.textContent = msg || 'Verse could not be loaded.';
    widget.appendChild(p);
  }

  function run() {
    var widget = document.getElementById(WIDGET_ID);
    if (!widget) return;

    widget.setAttribute('aria-busy', 'true');
    widget.classList.remove('daily-verse-widget-loaded', 'daily-verse-widget-error');
    widget.classList.add('daily-verse-widget-loading');
    widget.innerHTML = '<div class="daily-verse-widget-loading-msg" role="status" aria-live="polite">Loading verse…</div>';

    fetch(KJV_URL)
      .then(function (r) { return r.ok ? r.json() : Promise.reject(new Error('Network')); })
      .then(function (bible) {
        var ref = getRefForDay(bible);
        var text = ref && bible[ref] ? bible[ref] : null;
        if (ref && text) {
          render(widget, ref, text);
        } else {
          showError(widget, 'Verse unavailable—try again later.');
        }
      })
      .catch(function () {
        showError(widget, 'Verse unavailable—try again later.');
      });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', run);
  } else {
    run();
  }
})();
