#!/usr/bin/env node
/**
 * One-shot maintenance: replace English mega-footers on PT/FR/ES pilots & shells
 * with localized hub-style footers; normalize "More languages" in four-locale paths.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');

const FOOTER_RE = /<footer class="site-footer site-footer--canonical"[\s\S]*?<\/footer>/;

const ES_NOTE_TOPICAL = `  <p class="site-footer-pilot-note" lang="es">Página en español. Muchas herramientas del sitio abren en inglés; la Biblia en pantalla suele ser <abbr title="King James Version" lang="en">KJV</abbr>.</p>`;

const ES_NOTE_SHELL = `  <p class="site-footer-pilot-note" lang="es">Portada en español. La herramienta completa abre en inglés; la Biblia en pantalla suele ser <abbr title="King James Version" lang="en">KJV</abbr>.</p>`;

function esFooter(pilotNote) {
  return `<footer class="site-footer site-footer--canonical" role="contentinfo" aria-label="Pie del sitio">
  <nav class="tdb-lang-switcher tdb-lang-switcher--footer tdb-lang-switcher--labeled" aria-label="Elegir idioma" data-tdb-lang-switcher lang="es">
    <span class="tdb-lang-switcher-eyebrow" aria-hidden="true">Idioma</span>
    <span class="tdb-lang-switcher-inner">
      <a class="tdb-lang-opt" href="/" hreflang="en" data-tdb-pick="en">English</a>
      <span class="tdb-lang-sep" aria-hidden="true">·</span>
      <a class="tdb-lang-opt" href="/es/" hreflang="es" data-tdb-pick="es">Español</a>
      <span class="tdb-lang-sep" aria-hidden="true">·</span>
      <a class="tdb-lang-opt" href="/fr/" hreflang="fr" data-tdb-pick="fr">Français</a>
      <span class="tdb-lang-sep" aria-hidden="true">·</span>
      <a class="tdb-lang-opt" href="/pt/" hreflang="pt" data-tdb-pick="pt">Português</a>
      <span class="tdb-lang-sep" aria-hidden="true">·</span>
      <a class="tdb-lang-opt tdb-lang-more" href="/explore.html#languages">Más idiomas</a>
    </span>
  </nav>

${pilotNote}

  <nav class="site-footer-essentials" aria-label="Páginas principales">
    <a href="/es/">Inicio ES</a><span class="site-footer-ess-sep" aria-hidden="true">·</span>
    <a href="/">Inicio en inglés</a><span class="site-footer-ess-sep" aria-hidden="true">·</span>
    <a href="/explore.html">Explore</a><span class="site-footer-ess-sep" aria-hidden="true">·</span>
    <a href="/message.html" hreflang="en">Muro (EN)</a><span class="site-footer-ess-sep" aria-hidden="true">·</span>
    <a href="/about.html" hreflang="en">Acerca (EN)</a>
  </nav>

  <p class="site-footer-share-wrap">
    <button type="button" id="share-page" class="share-page-btn" aria-label="Compartir esta página">Compartir esta página</button>
  </p>

  <nav class="bottom-nav" role="navigation" aria-label="Planes y temas en español">
    <a href="/plans.html" hreflang="en">Planes (EN)</a>
    <a href="/explore.html">Explore</a>
    <a href="/kids/" hreflang="en">Kids Battle (EN)</a>
    <span class="bottom-nav-es-inline" role="group" aria-label="Temas en español (Reina-Valera 1960, dominio público)">
      <a href="/ansiedad.html" hreflang="es" lang="es">Ansiedad</a>
      <a href="/fuerza.html" hreflang="es" lang="es">Fuerza</a>
      <a href="/paz.html" hreflang="es" lang="es">Paz</a>
    </span>
  </nav>

  <nav class="site-footer-nav" aria-label="Enlaces del pie">
    <a href="/privacy.html" hreflang="en">Privacidad (EN)</a>
    <a href="/terms.html" hreflang="en">Términos (EN)</a>
    <a href="/faq.html" hreflang="en">FAQ (EN)</a>
    <a href="/bible-tool.html" hreflang="en">Biblia (EN)</a>
    <button type="button" id="footer-open-settings" class="footer-appearance-link">Apariencia</button>
    <a href="https://buymeacoffee.com/todaysdailybattle" target="_blank" rel="noopener" aria-label="Apoyar el sitio — Buy me a coffee">Apoyar</a>
  </nav>

  <p class="footer-humility">Luchamos. Él vence.</p>
  <p class="site-footer-story">Hecho a mano, para días reales. <a href="/about.html" hreflang="en">About</a> · <a href="/story.html" hreflang="en">Story</a> (EN).</p>

  <p class="site-footer-copy site-footer-legal-line">© 2026 Today&rsquo;s Daily Battle. Escritura en las herramientas en inglés: <abbr title="King James Version">KJV</abbr>, salvo nota en la página.</p>
  <p class="privacy-line site-footer-trust-hook">Sin anuncios. Sin vender datos. Las oraciones en el muro: detalles en la página en inglés.</p>

  <p class="site-footer-updated">Última actualización: <span id="footer-date">TDB_BUILD_DATE</span></p>
  <script defer src="/language-switcher.js"></script>
</footer>`;
}

const FR_NOTE_PILOT = `  <p class="site-footer-pilot-note" lang="fr">Page pilote en français. Outils du site en anglais ; Bible à l’écran en <abbr title="King James Version" lang="en">KJV</abbr>.</p>`;

const FR_NOTE_SHELL = `  <p class="site-footer-pilot-note" lang="fr">Page d’accueil de l’outil en français. L’écran complet s’ouvre en anglais ; Bible à l’écran en <abbr title="King James Version" lang="en">KJV</abbr>.</p>`;

function frFooter(pilotNote = FR_NOTE_PILOT) {
  return `<footer class="site-footer site-footer--canonical" role="contentinfo" aria-label="Pied de page">
  <nav class="tdb-lang-switcher tdb-lang-switcher--footer tdb-lang-switcher--labeled" aria-label="Choisir la langue" data-tdb-lang-switcher lang="fr">
    <span class="tdb-lang-switcher-eyebrow" aria-hidden="true">Langue</span>
        <span class="tdb-lang-switcher-inner">
      <a class="tdb-lang-opt" href="/" hreflang="en" data-tdb-pick="en">English</a>
      <span class="tdb-lang-sep" aria-hidden="true">·</span>
      <a class="tdb-lang-opt" href="/es/" hreflang="es" data-tdb-pick="es">Español</a>
      <span class="tdb-lang-sep" aria-hidden="true">·</span>
      <a class="tdb-lang-opt" href="/fr/" hreflang="fr" data-tdb-pick="fr">Français</a>
      <span class="tdb-lang-sep" aria-hidden="true">·</span>
      <a class="tdb-lang-opt" href="/pt/" hreflang="pt" data-tdb-pick="pt">Português</a>
      <span class="tdb-lang-sep" aria-hidden="true">·</span>
      <a class="tdb-lang-opt tdb-lang-more" href="/explore.html#languages">Autres langues</a>
    </span>
  </nav>

${pilotNote}

  <nav class="site-footer-essentials" aria-label="Liens principaux">
    <a href="/fr/">Accueil FR</a><span class="site-footer-ess-sep" aria-hidden="true">·</span>
    <a href="/">English home</a><span class="site-footer-ess-sep" aria-hidden="true">·</span>
    <a href="/explore.html">Explore</a><span class="site-footer-ess-sep" aria-hidden="true">·</span>
    <a href="/message.html" hreflang="en">Mur (EN)</a><span class="site-footer-ess-sep" aria-hidden="true">·</span>
    <a href="/about.html" hreflang="en">À propos (EN)</a>
  </nav>

  <p class="site-footer-share-wrap">
    <button type="button" id="share-page" class="share-page-btn" aria-label="Partager cette page">Partager cette page</button>
  </p>

  <nav class="bottom-nav" role="navigation" aria-label="Plans et sujets en français">
    <a href="/plans.html" hreflang="en">Plans (EN)</a>
    <a href="/explore.html">Explore</a>
    <a href="/kids/" hreflang="en">Kids Battle (EN)</a>
    <span class="bottom-nav-es-inline" role="group" aria-label="Sujets en français (Louis Segond)">
      <a href="/fr/anxiete.html" hreflang="fr" lang="fr">Anxiété</a>
      <a href="/fr/force.html" hreflang="fr" lang="fr">Force</a>
      <a href="/fr/paix.html" hreflang="fr" lang="fr">Paix</a>
    </span>
  </nav>

  <nav class="site-footer-nav" aria-label="Liens du pied de page">
    <a href="/privacy.html" hreflang="en">Confidentialité (EN)</a>
    <a href="/terms.html" hreflang="en">Conditions (EN)</a>
    <a href="/faq.html" hreflang="en">FAQ (EN)</a>
    <a href="/bible-tool.html" hreflang="en">Bible (EN)</a>
    <button type="button" id="footer-open-settings" class="footer-appearance-link">Apparence</button>
    <a href="https://buymeacoffee.com/todaysdailybattle" target="_blank" rel="noopener" aria-label="Soutenir le site — Buy me a coffee">Soutenir</a>
  </nav>

  <p class="footer-humility">Nous combattons. Il vainc.</p>
  <p class="site-footer-story">Fait à la main, pour des jours réels. <a href="/about.html" hreflang="en">About</a> · <a href="/story.html" hreflang="en">Story</a> (EN).</p>

  <p class="site-footer-copy site-footer-legal-line">© 2026 Today&rsquo;s Daily Battle. Écriture dans les outils en anglais : <abbr title="King James Version">KJV</abbr>, sauf mention sur la page.</p>
  <p class="privacy-line site-footer-trust-hook">Pas de pubs traqueuses. Pas de revente de données. Mur de prière : voir la page en anglais pour le détail.</p>

  <p class="site-footer-updated">Dernière mise à jour : <span id="footer-date">TDB_BUILD_DATE</span></p>
  <script defer src="/language-switcher.js"></script>
</footer>`;
}

const PT_NOTE_PILOT = `  <p class="site-footer-pilot-note" lang="pt">Página piloto em português (Almeida citado onde indicado). Ferramentas do site em inglês; texto bíblico nas ferramentas em geral <abbr title="King James Version" lang="en">KJV</abbr>.</p>`;

const PT_NOTE_SHELL = `  <p class="site-footer-pilot-note" lang="pt">Capa da ferramenta em português. A tela completa abre em inglês; texto bíblico nas ferramentas em geral <abbr title="King James Version" lang="en">KJV</abbr>.</p>`;

function ptFooter(pilotNote = PT_NOTE_PILOT) {
  return `<footer class="site-footer site-footer--canonical" role="contentinfo" aria-label="Rodapé do site">
  <nav class="tdb-lang-switcher tdb-lang-switcher--footer tdb-lang-switcher--labeled" aria-label="Escolher idioma" data-tdb-lang-switcher lang="pt">
    <span class="tdb-lang-switcher-eyebrow" aria-hidden="true">Idioma</span>
        <span class="tdb-lang-switcher-inner">
      <a class="tdb-lang-opt" href="/" hreflang="en" data-tdb-pick="en">English</a>
      <span class="tdb-lang-sep" aria-hidden="true">·</span>
      <a class="tdb-lang-opt" href="/es/" hreflang="es" data-tdb-pick="es">Español</a>
      <span class="tdb-lang-sep" aria-hidden="true">·</span>
      <a class="tdb-lang-opt" href="/fr/" hreflang="fr" data-tdb-pick="fr">Français</a>
      <span class="tdb-lang-sep" aria-hidden="true">·</span>
      <a class="tdb-lang-opt" href="/pt/" hreflang="pt" data-tdb-pick="pt">Português</a>
      <span class="tdb-lang-sep" aria-hidden="true">·</span>
      <a class="tdb-lang-opt tdb-lang-more" href="/explore.html#languages">Mais idiomas</a>
    </span>
  </nav>

${pilotNote}

  <nav class="site-footer-essentials" aria-label="Páginas principais">
    <a href="/pt/">Início PT</a><span class="site-footer-ess-sep" aria-hidden="true">·</span>
    <a href="/">English home</a><span class="site-footer-ess-sep" aria-hidden="true">·</span>
    <a href="/explore.html">Explore</a><span class="site-footer-ess-sep" aria-hidden="true">·</span>
    <a href="/message.html" hreflang="en">Mural (EN)</a><span class="site-footer-ess-sep" aria-hidden="true">·</span>
    <a href="/about.html" hreflang="en">Sobre (EN)</a>
  </nav>

  <p class="site-footer-share-wrap">
    <button type="button" id="share-page" class="share-page-btn" aria-label="Compartilhar esta página">Compartilhar esta página</button>
  </p>

  <nav class="bottom-nav" role="navigation" aria-label="Planos e tópicos em português">
    <a href="/plans.html" hreflang="en">Planos (EN)</a>
    <a href="/explore.html">Explore</a>
    <a href="/kids/" hreflang="en">Kids Battle (EN)</a>
    <span class="bottom-nav-es-inline" role="group" aria-label="Tópicos em português (Almeida, domínio público)">
      <a href="/pt/ansiedade.html" hreflang="pt" lang="pt">Ansiedade</a>
      <a href="/pt/forca.html" hreflang="pt" lang="pt">Força</a>
      <a href="/pt/paz.html" hreflang="pt" lang="pt">Paz</a>
    </span>
  </nav>

  <nav class="site-footer-nav" aria-label="Links do rodapé">
    <a href="/privacy.html" hreflang="en">Privacidade (EN)</a>
    <a href="/terms.html" hreflang="en">Termos (EN)</a>
    <a href="/faq.html" hreflang="en">FAQ (EN)</a>
    <a href="/bible-tool.html" hreflang="en">Bíblia (EN)</a>
    <button type="button" id="footer-open-settings" class="footer-appearance-link">Aparência</button>
    <a href="https://buymeacoffee.com/todaysdailybattle" target="_blank" rel="noopener" aria-label="Apoiar o site — Buy me a coffee">Apoiar</a>
  </nav>

  <p class="footer-humility">Nós lutamos. Ele vence.</p>
  <p class="site-footer-story">Feito à mão, para dias reais. <a href="/about.html" hreflang="en">About</a> · <a href="/story.html" hreflang="en">Story</a>.</p>

  <p class="site-footer-copy site-footer-legal-line">© 2026 Today&rsquo;s Daily Battle. Escritura nas ferramentas em inglês: <abbr title="King James Version">KJV</abbr>, salvo nota na página.</p>
  <p class="privacy-line site-footer-trust-hook">Sem anúncios. Sem venda de dados. Orações no mural: veja a página em inglês para detalhes.</p>

  <p class="site-footer-updated">Última atualização: <span id="footer-date">TDB_BUILD_DATE</span></p>
  <script defer src="/language-switcher.js"></script>
</footer>`;
}

const ES_SHELL = new Set(['planes.html', 'muro.html', 'lector.html', 'ninos.html']);

const ES_FOOTER_FILES = [
  'ansiedad.html',
  'fuerza.html',
  'paz.html',
  'esperanza.html',
  'miedo.html',
  'soledad.html',
  'culpa.html',
  'agobio.html',
  'ira.html',
  'duelo.html',
  'perdon.html',
  'planes.html',
  'muro.html',
  'lector.html',
  'ninos.html',
];

const FR_FOOTER_FILES = [
  'fr/anxiete.html',
  'fr/espoir.html',
  'fr/solitude.html',
  'fr/culpabilite.html',
  'fr/deborde.html',
];

const PT_FOOTER_FILES = ['pt/ansiedade.html', 'pt/esperanca.html'];

/** Tool cover pages: shorter footer note (aligned with ES shells). */
const FR_SHELL_PATHS = new Set([
  'fr/plans.html',
  'fr/mural.html',
  'fr/lecteur.html',
  'fr/enfants.html',
]);
const PT_SHELL_PATHS = new Set([
  'pt/planos.html',
  'pt/mural.html',
  'pt/leitor.html',
  'pt/criancas.html',
]);

