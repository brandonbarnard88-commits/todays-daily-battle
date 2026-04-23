/**
 * "This month in the University" — soft signpost Feb–Dec (local calendar). Host: [data-tdb-uog-month-signpost].
 */
(function () {
  'use strict';

  var HINTS = {
    1: {
      name: 'February',
      lead: 'Ice and early dark still matter; His name does not shrink with the light.',
      whisper:
        'If last year still sits heavy, you are not on trial in this room—only invited. Two slow courses for regret and repair, same day-count you already trust on this device.',
      links: [
        { t: 'Late fall, quiet winter (plan)', h: '/plans.html?plan=latefallwinter' },
        { t: 'University of Regret (6 days)', h: '/plans.html?plan=universityregret' },
        { t: 'Broken Relationships (6 days)', h: '/plans.html?plan=universitybroken' },
        { t: 'Winter on Family rhythm', h: '/family-rhythm.html#fr-winter' },
        { t: 'University map — winter', h: '/university.html#uog-winter-university' }
      ]
    },
    2: {
      name: 'March',
      lead: 'Lent or not, the same Teacher walks at a human pace—no sprint, no score.',
      links: [
        { t: 'Courses by season', h: '/plans.html#plans-browse-by-season' },
        { t: 'Seasonal paths', h: '/seasonal.html' },
        { t: 'Explore the site', h: '/explore.html#start-here' }
      ]
    },
    3: {
      name: 'April',
      lead: 'Spring noise rises; your soul can still ask for one true verse before the day scatters.',
      links: [
        { t: 'Resurrection Hope (Easter week)', h: '/plans.html?plan=easter' },
        { t: 'Seasonal — Easter', h: '/seasonal.html#easter' },
        { t: "Today's lesson", h: '/verse.html' }
      ]
    },
    4: {
      name: 'May',
      lead: 'Longer evenings—room for one short read or one honest line in Ask the Teacher.',
      links: [
        { t: 'Ask the Teacher', h: '/#feel-section' },
        { t: 'Summer stillness (plan)', h: '/plans.html?plan=summerstill' },
        { t: 'Calm room', h: '/calm.html' }
      ]
    },
    5: {
      name: 'June',
      lead: 'Heat and hurry; the University still opens on grace, not grades.',
      links: [
        { t: 'Summer in the University', h: '/university.html#uog-summer-in-the-university' },
        { t: 'Summer Seeds (kids)', h: '/plans.html?plan=summer-seeds' },
        { t: 'Family hub', h: '/family.html' }
      ]
    },
    6: {
      name: 'July',
      lead: 'Mid-year weariness is allowed here—no polish required at the door.',
      links: [
        { t: 'Battle Plans', h: '/plans.html' },
        { t: 'When now is too much', h: '/plans.html#plans-recommended-today' },
        { t: 'Prayer', h: '/prayer-wall.html' }
      ]
    },
    7: {
      name: 'August',
      lead: 'Before fall schedules land, one verse can still be enough for a quiet minute.',
      links: [
        { t: 'Late summer, early rest', h: '/plans.html?plan=latesummerrest' },
        { t: 'Year-round rhythm', h: '/yearly-rhythm.html' },
        { t: 'My Study', h: '/mystudy.html' }
      ]
    },
    8: {
      name: 'September',
      lead: 'New rhythms; same Christ. Pick one course door and leave performance outside.',
      links: [
        { t: 'Back to school courage', h: '/plans.html?plan=schoolcourage' },
        { t: 'Browse by feeling', h: '/plans.html#plans-browse-by-feeling' },
        { t: 'Site guide', h: '/site-guide.html' }
      ]
    },
    9: {
      name: 'October',
      lead: 'Shorter light; longer mercy. The Word keeps pace with your actual day.',
      links: [
        { t: 'Quiet fall harvest', h: '/plans.html?plan=quietfallharvest' },
        { t: 'Harvest and thanks', h: '/seasonal.html#harvest-thanks' },
        { t: 'University — fall signposts', h: '/university.html#uog-season-signposts' }
      ]
    },
    10: {
      name: 'November',
      lead: 'Waiting weeks need patience, not performance—Advent is near, not a test.',
      links: [
        { t: 'Advent Quiet (plan)', h: '/plans.html?plan=adventquiet' },
        { t: 'Advent and Christmas hub', h: '/advent-christmas-university.html' },
        { t: 'Seasonal paths', h: '/seasonal.html#christmas' }
      ]
    },
    11: {
      name: 'December',
      lead: 'Noise rises; the manger still asks only a little room. Come back to one verse.',
      links: [
        { t: 'Christmas week (plan)', h: '/plans.html?plan=christmas7' },
        { t: 'Advent and Christmas in the University', h: '/advent-christmas-university.html' },
        { t: 'Family rhythm', h: '/family-rhythm.html' }
      ]
    }
  };

  function run() {
    var hosts = document.querySelectorAll('[data-tdb-uog-month-signpost]');
    if (!hosts.length) return;
    var m = new Date().getMonth();
    if (m === 0) return;
    var h = HINTS[m];
    if (!h) return;
    for (var i = 0; i < hosts.length; i++) {
      var el = hosts[i];
      el.removeAttribute('hidden');
      el.classList.add('tdb-uog-month--show');
      var nameEl = el.querySelector('[data-tdb-uog-month-name]');
      var leadEl = el.querySelector('[data-tdb-uog-month-lead]');
      var listEl = el.querySelector('[data-tdb-uog-month-links]');
      if (nameEl) nameEl.textContent = h.name;
      if (leadEl) leadEl.textContent = h.lead;
      var whisperEl = el.querySelector('[data-tdb-uog-month-whisper]');
      if (whisperEl) {
        if (h.whisper) {
          whisperEl.textContent = h.whisper;
          whisperEl.removeAttribute('hidden');
        } else {
          whisperEl.textContent = '';
          whisperEl.setAttribute('hidden', '');
        }
      }
      if (listEl) {
        listEl.textContent = '';
        for (var j = 0; j < h.links.length; j++) {
          var L = h.links[j];
          var a = document.createElement('a');
          a.href = L.h;
          a.textContent = L.t;
          var li = document.createElement('li');
          li.appendChild(a);
          listEl.appendChild(li);
        }
      }
    }
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', run);
  else run();
})();
