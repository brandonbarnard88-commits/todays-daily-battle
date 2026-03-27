#!/usr/bin/env node
/**
 * One-shot generator: 9 localized Hope mood-door pilots (AR, HI, RU, SV, PT, BN, SW, ID, TL).
 * Run from repo root: node scripts/generate-hope-pilot-pages.mjs
 *
 * Note: Chinese peace (Calm pair) lives at /zh/heping.html — PT /pt/paz.html maps there in language-switcher.js (not /zh/jiaolv.html).
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");

const HREFLANG = `
  <link rel="alternate" hreflang="en" href="https://todaysdailybattle.com/topic-hope.html">
  <link rel="alternate" hreflang="fr" href="https://todaysdailybattle.com/fr/espoir.html">
  <link rel="alternate" hreflang="zh-CN" href="https://todaysdailybattle.com/zh/xiwang.html">
  <link rel="alternate" hreflang="ar" href="https://todaysdailybattle.com/ar/rajaa.html">
  <link rel="alternate" hreflang="hi" href="https://todaysdailybattle.com/hi/asha.html">
  <link rel="alternate" hreflang="ru" href="https://todaysdailybattle.com/ru/nadezhda.html">
  <link rel="alternate" hreflang="sv" href="https://todaysdailybattle.com/sv/hopp.html">
  <link rel="alternate" hreflang="pt" href="https://todaysdailybattle.com/pt/esperanca.html">
  <link rel="alternate" hreflang="bn" href="https://todaysdailybattle.com/bn/asha.html">
  <link rel="alternate" hreflang="sw" href="https://todaysdailybattle.com/sw/tumaini.html">
  <link rel="alternate" hreflang="id" href="https://todaysdailybattle.com/id/harapan.html">
  <link rel="alternate" hreflang="tl" href="https://todaysdailybattle.com/tl/pagasa.html">
  <link rel="alternate" hreflang="x-default" href="https://todaysdailybattle.com/">`;

function shell(html, lang, skip, brand, eyebrow, navLabel, main) {
  return `<!DOCTYPE html>
<html lang="${lang}">
<head>
  <script src="/vendor/dompurify.min.js"></script>
  <script src="/tt-bootstrap.js"></script>
  <script defer src="/analytics-loader.js"></script>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  ${main.headExtra || ""}
  <meta name="robots" content="index, follow">
  <link rel="canonical" href="https://todaysdailybattle.com${main.path}">
  <link rel="alternate" hreflang="${main.hreflangCode}" href="https://todaysdailybattle.com${main.path}">
  ${HREFLANG}
  ${main.og || ""}
  <link rel="icon" href="/icon.svg" type="image/svg+xml">
  <link rel="stylesheet" href="/styles.css?v=20260305p">
  <link rel="manifest" href="/manifest.json">
  <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.99.2/dist/umd/supabase.min.js" integrity="sha384-zETTH+6IXxKQ6zbGcT6H6EDdnGaae9uhI8uO7doTJoNEmPGeTKVOe5S6/XybS9JH" crossorigin="anonymous" data-cfasync="false" defer></script>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="${main.fontsHref}" rel="stylesheet">
  <script nonce="tdb2025s" type="application/ld+json">
  {"@context":"https://schema.org","@graph":[{"@type":"Article","headline":${JSON.stringify(main.jsonHeadline)},"url":"https://todaysdailybattle.com${main.path}","dateModified":"2026-03-26","publisher":{"@type":"Organization","name":"Today's Daily Battle","url":"https://todaysdailybattle.com","logo":{"@type":"ImageObject","url":"https://todaysdailybattle.com/logo-shield-600.png"}},"inLanguage":"${main.schemaLang}","keywords":${JSON.stringify(main.keywords)}},{"@type":"BreadcrumbList","itemListElement":[{"@type":"ListItem","position":1,"name":${JSON.stringify(main.bc1)},"item":"https://todaysdailybattle.com/"},{"@type":"ListItem","position":2,"name":${JSON.stringify(main.bc2)},"item":"https://todaysdailybattle.com${main.path}"}]}]}
  </script>
</head>
<body class="dark-mode${main.bodyClass ? " " + main.bodyClass : ""}">
  <a href="#main-content" class="skip-link">${skip}</a>
  <div class="app-shell">
    <header class="top-bar">
      <div class="tdb-lang-switcher-header-wrap">
        <nav class="tdb-lang-switcher tdb-lang-switcher--header tdb-lang-switcher--labeled" aria-label="Choose language" data-tdb-lang-switcher lang="en">
          <span class="tdb-lang-switcher-eyebrow" aria-hidden="true">${eyebrow}</span>
          <span class="tdb-lang-switcher-inner">
            <a class="tdb-lang-opt" href="/" hreflang="en" data-tdb-pick="en">English</a>
            <span class="tdb-lang-sep" aria-hidden="true">·</span>
            <a class="tdb-lang-opt" href="/explore.html#topics-es" hreflang="es" data-tdb-pick="es">Español</a>
            <span class="tdb-lang-sep" aria-hidden="true">·</span>
            <a class="tdb-lang-opt" href="/fr/anxiete.html" hreflang="fr" data-tdb-pick="fr">Français</a>
            <span class="tdb-lang-sep" aria-hidden="true">·</span>
            <a class="tdb-lang-opt" href="/zh/jiaolv.html" hreflang="zh-CN" data-tdb-pick="zh">中文</a>
            <span class="tdb-lang-sep" aria-hidden="true">·</span>
            <a class="tdb-lang-opt" href="/id/kecemasan.html" hreflang="id" data-tdb-pick="id">Bahasa Indonesia</a>
            <span class="tdb-lang-sep" aria-hidden="true">·</span>
            <a class="tdb-lang-opt" href="/tl/kabalisahan.html" hreflang="tl" data-tdb-pick="tl">Tagalog</a>
            <span class="tdb-lang-sep" aria-hidden="true">·</span>
            <a class="tdb-lang-opt" href="/ar/qalaq.html" hreflang="ar" data-tdb-pick="ar">العربية</a>
            <span class="tdb-lang-sep" aria-hidden="true">·</span>
            <a class="tdb-lang-opt" href="/hi/chinta.html" hreflang="hi" data-tdb-pick="hi">हिन्दी</a>
            <span class="tdb-lang-sep" aria-hidden="true">·</span>
            <a class="tdb-lang-opt" href="/ru/trevoga.html" hreflang="ru" data-tdb-pick="ru">Русский</a>
            <span class="tdb-lang-sep" aria-hidden="true">·</span>
            <a class="tdb-lang-opt" href="/sv/oro.html" hreflang="sv" data-tdb-pick="sv">Svenska</a>
            <span class="tdb-lang-sep" aria-hidden="true">·</span>
            <a class="tdb-lang-opt" href="/pt/ansiedade.html" hreflang="pt" data-tdb-pick="pt">Português</a>
            <span class="tdb-lang-sep" aria-hidden="true">·</span>
            <a class="tdb-lang-opt" href="/bn/chinta.html" hreflang="bn" data-tdb-pick="bn">বাংলা</a>
            <span class="tdb-lang-sep" aria-hidden="true">·</span>
            <a class="tdb-lang-opt" href="/sw/wasiwasi.html" hreflang="sw" data-tdb-pick="sw">Kiswahili</a>
            <span class="tdb-lang-sep" aria-hidden="true">·</span>
            <a class="tdb-lang-opt tdb-lang-more" href="/explore.html#languages">More languages</a>
          </span>
        </nav>
        <p class="tdb-mood-door-kjv-banner" lang="${main.bannerLang}"${main.bannerDir ? " dir=\"" + main.bannerDir + "\"" : ""}>${main.banner}</p>
      </div>
      <div class="brand">
        <a class="brand-title" href="/">Today's Daily Battle</a>
        <span class="brand-subtitle">${brand}</span>
      </div>
      <nav class="header-nav tdb-global-nav" aria-label="${navLabel.aria}">
        ${navLabel.links}
      </nav>
      <a href="#sidebar" class="header-menu-link" id="sidebar-toggle" aria-label="${navLabel.menuAria}"><span class="menu-icon" aria-hidden="true">☰</span><span class="menu-text">${navLabel.menuText}</span></a>
    </header>
    <aside id="sidebar" class="sidebar">
      <nav class="side-nav" aria-label="${main.sideAria}">
        ${main.sideLinks}
      </nav>
    </aside>
    <main class="app-content" id="main-content">
      <div class="content-inner">
        <header class="hero-banner">
          <h1>${main.h1}</h1>
          <p class="real-talk">${main.lead}</p>
          <p class="section-note" style="margin-top:0.5rem;">${main.heroNote}</p>
          <div class="cta-group">
            <a class="btn btn-primary" href="/?q=hope">${main.btnSearch}</a>
            <a class="btn btn-secondary" href="/bible-tool.html">${main.btnBible}</a>
            <a class="btn btn-secondary" href="/message.html">${main.btnWall}</a>
            <a class="btn btn-secondary" href="/verse.html">${main.btnVerse}</a>
          </div>
        </header>
        <section class="glass ${main.breakdownClass}" lang="${main.contentLang}"${main.contentDir ? " dir=\"" + main.contentDir + "\"" : ""}>
          <div class="breakdown">
            <h2>${main.h2verses}</h2>
            ${main.versesBlock}
            <h3>${main.h3simple}</h3>
            <p>${main.psimple}</p>
            <h3>${main.h3sweet}</h3>
            <p>${main.psweet}</p>
            <h3>${main.h3why}</h3>
            <p>${main.pwhy}</p>
            <h3>${main.h3do}</h3>
            <p>${main.pdo}</p>
          </div>
        </section>
        <section class="glass ${main.toolsClass}" lang="${main.contentLang}"${main.contentDir ? " dir=\"" + main.contentDir + "\"" : ""}>
          <h2 class="section-divider">${main.toolsH2}</h2>
          <p class="section-note">${main.toolsNote}</p>
          <nav class="cta-group" aria-label="${main.toolsNavAria}" style="display:flex !important;flex-wrap:wrap;gap:0.5rem;">
            <a class="btn btn-secondary" href="/plans.html" hreflang="en">${main.tPlans}</a>
            <a class="btn btn-secondary" href="/calm.html" hreflang="en">${main.tCalm}</a>
            <a class="btn btn-secondary" href="/bible-tool.html" hreflang="en">${main.tBible}</a>
            <a class="btn btn-secondary" href="/explore.html#languages" hreflang="en">${main.tExplore}</a>
          </nav>
        </section>
        <section class="glass" lang="${main.contentLang}"${main.contentDir ? " dir=\"" + main.contentDir + "\"" : ""}>
          <h2 class="section-divider">${main.moreH2}</h2>
          <div class="cta-group" style="flex-wrap:wrap;gap:0.5rem;">
            ${main.moreButtons}
          </div>
        </section>
      </div>
    </main>
    <footer class="site-footer site-footer--canonical" role="contentinfo" aria-label="Site footer">
  <nav class="tdb-lang-switcher tdb-lang-switcher--footer tdb-lang-switcher--labeled" aria-label="Choose language" data-tdb-lang-switcher lang="en">
    <span class="tdb-lang-switcher-eyebrow" aria-hidden="true">Language</span>
    <span class="tdb-lang-switcher-inner">
      <a class="tdb-lang-opt" href="/" hreflang="en" data-tdb-pick="en">English</a>
      <span class="tdb-lang-sep" aria-hidden="true">·</span>
      <a class="tdb-lang-opt" href="/explore.html#topics-es" hreflang="es" data-tdb-pick="es">Español</a>
      <span class="tdb-lang-sep" aria-hidden="true">·</span>
      <a class="tdb-lang-opt" href="/fr/anxiete.html" hreflang="fr" data-tdb-pick="fr">Français</a>
      <span class="tdb-lang-sep" aria-hidden="true">·</span>
      <a class="tdb-lang-opt" href="/zh/jiaolv.html" hreflang="zh-CN" data-tdb-pick="zh">中文</a>
      <span class="tdb-lang-sep" aria-hidden="true">·</span>
      <a class="tdb-lang-opt" href="/id/kecemasan.html" hreflang="id" data-tdb-pick="id">Bahasa Indonesia</a>
      <span class="tdb-lang-sep" aria-hidden="true">·</span>
      <a class="tdb-lang-opt" href="/tl/kabalisahan.html" hreflang="tl" data-tdb-pick="tl">Tagalog</a>
      <span class="tdb-lang-sep" aria-hidden="true">·</span>
      <a class="tdb-lang-opt" href="/ar/qalaq.html" hreflang="ar" data-tdb-pick="ar">العربية</a>
      <span class="tdb-lang-sep" aria-hidden="true">·</span>
      <a class="tdb-lang-opt" href="/hi/chinta.html" hreflang="hi" data-tdb-pick="hi">हिन्दी</a>
      <span class="tdb-lang-sep" aria-hidden="true">·</span>
      <a class="tdb-lang-opt" href="/ru/trevoga.html" hreflang="ru" data-tdb-pick="ru">Русский</a>
      <span class="tdb-lang-sep" aria-hidden="true">·</span>
      <a class="tdb-lang-opt" href="/sv/oro.html" hreflang="sv" data-tdb-pick="sv">Svenska</a>
      <span class="tdb-lang-sep" aria-hidden="true">·</span>
      <a class="tdb-lang-opt" href="/pt/ansiedade.html" hreflang="pt" data-tdb-pick="pt">Português</a>
      <span class="tdb-lang-sep" aria-hidden="true">·</span>
      <a class="tdb-lang-opt" href="/bn/chinta.html" hreflang="bn" data-tdb-pick="bn">বাংলা</a>
      <span class="tdb-lang-sep" aria-hidden="true">·</span>
      <a class="tdb-lang-opt" href="/sw/wasiwasi.html" hreflang="sw" data-tdb-pick="sw">Kiswahili</a>
      <span class="tdb-lang-sep" aria-hidden="true">·</span>
      <a class="tdb-lang-opt tdb-lang-more" href="/explore.html#languages">More languages</a>
    </span>
  </nav>
  <p class="site-footer-pilot-note" lang="${main.contentLang}">${main.footerNote}</p>
  <nav class="site-footer-essentials" aria-label="Key pages">
    <a href="/">Home</a><span class="site-footer-ess-sep" aria-hidden="true">·</span>
    <a href="/explore.html">Explore</a><span class="site-footer-ess-sep" aria-hidden="true">·</span>
    <a href="/kids-corner.html">Kids Corner</a><span class="site-footer-ess-sep" aria-hidden="true">·</span>
    <a href="/message.html">Prayer Wall</a><span class="site-footer-ess-sep" aria-hidden="true">·</span>
    <a href="/about.html">About</a><span class="site-footer-ess-sep" aria-hidden="true">·</span>
    <a href="/calm.html">Calm</a>
  </nav>
  <p class="site-footer-share-wrap">
    <button type="button" id="share-page" class="share-page-btn" aria-label="Share this page">Share this page</button>
  </p>
  <nav class="bottom-nav" role="navigation" aria-label="Plans and Spanish topics">
    <a href="/plans.html">Plans</a>
    <a href="/explore.html">Explore</a>
    <a href="/kids/">Kids Battle</a>
    <span class="bottom-nav-es-inline" role="group" aria-label="Spanish mood pages: verses in Spanish (Reina-Valera 1960, public domain). Site Bible tool stays KJV English.">
      <a href="/ansiedad.html" hreflang="es" aria-label="Spanish topic: Ansiedad (anxiety)">Anxiety (ES)</a>
      <a href="/fuerza.html" hreflang="es" aria-label="Spanish topic: Fuerza (strength)">Strength (ES)</a>
      <a href="/paz.html" hreflang="es" aria-label="Spanish topic: Paz (peace)">Peace (ES)</a>
    </span>
    <details class="bottom-nav-es-more">
      <summary><span class="bottom-nav-es-more-label">ES topics</span><span class="sr-only">Ansiedad, Fuerza, Paz</span></summary>
      <div class="bottom-nav-es-more-panel" role="group" aria-label="Spanish topical pages">
        <a href="/ansiedad.html" hreflang="es" lang="es" aria-label="Spanish topic: Ansiedad">Ansiedad</a>
        <a href="/fuerza.html" hreflang="es" lang="es" aria-label="Spanish topic: Fuerza">Fuerza</a>
        <a href="/paz.html" hreflang="es" lang="es" aria-label="Spanish topic: Paz">Paz</a>
      </div>
    </details>
  </nav>
  <nav class="site-footer-nav" aria-label="Footer links">
    <a href="/privacy.html">Privacy</a>
    <a href="/terms.html">Terms</a>
    <a href="/faq.html">FAQ</a>
    <a href="/pricing.html">Pricing</a>
    <a href="/reader.html">Chapter reader</a>
    <a href="/bible-tool.html">Bible tool</a>
    <a href="/testimonials.html">Reader stories</a>
    <a href="/verse-cards/">Verse cards</a>
    <a href="/security.html">Security</a>
    <button type="button" id="footer-open-settings" class="footer-appearance-link">Appearance</button>
    <a href="https://buymeacoffee.com/todaysdailybattle" target="_blank" rel="noopener" aria-label="Support the site — Buy me a coffee">Support</a>
  </nav>
  <details class="footer-sitemap">
    <summary>Sitemap — topics, tools, church &amp; family (tap to expand)</summary>
    <div class="footer-sitemap-grid">
      <div class="footer-sitemap-col">
        <h3>Topics</h3>
        <a href="/explore.html">Full list (all pages)</a>
        <a href="/topic-anxiety.html">Anxiety</a>
        <a href="/topic-fear.html">Fear</a>
        <a href="/topic-grief.html">Grief</a>
        <a href="/topic-hope.html">Hope</a>
        <a href="/topic-strength.html">Strength</a>
        <a href="/topic-parenting.html">Parenting</a>
        <a href="/topic-loneliness.html">Loneliness</a>
        <a href="/topic-forgiveness.html">Forgiveness</a>
        <a href="/topic-guilt.html">Guilt</a>
        <a href="/topic-overwhelmed.html">Overwhelmed</a>
        <a href="/topic-worthless.html">Worth / identity</a>
      </div>
      <div class="footer-sitemap-col footer-sitemap-col--es-links">
        <h3>Spanish devotionals</h3>
        <a href="/ansiedad.html" hreflang="es" lang="es">Ansiedad</a>
        <a href="/fuerza.html" hreflang="es" lang="es">Fuerza</a>
        <a href="/paz.html" hreflang="es" lang="es">Paz</a>
        <a href="/explore.html#topics-es">All Spanish topics on Explore</a>
      </div>
      <div class="footer-sitemap-col">
        <h3>Tools</h3>
        <a href="/verse.html">Verse of the Day</a>
        <a href="/reader.html">Chapter reader</a>
        <a href="/bible-tool.html">Bible tool</a>
        <a href="/my-verses.html">My Verses</a>
        <a href="/calm.html">Calm</a>
        <a href="/mobius.html">Möbius</a>
        <a href="/plans.html">Battle plans</a>
        <a href="/reading-plan.html">7-day plan</a>
        <a href="/study.html">Study workspace</a>
        <a href="/wins.html">Wins</a>
        <a href="/progress.html">Progress</a>
      </div>
      <div class="footer-sitemap-col">
        <h3>Church &amp; family</h3>
        <a href="/church.html">Church center</a>
        <a href="/church/">Church join hub</a>
        <a href="/team-toolkit.html">Team toolkit</a>
        <a href="/pastor-toolkit.html">Pastor toolkit</a>
        <a href="/pastor/">Pastor hub</a>
        <a href="/sermon.html">Sermon builder</a>
        <a href="/kids-corner.html">Kids corner</a>
        <a href="/kids/?v=hub20260321">Kids battle</a>
        <a href="/coloring.html">Kids coloring</a>
      </div>
      <div class="footer-sitemap-col">
        <h3>More</h3>
        <a href="/message.html">Prayer wall</a>
        <a href="/bible-study.html">Bible studies</a>
        <a href="/shop.html">Shop</a>
        <a href="/story.html">Story</a>
        <a href="/approach.html">How we respond</a>
        <a href="/why-not-ai.html">Why not AI?</a>
        <a href="/curriculum.html">Curriculum</a>
        <a href="/verse-cards/">Verse cards</a>
        <a href="/contact.html">Contact</a>
        <a href="/security.html">Security</a>
      </div>
    </div>
  </details>
  <p class="footer-humility">We battle. He wins.</p>
  <p class="site-footer-story">Built by hand, for real days. <a href="/about.html">About</a> · <a href="/story.html">Story</a>.</p>
  <div class="footer-friday-signup footer-friday-signup--compact" id="footerFridaySignup" role="form" aria-label="Friday verse and prayer email signup">
    <p class="footer-friday-signup-label">Friday: one verse + short prayer. No spam.</p>
    <div class="footer-friday-signup-row">
      <label for="footer-friday-email" class="sr-only">Email for Friday recap</label>
      <input type="email" id="footer-friday-email" class="footer-friday-email" placeholder="your@email.com" aria-label="Email for Friday recap" autocomplete="email">
      <button type="button" id="footer-friday-submit" class="btn btn-secondary footer-friday-submit">Subscribe</button>
    </div>
    <p class="footer-friday-status section-note" id="footerFridayStatus" aria-live="polite"></p>
  </div>
  <p class="site-footer-copy site-footer-legal-line">© 2026 Today&rsquo;s Daily Battle. All Scripture <abbr title="King James Version">KJV</abbr> unless noted on the page.</p>
  <p class="privacy-line site-footer-trust-hook">Built from pain, not polish. No ads. No selling data. Your prayers stay on your device.</p>
  <p class="site-footer-mood-insight" id="footerMoodInsight" aria-live="polite"></p>
  <p class="site-footer-hint" aria-hidden="true">Something hidden here...</p>
  <p class="site-footer-updated">Last updated: <span id="footer-date">TDB_BUILD_DATE</span></p>
  <script defer src="/language-switcher.js"></script>
</footer>
  </div>
  <script type="module" src="/config.js"></script>
  <script type="module" src="/script.js?v=20260328feelwire" data-cfasync="false"></script>
</body>
</html>`;
}

const pages = [];

// —— Portuguese ——
pages.push({
  rel: "pt/esperanca.html",
  lang: "pt",
  skip: "Ir para o conteúdo principal",
  brand: "Uma esperança que não confunde — Romanos 5:5.",
  eyebrow: "Idioma",
  navLabel: {
    aria: "Navegação principal",
    menuAria: "Abrir menu",
    menuText: "Menu",
    links: `<a href="/">Início</a>
        <a href="/explore.html">Explore</a>
        <a href="/calm.html">Calm</a>
        <a href="/plans.html">Plans</a>
        <a href="/#quick-actions-hero">Temas</a>
        <a href="/kids-corner.html">Crianças</a>
        <a href="/bible-tool.html">Ferramentas</a>
        <a href="/story.html">História</a>`,
  },
  main: {
    path: "/pt/esperanca.html",
    hreflangCode: "pt",
    headExtra: `<title>Esperança: Palavras da Bíblia (Almeida, domínio público) | Today's Daily Battle</title>
  <meta name="description" content="Esperança: versos Almeida (tradição pública), repères em português. Ferramentas do site em inglês; KJV nas ferramentas.">`,
    og: `<meta property="og:title" content="Esperança | Today's Daily Battle">
  <meta property="og:url" content="https://todaysdailybattle.com/pt/esperanca.html">
  <meta property="og:type" content="website">
  <meta property="og:image" content="https://todaysdailybattle.com/logo-shield-600.png">
  <meta property="og:locale" content="pt_BR">`,
    fontsHref: "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Inter:wght@400;500;600;700&display=swap",
    jsonHeadline: "Esperança: texto bíblico Almeida (domínio público)",
    schemaLang: "pt",
    keywords: "esperança, Bíblia, Almeida, Romanos 15, Jeremias 29, Hebreus 6",
    bc1: "Início",
    bc2: "Esperança",
    bodyClass: "pt-pilot-body",
    bannerLang: "pt",
    banner: `Versos nesta página: português. Ferramentas em inglês: a Bíblia na tela costuma ser <abbr title="King James Version" lang="en">KJV</abbr>.`,
    sideAria: "Navegação do site",
    sideLinks: `<a href="/" data-section="search" data-icon="SR">Busca</a>
        <a href="/verse.html" data-section="verse-of-day" data-icon="VD">Verso do dia</a>
        <a href="/message.html" data-section="message-board" data-icon="MB">Mural de oração</a>
        <a href="/bible-tool.html" data-section="bible-tool" data-icon="BT">Bíblia</a>
        <a href="/topic-hope.html" hreflang="en">Hope (English)</a>
        <a href="/pt/ansiedade.html" hreflang="pt">Ansiedade (PT)</a>`,
    h1: "Quando você precisa de esperança",
    lead: "Deus tem pensamentos de paz para você — não palavras vazias, mas uma âncora para os dias cinzentos.",
    heroNote: "Citações: tradição <strong>Almeida</strong> (linhagem de domínio público). O restante do site costuma estar em inglês; nas ferramentas, a Bíblia na tela é em geral <abbr title=\"King James Version\" lang=\"en\">KJV</abbr>.",
    btnSearch: `Buscar na página inicial — digite <span lang="en">hope</span> (inglês)`,
    btnBible: "Bíblia (EN)",
    btnWall: "Mural completo (EN)",
    btnVerse: "Verso do dia (EN)",
    breakdownClass: "pt-hope-breakdown",
    contentLang: "pt",
    h2verses: "Versos para hoje",
    versesBlock: `<p class="verse">«Ora o Deus de esperança vos encha de todo o gozo e paz na fé, para que abundeis em esperança pelo poder do Espírito Santo.» — Romanos 15:13 <span class="section-note" style="display:inline;font-size:0.85em;">(Almeida, domínio público)</span></p>
            <p class="verse" style="margin-top:1rem;">«Porque eu bem sei os pensamentos que tenho a vosso respeito, diz o Senhor; pensamentos de paz, e não de mal, para vos dar o fim que esperais.» — Jeremias 29:11 <span class="section-note" style="display:inline;font-size:0.85em;">(Almeida)</span></p>
            <p class="verse" style="margin-top:1rem;">«A qual temos como âncora da alma, segura e firme.» — Hebreus 6:19 <span class="section-note" style="display:inline;font-size:0.85em;">(Almeida)</span></p>`,
    h3simple: "Em palavras simples",
    psimple: "Esperança bíblica não é cruzar os dedos: é o Deus da esperança encher você de alegria e paz na fé, pelo Espírito.",
    h3sweet: "Uma palavra gentil",
    psweet: "Romanos 5:5 diz que essa esperança não nos confunde — ela aguenta quando a vida treme.",
    h3why: "Por que essa esperança sustenta",
    pwhy: "Ela se ancora em Deus, não no seu humor. A promessa tem rosto e fidelidade — você pode separar o medo de amanhã da certeza de quem Ele é. Quando o Deus da esperança enche o coração, você deixa de carregar sozinho a prova de que o dia vai melhorar.",
    h3do: "Faça agora",
    pdo: "Sussurre: «Senhor, eu me apego à Tua promessa, não ao meu humor.» Respire devagar três vezes. Não precisa forçar alegria — só voltar o rosto para Ele um minuto.",
    toolsClass: "pt-hope-tools",
    toolsH2: "Ferramentas do site — tela em inglês",
    toolsNote: `Cada link abre página em <strong>inglês</strong>; o texto bíblico nas ferramentas é <strong>KJV</strong>. <strong lang="en">(EN)</strong> lembra a troca de idioma.`,
    toolsNavAria: "Ferramentas EN",
    tPlans: "Planos (EN)",
    tCalm: "Calm (EN)",
    tBible: "Bíblia (EN)",
    tExplore: "Explore — idiomas (EN)",
    moreH2: "Mais temas",
    moreButtons: `<a class="btn btn-secondary" href="/topic-hope.html" hreflang="en">Hope (EN)</a>
            <a class="btn btn-secondary" href="/fr/espoir.html" hreflang="fr">Espoir (FR)</a>
            <a class="btn btn-secondary" href="/zh/xiwang.html" hreflang="zh-CN">盼望 (中文)</a>
            <a class="btn btn-secondary" href="/pt/ansiedade.html" hreflang="pt">Ansiedade (PT)</a>
            <a class="btn btn-secondary" href="/topic-anxiety.html" hreflang="en">Anxiety (EN)</a>
            <a class="btn btn-secondary" href="/explore.html#topics-es" hreflang="es">Temas ES</a>`,
    footerNote: `Página em português. Ferramentas do site em inglês; na ferramenta bíblica costuma aparecer <abbr title="King James Version" lang="en">KJV</abbr>, exceto os versos citados aqui em Almeida.`,
  },
});

// —— Russian (Synodal, public domain) ——
pages.push({
  rel: "ru/nadezhda.html",
  lang: "ru",
  skip: "Перейти к основному содержанию",
  brand: "Надежда не постыжает — Римлянам 5:5.",
  eyebrow: "Язык",
  navLabel: {
    aria: "Главная навигация",
    menuAria: "Открыть меню",
    menuText: "Меню",
    links: `<a href="/">Главная</a>
        <a href="/explore.html">Explore</a>
        <a href="/calm.html">Calm</a>
        <a href="/plans.html">Plans</a>
        <a href="/#quick-actions-hero">Темы</a>
        <a href="/kids-corner.html">Детям</a>
        <a href="/bible-tool.html">Инструменты</a>
        <a href="/story.html">История</a>`,
  },
  main: {
    path: "/ru/nadezhda.html",
    hreflangCode: "ru",
    headExtra: `<title>Надежда: слова Писания (Синодальный 1876) | Today's Daily Battle</title>
  <meta name="description" content="Надежда: синодальный перевод (общественное достояние), спокойное слово на сегодня. Инструменты сайта на английском; KJV в справочнике.">`,
    og: `<meta property="og:title" content="Надежда | Today's Daily Battle">
  <meta property="og:url" content="https://todaysdailybattle.com/ru/nadezhda.html">
  <meta property="og:type" content="website">
  <meta property="og:image" content="https://todaysdailybattle.com/logo-shield-600.png">
  <meta property="og:locale" content="ru_RU">`,
    fontsHref: "https://fonts.googleapis.com/css2?family=Noto+Sans:wght@400;500;600;700&subset=cyrillic,latin&family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Inter:wght@400;500;600;700&display=swap",
    jsonHeadline: "Надежда: Синодальный перевод (общественное достояние)",
    schemaLang: "ru",
    keywords: "надежда, Библия, Синодальный, Римлянам 15, Иеремия 29, Евреям 6",
    bc1: "Главная",
    bc2: "Надежда",
    bodyClass: "ru-pilot-body",
    bannerLang: "ru",
    banner: `Стихи на этой странице — на русском; в английских инструментах текст Библии на экране обычно <abbr title="King James Version" lang="en">KJV</abbr>.`,
    sideAria: "Навигация по сайту",
    sideLinks: `<a href="/" data-section="search" data-icon="SR">Поиск</a>
        <a href="/verse.html" data-section="verse-of-day" data-icon="VD">Стих дня</a>
        <a href="/message.html" data-section="message-board" data-icon="MB">Стена молитвы</a>
        <a href="/bible-tool.html" data-section="bible-tool" data-icon="BT">Библия</a>
        <a href="/topic-hope.html" hreflang="en">Hope (English)</a>
        <a href="/ru/trevoga.html" hreflang="ru">Тревога (RU)</a>`,
    h1: "Когда нужна надежда",
    lead: "У Него мысли к тебе — мир, а не пустой шум: якорь на те дни, когда всё серое.",
    heroNote: `Цитируемый текст: <strong>Синодальный перевод</strong> (1876), <strong>общественное достояние</strong>. Инструменты чаще на английском; в справочнике обычно <abbr title="King James Version" lang="en">KJV</abbr>.`,
    btnSearch: `Поиск с главной — введите <span lang="en">hope</span> (англ.)`,
    btnBible: "Библия (EN)",
    btnWall: "Стена молитвы (EN)",
    btnVerse: "Стих дня (EN)",
    breakdownClass: "ru-hope-breakdown",
    contentLang: "ru",
    h2verses: "Стихи на сегодня",
    versesBlock: `<p class="verse">«Бог же надежды да исполнит вас всякой радости и мира в вере, чтобы вы, обладая силою Святаго Духа, преизобиловали надеждою.» — Римлянам 15:13 <span class="section-note" style="display:inline;font-size:0.85em;">(Синодальный перевод)</span></p>
            <p class="verse" style="margin-top:1rem;">«Ибо только Я знаю замысел, какой замыслил о вас, говорит Господь, — замысел о мире, а не о зле, — дать вам будущность и надежду.» — Иеремия 29:11 <span class="section-note" style="display:inline;font-size:0.85em;">(Синодальный)</span></p>
            <p class="verse" style="margin-top:1rem;">«Которую как якорь имеем для души, безопасную и крепкую.» — Евреям 6:19 <span class="section-note" style="display:inline;font-size:0.85em;">(Синодальный)</span></p>`,
    h3simple: "Простыми словами",
    psimple: "Здесь надежда — не «авось»: это Бог надежды наполняет радостью и миром в вере, силой Духа.",
    h3sweet: "Тихое слово",
    psweet: "Римлянам 5:5: надежда не постыжает — она держит, когда жизнь трясёт.",
    h3why: "Почему эта надежда держит",
    pwhy: "Она укоренена в Боге, а не в твоём настроении. Обетование связано с верным Именем — можно отделить страх о завтра от того, кто Он есть. Когда Бог надежды наполняет сердце, не нужно одному доказывать, что день станет легче.",
    h3do: "Сделай сейчас",
    pdo: "Шепни: «Господи, цепляюсь за Твоё обетование, не за своё настроение.» Три медленных вдоха. Не обязан сразу радоваться — достаточно на минуту повернуться к Нему.",
    toolsClass: "ru-hope-tools",
    toolsH2: "Инструменты сайта — экран на английском",
    toolsNote: `Ссылки открывают страницы на <strong>английском</strong>; текст в инструментах — <strong>KJV</strong>. <strong lang="en">(EN)</strong> напоминает о языке.`,
    toolsNavAria: "Инструменты EN",
    tPlans: "Планы (EN)",
    tCalm: "Calm (EN)",
    tBible: "Библия (EN)",
    tExplore: "Explore — языки (EN)",
    moreH2: "Другие темы",
    moreButtons: `<a class="btn btn-secondary" href="/topic-hope.html" hreflang="en">Hope (EN)</a>
            <a class="btn btn-secondary" href="/fr/espoir.html" hreflang="fr">Espoir (FR)</a>
            <a class="btn btn-secondary" href="/zh/xiwang.html" hreflang="zh-CN">盼望 (中文)</a>
            <a class="btn btn-secondary" href="/ru/trevoga.html" hreflang="ru">Тревога (RU)</a>
            <a class="btn btn-secondary" href="/topic-anxiety.html" hreflang="en">Anxiety (EN)</a>
            <a class="btn btn-secondary" href="/explore.html#topics-es" hreflang="es">Темы ES</a>`,
    footerNote: `Страница на русском. Инструменты на английском; в Библии-инструменте обычно <abbr title="King James Version" lang="en">KJV</abbr> (кроме цитируемого здесь синодального текста).`,
  },
});

// —— Arabic (Van Dyck tradition, public domain) ——
pages.push({
  rel: "ar/rajaa.html",
  lang: "ar",
  skip: "تخطّ إلى المحتوى",
  brand: "رجاء لا يخزيك — رومية ٥:٥.",
  eyebrow: "اللغة",
  navLabel: {
    aria: "التنقّل الرئيسي",
    menuAria: "فتح القائمة",
    menuText: "القائمة",
    links: `<a href="/">الرئيسية</a>
        <a href="/explore.html">Explore</a>
        <a href="/calm.html">Calm</a>
        <a href="/plans.html">Plans</a>
        <a href="/#quick-actions-hero">المواضيع</a>
        <a href="/kids-corner.html">الأطفال</a>
        <a href="/bible-tool.html">الأدوات</a>
        <a href="/story.html">القصة</a>`,
  },
  main: {
    path: "/ar/rajaa.html",
    hreflangCode: "ar",
    headExtra: `<title>الرجاء: كلمات الكتاب (فان دايك، ملكية عامة) | Today's Daily Battle</title>
  <meta name="description" content="الرجاء: آيات عربية كلاسيكية (فان دايك) ومرافقة هادئة. أدوات الموقع بالإنجليزية؛ KJV في الأداة.">`,
    og: `<meta property="og:title" content="الرجاء | Today's Daily Battle">
  <meta property="og:url" content="https://todaysdailybattle.com/ar/rajaa.html">
  <meta property="og:type" content="website">
  <meta property="og:image" content="https://todaysdailybattle.com/logo-shield-600.png">
  <meta property="og:locale" content="ar">`,
    fontsHref: "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Inter:wght@400;500;600;700&display=swap",
    jsonHeadline: "الرجاء: نص كتابي فان دايك (ملكية عامة)",
    schemaLang: "ar",
    keywords: "رجاء, كتاب, فان دايك, رومية 15, إرميا 29, عبرانيين 6",
    bc1: "الرئيسية",
    bc2: "الرجاء",
    bodyClass: "ar-pilot-body",
    bannerLang: "ar",
    bannerDir: "rtl",
    banner: `هنا الآيات بالعربية؛ أدوات الموقع الإنجليزية تعرض الكتاب غالبًا <abbr title="King James Version" dir="ltr" lang="en">KJV</abbr>.`,
    sideAria: "تنقّل الموقع",
    sideLinks: `<a href="/" data-section="search" data-icon="SR">بحث</a>
        <a href="/verse.html" data-section="verse-of-day" data-icon="VD">آية اليوم</a>
        <a href="/message.html" data-section="message-board" data-icon="MB">جدار الصلاة</a>
        <a href="/bible-tool.html" data-section="bible-tool" data-icon="BT">الكتاب</a>
        <a href="/topic-hope.html" hreflang="en">Hope (English)</a>
        <a href="/ar/qalaq.html" hreflang="ar">قلق (AR)</a>`,
    h1: "عندما تحتاج رجاءً",
    lead: "لله أفكار سلام تجاهك — ليست كلماء، بل مرساة في الأيام الرمادية.",
    heroNote: `النص المقتبس: <strong>فان دايك</strong> (١٨٦٥)، يُعدّ من <strong>الملكية العامة</strong>. واجهة الأدوات غالبًا بالإنجليزية؛ النص في الأداة غالبًا <abbr title="King James Version" dir="ltr" lang="en">KJV</abbr>.`,
    btnSearch: `ابحث من الصفحة الرئيسية — اكتب <span dir="ltr" lang="en">hope</span> (إنجليزي)`,
    btnBible: "أداة الكتاب (EN)",
    btnWall: "جدار الصلاة (EN)",
    btnVerse: "آية اليوم (EN)",
    breakdownClass: "ar-hope-breakdown",
    contentLang: "ar",
    contentDir: "rtl",
    h2verses: "آيات لليوم",
    versesBlock: `<p class="verse">«ولإله الرجاء نفسه يملأكم بكل فرح وسلام في الإيمان، حتى تزدادوا في الرجاء بقوة الروح القدس.» — رومية ١٥:١٣ <span class="section-note" style="display:inline;font-size:0.85em;">(فان دايك)</span></p>
            <p class="verse" style="margin-top:1rem;">«لأني أعلم الأفكار التي أنا أفكر بها عنكم يقول الرب، أفكار سلام لا شر، لأعطيكم أخيراً ورجاءً.» — إرميا ٢٩:١١ <span class="section-note" style="display:inline;font-size:0.85em;">(فان دايك)</span></p>
            <p class="verse" style="margin-top:1rem;">«الذي به لنا احتياطاً كمرساة للنفس، مؤكدة وثابتة.» — عبرانيين ٦:١٩ <span class="section-note" style="display:inline;font-size:0.85em;">(فان دايك)</span></p>`,
    h3simple: "بكلمات بسيطة",
    psimple: "الرجاء هنا ليس تمنّيًا: إله الرجاء يملأك فرحًا وسلامًا في الإيمان، بقوة الروح.",
    h3sweet: "كلمة لطيفة",
    psweet: "رومية ٥:٥ تقول إن هذا الرجاء لا يخزيك — يثبت حين تهتز الأيام.",
    h3why: "لماذا يثبت هذا الرجاء",
    pwhy: "يتمركز في الله لا في مزاجك. الموعود له اسمٌ أمين — يمكنك أن تفصل خوف الغد عن من هو هو. حين يملأ إله الرجاء القلب، لا تبقى وحدك تحت وطأة إثبات أن اليوم سيكون أفضل.",
    h3do: "افعل هذا الآن",
    pdo: "همس بهدوء: «يا رب، أتمسّك بوعدك لا بمزاجي.» ثم تنفّس ببطء ثلاث مرات. لا حاجة أن تفرض الفرح — يكفي أن تتوجّه إليه دقيقة.",
    toolsClass: "ar-hope-tools",
    toolsH2: "أدوات الموقع — واجهة إنجليزية",
    toolsNote: `الروابط تفتح صفحات <strong>بالإنجليزية</strong>؛ النص في الأدوات <strong>KJV</strong>. <strong dir="ltr" lang="en">(EN)</strong> يذكّرك بانتقال اللغة.`,
    toolsNavAria: "أدوات EN",
    tPlans: "خطط (EN)",
    tCalm: "Calm (EN)",
    tBible: "أداة الكتاب (EN)",
    tExplore: "Explore — اللغات (EN)",
    moreH2: "مواضيع أخرى",
    moreButtons: `<a class="btn btn-secondary" href="/topic-hope.html" hreflang="en">Hope (EN)</a>
            <a class="btn btn-secondary" href="/fr/espoir.html" hreflang="fr">Espoir (FR)</a>
            <a class="btn btn-secondary" href="/zh/xiwang.html" hreflang="zh-CN">盼望 (中文)</a>
            <a class="btn btn-secondary" href="/ar/qalaq.html" hreflang="ar">قلق (AR)</a>
            <a class="btn btn-secondary" href="/topic-anxiety.html" hreflang="en">Anxiety (EN)</a>
            <a class="btn btn-secondary" href="/explore.html#topics-es" hreflang="es">مواضيع ES</a>`,
    footerNote: `صفحة بالعربية. أدوات الموقع بالإنجليزية؛ الكتاب في الأداة غالبًا <abbr title="King James Version" dir="ltr" lang="en">KJV</abbr> ما عدا الآيات المقتبسة هنا.`,
  },
});

// —— Hindi ——
pages.push({
  rel: "hi/asha.html",
  lang: "hi",
  skip: "मुख्य सामग्री पर जाएँ",
  brand: "वह आशा जो लज्जा नहीं दिलाती — रोमियों ५:५।",
  eyebrow: "भाषा",
  navLabel: {
    aria: "मुख्य नेविगेशन",
    menuAria: "मेनू खोलें",
    menuText: "मेनू",
    links: `<a href="/">होम</a>
        <a href="/explore.html">Explore</a>
        <a href="/calm.html">Calm</a>
        <a href="/plans.html">Plans</a>
        <a href="/#quick-actions-hero">विषय</a>
        <a href="/kids-corner.html">बच्चे</a>
        <a href="/bible-tool.html">औज़ार</a>
        <a href="/story.html">कहानी</a>`,
  },
  main: {
    path: "/hi/asha.html",
    hreflangCode: "hi",
    headExtra: `<title>आशा: वचन (१८५१ हिंदी परंपरा, सार्वजनिक डोमेन) | Today's Daily Battle</title>
  <meta name="description" content="आशा: हिंदी वचन और शांत साथ। साइट के औज़ार अंग्रेज़ी; बाइबल टूल में अक्सर KJV।">`,
    og: `<meta property="og:title" content="आशा | Today's Daily Battle">
  <meta property="og:url" content="https://todaysdailybattle.com/hi/asha.html">
  <meta property="og:type" content="website">
  <meta property="og:image" content="https://todaysdailybattle.com/logo-shield-600.png">`,
    fontsHref: "https://fonts.googleapis.com/css2?family=Noto+Sans+Devanagari:wght@400;500;600;700&family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Inter:wght@400;500;600;700&display=swap",
    jsonHeadline: "आशा: हिंदी बाइबल पाठ (सार्वजनिक डोमेन परंपरा)",
    schemaLang: "hi",
    keywords: "आशा, बाइबल, रोमियों 15, यिर्मयाह 29, इब्रानियों 6",
    bc1: "होम",
    bc2: "आशा",
    bodyClass: "hi-pilot-body",
    bannerLang: "hi",
    banner: `इस पृष्ठ पर वचन हिंदी में हैं; अंग्रेज़ी औज़ारों में स्क्रीन पर बाइबल आमतौर पर <abbr title="King James Version" lang="en">KJV</abbr>।`,
    sideAria: "साइट नेविगेशन",
    sideLinks: `<a href="/" data-section="search" data-icon="SR">खोज</a>
        <a href="/verse.html" data-section="verse-of-day" data-icon="VD">आज का वचन</a>
        <a href="/message.html" data-section="message-board" data-icon="MB">प्रार्थना दीवार</a>
        <a href="/bible-tool.html" data-section="bible-tool" data-icon="BT">बाइबल</a>
        <a href="/topic-hope.html" hreflang="en">Hope (English)</a>
        <a href="/hi/chinta.html" hreflang="hi">चिंता (HI)</a>`,
    h1: "जब आशा चाहिए",
    lead: "परमेश्वर की योजनाएँ शांति की हैं — खोखले नारे नहीं, बल्कि धुंधले दिनों के लिए लंगर।",
    heroNote: `उद्धृत वचन: <strong>१८५१ हिंदी बाइबल</strong> परंपरा (सार्वजनिक डोमेन)। औज़ार अंग्रेज़ी में; बाइबल टूल पर अक्सर <abbr title="King James Version" lang="en">KJV</abbr>।`,
    btnSearch: `होम पर खोजें — <span lang="en">hope</span> टाइप करें (अंग्रेज़ी)`,
    btnBible: "बाइबल टूल (EN)",
    btnWall: "प्रार्थना दीवार (EN)",
    btnVerse: "आज का वचन (EN)",
    breakdownClass: "hi-hope-breakdown",
    contentLang: "hi",
    h2verses: "आज के वचन",
    versesBlock: `<p class="verse">«अब आशा के परमेश्वर तुम्हें विश्वास में सब प्रकार की खुशी और शांति से भर दे, कि तुम पवित्र आत्मा की सामर्थ से आशा में बहुत बढ़ते जाओ।» — रोमियों १५:१३ <span class="section-note" style="display:inline;font-size:0.85em;">(१८५१ हिंदी परंपरा)</span></p>
            <p class="verse" style="margin-top:1rem;">«क्योंकि मैं उन विचारों को जानता हूँ जो मैं तुम्हारे विषय में सोचता हूँ, यहोवा की यह वाणी है, कि शांति के विचार हैं, बुराई के नहीं, कि तुम्हारा अन्त आशा से हो।» — यिर्मयाह २९:११ <span class="section-note" style="display:inline;font-size:0.85em;">(पुरानी हिंदी परंपरा)</span></p>
            <p class="verse" style="margin-top:1rem;">«जो आत्मा के लिए एक स्थिर और दृढ़ लंगर की नाईं है।» — इब्रानियों ६:१९ <span class="section-note" style="display:inline;font-size:0.85em;">(पुरानी हिंदी परंपरा)</span></p>`,
    h3simple: "सीधे शब्दों में",
    psimple: "यहाँ आशा «देखते हैं» नहीं: आशा का परमेश्वर विश्वास में खुशी और शांति से भरता है, आत्मा की सामर्थ से।",
    h3sweet: "एक कोमल बात",
    psweet: "रोमियों ५:५ कहता है यह आशा लज्जा नहीं दिलाती — झटकों में टिकी रहती है।",
    h3why: "यह आशा क्यों टिकती है",
    pwhy: "यह परमेश्वर में जमी है, आपके मूड में नहीं। वचन का स्रोत विश्वासयोग्य है — कल के डर और उसके जो वह है अलग रख सकते हो। जब आशा का परमेश्वर भरता है, तो खुद को साबित करने का बोझ हल्का पड़ता है।",
    h3do: "अभी यह करो",
    pdo: "धीरे कहो: «हे प्रभु, मैं तेरे वचन को पकड़ता हूँ, मूड को नहीं।» फिर धीमी साँसें तीन बार। खुशी मत थोपो — एक मिनट उसकी ओर मुड़ना काफ़ी है।",
    toolsClass: "hi-hope-tools",
    toolsH2: "साइट के औज़ार — अंग्रेज़ी स्क्रीन",
    toolsNote: `लिंक ज़्यादातर <strong>अंग्रेज़ी</strong> पेज खोलते हैं; औज़ारों में बाइबल <strong>KJV</strong>। <strong lang="en">(EN)</strong> भाषा बदलने की याद।`,
    toolsNavAria: "औज़ार EN",
    tPlans: "योजनाएँ (EN)",
    tCalm: "Calm (EN)",
    tBible: "बाइबल टूल (EN)",
    tExplore: "Explore — भाषाएँ (EN)",
    moreH2: "और विषय",
    moreButtons: `<a class="btn btn-secondary" href="/topic-hope.html" hreflang="en">Hope (EN)</a>
            <a class="btn btn-secondary" href="/fr/espoir.html" hreflang="fr">Espoir (FR)</a>
            <a class="btn btn-secondary" href="/zh/xiwang.html" hreflang="zh-CN">盼望 (中文)</a>
            <a class="btn btn-secondary" href="/hi/chinta.html" hreflang="hi">चिंता (HI)</a>
            <a class="btn btn-secondary" href="/topic-anxiety.html" hreflang="en">Anxiety (EN)</a>
            <a class="btn btn-secondary" href="/explore.html#topics-es" hreflang="es">ES विषय</a>`,
    footerNote: `पृष्ठ हिंदी में। औज़ार अंग्रेज़ी में; बाइबल टूल पर सामान्यतः <abbr title="King James Version" lang="en">KJV</abbr> (यहाँ उद्धृत हिंदी को छोड़कर)।`,
  },
});

// —— Swedish (1917) ——
pages.push({
  rel: "sv/hopp.html",
  lang: "sv",
  skip: "Hoppa till innehåll",
  brand: "Ett hopp som inte gör besviken — Romarbrevet 5:5.",
  eyebrow: "Språk",
  navLabel: {
    aria: "Huvudmeny",
    menuAria: "Öppna meny",
    menuText: "Meny",
    links: `<a href="/">Hem</a>
        <a href="/explore.html">Explore</a>
        <a href="/calm.html">Calm</a>
        <a href="/plans.html">Plans</a>
        <a href="/#quick-actions-hero">Ämnen</a>
        <a href="/kids-corner.html">Barn</a>
        <a href="/bible-tool.html">Verktyg</a>
        <a href="/story.html">Berättelsen</a>`,
  },
  main: {
    path: "/sv/hopp.html",
    hreflangCode: "sv",
    headExtra: `<title>Hopp: Bibelord (1917 års bibel, public domain) | Today's Daily Battle</title>
  <meta name="description" content="Hopp: vers från 1917 års bibel och stilla följsamhet. Verktyg på engelska; KJV i bibelverktyget.">`,
    og: `<meta property="og:title" content="Hopp | Today's Daily Battle">
  <meta property="og:url" content="https://todaysdailybattle.com/sv/hopp.html">
  <meta property="og:type" content="website">
  <meta property="og:image" content="https://todaysdailybattle.com/logo-shield-600.png">
  <meta property="og:locale" content="sv_SE">`,
    fontsHref: "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Inter:wght@400;500;600;700&display=swap",
    jsonHeadline: "Hopp: 1917 års bibel (public domain)",
    schemaLang: "sv",
    keywords: "hopp, bibel, Romarbrevet 15, Jeremia 29, Hebreerbrevet 6",
    bc1: "Hem",
    bc2: "Hopp",
    bodyClass: "sv-pilot-body",
    bannerLang: "sv",
    banner: `Vers på denna sida: svenska. Verktyg på engelska: Bibeln på skärmen är oftast <abbr title="King James Version" lang="en">KJV</abbr>.`,
    sideAria: "Webbplatsnavigation",
    sideLinks: `<a href="/" data-section="search" data-icon="SR">Sök</a>
        <a href="/verse.html" data-section="verse-of-day" data-icon="VD">Dagens vers</a>
        <a href="/message.html" data-section="message-board" data-icon="MB">Bön vägg</a>
        <a href="/bible-tool.html" data-section="bible-tool" data-icon="BT">Bibeln</a>
        <a href="/topic-hope.html" hreflang="en">Hope (English)</a>
        <a href="/sv/oro.html" hreflang="sv">Oro (SV)</a>`,
    h1: "När du behöver hopp",
    lead: "Herren har tankar om frid för dig — inte tomma ord, utan ett ankare när dagen känns grå.",
    heroNote: `Citat: <strong>1917 års bibel</strong> (public domain). Verktygen är oftast på engelska; bibeltext i verktyg är i regel <abbr title="King James Version" lang="en">KJV</abbr>.`,
    btnSearch: `Sök från startsidan — skriv <span lang="en">hope</span> (engelska)`,
    btnBible: "Bibeln (EN)",
    btnWall: "Bön vägg (EN)",
    btnVerse: "Dagens vers (EN)",
    breakdownClass: "sv-hope-breakdown",
    contentLang: "sv",
    h2verses: "Vers för idag",
    versesBlock: `<p class="verse">«Och må Gud, som är hoppets Gud, uppfylla eder med all glädje och frid i tron, så att I genom helig andes kraft fån överflödande hopp.» — Romarbrevet 15:13 <span class="section-note" style="display:inline;font-size:0.85em;">(1917)</span></p>
            <p class="verse" style="margin-top:1rem;">«Ty jag vet vilka tankar jag har om eder, säger Herren, nämligen fridsamma tankar och icke till eder olycka, tankar som ge eder en väntans tid och en framtid.» — Jeremia 29:11 <span class="section-note" style="display:inline;font-size:0.85em;">(1917)</span></p>
            <p class="verse" style="margin-top:1rem;">«vilken vi hava såsom ett ankare för själen, ett som är fastare och säkrare.» — Hebreerbrevet 6:19 <span class="section-note" style="display:inline;font-size:0.85em;">(1917)</span></p>`,
    h3simple: "Med enkla ord",
    psimple: "Bibliskt hopp är inte «håll tummarna»: det är hoppets Gud som fyller dig med glädje och frid i tron, genom Anden.",
    h3sweet: "Ett mjukt ord",
    psweet: "Romarbrevet 5:5 säger att detta hopp inte gör besviken — det håller när livet skakar.",
    h3why: "Varför detta hopp bär",
    pwhy: "Det förankras i Gud, inte i ditt humör. Löftet har ett namn som håller — du kan skilja morgondagens rädsla från vem Han är. När hoppets Gud fyller hjärtat slipper du bära beviset ensam.",
    h3do: "Gör det nu",
    pdo: "Säg tyst: «Herre, jag håller i Ditt löfte, inte i mitt humör.» Andas långsamt tre gånger. Du behöver inte tvinga fram glädje — bara vända dig till Honom en minut.",
    toolsClass: "sv-hope-tools",
    toolsH2: "Verktyg — engelsk skärm",
    toolsNote: `Länkarna öppnar sidor på <strong>engelska</strong>; bibeltext i verktyg är <strong>KJV</strong>. <strong lang="en">(EN)</strong> påminner om språkbyte.`,
    toolsNavAria: "Verktyg EN",
    tPlans: "Planer (EN)",
    tCalm: "Calm (EN)",
    tBible: "Bibeln (EN)",
    tExplore: "Explore — språk (EN)",
    moreH2: "Fler ämnen",
    moreButtons: `<a class="btn btn-secondary" href="/topic-hope.html" hreflang="en">Hope (EN)</a>
            <a class="btn btn-secondary" href="/fr/espoir.html" hreflang="fr">Espoir (FR)</a>
            <a class="btn btn-secondary" href="/zh/xiwang.html" hreflang="zh-CN">盼望 (中文)</a>
            <a class="btn btn-secondary" href="/sv/oro.html" hreflang="sv">Oro (SV)</a>
            <a class="btn btn-secondary" href="/topic-anxiety.html" hreflang="en">Anxiety (EN)</a>
            <a class="btn btn-secondary" href="/explore.html#topics-es" hreflang="es">ES ämnen</a>`,
    footerNote: `Sida på svenska. Verktyg på engelska; bibelverktyget visar oftast <abbr title="King James Version" lang="en">KJV</abbr> (utom vers som citeras här från 1917).`,
  },
});

// —— Bengali ——
pages.push({
  rel: "bn/asha.html",
  lang: "bn",
  skip: "মূল বিষয়বস্তুতে যান",
  brand: "যে আশা লজ্জা দেয় না — রোমীয় ৫:৫।",
  eyebrow: "ভাষা",
  navLabel: {
    aria: "প্রধান নেভিগেশন",
    menuAria: "মেনু খুলুন",
    menuText: "মেনু",
    links: `<a href="/">হোম</a>
        <a href="/explore.html">Explore</a>
        <a href="/calm.html">Calm</a>
        <a href="/plans.html">Plans</a>
        <a href="/#quick-actions-hero">বিষয়</a>
        <a href="/kids-corner.html">শিশু</a>
        <a href="/bible-tool.html">টুল</a>
        <a href="/story.html">গল্প</a>`,
  },
  main: {
    path: "/bn/asha.html",
    hreflangCode: "bn",
    headExtra: `<title>আশা: বাইবেলের বাক্য (কলকাতা ১৯০৯ ঐতিহ্য) | Today's Daily Battle</title>
  <meta name="description" content="আশা: বাংলা পাঠ ও শান্ত সঙ্গ। সাইটের টুল ইংরেজি; বাইবেল টুলে সাধারণত KJV।">`,
    og: `<meta property="og:title" content="আশা | Today's Daily Battle">
  <meta property="og:url" content="https://todaysdailybattle.com/bn/asha.html">
  <meta property="og:type" content="website">
  <meta property="og:image" content="https://todaysdailybattle.com/logo-shield-600.png">`,
    fontsHref: "https://fonts.googleapis.com/css2?family=Noto+Sans+Bengali:wght@400;500;600;700&family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Inter:wght@400;500;600;700&display=swap",
    jsonHeadline: "আশা: কলকাতা বাইবেল ঐতিহ্য (জনসাধারণের সম্পদ)",
    schemaLang: "bn",
    keywords: "আশা, বাইবেল, রোমীয় ১৫, যিরমিয় ২৯, হিব্রু ৬",
    bc1: "হোম",
    bc2: "আশা",
    bodyClass: "bn-pilot-body",
    bannerLang: "bn",
    banner: `এ পৃষ্ঠার আয়াত বাংলায়; ইংরেজি টুলে পর্দায় বাইবেল সাধারণত <abbr title="King James Version" lang="en">KJV</abbr>।`,
    sideAria: "সাইট নেভিগেশন",
    sideLinks: `<a href="/" data-section="search" data-icon="SR">খোঁজ</a>
        <a href="/verse.html" data-section="verse-of-day" data-icon="VD">আজকের পদ</a>
        <a href="/message.html" data-section="message-board" data-icon="MB">প্রার্থনা দেয়াল</a>
        <a href="/bible-tool.html" data-section="bible-tool" data-icon="BT">বাইবেল</a>
        <a href="/topic-hope.html" hreflang="en">Hope (English)</a>
        <a href="/bn/chinta.html" hreflang="bn">চিন্তা (BN)</a>`,
    h1: "যখন আশা দরকার",
    lead: "তাঁর আপনার প্রতি চিন্তা শান্তির — খালি শব্দ নয়, ধূসর দিনের লঙ্গর।",
    heroNote: `উদ্ধৃত পাঠ: <strong>কলকাতা বাইবেল ১৯০৯</strong> ঐতিহ্য, <strong>জনসাধারণের সম্পদ</strong>। টুল বেশিরভাগ <strong>ইংরেজিতে</strong>; বাইবেল টুলে সাধারণত <abbr title="King James Version" lang="en">KJV</abbr>।`,
    btnSearch: `হোম থেকে খুঁজুন — <span lang="en">hope</span> লিখুন (ইংরেজি)`,
    btnBible: "বাইবেল (EN)",
    btnWall: "প্রার্থনা দেয়াল (EN)",
    btnVerse: "আজকের পদ (EN)",
    breakdownClass: "bn-hope-breakdown",
    contentLang: "bn",
    h2verses: "আজকের পদ",
    versesBlock: `<p class="verse">«এই আশার ঈশ্বর বিশ্বাসে তোমাদের সকল আনন্দে ও শান্তিতে পরিপূর্ণ করুন, যেন পবিত্র আত্মার শক্তিতে তোমরা আশায় অধিক বৃদ্ধি পাও।» — রোমীয় ১৫:১৩ <span class="section-note" style="display:inline;font-size:0.85em;">(কলকাতা ১৯০৯ ঐতিহ্য)</span></p>
            <p class="verse" style="margin-top:1rem;">«কারণ আমি জানি আমি যে চিন্তা তোমাদের বিষয়ে করি, সেই চিন্তা সদাপ্রভুর ইচ্ছা অনুসারে শান্তির চিন্তা, অমঙ্গলের নয়, তোমাদিগকে প্রত্যাশার অবসান ও ভবিষ্যৎ দিতে।» — যিরমিয় ২৯:১১ <span class="section-note" style="display:inline;font-size:0.85em;">(কলকাতা ১৯০৯ ঐতিহ্য)</span></p>
            <p class="verse" style="margin-top:1rem;">«যাহা আমাদের প্রাণের নিমিত্ত নিরাপদ ও স্থির লঙ্গরস্বরূপ।» — হিব্রু ৬:১৯ <span class="section-note" style="display:inline;font-size:0.85em;">(কলকাতা ১৯০৯ ঐতিহ্য)</span></p>`,
    h3simple: "সরল ভাষায়",
    psimple: "এখানে আশা «ভাগ্যের ভরসা» নয়: আশার ঈশ্বর বিশ্বাসে আনন্দ ও শান্তিতে ভর দেন, আত্মার শক্তিতে।",
    h3sweet: "একটু মৃদু কথা",
    psweet: "রোমীয় ৫:৫ বলে এই আশা লজ্জা দেয় না — জীবন কাঁপলেও ধরে রাখে।",
    h3why: "এই আশা কেন টিকে",
    pwhy: "এটা ঈশ্বরে গেঁথে, আপনার মেজাজে নয়। প্রতিজ্ঞা এক বিশ্বস্ত নামের — আগামীর ভয় আর তিনি যিনি তা আলাদা রাখতে পারেন। আশার ঈশ্বর যখন ভর দেন, একা «যথেষ্ট ভালো দিন» প্রমাণের বোঝা হালকা হয়।",
    h3do: "এখনই করুন",
    pdo: "ফিসফিস করে বলুন: «প্রভু, আমি তোমার প্রতিজ্ঞা ধরে রাখি, মেজাজ নয়।» তারপর ধীরে তিনবার শ্বাস। জোর করে খুশি হতে হবে না — এক মিনিট তাঁর দিকে মুখ ঘুরান।",
    toolsClass: "bn-hope-tools",
    toolsH2: "টুল — ইংরেজি স্ক্রিন",
    toolsNote: `লিংকগুলো বেশিরভাগ <strong>ইংরেজি</strong> পৃষ্ঠা খোলে; টুলে বাইবেল <strong>KJV</strong>। <strong lang="en">(EN)</strong> ভাষা বদলের স্মরণ।`,
    toolsNavAria: "টুল EN",
    tPlans: "পরিকল্পনা (EN)",
    tCalm: "Calm (EN)",
    tBible: "বাইবেল (EN)",
    tExplore: "Explore — ভাষা (EN)",
    moreH2: "আরও বিষয়",
    moreButtons: `<a class="btn btn-secondary" href="/topic-hope.html" hreflang="en">Hope (EN)</a>
            <a class="btn btn-secondary" href="/fr/espoir.html" hreflang="fr">Espoir (FR)</a>
            <a class="btn btn-secondary" href="/zh/xiwang.html" hreflang="zh-CN">盼望 (中文)</a>
            <a class="btn btn-secondary" href="/bn/chinta.html" hreflang="bn">চিন্তা (BN)</a>
            <a class="btn btn-secondary" href="/topic-anxiety.html" hreflang="en">Anxiety (EN)</a>
            <a class="btn btn-secondary" href="/explore.html#topics-es" hreflang="es">ES বিষয়</a>`,
    footerNote: `পৃষ্ঠা বাংলায়। টুল ইংরেজিতে; বাইবেল টুলে সাধারণত <abbr title="King James Version" lang="en">KJV</abbr> (এখানে উদ্ধৃত বাংলা বাদে)।`,
  },
});

// —— Swahili ——
pages.push({
  rel: "sw/tumaini.html",
  lang: "sw",
  skip: "Ruka kwenye maudhui kuu",
  brand: "Tumaini lisilokutahayarisha — Warumi 5:5.",
  eyebrow: "Lugha",
  navLabel: {
    aria: "Menyu kuu",
    menuAria: "Fungua menyu",
    menuText: "Menyu",
    links: `<a href="/">Nyumbani</a>
        <a href="/explore.html">Explore</a>
        <a href="/calm.html">Calm</a>
        <a href="/plans.html">Plans</a>
        <a href="/#quick-actions-hero">Mada</a>
        <a href="/kids-corner.html">Watoto</a>
        <a href="/bible-tool.html">Zana</a>
        <a href="/story.html">Hadithi</a>`,
  },
  main: {
    path: "/sw/tumaini.html",
    hreflangCode: "sw",
    headExtra: `<title>Tumaini: Maneno ya Biblia (Kiswahili cha umma) | Today's Daily Battle</title>
  <meta name="description" content="Tumaini: aya za hadhi ya umma na hatua ya utulivu. Zana za Kiingereza; Biblia kwenye skrini ni kawaida KJV.">`,
    og: `<meta property="og:title" content="Tumaini | Today's Daily Battle">
  <meta property="og:url" content="https://todaysdailybattle.com/sw/tumaini.html">
  <meta property="og:type" content="website">
  <meta property="og:image" content="https://todaysdailybattle.com/logo-shield-600.png">
  <meta property="og:locale" content="sw_KE">`,
    fontsHref: "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Inter:wght@400;500;600;700&display=swap",
    jsonHeadline: "Tumaini: Biblia Kiswahili cha umma",
    schemaLang: "sw",
    keywords: "tumaini, Biblia, Warumi 15, Yeremia 29, Waebrania 6",
    bc1: "Nyumbani",
    bc2: "Tumaini",
    bodyClass: "sw-pilot-body",
    bannerLang: "sw",
    banner: `Hapa mistari kwa Kiswahili; kwenye zana za Kiingereza Biblia kwenye skrini ni kawaida <abbr title="King James Version" lang="en">KJV</abbr>.`,
    sideAria: "Urambazaji wa tovuti",
    sideLinks: `<a href="/" data-section="search" data-icon="SR">Tafuta</a>
        <a href="/verse.html" data-section="verse-of-day" data-icon="VD">Aya ya leo</a>
        <a href="/message.html" data-section="message-board" data-icon="MB">Ukuta wa maombi</a>
        <a href="/bible-tool.html" data-section="bible-tool" data-icon="BT">Biblia</a>
        <a href="/topic-hope.html" hreflang="en">Hope (English)</a>
        <a href="/sw/wasiwasi.html" hreflang="sw">Wasiwasi (SW)</a>`,
    h1: "Unapohitaji tumaini",
    lead: "Mungu ana mawazo ya amani kwako — si maneno tupu, bali nanga siku zinazotaa kijivu.",
    heroNote: `Nakala: <strong>Kiswahili cha hadhi ya umma</strong>, kufuatana na misingi ya tafsiri za kale. Zana ni <strong>Kiingereza</strong> kwa kawaida; katika zana ya Biblia huonekana <abbr title="King James Version" lang="en">KJV</abbr>.`,
    btnSearch: `Tafuta kutoka mwanzo — andika <span lang="en">hope</span> (Kiingereza)`,
    btnBible: "Biblia (EN)",
    btnWall: "Ukuta wa maombi (EN)",
    btnVerse: "Aya ya leo (EN)",
    breakdownClass: "sw-hope-breakdown",
    contentLang: "sw",
    h2verses: "Aya za leo",
    versesBlock: `<p class="verse">«Na Mungu wa tumaini awajaze ninyi furaha yote na amani katika kuamini, mpate kustawi katika tumaini kwa nguvu ya Roho Mtakatifu.» — Warumi 15:13 <span class="section-note" style="display:inline;font-size:0.85em;">(Kiswahili cha umma)</span></p>
            <p class="verse" style="margin-top:1rem;">«Kwa maana nayajua mawazo ninayowawazia ninyi, asema Bwana, ni mawazo ya amani wala si ya mabaya, kuwapa ninyi tumaini katika mwisho wenu.» — Yeremia 29:11 <span class="section-note" style="display:inline;font-size:0.85em;">(Kiswahili cha umma)</span></p>
            <p class="verse" style="margin-top:1rem;">«Tunayonayo kama nanga ya roho, salama na imara.» — Waebrania 6:19 <span class="section-note" style="display:inline;font-size:0.85em;">(Kiswahili cha umma)</span></p>`,
    h3simple: "Kwa maneno rahisi",
    psimple: "Tumaini hapa si «tumaini la bahati nasibu»: ni Mungu wa tumaini anayejaza furaha na amani katika kuamini, kwa Roho.",
    h3sweet: "Neno jepesi",
    psweet: "Warumi 5:5 inasema tumaini hili halituangushi — linasimama wakati maisha yanapotikisa.",
    h3why: "Kwa nini tumaini hili linasimama",
    pwhy: "Limejikita katika Mungu, si katika hisia zako. Ahadi ina Jina la kuaminika — unaweza kutenganisha hofu ya kesho na yeye aliye yeye. Mungu wa tumaini anapojaza moyo, hutoboi kubeba uthibitisho peke yako.",
    h3do: "Fanya sasa",
    pdo: "Sema kwa sauti ya chini: «Bwana, ninashika ahadi yako, si hisia zangu.» Kisha pumua polepole mara tatu. Huna haja ya kulazimisha furaha — kumgeukia kwa dakika moja kunatosha.",
    toolsClass: "sw-hope-tools",
    toolsH2: "Zana — skrini ya Kiingereza",
    toolsNote: `Viungo hufungua kurasa za <strong>Kiingereza</strong>; maandishi ya Biblia katika zana ni <strong>KJV</strong>. <strong lang="en">(EN)</strong> inakumbusha lugha.`,
    toolsNavAria: "Zana EN",
    tPlans: "Mipango (EN)",
    tCalm: "Calm (EN)",
    tBible: "Biblia (EN)",
    tExplore: "Explore — lugha (EN)",
    moreH2: "Mada zingine",
    moreButtons: `<a class="btn btn-secondary" href="/topic-hope.html" hreflang="en">Hope (EN)</a>
            <a class="btn btn-secondary" href="/fr/espoir.html" hreflang="fr">Espoir (FR)</a>
            <a class="btn btn-secondary" href="/zh/xiwang.html" hreflang="zh-CN">盼望 (中文)</a>
            <a class="btn btn-secondary" href="/sw/wasiwasi.html" hreflang="sw">Wasiwasi (SW)</a>
            <a class="btn btn-secondary" href="/topic-anxiety.html" hreflang="en">Anxiety (EN)</a>
            <a class="btn btn-secondary" href="/explore.html#topics-es" hreflang="es">Mada ES</a>`,
    footerNote: `Ukurasa kwa Kiswahili. Zana kwa Kiingereza; Biblia kwenye skrini ni kawaida <abbr title="King James Version" lang="en">KJV</abbr> (isipokuwa mistari iliyotajwa hapa).`,
  },
});

// —— Indonesian (explanatory + Terjemahan Baru–style public wording for verses) ——
pages.push({
  rel: "id/harapan.html",
  lang: "id",
  skip: "Lompat ke konten utama",
  brand: "Pengharapan yang tidak mengecewakan — Roma 5:5.",
  eyebrow: "Bahasa",
  navLabel: {
    aria: "Navigasi utama",
    menuAria: "Buka menu",
    menuText: "Menu",
    links: `<a href="/">Beranda</a>
        <a href="/explore.html">Explore</a>
        <a href="/calm.html">Calm</a>
        <a href="/plans.html">Plans</a>
        <a href="/#quick-actions-hero">Topik</a>
        <a href="/kids-corner.html">Anak</a>
        <a href="/bible-tool.html">Alat</a>
        <a href="/story.html">Cerita</a>`,
  },
  main: {
    path: "/id/harapan.html",
    hreflangCode: "id",
    headExtra: `<title>Harapan: Firman Alkitab (teks terbuka umum) | Today's Daily Battle</title>
  <meta name="description" content="Harapan: ayat dalam bahasa Indonesia (sumber terjemahan domain publik umum) dan langkah tenang. Alat situs dalam bahasa Inggris; KJV di layar alkitab.">`,
    og: `<meta property="og:title" content="Harapan | Today's Daily Battle">
  <meta property="og:url" content="https://todaysdailybattle.com/id/harapan.html">
  <meta property="og:type" content="website">
  <meta property="og:image" content="https://todaysdailybattle.com/logo-shield-600.png">
  <meta property="og:locale" content="id_ID">`,
    fontsHref: "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Inter:wght@400;500;600;700&display=swap",
    jsonHeadline: "Harapan: teks Alkitab Indonesia (domain publik umum)",
    schemaLang: "id",
    keywords: "harapan, Alkitab, Roma 15, Yeremia 29, Ibrani 6",
    bc1: "Beranda",
    bc2: "Harapan",
    bodyClass: "",
    bannerLang: "id",
    banner: `Ayat di halaman ini dalam bahasa Indonesia; di alat berbahasa Inggris teks Alkitab di layar biasanya <abbr title="King James Version" lang="en">KJV</abbr>.`,
    sideAria: "Navigasi situs",
    sideLinks: `<a href="/" data-section="search" data-icon="SR">Cari</a>
        <a href="/verse.html" data-section="verse-of-day" data-icon="VD">Ayat hari ini</a>
        <a href="/message.html" data-section="message-board" data-icon="MB">Dinding doa</a>
        <a href="/bible-tool.html" data-section="bible-tool" data-icon="BT">Alkitab</a>
        <a href="/topic-hope.html" hreflang="en">Hope (English)</a>
        <a href="/id/kecemasan.html" hreflang="id">Kecemasan (ID)</a>`,
    h1: "Ketika Anda butuh harapan",
    lead: "Allah punya rencana damai untuk Anda — bukan kata hampa, tetapi sauh di hari yang kelabu.",
    heroNote: `Teks yang dikutip: <strong>terjemahan Indonesia domain publik umum</strong> (warisan terbuka). Alat situs biasanya <strong>bahasa Inggris</strong>; di alat Alkitab tampil umumnya <abbr title="King James Version" lang="en">KJV</abbr>.`,
    btnSearch: `Cari dari beranda — ketik <span lang="en">hope</span> (Inggris)`,
    btnBible: "Alkitab (EN)",
    btnWall: "Dinding doa (EN)",
    btnVerse: "Ayat hari ini (EN)",
    breakdownClass: "id-hope-breakdown",
    contentLang: "id",
    h2verses: "Ayat untuk hari ini",
    versesBlock: `<p class="verse">«Kiranya Allah, sumber pengharapan, memenuhi kamu dengan segala sukacita dan damai sejahtera dalam percayamu, supaya oleh kekuatan Roh Kudus kamu berlimpah-limpah dalam pengharapan.» — Roma 15:13 <span class="section-note" style="display:inline;font-size:0.85em;">(terjemahan domain publik umum)</span></p>
            <p class="verse" style="margin-top:1rem;">«Sebab Aku ini mengetahui rancangan-rancangan apa yang ada pada-Ku mengenai kamu, demikianlah firman TUHAN, yaitu rancangan damai sejahtera dan bukan celaka, untuk memberikan kepadamu hari depan yang penuh harapan.» — Yeremia 29:11 <span class="section-note" style="display:inline;font-size:0.85em;">(terjemahan domain publik umum)</span></p>
            <p class="verse" style="margin-top:1rem;">«Sebagai sauh yang kokoh dan aman bagi jiwa kita.» — Ibrani 6:19 <span class="section-note" style="display:inline;font-size:0.85em;">(terjemahan domain publik umum)</span></p>`,
    h3simple: "Dengan kata sederhana",
    psimple: "Harapan di sini bukan «semoga saja»: Allah sumber pengharapan mengisi sukacita dan damai dalam percaya, oleh Roh.",
    h3sweet: "Sepatah kata lembut",
    psweet: "Roma 5:5 berkata harapan ini tidak mengecewakan — ia bertahan saat hidup berguncang.",
    h3why: "Mengapa harapan ini bertahan",
    pwhy: "Ia berpaut pada Allah, bukan pada suasana hati Anda. Janji itu melekat pada Nama yang setia — Anda bisa memisahkan ketakutan akan besok dari siapa Dia. Ketika Allah sumber pengharapan memenuhi, Anda tidak harus membuktikan sendiri bahwa hari akan membaik.",
    h3do: "Lakukan ini sekarang",
    pdo: "Katakan pelan: «Tuhan, aku berpegang pada janji-Mu, bukan pada perasaanku.» Tarik napas perlahan tiga kali. Tidak perlu memaksakan sukacita — cukup berpaling kepada-Nya satu menit.",
    toolsClass: "id-hope-tools",
    toolsH2: "Alat situs — layar bahasa Inggris",
    toolsNote: `Tautan membuka halaman <strong>bahasa Inggris</strong>; teks Alkitab di alat adalah <strong>KJV</strong>. <strong lang="en">(EN)</strong> mengingatkan pergantian bahasa.`,
    toolsNavAria: "Alat EN",
    tPlans: "Rencana (EN)",
    tCalm: "Calm (EN)",
    tBible: "Alkitab (EN)",
    tExplore: "Explore — bahasa (EN)",
    moreH2: "Topik lain",
    moreButtons: `<a class="btn btn-secondary" href="/topic-hope.html" hreflang="en">Hope (EN)</a>
            <a class="btn btn-secondary" href="/fr/espoir.html" hreflang="fr">Espoir (FR)</a>
            <a class="btn btn-secondary" href="/zh/xiwang.html" hreflang="zh-CN">盼望 (中文)</a>
            <a class="btn btn-secondary" href="/id/kecemasan.html" hreflang="id">Kecemasan (ID)</a>
            <a class="btn btn-secondary" href="/topic-anxiety.html" hreflang="en">Anxiety (EN)</a>
            <a class="btn btn-secondary" href="/explore.html#topics-es" hreflang="es">Topik ES</a>`,
    footerNote: `Halaman berbahasa Indonesia. Alat situs dalam bahasa Inggris; di alat Alkitab biasanya <abbr title="King James Version" lang="en">KJV</abbr> (kecuali ayat yang dikutip di sini dalam bahasa Indonesia).`,
  },
});

// —— Tagalog ——
pages.push({
  rel: "tl/pagasa.html",
  lang: "tl",
  skip: "Lumaktaw sa pangunahing nilalaman",
  brand: "Pag-asang hindi napapahiya — Roma 5:5.",
  eyebrow: "Wika",
  navLabel: {
    aria: "Pangunahing nabigasyon",
    menuAria: "Buksan ang menu",
    menuText: "Menu",
    links: `<a href="/">Home</a>
        <a href="/explore.html">Explore</a>
        <a href="/calm.html">Calm</a>
        <a href="/plans.html">Plans</a>
        <a href="/#quick-actions-hero">Mga paksa</a>
        <a href="/kids-corner.html">Mga bata</a>
        <a href="/bible-tool.html">Mga tool</a>
        <a href="/story.html">Kwento</a>`,
  },
  main: {
    path: "/tl/pagasa.html",
    hreflangCode: "tl",
    headExtra: `<title>Pag-asa: Salita ng Bibliya (Tagalog, domain publiko) | Today's Daily Battle</title>
  <meta name="description" content="Pag-asa: mga talata sa Tagalog (nakapaloob sa domain publiko) at tahimik na hakbang. Mga tool sa Ingles; KJV sa screen ng Bibliya.">`,
    og: `<meta property="og:title" content="Pag-asa | Today's Daily Battle">
  <meta property="og:url" content="https://todaysdailybattle.com/tl/pagasa.html">
  <meta property="og:type" content="website">
  <meta property="og:image" content="https://todaysdailybattle.com/logo-shield-600.png">`,
    fontsHref: "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Inter:wght@400;500;600;700&display=swap",
    jsonHeadline: "Pag-asa: Bibliya sa Tagalog (domain publiko)",
    schemaLang: "tl",
    keywords: "pag-asa, Bibliya, Roma 15, Jeremias 29, Hebreo 6",
    bc1: "Home",
    bc2: "Pag-asa",
    bodyClass: "",
    bannerLang: "tl",
    banner: `Sa pahinang ito ang talata ay Tagalog; sa English tools ang Bibliya sa screen ay karaniwang <abbr title="King James Version" lang="en">KJV</abbr>.`,
    sideAria: "Navigation ng site",
    sideLinks: `<a href="/" data-section="search" data-icon="SR">Hanapin</a>
        <a href="/verse.html" data-section="verse-of-day" data-icon="VD">Talata ngayon</a>
        <a href="/message.html" data-section="message-board" data-icon="MB">Dingding ng panalangin</a>
        <a href="/bible-tool.html" data-section="bible-tool" data-icon="BT">Bibliya</a>
        <a href="/topic-hope.html" hreflang="en">Hope (English)</a>
        <a href="/tl/kabalisahan.html" hreflang="tl">Kabalisahan (TL)</a>`,
    h1: "Kapag kailangan mo ng pag-asa",
    lead: "May mga layuning pangkapayapaan ang Diyos para sa iyo — hindi hungkag na salita, kundi angkla sa mga araw na mistulang kulimlim.",
    heroNote: `Mga siping talata: <strong>Tagalog na nasa domain publiko</strong> (nakapaloob sa malayang tradisyon). Ang mga tool ay karaniwang <strong>Ingles</strong>; sa Bible tool ang teksto sa screen ay <abbr title="King James Version" lang="en">KJV</abbr>.`,
    btnSearch: `Maghanap mula sa home — i-type ang <span lang="en">hope</span> (Ingles)`,
    btnBible: "Bibliya (EN)",
    btnWall: "Dingding ng panalangin (EN)",
    btnVerse: "Talata ngayon (EN)",
    breakdownClass: "tl-hope-breakdown",
    contentLang: "tl",
    h2verses: "Mga talata ngayon",
    versesBlock: `<p class="verse">«At pagpalain kayo ng Dios ng pag-asa na lubos kayong pagalak at payapain sa pananampalataya, upang kayo’y magsipagmala ng pag-asa sa pamamagitan ng kapangyarihan ng Espiritu Santo.» — Roma 15:13 <span class="section-note" style="display:inline;font-size:0.85em;">(Tagalog, domain publiko)</span></p>
            <p class="verse" style="margin-top:1rem;">«Sapagka’t aking nalalaman ang mga pagiisip na aking iniisip sa inyo, sabi ng Panginoon, mga pagiisip tungkol sa kapayapaan, at hindi tungkol sa kasamaan, upang bigyan kayo ng pag-asa sa inyong wakas.» — Jeremias 29:11 <span class="section-note" style="display:inline;font-size:0.85em;">(Tagalog, domain publiko)</span></p>
            <p class="verse" style="margin-top:1rem;">«Na siyang parang isang angkla ng kaluluwa, na matibay at matatag.» — Hebreo 6:19 <span class="section-note" style="display:inline;font-size:0.85em;">(Tagalog, domain publiko)</span></p>`,
    h3simple: "Sa simpleng salita",
    psimple: "Ang pag-asang ito ay hindi «sana swertehin»: ang Diyos ng pag-asa ang nagpapuno ng galak at kapayapaan sa pananampalataya, sa pamamagitan ng Espiritu.",
    h3sweet: "Isang banayad na salita",
    psweet: "Sinasabi sa Roma 5:5 na ang pag-asang ito ay hindi napapahiya — nananatili kahit umuuga ang buhay.",
    h3why: "Bakit nananatili ang pag-asang ito",
    pwhy: "Nakaugat ito sa Diyos, hindi sa iyong mood. May pangalan ang pangako na mapagkakatiwalaan — mapaghihiwalay mo ang takot sa bukas sa kung sino Siya. Kapag pinupuno ng Diyos ng pag-asa ang puso, hindi mo kailangang mag-isa sa patunay na gaganda ang araw.",
    h3do: "Gawin mo ngayon",
    pdo: "Sabihin nang mahina: «Panginoon, kumakapit ako sa Iyong pangako, hindi sa aking damdamin.» Huminga nang mabagal nang tatlong beses. Hindi mo kailangang pilitin ang kasiyahan — sapat ang isang minutong lumingon sa Kanya.",
    toolsClass: "tl-hope-tools",
    toolsH2: "Mga tool — Ingles na screen",
    toolsNote: `Ang mga link ay nagbubukas ng pahinang <strong>Ingles</strong>; ang teksto ng Bibliya sa tool ay <strong>KJV</strong>. <strong lang="en">(EN)</strong> ay paalala sa wika.`,
    toolsNavAria: "Tool EN",
    tPlans: "Mga plano (EN)",
    tCalm: "Calm (EN)",
    tBible: "Bibliya (EN)",
    tExplore: "Explore — wika (EN)",
    moreH2: "Iba pang paksa",
    moreButtons: `<a class="btn btn-secondary" href="/topic-hope.html" hreflang="en">Hope (EN)</a>
            <a class="btn btn-secondary" href="/fr/espoir.html" hreflang="fr">Espoir (FR)</a>
            <a class="btn btn-secondary" href="/zh/xiwang.html" hreflang="zh-CN">盼望 (中文)</a>
            <a class="btn btn-secondary" href="/tl/kabalisahan.html" hreflang="tl">Kabalisahan (TL)</a>
            <a class="btn btn-secondary" href="/topic-anxiety.html" hreflang="en">Anxiety (EN)</a>
            <a class="btn btn-secondary" href="/explore.html#topics-es" hreflang="es">Mga paksa sa ES</a>`,
    footerNote: `Pahina sa Tagalog. Mga tool sa Ingles; sa Bible tool karaniwang <abbr title="King James Version" lang="en">KJV</abbr> (maliban sa mga talatang nakasulat dito sa Tagalog).`,
  },
});

for (const { rel, lang, skip, brand, eyebrow, navLabel, main } of pages) {
  const html = shell("", lang, skip, brand, eyebrow, navLabel, main);
  const out = path.join(ROOT, rel);
  fs.mkdirSync(path.dirname(out), { recursive: true });
  fs.writeFileSync(out, html.trimStart(), "utf8");
  console.log("Wrote", rel);
}
