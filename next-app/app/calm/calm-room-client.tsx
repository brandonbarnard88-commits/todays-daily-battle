"use client";

import Link from "next/link";
import { useCallback, useEffect, useId, useLayoutEffect, useMemo, useRef, useState } from "react";

import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TDBVerseBreakdown } from "@/components/tdb-verse-breakdown";
import {
  CALM_MOODS,
  calmMoodById,
  moodIdFromFreeText,
  versesForCalmMood,
  type CalmVerseHit,
} from "@/lib/calm-moods";
import { CANON_VERSION, type CanonVerse, type TdbAudience } from "@/lib/daily-verse";
import {
  LISTEN_PRESETS,
  LISTEN_RATE_SSR_DEFAULT,
  presetForRate,
  readListenRate,
  writeListenRate,
} from "@/lib/tdb-listen-rate";
import { getMainSiteOrigin } from "@/lib/main-site";
import { mainSiteReaderUrlForRef } from "@/lib/reader-href";
import { memorizeHrefForRef } from "@/lib/tdb-gentle-picks";
import { migratePilotLocalStorageOnce, appendSavedVerse, buildSavedVerseSnapshot } from "@/lib/tdb-study-db";
import { syncCanonSchemaVersion } from "@/lib/tdb-canon-version";
import { cn } from "@/lib/utils";
import { BookOpen, Wind } from "lucide-react";

const BREATH_HINTS = [
  "Breathe in slowly through your nose.",
  "Pause gently — no forcing.",
  "Breathe out slowly.",
  "Again. You’re safe to rest here a minute.",
];

type CalmSession = {
  moodId: string;
  hits: CalmVerseHit[];
};

function CalmVerseBlock({
  hit,
  audience,
  listenRate,
  onApplyListenPreset,
  onListenHint,
}: {
  hit: CalmVerseHit;
  audience: TdbAudience;
  listenRate: number;
  onApplyListenPreset: (rate: number) => void;
  onListenHint: (msg: string | null) => void;
}) {
  const { verse, matchedRef } = hit;
  const [saved, setSaved] = useState(false);
  const [prayOpen, setPrayOpen] = useState(false);

  const readerUrl = mainSiteReaderUrlForRef(verse.reference) ?? `${getMainSiteOrigin()}/reader.html`;
  const prayerSeed =
    verse.verseEchoPrompts?.[0] ??
    `Lord, I'm heavy right now. Hold me to ${verse.reference} — meet me with Your peace. In Jesus' name, Amen.`;

  const handleListen = useCallback(async () => {
    onListenHint(null);
    const text = verse.text;
    if (typeof window === "undefined") return;
    if (!window.speechSynthesis) {
      try {
        await navigator.clipboard.writeText(`${verse.reference} (KJV)\n${text}`);
        onListenHint("Copied — read this verse in your own time.");
      } catch {
        onListenHint("Stay with the words quietly for a moment.");
      }
      return;
    }
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.rate = listenRate;
    u.onerror = () => {
      void navigator.clipboard.writeText(`${verse.reference} (KJV)\n${text}`).then(() => {
        onListenHint("Listen hit a snag — verse copied.");
      });
    };
    window.speechSynthesis.speak(u);
  }, [listenRate, onListenHint, verse.reference, verse.text]);

  const handleSave = useCallback(async () => {
    const result = await appendSavedVerse(verse.reference, buildSavedVerseSnapshot(verse, audience));
    if (result.ok) {
      setSaved(true);
      window.setTimeout(() => setSaved(false), 2200);
    }
  }, [audience, verse]);

  const handleShare = useCallback(async () => {
    const title = `${verse.reference} (KJV) — Calm · Today's Daily Battle`;
    const text = `${verse.reference}\n${verse.text}`;
    try {
      if (navigator.share) {
        await navigator.share({ title, text, url: typeof window !== "undefined" ? window.location.href : "" });
        return;
      }
    } catch {
      /* cancelled */
    }
    try {
      await navigator.clipboard.writeText(`${text}\n${typeof window !== "undefined" ? window.location.href : ""}`);
      onListenHint("Copied verse + link.");
    } catch {
      /* ignore */
    }
  }, [onListenHint, verse.reference, verse.text]);

  return (
    <Card className="tdb-print-verse border-border/70 shadow-none ring-1 ring-border/80">
      <CardContent className="space-y-4 pt-6">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h3 className="font-heading text-lg font-semibold text-foreground">{verse.reference}</h3>
          {!matchedRef ? (
            <span className="text-xs text-amber-700 dark:text-amber-200">Gentle note: catalog miss — showing today’s verse.</span>
          ) : null}
        </div>
        <blockquote className="tdb-speakable-verse font-heading border-l-4 border-primary/35 pl-4 text-base font-normal leading-relaxed text-foreground sm:text-lg">
          {verse.text}
        </blockquote>

        <div className="tdb-no-print flex flex-wrap items-center gap-2 border-b border-border/40 pb-3">
          <span className="text-xs text-muted-foreground">Pace</span>
          {LISTEN_PRESETS.map((p) => (
            <Button
              key={`${verse.reference}-${p.id}`}
              type="button"
              size="sm"
              variant={presetForRate(listenRate) === p.id ? "secondary" : "ghost"}
              className="text-xs"
              onClick={() => onApplyListenPreset(p.rate)}
            >
              {p.label}
            </Button>
          ))}
        </div>

        <div className="tdb-no-print flex flex-wrap gap-2">
          <Button type="button" size="sm" onClick={() => void handleListen()}>
            Listen slow
          </Button>
          <Button type="button" size="sm" variant="outline" onClick={() => void handleSave()}>
            {saved ? "Saved ✓" : "Save to My Study"}
          </Button>
          <Link href={memorizeHrefForRef(verse.reference)} className={cn(buttonVariants({ variant: "outline", size: "sm" }))}>
            Memorize
          </Link>
          <Button type="button" size="sm" variant="outline" onClick={() => void handleShare()}>
            Share
          </Button>
          <Button type="button" size="sm" variant="ghost" onClick={() => setPrayOpen((o) => !o)}>
            {prayOpen ? "Close prayer" : "Pray"}
          </Button>
          <a
            href={readerUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "gap-1")}
          >
            <BookOpen className="size-3.5" aria-hidden />
            Reader
          </a>
        </div>

        {prayOpen ? (
          <p className="rounded-md border border-dashed border-border/70 bg-muted/25 p-3 text-sm leading-relaxed text-muted-foreground">
            {prayerSeed}
          </p>
        ) : null}

        <TDBVerseBreakdown verse={verse} audience={audience} expandAllByDefault showAudienceTabs={false} />
      </CardContent>
    </Card>
  );
}

