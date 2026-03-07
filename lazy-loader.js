(() => {
  const selector = 'script[data-lazy-src]';
  let loaded = false;

  function loadLazyScripts() {
    if (loaded) return;
    loaded = true;
    const lazyScripts = Array.from(document.querySelectorAll(selector));
    for (const node of lazyScripts) {
      const src = node.getAttribute('data-lazy-src');
      if (!src) continue;

      const script = document.createElement('script');
      script.src = src;
      script.defer = true;
      if (node.hasAttribute('crossorigin')) {
        script.crossOrigin = node.getAttribute('crossorigin') || 'anonymous';
      }
      if (node.hasAttribute('integrity')) {
        script.integrity = node.getAttribute('integrity');
      }
      if (node.hasAttribute('referrerpolicy')) {
        script.referrerPolicy = node.getAttribute('referrerpolicy');
      }
      node.replaceWith(script);
    }
  }

  function queueLazyLoad() {
    if ('requestIdleCallback' in window) {
      window.requestIdleCallback(loadLazyScripts, { timeout: 2500 });
      return;
    }
    window.setTimeout(loadLazyScripts, 1500);
  }

  window.addEventListener('load', queueLazyLoad, { once: true });
  window.addEventListener('pointerdown', loadLazyScripts, { once: true, passive: true });
  window.addEventListener('keydown', loadLazyScripts, { once: true });
})();
