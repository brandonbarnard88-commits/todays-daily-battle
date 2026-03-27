/**
 * Language switcher: EN · ES · FR · 中文 · ID · TL · AR · HI · RU · SV · PT · BN · SW + "More languages" hub (hubs: /es/, /fr/, /pt/).
 * Portuguese hub: /pt/ and /pt/index.html — ptHref default for unpaired pages is /pt/.
 * French hub: /fr/ and /fr/index.html — frHref stays /fr/; same anxiety-cluster defaults as PT hub for other picks.
 * Spanish hub: /es/ and /es/index.html — esHref stays /es/; root topical pages include ansiedad, fuerza, paz, miedo, soledad, culpa, agobio.
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

  /** PT mood/tool shells → French mood pages (Louis Segond on-page where applicable). */
  var PT_TO_FR = {
    '/pt/ansiedade.html': '/fr/anxiete.html',
    '/pt/esperanca.html': '/fr/espoir.html',
    '/pt/medo.html': '/fr/peur.html',
    '/pt/forca.html': '/fr/force.html',
    '/pt/paz.html': '/fr/paix.html',
    '/pt/solidao.html': '/fr/solitude.html',
    '/pt/culpa.html': '/fr/culpabilite.html',
    '/pt/sobrecarga.html': '/fr/deborde.html',
    '/pt/planos.html': '/fr/',
    '/pt/mural.html': '/fr/',
    '/pt/leitor.html': '/fr/',
    '/pt/criancas.html': '/fr/',
    '/pt/privacy.html': '/fr/',
    '/pt/terms.html': '/fr/'
  };

  /** PT → Spanish topical pages or /es/ hub. */
  var PT_TO_ES = {
    '/pt/ansiedade.html': '/ansiedad.html',
    '/pt/esperanca.html': '/es/',
    '/pt/medo.html': '/miedo.html',
    '/pt/forca.html': '/fuerza.html',
    '/pt/paz.html': '/paz.html',
    '/pt/solidao.html': '/soledad.html',
    '/pt/culpa.html': '/culpa.html',
    '/pt/sobrecarga.html': '/agobio.html',
    '/pt/planos.html': '/es/',
    '/pt/mural.html': '/es/',
    '/pt/leitor.html': '/es/',
    '/pt/criancas.html': '/es/',
    '/pt/privacy.html': '/es/',
    '/pt/terms.html': '/es/'
  };

  /** PT → Chinese mood pilots (hope → 希望). */
  var PT_TO_ZH = {
    '/pt/ansiedade.html': '/zh/jiaolv.html',
    '/pt/esperanca.html': '/zh/xiwang.html',
    '/pt/medo.html': '/zh/jiaolv.html',
    '/pt/forca.html': '/zh/jiaolv.html',
    '/pt/paz.html': '/zh/jiaolv.html',
    '/pt/solidao.html': '/zh/gudu.html',
    '/pt/culpa.html': '/zh/neijiu.html',
    '/pt/sobrecarga.html': '/zh/taiduo.html',
    '/pt/planos.html': '/zh/jiaolv.html',
    '/pt/mural.html': '/zh/jiaolv.html',
    '/pt/leitor.html': '/zh/jiaolv.html',
    '/pt/criancas.html': '/zh/jiaolv.html',
    '/pt/privacy.html': '/zh/jiaolv.html',
    '/pt/terms.html': '/zh/jiaolv.html'
  };

  /** French mood pilots → English equivalents. */
  var FR_TO_EN = {
    '/fr/anxiete.html': '/topic-anxiety.html',
    '/fr/espoir.html': '/topic-hope.html',
    '/fr/solitude.html': '/topic-loneliness.html',
    '/fr/culpabilite.html': '/topic-guilt.html',
    '/fr/deborde.html': '/topic-overwhelmed.html',
    '/fr/peur.html': '/topic-fear.html',
    '/fr/force.html': '/topic-strength.html',
    '/fr/paix.html': '/calm.html'
  };

  /** French mood pilots → Spanish topical or hub. */
  var FR_TO_ES = {
    '/fr/anxiete.html': '/ansiedad.html',
    '/fr/espoir.html': '/es/',
    '/fr/solitude.html': '/soledad.html',
    '/fr/culpabilite.html': '/culpa.html',
    '/fr/deborde.html': '/agobio.html',
    '/fr/peur.html': '/miedo.html',
    '/fr/force.html': '/fuerza.html',
    '/fr/paix.html': '/paz.html'
  };

  /** French mood pilots → Portuguese equivalents. */
  var FR_TO_PT = {
    '/fr/anxiete.html': '/pt/ansiedade.html',
    '/fr/espoir.html': '/pt/esperanca.html',
    '/fr/solitude.html': '/pt/solidao.html',
    '/fr/culpabilite.html': '/pt/culpa.html',
    '/fr/deborde.html': '/pt/sobrecarga.html',
    '/fr/peur.html': '/pt/medo.html',
    '/fr/force.html': '/pt/forca.html',
    '/fr/paix.html': '/pt/paz.html'
  };

  /** Root-level Spanish mood pages → French pilots. */
  var ES_TO_FR = {
    '/miedo.html': '/fr/peur.html',
    '/soledad.html': '/fr/solitude.html',
    '/culpa.html': '/fr/culpabilite.html',
    '/agobio.html': '/fr/deborde.html',
    '/ansiedad.html': '/fr/anxiete.html',
    '/fuerza.html': '/fr/force.html',
    '/paz.html': '/fr/paix.html'
  };

  /** Root-level Spanish mood pages → Portuguese equivalents. */
  var ES_TO_PT = {
    '/miedo.html': '/pt/medo.html',
    '/soledad.html': '/pt/solidao.html',
    '/culpa.html': '/pt/culpa.html',
    '/agobio.html': '/pt/sobrecarga.html',
    '/ansiedad.html': '/pt/ansiedade.html',
    '/fuerza.html': '/pt/forca.html',
    '/paz.html': '/pt/paz.html'
  };

  var ES_TO_EN = {
    'ansiedad.html': '/topic-anxiety.html',
    'fuerza.html': '/topic-strength.html',
    'paz.html': '/calm.html',
    'miedo.html': '/topic-fear.html',
    'soledad.html': '/topic-loneliness.html',
    'culpa.html': '/topic-guilt.html',
    'agobio.html': '/topic-overwhelmed.html'
  };

  var EN_TO_ES = {
    'topic-anxiety.html': '/ansiedad.html',
    'topic-strength.html': '/fuerza.html',
    'calm.html': '/paz.html',
    'topic-fear.html': '/miedo.html',
    'topic-loneliness.html': '/soledad.html',
    'topic-guilt.html': '/culpa.html',
    'topic-overwhelmed.html': '/agobio.html'
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
    'ansiedad.html': '/id/kecemasan.html',
    'miedo.html': '/id/kecemasan.html',
    'soledad.html': '/id/kecemasan.html',
    'culpa.html': '/id/kecemasan.html',
    'agobio.html': '/id/kecemasan.html',
    'fuerza.html': '/id/kecemasan.html',
    'paz.html': '/id/kecemasan.html'
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

  /** Spanish root mood pages → Tagalog anxiety pilot (cluster default). */
  var ES_TO_TL = {
    'miedo.html': '/tl/kabalisahan.html',
    'soledad.html': '/tl/kabalisahan.html',
    'culpa.html': '/tl/kabalisahan.html',
    'agobio.html': '/tl/kabalisahan.html',
    'fuerza.html': '/tl/kabalisahan.html',
    'paz.html': '/tl/kabalisahan.html'
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

  /** PT, FR, or ES hub: same cross-language defaults for anxiety-cluster locales. */
  function isLocaleHubCluster() {
    return isPortugueseHub() || isFrenchHub() || isSpanishHub();
  }

  /** Spanish landing hub (folder index). */
  function isSpanishHub() {
    var p = pathnameNoQuery();
    return p === '/es' || p === '/es/index.html';
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

  /** FR depth pilots: peur / force / paix (Louis Segond on-page). */
  function isFrenchExtraMoodPilot() {
    var p = pathnameNoQuery();
    return p === '/fr/peur.html' || p === '/fr/force.html' || p === '/fr/paix.html';
  }

  function isChineseOverwhelmPage() {
    return pathnameNoQuery() === '/zh/taiduo.html';
  }

  function isSpanishTopical() {
    var f = baseFile();
    return f === 'ansiedad.html' || f === 'fuerza.html' || f === 'paz.html' ||
      f === 'miedo.html' || f === 'soledad.html' || f === 'culpa.html' || f === 'agobio.html';
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
    if (isFrenchHub() || isSpanishHub()) return '/';
    var ptEq = PT_TO_EN[pathnameNoQuery()];
    if (ptEq) return ptEq;
    var frEq = FR_TO_EN[pathnameNoQuery()];
    if (frEq) return frEq;
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
    if (isSpanishHub()) return '/es/';
    if (isPortugueseHub() || isFrenchHub()) return '/es/';
    var frEs = FR_TO_ES[pEs];
    if (frEs) return frEs;
    if (pEs.indexOf('/pt/') === 0 && PT_TO_ES[pEs]) return PT_TO_ES[pEs];
    if (isArabicAnxietyPage() || isHindiAnxietyPage() || isRussianAnxietyPage() ||
      isSwedishAnxietyPage() || isPortugueseAnxietyPage() || isBengaliAnxietyPage() ||
      isSwahiliAnxietyPage()) return '/ansiedad.html';
    if (isFrenchAnxietyPage() || isChineseAnxietyPage()) return '/ansiedad.html';
    if (isHopeEquivalentPath() ||
      isFrenchLonelinessPage() || isChineseLonelinessPage() ||
      isFrenchGuiltPage() || isChineseGuiltPage() ||
      isFrenchOverwhelmPage() || isChineseOverwhelmPage()) return '/explore.html#topics-es';
    var f = baseFile();
    if (f === 'ansiedad.html' || f === 'fuerza.html' || f === 'paz.html' ||
      f === 'miedo.html' || f === 'soledad.html' || f === 'culpa.html' || f === 'agobio.html') return '/' + f;
    if (EN_TO_ES[f]) return EN_TO_ES[f];
    if (ID_TO_ES[f]) return ID_TO_ES[f];
    if (TL_TO_ES[f]) return TL_TO_ES[f];
    if (pEs === '/' || pEs === '/index.html') return '/es/';
    return '/explore.html#topics-es';
  }

  function frHref() {
    var pFr = pathnameNoQuery();
    if (isSpanishHub()) return '/fr/';
    if (isFrenchHub()) return '/fr/';
    var esFr = ES_TO_FR[pFr];
    if (esFr) return esFr;
    if (pFr.indexOf('/pt/') === 0 && PT_TO_FR[pFr]) return PT_TO_FR[pFr];
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
    if (baseFile() === 'topic-fear.html') return '/fr/peur.html';
    if (baseFile() === 'topic-strength.html') return '/fr/force.html';
    if (pFr === '/calm.html') return '/fr/paix.html';
    if (pFr === '/' || pFr === '/index.html') return '/fr/';
    return MORE_HUB;
  }

  function zhHref() {
    var pZh = pathnameNoQuery();
    if (PT_TO_ZH[pZh]) return PT_TO_ZH[pZh];
    if (isFrenchExtraMoodPilot()) return '/zh/jiaolv.html';
    if (isLocaleHubCluster()) return '/zh/jiaolv.html';
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
    if (isFrenchHub() || isSpanishHub()) return '/id/kecemasan.html';
    if (pathnameNoQuery() === '/id/harapan.html') return '/id/harapan.html';
    if (isHopeEquivalentPath()) return '/id/harapan.html';
    if (isArabicAnxietyPage() || isHindiAnxietyPage() || isFrenchAnxietyPage() || isChineseAnxietyPage() ||
      isRussianAnxietyPage() || isSwedishAnxietyPage() || isPortugueseAnxietyPage() ||
      isBengaliAnxietyPage() || isSwahiliAnxietyPage() || isFrenchExtraMoodPilot()) return '/id/kecemasan.html';
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
    if (isFrenchHub() || isSpanishHub()) return '/tl/kabalisahan.html';
    if (pathnameNoQuery() === '/tl/pagasa.html') return '/tl/pagasa.html';
    if (isHopeEquivalentPath()) return '/tl/pagasa.html';
    if (isArabicAnxietyPage() || isHindiAnxietyPage() || isFrenchAnxietyPage() || isChineseAnxietyPage() ||
      isRussianAnxietyPage() || isSwedishAnxietyPage() || isPortugueseAnxietyPage() ||
      isBengaliAnxietyPage() || isSwahiliAnxietyPage() || isFrenchExtraMoodPilot()) return '/tl/kabalisahan.html';
    if (isFrenchLonelinessPage() || isChineseLonelinessPage() ||
      isFrenchGuiltPage() || isChineseGuiltPage() ||
      isFrenchOverwhelmPage() || isChineseOverwhelmPage()) return '/tl/kabalisahan.html';
    var f = baseFile();
    if (f === 'kabalisahan.html') return '/tl/kabalisahan.html';
    if (EN_TO_TL[f]) return EN_TO_TL[f];
    if (ID_TO_TL[f]) return ID_TO_TL[f];
    if (ES_TO_TL[f]) return ES_TO_TL[f];
    return '/tl/kabalisahan.html';
  }

  function arHref() {
    if (PT_TO_EN[pathnameNoQuery()]) return '/ar/qalaq.html';
    if (isLocaleHubCluster()) return '/ar/qalaq.html';
    if (pathnameNoQuery() === '/ar/rajaa.html') return '/ar/rajaa.html';
    if (isHopeEquivalentPath()) return '/ar/rajaa.html';
    if (isArabicAnxietyPage()) return '/ar/qalaq.html';
    if (isAnxietyEquivalentPath()) return '/ar/qalaq.html';
    return MORE_HUB;
  }

  function hiHref() {
    if (PT_TO_EN[pathnameNoQuery()]) return '/hi/chinta.html';
    if (isLocaleHubCluster()) return '/hi/chinta.html';
    if (pathnameNoQuery() === '/hi/asha.html') return '/hi/asha.html';
    if (isHopeEquivalentPath()) return '/hi/asha.html';
    if (isHindiAnxietyPage()) return '/hi/chinta.html';
    if (isAnxietyEquivalentPath()) return '/hi/chinta.html';
    return MORE_HUB;
  }

  function ruHref() {
    if (PT_TO_EN[pathnameNoQuery()]) return '/ru/trevoga.html';
    if (isLocaleHubCluster()) return '/ru/trevoga.html';
    if (pathnameNoQuery() === '/ru/nadezhda.html') return '/ru/nadezhda.html';
    if (isHopeEquivalentPath()) return '/ru/nadezhda.html';
    if (isRussianAnxietyPage()) return '/ru/trevoga.html';
    if (isAnxietyEquivalentPath()) return '/ru/trevoga.html';
    return MORE_HUB;
  }

  function svHref() {
    if (PT_TO_EN[pathnameNoQuery()]) return '/sv/oro.html';
    if (isLocaleHubCluster()) return '/sv/oro.html';
    if (pathnameNoQuery() === '/sv/hopp.html') return '/sv/hopp.html';
    if (isHopeEquivalentPath()) return '/sv/hopp.html';
    if (isSwedishAnxietyPage()) return '/sv/oro.html';
    if (isAnxietyEquivalentPath()) return '/sv/oro.html';
    return MORE_HUB;
  }

  function ptHref() {
    var curPt = pathnameNoQuery();
    if (isFrenchHub() || isSpanishHub()) return '/pt/';
    if (isPortugueseHub()) return '/pt/';
    if (FR_TO_PT[curPt]) return FR_TO_PT[curPt];
    if (ES_TO_PT[curPt]) return ES_TO_PT[curPt];
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
    if (isLocaleHubCluster()) return '/bn/chinta.html';
    if (pathnameNoQuery() === '/bn/asha.html') return '/bn/asha.html';
    if (isHopeEquivalentPath()) return '/bn/asha.html';
    if (isBengaliAnxietyPage()) return '/bn/chinta.html';
    if (isAnxietyEquivalentPath()) return '/bn/chinta.html';
    return MORE_HUB;
  }

  function swHref() {
    if (PT_TO_EN[pathnameNoQuery()]) return '/sw/wasiwasi.html';
    if (isLocaleHubCluster()) return '/sw/wasiwasi.html';
    if (pathnameNoQuery() === '/sw/tumaini.html') return '/sw/tumaini.html';
    if (isHopeEquivalentPath()) return '/sw/tumaini.html';
    if (isSwahiliAnxietyPage()) return '/sw/wasiwasi.html';
    if (isAnxietyEquivalentPath()) return '/sw/wasiwasi.html';
    return MORE_HUB;
  }

  function moreHref() {
    if (isSpanishTopical()) return '/explore.html#topics-es';
    if (isFrenchHub() || isSpanishHub()) return MORE_HUB;
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
      } else if (isSpanishHub()) {
        if (es) es.setAttribute('aria-current', 'true');
      } else if (isFrenchExtraMoodPilot()) {
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
