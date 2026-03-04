/**
 * Parent Dashboard — reads kid's streak, doodles, badges from localStorage.
 * No login. Same keys as kids-battle.js.
 */
(function () {
  'use strict';

  const KIDS_STREAK_KEY = 'kidsStreak';
  const KIDS_DOODLE_KEY = 'kidsDoodle';
  const BADGES = [
    { id: 'faith-fighter', label: 'Faith Fighter', days: 1 },
    { id: 'bible-boss', label: 'Bible Boss', days: 3 },
    { id: 'faith-hero', label: 'Faith Hero', days: 7 },
    { id: 'brave-heart', label: 'Brave Heart', days: 14 }
  ];

  function getStreakData() {
    try {
      const raw = localStorage.getItem(KIDS_STREAK_KEY);
      return raw ? JSON.parse(raw) : {};
    } catch (e) { return {}; }
  }

  function getCurrentStreak() {
    const data = getStreakData();
    return Number(data.count || 0);
  }

  function getDoodleGallery() {
    const items = [];
    try {
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith(KIDS_DOODLE_KEY) && key.length > KIDS_DOODLE_KEY.length) {
          const date = key.slice(KIDS_DOODLE_KEY.length);
          if (/^\d{4}-\d{2}-\d{2}$/.test(date)) {
            const dataUrl = localStorage.getItem(key);
            if (dataUrl) items.push({ date, dataUrl });
          }
        }
      }
      items.sort((a, b) => b.date.localeCompare(a.date));
    } catch (e) {}
    return items;
  }

  function renderStreak() {
    const streak = getCurrentStreak();
    const el = document.getElementById('parent-streak-display');
    const badge = document.getElementById('parent-proud-badge');
    if (el) el.textContent = '🔥 ' + streak + ' day' + (streak === 1 ? '' : 's');
    if (badge) badge.classList.toggle('hidden', streak < 7);
  }

  function renderDoodles() {
    const gallery = document.getElementById('parent-doodles-gallery');
    if (!gallery) return;
    const items = getDoodleGallery();
    gallery.innerHTML = '';
    if (items.length === 0) {
      gallery.innerHTML = '<p class="kids-no-doodles">No doodles yet. Draw one in Kids Battle!</p>';
      return;
    }
    items.forEach(function (item) {
      const wrap = document.createElement('div');
      wrap.className = 'kids-doodle-gallery-item';
      const img = document.createElement('img');
      img.src = item.dataUrl;
      img.alt = 'Doodle from ' + item.date;
      img.loading = 'lazy';
      const label = document.createElement('span');
      label.className = 'kids-doodle-date';
      label.textContent = item.date;
      wrap.appendChild(img);
      wrap.appendChild(label);
      gallery.appendChild(wrap);
    });
  }

  function renderBadges() {
    const list = document.getElementById('parent-badges-list');
    if (!list) return;
    const streak = getCurrentStreak();
    list.innerHTML = '';
    BADGES.forEach(function (b) {
      const span = document.createElement('span');
      span.className = 'kids-badge ' + b.id + (streak >= b.days ? '' : ' locked');
      span.textContent = (streak >= b.days ? '★ ' : '☆ ') + b.label;
      list.appendChild(span);
    });
  }

  function init() {
    renderStreak();
    renderDoodles();
    renderBadges();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
