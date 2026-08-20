#!/usr/bin/env node
/** Write language-home shells that inject-locale-hub-hero can stamp. */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');

const HUBS = [
  {
    lang: 'ar',
    dir: 'rtl',
    locale: 'ar',
    title: 'العربية — Today\'s Daily Battle',
    desc: 'باب عربي: آية اليوم من ترجمة فان دايك 1865 (ملكية عامة). الأدوات بالإنجليزية وKJV.',
    h1: 'مرحباً. هذا الباب بالعربية.',
    porch: 'أنت مرحّب بك هنا — بلا امتحان. استرح أولاً.',
    talk: 'ركن للصلاة بلغتك. الموقع لا يزال كثيراً بالإنجليزية؛ نقول ذلك بوضوح.',
    bibleNote: 'آية اليوم من <strong>فان دايك 1865</strong> (ملكية عامة). ليست ترجمة الموقع كلها.',
    doorsH: 'موضوعات عربية',
    doorsLead: 'صفحات تجريبية؛ الأدوات بالإنجليزية. نص الكتاب في الأدوات غالباً KJV.',
    home: 'العربية',
    skip: 'تخطّ إلى المحتوى',
    menu: 'القائمة',
    langLabel: 'اللغة',
    doors: [
      ['/ar/qalaq.html', 'قلق'],
      ['/ar/rajaa.html', 'رجاء']
    ]
  },
  {
    lang: 'sv',
    locale: 'sv_SE',
    title: 'Svenska — Today\'s Daily Battle',
    desc: 'Svensk ingång: dagens vers från 1917 års bibel (allmän egendom). Verktyg på engelska, KJV.',
    h1: 'Välkommen. Du är på svenska.',
    porch: 'Du är redan välkommen — utan prov. Vila först.',
    talk: 'Ett hörn att be på ditt språk. Resten av sajten är ofta engelska; vi säger det rakt.',
    bibleNote: 'Dagens vers är <strong>1917 års bibel</strong> (allmän egendom). Inte hela sajten på svenska.',
    doorsH: 'Svenska ämnen',
    doorsLead: 'Pilotsidor; verktygen är engelska. Bibeltext i verktyg är oftast KJV.',
    home: 'Svenska',
    skip: 'Hoppa till innehållet',
    menu: 'Meny',
    langLabel: 'Språk',
    doors: [
      ['/sv/oro.html', 'Oro'],
      ['/sv/hopp.html', 'Hopp']
    ]
  },
  {
    lang: 'tl',
    locale: 'tl_PH',
    title: 'Tagalog — Today\'s Daily Battle',
    desc: 'Pinto sa Tagalog: talata ngayon mula sa Ang Dating Biblia 1905 (pampublikong domain). Mga tool sa Ingles, KJV.',
    h1: 'Maligayang pagdating. Nasa Tagalog ka.',
    porch: 'Tinanggap ka na rito — walang pagsusulit. Magpahinga muna.',
    talk: 'Sulok para manalangin sa iyong wika. Marami pa ring Ingles ang site; sinasabi namin nang tapat.',
    bibleNote: 'Ang talata ngayon ay <strong>Ang Dating Biblia 1905</strong> (pampublikong domain). Hindi buong site sa Tagalog.',
    doorsH: 'Mga paksang Tagalog',
    doorsLead: 'Mga pahinang piloto; Ingles ang mga tool. KJV sa Bible tool.',
    home: 'Tagalog',
    skip: 'Laktawan papunta sa nilalaman',
    menu: 'Menu',
    langLabel: 'Wika',
    doors: [
      ['/tl/kabalisahan.html', 'Kabalisahan'],
      ['/tl/pagasa.html', 'Pag-asa']
    ]
  },
  {
    lang: 'sw',
    locale: 'sw',
    title: 'Kiswahili — Today\'s Daily Battle',
    desc: 'Mlango wa Kiswahili: aya ya leo kutoka Biblia Takatifu ULB (CC BY-SA 4.0). Zana ni Kiingereza, KJV.',
    h1: 'Karibu. Uko katika Kiswahili.',
    porch: 'Umeshakaribishwa — bila mtihani. Pumzika kwanza.',
    talk: 'Pembe ya kuomba kwa lugha yako. Tovuti bado ni Kiingereza kwa kiasi kikubwa; twasema wazi.',
    bibleNote: 'Aya ya leo: <strong>Biblia Takatifu ULB</strong> (CC BY-SA 4.0, Door43). Sio tovuti yote kwa Kiswahili.',
    doorsH: 'Mada za Kiswahili',
    doorsLead: 'Kurasa za majaribio; zana ni Kiingereza. KJV katika zana ya Biblia.',
    home: 'Kiswahili',
    skip: 'Ruka kwenda kwenye maudhui',
    menu: 'Menyu',
    langLabel: 'Lugha',
    doors: [
      ['/sw/wasiwasi.html', 'Wasiwasi'],
      ['/sw/tumaini.html', 'Tumaini']
    ]
  },
  {
    lang: 'bn',
    locale: 'bn',
    title: 'বাংলা — Today\'s Daily Battle',
    desc: 'বাংলা দ্বার: আজকের পদ বাংলা IRV 2019 (CC BY-SA 4.0)। টুল ইংরেজি, KJV।',
    h1: 'স্বাগতম। এটি বাংলার দ্বার।',
    porch: 'আপনি ইতিমধ্যে স্বাগত — পরীক্ষা নেই। আগে বিশ্রাম।',
    talk: 'নিজের ভাষায় প্রার্থনার কোণ। সাইটের অনেকটাই ইংরেজি; আমরা স্পষ্ট বলি।',
    bibleNote: 'আজকের পদ: <strong>বাংলা IRV 2019</strong> (CC BY-SA 4.0, Bridge Connectivity Solutions)। পুরো সাইট বাংলা নয়।',
    doorsH: 'বাংলা বিষয়',
    doorsLead: 'পাইলট পৃষ্ঠা; টুল ইংরেজি। বাইবেল টুলে সাধারণত KJV।',
    home: 'বাংলা',
    skip: 'মূল বিষয়ে যান',
    menu: 'মেনু',
    langLabel: 'ভাষা',
    doors: [
      ['/bn/chinta.html', 'চিন্তা'],
      ['/bn/asha.html', 'আশা']
    ]
  }
];

