import openApi from "../openapi/openapi.json" with { type: "json" };

import { createApp } from "./app.js";
import { initTdbDataFromBundle } from "./services/tdb-init-worker.js";

initTdbDataFromBundle();

const app = createApp({
  getOpenapiSpec: () => openApi as Record<string, unknown>,
  /** Slightly tighter default on Workers (per-isolate map; pair with Cloudflare WAF / rate rules in prod). */
  rateLimit: { windowMs: 60_000, max: 100, keyPrefix: "tdb-w" },
});

export default {
  fetch: app.fetch,
};
