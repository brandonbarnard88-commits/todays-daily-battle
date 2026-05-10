(function () {
  'use strict';

  function isAdminPage() {
    var path = (window.location.pathname || '').replace(/\/+$/, '') || '/';
    return /\/admin(\.html)?$/i.test(path);
  }

  if (!isAdminPage()) return;

  var browserCore = window.TDBBrowserCore || null;

  function getConfig() {
    if (browserCore && typeof browserCore.getConfig === 'function') return browserCore.getConfig();
    return window.TDB_CONFIG || {};
  }

  function escapeHtml(value) {
    if (browserCore && typeof browserCore.escapeHtml === 'function') return browserCore.escapeHtml(value);
    return String(value == null ? '' : value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  async function getClient() {
    if (browserCore && typeof browserCore.getSupabaseClient === 'function') {
      return browserCore.getSupabaseClient({ auth: { detectSessionInUrl: true } });
    }
    if (window.__tdbSupabaseClient) return window.__tdbSupabaseClient;
    if (typeof window.ensureSupabaseLoaded === 'function') {
      await window.ensureSupabaseLoaded().catch(function () {});
      if (window.__tdbSupabaseClient) return window.__tdbSupabaseClient;
    }
    var cfg = getConfig();
    if (!window.supabase || !cfg.SUPABASE_URL || !cfg.SUPABASE_ANON_KEY) return null;
    try {
      window.__tdbSupabaseClient = window.supabase.createClient(cfg.SUPABASE_URL, cfg.SUPABASE_ANON_KEY, {
        auth: { detectSessionInUrl: true }
      });
    } catch (_) {}
    return window.__tdbSupabaseClient || null;
  }

  async function getAccessToken() {
    if (browserCore && typeof browserCore.getAccessToken === 'function') {
      return browserCore.getAccessToken();
    }
    var client = await getClient();
    if (!client || !client.auth || typeof client.auth.getSession !== 'function') return '';
    var session = await client.auth.getSession().catch(function () { return null; });
    return session && session.data && session.data.session ? (session.data.session.access_token || '') : '';
  }

  async function getSessionUser() {
    if (browserCore && typeof browserCore.getSessionUser === 'function') {
      return browserCore.getSessionUser();
    }
    var client = await getClient();
    if (!client || !client.auth || typeof client.auth.getSession !== 'function') return null;
    var session = await client.auth.getSession().catch(function () { return null; });
    return session && session.data && session.data.session ? (session.data.session.user || null) : null;
  }

  async function ownerApiRequest(path, options) {
    if (browserCore && typeof browserCore.ownerApiRequest === 'function') {
      return browserCore.ownerApiRequest(path, options);
    }
    var token = await getAccessToken();
    if (!token) throw new Error('Owner session required.');
    var opts = options || {};
    var headers = Object.assign({}, opts.headers || {}, {
      Authorization: 'Bearer ' + token
    });
    if (opts.body && !headers['Content-Type']) headers['Content-Type'] = 'application/json';
    var response = await fetch(path, Object.assign({}, opts, { headers: headers }));
    var data = await response.json().catch(function () { return {}; });
    if (!response.ok) {
      throw new Error(data && data.error ? data.error : 'Owner request failed.');
    }
    return data;
  }

  async function ownerApiDownload(path, filename) {
    if (browserCore && typeof browserCore.ownerApiDownload === 'function') {
      return browserCore.ownerApiDownload(path, filename);
    }
    var token = await getAccessToken();
    if (!token) throw new Error('Owner session required.');
    var response = await fetch(path, {
      headers: { Authorization: 'Bearer ' + token }
    });
    if (!response.ok) {
      var data = await response.json().catch(function () { return {}; });
      throw new Error(data && data.error ? data.error : 'Download failed.');
    }
    var blob = await response.blob();
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  window.tdbOwnerApiRequest = ownerApiRequest;

  function setStatus(message, tone) {
    var el = document.getElementById('owner-console-status');
    if (!el) return;
    el.textContent = message || '';
    el.className = 'section-note' + (tone === 'error' ? ' auth-status-error' : tone === 'success' ? ' auth-status-success' : '');
  }

  function setPills(user, envSummary) {
    var authPill = document.getElementById('owner-console-auth-pill');
    var serverPill = document.getElementById('owner-console-server-pill');
    if (authPill) authPill.textContent = user ? ('Owner: ' + (user.email || 'signed in')) : 'Owner session required';
    if (serverPill) {
      var bits = [];
      if (envSummary && envSummary.supabaseUrl) bits.push('Supabase URL');
      if (envSummary && envSummary.serviceRole) bits.push('Service role');
      if (envSummary && envSummary.stripeSecret) bits.push('Stripe');
      if (envSummary && envSummary.adminGuardSecret) bits.push('Admin guard');
      serverPill.textContent = bits.length ? ('Server ready: ' + bits.join(' · ')) : 'Server actions pending';
    }
  }

  function renderMiniCards(container, items) {
    if (!container) return;
    if (typeof window.renderAdminCardGrid === 'function') {
      window.renderAdminCardGrid(container, items);
      return;
    }
    container.innerHTML = (items || []).map(function (item) {
      return '<div class="owner-card"><strong>' + escapeHtml(item.label) + '</strong><p>' + escapeHtml(item.value) + '</p></div>';
    }).join('');
  }

  var STAT_ICONS = {
    'Newsletter signups': '✉️',
    'Messages': '💬',
    'Message reports': '🚩',
    'Prayer reports': '🙏',
    'Supporter waitlist': '⭐',
    'Owner audit entries': '📋',
    'Prayers': '🕊️',
    'Contact messages': '📩',
    'Daily battles': '⚔️',
    'Plans': '📖'
  };

  function renderStatGrid(container, items) {
    if (!container) return;
    container.innerHTML = '';
    container.className = 'owner-stat-grid';
    (items || []).forEach(function (item) {
      var card = document.createElement('div');
      var isHighlight = item.highlight;
      card.className = 'owner-stat-card' + (isHighlight ? ' owner-stat-card--highlight' : '');
      var icon = STAT_ICONS[item.label] || '📊';
      card.innerHTML =
        '<span class="owner-stat-icon" aria-hidden="true">' + icon + '</span>' +
        '<span class="owner-stat-num">' + escapeHtml(String(item.value == null ? '—' : item.value)) + '</span>' +
        '<span class="owner-stat-label">' + escapeHtml(item.label) + '</span>';
      container.appendChild(card);
    });
  }

  function createActionButton(label, onClick) {
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'btn btn-secondary';
    btn.textContent = label;
    btn.addEventListener('click', onClick);
    return btn;
  }

  function buildListRow(title, body, meta) {
    var row = document.createElement('div');
    row.className = 'list-item';
    var wrap = document.createElement('div');
    var strong = document.createElement('strong');
    strong.textContent = title || 'Item';
    wrap.appendChild(strong);
    if (body) {
      var p = document.createElement('p');
      p.textContent = body;
      wrap.appendChild(p);
    }
    if (meta) {
      var small = document.createElement('p');
      small.className = 'owner-log-meta';
      small.textContent = meta;
      wrap.appendChild(small);
    }
    row.appendChild(wrap);
    return row;
  }

  function selectTab(name) {
    var panes = document.querySelectorAll('[data-owner-pane]');
    var buttons = document.querySelectorAll('[data-owner-tab]');
    panes.forEach(function (pane) {
      pane.hidden = pane.getAttribute('data-owner-pane') !== name;
    });
    buttons.forEach(function (button) {
      button.setAttribute('aria-pressed', button.getAttribute('data-owner-tab') === name ? 'true' : 'false');
    });
  }

  function bindTabs() {
    var buttons = document.querySelectorAll('[data-owner-tab]');
    buttons.forEach(function (button) {
      button.addEventListener('click', function () {
        selectTab(button.getAttribute('data-owner-tab'));
      });
    });
  }

  function renderOverview(data) {
    var cards = document.getElementById('owner-overview-cards');
    if (cards) {
      renderStatGrid(cards, [
        { label: 'Newsletter signups', value: data.counts.newsletterSignups, highlight: true },
        { label: 'Supporter waitlist', value: data.counts.supporterWaitlist },
        { label: 'Messages', value: data.counts.messages },
        { label: 'Message reports', value: data.counts.messageReports },
        { label: 'Prayers', value: data.counts.prayers },
        { label: 'Prayer reports', value: data.counts.prayerReports },
        { label: 'Contact messages', value: data.counts.contactMessages },
        { label: 'Daily battles', value: data.counts.dailyBattles },
        { label: 'Owner audit entries', value: data.counts.ownerAuditEntries }
      ]);
    }
    setPills(data.owner, data.env);
    var authPill = document.getElementById('owner-console-auth-pill');
    if (authPill && data.env) {
      authPill.className = data.env.serviceRole ? 'owner-pill owner-pill--ok' : 'owner-pill owner-pill--warn';
    }
    var toCount = document.getElementById('email-to-count');
    if (toCount) {
      var n = data.counts.newsletterSignups;
      toCount.textContent = n + ' subscriber' + (n === 1 ? '' : 's');
    }
  }

  function renderModeration(data) {
    var messagesWrap = document.getElementById('owner-messages');
    var messageReportsWrap = document.getElementById('owner-message-reports');
    var prayerReportsWrap = document.getElementById('owner-prayer-reports');
    var prayersWrap = document.getElementById('owner-prayers');
    if (messagesWrap) {
      messagesWrap.textContent = '';
      (data.messages || []).forEach(function (item) {
        var row = buildListRow((item.display_name || item.user_id || 'Member') + (item.hidden ? ' · hidden' : ''), item.text || '', item.created_at || '');
        var actions = document.createElement('div');
        actions.className = 'owner-console-actions';
        actions.appendChild(createActionButton(item.hidden ? 'Unhide' : 'Hide', async function () {
          await ownerApiRequest('/api/admin/moderation', {
            method: 'POST',
            body: JSON.stringify({ action: item.hidden ? 'message-unhide' : 'message-hide', messageId: item.id })
          });
          await loadModeration();
        }));
        actions.appendChild(createActionButton('Delete', async function () {
          if (!window.confirm('Delete this message?')) return;
          await ownerApiRequest('/api/admin/moderation', {
            method: 'POST',
            body: JSON.stringify({ action: 'message-delete', messageId: item.id })
          });
          await loadModeration();
        }));
        row.appendChild(actions);
        messagesWrap.appendChild(row);
      });
      if (!messagesWrap.children.length) messagesWrap.innerHTML = '<p class="section-note">No messages to review.</p>';
    }
    if (messageReportsWrap) {
      messageReportsWrap.textContent = '';
      (data.messageReports || []).forEach(function (item) {
        messageReportsWrap.appendChild(buildListRow('Message report', item.text || '', 'Message ID: ' + (item.message_id || 'unknown')));
      });
      if (!messageReportsWrap.children.length) messageReportsWrap.innerHTML = '<p class="section-note">No message reports yet.</p>';
    }
    if (prayerReportsWrap) {
      prayerReportsWrap.textContent = '';
      (data.prayerReports || []).forEach(function (item) {
        var row = buildListRow(item.reason || 'Prayer report', item.prayer_text || '', (item.status || 'open') + ' · ' + (item.created_at || ''));
        var actions = document.createElement('div');
        actions.className = 'owner-console-actions';
        ['open', 'reviewed', 'dismissed'].forEach(function (status) {
          actions.appendChild(createActionButton(status, async function () {
            await ownerApiRequest('/api/admin/moderation', {
              method: 'POST',
              body: JSON.stringify({ action: 'prayer-report-status', reportId: item.id, status: status })
            });
            await loadModeration();
          }));
        });
        row.appendChild(actions);
        prayerReportsWrap.appendChild(row);
      });
      if (!prayerReportsWrap.children.length) prayerReportsWrap.innerHTML = '<p class="section-note">No prayer reports in queue.</p>';
    }
    if (prayersWrap) {
      prayersWrap.textContent = '';
      (data.prayers || []).forEach(function (item) {
        prayersWrap.appendChild(buildListRow(item.family_name || 'Anonymous', item.intent || '', item.created_at || ''));
      });
      if (!prayersWrap.children.length) prayersWrap.innerHTML = '<p class="section-note">No recent prayers available.</p>';
    }
  }

  function renderContent(data) {
    var battlesWrap = document.getElementById('owner-daily-battles');
    var entriesWrap = document.getElementById('owner-content-entries');
    if (battlesWrap) {
      battlesWrap.textContent = '';
      (data.dailyBattles || []).forEach(function (item) {
        battlesWrap.appendChild(buildListRow(item.date || 'Date', item.verse_ref || '', (item.reflection || '').slice(0, 140)));
      });
      if (!battlesWrap.children.length) battlesWrap.innerHTML = '<p class="section-note">No daily battles found.</p>';
    }
    if (entriesWrap) {
      entriesWrap.textContent = '';
      (data.entries || []).forEach(function (item) {
        var row = buildListRow(item.content_key || 'content', item.title || '', item.summary || '');
        var actions = document.createElement('div');
        actions.className = 'owner-console-actions';
        actions.appendChild(createActionButton('Edit', function () {
          document.getElementById('owner-content-key').value = item.content_key || '';
          document.getElementById('owner-content-title').value = item.title || '';
          document.getElementById('owner-content-summary').value = item.summary || '';
          document.getElementById('owner-content-body').value = item.body || '';
          selectTab('content');
        }));
        row.appendChild(actions);
        entriesWrap.appendChild(row);
      });
      if (!entriesWrap.children.length) entriesWrap.innerHTML = '<p class="section-note">No owner content entries saved yet.</p>';
    }
  }

  function renderUsers(data) {
    var wrap = document.getElementById('owner-users');
    if (!wrap) return;
    wrap.textContent = '';
    (data.users || []).forEach(function (user) {
      var row = document.createElement('div');
      row.className = 'list-item';
      var form = document.createElement('div');
      form.className = 'owner-user-row';
      var email = document.createElement('div');
      email.innerHTML = '<strong>' + escapeHtml(user.email || 'Unknown user') + '</strong><p class="owner-log-meta">' + escapeHtml(user.id || '') + '</p>';
      var role = document.createElement('select');
      ['member', 'admin'].forEach(function (value) {
        var option = document.createElement('option');
        option.value = value;
        option.textContent = value;
        option.selected = user.role === value;
        role.appendChild(option);
      });
      var subscription = document.createElement('select');
      ['free', 'supporter', 'battle_pro', 'church_team'].forEach(function (value) {
        var option = document.createElement('option');
        option.value = value;
        option.textContent = value;
        option.selected = user.subscription === value;
        subscription.appendChild(option);
      });
      var saveBtn = createActionButton('Save', async function () {
        await ownerApiRequest('/api/admin/users', {
          method: 'PATCH',
          body: JSON.stringify({
            userId: user.id,
            role: role.value,
            subscription: subscription.value
          })
        });
        setStatus('Updated ' + (user.email || 'user') + '.', 'success');
      });
      form.appendChild(email);
      form.appendChild(role);
      form.appendChild(subscription);
      form.appendChild(saveBtn);
      row.appendChild(form);
      wrap.appendChild(row);
    });
    if (!wrap.children.length) wrap.innerHTML = '<p class="section-note">No matching users found.</p>';
  }

  function renderDatasets(data) {
    var wrap = document.getElementById('owner-datasets');
    if (!wrap) return;
    wrap.textContent = '';
    (data.datasets || []).forEach(function (entry) {
      var row = document.createElement('div');
      row.className = 'list-item';
      var shell = document.createElement('div');
      shell.className = 'owner-data-row';
      var label = document.createElement('div');
      label.innerHTML = '<strong>' + escapeHtml(entry.table) + '</strong><p class="owner-log-meta">' + escapeHtml(String(entry.count)) + ' rows</p>';
      shell.appendChild(label);
      shell.appendChild(createActionButton('View JSON', async function () {
        var result = await ownerApiRequest('/api/admin/data?dataset=' + encodeURIComponent(entry.table));
        setStatus(entry.table + ': loaded ' + (result.rows || []).length + ' rows.', 'success');
      }));
      shell.appendChild(createActionButton('Download CSV', async function () {
        await ownerApiDownload('/api/admin/data?dataset=' + encodeURIComponent(entry.table) + '&format=csv', entry.table + '.csv');
      }));
      row.appendChild(shell);
      wrap.appendChild(row);
    });
  }

  function renderBilling(data) {
    var cards = document.getElementById('owner-billing-cards');
    var subs = document.getElementById('owner-billing-subscriptions');
    if (cards) {
      var planEntries = Object.keys(data.subscriptionPlans || {}).map(function (key) {
        return { label: key, value: data.subscriptionPlans[key] };
      });
      renderMiniCards(cards, [
        { label: 'Stripe configured', value: data.stripeConfigured ? 'Yes' : 'No' }
      ].concat(planEntries));
    }
    if (subs) {
      subs.textContent = '';
      (data.subscriptions || []).forEach(function (item) {
        subs.appendChild(buildListRow(item.email || item.user_id || 'Subscription', item.plan || 'plan', item.updated_at || ''));
      });
      if (!subs.children.length) subs.innerHTML = '<p class="section-note">No subscription rows found.</p>';
    }
  }

  function renderOps(data) {
    var cards = document.getElementById('owner-ops-cards');
    var checks = document.getElementById('owner-ops-checks');
    if (cards) {
      renderMiniCards(cards, [
        { label: 'Supabase URL', value: data.env && data.env.supabaseUrl ? 'Yes' : 'No' },
        { label: 'Service role', value: data.env && data.env.serviceRole ? 'Yes' : 'No' },
        { label: 'Stripe secret', value: data.env && data.env.stripeSecret ? 'Yes' : 'No' },
        { label: 'Admin guard secret', value: data.env && data.env.adminGuardSecret ? 'Yes' : 'No' }
      ]);
    }
    if (checks) {
      checks.textContent = '';
      (data.checks || []).forEach(function (item) {
        checks.appendChild(buildListRow(item.url, item.ok ? 'Healthy' : 'Needs attention', 'HTTP ' + item.status + (item.error ? ' · ' + item.error : '')));
      });
    }
  }

  function renderAudit(data) {
    var wrap = document.getElementById('owner-audit-log');
    if (!wrap) return;
    wrap.textContent = '';
    (data.entries || []).forEach(function (item) {
      wrap.appendChild(buildListRow(
        (item.action || 'action') + ' → ' + (item.target_type || 'target'),
        item.target_id || '',
        (item.created_at || '') + (item.actor_user_id ? ' · ' + item.actor_user_id : '')
      ));
    });
    if (!wrap.children.length) wrap.innerHTML = '<p class="section-note">No owner audit entries yet.</p>';
  }

  async function loadOverview() {
    renderOverview(await ownerApiRequest('/api/admin/overview'));
  }

  async function loadModeration() {
    renderModeration(await ownerApiRequest('/api/admin/moderation'));
  }

  async function loadContent() {
    renderContent(await ownerApiRequest('/api/admin/content'));
  }

  async function loadUsers(query) {
    var suffix = query ? ('?q=' + encodeURIComponent(query)) : '';
    renderUsers(await ownerApiRequest('/api/admin/users' + suffix));
  }

  async function loadDatasets() {
    renderDatasets(await ownerApiRequest('/api/admin/data'));
  }

  async function loadBilling() {
    renderBilling(await ownerApiRequest('/api/admin/billing'));
  }

  async function loadOps() {
    renderOps(await ownerApiRequest('/api/admin/ops'));
  }

  async function loadAudit() {
    renderAudit(await ownerApiRequest('/api/admin/audit'));
  }

  function bindForms() {
    var contentForm = document.getElementById('owner-content-form');
    if (contentForm) {
      contentForm.addEventListener('submit', async function (event) {
        event.preventDefault();
        await ownerApiRequest('/api/admin/content', {
          method: 'POST',
          body: JSON.stringify({
            action: 'save-owner-content',
            content_key: document.getElementById('owner-content-key').value,
            title: document.getElementById('owner-content-title').value,
            summary: document.getElementById('owner-content-summary').value,
            body: document.getElementById('owner-content-body').value
          })
        });
        document.getElementById('owner-content-status').textContent = 'Owner content saved.';
        await loadContent();
      });
    }
    var userSearch = document.getElementById('owner-user-search-form');
    if (userSearch) {
      userSearch.addEventListener('submit', async function (event) {
        event.preventDefault();
        var query = document.getElementById('owner-user-query').value.trim();
        await loadUsers(query);
      });
    }
    var refresh = document.getElementById('admin-refresh-dashboard');
    if (refresh) {
      refresh.addEventListener('click', function () {
        loadAll().catch(function (error) {
          setStatus(error && error.message ? error.message : 'Refresh failed.', 'error');
        });
      });
    }

    // ── Email composer ────────────────────────────────────────────
    var previewBtn = document.getElementById('email-preview-btn');
    var copyBtn = document.getElementById('email-copy-btn');
    var exportListBtn = document.getElementById('email-export-list-btn');
    var composerStatus = document.getElementById('email-composer-status');
    var previewCard = document.getElementById('email-preview-card');
    var previewHeader = document.getElementById('email-preview-header');
    var previewBodyEl = document.getElementById('email-preview-body');

    function getComposerValues() {
      return {
        subject: (document.getElementById('email-subject') || {}).value || '',
        body: (document.getElementById('email-body') || {}).value || ''
      };
    }

    function setComposerStatus(msg, ok) {
      if (!composerStatus) return;
      composerStatus.className = ok ? 'section-note owner-composer-toast' : 'section-note';
      composerStatus.textContent = msg;
    }

    if (previewBtn) {
      previewBtn.addEventListener('click', function () {
        var v = getComposerValues();
        var toEl = document.getElementById('email-to-count');
        var toText = toEl ? toEl.textContent : 'your subscribers';
        if (previewCard) previewCard.hidden = false;
        if (previewHeader) {
          previewHeader.textContent = '';
          ['To: ' + toText, 'Subject: ' + (v.subject || '(no subject)'), 'From: Brandon — Today\'s Daily Battle'].forEach(function (line) {
            var p = document.createElement('p');
            p.style.margin = '0';
            p.textContent = line;
            previewHeader.appendChild(p);
          });
        }
        if (previewBodyEl) previewBodyEl.textContent = v.body;
        previewCard.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    }

    if (copyBtn) {
      copyBtn.addEventListener('click', function () {
        var v = getComposerValues();
        var full = 'Subject: ' + v.subject + '\n\n' + v.body;
        navigator.clipboard.writeText(full).then(function () {
          setComposerStatus('Copied to clipboard — paste into Gmail or your email tool.', true);
        }).catch(function () {
          setComposerStatus('Copy failed. Select the text above and copy manually.', false);
        });
      });
    }

    if (exportListBtn) {
      exportListBtn.addEventListener('click', async function () {
        try {
          setComposerStatus('Downloading subscriber list…', false);
          await ownerApiDownload('/api/admin/data?dataset=newsletter_signups&format=csv', 'tdb-subscribers-' + new Date().toISOString().slice(0, 10) + '.csv');
          setComposerStatus('Downloaded. Import into Gmail, Mailchimp, or your tool.', true);
        } catch (err) {
          setComposerStatus(err && err.message ? err.message : 'Download failed.', false);
        }
      });
    }

    // ── Newsletter export (bottom of page) ── wire to API not localStorage
    var newsletterExport = document.getElementById('newsletter-export');
    if (newsletterExport) {
      newsletterExport.addEventListener('click', async function () {
        try {
          await ownerApiDownload('/api/admin/data?dataset=newsletter_signups&format=csv', 'tdb-newsletter-' + new Date().toISOString().slice(0, 10) + '.csv');
        } catch (err) {
          setStatus(err && err.message ? err.message : 'Export failed.', 'error');
        }
      });
    }
  }

  async function loadAll() {
    setStatus('Refreshing owner console…');
    await loadOverview();
    await loadModeration();
    await loadContent();
    await loadUsers('');
    await loadDatasets();
    await loadBilling();
    await loadOps();
    await loadAudit();
    setStatus('Owner console ready.', 'success');
  }

  async function init() {
    bindTabs();
    bindForms();
    selectTab('overview');
    var user = await getSessionUser();
    if (!user || String(user.app_metadata && user.app_metadata.role || '').toLowerCase() !== 'admin') {
      setStatus('Sign in with the owner account to use the console.', 'error');
      return;
    }
    try {
      await loadAll();
    } catch (error) {
      setStatus(error && error.message ? error.message : 'Owner console failed to load.', 'error');
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      init();
    });
  } else {
    init();
  }
})();
