import type { Context, Next } from "hono";

type Bucket = { count: number; resetAt: number };

const buckets = new Map<string, Bucket>();

function clientKey(c: Context): string {
  const xff = c.req.header("x-forwarded-for");
  if (xff) {
    return xff.split(",")[0]!.trim();
  }
  const realIp = c.req.header("x-real-ip");
  if (realIp) return realIp.trim();
  return c.req.header("cf-connecting-ip")?.trim() ?? "unknown";
}

export type RateLimitOptions = {
  windowMs: number;
  max: number;
  keyPrefix?: string;
};

/**
 * Simple fixed-window in-memory limiter. For multi-instance production, use Redis/edge store.
 */
export function rateLimitMiddleware(opts: RateLimitOptions) {
  return async (c: Context, next: Next) => {
    const key = `${opts.keyPrefix ?? "rl"}:${clientKey(c)}`;
    const now = Date.now();
    let b = buckets.get(key);
    if (!b || b.resetAt <= now) {
      b = { count: 0, resetAt: now + opts.windowMs };
      buckets.set(key, b);
    }
    b.count += 1;
    c.header("X-RateLimit-Limit", String(opts.max));
    c.header("X-RateLimit-Remaining", String(Math.max(0, opts.max - b.count)));
    c.header("X-RateLimit-Reset", String(Math.ceil(b.resetAt / 1000)));
    if (b.count > opts.max) {
      const requestId = c.get("requestId");
      return c.json(
        {
          error: {
            code: "RATE_LIMITED",
            message: "Too many requests. Please slow down and try again shortly.",
            requestId: typeof requestId === "string" ? requestId : "unknown",
          },
        },
        429
      );
    }
    await next();
  };
}
