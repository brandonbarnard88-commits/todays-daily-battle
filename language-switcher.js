/**
 * Language switcher: EN · ES · FR · 中文 · ID · TL · AR + "More languages" hub.
 * Pairs topical FR/ZH pilots (anxiety, hope, loneliness, guilt, overwhelm) + Arabic anxiety (Van Dyck); persists tdb_lang_pref on explicit picks.
 */
(function () {
  'use strict';

  var STORAGE_KEY = 'tdb_lang_pref';
  var MORE_HUB = '/explore.html#languages';

  var ES_TO_EN = {
    'ansiedad.html': '/topic-anxiety.html',
    'fuerza.html': '/topic-strength.html',
    'paz.html': '/calm.html'
  };

  var EN_TO_ES = {
    'topic-anxiety.html': '/ansiedad.html',
    'topic-strength.html': '/fuerza.html',
    'calm.html': '/paz.html'
  };

  var ID_TO_EN = {
    'kecemasan.html': '/topic-anxiety.html'
  };

  var EN_TO_ID = {
    'topic-anxiety.html': '/id/kecemasan.html',
    'ansiedad.html': '/id/kecemasan.html'
  };

  var ID_TO_ES = {
    'kecemasan.html': '/ansiedad.html'
  };

  var ES_TO_ID = {
    'ansiedad.html': '/id/kecemasan.html'
  };

  var TL_TO_EN = {
    'kabalisahan.html': '/topic-anxiety.html'
  };

  var EN_TO_TL = {
    'topic-anxiety.html': '/tl/kabalisahan.html',
    'ansiedad.html': '/tl/kabalisahan.html'
  };

  var TL_TO_ES = {
    'kabalisahan.html': '/ansiedad.html'
  };

  var TL_TO_ID = {
    'kabalisahan.html': '/id/kecemasan.html'
  };

  var ID_TO_TL = {
    'kecemasan.html': '/tl/kabalisahan.html'
  };

  function pathnameNoQuery() {
    var p = (window.location.pathname || '/').split('?')[0];
    if (p.length > 1 && p.slice(-1) === '/') p = p.slice(0, -1);
    return p || '/';
  }

  function baseFile() {
    var p = pathnameNoQuery();
    var i = p.lastIndexOf('/');
    var f = i >= 0 ? p.slice(i + 1) : p;
    return (f || '').split('?')[0];
  }

  function docLang() {
    try {
      return (document.documentElement && document.documentElement.getAttribute('lang')) || '';
    } catch (e) {
      return '';
    }
  }

  function isFrenchAnxietyPage() {
    return pathnameNoQuery() === '/fr/anxiete.html';
  }

  function isChineseAnxietyPage() {
    return pathnameNoQuery() === '/zh/jiaolv.html';
  }

  function isArabicAnxietyPage() {
    return pathnameNoQuery() === '/ar/qalaq.html';
  }

  function isFrenchHopePage() {
    return pathnameNoQuery() === '/fr/espoir.html';
  }

  function isChineseHopePage() {
    return pathnameNoQuery() === '/zh/xiwang.html';
  }

  function isFrenchLonelinessPage() {
    return pathnameNoQuery() === '/fr/solitude.html';
  }

  function isChineseLonelinessPage() {
    return pathnameNoQuery() === '/zh/gudu.html';
  }

  function isFrenchGuiltPage() {
    return pathnameNoQuery() === '/fr/culpabilite.html';
  }

  function isChineseGuiltPage() {
    return pathnameNoQuery() === '/zh/neijiu.html';
  }

  function isFrenchOverwhelmPage() {
    return pathnameNoQuery() === '/fr/deborde.html';
  }

  function isChineseOverwhelmPage() {
    return pathnameNoQuery() === '/zh/taiduo.html';
  }

  function isSpanishTopical() {
    var f = baseFile();
    return f === 'ansiedad.html' || f === 'fuerza.html' || f === 'paz.html';
  }

  function isIndonesianTopical() {
    return baseFile() === 'kecemasan.html' || docLang() === 'id';
  }

  function isTagalogTopical() {
    return baseFile() === 'kabalisahan.html' || docLang() === 'tl';
  }

  function isEnglishSurface() {
    var l = docLang().toLowerCase();
    if (l === 'es' || l === 'id' || l === 'tl' || l === 'fr' || l === 'ar') return false;
    if (l.indexOf('zh') === 0) return false;
    return true;
  }

  function isAnxietyEquivalentBaseFile() {
    var f = baseFile();
    return f === 'topic-anxiety.html' || f === 'ansiedad.html' || f === 'kecemasan.html' ||
      f === 'kabalisahan.html' || f === 'qalaq.html';
  }

  function isHopeEquivalentBaseFile() {
    return baseFile() === 'topic-hope.html';
  }

  function isLonelinessEquivalentBaseFile() {
    return baseFile() === 'topic-loneliness.html';
  }

  function isGuiltEquivalentBaseFile() {
    return baseFile() === 'topic-guilt.html';
  }

  function isOverwhelmEquivalentBaseFile() {
    return baseFile() === 'topic-overwhelmed.html';
  }

  function enHref() {
    if (isArabicAnxietyPage()) return '/topic-anxiety.html';
    if (isFrenchAnxietyPage() || isChineseAnxietyPage()) return '/topic-anxiety.html';
    if (isFrenchHopePage() || isChineseHopePage()) return '/topic-hope.html';
    if (isFrenchLonelinessPage() || isChineseLonelinessPage()) return '/topic-loneliness.html';
    if (isFrenchGuiltPage() || isChineseGuiltPage()) return '/topic-guilt.html';
    if (isFrenchOverwhelmPage() || isChineseOverwhelmPage()) return '/topic-overwhelmed.html';
    var f = baseFile();
    if (ES_TO_EN[f]) return ES_TO_EN[f];
    if (ID_TO_EN[f]) return ID_TO_EN[f];
    if (TL_TO_EN[f]) return TL_TO_EN[f];
    if (isEnglishSurface()) {
      var path = pathnameNoQuery();
      if (path === '/' || path === '') return '/';
      return path;
    }
    return '/';
  }

  function esHref() {
    if (isArabicAnxietyPage()) return '/ansiedad.html';
    if (isFrenchAnxietyPage() || isChineseAnxietyPage()) return '/ansiedad.html';
    if (isFrenchHopePage() || isChineseHopePage() ||
      isFrenchLonelinessPage() || isChineseLonelinessPage() ||
      isFrenchGuiltPage() || isChineseGuiltPage() ||
      isFrenchOverwhelmPage() || isChineseOverwhelmPage()) return '/explore.html#topics-es';
    var f = baseFile();
    if (f === 'ansiedad.html' || f === 'fuerza.html' || f === 'paz.html') return '/' + f;
    if (EN_TO_ES[f]) return EN_TO_ES[f];
    if (ID_TO_ES[f]) return ID_TO_ES[f];
    if (TL_TO_ES[f]) return TL_TO_ES[f];
    return '/explore.html#topics-es';
  }

  function frHref() {
    if (isFrenchLonelinessPage()) return '/fr/solitude.html';
    if (isChineseLonelinessPage()) return '/fr/solitude.html';
    if (isLonelinessEquivalentBaseFile()) return '/fr/solitude.html';
    if (isFrenchGuiltPage()) return '/fr/culpabilite.html';
    if (isChineseGuiltPage()) return '/fr/culpabilite.html';
    if (isGuiltEquivalentBaseFile()) return '/fr/culpabilite.html';
    if (isFrenchOverwhelmPage()) return '/fr/deborde.html';
    if (isChineseOverwhelmPage()) return '/fr/deborde.html';
    if (isOverwhelmEquivalentBaseFile()) return '/fr/deborde.html';
    if (isFrenchHopePage()) return '/fr/espoir.html';
    if (isChineseHopePage()) return '/fr/espoir.html';
    if (isHopeEquivalentBaseFile()) return '/fr/espoir.html';
    if (isFrenchAnxietyPage()) return '/fr/anxiete.html';
    if (isChineseAnxietyPage()) return '/fr/anxiete.html';
    if (isArabicAnxietyPage()) return '/fr/anxiete.html';
    if (isAnxietyEquivalentBaseFile()) return '/fr/anxiete.html';
    return MORE_HUB;
  }

  function zhHref() {
    if (isChineseLonelinessPage()) return '/zh/gudu.html';
    if (isFrenchLonelinessPage()) return '/zh/gudu.html';
    if (isLonelinessEquivalentBaseFile()) return '/zh/gudu.html';
    if (isChineseGuiltPage()) return '/zh/neijiu.html';
    if (isFrenchGuiltPage()) return '/zh/neijiu.html';
    if (isGuiltEquivalentBaseFile()) return '/zh/neijiu.html';
    if (isChineseOverwhelmPage()) return '/zh/taiduo.html';
    if (isFrenchOverwhelmPage()) return '/zh/taiduo.html';
    if (isOverwhelmEquivalentBaseFile()) return '/zh/taiduo.html';
    if (isChineseHopePage()) return '/zh/xiwang.html';
    if (isFrenchHopePage()) return '/zh/xiwang.html';
    if (isHopeEquivalentBaseFile()) return '/zh/xiwang.html';
    if (isChineseAnxietyPage()) return '/zh/jiaolv.html';
    if (isFrenchAnxietyPage()) return '/zh/jiaolv.html';
    if (isArabicAnxietyPage()) return '/zh/jiaolv.html';
    if (isAnxietyEquivalentBaseFile()) return '/zh/jiaolv.html';
    return MORE_HUB;
  }

  function idHref() {
    if (isArabicAnxietyPage() || isFrenchAnxietyPage() || isChineseAnxietyPage()) return '/id/kecemasan.html';
    if (isFrenchHopePage() || isChineseHopePage() ||
      isFrenchLonelinessPage() || isChineseLonelinessPage() ||
      isFrenchGuiltPage() || isChineseGuiltPage() ||
      isFrenchOverwhelmPage() || isChineseOverwhelmPage()) return '/id/kecemasan.html';
    var f = baseFile();
    if (f === 'kecemasan.html') return '/id/kecemasan.html';
    if (f === 'kabalisahan.html') return '/id/kecemasan.html';
    if (EN_TO_ID[f]) return EN_TO_ID[f];
    if (ES_TO_ID[f]) return ES_TO_ID[f];
    return '/id/kecemasan.html';
  }

  function tlHref() {
    if (isArabicAnxietyPage() || isFrenchAnxietyPage() || isChineseAnxietyPage()) return '/tl/kabalisahan.html';
    if (isFrenchHopePage() || isChineseHopePage() ||
      isFrenchLonelinessPage() || isChineseLonelinessPage() ||
      isFrenchGuiltPage() || isChineseGuiltPage() ||
      isFrenchOverwhelmPage() || isChineseOverwhelmPage()) return '/tl/kabalisahan.html';
    var f = baseFile();
    if (f === 'kabalisahan.html') return '/tl/kabalisahan.html';
    if (EN_TO_TL[f]) return EN_TO_TL[f];
    if (ID_TO_TL[f]) return ID_TO_TL[f];
    return '/tl/kabalisahan.html';
  }

  function arHref() {
    if (isArabicAnxietyPage()) return '/ar/qalaq.html';
    if (isAnxietyEquivalentBaseFile()) return '/ar/qalaq.html';
    return MORE_HUB;
  }

  function moreHref() {
    if (isSpanishTopical()) return '/explore.html#topics-es';
    if (isIndonesianTopical() || isTagalogTopical() || isFrenchAnxietyPage() || isChineseAnxietyPage() ||
      isArabicAnxietyPage() ||
      isFrenchHopePage() || isChineseHopePage() ||
      isFrenchLonelinessPage() || isChineseLonelinessPage() ||
      isFrenchGuiltPage() || isChineseGuiltPage() ||
      isFrenchOverwhelmPage() || isChineseOverwhelmPage()) {
      return MORE_HUB;
    }
    return MORE_HUB;
  }

  function applyHrefs() {
    var nodes = document.querySelectorAll('[data-tdb-lang-switcher]');
    for (var i = 0; i < nodes.length; i++) {
      var root = nodes[i];
      var en = root.querySelector('[data-tdb-pick="en"]');
      var es = root.querySelector('[data-tdb-pick="es"]');
      var fr = root.querySelector('[data-tdb-pick="fr"]');
      var zh = root.querySelector('[data-tdb-pick="zh"]');
      var id = root.querySelector('[data-tdb-pick="id"]');
      var tl = root.querySelector('[data-tdb-pick="tl"]');
      var ar = root.querySelector('[data-tdb-pick="ar"]');
      var more = root.querySelector('.tdb-lang-more');
      if (en) en.setAttribute('href', enHref());
      if (es) es.setAttribute('href', esHref());
      if (fr) fr.setAttribute('href', frHref());
      if (zh) zh.setAttribute('href', zhHref());
      if (id) id.setAttribute('href', idHref());
      if (tl) tl.setAttribute('href', tlHref());
      if (ar) ar.setAttribute('href', arHref());
      if (more) more.setAttribute('href', moreHref());
    }
  }

  function applyAriaCurrent() {
    var spanish = isSpanishTopical();
    var indo = baseFile() === 'kecemasan.html';
    var tagalog = baseFile() === 'kabalisahan.html';
    var frenchAnx = isFrenchAnxietyPage();
    var chineseAnx = isChineseAnxietyPage();
    var arabicAnx = isArabicAnxietyPage();
    var frenchHope = isFrenchHopePage();
    var chineseHope = isChineseHopePage();
    var frenchLone = isFrenchLonelinessPage();
    var chineseLone = isChineseLonelinessPage();
    var frenchGuilt = isFrenchGuiltPage();
    var chineseGuilt = isChineseGuiltPage();
    var frenchOver = isFrenchOverwhelmPage();
    var chineseOver = isChineseOverwhelmPage();
    var nodes = document.querySelectorAll('[data-tdb-lang-switcher]');
    for (var i = 0; i < nodes.length; i++) {
      var en = nodes[i].querySelector('[data-tdb-pick="en"]');
      var es = nodes[i].querySelector('[data-tdb-pick="es"]');
      var fr = nodes[i].querySelector('[data-tdb-pick="fr"]');
      var zhPick = nodes[i].querySelector('[data-tdb-pick="zh"]');
      var id = nodes[i].querySelector('[data-tdb-pick="id"]');
      var tl = nodes[i].querySelector('[data-tdb-pick="tl"]');
      var arPick = nodes[i].querySelector('[data-tdb-pick="ar"]');
      if (en) en.removeAttribute('aria-current');
      if (es) es.removeAttribute('aria-current');
      if (fr) fr.removeAttribute('aria-current');
      if (zhPick) zhPick.removeAttribute('aria-current');
      if (id) id.removeAttribute('aria-current');
      if (tl) tl.removeAttribute('aria-current');
      if (arPick) arPick.removeAttribute('aria-current');
      if (chineseHope) {
        if (zhPick) zhPick.setAttribute('aria-current', 'true');
      } else if (frenchHope) {
        if (fr) fr.setAttribute('aria-current', 'true');
      } else if (chineseLone) {
        if (zhPick) zhPick.setAttribute('aria-current', 'true');
      } else if (frenchLone) {
        if (fr) fr.setAttribute('aria-current', 'true');
      } else if (chineseGuilt) {
        if (zhPick) zhPick.setAttribute('aria-current', 'true');
      } else if (frenchGuilt) {
        if (fr) fr.setAttribute('aria-current', 'true');
      } else if (chineseOver) {
        if (zhPick) zhPick.setAttribute('aria-current', 'true');
      } else if (frenchOver) {
        if (fr) fr.setAttribute('aria-current', 'true');
      } else if (chineseAnx) {
        if (zhPick) zhPick.setAttribute('aria-current', 'true');
      } else if (frenchAnx) {
        if (fr) fr.setAttribute('aria-current', 'true');
      } else if (arabicAnx) {
        if (arPick) arPick.setAttribute('aria-current', 'true');
      } else if (tagalog) {
        if (tl) tl.setAttribute('aria-current', 'true');
      } else if (indo) {
        if (id) id.setAttribute('aria-current', 'true');
      } else if (spanish) {
        if (es) es.setAttribute('aria-current', 'true');
      } else if (isEnglishSurface()) {
        if (en) en.setAttribute('aria-current', 'true');
      } else {
        if (en) en.setAttribute('aria-current', 'true');
      }
    }
  }

  function wirePreference() {
    document.addEventListener('click', function (e) {
      var t = e.target && e.target.closest ? e.target.closest('[data-tdb-pick]') : null;
      if (!t || !t.closest('[data-tdb-lang-switcher]')) return;
      var pick = t.getAttribute('data-tdb-pick');
      if (pick !== 'en' && pick !== 'es' && pick !== 'fr' && pick !== 'zh' && pick !== 'id' && pick !== 'tl' && pick !== 'ar') return;
      try {
        localStorage.setItem(STORAGE_KEY, pick);
      } catch (err) {}
    }, false);
  }

  function init() {
    applyHrefs();
    applyAriaCurrent();
    wirePreference();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
