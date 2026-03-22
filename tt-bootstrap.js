/**
 * Trusted Types bootstrap — must run before script.js (and before any defer script that sets innerHTML).
 * Creates default policy, patches innerHTML and insertAdjacentHTML on Element, DocumentFragment, and ShadowRoot (DOMPurify uses fragments).
 * DOMPurify.setConfig({ TRUSTED_TYPES_POLICY }) uses that policy so DOMPurify does not need extra CSP names beyond `dompurify`.
 */
(function () {
  if (typeof window === 'undefined' || !window.trustedTypes || !window.trustedTypes.createPolicy) return;
  try {
    if (!window.trustedTypes.defaultPolicy) {
    window.trustedTypes.createPolicy('default', {
      createHTML: function (i) {
        var x = String(i || '');
        /* Nested call: DOMPurify's RETURN_TRUSTED_TYPE path invokes policy.createHTML(sanitized).
           Must not return a raw string (TT violation) or recurse with RETURN_TRUSTED_TYPE: true. */
        if (window.__ttDepth) {
          if (typeof DOMPurify !== 'undefined' && DOMPurify.sanitize) {
            return DOMPurify.sanitize(x, { RETURN_TRUSTED_TYPE: false });
          }
          return x.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
        }
        window.__ttDepth = 1;
        try {
          if (typeof DOMPurify !== 'undefined' && DOMPurify.sanitize) {
            return DOMPurify.sanitize(x, { RETURN_TRUSTED_TYPE: true });
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
    }
    if (typeof DOMPurify !== 'undefined' && DOMPurify.setConfig && window.trustedTypes.defaultPolicy) {
      DOMPurify.setConfig({ TRUSTED_TYPES_POLICY: window.trustedTypes.defaultPolicy });
    }
    (function () {
      var pol = window.trustedTypes && window.trustedTypes.defaultPolicy;
      var createHTML = pol && typeof pol.createHTML === 'function' ? pol.createHTML.bind(pol) : null;
      if (!createHTML) return;
      function isTrustedHTMLValue(v) {
        if (v == null || typeof v !== 'object') return false;
        if (typeof TrustedHTML !== 'undefined' && v instanceof TrustedHTML) return true;
        return !!(v.constructor && v.constructor.name === 'TrustedHTML');
      }
      /** DOMPurify and other libs assign to DocumentFragment/ShadowRoot innerHTML — separate sinks from Element (CSP require-trusted-types-for). */
      var protos = [Element.prototype];
      if (typeof DocumentFragment !== 'undefined' && DocumentFragment.prototype) protos.push(DocumentFragment.prototype);
      if (typeof ShadowRoot !== 'undefined' && ShadowRoot.prototype) protos.push(ShadowRoot.prototype);
      protos.forEach(function (proto) {
        var d = Object.getOwnPropertyDescriptor(proto, 'innerHTML');
        if (!d || !d.set) return;
        var orig = d.set;
        Object.defineProperty(proto, 'innerHTML', {
          set: function (v) {
            if (isTrustedHTMLValue(v)) {
              return orig.call(this, v);
            }
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
        var ia = proto.insertAdjacentHTML;
        if (typeof ia === 'function') {
          proto.insertAdjacentHTML = function (pos, html) {
            if (isTrustedHTMLValue(html)) {
              return ia.call(this, pos, html);
            }
            var s = html == null ? '' : (typeof html === 'string' ? html : String(html));
            if (createHTML) {
              try { html = s ? createHTML(s) : createHTML(''); } catch (_) {
                try { html = createHTML(s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')); } catch (e2) { html = createHTML(''); }
              }
            }
            return ia.call(this, pos, html);
          };
        }
      });
    })();
  } catch (_) {}
})();

/** Kids + any page: set HTML via default Trusted Types policy (raw strings fail under require-trusted-types-for). */
(function bindTdbHtmlHelpers() {
  if (typeof window === 'undefined') return;
  window.tdbSetHtml = function (el, html) {
    if (!el) return;
    var s = html == null ? '' : String(html);
    var pol = window.trustedTypes && window.trustedTypes.defaultPolicy;
    if (pol && typeof pol.createHTML === 'function') {
      try {
        el.innerHTML = pol.createHTML(s);
        return;
      } catch (_) {}
    }
    el.innerHTML = s;
  };
  window.tdbClearHtml = function (el) {
    if (!el) return;
    while (el.firstChild) el.removeChild(el.firstChild);
  };
})();
