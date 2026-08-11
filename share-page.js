/**
 * Reusable "Share this page" — Web Share API or clipboard fallback.
 * Wire any element with id="share-page" or class="share-page-btn".
 * Optional: data-share-url, data-share-title, data-share-text on the button.
 * No dependencies. Vanilla JS only.
 */
(function () {
  'use strict';

  var TOAST_DURATION = 3000;
  var DEFAULT_TEXT = 'Check out this page on Today\'s Daily Battle';

  function showToast(msg) {
    var existing = document.getElementById('share-page-toast');
    if (existing) existing.remove();
    var toast = document.createElement('div');
    toast.id = 'share-page-toast';
    toast.className = 'share-toast';
    toast.setAttribute('role', 'status');
    toast.setAttribute('aria-live', 'polite');
    toast.textContent = msg;
    document.body.appendChild(toast);
    setTimeout(function () {
      toast.classList.add('share-toast-fade');
      setTimeout(function () { toast.remove(); }, 300);
    }, TOAST_DURATION);
  }

  function sharePage(opts) {
    opts = opts || {};
    var url = opts.url || window.location.href;
    var title = opts.title || document.title;
    var text = opts.text || DEFAULT_TEXT;
    var shareData = { title: title, text: text, url: url };

    try {
      if (navigator.share && (!navigator.canShare || navigator.canShare(shareData))) {
        navigator.share(shareData).then(function () {
          try { var n = parseInt(localStorage.getItem('sharePageCount') || '0', 10); localStorage.setItem('sharePageCount', String(n + 1)); } catch (e) {}
          showToast('Shared!');
        }).catch(function (err) {
          if (err && err.name === 'AbortError') return;
          copyFallback(url);
        });
      } else {
        copyFallback(url);
      }
    } catch (e) {
      copyFallback(url);
    }

    function copyFallback(u) {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(u).then(function () {
          try { var n = parseInt(localStorage.getItem('sharePageCount') || '0', 10); localStorage.setItem('sharePageCount', String(n + 1)); } catch (e) {}
          showToast('Link copied! Share it with someone who needs it.');
        }).catch(function () {
          showToast('Copy did not go through. Share the URL manually.');
        });
      } else {
        showToast('Copy did not go through. Share the URL manually.');
      }
    }
  }

  function wire() {
    var btns = document.querySelectorAll('#share-page, .share-page-btn');
    btns.forEach(function (btn) {
      if (btn.dataset.shareWired === '1') return;
      btn.dataset.shareWired = '1';
      btn.addEventListener('click', function () {
        var customUrl = btn.getAttribute('data-share-url');
        var customTitle = btn.getAttribute('data-share-title');
        var customText = btn.getAttribute('data-share-text');
        sharePage({
          url: (customUrl && customUrl.trim()) || window.location.href,
          title: (customTitle && customTitle.trim()) || document.title,
          text: (customText && customText.trim()) || undefined
        });
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', wire);
  } else {
    wire();
  }

  window.sharePage = sharePage;
})();
