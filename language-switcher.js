/**
 * Language switcher: EN · ES · FR · 中文 · ID · TL · AR · HI · RU · SV · PT · BN · SW + "More languages" hub.
 * Portuguese hub: /pt/ and /pt/index.html — ptHref default for unpaired pages is /pt/.
 * French hub: /fr/ and /fr/index.html — frHref stays /fr/; same anxiety-cluster defaults as PT hub for other picks.
 * Pairs topical pilots (anxiety + hope in AR/HI/RU/SV/PT/BN/SW/ID/TL + FR/ZH/EN; loneliness/guilt/overwhelm FR/ZH); persists tdb_lang_pref on explicit picks.
 */
(function () {
  'use strict';

  var STORAGE_KEY = 'tdb_lang_pref';
  var MORE_HUB = '/explore.html#languages';

  /** Portuguese topic/tool shells (Tier 3a) ↔ English equivalents. Ansiedade/Esperança/hub stay special-cased. */
  var PT_TO_EN = {
    '/pt/medo.html': '/topic-fear.html',
    '/pt/forca.html': '/topic-strength.html',
    '/pt/paz.html': '/calm.html',
    '/pt/solidao.html': '/topic-loneliness.html',
    '/pt/culpa.html': '/topic-guilt.html',
    '/pt/sobrecarga.html': '/topic-overwhelmed.html',
    '/pt/planos.html': '/plans.html',
    '/pt/mural.html': '/message.html',
    '/pt/leitor.html': '/reader.html',
    '/pt/criancas.html': '/kids-corner.html',
    '/pt/privacy.html': '/privacy.html',
    '/pt/terms.html': '/terms.html'
  };

  var EN_TO_PT = {
    '/topic-fear.html': '/pt/medo.html',
    '/topic-strength.html': '/pt/forca.html',
    '/calm.html': '/pt/paz.html',
    '/topic-loneliness.html': '/pt/solidao.html',
    '/topic-guilt.html': '/pt/culpa.html',
    '/topic-overwhelmed.html': '/pt/sobrecarga.html',
    '/plans.html': '/pt/planos.html',
    '/message.html': '/pt/mural.html',
    '/reader.html': '/pt/leitor.html',
    '/kids-corner.html': '/pt/criancas.html',
    '/privacy.html': '/pt/privacy.html',
    '/terms.html': '/pt/terms.html'
  };

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
    'kecemasan.html': '/topic-anxiety.html',
    'harapan.html': '/topic-hope.html'
  };

  var EN_TO_ID = {
    'topic-anxiety.html': '/id/kecemasan.html',
    'topic-hope.html': '/id/harapan.html',
    'ansiedad.html': '/id/kecemasan.html'
  };

  var ID_TO_ES = {
    'kecemasan.html': '/ansiedad.html'
  };

  var ES_TO_ID = {
    'ansiedad.html': '/id/kecemasan.html'
  };

  var TL_TO_EN = {
    'kabalisahan.html': '/topic-anxiety.html',
    'pagasa.html': '/topic-hope.html'
  };

  var EN_TO_TL = {
    'topic-anxiety.html': '/tl/kabalisahan.html',
    'topic-hope.html': '/tl/pagasa.html',
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

  /** Portuguese landing hub (not a mood-door pilot). */
  function isPortugueseHub() {
    var p = pathnameNoQuery();
    return p === '/pt' || p === '/pt/index.html';
  }

  /** French landing hub (not a mood-door pilot). */
  function isFrenchHub() {
    var p = pathnameNoQuery();
    return p === '/fr' || p === '/fr/index.html';
  }

  /** PT or FR hub: same cross-language defaults for anxiety-cluster locales. */
  function isPortugueseOrFrenchHub() {
    return isPortugueseHub() || isFrenchHub();
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
    return baseFile() === 'kecemasan.html' || baseFile() === 'harapan.html' || docLang() === 'id';
  }

  function isTagalogTopical() {
    return baseFile() === 'kabalisahan.html' || baseFile() === 'pagasa.html' || docLang() === 'tl';
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

  /** Hope mood-door cluster: EN hub + FR/ZH + nine localized pilots. */
  function isHopeEquivalentPath() {
    var p = pathnameNoQuery();
    return p === '/topic-hope.html' || p === '/fr/espoir.html' || p === '/zh/xiwang.html' ||
      p === '/ar/rajaa.html' || p === '/hi/asha.html' || p === '/ru/nadezhda.html' ||
      p === '/sv/hopp.html' || p === '/pt/esperanca.html' || p === '/bn/asha.html' ||
      p === '/sw/tumaini.html' || p === '/id/harapan.html' || p === '/tl/pagasa.html';
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
    if (isFrenchHub()) return '/';
    var ptEq = PT_TO_EN[pathnameNoQuery()];
    if (ptEq) return ptEq;
    if (isArabicAnxietyPage() || isHindiAnxietyPage() || isRussianAnxietyPage() ||
      isSwedishAnxietyPage() || isPortugueseAnxietyPage() || isBengaliAnxietyPage() ||
      isSwahiliAnxietyPage()) return '/topic-anxiety.html';
    if (isFrenchAnxietyPage() || isChineseAnxietyPage()) return '/topic-anxiety.html';
    if (isHopeEquivalentPath() && pathnameNoQuery() !== '/topic-hope.html') return '/topic-hope.html';
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
    var pEs = pathnameNoQuery();
    if (isFrenchHub()) return '/explore.html#topics-es';
    if (pEs === '/pt/paz.html') return '/paz.html';
    if (pEs === '/pt/forca.html') return '/fuerza.html';
    if (PT_TO_EN[pEs] && pEs.indexOf('/pt/') === 0) return '/explore.html#topics-es';
    if (isArabicAnxietyPage() || isHindiAnxietyPage() || isRussianAnxietyPage() ||
      isSwedishAnxietyPage() || isPortugueseAnxietyPage() || isBengaliAnxietyPage() ||
      isSwahiliAnxietyPage()) return '/ansiedad.html';
    if (isFrenchAnxietyPage() || isChineseAnxietyPage()) return '/ansiedad.html';
    if (isHopeEquivalentPath() ||
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
    var pFr = pathnameNoQuery();
    if (isFrenchHub()) return '/fr/';
    if (pFr === '/pt/solidao.html') return '/fr/solitude.html';
    if (pFr === '/pt/culpa.html') return '/fr/culpabilite.html';
    if (pFr === '/pt/sobrecarga.html') return '/fr/deborde.html';
    if (PT_TO_EN[pFr] && pFr.indexOf('/pt/') === 0) return '/fr/anxiete.html';
    if (isPortugueseHub()) return '/fr/';
    if (isFrenchLonelinessPage()) return '/fr/solitude.html';
    if (isChineseLonelinessPage()) return '/fr/solitude.html';
    if (isLonelinessEquivalentBaseFile()) return '/fr/solitude.html';
    if (isFrenchGuiltPage()) return '/fr/culpabilite.html';
    if (isChineseGuiltPage()) return '/fr/culpabilite.html';
    if (isGuiltEquivalentBaseFile()) return '/fr/culpabilite.html';
    if (isFrenchOverwhelmPage()) return '/fr/deborde.html';
    if (isChineseOverwhelmPage()) return '/fr/deborde.html';
    if (isOverwhelmEquivalentBaseFile()) return '/fr/deborde.html';
    if (isHopeEquivalentPath()) return '/fr/espoir.html';
    if (isFrenchAnxietyPage()) return '/fr/anxiete.html';
    if (isChineseAnxietyPage()) return '/fr/anxiete.html';
    if (isArabicAnxietyPage() || isHindiAnxietyPage() || isRussianAnxietyPage() ||
      isSwedishAnxietyPage() || isPortugueseAnxietyPage() || isBengaliAnxietyPage() ||
      isSwahiliAnxietyPage()) return '/fr/anxiete.html';
    if (isAnxietyEquivalentPath()) return '/fr/anxiete.html';
    if (pFr === '/' || pFr === '/index.html') return '/fr/';
    return MORE_HUB;
  }

  function zhHref() {
    var pZh = pathnameNoQuery();
    if (pZh === '/pt/solidao.html') return '/zh/gudu.html';
    if (pZh === '/pt/culpa.html') return '/zh/neijiu.html';
    if (pZh === '/pt/sobrecarga.html') return '/zh/taiduo.html';
    if (PT_TO_EN[pZh] && pZh.indexOf('/pt/') === 0) return '/zh/jiaolv.html';
    if (isPortugueseOrFrenchHub()) return '/zh/jiaolv.html';
    if (isChineseLonelinessPage()) return '/zh/gudu.html';
    if (isFrenchLonelinessPage()) return '/zh/gudu.html';
    if (isLonelinessEquivalentBaseFile()) return '/zh/gudu.html';
    if (isChineseGuiltPage()) return '/zh/neijiu.html';
    if (isFrenchGuiltPage()) return '/zh/neijiu.html';
    if (isGuiltEquivalentBaseFile()) return '/zh/neijiu.html';
    if (isChineseOverwhelmPage()) return '/zh/taiduo.html';
    if (isFrenchOverwhelmPage()) return '/zh/taiduo.html';
    if (isOverwhelmEquivalentBaseFile()) return '/zh/taiduo.html';
    if (isHopeEquivalentPath()) return '/zh/xiwang.html';
    if (isChineseAnxietyPage()) return '/zh/jiaolv.html';
    if (isFrenchAnxietyPage()) return '/zh/jiaolv.html';
    if (isArabicAnxietyPage() || isHindiAnxietyPage() || isRussianAnxietyPage() ||
      isSwedishAnxietyPage() || isPortugueseAnxietyPage() || isBengaliAnxietyPage() ||
      isSwahiliAnxietyPage()) return '/zh/jiaolv.html';
    if (isAnxietyEquivalentPath()) return '/zh/jiaolv.html';
    return MORE_HUB;
  }

  function idHref() {
    if (PT_TO_EN[pathnameNoQuery()]) return '/id/kecemasan.html';
    if (isFrenchHub()) return '/id/kecemasan.html';
    if (pathnameNoQuery() === '/id/harapan.html') return '/id/harapan.html';
    if (isHopeEquivalentPath()) return '/id/harapan.html';
    if (isArabicAnxietyPage() || isHindiAnxietyPage() || isFrenchAnxietyPage() || isChineseAnxietyPage() ||
      isRussianAnxietyPage() || isSwedishAnxietyPage() || isPortugueseAnxietyPage() ||
      isBengaliAnxietyPage() || isSwahiliAnxietyPage()) return '/id/kecemasan.html';
    if (isFrenchLonelinessPage() || isChineseLonelinessPage() ||
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
    if (PT_TO_EN[pathnameNoQuery()]) return '/tl/kabalisahan.html';
    if (isFrenchHub()) return '/tl/kabalisahan.html';
    if (pathnameNoQuery() === '/tl/pagasa.html') return '/tl/pagasa.html';
    if (isHopeEquivalentPath()) return '/tl/pagasa.html';
    if (isArabicAnxietyPage() || isHindiAnxietyPage() || isFrenchAnxietyPage() || isChineseAnxietyPage() ||
      isRussianAnxietyPage() || isSwedishAnxietyPage() || isPortugueseAnxietyPage() ||
      isBengaliAnxietyPage() || isSwahiliAnxietyPage()) return '/tl/kabalisahan.html';
    if (isFrenchLonelinessPage() || isChineseLonelinessPage() ||
      isFrenchGuiltPage() || isChineseGuiltPage() ||
      isFrenchOverwhelmPage() || isChineseOverwhelmPage()) return '/tl/kabalisahan.html';
    var f = baseFile();
    if (f === 'kabalisahan.html') return '/tl/kabalisahan.html';
    if (EN_TO_TL[f]) return EN_TO_TL[f];
    if (ID_TO_TL[f]) return ID_TO_TL[f];
    return '/tl/kabalisahan.html';
  }

  function arHref() {
    if (PT_TO_EN[pathnameNoQuery()]) return '/ar/qalaq.html';
    if (isPortugueseOrFrenchHub()) return '/ar/qalaq.html';
    if (pathnameNoQuery() === '/ar/rajaa.html') return '/ar/rajaa.html';
    if (isHopeEquivalentPath()) return '/ar/rajaa.html';
    if (isArabicAnxietyPage()) return '/ar/qalaq.html';
    if (isAnxietyEquivalentPath()) return '/ar/qalaq.html';
    return MORE_HUB;
  }

  function hiHref() {
    if (PT_TO_EN[pathnameNoQuery()]) return '/hi/chinta.html';
    if (isPortugueseOrFrenchHub()) return '/hi/chinta.html';
    if (pathnameNoQuery() === '/hi/asha.html') return '/hi/asha.html';
    if (isHopeEquivalentPath()) return '/hi/asha.html';
    if (isHindiAnxietyPage()) return '/hi/chinta.html';
    if (isAnxietyEquivalentPath()) return '/hi/chinta.html';
    return MORE_HUB;
  }

  function ruHref() {
    if (PT_TO_EN[pathnameNoQuery()]) return '/ru/trevoga.html';
    if (isPortugueseOrFrenchHub()) return '/ru/trevoga.html';
    if (pathnameNoQuery() === '/ru/nadezhda.html') return '/ru/nadezhda.html';
    if (isHopeEquivalentPath()) return '/ru/nadezhda.html';
    if (isRussianAnxietyPage()) return '/ru/trevoga.html';
    if (isAnxietyEquivalentPath()) return '/ru/trevoga.html';
    return MORE_HUB;
  }

  function svHref() {
    if (PT_TO_EN[pathnameNoQuery()]) return '/sv/oro.html';
    if (isPortugueseOrFrenchHub()) return '/sv/oro.html';
    if (pathnameNoQuery() === '/sv/hopp.html') return '/sv/hopp.html';
    if (isHopeEquivalentPath()) return '/sv/hopp.html';
    if (isSwedishAnxietyPage()) return '/sv/oro.html';
    if (isAnxietyEquivalentPath()) return '/sv/oro.html';
    return MORE_HUB;
  }

  function ptHref() {
    var curPt = pathnameNoQuery();
    if (isFrenchHub()) return '/pt/';
    if (isPortugueseHub()) return '/pt/';
    if (PT_TO_EN[curPt]) return curPt;
    if (curPt === '/pt/esperanca.html') return '/pt/esperanca.html';
    if (isHopeEquivalentPath()) return '/pt/esperanca.html';
    if (isPortugueseAnxietyPage()) return '/pt/ansiedade.html';
    if (isAnxietyEquivalentPath()) return '/pt/ansiedade.html';
    if (EN_TO_PT[curPt]) return EN_TO_PT[curPt];
    return '/pt/';
  }

  function bnHref() {
    if (PT_TO_EN[pathnameNoQuery()]) return '/bn/chinta.html';
    if (isPortugueseOrFrenchHub()) return '/bn/chinta.html';
    if (pathnameNoQuery() === '/bn/asha.html') return '/bn/asha.html';
    if (isHopeEquivalentPath()) return '/bn/asha.html';
    if (isBengaliAnxietyPage()) return '/bn/chinta.html';
    if (isAnxietyEquivalentPath()) return '/bn/chinta.html';
    return MORE_HUB;
  }

  function swHref() {
    if (PT_TO_EN[pathnameNoQuery()]) return '/sw/wasiwasi.html';
    if (isPortugueseOrFrenchHub()) return '/sw/wasiwasi.html';
    if (pathnameNoQuery() === '/sw/tumaini.html') return '/sw/tumaini.html';
    if (isHopeEquivalentPath()) return '/sw/tumaini.html';
    if (isSwahiliAnxietyPage()) return '/sw/wasiwasi.html';
    if (isAnxietyEquivalentPath()) return '/sw/wasiwasi.html';
    return MORE_HUB;
  }

  function moreHref() {
    if (isSpanishTopical()) return '/explore.html#topics-es';
    if (isFrenchHub()) return MORE_HUB;
    if (isIndonesianTopical() || isTagalogTopical() || isFrenchAnxietyPage() || isChineseAnxietyPage() ||
      isArabicAnxietyPage() || isHindiAnxietyPage() || isRussianAnxietyPage() ||
      isSwedishAnxietyPage() || isPortugueseAnxietyPage() || isBengaliAnxietyPage() ||
      isSwahiliAnxietyPage() ||
      isHopeEquivalentPath() ||
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
    var p = pathnameNoQuery();
    var spanish = isSpanishTopical();
    var indo = baseFile() === 'kecemasan.html' || baseFile() === 'harapan.html';
    var tagalog = baseFile() === 'kabalisahan.html' || baseFile() === 'pagasa.html';
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
      if (p === '/ar/rajaa.html') {
        if (arPick) arPick.setAttribute('aria-current', 'true');
      } else if (p === '/hi/asha.html') {
        if (hiPick) hiPick.setAttribute('aria-current', 'true');
      } else if (p === '/ru/nadezhda.html') {
        if (ruPick) ruPick.setAttribute('aria-current', 'true');
      } else if (p === '/sv/hopp.html') {
        if (svPick) svPick.setAttribute('aria-current', 'true');
      } else if (p === '/pt/esperanca.html') {
        if (ptPick) ptPick.setAttribute('aria-current', 'true');
      } else if (isPortugueseHub()) {
        if (ptPick) ptPick.setAttribute('aria-current', 'true');
      } else if (isFrenchHub()) {
        if (fr) fr.setAttribute('aria-current', 'true');
      } else if (PT_TO_EN[p]) {
        if (ptPick) ptPick.setAttribute('aria-current', 'true');
      } else if (p === '/bn/asha.html') {
        if (bnPick) bnPick.setAttribute('aria-current', 'true');
      } else if (p === '/sw/tumaini.html') {
        if (swPick) swPick.setAttribute('aria-current', 'true');
      } else if (chineseHope) {
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
