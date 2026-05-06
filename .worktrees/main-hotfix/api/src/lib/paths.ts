import { existsSync } from "node:fs";
import { resolve } from "node:path";

/**
 * Resolves the directory containing `canon-daily-verse.json` (pilot: `next-app/data`).
 * Set `TDB_DATA_DIR` when running from a working directory that is not the repo or `api/` package root.
 */
export function resolveTdbDataRoot(): string {
  const override = process.env.TDB_DATA_DIR?.trim();
  if (override) return resolve(override);

  const candidates = [
    resolve(process.cwd(), "next-app/data"),
    resolve(process.cwd(), "../next-app/data"),
  ];
  for (const dir of candidates) {
    if (existsSync(`${dir}/canon-daily-verse.json`)) return dir;
  }
  throw new Error(
    "TDB data not found. Set TDB_DATA_DIR to the absolute path of next-app/data, or run from the repo or api/ folder."
  );
}
