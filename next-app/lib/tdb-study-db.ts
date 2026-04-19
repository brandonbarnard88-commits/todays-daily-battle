/**
 * Local-first saved verses: IndexedDB when available, with one-way migration
 * from the pilot localStorage key. Falls back to localStorage if IDB is blocked.
 */

import { CANON_VERSION, type CanonVerse, type TdbAudience, type VerseBreakdownFields } from "./daily-verse";
import { mergeVerseBreakdownForAudience } from "./verse-breakdown";

const DB_NAME = "tdb-study";
/** Bumped when shelf schema gains optional fields (e.g. verse snapshot) — store is schemaless; version documents migrations. */
const DB_VERSION = 2;
const STORE = "savedVerses";
const PILOT_LS_KEY = "tdb-saved-verses-pilot";
const MIGRATION_DONE_KEY = "tdb-study-migrated-pilot-ls";

export type SavedVerseSnapshot = {
  canonVersion: number;
  text: string;
  tier: TdbAudience;
  merged: VerseBreakdownFields;
};

export function buildSavedVerseSnapshot(verse: CanonVerse, tier: TdbAudience): SavedVerseSnapshot {
  return {
    canonVersion: CANON_VERSION,
    text: verse.text,
    tier,
    merged: mergeVerseBreakdownForAudience(verse, tier),
  };
}

export type SavedVerseRow = {
  id?: number;
  reference: string;
  savedAt: string;
  source?: string;
  /** Gentle breakdown + KJV text as of save (My Study offline shelf). */
  snapshot?: SavedVerseSnapshot;
};

let dbPromise: Promise<IDBDatabase | null> | null = null;

function openDb(): Promise<IDBDatabase | null> {
  if (typeof indexedDB === "undefined") return Promise.resolve(null);
  if (dbPromise) return dbPromise;
  dbPromise = new Promise((resolve) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onerror = () => resolve(null);
    req.onsuccess = () => resolve(req.result);
    req.onupgradeneeded = (ev) => {
      const db = req.result;
      if (!db.objectStoreNames.contains(STORE)) {
        db.createObjectStore(STORE, { keyPath: "id", autoIncrement: true });
      }
      const from = (ev as IDBVersionChangeEvent).oldVersion;
      if (from < 2) {
        /* v2: rows may include optional `snapshot`; no structural store change. */
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

/** All saves (IndexedDB + any remaining pilot localStorage rows), newest first. */
export async function getAllSavedVerses(): Promise<SavedVerseRow[]> {
  await migratePilotLocalStorageOnce();
  const byKey = new Map<string, SavedVerseRow>();

  const merge = (r: SavedVerseRow) => {
    const key = `${r.reference}|${r.savedAt}`;
    if (!byKey.has(key)) byKey.set(key, r);
  };

  const db = await openDb();
  if (db) {
    try {
      const rows = await new Promise<SavedVerseRow[]>((resolve, reject) => {
        const tx = db.transaction(STORE, "readonly");
        const req = tx.objectStore(STORE).getAll();
        req.onsuccess = () => resolve((req.result as SavedVerseRow[]) ?? []);
        req.onerror = () => reject(req.error);
      });
      for (const r of rows) merge(r);
    } catch {
      /* ignore */
    }
  }

  try {
    const raw = localStorage.getItem(PILOT_LS_KEY);
    if (raw) {
      const list = JSON.parse(raw) as Partial<SavedVerseRow>[];
      if (Array.isArray(list)) {
        for (const x of list) {
          merge({
            reference: String(x.reference),
            savedAt: String(x.savedAt),
            source: "ls-fallback",
            snapshot: x.snapshot,
          });
        }
      }
    }
  } catch {
    /* ignore */
  }

  return Array.from(byKey.values()).sort(
    (a, b) => new Date(b.savedAt).getTime() - new Date(a.savedAt).getTime(),
  );
}

export async function deleteSavedVerseById(id: number): Promise<boolean> {
  const db = await openDb();
  if (!db) return false;
  try {
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(STORE, "readwrite");
      tx.objectStore(STORE).delete(id);
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
    return true;
  } catch {
    return false;
  }
}

export async function exportSavedVersesJson(): Promise<string> {
  const rows = await getAllSavedVerses();
  return JSON.stringify(rows, null, 2);
}

export async function appendSavedVerse(
  reference: string,
  snapshot?: SavedVerseSnapshot,
): Promise<{ ok: boolean; via: "idb" | "ls" }> {
  await migratePilotLocalStorageOnce();

  const row: Omit<SavedVerseRow, "id"> = {
    reference,
    savedAt: new Date().toISOString(),
    source: "next",
    snapshot,
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
    list.push({ reference: row.reference, savedAt: row.savedAt, snapshot: row.snapshot });
    localStorage.setItem(PILOT_LS_KEY, JSON.stringify(list));
    return { ok: true, via: "ls" };
  } catch {
    return { ok: false, via: "ls" };
  }
}

function isSavedVerseRow(x: unknown): x is SavedVerseRow {
  if (!x || typeof x !== "object") return false;
  const o = x as Record<string, unknown>;
  return typeof o.reference === "string" && typeof o.savedAt === "string";
}

/**
 * Merge rows from an exported JSON backup into this device. Skips invalid entries;
 * duplicates (same reference + savedAt) are ignored.
 */
export async function importSavedVersesJson(
  json: string,
): Promise<{ added: number; skipped: number; error?: string }> {
  let parsed: unknown;
  try {
    parsed = JSON.parse(json) as unknown;
  } catch {
    return { added: 0, skipped: 0, error: "That file isn’t valid JSON." };
  }
  if (!Array.isArray(parsed)) {
    return { added: 0, skipped: 0, error: "Expected a list of saved verses." };
  }

  const existing = await getAllSavedVerses();
  const seen = new Set(existing.map((r) => `${r.reference}|${r.savedAt}`));

  let added = 0;
  let skipped = 0;

  for (const item of parsed) {
    if (!isSavedVerseRow(item)) {
      skipped++;
      continue;
    }
    const key = `${item.reference}|${item.savedAt}`;
    if (seen.has(key)) {
      skipped++;
      continue;
    }
    const result = await appendSavedVerse(item.reference, item.snapshot);
    if (result.ok) {
      seen.add(key);
      added++;
    } else {
      skipped++;
    }
  }

  return { added, skipped };
}
