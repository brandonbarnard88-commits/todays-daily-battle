"use client";

import Link from "next/link";
import { useCallback, useEffect, useId, useMemo, useState } from "react";

import { Button, buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  applyTdbTheme,
  readInitialTdbTheme,
  type TdbThemeId,
  TDB_THEME_LABEL,
} from "@/lib/tdb-theme";
import { cn } from "@/lib/utils";
import { Moon, Scroll, SunMedium } from "lucide-react";

/**
 * Pilot homepage — pattern for migrated routes.
 * Daily verse: replace with build-time data / same source as static `index.html` when wired.
 */
const dailyVerse = {
  reference: "Isaiah 40:31",
  text: "But they that wait upon the Lord shall renew their strength; they shall mount up with wings as eagles; they shall run, and not be weary; and they shall walk, and not faint.",
  breakdown: {
    speaker: "Isaiah, speaking God’s word",
    audience: "God’s people in exhaustion and exile — anyone whose strength has run out",
    plain:
      "When we wait on the Lord instead of rushing our own fix, He renews us. We can keep going — not by sheer willpower, but by His strength.",
  },
  byAudience: {
    kid: "When we slow down and trust God instead of panicking, He helps our hearts feel strong again — like we can keep going.",
    teen: "If you feel burned out or behind, this verse says strength comes from waiting on God — not from forcing everything yourself.",
    adult:
      "When the day is long and your tank is empty, God invites you to wait on Him. That kind of waiting is active trust — and He meets you with endurance.",
  },
} as const;

type Audience = "kid" | "teen" | "adult";

const THEME_ORDER: TdbThemeId[] = ["light", "dark", "sepia"];

const verseJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "Today's Daily Battle",
  description:
    "A quiet place for real battles — KJV daily verse and gentle tools. No ads. No tracking.",
  inLanguage: "en",
  mainEntity: {
    "@type": "Quotation",
    text: dailyVerse.text,
    name: dailyVerse.reference,
    citation: `King James Version, ${dailyVerse.reference}`,
    isPartOf: {
      "@type": "Book",
      name: "Holy Bible",
      bookEdition: "King James Version",
    },
  },
};

