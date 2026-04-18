/**
 * Local-first private prayers + offline flush queue for the Next Prayer Wall pilot.
 * Keeps its own keys so the static `tdb_prayer_list_v1` stream stays untouched until you merge flows.
 */

const PRIVATE_KEY = "tdb_next_private_prayers_v1";
const PENDING_KEY = "tdb_next_prayer_pending_flush_v1";
const HOUSEHOLD_KEY = "tdb_next_household_share_code_v1";

export type PrivatePrayer = {
  id: string;
  text: string;
  createdAt: string;
};

export type PendingPrayer = {
  id: string;
  text: string;
  createdAt: string;
};

function readJson<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function writeJson(key: string, value: unknown): void {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* ignore */
  }
}

export function listPrivatePrayers(): PrivatePrayer[] {
  const v = readJson<unknown>(PRIVATE_KEY, []);
  return Array.isArray(v) ? (v as PrivatePrayer[]) : [];
}

export function addPrivatePrayer(text: string): PrivatePrayer | null {
  const t = text.trim();
  if (!t || t.length > 4000) return null;
  const row: PrivatePrayer = {
    id:
      typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
        ? crypto.randomUUID()
        : `p-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
    text: t,
    createdAt: new Date().toISOString(),
  };
  const next = [row, ...listPrivatePrayers()];
  writeJson(PRIVATE_KEY, next);

  if (typeof navigator !== "undefined" && !navigator.onLine) {
    const pending = readJson<PendingPrayer[]>(PENDING_KEY, []);
    pending.push({ ...row });
    writeJson(PENDING_KEY, pending);
  }
  return row;
}

export function listPendingFlush(): PendingPrayer[] {
  const v = readJson<unknown>(PENDING_KEY, []);
  return Array.isArray(v) ? v : [];
}

/** Clears pending queue after a successful “flush” (stub until Supabase wiring). */
export function clearPendingFlush(): void {
  try {
    window.localStorage.removeItem(PENDING_KEY);
  } catch {
    /* ignore */
  }
}

export function readHouseholdShareCode(): string {
  if (typeof window === "undefined") return "";
  try {
    return window.localStorage.getItem(HOUSEHOLD_KEY) ?? "";
  } catch {
    return "";
  }
}

export function writeHouseholdShareCode(code: string): void {
  try {
    const c = code.trim().slice(0, 64);
    if (!c) window.localStorage.removeItem(HOUSEHOLD_KEY);
    else window.localStorage.setItem(HOUSEHOLD_KEY, c);
  } catch {
    /* ignore */
  }
}
