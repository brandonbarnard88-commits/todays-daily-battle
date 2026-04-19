"use client";

import { useId, useMemo, useState } from "react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { CanonVerse, TdbAudience, VerseBreakdownFields } from "@/lib/daily-verse";
import { mergeVerseBreakdownForAudience } from "@/lib/verse-breakdown";
import { cn } from "@/lib/utils";

const AUDIENCE_LABEL: Record<TdbAudience, string> = {
  kid: "Kid",
  teen: "Teen",
  adult: "Adult",
};

export type TDBVerseBreakdownProps = {
  verse: CanonVerse;
  /** Controlled audience (kid / teen / adult). */
  audience?: TdbAudience;
  defaultAudience?: TdbAudience;
  onAudienceChange?: (next: TdbAudience) => void;
  showAudienceTabs?: boolean;
  /** Device snapshot: show saved copy instead of merging from canon. */
  frozenBreakdown?: VerseBreakdownFields;
  className?: string;
  tabsLabelId?: string;
  /** On dedicated pages (e.g. /verse), open every section by default — still collapsible. */
  expandAllByDefault?: boolean;
};

export function TDBVerseBreakdown({
  verse,
  audience: audienceControlled,
  defaultAudience = "adult",
  onAudienceChange,
  showAudienceTabs = true,
  frozenBreakdown,
  className,
  tabsLabelId,
  expandAllByDefault = false,
}: TDBVerseBreakdownProps) {
  const reactId = useId().replace(/:/g, "");
  const [internalAudience, setInternalAudience] = useState<TdbAudience>(defaultAudience);
  const tier = audienceControlled ?? internalAudience;
  const setTier = (next: TdbAudience) => {
    onAudienceChange?.(next);
    if (audienceControlled === undefined) setInternalAudience(next);
  };

  const fields = frozenBreakdown ?? mergeVerseBreakdownForAudience(verse, tier);
  const prayerLine = verse.verseEchoPrompts?.[0];

  const defaultOpenValues = useMemo(() => {
    if (!expandAllByDefault) return [];
    const open = [
      `${reactId}-speaker`,
      `${reactId}-to`,
      `${reactId}-today`,
      `${reactId}-you`,
      `${reactId}-real`,
    ];
    if (prayerLine) open.push(`${reactId}-pray`);
    return open;
  }, [expandAllByDefault, reactId, prayerLine]);

  const accordion = (
    <Accordion
      key={frozenBreakdown ? "snap" : tier}
      multiple
      defaultValue={defaultOpenValues}
      className="rounded-lg border border-border/60 bg-muted/20"
    >
      <AccordionItem value={`${reactId}-speaker`}>
        <AccordionTrigger className="px-4 text-left">Who&apos;s talking</AccordionTrigger>
        <AccordionContent className="px-4 text-muted-foreground">{fields.speaker}</AccordionContent>
      </AccordionItem>
      <AccordionItem value={`${reactId}-to`}>
        <AccordionTrigger className="px-4 text-left">Who they were talking to</AccordionTrigger>
        <AccordionContent className="px-4 text-muted-foreground">{fields.audience}</AccordionContent>
      </AccordionItem>
      <AccordionItem value={`${reactId}-today`}>
        <AccordionTrigger className="px-4 text-left">How it relates to today</AccordionTrigger>
        <AccordionContent className="px-4 text-muted-foreground">{fields.relatesToToday}</AccordionContent>
      </AccordionItem>
      <AccordionItem value={`${reactId}-you`}>
        <AccordionTrigger className="px-4 text-left">How it relates to you</AccordionTrigger>
        <AccordionContent className="px-4 text-muted-foreground">{fields.relatesToYou}</AccordionContent>
      </AccordionItem>
      <AccordionItem value={`${reactId}-real`}>
        <AccordionTrigger className="px-4 text-left">Real talk (plain English)</AccordionTrigger>
        <AccordionContent className="px-4 text-muted-foreground">{fields.realTalk}</AccordionContent>
      </AccordionItem>
      {prayerLine ? (
        <AccordionItem value={`${reactId}-pray`}>
          <AccordionTrigger className="px-4 text-left">Gentle prayer nudge (optional)</AccordionTrigger>
          <AccordionContent className="px-4 text-muted-foreground">{prayerLine}</AccordionContent>
        </AccordionItem>
      ) : null}
    </Accordion>
  );

  const printBlock = (
    <div className="tdb-print-breakdown-print mt-6 hidden print:block">
      <p className="tdb-print-breakdown-heading text-xs font-medium uppercase tracking-widest text-muted-foreground">
        Gentle breakdown (print)
        {frozenBreakdown ? " — saved copy" : ` — ${AUDIENCE_LABEL[tier]}`}
      </p>
      {!frozenBreakdown ? (
        <p className="tdb-print-audience-tier-note audience-tier-note mt-2 text-sm text-muted-foreground">
          Printed for the <strong>{AUDIENCE_LABEL[tier]}</strong> wording — same KJV verse above.
        </p>
      ) : (
        <p className="tdb-print-audience-tier-note audience-tier-note mt-2 text-sm text-muted-foreground">
          Text and notes as saved on your device.
        </p>
      )}
      <dl className="tdb-print-breakdown-dl mt-4 space-y-0 text-sm text-foreground">
        <div className="tdb-print-breakdown-pair">
          <dt className="tdb-print-breakdown-dt">Who&apos;s talking</dt>
          <dd className="tdb-print-breakdown-dd text-muted-foreground">{fields.speaker}</dd>
        </div>
        <div className="tdb-print-breakdown-pair">
          <dt className="tdb-print-breakdown-dt">Who they were talking to</dt>
          <dd className="tdb-print-breakdown-dd text-muted-foreground">{fields.audience}</dd>
        </div>
        <div className="tdb-print-breakdown-pair">
          <dt className="tdb-print-breakdown-dt">How it relates to today</dt>
          <dd className="tdb-print-breakdown-dd text-muted-foreground">{fields.relatesToToday}</dd>
        </div>
        <div className="tdb-print-breakdown-pair">
          <dt className="tdb-print-breakdown-dt">How it relates to you</dt>
          <dd className="tdb-print-breakdown-dd text-muted-foreground">{fields.relatesToYou}</dd>
        </div>
        <div className="tdb-print-breakdown-pair">
          <dt className="tdb-print-breakdown-dt">Real talk</dt>
          <dd className="tdb-print-breakdown-dd text-muted-foreground">{fields.realTalk}</dd>
        </div>
        {prayerLine ? (
          <div className="tdb-print-breakdown-pair">
            <dt className="tdb-print-breakdown-dt">Gentle prayer nudge</dt>
            <dd className="tdb-print-breakdown-dd text-muted-foreground">{prayerLine}</dd>
          </div>
        ) : null}
      </dl>
    </div>
  );

  if (!showAudienceTabs || frozenBreakdown) {
    return (
      <div className="tdb-verse-breakdown">
        <div className={cn("tdb-no-print", className)}>{accordion}</div>
        {printBlock}
      </div>
    );
  }

  return (
    <div className="tdb-verse-breakdown">
      <div className={cn("tdb-no-print rounded-lg border border-border/60 bg-muted/30 p-4", className)}>
        {tabsLabelId ? (
          <p id={tabsLabelId} className="mb-3 text-sm font-medium text-foreground">
            Same verse — gentle words for who&apos;s listening
          </p>
        ) : null}
        <Tabs
          value={tier}
          onValueChange={(v) => (v === "kid" || v === "teen" || v === "adult" ? setTier(v) : undefined)}
        >
          <TabsList
            aria-labelledby={tabsLabelId}
            className="mb-4 w-full min-w-0 flex-wrap justify-start gap-1"
          >
            {(Object.keys(AUDIENCE_LABEL) as TdbAudience[]).map((key) => (
              <TabsTrigger key={key} value={key} className="text-xs">
                {AUDIENCE_LABEL[key]}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
        {accordion}
      </div>
      {printBlock}
    </div>
  );
}
