/**
 * Local-first Battle Plan day pointer — IndexedDB when available, localStorage fallback.
 */

const DB_NAME = "tdb-plans";
const DB_VERSION = 1;
const STORE = "progress";
const LS_PREFIX = "tdb-plan-day:";

export type PlanProgressRow = {
  slug: string;
  day: number;
  updatedAt: string;
};

let dbPromise: Promise<IDBDatabase | null> | null = null;

function openDb(): Promise<IDBDatabase | null> {
  if (typeof indexedDB === "undefined") return Promise.resolve(null);
  if (dbPromise) return dbPromise;
  dbPromise = new Promise((resolve) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onerror = () => resolve(null);
    req.onsuccess = () => resolve(req.result);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(STORE)) {
        db.createObjectStore(STORE, { keyPath: "slug" });
      }
    };
  });
  return dbPromise;
}

export async function getPlanDayPointer(slug: string): Promise<number> {
  const db = await openDb();
  if (db) {
    try {
      const row = await new Promise<PlanProgressRow | undefined>((resolve, reject) => {
        const tx = db.transaction(STORE, "readonly");
        const r = tx.objectStore(STORE).get(slug);
        r.onsuccess = () => resolve(r.result as PlanProgressRow | undefined);
        r.onerror = () => reject(r.error);
      });
      if (row && typeof row.day === "number" && row.day >= 1) return row.day;
    } catch {
      /* fall through */
    }
  }
  try {
    const raw = localStorage.getItem(LS_PREFIX + slug);
    if (raw) {
      const n = Number.parseInt(raw, 10);
      if (Number.isFinite(n) && n >= 1) return n;
    }
  } catch {
    /* ignore */
  }
  return 1;
}

export async function setPlanDayPointer(slug: string, day: number, maxDay: number): Promise<void> {
  const clamped = Math.max(1, Math.min(Math.floor(day), maxDay));
  const row: PlanProgressRow = {
    slug,
    day: clamped,
    updatedAt: new Date().toISOString(),
  };

  const db = await openDb();
  if (db) {
    try {
      await new Promise<void>((resolve, reject) => {
        const tx = db.transaction(STORE, "readwrite");
        tx.objectStore(STORE).put(row);
        tx.oncomplete = () => resolve();
        tx.onerror = () => reject(tx.error);
      });
      return;
    } catch {
      /* fall through */
    }
  }
  try {
    localStorage.setItem(LS_PREFIX + slug, String(clamped));
  } catch {
    /* ignore */
  }
}
