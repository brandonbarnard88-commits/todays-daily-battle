import type { Context } from "hono";

/**
 * `public` with CDN-friendly `s-maxage`. JSON bundles are file-backed; bump cache if you add hot reload.
 */
export function withCache(
  c: Context,
  sMaxAgeSeconds: number,
  maxAgeSeconds: number = Math.min(120, sMaxAgeSeconds)
) {
  c.header(
    "Cache-Control",
    `public, max-age=${maxAgeSeconds}, s-maxage=${sMaxAgeSeconds}, stale-while-revalidate=86400`
  );
}
