/**
 * One-shot generator: Portuguese mood + shell + legal pages (Tier 1–3a).
 * Run: node scripts/write-pt-locale-pages.mjs
 *
 * Release bar + hub patterns: docs/LOCALE-COMPLETE.md. Hubs: /es/, /fr/, /pt/ (hand-maintained HTML).
 * For new mood depth in another language, copy this script or extract shared templates in a follow-up.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PT_DIR = path.join(__dirname, '..', 'pt');

const LANG_SWITCHER_INNER = `            <a class="tdb-lang-opt" href="/" hreflang="en" data-tdb-pick="en">English</a>
            <span class="tdb-lang-sep" aria-hidden="true">·</span>
            <a class="tdb-lang-opt" href="/es/" hreflang="es" data-tdb-pick="es">Español</a>
            <span class="tdb-lang-sep" aria-hidden="true">·</span>
            <a class="tdb-lang-opt" href="/fr/" hreflang="fr" data-tdb-pick="fr">Français</a>
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
            <a class="tdb-lang-opt" href="/pt/" hreflang="pt" data-tdb-pick="pt">Português</a>
            <span class="tdb-lang-sep" aria-hidden="true">·</span>
            <a class="tdb-lang-opt" href="/bn/chinta.html" hreflang="bn" data-tdb-pick="bn">বাংলা</a>
            <span class="tdb-lang-sep" aria-hidden="true">·</span>
            <a class="tdb-lang-opt" href="/sw/wasiwasi.html" hreflang="sw" data-tdb-pick="sw">Kiswahili</a>
            <span class="tdb-lang-sep" aria-hidden="true">·</span>
            <a class="tdb-lang-opt tdb-lang-more" href="/explore.html#languages">More languages</a>`;

function footerNote(text) {
  return `  <p class="site-footer-pilot-note" lang="pt">${text}</p>`;
}

const FOOTER_NOTE_MOOD = footerNote(
  'Página em português (Almeida citado onde indicado). Ferramentas do site em inglês; texto bíblico nas ferramentas em geral <abbr title="King James Version" lang="en">KJV</abbr>.'
);
const FOOTER_NOTE_SHELL = footerNote(
  'Capa em português. A ferramenta abre em inglês com <abbr title="King James Version" lang="en">KJV</abbr> onde aplicável.'
);

function wrapPage({
  file,
  title,
  desc,
  canonicalPath,
  enAlternate,
  breadcrumbName,
  bannerExtra,
  mainInner,
  footerNoteHtml,
  schemaHeadline,
  extraAlternates = [],
  xDefaultPath = '/',
}) {
  const canonical = `https://todaysdailybattle.com${canonicalPath}`;
  const enAlt = enAlternate
    ? `  <link rel="alternate" hreflang="en" href="https://todaysdailybattle.com${enAlternate}">\n`
    : '';
  let extraAlt = '';
  for (let i = 0; i < extraAlternates.length; i++) {
    const pair = extraAlternates[i];
    extraAlt += `  <link rel="alternate" hreflang="${pair[0]}" href="https://todaysdailybattle.com${pair[1]}">\n`;
  }
  return `<!DOCTYPE html>
<html lang="pt">
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
  <link rel="alternate" hreflang="pt" href="${canonical}">
${enAlt}${extraAlt}  <link rel="alternate" hreflang="x-default" href="https://todaysdailybattle.com${xDefaultPath}">
  <meta property="og:title" content="${title.replace(/"/g, '&quot;')}">
  <meta property="og:url" content="${canonical}">
  <meta property="og:type" content="website">
  <meta property="og:locale" content="pt_BR">
  <meta property="og:image" content="https://todaysdailybattle.com/logo-shield-600.png">
  <link rel="icon" href="/icon.svg" type="image/svg+xml">
  <link rel="stylesheet" href="/styles.css?v=20260305p">
  <link rel="manifest" href="/manifest.json">
  <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.99.2/dist/umd/supabase.min.js" integrity="sha384-zETTH+6IXxKQ6zbGcT6H6EDdnGaae9uhI8uO7doTJoNEmPGeTKVOe5S6/XybS9JH" crossorigin="anonymous" data-cfasync="false" defer></script>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
  <script nonce="tdb2025s" type="application/ld+json">
  {"@context":"https://schema.org","@graph":[{"@type":"Article","headline":"${schemaHeadline.replace(/"/g, '\\"')}","url":"${canonical}","inLanguage":"pt","publisher":{"@type":"Organization","name":"Today's Daily Battle","url":"https://todaysdailybattle.com"}},{"@type":"BreadcrumbList","itemListElement":[{"@type":"ListItem","position":1,"name":"Início","item":"https://todaysdailybattle.com/pt/"},{"@type":"ListItem","position":2,"name":"${breadcrumbName.replace(/"/g, '\\"')}","item":"${canonical}"}]}]}
  </script>
</head>
<body class="dark-mode pt-pilot-body">
  <a href="#main-content" class="skip-link">Ir para o conteúdo principal</a>
  <div class="app-shell">
    <header class="top-bar">
      <div class="tdb-lang-switcher-header-wrap">
        <nav class="tdb-lang-switcher tdb-lang-switcher--header tdb-lang-switcher--labeled" aria-label="Escolher idioma" data-tdb-lang-switcher lang="pt">
          <span class="tdb-lang-switcher-eyebrow" aria-hidden="true">Idioma</span>
          <span class="tdb-lang-switcher-inner">
${LANG_SWITCHER_INNER}
          </span>
        </nav>
        <p class="tdb-mood-door-kjv-banner" lang="pt">${bannerExtra}</p>
      </div>
      <div class="brand">
        <a class="brand-title" href="/pt/">Today's Daily Battle</a>
        <span class="brand-subtitle">Entrega a Ele. Uma Palavra por vez.</span>
      </div>
      <nav class="header-nav tdb-global-nav" aria-label="Navegação principal">
        <a href="/pt/">Início</a>
        <a href="/explore.html">Explore <span class="section-note" style="display:inline;font-size:0.85em;">(EN)</span></a>
        <a href="/pt/paz.html">Paz</a>
        <a href="/pt/planos.html">Planos</a>
        <a href="/pt/mural.html">Mural</a>
        <a href="/pt/criancas.html">Crianças</a>
        <a href="/pt/leitor.html">Leitor</a>
      </nav>
      <a href="#sidebar" class="header-menu-link" id="sidebar-toggle" aria-label="Abrir menu"><span class="menu-icon" aria-hidden="true">☰</span><span class="menu-text">Menu</span></a>
    </header>
    <aside id="sidebar" class="sidebar">
      <nav class="side-nav" aria-label="Navegação">
        <a href="/pt/">Hub PT</a>
        <a href="/verse.html" hreflang="en">Verso do dia (EN)</a>
        <a href="/pt/mural.html">Mural (capa PT)</a>
        <a href="/" hreflang="en">English home</a>
      </nav>
    </aside>
    <main class="app-content" id="main-content">
      <div class="content-inner">
${mainInner}
      </div>
    </main>
    <footer class="site-footer site-footer--canonical" role="contentinfo" aria-label="Rodapé">
  <nav class="tdb-lang-switcher tdb-lang-switcher--footer tdb-lang-switcher--labeled" aria-label="Escolher idioma" data-tdb-lang-switcher lang="pt">
    <span class="tdb-lang-switcher-eyebrow" aria-hidden="true">Idioma</span>
    <span class="tdb-lang-switcher-inner">
${LANG_SWITCHER_INNER}
    </span>
  </nav>
${footerNoteHtml}
  <nav class="site-footer-essentials" aria-label="Páginas principais">
    <a href="/pt/">Início PT</a><span class="site-footer-ess-sep" aria-hidden="true">·</span>
    <a href="/">English home</a><span class="site-footer-ess-sep" aria-hidden="true">·</span>
    <a href="/explore.html">Explore</a>
  </nav>
  <p class="site-footer-share-wrap">
    <button type="button" id="share-page" class="share-page-btn" aria-label="Compartilhar esta página">Compartilhar</button>
  </p>
  <p class="footer-humility">Nós lutamos. Ele vence.</p>
  <p class="site-footer-updated">Última atualização: <span id="footer-date">TDB_BUILD_DATE</span></p>
  <script defer src="/language-switcher.js"></script>
</footer>
  </div>
  <script type="module" src="/config.js"></script>
  <script type="module" src="/script.js?v=20260328feelwire" data-cfasync="false"></script>
</body>
</html>
`;
}

const BANNER_STD =
  'Versos nesta página: português (Almeida, domínio público, onde citado). Ferramentas em inglês: <abbr title="King James Version" lang="en">KJV</abbr>.';

const TOOLS_BLOCK = `        <section class="glass pt-mas-ayuda" lang="pt">
          <h2 class="section-divider">Ferramentas — inglês / KJV</h2>
          <p class="section-note">Os links abrem telas em <strong>inglês</strong>.</p>
          <nav class="cta-group pt-mas-ayuda-tools" aria-label="Ferramentas em inglês" style="display:flex;flex-wrap:wrap;gap:0.5rem;">
            <a class="btn btn-secondary" href="/verse.html" hreflang="en">Verso do dia (EN)</a>
            <a class="btn btn-secondary" href="/calm.html" hreflang="en">Calm (EN)</a>
            <a class="btn btn-secondary" href="/bible-tool.html" hreflang="en">Bíblia (EN)</a>
            <a class="btn btn-secondary" href="/message.html" hreflang="en">Mural completo (EN)</a>
            <a class="btn btn-secondary" href="/explore.html#languages" hreflang="en">Todos os idiomas</a>
          </nav>
        </section>`;

const RELATED_MOODS = `        <section class="glass" lang="pt">
          <h2 class="section-divider">Outros temas em português</h2>
          <div class="cta-group" style="flex-wrap:wrap;gap:0.5rem;">
            <a class="btn btn-secondary" href="/pt/ansiedade.html">Ansiedade</a>
            <a class="btn btn-secondary" href="/pt/esperanca.html">Esperança</a>
            <a class="btn btn-secondary" href="/pt/medo.html">Medo</a>
            <a class="btn btn-secondary" href="/pt/forca.html">Força</a>
            <a class="btn btn-secondary" href="/pt/paz.html">Paz</a>
            <a class="btn btn-secondary" href="/pt/solidao.html">Solidão</a>
            <a class="btn btn-secondary" href="/pt/culpa.html">Culpa</a>
            <a class="btn btn-secondary" href="/pt/sobrecarga.html">Sobrecarga</a>
          </div>
        </section>`;

const pages = [
  {
    file: 'medo.html',
    title: 'Medo e coragem: Palavras da Bíblia (Almeida) | Today\'s Daily Battle',
    desc: 'Quando o medo aperta: versos Almeida (domínio público) e um passo de coragem. Ferramentas em inglês, KJV.',
    path: '/pt/medo.html',
    en: '/topic-fear.html',
    crumb: 'Medo',
    schema: 'Medo e coragem — Almeida',
    banner: BANNER_STD,
    footer: FOOTER_NOTE_MOOD,
    main: `        <header class="hero-banner">
          <h1>Quando o medo corre na frente dos fatos</h1>
          <p class="real-talk">O coração dispara, a mente imagina o pior — e você ainda respira. Deus não pede que você finja coragem; Ele se aproxima com a Palavra.</p>
          <p class="section-note">Texto citado: <strong>Almeida</strong> (tradição em domínio público).</p>
        </header>
        <section class="glass pt-topic-breakdown" lang="pt">
          <div class="breakdown">
            <h2>Um verso para segurar agora</h2>
            <p class="verse">«Porque Deus não nos deu o espírito de temor, mas de fortaleza, e de amor, e de moderação.» — 2 Timóteo 1:7 <span class="section-note" style="display:inline;font-size:0.85em;">(Almeida)</span></p>
            <h3>Em palavras simples</h3>
            <p>O medo que esmaga não veio dEle como dono da sua casa — veio como barulho. Ele oferece outro espírito: firmeza, amor, mente em paz.</p>
            <h3>Mais um verso</h3>
            <p class="verse">«Não temas, porque eu sou contigo; não te assombres, porque eu sou teu Deus; eu te fortaleço, e te ajudo, e te sustento com a destra da minha justiça.» — Isaías 41:10 <span class="section-note" style="display:inline;font-size:0.85em;">(Almeida)</span></p>
            <h3>Faça agora</h3>
            <p>Diga em voz baixa: «Senhor, o medo está aqui — fala mais alto que ele.» Respire devagar três vezes. Você não precisa resolver tudo antes de chegar perto dEle.</p>
          </div>
        </section>
${TOOLS_BLOCK}
${RELATED_MOODS}`,
  },
  {
    file: 'forca.html',
    title: 'Força em Cristo: Palavras da Bíblia (Almeida) | Today\'s Daily Battle',
    desc: 'Dias fracos, Deus forte: versos Almeida (domínio público). Ferramentas em inglês, KJV.',
    path: '/pt/forca.html',
    en: '/topic-strength.html',
    extraAlternates: [['es', '/fuerza.html']],
    crumb: 'Força',
    schema: 'Força em Cristo — Almeida',
    banner: BANNER_STD,
    footer: FOOTER_NOTE_MOOD,
    main: `        <header class="hero-banner">
          <h1>Quando você sente que não aguenta</h1>
          <p class="real-talk">A fraqueza não é veredito final — é lugar onde a força dEle costuma aparecer sem barulho.</p>
          <p class="section-note">Texto citado: <strong>Almeida</strong> (domínio público).</p>
        </header>
        <section class="glass pt-topic-breakdown" lang="pt">
          <div class="breakdown">
            <h2>Verso de ancoragem</h2>
            <p class="verse">«Posso todas as coisas naquele que me fortalece.» — Filipenses 4:13 <span class="section-note" style="display:inline;font-size:0.85em;">(Almeida)</span></p>
            <h3>Outro verso</h3>
            <p class="verse">«Mas os que esperam no Senhor renovarão as forças, subirão com asas como águias; correrão, e não se cansarão; caminharão, e não se fatigarão.» — Isaías 40:31 <span class="section-note" style="display:inline;font-size:0.85em;">(Almeida)</span></p>
            <h3>Para hoje</h3>
            <p>Não é «força de teatro» — é sustento real. Entregue a Ele o próximo passo, não o discurso inteiro da sua vida.</p>
          </div>
        </section>
${TOOLS_BLOCK}
${RELATED_MOODS}`,
  },
  {
    file: 'paz.html',
    title: 'Paz de Deus: Palavras da Bíblia (Almeida) | Today\'s Daily Battle',
    desc: 'Quando não há calma por dentro: versos Almeida (domínio público). Calm em inglês; espanhol: paz.html.',
    path: '/pt/paz.html',
    en: '/calm.html',
    extraAlternates: [['es', '/paz.html']],
    crumb: 'Paz',
    schema: 'Paz de Deus — Almeida',
    banner: BANNER_STD,
    footer: FOOTER_NOTE_MOOD,
    main: `        <header class="hero-banner">
          <h1>Quando a tormenta não calma por dentro</h1>
          <p class="real-talk">A paz dEle não é fuga — é âncora. Você pode trazer o coração aos pés dEle mesmo com a mão tremendo.</p>
          <p class="section-note">Par em espanhol: <a href="/paz.html" hreflang="es">paz.html</a>. Texto: <strong>Almeida</strong> (domínio público).</p>
        </header>
        <section class="glass pt-topic-breakdown" lang="pt">
          <div class="breakdown">
            <h2>Verso para respirar</h2>
            <p class="verse">«Deixo-vos a paz, a minha paz vos dou; não vo-la dou como o mundo a dá. Não se turbe o vosso coração, nem se atemorize.» — João 14:27 <span class="section-note" style="display:inline;font-size:0.85em;">(Almeida)</span></p>
            <h3>Mais luz</h3>
            <p class="verse">«Em tudo, por oração e súplicas com ações de graças, sejam os vossos pedidos conhecidos diante de Deus. E a paz de Deus, que excede todo o entendimento, guardará os vossos corações e os vossos pensamentos em Cristo Jesus.» — Filipenses 4:6-7 <span class="section-note" style="display:inline;font-size:0.85em;">(Almeida)</span></p>
            <p class="section-note" style="margin-top:0.75rem;">Para um ritmo curto em inglês: <a class="btn btn-secondary" href="/calm.html" hreflang="en">Calm (EN)</a></p>
          </div>
        </section>
${TOOLS_BLOCK}
${RELATED_MOODS}`,
  },
  {
    file: 'solidao.html',
    title: 'Solidão: Palavras da Bíblia (Almeida) | Today\'s Daily Battle',
    desc: 'Quando parece que ninguém vê: versos Almeida. Par francês: solitude. Ferramentas em inglês.',
    path: '/pt/solidao.html',
    en: '/topic-loneliness.html',
    extraAlternates: [
      ['fr', '/fr/solitude.html'],
      ['zh-CN', '/zh/gudu.html'],
    ],
    crumb: 'Solidão',
    schema: 'Solidão — Almeida',
    banner: BANNER_STD,
    footer: FOOTER_NOTE_MOOD,
    main: `        <header class="hero-banner">
          <h1>Quando parece que ninguém vê você</h1>
          <p class="real-talk">Solidão dói de verdade — e a Escritura não trata isso com frase vazia. Ele diz que fica.</p>
          <p class="section-note">Texto: <strong>Almeida</strong> (domínio público).</p>
        </header>
        <section class="glass pt-topic-breakdown" lang="pt">
          <div class="breakdown">
            <h2>Verse de presença</h2>
            <p class="verse">«Nunca te deixarei, nunca te desampararei.» — Hebreus 13:5 <span class="section-note" style="display:inline;font-size:0.85em;">(Almeida)</span></p>
            <h3>Caminho pelo vale</h3>
            <p class="verse">«Ainda que eu ande pelo vale da sombra da morte, não temerei mal algum, porque tu estás comigo; a tua vara e o teu cajado me consolam.» — Salmos 23:4 <span class="section-note" style="display:inline;font-size:0.85em;">(Almeida)</span></p>
          </div>
        </section>
${TOOLS_BLOCK}
${RELATED_MOODS}`,
  },
  {
    file: 'culpa.html',
    title: 'Culpa e perdão: Palavras da Bíblia (Almeida) | Today\'s Daily Battle',
    desc: 'Verdade sem afogar em vergonha: versos Almeida. Ferramentas em inglês, KJV.',
    path: '/pt/culpa.html',
    en: '/topic-guilt.html',
    extraAlternates: [
      ['fr', '/fr/culpabilite.html'],
      ['zh-CN', '/zh/neijiu.html'],
    ],
    crumb: 'Culpa',
    schema: 'Culpa — Almeida',
    banner: BANNER_STD,
    footer: FOOTER_NOTE_MOOD,
    main: `        <header class="hero-banner">
          <h1>Quando a culpa não cala a voz</h1>
          <p class="real-talk">Deus não chama você de «lixo» — Ele chama pecador ao confessionário do coração, com sangue que fala melhor que acusação.</p>
          <p class="section-note">Texto: <strong>Almeida</strong> (domínio público).</p>
        </header>
        <section class="glass pt-topic-breakdown" lang="pt">
          <div class="breakdown">
            <h2>Verse de confissão</h2>
            <p class="verse">«Se confessarmos os nossos pecados, ele é fiel e justo para nos perdoar os pecados, e nos purificar de toda a injustiça.» — 1 João 1:9 <span class="section-note" style="display:inline;font-size:0.85em;">(Almeida)</span></p>
            <h3>Sem condenação</h3>
            <p class="verse">«Portanto, agora nenhuma condenação há para os que estão em Cristo Jesus.» — Romanos 8:1 <span class="section-note" style="display:inline;font-size:0.85em;">(Almeida)</span></p>
          </div>
        </section>
${TOOLS_BLOCK}
${RELATED_MOODS}`,
  },
  {
    file: 'sobrecarga.html',
    title: 'Sobrecarga: Palavras da Bíblia (Almeida) | Today\'s Daily Battle',
    desc: 'Quando tudo pesa ao mesmo tempo: versos Almeida. Par inglês: topic-overwhelmed. Ferramentas em inglês.',
    path: '/pt/sobrecarga.html',
    en: '/topic-overwhelmed.html',
    extraAlternates: [
      ['fr', '/fr/deborde.html'],
      ['zh-CN', '/zh/taiduo.html'],
    ],
    crumb: 'Sobrecarga',
    schema: 'Sobrecarga — Almeida',
    banner: BANNER_STD,
    footer: FOOTER_NOTE_MOOD,
    main: `        <header class="hero-banner">
          <h1>Quando tudo desaba de uma vez</h1>
          <p class="real-talk">Você não precisa carregar como se fosse só sua a força do mundo. Ele convida: venha como está.</p>
          <p class="section-note">Texto: <strong>Almeida</strong> (domínio público).</p>
        </header>
        <section class="glass pt-topic-breakdown" lang="pt">
          <div class="breakdown">
            <h2>Convite</h2>
            <p class="verse">«Vinde a mim, todos os que estais cansados e oprimidos, e eu vos aliviarei. Tomai sobre vós o meu jugo, e aprendei de mim, que sou manso e humilde de coração, e encontrareis descanso para as vossas almas. Porque o meu jugo é suave, e o meu fardo é leve.» — Mateus 11:28-30 <span class="section-note" style="display:inline;font-size:0.85em;">(Almeida)</span></p>
          </div>
        </section>
${TOOLS_BLOCK}
${RELATED_MOODS}`,
  },
];

for (const pg of pages) {
  const html = wrapPage({
    file: pg.file,
    title: pg.title,
    desc: pg.desc,
    canonicalPath: pg.path,
    enAlternate: pg.en,
    breadcrumbName: pg.crumb,
    bannerExtra: pg.banner,
    mainInner: pg.main,
    footerNoteHtml: pg.footer,
    schemaHeadline: pg.schema,
    extraAlternates: pg.extraAlternates || [],
    xDefaultPath: pg.xDefaultPath || '/',
  });
  fs.writeFileSync(path.join(PT_DIR, pg.file), html, 'utf8');
  console.log('wrote', pg.file);
}

/* Shell pages */
const shells = [
  {
    file: 'planos.html',
    title: 'Planos de leitura (capa em português) | Today\'s Daily Battle',
    desc: 'Planos de batalha KJV: abra a versão em inglês. Capa pastoral em português.',
    path: '/pt/planos.html',
    en: '/plans.html',
    crumb: 'Planos',
    schema: 'Planos de leitura — capa PT',
    main: `        <header class="hero-banner">
          <h1>Planos de leitura — KJV</h1>
          <p class="real-talk">Os planos vivem na página em inglês (interface completa, textos KJV, offline no seu aparelho). Esta página é a porta em português — sem engano.</p>
          <div class="cta-group">
            <a class="btn btn-primary" href="/plans.html" hreflang="en">Abrir planos em inglês</a>
            <a class="btn btn-secondary" href="/pt/">Voltar ao hub PT</a>
          </div>
        </header>
        <section class="glass" lang="pt">
          <h2 class="section-divider">O que você vai encontrar</h2>
          <p class="section-note">Planos de 7 a 40 dias: distração, gratidão, força, paz, medo à fé, luto à esperança, dor crônica, e mais — tudo pensado para dias reais.</p>
        </section>
${RELATED_MOODS}`,
  },
  {
    file: 'mural.html',
    title: 'Mural de oração (capa em português) | Today\'s Daily Battle',
    desc: 'Oração e encorajamento: interface completa em inglês. Capa honesta em português.',
    path: '/pt/mural.html',
    en: '/message.html',
    crumb: 'Mural',
    schema: 'Mural de oração — capa PT',
    main: `        <header class="hero-banner">
          <h1>Mural de oração</h1>
          <p class="real-talk">O mural completo (postar, orar, encorajar) está em inglês por agora — com privacidade clara na página original. Aqui só abrimos a porta com respeito.</p>
          <div class="cta-group">
            <a class="btn btn-primary" href="/message.html" hreflang="en">Abrir mural em inglês</a>
            <a class="btn btn-secondary" href="/pt/">Hub PT</a>
          </div>
        </header>
${RELATED_MOODS}`,
  },
  {
    file: 'leitor.html',
    title: 'Leitor de capítulos (capa em português) | Today\'s Daily Battle',
    desc: 'Ler a Bíblia por capítulo — ferramenta em inglês com KJV.',
    path: '/pt/leitor.html',
    en: '/reader.html',
    crumb: 'Leitor',
    schema: 'Leitor — capa PT',
    main: `        <header class="hero-banner">
          <h1>Leitor de capítulos</h1>
          <p class="real-talk">A leitura capítulo a capítulo abre em inglês; o texto bíblico na ferramenta é KJV.</p>
          <div class="cta-group">
            <a class="btn btn-primary" href="/reader.html" hreflang="en">Abrir leitor (EN)</a>
            <a class="btn btn-secondary" href="/bible-tool.html" hreflang="en">Bíblia (EN)</a>
          </div>
        </header>
${RELATED_MOODS}`,
  },
  {
    file: 'criancas.html',
    title: 'Cantinho das crianças (capa em português) | Today\'s Daily Battle',
    desc: 'Histórias e cantinho Kids — entrada em português; biblioteca em inglês.',
    path: '/pt/criancas.html',
    en: '/kids-corner.html',
    crumb: 'Crianças',
    schema: 'Crianças — capa PT',
    main: `        <header class="hero-banner">
          <h1>Crianças</h1>
          <p class="real-talk">O Cantinho das crianças e a biblioteca Kids Battle estão em inglês por agora — mas você entra aqui sem se sentir perdido.</p>
          <div class="cta-group">
            <a class="btn btn-primary" href="/kids-corner.html" hreflang="en">Kids Corner (EN)</a>
            <a class="btn btn-secondary" href="/kids/corner.html" hreflang="en">Biblioteca de histórias (EN)</a>
            <a class="btn btn-secondary" href="/kids/" hreflang="en">Kids Battle (EN)</a>
          </div>
        </header>
${RELATED_MOODS}`,
  },
];

