/**
 * Trusted Types bootstrap — must run before script.js (and before any defer script that sets innerHTML).
 * Creates default policy, patches innerHTML and insertAdjacentHTML on Element, DocumentFragment, and ShadowRoot (DOMPurify uses fragments).
 * DOMPurify.setConfig({ TRUSTED_TYPES_POLICY }) uses that policy so DOMPurify does not need extra CSP names beyond `dompurify`.
 */
(function () {
  if (typeof window === 'undefined' || !window.trustedTypes || !window.trustedTypes.createPolicy) return;
  try {
    /**
     * DOMPurify must NOT use the default policy for RETURN_TRUSTED_TYPE wrapping: that re-enters
     * default.createHTML with already-sanitized HTML and hits the __ttDepth escape path, which
     * entity-escapes tags so the whole fragment renders as visible "<div>…" text site-wide.
     * CSP allowlists `dompurify` for this pass-through policy (see _headers).
     */
    var domPurifyTtPolicy = null;
    try {
      domPurifyTtPolicy = window.trustedTypes.createPolicy('dompurify', {
        createHTML: function (i) {
          return String(i || '');
        }
      });
    } catch (_) {
      try {
        if (window.trustedTypes.getPolicy) domPurifyTtPolicy = window.trustedTypes.getPolicy('dompurify');
      } catch (__) {}
    }
    if (typeof DOMPurify !== 'undefined' && DOMPurify.setConfig && domPurifyTtPolicy) {
      DOMPurify.setConfig({ TRUSTED_TYPES_POLICY: domPurifyTtPolicy });
    }

    if (!window.trustedTypes.defaultPolicy) {
    window.trustedTypes.createPolicy('default', {
      createHTML: function (i) {
        var x = String(i || '');
        try {
          if (typeof DOMPurify !== 'undefined' && DOMPurify.sanitize) {
            /* RETURN_TRUSTED_TYPE true must use the separate `dompurify` policy (see above).
               If that policy is missing (broken CSP), use false so DOMPurify never re-enters
               default.createHTML and entity-escapes the whole fragment. */
            return DOMPurify.sanitize(x, { RETURN_TRUSTED_TYPE: !!domPurifyTtPolicy });
          }
        } catch (_) {}
        return x.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
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
    if (typeof DOMPurify !== 'undefined' && DOMPurify.setConfig && domPurifyTtPolicy) {
      DOMPurify.setConfig({ TRUSTED_TYPES_POLICY: domPurifyTtPolicy });
    }
    (function () {
      var pol = window.trustedTypes && window.trustedTypes.defaultPolicy;
      var createHTML = pol && typeof pol.createHTML === 'function' ? pol.createHTML.bind(pol) : null;
      if (!createHTML) return;
      if (!window.__tdbNativeInnerHTMLSet && typeof Element !== 'undefined' && Element.prototype) {
        var _innerDesc = Object.getOwnPropertyDescriptor(Element.prototype, 'innerHTML');
        if (_innerDesc && _innerDesc.set) window.__tdbNativeInnerHTMLSet = _innerDesc.set;
      }
      function isTrustedHTMLValue(v) {
        if (v == null || typeof v !== 'object') return false;
        if (typeof TrustedHTML !== 'undefined' && v instanceof TrustedHTML) return true;
        try {
          if (Object.prototype.toString.call(v) === '[object TrustedHTML]') return true;
        } catch (_) {}
        return !!(v.constructor && v.constructor.name === 'TrustedHTML');
      }
      /** DOMPurify and other libs assign to DocumentFragment/ShadowRoot innerHTML — separate sinks from Element (CSP require-trusted-types-for).
       * WebKit/Safari may expose innerHTML on SVG/MathML prototypes separately from Element; patch each that defines an own setter. */
      var protos = [];
      [
        typeof Element !== 'undefined' && Element.prototype,
        typeof SVGElement !== 'undefined' && SVGElement.prototype,
        typeof SVGGraphicsElement !== 'undefined' && SVGGraphicsElement.prototype,
        typeof MathMLElement !== 'undefined' && MathMLElement.prototype,
        typeof DocumentFragment !== 'undefined' && DocumentFragment.prototype,
        typeof ShadowRoot !== 'undefined' && ShadowRoot.prototype
      ].forEach(function (proto) {
        if (!proto || protos.indexOf(proto) !== -1) return;
        var d0 = Object.getOwnPropertyDescriptor(proto, 'innerHTML');
        if (d0 && d0.set) protos.push(proto);
      });
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
        var od = Object.getOwnPropertyDescriptor(proto, 'outerHTML');
        if (od && od.set) {
          var origOuter = od.set;
          Object.defineProperty(proto, 'outerHTML', {
            set: function (v) {
              if (isTrustedHTMLValue(v)) {
                return origOuter.call(this, v);
              }
              var s = v == null ? '' : (typeof v === 'string' ? v : String(v));
              var trusted = v;
              if (createHTML) {
                try { trusted = s ? createHTML(s) : createHTML(''); } catch (_) {
                  try { trusted = createHTML(s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')); } catch (e2) { trusted = createHTML(''); }
                }
              }
              return origOuter.call(this, trusted);
            },
            get: od.get,
            configurable: true,
            enumerable: od.enumerable
          });
        }
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
    var nativeSet = window.__tdbNativeInnerHTMLSet;
    function applyTrusted(trusted) {
      if (nativeSet) nativeSet.call(el, trusted);
      else el.innerHTML = trusted;
    }
    if (pol && typeof pol.createHTML === 'function') {
      try {
        applyTrusted(pol.createHTML(s));
        return;
      } catch (_) {
        try {
          var wash = typeof DOMPurify !== 'undefined' && DOMPurify.sanitize
            ? DOMPurify.sanitize(s, { RETURN_TRUSTED_TYPE: false })
            : s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
          applyTrusted(pol.createHTML(wash));
          return;
        } catch (__) {
          try { applyTrusted(pol.createHTML('')); } catch (___) {}
          return;
        }
      }
    }
    if (nativeSet) {
      try { nativeSet.call(el, s); } catch (_) { try { el.textContent = ''; } catch (____) {} }
    } else {
      el.innerHTML = s;
    }
  };
  window.tdbClearHtml = function (el) {
    if (!el) return;
    while (el.firstChild) el.removeChild(el.firstChild);
  };
  /**
   * Master cleaner for plain-text UI: entities, HTML tags, markdown noise, whitespace.
   * Tag strip uses /< after optional slash, then a letter — so "x < y" is not treated as markup.
   * tdbCleanForPlainDisplay tested against: "<p>Hello</p> **bold**", "&lt;p&gt;", "x < y", "line\nbreak", "[a](url)"
   */
  window.tdbCleanForPlainDisplay = function (text) {
    if (text == null) return '';
    var clean = String(text);
    if (!clean.trim()) return '';
    var prev;
    var n;
    for (n = 0; n < 12; n++) {
      prev = clean;
      clean = clean.replace(/&amp;/g, '&');
      if (clean === prev) break;
    }
    clean = clean.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&nbsp;/gi, ' ');
    clean = clean.replace(/\u00a0/g, ' ');
    clean = clean.replace(/<\/?[a-zA-Z][^>]*>/g, ' ');
    clean = clean.replace(/(\*\*|__|~~|`|#{1,6}\s*|\[.*?\]\(.*?\))/g, '');
    clean = clean.replace(/(\*\*|__|\*|_|`|~~|#)/g, '');
    clean = clean.replace(/<\/?[a-zA-Z][^>]*>/g, ' ');
    /* Malformed or exotic tags (e.g. "< p >") — broad strip only if anything angle-shaped remains */
    if (/<[^>]+>/.test(clean)) {
      clean = clean.replace(/<[^>]+>/g, ' ');
    }
    clean = clean.replace(/\s+/g, ' ').trim();
    return clean;
  };
  /** @deprecated Use tdbCleanForPlainDisplay — kept for older call sites. */
  window.tdbStripAngleMarkupForPlainText = function (s) {
    return window.tdbCleanForPlainDisplay(s);
  };
})();

/** Subtle site-wide humility line — appended once per page (pages that load tt-bootstrap.js). */
(function tdbHumilityFooterOnce() {
  if (typeof document === 'undefined') return;
  function place() {
    if (document.querySelector('.tdb-site-humility')) return;
    if (!document.body) return;
    var p = document.createElement('p');
    p.className = 'tdb-site-humility';
    p.setAttribute('role', 'note');
    p.textContent = "We're not perfect. He is. Hand it over.";
    document.body.appendChild(p);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', place);
  else place();
})();
