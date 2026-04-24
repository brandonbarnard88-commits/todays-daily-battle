/**
 * "This month in the University" — soft signpost Jan–Dec (local calendar). Host: [data-tdb-uog-month-signpost].
 */
(function () {
  'use strict';

  var HINTS = {
    0: {
      name: 'January',
      lead: 'Fresh paper does not fix the heart—but His mercies are new this morning, not when you earn them.',
      whisper:
        'You are allowed to start with one true line, not a new personality. The Word that held December still walks with you in January: no fresh score, only the next slow breath, the next open page, and the same "with us" when the house is ordinary.',
      links: [
        { t: 'Gentle New Year reset (5 days)', h: '/plans.html?plan=gentleyear' },
        { t: 'Quiet New Year reset (one-page print)', h: '/quiet-new-year-reset-one-page-print.html' },
        { t: 'New Year week (7 days)', h: '/plans.html?plan=newyear7' },
        { t: 'Year-end rest (print)', h: '/year-end-rest-one-page-print.html' },
        { t: 'John 1 prologue—In the beginning (Family rhythm)', h: '/family-rhythm.html#fr-january-in-the-beginning' },
        { t: 'Emmanuel week (7 days)', h: '/plans.html?plan=emmanuel7' },
        { t: 'Start the year in the Word (hub)', h: '/start-the-year-in-the-word.html' },
        { t: 'January prologue (map)', h: '/university.html#uog-january-in-the-beginning' },
        { t: 'When the year feels heavy (print)', h: '/when-year-feels-heavy-one-page-print.html' },
        { t: 'Gentle signposts — map', h: '/university.html#uog-season-signposts' }
      ]
    },
    1: {
      name: 'February',
      lead: 'The new-year lists may already be quiet—that does not mean growth stopped; His hand on your days is the same steady size.',
      whisper:
        'You do not have to re-start January. February is for gentle renewal: one true voice, one open door, not a new personality. When winter lingers in the sky and the soul, you are still allowed to read slowly, wait quietly, and come back to the same Shepherd you met at the manger and in John\'s prologue—no score, only the next porch step when gray weeks feel long.',
      links: [
        { t: 'Good Shepherd: door to one fold (full read)', h: '/family-rhythm.html#fr-shepherd-door-to-fold' },
        { t: 'Shepherd full read (map — winter)', h: '/university.html#uog-shepherd-door-to-fold' },
        { t: 'When winter lingers (one-page print)', h: '/when-winter-lingers-one-page-print.html' },
        { t: 'Late fall, quiet winter (plan)', h: '/plans.html?plan=latefallwinter' },
        { t: 'Quiet New Year reset (print)', h: '/quiet-new-year-reset-one-page-print.html' },
        { t: 'Gentle New Year reset (5 days)', h: '/plans.html?plan=gentleyear' },
        { t: 'University of Regret (6 days)', h: '/plans.html?plan=universityregret' },
        { t: 'Broken Relationships (6 days)', h: '/plans.html?plan=universitybroken' },
        { t: 'Winter on Family rhythm', h: '/family-rhythm.html#fr-winter' },
        { t: 'University map — winter', h: '/university.html#uog-winter-university' },
        { t: 'Gentle signposts — map', h: '/university.html#uog-season-signposts' }
      ]
    },
    2: {
      name: 'March',
      lead: 'Lent or not, the same Teacher meets you at a child\'s pace—no sprint, no report card for the soul.',
      whisper:
        'Thaw is uneven; one true line on the table can come before the yard looks different. New life is allowed to be quiet—slower breath, open arms for little ones, mud underfoot—and the empty garden is still ahead. You are not late to spring; you are on time to Him.',
      links: [
        { t: 'Let the little children come (read-aloud)', h: '/family-rhythm.html#fr-let-little-children-come' },
        { t: 'Same read (map — Resurrection & Easter)', h: '/university.html#uog-let-little-children-come' },
        { t: 'Spring at the table (one-page print)', h: '/spring-at-the-table-one-page-print.html' },
        { t: 'Resurrection Hope (7 days, Easter nears)', h: '/plans.html?plan=easter' },
        { t: 'Resurrection & Easter in the University (hub)', h: '/easter-resurrection-university.html' },
        { t: 'Spring at the empty tomb (Family rhythm)', h: '/family-rhythm.html#fr-spring-easter' },
        { t: 'For the little ones — bedtime & chair', h: '/little-ones.html' },
        { t: 'Bible story library (Kids Corner)', h: '/kids/corner.html' },
        { t: 'Seasonal — Easter doorway', h: '/seasonal.html#easter' },
        { t: 'Gentle signposts — map', h: '/university.html#uog-season-signposts' }
      ]
    },
    3: {
      name: 'April',
      lead: 'The clock runs faster; your soul is still allowed one quiet verse before the list wins the table.',
      whisper:
        'Steady growth is not a photo finish—light returns but roots take time. You do not have to perform spring; one true line, one unhurried breath, and the same Shepherd who met you in winter is still in the room when pollen, practices, and longer evenings all talk at once.',
      links: [
        { t: 'The lost piece (read-aloud, Luke 15)', h: '/family-rhythm.html#fr-spring-lost-coin' },
        { t: 'Same read (map — Resurrection & Easter)', h: '/university.html#uog-lost-coin' },
        { t: 'When spring feels overwhelming (one-page print)', h: '/when-spring-feels-overwhelming-one-page-print.html' },
        { t: 'Spring at the table (one-page print)', h: '/spring-at-the-table-one-page-print.html' },
        { t: 'Resurrection & Easter in the University (hub)', h: '/easter-resurrection-university.html' },
        { t: 'Resurrection Hope (Easter week)', h: '/plans.html?plan=easter' },
        { t: 'Spring at the empty tomb (Family rhythm)', h: '/family-rhythm.html#fr-spring-easter' },
        { t: 'Let the little children come (Family rhythm)', h: '/family-rhythm.html#fr-let-little-children-come' },
        { t: 'Seasonal — Easter', h: '/seasonal.html#easter' },
        { t: 'He is risen (short reads)', h: '/he-is-risen.html' },
        { t: "Today's lesson", h: '/verse.html' },
        { t: 'Gentle signposts — map', h: '/university.html#uog-season-signposts' }
      ]
    },
    4: {
      name: 'May',
      lead: 'Longer light—fruit is allowed to be quiet. One verse can outlast a whole noisy list.',
      whisper:
        'Steady growth keeps pace with grace, not with comparison. You are not on trial to produce a feeling—only to stay near the one true line when May feels loud or thin.',
      links: [
        { t: 'Pentecost & the Spirit in the University (hub)', h: '/pentecost-spirit-university.html' },
        { t: 'Five thousand fed (Family rhythm read)', h: '/family-rhythm.html#fr-provision-thousands' },
        { t: 'Gospel of John (7 days)', h: '/plans.html?plan=gospeljohn' },
        { t: 'Summer stillness (5 days)', h: '/plans.html?plan=summerstill' },
        { t: 'Ask the Teacher', h: '/#feel-section' },
        { t: 'Calm room', h: '/calm.html' }
      ]
    },
    5: {
      name: 'June',
      lead: 'Heat and hurry; the University still opens on grace, not grades.',
      links: [
        { t: 'Pentecost & the Spirit in the University (hub)', h: '/pentecost-spirit-university.html' },
        { t: 'Summer & harvest in the University (hub)', h: '/summer-harvest-university.html' },
        { t: 'Summer in the University', h: '/university.html#uog-summer-in-the-university' },
        { t: 'Summer Seeds (kids)', h: '/plans.html?plan=summer-seeds' },
        { t: 'Family hub', h: '/family.html' }
      ]
    },
    6: {
      name: 'July',
      lead: 'Mid-year heat and weariness are both allowed here—no polish required at the door.',
      whisper:
        'Simple trust is not a mood you manufacture; it is coming back to one true line when the day feels thick. Your Father already knows what you need—rest is allowed to look like a slower breath, not a fixed calendar.',
      links: [
        { t: 'Summer & harvest in the University (hub)', h: '/summer-harvest-university.html' },
        { t: 'The Good Shepherd (Family rhythm read)', h: '/family-rhythm.html#fr-summer-good-shepherd' },
        { t: 'Summer stillness (5 days)', h: '/plans.html?plan=summerstill' },
        { t: 'Calm room', h: '/calm.html' },
        { t: 'Prayer', h: '/prayer-wall.html' },
        { t: 'Battle Plans', h: '/plans.html' }
      ]
    },
    7: {
      name: 'August',
      lead: 'The long light still asks for a lighter yoke, not a louder plan.',
      whisper:
        'Simpler trust often looks like one verse before the schedule lands again. Fall is coming, and you are allowed to hand August to Him a day at a time. Not a performance at a time.',
      links: [
        { t: 'Late summer, early rest (5 days)', h: '/plans.html?plan=latesummerrest' },
        { t: 'Summer & harvest in the University (hub)', h: '/summer-harvest-university.html' },
        { t: 'Back to school in the University (hub)', h: '/back-to-school-university.html' },
        { t: 'Seasonal — late summer bridge', h: '/seasonal.html#late-summer-bridge' },
        { t: 'Calm room', h: '/calm.html' },
        { t: 'Year-round rhythm', h: '/yearly-rhythm.html' }
      ]
    },
    8: {
      name: 'September',
      lead: 'New rhythms; same Christ. Pick one course door and leave performance outside.',
      whisper:
        'New paper and new nerves can share the same table with one true line. He does not need you polished before you come—only willing to show up for the next honest verse.',
      links: [
        { t: 'Back to school in the University (hub)', h: '/back-to-school-university.html' },
        { t: 'Back to school courage (7 days)', h: '/plans.html?plan=schoolcourage' },
        { t: 'Come unto me (Family rhythm read)', h: '/family-rhythm.html#fr-come-to-me' },
        { t: 'Browse by feeling', h: '/plans.html#plans-browse-by-feeling' },
        { t: 'Site guide', h: '/site-guide.html' }
      ]
    },
    9: {
      name: 'October',
      lead: 'Shorter light; longer mercy. The Word keeps pace with your actual day.',
      whisper:
        'Leaves fall; you are allowed to let a few worries fall with them—not solved, only handed to Him. A little thanks and one open page of Scripture are enough for today; winter can wait. You are not packing for a test in November—only showing up for the next honest line.',
      links: [
        { t: 'Quiet fall harvest (5 days)', h: '/plans.html?plan=quietfallharvest' },
        { t: 'Harvest & thanks (seasonal)', h: '/seasonal.html#harvest-thanks' },
        { t: 'Be still & the sower (Family rhythm)', h: '/family-rhythm.html#fr-fall' },
        { t: 'When school feels hard (one-page print)', h: '/when-school-feels-hard-one-page-print.html' },
        { t: 'Late fall, quiet winter (5 days)', h: '/plans.html?plan=latefallwinter' },
        { t: 'Back to school hub', h: '/back-to-school-university.html' },
        { t: 'Gentle signposts — map', h: '/university.html#uog-season-signposts' }
      ]
    },
    10: {
      name: 'November',
      lead: 'Waiting weeks need patience, not performance—Advent is near, not a test.',
      whisper:
        'A holiday table is allowed to be ordinary. Gratitude is not a mood you stage for the photo—one honest "thank you" before Him counts, even if the house is still messy. The calendar does not grade your heart; the Word only asks for the next true line, then the next loaf.',
      links: [
        { t: 'Harvest Gratitude (7 days)', h: '/plans.html?plan=harvestthanks' },
        { t: 'Harvest & thanks (seasonal)', h: '/seasonal.html#harvest-thanks' },
        { t: 'Thankful leper & daily bread (Family rhythm)', h: '/family-rhythm.html#fr-late-autumn' },
        { t: 'When the days grow short (one-page print)', h: '/when-the-days-grow-short-one-page-print.html' },
        { t: 'Late fall, quiet winter (5 days)', h: '/plans.html?plan=latefallwinter' },
        { t: 'Advent Quiet (plan)', h: '/plans.html?plan=adventquiet' },
        { t: 'Advent & Christmas in the University (hub)', h: '/advent-christmas-university.html' },
        { t: 'Gentle signposts — map', h: '/university.html#uog-season-signposts' }
      ]
    },
    11: {
      name: 'December',
      lead: 'The noise is loud; the story is still small enough to hold. You are not late to the manger.',
      whisper:
        'Advent is not a scoreboard for your living room. Emmanuel is the same name when the house is quiet or loud—one true line, one honest pause, and the calendar does not grade your heart. The Word needed room, not a perfect table; come as you are, and let one verse be enough for tonight.',
      links: [
        { t: 'Advent quiet (7 days)', h: '/plans.html?plan=adventquiet' },
        { t: 'Christmas week (plan)', h: '/plans.html?plan=christmas7' },
        { t: 'Advent & Christmas in the University (hub)', h: '/advent-christmas-university.html' },
        { t: 'Birth of Jesus & Word made flesh (Family rhythm)', h: '/family-rhythm.html#fr-december-manger' },
        { t: 'Year-end rest (one-page print)', h: '/year-end-rest-one-page-print.html' },
        { t: 'Emmanuel week (7 days)', h: '/plans.html?plan=emmanuel7' },
        { t: 'When the days grow short (print)', h: '/when-the-days-grow-short-one-page-print.html' },
        { t: 'December at the manger (map)', h: '/university.html#uog-december-manger' },
        { t: 'Start the year in the Word (hub)', h: '/start-the-year-in-the-word.html' },
        { t: 'Gentle signposts — map', h: '/university.html#uog-season-signposts' }
      ]
    }
  };

  function run() {
    var hosts = document.querySelectorAll('[data-tdb-uog-month-signpost]');
    if (!hosts.length) return;
    var m = new Date().getMonth();
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
