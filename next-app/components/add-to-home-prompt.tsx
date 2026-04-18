"use client";

import { useCallback, useEffect, useState } from "react";

import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const DISMISS_KEY = "tdb-a2hs-nudge-dismissed";

/** Chromium install prompt (not in all TS libs). */
type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

/**
 * Gentle, optional install hint — no nag loops. Chrome gets deferred install when available;
 * Safari/iOS gets a one-line “Share → Add to Home Screen” reminder.
 */
export function AddToHomePrompt() {
  const [visible, setVisible] = useState(false);
  const [iosStyle, setIosStyle] = useState(false);
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(display-mode: standalone)").matches) return;
    if (localStorage.getItem(DISMISS_KEY) === "1") return;

    const isIos =
      /iPad|iPhone|iPod/.test(navigator.userAgent) ||
      (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
    const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

    const onBip = (e: Event) => {
      e.preventDefault();
      queueMicrotask(() => {
        setDeferred(e as BeforeInstallPromptEvent);
        setIosStyle(false);
        setVisible(true);
      });
    };
    window.addEventListener("beforeinstallprompt", onBip);

    if (isIos && isSafari) {
      queueMicrotask(() => {
        setIosStyle(true);
        setVisible(true);
      });
    }

    return () => window.removeEventListener("beforeinstallprompt", onBip);
  }, []);

  const dismiss = useCallback(() => {
    try {
      localStorage.setItem(DISMISS_KEY, "1");
    } catch {
      /* ignore */
    }
    setVisible(false);
  }, []);

  const install = useCallback(async () => {
    if (!deferred) return;
    await deferred.prompt();
    try {
      await deferred.userChoice;
    } catch {
      /* ignore */
    }
    setDeferred(null);
    setVisible(false);
    try {
      localStorage.setItem(DISMISS_KEY, "1");
    } catch {
      /* ignore */
    }
  }, [deferred]);

  if (!visible) return null;

  return (
    <div
      role="status"
      className="tdb-no-print fixed bottom-4 left-4 right-4 z-40 mx-auto max-w-lg rounded-xl border border-border/70 bg-card/95 p-4 text-sm text-foreground shadow-lg ring-1 ring-border/50 backdrop-blur-md supports-[backdrop-filter]:bg-card/90 md:left-auto"
    >
      <p className="leading-relaxed text-muted-foreground">
        {iosStyle ? (
          <>
            Want this quiet place on your home screen? In Safari, tap{" "}
            <span className="font-medium text-foreground">Share</span>, then{" "}
            <span className="font-medium text-foreground">Add to Home Screen</span>. No rush.
          </>
        ) : deferred ? (
          <>
            Add Today&apos;s Daily Battle to your home screen for one-tap peace — only if that
            sounds helpful.
          </>
        ) : (
          <>
            This site can work like a calm app on your phone — add it when you&apos;re ready.
          </>
        )}
      </p>
      <div className="mt-3 flex flex-wrap gap-2">
        {deferred ? (
          <Button type="button" size="sm" onClick={install}>
            Add to home screen
          </Button>
        ) : null}
        <button
          type="button"
          className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "!text-muted-foreground")}
          onClick={dismiss}
        >
          Not now
        </button>
      </div>
    </div>
  );
}
