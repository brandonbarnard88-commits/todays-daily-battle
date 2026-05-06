(function () {
  'use strict';
  if (typeof window !== 'undefined' && window.__tdbKidsPageSkyInited) return;
  window.__tdbKidsPageSkyInited = true;

var tdbSkySolarTimes = null;
var tdbSkyMoonIntervalId = null;
function tdbGetSunTimes(date, lat, lng, height) {
  height = height || 0;
  var PI = Math.PI, sin = Math.sin, cos = Math.cos, tan = Math.tan, asin = Math.asin, atan = Math.atan2, acos = Math.acos, rad = PI / 180;
  var dayMs = 86400000, J1970 = 2440588, J2000 = 2451545;
  function toJulian(d) { return d.valueOf() / dayMs - 0.5 + J1970; }
  function fromJulian(j) { return new Date((j + 0.5 - J1970) * dayMs); }
  function toDays(d) { return toJulian(d) - J2000; }
  var e = rad * 23.4397;
  function rightAscension(l, b) { return atan(sin(l) * cos(e) - tan(b) * sin(e), cos(l)); }
  function declination(l, b) { return asin(sin(b) * cos(e) + cos(b) * sin(e) * sin(l)); }
  function solarMeanAnomaly(d) { return rad * (357.5291 + 0.98560028 * d); }
  function eclipticLongitude(M) {
    var C = rad * (1.9148 * sin(M) + 0.02 * sin(2 * M) + 0.0003 * sin(3 * M));
    var P = rad * 102.9372;
    return M + C + P + PI;
  }
  function sunCoords(d) {
    var M = solarMeanAnomaly(d), L = eclipticLongitude(M);
    return { dec: declination(L, 0), ra: rightAscension(L, 0) };
  }
  var J0 = 0.0009;
  function julianCycle(d, lw) { return Math.round(d - J0 - lw / (2 * PI)); }
  function approxTransit(Ht, lw, n) { return J0 + (Ht + lw) / (2 * PI) + n; }
  function solarTransitJ(ds, M, L) { return J2000 + ds + 0.0053 * sin(M) - 0.0069 * sin(2 * L); }
  function hourAngle(h, phi, d) { return acos((sin(h) - sin(phi) * sin(d)) / (cos(phi) * cos(d))); }
  function observerAngle(heightM) { return -2.076 * Math.sqrt(heightM) / 60; }
  function getSetJ(h, lw, phi, dec, n, M, L) {
    var w = hourAngle(h, phi, dec), a = approxTransit(w, lw, n);
    return solarTransitJ(a, M, L);
  }
  var lw = rad * -lng, phi = rad * lat, dh = observerAngle(height);
  var d = toDays(date), n = julianCycle(d, lw), ds = approxTransit(0, lw, n);
  var M = solarMeanAnomaly(ds), L = eclipticLongitude(M), dec = declination(L, 0), Jnoon = solarTransitJ(ds, M, L);
  var result = { solarNoon: fromJulian(Jnoon), nadir: fromJulian(Jnoon - 0.5) };
  var tList = [
    [-0.833, 'sunrise', 'sunset'],
    [-0.3, 'sunriseEnd', 'sunsetStart'],
    [-6, 'dawn', 'dusk'],
    [-12, 'nauticalDawn', 'nauticalDusk'],
    [-18, 'nightEnd', 'night'],
    [6, 'goldenHourEnd', 'goldenHour']
  ];
  for (var ti = 0; ti < tList.length; ti++) {
    var tm = tList[ti], h0 = (tm[0] + dh) * rad;
    var Jset = getSetJ(h0, lw, phi, dec, n, M, L);
    var Jrise = Jnoon - (Jset - Jnoon);
    result[tm[1]] = fromJulian(Jrise);
    result[tm[2]] = fromJulian(Jset);
  }
  return result;
}

function tdbSkySolarValid(t) {
  if (!t || !t.dawn || !t.sunrise || !t.sunset || !t.dusk) return false;
  if (!isFinite(t.dawn.getTime()) || !isFinite(t.sunrise.getTime()) || !isFinite(t.sunset.getTime()) || !isFinite(t.dusk.getTime())) return false;
  return t.dawn.getTime() <= t.sunrise.getTime() && t.sunrise.getTime() < t.sunset.getTime() && t.sunset.getTime() <= t.dusk.getTime();
}

function skyClassFromSolar(now, t) {
  if (!tdbSkySolarValid(t)) return null;
  var ts = now.getTime();
  if (ts < t.dawn.getTime()) return 'sky-night';
  if (ts < t.sunrise.getTime()) return 'sky-dawn';
  if (ts < t.sunset.getTime()) return 'sky-day';
  if (ts < t.dusk.getTime()) return 'sky-dusk';
  return 'sky-night';
}

function readSkyGeoForSolar() {
  var todayStr = new Date().toDateString();
  var keys = ['tdbSkyGeoGps', 'tdbSkyGeo', 'tdbSkyGeoIp'];
  for (var ki = 0; ki < keys.length; ki++) {
    try {
      var raw = sessionStorage.getItem(keys[ki]);
      if (!raw) continue;
      var og = JSON.parse(raw);
      if (!og || typeof og.lat !== 'number' || typeof og.lon !== 'number') continue;
      if (og.saved !== todayStr) continue;
      return { lat: og.lat, lon: og.lon };
    } catch (e) {}
  }
  return null;
}

function getSkyClassFixed(h) {
  var isDawn  = h >= 5   && h < 7.5;
  var isDusk  = h >= 18.5 && h < 21;
  var isNight = !(h >= 6 && h < 21);
  return isDawn ? 'sky-dawn' : isDusk ? 'sky-dusk' : isNight ? 'sky-night' : 'sky-day';
}

function resolveSkyClassNow() {
  var now = new Date();
  try {
    var coords = readSkyGeoForSolar();
    if (coords) {
      var stFresh = tdbGetSunTimes(now, coords.lat, coords.lon);
      if (tdbSkySolarValid(stFresh)) tdbSkySolarTimes = stFresh;
    }
  } catch (eR) { /* keep existing tdbSkySolarTimes */ }
  var fromSun = skyClassFromSolar(now, tdbSkySolarTimes);
  if (fromSun) return fromSun;
  var h = now.getHours() + now.getMinutes() / 60;
  return getSkyClassFixed(h);
}

function getSkyCelestialPlane(layer) {
  if (!layer || !layer.querySelector) return layer;
  var plane = layer.querySelector('#sky-celestial-plane');
  return plane || layer;
}

function clearDynamicSkyDecor(layer) {
  var plane = getSkyCelestialPlane(layer);
  if (!plane) return;
  var dyn = plane.querySelectorAll('.sky-star, .sky-shooter, .sky-cloud, .sky-bird');
  for (var ei = dyn.length - 1; ei >= 0; ei--) dyn[ei].remove();
}

function stopSkyMoonUpdates() {
  if (tdbSkyMoonIntervalId) {
    clearInterval(tdbSkyMoonIntervalId);
    tdbSkyMoonIntervalId = null;
  }
}

function paintSkyDecorations(layer, r, skyClass) {
  if (!layer) return;
  var plane = getSkyCelestialPlane(layer);
  if (!plane) return;
  var isMobile = window.innerWidth < 600;
  var kidsCalm = document.body.classList.contains('kids-sky-enabled');
  var kidsPlayful = document.body.classList.contains('kids-sky-playful');
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var isNightSky = skyClass === 'sky-night';

  if (!isNightSky) {
    stopSkyMoonUpdates();
  }
  var showDayDecor = !isNightSky;
  var isDawn = skyClass === 'sky-dawn';
  var isDusk = skyClass === 'sky-dusk';

  if (isNightSky && !reduced) {
    var starCount = isMobile ? (kidsCalm ? 26 : 55) : (kidsCalm ? 72 : 110);
    if (kidsPlayful) starCount = Math.max(12, Math.floor(starCount * 0.52));
    for (var i = 0; i < starCount; i++) {
      var st = document.createElement('div');
      st.className = 'sky-star' + (r() > 0.82 ? ' glow' : '');
      var sz = r() * 1.5 + 0.5;
      var lo = r() * 0.25 + 0.15, hi = lo + r() * 0.5 + 0.25;
      var scale = (1.08 + r() * 0.18).toFixed(2);
      st.style.cssText =
        'left:' + (r() * 98) + '%;' +
        'top:'  + (r() * 82) + '%;' +
        'width:' + sz + 'px;height:' + sz + 'px;' +
        '--so-lo:' + lo.toFixed(2) + ';--so-hi:' + hi.toFixed(2) + ';' +
        '--so-scale:' + scale + ';' +
        'animation-duration:' + (r() * 3 + 2) + 's;' +
        'animation-delay:-' + (r() * 5) + 's;';
      var cv = r();
      st.style.background = cv > 0.65 ? 'rgba(220,228,255,1)' : cv > 0.3 ? 'rgba(255,248,230,1)' : '#fff';
      plane.appendChild(st);
    }
    if (!isMobile) {
      for (var si = 0; si < 2; si++) {
        (function scheduleShooter(delay) {
          setTimeout(function fire() {
            if (!document.body.classList.contains('sky-night')) return;
            var sh = document.createElement('div');
            sh.className = 'sky-shooter';
            var angle = 12 + r() * 18;
            var dur   = 1.8 + r() * 1.2;
            sh.style.cssText =
              'top:' + (8 + r() * 30) + '%;' +
              'left:0;' +
              'width:' + (90 + r() * 80) + 'px;' +
              '--shoot-angle:' + angle.toFixed(1) + 'deg;' +
              'animation-duration:' + dur.toFixed(2) + 's;';
            plane.appendChild(sh);
            setTimeout(function() { sh.remove(); }, (dur + 0.5) * 1000);
            setTimeout(fire, 9000 + r() * 12000);
          }, delay);
        })(si * 6000 + r() * 4000);
      }
    }
  }

  if (showDayDecor && !reduced) {
    var cloudDefs = [
      { w:180, h:55, top: 12, op: 0.68, dur: 130 },
      { w:140, h:45, top: 24, op: 0.55, dur: 95  },
      { w:220, h:65, top: 9,  op: 0.45, dur: 160 }
    ];
    if (kidsCalm && isMobile) {
      cloudDefs = cloudDefs.slice(0, 2);
    }
    if (kidsPlayful && isMobile && cloudDefs.length > 1) {
      cloudDefs = cloudDefs.slice(0, 1);
    }
    if (!isMobile) cloudDefs.push(
      { w:110, h:40, top: 33, op: 0.60, dur: 75  },
      { w:160, h:50, top: 18, op: 0.40, dur: 110 }
    );
    var timings = ['ease-in-out', 'ease-in', 'ease-out', 'linear', 'ease-in-out'];
    var warmTint = isDusk || isDawn;
    cloudDefs.forEach(function(cd, idx) {
      var cl = document.createElement('div');
      cl.className = 'sky-cloud';
      var durUse = cd.dur;
      if (kidsCalm) durUse = Math.round(durUse * 1.65);
      if (kidsPlayful) durUse = Math.round(durUse * 1.28);
      var startX = -(cd.w + r() * 60);
      var delay = -(r() * durUse * 0.8);
      var base = warmTint ? 'rgba(255,' + Math.round(190 - r()*60) + ',' + Math.round(130 - r()*80) + ',' : 'rgba(255,255,255,';
      cl.style.cssText =
        'width:' + cd.w + 'px;height:' + cd.h + 'px;' +
        'top:' + cd.top + '%;' +
        'left:' + startX + 'px;' +
        'opacity:' + cd.op + ';' +
        'border-radius:' + Math.round(cd.h * 0.5) + 'px;' +
        'background:radial-gradient(ellipse 65% 55% at 40% 45%,' + base + '0.88) 0%,' + base + '0) 100%);' +
        'filter:blur(' + (r()*1.5) + 'px);' +
        '--drift:' + (window.innerWidth + cd.w + 80) + 'px;' +
        'animation-duration:' + durUse + 's;' +
        'animation-delay:' + delay.toFixed(1) + 's;' +
        'animation-timing-function:' + timings[idx % timings.length] + ';';
      plane.appendChild(cl);
    });
    var birdCount = isMobile ? (kidsCalm ? 2 : 4) : (kidsCalm ? 4 : 7 + Math.floor(r() * 4));
    if (kidsPlayful) {
      birdCount = isMobile ? Math.min(birdCount, 1) : Math.max(2, Math.floor(birdCount * 0.7));
    }
    for (var bi = 0; bi < birdCount; bi++) {
      var bd = document.createElement('div');
      bd.className = 'sky-bird';
      var bsize = 8 + r() * 10;
      var bdur  = 28 + r() * 45;
      if (kidsCalm) bdur *= 1.45;
      if (kidsPlayful) bdur *= 1.15;
      var btop  = birdCount <= 1 ? 18 : 12 + (bi / Math.max(birdCount - 1, 1)) * 28 + r() * 6;
      var bdelay = -(r() * bdur);
      var ftdur = 0.35 + r() * 0.4;
      bd.style.cssText =
        'top:' + btop + '%;' +
        '--ws:' + Math.round(bsize) + 'px;' +
        '--ft:' + ftdur.toFixed(2) + 's;' +
        '--bx0:-' + (10 + r() * 5) + 'vw;' +
        '--bx1:' + (108 + r() * 5) + 'vw;' +
        'animation-duration:' + bdur + 's;' +
        'animation-delay:' + bdelay.toFixed(1) + 's;';
      plane.appendChild(bd);
    }
  }

  if (isNightSky) initSkyMoon();
}

function updateSkyClass() {
  var next = resolveSkyClassNow();
  var classes = ['sky-dawn', 'sky-day', 'sky-dusk', 'sky-night'];
  var current = classes.find(function(c) { return document.body.classList.contains(c); });
  if (current !== next) {
    classes.forEach(function(c) { document.body.classList.remove(c); });
    document.body.classList.add(next);
    var layer = document.getElementById('sky-layer');
    if (layer) {
      clearDynamicSkyDecor(layer);
      var ds = new Date().toDateString();
      var dh = 0;
      for (var di = 0; di < ds.length; di++) { dh = (dh * 31 + ds.charCodeAt(di)) % 100; }
      function sr(seed) {
        var s = seed;
        return function() { s = (s * 16807) % 2147483647; return (s - 1) / 2147483646; };
      }
      paintSkyDecorations(layer, sr(20260311 + dh), next);
    }
  }
}

function initHeaderSky() {
  try {
    var coords0 = readSkyGeoForSolar();
    if (coords0) {
      var st0 = tdbGetSunTimes(new Date(), coords0.lat, coords0.lon);
      if (tdbSkySolarValid(st0)) tdbSkySolarTimes = st0;
    }
  } catch (err) { tdbSkySolarTimes = null; }

  var layer = document.getElementById('sky-layer');
  if (!layer) return;

  var ds = new Date().toDateString();
  var dh = 0;
  for (var di = 0; di < ds.length; di++) { dh = (dh * 31 + ds.charCodeAt(di)) % 100; }
  if (dh < 20) document.body.classList.add('sky-eclipse');

  function sr(seed) {
    var s = seed;
    return function() { s = (s * 16807) % 2147483647; return (s - 1) / 2147483646; };
  }
  var r = sr(20260311 + dh);

  var next = resolveSkyClassNow();
  document.body.classList.add(next);

  paintSkyDecorations(layer, r, next);

  setInterval(updateSkyClass, 60000);

  function requestSkyGeolocation() {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      function (pos) {
        var lat = pos.coords.latitude, lon = pos.coords.longitude;
        var savedGps = new Date().toDateString();
        var gpsPayload = JSON.stringify({ lat: lat, lon: lon, saved: savedGps });
        try {
          sessionStorage.setItem('tdbSkyGeoGps', gpsPayload);
          sessionStorage.setItem('tdbSkyGeo', gpsPayload);
        } catch (e2) {}
        var times = tdbGetSunTimes(new Date(), lat, lon);
        if (!tdbSkySolarValid(times)) return;
        var skyNames = ['sky-dawn', 'sky-day', 'sky-dusk', 'sky-night'];
        var prevClass = skyNames.find(function (c) { return document.body.classList.contains(c); });
        tdbSkySolarTimes = times;
        var after = skyClassFromSolar(new Date(), times);
        if (!after || prevClass === after) return;
        clearDynamicSkyDecor(layer);
        var classes = ['sky-dawn', 'sky-day', 'sky-dusk', 'sky-night'];
        classes.forEach(function(c) { document.body.classList.remove(c); });
        document.body.classList.add(after);
        paintSkyDecorations(layer, r, after);
      },
      function () { /* keep fixed or cached windows */ },
      { enableHighAccuracy: false, timeout: 12000, maximumAge: 43200000 }
    );
  }
  // Never request geolocation on load — avoids repeat browser prompts. Opt-in: localStorage.setItem('tdbSkyGeoOptIn','1')
  function skyGeoOptIn() {
    try { return localStorage.getItem('tdbSkyGeoOptIn') === '1'; } catch (e) { return false; }
  }
  if (skyGeoOptIn()) {
    if (typeof requestIdleCallback === 'function') {
      requestIdleCallback(function () { requestSkyGeolocation(); }, { timeout: 5000 });
    } else {
      setTimeout(requestSkyGeolocation, 2000);
    }
  }

  function refreshSkyAfterIpGeo() {
    try {
      var c = readSkyGeoForSolar();
      if (c) {
        var st = tdbGetSunTimes(new Date(), c.lat, c.lon);
        if (tdbSkySolarValid(st)) tdbSkySolarTimes = st;
      }
    } catch (eIp) {}
    updateSkyClass();
  }
  if (typeof window.tdbFetchSkyGeoFromIp === 'function') {
    window.tdbFetchSkyGeoFromIp(function (changed) {
      if (changed) refreshSkyAfterIpGeo();
    });
  }
}

/** Geocentric illumination: SunCalc getMoonIllumination (Meeus ch.48 / NASA mphase). */
function tdbGetMoonIllumination(date) {
  var PI = Math.PI, sin = Math.sin, cos = Math.cos, tan = Math.tan, atan = Math.atan2, acos = Math.acos;
  var rad = PI / 180;
  var dayMs = 86400000, J1970 = 2440588, J2000 = 2451545;
  function toJulian(d) { return d.valueOf() / dayMs - 0.5 + J1970; }
  function toDays(d) { return toJulian(d) - J2000; }
  var e = rad * 23.4397;
  function rightAscension(l, b) { return atan(sin(l) * cos(e) - tan(b) * sin(e), cos(l)); }
  function declination(l, b) { return Math.asin(sin(b) * cos(e) + cos(b) * sin(e) * sin(l)); }
  function solarMeanAnomaly(d) { return rad * (357.5291 + 0.98560028 * d); }
  function eclipticLongitude(M) {
    var C = rad * (1.9148 * sin(M) + 0.02 * sin(2 * M) + 0.0003 * sin(3 * M));
    var P = rad * 102.9372;
    return M + C + P + PI;
  }
  function sunCoords(d) {
    var M = solarMeanAnomaly(d), L = eclipticLongitude(M);
    return { dec: declination(L, 0), ra: rightAscension(L, 0) };
  }
  function moonCoords(d) {
    var L = rad * (218.316 + 13.176396 * d);
    var Mm = rad * (134.963 + 13.064993 * d);
    var F = rad * (93.272 + 13.229350 * d);
    var l = L + rad * 6.289 * sin(Mm);
    var b = rad * 5.128 * sin(F);
    var dist = 385001 - 20905 * cos(Mm);
    return { ra: rightAscension(l, b), dec: declination(l, b), dist: dist };
  }
  var d = toDays(date || new Date());
  var s = sunCoords(d), m = moonCoords(d);
  var sdist = 149598000;
  var phi = acos(sin(s.dec) * sin(m.dec) + cos(s.dec) * cos(m.dec) * cos(s.ra - m.ra));
  var inc = atan(sdist * sin(phi), m.dist - sdist * cos(phi));
  var angle = atan(cos(s.dec) * sin(s.ra - m.ra), sin(s.dec) * cos(m.dec) - cos(s.dec) * sin(m.dec) * cos(s.ra - m.ra));
  var fraction = (1 + cos(inc)) / 2;
  var phase = 0.5 + 0.5 * inc * (angle < 0 ? -1 : 1) / PI;
  return { fraction: fraction, phase: phase, angle: angle };
}

function tdbMoonPhaseName(synodicPhase) {
  var ph = synodicPhase % 1;
  if (ph < 0) ph += 1;
  if (ph < 0.03 || ph > 0.97) return 'New Moon';
  if (ph < 0.22) return 'Waxing Crescent';
  if (ph < 0.28) return 'First Quarter';
  if (ph < 0.47) return 'Waxing Gibbous';
  if (ph < 0.53) return 'Full Moon';
  if (ph < 0.72) return 'Waning Gibbous';
  if (ph < 0.78) return 'Last Quarter';
  if (ph < 0.97) return 'Waning Crescent';
  return 'New Moon';
}

function initSkyMoon() {
  var shadow = document.getElementById('sky-moon-shadow');
  var label  = document.getElementById('sky-moon-label');
  if (!shadow) return;

  stopSkyMoonUpdates();

  function updateMoon() {
    if (!document.body.classList.contains('sky-night')) return;
    var ill = tdbGetMoonIllumination(new Date());
    var name = tdbMoonPhaseName(ill.phase);
    var frac = ill.fraction;
    var waxing = ill.phase < 0.5 || ill.phase > 0.98;
    var shadowScale = 1 - frac;
    shadow.style.setProperty('--shadow-scale', shadowScale.toFixed(3));
    shadow.style.setProperty('--shadow-origin', waxing ? '100% 50%' : '0% 50%');
    var pct = Math.round(frac * 100);
    if (label) label.textContent = name + ' · ' + pct + '%';
    var moonEl = document.getElementById('sky-moon');
    if (moonEl) moonEl.setAttribute('aria-label', 'Moon phase: ' + name + ', ' + pct + '% illuminated');
  }

  updateMoon();
  tdbSkyMoonIntervalId = setInterval(updateMoon, 60000);
}


  function bootKidsPageSky() {
    if (!document.getElementById('sky-layer')) return;
    initHeaderSky();
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bootKidsPageSky);
  } else {
    bootKidsPageSky();
  }
})();
