/**
 * Profile page: Kids, Bible Study Groups, Church.
 * Requires auth. Redirects to login if not signed in.
 */
(function () {
  'use strict';

  function getClient() {
    if (window.__tdbSupabaseClient) return window.__tdbSupabaseClient;
    var cfg = window.TDB_CONFIG;
    var url = (cfg && cfg.SUPABASE_URL) || '';
    var key = (cfg && cfg.SUPABASE_ANON_KEY) || '';
    if (!url || !key || !window.supabase || typeof window.supabase.createClient !== 'function') return null;
    try {
      window.__tdbSupabaseClient = window.supabase.createClient(url, key, { auth: { detectSessionInUrl: true } });
      return window.__tdbSupabaseClient;
    } catch (e) {
      return null;
    }
  }

  function setStatus(elId, msg, isErr) {
    var el = document.getElementById(elId);
    if (!el) return;
    el.textContent = msg || '';
    el.className = 'profile-status' + (isErr ? ' err' : msg ? ' ok' : '');
  }

  async function generateInviteCode() {
    var client = getClient();
    if (!client) return null;
    try {
      var res = await client.rpc('profile_generate_invite_code');
      return (res && res.data) ? res.data : null;
    } catch (e) {
      return null;
    }
  }

  async function loadProfile() {
    var client = getClient();
    if (!client) {
      window.location.href = '/login.html?next=' + encodeURIComponent('/profile.html');
      return;
    }
    var sess = await client.auth.getSession();
    var session = sess && sess.data ? sess.data.session : null;
    if (!session || !session.user) {
      window.location.href = '/login.html?next=' + encodeURIComponent('/profile.html');
      return;
    }

    var emailEl = document.getElementById('profile-email');
    if (emailEl) emailEl.textContent = session.user.email || 'Signed in';

    var uid = session.user.id;

    // Load kids
    var kidsList = document.getElementById('kids-list');
    if (kidsList) {
      try {
        var kidsRes = await client.from('profile_kids').select('*').eq('parent_id', uid).order('created_at', { ascending: true });
        var kids = (kidsRes && kidsRes.data) || [];
        kidsList.innerHTML = '';
        kids.forEach(function (k) {
          var li = document.createElement('li');
          li.innerHTML = '<span>' + escapeHtml(k.name) + (k.age_range ? ' <span style="color:var(--muted);font-size:0.85em;">(' + escapeHtml(k.age_range) + ')</span>' : '') + '</span>';
          var delBtn = document.createElement('button');
          delBtn.type = 'button';
          delBtn.className = 'profile-btn profile-btn-danger';
          delBtn.textContent = 'Remove';
          delBtn.setAttribute('aria-label', 'Remove ' + escapeHtml(k.name));
          delBtn.addEventListener('click', function () { deleteKid(k.id); });
          li.appendChild(delBtn);
          kidsList.appendChild(li);
        });
      } catch (err) {
        setStatus('kids-status', 'Could not load kids.', true);
      }
    }

    // Load groups (user is creator or member)
    var groupsList = document.getElementById('groups-list');
    if (groupsList) {
      try {
        var membersRes = await client.from('profile_group_members').select('group_id').eq('user_id', uid);
        var memberIds = (membersRes && membersRes.data) ? membersRes.data.map(function (m) { return m.group_id; }) : [];
        var orFilter = 'created_by.eq.' + uid + (memberIds.length ? ',id.in.(' + memberIds.join(',') + ')' : '');
        var groupsRes = await client.from('profile_bible_study_groups').select('*').or(orFilter);
        var groups = (groupsRes && groupsRes.data) || [];
        groupsList.innerHTML = '';
        groups.forEach(function (g) {
          var li = document.createElement('li');
          var isCreator = g.created_by === uid;
          li.innerHTML = '<span><strong>' + escapeHtml(g.name) + '</strong>' + (isCreator ? ' <span style="color:var(--gold);font-size:0.8em;">(creator)</span>' : '') + '<br><code class="profile-invite-code" style="font-size:0.75rem;margin-top:0.25rem;">' + escapeHtml(g.invite_code) + '</code></span>';
          var copyBtn = document.createElement('button');
          copyBtn.type = 'button';
          copyBtn.className = 'profile-btn profile-copy-btn';
          copyBtn.textContent = '\uD83D\uDCCB Copy Code';
          copyBtn.setAttribute('aria-label', 'Copy invite code');
          copyBtn.setAttribute('title', 'Copy invite code to clipboard');
          copyBtn.addEventListener('click', function () {
            var code = g.invite_code || '';
            var done = function () {
              copyBtn.classList.add('copied');
              copyBtn.textContent = '\u2713 Copied!';
              setTimeout(function () {
                copyBtn.classList.remove('copied');
                copyBtn.textContent = '\uD83D\uDCCB Copy Code';
              }, 2000);
            };
            if (navigator.clipboard && navigator.clipboard.writeText) {
              navigator.clipboard.writeText(code).then(done).catch(function () {
                try {
                  var ta = document.createElement('textarea');
                  ta.value = code;
                  ta.style.position = 'fixed';
                  ta.style.opacity = '0';
                  document.body.appendChild(ta);
                  ta.select();
                  document.execCommand('copy');
                  document.body.removeChild(ta);
                  done();
                } catch (e) {
                  copyBtn.textContent = 'Copy failed';
                  setTimeout(function () {
                    copyBtn.textContent = '\uD83D\uDCCB Copy Code';
                  }, 2000);
                }
              });
            } else {
              try {
                var ta = document.createElement('textarea');
                ta.value = code;
                ta.style.position = 'fixed';
                ta.style.opacity = '0';
                document.body.appendChild(ta);
                ta.select();
                document.execCommand('copy');
                document.body.removeChild(ta);
                done();
              } catch (e) {
                copyBtn.textContent = 'Copy failed';
                setTimeout(function () {
                  copyBtn.textContent = '\uD83D\uDCCB Copy Code';
                }, 2000);
              }
            }
          });
          var leaveBtn = document.createElement('button');
          leaveBtn.type = 'button';
          leaveBtn.className = 'profile-btn profile-btn-danger';
          leaveBtn.textContent = isCreator ? 'Delete' : 'Leave';
          leaveBtn.setAttribute('aria-label', (isCreator ? 'Delete' : 'Leave') + ' group ' + escapeHtml(g.name));
          leaveBtn.addEventListener('click', function () { leaveOrDeleteGroup(g.id, g.created_by === uid); });
          li.appendChild(copyBtn);
          li.appendChild(leaveBtn);
          groupsList.appendChild(li);
        });
      } catch (err) {
        setStatus('groups-status', 'Could not load groups.', true);
      }
    }

    // Load church
    var churchInfo = document.getElementById('church-info');
    var churchFormRow = document.getElementById('church-form-row');
    if (churchInfo) {
      try {
        var churchRes = await client.from('profile_user_churches').select('*').eq('user_id', uid).maybeSingle();
        var church = (churchRes && churchRes.data) || null;
        if (church && (church.church_name || church.church_location)) {
          churchInfo.innerHTML = '<p><strong>' + escapeHtml(church.church_name || 'Church') + '</strong>' + (church.church_location ? ' — ' + escapeHtml(church.church_location) : '') + (church.verified ? ' <span style="color:#4ade80;font-size:0.85em;">✓ Verified</span>' : '') + '</p>';
          if (churchFormRow) churchFormRow.style.display = 'none';
          var changeWrap = document.getElementById('church-change-wrap');
          if (changeWrap) changeWrap.style.display = 'block';
          var nameEl = document.getElementById('church-name');
          var locEl = document.getElementById('church-location');
          var pastorEl = document.getElementById('church-pastor');
          if (nameEl) nameEl.value = church.church_name || '';
          if (locEl) locEl.value = church.church_location || '';
          if (pastorEl) pastorEl.value = church.pastor_email || '';
        } else {
          churchInfo.innerHTML = '';
          if (churchFormRow) churchFormRow.style.display = 'flex';
          var changeWrap = document.getElementById('church-change-wrap');
          if (changeWrap) changeWrap.style.display = 'none';
        }
      } catch (err) {
        churchInfo.innerHTML = '';
        if (churchFormRow) churchFormRow.style.display = 'flex';
        var changeWrap = document.getElementById('church-change-wrap');
        if (changeWrap) changeWrap.style.display = 'none';
      }
    }
  }

  function escapeHtml(s) {
    if (!s) return '';
    var div = document.createElement('div');
    div.textContent = s;
    return div.innerHTML;
  }

  async function addKid() {
    var client = getClient();
    if (!client) return;
    var nameEl = document.getElementById('kid-name');
    var ageEl = document.getElementById('kid-age');
    var name = (nameEl && nameEl.value || '').trim();
    if (!name) {
      setStatus('kids-status', 'Enter a name.', true);
      return;
    }
    setStatus('kids-status', '');
    var sess = await client.auth.getSession();
    var uid = sess && sess.data && sess.data.session ? sess.data.session.user.id : null;
    if (!uid) return;
    try {
      var res = await client.from('profile_kids').insert({ parent_id: uid, name: name, age_range: (ageEl && ageEl.value) || null }).select().single();
      if (res && res.data) {
        if (nameEl) nameEl.value = '';
        if (ageEl) ageEl.value = '';
        setStatus('kids-status', 'Added.');
        loadProfile();
      } else {
        setStatus('kids-status', 'Could not add. Try again.', true);
      }
    } catch (err) {
      setStatus('kids-status', 'Could not add. Tables may not exist yet—run supabase-profile-family-groups.sql.', true);
    }
  }

  async function deleteKid(kidId) {
    var client = getClient();
    if (!client || !kidId) return;
    if (!confirm('Remove this child from your profile?')) return;
    try {
      await client.from('profile_kids').delete().eq('id', kidId);
      setStatus('kids-status', 'Removed.');
      loadProfile();
    } catch (err) {
      setStatus('kids-status', 'Could not remove.', true);
    }
  }

  async function createGroup() {
    var client = getClient();
    if (!client) return;
    var nameEl = document.getElementById('group-name');
    var name = (nameEl && nameEl.value || '').trim();
    if (!name) {
      setStatus('groups-status', 'Enter a group name.', true);
      return;
    }
    setStatus('groups-status', '');
    var sess = await client.auth.getSession();
    var uid = sess && sess.data && sess.data.session ? sess.data.session.user.id : null;
    if (!uid) return;
    var code = await generateInviteCode();
    if (!code) {
      setStatus('groups-status', 'Could not generate invite code. Run supabase-profile-family-groups.sql.', true);
      return;
    }
    try {
      var res = await client.from('profile_bible_study_groups').insert({ name: name, invite_code: code, created_by: uid }).select().single();
      if (res && res.data) {
        await client.from('profile_group_members').insert({ group_id: res.data.id, user_id: uid, role: 'admin' });
        if (nameEl) nameEl.value = '';
        setStatus('groups-status', 'Group created. Invite code: ' + code);
        loadProfile();
      } else {
        setStatus('groups-status', 'Could not create. Try again.', true);
      }
    } catch (err) {
      setStatus('groups-status', 'Could not create. Tables may not exist—run supabase-profile-family-groups.sql.', true);
    }
  }

  async function joinGroup() {
    var client = getClient();
    if (!client) return;
    var codeEl = document.getElementById('join-code');
    var code = (codeEl && codeEl.value || '').trim();
    if (!code) {
      setStatus('groups-status', 'Enter an invite code.', true);
      return;
    }
    setStatus('groups-status', '');
    try {
      var res = await client.rpc('profile_join_group_by_code', { p_invite_code: code });
      var data = res && res.data ? res.data : res;
      if (data && data.ok) {
        if (codeEl) codeEl.value = '';
        setStatus('groups-status', 'Joined.');
        loadProfile();
      } else {
        setStatus('groups-status', (data && data.reason === 'not_found') ? 'Code not found.' : 'Could not join.', true);
      }
    } catch (err) {
      setStatus('groups-status', 'Could not join. Try again.', true);
    }
  }

  async function leaveOrDeleteGroup(groupId, isCreator) {
    var client = getClient();
    if (!client || !groupId) return;
    if (!confirm(isCreator ? 'Delete this group? Members will lose access.' : 'Leave this group?')) return;
    try {
      if (isCreator) {
        await client.from('profile_bible_study_groups').delete().eq('id', groupId);
      } else {
        var sess = await client.auth.getSession();
        var uid = sess && sess.data && sess.data.session ? sess.data.session.user.id : null;
        if (uid) await client.from('profile_group_members').delete().eq('group_id', groupId).eq('user_id', uid);
      }
      setStatus('groups-status', isCreator ? 'Group deleted.' : 'Left group.');
      loadProfile();
    } catch (err) {
      setStatus('groups-status', 'Could not update.', true);
    }
  }

  async function saveChurch() {
    var client = getClient();
    if (!client) return;
    var sess = await client.auth.getSession();
    var uid = sess && sess.data && sess.data.session ? sess.data.session.user.id : null;
    if (!uid) return;
    var nameEl = document.getElementById('church-name');
    var locEl = document.getElementById('church-location');
    var pastorEl = document.getElementById('church-pastor');
    var name = (nameEl && nameEl.value || '').trim();
    var loc = (locEl && locEl.value || '').trim();
    var pastor = (pastorEl && pastorEl.value || '').trim();
    if (!name && !loc) {
      setStatus('church-status', 'Enter church name or location.', true);
      return;
    }
    setStatus('church-status', '');
    try {
      await client.from('profile_user_churches').upsert({
        user_id: uid,
        church_name: name || null,
        church_location: loc || null,
        pastor_email: pastor || null
      }, { onConflict: 'user_id' });
      setStatus('church-status', 'Saved.');
      loadProfile();
    } catch (err) {
      setStatus('church-status', 'Could not save. Tables may not exist—run supabase-profile-family-groups.sql.', true);
    }
  }

  async function deleteAccount() {
    var client = getClient();
    if (!client) return;
    var confirmText = window.prompt('Type DELETE to permanently remove your account and all data. This cannot be undone.');
    if (!confirmText || confirmText.trim().toUpperCase() !== 'DELETE') {
      setStatus('delete-account-status', 'Cancelled.');
      setTimeout(function () { setStatus('delete-account-status', ''); }, 2000);
      return;
    }
    var btn = document.getElementById('delete-account-btn');
    if (btn) btn.disabled = true;
    setStatus('delete-account-status', 'Removing…');
    try {
      var sess = await client.auth.getSession();
      var uid = sess && sess.data && sess.data.session ? sess.data.session.user.id : null;
      if (!uid) {
        setStatus('delete-account-status', 'Not signed in.', true);
        if (btn) btn.disabled = false;
        return;
      }
      await client.from('profile_group_members').delete().eq('user_id', uid);
      var groupsRes = await client.from('profile_bible_study_groups').select('id').eq('created_by', uid);
      var groupIds = (groupsRes && groupsRes.data) ? groupsRes.data.map(function (g) { return g.id; }) : [];
      for (var i = 0; i < groupIds.length; i++) {
        await client.from('profile_group_members').delete().eq('group_id', groupIds[i]);
        await client.from('profile_bible_study_groups').delete().eq('id', groupIds[i]);
      }
      await client.from('profile_kids').delete().eq('parent_id', uid);
      await client.from('profile_user_churches').delete().eq('user_id', uid);
      await client.from('user_sync_data').delete().eq('user_id', uid);
      try {
        await client.from('prayers').delete().eq('user_id', uid);
      } catch (e) { /* prayers may not have user_id */ }
      await client.auth.signOut();
      setStatus('delete-account-status', 'Account removed. Redirecting…');
      setTimeout(function () { window.location.href = '/'; }, 1500);
    } catch (err) {
      setStatus('delete-account-status', 'Something went wrong — try again.', true);
      if (btn) btn.disabled = false;
    }
  }

  async function exportData() {
    var client = getClient();
    if (!client) return;
    var btn = document.getElementById('export-data-btn');
    if (btn) btn.disabled = true;
    setStatus('export-status', 'Exporting…');
    try {
      var sess = await client.auth.getSession();
      var uid = sess && sess.data && sess.data.session ? sess.data.session.user.id : null;
      if (!uid) {
        setStatus('export-status', 'Sign in to export.', true);
        if (btn) btn.disabled = false;
        return;
      }
      var out = { exportedAt: new Date().toISOString(), kids: [], groups: [], church: null, sync: {}, prayers: [] };
      try {
        var kidsRes = await client.from('profile_kids').select('*').eq('parent_id', uid).order('created_at', { ascending: true });
        out.kids = (kidsRes && kidsRes.data) || [];
      } catch (e) { /* skip */ }
      try {
        var membersRes = await client.from('profile_group_members').select('group_id').eq('user_id', uid);
        var memberIds = (membersRes && membersRes.data) ? membersRes.data.map(function (m) { return m.group_id; }) : [];
        var orFilter = 'created_by.eq.' + uid + (memberIds.length ? ',id.in.(' + memberIds.join(',') + ')' : '');
        var groupsRes = await client.from('profile_bible_study_groups').select('*').or(orFilter);
        out.groups = (groupsRes && groupsRes.data) || [];
      } catch (e) { /* skip */ }
      try {
        var churchRes = await client.from('profile_user_churches').select('*').eq('user_id', uid).maybeSingle();
        out.church = (churchRes && churchRes.data) || null;
      } catch (e) { /* skip */ }
      try {
        var syncRes = await client.from('user_sync_data').select('sync_key, sync_value, updated_at').eq('user_id', uid);
        var rows = (syncRes && syncRes.data) || [];
        rows.forEach(function (r) { out.sync[r.sync_key] = r.sync_value; });
      } catch (e) { /* skip */ }
      try {
        var prayersRes = await client.from('prayers').select('intent, created_at, family_name').eq('user_id', uid).order('created_at', { ascending: false }).limit(500);
        out.prayers = (prayersRes && prayersRes.data) || [];
      } catch (e) { /* skip */ }
      var json = JSON.stringify(out, null, 2);
      var blob = new Blob([json], { type: 'application/json' });
      var url = URL.createObjectURL(blob);
      var a = document.createElement('a');
      a.href = url;
      a.download = 'todaysdailybattle-export-' + new Date().toISOString().split('T')[0] + '.json';
      a.click();
      URL.revokeObjectURL(url);
      setStatus('export-status', 'Downloaded!');
      setTimeout(function () { setStatus('export-status', ''); }, 3000);
    } catch (err) {
      setStatus('export-status', 'Something went wrong — try again.', true);
    }
    if (btn) btn.disabled = false;
  }

  function wirePerfToggle() {
    var cb = document.getElementById('perf-mode-toggle');
    if (!cb) return;
    try {
      cb.checked = localStorage.getItem('tdb_perf_mode') === '1';
    } catch (e) {
      cb.checked = false;
    }
    cb.addEventListener('change', function () {
      try {
        if (cb.checked) localStorage.setItem('tdb_perf_mode', '1');
        else localStorage.removeItem('tdb_perf_mode');
      } catch (e) {
        setStatus('perf-mode-status', 'Could not save preference.', true);
        return;
      }
      setStatus('perf-mode-status', 'Saved — reloading…', false);
      window.setTimeout(function () { window.location.reload(); }, 200);
    });
  }

  function wire() {
    wirePerfToggle();
    var addKidBtn = document.getElementById('add-kid-btn');
    if (addKidBtn) addKidBtn.addEventListener('click', addKid);
    var createGroupBtn = document.getElementById('create-group-btn');
    if (createGroupBtn) createGroupBtn.addEventListener('click', createGroup);
    var joinGroupBtn = document.getElementById('join-group-btn');
    if (joinGroupBtn) joinGroupBtn.addEventListener('click', joinGroup);
    var saveChurchBtn = document.getElementById('save-church-btn');
    if (saveChurchBtn) saveChurchBtn.addEventListener('click', saveChurch);
    var exportBtn = document.getElementById('export-data-btn');
    if (exportBtn) exportBtn.addEventListener('click', exportData);
    var deleteAccountBtn = document.getElementById('delete-account-btn');
    if (deleteAccountBtn) deleteAccountBtn.addEventListener('click', deleteAccount);
    var changeBtn = document.getElementById('church-change-btn');
    if (changeBtn) {
      changeBtn.addEventListener('click', function () {
        var churchFormRow = document.getElementById('church-form-row');
        var changeWrap = document.getElementById('church-change-wrap');
        if (churchFormRow) churchFormRow.style.display = 'flex';
        if (changeWrap) changeWrap.style.display = 'none';
      });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      wire();
      loadProfile();
    });
  } else {
    wire();
    loadProfile();
  }
})();
