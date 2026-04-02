/**
 * Shell / tool page parity: standard account nudge (Site tour + Restart + Log in / My Verses)
 * and canonical site footer where missing or intentionally minimal.
 *
 * Targets: calm.html, plans.html, mobius.html, memorize.html, verse-image.html, reader.html
 * Idempotent: skips steps when markers already present.
 *
 * Run: node scripts/sync-shell-parity.mjs
 * Then: npm run sync:footer (optional — mobius no longer excluded)
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');

const SCRIPT_VER = '20260411launch';
const STYLES_VER = '20260412launch';
const SHARE_VER = '20260402shareattrs';
const STAMP_VER = '20260329fdbuild';

function readFooterInner() {
  const partialPath = path.join(root, 'partials', 'site-footer.html');
  const raw = fs.readFileSync(partialPath, 'utf8');
  const m = raw.match(/<footer\b[\s\S]*<\/footer>/i);
  if (!m) {
    console.error('sync-shell-parity: no <footer> in partials/site-footer.html');
    process.exit(1);
  }
  return m[0];
}

const FOOTER_HTML = readFooterInner();

/** Inside calm header (4-space children) */
const NUDGE_CALM = `    <div class="tdb-header-account-nudge" role="group" aria-label="Account shortcuts">
      <button type="button" class="tdb-header-account-nudge__link tdb-tour-open-btn" id="tdb-tour-open-btn" aria-label="Open the five-minute site tour">Site tour</button>
      <button type="button" class="tdb-header-account-nudge__link tdb-tour-restart-btn" aria-label="Restart the five-minute site tour from the beginning">Restart</button>
      <a href="/login.html" class="tdb-header-account-nudge__link">Log in</a>
      <a href="/my-verses.html" class="tdb-header-account-nudge__link">My Verses</a>
    </div>`;

/** Standalone strip (plans, mobius): 2-space base */
const NUDGE_STRIP_OPEN = `  <div class="tdb-shell-account-strip" role="region" aria-label="Account shortcuts">
    <div class="tdb-header-account-nudge" role="group" aria-label="Account shortcuts">
      <button type="button" class="tdb-header-account-nudge__link tdb-tour-open-btn" id="tdb-tour-open-btn" aria-label="Open the five-minute site tour">Site tour</button>
      <button type="button" class="tdb-header-account-nudge__link tdb-tour-restart-btn" aria-label="Restart the five-minute site tour from the beginning">Restart</button>
      <a href="/login.html" class="tdb-header-account-nudge__link">Log in</a>
      <a href="/my-verses.html" class="tdb-header-account-nudge__link">My Verses</a>
    </div>
  </div>`;

/** memorize: between primary nav and subnav */
const NUDGE_MEM = `  <div class="tdb-shell-account-strip" role="region" aria-label="Account shortcuts">
    <div class="tdb-header-account-nudge" role="group" aria-label="Account shortcuts">
      <button type="button" class="tdb-header-account-nudge__link tdb-tour-open-btn" id="tdb-tour-open-btn" aria-label="Open the five-minute site tour">Site tour</button>
      <button type="button" class="tdb-header-account-nudge__link tdb-tour-restart-btn" aria-label="Restart the five-minute site tour from the beginning">Restart</button>
      <a href="/login.html" class="tdb-header-account-nudge__link">Log in</a>
      <a href="/my-verses.html" class="tdb-header-account-nudge__link">My Verses</a>
    </div>
  </div>
`;

/** verse-image / reader-style top-bar (4 spaces before closing nav) */
const NUDGE_TOPBAR = `      <div class="tdb-header-account-nudge" role="group" aria-label="Account shortcuts">
        <button type="button" class="tdb-header-account-nudge__link tdb-tour-open-btn" id="tdb-tour-open-btn" aria-label="Open the five-minute site tour">Site tour</button>
        <button type="button" class="tdb-header-account-nudge__link tdb-tour-restart-btn" aria-label="Restart the five-minute site tour from the beginning">Restart</button>
        <a href="/login.html" class="tdb-header-account-nudge__link">Log in</a>
        <a href="/my-verses.html" class="tdb-header-account-nudge__link">My Verses</a>
      </div>
`;

const PLANS_SCRIPTS = `
  <script type="module" src="config.js"></script>
  <script type="module" src="script.js?v=${SCRIPT_VER}" data-cfasync="false"></script>
  <script src="share-page.js?v=${SHARE_VER}" defer></script>
  <script defer src="footer-build-stamp.js?v=${STAMP_VER}"></script>
`;

