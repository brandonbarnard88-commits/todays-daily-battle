/**
 * Aligns loosely typed refs with a stable string for lookup (Psalm/Psalms, trim, strip clause junk).
 * Mirrors the spirit of `normalizeBibleRef` in root `script.js` — keep behavior compatible.
 */
export function normalizeBibleRef(ref: string): string {
  let cleaned = ref.replace(/\u00A0/g, " ").trim();
  cleaned = cleaned.replace(/[“”]/g, '"').replace(/[‘’]/g, "'");
  cleaned = cleaned.replace(/\s+/g, " ");
  cleaned = cleaned.replace(/\s*(?:\(|\[).*(?:\)|\])\s*$/, "");
  cleaned = cleaned.replace(/[,;].*$/, "");
  cleaned = cleaned.replace(/\s*[-–—].*$/, "");
  cleaned = cleaned.replace(/[.]+$/, "");
  cleaned = cleaned.replace(/^Psalms\s+/i, "Psalm ");
  cleaned = cleaned.replace(/^Ps(?!alms?)\.?\s*/i, "Psalm ");
  cleaned = cleaned.replace(/^Psalm(\d)/i, "Psalm $1");
  return cleaned.trim();
}

export function refKey(ref: string): string {
  return normalizeBibleRef(ref).toLowerCase();
}
