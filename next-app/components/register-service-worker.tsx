"use client";

import { useEffect } from "react";

/**
 * Gentle PWA hook — `/public/sw.js` precaches the offline shell, stale-while-revalidate for
 * `/kjv-full.json`, cache-first for `/_next/static/*`, and a calm offline page for navigation.
 */
export function RegisterServiceWorker() {
  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;
    navigator.serviceWorker.register("/sw.js").catch(() => {});
  }, []);
  return null;
}
