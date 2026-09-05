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

function coordsFromTimezone() {
  var tz = '';
  try {
    tz = String(Intl.DateTimeFormat().resolvedOptions().timeZone || '');
  } catch (eTz) {}
  var cities = {
    'America/New_York': [40.71, -74.01],
    'America/Chicago': [41.85, -87.65],
    'America/Denver': [39.74, -104.99],
    'America/Los_Angeles': [34.05, -118.24],
    'America/Phoenix': [33.45, -112.07],
    'America/Anchorage': [61.22, -149.9],
    'Pacific/Honolulu': [21.31, -157.86],
    'America/Toronto': [43.65, -79.38],
    'America/Mexico_City': [19.43, -99.13],
    'America/Sao_Paulo': [-23.55, -46.63],
    'Europe/London': [51.51, -0.13],
    'Europe/Paris': [48.86, 2.35],
    'Europe/Berlin': [52.52, 13.41],
    'Asia/Tokyo': [35.68, 139.69],
    'Asia/Seoul': [37.57, 126.98],
    'Asia/Shanghai': [31.23, 121.47],
    'Asia/Kolkata': [22.57, 88.36],
    'Australia/Sydney': [-33.87, 151.21],
    'Pacific/Auckland': [-36.85, 174.76],
    'Africa/Johannesburg': [-26.2, 28.05]
  };
  if (cities[tz]) return { lat: cities[tz][0], lon: cities[tz][1] };
  if (/Chicago|Menominee|Indiana\/Tell_City|Indiana\/Knox/.test(tz)) return { lat: 41.85, lon: -87.65 };
  if (/New_York|Detroit|Indiana|Kentucky|Toronto/.test(tz)) return { lat: 40.71, lon: -74.01 };
  if (/Denver|Boise|Edmonton/.test(tz)) return { lat: 39.74, lon: -104.99 };
  if (/Los_Angeles|Vancouver|Tijuana/.test(tz)) return { lat: 34.05, lon: -118.24 };
  if (/Europe\//.test(tz)) return { lat: 51.5, lon: 10 };
  var lon = -(new Date().getTimezoneOffset() / 60) * 15;
  return { lat: 38, lon: lon };
}

function readStoredSkyGeo(store) {
  if (!store || !store.getItem) return null;
  var keys = ['tdbSkyGeoGps', 'tdbSkyGeo', 'tdbSkyGeoIp'];
  for (var ki = 0; ki < keys.length; ki++) {
    try {
      var raw = store.getItem(keys[ki]);
      if (!raw) continue;
      var og = JSON.parse(raw);
      if (!og || typeof og.lat !== 'number' || typeof og.lon !== 'number') continue;
      if (!isFinite(og.lat) || !isFinite(og.lon)) continue;
      if (Math.abs(og.lat) > 90 || Math.abs(og.lon) > 180) continue;
      return { lat: og.lat, lon: og.lon };
    } catch (e) {}
  }
  return null;
}

function readSkyGeoForSolar() {
  var fromSession = null;
  var fromLocal = null;
  try { fromSession = readStoredSkyGeo(sessionStorage); } catch (eS) {}
  try { fromLocal = readStoredSkyGeo(localStorage); } catch (eL) {}
  return fromSession || fromLocal || coordsFromTimezone();
}

function getSkyClassFixed(h) {
  var isDawn  = h >= 5   && h < 7.5;
  var isDusk  = h >= 18.5 && h < 21;
  var isNight = !(h >= 6 && h < 21);
  return isDawn ? 'sky-dawn' : isDusk ? 'sky-dusk' : isNight ? 'sky-night' : 'sky-day';
}

function appearanceSkyOverride() {
  if (!document.body || !document.body.classList.contains('tdb-porch-sky')) return null;
  var t = '';
  try { t = document.documentElement.getAttribute('data-theme') || ''; } catch (eT) {}
  if (t === 'light' || t === 'sepia') return 'sky-day';
  return null;
}

function resolveSkyClassNow() {
  var fromAppearance = appearanceSkyOverride();
  if (fromAppearance) return fromAppearance;
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

function ensurePorchSkyMarkup() {
  if (!document.body || !document.body.classList.contains('tdb-porch-sky')) {
    return document.getElementById('sky-layer');
  }
  var layer = document.getElementById('sky-layer');
  if (!layer) {
    var wrap = document.createElement('div');
    wrap.className = 'sky-page-backdrop';
    wrap.setAttribute('aria-hidden', 'true');
    layer = document.createElement('div');
    layer.className = 'sky';
    layer.id = 'sky-layer';
    layer.setAttribute('aria-hidden', 'true');
    wrap.appendChild(layer);
    document.body.insertBefore(wrap, document.body.firstChild);
  }
  if (!layer.querySelector('.sky-stars-parallax')) {
    var parallax = document.createElement('div');
    parallax.className = 'sky-stars-parallax';
    parallax.setAttribute('aria-hidden', 'true');
    layer.appendChild(parallax);
  }
  if (!layer.querySelector('.sky-aurora')) {
    var aurora = document.createElement('div');
    aurora.className = 'sky-aurora';
    aurora.id = 'sky-aurora';
    aurora.setAttribute('aria-hidden', 'true');
    var veil = document.createElement('div');
    veil.className = 'sky-aurora-veil';
    veil.setAttribute('aria-hidden', 'true');
    aurora.appendChild(veil);
    layer.appendChild(aurora);
  }
  var plane = layer.querySelector('#sky-celestial-plane');
  if (!plane) {
    plane = document.createElement('div');
    plane.className = 'sky-viewport';
    plane.id = 'sky-celestial-plane';
    layer.appendChild(plane);
  }
  if (!plane.querySelector('#sky-sun')) {
    var sun = document.createElement('div');
    sun.className = 'sky-sun';
    sun.id = 'sky-sun';
    plane.appendChild(sun);
  }
  if (!plane.querySelector('#sky-moon')) {
    plane.appendChild(buildPorchSkyMoon());
  }
  return layer;
}

function buildPorchSkyMoon() {
  var NS = 'http://www.w3.org/2000/svg';
  var moon = document.createElement('div');
  moon.id = 'sky-moon';
  moon.setAttribute('role', 'img');
  moon.setAttribute('aria-label', 'Moon in the sky (decorative)');
  var svg = document.createElementNS(NS, 'svg');
  svg.setAttribute('class', 'sky-moon-svg');
  svg.setAttribute('viewBox', '0 0 100 100');
  svg.setAttribute('aria-hidden', 'true');
  var defs = document.createElementNS(NS, 'defs');
  var grad = document.createElementNS(NS, 'radialGradient');
  grad.setAttribute('id', 'moon-base');
  grad.setAttribute('cx', '38%');
  grad.setAttribute('cy', '35%');
  grad.setAttribute('r', '50%');
  var stops = [
    ['0%', 'rgba(255,255,240,0.96)'],
    ['60%', 'rgba(200,210,230,0.88)'],
    ['100%', 'rgba(140,160,190,0.72)']
  ];
  for (var si = 0; si < stops.length; si++) {
    var stop = document.createElementNS(NS, 'stop');
    stop.setAttribute('offset', stops[si][0]);
    stop.setAttribute('stop-color', stops[si][1]);
    grad.appendChild(stop);
  }
  defs.appendChild(grad);
  svg.appendChild(defs);
  var disk = document.createElementNS(NS, 'circle');
  disk.setAttribute('cx', '50');
  disk.setAttribute('cy', '50');
  disk.setAttribute('r', '48');
  disk.setAttribute('fill', 'url(#moon-base)');
  svg.appendChild(disk);
  var shadow = document.createElementNS(NS, 'circle');
  shadow.setAttribute('id', 'sky-moon-shadow');
  shadow.setAttribute('cx', '50');
  shadow.setAttribute('cy', '50');
  shadow.setAttribute('r', '48');
  shadow.setAttribute('fill', 'rgba(2,4,18,0.93)');
  shadow.setAttribute('class', 'sky-moon-shadow-svg');
  svg.appendChild(shadow);
  moon.appendChild(svg);
  var label = document.createElement('span');
  label.className = 'sky-moon-label';
  label.id = 'sky-moon-label';
  moon.appendChild(label);
  return moon;
}

function getSkyCelestialPlane(layer) {
  if (!layer || !layer.querySelector) return layer;
  var plane = layer.querySelector('#sky-celestial-plane');
  return plane || layer;
}

function spawnSkyShooter(plane, r, isMobile) {
  if (!plane) return;
  var sh = document.createElement('div');
  var fireball = r() > 0.84;
  sh.className = 'sky-shooter' + (fireball ? ' is-fireball' : '');
  var lane = Math.floor(r() * 4);
  var startLeft;
  var startTop;
  var dx;
  var dy;
  if (lane === 0) {
    startLeft = 2 + r() * 30;
    startTop = 2 + r() * 24;
    dx = 34 + r() * 44;
    dy = 8 + r() * 22;
  } else if (lane === 1) {
    startLeft = 60 + r() * 34;
    startTop = 2 + r() * 24;
    dx = -(34 + r() * 44);
    dy = 8 + r() * 22;
  } else if (lane === 2) {
    startLeft = 22 + r() * 52;
    startTop = 1 + r() * 10;
    dx = (r() > 0.5 ? 1 : -1) * (30 + r() * 40);
    dy = 14 + r() * 26;
  } else {
    startLeft = r() > 0.5 ? (3 + r() * 18) : (76 + r() * 18);
    startTop = 16 + r() * 30;
    dx = startLeft < 50 ? (38 + r() * 38) : -(38 + r() * 38);
    dy = 6 + r() * 16;
  }
  var angle = Math.atan2(dy, dx) * (180 / Math.PI);
  var dur = (isMobile ? 0.9 : 1.05) + r() * 0.7;
  sh.style.cssText =
    'top:' + startTop.toFixed(1) + '%;' +
    'left:' + startLeft.toFixed(1) + '%;' +
    'width:' + ((isMobile ? 56 : 70) + r() * (fireball ? 90 : 55)) + 'px;' +
    '--shoot-angle:' + angle.toFixed(1) + 'deg;' +
    '--shoot-x:' + dx.toFixed(1) + 'vw;' +
    '--shoot-y:' + dy.toFixed(1) + 'vh;' +
    'animation-duration:' + dur.toFixed(2) + 's;';
  plane.appendChild(sh);
  setTimeout(function () {
    if (sh.parentNode) sh.parentNode.removeChild(sh);
  }, (dur + 0.4) * 1000);
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
  var porchKids = document.body.classList.contains('tdb-porch-sky--kids');
  var porchBand = document.body.classList.contains('tdb-porch-sky');
  var kidsCalm = document.body.classList.contains('kids-sky-enabled') || porchKids;
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
    if (porchBand) starCount = Math.min(starCount, isMobile ? 18 : 36);
    if (porchKids) starCount = Math.min(starCount, isMobile ? 12 : 22);
    var bandCount = Math.floor(starCount * 0.34);
    for (var i = 0; i < starCount; i++) {
      var st = document.createElement('div');
      var kind = r();
      st.className = 'sky-star' + (kind > 0.8 ? ' glow' : '') + (kind > 0.95 ? ' planet' : '');
      var sz = r() * 1.5 + 0.5;
      if (kind > 0.95) sz += 1;
      var lo = r() * 0.22 + 0.18, hi = lo + r() * 0.45 + 0.22;
      var scale = (1.04 + r() * 0.14).toFixed(2);
      var x = r() * 98;
      var y = r() * 80;
      if (i < bandCount) {
        x = r() * 100;
        y = 18 + x * 0.24 + (r() - 0.5) * 12;
      }
      st.style.cssText =
        'left:' + x.toFixed(2) + '%;' +
        'top:'  + Math.max(2, Math.min(82, y)).toFixed(2) + '%;' +
        'width:' + sz + 'px;height:' + sz + 'px;' +
        '--so-lo:' + lo.toFixed(2) + ';--so-hi:' + hi.toFixed(2) + ';' +
        '--so-scale:' + scale + ';' +
        'animation-duration:' + (4 + r() * 6).toFixed(2) + 's;' +
        'animation-delay:-' + (r() * 8).toFixed(1) + 's;';
      var cv = r();
      st.style.background = cv > 0.68 ? 'rgba(210,222,255,1)' : cv > 0.36 ? 'rgba(255,246,220,1)' : '#fff';
      plane.appendChild(st);
    }
    if (!porchBand && !porchKids && (!isMobile || !kidsCalm)) {
      var shooterN = isMobile ? 1 : 2;
      for (var si = 0; si < shooterN; si++) {
        (function scheduleShooter(delay) {
          setTimeout(function fire() {
            if (!document.body.classList.contains('sky-night')) return;
            spawnSkyShooter(plane, r, isMobile);
            setTimeout(fire, 18000 + r() * 26000);
          }, delay);
        })(si * 8000 + 2000 + r() * 5000);
      }
    }
  }

  if (showDayDecor && !reduced) {
    var cloudDefs = [
      { w:190, h:50, top: 12, op: 0.6, dur: 148, bob: -7 },
      { w:144, h:42, top: 24, op: 0.5, dur: 104, bob: -10 },
      { w:224, h:60, top: 9,  op: 0.4, dur: 168, bob: -5 }
    ];
    if (kidsCalm && isMobile) {
      cloudDefs = cloudDefs.slice(0, 2);
    }
    if (kidsPlayful && isMobile && cloudDefs.length > 1) {
      cloudDefs = cloudDefs.slice(0, 1);
    }
    if (!isMobile) cloudDefs.push(
      { w:114, h:38, top: 33, op: 0.54, dur: 82, bob: -11 },
      { w:164, h:48, top: 18, op: 0.36, dur: 122, bob: -6 }
    );
    var timings = ['ease-in-out', 'linear', 'ease-out', 'ease-in-out', 'linear'];
    var warmTint = isDusk || isDawn;
    cloudDefs.forEach(function(cd, idx) {
      var cl = document.createElement('div');
      cl.className = 'sky-cloud';
      var durUse = cd.dur;
      if (kidsCalm) durUse = Math.round(durUse * 1.65);
      if (kidsPlayful) durUse = Math.round(durUse * 1.28);
      var startX = -(cd.w + r() * 70);
      var delay = -(r() * durUse * 0.8);
      var peach = Math.round(188 - r() * 50);
      var base = warmTint ? 'rgba(255,' + peach + ',' + Math.round(peach - 40) + ',' : 'rgba(255,255,255,';
      cl.style.cssText =
        'width:' + cd.w + 'px;height:' + cd.h + 'px;' +
        'top:' + cd.top + '%;' +
        'left:' + startX + 'px;' +
        'opacity:' + cd.op + ';' +
        'border-radius:' + Math.round(cd.h * 0.55) + 'px;' +
        'background:radial-gradient(ellipse 70% 58% at 42% 48%,' + base + '0.9) 0%,' + base + '0) 100%);' +
        '--cloud-blur:' + (0.6 + r() * 1.5).toFixed(2) + 'px;' +
        '--drift:' + (window.innerWidth + cd.w + 100) + 'px;' +
        '--bob:' + cd.bob + 'px;' +
        '--cloud-ease:' + timings[idx % timings.length] + ';' +
        'animation-duration:' + durUse + 's;' +
        'animation-delay:' + delay.toFixed(1) + 's;';
      plane.appendChild(cl);
    });
    var birdCount = isMobile ? (kidsCalm ? 2 : 3) : (kidsCalm ? 4 : 6 + Math.floor(r() * 2));
    if (kidsPlayful) {
      birdCount = isMobile ? Math.min(birdCount, 1) : Math.max(2, Math.floor(birdCount * 0.7));
    }
    if (porchKids || reduced) birdCount = 0;
    else if (porchBand) birdCount = isMobile ? 1 : 2;
    var flockTop = 16 + r() * 8;
    for (var bi = 0; bi < birdCount; bi++) {
      var bd = document.createElement('div');
      bd.className = 'sky-bird';
      var inFlock = bi < Math.min(3, birdCount);
      var bsize = 8 + r() * 9;
      var bdur  = 32 + r() * 36;
      if (kidsCalm) bdur *= 1.45;
      if (kidsPlayful) bdur *= 1.15;
      var btop  = inFlock ? (flockTop + bi * 2.2) : (12 + r() * 32);
      var bdelay = inFlock ? -(bi * 1.5) : -(r() * bdur);
      var ftdur = 0.32 + r() * 0.28;
      bd.style.cssText =
        'top:' + btop + '%;' +
        '--ws:' + Math.round(bsize) + 'px;' +
        '--ft:' + ftdur.toFixed(2) + 's;' +
        '--bx0:-' + (8 + r() * 8) + 'vw;' +
        '--bx1:' + (106 + r() * 8) + 'vw;' +
        '--by:' + (-6 - r() * 10).toFixed(1) + 'px;' +
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
  if (dh < 20 && !document.body.classList.contains('tdb-porch-sky')) document.body.classList.add('sky-eclipse');

  function sr(seed) {
    var s = seed;
    return function() { s = (s * 16807) % 2147483647; return (s - 1) / 2147483646; };
  }
  var r = sr(20260311 + dh);

  var next = resolveSkyClassNow();
  document.body.classList.add(next);

  paintSkyDecorations(layer, r, next);

  setInterval(updateSkyClass, 120000);
  scheduleSkyFlip();

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
        try {
          localStorage.setItem('tdbSkyGeoGps', gpsPayload);
          localStorage.setItem('tdbSkyGeo', gpsPayload);
        } catch (e3) {}
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
    window.tdbFetchSkyGeoFromIp(function () {
      refreshSkyAfterIpGeo();
      scheduleSkyFlip();
    });
  }
}

var tdbSkyFlipTimer = null;
function nextSkyEventMs(now, t) {
  if (!tdbSkySolarValid(t)) return 120000;
  var ts = now.getTime();
  var marks = [t.dawn, t.sunrise, t.sunset, t.dusk];
  var soon = Infinity;
  for (var i = 0; i < marks.length; i++) {
    var m = marks[i].getTime();
    if (m > ts + 250) soon = Math.min(soon, m - ts);
  }
  if (!isFinite(soon)) {
    var coords = readSkyGeoForSolar();
    if (coords) {
      var t2 = tdbGetSunTimes(new Date(ts + 86400000), coords.lat, coords.lon);
      if (tdbSkySolarValid(t2) && t2.dawn.getTime() > ts) soon = t2.dawn.getTime() - ts;
    }
  }
  if (!isFinite(soon)) soon = 120000;
  return Math.max(800, Math.min(soon + 200, 6 * 3600000));
}
function scheduleSkyFlip() {
  if (tdbSkyFlipTimer) clearTimeout(tdbSkyFlipTimer);
  var wait = nextSkyEventMs(new Date(), tdbSkySolarTimes);
  tdbSkyFlipTimer = setTimeout(function () {
    updateSkyClass();
    scheduleSkyFlip();
  }, wait);
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
    try {
      var m = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      var o = false;
      try { o = localStorage.getItem('tdb_perf_mode') === '1'; } catch (ePerf) {}
      if (m || o) document.documentElement.classList.add('tdb-perf-mode');
    } catch (eHint) {}
    ensurePorchSkyMarkup();
    if (!document.getElementById('sky-layer')) return;
    initHeaderSky();
    try {
      window.addEventListener('tdb-theme-change', function () {
        if (document.body.classList.contains('tdb-porch-sky')) updateSkyClass();
      });
    } catch (eTheme) {}
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bootKidsPageSky);
  } else {
    bootKidsPageSky();
  }
})();
