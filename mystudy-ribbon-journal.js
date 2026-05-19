/**
 * Ribbon journal in My Study — quiet notes for Möbius stations (device-local, same store as Möbius).
 */
(function () {
  'use strict';

  function esc(s) {
    return String(s ?? '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function populateStations(select) {
    if (!select) return;
    var stations = window.TDB_MOBIUS_DEEP_STATIONS;
    if (!stations || !stations.length) return;
    var groups = [];
    var seen = {};
    stations.forEach(function (s) {
      if (!seen[s.group]) {
        seen[s.group] = true;
        groups.push(s.group);
      }
    });
    var html = '<option value="">General ribbon (no station)</option>';
    groups.forEach(function (group) {
      html += '<optgroup label="' + esc(group) + '">';
      stations
        .filter(function (s) {
          return s.group === group;
        })
        .forEach(function (s) {
          html +=
            '<option value="' +
            esc(s.slug) +
            '">' +
            esc(s.title) +
            ' &mdash; ' +
            esc(s.subtitle) +
            '</option>';
        });
      html += '</optgroup>';
    });
    select.innerHTML = html;
  }

  function stationLabel(slug) {
    if (!slug || !window.TDB_MOBIUS_STATION_BY_SLUG) return 'Ribbon';
    var s = window.TDB_MOBIUS_STATION_BY_SLUG[slug];
    return s ? s.title : 'Ribbon';
  }

  function renderRecent(listEl) {
    if (!listEl || !window.TDB_mobiusJournal) return;
    var state = window.TDB_mobiusJournal.loadState();
    var entries = (state.entries || []).slice(0, 8);
    if (!entries.length) {
      listEl.innerHTML =
        '<p class="section-note util-mb-0">No ribbon notes yet. That is fine&mdash;the desk stays open when you need it.</p>';
      return;
    }
    var html = '<ul class="mystudy-ribbon-journal-list">';
    entries.forEach(function (e) {
      var preview = esc(e.body).replace(/\n/g, ' ').slice(0, 160);
      if (e.body.length > 160) preview += '&hellip;';
      html +=
        '<li><span class="mystudy-ribbon-journal-ctx">' +
        esc(e.context || 'Ribbon') +
        '</span><p class="mystudy-ribbon-journal-preview">' +
        preview +
        '</p></li>';
    });
    html += '</ul>';
    listEl.innerHTML = html;
  }

  function setStatus(el, msg, ok) {
    if (!el) return;
    el.hidden = !msg;
    el.textContent = msg || '';
    el.classList.toggle('tdb-mobius-journal-status--ok', !!ok);
    el.classList.toggle('tdb-mobius-journal-status--err', !!msg && !ok);
  }

  function init() {
    var section = document.getElementById('mystudy-ribbon-journal');
    if (!section) return;

    var select = document.getElementById('mystudy-ribbon-station');
    var ta = document.getElementById('mystudy-ribbon-journal-input');
    var saveBtn = document.getElementById('mystudy-ribbon-journal-save');
    var exportBtn = document.getElementById('mystudy-ribbon-journal-export');
    var status = document.getElementById('mystudy-ribbon-journal-status');
    var recent = document.getElementById('mystudy-ribbon-journal-recent');

    populateStations(select);
    renderRecent(recent);

    if (saveBtn && ta && window.TDB_mobiusJournal) {
      saveBtn.addEventListener('click', function () {
        var slug = select ? select.value : '';
        var label = stationLabel(slug);
        var ctx = slug ? 'Ribbon · ' + label : 'Ribbon · quiet note';
        var r = window.TDB_mobiusJournal.append(ta.value, ctx);
        if (r.ok) {
          ta.value = '';
          setStatus(status, 'Saved on this device only. No dates, no streaks.', true);
          renderRecent(recent);
          try {
            if (typeof window.trackEvent === 'function') {
              window.trackEvent('mobius_loop_journal_save', { source: 'mystudy_ribbon' });
            }
          } catch (e) {}
        } else if (r.reason === 'empty') {
          setStatus(status, 'Write a line when ready&mdash;or leave it blank. No pressure.', false);
        } else {
          setStatus(status, 'That did not save&mdash;storage may be full. Try again when you can.', false);
        }
      });
    }

    if (exportBtn && window.TDB_mobiusJournal) {
      exportBtn.addEventListener('click', function () {
        window.TDB_mobiusJournal.downloadExport();
        try {
          if (typeof window.trackEvent === 'function') {
            window.trackEvent('mobius_loop_journal_export', { source: 'mystudy_ribbon' });
          }
        } catch (e) {}
      });
    }

    var hash = (location.hash || '').replace(/^#/, '');
    if (hash === 'mystudy-ribbon-journal' && section.scrollIntoView) {
      section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
