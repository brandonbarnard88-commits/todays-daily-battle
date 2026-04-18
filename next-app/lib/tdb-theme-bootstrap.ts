/**
 * Inline beforeInteractive — mirrors `tt-bootstrap.js` theme read order
 * (tdb-theme → legacy appearance labels → prefers-color-scheme → dark).
 * Only touches `document.documentElement`; body classes sync on client hydrate.
 */
export const tdbThemeBootstrapInline = String.raw`
(function(){
  try {
    var k='tdb-theme';
    var t=localStorage.getItem(k);
    if(t!=='light'&&t!=='dark'&&t!=='sepia'){
      var L=localStorage.getItem('appearance');
      if(L==='Quiet night')t='dark';
      else if(L==='Dawn parchment')t='sepia';
      else if(L==='Daylight')t='light';
    }
    if(t!=='light'&&t!=='dark'&&t!=='sepia'){
      t=window.matchMedia&&window.matchMedia('(prefers-color-scheme: light)').matches?'light':'dark';
    }
    document.documentElement.dataset.theme=t;
    if(t==='dark')document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  } catch(e) {
    document.documentElement.dataset.theme='dark';
    document.documentElement.classList.add('dark');
  }
})();`;
