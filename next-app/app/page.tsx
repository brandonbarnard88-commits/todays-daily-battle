"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useId, useMemo, useState } from "react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TdbPageFooter } from "@/components/tdb-page-footer";
import { TdbSiteNav } from "@/components/tdb-site-nav";
import { CANON_VERSION, dailyVerse } from "@/lib/daily-verse";
import { syncCanonSchemaVersion } from "@/lib/tdb-canon-version";
import { buildHomeVerseJsonLd } from "@/lib/verse-jsonld";
import {
  applyTdbTheme,
  readInitialTdbTheme,
  type TdbThemeId,
  TDB_THEME_LABEL,
} from "@/lib/tdb-theme";
import { LISTEN_PRESETS, presetForRate, readListenRate, writeListenRate } from "@/lib/tdb-listen-rate";
import { migratePilotLocalStorageOnce, appendSavedVerse } from "@/lib/tdb-study-db";
import { cn } from "@/lib/utils";
import { Moon, Scroll, SunMedium } from "lucide-react";

type Audience = "kid" | "teen" | "adult";

const THEME_ORDER: TdbThemeId[] = ["light", "dark", "sepia"];

export default function Home() {
  const pathname = usePathname();
  const audienceLabelId = useId();
  const [theme, setTheme] = useState<TdbThemeId | null>(null);
  const [audience, setAudience] = useState<Audience>("adult");
  const [saved, setSaved] = useState(false);
  const [prayOpen, setPrayOpen] = useState(false);
  const [listenRate, setListenRate] = useState(readListenRate);
  const [listenHint, setListenHint] = useState<string | null>(null);

  useEffect(() => {
    const initial = readInitialTdbTheme();
    // eslint-disable-next-line react-hooks/set-state-in-effect -- theme comes from localStorage after mount (no SSR storage)
    setTheme(initial);
    applyTdbTheme(initial);
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

  const setTdbTheme = useCallback((next: TdbThemeId) => {
    setTheme(next);
    applyTdbTheme(next);
  }, []);

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
    const result = await appendSavedVerse(dailyVerse.reference);
    if (result.ok) {
      setSaved(true);
      window.setTimeout(() => setSaved(false), 2200);
    }
  }, []);

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

  const audienceLabel = useMemo(
    () => ({ kid: "Kid", teen: "Teen", adult: "Adult" } as const),
    [],
  );

  const activePreset = presetForRate(listenRate);

  const themeIcon = (id: TdbThemeId) => {
    if (id === "dark") return <Moon className="size-3.5 shrink-0 opacity-80" aria-hidden />;
    if (id === "sepia") return <Scroll className="size-3.5 shrink-0 opacity-80" aria-hidden />;
    return <SunMedium className="size-3.5 shrink-0 opacity-80" aria-hidden />;
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(buildHomeVerseJsonLd()) }}
      />

      <div className="min-h-screen">
        <TdbSiteNav currentPath={pathname ?? "/"} />

        <main className="mx-auto max-w-3xl px-4 pb-24 pt-10 sm:px-6 sm:pt-12">
          <header className="mb-12 text-center sm:mb-16">
            <p className="mb-3 text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
              KJV only · Private · No pressure
            </p>
            <h1 className="font-heading text-4xl font-semibold leading-tight text-foreground sm:text-5xl md:text-6xl">
              A quiet place
              <br />
              for real battles
            </h1>
            <p className="mx-auto mt-5 max-w-md text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">
              Anxiety. Parenting. Grief. Fear. The long days of raising little ones. One gentle KJV
              word to steady your heart. Nothing else required.
            </p>
          </header>

          <Card className="tdb-print-verse mb-14 border-border/70 shadow-none ring-1 ring-border/80 sm:mb-16">
            <CardHeader className="gap-4 border-b border-border/50 pb-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
                  Today&apos;s verse
                </p>
                <CardTitle className="mt-2 font-heading text-2xl font-semibold sm:text-3xl">
                  {dailyVerse.reference}
                </CardTitle>
              </div>
              <div
                className="tdb-no-print flex flex-wrap gap-2"
                role="group"
                aria-label="Appearance: Daylight, Quiet night, or Dawn parchment"
              >
                {THEME_ORDER.map((id) => (
                  <Button
                    key={id}
                    size="sm"
                    variant={theme === id ? "default" : "outline"}
                    aria-pressed={theme === id}
                    onClick={() => setTdbTheme(id)}
                    className="gap-1.5 text-xs"
                  >
                    {themeIcon(id)}
                    {TDB_THEME_LABEL[id]}
                  </Button>
                ))}
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <blockquote className="tdb-speakable-verse font-heading border-l-4 border-primary/35 pl-5 text-xl font-normal leading-relaxed text-foreground sm:text-2xl">
                {dailyVerse.text}
              </blockquote>

              <div className="tdb-no-print mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
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
                <p className="tdb-no-print mt-3 text-sm text-muted-foreground" role="status" aria-live="polite">
                  {listenHint}
                </p>
              ) : null}

              <Tabs
                className="tdb-no-print mt-8"
                value={audience}
                onValueChange={(v) => {
                  if (v === "kid" || v === "teen" || v === "adult") setAudience(v);
                }}
              >
                <div className="rounded-lg border border-border/60 bg-muted/30 p-4">
                  <p id={audienceLabelId} className="mb-3 text-sm font-medium text-foreground">
                    Same verse — gentle words for who&apos;s listening
                  </p>
                  <TabsList aria-labelledby={audienceLabelId} className="mb-4 w-full min-w-0 flex-wrap justify-start gap-1">
                    {(Object.keys(audienceLabel) as Audience[]).map((key) => (
                      <TabsTrigger key={key} value={key} className="text-xs">
                        {audienceLabel[key]}
                      </TabsTrigger>
                    ))}
                  </TabsList>
                  {(Object.keys(audienceLabel) as Audience[]).map((key) => (
                    <TabsContent key={key} value={key} className="mt-0 text-sm leading-relaxed text-muted-foreground">
                      {dailyVerse.byAudience[key]}
                    </TabsContent>
                  ))}
                </div>
              </Tabs>

              <Accordion
                multiple
                defaultValue={[]}
                className="tdb-no-print mt-8 rounded-lg border border-border/60 bg-muted/20"
              >
                <AccordionItem value="speaker">
                  <AccordionTrigger className="px-4">Who said it?</AccordionTrigger>
                  <AccordionContent className="px-4 text-muted-foreground">
                    {dailyVerse.breakdown.speaker}
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="audience">
                  <AccordionTrigger className="px-4">To whom?</AccordionTrigger>
                  <AccordionContent className="px-4 text-muted-foreground">
                    {dailyVerse.breakdown.audience}
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="plain">
                  <AccordionTrigger className="px-4">Plain English</AccordionTrigger>
                  <AccordionContent className="px-4 text-muted-foreground">
                    {dailyVerse.breakdown.plain}
                  </AccordionContent>
                </AccordionItem>
              </Accordion>

              <div className="tdb-print-breakdown-print mt-6 hidden print:block">
                <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
                  Gentle breakdown (print)
                </p>
                <dl className="mt-3 space-y-3 text-sm text-foreground">
                  <div>
                    <dt className="font-medium">Who said it?</dt>
                    <dd className="text-muted-foreground">{dailyVerse.breakdown.speaker}</dd>
                  </div>
                  <div>
                    <dt className="font-medium">To whom?</dt>
                    <dd className="text-muted-foreground">{dailyVerse.breakdown.audience}</dd>
                  </div>
                  <div>
                    <dt className="font-medium">Plain English</dt>
                    <dd className="text-muted-foreground">{dailyVerse.breakdown.plain}</dd>
                  </div>
                </dl>
              </div>

              <div className="tdb-no-print mt-10 flex flex-wrap gap-2">
                <Button type="button" variant="outline" onClick={() => void handleSave()}>
                  {saved ? "Saved — My Study ✓" : "Save to My Study"}
                </Button>
                <Link
                  href={`/memorize?ref=${encodeURIComponent(dailyVerse.reference)}`}
                  className={cn(buttonVariants({ variant: "outline", size: "default" }))}
                >
                  Memorize
                </Link>
              </div>
              <div className="tdb-no-print mt-3 flex flex-wrap gap-2">
                <Link
                  href="/verse"
                  className={cn(buttonVariants({ variant: "ghost", size: "sm" }))}
                >
                  Study
                </Link>
                <Button type="button" variant="ghost" size="sm" onClick={() => setPrayOpen((o) => !o)}>
                  {prayOpen ? "Close prayer" : "Pray this with me"}
                </Button>
                <Button type="button" variant="ghost" size="sm" onClick={handleShare}>
                  Share
                </Button>
              </div>
              {prayOpen ? (
                <p className="mt-4 rounded-md border border-dashed border-border/70 bg-muted/20 p-4 text-sm leading-relaxed text-muted-foreground">
                  Lord, I&apos;m tired. Teach me what it means to wait on You today — not passive
                  giving up, but trusting You with the next breath. Renew my strength for what&apos;s
                  in front of me. In Jesus&apos; name, Amen.
                </p>
              ) : null}
            </CardContent>
          </Card>

          <div className="tdb-no-print grid gap-6 md:grid-cols-3">
            <Link href="/calm" className="group block rounded-xl outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring">
              <Card className="h-full transition-[box-shadow,transform] group-hover:ring-1 group-hover:ring-primary/25">
                <CardHeader>
                  <CardTitle className="text-base">Heavy right now?</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    One gentle verse in a tap. No judgment.
                  </p>
                </CardHeader>
              </Card>
            </Link>
            <Link href="/plans" className="group block rounded-xl outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring">
              <Card className="h-full transition-[box-shadow,transform] group-hover:ring-1 group-hover:ring-primary/25">
                <CardHeader>
                  <CardTitle className="text-base">Battle Plans</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    7–40 day KJV lanes for fear, grief, family, peace. Pick up where you left off.
                  </p>
                </CardHeader>
              </Card>
            </Link>
            <Link href="/family" className="group block rounded-xl outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring">
              <Card className="h-full transition-[box-shadow,transform] group-hover:ring-1 group-hover:ring-primary/25">
                <CardHeader>
                  <CardTitle className="text-base">Family &amp; kids</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Low-pressure rhythms and printables. You&apos;re not behind.
                  </p>
                </CardHeader>
              </Card>
            </Link>
          </div>

          <TdbPageFooter />
        </main>
      </div>
    </>
  );
}
