"use client";

import Link from "next/link";
import { useCallback, useEffect, useId, useState } from "react";

import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TDBVerseBreakdown } from "@/components/tdb-verse-breakdown";
import type { BattlePlan } from "@/lib/battle-plans";
import { CANON_VERSION, resolveVerseByRef, type TdbAudience } from "@/lib/daily-verse";
import { migratePilotLocalStorageOnce, appendSavedVerse, buildSavedVerseSnapshot } from "@/lib/tdb-study-db";
import { getPlanDayPointer, setPlanDayPointer } from "@/lib/tdb-plans-progress";
import { syncCanonSchemaVersion } from "@/lib/tdb-canon-version";
import { memorizeHrefForRef } from "@/lib/tdb-gentle-picks";
import { cn } from "@/lib/utils";

export function PlanRoomClient({ plan }: { plan: BattlePlan }) {
  const audienceLabelId = useId();
  const maxDay = plan.days.length;
  const [day, setDay] = useState(1);
  const [hydrated, setHydrated] = useState(false);
  const [audience, setAudience] = useState<TdbAudience>("adult");
  const [familyEdition, setFamilyEdition] = useState(false);
  const [saved, setSaved] = useState(false);

  const current = plan.days.find((d) => d.day === day) ?? plan.days[0];
  const { verse, matchedRef } = resolveVerseByRef(current.reference);
  const breakdownAudience: TdbAudience = familyEdition ? "kid" : audience;

  useEffect(() => {
    void migratePilotLocalStorageOnce();
    syncCanonSchemaVersion(CANON_VERSION);
  }, []);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      const d = await getPlanDayPointer(plan.slug);
      if (!cancelled) {
        setDay(Math.min(Math.max(1, d), maxDay));
        setHydrated(true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [plan.slug, maxDay]);

  const persistDay = useCallback(
    (next: number) => {
      const clamped = Math.min(Math.max(1, next), maxDay);
      setDay(clamped);
      void setPlanDayPointer(plan.slug, clamped, maxDay);
    },
    [maxDay, plan.slug],
  );

  const handleSave = useCallback(async () => {
    const result = await appendSavedVerse(verse.reference, buildSavedVerseSnapshot(verse, breakdownAudience));
    if (result.ok) {
      setSaved(true);
      window.setTimeout(() => setSaved(false), 2200);
    }
  }, [breakdownAudience, verse]);

  const handlePrintPack = useCallback(() => {
    window.print();
  }, []);

  return (
    <div className="space-y-8">
      <Card className="border-border/70 shadow-none ring-1 ring-border/80">
        <CardHeader className="border-b border-border/50">
          <CardTitle className="font-heading text-2xl">{plan.title}</CardTitle>
          <p className="text-sm leading-relaxed text-muted-foreground">{plan.tagline}</p>
          <p className="text-xs text-muted-foreground">
            Pick up where you left off — no pressure, just habit through heart. Progress stays on this device.
          </p>
        </CardHeader>
        <CardContent className="space-y-4 pt-6">
          <div className="tdb-no-print flex flex-wrap items-center gap-2">
            <span className="text-sm text-muted-foreground">Day</span>
            {plan.days.map((d) => (
              <Button
                key={d.day}
                type="button"
                size="sm"
                variant={d.day === day ? "default" : "outline"}
                className="min-w-9 px-2"
                onClick={() => persistDay(d.day)}
              >
                {d.day}
              </Button>
            ))}
          </div>
          {!hydrated ? (
            <p className="text-sm text-muted-foreground">Opening your place in this plan…</p>
          ) : (
            <p className="text-sm font-medium text-foreground">
              Day {day} of {maxDay}
              {current.gentleNote ? (
                <span className="mt-1 block text-sm font-normal text-muted-foreground">{current.gentleNote}</span>
              ) : null}
            </p>
          )}

          <div className="tdb-no-print flex flex-wrap gap-2">
            <Button type="button" variant="outline" size="sm" onClick={() => persistDay(day - 1)} disabled={day <= 1}>
              Previous day
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => persistDay(day + 1)}
              disabled={day >= maxDay}
            >
              Next day
            </Button>
            <Button type="button" variant="secondary" size="sm" onClick={() => persistDay(day)}>
              Save my place (this day)
            </Button>
          </div>

          <div className="tdb-no-print flex flex-wrap items-center gap-3 rounded-lg border border-border/60 bg-muted/20 px-3 py-3">
            <label className="flex cursor-pointer items-center gap-2 text-sm text-foreground">
              <input
                type="checkbox"
                className="size-4 rounded border-input"
                checked={familyEdition}
                onChange={(e) => setFamilyEdition(e.target.checked)}
              />
              Family edition (kid-friendly wording for supper table)
            </label>
          </div>
        </CardContent>
      </Card>

      <Card className="tdb-print-verse border-border/70 shadow-none ring-1 ring-border/80">
        <CardHeader className="border-b border-border/50 pb-4">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <CardTitle className="font-heading text-xl sm:text-2xl">{verse.reference}</CardTitle>
            {!matchedRef ? (
              <span className="text-xs text-amber-700 dark:text-amber-200">Gentle note: ref not in pilot catalog — showing today.</span>
            ) : null}
          </div>
        </CardHeader>
        <CardContent className="space-y-6 pt-6">
          <blockquote className="font-heading border-l-4 border-primary/35 pl-5 text-lg leading-relaxed sm:text-xl">
            {verse.text}
          </blockquote>

          <div className="tdb-no-print flex flex-wrap gap-2">
            <Button type="button" variant="outline" size="sm" onClick={() => void handleSave()}>
              {saved ? "Saved ✓" : "Save to My Study"}
            </Button>
            <Link href={memorizeHrefForRef(verse.reference)} className={cn(buttonVariants({ variant: "outline", size: "sm" }))}>
              Memorize
            </Link>
            <Link href="/calm" className={cn(buttonVariants({ variant: "ghost", size: "sm" }))}>
              Heavy? Calm room
            </Link>
            <Link href="/verse" className={cn(buttonVariants({ variant: "ghost", size: "sm" }))}>
              Verse room
            </Link>
            <Button type="button" variant="ghost" size="sm" onClick={handlePrintPack}>
              Print this day
            </Button>
          </div>

          {!familyEdition ? (
            <Tabs
              className="tdb-no-print"
              value={audience}
              onValueChange={(v) => (v === "kid" || v === "teen" || v === "adult" ? setAudience(v) : undefined)}
            >
              <div className="rounded-lg border border-border/60 bg-muted/30 p-4">
                <p id={audienceLabelId} className="mb-3 text-sm font-medium text-foreground">
                  Gentle breakdown — who&apos;s listening
                </p>
                <TabsList aria-labelledby={audienceLabelId} className="w-full flex-wrap justify-start gap-1">
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
          ) : (
            <p className="tdb-no-print text-sm text-muted-foreground">Showing shorter, table-ready wording for little ears.</p>
          )}

          <TDBVerseBreakdown
            verse={verse}
            audience={breakdownAudience}
            onAudienceChange={familyEdition ? undefined : setAudience}
            showAudienceTabs={false}
            tabsLabelId={audienceLabelId}
          />
        </CardContent>
      </Card>
    </div>
  );
}
