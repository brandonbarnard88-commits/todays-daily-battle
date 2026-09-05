/**
 * Language switcher: main row is EN · ES · FR · PT + More → explore.html#languages. ID/RU/ZH/HI/AR/TL/SV/BN/SW pages stay live; pairing hrefs unchanged. Explore lists every additional entry.
 * Portuguese hub: /pt/ and /pt/index.html — ptHref default for unpaired pages is /pt/.
 * French hub: /fr/ and /fr/index.html — frHref stays /fr/; same anxiety-cluster defaults as PT hub for other picks.
 * Spanish hub: /es/ and /es/index.html — mood doors + tool shells live under /es/; root URLs 301.
 * Indonesian hub: /id/ and /id/index.html — thin pilot vs PT; default id pick → /id/.
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
    '/pt/planos.html': '/fr/plans.html',
    '/pt/mural.html': '/fr/mural.html',
    '/pt/leitor.html': '/fr/lecteur.html',
    '/pt/criancas.html': '/fr/enfants.html',
    '/pt/privacy.html': '/fr/',
    '/pt/terms.html': '/fr/'
  };

  /** PT → Spanish topical pages or /es/ hub. */
  var PT_TO_ES = {
    '/pt/ansiedade.html': '/es/ansiedad.html',
    '/pt/esperanca.html': '/es/esperanza.html',
    '/pt/medo.html': '/es/miedo.html',
    '/pt/forca.html': '/es/fuerza.html',
    '/pt/paz.html': '/es/paz.html',
    '/pt/solidao.html': '/es/soledad.html',
    '/pt/culpa.html': '/es/culpa.html',
    '/pt/sobrecarga.html': '/es/agobio.html',
    '/pt/planos.html': '/es/planes.html',
    '/pt/mural.html': '/es/muro.html',
    '/pt/leitor.html': '/es/lector.html',
    '/pt/criancas.html': '/es/ninos.html',
    '/pt/privacy.html': '/es/',
    '/pt/terms.html': '/es/'
  };

  /** PT → Chinese mood pilots (hope → 希望). */
  var PT_TO_ZH = {
    '/pt/ansiedade.html': '/zh/jiaolv.html',
    '/pt/esperanca.html': '/zh/xiwang.html',
    '/pt/medo.html': '/zh/kongju.html',
    '/pt/forca.html': '/zh/liliang.html',
    '/pt/paz.html': '/zh/heping.html',
    '/pt/solidao.html': '/zh/gudu.html',
    '/pt/culpa.html': '/zh/neijiu.html',
    '/pt/sobrecarga.html': '/zh/taiduo.html',
    '/pt/planos.html': '/zh/',
    '/pt/mural.html': '/zh/',
    '/pt/leitor.html': '/zh/',
    '/pt/criancas.html': '/zh/',
    '/pt/privacy.html': '/zh/',
    '/pt/terms.html': '/zh/'
  };

  /** RU / ZH / HI topical pilots → English equivalents (hubs use separate hub returns). */
  var LOCALE_TO_EN = {
    '/ru/trevoga.html': '/topic-anxiety.html',
    '/ru/nadezhda.html': '/topic-hope.html',
    '/ru/strakh.html': '/topic-fear.html',
    '/ru/sila.html': '/topic-strength.html',
    '/ru/mir.html': '/calm.html',
    '/ru/proshchenie.html': '/topic-forgiveness.html',
    '/ru/odinochestvo.html': '/topic-loneliness.html',
    '/zh/jiaolv.html': '/topic-anxiety.html',
    '/zh/xiwang.html': '/topic-hope.html',
    '/zh/gudu.html': '/topic-loneliness.html',
    '/zh/neijiu.html': '/topic-guilt.html',
    '/zh/taiduo.html': '/topic-overwhelmed.html',
    '/zh/kongju.html': '/topic-fear.html',
    '/zh/liliang.html': '/topic-strength.html',
    '/zh/heping.html': '/calm.html',
    '/zh/kuanshu.html': '/topic-forgiveness.html',
    '/hi/chinta.html': '/topic-anxiety.html',
    '/hi/asha.html': '/topic-hope.html',
    '/hi/dar.html': '/topic-fear.html',
    '/hi/shakti.html': '/topic-strength.html',
    '/hi/shanti.html': '/calm.html',
    '/hi/akelapan.html': '/topic-loneliness.html',
    '/hi/kshama.html': '/topic-forgiveness.html'
  };

  var LOCALE_TO_ES = {
    '/ru/trevoga.html': '/es/ansiedad.html',
    '/ru/nadezhda.html': '/es/esperanza.html',
    '/ru/strakh.html': '/es/miedo.html',
    '/ru/sila.html': '/es/fuerza.html',
    '/ru/mir.html': '/es/paz.html',
    '/ru/proshchenie.html': '/es/perdon.html',
    '/ru/odinochestvo.html': '/es/soledad.html',
    '/zh/jiaolv.html': '/es/ansiedad.html',
    '/zh/xiwang.html': '/es/esperanza.html',
    '/zh/gudu.html': '/es/soledad.html',
    '/zh/neijiu.html': '/es/culpa.html',
    '/zh/taiduo.html': '/es/agobio.html',
    '/zh/kongju.html': '/es/miedo.html',
    '/zh/liliang.html': '/es/fuerza.html',
    '/zh/heping.html': '/es/paz.html',
    '/zh/kuanshu.html': '/es/perdon.html',
    '/hi/chinta.html': '/es/ansiedad.html',
    '/hi/asha.html': '/es/esperanza.html',
    '/hi/dar.html': '/es/miedo.html',
    '/hi/shakti.html': '/es/fuerza.html',
    '/hi/shanti.html': '/es/paz.html',
    '/hi/akelapan.html': '/es/soledad.html',
    '/hi/kshama.html': '/es/perdon.html'
  };

  var LOCALE_TO_FR = {
    '/ru/trevoga.html': '/fr/anxiete.html',
    '/ru/nadezhda.html': '/fr/espoir.html',
    '/ru/strakh.html': '/fr/peur.html',
    '/ru/sila.html': '/fr/force.html',
    '/ru/mir.html': '/fr/paix.html',
    '/ru/proshchenie.html': '/fr/pardon.html',
    '/ru/odinochestvo.html': '/fr/solitude.html',
    '/zh/jiaolv.html': '/fr/anxiete.html',
    '/zh/xiwang.html': '/fr/espoir.html',
    '/zh/gudu.html': '/fr/solitude.html',
    '/zh/neijiu.html': '/fr/culpabilite.html',
    '/zh/taiduo.html': '/fr/deborde.html',
    '/zh/kongju.html': '/fr/peur.html',
    '/zh/liliang.html': '/fr/force.html',
    '/zh/heping.html': '/fr/paix.html',
    '/zh/kuanshu.html': '/fr/pardon.html',
    '/hi/chinta.html': '/fr/anxiete.html',
    '/hi/asha.html': '/fr/espoir.html',
    '/hi/dar.html': '/fr/peur.html',
    '/hi/shakti.html': '/fr/force.html',
    '/hi/shanti.html': '/fr/paix.html',
    '/hi/akelapan.html': '/fr/solitude.html',
    '/hi/kshama.html': '/fr/pardon.html'
  };

  var LOCALE_TO_PT = {
    '/ru/trevoga.html': '/pt/ansiedade.html',
    '/ru/nadezhda.html': '/pt/esperanca.html',
    '/ru/strakh.html': '/pt/medo.html',
    '/ru/sila.html': '/pt/forca.html',
    '/ru/mir.html': '/pt/paz.html',
    '/ru/proshchenie.html': '/pt/',
    '/ru/odinochestvo.html': '/pt/solidao.html',
    '/zh/jiaolv.html': '/pt/ansiedade.html',
    '/zh/xiwang.html': '/pt/esperanca.html',
    '/zh/gudu.html': '/pt/solidao.html',
    '/zh/neijiu.html': '/pt/culpa.html',
    '/zh/taiduo.html': '/pt/sobrecarga.html',
    '/zh/kongju.html': '/pt/medo.html',
    '/zh/liliang.html': '/pt/forca.html',
    '/zh/heping.html': '/pt/paz.html',
    '/zh/kuanshu.html': '/pt/',
    '/hi/chinta.html': '/pt/ansiedade.html',
    '/hi/asha.html': '/pt/esperanca.html',
    '/hi/dar.html': '/pt/medo.html',
    '/hi/shakti.html': '/pt/forca.html',
    '/hi/shanti.html': '/pt/paz.html',
    '/hi/akelapan.html': '/pt/solidao.html',
    '/hi/kshama.html': '/pt/'
  };

  var LOCALE_TO_ZH = {
    '/ru/trevoga.html': '/zh/jiaolv.html',
    '/ru/nadezhda.html': '/zh/xiwang.html',
    '/ru/strakh.html': '/zh/kongju.html',
    '/ru/sila.html': '/zh/liliang.html',
    '/ru/mir.html': '/zh/heping.html',
    '/ru/proshchenie.html': '/zh/kuanshu.html',
    '/ru/odinochestvo.html': '/zh/gudu.html',
    '/hi/chinta.html': '/zh/jiaolv.html',
    '/hi/asha.html': '/zh/xiwang.html',
    '/hi/dar.html': '/zh/kongju.html',
    '/hi/shakti.html': '/zh/liliang.html',
    '/hi/shanti.html': '/zh/heping.html',
    '/hi/kshama.html': '/zh/kuanshu.html',
    '/hi/akelapan.html': '/zh/gudu.html',
    '/paz.html': '/zh/heping.html',
    '/fr/paix.html': '/zh/heping.html',
    '/calm.html': '/zh/heping.html',
    '/pt/paz.html': '/zh/heping.html'
  };

  var LOCALE_TO_RU = {
    '/zh/jiaolv.html': '/ru/trevoga.html',
    '/zh/xiwang.html': '/ru/nadezhda.html',
    '/zh/gudu.html': '/ru/odinochestvo.html',
    '/zh/neijiu.html': '/ru/trevoga.html',
    '/zh/taiduo.html': '/ru/trevoga.html',
    '/zh/kongju.html': '/ru/strakh.html',
    '/zh/liliang.html': '/ru/sila.html',
    '/zh/heping.html': '/ru/mir.html',
    '/zh/kuanshu.html': '/ru/proshchenie.html',
    '/hi/chinta.html': '/ru/trevoga.html',
    '/hi/asha.html': '/ru/nadezhda.html',
    '/hi/dar.html': '/ru/strakh.html',
    '/hi/shakti.html': '/ru/sila.html',
    '/hi/shanti.html': '/ru/mir.html',
    '/hi/kshama.html': '/ru/proshchenie.html',
    '/hi/akelapan.html': '/ru/odinochestvo.html',
    '/paz.html': '/ru/mir.html',
    '/fr/paix.html': '/ru/mir.html'
  };

  var LOCALE_TO_HI = {
    '/ru/trevoga.html': '/hi/chinta.html',
    '/ru/nadezhda.html': '/hi/asha.html',
    '/ru/strakh.html': '/hi/dar.html',
    '/ru/sila.html': '/hi/shakti.html',
    '/ru/mir.html': '/hi/shanti.html',
    '/ru/proshchenie.html': '/hi/kshama.html',
    '/ru/odinochestvo.html': '/hi/akelapan.html',
    '/zh/jiaolv.html': '/hi/chinta.html',
    '/zh/xiwang.html': '/hi/asha.html',
    '/zh/gudu.html': '/hi/akelapan.html',
    '/zh/neijiu.html': '/hi/chinta.html',
    '/zh/taiduo.html': '/hi/chinta.html',
    '/zh/kongju.html': '/hi/dar.html',
    '/zh/liliang.html': '/hi/shakti.html',
    '/zh/heping.html': '/hi/shanti.html',
    '/zh/kuanshu.html': '/hi/kshama.html',
    '/ru/proshchenie.html': '/hi/kshama.html',
    '/paz.html': '/hi/shanti.html',
    '/fr/paix.html': '/hi/shanti.html'
  };

  var LOCALE_TO_ID = {
    '/ru/trevoga.html': '/id/kecemasan.html',
    '/ru/nadezhda.html': '/id/harapan.html',
    '/ru/strakh.html': '/id/ketakutan.html',
    '/ru/sila.html': '/id/kecemasan.html',
    '/ru/mir.html': '/id/kecemasan.html',
    '/ru/proshchenie.html': '/id/',
    '/ru/odinochestvo.html': '/id/kecemasan.html',
    '/zh/jiaolv.html': '/id/kecemasan.html',
    '/zh/xiwang.html': '/id/harapan.html',
    '/zh/gudu.html': '/id/kecemasan.html',
    '/zh/neijiu.html': '/id/kecemasan.html',
    '/zh/taiduo.html': '/id/kecemasan.html',
    '/zh/kongju.html': '/id/ketakutan.html',
    '/zh/liliang.html': '/id/kecemasan.html',
    '/zh/heping.html': '/id/kecemasan.html',
    '/zh/kuanshu.html': '/id/',
    '/hi/chinta.html': '/id/kecemasan.html',
    '/hi/asha.html': '/id/harapan.html',
    '/hi/dar.html': '/id/ketakutan.html',
    '/hi/shakti.html': '/id/kecemasan.html',
    '/hi/shanti.html': '/id/kecemasan.html',
    '/hi/akelapan.html': '/id/kecemasan.html',
    '/hi/kshama.html': '/id/'
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
    '/fr/paix.html': '/calm.html',
    '/fr/colere.html': '/explore.html',
    '/fr/tristesse.html': '/topic-grief.html',
    '/fr/pardon.html': '/topic-forgiveness.html',
    '/fr/plans.html': '/plans.html',
    '/fr/mural.html': '/message.html',
    '/fr/lecteur.html': '/reader.html',
    '/fr/enfants.html': '/kids-corner.html'
  };

  /** French mood pilots → Spanish topical or hub. */
  var FR_TO_ES = {
    '/fr/anxiete.html': '/es/ansiedad.html',
    '/fr/espoir.html': '/es/esperanza.html',
    '/fr/solitude.html': '/es/soledad.html',
    '/fr/culpabilite.html': '/es/culpa.html',
    '/fr/deborde.html': '/es/agobio.html',
    '/fr/peur.html': '/es/miedo.html',
    '/fr/force.html': '/es/fuerza.html',
    '/fr/paix.html': '/es/paz.html',
    '/fr/colere.html': '/es/ira.html',
    '/fr/tristesse.html': '/es/duelo.html',
    '/fr/pardon.html': '/es/perdon.html',
    '/fr/plans.html': '/es/planes.html',
    '/fr/mural.html': '/es/muro.html',
    '/fr/lecteur.html': '/es/lector.html',
    '/fr/enfants.html': '/es/ninos.html'
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
    '/fr/paix.html': '/pt/paz.html',
    '/fr/colere.html': '/pt/',
    '/fr/tristesse.html': '/pt/esperanca.html',
    '/fr/pardon.html': '/pt/',
    '/fr/plans.html': '/pt/planos.html',
    '/fr/mural.html': '/pt/mural.html',
    '/fr/lecteur.html': '/pt/leitor.html',
    '/fr/enfants.html': '/pt/criancas.html'
  };

  /** Root-level Spanish mood pages → French pilots. */
  var ES_TO_FR = {
    '/miedo.html': '/fr/peur.html',
    '/soledad.html': '/fr/solitude.html',
    '/culpa.html': '/fr/culpabilite.html',
    '/agobio.html': '/fr/deborde.html',
    '/ansiedad.html': '/fr/anxiete.html',
    '/fuerza.html': '/fr/force.html',
    '/paz.html': '/fr/paix.html',
    '/esperanza.html': '/fr/espoir.html',
    '/ira.html': '/fr/colere.html',
    '/duelo.html': '/fr/tristesse.html',
    '/perdon.html': '/fr/pardon.html',
    '/planes.html': '/fr/plans.html',
    '/muro.html': '/fr/mural.html',
    '/lector.html': '/fr/lecteur.html',
    '/ninos.html': '/fr/enfants.html'
  };

  /** Root-level Spanish mood pages → Portuguese equivalents. */
  var ES_TO_PT = {
    '/miedo.html': '/pt/medo.html',
    '/soledad.html': '/pt/solidao.html',
    '/culpa.html': '/pt/culpa.html',
    '/agobio.html': '/pt/sobrecarga.html',
    '/ansiedad.html': '/pt/ansiedade.html',
    '/fuerza.html': '/pt/forca.html',
    '/paz.html': '/pt/paz.html',
    '/esperanza.html': '/pt/esperanca.html',
    '/ira.html': '/pt/',
    '/duelo.html': '/pt/esperanca.html',
    '/perdon.html': '/pt/',
    '/planes.html': '/pt/planos.html',
    '/muro.html': '/pt/mural.html',
    '/lector.html': '/pt/leitor.html',
    '/ninos.html': '/pt/criancas.html'
  };

  var ES_TO_EN = {
    'ansiedad.html': '/topic-anxiety.html',
    'fuerza.html': '/topic-strength.html',
    'paz.html': '/calm.html',
    'miedo.html': '/topic-fear.html',
    'soledad.html': '/topic-loneliness.html',
    'culpa.html': '/topic-guilt.html',
    'agobio.html': '/topic-overwhelmed.html',
    'esperanza.html': '/topic-hope.html',
    'ira.html': '/explore.html',
    'duelo.html': '/topic-grief.html',
    'perdon.html': '/topic-forgiveness.html',
    'planes.html': '/plans.html',
    'muro.html': '/message.html',
    'lector.html': '/reader.html',
    'ninos.html': '/kids-corner.html'
  };

  var EN_TO_ES = {
    'topic-anxiety.html': '/es/ansiedad.html',
    'topic-strength.html': '/es/fuerza.html',
    'calm.html': '/es/paz.html',
    'topic-fear.html': '/es/miedo.html',
    'topic-loneliness.html': '/es/soledad.html',
    'topic-guilt.html': '/es/culpa.html',
    'topic-overwhelmed.html': '/es/agobio.html',
    'topic-hope.html': '/es/esperanza.html',
    'topic-grief.html': '/es/duelo.html',
    'topic-forgiveness.html': '/es/perdon.html',
    'plans.html': '/es/planes.html',
    'message.html': '/es/muro.html',
    'reader.html': '/es/lector.html',
    'kids-corner.html': '/es/ninos.html'
  };

  var ID_TO_EN = {
    'kecemasan.html': '/topic-anxiety.html',
    'harapan.html': '/topic-hope.html',
    'ketakutan.html': '/topic-fear.html'
  };

  var EN_TO_ID = {
    'topic-anxiety.html': '/id/kecemasan.html',
    'topic-hope.html': '/id/harapan.html',
    'topic-grief.html': '/id/harapan.html',
    'topic-fear.html': '/id/ketakutan.html',
    'topic-forgiveness.html': '/id/harapan.html',
    'ansiedad.html': '/id/kecemasan.html'
  };

  var ID_TO_ES = {
    'kecemasan.html': '/es/ansiedad.html',
    'ketakutan.html': '/es/miedo.html'
  };

  var ES_TO_ID = {
    'ansiedad.html': '/id/kecemasan.html',
    'esperanza.html': '/id/harapan.html',
    'miedo.html': '/id/ketakutan.html',
    'perdon.html': '/id/harapan.html',
    'soledad.html': '/id/kecemasan.html',
    'culpa.html': '/id/kecemasan.html',
    'agobio.html': '/id/kecemasan.html',
    'fuerza.html': '/id/kecemasan.html',
    'paz.html': '/id/kecemasan.html',
    'ira.html': '/id/kecemasan.html',
    'duelo.html': '/id/kecemasan.html'
  };


  function aliasEsRootKeys(map) {
    Object.keys(map).forEach(function (k) {
      if (/^\/(ansiedad|fuerza|paz|miedo|soledad|culpa|agobio|esperanza|planes|muro|lector|ninos|ira|duelo|perdon)\.html$/.test(k) && map['/es' + k] == null) map['/es' + k] = map[k];
    });
  }
  aliasEsRootKeys(ES_TO_FR);
  aliasEsRootKeys(ES_TO_PT);
  aliasEsRootKeys(LOCALE_TO_ZH);
  aliasEsRootKeys(LOCALE_TO_RU);
  aliasEsRootKeys(LOCALE_TO_HI);

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
    'kabalisahan.html': '/es/ansiedad.html'
  };

  /** Spanish root mood pages → Tagalog anxiety pilot (cluster default). */
  var ES_TO_TL = {
    'esperanza.html': '/tl/pagasa.html',
    'miedo.html': '/tl/kabalisahan.html',
    'soledad.html': '/tl/kabalisahan.html',
    'culpa.html': '/tl/kabalisahan.html',
    'agobio.html': '/tl/kabalisahan.html',
    'fuerza.html': '/tl/kabalisahan.html',
    'paz.html': '/tl/kabalisahan.html',
    'planes.html': '/tl/kabalisahan.html',
    'muro.html': '/tl/kabalisahan.html',
    'lector.html': '/tl/kabalisahan.html',
    'ninos.html': '/tl/kabalisahan.html'
  };

  var TL_TO_ID = {
    'kabalisahan.html': '/id/kecemasan.html'
  };

  var ID_TO_TL = {
    'kecemasan.html': '/tl/kabalisahan.html',
    'ketakutan.html': '/tl/kabalisahan.html'
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

  /** PT, FR, ES, ID, RU, ZH, or HI hub: same cross-language defaults for anxiety-cluster locales. */
  function isLocaleHubCluster() {
    return isPortugueseHub() || isFrenchHub() || isSpanishHub() || isIndonesianHub() ||
      isRussianHub() || isChineseHub() || isHindiHub();
  }

  /** Spanish landing hub (folder index). */
  function isSpanishHub() {
    var p = pathnameNoQuery();
    return p === '/es' || p === '/es/index.html';
  }

  /** Indonesian landing hub (pilot expansion; mood pages still thin vs PT). */
  function isIndonesianHub() {
    var p = pathnameNoQuery();
    return p === '/id' || p === '/id/index.html';
  }

  /** Russian landing hub. */
  function isRussianHub() {
    var p = pathnameNoQuery();
    return p === '/ru' || p === '/ru/index.html';
  }

  /** Chinese landing hub. */
  function isChineseHub() {
    var p = pathnameNoQuery();
    return p === '/zh' || p === '/zh/index.html';
  }

  /** Hindi landing hub. */
  function isHindiHub() {
    var p = pathnameNoQuery();
    return p === '/hi' || p === '/hi/index.html';
  }

  /** Any /ru/*.html pilot (not the hub). */
  function isRussianTopical() {
    var p = pathnameNoQuery();
    return p.indexOf('/ru/') === 0 && p.length > 4 && /\.html$/.test(p);
  }

  /** Any /zh/*.html pilot (not the hub). */
  function isChineseTopical() {
    var p = pathnameNoQuery();
    return p.indexOf('/zh/') === 0 && p.length > 4 && /\.html$/.test(p);
  }

  /** Any /hi/*.html pilot (not the hub). */
  function isHindiTopical() {
    var p = pathnameNoQuery();
    return p.indexOf('/hi/') === 0 && p.length > 4 && /\.html$/.test(p);
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

  /** FR depth pilots: peur / force / paix / colère / tristesse / pardon (Louis Segond on-page). */
  function isFrenchExtraMoodPilot() {
    var p = pathnameNoQuery();
    return p === '/fr/peur.html' || p === '/fr/force.html' || p === '/fr/paix.html' ||
      p === '/fr/colere.html' || p === '/fr/tristesse.html' || p === '/fr/pardon.html';
  }

  /** FR tool entry shells (parity with PT planos/mural/leitor/crianças). */
  function isFrenchToolShell() {
    var p = pathnameNoQuery();
    return p === '/fr/plans.html' || p === '/fr/mural.html' || p === '/fr/lecteur.html' ||
      p === '/fr/enfants.html';
  }

  function isChineseOverwhelmPage() {
    return pathnameNoQuery() === '/zh/taiduo.html';
  }

  function isSpanishTopical() {
    var f = baseFile();
    return f === 'ansiedad.html' || f === 'fuerza.html' || f === 'paz.html' ||
      f === 'miedo.html' || f === 'soledad.html' || f === 'culpa.html' || f === 'agobio.html' ||
      f === 'esperanza.html' || f === 'ira.html' || f === 'duelo.html' ||
      f === 'perdon.html' ||
      f === 'planes.html' || f === 'muro.html' || f === 'lector.html' ||
      f === 'ninos.html';
  }

  function isIndonesianTopical() {
    return baseFile() === 'kecemasan.html' || baseFile() === 'harapan.html' ||
      baseFile() === 'ketakutan.html' || docLang() === 'id';
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
    return p === '/topic-anxiety.html' || (p === '/ansiedad.html' || p === '/es/ansiedad.html') || p === '/id/kecemasan.html' ||
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
    return p === '/topic-hope.html' || p === '/fr/espoir.html' || (p === '/esperanza.html' || p === '/es/esperanza.html') ||
      p === '/zh/xiwang.html' ||
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

  /** EN / ES / FR / ZH / RU / HI forgiveness pilots + topic page (cross-switcher parity). */
  function isForgivenessEquivalentPath() {
    var p = pathnameNoQuery();
    return p === '/topic-forgiveness.html' || (p === '/perdon.html' || p === '/es/perdon.html') || p === '/fr/pardon.html' ||
      p === '/zh/kuanshu.html' || p === '/ru/proshchenie.html' || p === '/hi/kshama.html';
  }

  function enHref() {
    if (isFrenchHub() || isSpanishHub() || isIndonesianHub() || isRussianHub() || isChineseHub() ||
      isHindiHub()) return '/';
    if (isForgivenessEquivalentPath() && pathnameNoQuery() !== '/topic-forgiveness.html') {
      return '/topic-forgiveness.html';
    }
    var ptEq = PT_TO_EN[pathnameNoQuery()];
    if (ptEq) return ptEq;
    var frEq = FR_TO_EN[pathnameNoQuery()];
    if (frEq) return frEq;
    var locEn = LOCALE_TO_EN[pathnameNoQuery()];
    if (locEn) return locEn;
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
    var locEs = LOCALE_TO_ES[pEs];
    if (locEs) return locEs;
    if (isForgivenessEquivalentPath() && (pEs !== '/perdon.html' && pEs !== '/es/perdon.html')) return '/es/perdon.html';
    if (isSpanishHub()) return '/es/';
    if (isPortugueseHub() || isFrenchHub() || isIndonesianHub() || isRussianHub() || isChineseHub() ||
      isHindiHub()) return '/es/';
    var frEs = FR_TO_ES[pEs];
    if (frEs) return frEs;
    if (pEs.indexOf('/pt/') === 0 && PT_TO_ES[pEs]) return PT_TO_ES[pEs];
    if (isHopeEquivalentPath() && (pEs !== '/esperanza.html' && pEs !== '/es/esperanza.html')) return '/es/esperanza.html';
    if (isArabicAnxietyPage() || isHindiAnxietyPage() || isRussianAnxietyPage() ||
      isSwedishAnxietyPage() || isPortugueseAnxietyPage() || isBengaliAnxietyPage() ||
      isSwahiliAnxietyPage()) return '/es/ansiedad.html';
    if (isFrenchAnxietyPage() || isChineseAnxietyPage()) return '/es/ansiedad.html';
    if (isFrenchLonelinessPage() || isChineseLonelinessPage() ||
      isFrenchGuiltPage() || isChineseGuiltPage() ||
      isFrenchOverwhelmPage() || isChineseOverwhelmPage()) return '/es/';
    var f = baseFile();
    if (f === 'ansiedad.html' || f === 'fuerza.html' || f === 'paz.html' ||
      f === 'miedo.html' || f === 'soledad.html' || f === 'culpa.html' || f === 'agobio.html' ||
      f === 'esperanza.html' || f === 'ira.html' || f === 'duelo.html' ||
      f === 'perdon.html' ||
      f === 'planes.html' || f === 'muro.html' || f === 'lector.html' ||
      f === 'ninos.html') return '/es/' + f;
    if (EN_TO_ES[f]) return EN_TO_ES[f];
    if (ID_TO_ES[f]) return ID_TO_ES[f];
    if (TL_TO_ES[f]) return TL_TO_ES[f];
    if (pEs === '/' || pEs === '/index.html') return '/es/';
    return MORE_HUB;
  }

  function frHref() {
    var pFr = pathnameNoQuery();
    var locFr = LOCALE_TO_FR[pFr];
    if (locFr) return locFr;
    if (isForgivenessEquivalentPath() && pFr !== '/fr/pardon.html') return '/fr/pardon.html';
    if (isSpanishHub()) return '/fr/';
    if (isFrenchHub()) return '/fr/';
    if (isIndonesianHub() || isRussianHub() || isChineseHub() || isHindiHub()) return '/fr/';
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
    if (pFr === '/plans.html') return '/fr/plans.html';
    if (pFr === '/message.html') return '/fr/mural.html';
    if (pFr === '/reader.html') return '/fr/lecteur.html';
    if (pFr === '/kids-corner.html') return '/fr/enfants.html';
    if (baseFile() === 'topic-grief.html') return '/fr/tristesse.html';
    if (baseFile() === 'topic-forgiveness.html') return '/fr/pardon.html';
    if (pFr === '/' || pFr === '/index.html') return '/fr/';
    return MORE_HUB;
  }

  function zhHref() {
    var pZh = pathnameNoQuery();
    if (PT_TO_ZH[pZh]) return PT_TO_ZH[pZh];
    if (isChineseHub()) return '/zh/';
    if (isChineseTopical()) return pZh;
    var locZh = LOCALE_TO_ZH[pZh];
    if (locZh) return locZh;
    if (isForgivenessEquivalentPath() && pZh !== '/zh/kuanshu.html') return '/zh/kuanshu.html';
    if (isFrenchExtraMoodPilot() || isFrenchToolShell()) return '/zh/';
    if (isLocaleHubCluster()) return '/zh/';
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
    if (isSpanishTopical()) return '/zh/';
    return MORE_HUB;
  }

  function idHref() {
    var pId = pathnameNoQuery();
    if (isIndonesianHub()) return '/id/';
    var locId = LOCALE_TO_ID[pId];
    if (locId) return locId;
    if (PT_TO_EN[pId]) return '/id/';
    if (isFrenchHub() || isSpanishHub() || isRussianHub() || isChineseHub() || isHindiHub()) return '/id/';
    if (pId === '/id/ketakutan.html') return '/id/ketakutan.html';
    if (isForgivenessEquivalentPath()) return '/id/';
    if (pId === '/id/harapan.html') return '/id/harapan.html';
    if (isHopeEquivalentPath()) return '/id/harapan.html';
    if (isArabicAnxietyPage() || isHindiAnxietyPage() || isFrenchAnxietyPage() || isChineseAnxietyPage() ||
      isRussianAnxietyPage() || isSwedishAnxietyPage() || isPortugueseAnxietyPage() ||
      isBengaliAnxietyPage() || isSwahiliAnxietyPage() || isFrenchExtraMoodPilot() ||
      isFrenchToolShell()) return '/id/kecemasan.html';
    if (isFrenchLonelinessPage() || isChineseLonelinessPage() ||
      isFrenchGuiltPage() || isChineseGuiltPage() ||
      isFrenchOverwhelmPage() || isChineseOverwhelmPage()) return '/id/';
    var f = baseFile();
    if (f === 'kecemasan.html') return '/id/kecemasan.html';
    if (f === 'kabalisahan.html') return '/id/';
    if (EN_TO_ID[f]) return EN_TO_ID[f];
    if (ES_TO_ID[f]) return ES_TO_ID[f];
    return '/id/';
  }

  function tlHref() {
    if (PT_TO_EN[pathnameNoQuery()]) return '/tl/kabalisahan.html';
    if (isFrenchHub() || isSpanishHub() || isIndonesianHub() || isRussianHub() || isChineseHub() ||
      isHindiHub()) return '/tl/kabalisahan.html';
    if (pathnameNoQuery() === '/tl/pagasa.html') return '/tl/pagasa.html';
    if (isHopeEquivalentPath()) return '/tl/pagasa.html';
    if (isArabicAnxietyPage() || isHindiAnxietyPage() || isFrenchAnxietyPage() || isChineseAnxietyPage() ||
      isRussianAnxietyPage() || isSwedishAnxietyPage() || isPortugueseAnxietyPage() ||
      isBengaliAnxietyPage() || isSwahiliAnxietyPage() || isFrenchExtraMoodPilot() ||
      isFrenchToolShell()) return '/tl/kabalisahan.html';
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
    var pHi = pathnameNoQuery();
    if (PT_TO_EN[pHi]) return '/hi/chinta.html';
    if (isHindiHub()) return '/hi/';
    if (isHindiTopical()) return pHi;
    var locHi = LOCALE_TO_HI[pHi];
    if (locHi) return locHi;
    if (isForgivenessEquivalentPath() && pHi !== '/hi/kshama.html') return '/hi/kshama.html';
    if (isLocaleHubCluster()) return '/hi/chinta.html';
    if (pHi === '/hi/asha.html') return '/hi/asha.html';
    if (isHopeEquivalentPath()) return '/hi/asha.html';
    if (isHindiAnxietyPage()) return '/hi/chinta.html';
    if (isAnxietyEquivalentPath()) return '/hi/chinta.html';
    return MORE_HUB;
  }

  function ruHref() {
    var pRu = pathnameNoQuery();
    if (PT_TO_EN[pRu]) return '/ru/trevoga.html';
    if (isRussianHub()) return '/ru/';
    if (isRussianTopical()) return pRu;
    var locRu = LOCALE_TO_RU[pRu];
    if (locRu) return locRu;
    if (isForgivenessEquivalentPath() && pRu !== '/ru/proshchenie.html') return '/ru/proshchenie.html';
    if (isLocaleHubCluster()) return '/ru/trevoga.html';
    if (pRu === '/ru/nadezhda.html') return '/ru/nadezhda.html';
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
    var locPt = LOCALE_TO_PT[curPt];
    if (locPt) return locPt;
    if (isForgivenessEquivalentPath() && curPt !== '/pt/') return '/pt/';
    if (isFrenchHub() || isSpanishHub() || isIndonesianHub() || isRussianHub() || isChineseHub() ||
      isHindiHub()) return '/pt/';
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
    if (isSpanishTopical()) return MORE_HUB;
    if (isFrenchHub() || isSpanishHub() || isIndonesianHub() || isRussianHub() || isChineseHub() ||
      isHindiHub()) return MORE_HUB;
    if (isIndonesianTopical() || isTagalogTopical() || isFrenchAnxietyPage() || isChineseAnxietyPage() ||
      isArabicAnxietyPage() || isHindiAnxietyPage() || isRussianAnxietyPage() ||
      isSwedishAnxietyPage() || isPortugueseAnxietyPage() || isBengaliAnxietyPage() ||
      isSwahiliAnxietyPage() ||
      isHopeEquivalentPath() ||
      isForgivenessEquivalentPath() ||
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

  function isAdditionalLanguagePath(p) {
    if (p.indexOf('/zh/') === 0) return true;
    if (p.indexOf('/hi/') === 0) return true;
    if (p.indexOf('/ru/') === 0) return true;
    if (p.indexOf('/id/') === 0) return true;
    if (p.indexOf('/ar/') === 0) return true;
    if (p.indexOf('/tl/') === 0) return true;
    if (p.indexOf('/sv/') === 0) return true;
    if (p.indexOf('/bn/') === 0) return true;
    if (p.indexOf('/sw/') === 0) return true;
    return false;
  }

  function clearDemotedNavHint(root) {
    var old = root.querySelector('[data-tdb-lang-demoted-hint]');
    if (old && old.parentNode) old.parentNode.removeChild(old);
  }

  function ensureDemotedNavHint(root) {
    var p = pathnameNoQuery();
    clearDemotedNavHint(root);
    if (!isAdditionalLanguagePath(p)) return;
    if (root.querySelector('a[aria-current="true"]')) return;
    var span = document.createElement('span');
    span.className = 'sr-only';
    span.setAttribute('data-tdb-lang-demoted-hint', 'true');
    span.setAttribute('role', 'status');
    span.textContent =
      'This page is an additional language (beyond English, Español, Français, and Português). See Explore — Languages for the full list.';
    root.appendChild(span);
  }

  function applyAriaCurrent() {
    var p = pathnameNoQuery();
    var spanish = isSpanishTopical();
    var indo = baseFile() === 'kecemasan.html' || baseFile() === 'harapan.html' ||
      baseFile() === 'ketakutan.html';
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
      } else if (isIndonesianHub()) {
        if (id) id.setAttribute('aria-current', 'true');
      } else if (isRussianHub()) {
        if (ruPick) ruPick.setAttribute('aria-current', 'true');
      } else if (isChineseHub()) {
        if (zhPick) zhPick.setAttribute('aria-current', 'true');
      } else if (isHindiHub()) {
        if (hiPick) hiPick.setAttribute('aria-current', 'true');
      } else if (isRussianTopical()) {
        if (ruPick) ruPick.setAttribute('aria-current', 'true');
      } else if (isChineseTopical()) {
        if (zhPick) zhPick.setAttribute('aria-current', 'true');
      } else if (isHindiTopical()) {
        if (hiPick) hiPick.setAttribute('aria-current', 'true');
      } else if (isFrenchExtraMoodPilot() || isFrenchToolShell()) {
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
      ensureDemotedNavHint(nodes[i]);
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
