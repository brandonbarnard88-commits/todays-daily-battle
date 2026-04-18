/**
 * Theme parity with the static site: `tt-bootstrap.js` + `script.js`
 * — localStorage key `tdb-theme`, values `light` | `dark` | `sepia`
 * — `html[data-theme]`, body classes `light` | `dark-mode` | `sepia-mode`
 * Labels: Daylight → light, Quiet night → dark, Dawn parchment → sepia.
 */

export type TdbThemeId = "light" | "dark" | "sepia";

export const TDB_THEME_STORAGE_KEY = "tdb-theme";

export const TDB_THEME_LABEL: Record<TdbThemeId, string> = {
  light: "Daylight",
  dark: "Quiet night",
  sepia: "Dawn parchment",
};

/** Maps UI theme to `TDBCard` accents (Daylight → parchment, Quiet night → night, Dawn → dawn). */
export function tdbThemeToCardVariant(
  theme: TdbThemeId | null,
): "parchment" | "night" | "dawn" {
  if (theme === "dark") return "night";
  if (theme === "sepia") return "dawn";
  return "parchment";
}

export function readTdbThemeFromStorage(): TdbThemeId | null {
  if (typeof window === "undefined") return null;
  try {
    const v = window.localStorage.getItem(TDB_THEME_STORAGE_KEY);
    if (v === "light" || v === "dark" || v === "sepia") return v;
    const legacy = window.localStorage.getItem("appearance");
    if (legacy === "Quiet night") return "dark";
    if (legacy === "Dawn parchment") return "sepia";
    if (legacy === "Daylight") return "light";
  } catch {
    /* ignore */
  }
  return null;
}

export function readInitialTdbTheme(): TdbThemeId {
  const saved = readTdbThemeFromStorage();
  if (saved) return saved;
  if (typeof window === "undefined") return "dark";
  try {
    if (window.matchMedia("(prefers-color-scheme: light)").matches) return "light";
  } catch {
    /* ignore */
  }
  return "dark";
}

/** Sync DOM + storage (client only). */
export function applyTdbTheme(theme: TdbThemeId): void {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  root.dataset.theme = theme;
  root.classList.toggle("dark", theme === "dark");
  try {
    window.localStorage.setItem(TDB_THEME_STORAGE_KEY, theme);
  } catch {
    /* ignore */
  }
  const body = document.body;
  if (body) {
    body.classList.toggle("light", theme === "light");
    body.classList.toggle("dark-mode", theme === "dark");
    body.classList.toggle("sepia-mode", theme === "sepia");
  }
}
