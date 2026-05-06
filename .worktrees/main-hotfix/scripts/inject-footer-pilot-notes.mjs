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
      '  <p class="site-footer-pilot-note" lang="fr">Page pilote en français. Quand un outil s’ouvre en anglais, l’entrée reste lisible ; le texte biblique à l’écran est en général <abbr title="King James Version" lang="en">KJV</abbr>. Tu peux t’arrêter ici sans pression aujourd’hui.</p>\n\n',
  },
  {
    match: (rel) => rel.startsWith('zh/'),
    html:
      '  <p class="site-footer-pilot-note" lang="zh-CN">中文页面。当工具以英文打开时，入口仍然清楚；工具中的圣经文本一般为 <abbr title="King James Version" lang="en">KJV</abbr>（本页引用的和合本除外）。今天可以只停在这一页，不必着急。</p>\n\n',
  },
  {
    match: (rel) => rel.startsWith('ar/'),
    html:
      '  <p class="site-footer-pilot-note" lang="ar" dir="rtl">صفحة بالعربية. عندما تفتح الأداة بالإنجليزية يبقى الممر واضحًا؛ نص الكتاب في الأدوات عادة <abbr title="King James Version" lang="en">KJV</abbr> (ما عدا ما ذُكر هنا من فان دايك). يمكنك التوقف هنا اليوم بلا عجلة.</p>\n\n',
  },
  {
    match: (rel) => rel.startsWith('hi/'),
    html:
      '  <p class="site-footer-pilot-note" lang="hi">हिन्दी पृष्ठ। जब औज़ार अंग्रेज़ी में खुलते हैं, रास्ता फिर भी साफ़ रहता है; बाइबल टूल में आमतौर पर <abbr title="King James Version" lang="en">KJV</abbr> दिखता है (इस पृष्ठ पर उद्धृत १८५१ हिंदी वचन को छोड़कर)। आज सिर्फ़ इसी पृष्ठ पर ठहरना भी ठीक है।</p>\n\n',
  },
  {
    match: (rel) => rel.startsWith('ru/'),
    html:
      '  <p class="site-footer-pilot-note" lang="ru">Страница на русском. Когда инструмент открывается на английском, путь остаётся ясным; в Библии-инструменте обычно <abbr title="King James Version" lang="en">KJV</abbr> (кроме цитируемого здесь синодального текста). Можно остановиться здесь — без спешки сегодня.</p>\n\n',
  },
  {
    match: (rel) => rel.startsWith('sv/'),
    html:
      '  <p class="site-footer-pilot-note" lang="sv">Sida på svenska. När ett verktyg öppnas på engelska är vägen fortfarande tydlig; bibeltext i verktyget är vanligtvis <abbr title="King James Version" lang="en">KJV</abbr> (utom den citerade 1917-texten här). Du får gärna stanna här i dag utan stress.</p>\n\n',
  },
  {
    match: (rel) => rel.startsWith('pt/'),
    html:
      '  <p class="site-footer-pilot-note" lang="pt">Página piloto em português (Almeida citado onde indicado). Quando uma ferramenta abre em inglês, o caminho continua claro; o texto bíblico nas ferramentas costuma ser <abbr title="King James Version" lang="en">KJV</abbr>. Sem pressa se hoje você só ficar nesta página.</p>\n\n',
  },
  {
    match: (rel) => rel.startsWith('bn/'),
    html:
      '  <p class="site-footer-pilot-note" lang="bn">বাংলা পৃষ্ঠা। টুল ইংরেজিতে খুললেও পথ স্পষ্ট থাকে; বাইবেল টুলে সাধারণত <abbr title="King James Version" lang="en">KJV</abbr> (এ পৃষ্ঠায় উদ্ধৃত কলকাতা পাঠ বাদে)। আজ শুধু এখানেই থেমে যাওয়া ঠিক আছে।</p>\n\n',
  },
  {
    match: (rel) => rel.startsWith('sw/'),
    html:
      '  <p class="site-footer-pilot-note" lang="sw">Ukurasa wa Kiswahili. Zana zinapofunguliwa kwa Kiingereza njia bado wazi; maandishi ya Biblia katika zana kwa kawaida ni <abbr title="King James Version" lang="en">KJV</abbr> (isipokuwa aya zilizotajwa hapa). Unaweza kusimama hapa leo bila haraka.</p>\n\n',
  },
  {
    match: (rel) => ['ansiedad.html', 'fuerza.html', 'paz.html'].includes(rel),
    html:
      '  <p class="site-footer-pilot-note" lang="es">Página en español. Cuando una herramienta abre en inglés, la puerta sigue siendo clara; la Escritura en pantalla suele ser <abbr title="King James Version" lang="en">KJV</abbr>. Sin prisa si hoy solo te quedas aquí.</p>\n\n',
  },
  {
    match: (rel) => rel === 'id/kecemasan.html',
    html:
      '  <p class="site-footer-pilot-note" lang="id">Halaman Bahasa Indonesia. Ketika alat dibuka dalam bahasa Inggris, jalan tetap jelas; teks Alkitab di alat biasanya <abbr title="King James Version" lang="en">KJV</abbr>. Hari ini boleh berhenti di halaman ini saja.</p>\n\n',
  },
  {
    match: (rel) => rel === 'tl/kabalisahan.html',
    html:
      '  <p class="site-footer-pilot-note" lang="tl">Pahina sa Tagalog. Kapag ang tool ay nagbubukas sa English, malinaw pa rin ang daan; ang Bibliya sa mga tool ay karaniwang <abbr title="King James Version" lang="en">KJV</abbr>. Puwede kang tumigil dito ngayon nang walang pressure.</p>\n\n',
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
