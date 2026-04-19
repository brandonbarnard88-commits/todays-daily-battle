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

  const defaultOpenValues = useMemo(() => {
    if (!expandAllByDefault) return [];
    return [
      `${reactId}-speaker`,
      `${reactId}-to`,
      `${reactId}-today`,
      `${reactId}-you`,
      `${reactId}-real`,
    ];
  }, [expandAllByDefault, reactId]);

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
    </Accordion>
  );

  const printBlock = (
    <div className="tdb-print-breakdown-print mt-6 hidden print:block">
      <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
        Gentle breakdown (print)
        {frozenBreakdown ? " — saved copy" : ` — ${AUDIENCE_LABEL[tier]}`}
      </p>
      <dl className="mt-3 space-y-3 text-sm text-foreground">
        <div>
          <dt className="font-medium">Who&apos;s talking</dt>
          <dd className="text-muted-foreground">{fields.speaker}</dd>
        </div>
        <div>
          <dt className="font-medium">Who they were talking to</dt>
          <dd className="text-muted-foreground">{fields.audience}</dd>
        </div>
        <div>
          <dt className="font-medium">How it relates to today</dt>
          <dd className="text-muted-foreground">{fields.relatesToToday}</dd>
        </div>
        <div>
          <dt className="font-medium">How it relates to you</dt>
          <dd className="text-muted-foreground">{fields.relatesToYou}</dd>
        </div>
        <div>
          <dt className="font-medium">Real talk</dt>
          <dd className="text-muted-foreground">{fields.realTalk}</dd>
        </div>
      </dl>
    </div>
  );

  if (!showAudienceTabs || frozenBreakdown) {
    return (
      <>
        <div className={cn("tdb-no-print", className)}>{accordion}</div>
        {printBlock}
      </>
    );
  }

  return (
    <>
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
    </>
  );
}
