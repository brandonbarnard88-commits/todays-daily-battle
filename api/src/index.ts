import { serve } from "@hono/node-server";
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { randomUUID } from "node:crypto";

import { withCache } from "./middleware/cache.js";
import { rateLimitMiddleware } from "./middleware/rate-limit.js";
import { createTrpcContext } from "./trpc/context.js";
import { appRouter } from "./trpc/app-router.js";
import {
  getBattlePlanBySlug,
  getCanonVerseList,
  getDailyVerse,
  getTdbData,
  listBattlePlans,
  listCalmMoods,
} from "./services/tdb-data.js";
import { jsonError } from "./lib/json-response.js";

type Variables = { requestId: string };

const app = new Hono<{ Variables: Variables }>();

app.onError((err, c) => {
  const requestId = c.get("requestId");
  const id = typeof requestId === "string" ? requestId : randomUUID();
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
  const id = c.req.header("x-request-id")?.trim() || randomUUID();
  c.set("requestId", id);
  c.header("X-Request-Id", id);
  await next();
});

app.use(
  "*",
  cors({
    origin: "*",
    allowMethods: ["GET", "POST", "OPTIONS"],
    allowHeaders: ["content-type", "x-request-id", "trpc-batch-mode"],
  })
);

const limit = rateLimitMiddleware({ windowMs: 60_000, max: 120, keyPrefix: "tdb" });

app.use("/v1/*", limit);
app.use("/trpc/*", limit);

app.get("/health", (c) => {
  c.header("Cache-Control", "no-store");
  return c.json({ ok: true, time: new Date().toISOString() });
});

function specPathFromCwd(): string {
  return join(process.cwd(), "openapi/openapi.json");
}

app.get("/openapi.json", (c) => {
  withCache(c, 300, 60);
  const raw = readFileSync(specPathFromCwd(), "utf8");
  return c.body(raw, 200, { "content-type": "application/json; charset=utf-8" });
});

app.get("/docs", (c) => {
  withCache(c, 300, 60);
  const port = process.env.PORT ?? "8787";
  const exampleServer = `http://localhost:${port}`;
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
    <p>CORS: load <a href="/openapi.json">/openapi.json</a> in your own OpenAPI tool. This UI requires JavaScript.</p>
    <p>Local server URL for clients: <code>${exampleServer.replace(/</g, "")}</code></p>
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

const port = Number(process.env.PORT ?? "8787");
serve({ fetch: app.fetch, port }, (info) => {
  // eslint-disable-next-line no-console
  console.log(`TDB API listening on http://localhost:${info.port}`);
  // eslint-disable-next-line no-console
  console.log(`  REST:  http://localhost:${info.port}/v1/verse/daily`);
  // eslint-disable-next-line no-console
  console.log(`  tRPC:  http://localhost:${info.port}/trpc`);
  // eslint-disable-next-line no-console
  console.log(`  Docs:  http://localhost:${info.port}/docs`);
});
