/**
 * Language switcher: EN · ES · FR · 中文 · ID · TL · AR · HI · RU · SV · PT · BN · SW + "More languages" hub.
 * Pairs topical pilots (anxiety in FR/ZH/AR/HI/RU/SV/PT/BN/SW + ES/ID/TL; hope/loneliness/guilt/overwhelm FR/ZH); persists tdb_lang_pref on explicit picks.
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

  function isHindiAnxietyPage() {
    return pathnameNoQuery() === '/hi/chinta.html';
  }

  function isRussianAnxietyPage() {
    return pathnameNoQuery() === '/ru/trevoga.html';
  }

  function isSwedishAnxietyPage() {
    return pathnameNoQuery() === '/sv/oro.html';
  }

  function isPortugueseAnxietyPage() {
    return pathnameNoQuery() === '/pt/ansiedade.html';
  }

  function isBengaliAnxietyPage() {
    return pathnameNoQuery() === '/bn/chinta.html';
  }

  function isSwahiliAnxietyPage() {
    return pathnameNoQuery() === '/sw/wasiwasi.html';
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
    if (l === 'es' || l === 'id' || l === 'tl' || l === 'fr' || l === 'ar' || l === 'hi' ||
      l === 'ru' || l === 'sv' || l === 'pt' || l === 'bn' || l === 'sw') return false;
    if (l.indexOf('zh') === 0) return false;
    return true;
  }

  /** Anxiety topic equivalence by full path (not basename — /hi/chinta vs /bn/chinta). */
  function isAnxietyEquivalentPath() {
    var p = pathnameNoQuery();
    return p === '/topic-anxiety.html' || p === '/ansiedad.html' || p === '/id/kecemasan.html' ||
      p === '/tl/kabalisahan.html' || p === '/fr/anxiete.html' || p === '/zh/jiaolv.html' ||
      p === '/ar/qalaq.html' || p === '/hi/chinta.html' || p === '/ru/trevoga.html' ||
      p === '/sv/oro.html' || p === '/pt/ansiedade.html' || p === '/bn/chinta.html' ||
      p === '/sw/wasiwasi.html';
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
    if (isArabicAnxietyPage() || isHindiAnxietyPage() || isRussianAnxietyPage() ||
      isSwedishAnxietyPage() || isPortugueseAnxietyPage() || isBengaliAnxietyPage() ||
      isSwahiliAnxietyPage()) return '/topic-anxiety.html';
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
    if (isArabicAnxietyPage() || isHindiAnxietyPage() || isRussianAnxietyPage() ||
      isSwedishAnxietyPage() || isPortugueseAnxietyPage() || isBengaliAnxietyPage() ||
      isSwahiliAnxietyPage()) return '/ansiedad.html';
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
    if (isArabicAnxietyPage() || isHindiAnxietyPage() || isRussianAnxietyPage() ||
      isSwedishAnxietyPage() || isPortugueseAnxietyPage() || isBengaliAnxietyPage() ||
      isSwahiliAnxietyPage()) return '/fr/anxiete.html';
    if (isAnxietyEquivalentPath()) return '/fr/anxiete.html';
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
    if (isArabicAnxietyPage() || isHindiAnxietyPage() || isRussianAnxietyPage() ||
      isSwedishAnxietyPage() || isPortugueseAnxietyPage() || isBengaliAnxietyPage() ||
      isSwahiliAnxietyPage()) return '/zh/jiaolv.html';
    if (isAnxietyEquivalentPath()) return '/zh/jiaolv.html';
    return MORE_HUB;
  }

  function idHref() {
    if (isArabicAnxietyPage() || isHindiAnxietyPage() || isFrenchAnxietyPage() || isChineseAnxietyPage() ||
      isRussianAnxietyPage() || isSwedishAnxietyPage() || isPortugueseAnxietyPage() ||
      isBengaliAnxietyPage() || isSwahiliAnxietyPage()) return '/id/kecemasan.html';
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
    if (isArabicAnxietyPage() || isHindiAnxietyPage() || isFrenchAnxietyPage() || isChineseAnxietyPage() ||
      isRussianAnxietyPage() || isSwedishAnxietyPage() || isPortugueseAnxietyPage() ||
      isBengaliAnxietyPage() || isSwahiliAnxietyPage()) return '/tl/kabalisahan.html';
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
    if (isAnxietyEquivalentPath()) return '/ar/qalaq.html';
    return MORE_HUB;
  }

  function hiHref() {
    if (isHindiAnxietyPage()) return '/hi/chinta.html';
    if (isAnxietyEquivalentPath()) return '/hi/chinta.html';
    return MORE_HUB;
  }

  function ruHref() {
    if (isRussianAnxietyPage()) return '/ru/trevoga.html';
    if (isAnxietyEquivalentPath()) return '/ru/trevoga.html';
    return MORE_HUB;
  }

  function svHref() {
    if (isSwedishAnxietyPage()) return '/sv/oro.html';
    if (isAnxietyEquivalentPath()) return '/sv/oro.html';
    return MORE_HUB;
  }

  function ptHref() {
    if (isPortugueseAnxietyPage()) return '/pt/ansiedade.html';
    if (isAnxietyEquivalentPath()) return '/pt/ansiedade.html';
    return MORE_HUB;
  }

  function bnHref() {
    if (isBengaliAnxietyPage()) return '/bn/chinta.html';
    if (isAnxietyEquivalentPath()) return '/bn/chinta.html';
    return MORE_HUB;
  }

  function swHref() {
    if (isSwahiliAnxietyPage()) return '/sw/wasiwasi.html';
    if (isAnxietyEquivalentPath()) return '/sw/wasiwasi.html';
    return MORE_HUB;
  }

  function moreHref() {
    if (isSpanishTopical()) return '/explore.html#topics-es';
    if (isIndonesianTopical() || isTagalogTopical() || isFrenchAnxietyPage() || isChineseAnxietyPage() ||
      isArabicAnxietyPage() || isHindiAnxietyPage() || isRussianAnxietyPage() ||
      isSwedishAnxietyPage() || isPortugueseAnxietyPage() || isBengaliAnxietyPage() ||
      isSwahiliAnxietyPage() ||
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
      var hi = root.querySelector('[data-tdb-pick="hi"]');
      var ru = root.querySelector('[data-tdb-pick="ru"]');
      var sv = root.querySelector('[data-tdb-pick="sv"]');
      var pt = root.querySelector('[data-tdb-pick="pt"]');
      var bn = root.querySelector('[data-tdb-pick="bn"]');
      var sw = root.querySelector('[data-tdb-pick="sw"]');
      var more = root.querySelector('.tdb-lang-more');
      if (en) en.setAttribute('href', enHref());
      if (es) es.setAttribute('href', esHref());
      if (fr) fr.setAttribute('href', frHref());
      if (zh) zh.setAttribute('href', zhHref());
      if (id) id.setAttribute('href', idHref());
      if (tl) tl.setAttribute('href', tlHref());
      if (ar) ar.setAttribute('href', arHref());
      if (hi) hi.setAttribute('href', hiHref());
      if (ru) ru.setAttribute('href', ruHref());
      if (sv) sv.setAttribute('href', svHref());
      if (pt) pt.setAttribute('href', ptHref());
      if (bn) bn.setAttribute('href', bnHref());
      if (sw) sw.setAttribute('href', swHref());
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
    var hindiAnx = isHindiAnxietyPage();
    var russianAnx = isRussianAnxietyPage();
    var swedishAnx = isSwedishAnxietyPage();
    var portugueseAnx = isPortugueseAnxietyPage();
    var bengaliAnx = isBengaliAnxietyPage();
    var swahiliAnx = isSwahiliAnxietyPage();
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
      var hiPick = nodes[i].querySelector('[data-tdb-pick="hi"]');
      var ruPick = nodes[i].querySelector('[data-tdb-pick="ru"]');
      var svPick = nodes[i].querySelector('[data-tdb-pick="sv"]');
      var ptPick = nodes[i].querySelector('[data-tdb-pick="pt"]');
      var bnPick = nodes[i].querySelector('[data-tdb-pick="bn"]');
      var swPick = nodes[i].querySelector('[data-tdb-pick="sw"]');
      if (en) en.removeAttribute('aria-current');
      if (es) es.removeAttribute('aria-current');
      if (fr) fr.removeAttribute('aria-current');
      if (zhPick) zhPick.removeAttribute('aria-current');
      if (id) id.removeAttribute('aria-current');
      if (tl) tl.removeAttribute('aria-current');
      if (arPick) arPick.removeAttribute('aria-current');
      if (hiPick) hiPick.removeAttribute('aria-current');
      if (ruPick) ruPick.removeAttribute('aria-current');
      if (svPick) svPick.removeAttribute('aria-current');
      if (ptPick) ptPick.removeAttribute('aria-current');
      if (bnPick) bnPick.removeAttribute('aria-current');
      if (swPick) swPick.removeAttribute('aria-current');
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
      } else if (hindiAnx) {
        if (hiPick) hiPick.setAttribute('aria-current', 'true');
      } else if (russianAnx) {
        if (ruPick) ruPick.setAttribute('aria-current', 'true');
      } else if (swedishAnx) {
        if (svPick) svPick.setAttribute('aria-current', 'true');
      } else if (portugueseAnx) {
        if (ptPick) ptPick.setAttribute('aria-current', 'true');
      } else if (bengaliAnx) {
        if (bnPick) bnPick.setAttribute('aria-current', 'true');
      } else if (swahiliAnx) {
        if (swPick) swPick.setAttribute('aria-current', 'true');
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
      if (pick !== 'en' && pick !== 'es' && pick !== 'fr' && pick !== 'zh' && pick !== 'id' && pick !== 'tl' &&
        pick !== 'ar' && pick !== 'hi' && pick !== 'ru' && pick !== 'sv' && pick !== 'pt' && pick !== 'bn' &&
        pick !== 'sw') return;
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
