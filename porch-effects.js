/**
 * porch-effects.js — gentle site-wide motion layer
 * Scroll-triggered reveals, falling leaves on plan completion, prayer settling.
 * All effects respect prefers-reduced-motion and degrade gracefully offline.
 */
(function () {
  'use strict';

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ── Scroll-reveal (IntersectionObserver) ──────────────────────────────── */
  // Adds .porch-reveal to qualifying elements below the fold, then
  // .porch-visible when they enter the viewport.
  function initScrollReveal() {
    if (!('IntersectionObserver' in window)) return;

    var targets = document.querySelectorAll(
      '.glass, .porch-card, .plan-row, .hero-banner, .cta-group, .section-divider'
    );

    // Only observe elements that are genuinely below the visible fold on load
    var foldLine = window.innerHeight * 1.05;

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('porch-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -30px 0px' });

    targets.forEach(function (el) {
      var rect = el.getBoundingClientRect();
      if (rect.top > foldLine) {
        el.classList.add('porch-reveal');
        io.observe(el);
      }
    });
  }

  /* ── Falling leaves — plan completion ─────────────────────────────────── */
  // Call window.porchLeaves() from any plan-completion handler.
  // Spawns 8 soft div-based particles with randomised shape/color variants.
  var LEAF_COUNT    = 8;
  var VARIANT_COUNT = 5; // matches data-v="0"–"4" (0 = base CSS default)

  function spawnLeaves() {
    if (reduced) return;
    for (var i = 0; i < LEAF_COUNT; i++) {
      (function (idx) {
        setTimeout(function () {
          var leaf = document.createElement('div');
          leaf.className = 'porch-particle';
          leaf.setAttribute('aria-hidden', 'true');
          // Assign a random variant (0 = default base style, 1-4 = data-v variants)
          var variant = Math.floor(Math.random() * VARIANT_COUNT);
          if (variant > 0) leaf.setAttribute('data-v', String(variant));

          var leftPct  = 6 + Math.random() * 88;
          var duration = 2500 + Math.random() * 2600;
          // Wider horizontal sway: -70 to +70px, with a gentle mid-path curve
          var drift = (Math.random() * 140 - 70) + 'px';

          leaf.style.left = leftPct + '%';
          leaf.style.animationDuration = duration + 'ms';
          leaf.style.setProperty('--leaf-drift', drift);

          document.body.appendChild(leaf);
          setTimeout(function () { leaf.remove(); }, duration + 200);
        }, idx * 150);
      }(i));
    }
  }

  window.porchLeaves = spawnLeaves;

  /* ── Prayer entry settling ─────────────────────────────────────────────── */
  // Call porchMarkPrayerNew(element) after inserting a new prayer card into the DOM.
  function markPrayerNew(el) {
    if (!el) return;
    el.classList.add('porch-prayer-new');
    // Remove the class after animation so it can re-trigger if re-inserted
    el.addEventListener('animationend', function () {
      el.classList.remove('porch-prayer-new');
    }, { once: true });
  }

  window.porchMarkPrayerNew = markPrayerNew;

  /* ── Verse page-turn helper ────────────────────────────────────────────── */
  // Call porchVerseSwap(el, newText, newRef) to animate a verse element out,
  // swap its content, then animate it back in.
  function verseSwap(el, newText, newRef) {
    if (!el) return;
    if (reduced) {
      if (newText !== undefined) el.textContent = newText;
      return;
    }
    el.classList.add('porch-verse-out');
    el.addEventListener('animationend', function swap() {
      el.removeEventListener('animationend', swap);
      if (newText !== undefined) el.textContent = newText;
      if (newRef   !== undefined) {
        var cite = el.parentElement && el.parentElement.querySelector('cite');
        if (cite) cite.textContent = newRef;
      }
      el.classList.remove('porch-verse-out');
      el.classList.add('porch-verse-in');
      el.addEventListener('animationend', function done() {
        el.removeEventListener('animationend', done);
        el.classList.remove('porch-verse-in');
      }, { once: true });
    }, { once: true });
  }

  window.porchVerseSwap = verseSwap;

  /* ── Auto-hook: observe prayer wall for dynamically added entries ───────── */
  function hookPrayerWall() {
    var wall = document.getElementById('prayer-wall-entries')
            || document.getElementById('prayer-entries')
            || document.querySelector('[data-prayer-list]');
    if (!wall || !('MutationObserver' in window)) return;

    var mo = new MutationObserver(function (mutations) {
      mutations.forEach(function (m) {
        m.addedNodes.forEach(function (node) {
          if (node.nodeType === 1) markPrayerNew(node);
        });
      });
    });
    mo.observe(wall, { childList: true });
  }

  /* ── Plan day completion ───────────────────────────────────────────────── */
  // Call porchDayDone(dayCardEl) when a plan day is marked complete.
  // Adds soft green flash + spawns leaves.
  function dayDone(el) {
    if (el) {
      el.classList.add('porch-day-done');
      el.addEventListener('animationend', function () {
        el.classList.remove('porch-day-done');
      }, { once: true });
    }
    spawnLeaves();
  }

  window.porchDayDone = dayDone;

  /* ── Study note save confirmation ──────────────────────────────────────── */
  // Call porchNoteSaved(noteCardEl) after a note is persisted.
  function noteSaved(el) {
    if (!el || reduced) return;
    el.classList.add('porch-note-saved');
    el.addEventListener('animationend', function () {
      el.classList.remove('porch-note-saved');
    }, { once: true });
  }

  window.porchNoteSaved = noteSaved;

  /* ── Init ──────────────────────────────────────────────────────────────── */
  function init() {
    if (!reduced) initScrollReveal();
    hookPrayerWall();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

}());
