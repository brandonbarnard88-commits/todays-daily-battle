"use client";

import { useEffect } from "react";

/** Gentle PWA hook — `/public/sw.js` caches the KJV map after first load for offline chapter reading. */
export function RegisterServiceWorker() {
  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;
    navigator.serviceWorker.register("/sw.js").catch(() => {});
  }, []);
  return null;
}