export default function Home() {
  const audienceTabsId = useId();
  const [theme, setTheme] = useState<TdbThemeId | null>(null);
  const [audience, setAudience] = useState<Audience>("adult");
  const [saved, setSaved] = useState(false);
  const [prayOpen, setPrayOpen] = useState(false);

  useEffect(() => {
    const initial = readInitialTdbTheme();
    setTheme(initial);
    applyTdbTheme(initial);
  }, []);

  const setTdbTheme = useCallback((next: TdbThemeId) => {
    setTheme(next);
    applyTdbTheme(next);
  }, []);

  const handleListen = useCallback(() => {
    if (typeof window === "undefined" || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(dailyVerse.text);
    u.rate = 0.85;
    window.speechSynthesis.speak(u);
  }, []);

  const handleSave = useCallback(() => {
    try {
      const raw = window.localStorage.getItem("tdb-saved-verses-pilot");
      const list = raw ? (JSON.parse(raw) as unknown[]) : [];
      list.push({
        reference: dailyVerse.reference,
        savedAt: new Date().toISOString(),
      });
      window.localStorage.setItem("tdb-saved-verses-pilot", JSON.stringify(list));
    } catch {
      window.localStorage.setItem(
        "tdb-saved-verses-pilot",
        JSON.stringify([{ reference: dailyVerse.reference, savedAt: new Date().toISOString() }]),
      );
    }
    setSaved(true);
    window.setTimeout(() => setSaved(false), 2200);
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

  const themeIcon = (id: TdbThemeId) => {
    if (id === "dark") return <Moon className="size-3.5 shrink-0 opacity-80" aria-hidden />;
    if (id === "sepia") return <Scroll className="size-3.5 shrink-0 opacity-80" aria-hidden />;
    return <SunMedium className="size-3.5 shrink-0 opacity-80" aria-hidden />;
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(verseJsonLd) }}
      />

      <div className="min-h-screen">
        <nav
          aria-label="Primary"
          className="tdb-no-print sticky top-0 z-50 border-b border-border/60 bg-background/85 backdrop-blur-md supports-[backdrop-filter]:bg-background/70"
        >
          <div className="mx-auto flex max-w-3xl flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6 sm:py-4">
            <Link
              href="/"
              className="font-heading text-lg font-semibold tracking-tight text-foreground sm:text-xl"
            >
              Today&apos;s Daily Battle
            </Link>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground">
              <Link className="underline-offset-4 hover:text-foreground hover:underline" href="/verse">
                Today&apos;s Verse
              </Link>
              <Link className="underline-offset-4 hover:text-foreground hover:underline" href="/plans">
                Battle Plans
              </Link>
              <Link className="underline-offset-4 hover:text-foreground hover:underline" href="/calm">
                Calm
              </Link>
              <Link className="underline-offset-4 hover:text-foreground hover:underline" href="/mystudy">
                My Study
              </Link>
              <Link
                href="/family"
                className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "text-muted-foreground")}
              >
                Family
              </Link>
            </div>
          </div>
        </nav>

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
              <blockquote className="font-heading border-l-4 border-primary/35 pl-5 text-xl font-normal leading-relaxed text-foreground sm:text-2xl">
                {dailyVerse.text}
              </blockquote>

              <div
                className="mt-8 rounded-lg border border-border/60 bg-muted/30 p-4"
                role="tablist"
                aria-labelledby={`${audienceTabsId}-label`}
              >
                <p id={`${audienceTabsId}-label`} className="mb-3 text-sm font-medium text-foreground">
                  Same verse — gentle words for who&apos;s listening
                </p>
                <div className="flex flex-wrap gap-2">
                  {(Object.keys(audienceLabel) as Audience[]).map((key) => (
                    <Button
                      key={key}
                      type="button"
                      role="tab"
                      aria-selected={audience === key}
                      size="sm"
                      variant={audience === key ? "default" : "ghost"}
                      className="text-xs"
                      onClick={() => setAudience(key)}
                    >
                      {audienceLabel[key]}
                    </Button>
                  ))}
                </div>
                <p
                  role="tabpanel"
                  className="mt-4 text-sm leading-relaxed text-muted-foreground"
                  aria-live="polite"
                >
                  {dailyVerse.byAudience[audience]}
                </p>
              </div>

              <div className="mt-10 grid gap-6 text-sm sm:grid-cols-3">
                <div>
                  <p className="font-medium text-foreground">Who said it?</p>
                  <p className="mt-1 text-muted-foreground">{dailyVerse.breakdown.speaker}</p>
                </div>
                <div>
                  <p className="font-medium text-foreground">To whom?</p>
                  <p className="mt-1 text-muted-foreground">{dailyVerse.breakdown.audience}</p>
                </div>
                <div>
                  <p className="font-medium text-foreground">Plain English</p>
                  <p className="mt-1 text-muted-foreground">{dailyVerse.breakdown.plain}</p>
                </div>
              </div>

              <div className="tdb-no-print mt-10 flex flex-wrap gap-2">
                <Button type="button" onClick={handleListen}>
                  Listen slow
                </Button>
                <Button type="button" variant="outline" onClick={handleSave}>
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
            <CardFooter className="flex flex-col items-stretch gap-2 border-t border-border/50 text-center text-xs text-muted-foreground sm:items-center">
              <p>
                Pilot note: saves use a scratch localStorage key until IndexedDB + My Study parity
                ships — your live site data is untouched.
              </p>
            </CardFooter>
          </Card>

          <div className="grid gap-6 md:grid-cols-3">
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

          <p
            role="note"
            className="mt-16 text-center text-xs leading-relaxed text-muted-foreground sm:mt-20"
          >
            Built solo by Brandon · A quiet place · We battle. He wins. We&apos;re not perfect; He
            is.
            <br />
            Everything stays on this device until you choose to export or sync.
          </p>
        </main>
      </div>
    </>
  );
}
