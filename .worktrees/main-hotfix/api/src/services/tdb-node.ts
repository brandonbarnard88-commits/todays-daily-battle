import { readFileSync } from "node:fs";
import { join } from "node:path";

import { resolveTdbDataRoot } from "../lib/paths.js";
import { initTdbData } from "./tdb-data.js";
import { parseTdbToCached } from "./tdb-payloads.js";

/**
 * Node only: read JSON from `TDB_DATA_DIR` or discover `next-app/data`, then hydrate the in-memory TDB store.
 * Call once before `createApp` / any request.
 */
export function initTdbDataFromNode(): void {
  const root = resolveTdbDataRoot();
  const canonRaw = JSON.parse(
    readFileSync(join(root, "canon-daily-verse.json"), "utf8")
  ) as unknown;
  const plansRaw = JSON.parse(
    readFileSync(join(root, "battle-plans.json"), "utf8")
  ) as unknown;
  const calmRaw = JSON.parse(
    readFileSync(join(root, "calm-moods.json"), "utf8")
  ) as unknown;

  initTdbData(parseTdbToCached(canonRaw, plansRaw, calmRaw, root));
}

export { clearTdbDataCache } from "./tdb-data.js";
