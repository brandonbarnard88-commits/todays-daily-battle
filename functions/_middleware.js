const FALLBACK_SECURITY_HEADERS = {
  'X-Frame-Options': 'DENY',
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'no-referrer',
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
  'Permissions-Policy': 'geolocation=(self), microphone=(), camera=(), payment=(), usb=()',
  'Cross-Origin-Opener-Policy': 'same-origin-allow-popups',
  'Cross-Origin-Resource-Policy': 'same-origin',
  'X-Permitted-Cross-Domain-Policies': 'none',
  'Origin-Agent-Cluster': '?1',
  'X-XSS-Protection': '1; mode=block',
  'Content-Security-Policy':
    "default-src 'self'; base-uri 'self'; object-src 'none'; frame-ancestors 'none'; form-action 'self' https://checkout.stripe.com https://hooks.stripe.com; trusted-types default dompurify decodeHTMLEntitiesPolicy goog#html 'allow-duplicates'; script-src 'self' 'nonce-tdb2025s' https://www.gstatic.com https://cdn.jsdelivr.net https://cdnjs.cloudflare.com https://unpkg.com https://static.cloudflareinsights.com https://challenges.cloudflare.com https://*.supabase.co https://todaysdailybattle.com https://todaysdailybattle.org https://www.todaysdailybattle.com https://plausible.io https://www.googletagmanager.com https://js.stripe.com https://static.cloudflareinsights.com; script-src-elem 'self' 'nonce-tdb2025s' https://www.gstatic.com https://cdn.jsdelivr.net https://cdnjs.cloudflare.com https://unpkg.com https://static.cloudflareinsights.com https://challenges.cloudflare.com https://*.supabase.co https://todaysdailybattle.com https://todaysdailybattle.org https://www.todaysdailybattle.com https://plausible.io https://www.googletagmanager.com https://js.stripe.com https://static.cloudflareinsights.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://fonts.gstatic.com https://js.stripe.com https://*.stripe.com https://challenges.cloudflare.com https://static.cloudflareinsights.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: blob: https://images.unsplash.com https:; connect-src 'self' https://*.supabase.co wss://*.supabase.co https://rixsnhpwrlbvvymkfamj.supabase.co https://challenges.cloudflare.com https://plausible.io https://www.google-analytics.com https://analytics.google.com https://region1.google-analytics.com https://www.google.com https://api.stripe.com https://api.github.com https://bible-api.com https://unpkg.com https://cdn.jsdelivr.net https://cdnjs.cloudflare.com https://static.cloudflareinsights.com; worker-src 'self' blob: https://todaysdailybattle.com https://www.todaysdailybattle.com https://todaysdailybattle.com; frame-src 'self' https://challenges.cloudflare.com https://js.stripe.com https://hooks.stripe.com https://maps.google.com https://www.google.com; upgrade-insecure-requests"
};

const BLOCKED_PATHS = new Set(['/stats', '/stats/', '/stats.html']);

/** Pretty-URL .html and trailing-slash aliases. Pages would 308 these; 301 is the public contract. */
const PRETTY_HTML_TO_CLEAN = {
  '/plans.html': '/plans',
  '/calm.html': '/calm',
  '/explore.html': '/explore',
  '/family.html': '/family',
  '/memorize.html': '/memorize',
  '/coloring.html': '/coloring',
  '/reader.html': '/reader'
};

const TRAILING_SLASH_TO_BARE = new Set([
  '/plans/',
  '/calm/',
  '/explore/',
  '/family/',
  '/memorize/',
  '/coloring/',
  '/reader/'
]);

function canonicalPublicRedirect(url) {
  const path = url.pathname || '/';
  if (PRETTY_HTML_TO_CLEAN[path]) {
    url.pathname = PRETTY_HTML_TO_CLEAN[path];
    return url;
  }
  if (TRAILING_SLASH_TO_BARE.has(path)) {
    url.pathname = path.slice(0, -1);
    return url;
  }
  if (path === '/kids') {
    url.pathname = '/kids/';
    return url;
  }
  return null;
}

/** Retired stick-figure art — never serve even if a ghost asset remains at the edge. */
function isRetiredStickPanelPath(path) {
  return (
    /^\/kids\/panel-[a-z0-9-]+\.svg\/?$/i.test(path || '') ||
    /^\/images\/covers\/[^/]+\.svg$/i.test(path || '')
  );
}

const BLOCKED_HTML = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="robots" content="noindex, nofollow">
  <meta name="description" content="This page is not available. Return to Today's Daily Battle for calm KJV help.">
  <title>Not found</title>
</head>
<body>
  <p style="max-width:28rem;margin:1rem auto;padding:0 1rem;font-family:system-ui,sans-serif;line-height:1.55;color:#333;">You&rsquo;re already welcome here&mdash;this doorway is closed, but you are not.</p>
  <p style="max-width:28rem;margin:0 auto;padding:0 1rem;font-family:system-ui,sans-serif;"><a href="/">Back to Today&rsquo;s Daily Battle</a></p>
</body>
</html>`;

export async function onRequest(context) {
  const url = new URL(context.request.url);
  const path = url.pathname || '/';
  const method = String(context.request.method || 'GET').toUpperCase();

  if (method === 'GET' || method === 'HEAD') {
    const dest = canonicalPublicRedirect(url);
    if (dest && dest.pathname !== path) {
      return Response.redirect(dest.toString(), 301);
    }
  }

  // Owner stats: never serve public HTML (static file would otherwise win over _redirects).
  // Stick panels: retired Color & Tell era — block at the edge worker so ghost cache/origin cannot show sticks.
  if (BLOCKED_PATHS.has(path) || isRetiredStickPanelPath(path)) {
    const headers = new Headers({
      'content-type': 'text/html; charset=utf-8',
      'cache-control': 'no-store, no-cache, must-revalidate, max-age=0',
      'cdn-cache-control': 'no-store',
      'x-robots-tag': 'noindex, nofollow'
    });
    Object.entries(FALLBACK_SECURITY_HEADERS).forEach(([key, value]) => {
      headers.set(key, value);
    });
    return new Response(BLOCKED_HTML, { status: 404, headers });
  }

  const response = await context.next();
  const headers = new Headers(response.headers);

  Object.entries(FALLBACK_SECURITY_HEADERS).forEach(([key, value]) => {
    headers.set(key, value);
  });

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers
  });
}
