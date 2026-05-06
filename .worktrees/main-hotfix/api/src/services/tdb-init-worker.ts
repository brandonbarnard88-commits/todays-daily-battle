import canon from "../pilot-data/canon-daily-verse.json" with { type: "json" };
import plans from "../pilot-data/battle-plans.json" with { type: "json" };
import calm from "../pilot-data/calm-moods.json" with { type: "json" };

import { initTdbData } from "./tdb-data.js";
import { parseTdbToCached } from "./tdb-payloads.js";

/**
 * Cloudflare Worker / wrangler: bundle the same three JSON files as the Next pilot
 * (relative to repo root: `next-app/data/`). No filesystem — data is in the Worker bundle.
 */
export function initTdbDataFromBundle(): void {
  const dataRoot = "worker:bundle:pilot-data";
  initTdbData(parseTdbToCached(canon, plans, calm, dataRoot));
}
