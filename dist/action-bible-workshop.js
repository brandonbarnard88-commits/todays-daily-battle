(function () {
  'use strict';

  var DATA_URL = 'action-bible-365.json';
  var PACKS_URL = 'action-bible-weekly-packs.json';
  var state = {
    all: [],
    bySeason: {},
    packs: []
  };

  function byId(id) { return document.getElementById(id); }

  function esc(value) {
    return String(value == null ? '' : value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function setStatus(msg) {
    var el = byId('abw-status');
    if (el) el.textContent = msg;
  }

  function renderHtml(id, html) {
    var el = byId(id);
    if (el) el.innerHTML = html;
  }

  function stripHtml(html) {
    var temp = document.createElement('div');
    temp.innerHTML = String(html || '');
    return String(temp.textContent || temp.innerText || '').trim();
  }

  function selectedSeason() {
    return String((byId('abw-season') && byId('abw-season').value) || '').trim();
  }

  function rowsForSeason() {
    var season = selectedSeason();
    if (!season) return state.all.slice();
    return (state.bySeason[season] || []).slice();
  }

  function currentEntry() {
    var allRows = rowsForSeason();
    if (!allRows.length) return null;
    var input = Number((byId('abw-entry') && byId('abw-entry').value) || 0);
    if (!input) return allRows[0];
    for (var i = 0; i < allRows.length; i++) {
      if (Number(allRows[i].day) === input) return allRows[i];
    }
    return allRows[0];
  }

  function worksheetBlocks(entry, tier, role) {
    var name = entry.characterName;
    var verse = entry.keyVerseRef;
    if (tier === 'kids-5-8') {
      return [
        'Draw the scene from Entry ' + entry.day + ' featuring ' + name + '.',
        'Say this anchor aloud twice: "' + verse + '".',
        'Question: What brave choice did ' + name + ' make?',
        'Action: Do one kind act today and pray a one-sentence prayer.',
        'Role focus (' + role + '): Share your answer with an adult.'
      ];
    }
    if (tier === 'kids-9-12') {
      return [
        'Recap the episode in 3 sentences.',
        'Context: What problem was happening before ' + name + ' acted?',
        'Decision: Which response honored God most, and why?',
        'Prayer: Write 2 lines asking for courage and obedience.',
        'Role focus (' + role + '): Teach one younger student the key verse.'
      ];
    }
    if (tier === 'teens-13-17') {
      return [
        'Interpretation: What does this episode reveal about God\'s character?',
        'Contrast: How does this challenge cultural pressure today?',
        'Application: Write one daily obedience action for this week.',
        'Memory challenge: Recite ' + verse + ' from memory by day 7.',
        'Role focus (' + role + '): Share your action plan with accountability.'
      ];
    }
    if (tier === 'adult-foundation') {
      return [
        'Observation: List 3 facts from the episode text.',
        'Interpretation: What is the primary spiritual principle?',
        'Application: Name one obedience step and one repentance step.',
        'Cross-reference: Pair this with one related passage.',
        'Role focus (' + role + '): Lead a 10-minute reflection discussion.'
      ];
    }
    return [
      'Teaching objective: Define the class outcome in one sentence.',
      'Outline: Intro, text reading, interpretation, application, prayer.',
      'Discussion prompts: Add 3 open-ended questions.',
      'Accountability: Add one follow-up check for next gathering.',
      'Role focus (' + role + '): Assign mentor pairings for response practice.'
    ];
  }

  function generateWorksheet() {
    var entry = currentEntry();
    if (!entry) {
      renderHtml('abw-worksheet-output', '<p class="section-note">No entry available for worksheet generation.</p>');
      return;
    }
    var tier = String((byId('abw-tier') && byId('abw-tier').value) || 'adult-foundation');
    var role = String((byId('abw-role') && byId('abw-role').value) || 'student');
    var blocks = worksheetBlocks(entry, tier, role);
    renderHtml('abw-worksheet-output',
      '<h3>Entry ' + esc(entry.day) + ' · ' + esc(entry.characterName) + '</h3>' +
      '<p><strong>Verse anchor:</strong> ' + esc(entry.keyVerseRef) + '</p>' +
      '<p><strong>Tier:</strong> ' + esc(tier) + ' · <strong>Role:</strong> ' + esc(role) + '</p>' +
      '<ul>' + blocks.map(function (line) { return '<li>' + esc(line) + '</li>'; }).join('') + '</ul>'
    );
    setStatus('Worksheet generated for Entry ' + entry.day + '.');
  }

  function regenerateAllPanels() {
    generateWorksheet();
    generateFamilyMode();
    generateLeaderPack();
    generateMastery();
  }

  function generateFamilyMode() {
    var entry = currentEntry();
    if (!entry) return;
    var html = '' +
      '<h3>Family Mode Plan · Entry ' + esc(entry.day) + '</h3>' +
      '<p><strong>Verse:</strong> ' + esc(entry.keyVerseRef) + '</p>' +
      '<div class="abw-divider"><strong>Little Kids Track (5-8)</strong><ul>' +
        '<li>Tell the episode in simple language and ask one feeling question.</li>' +
        '<li>Draw the key scene and speak the verse together.</li>' +
      '</ul></div>' +
      '<div class="abw-divider"><strong>Preteen Track (9-12)</strong><ul>' +
        '<li>Discuss the character decision and consequence.</li>' +
        '<li>Write one action this week inspired by the verse.</li>' +
      '</ul></div>' +
      '<div class="abw-divider"><strong>Teen + Adult Track</strong><ul>' +
        '<li>Interpret the theological theme and modern application.</li>' +
        '<li>Pray together with one shared obedience commitment.</li>' +
      '</ul></div>';
    renderHtml('abw-family-output', html);
    setStatus('Family mode guide generated.');
  }

  function generateLeaderPack() {
    var entry = currentEntry();
    if (!entry) return;
    var html = '' +
      '<h3>Leader Teaching Pack · Entry ' + esc(entry.day) + '</h3>' +
      '<p><strong>Character:</strong> ' + esc(entry.characterName) + ' · <strong>Verse:</strong> ' + esc(entry.keyVerseRef) + '</p>' +
      '<ul>' +
        '<li><strong>Opening (5 min):</strong> Frame the battle context and today\'s objective.</li>' +
        '<li><strong>Text Focus (10 min):</strong> Read verse, identify historical and spiritual stakes.</li>' +
        '<li><strong>Discussion (15 min):</strong> Why this response matters for obedience today.</li>' +
        '<li><strong>Practice (10 min):</strong> Role-based application prompt (student/parent/leader).</li>' +
        '<li><strong>Closing Prayer (5 min):</strong> Commitment, intercession, and follow-up challenge.</li>' +
      '</ul>';
    renderHtml('abw-leader-output', html);
    setStatus('Leader dashboard plan generated.');
  }

  function buildMasteryQuestions(rows) {
    var chosen = rows.slice(0, Math.min(5, rows.length));
    return chosen.map(function (item, idx) {
      return 'Q' + (idx + 1) + ': In Entry ' + item.day + ' (' + item.characterName + '), how does ' + item.keyVerseRef + ' shape faithful action?';
    });
  }

  function generateMastery() {
    var season = selectedSeason();
    var rows = rowsForSeason();
    if (!rows.length) {
      renderHtml('abw-mastery-output', '<p class="section-note">No entries are available for this season.</p>');
      return;
    }
    var questions = buildMasteryQuestions(rows);
    renderHtml('abw-mastery-output',
      '<h3>Season Mastery Checkpoint' + (season ? ' · ' + esc(season) : '') + '</h3>' +
      '<p><strong>Coverage:</strong> ' + esc(rows.length) + ' entries</p>' +
      '<ul>' + questions.map(function (q) { return '<li>' + esc(q) + '</li>'; }).join('') + '</ul>' +
      '<p class="abw-note">Scoring guide: 0-2 developing, 3-4 growing, 5 mission-ready.</p>'
    );
    setStatus('Season mastery checkpoint generated.');
  }

  function updateProductionPreview() {
    var total = state.all.length;
    var seasons = Object.keys(state.bySeason);
    var weekCount = state.packs.length;
    var weekInput = byId('abw-week');
    if (weekInput) {
      weekInput.max = String(Math.max(1, weekCount));
      if (!weekInput.value) weekInput.value = '1';
    }
    renderHtml('abw-production-output',
      '<p><strong>Ready for pipeline:</strong> ' + esc(total) + ' entries across ' + esc(seasons.length) + ' seasons.</p>' +
      '<p><strong>Weekly packs available:</strong> ' + esc(weekCount) + '</p>' +
      '<p>Use <code>npm run actionbible:packs</code> to regenerate rollout packs for leaders, parents, and students.</p>'
    );
  }

  function selectedWeekNumber() {
    return Number((byId('abw-week') && byId('abw-week').value) || 0);
  }

  function loadWeeklyPack() {
    var weekNum = selectedWeekNumber();
    if (!weekNum) {
      setStatus('Select a weekly pack number first.');
      return;
    }
    var pack = null;
    for (var i = 0; i < state.packs.length; i++) {
      if (Number(state.packs[i].week) === weekNum) {
        pack = state.packs[i];
        break;
      }
    }
    if (!pack) {
      setStatus('Weekly pack ' + weekNum + ' was not found.');
      return;
    }
    var entryCount = Array.isArray(pack.entries) ? pack.entries.length : 0;
    renderHtml('abw-production-output',
      '<h3>Weekly Pack ' + esc(pack.week) + ' · ' + esc(pack.season || 'Archive') + '</h3>' +
      '<p><strong>Entry range:</strong> ' + esc((pack.range && pack.range.startEntry) || '?') + ' - ' + esc((pack.range && pack.range.endEntry) || '?') + '</p>' +
      '<p><strong>Entries in pack:</strong> ' + esc(entryCount) + '</p>' +
      '<p><strong>Leader objective:</strong> ' + esc((pack.leaderFocus && pack.leaderFocus.objective) || 'Not available') + '</p>' +
      '<p><strong>Family prompt:</strong> ' + esc((pack.parentGuide && pack.parentGuide.familyPrompt) || 'Not available') + '</p>' +
      '<p><strong>Student mission:</strong> ' + esc((pack.studentChallenge && pack.studentChallenge.mission) || 'Not available') + '</p>'
    );
    setStatus('Loaded weekly pack ' + weekNum + '.');
  }

  function downloadWeeklyPack() {
    var weekNum = selectedWeekNumber();
    if (!weekNum) {
      setStatus('Select a weekly pack number first.');
      return;
    }
    var pack = null;
    for (var i = 0; i < state.packs.length; i++) {
      if (Number(state.packs[i].week) === weekNum) {
        pack = state.packs[i];
        break;
      }
    }
    if (!pack) {
      setStatus('Weekly pack ' + weekNum + ' was not found.');
      return;
    }
    var blob = new Blob([JSON.stringify(pack, null, 2)], { type: 'application/json;charset=utf-8' });
    var link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'action-bible-week-' + weekNum + '.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
    setStatus('Downloaded weekly pack ' + weekNum + '.');
  }

  function currentOutputText() {
    var pieces = [
      stripHtml((byId('abw-worksheet-output') || {}).innerHTML),
      stripHtml((byId('abw-family-output') || {}).innerHTML),
      stripHtml((byId('abw-leader-output') || {}).innerHTML),
      stripHtml((byId('abw-mastery-output') || {}).innerHTML)
    ].filter(function (part) { return part; });
    return pieces.join('\n\n---\n\n');
  }

  function copyCurrentOutput() {
    var text = currentOutputText();
    if (!text) {
      setStatus('No generated output is available to copy yet.');
      return;
    }
    if (navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
      navigator.clipboard.writeText(text).then(function () {
        setStatus('Current output copied to clipboard.');
      }).catch(function () {
        setStatus('Copy did not go through. Use Download instead.');
      });
      return;
    }
    setStatus('Clipboard is unavailable in this browser. Use Download Current Output.');
  }

  function downloadCurrentOutput() {
    var text = currentOutputText();
    if (!text) {
      setStatus('No generated output is available to download yet.');
      return;
    }
    var blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    var link = document.createElement('a');
    var season = selectedSeason() || 'all-seasons';
    var filename = 'action-bible-toolkit-' + season.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '.txt';
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
    setStatus('Current output downloaded as ' + filename + '.');
  }

  function hydrateSeasonSelect() {
    var select = byId('abw-season');
    if (!select) return;
    var seasons = Object.keys(state.bySeason).sort();
    for (var i = 0; i < seasons.length; i++) {
      var opt = document.createElement('option');
      opt.value = seasons[i];
      opt.textContent = seasons[i];
      select.appendChild(opt);
    }
  }

  function buildSeasonMap(rows) {
    state.bySeason = {};
    rows.forEach(function (row) {
      var season = String(row.documentarySeason || 'Archive').trim();
      if (!state.bySeason[season]) state.bySeason[season] = [];
      state.bySeason[season].push(row);
    });
  }

  function wire() {
    byId('abw-generate-worksheet') && byId('abw-generate-worksheet').addEventListener('click', generateWorksheet);
    byId('abw-generate-family') && byId('abw-generate-family').addEventListener('click', generateFamilyMode);
    byId('abw-generate-leader') && byId('abw-generate-leader').addEventListener('click', generateLeaderPack);
    byId('abw-generate-mastery') && byId('abw-generate-mastery').addEventListener('click', generateMastery);
    byId('abw-copy-output') && byId('abw-copy-output').addEventListener('click', copyCurrentOutput);
    byId('abw-download-output') && byId('abw-download-output').addEventListener('click', downloadCurrentOutput);
    byId('abw-load-week') && byId('abw-load-week').addEventListener('click', loadWeeklyPack);
    byId('abw-download-week') && byId('abw-download-week').addEventListener('click', downloadWeeklyPack);
    byId('abw-entry') && byId('abw-entry').addEventListener('change', regenerateAllPanels);
    byId('abw-tier') && byId('abw-tier').addEventListener('change', regenerateAllPanels);
    byId('abw-role') && byId('abw-role').addEventListener('change', regenerateAllPanels);
    byId('abw-season') && byId('abw-season').addEventListener('change', regenerateAllPanels);
    byId('abw-export-print') && byId('abw-export-print').addEventListener('click', function () {
      window.print();
    });
  }

  function init() {
    wire();
    Promise.all([
      fetch(DATA_URL).then(function (res) { return res.ok ? res.json() : Promise.reject(new Error('load_failed')); }),
      fetch(PACKS_URL).then(function (res) { return res.ok ? res.json() : Promise.reject(new Error('packs_load_failed')); })
    ])
      .then(function (payloads) {
        var json = payloads[0];
        var packsJson = payloads[1];
        var rows = Array.isArray(json && json.days) ? json.days : [];
        var packs = Array.isArray(packsJson && packsJson.weeks) ? packsJson.weeks : [];
        state.all = rows;
        state.packs = packs;
        buildSeasonMap(rows);
        hydrateSeasonSelect();
        var entryInput = byId('abw-entry');
        if (entryInput) {
          entryInput.max = String(rows.length || 1);
          entryInput.value = rows.length ? String(rows[0].day) : '1';
        }
        regenerateAllPanels();
        updateProductionPreview();
        setStatus('Loaded ' + rows.length + ' entries and ' + packs.length + ' weekly packs for full toolkit generation.');
      })
      .catch(function () {
        setStatus('Action Bible data did not load for toolkit generation. Refresh when you are online.');
      });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
