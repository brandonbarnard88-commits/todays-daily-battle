#!/usr/bin/env node
/**
 * Write the six crisis topic pages (Cancer, Addiction, Pain, Caregiver,
 * Spiritual warfare, Depression) from the Trauma shell + KJV/BBE JSON.
 * Sit/meaning are verse-true (this verse, not a later-verse mash).
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const kjv = JSON.parse(fs.readFileSync(path.join(root, 'data/kjv-full.json'), 'utf8'));
const bbe = JSON.parse(fs.readFileSync(path.join(root, 'data/bbe-full.json'), 'utf8'));
const trauma = fs.readFileSync(path.join(root, 'topic-trauma.html'), 'utf8');

function esc(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function bookAliases(book) {
  if (book === 'Psalm') return ['Psalms', 'Psalm'];
  if (book === 'Psalms') return ['Psalms', 'Psalm'];
  if (book === 'Song of Solomon') return ['Song of Solomon', 'Song of Songs'];
  return [book];
}

function lookupOne(map, ref) {
  if (map[ref]) return map[ref];
  const m = String(ref).match(/^(.*?)\s+(\d+:\d+)$/);
  if (!m) return '';
  for (const book of bookAliases(m[1])) {
    const key = `${book} ${m[2]}`;
    if (map[key]) return map[key];
  }
  return '';
}

function lookupRange(map, ref) {
  const direct = lookupOne(map, ref);
  if (direct) return direct;
  const m = String(ref).match(/^(.*?)\s+(\d+):(\d+)-(\d+)$/);
  if (!m) return '';
  const ch = m[2];
  const from = Number(m[3]);
  const to = Number(m[4]);
  const parts = [];
  for (let v = from; v <= to; v += 1) {
    let hit = '';
    for (const book of bookAliases(m[1])) {
      hit = map[`${book} ${ch}:${v}`] || '';
      if (hit) break;
    }
    if (!hit) throw new Error('Missing ' + m[1] + ' ' + ch + ':' + v);
    parts.push(hit);
  }
  return parts.join(' ');
}

function getKjv(ref) {
  const t = lookupRange(kjv, ref);
  if (!t) throw new Error('Missing KJV ' + ref);
  return t;
}

function getBbe(ref) {
  const t = lookupRange(bbe, ref);
  if (!t) throw new Error('Missing BBE ' + ref);
  return t.replace(/^\s*-\s*To the chief music-maker\.[^-]*-\s*/i, '').trim();
}

function verseCard(v) {
  const kjvText = getKjv(v.ref);
  const bbeText = v.bbe || getBbe(v.ref);
  return `            <div class="list-item"><div><strong>${esc(v.ref)} (KJV)</strong>
            <div class="tdb-kiss-verse__block tdb-kiss-verse__block--kjv"><h4 class="tdb-kiss-verse__label">KJV</h4><p class="tdb-kiss-verse__kjv">${esc(kjvText)}</p></div>
            <div class="tdb-topic-vbd tdb-kiss-verse tdb-kiss-verse--topic" data-tdb-topic-vbd="1"><div class="tdb-kiss-verse__block tdb-kiss-verse__block--bbe"><h4 class="tdb-kiss-verse__label">In simpler words</h4><p class="tdb-kiss-verse__bbe">${esc(bbeText)}</p></div><div class="tdb-kiss-verse__block"><h4 class="tdb-kiss-verse__label">What was going on</h4><p class="tdb-kiss-verse__sit">${esc(v.sit)}</p></div><div class="tdb-kiss-verse__block"><h4 class="tdb-kiss-verse__label">What it means</h4><p class="tdb-kiss-verse__mean">${esc(v.mean)}</p></div></div>
            <p class="tdb-topic-verse-note">${v.note}</p></div></div>`;
}

function relatedHtml(links) {
  return links
    .map((l) => `            <a class="btn btn-secondary" href="${esc(l.href)}">${l.label}</a>`)
    .join('\n');
}

function faqJson(items) {
  return items
    .map((item) => `{
            "@type": "Question",
            "name": ${JSON.stringify(item.q)},
            "acceptedAnswer": { "@type": "Answer", "text": ${JSON.stringify(item.a)} }
          }`)
    .join(',\n          ');
}

