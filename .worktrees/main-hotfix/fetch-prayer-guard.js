/** Prayer-request fetch guard: avoids duplicate/404 storm when prayers endpoint is unavailable. Load before Supabase. */
(function(){
  window.__tdb_real_fetch = window.__tdb_real_fetch || window.fetch;
  var realFetch = window.__tdb_real_fetch;
  if (!realFetch) return;
  var prayerRequestInFlight = false;
  function isPrayerUrl(u){
    if (!u || typeof u !== 'string') return false;
    return u.indexOf('prayers') !== -1 ||
      u.indexOf('get_prayer_presence_count') !== -1 ||
      u.indexOf('get_total_prayer_count') !== -1 ||
      u.indexOf('get_prayers_today_count') !== -1 ||
      u.indexOf('get_last_prayer_created_at') !== -1 ||
      u.indexOf('get_recent_prayers') !== -1 ||
      u.indexOf('increment_prayer_amen') !== -1 ||
      u.indexOf('get_prayer_echo_match_count') !== -1 ||
      u.indexOf('get_prayer_intent_suggestions') !== -1;
  }
  function isTotalCountRpc(u) { return u && u.indexOf('get_total_prayer_count') !== -1; }
  function isPresenceCountRpc(u) { return u && u.indexOf('get_prayer_presence_count') !== -1; }
  window.fetch = function(input, init){
    var url = typeof input === 'string' ? input : (input && input.url) || '';
    if (!isPrayerUrl(url)) return realFetch.apply(this, arguments);
    if (window.__tdb_prayers_404 === true) {
      /* Return 404 so UI shows "—" instead of misleading "0" when API unavailable */
      if (isTotalCountRpc(url)) return Promise.resolve(new Response(JSON.stringify({ error: 'prayers_api_unavailable' }), { status: 404, headers: { 'Content-Type': 'application/json' } }));
      if (isPresenceCountRpc(url)) return Promise.resolve(new Response(JSON.stringify({ error: 'prayers_api_unavailable' }), { status: 404, headers: { 'Content-Type': 'application/json' } }));
      return Promise.resolve(new Response(JSON.stringify([]), { status: 200, headers: { 'Content-Type': 'application/json' } }));
    }
    if (isTotalCountRpc(url)) {
      return realFetch.apply(this, arguments).then(function(res){
        if (res && res.status === 404) {
          window.__tdb_prayers_404 = true;
          return new Response(JSON.stringify({ error: 'prayers_api_unavailable' }), { status: 404, headers: { 'Content-Type': 'application/json' } });
        }
        return res;
      }, function(err){
        window.__tdb_prayers_404 = true;
        return new Response(JSON.stringify({ error: 'prayers_api_unavailable' }), { status: 404, headers: { 'Content-Type': 'application/json' } });
      });
    }
    if (isPresenceCountRpc(url)) {
      return realFetch.apply(this, arguments).then(function(res){
        if (res && res.status === 404) {
          window.__tdb_prayers_404 = true;
          return new Response(JSON.stringify({ error: 'prayers_api_unavailable' }), { status: 404, headers: { 'Content-Type': 'application/json' } });
        }
        return res;
      }, function(err){
        window.__tdb_prayers_404 = true;
        return new Response(JSON.stringify({ error: 'prayers_api_unavailable' }), { status: 404, headers: { 'Content-Type': 'application/json' } });
      });
    }
    if (prayerRequestInFlight)
      return Promise.resolve(new Response(JSON.stringify([]), { status: 200, headers: { 'Content-Type': 'application/json' } }));
    prayerRequestInFlight = true;
    return realFetch.apply(this, arguments).then(function(res){
      prayerRequestInFlight = false;
      if (res && res.status === 404) window.__tdb_prayers_404 = true;
      return res;
    }, function(err){
      prayerRequestInFlight = false;
      window.__tdb_prayers_404 = true;
      return new Response(JSON.stringify([]), { status: 200, headers: { 'Content-Type': 'application/json' } });
    });
  };
})();