function frFooterNoteFor(rel) {
  return FR_SHELL_PATHS.has(rel) ? FR_NOTE_SHELL : FR_NOTE_PILOT;
}

function ptFooterNoteFor(rel) {
  return PT_SHELL_PATHS.has(rel) ? PT_NOTE_SHELL : PT_NOTE_PILOT;
}

function patchFile(rel, fn) {
  const full = path.join(root, rel);
  let html = fs.readFileSync(full, 'utf8');
  const next = fn(html);
  if (next !== html) {
    fs.writeFileSync(full, next, 'utf8');
    return true;
  }
  return false;
}

let changed = 0;
for (const rel of ES_FOOTER_FILES) {
  const ok = patchFile(rel, (html) => {
    if (!html.includes('footer-sitemap')) return html;
    const note = ES_SHELL.has(rel) ? ES_NOTE_SHELL : ES_NOTE_TOPICAL;
    return html.replace(FOOTER_RE, esFooter(note));
  });
  if (ok) {
    changed++;
    console.log('footer ES', rel);
  }
}

for (const rel of FR_FOOTER_FILES) {
  const ok = patchFile(rel, (html) => {
    if (!html.includes('footer-sitemap')) return html;
    return html.replace(FOOTER_RE, frFooter(frFooterNoteFor(rel)));
  });
  if (ok) {
    changed++;
    console.log('footer FR', rel);
  }
}