export function CalmRoomClient() {
  const resultsRef = useRef<HTMLElement>(null);
  const resultsAudienceId = useId();
  const [feelText, setFeelText] = useState("");
  const [session, setSession] = useState<CalmSession | null>(null);
  const [textGentleNote, setTextGentleNote] = useState<string | null>(null);
  const [resultsAudience, setResultsAudience] = useState<TdbAudience>("adult");
  const [listenRate, setListenRate] = useState<number>(LISTEN_RATE_SSR_DEFAULT);
  const [listenHint, setListenHint] = useState<string | null>(null);
  const [breathLeft, setBreathLeft] = useState<number | null>(null);

  const calmHubUrl = `${getMainSiteOrigin()}/calm.html`;

  useLayoutEffect(() => {
    setListenRate(readListenRate());
  }, []);

  useEffect(() => {
    void migratePilotLocalStorageOnce();
    syncCanonSchemaVersion(CANON_VERSION);
  }, []);

  useEffect(() => {
    if (breathLeft === null || breathLeft <= 0) return;
    const t = window.setTimeout(() => setBreathLeft(breathLeft - 1), 1000);
    return () => window.clearTimeout(t);
  }, [breathLeft]);

  useEffect(() => {
    if (!listenHint) return;
    const t = window.setTimeout(() => setListenHint(null), 5200);
    return () => window.clearTimeout(t);
  }, [listenHint]);

  const applyListenPreset = useCallback((rate: number) => {
    writeListenRate(rate);
    setListenRate(rate);
  }, []);

  const breathHint = useMemo(() => {
    if (breathLeft === null || breathLeft <= 0) return null;
    const step = Math.min(3, Math.floor((60 - breathLeft) / 15));
    return BREATH_HINTS[step] ?? BREATH_HINTS[0];
  }, [breathLeft]);

  const openMood = useCallback((moodId: string) => {
    setTextGentleNote(null);
    setSession({
      moodId,
      hits: versesForCalmMood(moodId, 3),
    });
    queueMicrotask(() => resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }));
  }, []);

  const submitFeelText = useCallback(() => {
    const id = moodIdFromFreeText(feelText);
    if (!id) {
      setTextGentleNote("We couldn’t match those words to a door yet — pick a card below, or try a shorter phrase (like “anxious,” “grief,” or “night shift”).");
      setSession(null);
      return;
    }
    setTextGentleNote(null);
    openMood(id);
  }, [feelText, openMood]);

  const moodTitle = session ? calmMoodById(session.moodId)?.title ?? "Gentle verses" : null;

  return (
    <div className="space-y-8">
      <Card className="border-border/70 shadow-none ring-1 ring-border/80">
        <CardContent className="space-y-3 pt-6">
          <div className="flex items-start gap-2">
            <Wind className="mt-0.5 size-5 shrink-0 text-muted-foreground" aria-hidden />
            <div>
              <p className="font-medium text-foreground">Optional: 60-second gentle pause</p>
              <p className="text-sm text-muted-foreground">
                No music, no score — just room to breathe. Tap start; let the line change a few times. Stop anytime.
              </p>
            </div>
          </div>
          {breathLeft !== null && breathLeft > 0 ? (
            <div className="rounded-lg border border-border/60 bg-muted/25 px-4 py-3">
              <p className="text-sm font-medium text-foreground" aria-live="polite">
                {breathLeft}s — {breathHint}
              </p>
              <Button type="button" variant="ghost" size="sm" className="mt-2" onClick={() => setBreathLeft(null)}>
                End pause
              </Button>
            </div>
          ) : breathLeft === 0 ? (
            <p className="text-sm text-muted-foreground" role="status">
              Pause finished — stay as long as you like. When you’re ready, scroll to a verse door.
            </p>
          ) : null}
          <Button
            type="button"
            variant="outline"
            disabled={breathLeft !== null && breathLeft > 0}
            onClick={() => {
              setBreathLeft(60);
            }}
          >
            Start 60-second gentle pause
          </Button>
        </CardContent>
      </Card>

      <section aria-label="How you feel">
        <h2 className="sr-only">Tap a door or describe how you feel</h2>
        <div className="mb-4 space-y-2">
          <label htmlFor="calm-feel" className="text-sm font-medium text-foreground">
            Or type how you feel (optional)
          </label>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <Input
              id="calm-feel"
              value={feelText}
              onChange={(e) => setFeelText(e.target.value)}
              placeholder="e.g. lonely and scared, overwhelmed parent, night shift"
              className="flex-1"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  submitFeelText();
                }
              }}
            />
            <Button type="button" variant="secondary" onClick={submitFeelText}>
              Match gently
            </Button>
          </div>
          {textGentleNote ? <p className="text-sm text-muted-foreground">{textGentleNote}</p> : null}
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          {CALM_MOODS.map((m) => (
            <button
              key={m.id}
              type="button"
              onClick={() => openMood(m.id)}
              className={cn(
                "rounded-xl border border-border/70 bg-card px-4 py-4 text-left shadow-none ring-0 transition-[box-shadow,border-color]",
                "hover:border-primary/35 hover:ring-1 hover:ring-primary/20",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
              )}
            >
              <span className="block font-heading text-base font-semibold text-foreground">{m.title}</span>
              <span className="mt-1 block text-sm text-muted-foreground">{m.hint}</span>
            </button>
          ))}
        </div>
      </section>

      {session && session.hits.length > 0 ? (
        <section ref={resultsRef} className="space-y-4 scroll-mt-6" aria-label="Verses for you">
          <div className="text-center">
            <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">For you right now</p>
            <h2 className="mt-2 font-heading text-xl font-semibold text-foreground sm:text-2xl">{moodTitle}</h2>
            <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
              One to three gentle KJV lines. Open a section or don’t — your pace.
            </p>
          </div>

          <Tabs
            value={resultsAudience}
            onValueChange={(v) => (v === "kid" || v === "teen" || v === "adult" ? setResultsAudience(v) : undefined)}
          >
            <div className="rounded-lg border border-border/60 bg-muted/25 p-4">
              <p id={resultsAudienceId} className="mb-3 text-sm font-medium text-foreground">
                Same verses — gentle words for who&apos;s listening
              </p>
              <TabsList aria-labelledby={resultsAudienceId} className="w-full flex-wrap justify-start gap-1">
                <TabsTrigger value="kid" className="text-xs">
                  Kid
                </TabsTrigger>
                <TabsTrigger value="teen" className="text-xs">
                  Teen
                </TabsTrigger>
                <TabsTrigger value="adult" className="text-xs">
                  Adult
                </TabsTrigger>
              </TabsList>
            </div>
          </Tabs>
          <div className="mt-4 space-y-6">
            {session.hits.map((hit) => (
              <CalmVerseBlock
                key={hit.verse.reference}
                hit={hit}
                audience={resultsAudience}
                listenRate={listenRate}
                onApplyListenPreset={applyListenPreset}
                onListenHint={setListenHint}
              />
            ))}
          </div>

          {listenHint ? (
            <p className="text-center text-sm text-muted-foreground" role="status">
              {listenHint}
            </p>
          ) : null}
        </section>
      ) : null}

      <p className="text-center text-sm text-muted-foreground">
        More Calm sheets and the full hub live on the{" "}
        <a href={calmHubUrl} className="text-primary underline underline-offset-4 hover:text-foreground">
          main site Calm page
        </a>{" "}
        — same spirit, extra tools when you want them.
      </p>
    </div>
  );
}
