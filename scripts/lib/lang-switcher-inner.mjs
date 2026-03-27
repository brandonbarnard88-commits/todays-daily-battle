/**
 * Single source for the labeled language switcher inner HTML (data-tdb-pick rows).
 * Used by: scripts/write-pt-locale-pages.mjs (generated PT shells).
 * Hand pages (FR/ES hubs, pilots) should match these hrefs when edited manually.
 *
 * Supported hubs in the main row: EN · ES · FR · PT. Other locales: Explore → Languages.
 */
export const LANG_SWITCHER_INNER = `            <a class="tdb-lang-opt" href="/" hreflang="en" data-tdb-pick="en">English</a>
            <span class="tdb-lang-sep" aria-hidden="true">·</span>
            <a class="tdb-lang-opt" href="/es/" hreflang="es" data-tdb-pick="es">Español</a>
            <span class="tdb-lang-sep" aria-hidden="true">·</span>
            <a class="tdb-lang-opt" href="/fr/" hreflang="fr" data-tdb-pick="fr">Français</a>
            <span class="tdb-lang-sep" aria-hidden="true">·</span>
            <a class="tdb-lang-opt" href="/pt/" hreflang="pt" data-tdb-pick="pt">Português</a>
            <span class="tdb-lang-sep" aria-hidden="true">·</span>
            <a class="tdb-lang-opt tdb-lang-more" href="/explore.html#languages">More languages</a>`;
