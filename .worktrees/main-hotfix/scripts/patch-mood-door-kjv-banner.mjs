#!/usr/bin/env node
/**
 * One-shot: insert compact KJV reminder under header language nav on mood-door pilots.
 * Idempotent: skips files that already contain tdb-mood-door-kjv-banner.
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");

const NEEDLE = "        </nav>\n      </div>\n\n      <div class=\"brand\">";

const SNIPPETS = {
  en: '<p class="tdb-mood-door-kjv-banner" lang="en">You&rsquo;re already welcome here&mdash;KJV on this page and in English tools unless this page says otherwise.</p>',
  es: '<p class="tdb-mood-door-kjv-banner" lang="es">Versos en esta página: español. Herramientas en inglés: la Biblia en pantalla suele ser <abbr title="King James Version" lang="en">KJV</abbr>.</p>',
  fr: '<p class="tdb-mood-door-kjv-banner" lang="fr">Versets sur cette page : français. Outils en anglais : Bible à l’écran en <abbr title="King James Version" lang="en">KJV</abbr>.</p>',
  zh: '<p class="tdb-mood-door-kjv-banner" lang="zh-CN">2026 试点：本页经文为中文；英文工具里的圣经正文一般为 <abbr title="King James Version" lang="en">KJV</abbr>，说明保持诚实。</p>',
  ar: '<p class="tdb-mood-door-kjv-banner" lang="ar" dir="rtl">هنا الآيات بالعربية؛ أدوات الموقع الإنجليزية تعرض الكتاب غالبًا <abbr title="King James Version" dir="ltr" lang="en">KJV</abbr>.</p>',
  hi: '<p class="tdb-mood-door-kjv-banner" lang="hi">इस पृष्ठ पर वचन हिंदी में हैं; अंग्रेज़ी औज़ारों में स्क्रीन पर बाइबल आमतौर पर <abbr title="King James Version" lang="en">KJV</abbr>।</p>',
  ru: '<p class="tdb-mood-door-kjv-banner" lang="ru">Стихи на этой странице — на русском; в английских инструментах текст Библии на экране обычно <abbr title="King James Version" lang="en">KJV</abbr>.</p>',
  sv: '<p class="tdb-mood-door-kjv-banner" lang="sv">Vers på denna sida: svenska. Verktyg på engelska: Bibeln på skärmen är oftast <abbr title="King James Version" lang="en">KJV</abbr>.</p>',
  pt: '<p class="tdb-mood-door-kjv-banner" lang="pt">Versos nesta página: português. Ferramentas em inglês: a Bíblia na tela costuma ser <abbr title="King James Version" lang="en">KJV</abbr>.</p>',
  bn: '<p class="tdb-mood-door-kjv-banner" lang="bn">এ পৃষ্ঠার আয়াত বাংলায়; ইংরেজি টুলে পর্দায় বাইবেল সাধারণত <abbr title="King James Version" lang="en">KJV</abbr>।</p>',
  sw: '<p class="tdb-mood-door-kjv-banner" lang="sw">Hapa mistari kwa Kiswahili; kwenye zana za Kiingereza Biblia kwenye skrini ni kawaida <abbr title="King James Version" lang="en">KJV</abbr>.</p>',
  id: '<p class="tdb-mood-door-kjv-banner" lang="id">Ayat di halaman ini dalam bahasa Indonesia; di alat berbahasa Inggris teks Alkitab di layar biasanya <abbr title="King James Version" lang="en">KJV</abbr>.</p>',
  tl: '<p class="tdb-mood-door-kjv-banner" lang="tl">Sa pahinang ito ang talata ay Tagalog; sa English tools ang Bibliya sa screen ay karaniwang <abbr title="King James Version" lang="en">KJV</abbr>.</p>',
};

/** @type {Array<{ rel: string, locale: keyof typeof SNIPPETS }>} */
const FILES = [
  ...[
    "topic-anxiety.html",
    "topic-fear.html",
    "topic-forgiveness.html",
    "topic-grief.html",
    "topic-guilt.html",
    "topic-hope.html",
    "topic-loneliness.html",
    "topic-overwhelmed.html",
    "topic-parenting.html",
    "topic-strength.html",
    "topic-worthless.html",
    "topic-worry.html",
  ].map((rel) => ({ rel, locale: "en" })),
  ...["ansiedad.html", "paz.html", "fuerza.html"].map((rel) => ({ rel, locale: "es" })),
  ...["fr/anxiete.html", "fr/espoir.html", "fr/solitude.html", "fr/culpabilite.html", "fr/deborde.html"].map((rel) => ({
    rel,
    locale: "fr",
  })),
  ...["zh/jiaolv.html", "zh/xiwang.html", "zh/gudu.html", "zh/neijiu.html", "zh/taiduo.html"].map((rel) => ({
    rel,
    locale: "zh",
  })),
  { rel: "ar/qalaq.html", locale: "ar" },
  { rel: "hi/chinta.html", locale: "hi" },
  { rel: "ru/trevoga.html", locale: "ru" },
  { rel: "sv/oro.html", locale: "sv" },
  { rel: "pt/ansiedade.html", locale: "pt" },
  { rel: "bn/chinta.html", locale: "bn" },
  { rel: "sw/wasiwasi.html", locale: "sw" },
  { rel: "id/kecemasan.html", locale: "id" },
  { rel: "tl/kabalisahan.html", locale: "tl" },
];

let patched = 0;
let skipped = 0;
for (const { rel, locale } of FILES) {
  const full = path.join(ROOT, rel);
  if (!fs.existsSync(full)) {
    console.warn("Missing:", rel);
    continue;
  }
  let html = fs.readFileSync(full, "utf8");
  if (html.includes("tdb-mood-door-kjv-banner")) {
    skipped++;
    continue;
  }
  if (!html.includes("tdb-lang-switcher-header-wrap")) {
    console.warn("No header lang wrap:", rel);
    continue;
  }
  if (!html.includes(NEEDLE)) {
    console.warn("Pattern mismatch:", rel);
    continue;
  }
  const p = SNIPPETS[locale];
  const replacement = `        </nav>\n        ${p}\n      </div>\n\n      <div class="brand">`;
  html = html.replace(NEEDLE, replacement);
  if (html.includes(NEEDLE)) {
    console.warn("Multiple matches?, only first replaced:", rel);
  }
  fs.writeFileSync(full, html, "utf8");
  patched++;
}
console.log("Patched:", patched, "Skipped (already had banner):", skipped);
