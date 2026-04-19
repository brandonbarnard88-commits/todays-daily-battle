"use client";

import Link from "next/link";
import { useCallback, useEffect, useId, useLayoutEffect, useState } from "react";

import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TDBVerseBreakdown } from "@/components/tdb-verse-breakdown";
import { CANON_VERSION, dailyVerse, type TdbAudience } from "@/lib/daily-verse";
import {
  LISTEN_PRESETS,
  LISTEN_RATE_SSR_DEFAULT,
  presetForRate,
  readListenRate,
  writeListenRate,
} from "@/lib/tdb-listen-rate";
import { nextReaderPathForRef, parseRefToBookChapter } from "@/lib/reader-href";
import { migratePilotLocalStorageOnce, appendSavedVerse, buildSavedVerseSnapshot } from "@/lib/tdb-study-db";
import { syncCanonSchemaVersion } from "@/lib/tdb-canon-version";
import { cn } from "@/lib/utils";
import { BookOpen } from "lucide-react";

export function VerseRoomClient() {
  const audienceLabelId = useId();
  const [audience, setAudience] = useState<TdbAudience>("adult");
  const [saved, setSaved] = useState(false);
  const [listenRate, setListenRate] = useState<number>(LISTEN_RATE_SSR_DEFAULT);
  const [listenHint, setListenHint] = useState<string | null>(null);

  const readerPath = nextReaderPathForRef(dailyVerse.reference) ?? "/reader";
  const bookChapter = parseRefToBookChapter(dailyVerse.reference);

  useLayoutEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- hydrate listen rate from localStorage after SSR
    setListenRate(readListenRate());
  }, []);

  useEffect(() => {
    void migratePilotLocalStorageOnce();
    syncCanonSchemaVersion(CANON_VERSION);
  }, []);

  useEffect(() => {
    if (!listenHint) return;
    const t = window.setTimeout(() => setListenHint(null), 5200);
    return () => window.clearTimeout(t);
  }, [listenHint]);

  const applyListenPreset = useCallback((rate: number) => {
    writeListenRate(rate);
    setListenRate(rate);
  }, []);

  const handleListen = useCallback(async () => {
    const rate = listenRate;
    const text = dailyVerse.text;
    if (typeof window === "undefined") return;
    setListenHint(null);

    if (!window.speechSynthesis) {
      try {
        await navigator.clipboard.writeText(`${dailyVerse.reference} (KJV)\n${text}`);
        setListenHint("Copied — read aloud in your own time, or share with someone you trust.");
      } catch {
        setListenHint("Sit with the verse quietly for a moment — your browser can't read aloud here.");
      }
      return;
    }

    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.rate = rate;
    u.onerror = () => {
      void navigator.clipboard
        .writeText(`${dailyVerse.reference} (KJV)\n${text}`)
        .then(() => {
          setListenHint("Reading hit a snag — verse copied so you can read it yourself.");
        })
        .catch(() => {
          setListenHint("Reading paused — stay with the verse a moment.");
        });
    };
    window.speechSynthesis.speak(u);
  }, [listenRate]);

  const handleSave = useCallback(async () => {
    const result = await appendSavedVerse(dailyVerse.reference, buildSavedVerseSnapshot(dailyVerse, audience));
    if (result.ok) {
      setSaved(true);
      window.setTimeout(() => setSaved(false), 2200);
    }
  }, [audience]);

  const handleShare = useCallback(async () => {
    const title = `${dailyVerse.reference} (KJV) — Today's Daily Battle`;
    const text = `${dailyVerse.reference}\n${dailyVerse.text}`;
    try {
      if (navigator.share) {
        await navigator.share({ title, text, url: window.location.href });
        return;
      }
    } catch {
      /* user cancelled or share failed */
    }
    try {
      await navigator.clipboard.writeText(`${text}\n${window.location.href}`);
    } catch {
      /* ignore */
    }
  }, []);

  const activePreset = presetForRate(listenRate);

  return (
    <Card className="tdb-print-verse border-border/70 shadow-none ring-1 ring-border/80">
      <CardHeader className="gap-2 border-b border-border/50 pb-4">
        <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
          Sit with this verse
        </p>
        <CardTitle className="font-heading text-2xl sm:text-3xl">{dailyVerse.reference}</CardTitle>
        <p className="text-pretty text-sm leading-relaxed text-muted-foreground">
          No rush. Open what you need, or just read the KJV line a few times. Everything else is optional.
        </p>
      </CardHeader>
      <CardContent className="space-y-6 pt-6">
        <blockquote className="tdb-speakable-verse font-heading border-l-4 border-primary/35 pl-5 text-xl leading-relaxed sm:text-2xl">
          {dailyVerse.text}
        </blockquote>

        {bookChapter ? (
          <p className="text-sm leading-relaxed text-muted-foreground">
            <BookOpen className="mr-1.5 inline size-4 align-text-bottom opacity-80" aria-hidden />
            <span className="font-medium text-foreground">Chapter context: </span>
            <Link href={readerPath} className="text-primary underline underline-offset-4 hover:text-foreground">
              Read {bookChapter.book} {bookChapter.chapter} in the chapter reader
            </Link>{" "}
            <span className="text-muted-foreground">(full KJV chapter in this app — calm layout).</span>
          </p>
        ) : (
          <p className="text-sm text-muted-foreground">
            <Link href={readerPath} className="text-primary underline underline-offset-4 hover:text-foreground">
              Open the chapter reader
            </Link>{" "}
            to read in context.
          </p>
        )}

        <div className="tdb-no-print flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs text-muted-foreground">Pace</span>
            {LISTEN_PRESETS.map((p) => (
              <Button
                key={p.id}
                type="button"
                size="sm"
                variant={activePreset === p.id ? "secondary" : "ghost"}
                className="text-xs"
                onClick={() => applyListenPreset(p.rate)}
              >
                {p.label}
              </Button>
            ))}
          </div>
          <Button type="button" onClick={() => void handleListen()}>
            Listen slow
          </Button>
        </div>
        {listenHint ? (
          <p className="tdb-no-print text-sm text-muted-foreground" role="status" aria-live="polite">
            {listenHint}
          </p>
        ) : null}

        <div className="tdb-no-print flex flex-wrap gap-2">
          <Link href={readerPath} className={cn(buttonVariants({ variant: "default" }), "gap-1.5")}>
            <BookOpen className="size-4" aria-hidden />
            Open in Reader
          </Link>
          <Link href="/" className={cn(buttonVariants({ variant: "outline" }))}>
            Full home experience
          </Link>
          <Link
            href={`/memorize?ref=${encodeURIComponent(dailyVerse.reference)}`}
            className={cn(buttonVariants({ variant: "outline" }))}
          >
            Memorize
          </Link>
        </div>

        <div className="tdb-no-print flex flex-wrap gap-2">
          <Button type="button" variant="outline" onClick={() => void handleSave()}>
            {saved ? "Saved — My Study ✓" : "Save to My Study"}
          </Button>
          <Link href="/mystudy" className={cn(buttonVariants({ variant: "ghost", size: "default" }))}>
            Open My Study
          </Link>
          <Button type="button" variant="ghost" onClick={() => void handleShare()}>
            Share
          </Button>
        </div>

        <TDBVerseBreakdown
          verse={dailyVerse}
          audience={audience}
          onAudienceChange={setAudience}
          tabsLabelId={audienceLabelId}
          expandAllByDefault
        />
      </CardContent>
    </Card>
  );
}
