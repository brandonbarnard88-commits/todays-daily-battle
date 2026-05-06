// Today's Daily Battle Church Verse Widget (5-line embed, KJV-only, privacy-first)
// Drop this on any church site/Facebook. Works with team code. Offline-first fallback.
// Usage:
// <script src="https://todaysdailybattle.com/daily-verse-widget.js?team=YOUR6DIGITCODE"></script>
// <div id="tdb-church-verse-widget" style="max-width:420px;margin:2rem auto;padding:1.5rem;border:1px solid #e3bc67;border-radius:16px;background:#f8f1e3;color:#1a2526;font-family:system-ui,sans-serif"></div>

(function () {
  'use strict';
  const widgetId = 'tdb-church-verse-widget';
  const container = document.getElementById(widgetId);
  if (!container) return;

  const params = new URLSearchParams(window.location.search);
  let teamCode = params.get('team') || 'default';
  if (teamCode.length !== 6 || !/^\d{6}$/.test(teamCode)) teamCode = 'default';

  // Simple fetch (use RPC if Supabase available, else fallback verse)
  const verseRef = 'John 3:16'; // MVP default; in full would call get_team_verse RPC
  const text = 'For God so loved the world, that he gave his only begotten Son, that whosoever believeth in him should not perish, but have everlasting life.';

  container.innerHTML = `
    <div style="font-size:0.9rem;color:#666;margin-bottom:0.5rem">Church Verse of the Day • ${teamCode}</div>
    <p style="font-size:1.1rem;line-height:1.5;font-weight:500;margin:0 0 1rem 0;color:#111">${verseRef}</p>
    <p style="font-size:1rem;line-height:1.6;margin:0 0 1rem 0;color:#222">${text}</p>
    <a href="https://todaysdailybattle.com/team-toolkit.html?team=${teamCode}" style="font-size:0.85rem;color:#e3bc67;text-decoration:none">Join this team →</a>
    <div style="margin-top:1rem;font-size:0.75rem;color:#888">KJV • Today's Daily Battle • Works offline</div>
  `;

  // In production, replace with real RPC call to get_team_verse and render with verse-breakdown-standard.js style
  console.log('%cTeam Verse Widget loaded for code: ' + teamCode, 'color:#e3bc67;font-size:0.8rem');
})();
