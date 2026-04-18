/** Canonical static site for deep links (Prayer Wall sign-in, full Memorize, etc.). */

export function getMainSiteOrigin(): string {
  if (typeof process !== "undefined" && process.env.NEXT_PUBLIC_MAIN_SITE_ORIGIN) {
    return process.env.NEXT_PUBLIC_MAIN_SITE_ORIGIN.replace(/\/$/, "");
  }
  return "https://todaysdailybattle.com";
}