function hubHtml(h) {
  const dir = h.dir ? ' dir="' + h.dir + '"' : '';
  const cards = h.doors
    .map(
      ([href, title]) =>
        `            <li><a href="${href}" class="explore-hub-card" hreflang="${h.lang}">
              <span class="explore-hub-card-label">${h.home}</span>
              <span class="explore-hub-card-title">${title}</span>
            </a></li>`
    )
    .join('\n');
  return `<!DOCTYPE html>
<html lang="${h.lang}"${dir}>
<head>
  <script src="/vendor/dompurify.min.js"></script>
  <script src="/tt-bootstrap.js?v=20260816-brightgold"></script>
  <script defer src="/analytics-loader.js"></script>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${h.title}</title>
  <meta name="description" content="${h.desc}">
  <meta name="robots" content="index, follow">
  <link rel="canonical" href="https://todaysdailybattle.com/${h.lang}/">
  <link rel="alternate" hreflang="${h.lang}" href="https://todaysdailybattle.com/${h.lang}/">
  <link rel="alternate" hreflang="en" href="https://todaysdailybattle.com/">
  <link rel="alternate" hreflang="x-default" href="https://todaysdailybattle.com/">
  <meta property="og:title" content="${h.title}">
  <meta property="og:url" content="https://todaysdailybattle.com/${h.lang}/">
  <meta property="og:type" content="website">
  <meta property="og:locale" content="${h.locale}">
  <meta property="og:image" content="https://todaysdailybattle.com/logo-shield-600.png">
  <link rel="icon" href="/icon.svg" type="image/svg+xml">
  <link rel="preload" href="/styles.css?v=20260816-brightgold" as="style">
  <link rel="stylesheet" href="/styles.css?v=20260816-brightgold">
  <link rel="manifest" href="/manifest.json">
</head>
<body class="dark-mode">
  <a href="#main-content" class="skip-link">${h.skip}</a>
  <div class="app-shell">
    <header class="top-bar">
      <div class="tdb-lang-switcher-header-wrap">
        <nav class="tdb-lang-switcher tdb-lang-switcher--header tdb-lang-switcher--labeled" aria-label="${h.langLabel}" data-tdb-lang-switcher lang="${h.lang}">
          <span class="tdb-lang-switcher-eyebrow" aria-hidden="true">${h.langLabel}</span>
          <span class="tdb-lang-switcher-inner">
            <a class="tdb-lang-opt" href="/" hreflang="en" data-tdb-pick="en">English</a>
            <span class="tdb-lang-sep" aria-hidden="true">·</span>
            <a class="tdb-lang-opt" href="/es/" hreflang="es" data-tdb-pick="es">Español</a>
            <span class="tdb-lang-sep" aria-hidden="true">·</span>
            <a class="tdb-lang-opt" href="/fr/" hreflang="fr" data-tdb-pick="fr">Français</a>
            <span class="tdb-lang-sep" aria-hidden="true">·</span>
            <a class="tdb-lang-opt" href="/pt/" hreflang="pt" data-tdb-pick="pt">Português</a>
            <span class="tdb-lang-sep" aria-hidden="true">·</span>
            <a class="tdb-lang-opt tdb-lang-more" href="/explore.html#languages">More languages</a>
          </span>
        </nav>
      </div>
      <div class="brand">
        <a class="brand-title" href="/${h.lang}/">Today's Daily Battle</a>
        <span class="brand-subtitle">${h.home}</span>
      </div>
      <nav class="header-nav tdb-global-nav" aria-label="${h.menu}">
        <a href="/${h.lang}/">${h.home}</a>
        <a href="/explore.html">Explore</a>
        <a href="/verse.html">Today (EN)</a>
      </nav>
    </header>
    <main class="app-content porch-section" id="main-content">
      <div class="content-inner explore-page">
        <header class="hero-banner tdb-dawn-bg--mist" id="${h.lang}-hub-hero">
          <h1>${h.h1}</h1>
          <p class="section-note topic-mood-porch">${h.porch}</p>
          <p class="real-talk">${h.talk}</p>
          <p class="section-note">${h.bibleNote}</p>
        </header>
        <section class="glass explore-hub tdb-porch-paper-glass" lang="${h.lang}" id="${h.lang}-hub-doors">
          <h2 class="section-divider explore-hub-section-title">${h.doorsH}</h2>
          <p class="section-note explore-hub-lead">${h.doorsLead}</p>
          <ul class="explore-hub-grid">
${cards}
            <li><a href="/" class="explore-hub-card" hreflang="en">
              <span class="explore-hub-card-label">English</span>
              <span class="explore-hub-card-title">Home</span>
            </a></li>
          </ul>
        </section>
        <section class="glass tdb-porch-paper-glass pt-topic-breakdown tdb-hub-daily-wrap" lang="${h.lang}" id="${h.lang}-hub-daily-verse" data-tdb-locale-hub="${h.lang}">
          <div class="breakdown">
            <h2 class="section-divider" id="${h.lang}-daily-heading">Today</h2>
            <p class="section-note">Official verse stamps at build.</p>
          </div>
        </section>
      </div>
    </main>
  </div>
  <script src="/language-switcher.js?v=20260816-brightgold" defer></script>
</body>
</html>
`;
}

for (const h of HUBS) {
  const dir = path.join(root, h.lang);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'index.html'), hubHtml(h), 'utf8');
  console.log('wrote', h.lang + '/index.html');
}