const CALM_FOOTER_SCRIPTS = `
  <script src="share-page.js?v=${SHARE_VER}" defer></script>
  <script defer src="footer-build-stamp.js?v=${STAMP_VER}"></script>
`;

function patchCalm(html) {
  let next = html;
  let touched = false;
  if (!next.includes('tdb-header-account-nudge')) {
    const needle = '    </nav>\n    </header>';
    if (next.includes(needle)) {
      next = next.replace(needle, `    </nav>\n${NUDGE_CALM}\n    </header>`);
      touched = true;
    }
  }
  if (!next.includes('site-footer--canonical')) {
    const needle = '  </div>\n  <!-- Full app bundle deferred';
    if (next.includes(needle)) {
      next = next.replace(
        needle,
        `  </div>\n${FOOTER_HTML}\n${CALM_FOOTER_SCRIPTS}\n  <!-- Full app bundle deferred`
      );
      touched = true;
    }
  }
  if (!next.includes(`styles.css?v=${STYLES_VER}`) && next.includes('styles.css?v=')) {
    next = next.replace(/styles\.css\?v=[^"']+/, `styles.css?v=${STYLES_VER}`);
    touched = true;
  }
  if (next.includes("s.src = 'script.js?v=")) {
    next = next.replace(/s\.src = 'script\.js\?v=[^']+'/, `s.src = 'script.js?v=${SCRIPT_VER}'`);
    touched = true;
  }
  return { next, touched };
}

function patchPlans(html) {
  let next = html;
  let touched = false;
  if (!next.includes('tdb-header-account-nudge')) {
    const needle = '  </nav>\n  <div id="tdb-offline-strip"';
    if (next.includes(needle)) {
      next = next.replace(needle, `  </nav>\n${NUDGE_STRIP_OPEN}\n  <div id="tdb-offline-strip"`);
      touched = true;
    }
  }
  if (!next.includes('site-footer--canonical')) {
    const needle = '  </main>\n\n  <noscript>';
    if (next.includes(needle)) {
      next = next.replace(needle, `  </main>\n\n${FOOTER_HTML}\n\n  <noscript>`);
      touched = true;
    }
  }
  if (!next.includes('href="styles.css')) {
    const ins = `  <link rel="stylesheet" href="styles.css?v=${STYLES_VER}">\n`;
    const hook = '  <link rel="stylesheet" href="tdb-quiet-luxury.css';
    if (next.includes(hook)) {
      next = next.replace(hook, ins + hook);
      touched = true;
    }
  } else if (!next.includes(`styles.css?v=${STYLES_VER}`)) {
    next = next.replace(/href="styles\.css\?v=[^"]+"/, `href="styles.css?v=${STYLES_VER}"`);
    touched = true;
  }
  if (!next.includes('script.js?v=' + SCRIPT_VER) && !next.includes('sync-shell-parity:plans-scripts')) {
    const needle = '</body>\n</html>';
    if (next.includes(needle)) {
      next = next.replace(
        needle,
        `  <!-- sync-shell-parity:plans-scripts -->\n${PLANS_SCRIPTS}\n</body>\n</html>`
      );
      touched = true;
    }
  }
  if (!next.includes(`tdb-quiet-luxury.css?v=${STYLES_VER}`) && next.includes('tdb-quiet-luxury.css?v=20260402loading')) {
    next = next.replace('tdb-quiet-luxury.css?v=20260402loading', `tdb-quiet-luxury.css?v=${STYLES_VER}`);
    touched = true;
  }
  return { next, touched };
}

function patchMobius(html) {
  let next = html;
  let touched = false;
  if (!next.includes('tdb-header-account-nudge')) {
    const needle = '  </nav>\n  <header class="tool-page-header"';
    if (next.includes(needle)) {
      next = next.replace(needle, `  </nav>\n${NUDGE_STRIP_OPEN}\n  <header class="tool-page-header"`);
      touched = true;
    }
  }
  const toolFooterRe = /<footer class="tool-page-footer"[^>]*>[\s\S]*?<\/footer>/i;
  if (toolFooterRe.test(next) && !next.includes('site-footer--canonical')) {
    next = next.replace(toolFooterRe, FOOTER_HTML);
    touched = true;
  }
  if (!next.includes('footer-build-stamp.js')) {
    const hook = '<link rel="stylesheet" href="tool-pages.css?v=20260331surface-final">';
    if (next.includes(hook)) {
      next = next.replace(
        hook,
        `${hook}\n  <script defer src="footer-build-stamp.js?v=${STAMP_VER}"></script>`
      );
      touched = true;
    }
  }
  if (!next.includes(`styles.css?v=${STYLES_VER}`) && next.includes('styles.css?v=20260331surface-final')) {
    next = next.replace('styles.css?v=20260331surface-final', `styles.css?v=${STYLES_VER}`);
    touched = true;
  }
  return { next, touched };
}

function patchMemorize(html) {
  let next = html;
  let touched = false;
  if (!next.includes('href="styles.css')) {
    const hook = '  <link rel="stylesheet" href="tdb-calm-hubs.css';
    if (next.includes(hook)) {
      next = next.replace(
        hook,
        `  <link rel="stylesheet" href="styles.css?v=${STYLES_VER}">\n${hook}`
      );
      touched = true;
    }
  } else if (!next.includes(`styles.css?v=${STYLES_VER}`)) {
    next = next.replace(/href="styles\.css\?v=[^"]+"/, `href="styles.css?v=${STYLES_VER}"`);
    touched = true;
  }
  if (!next.includes('tdb-header-account-nudge')) {
    const needle = '  </nav>\n  <nav class="tdb-global-subnav"';
    if (next.includes(needle)) {
      next = next.replace(needle, `  </nav>\n${NUDGE_MEM}\n  <nav class="tdb-global-subnav"`);
      touched = true;
    }
  }
  if (!next.includes(`script.js?v=${SCRIPT_VER}`)) {
    const needle = '</body>\n</html>';
    if (next.includes(needle)) {
      next = next.replace(
        needle,
        `  <script type="module" src="config.js"></script>\n  <script type="module" src="script.js?v=${SCRIPT_VER}" data-cfasync="false"></script>\n  <script src="share-page.js?v=${SHARE_VER}" defer></script>\n</body>\n</html>`
      );
      touched = true;
    }
  }
  return { next, touched };
}

function patchVerseImage(html) {
  let next = html;
  let touched = false;
  if (!next.includes('tdb-header-account-nudge')) {
    const needle = '    </nav>\n    </header>';
    if (next.includes(needle)) {
      next = next.replace(needle, `    </nav>\n${NUDGE_TOPBAR}\n    </header>`);
      touched = true;
    }
  }
  if (next.includes('script.js?v=20260328feelwire')) {
    next = next.replace('script.js?v=20260328feelwire', `script.js?v=${SCRIPT_VER}`);
    touched = true;
  }
  if (!next.includes(`styles.css?v=${STYLES_VER}`) && next.includes('styles.css?v=')) {
    next = next.replace(/styles\.css\?v=[^"']+/, `styles.css?v=${STYLES_VER}`);
    touched = true;
  }
  return { next, touched };
}

function patchReader(html) {
  let next = html;
  let touched = false;
  if (!next.includes('tdb-header-account-nudge')) {
    const needle = '    </nav>\n      <a href="/" class="reader-back-btn"';
    if (next.includes(needle)) {
      next = next.replace(needle, `    </nav>\n${NUDGE_TOPBAR}\n      <a href="/" class="reader-back-btn"`);
      touched = true;
    }
  }
  return { next, touched };
}

const JOBS = [
  { rel: 'calm.html', fn: patchCalm },
  { rel: 'plans.html', fn: patchPlans },
  { rel: 'mobius.html', fn: patchMobius },
  { rel: 'memorize.html', fn: patchMemorize },
  { rel: 'verse-image.html', fn: patchVerseImage },
  { rel: 'reader.html', fn: patchReader },
];

function main() {
  let filesTouched = 0;
  for (const { rel, fn } of JOBS) {
    const full = path.join(root, rel);
    if (!fs.existsSync(full)) {
      console.warn('sync-shell-parity: missing', rel);
      continue;
    }
    const html = fs.readFileSync(full, 'utf8');
    const { next, touched } = fn(html);
    if (touched && next !== html) {
      fs.writeFileSync(full, next, 'utf8');
      console.log('updated', rel);
      filesTouched++;
    }
  }
  console.log('sync-shell-parity:', filesTouched, 'files updated');
}

main();
