#!/usr/bin/env node
/**
 * Unify Spanish topical + shell pages: header, sidebar, and "Más temas" grid
 * to match the Portuguese pilot pattern (Inicio ES + tools row + Hub ES sidebar).
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');

const HEADER_TOPICAL_RE =
  /<nav class="header-nav tdb-global-nav" aria-label="Navegación principal">[\s\S]*?<\/nav>/;

const ES_HEADER_TOPICAL = `<nav class="header-nav tdb-global-nav" aria-label="Navegación principal">
        <a href="/es/">Inicio ES</a>
        <a href="/explore.html">Explore <span class="section-note" style="display:inline;font-size:0.85em;">(EN)</span></a>
        <a href="/paz.html">Paz</a>
        <a href="/planes.html">Planes</a>
        <a href="/muro.html">Muro</a>
        <a href="/ninos.html">Niños</a>
        <a href="/lector.html">Lector</a>
      </nav>`;

const ES_HEADER_SHELL = ES_HEADER_TOPICAL;

const SIDEBAR_RE =
  /<aside id="sidebar" class="sidebar">\s*<nav class="side-nav" aria-label="Navegación">[\s\S]*?<\/nav>\s*<\/aside>/;

function sidebarTopical(href, label) {
  return `<aside id="sidebar" class="sidebar">
      <nav class="side-nav" aria-label="Navegación">
        <a href="/es/">Hub ES</a>
        <a href="/verse.html" hreflang="en">Verso del día (EN)</a>
        <a href="${href}" hreflang="en">${label}</a>
        <a href="/" hreflang="en">English home</a>
      </nav>
    </aside>`;
}

const ES_SHELL_SIDEBAR = `<aside id="sidebar" class="sidebar">
      <nav class="side-nav" aria-label="Navegación">
        <a href="/es/">Hub ES</a>
        <a href="/verse.html" hreflang="en">Verso del día (EN)</a>
        <a href="/muro.html" hreflang="es">Muro (portada ES)</a>
        <a href="/message.html" hreflang="en">Muro completo (EN)</a>
        <a href="/bible-tool.html" hreflang="en">Biblia (EN)</a>
        <a href="/" hreflang="en">English home</a>
      </nav>
    </aside>`;

/** Hub order: matches es/index mood cards. */
const MAS_TEMAS_INNER = `          <div class="cta-group" style="flex-wrap:wrap;gap:0.5rem;">
            <a class="btn btn-secondary" href="/es/">Hub ES</a>
            <a class="btn btn-secondary" href="/ansiedad.html">Ansiedad</a>
            <a class="btn btn-secondary" href="/fuerza.html">Fuerza</a>
            <a class="btn btn-secondary" href="/paz.html">Paz</a>
            <a class="btn btn-secondary" href="/esperanza.html">Esperanza</a>
            <a class="btn btn-secondary" href="/miedo.html">Miedo</a>
            <a class="btn btn-secondary" href="/soledad.html">Soledad</a>
            <a class="btn btn-secondary" href="/culpa.html">Culpa</a>
            <a class="btn btn-secondary" href="/agobio.html">Agobio</a>
            <a class="btn btn-secondary" href="/ira.html">Ira</a>
            <a class="btn btn-secondary" href="/duelo.html">Duelo</a>
            <a class="btn btn-secondary" href="/perdon.html">Perdón</a>
          </div>`;

const MAS_TEMAS_SECTION_RE =
  /<section class="glass" lang="es">\s*<h2 class="section-divider">Más temas en español<\/h2>[\s\S]*?<\/section>/g;

/** Legacy block on ansiedad / fuerza / paz — mixed ES/EN links. */
const TEMAS_RELACIONADOS_RE =
  /<section class="glass">\s*<h2 class="section-divider">Temas relacionados<\/h2>[\s\S]*?<\/section>/g;

const MAS_TEMAS_SECTION_REPLACE = `<section class="glass" lang="es">
          <h2 class="section-divider">Más temas en español</h2>
${MAS_TEMAS_INNER}
        </section>`;

const TOPICAL_SIDEBAR = {
  ansiedad: ['/topic-anxiety.html', 'Versión en inglés'],
  esperanza: ['/topic-hope.html', 'Versión en inglés'],
  miedo: ['/topic-fear.html', 'Versión en inglés'],
  fuerza: ['/topic-strength.html', 'Versión en inglés'],
  paz: ['/calm.html', 'Calm (EN)'],
  soledad: ['/topic-loneliness.html', 'Versión en inglés'],
  culpa: ['/topic-guilt.html', 'Versión en inglés'],
  agobio: ['/topic-overwhelmed.html', 'Versión en inglés'],
  ira: ['/explore.html', 'Explore — temas (EN)'],
  duelo: ['/topic-grief.html', 'Versión en inglés'],
  perdon: ['/topic-forgiveness.html', 'Versión en inglés'],
};

const SHELL_FILES = ['planes.html', 'muro.html', 'lector.html', 'ninos.html'];

function patch(rel, fn) {
  const full = path.join(root, rel);
  let html = fs.readFileSync(full, 'utf8');
  const next = fn(html);
  if (next !== html) {
    fs.writeFileSync(full, next, 'utf8');
    return true;
  }
  return false;
}

let n = 0;
for (const [slug, [href, label]] of Object.entries(TOPICAL_SIDEBAR)) {
  const rel = `${slug}.html`;
  const ok = patch(rel, (html) => {
    let h = html.replace(HEADER_TOPICAL_RE, ES_HEADER_TOPICAL);
    h = h.replace(SIDEBAR_RE, sidebarTopical(href, label));
    h = h.replace(MAS_TEMAS_SECTION_RE, (block) => {
      if (!block.includes('Más temas en español')) return block;
      return MAS_TEMAS_SECTION_REPLACE;
    });
    h = h.replace(TEMAS_RELACIONADOS_RE, MAS_TEMAS_SECTION_REPLACE);
    return h;
  });
  if (ok) {
    n++;
    console.log('patched topical', rel);
  }
}

for (const rel of SHELL_FILES) {
  const ok = patch(rel, (html) => {
    let h = html.replace(HEADER_TOPICAL_RE, ES_HEADER_SHELL);
    h = h.replace(SIDEBAR_RE, ES_SHELL_SIDEBAR);
    h = h.replace(MAS_TEMAS_SECTION_RE, (block) => {
      if (!block.includes('Más temas en español')) return block;
      return MAS_TEMAS_SECTION_REPLACE;
    });
    h = h.replace(TEMAS_RELACIONADOS_RE, MAS_TEMAS_SECTION_REPLACE);
    h = h.replace(/class="dark-mode pt-pilot-body"/g, 'class="dark-mode"');
    return h;
  });
  if (ok) {
    n++;
    console.log('patched shell', rel);
  }
}

patch('es/index.html', (html) =>
  html
    .replace(/class="dark-mode pt-pilot-body"/g, 'class="dark-mode"')
    .replace(
      /<a href="\/es\/">Inicio<\/a>/,
      '<a href="/es/">Inicio ES</a>',
    ),
) && (n++, console.log('patched es/index.html'));

console.log('sync-es-chrome: files touched', n);
