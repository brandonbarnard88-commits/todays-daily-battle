"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useCallback, useLayoutEffect, useMemo, useState } from "react";

import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TDBVerseBreakdown } from "@/components/tdb-verse-breakdown";
import { TdbPageFooter } from "@/components/tdb-page-footer";
import { TdbSiteNav } from "@/components/tdb-site-nav";
import { resolveVerseByRef, type TdbAudience } from "@/lib/daily-verse";
import { getMainSiteOrigin } from "@/lib/main-site";
import {
  LISTEN_PRESETS,
  LISTEN_RATE_SSR_DEFAULT,
  presetForRate,
  readListenRate,
  writeListenRate,
} from "@/lib/tdb-listen-rate";
import { appendSavedVerse, buildSavedVerseSnapshot } from "@/lib/tdb-study-db";
import { cn } from "@/lib/utils";

export function MemorizeClient() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const refParam = searchParams.get("ref");

  const { verse, matchedRef, normalizedRequest } = useMemo(
    () => resolveVerseByRef(refParam),
    [refParam],
  );
  const showUnknownRefNote = Boolean(refParam && !matchedRef);

  const [hidden, setHidden] = useState(false);
  const [listenRate, setListenRate] = useState<number>(LISTEN_RATE_SSR_DEFAULT);
  const [saved, setSaved] = useState(false);
  const [audience, setAudience] = useState<TdbAudience>("adult");
  const [hint, setHint] = useState<string | null>(null);

  const activePreset = presetForRate(listenRate);

  useLayoutEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- hydrate listen rate from localStorage after SSR
    setListenRate(readListenRate());
  }, []);

  const applyPreset = useCallback((rate: number) => {
    writeListenRate(rate);
    setListenRate(rate);
  }, []);

  const handleListen = useCallback(async () => {
    const text = verse.text;
    setHint(null);
    if (!window.speechSynthesis) {
      try {
        await navigator.clipboard.writeText(`${verse.reference} (KJV)\n${text}`);
        setHint("Copied — read line by line in your own time.");
      } catch {
        setHint("Speech isn’t available here — stay with the verse quietly.");
      }
      return;
    }
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.rate = listenRate;
    u.onerror = () => {
      void navigator.clipboard.writeText(`${verse.reference} (KJV)\n${text}`).then(() => {
        setHint("Reading paused — verse copied.");
      });
    };
    window.speechSynthesis.speak(u);
  }, [listenRate, verse.reference, verse.text]);

  const handleSave = useCallback(async () => {
    const result = await appendSavedVerse(verse.reference, buildSavedVerseSnapshot(verse, audience));
    if (result.ok) {
      setSaved(true);
      window.setTimeout(() => setSaved(false), 2200);
    }
  }, [audience, verse]);

  const mainMemorizeUrl = `${getMainSiteOrigin()}/memorize.html`;

  return (
    <div className="min-h-screen">
      <TdbSiteNav currentPath={pathname ?? "/memorize"} />

      <main className="mx-auto max-w-3xl px-4 pb-24 pt-10 sm:px-6 sm:pt-12">
        <header className="mb-10">
          <p className="mb-2 text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
            KJV · Private · Gentle pace
          </p>
          <h1 className="font-heading text-3xl font-semibold text-foreground sm:text-4xl">Memorize</h1>
          <p className="mt-3 max-w-md text-pretty text-sm leading-relaxed text-muted-foreground">
            Hide the text when you&apos;re ready to say it back. Listen slow. No score, no streak
            pressure here.
          </p>
        </header>

        {showUnknownRefNote ? (
          <p className="mb-6 rounded-lg border border-dashed border-border/70 bg-muted/30 px-4 py-3 text-sm text-muted-foreground">
            We don&apos;t have that exact reference in the pilot catalog yet — showing today&apos;s verse
            instead. You asked for:{" "}
            <span className="font-medium text-foreground">{normalizedRequest ?? refParam}</span>.
          </p>
        ) : null}

        <Card className="tdb-print-verse border-border/70 shadow-none ring-1 ring-border/80">
          <CardHeader className="border-b border-border/50">
            <CardTitle className="font-heading text-2xl">{verse.reference}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 pt-6">
            <blockquote
              className={cn(
                "font-heading border-l-4 border-primary/35 pl-5 text-xl font-normal leading-relaxed transition-all sm:text-2xl",
                hidden && "select-none blur-md",
              )}
            >
              {verse.text}
            </blockquote>

            <div className="flex flex-wrap gap-2">
              <Button type="button" variant={hidden ? "default" : "outline"} size="sm" onClick={() => setHidden((h) => !h)}>
                {hidden ? "Show verse" : "Hide verse"}
              </Button>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs text-muted-foreground">Pace</span>
                {LISTEN_PRESETS.map((p) => (
                  <Button
                    key={p.id}
                    type="button"
                    size="sm"
                    variant={activePreset === p.id ? "secondary" : "ghost"}
                    className="text-xs"
                    onClick={() => applyPreset(p.rate)}
                  >
                    {p.label}
                  </Button>
                ))}
              </div>
              <Button type="button" onClick={() => void handleListen()}>
                Listen slow
              </Button>
            </div>
            {hint ? (
              <p className="text-sm text-muted-foreground" role="status">
                {hint}
              </p>
            ) : null}

            <TDBVerseBreakdown
              className="mt-2"
              verse={verse}
              audience={audience}
              onAudienceChange={setAudience}
            />

            <div className="flex flex-wrap gap-2 border-t border-border/50 pt-6">
              <Button type="button" variant="outline" onClick={() => void handleSave()}>
                {saved ? "Saved — My Study ✓" : "Save to My Study"}
              </Button>
              <Link href="/mystudy" className={cn(buttonVariants({ variant: "outline", size: "default" }))}>
                Open My Study
              </Link>
            </div>

            <p className="text-sm leading-relaxed text-muted-foreground">
              Want typing drills, audio loops, and printable cards? The full memorize hub lives on the
              main site — same calm spirit, more tools when you&apos;re ready.
            </p>
            <a
              href={mainMemorizeUrl}
              className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "text-primary")}
            >
              Open full Memorize on todaysdailybattle.com →
            </a>
          </CardContent>
        </Card>

        <TdbPageFooter />
      </main>
    </div>
  );
}