for (const sh of shells) {
  const html = wrapPage({
    file: sh.file,
    title: sh.title,
    desc: sh.desc,
    canonicalPath: sh.path,
    enAlternate: sh.en,
    breadcrumbName: sh.crumb,
    bannerExtra:
      'Capa em português. Ferramenta completa em inglês; texto bíblico nas ferramentas em geral <abbr title="King James Version" lang="en">KJV</abbr>.',
    mainInner: sh.main,
    footerNoteHtml: FOOTER_NOTE_SHELL,
    schemaHeadline: sh.schema,
    extraAlternates: sh.extraAlternates || [],
    xDefaultPath: sh.xDefaultPath || '/',
  });
  fs.writeFileSync(path.join(PT_DIR, sh.file), html, 'utf8');
  console.log('wrote', sh.file);
}

/* Legal summaries */
const privacyMain = `        <header class="hero-banner">
          <h1>Privacidade — resumo em português</h1>
          <p class="real-talk">Isto é um <strong>resumo</strong> para acolhida clara. O texto jurídico completo e atualizado está em inglês em <a href="/privacy.html" hreflang="en">privacy.html</a>.</p>
        </header>
        <section class="glass pt-topic-breakdown" lang="pt">
          <ul class="section-note" style="line-height:1.75;">
            <li>Sem anúncios rastreadores no produto principal; não vendemos seus dados.</li>
            <li>Orações e conteúdo sensível: veja a página em inglês para armazenamento local, Supabase quando aplicável, e boas práticas.</li>
            <li>Newsletter opcional: só se você pedir; pode cancelar quando quiser.</li>
            <li>Análises agregadas podem existir para melhorar o site — sem usar seu texto de oração como conteúdo público.</li>
          </ul>
          <div class="cta-group" style="margin-top:1rem;">
            <a class="btn btn-primary" href="/privacy.html" hreflang="en">Ler política completa (EN)</a>
            <a class="btn btn-secondary" href="/pt/">Hub PT</a>
          </div>
        </section>`;

