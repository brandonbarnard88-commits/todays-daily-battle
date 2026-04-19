"use client";

import Link from "next/link";
import { useEffect, useId, useState } from "react";

import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TDBVerseBreakdown } from "@/components/tdb-verse-breakdown";
import { CANON_VERSION, dailyVerse, type TdbAudience } from "@/lib/daily-verse";
import { mergeVerseBreakdownForAudience } from "@/lib/verse-breakdown";
import { migratePilotLocalStorageOnce, appendSavedVerse, buildSavedVerseSnapshot } from "@/lib/tdb-study-db";
import { syncCanonSchemaVersion } from "@/lib/tdb-canon-version";
import { memorizeHrefForRef } from "@/lib/tdb-gentle-picks";
import { getMainSiteOrigin } from "@/lib/main-site";
import { cn } from "@/lib/utils";

export function FamilyRoomClient() {
  const audienceLabelId = useId();
  const [audience, setAudience] = useState<TdbAudience>("kid");
  const [saved, setSaved] = useState(false);

  const kidFields = mergeVerseBreakdownForAudience(dailyVerse, "kid");
  const kidsCornerUrl = `${getMainSiteOrigin()}/kids/corner.html`;

  useEffect(() => {
    void migratePilotLocalStorageOnce();
    syncCanonSchemaVersion(CANON_VERSION);
  }, []);

  const handleSave = async () => {
    const result = await appendSavedVerse(dailyVerse.reference, buildSavedVerseSnapshot(dailyVerse, audience));
    if (result.ok) {
      setSaved(true);
      window.setTimeout(() => setSaved(false), 2200);
    }
  };

  return (
    <div className="space-y-8">
      <Card className="tdb-print-verse border-border/70 shadow-none ring-1 ring-border/80">
        <CardHeader className="border-b border-border/50">
          <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">Today&apos;s KJV</p>
          <CardTitle className="font-heading text-2xl">{dailyVerse.reference}</CardTitle>
          <p className="text-sm text-muted-foreground">
            Same verse as the home page — tuned here for the table, car line, or bedtime without pressure.
          </p>
        </CardHeader>
        <CardContent className="space-y-6 pt-6">
          <blockquote className="font-heading border-l-4 border-primary/35 pl-5 text-lg leading-relaxed sm:text-xl">
            {dailyVerse.text}
          </blockquote>

          <div className="tdb-no-print flex flex-wrap gap-2">
            <Button type="button" variant="outline" size="sm" onClick={() => void handleSave()}>
              {saved ? "Saved ✓" : "Save to My Study"}
            </Button>
            <Link href={memorizeHrefForRef(dailyVerse.reference)} className={cn(buttonVariants({ variant: "outline", size: "sm" }))}>
              Memorize
            </Link>
            <Link href="/calm" className={cn(buttonVariants({ variant: "ghost", size: "sm" }))}>
              Calm room
            </Link>
            <Link href="/verse" className={cn(buttonVariants({ variant: "ghost", size: "sm" }))}>
              Verse room
            </Link>
            <Button type="button" variant="ghost" size="sm" onClick={() => window.print()}>
              Print this page
            </Button>
          </div>

          <Tabs
            className="tdb-no-print"
            value={audience}
            onValueChange={(v) => (v === "kid" || v === "teen" || v === "adult" ? setAudience(v) : undefined)}
          >
            <div className="rounded-lg border border-border/60 bg-muted/30 p-4">
              <p id={audienceLabelId} className="mb-3 text-sm font-medium text-foreground">
                Who&apos;s listening at your house?
              </p>
              <TabsList aria-labelledby={audienceLabelId} className="w-full flex-wrap justify-start gap-1">
                <TabsTrigger value="kid" className="text-xs">
                  Kid
                </TabsTrigger>
                <TabsTrigger value="teen" className="text-xs">
                  Teen
                </TabsTrigger>
                <TabsTrigger value="adult" className="text-xs">
                  Parent
                </TabsTrigger>
              </TabsList>
            </div>
          </Tabs>

          <TDBVerseBreakdown
            verse={dailyVerse}
            audience={audience}
            onAudienceChange={setAudience}
            showAudienceTabs={false}
            tabsLabelId={audienceLabelId}
          />

          <div className="rounded-lg border border-dashed border-primary/25 bg-muted/20 p-4 tdb-print-family-band">
            <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">Kids corner — gentle cue</p>
            <p className="mt-2 text-sm leading-relaxed text-foreground">
              <span className="font-medium">Draw or doodle: </span>
              {kidFields.realTalk}{" "}
              <span className="text-muted-foreground">
                (No grade — just let small hands stay near the truth while you read the KJV aloud.)
              </span>
            </p>
          </div>
        </CardContent>
      </Card>

      <Card className="border-border/70 shadow-none ring-1 ring-border/80">
        <CardHeader>
          <CardTitle className="font-heading text-lg">Parent dashboard (stub)</CardTitle>
          <p className="text-sm text-muted-foreground">
            Quick doors — same calm spirit, a little more structure when you want it.
          </p>
        </CardHeader>
        <CardContent className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
          <Link href="/plans/parenting" className={cn(buttonVariants({ variant: "secondary" }))}>
            Parenting plan (7 days)
          </Link>
          <Link href="/plans/family" className={cn(buttonVariants({ variant: "secondary" }))}>
            Family worship plan
          </Link>
          <Link href="/calm" className={cn(buttonVariants({ variant: "outline" }))}>
            Calm moods
          </Link>
          <a href={kidsCornerUrl} className={cn(buttonVariants({ variant: "outline" }))}>
            Kids Corner (main site) →
          </a>
        </CardContent>
      </Card>
    </div>
  );
}
