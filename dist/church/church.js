/**
 * Church Join Hub — join flow, shared daily verse, reflections, leaderboard.
 * Uses script.js: getDailyVerseRef, bible, getBibleVerseText, getDailyKey.
 */
(function () {
  'use strict';

  const CHURCH_CODE_KEY = 'churchCode';
  const CHURCH_GROUP_ID_KEY = 'churchGroupId';
  const CHURCH_GROUP_NAME_KEY = 'churchGroupName';
  const CHURCH_PASTOR_ANON_ID_KEY = 'churchPastorAnonId';

  function getDailyKey() {
    var d = new Date();
    return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
  }

  function getOrCreateAnonId() {
    try {
      var id = localStorage.getItem('churchHubAnonId');
      if (id && id.length >= 10) return id;
      var bibleId = localStorage.getItem('bibleHubAnonId');
      if (bibleId && bibleId.length >= 10) {
        localStorage.setItem('churchHubAnonId', bibleId);
        return bibleId;
      }
      id = 'ch_' + Date.now() + '_' + Math.random().toString(36).slice(2, 12);
      localStorage.setItem('churchHubAnonId', id);
      return id;
    } catch (e) { return 'ch_anon'; }
  }

  function getPastorAnonId() {
    try {
      var pid = localStorage.getItem('pastorHubAnonId');
      if (pid && pid.length >= 10) return pid;
      return getOrCreateAnonId();
    } catch (e) { return getOrCreateAnonId(); }
  }

  function getChurchPastorAnonId() {
    try {
      return (localStorage.getItem(CHURCH_PASTOR_ANON_ID_KEY) || '').trim();
    } catch (e) { return ''; }
  }

  function isPastor() {
    var pastorId = getChurchPastorAnonId();
    if (!pastorId) return false;
    var mine = getOrCreateAnonId();
    var pastorMine = getPastorAnonId();
    return (mine && mine === pastorId) || (pastorMine && pastorMine === pastorId);
  }

  function getChurchCode() {
    try {
      return (localStorage.getItem(CHURCH_CODE_KEY) || '').trim();
    } catch (e) { return ''; }
  }

  function getChurchGroupId() {
    try {
      return localStorage.getItem(CHURCH_GROUP_ID_KEY) || '';
    } catch (e) { return ''; }
  }

  function setChurchJoined(code, groupId, groupName, pastorAnonId) {
    try {
      localStorage.setItem(CHURCH_CODE_KEY, (code || '').trim());
      localStorage.setItem(CHURCH_GROUP_ID_KEY, groupId || '');
      localStorage.setItem(CHURCH_GROUP_NAME_KEY, groupName || '');
      if (pastorAnonId) localStorage.setItem(CHURCH_PASTOR_ANON_ID_KEY, pastorAnonId);
    } catch (e) {}
  }

  function escapeHtml(s) {
    if (!s) return '';
    var div = document.createElement('div');
    div.textContent = s;
    return div.innerHTML;
  }

  function getSupabaseClient() {
    var cfg = window.TDB_CONFIG || {};
    var url = cfg.SUPABASE_URL;
    var key = cfg.SUPABASE_ANON_KEY;
    if (!url || !key) return null;
    try {
      var supabase = window.supabase || (typeof supabase !== 'undefined' ? supabase : null);
      if (!supabase || !supabase.createClient) return null;
      return supabase.createClient(url, key);
    } catch (e) { return null; }
  }

  var VERSE_CHALLENGES = [
    { ref: 'Joshua 1:9', text: 'Be strong and ___ of a good courage; be not ___ , neither be thou ___: for the LORD thy God is with thee.', answers: ['courage', 'afraid', 'dismayed'] },
    { ref: 'Philippians 4:13', text: 'I can do all things through ___ which ___ me.', answers: ['Christ', 'strengtheneth'] },
    { ref: 'Psalm 23:1', text: 'The LORD is my ___; I shall not ___.', answers: ['shepherd', 'want'] },
    { ref: 'Proverbs 3:5', text: 'Trust in the LORD with all thine ___; and lean not unto thine own ___.', answers: ['heart', 'understanding'] },
    { ref: 'Isaiah 41:10', text: 'Fear thou not; for I am with thee: be not ___; for I am thy ___.', answers: ['dismayed', 'God'] },
    { ref: 'Matthew 11:28', text: 'Come unto me, all ye that ___ and are ___ laden, and I will give you ___.', answers: ['labour', 'heavy', 'rest'] },
    { ref: 'Romans 8:28', text: 'And we know that all things work together for ___ to them that love ___.', answers: ['good', 'God'] },
    { ref: 'John 3:16', text: 'For God so ___ the world, that he gave his only ___ Son.', answers: ['loved', 'begotten'] }
  ];

  function getWeekKey() {
    var d = new Date();
    var start = new Date(d.getFullYear(), 0, 1);
    var diff = d - start;
    var week = Math.ceil((diff + start.getDay() + 1) / 7);
    return d.getFullYear() + '-W' + String(week).padStart(2, '0');
  }

  function resolveGroupIdFromCode(code) {
    return new Promise(function (resolve) {
      var client = getSupabaseClient();
      if (!client || !code) {
        resolve(null);
        return;
      }
      client.rpc('get_church_group_by_code', { p_code: code })
        .then(function (res) {
          var rows = res && res.data;
          if (rows && rows.length > 0) {
            setChurchJoined(code, rows[0].id, rows[0].name || '', rows[0].pastor_anon_id || '');
            resolve(rows[0].id);
          } else {
            resolve(null);
          }
        })
        .catch(function () { resolve(null); });
    });
  }

  /* --- Join page --- */
  function initJoinPage() {
    var code = getChurchCode();
    if (code && document.getElementById('church-daily-verse-card') === null) {
      window.location.href = '/church/daily.html';
      return;
    }

    var form = document.getElementById('church-join-form');
    var input = document.getElementById('church-code-input');
    var btn = document.getElementById('church-join-btn');
    var errEl = document.getElementById('church-join-error');

    if (!form || !input) return;

    try {
      var pre = new URLSearchParams(window.location.search || '').get('group') || '';
      if (pre && !input.value) input.value = String(pre).trim();
    } catch (ePrefill) { /* non-fatal */ }

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var raw = (input.value || '').trim();
      if (!raw) {
        showError('Enter a church code.');
        return;
      }

      if (btn) btn.disabled = true;
      if (errEl) { errEl.classList.add('hidden'); errEl.textContent = ''; }

      var client = getSupabaseClient();
      if (!client) {
        showError('Connection did not open. Try again shortly.');
        if (btn) btn.disabled = false;
        return;
      }

      client.rpc('join_group', { p_code: raw, p_member_id: getOrCreateAnonId() })
        .then(function (res) {
          var data = res && res.data;
          if (data && data.ok) {
            setChurchJoined(raw, data.group_id, data.name || '', data.pastor_anon_id || '');
            window.location.href = '/church/daily.html';
            return;
          }
          var reason = (data && data.reason) || 'Join did not go through. Check the code or try again.';
          if (reason === 'not_found') reason = 'Church code not found. Check the code and try again.';
          else if (reason === 'invalid_code') reason = 'Please enter a valid church code.';
          showError(reason);
        })
        .catch(function () {
          showError('Join did not go through. Check your connection and try again.');
        })
        .finally(function () {
          if (btn) btn.disabled = false;
        });
    });

    function showError(msg) {
      if (errEl) {
        errEl.textContent = msg;
        errEl.classList.remove('hidden');
      }
    }

    /* Roundup opt-in (index page) */
    var roundupIndexForm = document.getElementById('church-roundup-index-form');
    var roundupIndexEmail = document.getElementById('church-roundup-index-email');
    var roundupIndexBtn = document.getElementById('church-roundup-index-btn');
    var roundupIndexResult = document.getElementById('church-roundup-index-result');
    if (roundupIndexForm && roundupIndexEmail && roundupIndexBtn) {
      roundupIndexForm.addEventListener('submit', function (e) {
        e.preventDefault();
        var email = (roundupIndexEmail.value || '').trim();
        if (!email) return;
        if (roundupIndexResult) { roundupIndexResult.classList.add('hidden'); roundupIndexResult.textContent = ''; }
        roundupIndexBtn.disabled = true;
        function doUpsert(gid) {
          if (!gid) {
            if (roundupIndexResult) { roundupIndexResult.textContent = 'Join the group first.'; roundupIndexResult.classList.remove('hidden'); roundupIndexResult.classList.add('error'); }
            roundupIndexBtn.disabled = false;
            return;
          }
          var client = getSupabaseClient();
          if (!client) {
            if (roundupIndexResult) { roundupIndexResult.textContent = 'Connection did not open. Try again when you are online.'; roundupIndexResult.classList.remove('hidden'); roundupIndexResult.classList.add('error'); }
            roundupIndexBtn.disabled = false;
            return;
          }
          client.rpc('upsert_church_subscriber', {
            p_group_id: gid,
            p_email: email,
            p_anon_id: getOrCreateAnonId()
          })
            .then(function (res) {
              var data = res && res.data;
              if (data && data.ok) {
                if (roundupIndexResult) {
                  roundupIndexResult.textContent = 'Subscribed! You\'ll get the Monday roundup.';
                  roundupIndexResult.classList.remove('hidden', 'error');
                  roundupIndexResult.classList.add('success');
                }
              } else {
                var reason = (data && data.reason) || 'Subscription did not finish. Try again in a moment.';
                if (reason === 'invalid_email') reason = 'Please enter a valid email.';
                if (reason === 'not_member') reason = 'Join the group first.';
                if (roundupIndexResult) { roundupIndexResult.textContent = reason; roundupIndexResult.classList.remove('hidden'); roundupIndexResult.classList.add('error'); }
              }
            })
            .catch(function () {
              if (roundupIndexResult) { roundupIndexResult.textContent = 'Subscription did not finish. Try again in a moment.'; roundupIndexResult.classList.remove('hidden'); roundupIndexResult.classList.add('error'); }
            })
            .finally(function () {
              roundupIndexBtn.disabled = false;
            });
        }
        var gid = getChurchGroupId();
        if (gid) {
          doUpsert(gid);
        } else {
          var c = getChurchCode();
          if (c) {
            resolveGroupIdFromCode(c).then(function (id) {
              doUpsert(id || getChurchGroupId());
            });
          } else {
            doUpsert(null);
          }
        }
      });
    }

    /* Create group form (pastor) */
    var createForm = document.getElementById('church-create-form');
    var createCode = document.getElementById('church-create-code');
    var createName = document.getElementById('church-create-name');
    var createBtn = document.getElementById('church-create-btn');
    var createResult = document.getElementById('church-create-result');
    if (createForm && createCode) {
      createForm.addEventListener('submit', function (e) {
        e.preventDefault();
        var code = (createCode.value || '').trim().toUpperCase();
        var name = (createName.value || '').trim();
        if (!code) return;
        if (createBtn) createBtn.disabled = true;
        if (createResult) { createResult.classList.add('hidden'); createResult.textContent = ''; }
        var client = getSupabaseClient();
        if (!client) {
          if (createResult) { createResult.textContent = 'Connection did not open. Try again when you are online.'; createResult.classList.remove('hidden'); createResult.classList.add('error'); }
          if (createBtn) createBtn.disabled = false;
          return;
        }
        client.rpc('create_church_group', {
          p_code: code,
          p_name: name || code,
          p_pastor_anon_id: getPastorAnonId()
        })
          .then(function (res) {
            var data = res && res.data;
            var rpcErr = res && res.error;
            if (data && data.ok) {
              var made = String(data.code || code || '').trim();
              setChurchJoined(made, data.group_id, name || made, getPastorAnonId());
              var invite = (window.location.origin || 'https://todaysdailybattle.com') + '/church/?group=' + encodeURIComponent(made);
              if (createResult) {
                while (createResult.firstChild) createResult.removeChild(createResult.firstChild);
                var p = document.createElement('p');
                p.textContent = 'Group created. Share this link — people will see today’s official KJV verse.';
                var row = document.createElement('p');
                var link = document.createElement('input');
                link.type = 'text';
                link.readOnly = true;
                link.value = invite;
                link.setAttribute('aria-label', 'Invite link');
                var copy = document.createElement('button');
                copy.type = 'button';
                copy.className = 'btn btn-secondary';
                copy.textContent = 'Copy invite';
                copy.addEventListener('click', function () {
                  try {
                    if (navigator.clipboard && navigator.clipboard.writeText) {
                      navigator.clipboard.writeText(invite);
                    } else {
                      link.select();
                      document.execCommand('copy');
                    }
                    copy.textContent = 'Copied';
                  } catch (eCopy) { /* non-fatal */ }
                });
                row.appendChild(link);
                row.appendChild(copy);
                var go = document.createElement('p');
                var a = document.createElement('a');
                a.href = '/church/daily.html';
                a.textContent = 'Open today’s verse for this group →';
                go.appendChild(a);
                createResult.appendChild(p);
                createResult.appendChild(row);
                createResult.appendChild(go);
                createResult.classList.remove('hidden', 'error');
                createResult.classList.add('success');
              }
            } else {
              var reason = (data && data.reason) || '';
              if (reason === 'code_taken') reason = 'That code is already taken. Try another.';
              else if (reason === 'invalid_code') reason = 'Use at least 3 letters or numbers for the code.';
              else if (reason === 'invalid_pastor') reason = 'This browser could not start a group. Refresh and try again.';
              else if (rpcErr) reason = 'Group creation did not go through. Try again in a moment.';
              else reason = 'Group creation did not go through. Try another code, or try again in a moment.';
              if (createResult) { createResult.textContent = reason; createResult.classList.remove('hidden'); createResult.classList.add('error'); }
            }
          })
          .catch(function () {
            if (createResult) { createResult.textContent = 'Group creation did not go through. Try again in a moment.'; createResult.classList.remove('hidden'); createResult.classList.add('error'); }
          })
          .finally(function () {
            if (createBtn) createBtn.disabled = false;
          });
      });
    }
  }

  /* --- Daily page: verse, reflection, list, leaderboard --- */
  function paintOfficialDaily(ref, text) {
    var card = document.getElementById('church-daily-verse-card');
    var refEl = document.getElementById('church-daily-ref');
    if (refEl) refEl.textContent = ref;
    var textEl = document.getElementById('church-daily-text');
    if (textEl) textEl.textContent = text;
    if (!card) return;
    if (!card.querySelector('#church-daily-verse-text')) {
      card.innerHTML =
        '<strong id="church-daily-verse-ref"></strong>' +
        '<p id="church-daily-verse-text"></p>';
    }
    var cardRef = card.querySelector('#church-daily-verse-ref');
    var cardText = card.querySelector('#church-daily-verse-text');
    if (cardRef) cardRef.textContent = ref;
    if (cardText) cardText.textContent = text;
    card.classList.add('verse-card-loaded');
    if (window.TDBVerseBreakdown && typeof window.TDBVerseBreakdown.injectInlineBreakdown === 'function') {
      window.TDBVerseBreakdown.injectInlineBreakdown(card, ref, text);
    }
  }

  function renderDailyVerse() {
    var card = document.getElementById('church-daily-verse-card');
    var refEl = document.getElementById('church-daily-ref');
    if (!card && !refEl) return;

    fetch('/today-kjv-verse.json', { cache: 'no-store' })
      .then(function (res) { return res.ok ? res.json() : null; })
      .then(function (row) {
        if (row && row.ref && row.text) {
          paintOfficialDaily(String(row.ref), String(row.text));
          return;
        }
        /* Keep first-paint stamp. Do not paint leftover Psalm 96:2 as today. */
      })
      .catch(function () {
        /* Keep first-paint stamp. */
      });
  }

  function loadReflections(groupId) {
    var list = document.getElementById('church-reflections-list');
    if (!list) return;

    var client = getSupabaseClient();
    if (!client || !groupId) {
      list.innerHTML = '<p class="church-reflections-empty">No reflections posted yet. Share the first one with your group.</p>';
      return;
    }

    client.rpc('get_church_reflections', { p_group_id: groupId, p_limit: 5 })
      .then(function (res) {
        var rows = res && res.data;
        if (!rows || rows.length === 0) {
          list.innerHTML = '<p class="church-reflections-empty">No reflections posted yet. Share the first one with your group.</p>';
          return;
        }
        var html = '';
        for (var i = 0; i < rows.length; i++) {
          var r = rows[i];
          var author = (r.anon_id || '').length > 10 ? (r.anon_id || '').slice(0, 10) + '…' : (r.anon_id || 'Someone');
          var dateStr = r.reflection_date ? new Date(r.reflection_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : '';
          html += '<div class="church-reflection-bubble">';
          html += '<div class="church-reflection-bubble-author">' + escapeHtml(author) + '</div>';
          html += '<div class="church-reflection-bubble-text">' + escapeHtml(r.text || '') + '</div>';
          html += '<div class="church-reflection-bubble-date">' + escapeHtml(dateStr) + '</div>';
          html += '</div>';
        }
        list.innerHTML = html;
      })
      .catch(function () {
        list.innerHTML = '<p class="church-reflections-empty">Reflections did not load. Try again in a moment.</p>';
      });
  }

  function loadLeaderboard(groupId) {
    var list = document.getElementById('church-leaderboard-list');
    if (!list) return;

    var client = getSupabaseClient();
    if (!client || !groupId) {
      list.innerHTML = '<p class="church-leaderboard-empty">Join the group and start your streak to appear here.</p>';
      return;
    }

    client.rpc('get_church_leaderboard', { p_group_id: groupId, p_limit: 5 })
      .then(function (res) {
        var rows = res && res.data;
        if (!rows || rows.length === 0) {
          list.innerHTML = '<p class="church-leaderboard-empty">Join the group and start your streak to appear here.</p>';
          return;
        }
        var html = '';
        for (var i = 0; i < rows.length; i++) {
          var r = rows[i];
          var anon = (r.anon_id || '').length > 10 ? (r.anon_id || '').slice(0, 10) + '…' : (r.anon_id || '—');
          html += '<div class="church-leaderboard-item">';
          html += '<span class="church-leaderboard-rank">#' + (r.rank || (i + 1)) + '</span>';
          html += '<span class="church-leaderboard-streak">' + (r.streak_count || 0) + ' days</span>';
          html += '<span class="church-leaderboard-anon">' + escapeHtml(anon) + '</span>';
          html += '</div>';
        }
        list.innerHTML = html;
      })
      .catch(function () {
        list.innerHTML = '<p class="church-leaderboard-empty">Leaderboard did not load. Try again in a moment.</p>';
      });
  }

  var ATTENDANCE_DONE_KEY_PREFIX = 'churchAttendanceDone_';

  function getAttendanceDoneKey(groupId) {
    return ATTENDANCE_DONE_KEY_PREFIX + (groupId || '') + '_' + getDailyKey();
  }

  function hasMarkedAttendanceToday(groupId) {
    try {
      return localStorage.getItem(getAttendanceDoneKey(groupId)) === '1';
    } catch (e) { return false; }
  }

  function setAttendanceDoneToday(groupId) {
    try {
      localStorage.setItem(getAttendanceDoneKey(groupId), '1');
    } catch (e) {}
  }

  function loadAttendanceStats(groupId) {
    var xEl = document.getElementById('church-attendance-x');
    var yEl = document.getElementById('church-attendance-y');
    var barFill = document.getElementById('church-attendance-bar-fill');
    var statsWrap = document.getElementById('church-attendance-stats');
    var badgeEl = document.getElementById('church-attendance-badge');
    if (!statsWrap || !groupId) return;

    var client = getSupabaseClient();
    if (!client) {
      statsWrap.classList.add('hidden');
      return;
    }

    client.rpc('get_church_attendance_week', { p_group_id: groupId })
      .then(function (res) {
        var row = res && res.data && res.data[0];
        if (!row) {
          statsWrap.classList.add('hidden');
          return;
        }
        var x = Number(row.present_count) || 0;
        var y = Number(row.total_members) || 0;
        var pct = y > 0 ? Math.round((x / y) * 100) : 0;

        if (xEl) xEl.textContent = x;
        if (yEl) yEl.textContent = y;
        if (barFill) {
          barFill.style.width = pct + '%';
          barFill.closest('[role="progressbar"]') && barFill.closest('[role="progressbar"]').setAttribute('aria-valuenow', pct);
        }
        statsWrap.classList.remove('hidden');
        if (badgeEl) {
          if (pct >= 80) {
            badgeEl.textContent = 'Great turnout!';
            badgeEl.classList.remove('hidden');
          } else {
            badgeEl.classList.add('hidden');
          }
        }
      })
      .catch(function () {
        statsWrap.classList.add('hidden');
      });
  }

  function loadAttendancePastorList(groupId) {
    var section = document.getElementById('church-attendance-pastor-section');
    var list = document.getElementById('church-attendance-pastor-list');
    if (!section || !list || !groupId || !isPastor()) {
      if (section) section.classList.add('hidden');
      return;
    }

    var client = getSupabaseClient();
    if (!client) {
      section.classList.add('hidden');
      return;
    }

    client.rpc('get_church_attendance_week', { p_group_id: groupId })
      .then(function (res) {
        var row = res && res.data && res.data[0];
        if (!row) {
          list.innerHTML = '<p class="church-reflections-empty">No attendance records yet for this period.</p>';
          section.classList.remove('hidden');
          return;
        }
        var ids = row.present_anon_ids || [];
        var pct = Number(row.pct) || 0;

        if (ids.length === 0) {
          list.innerHTML = '<p class="church-reflections-empty">No one has checked in this week yet.</p>';
        } else {
          var html = '';
          for (var i = 0; i < ids.length; i++) {
            var anon = (ids[i] || '').length > 10 ? (ids[i] || '').slice(0, 10) + '…' : (ids[i] || 'Someone');
            html += '<div class="church-attendance-pastor-item">' + escapeHtml(anon) + '</div>';
          }
          list.innerHTML = html;
        }
        section.classList.remove('hidden');

        if (pct >= 80) {
          var weekKey = getWeekKey();
          client.rpc('apply_church_attendance_streak_bonus', {
            p_group_id: groupId,
            p_week_key: weekKey,
            p_pastor_anon_id: getChurchPastorAnonId() || getPastorAnonId()
          })
            .then(function (bonusRes) {
              var d = bonusRes && bonusRes.data;
              if (d && d.applied && (typeof window.showEliteToast === 'function' || typeof window.toast === 'function')) {
                var msg = '80%+ attendance → +0.5 group streak bonus!';
                if (typeof window.showEliteToast === 'function') window.showEliteToast(msg);
                else if (typeof window.toast === 'function') window.toast(msg);
              }
            });
        }
      })
      .catch(function () {
        section.classList.add('hidden');
      });
  }

  function initAttendanceCheckin(groupId) {
    var btn = document.getElementById('church-attendance-btn');
    var doneEl = document.getElementById('church-attendance-done');
    if (!btn || !groupId) return;

    if (hasMarkedAttendanceToday(groupId)) {
      btn.textContent = '✓ Marked present today';
      btn.classList.add('church-attendance-done-btn');
      btn.disabled = true;
      btn.setAttribute('aria-pressed', 'true');
      if (doneEl) doneEl.classList.remove('hidden');
    }

    btn.addEventListener('click', function () {
      if (hasMarkedAttendanceToday(groupId)) return;

      var client = getSupabaseClient();
      if (!client) return;

      btn.disabled = true;
      client.rpc('upsert_church_attendance', {
        p_group_id: groupId,
        p_anon_id: getOrCreateAnonId(),
        p_date: getDailyKey()
      })
        .then(function (res) {
          var data = res && res.data;
          if (data && data.ok) {
            setAttendanceDoneToday(groupId);
            btn.textContent = '✓ Marked present today';
            btn.classList.add('church-attendance-done-btn');
            btn.setAttribute('aria-pressed', 'true');
            if (doneEl) doneEl.classList.remove('hidden');
            loadAttendanceStats(groupId);
            if (isPastor()) loadAttendancePastorList(groupId);
          } else {
            btn.disabled = false;
          }
        })
        .catch(function () {
          btn.disabled = false;
        });
    });

    loadAttendanceStats(groupId);
    if (isPastor()) loadAttendancePastorList(groupId);
  }

  function getFamilyCode() {
    try {
      var fc = (localStorage.getItem('familyCode') || localStorage.getItem('kidsBetaCode') || '').trim().toUpperCase();
      return fc.length === 6 ? fc : '';
    } catch (e) { return ''; }
  }

  function initKidLeaderboard(groupId) {
    var form = document.getElementById('church-add-kid-form');
    var codeInput = document.getElementById('church-add-kid-code');
    var addBtn = document.getElementById('church-add-kid-btn');
    var resultEl = document.getElementById('church-add-kid-result');
    var section = document.getElementById('church-kid-leaderboard-section');
    var showBtn = document.getElementById('church-show-kid-leaderboard-btn');
    if (!form || !codeInput || !groupId) return;

    if (showBtn && section) {
      showBtn.addEventListener('click', function () {
        section.classList.remove('hidden');
        showBtn.setAttribute('aria-expanded', 'true');
        showBtn.classList.add('hidden');
      });
    }

    var fc = getFamilyCode();
    if (fc) codeInput.placeholder = fc;

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var code = (codeInput.value || fc || '').trim().toUpperCase();
      var kidName = (document.getElementById('church-add-kid-name') && document.getElementById('church-add-kid-name').value || '').trim();
      if (code.length !== 6) {
        if (resultEl) { resultEl.textContent = 'Enter your 6-letter family code.'; resultEl.classList.remove('hidden'); resultEl.classList.add('error'); }
        return;
      }
      if (addBtn) addBtn.disabled = true;
      if (resultEl) { resultEl.classList.add('hidden'); resultEl.textContent = ''; }

      var client = getSupabaseClient();
      if (!client) {
        if (resultEl) { resultEl.textContent = 'Connection did not open. Try again when you are online.'; resultEl.classList.remove('hidden'); resultEl.classList.add('error'); }
        if (addBtn) addBtn.disabled = false;
        return;
      }
      client.rpc('add_church_group_kid', {
        p_group_id: groupId,
        p_invite_code: code,
        p_anon_id: getOrCreateAnonId(),
        p_kid_name: kidName || 'Kiddo'
      })
        .then(function (res) {
          var data = res && res.data;
          if (data && data.ok) {
            if (resultEl) {
              resultEl.textContent = 'Added! Your kid will appear on the leaderboard.';
              resultEl.classList.remove('hidden', 'error');
              resultEl.classList.add('success');
            }
            codeInput.value = '';
            if (document.getElementById('church-add-kid-name')) document.getElementById('church-add-kid-name').value = '';
            loadKidLeaderboard(groupId);
            loadGroupDoodles(groupId);
          } else {
            var reason = (data && data.reason) || 'That entry did not save. Try again in a moment.';
            if (reason === 'invalid_code') reason = 'Invalid or unused family code. Check the code from your parent email.';
            if (reason === 'not_member') reason = 'Join the group first.';
            if (resultEl) { resultEl.textContent = reason; resultEl.classList.remove('hidden'); resultEl.classList.add('error'); }
          }
        })
        .catch(function () {
          if (resultEl) { resultEl.textContent = 'That entry did not save. Try again in a moment.'; resultEl.classList.remove('hidden'); resultEl.classList.add('error'); }
        })
        .finally(function () {
          if (addBtn) addBtn.disabled = false;
        });
    });
  }

  function loadGroupDoodles(groupId) {
    var section = document.getElementById('church-doodle-gallery-section');
    var grid = document.getElementById('church-doodle-gallery-grid');
    if (!section || !grid) return;

    var client = getSupabaseClient();
    if (!client || !groupId) {
      section.classList.add('hidden');
      return;
    }

    client.rpc('get_church_kid_leaderboard', { p_group_id: groupId, p_limit: 20 })
      .then(function (res) {
        var rows = res && res.data;
        var codeToName = {};
        var codes = [];
        if (rows && rows.length > 0) {
          for (var i = 0; i < rows.length; i++) {
            var c = (rows[i].invite_code || '').trim().toUpperCase();
            if (c && codes.indexOf(c) === -1) {
              codes.push(c);
              codeToName[c] = rows[i].kid_name || 'Kiddo';
            }
          }
        }
        if (codes.length === 0) {
          section.classList.add('hidden');
          return;
        }

        grid.innerHTML = '<p class="church-doodle-loading">Loading doodles…</p>';
        section.classList.remove('hidden');

        var allFiles = [];
        var pending = codes.length;
        codes.forEach(function (code) {
          var path = 'doodles/' + code + '/';
          client.storage.from('kid-doodles').list(path, { limit: 10 })
            .then(function (listRes) {
              var items = (listRes.data || []).filter(function (o) { return o.name && o.name.toLowerCase().endsWith('.png'); });
              var kidName = codeToName[code] || 'Kiddo';
              items.forEach(function (o) {
                var match = o.name.match(/^(.+)-(\d+)\.png$/i);
                var ts = match ? parseInt(match[2], 10) : (o.created_at ? new Date(o.created_at).getTime() : 0);
                var parsedName = match ? match[1].replace(/_/g, ' ') : kidName;
                allFiles.push({
                  path: path + o.name,
                  ts: ts,
                  kidName: parsedName || kidName
                });
              });
              pending--;
              if (pending === 0) finishDoodles();
            })
            .catch(function () {
              pending--;
              if (pending === 0) finishDoodles();
            });
        });

        function finishDoodles() {
          allFiles.sort(function (a, b) { return (b.ts || 0) - (a.ts || 0); });
          var toShow = allFiles.slice(0, 3);
          if (toShow.length === 0) {
            grid.innerHTML = '<p class="church-doodle-empty">No doodles saved yet - invite kids to draw and save one today. 🎨</p>';
            return;
          }
          var html = '';
          for (var j = 0; j < toShow.length; j++) {
            var f = toShow[j];
            var url = client.storage.from('kid-doodles').getPublicUrl(f.path).data.publicUrl;
            var d = new Date(f.ts);
            var dateStr = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
            html += '<div class="church-doodle-polaroid">';
            html += '<img src="' + escapeHtml(url) + '" alt="Doodle by ' + escapeHtml(f.kidName) + '" loading="lazy">';
            html += '<span class="church-doodle-caption">By ' + escapeHtml(f.kidName) + ' on ' + escapeHtml(dateStr) + '</span>';
            html += '</div>';
          }
          grid.innerHTML = html;
        }
      })
      .catch(function () {
        section.classList.add('hidden');
      });
  }

  function loadKidLeaderboard(groupId) {
    var section = document.getElementById('church-kid-leaderboard-section');
    var list = document.getElementById('church-kid-leaderboard-list');
    if (!section || !list) return;

    var client = getSupabaseClient();
    if (!client || !groupId) {
      section.classList.add('hidden');
      return;
    }

    client.rpc('get_church_kid_leaderboard', { p_group_id: groupId, p_limit: 3 })
      .then(function (res) {
        var rows = res && res.data;
        var myCode = getFamilyCode();
        var showToast = false;

        if (!rows || rows.length === 0) {
          list.innerHTML = '<p class="church-kid-leaderboard-empty">No kids are on the leaderboard yet. Add your first participant to begin.</p>';
          section.classList.add('hidden');
          return;
        }

        var html = '';
        var badgeIcons = ['🥇', '🥈', '🥉'];
        var toShow = rows.slice(0, 3);
        for (var i = 0; i < toShow.length; i++) {
          var r = toShow[i];
          var name = escapeHtml(r.kid_name || 'Kiddo');
          var streak = r.streak_count || 0;
          var badge = badgeIcons[i] || '';
          var isMine = myCode && (r.invite_code || '').toUpperCase() === myCode;
          if (i === 0 && isMine) showToast = true;

          html += '<div class="church-kid-leaderboard-item' + (isMine ? ' church-kid-mine' : '') + '">';
          html += '<span class="church-kid-badge">' + badge + '</span>';
          html += '<span class="church-kid-rank">#' + (r.rank || (i + 1)) + '</span>';
          html += '<span class="church-kid-name">' + name + ': ' + streak + ' days 🔥</span>';
          html += '</div>';
        }
        list.innerHTML = html;
        section.classList.remove('hidden');
        var showBtn = document.getElementById('church-show-kid-leaderboard-btn');
        if (showBtn) showBtn.classList.add('hidden');

        if (showToast) {
          if (typeof window.showEliteToast === 'function') {
            window.showEliteToast("Your kid's #1!");
          } else if (typeof window.toast === 'function') {
            window.toast("Your kid's #1!");
          }
        }
      })
      .catch(function () {
        section.classList.add('hidden');
      });
  }

  function loadPastorDrafts(pastorAnonId, callback) {
    var sel = document.getElementById('church-vote-draft-select');
    if (!sel) return;
    var client = getSupabaseClient();
    if (!client || !pastorAnonId) {
      sel.innerHTML = '<option value="">No drafts</option>';
      if (callback) callback([]);
      return;
    }
    client.from('sermon_drafts').select('id, title, scripture').eq('anon_id', pastorAnonId).order('updated_at', { ascending: false })
      .then(function (res) {
        var rows = res && res.data;
        sel.innerHTML = '<option value="">Select a draft…</option>';
        if (rows && rows.length > 0) {
          for (var i = 0; i < rows.length; i++) {
            var r = rows[i];
            sel.innerHTML += '<option value="' + escapeHtml(r.id) + '" data-title="' + escapeHtml(r.title || '') + '" data-scripture="' + escapeHtml(r.scripture || '') + '">' + escapeHtml(r.title || 'Untitled') + '</option>';
          }
        } else {
          sel.innerHTML = '<option value="">No drafts—create one in Pastor Builder</option>';
        }
        if (callback) callback(rows || []);
      })
      .catch(function () {
        sel.innerHTML = '<option value="">Drafts did not load. Try again.</option>';
        if (callback) callback([]);
      });
  }

  function loadVotes(groupId) {
    var list = document.getElementById('church-votes-list');
    var pastorSection = document.getElementById('church-vote-pastor-section');
    var memberSection = document.getElementById('church-vote-member-section');
    if (!list) return;

    var client = getSupabaseClient();
    if (!client || !groupId) {
      if (list) list.innerHTML = '<p class="church-votes-empty">No open votes.</p>';
      return;
    }

    client.rpc('get_church_votes_open', { p_group_id: groupId })
      .then(function (res) {
        var rows = res && res.data;
        if (!rows || rows.length === 0) {
          list.innerHTML = '<p class="church-votes-empty">No open votes.</p>';
          if (pastorSection && isPastor()) pastorSection.classList.remove('hidden');
          if (memberSection) memberSection.classList.remove('hidden');
          return;
        }
        var anonId = getOrCreateAnonId();
        var html = '';
        for (var i = 0; i < rows.length; i++) {
          var r = rows[i];
          var up = r.votes_up || 0;
          var down = r.votes_down || 0;
          var total = up + down;
          var pct = total > 0 ? Math.round((up / total) * 100) : 50;
          var myVote = (r.votes && r.votes[anonId]) ? parseInt(r.votes[anonId], 10) : 0;
          var endsAt = r.ends_at ? new Date(r.ends_at) : null;
          var endsStr = '';
          if (endsAt) {
            var daysLeft = Math.ceil((endsAt - new Date()) / (24 * 60 * 60 * 1000));
            endsStr = daysLeft > 0 ? 'Vote ends in ' + daysLeft + ' day' + (daysLeft === 1 ? '' : 's') : 'Vote ends ' + endsAt.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
          }
          html += '<div class="church-vote-card" data-vote-id="' + escapeHtml(r.id) + '">';
          html += '<div class="church-vote-card-title">' + escapeHtml(r.title || 'Untitled') + '</div>';
          if (r.scripture) html += '<div class="church-vote-card-scripture">' + escapeHtml(r.scripture) + '</div>';
          html += '<div class="church-vote-bar-wrap">';
          html += '<div class="church-vote-progress"><div class="church-vote-progress-fill" style="width:' + pct + '%"></div></div>';
          html += '<span class="church-vote-counts">' + up + ' up, ' + down + ' down</span>';
          html += '</div>';
          html += '<div class="church-vote-buttons">';
          html += '<button type="button" class="church-vote-btn church-vote-btn-up' + (myVote === 1 ? ' active' : '') + '" data-vote="1" aria-label="Thumbs up">👍</button>';
          html += '<button type="button" class="church-vote-btn church-vote-btn-down' + (myVote === -1 ? ' active' : '') + '" data-vote="-1" aria-label="Thumbs down">👎</button>';
          html += '</div>';
          if (endsStr) html += '<div class="church-vote-ends">' + escapeHtml(endsStr) + '</div>';
          if (isPastor()) {
            html += '<div class="church-vote-close-wrap"><button type="button" class="church-vote-close-btn" data-vote-id="' + escapeHtml(r.id) + '">Close vote</button></div>';
          }
          html += '</div>';
        }
        list.innerHTML = html;

        list.querySelectorAll('.church-vote-btn-up, .church-vote-btn-down').forEach(function (btn) {
          btn.addEventListener('click', function () {
            var card = btn.closest('.church-vote-card');
            var voteId = card && card.getAttribute('data-vote-id');
            var vote = parseInt(btn.getAttribute('data-vote'), 10);
            if (!voteId) return;
            castVote(voteId, vote, groupId);
          });
        });
        list.querySelectorAll('.church-vote-close-btn').forEach(function (btn) {
          btn.addEventListener('click', function () {
            var voteId = btn.getAttribute('data-vote-id');
            if (!voteId) return;
            closeVote(voteId, groupId);
          });
        });

        if (pastorSection && isPastor()) pastorSection.classList.remove('hidden');
        if (memberSection) memberSection.classList.remove('hidden');
      })
      .catch(function () {
        list.innerHTML = '<p class="church-votes-empty">Votes did not load. Try again in a moment.</p>';
        if (pastorSection && isPastor()) pastorSection.classList.remove('hidden');
        if (memberSection) memberSection.classList.remove('hidden');
      });
  }

  function castVote(voteId, vote, groupId) {
    var client = getSupabaseClient();
    if (!client) return;
    client.rpc('cast_church_vote', { p_vote_id: voteId, p_anon_id: getOrCreateAnonId(), p_vote: vote })
      .then(function (res) {
        var data = res && res.data;
        if (data && data.ok) loadVotes(groupId);
      });
  }

  function closeVote(voteId, groupId) {
    var client = getSupabaseClient();
    if (!client) return;
    client.rpc('close_church_vote', { p_vote_id: voteId, p_pastor_anon_id: getPastorAnonId() })
      .then(function (res) {
        var data = res && res.data;
        if (data && data.ok) {
          showWinnerToast(data.winner || 'Sermon');
          loadVotes(groupId);
        }
      });
  }

  function showWinnerToast(winner) {
    var msg = winner + ' wins! Assigned for next week.';
    if (typeof window.showEliteToast === 'function') {
      window.showEliteToast(msg);
    } else if (typeof window.toast === 'function') {
      window.toast(msg);
    } else {
      alert(msg);
    }
  }

  function initVerseChallenge(groupId) {
    var btn = document.getElementById('church-verse-challenge-btn');
    var doneEl = document.getElementById('church-verse-challenge-done');
    var modal = document.getElementById('church-verse-challenge-modal');
    var closeBtn = document.getElementById('church-verse-challenge-close');
    var blanksEl = document.getElementById('church-verse-challenge-blanks');
    var refEl = document.getElementById('church-verse-challenge-ref');
    var submitBtn = document.getElementById('church-verse-challenge-submit');
    var resultEl = document.getElementById('church-verse-challenge-result');
    if (!btn || !modal || !groupId) return;

    var weekKey = getWeekKey();
    var doneKey = 'groupMemoryWeek';
    try {
      if (localStorage.getItem(doneKey) === weekKey) {
        if (btn) btn.classList.add('hidden');
        if (doneEl) { doneEl.classList.remove('hidden'); doneEl.textContent = 'Challenge complete for this week. New group challenge unlocks next week.'; }
        return;
      }
    } catch (e) {}

    var challengeIndex = Math.abs((weekKey.split('-').join('').replace('W', '')).split('').reduce(function (a, c) { return a + c.charCodeAt(0); }, 0)) % VERSE_CHALLENGES.length;
    var challenge = VERSE_CHALLENGES[challengeIndex];

    function openModal() {
      if (!challenge) return;
      refEl.textContent = challenge.ref;
      var parts = challenge.text.split('___');
      var html = '';
      for (var i = 0; i < parts.length; i++) {
        html += '<span class="church-verse-challenge-part">' + escapeHtml(parts[i]) + '</span>';
        if (i < challenge.answers.length) {
          html += '<input type="text" class="church-verse-challenge-input' + (i > 0 ? '' : ' church-verse-challenge-input-first') + '" data-index="' + i + '" placeholder="___" aria-label="Blank ' + (i + 1) + '">';
        }
      }
      blanksEl.innerHTML = html;
      resultEl.classList.add('hidden');
      resultEl.innerHTML = '';
      modal.classList.remove('hidden');
      if (typeof window.trapModalFocus === 'function') {
        window._churchVerseUntrap = window.trapModalFocus(modal, { focusFirst: true, restoreOnClose: true });
      }
      var firstInput = blanksEl.querySelector('.church-verse-challenge-input');
      if (firstInput) firstInput.focus();
    }

    function closeModal() {
      modal.classList.add('hidden');
      if (window._churchVerseUntrap) { window._churchVerseUntrap(); window._churchVerseUntrap = null; }
    }

    btn.addEventListener('click', openModal);
    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', function (e) { if (e.target === modal) closeModal(); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !modal.classList.contains('hidden')) closeModal(); });

    submitBtn.addEventListener('click', function () {
      var inputs = blanksEl.querySelectorAll('.church-verse-challenge-input');
      var correct = 0;
      var total = challenge.answers.length;
      for (var i = 0; i < inputs.length; i++) {
        var val = (inputs[i].value || '').trim().toLowerCase();
        var ans = (challenge.answers[i] || '').trim().toLowerCase();
        var ok = val === ans;
        if (ok) correct++;
        inputs[i].classList.remove('church-verse-correct', 'church-verse-wrong');
        inputs[i].classList.add(ok ? 'church-verse-correct' : 'church-verse-wrong');
        if (!ok) inputs[i].title = 'Correct: ' + challenge.answers[i];
      }
      resultEl.classList.remove('hidden');
      resultEl.textContent = 'Group got ' + correct + '/' + total + (correct === total ? '! +1 week streak 🔥' : '.');
      resultEl.classList.remove('church-verse-result-perfect', 'church-verse-result-partial');
      resultEl.classList.add(correct === total ? 'church-verse-result-perfect' : 'church-verse-result-partial');

      if (correct === total) {
        try { localStorage.setItem(doneKey, weekKey); } catch (e) {}
        if (btn) btn.classList.add('hidden');
        if (doneEl) { doneEl.classList.remove('hidden'); doneEl.textContent = 'Challenge complete for this week. The next challenge unlocks next week.'; }
        var client = getSupabaseClient();
        if (client) {
          client.rpc('increment_church_group_streak', {
            p_group_id: groupId,
            p_week_key: weekKey,
            p_anon_id: getOrCreateAnonId()
          }).then(function (res) {
            var d = res && res.data;
            if (d && d.incremented && typeof window.showEliteToast === 'function') {
              window.showEliteToast('Group got ' + total + '/' + total + '! +1 week streak 🔥');
            }
          });
        }
        if (typeof window.tdbConfetti === 'function') {
          window.tdbConfetti({ particleCount: 80, spread: 70, origin: { y: 0.6 }, colors: ['#eab308', '#22c55e', '#3b82f6'] });
        }
      }
    });
  }

  var _prayerWallFilter = 'active';

  function loadPrayerWall(groupId, filter) {
    var list = document.getElementById('church-prayer-list');
    if (!list) return;

    filter = filter || _prayerWallFilter;

    var client = getSupabaseClient();
    if (!client || !groupId) {
      list.innerHTML = '<p class="church-prayer-empty">No prayer requests here yet. When your group is ready, add the first request above.</p>';
      return;
    }

    client.rpc('get_church_prayer_requests', {
      p_group_id: groupId,
      p_anon_id: getOrCreateAnonId(),
      p_limit: 20,
      p_filter: filter
    })
      .then(function (res) {
        var rows = res && res.data;
        var emptyMsg = filter === 'active' ? 'No prayer requests here yet. When your group is ready, add the first request above.' : (filter === 'answered' ? 'No answered prayers recorded yet. Mark testimonies here as God answers.' : 'No prayer requests here yet. When your group is ready, add the first request above.');
        if (!rows || rows.length === 0) {
          list.innerHTML = '<p class="church-prayer-empty">' + escapeHtml(emptyMsg) + '</p>';
          return;
        }
        var html = '';
        var pastor = isPastor();
        for (var i = 0; i < rows.length; i++) {
          var r = rows[i];
          var author = (r.anon_id || '').length > 10 ? (r.anon_id || '').slice(0, 10) + '…' : (r.anon_id || 'Someone');
          var dateStr = r.created_at ? new Date(r.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : '';
          var likeCount = Number(r.like_count) || 0;
          var commentCount = Number(r.comment_count) || 0;
          var liked = r.i_liked ? ' active' : '';
          var status = r.status || 'active';
          var answered = status === 'answered';
          html += '<div class="church-prayer-card' + (answered ? ' church-prayer-answered' : '') + '" data-prayer-id="' + escapeHtml(r.id) + '" data-status="' + escapeHtml(status) + '">';
          if (answered) {
            html += '<span class="church-prayer-answered-badge">Answered! 🙌</span>';
          }
          html += '<div class="church-prayer-card-text">' + escapeHtml(r.text || '') + '</div>';
          html += '<div class="church-prayer-card-meta">';
          html += '<span class="church-prayer-card-author">' + escapeHtml(author) + '</span>';
          html += '<span class="church-prayer-card-date">' + escapeHtml(dateStr) + '</span>';
          html += '</div>';
          html += '<div class="church-prayer-card-actions">';
          html += '<button type="button" class="church-prayer-like-btn' + liked + '" data-prayer-id="' + escapeHtml(r.id) + '" aria-label="Like">❤️ <span class="church-prayer-like-count">' + likeCount + '</span></button>';
          if (pastor && !answered) {
            html += '<button type="button" class="church-prayer-resolved-btn">Mark Answered</button>';
          }
          html += '<details class="church-prayer-comments-details">';
          html += '<summary class="church-prayer-comments-summary">Comments (' + commentCount + ')</summary>';
          html += '<div class="church-prayer-comments-inner" data-prayer-id="' + escapeHtml(r.id) + '"></div>';
          html += '<div class="church-prayer-add-comment">';
          html += '<textarea class="church-prayer-comment-input" placeholder="Add a comment..." rows="1" maxlength="500" aria-label="Comment"></textarea>';
          html += '<button type="button" class="church-prayer-comment-btn btn btn-church-save">Reply</button>';
          html += '</div>';
          html += '</details>';
          html += '</div>';
          html += '</div>';
        }
        list.innerHTML = html;

        list.querySelectorAll('.church-prayer-like-btn').forEach(function (btn) {
          btn.addEventListener('click', function () {
            var prayerId = btn.getAttribute('data-prayer-id');
            if (!prayerId) return;
            togglePrayerLike(prayerId, groupId);
          });
        });

        list.querySelectorAll('.church-prayer-resolved-btn').forEach(function (btn) {
          btn.addEventListener('click', function () {
            var card = btn.closest('.church-prayer-card');
            var prayerId = card && card.getAttribute('data-prayer-id');
            if (!prayerId) return;
            markPrayerAnswered(prayerId, groupId);
          });
        });

        list.querySelectorAll('.church-prayer-comments-details').forEach(function (details) {
          details.addEventListener('toggle', function () {
            if (details.open) {
              var inner = details.querySelector('.church-prayer-comments-inner');
              var prayerId = inner && inner.getAttribute('data-prayer-id');
              if (prayerId && inner && !inner.dataset.loaded) {
                loadPrayerComments(prayerId, inner);
                inner.dataset.loaded = '1';
              }
            }
          });
        });

        list.querySelectorAll('.church-prayer-comment-btn').forEach(function (btn) {
          btn.addEventListener('click', function () {
            var details = btn.closest('.church-prayer-comments-details');
            var inner = details && details.querySelector('.church-prayer-comments-inner');
            var textarea = details && details.querySelector('.church-prayer-comment-input');
            var prayerId = inner && inner.getAttribute('data-prayer-id');
            if (!prayerId || !textarea) return;
            var text = (textarea.value || '').trim();
            if (!text) return;
            addPrayerComment(prayerId, text, groupId, inner, textarea);
          });
        });
      })
      .catch(function () {
        list.innerHTML = '<p class="church-prayer-empty">Prayer requests did not load. Try again in a moment.</p>';
      });
  }

  function markPrayerAnswered(prayerId, groupId) {
    var client = getSupabaseClient();
    if (!client) return;
    var pastorId = getChurchPastorAnonId() || getPastorAnonId();
    if (!pastorId) return;

    client.rpc('mark_church_prayer_answered', {
      p_prayer_id: prayerId,
      p_pastor_anon_id: pastorId
    })
      .then(function (res) {
        var data = res && res.data;
        if (data && data.ok) {
          loadPrayerWall(groupId, _prayerWallFilter);
          if (typeof window.showEliteToast === 'function') {
            window.showEliteToast('Prayer marked answered! 🙌');
          }
          var posterEmail = data.poster_email;
          if (posterEmail && posterEmail.trim()) {
            var notifyUrl = (window.TDB_CONFIG && window.TDB_CONFIG.SUPABASE_URL) ? window.TDB_CONFIG.SUPABASE_URL + '/functions/v1/notify-prayer-answered' : '';
            if (notifyUrl) {
              fetch(notifyUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  prayer_id: prayerId,
                  to_email: posterEmail,
                  text_preview: data.text_preview || ''
                })
              }).catch(function () {});
            }
          }
        }
      });
  }

  function initPrayerWallFilters(groupId) {
    var btns = document.querySelectorAll('.church-prayer-filter-btn');
    if (!btns.length) return;

    btns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var filter = btn.getAttribute('data-filter');
        if (!filter) return;
        _prayerWallFilter = filter;
        btns.forEach(function (b) {
          b.classList.toggle('active', b.getAttribute('data-filter') === filter);
          b.setAttribute('aria-selected', b.getAttribute('data-filter') === filter ? 'true' : 'false');
        });
        loadPrayerWall(groupId, filter);
      });
    });
  }

  function togglePrayerLike(prayerId, groupId) {
    var client = getSupabaseClient();
    if (!client) return;
    client.rpc('toggle_church_prayer_like', { p_prayer_id: prayerId, p_anon_id: getOrCreateAnonId() })
      .then(function (res) {
        var data = res && res.data;
        if (data && data.ok) loadPrayerWall(groupId);
      });
  }

  function loadPrayerComments(prayerId, container) {
    var client = getSupabaseClient();
    if (!client || !container) return;
    client.rpc('get_church_prayer_comments', { p_prayer_id: prayerId, p_limit: 20 })
      .then(function (res) {
        var rows = res && res.data;
        if (!rows || rows.length === 0) {
          container.innerHTML = '<p class="church-prayer-comments-empty">No comments posted yet.</p>';
          return;
        }
        var html = '';
        for (var i = 0; i < rows.length; i++) {
          var c = rows[i];
          var author = (c.anon_id || '').length > 10 ? (c.anon_id || '').slice(0, 10) + '…' : (c.anon_id || 'Someone');
          var dateStr = c.created_at ? new Date(c.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : '';
          html += '<div class="church-prayer-comment">';
          html += '<span class="church-prayer-comment-author">' + escapeHtml(author) + '</span>: ';
          html += '<span class="church-prayer-comment-text">' + escapeHtml(c.text || '') + '</span>';
          html += ' <span class="church-prayer-comment-date">' + escapeHtml(dateStr) + '</span>';
          html += '</div>';
        }
        container.innerHTML = html;
      })
      .catch(function () {
        container.innerHTML = '<p class="church-prayer-comments-empty">Comments did not load. Try again in a moment.</p>';
      });
  }

  function addPrayerComment(prayerId, text, groupId, container, textarea) {
    var client = getSupabaseClient();
    if (!client) return;
    client.rpc('insert_church_prayer_comment', {
      p_prayer_id: prayerId,
      p_anon_id: getOrCreateAnonId(),
      p_text: text
    })
      .then(function (res) {
        var data = res && res.data;
        if (data && data.ok) {
          textarea.value = '';
          loadPrayerComments(prayerId, container);
          loadPrayerWall(groupId);
        }
      });
  }

  function initPrayerWall(groupId) {
    var form = document.getElementById('church-prayer-form');
    var input = document.getElementById('church-prayer-input');
    var submitBtn = document.getElementById('church-prayer-submit-btn');
    var resultEl = document.getElementById('church-prayer-result');
    if (!form || !input || !groupId) return;

    initPrayerWallFilters(groupId);

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var text = (input.value || '').trim();
      if (text.length < 3) {
        if (resultEl) { resultEl.textContent = 'Please enter at least 3 characters.'; resultEl.classList.remove('hidden'); resultEl.classList.add('error'); }
        return;
      }
      if (submitBtn) submitBtn.disabled = true;
      if (resultEl) { resultEl.classList.add('hidden'); resultEl.textContent = ''; }

      var client = getSupabaseClient();
      if (!client) {
        if (resultEl) { resultEl.textContent = 'Connection did not open. Try again when you are online.'; resultEl.classList.remove('hidden'); resultEl.classList.add('error'); }
        if (submitBtn) submitBtn.disabled = false;
        return;
      }
      client.rpc('insert_church_prayer_request', {
        p_group_id: groupId,
        p_anon_id: getOrCreateAnonId(),
        p_text: text
      })
        .then(function (res) {
          var data = res && res.data;
          if (data && data.ok) {
            input.value = '';
            if (resultEl) {
              resultEl.textContent = 'Posted!';
              resultEl.classList.remove('hidden', 'error');
              resultEl.classList.add('success');
            }
            loadPrayerWall(groupId);
          } else {
            var reason = (data && data.reason) || 'That update did not post. Try again in a moment.';
            if (reason === 'text_too_short') reason = 'Please enter at least 3 characters.';
            if (resultEl) { resultEl.textContent = reason; resultEl.classList.remove('hidden'); resultEl.classList.add('error'); }
          }
        })
        .catch(function () {
          if (resultEl) { resultEl.textContent = 'That update did not post. Try again in a moment.'; resultEl.classList.remove('hidden'); resultEl.classList.add('error'); }
        })
        .finally(function () {
          if (submitBtn) submitBtn.disabled = false;
        });
    });
  }

  function saveReflection(groupId) {
    var input = document.getElementById('church-reflection-input');
    var saveBtn = document.getElementById('church-reflection-save');
    var savedEl = document.getElementById('church-reflection-saved');
    if (!input || !groupId) return;

    var text = (input.value || '').trim();
    var client = getSupabaseClient();
    if (!client) return;

    if (saveBtn) saveBtn.disabled = true;
    client.rpc('insert_church_reflection', {
      p_group_id: groupId,
      p_anon_id: getOrCreateAnonId(),
      p_text: text,
      p_date: getDailyKey()
    })
      .then(function (res) {
        var data = res && res.data;
        if (data && data.ok) {
          if (savedEl) {
            savedEl.textContent = 'Saved';
            savedEl.classList.remove('hidden');
            clearTimeout(savedEl._t);
            savedEl._t = setTimeout(function () { savedEl.classList.add('hidden'); }, 2000);
          }
          loadReflections(groupId);
        }
      })
      .catch(function () {})
      .finally(function () {
        if (saveBtn) saveBtn.disabled = false;
      });
  }

  function initDailyPage() {
    var code = getChurchCode();
    var groupId = getChurchGroupId();

    if (!code) {
      window.location.href = '/church/index.html';
      return;
    }

    var groupNameEl = document.getElementById('church-group-name');
    if (groupNameEl) {
      try {
        groupNameEl.textContent = localStorage.getItem(CHURCH_GROUP_NAME_KEY) || code;
      } catch (e) {
        groupNameEl.textContent = code;
      }
    }

    renderDailyVerse();
    wireDailyInvite(code);

    if (!groupId) {
      resolveGroupIdFromCode(code).then(function (id) {
        groupId = id || getChurchGroupId();
        if (groupId) loadReflections(groupId);
      });
    } else {
      loadReflections(groupId);
    }

    var saveBtn = document.getElementById('church-reflection-save');
    var input = document.getElementById('church-reflection-input');
    if (saveBtn && input) {
      saveBtn.addEventListener('click', function () {
        var gid = getChurchGroupId();
        if (gid) saveReflection(gid);
      });
      input.addEventListener('blur', function () {
        var gid = getChurchGroupId();
        if (gid && (input.value || '').trim()) saveReflection(gid);
      });
    }
  }

  function wireDailyInvite(code) {
    var made = String(code || getChurchCode() || '').trim();
    if (!made) return;
    var invite = (window.location.origin || 'https://todaysdailybattle.com') + '/church/?group=' + encodeURIComponent(made);
    var codeEl = document.getElementById('church-invite-code');
    var link = document.getElementById('church-invite-link');
    var copy = document.getElementById('church-invite-copy');
    if (codeEl) codeEl.textContent = made;
    if (link) link.value = invite;
    if (!copy) return;
    copy.addEventListener('click', function () {
      try {
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(invite);
        } else if (link) {
          link.select();
          document.execCommand('copy');
        }
        copy.textContent = 'Copied';
      } catch (eCopy) { /* non-fatal */ }
    });
  }

  /* --- Route --- */
  if (document.getElementById('church-join-form')) {
    initJoinPage();
  } else if (document.getElementById('church-daily-verse-card')) {
    initDailyPage();
  }
})();