const termsMain = `        <header class="hero-banner">
          <h1>Termos — resumo em português</h1>
          <p class="real-talk">Resumo pastoral; o documento completo vinculante está em <a href="/terms.html" hreflang="en">terms.html</a> (inglês).</p>
        </header>
        <section class="glass pt-topic-breakdown" lang="pt">
          <ul class="section-note" style="line-height:1.75;">
            <li>Uso do site por sua conta e risco; conteúdo espiritual, não substitui aconselhamento médico ou profissional.</li>
            <li>Respeito à comunidade: sem assédio, sem conteúdo ilegal.</li>
            <li>Serviços pagos (se aplicável): regidos pelos termos e política na página em inglês.</li>
          </ul>
          <div class="cta-group" style="margin-top:1rem;">
            <a class="btn btn-primary" href="/terms.html" hreflang="en">Ler termos completos (EN)</a>
            <a class="btn btn-secondary" href="/pt/">Hub PT</a>
          </div>
        </section>`;

fs.writeFileSync(
  path.join(PT_DIR, 'privacy.html'),
  wrapPage({
    file: 'privacy.html',
    title: "Privacidade (resumo PT) | Today's Daily Battle",
    desc: 'Resumo em português da política de privacidade. Texto completo em privacy.html (EN).',
    canonicalPath: '/pt/privacy.html',
    enAlternate: '/privacy.html',
    xDefaultPath: '/privacy.html',
    breadcrumbName: 'Privacidade',
    bannerExtra:
      'Resumo em português. Política jurídica completa em inglês: <a href="/privacy.html" hreflang="en">privacy.html</a>.',
    mainInner: privacyMain,
    footerNoteHtml: footerNote('Resumo para acolhida; política vinculante completa em inglês: privacy.html.'),
    schemaHeadline: 'Privacidade — resumo em português',
  }),
  'utf8',
);

fs.writeFileSync(
  path.join(PT_DIR, 'terms.html'),
  wrapPage({
    file: 'terms.html',
    title: "Termos (resumo PT) | Today's Daily Battle",
    desc: 'Resumo em português dos termos de uso. Texto completo em terms.html (EN).',
    canonicalPath: '/pt/terms.html',
    enAlternate: '/terms.html',
    xDefaultPath: '/terms.html',
    breadcrumbName: 'Termos',
    bannerExtra:
      'Resumo em português. Termos vinculantes completos em inglês: <a href="/terms.html" hreflang="en">terms.html</a>.',
    mainInner: termsMain,
    footerNoteHtml: footerNote('Resumo pastoral; termos vinculantes completos em inglês: terms.html.'),
    schemaHeadline: 'Termos — resumo em português',
  }),
  'utf8',
);
console.log('wrote privacy.html terms.html');
console.log('Done.');
