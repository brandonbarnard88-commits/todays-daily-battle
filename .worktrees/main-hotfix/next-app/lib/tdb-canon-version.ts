const STORAGE_KEY = "tdb-canon-daily-version";

/** Tracks which canon JSON `version` this browser last saw — for future migrations / cache bust hints. */
export function syncCanonSchemaVersion(currentVersion: number): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, String(currentVersion));
  } catch {
    /* ignore */
  }
}