function buildPage(page) {
  const versesHtml = page.verses.map(verseCard).join('\n');
  const faq = faqJson(page.faq);
  const main = `
      <div class="content-inner">
        <header class="hero-banner topic-mood-hero topic-hero--soar-dawn tdb-dawn-bg--mist" id="topic-top">
          <h1>${page.h1}</h1>
          <p class="section-note topic-mood-porch">You&rsquo;re already welcome here. You don&rsquo;t have to get anything right first. One verse is enough.</p>
          <section class="tdb-heavy-now tdb-heavy-now--topic" aria-labelledby="${page.heavyId}">
            <p class="tdb-heavy-now__eyebrow">Heavy moment first</p>
            <h2 class="tdb-heavy-now__title" id="${page.heavyId}">${page.heavyTitle}</h2>
            <p class="tdb-heavy-now__lead">${page.heavyLead}</p>
            <div class="tdb-heavy-now__actions">
              <a class="btn btn-primary tdb-heavy-now__primary" href="/calm.html">When it's hard</a>
              ${page.planHref ? `<a class="btn btn-secondary" href="${esc(page.planHref)}">${page.planLabel}</a>` : ''}
              <a class="btn btn-secondary" href="/prayer-wall.html?tab=with-others">Prayer</a>
            </div>
          </section>
          <p class="hero-tagline topic-mood-tagline">${page.tagline}</p>
          <p class="section-note tdb-topic-not-treatment">${page.notTreatment}</p>
          <p class="topic-mood-subtle">No rush. Read slowly. Let one verse land.</p>
        </header>
        <details class="tdb-hub-disclosure" id="topic-mobius-details">
          <summary class="tdb-hub-disclosure__summary">A quieter path (Grace Ribbon)</summary>
          <div class="tdb-hub-disclosure__inner">
        <aside class="glass tdb-porch-paper-glass tdb-mobius-loop-door" aria-label="Walk the Grace Ribbon">
          <h2 class="section-divider tdb-mobius-loop-door-heading">A quieter path</h2>
          <p class="section-note tdb-mobius-loop-door-lead">This page gives you verses in reach. The <a href="/mobius.html">Grace Ribbon</a> is the slow room—breath, silence, one path where what you carry and what God says are not two separate tracks.</p>
          <div class="cta-group tdb-mobius-loop-door-actions">
            <a class="btn btn-secondary" href="/mobius.html">Open Grace Ribbon</a>
            <a class="btn btn-secondary" href="/mobius.html#mobius-loop-journal">Loop journal</a>
          </div>
        </aside>
          </div>
        </details>
        <section class="glass tdb-porch-paper-glass">
          <h2 class="section-divider">Key Verses</h2>
          <div class="list">
${versesHtml}
          </div>
        </section>
        <details class="tdb-hub-disclosure" id="topic-more-on-topic">
          <summary class="tdb-hub-disclosure__summary">More on this topic</summary>
          <div class="tdb-hub-disclosure__inner">
        <section class="glass tdb-porch-paper-glass">
          <h2 class="section-divider">When it hits hardest</h2>
          <ul class="tdb-topic-when-hardest">
            ${page.whenHardest.map((li) => `<li>${li}</li>`).join('\n            ')}
          </ul>
        </section>
        <section class="glass tdb-porch-paper-glass">
          <h2 class="section-divider">A Gentle Word</h2>
          <p class="section-note">${page.gentle}</p>
        </section>
        <section class="glass tdb-porch-paper-glass">
          <h2 class="section-divider">Related Topics</h2>
          <p class="section-note">More verses when you&rsquo;re ready:</p>
          <div class="cta-group topic-related-ctas">
${relatedHtml(page.related)}
          </div>
        </section>
          </div>
        </details>
          </div>
    `;

  let head = trauma.split('<main class="app-content" id="main-content">')[0];
  const after = trauma.split('</main>')[1];
  if (!head || !after) throw new Error('Could not split topic-trauma.html');

  head = head
    .replace(
      /<body class="dark-mode tdb-inner-page tdb-no-sidebar-shell tdb-topic-mood-page">/,
      '<body class="dark-mode tdb-inner-page tdb-no-sidebar-shell tdb-topic-mood-page" data-tdb-vbd-lock="1">'
    )
    .replace(/<title>[\s\S]*?<\/title>/, `<title>${page.title}</title>`)
    .replace(/<meta name="description" content="[^"]*">/, `<meta name="description" content="${esc(page.description)}">`)
    .replace(/https:\/\/todaysdailybattle\.com\/topic-trauma\.html/g, `https://todaysdailybattle.com/${page.file}`)
    .replace(/<link rel="canonical" href="[^"]+">/, `<link rel="canonical" href="https://todaysdailybattle.com/${page.file}">`)
    .replace(/<link rel="alternate" hreflang="en" href="[^"]+">/, `<link rel="alternate" hreflang="en" href="https://todaysdailybattle.com/${page.file}">`)
    .replace(/\s*<link rel="alternate" hreflang="es" href="[^"]+">/, '')
    .replace(/\s*<link rel="alternate" hreflang="fr" href="[^"]+">/, '')
    .replace(/\s*<link rel="alternate" hreflang="pt" href="[^"]+">/, '')
    .replace(/\s*<link rel="alternate" hreflang="id" href="[^"]+">/, '')
    .replace(/<meta property="og:title" content="[^"]*">/, `<meta property="og:title" content="${esc(page.ogTitle)}">`)
    .replace(/<meta property="og:description" content="[^"]*">/, `<meta property="og:description" content="${esc(page.ogDescription)}">`)
    .replace(/<meta name="twitter:title" content="[^"]*">/, `<meta name="twitter:title" content="${esc(page.ogTitle)}">`)
    .replace(/<meta name="twitter:description" content="[^"]*">/, `<meta name="twitter:description" content="${esc(page.ogDescription)}">`)
    .replace(/<span class="brand-subtitle">[\s\S]*?<\/span>/, `<span class="brand-subtitle">${page.subtitle}</span>`);

  const ld = `  <script nonce="tdb2025s" type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        "headline": ${JSON.stringify(page.headline)},
        "description": ${JSON.stringify(page.description)},
        "url": "https://todaysdailybattle.com/${page.file}",
        "dateModified": "2026-09-02",
        "publisher": { "@type": "Organization", "name": "Today's Daily Battle", "url": "https://todaysdailybattle.com", "logo": { "@type": "ImageObject", "url": "https://todaysdailybattle.com/logo-shield-600.png" } },
        "inLanguage": "en-US",
        "keywords": ${JSON.stringify(page.keywords)}
      },
      {
        "@type": "FAQPage",
        "mainEntity": [
          ${faq}
        ]
      },
      { "@type": "BreadcrumbList", "itemListElement": [ { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://todaysdailybattle.com/" }, { "@type": "ListItem", "position": 2, "name": ${JSON.stringify(page.crumb)}, "item": "https://todaysdailybattle.com/${page.file}" } ] }
    ]
  }
  </script>`;

  head = head.replace(/<script nonce="tdb2025s" type="application\/ld\+json">[\s\S]*?<\/script>/, ld);

  return `${head}<main class="app-content" id="main-content">${main}</main>${after}`;
}

