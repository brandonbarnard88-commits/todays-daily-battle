"use client";

import { useEffect } from "react";

/** Gentle PWA hook — `/public/sw.js` is a stub until full offline parity ships. */
export function RegisterServiceWorker() {
  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;
    navigator.serviceWorker.register("/sw.js").catch(() => {});
  }, []);
  return null;
}
