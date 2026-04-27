/**
 * PT parity layer: Spanish esperanza (hope) + FR/ES tool entry shells (plans, wall, reader, kids).
 * Run: node scripts/render-locale-parity.mjs
 * Pair with: npm run render:fr-es-moods (updates related-topic rows when esRelatedCore changes).
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { LANG_SWITCHER_INNER } from './lib/lang-switcher-inner.mjs';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');

const FR_MOOD_ROW = `            <a class="btn btn-secondary" href="/fr/">Hub FR</a>
            <a class="btn btn-secondary" href="/fr/anxiete.html">Anxiété</a>
            <a class="btn btn-secondary" href="/fr/espoir.html">Espoir</a>
            <a class="btn btn-secondary" href="/fr/peur.html">Peur</a>
            <a class="btn btn-secondary" href="/fr/force.html">Force</a>
            <a class="btn btn-secondary" href="/fr/paix.html">Paix</a>`;

const ES_MOOD_ROW = `            <a class="btn btn-secondary" href="/es/">Hub ES</a>
            <a class="btn btn-secondary" href="/ansiedad.html">Ansiedad</a>
            <a class="btn btn-secondary" href="/esperanza.html">Esperanza</a>
            <a class="btn btn-secondary" href="/miedo.html">Miedo</a>
            <a class="btn btn-secondary" href="/fuerza.html">Fuerza</a>
            <a class="btn btn-secondary" href="/paz.html">Paz</a>`;

function frToolShell({
  fileRel,
  title,
  desc,
  canonicalPath,
  enPath,
  h1,
  lead,
  whatTitle,
  whatBody,
  primaryLabel,
}) {
  const canonical = `https://todaysdailybattle.com${canonicalPath}`;
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
  <link rel="alternate" hreflang="x-default" href="https://todaysdailybattle.com/">
  <meta property="og:title" content="${title.replace(/"/g, '&quot;')}">
  <meta property="og:url" content="${canonical}">
  <meta property="og:type" content="website">
  <meta property="og:locale" content="fr_FR">
  <meta property="og:image" content="https://todaysdailybattle.com/logo-shield-600.png">
  <link rel="icon" href="/icon.svg" type="image/svg+xml">
  <link rel="stylesheet" href="/styles.css?v=20260326frhub">
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
        <p class="tdb-mood-door-kjv-banner" lang="fr">Porte d’accueil en français. L’outil complet s’ouvre en <strong>anglais</strong> ; texte biblique à l’écran en <abbr title="King James Version" lang="en">KJV</abbr>.</p>
      </div>
      <div class="brand">
        <a class="brand-title" href="/fr/">Today's Daily Battle</a>
        <span class="brand-subtitle">Donne-Le à Lui. Une Parole à la fois.</span>
      </div>
      <nav class="header-nav tdb-global-nav" aria-label="Navigation principale">
        <a href="/fr/">Accueil</a>
        <a href="/explore.html">Explore <span class="section-note" style="display:inline;font-size:0.85em;">(EN)</span></a>
        <a href="/fr/plans.html">Plans</a>
        <a href="/fr/mural.html">Mur</a>
        <a href="/fr/lecteur.html">Lecteur</a>
        <a href="/fr/enfants.html">Enfants</a>
      </nav>
      <a href="#sidebar" class="header-menu-link" id="sidebar-toggle" aria-label="Ouvrir le menu"><span class="menu-icon" aria-hidden="true">☰</span><span class="menu-text">Menu</span></a>
    </header>
    <aside id="sidebar" class="sidebar">
      <nav class="side-nav" aria-label="Navigation">
        <a href="/fr/">Hub FR</a>
        <a href="/verse.html" hreflang="en">Verset du jour (EN)</a>
        <a href="${enPath}" hreflang="en">Version anglaise</a>
      </nav>
    </aside>
    <main class="app-content" id="main-content">
      <div class="content-inner">
        <header class="hero-banner">
          <h1>${h1}</h1>
          <p class="real-talk">${lead}</p>
          <div class="cta-group">
            <a class="btn btn-primary" href="${enPath}" hreflang="en">${primaryLabel}</a>
            <a class="btn btn-secondary" href="/fr/">Retour au hub FR</a>
          </div>
        </header>
        <section class="glass" lang="fr">
          <h2 class="section-divider">${whatTitle}</h2>
          <p class="section-note">${whatBody}</p>
        </section>
        <section class="glass" lang="fr">
          <h2 class="section-divider">Autres portes en français</h2>
          <div class="cta-group" style="flex-wrap:wrap;gap:0.5rem;">
${FR_MOOD_ROW}
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
  <p class="site-footer-pilot-note" lang="fr">Page d’accueil de l’outil en français. Quand l’écran complet s’ouvre en anglais, le chemin reste clair ; le texte biblique à l’écran est en général <abbr title="King James Version" lang="en">KJV</abbr>. Tu peux t’arrêter sur cette page si c’est tout ce dont tu avais besoin.</p>
  <nav class="site-footer-essentials" aria-label="Liens principaux">
    <a href="/fr/">Accueil FR</a><span class="site-footer-ess-sep" aria-hidden="true">·</span>
    <a href="/">English home</a>
  </nav>
  <p class="site-footer-share-wrap">
    <button type="button" id="share-page" class="share-page-btn" aria-label="Partager cette page">Partager</button>
  </p>
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

function esToolShell({
  fileRel,
  title,
  desc,
  canonicalPath,
  enPath,
  h1,
  lead,
  whatTitle,
  whatBody,
  primaryLabel,
}) {
  const canonical = `https://todaysdailybattle.com${canonicalPath}`;
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
  <link rel="alternate" hreflang="x-default" href="https://todaysdailybattle.com/">
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
<body class="dark-mode pt-pilot-body">
  <a href="#main-content" class="skip-link">Ir al contenido principal</a>
  <div class="app-shell">
    <header class="top-bar">
      <div class="tdb-lang-switcher-header-wrap">
        <nav class="tdb-lang-switcher tdb-lang-switcher--header tdb-lang-switcher--labeled" aria-label="Elegir idioma" data-tdb-lang-switcher lang="es">
          <span class="tdb-lang-switcher-eyebrow" aria-hidden="true">Idioma</span>
          <span class="tdb-lang-switcher-inner">
${LANG_SWITCHER_INNER}
          </span>
        </nav>
        <p class="tdb-mood-door-kjv-banner" lang="es">Portada en español. La herramienta completa abre en <strong>inglés</strong>; Biblia en pantalla en <abbr title="King James Version" lang="en">KJV</abbr>.</p>
      </div>
      <div class="brand">
        <a class="brand-title" href="/es/">Today's Daily Battle</a>
        <span class="brand-subtitle">Dáselo a Él. Una Palabra a la vez.</span>
      </div>
      <nav class="header-nav tdb-global-nav" aria-label="Navegación principal">
        <a href="/es/">Inicio ES</a>
        <a href="/explore.html">Explore <span class="section-note" style="display:inline;font-size:0.85em;">(EN)</span></a>
        <a href="/planes.html">Planes</a>
        <a href="/muro.html">Muro</a>
        <a href="/lector.html">Lector</a>
        <a href="/ninos.html">Niños</a>
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
          <div class="cta-group">
            <a class="btn btn-primary" href="${enPath}" hreflang="en">${primaryLabel}</a>
            <a class="btn btn-secondary" href="/es/">Volver al hub ES</a>
          </div>
        </header>
        <section class="glass" lang="es">
          <h2 class="section-divider">${whatTitle}</h2>
          <p class="section-note">${whatBody}</p>
        </section>
        <section class="glass" lang="es">
          <h2 class="section-divider">Más temas en español</h2>
          <div class="cta-group" style="flex-wrap:wrap;gap:0.5rem;">
${ES_MOOD_ROW}
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
  <p class="site-footer-pilot-note" lang="es">Portada en español. Cuando la herramienta completa abre en inglés, el camino sigue siendo claro; la Escritura en pantalla suele ser <abbr title="King James Version" lang="en">KJV</abbr>. Sin prisa si hoy solo necesitabas esta entrada.</p>
  <nav class="site-footer-essentials" aria-label="Enlaces principales">
    <a href="/es/">Inicio ES</a><span class="site-footer-ess-sep" aria-hidden="true">·</span>
    <a href="/">English home</a>
  </nav>
  <p class="site-footer-share-wrap">
    <button type="button" id="share-page" class="share-page-btn" aria-label="Compartir esta página">Compartir</button>
  </p>
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

function esperanzaPage() {
  const canonical = 'https://todaysdailybattle.com/esperanza.html';
  const extraHref = `  <link rel="alternate" hreflang="fr" href="https://todaysdailybattle.com/fr/espoir.html">
  <link rel="alternate" hreflang="pt" href="https://todaysdailybattle.com/pt/esperanca.html">
`;
  return `<!DOCTYPE html>
<html lang="es">
<head>
  <script src="/vendor/dompurify.min.js"></script>
  <script src="/tt-bootstrap.js"></script>
  <script defer src="/analytics-loader.js"></script>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Esperanza: versículos (Reina-Valera 1960) | Today's Daily Battle</title>
  <meta name="description" content="Cuando el pecho pide una razón para seguir: Reina-Valera 1960 (dominio público). Herramientas en inglés, KJV.">
  <meta name="robots" content="index, follow">
  <link rel="canonical" href="${canonical}">
  <link rel="alternate" hreflang="es" href="${canonical}">
  <link rel="alternate" hreflang="en" href="https://todaysdailybattle.com/topic-hope.html">
${extraHref}  <link rel="alternate" hreflang="x-default" href="https://todaysdailybattle.com/">
  <meta property="og:title" content="Esperanza | Today's Daily Battle">
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
        <a href="/esperanza.html">Esperanza</a>
        <a href="/explore.html">Explore <span class="section-note" style="display:inline;font-size:0.85em;">(EN)</span></a>
      </nav>
      <a href="#sidebar" class="header-menu-link" id="sidebar-toggle" aria-label="Abrir menú"><span class="menu-icon" aria-hidden="true">☰</span><span class="menu-text">Menú</span></a>
    </header>
    <aside id="sidebar" class="sidebar">
      <nav class="side-nav" aria-label="Navegación">
        <a href="/es/">Hub ES</a>
        <a href="/verse.html" hreflang="en">Verso del día (EN)</a>
        <a href="/topic-hope.html" hreflang="en">Versión en inglés</a>
      </nav>
    </aside>
    <main class="app-content" id="main-content">
      <div class="content-inner">
        <header class="hero-banner">
          <h1>Cuando necesitas una razón para seguir</h1>
          <p class="real-talk">Dios no promete días sin dolor, pero sí presencia fiel — y Su Palabra puede sostener el siguiente aliento.</p>
          <p class="section-note" style="margin-top:0.5rem;">Citas: <strong>Reina-Valera 1960</strong> (dominio público). Herramientas del sitio en inglés.</p>
        </header>
        <section class="glass es-topic-breakdown" lang="es">
          <div class="breakdown">
            <h2>Versículo para hoy</h2>
            <p class="verse">&ldquo;Y el Dios de esperanza os llene de todo gozo y paz en el creer, para que abundéis en esperanza por el poder del Espíritu Santo.&rdquo; &mdash; Romanos 15:13 <span class="section-note" style="display:inline;font-size:0.85em;">(Reina-Valera 1960)</span></p>
            <h3>En palabras simples</h3>
            <p>La esperanza aquí no es optimismo barato: es confianza puesta en quien puede llenar de gozo y paz mientras crees.</p>
            <h3>Cómo se siente hoy</h3>
            <p>Cuando todo parece gris, este versículo nombra una fuente — el Dios de esperanza — que no depende de tus fuerzas.</p>
            <h3>Por qué esto importa</h3>
            <p>«Por el poder del Espíritu Santo» recuerda que no cargas solo el peso del mañana.</p>
            <h3>Haz esto ahora</h3>
            <p>Di en voz baja: «Señor, llena mi pecho de Tu paz — una respiración a la vez.» Quédate quieto un momento.</p>
          </div>
        </section>
        <section class="glass" lang="es">
          <h2 class="section-divider">Otro versículo, si el alma sigue cansada</h2>
          <p class="verse" style="margin-top:0.75rem;">&ldquo;Porque yo sé los pensamientos que tengo acerca de vosotros, dice Jehová, pensamientos de paz, y no de mal, para daros el fin que esperáis.&rdquo; &mdash; Jeremías 29:11 <span class="section-note" style="display:inline;font-size:0.85em;">(Reina-Valera 1960)</span></p>
          <p class="verse" style="margin-top:0.75rem;">&ldquo;Para que por dos cosas inmutables, en las cuales es imposible que Dios mienta, tengamos un fortísimo consuelo, los que acudimos para asirnos de la esperanza puesta delante de nosotros.&rdquo; &mdash; Hebreos 6:18 <span class="section-note" style="display:inline;font-size:0.85em;">(Reina-Valera 1960)</span></p>
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
${ES_MOOD_ROW}
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
  <p class="site-footer-pilot-note" lang="es">Página en español. Cuando una herramienta abre en inglés, la puerta sigue siendo clara; la Escritura en pantalla suele ser <abbr title="King James Version" lang="en">KJV</abbr>. Sin prisa si hoy solo te quedas aquí.</p>
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

const frTools = [
  {
    fileRel: 'fr/plans.html',
    title: "Plans de lecture (porte FR) | Today's Daily Battle",
    desc: 'Plans KJV : ouvrir la version anglaise. Porte honnête en français.',
    canonicalPath: '/fr/plans.html',
    enPath: '/plans.html',
    h1: 'Plans de lecture — interface en anglais',
    lead: 'Les parcours (7 à 40 jours) vivent sur la page anglaise : texte KJV, hors ligne possible. Ici, on ouvre la porte sans promesse fausse.',
    whatTitle: 'Ce que vous y trouverez',
    whatBody: 'Gratitude, paix, force, de la peur à la foi, deuil, douleur chronique, et d’autres plans pour des jours réels — pensés pour des gens réels.',
    primaryLabel: 'Ouvrir les plans en anglais',
  },
  {
    fileRel: 'fr/mural.html',
    title: "Mur de prière (porte FR) | Today's Daily Battle",
    desc: 'Prière et encouragement : outil complet en anglais. Porte en français.',
    canonicalPath: '/fr/mural.html',
    enPath: '/message.html',
    h1: 'Mur de prière',
    lead: 'Publier, prier, encourager : l’écran complet est en anglais pour l’instant, avec des règles de respect claires sur la page d’origine.',
    whatTitle: 'Avant d’ouvrir',
    whatBody: 'Vous restez maître de ce que vous partagez. Lisez l’encadré confidentialité sur la page anglaise si vous hésitez.',
    primaryLabel: 'Ouvrir le mur en anglais',
  },
  {
    fileRel: 'fr/lecteur.html',
    title: "Lecteur de chapitres (porte FR) | Today's Daily Battle",
    desc: 'Lire la Bible chapitre par chapitre : outil en anglais, KJV. Porte FR.',
    canonicalPath: '/fr/lecteur.html',
    enPath: '/reader.html',
    h1: 'Lecteur de chapitres',
    lead: 'Le lecteur complet est en anglais ; le texte affiché est en général KJV. Cette page dit la vérité avant le saut.',
    whatTitle: 'Pourquoi cette porte',
    whatBody: 'Un seul bouton ouvre l’outil réel — pas de copie partielle qui ferait croire à une traduction complète.',
    primaryLabel: 'Ouvrir le lecteur en anglais',
  },
  {
    fileRel: 'fr/enfants.html',
    title: "Enfants — coin famille (porte FR) | Today's Daily Battle",
    desc: 'Histoires et coin enfants : contenu en anglais. Porte d’accueil en français.',
    canonicalPath: '/fr/enfants.html',
    enPath: '/kids-corner.html',
    h1: 'Enfants — même mission, autre langue d’abord',
    lead: 'Les histoires et jeux du coin enfants sont surtout en anglais pour l’instant. Les parents peuvent ouvrir la porte avec des mots clairs.',
    whatTitle: 'Ce qui vous attend',
    whatBody: 'Boucles courtes, ton doux, références bibliques — l’expérience reste en anglais jusqu’à extension locale.',
    primaryLabel: 'Ouvrir le coin enfants (EN)',
  },
];

const esTools = [
  {
    fileRel: 'planes.html',
    title: "Planes de lectura (portada ES) | Today's Daily Battle",
    desc: 'Planes KJV: abrir la versión en inglés. Portada honesta en español.',
    canonicalPath: '/planes.html',
    enPath: '/plans.html',
    h1: 'Planes de lectura — pantalla en inglés',
    lead: 'Los recorridos viven en la página en inglés: texto KJV, posible uso sin conexión. Aquí solo abrimos la puerta con claridad.',
    whatTitle: 'Qué encontrarás',
    whatBody: 'Rutas de varios días para gratitud, paz, fuerza, duelo, dolor persistente y más — pensadas para días reales.',
    primaryLabel: 'Abrir planes en inglés',
  },
  {
    fileRel: 'muro.html',
    title: "Muro de oración (portada ES) | Today's Daily Battle",
    desc: 'Oración y ánimo: herramienta completa en inglés. Portada en español.',
    canonicalPath: '/muro.html',
    enPath: '/message.html',
    h1: 'Muro de oración',
    lead: 'Publicar, orar, animar: la pantalla completa está en inglés por ahora, con normas claras en la página original.',
    whatTitle: 'Antes de abrir',
    whatBody: 'Tú decides cuánto compartes. Si dudas, lee el aviso de privacidad en la página en inglés.',
    primaryLabel: 'Abrir el muro en inglés',
  },
  {
    fileRel: 'lector.html',
    title: "Lector de capítulos (portada ES) | Today's Daily Battle",
    desc: 'Leer la Biblia por capítulos: herramienta en inglés, KJV. Portada ES.',
    canonicalPath: '/lector.html',
    enPath: '/reader.html',
    h1: 'Lector de capítulos',
    lead: 'El lector completo está en inglés; el texto en pantalla suele ser KJV. Esta portada lo dice antes del salto.',
    whatTitle: 'Por qué esta puerta',
    whatBody: 'Un solo botón abre la herramienta real — sin copia a medias que parezca traducción completa.',
    primaryLabel: 'Abrir el lector en inglés',
  },
  {
    fileRel: 'ninos.html',
    title: "Niños — rincón familiar (portada ES) | Today's Daily Battle",
    desc: 'Historias y rincón infantil: contenido en inglés. Portada en español.',
    canonicalPath: '/ninos.html',
    enPath: '/kids-corner.html',
    h1: 'Niños — misma misión, otro idioma primero',
    lead: 'Historias y juegos del rincón siguen mayormente en inglés. Los padres pueden entrar con palabras claras.',
    whatTitle: 'Qué hay dentro',
    whatBody: 'Bucles breves, tono sereno, referencias bíblicas — la experiencia sigue en inglés hasta ampliar el idioma.',
    primaryLabel: 'Abrir rincón infantil (EN)',
  },
];

fs.writeFileSync(path.join(ROOT, 'esperanza.html'), esperanzaPage(), 'utf8');
console.log('wrote esperanza.html');

for (const t of frTools) {
  fs.writeFileSync(path.join(ROOT, t.fileRel), frToolShell(t), 'utf8');
  console.log('wrote', t.fileRel);
}
for (const t of esTools) {
  fs.writeFileSync(path.join(ROOT, t.fileRel), esToolShell(t), 'utf8');
  console.log('wrote', t.fileRel);
}
console.log('Locale parity pages done.');
