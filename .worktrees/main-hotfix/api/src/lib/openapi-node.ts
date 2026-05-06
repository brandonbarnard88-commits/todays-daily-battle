import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

/** Resolve `openapi/openapi.json` next to the compiled `api/` package (Node only). */
export function getOpenapiSpecObject(): Record<string, unknown> {
  const here = dirname(fileURLToPath(import.meta.url));
  const path = join(here, "../../openapi/openapi.json");
  return JSON.parse(readFileSync(path, "utf8")) as Record<string, unknown>;
}
