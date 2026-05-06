import { serve } from "@hono/node-server";

import { createApp } from "./app.js";
import { getOpenapiSpecObject } from "./lib/openapi-node.js";
import { initTdbDataFromNode } from "./services/tdb-node.js";

initTdbDataFromNode();

const app = createApp({
  getOpenapiSpec: getOpenapiSpecObject,
  localPortHint: String(process.env.PORT ?? "8787"),
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
