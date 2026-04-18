const STORAGE_KEY = "tdb-listen-rate";

export const LISTEN_PRESETS = [
  { id: "gentle", label: "Gentle", rate: 0.72 },
  { id: "slow", label: "Slow", rate: 0.85 },
  { id: "calm", label: "Calm", rate: 0.95 },
] as const;

export type ListenPresetId = (typeof LISTEN_PRESETS)[number]["id"];

export function readListenRate(): number {
  if (typeof window === "undefined") return LISTEN_PRESETS[1].rate;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return LISTEN_PRESETS[1].rate;
    const n = Number.parseFloat(raw);
    if (Number.isFinite(n) && n >= 0.5 && n <= 1.05) return n;
  } catch {
    /* ignore */
  }
  return LISTEN_PRESETS[1].rate;
}

export function writeListenRate(rate: number): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, String(rate));
  } catch {
    /* ignore */
  }
}

export function presetForRate(rate: number): ListenPresetId {
  let best: ListenPresetId = "slow";
  let diff = Infinity;
  for (const p of LISTEN_PRESETS) {
    const d = Math.abs(p.rate - rate);
    if (d < diff) {
      diff = d;
      best = p.id;
    }
  }
  return best;
}