const sharedRelatedTail = [
  { href: '/', label: 'Today’s verse' },
  { href: '/#feel-section', label: 'Ask the Word' },
  { href: '/prayer-wall.html?tab=with-others', label: 'Prayer' },
  { href: '/calm.html', label: 'When it’s hard' },
];

const pages = [
  {
    file: 'topic-cancer.html',
    title: 'KJV Bible Verses for Cancer | Today\'s Daily Battle',
    headline: 'KJV Bible Verses for Cancer',
    crumb: 'Cancer',
    h1: 'Cancer',
    description: 'King James Scripture when cancer is in the room—quiet verses for the one who is ill, and for the ones who wait with them. This is Scripture, not treatment.',
    ogTitle: 'KJV Bible Verses for Cancer | Today\'s Daily Battle',
    ogDescription: 'KJV verses when cancer is in the room. Scripture beside you, not a treatment plan.',
    keywords: 'bible verses for cancer, KJV cancer comfort, Psalm 73:26, Isaiah 41:10, Psalm 23:4',
    subtitle: 'My flesh and my heart faileth: but God is the strength of my heart.',
    heavyId: 'topicCancerHeavyNowH',
    heavyTitle: 'The report is loud? Start here.',
    heavyLead: 'One KJV verse beside you&mdash;no timeline, no performance.',
    planHref: 'plans.html?plan=cancercomfort',
    planLabel: '7-day plan',
    tagline: 'When the body is under siege, the Word does not ask you to pretend. These verses sit with this moment&mdash;KJV on this page.',
    notTreatment: 'This is Scripture, not treatment. Doctors treat the body. These verses sit with you while they do.',
    gentle: 'Psalm 73:26. Flesh and heart may fail. God remains the strength of the heart, and the portion for ever.',
    whenHardest: [
      '<strong>In the waiting room</strong> when names are called and yours is next&mdash;Isaiah 41:10 is one sentence you can hold.',
      '<strong>When the body is weaker than yesterday</strong>&mdash;2 Corinthians 4:16 names the outward man without denying the inward one.',
      '<strong>When family is trying to be strong for you</strong>&mdash;Psalm 23:4 is for the valley, not for a speech.',
    ],
    verses: [
      {
        ref: 'Psalm 73:26',
        sit: 'Asaph’s flesh and heart fail; he confesses God as the strength of his heart and his portion for ever.',
        mean: 'My flesh and my heart fail: but God is the strength of my heart, and my portion for ever.',
        note: 'The body can fail and still not be the last word over you.',
      },
      {
        ref: 'Psalm 23:4',
        sit: 'David walks through the valley of the shadow of death and says he will fear no evil, because the Shepherd is with him; rod and staff comfort him.',
        mean: 'Even in the valley of the shadow of death, I will fear no evil: You are with me; Your rod and staff comfort me.',
        note: 'The valley is named. So is the Shepherd in it.',
      },
      {
        ref: 'Isaiah 41:10',
        sit: 'The Lord tells fearful Israel in exile: Fear thou not; for I am with thee — He will strengthen, help, and uphold with His right hand.',
        mean: 'Fear not; I am with you. I am your God. I will strengthen you, help you, and uphold you.',
        note: 'Fear is answered with nearness, not with a demand to feel brave first.',
      },
      {
        ref: '2 Corinthians 4:16',
        sit: 'Paul says the outward man perishes, yet the inward man is renewed day by day — and for that cause they faint not.',
        mean: 'We faint not: though the outward man perish, the inward man is renewed day by day.',
        note: 'The wasting is honest. So is the daily inward renewing.',
      },
      {
        ref: 'Romans 8:38-39',
        sit: 'Paul is persuaded that death, life, angels, powers, height, depth, or any creature cannot separate us from the love of God in Christ Jesus our Lord.',
        mean: 'Nothing—death, life, angels, powers, height, depth, or any creature—can separate us from the love of God which is in Christ Jesus our Lord.',
        note: 'The love of God in Christ is not smaller than this diagnosis.',
      },
    ],
    faq: [
      {
        q: 'What does the Bible say when cancer is in the room?',
        a: "Psalm 73:26 says 'My flesh and my heart faileth: but God is the strength of my heart, and my portion for ever.' Isaiah 41:10 says 'Fear thou not; for I am with thee.' (KJV) This page is Scripture, not treatment.",
      },
      {
        q: 'Is this a medical guide?',
        a: 'No. This is Scripture, not treatment. Bring the body to the people who treat bodies. These verses sit with you while they do.',
      },
    ],
    related: [
      { href: 'topic-pain.html', label: 'Pain' },
      { href: 'topic-caregiver.html', label: 'Caregiver' },
      { href: 'topic-hope.html', label: 'Hope' },
      { href: 'topic-strength.html', label: 'Strength' },
      { href: 'topic-depression.html', label: 'Depression' },
      ...sharedRelatedTail,
    ],
  },
  {
    file: 'topic-addiction.html',
    title: 'KJV Bible Verses for Addiction | Today\'s Daily Battle',
    headline: 'KJV Bible Verses for Addiction',
    crumb: 'Addiction',
    h1: 'Addiction',
    description: 'King James Scripture when a craving or a chain is louder than you wanted it to be. This is Scripture, not treatment.',
    ogTitle: 'KJV Bible Verses for Addiction | Today\'s Daily Battle',
    ogDescription: 'KJV verses when a chain is loud. Scripture beside you, not a treatment plan.',
    keywords: 'bible verses for addiction, KJV addiction, 1 Corinthians 10:13, John 8:36, Galatians 5:1',
    subtitle: 'If the Son therefore shall make you free, ye shall be free indeed.',
    heavyId: 'topicAddictionHeavyNowH',
    heavyTitle: 'The craving is loud? Start here.',
    heavyLead: 'One KJV verse in reach&mdash;no lecture, no scoreboard.',
    planHref: 'plans.html?plan=addictionhope',
    planLabel: '7-day plan',
    tagline: 'When the same door keeps winning, Scripture names both the wretched cry and the Son who makes free&mdash;KJV on this page.',
    notTreatment: 'This is Scripture, not treatment. Recovery rooms, doctors, and honest friends still belong. These verses sit with you while you reach them.',
    gentle: 'John 8:36. If the Son makes you free, you shall be free indeed. That is a Person, not a streak.',
    whenHardest: [
      '<strong>Before the old door</strong> when your feet already know the way&mdash;1 Corinthians 10:13 says the test is common, and God makes a way of escape.',
      '<strong>After you fell again</strong>&mdash;Romans 7:24 is allowed to be a cry, not a speech.',
      '<strong>When shame says you are the old man forever</strong>&mdash;2 Corinthians 5:17 names a new creature in Christ.',
    ],
    verses: [
      {
        ref: '1 Corinthians 10:13',
        sit: 'Paul tells Corinth no temptation is unique to them; God is faithful, who will not suffer them to be tempted above what they are able, and will with the temptation make a way to escape.',
        mean: 'No temptation has taken you but what is common to man. God is faithful: He will not let you be tempted above what you are able, and will make a way to escape so you can bear it.',
        note: 'The way of escape is promised with the temptation—not after you prove you are strong.',
      },
      {
        ref: 'Romans 7:24',
        sit: 'Paul cries out under the body of this death: O wretched man that I am! who shall deliver me?',
        mean: 'O wretched man that I am! Who shall deliver me from the body of this death?',
        note: 'The cry is in the Bible. You do not have to tidy it before you pray it.',
      },
      {
        ref: 'John 8:36',
        sit: 'Jesus tells those in the temple that if the Son makes them free, they shall be free indeed.',
        mean: 'If the Son therefore shall make you free, you shall be free indeed.',
        note: 'Freedom here is the Son’s doing—not a white-knuckle vow.',
      },
      {
        ref: '2 Corinthians 5:17',
        sit: 'Paul tells Corinth that if anyone is in Christ, he is a new creature: old things are passed away; behold, all things are become new.',
        mean: 'If anyone is in Christ, he is a new creature: old things are passed away; all things are become new.',
        note: 'The old things do not get to keep the title on you.',
      },
      {
        ref: 'Psalm 40:2',
        sit: 'David says the Lord brought him up out of a horrible pit and out of the miry clay, set his feet upon a rock, and established his goings.',
        mean: 'He brought me up out of a horrible pit, out of the miry clay, set my feet on a rock, and established my goings.',
        note: 'A pit is named. So is the rock under the feet.',
      },
      {
        ref: 'Galatians 5:1',
        sit: 'Paul tells the churches of Galatia to stand fast in the liberty wherewith Christ has made them free, and not be entangled again with the yoke of bondage.',
        mean: 'Stand fast in the liberty Christ has given, and do not be entangled again with the yoke of bondage.',
        note: 'Liberty is already given in Christ. The call is to stand in it, not earn it.',
      },
    ],
    faq: [
      {
        q: 'What does the Bible say about addiction and temptation?',
        a: "1 Corinthians 10:13 says God is faithful, who will not suffer you to be tempted above that ye are able, and will with the temptation also make a way to escape. John 8:36 says 'If the Son therefore shall make you free, ye shall be free indeed.' (KJV) This page is Scripture, not treatment.",
      },
      {
        q: 'Does this page replace recovery help?',
        a: 'No. This is Scripture, not treatment. Keep the people and rooms that help a body and a mind. These verses sit with you while you do.',
      },
    ],
    related: [
      { href: 'topic-spiritual-warfare.html', label: 'Spiritual warfare' },
      { href: 'topic-guilt.html', label: 'Guilt' },
      { href: 'topic-forgiveness.html', label: 'Forgiveness' },
      { href: 'topic-depression.html', label: 'Depression' },
      { href: 'topic-hope.html', label: 'Hope' },
      ...sharedRelatedTail,
    ],
  },
  {
    file: 'topic-pain.html',
    title: 'KJV Bible Verses for Pain &amp; Suffering | Today\'s Daily Battle',
    headline: 'KJV Bible Verses for Pain and Suffering',
    crumb: 'Pain',
    h1: 'Pain',
    description: 'King James Scripture when pain will not quit—body, grief, or a long hurt. This is Scripture, not treatment.',
    ogTitle: 'KJV Bible Verses for Pain | Today\'s Daily Battle',
    ogDescription: 'KJV verses when pain will not quit. Scripture beside you, not a treatment plan.',
    keywords: 'bible verses for pain, KJV suffering, Romans 8:18, 2 Corinthians 1:3, Psalm 34:18, Isaiah 53:4',
    subtitle: 'He healeth the broken in heart, and bindeth up their wounds.',
    heavyId: 'topicPainHeavyNowH',
    heavyTitle: 'It will not quit? Start here.',
    heavyLead: 'One KJV verse you can hold while the hurt is still here.',
    planHref: 'plans.html?plan=sufferendure',
    planLabel: '7-day plan',
    tagline: 'Scripture does not scold you for hurting. It names present sufferings, a God of all comfort, and a Servant who bore griefs&mdash;KJV on this page.',
    notTreatment: 'This is Scripture, not treatment. Medicine, rest, and honest care still belong. These verses sit with you in the hurt.',
    gentle: '2 Corinthians 1:3. Blessed be the Father of mercies, the God of all comfort. All of it—not only the tidy kind.',
    whenHardest: [
      '<strong>When the pain is still here at 3 a.m.</strong>&mdash;Psalm 34:18 says the LORD is nigh unto the broken heart, not waiting for morning.',
      '<strong>When people want a lesson from your hurt</strong>&mdash;Romans 8:18 compares present sufferings with glory later; it does not make the now small.',
      '<strong>When you have no words left</strong>&mdash;Isaiah 53:4 says He hath borne our griefs and carried our sorrows.',
    ],
    verses: [
      {
        ref: '2 Corinthians 1:3-4',
        sit: 'Paul blesses the Father of mercies, the God of all comfort, who comforts us in all our tribulation so we may comfort them which are in any trouble with the same comfort.',
        mean: 'Blessed be the Father of mercies, the God of all comfort, who comforts us in all our tribulation so we can comfort others with the comfort we received.',
        note: 'Comfort is from God first. Sharing it comes after you have been comforted.',
      },
      {
        ref: 'Romans 8:18',
        sit: 'Paul reckons that the sufferings of this present time are not worthy to be compared with the glory which shall be revealed in us.',
        mean: 'The sufferings of this present time are not worthy to be compared with the glory that shall be revealed in us.',
        note: 'Present time is named as suffering. Glory is later, not a demand to feel it now.',
      },
      {
        ref: 'Psalm 34:18',
        sit: 'David, after escaping Abimelech, teaches that the LORD is nigh unto them that are of a broken heart, and saves such as be of a contrite spirit.',
        mean: 'The LORD is near the brokenhearted, and saves those of a contrite spirit.',
        note: 'Nearness is the first gift—not a speech about getting over it.',
      },
      {
        ref: 'Isaiah 53:4',
        sit: 'Isaiah says the Servant hath borne our griefs and carried our sorrows: yet we did esteem Him stricken, smitten of God, and afflicted.',
        mean: 'Surely He has borne our griefs and carried our sorrows: yet we esteemed Him stricken, smitten of God, and afflicted.',
        note: 'Griefs and sorrows are carried. They are not ignored.',
      },
      {
        ref: '2 Corinthians 4:17',
        sit: 'Paul calls the present affliction light and but for a moment, working a far more exceeding and eternal weight of glory.',
        mean: 'Our light affliction, which is but for a moment, works for us a far more exceeding and eternal weight of glory.',
        note: '“Light” here is compared with eternal glory—not a scolding that your pain is small.',
      },
      {
        ref: 'Psalm 147:3',
        sit: 'A Hallelujah psalm: He healeth the broken in heart, and bindeth up their wounds.',
        mean: 'He heals the broken in heart, and binds up their wounds.',
        note: 'Binding takes time. Wounds are named as wounds.',
      },
    ],
    faq: [
      {
        q: 'What does the Bible say about pain and suffering?',
        a: "Romans 8:18 says the sufferings of this present time are not worthy to be compared with the glory which shall be revealed in us. Psalm 34:18 says 'The LORD is nigh unto them that are of a broken heart.' (KJV) This page is Scripture, not treatment.",
      },
      {
        q: 'Does this page replace medical care?',
        a: 'No. This is Scripture, not treatment. Keep the care your body needs. These verses sit with you in the hurt.',
      },
    ],
    related: [
      { href: 'topic-cancer.html', label: 'Cancer' },
      { href: 'topic-caregiver.html', label: 'Caregiver' },
      { href: 'topic-grief.html', label: 'Grief' },
      { href: 'topic-trauma.html', label: 'When Trust Was Broken' },
      { href: 'topic-hope.html', label: 'Hope' },
      ...sharedRelatedTail,
    ],
  },
  {
    file: 'topic-caregiver.html',
    title: 'KJV Bible Verses for Caregivers | Today\'s Daily Battle',
    headline: 'KJV Bible Verses for Caregivers',
    crumb: 'Caregiver',
    h1: 'Caregiver',
    description: 'King James Scripture when you are the one who never clocks out. This is Scripture, not treatment.',
    ogTitle: 'KJV Bible Verses for Caregivers | Today\'s Daily Battle',
    ogDescription: 'KJV verses when you are the one who never clocks out. Scripture beside you, not a treatment plan.',
    keywords: 'bible verses for caregivers, KJV caregiver rest, Galatians 6:2, Matthew 11:28, Isaiah 40:31, Psalm 55:22',
    subtitle: 'Come unto me, all ye that labour and are heavy laden, and I will give you rest.',
    heavyId: 'topicCaregiverHeavyNowH',
    heavyTitle: 'You never clock out? Start here.',
    heavyLead: 'One KJV verse for the one holding everyone else.',
    planHref: 'plans.html?plan=caregiverrest',
    planLabel: '7-day plan',
    tagline: 'Bearing another’s burden is holy work. It is also heavy. These verses speak to the labourer, not only to the one being held&mdash;KJV on this page.',
    notTreatment: 'This is Scripture, not treatment. Respite, doctors, and other hands still belong. You are allowed to need them.',
    gentle: 'Matthew 11:28. Come unto Me, all ye that labour and are heavy laden. The invitation is to the tired one—you.',
    whenHardest: [
      '<strong>When everyone else sleeps</strong> and you are still on watch&mdash;Psalm 55:22 says cast thy burden upon the LORD; He shall sustain thee.',
      '<strong>When well-doing has gone longer than your strength</strong>&mdash;Galatians 6:9 says do not be weary in well doing; due season is still ahead.',
      '<strong>When you cannot put the burden down</strong>&mdash;Galatians 6:2 is for the church too: others may bear with you.',
    ],
    verses: [
      {
        ref: 'Galatians 6:2',
        sit: 'Paul tells the churches to bear one another’s burdens, and so fulfil the law of Christ.',
        mean: 'Bear one another’s burdens, and so fulfil the law of Christ.',
        note: 'The law of Christ here is shared weight—not you alone forever.',
      },
      {
        ref: 'Matthew 11:28',
        sit: 'Jesus invites all who labour and are heavy laden to come unto Him, and He will give them rest.',
        mean: 'Come to Me, all you who labour and are heavy laden, and I will give you rest.',
        note: 'The tired are invited as they are. Rest is His gift.',
      },
      {
        ref: 'Isaiah 40:31',
        sit: 'Isaiah tells weary Judah that they that wait upon the LORD shall renew their strength; they shall mount up with wings as eagles, run and not be weary, walk and not faint.',
        mean: 'They that wait upon the LORD shall renew their strength: they shall mount up with wings as eagles; they shall run and not be weary; they shall walk and not faint.',
        note: 'Strength is renewed in waiting on the Lord—not in pretending you never tire.',
      },
      {
        ref: 'Psalm 55:22',
        sit: 'David, crushed by a friend’s treachery, says cast thy burden upon the LORD, and He shall sustain thee: He shall never suffer the righteous to be moved.',
        mean: 'Cast your burden upon the LORD, and He shall sustain you: He shall never suffer the righteous to be moved.',
        note: 'Sustain is the word—not “make the burden imaginary.”',
      },
      {
        ref: 'Galatians 6:9',
        sit: 'Paul tells the churches not to be weary in well doing: for in due season we shall reap, if we faint not.',
        mean: 'Let us not be weary in well doing: in due season we shall reap, if we faint not.',
        note: 'Well doing can weary you. Due season is still promised.',
      },
      {
        ref: '2 Corinthians 1:4',
        sit: 'Paul says God comforts us in all our tribulation, that we may be able to comfort them which are in any trouble, by the comfort wherewith we ourselves are comforted of God.',
        mean: 'God comforts us in all our tribulation so we can comfort others with the comfort we ourselves received from God.',
        note: 'You can pass comfort on. You also have to receive it first.',
      },
    ],
    faq: [
      {
        q: 'What does the Bible say to the one who is always caring for someone else?',
        a: "Matthew 11:28 says 'Come unto me, all ye that labour and are heavy laden, and I will give you rest.' Galatians 6:2 says 'Bear ye one another’s burdens, and so fulfil the law of Christ.' (KJV) This page is Scripture, not treatment.",
      },
      {
        q: 'Does this page replace respite or medical help?',
        a: 'No. This is Scripture, not treatment. Other hands, rest, and doctors still belong. You are allowed to need them.',
      },
    ],
    related: [
      { href: 'topic-cancer.html', label: 'Cancer' },
      { href: 'topic-pain.html', label: 'Pain' },
      { href: 'topic-strength.html', label: 'Strength' },
      { href: 'topic-parenting.html', label: 'Parenting' },
      { href: 'topic-overwhelmed.html', label: 'Overwhelmed' },
      { href: '/family', label: 'Family' },
      ...sharedRelatedTail,
    ],
  },
  {
    file: 'topic-spiritual-warfare.html',
    title: 'KJV Bible Verses for Spiritual Warfare | Today\'s Daily Battle',
    headline: 'KJV Bible Verses for Spiritual Warfare',
    crumb: 'Spiritual warfare',
    h1: 'Spiritual warfare',
    description: 'King James Scripture when the fight is not flesh and blood. This is Scripture, not treatment, and not a map of fear.',
    ogTitle: 'KJV Bible Verses for Spiritual Warfare | Today\'s Daily Battle',
    ogDescription: 'KJV verses when the fight is not flesh and blood. Stand. Resist. Greater is He that is in you.',
    keywords: 'bible verses for spiritual warfare, KJV armor of God, Ephesians 6:11, James 4:7, 1 John 4:4',
    subtitle: 'Greater is he that is in you, than he that is in the world.',
    heavyId: 'topicWarfareHeavyNowH',
    heavyTitle: 'The fight feels unseen? Start here.',
    heavyLead: 'One KJV verse for standing&mdash;not for staring at the dark.',
    planHref: 'plans.html?plan=armorofgod',
    planLabel: 'Armor plan',
    tagline: 'Paul names principalities. James says resist. John says greater is He that is in you. Read slowly&mdash;KJV on this page.',
    notTreatment: 'This is Scripture, not treatment. It is also not a dare to hunt the dark. Stand. Resist. Stay with the Word.',
    gentle: '1 John 4:4. Greater is He that is in you than he that is in the world. That is the last word on this page.',
    whenHardest: [
      '<strong>When people are the loudest part of the fight</strong>&mdash;Ephesians 6:12 says we wrestle not against flesh and blood.',
      '<strong>When accusation will not quit</strong>&mdash;James 4:7 is two verbs: submit to God, then resist the devil.',
      '<strong>When fear wants a story about the enemy</strong>&mdash;1 John 4:4 puts the greater One in you, not in the scare.',
    ],
    verses: [
      {
        ref: 'Ephesians 6:11',
        sit: 'Paul tells believers to put on the whole armour of God, that they may be able to stand against the wiles of the devil.',
        mean: 'Put on the whole armour of God, that you may be able to stand against the wiles of the devil.',
        note: 'The call is to stand in God’s armour—not to invent your own.',
      },
      {
        ref: 'Ephesians 6:12',
        sit: 'Paul names the real wrestle: not against flesh and blood, but against principalities, powers, the rulers of the darkness of this world, and spiritual wickedness in high places.',
        mean: 'We wrestle not against flesh and blood, but against principalities, powers, rulers of the darkness of this world, and spiritual wickedness in high places.',
        note: 'Flesh and blood are not the final enemy—even when a person is in the room.',
      },
      {
        ref: 'James 4:7',
        sit: 'James tells scattered believers: submit yourselves therefore to God. Resist the devil, and he will flee from you.',
        mean: 'Submit yourselves to God. Resist the devil, and he will flee from you.',
        note: 'Submit first. Resist second. Flee is promised after both.',
      },
      {
        ref: '1 Peter 5:8',
        sit: 'Peter warns believers to be sober and vigilant, because their adversary the devil, as a roaring lion, walks about seeking whom he may devour.',
        mean: 'Be sober, be vigilant; your adversary the devil, as a roaring lion, walks about seeking whom he may devour.',
        note: 'Watchfulness is named. Panic is not the same thing as vigilance.',
      },
      {
        ref: '2 Corinthians 10:4',
        sit: 'Paul says the weapons of our warfare are not carnal, but mighty through God to the pulling down of strong holds.',
        mean: 'The weapons of our warfare are not carnal, but mighty through God to the pulling down of strong holds.',
        note: 'The weapons are God’s, and they are for pulling down strong holds—not for fleshly heat.',
      },
      {
        ref: '1 John 4:4',
        sit: 'John tells beloved children they have overcome false spirits, because greater is He that is in you than he that is in the world.',
        mean: 'You are of God, little children, and have overcome them: greater is He that is in you than he that is in the world.',
        note: 'The greater One is already in you. That is the ground of overcoming.',
      },
    ],
    faq: [
      {
        q: 'What does the Bible say about spiritual warfare?',
        a: "Ephesians 6:11 says 'Put on the whole armour of God, that ye may be able to stand against the wiles of the devil.' James 4:7 says 'Submit yourselves therefore to God. Resist the devil, and he will flee from you.' 1 John 4:4 says greater is He that is in you than he that is in the world. (KJV)",
      },
      {
        q: 'Is this page a treatment for fear or mental illness?',
        a: 'No. This is Scripture, not treatment. If your mind or body needs care, keep that care. These verses teach standing in God’s armour, not hunting the dark.',
      },
    ],
    related: [
      { href: 'topic-fear.html', label: 'Fear' },
      { href: 'topic-addiction.html', label: 'Addiction' },
      { href: 'topic-strength.html', label: 'Strength' },
      { href: '/identity-in-christ.html', label: 'Identity in Christ' },
      { href: '/red-letters.html', label: 'Jesus said' },
      ...sharedRelatedTail,
    ],
  },
  {
    file: 'topic-depression.html',
    title: 'KJV Bible Verses for Depression &amp; a Downcast Soul | Today\'s Daily Battle',
    headline: 'KJV Bible Verses for Depression and a Downcast Soul',
    crumb: 'Depression',
    h1: 'Depression',
    description: 'King James Scripture when the soul is cast down and the inner story is heavy. This is Scripture, not treatment.',
    ogTitle: 'KJV Bible Verses for a Downcast Soul | Today\'s Daily Battle',
    ogDescription: 'KJV verses when the soul is cast down. Scripture beside you, not a treatment plan.',
    keywords: 'bible verses for depression, KJV downcast soul, Psalm 42:11, Psalm 34:18, Matthew 11:28, Isaiah 61:3',
    subtitle: 'Why art thou cast down, O my soul? hope thou in God.',
    heavyId: 'topicDepressionHeavyNowH',
    heavyTitle: 'The inner story is heavy? Start here.',
    heavyLead: 'One KJV verse for a downcast soul&mdash;no demand to feel better first.',
    planHref: 'plans.html?plan=heavyhope',
    planLabel: '7-day plan',
    tagline: 'The psalms let a soul talk to itself. Jesus invites the heavy laden. Beauty for ashes is promised to them that mourn&mdash;KJV on this page.',
    notTreatment: 'This is Scripture, not treatment. If your mind needs a doctor, that care is not unbelief. These verses sit with a downcast soul.',
    gentle: 'Psalm 42:11. Why art thou cast down, O my soul? Hope thou in God. The question is allowed. So is the hope spoken back.',
    whenHardest: [
      '<strong>When you cannot name why it is heavy</strong>&mdash;Psalm 42:11 lets the soul ask, then tells it to hope in God.',
      '<strong>When getting out of bed is the whole battle</strong>&mdash;Matthew 11:28 is spoken to the heavy laden, not the already-rested.',
      '<strong>When praise feels impossible</strong>&mdash;Isaiah 61:3 gives a garment of praise for the spirit of heaviness; it is given, not demanded as a mood.',
    ],
    verses: [
      {
        ref: 'Psalm 42:11',
        sit: 'The sons of Korah ask a downcast soul why it is disquieted within, then tell it to hope in God, who is the health of their countenance and their God.',
        mean: 'Why are you cast down, O my soul? Why are you disquieted within me? Hope in God: I shall yet praise Him, who is the health of my countenance, and my God.',
        note: 'A downcast soul is allowed to speak. Hope is spoken back to it.',
      },
      {
        ref: 'Psalm 34:18',
        sit: 'David, after escaping Abimelech, teaches that the LORD is nigh unto them that are of a broken heart, and saves such as be of a contrite spirit.',
        mean: 'The LORD is near the brokenhearted, and saves those of a contrite spirit.',
        note: 'Near is the first word—not “cheer up.”',
      },
      {
        ref: 'Psalm 40:1',
        sit: 'David waited patiently for the LORD; the LORD inclined unto him and heard his cry.',
        mean: 'I waited patiently for the LORD; and He inclined unto me, and heard my cry.',
        bbe: 'When I was waiting quietly for the Lord, his heart was turned to me, and he gave ear to my cry.',
        note: 'Waiting is named. So is being heard. The pit comes in the next verse; this verse is the cry and the ear.',
      },
      {
        ref: 'Matthew 11:28',
        sit: 'Jesus invites all who labour and are heavy laden to come unto Him, and He will give them rest.',
        mean: 'Come to Me, all you who labour and are heavy laden, and I will give you rest.',
        note: 'Heavy laden is the only qualification.',
      },
      {
        ref: 'Isaiah 61:3',
        sit: 'The anointed is sent to appoint unto them that mourn in Zion beauty for ashes, the oil of joy for mourning, and the garment of praise for the spirit of heaviness.',
        mean: 'To give them that mourn beauty for ashes, the oil of joy for mourning, the garment of praise for the spirit of heaviness, that they might be called trees of righteousness, the planting of the LORD.',
        note: 'The spirit of heaviness is named. The garment of praise is given to mourners, not demanded as a mood.',
      },
      {
        ref: '2 Corinthians 1:3-4',
        sit: 'Paul blesses the Father of mercies, the God of all comfort, who comforts us in all our tribulation so we may comfort them which are in any trouble with the same comfort.',
        mean: 'Blessed be the Father of mercies, the God of all comfort, who comforts us in all our tribulation so we can comfort others with that same comfort.',
        note: 'All tribulation—including the kind no one else can see.',
      },
    ],
    faq: [
      {
        q: 'What does the Bible say when the soul is cast down?',
        a: "Psalm 42:11 says 'Why art thou cast down, O my soul? and why art thou disquieted within me? hope thou in God.' Psalm 34:18 says the LORD is nigh unto them that are of a broken heart. (KJV) This page is Scripture, not treatment.",
      },
      {
        q: 'Does reading these verses replace care for depression?',
        a: 'No. This is Scripture, not treatment. If your mind needs a doctor, that care is not unbelief. These verses sit with a downcast soul.',
      },
    ],
    related: [
      { href: 'topic-anxiety.html', label: 'Anxiety' },
      { href: 'topic-hope.html', label: 'Hope' },
      { href: 'topic-loneliness.html', label: 'Loneliness' },
      { href: 'topic-grief.html', label: 'Grief' },
      { href: 'topic-pain.html', label: 'Pain' },
      { href: 'topic-worthless.html', label: 'Worth' },
      ...sharedRelatedTail,
    ],
  },
];

for (const page of pages) {
  const html = buildPage(page);
  const out = path.join(root, page.file);
  fs.writeFileSync(out, html);
  console.log('wrote', page.file, html.length);
}
