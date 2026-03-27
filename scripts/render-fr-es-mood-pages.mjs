/**
 * Generates FR + ES mood depth pages (Louis Segond / Reina-Valera 1960 on-page).
 * Run: node scripts/render-fr-es-mood-pages.mjs
 * Requires: scripts/lib/lang-switcher-inner.mjs (shared switcher rows).
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { LANG_SWITCHER_INNER } from './lib/lang-switcher-inner.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');

function frShell({
  fileRel,
  title,
  desc,
  canonicalPath,
  enPath,
  extraHreflang,
  h1,
  lead,
  vTitle,
  v1,
  simple,
  today,
  why,
  doit,
  vExtra,
  relatedBtns,
  sidebarEn,
}) {
  const canonical = `https://todaysdailybattle.com${canonicalPath}`;
  let hrefExtra = '';
  for (const [lang, url] of extraHreflang || []) {
    hrefExtra += `  <link rel="alternate" hreflang="${lang}" href="https://todaysdailybattle.com${url}">\n`;
  }
  return `<!DOCTYPE html>
<html lang="fr">
<head>
  <script src="/vendor/dompurify.min.js"></script>
  <script src="/tt-bootstrap.js"></script>
  <script defer src="/analytics-loader.js"></script>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${title}</title>
  <meta name="description" content="${desc}">
  <meta name="robots" content="index, follow">
  <link rel="canonical" href="${canonical}">
  <link rel="alternate" hreflang="fr" href="${canonical}">
  <link rel="alternate" hreflang="en" href="https://todaysdailybattle.com${enPath}">
${hrefExtra}  <link rel="alternate" hreflang="x-default" href="https://todaysdailybattle.com/">
  <meta property="og:title" content="${title.replace(/"/g, '&quot;')}">
  <meta property="og:url" content="${canonical}">
  <meta property="og:type" content="website">
  <meta property="og:locale" content="fr_FR">
  <meta property="og:image" content="https://todaysdailybattle.com/logo-shield-600.png">
  <link rel="icon" href="/icon.svg" type="image/svg+xml">
  <link rel="stylesheet" href="/styles.css?v=20260326frdepth">
  <link rel="manifest" href="/manifest.json">
  <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.99.2/dist/umd/supabase.min.js" integrity="sha384-zETTH+6IXxKQ6zbGcT6H6EDdnGaae9uhI8uO7doTJoNEmPGeTKVOe5S6/XybS9JH" crossorigin="anonymous" data-cfasync="false" defer></script>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
</head>
<body class="dark-mode pt-pilot-body">
  <a href="#main-content" class="skip-link">Aller au contenu principal</a>
  <div class="app-shell">
    <header class="top-bar">
      <div class="tdb-lang-switcher-header-wrap">
        <nav class="tdb-lang-switcher tdb-lang-switcher--header tdb-lang-switcher--labeled" aria-label="Choisir la langue" data-tdb-lang-switcher lang="fr">
          <span class="tdb-lang-switcher-eyebrow" aria-hidden="true">Langue</span>
          <span class="tdb-lang-switcher-inner">
${LANG_SWITCHER_INNER}
          </span>
        </nav>
        <p class="tdb-mood-door-kjv-banner" lang="fr">Versets sur cette page : français (Louis Segond, domaine public). Outils ci-dessous en <strong>anglais</strong> ; Bible à l’écran en <abbr title="King James Version" lang="en">KJV</abbr>.</p>
      </div>
      <div class="brand">
        <a class="brand-title" href="/fr/">Today's Daily Battle</a>
        <span class="brand-subtitle">Donne-Le à Lui. Une Parole à la fois.</span>
      </div>
      <nav class="header-nav tdb-global-nav" aria-label="Navigation principale">
        <a href="/fr/">Accueil</a>
        <a href="/explore.html">Explore <span class="section-note" style="display:inline;font-size:0.85em;">(EN)</span></a>
        <a href="/fr/anxiete.html">Anxiété</a>
        <a href="/fr/espoir.html">Espoir</a>
        <a href="/calm.html">Calm <span class="section-note" style="display:inline;font-size:0.85em;">(EN)</span></a>
      </nav>
      <a href="#sidebar" class="header-menu-link" id="sidebar-toggle" aria-label="Ouvrir le menu"><span class="menu-icon" aria-hidden="true">☰</span><span class="menu-text">Menu</span></a>
    </header>
    <aside id="sidebar" class="sidebar">
      <nav class="side-nav" aria-label="Navigation">
        <a href="/fr/">Accueil FR</a>
        <a href="/verse.html" hreflang="en">Verset du jour (EN)</a>
        <a href="${sidebarEn}" hreflang="en">Version anglaise</a>
        <a href="/" hreflang="en">English home</a>
      </nav>
    </aside>
    <main class="app-content" id="main-content">
      <div class="content-inner">
        <header class="hero-banner">
          <h1>${h1}</h1>
          <p class="real-talk">${lead}</p>
          <p class="section-note" style="margin-top:0.5rem;">Citations bibliques : <strong>Louis Segond, 1910</strong> (domaine public). Le reste du site et les outils restent en anglais à l’écran.</p>
        </header>
        <section class="glass fr-topic-breakdown" lang="fr">
          <div class="breakdown">
            <h2>${vTitle}</h2>
            <p class="verse">${v1}</p>
            <h3>En mots simples</h3>
            <p>${simple}</p>
            <h3>Ce que ça peut faire aujourd’hui</h3>
            <p>${today}</p>
            <h3>Pourquoi ce verset change tout</h3>
            <p>${why}</p>
            <h3>Fais ceci maintenant</h3>
            <p>${doit}</p>
          </div>
        </section>
        <section class="glass" lang="fr">
          <h2 class="section-divider">Un autre verset, si le cœur reste lourd</h2>
          ${vExtra}
        </section>
        <section class="glass fr-mas-ayuda" lang="fr">
          <h2 class="section-divider">Outils du site — interface en anglais</h2>
          <p class="section-note"><strong>En bref :</strong> chaque lien ouvre une page en <strong>anglais</strong>. La Bible affichée dans ces outils est en <strong>KJV</strong> (anglais).</p>
          <nav class="cta-group fr-mas-ayuda-tools" aria-label="Outils — interface anglaise" style="display:flex !important;flex-wrap:wrap;gap:0.5rem;">
            <a class="btn btn-secondary" href="/verse.html" hreflang="en">Verset du jour (EN)</a>
            <a class="btn btn-secondary" href="/calm.html" hreflang="en">Calm (EN)</a>
            <a class="btn btn-secondary" href="/bible-tool.html" hreflang="en">Outil Bible (EN)</a>
            <a class="btn btn-secondary" href="/message.html" hreflang="en">Mur de prière (EN)</a>
            <a class="btn btn-secondary" href="/explore.html#languages" hreflang="en">Langues (EN)</a>
          </nav>
        </section>
        <section class="glass" lang="fr">
          <h2 class="section-divider">Autres portes en français</h2>
          <div class="cta-group" style="flex-wrap:wrap;gap:0.5rem;">
${relatedBtns}
          </div>
        </section>
      </div>
    </main>
    <footer class="site-footer site-footer--canonical" role="contentinfo" aria-label="Pied de page">
  <nav class="tdb-lang-switcher tdb-lang-switcher--footer tdb-lang-switcher--labeled" aria-label="Choisir la langue" data-tdb-lang-switcher lang="fr">
    <span class="tdb-lang-switcher-eyebrow" aria-hidden="true">Langue</span>
    <span class="tdb-lang-switcher-inner">
${LANG_SWITCHER_INNER}
    </span>
  </nav>
  <p class="site-footer-pilot-note" lang="fr">Page pilote en français. Outils du site en anglais ; Bible à l’écran en <abbr title="King James Version" lang="en">KJV</abbr>.</p>
  <nav class="site-footer-essentials" aria-label="Liens principaux">
    <a href="/fr/">Accueil FR</a><span class="site-footer-ess-sep" aria-hidden="true">·</span>
    <a href="/">English home</a>
  </nav>
  <p class="footer-humility">Nous combattons. Il vainc.</p>
  <p class="site-footer-updated">Dernière mise à jour : <span id="footer-date">TDB_BUILD_DATE</span></p>
  <script defer src="/language-switcher.js"></script>
</footer>
  </div>
  <script type="module" src="/config.js"></script>
  <script type="module" src="/script.js?v=20260328feelwire" data-cfasync="false"></script>
</body>
</html>
`;
}

function esShell({
  fileRel,
  title,
  desc,
  canonicalPath,
  enPath,
  extraHreflang,
  h1,
  lead,
  v1,
  simple,
  feel,
  change,
  doit,
  vExtra,
  relatedBtns,
}) {
  const canonical = `https://todaysdailybattle.com${canonicalPath}`;
  let hrefExtra = '';
  for (const [lang, url] of extraHreflang || []) {
    hrefExtra += `  <link rel="alternate" hreflang="${lang}" href="https://todaysdailybattle.com${url}">\n`;
  }
  return `<!DOCTYPE html>
<html lang="es">
<head>
  <script src="/vendor/dompurify.min.js"></script>
  <script src="/tt-bootstrap.js"></script>
  <script defer src="/analytics-loader.js"></script>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${title}</title>
  <meta name="description" content="${desc}">
  <meta name="robots" content="index, follow">
  <link rel="canonical" href="${canonical}">
  <link rel="alternate" hreflang="es" href="${canonical}">
  <link rel="alternate" hreflang="en" href="https://todaysdailybattle.com${enPath}">
${hrefExtra}  <link rel="alternate" hreflang="x-default" href="https://todaysdailybattle.com/">
  <meta property="og:title" content="${title.replace(/"/g, '&quot;')}">
  <meta property="og:url" content="${canonical}">
  <meta property="og:type" content="website">
  <meta property="og:locale" content="es_MX">
  <meta property="og:image" content="https://todaysdailybattle.com/logo-shield-600.png">
  <link rel="icon" href="/icon.svg" type="image/svg+xml">
  <link rel="stylesheet" href="/styles.css?v=20260328esNav">
  <link rel="manifest" href="/manifest.json">
  <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.99.2/dist/umd/supabase.min.js" integrity="sha384-zETTH+6IXxKQ6zbGcT6H6EDdnGaae9uhI8uO7doTJoNEmPGeTKVOe5S6/XybS9JH" crossorigin="anonymous" data-cfasync="false" defer></script>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
</head>
<body class="dark-mode">
  <a href="#main-content" class="skip-link">Saltar al contenido</a>
  <div class="app-shell">
    <header class="top-bar">
      <div class="tdb-lang-switcher-header-wrap">
        <nav class="tdb-lang-switcher tdb-lang-switcher--header tdb-lang-switcher--labeled" aria-label="Elegir idioma" data-tdb-lang-switcher lang="es">
          <span class="tdb-lang-switcher-eyebrow" aria-hidden="true">Idioma</span>
          <span class="tdb-lang-switcher-inner">
${LANG_SWITCHER_INNER}
          </span>
        </nav>
        <p class="tdb-mood-door-kjv-banner" lang="es">Versículos en esta página: español (Reina-Valera 1960, dominio público). Herramientas en <strong>inglés</strong>; Biblia en pantalla en <abbr title="King James Version" lang="en">KJV</abbr>.</p>
      </div>
      <div class="brand">
        <a class="brand-title" href="/es/">Today's Daily Battle</a>
        <span class="brand-subtitle">Dáselo a Él. Una Palabra a la vez.</span>
      </div>
      <nav class="header-nav tdb-global-nav" aria-label="Navegación principal">
        <a href="/es/">Inicio ES</a>
        <a href="/ansiedad.html">Ansiedad</a>
        <a href="/fuerza.html">Fuerza</a>
        <a href="/paz.html">Paz</a>
        <a href="/explore.html">Explore <span class="section-note" style="display:inline;font-size:0.85em;">(EN)</span></a>
      </nav>
      <a href="#sidebar" class="header-menu-link" id="sidebar-toggle" aria-label="Abrir menú"><span class="menu-icon" aria-hidden="true">☰</span><span class="menu-text">Menú</span></a>
    </header>
    <aside id="sidebar" class="sidebar">
      <nav class="side-nav" aria-label="Navegación">
        <a href="/es/">Hub ES</a>
        <a href="/verse.html" hreflang="en">Verso del día (EN)</a>
        <a href="${enPath}" hreflang="en">Versión en inglés</a>
      </nav>
    </aside>
    <main class="app-content" id="main-content">
      <div class="content-inner">
        <header class="hero-banner">
          <h1>${h1}</h1>
          <p class="real-talk">${lead}</p>
          <p class="section-note" style="margin-top:0.5rem;">Citas: <strong>Reina-Valera 1960</strong> (dominio público). Herramientas del sitio en inglés.</p>
        </header>
        <section class="glass es-topic-breakdown" lang="es">
          <div class="breakdown">
            <h2>Versículo para hoy</h2>
            <p class="verse">${v1}</p>
            <h3>En palabras simples</h3>
            <p>${simple}</p>
            <h3>Cómo se siente hoy</h3>
            <p>${feel}</p>
            <h3>Por qué esto importa</h3>
            <p>${change}</p>
            <h3>Haz esto ahora</h3>
            <p>${doit}</p>
          </div>
        </section>
        <section class="glass" lang="es">
          <h2 class="section-divider">Otro versículo, si el pecho sigue apretado</h2>
          ${vExtra}
        </section>
        <section class="glass es-mas-ayuda" lang="es">
          <h2 class="section-divider">Herramientas (inglés / KJV)</h2>
          <p class="section-note">Cada enlace abre pantalla en <strong>inglés</strong>; la Biblia en pantalla es <strong>KJV</strong>.</p>
          <nav class="cta-group es-mas-ayuda-tools" aria-label="Herramientas en inglés" style="display:flex !important;flex-wrap:wrap;gap:0.5rem;">
            <a class="btn btn-secondary" href="/verse.html" hreflang="en">Verso del día (EN)</a>
            <a class="btn btn-secondary" href="/calm.html" hreflang="en">Calm (EN)</a>
            <a class="btn btn-secondary" href="/bible-tool.html" hreflang="en">Biblia (EN)</a>
            <a class="btn btn-secondary" href="/message.html" hreflang="en">Muro (EN)</a>
            <a class="btn btn-secondary" href="/explore.html#languages" hreflang="en">Idiomas (EN)</a>
          </nav>
        </section>
        <section class="glass" lang="es">
          <h2 class="section-divider">Más temas en español</h2>
          <div class="cta-group" style="flex-wrap:wrap;gap:0.5rem;">
${relatedBtns}
          </div>
        </section>
      </div>
    </main>
    <footer class="site-footer site-footer--canonical" role="contentinfo" aria-label="Pie de página">
  <nav class="tdb-lang-switcher tdb-lang-switcher--footer tdb-lang-switcher--labeled" aria-label="Elegir idioma" data-tdb-lang-switcher lang="es">
    <span class="tdb-lang-switcher-eyebrow" aria-hidden="true">Idioma</span>
    <span class="tdb-lang-switcher-inner">
${LANG_SWITCHER_INNER}
    </span>
  </nav>
  <p class="site-footer-pilot-note" lang="es">Página en español. Herramientas en inglés; Biblia en pantalla en <abbr title="King James Version" lang="en">KJV</abbr>.</p>
  <nav class="site-footer-essentials" aria-label="Enlaces principales">
    <a href="/es/">Inicio ES</a><span class="site-footer-ess-sep" aria-hidden="true">·</span>
    <a href="/">English home</a>
  </nav>
  <p class="footer-humility">Luchamos. Él vence.</p>
  <p class="site-footer-updated">Última actualización: <span id="footer-date">TDB_BUILD_DATE</span></p>
  <script defer src="/language-switcher.js"></script>
</footer>
  </div>
  <script type="module" src="/config.js"></script>
  <script type="module" src="/script.js?v=20260328feelwire" data-cfasync="false"></script>
</body>
</html>
`;
}

const frRelatedCore = `            <a class="btn btn-secondary" href="/fr/">Hub FR</a>
            <a class="btn btn-secondary" href="/fr/anxiete.html">Anxiété</a>
            <a class="btn btn-secondary" href="/fr/espoir.html">Espoir</a>
            <a class="btn btn-secondary" href="/fr/solitude.html">Solitude</a>
            <a class="btn btn-secondary" href="/fr/culpabilite.html">Culpabilité</a>
            <a class="btn btn-secondary" href="/fr/deborde.html">Débordé</a>`;

const esRelatedCore = `            <a class="btn btn-secondary" href="/es/">Hub ES</a>
            <a class="btn btn-secondary" href="/ansiedad.html">Ansiedad</a>
            <a class="btn btn-secondary" href="/esperanza.html">Esperanza</a>
            <a class="btn btn-secondary" href="/miedo.html">Miedo</a>
            <a class="btn btn-secondary" href="/fuerza.html">Fuerza</a>
            <a class="btn btn-secondary" href="/paz.html">Paz</a>`;

const frPages = [
  {
    fileRel: 'fr/peur.html',
    title: "Peur et courage : Paroles bibliques (Louis Segond) | Today's Daily Battle",
    desc: 'Quand la peur serre : versets Louis Segond (domaine public) et un pas humble. Outils en anglais, KJV.',
    canonicalPath: '/fr/peur.html',
    enPath: '/topic-fear.html',
    extraHreflang: [
      ['es', '/miedo.html'],
      ['pt', '/pt/medo.html'],
    ],
    h1: 'Quand la peur arrive avant les faits',
    lead: 'Le cœur s’accélère, l’imagination invente le pire — et vous respirez encore. Dieu ne vous demande pas de jouer au brave ; Il parle près de vous.',
    vTitle: 'Verset pour aujourd’hui',
    v1: '&ldquo;Car Dieu ne nous a point donné un esprit de timidité, mais de force, d\'amour et de sobriété.&rdquo; &mdash; 2 Timothée 1:7 <span class="section-note" style="display:inline;font-size:0.85em;">(Louis Segond 1910)</span>',
    simple: 'La peur paralysante n’est pas votre maîtresse légitime : Dieu offre un autre souffle — ferme, aimant, lucide.',
    today: 'Quand la peur hurle « tout va mal », ce verset replace une voix plus douce : vous pouvez vous arrêter devant Lui avant de vous effondrer.',
    why: '« Esprit de timidité » parle de recul et de honte ; « force et amour » parlent d’être reçu et soutenu. Ce n’est pas une injonction de performance : c’est une invitation à s’appuyer sur Lui.',
    doit: 'Dites tout bas : « Seigneur, la peur est là — parle plus fort qu’elle. » Trois respirations lentes. Vous n’avez pas à tout résoudre avant de vous approcher.',
    vExtra: `<p class="verse" style="margin-top:0.75rem;">&ldquo;Ne crains rien, car je suis avec toi; ne promène pas des regards inquiets, car je suis ton Dieu. Je te fortifie, je viens à ton secours, je te soutiens de ma droite triomphante.&rdquo; &mdash; Ésaïe 41:10 <span class="section-note" style="display:inline;font-size:0.85em;">(Louis Segond 1910)</span></p>`,
    relatedBtns:
      frRelatedCore +
      `
            <a class="btn btn-secondary" href="/fr/force.html">Force</a>
            <a class="btn btn-secondary" href="/fr/paix.html">Paix</a>`,
    sidebarEn: '/topic-fear.html',
  },
  {
    fileRel: 'fr/force.html',
    title: "Force : Paroles bibliques (Louis Segond) | Today's Daily Battle",
    desc: 'Jours faibles, Dieu fort : Louis Segond (domaine public). Outils en anglais, KJV.',
    canonicalPath: '/fr/force.html',
    enPath: '/topic-strength.html',
    extraHreflang: [
      ['es', '/fuerza.html'],
      ['pt', '/pt/forca.html'],
    ],
    h1: 'Quand vous sentez que vous ne tenez plus',
    lead: 'La faiblesse n’est pas un verdict final — c’est un lieu où Sa force se donne souvent sans bruit.',
    vTitle: 'Verset pour aujourd’hui',
    v1: '&ldquo;Je puis tout par celui qui me fortifie.&rdquo; &mdash; Philippiens 4:13 <span class="section-note" style="display:inline;font-size:0.85em;">(Louis Segond 1910)</span>',
    simple: 'Ce n’est pas « force de théâtre » : c’est un soutien réel pour le prochain pas, pas pour tout le discours de votre vie.',
    today: 'Quand les jambes tremblent, ce verset dit : la source n’est pas votre épuisement seul — c’est Celui qui fortifie.',
    why: '« Par celui qui me fortifie » déplace le centre : la tenue vient de Lui, pas seulement de votre volonté sèche.',
    doit: 'Remettez-Lui un seul pas concret aujourd’hui — pas toute la montagne. Puis soufflez une minute en silence devant Lui.',
    vExtra: `<p class="verse" style="margin-top:0.75rem;">&ldquo;Mais ceux qui se confient en l\'Éternel renouvellent leur force. Ils prennent le vol comme les aigles; Ils courent, et ne se fatiguent point, Ils marchent, et ne se lassent point.&rdquo; &mdash; Ésaïe 40:31 <span class="section-note" style="display:inline;font-size:0.85em;">(Louis Segond 1910)</span></p>`,
    relatedBtns:
      frRelatedCore +
      `
            <a class="btn btn-secondary" href="/fr/peur.html">Peur</a>
            <a class="btn btn-secondary" href="/fr/paix.html">Paix</a>`,
    sidebarEn: '/topic-strength.html',
  },
  {
    fileRel: 'fr/paix.html',
    title: "Paix : Paroles bibliques (Louis Segond) | Today's Daily Battle",
    desc: 'Quand l’âme ne calme pas : Louis Segond (domaine public). Calm en anglais ; outils KJV.',
    canonicalPath: '/fr/paix.html',
    enPath: '/calm.html',
    extraHreflang: [
      ['es', '/paz.html'],
      ['pt', '/pt/paz.html'],
    ],
    h1: 'Quand la tempête continue à l’intérieur',
    lead: 'Sa paix n’est pas fuite — c’est une ancre. Vous pouvez poser le cœur près de Lui même si la main tremble.',
    vTitle: 'Verset pour aujourd’hui',
    v1: '&ldquo;Je vous laisse la paix, je vous donne ma paix. Je ne vous la donne pas comme le monde la donne. Que votre cœur ne se trouble point, et ne s\'alarme point.&rdquo; &mdash; Jean 14:27 <span class="section-note" style="display:inline;font-size:0.85em;">(Louis Segond 1910)</span>',
    simple: 'Le monde promet la paix par le contrôle ; Jésus promet la sienne par Sa présence.',
    today: 'Quand tout crie « urgent », ce verset offre une minute où vous pouvez respirer sans avoir tout bouclé.',
    why: '« Comme le monde la donne » montre le contraste : Sa paix ne dépend pas des circonstances alignées.',
    doit: 'Dites : « Seigneur, je reçois Ta paix pour cette heure. » Trois expirations lentes. Puis ouvrez Calm en anglais si vous voulez un rythme court : <a href="/calm.html" hreflang="en">calm.html</a>.',
    vExtra: `<p class="verse" style="margin-top:0.75rem;">&ldquo;Ne vous inquiétez de rien; mais en toute chose faites connaître vos besoins à Dieu par des prières et des supplications, avec des actions de grâces. Et la paix de Dieu, qui surpasse toute intelligence, gardera vos cœurs et vos pensées en Jésus-Christ.&rdquo; &mdash; Philippiens 4:6-7 <span class="section-note" style="display:inline;font-size:0.85em;">(Louis Segond 1910)</span></p>`,
    relatedBtns:
      frRelatedCore +
      `
            <a class="btn btn-secondary" href="/fr/peur.html">Peur</a>
            <a class="btn btn-secondary" href="/fr/force.html">Force</a>`,
    sidebarEn: '/calm.html',
  },
];

const esPages = [
  {
    fileRel: 'miedo.html',
    title: "Miedo y valor: versículos (Reina-Valera 1960) | Today's Daily Battle",
    desc: 'Cuando el miedo aprieta: Reina-Valera 1960 (dominio público) y un paso sencillo. Herramientas en inglés, KJV.',
    canonicalPath: '/miedo.html',
    enPath: '/topic-fear.html',
    extraHreflang: [
      ['fr', '/fr/peur.html'],
      ['pt', '/pt/medo.html'],
    ],
    h1: 'Cuando el miedo llega antes que los hechos',
    lead: 'El corazón acelera, la mente imagina lo peor — y tú sigues respirando. Dios no te pide fingir valentía; se acerca con Su Palabra.',
    v1: '&ldquo;Porque no nos ha dado Dios espíritu de cobardía, sino de poder, de amor y de dominio propio.&rdquo; &mdash; 2 Timoteo 1:7 <span class="section-note" style="display:inline;font-size:0.85em;">(Reina-Valera 1960)</span>',
    simple: 'El miedo que paraliza no es dueño legítimo de tu casa: Dios ofrece otro espíritu — firme, amoroso, sereno.',
    feel: 'Cuando todo grita «va a salir mal», este versículo recuerda que puedes detenerte ante Él antes de derrumbarte.',
    change: '«Espíritu de cobardía» habla de encogerse; «poder y amor» hablan de ser sostenido. No es exigencia de teatro: es invitación a apoyarte en Él.',
    doit: 'Di en voz baja: «Señor, el miedo está aquí — habla más alto que él.» Tres respiraciones lentas.',
    vExtra: `<p class="verse" style="margin-top:0.75rem;">&ldquo;No temas, porque yo estoy contigo; no desmayes, porque yo soy tu Dios que te esfuerzo; y siempre te ayudaré, siempre te sustentaré con la diestra de mi justicia.&rdquo; &mdash; Isaías 41:10 <span class="section-note" style="display:inline;font-size:0.85em;">(Reina-Valera 1960)</span></p>`,
    relatedBtns:
      esRelatedCore +
      `
            <a class="btn btn-secondary" href="/soledad.html">Soledad</a>
            <a class="btn btn-secondary" href="/culpa.html">Culpa</a>
            <a class="btn btn-secondary" href="/agobio.html">Agobio</a>`,
  },
  {
    fileRel: 'soledad.html',
    title: "Soledad: versículos (Reina-Valera 1960) | Today's Daily Battle",
    desc: 'Cuando te sientes invisible: Reina-Valera 1960 (dominio público). Herramientas en inglés, KJV.',
    canonicalPath: '/soledad.html',
    enPath: '/topic-loneliness.html',
    extraHreflang: [
      ['fr', '/fr/solitude.html'],
      ['pt', '/pt/solidao.html'],
    ],
    h1: 'Cuando parece que nadie te ve',
    lead: 'La soledad duele de verdad — y la Escritura no la trata con frase vacía. Él dice que se queda.',
    v1: '&ldquo;No te dejaré ni te desampararé.&rdquo; &mdash; Hebreos 13:5 <span class="section-note" style="display:inline;font-size:0.85em;">(Reina-Valera 1960)</span>',
    simple: 'No es promesa de multitud ruidosa: es presencia fiel en el silencio.',
    feel: 'A veces la multitud agranda el vacío. Este versículo apunta a un «conmigo» que no depende del salón lleno.',
    change: 'La promesa no compite con tu dolor: lo nombra y lo acompaña con presencia.',
    doit: 'Di: «Señor, me siento solo — quédate conmigo esta hora.» Quédate quieto un minuto.',
    vExtra: `<p class="verse" style="margin-top:0.75rem;">&ldquo;Aunque ande en valle de sombra de muerte, no temeré mal alguno, porque tú estarás conmigo; tu vara y tu cayado me infundirán aliento.&rdquo; &mdash; Salmos 23:4 <span class="section-note" style="display:inline;font-size:0.85em;">(Reina-Valera 1960)</span></p>`,
    relatedBtns:
      esRelatedCore +
      `
            <a class="btn btn-secondary" href="/miedo.html">Miedo</a>
            <a class="btn btn-secondary" href="/culpa.html">Culpa</a>
            <a class="btn btn-secondary" href="/agobio.html">Agobio</a>`,
  },
  {
    fileRel: 'culpa.html',
    title: "Culpa y perdón: versículos (Reina-Valera 1960) | Today's Daily Battle",
    desc: 'Verdad sin ahogarte en vergüenza: Reina-Valera 1960 (dominio público). Herramientas en inglés, KJV.',
    canonicalPath: '/culpa.html',
    enPath: '/topic-guilt.html',
    extraHreflang: [
      ['fr', '/fr/culpabilite.html'],
      ['pt', '/pt/culpa.html'],
    ],
    h1: 'Cuando la culpa no calla',
    lead: 'Dios no te pide negar lo ocurrido — te invita a decir verdad delante de Él y recibir perdón que limpia sin tenerte rehén.',
    v1: '&ldquo;Si confesamos nuestros pecados, él es fiel y justo para perdonarnos nuestros pecados, y limpiarnos de toda maldad.&rdquo; &mdash; 1 Juan 1:9 <span class="section-note" style="display:inline;font-size:0.85em;">(Reina-Valera 1960)</span>',
    simple: 'Confesar no es espectáculo de vergüenza: es decir lo que es verdad y dejarle espacio a Su promesa.',
    feel: 'La culpa repite el fallo en bucle. Este versículo habla de perdón y limpieza — camino adelante, no celda.',
    change: 'La justicia de Dios incluye el perdón prometido, no solo el reproche.',
    doit: 'Di: «Señor, esto hice — lo confieso ante Ti.» Queda un momento sin devorarte tú mismo.',
    vExtra: `<p class="verse" style="margin-top:0.75rem;">&ldquo;Ahora, pues, ninguna condenación hay para los que están en Cristo Jesús.&rdquo; &mdash; Romanos 8:1 <span class="section-note" style="display:inline;font-size:0.85em;">(Reina-Valera 1960)</span></p>`,
    relatedBtns:
      esRelatedCore +
      `
            <a class="btn btn-secondary" href="/miedo.html">Miedo</a>
            <a class="btn btn-secondary" href="/soledad.html">Soledad</a>
            <a class="btn btn-secondary" href="/agobio.html">Agobio</a>`,
  },
  {
    fileRel: 'agobio.html',
    title: "Agobio: versículos (Reina-Valera 1960) | Today's Daily Battle",
    desc: 'Cuando todo pesa a la vez: Reina-Valera 1960 (dominio público). Herramientas en inglés, KJV.',
    canonicalPath: '/agobio.html',
    enPath: '/topic-overwhelmed.html',
    extraHreflang: [
      ['fr', '/fr/deborde.html'],
      ['pt', '/pt/sobrecarga.html'],
    ],
    h1: 'Cuando todo se cae encima',
    lead: 'No tienes que cargar como si la fuerza fuera solo tuya. Él invita: ven como estás.',
    v1: '&ldquo;Venid a mí todos los que estáis trabajados y cargados, y yo os haré descansar.&rdquo; &mdash; Mateo 11:28 <span class="section-note" style="display:inline;font-size:0.85em;">(Reina-Valera 1960)</span>',
    simple: 'Jesús no dice «arregla todo» primero: dice «ven». El descanso empieza con un paso hacia Él.',
    feel: 'Cuando todo grita «urgente», este versículo recoloca el centro: puedes parar ante Él antes de romperse.',
    change: '«Venid a mí» mueve el peso de tu capacidad a Su acogida.',
    doit: 'Di en voz baja: «Señor, estoy cargado — vengo.» Tres respiraciones lentas.',
    vExtra: `<p class="verse" style="margin-top:0.75rem;">&ldquo;Echad sobre él toda vuestra ansiedad, porque él tiene cuidado de vosotros.&rdquo; &mdash; 1 Pedro 5:7 <span class="section-note" style="display:inline;font-size:0.85em;">(Reina-Valera 1960)</span></p>
          <p class="verse" style="margin-top:0.75rem;">&ldquo;Llevad mis cargas, y aprended de mí, que soy manso y humilde de corazón; y hallaréis descanso para vuestras almas.&rdquo; &mdash; Mateo 11:29 <span class="section-note" style="display:inline;font-size:0.85em;">(Reina-Valera 1960)</span></p>`,
    relatedBtns:
      esRelatedCore +
      `
            <a class="btn btn-secondary" href="/miedo.html">Miedo</a>
            <a class="btn btn-secondary" href="/soledad.html">Soledad</a>
            <a class="btn btn-secondary" href="/culpa.html">Culpa</a>`,
  },
];

for (const p of frPages) {
  fs.writeFileSync(path.join(ROOT, p.fileRel), frShell(p), 'utf8');
  console.log('wrote', p.fileRel);
}
for (const p of esPages) {
  fs.writeFileSync(path.join(ROOT, p.fileRel), esShell(p), 'utf8');
  console.log('wrote', p.fileRel);
}
console.log('Done. Mood depth FR+ES pages generated.');