for (const rel of PT_FOOTER_FILES) {
  const ok = patchFile(rel, (html) => {
    if (!html.includes('footer-sitemap')) return html;
    return html.replace(FOOTER_RE, ptFooter(ptFooterNoteFor(rel)));
  });
  if (ok) {
    changed++;
    console.log('footer PT', rel);
  }
}

// Normalize compact switcher label in four-locale trees (skip EN canonical pages).
for (const rel of ES_FOOTER_FILES) {
  patchFile(rel, (html) => html.replace(/>More languages</g, '>Más idiomas<'));
}

for (const rel of fs.readdirSync(path.join(root, 'fr'))) {
  if (!rel.endsWith('.html')) continue;
  const p = `fr/${rel}`;
  patchFile(p, (html) => html.replace(/>More languages</g, '>Autres langues<'));
}

for (const rel of fs.readdirSync(path.join(root, 'pt'))) {
  if (!rel.endsWith('.html')) continue;
  const p = `pt/${rel}`;
  patchFile(p, (html) => html.replace(/>More languages</g, '>Mais idiomas<'));
}

// FR: fix header switcher lang/aria when still EN (all fr/*.html)
const FR_HEADER_BAD =
  /aria-label="Choose language" data-tdb-lang-switcher lang="en"/g;
for (const name of fs.readdirSync(path.join(root, 'fr'))) {
  if (!name.endsWith('.html')) continue;
  const rel = `fr/${name}`;
  patchFile(rel, (html) =>
    html.replace(
      FR_HEADER_BAD,
      'aria-label="Choisir la langue" data-tdb-lang-switcher lang="fr"',
    ),
  );
}

