/**
 * Trusted Types bootstrap — must run before script.js.
 * Creates default policy, patches innerHTML and insertAdjacentHTML.
 */
(function () {
  if (typeof window === 'undefined' || !window.trustedTypes || !window.trustedTypes.createPolicy) return;
  if (window.trustedTypes.defaultPolicy) return;
  try {
    window.trustedTypes.createPolicy('default', {
      createHTML: function (i) {
        var x = String(i || '');
        if (window.__ttDepth) return x;
        window.__ttDepth = 1;
        try {
          if (typeof DOMPurify !== 'undefined' && DOMPurify.sanitize) {
            var r = DOMPurify.sanitize(x, { RETURN_TRUSTED_TYPE: true });
            return typeof r === 'string' ? r : x.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
          }
          return x.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
        } catch (_) {
          return x.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
        } finally {
          delete window.__ttDepth;
        }
      },
      createScript: function (i) {
        var s = String(i || '');
        try { JSON.parse(s); return s; } catch (_) {}
        if (/<script|javascript:|<\/script|eval\s*\(/i.test(s)) throw new Error('TrustedScript: disallowed');
        return s;
      },
      createScriptURL: function (url) {
        var u = String(url || '');
        if (!u) return u;
        if (u.indexOf('://') < 0 && u.charAt(0) !== '/' || u.charAt(0) === '/' && u.charAt(1) !== '/') return u;
        if (window.location && (u.startsWith(window.location.origin + '/') || u === window.location.origin + '/')) return u;
        if (u.startsWith('https://www.googletagmanager.com') || u.startsWith('https://www.google-analytics.com') ||
            u.startsWith('https://static.cloudflareinsights.com') || u.startsWith('https://cdn.jsdelivr.net') ||
            u.startsWith('https://cdnjs.cloudflare.com') || u.startsWith('https://unpkg.com') ||
            u.startsWith('https://challenges.cloudflare.com') || u.startsWith('https://www.gstatic.com') ||
            u.startsWith('https://plausible.io') || u.startsWith('https://js.stripe.com') ||
            u.startsWith('https://todaysdailybattle.com') || u.startsWith('https://www.todaysdailybattle.com') ||
            u.indexOf('supabase.co') !== -1) return u;
        console.warn('Blocked script URL:', u);
        return null;
      }
    });
    if (typeof DOMPurify !== 'undefined' && DOMPurify.setConfig) {
      DOMPurify.setConfig({ TRUSTED_TYPES_POLICY: window.trustedTypes.defaultPolicy });
    }
    (function () {
      var d = Object.getOwnPropertyDescriptor(Element.prototype, 'innerHTML');
      if (!d || !d.set) return;
      var orig = d.set;
      var pol = window.trustedTypes && window.trustedTypes.defaultPolicy;
      var createHTML = pol && typeof pol.createHTML === 'function' ? pol.createHTML.bind(pol) : null;
      Object.defineProperty(Element.prototype, 'innerHTML', {
        set: function (v) {
          var s = v == null ? '' : (typeof v === 'string' ? v : String(v));
          if (createHTML) {
            try { v = s ? createHTML(s) : createHTML(''); } catch (_) {
              try { v = createHTML(s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')); } catch (e2) { v = createHTML(''); }
            }
          }
          return orig.call(this, v);
        },
        get: d.get,
        configurable: true,
        enumerable: d.enumerable
      });
      var ia = Element.prototype.insertAdjacentHTML;
      if (ia && createHTML) {
        Element.prototype.insertAdjacentHTML = function (pos, html) {
          var s = html == null ? '' : (typeof html === 'string' ? html : String(html));
          if (createHTML) {
            try { html = s ? createHTML(s) : createHTML(''); } catch (_) {
              try { html = createHTML(s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')); } catch (e2) { html = createHTML(''); }
            }
          }
          return ia.call(this, pos, html);
        };
      }
    })();
  } catch (_) {}
})();
