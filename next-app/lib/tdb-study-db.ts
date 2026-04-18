/**
 * Local-first saved verses: IndexedDB when available, with one-way migration
 * from the pilot localStorage key. Falls back to localStorage if IDB is blocked.
 */

const DB_NAME = "tdb-study";
const DB_VERSION = 1;
const STORE = "savedVerses";
const PILOT_LS_KEY = "tdb-saved-verses-pilot";
const MIGRATION_DONE_KEY = "tdb-study-migrated-pilot-ls";

export type SavedVerseRow = {
  id?: number;
  reference: string;
  savedAt: string;
  source?: string;
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
        db.createObjectStore(STORE, { keyPath: "id", autoIncrement: true });
      }
    };
  });
  return dbPromise;
}

/** Migrates pilot `localStorage` saves into IndexedDB once; safe if IDB opens later. */
export async function migratePilotLocalStorageOnce(): Promise<void> {
  if (typeof window === "undefined") return;
  if (localStorage.getItem(MIGRATION_DONE_KEY) === "1") return;

  const raw = localStorage.getItem(PILOT_LS_KEY);
  if (!raw) {
    localStorage.setItem(MIGRATION_DONE_KEY, "1");
    return;
  }

  const db = await openDb();
  if (!db) return;

  let items: { reference: string; savedAt: string }[];
  try {
    items = JSON.parse(raw) as { reference: string; savedAt: string }[];
    if (!Array.isArray(items)) throw new Error("invalid");
  } catch {
    localStorage.setItem(MIGRATION_DONE_KEY, "1");
    return;
  }

  try {
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(STORE, "readwrite");
      const store = tx.objectStore(STORE);
      for (const it of items) {
        store.add({
          reference: String(it.reference),
          savedAt: String(it.savedAt),
          source: "pilot-ls",
        } satisfies Omit<SavedVerseRow, "id">);
      }
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
    localStorage.removeItem(PILOT_LS_KEY);
    localStorage.setItem(MIGRATION_DONE_KEY, "1");
  } catch {
    /* leave pilot LS intact; retry on next save */
  }
}

export async function appendSavedVerse(reference: string): Promise<{ ok: boolean; via: "idb" | "ls" }> {
  await migratePilotLocalStorageOnce();

  const row: Omit<SavedVerseRow, "id"> = {
    reference,
    savedAt: new Date().toISOString(),
    source: "next",
  };

  const db = await openDb();
  if (db) {
    try {
      await new Promise<void>((resolve, reject) => {
        const tx = db.transaction(STORE, "readwrite");
        tx.objectStore(STORE).add(row);
        tx.oncomplete = () => resolve();
        tx.onerror = () => reject(tx.error);
      });
      return { ok: true, via: "idb" };
    } catch {
      /* fall through */
    }
  }

  try {
    const raw = localStorage.getItem(PILOT_LS_KEY);
    const list = raw ? (JSON.parse(raw) as unknown[]) : [];
    list.push({ reference: row.reference, savedAt: row.savedAt });
    localStorage.setItem(PILOT_LS_KEY, JSON.stringify(list));
    return { ok: true, via: "ls" };
  } catch {
    return { ok: false, via: "ls" };
  }
}