// PT: same (all pt/*.html)
const PT_HEADER_BAD =
  /aria-label="Choose language" data-tdb-lang-switcher lang="en"/g;
for (const name of fs.readdirSync(path.join(root, 'pt'))) {
  if (!name.endsWith('.html')) continue;
  const rel = `pt/${name}`;
  patchFile(rel, (html) =>
    html.replace(
      PT_HEADER_BAD,
      'aria-label="Escolher idioma" data-tdb-lang-switcher lang="pt"',
    ),
  );
}

// FR pilots/shells: upgrade slim canonical footers (no bottom-nav) to full hub footer
let slimFr = 0;
for (const name of fs.readdirSync(path.join(root, 'fr'))) {
  if (!name.endsWith('.html')) continue;
  const rel = `fr/${name}`;
  const ok = patchFile(rel, (html) => {
    if (!html.includes('site-footer site-footer--canonical')) return html;
    if (html.includes('class="bottom-nav"')) return html;
    if (!html.match(FOOTER_RE)) return html;
    return html.replace(FOOTER_RE, frFooter(frFooterNoteFor(rel)));
  });
  if (ok) {
    slimFr++;
    console.log('footer FR slim→full', rel);
  }
}

// PT: same
let slimPt = 0;
for (const name of fs.readdirSync(path.join(root, 'pt'))) {
  if (!name.endsWith('.html')) continue;
  const rel = `pt/${name}`;
  const ok = patchFile(rel, (html) => {
    if (!html.includes('site-footer site-footer--canonical')) return html;
    if (html.includes('class="bottom-nav"')) return html;
    if (!html.match(FOOTER_RE)) return html;
    return html.replace(FOOTER_RE, ptFooter(ptFooterNoteFor(rel)));
  });
  if (ok) {
    slimPt++;
    console.log('footer PT slim→full', rel);
  }
}

// Sync Kids link label in existing full PT footers (template already correct for new writes)
for (const name of fs.readdirSync(path.join(root, 'pt'))) {
  if (!name.endsWith('.html')) continue;
  patchFile(`pt/${name}`, (html) =>
    html.replace(
      /<a href="\/kids\/">Kids Battle<\/a>/g,
      '<a href="/kids/" hreflang="en">Kids Battle (EN)</a>',
    ),
  );
}

console.log(
  'Done. Mega-footer pass:',
  changed,
  'files (had footer-sitemap). FR slim→full:',
  slimFr,
  'PT slim→full:',
  slimPt,
);
