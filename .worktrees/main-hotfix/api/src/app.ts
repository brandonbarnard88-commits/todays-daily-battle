import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { Hono } from "hono";
import { cors } from "hono/cors";

import { withCache } from "./middleware/cache.js";
import { rateLimitMiddleware } from "./middleware/rate-limit.js";
import { createTrpcContext } from "./trpc/context.js";
import { appRouter } from "./trpc/app-router.js";
import {
  getBattlePlanBySlug,
  getCanonVerseList,
  getDailyVerse,
  getDataMeta,
  getTdbData,
  listBattlePlans,
  listCalmMoods,
} from "./services/tdb-data.js";
import { jsonError } from "./lib/json-response.js";

export type TdbApiBindings = {
  /** Optional: `public/` static files from wrangler `[assets]`. */
  ASSETS?: { fetch(input: Request | string, init?: RequestInit): Promise<Response> };
  SERVICE_VERSION?: string;
};

type Variables = { requestId: string };

export type CreateAppOptions = {
  /** Node: read from disk; Worker: pass imported JSON object. */
  getOpenapiSpec: () => Record<string, unknown>;
  /** Per-IP fixed window (each isolate has its own map on Workers). */
  rateLimit?: { windowMs: number; max: number; keyPrefix?: string };
  /** Local dev hint for /docs no-script line (Node only). */
  localPortHint?: string;
};

function randomId(): string {
  return globalThis.crypto.randomUUID();
}

function serviceVersion(c: { env?: TdbApiBindings }): string {
  const w = c.env?.SERVICE_VERSION?.trim();
  if (w) return w;
  if (typeof process !== "undefined" && process.env) {
    return (
      process.env.SERVICE_VERSION?.trim() ??
      process.env.npm_package_version?.trim() ??
      "0.1.0"
    );
  }
  return "0.1.0";
}

export function createApp(opts: CreateAppOptions) {
  const app = new Hono<{ Variables: Variables; Bindings: TdbApiBindings }>();

  const rate = opts.rateLimit ?? {
    windowMs: 60_000,
    max: 120,
    keyPrefix: "tdb",
  };
  const limit = rateLimitMiddleware(rate);

  app.onError((err, c) => {
    const requestId = c.get("requestId");
    const id = typeof requestId === "string" ? requestId : randomId();
    console.error("[api]", id, err);
    return c.json(
      {
        error: {
          code: "INTERNAL",
          message: "Something went wrong. Please try again.",
          requestId: id,
        },
      },
      500
    );
  });

  app.use("*", async (c, next) => {
    const id = c.req.header("x-request-id")?.trim() || randomId();
    c.set("requestId", id);
    c.header("X-Request-Id", id);
    await next();
  });

  app.use(
    "*",
    cors({
      origin: "*",
      allowMethods: ["GET", "POST", "OPTIONS"],
      allowHeaders: [
        "content-type",
        "x-request-id",
        "trpc-batch-mode",
        "x-forwarded-for",
      ],
    })
  );

  app.use("/v1/*", limit);
  app.use("/trpc/*", limit);

  app.get("/health", (c) => {
    c.header("Cache-Control", "no-store");
    try {
      const meta = getDataMeta();
      return c.json({
        ok: true,
        service: "todaysdailybattle-api",
        version: serviceVersion(c),
        time: new Date().toISOString(),
        runtime:
          (c.req.raw as { cf?: unknown }).cf != null
            ? "cloudflare-worker"
            : "node",
        data: {
          ready: true,
          dataRoot: meta.dataRoot,
          loadedAt: meta.loadedAt,
        },
      });
    } catch {
      return c.json(
        {
          ok: false,
          service: "todaysdailybattle-api",
          version: serviceVersion(c),
          time: new Date().toISOString(),
          data: { ready: false, error: "TDB_DATA_UNRESOLVABLE" },
        },
        503
      );
    }
  });

  app.get("/openapi.json", (c) => {
    withCache(c, 300, 60);
    return c.json(opts.getOpenapiSpec());
  });

  app.get("/docs", (c) => {
    withCache(c, 300, 60);
    const example = opts.localPortHint
      ? `http://localhost:${opts.localPortHint}`
      : new URL(c.req.url).origin;
    const html = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>TDB API — OpenAPI</title>
  <link rel="stylesheet" href="https://unpkg.com/swagger-ui-dist@5.11.0/swagger-ui.css" crossorigin="anonymous" />
  <style>body { margin: 0; } #swagger-ui { box-sizing: border-box; max-width: 1200px; margin: 0 auto; padding: 16px; }</style>
</head>
<body>
  <div id="swagger-ui"></div>
  <script src="https://unpkg.com/swagger-ui-dist@5.11.0/swagger-ui-bundle.js" crossorigin="anonymous"></script>
  <script>
    window.ui = SwaggerUIBundle({
      url: new URL("/openapi.json", location.origin).toString(),
      dom_id: "#swagger-ui",
      deepLinking: true,
      presets: [SwaggerUIBundle.presets.apis, SwaggerUIBundle.SwaggerUIStandalonePreset]
    });
  </script>
  <noscript>
    <p>Open <a href="/openapi.json">/openapi.json</a> in your OpenAPI tool.</p>
    <p>Local hint: <code>${String(example).replace(/</g, "")}</code></p>
  </noscript>
</body>
</html>`;
    return c.body(html, 200, { "content-type": "text/html; charset=utf-8" });
  });

  app.get("/v1/verse/daily", (c) => {
    withCache(c, 120, 30);
    return c.json({ verse: getDailyVerse() });
  });

  app.get("/v1/verse/canon", (c) => {
    withCache(c, 300, 120);
    return c.json({ verses: getCanonVerseList() });
  });

  app.get("/v1/plans", (c) => {
    withCache(c, 300, 120);
    return c.json({ plans: listBattlePlans() });
  });

  app.get("/v1/plans/:slug", (c) => {
    const slug = c.req.param("slug");
    const plan = getBattlePlanBySlug(slug);
    if (!plan) {
      c.header("Cache-Control", "no-store");
      return c.json(
        { error: { code: "NOT_FOUND", message: "Plan not found." } },
        404
      );
    }
    withCache(c, 300, 120);
    return c.json({ plan });
  });

  app.get("/v1/calm/moods", (c) => {
    withCache(c, 300, 120);
    return c.json({ moods: listCalmMoods() });
  });

  app.get("/v1/meta", (c) => {
    withCache(c, 60, 10);
    const d = getTdbData();
    return c.json({ dataRoot: d.root, loadedAt: d.loadedAt });
  });

  /** Optional: files under `api/public/` bound as ASSETS in wrangler (e.g. extra JSON or docs). */
  app.get("/_static/*", async (c) => {
    const assets = c.env.ASSETS;
    if (!assets) {
      return c.text("ASSETS binding not configured", 404);
    }
    const url = new URL(c.req.url);
    const nextPath = url.pathname.replace(/^\/_static\/?/, "/") || "/";
    const next = new URL(nextPath + url.search, url.origin);
    return assets.fetch(new Request(next, c.req));
  });

  app.all("/trpc/*", (c) => {
    c.header("Cache-Control", "no-store");
    return fetchRequestHandler({
      endpoint: "/trpc",
      req: c.req.raw,
      router: appRouter,
      createContext: createTrpcContext,
      onError({ error, path }) {
        console.error("[trpc]", path, error);
      },
    });
  });

  app.notFound((c) => {
    return jsonError("NOT_FOUND", "Route not found.", 404, c.get("requestId"));
  });

  return app;
}
