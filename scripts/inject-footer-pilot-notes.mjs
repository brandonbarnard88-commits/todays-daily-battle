/**
 * One-time / maintenance: insert a calm context line after the language switcher on pilot pages.
 * Run from repo root: node scripts/inject-footer-pilot-notes.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');

const MARKER = 'class="site-footer-pilot-note"';

const NOTES = [
  {
    match: (rel) => rel.startsWith('fr/'),
    html:
      '  <p class="site-footer-pilot-note" lang="fr">Page en français. Outils du site en anglais (Bible <abbr title="King James Version">KJV</abbr> à l’écran, sauf texte cité sur cette page).</p>\n\n',
  },
  {
    match: (rel) => rel.startsWith('zh/'),
    html:
      '  <p class="site-footer-pilot-note" lang="zh-CN">中文页面。站内工具多为英文；圣经文本在工具中为 <abbr title="King James Version">KJV</abbr>（本页引用的和合本除外）。</p>\n\n',
  },
  {
    match: (rel) => rel.startsWith('ar/'),
    html:
      '  <p class="site-footer-pilot-note" lang="ar" dir="rtl">صفحة بالعربية. أدوات الموقع غالبًا بالإنجليزية؛ نص الكتاب في الأدوات عادة <abbr title="King James Version" lang="en">KJV</abbr> (ما عدا ما ذُكر هنا من فان دايك).</p>\n\n',
  },
  {
    match: (rel) => rel.startsWith('hi/'),
    html:
      '  <p class="site-footer-pilot-note" lang="hi">हिन्दी पृष्ठ। साइट के ज़्यादातर औज़ार अंग्रेज़ी में हैं; बाइबल टूल में आमतौर पर <abbr title="King James Version" lang="en">KJV</abbr> दिखता है (इस पृष्ठ पर उद्धृत १८५१ हिंदी वचन को छोड़कर)।</p>\n\n',
  },
  {
    match: (rel) => rel.startsWith('ru/'),
    html:
      '  <p class="site-footer-pilot-note" lang="ru">Страница на русском. Инструменты сайта чаще на английском; в Библии-инструменте обычно <abbr title="King James Version" lang="en">KJV</abbr> (кроме цитируемого здесь синодального текста).</p>\n\n',
  },
  {
    match: (rel) => rel.startsWith('sv/'),
    html:
      '  <p class="site-footer-pilot-note" lang="sv">Sida på svenska. Webbplatsens verktyg är oftast på engelska; bibeltext i verktyget är vanligtvis <abbr title="King James Version" lang="en">KJV</abbr> (utom det citerade 1917-texten här).</p>\n\n',
  },
  {
    match: (rel) => rel.startsWith('pt/'),
    html:
      '  <p class="site-footer-pilot-note" lang="pt">Página em português. As ferramentas do site costumam estar em inglês; o texto bíblico nas ferramentas é em geral <abbr title="King James Version" lang="en">KJV</abbr> (exceto o trecho Almeida citado nesta página).</p>\n\n',
  },
  {
    match: (rel) => rel.startsWith('bn/'),
    html:
      '  <p class="site-footer-pilot-note" lang="bn">বাংলা পৃষ্ঠা। সাইটের বেশিরভাগ টুল ইংরেজিতে; বাইবেল টুলে সাধারণত <abbr title="King James Version" lang="en">KJV</abbr> (এ পৃষ্ঠায় উদ্ধৃত কলকাতা পাঠ বাদে)।</p>\n\n',
  },
  {
    match: (rel) => rel.startsWith('sw/'),
    html:
      '  <p class="site-footer-pilot-note" lang="sw">Ukurasa wa Kiswahili. Zana za tovuti mara nyingi kwa Kiingereza; maandishi ya Biblia katika zana kwa kawaida ni <abbr title="King James Version" lang="en">KJV</abbr> (isipokuwa aya zilizotajwa hapa).</p>\n\n',
  },
  {
    match: (rel) => ['ansiedad.html', 'fuerza.html', 'paz.html'].includes(rel),
    html:
      '  <p class="site-footer-pilot-note" lang="es">Página en español. La mayoría del sitio y las herramientas siguen en inglés; en pantalla suele verse la Biblia en <abbr title="King James Version">KJV</abbr>.</p>\n\n',
  },
  {
    match: (rel) => rel === 'id/kecemasan.html',
    html:
      '  <p class="site-footer-pilot-note" lang="id">Halaman Bahasa Indonesia. Sebagian besar situs dan alat tetap berbahasa Inggris; teks Alkitab di alat biasanya <abbr title="King James Version">KJV</abbr>.</p>\n\n',
  },
  {
    match: (rel) => rel === 'tl/kabalisahan.html',
    html:
      '  <p class="site-footer-pilot-note" lang="tl">Pahina sa Tagalog. Ang karamihan ng site at mga tool ay English pa rin; ang Bibliya sa mga tool ay karaniwang <abbr title="King James Version">KJV</abbr>.</p>\n\n',
  },
];

const NEEDLE = '</nav>\n\n  <nav class="site-footer-essentials"';

function main() {
  const targets = [
    'ansiedad.html',
    'fuerza.html',
    'paz.html',
    'id/kecemasan.html',
    'tl/kabalisahan.html',
    ...fs.readdirSync(path.join(root, 'fr')).map((f) => 'fr/' + f),
    ...fs.readdirSync(path.join(root, 'zh')).map((f) => 'zh/' + f),
    ...(fs.existsSync(path.join(root, 'ar'))
      ? fs.readdirSync(path.join(root, 'ar')).map((f) => 'ar/' + f)
      : []),
    ...(fs.existsSync(path.join(root, 'hi'))
      ? fs.readdirSync(path.join(root, 'hi')).map((f) => 'hi/' + f)
      : []),
    ...(fs.existsSync(path.join(root, 'ru'))
      ? fs.readdirSync(path.join(root, 'ru')).map((f) => 'ru/' + f)
      : []),
    ...(fs.existsSync(path.join(root, 'sv'))
      ? fs.readdirSync(path.join(root, 'sv')).map((f) => 'sv/' + f)
      : []),
    ...(fs.existsSync(path.join(root, 'pt'))
      ? fs.readdirSync(path.join(root, 'pt')).map((f) => 'pt/' + f)
      : []),
    ...(fs.existsSync(path.join(root, 'bn'))
      ? fs.readdirSync(path.join(root, 'bn')).map((f) => 'bn/' + f)
      : []),
    ...(fs.existsSync(path.join(root, 'sw'))
      ? fs.readdirSync(path.join(root, 'sw')).map((f) => 'sw/' + f)
      : []),
  ].filter((rel) => rel.endsWith('.html'));

  let n = 0;
  for (const rel of targets) {
    const full = path.join(root, rel);
    if (!fs.existsSync(full)) continue;
    let html = fs.readFileSync(full, 'utf8');
    if (html.includes(MARKER)) continue;
    const rule = NOTES.find((r) => r.match(rel));
    if (!rule) continue;
    if (!html.includes(NEEDLE)) {
      console.warn('skip (needle missing):', rel);
      continue;
    }
    html = html.replace(NEEDLE, '</nav>\n\n' + rule.html + '  <nav class="site-footer-essentials"');
    fs.writeFileSync(full, html, 'utf8');
    n++;
    console.log('pilot note:', rel);
  }
  console.log('inject-footer-pilot-notes: updated', n, 'files');
}

main();
