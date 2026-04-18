"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

import { Button, buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  TDBCard,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { TdbPageFooter } from "@/components/tdb-page-footer";
import { TdbSiteNav } from "@/components/tdb-site-nav";
import { dailyVerse, verseEchoPrompts } from "@/lib/daily-verse";
import { getMainSiteOrigin } from "@/lib/main-site";
import {
  addPrivatePrayer,
  clearPendingFlush,
  listPendingFlush,
  listPrivatePrayers,
  readHouseholdShareCode,
  writeHouseholdShareCode,
  type PrivatePrayer,
} from "@/lib/tdb-prayer-local";
import { cn } from "@/lib/utils";

function formatWhen(iso: string) {
  try {
    return new Date(iso).toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" });
  } catch {
    return iso;
  }
}

export default function PrayerWallPage() {
  const pathname = usePathname();
  const [draft, setDraft] = useState("");
  const [prayers, setPrayers] = useState<PrivatePrayer[]>([]);
  const [pending, setPending] = useState(0);
  const [flushMsg, setFlushMsg] = useState<string | null>(null);
  const [household, setHousehold] = useState("");
  const [householdSavedHint, setHouseholdSavedHint] = useState(false);

  const refresh = useCallback(() => {
    setPrayers(listPrivatePrayers());
    setPending(listPendingFlush().length);
  }, []);

  useEffect(() => {
    queueMicrotask(() => {
      setHousehold(readHouseholdShareCode());
      refresh();
    });
  }, [refresh]);

  useEffect(() => {
    const onOnline = () => {
      const n = listPendingFlush().length;
      if (n > 0) {
        clearPendingFlush();
        setPending(0);
        setFlushMsg(
          `Back online — ${n} queued line(s) cleared here. When you sign in on the main site, anything that syncs there is separate from this local queue.`,
        );
        window.setTimeout(() => setFlushMsg(null), 8000);
      }
    };
    window.addEventListener("online", onOnline);
    return () => window.removeEventListener("online", onOnline);
  }, []);

  const submitPrivate = useCallback(() => {
    const row = addPrivatePrayer(draft);
    if (row) {
      setDraft("");
      refresh();
    }
  }, [draft, refresh]);

  const appendVerseEcho = useCallback(() => {
    const line = `${dailyVerse.reference} — ${dailyVerse.text.slice(0, 200)}…`;
    setDraft((d) => (d ? `${d}\n\n${line}` : line));
  }, []);

  const appendPrompt = useCallback((line: string) => {
    setDraft((d) => (d ? `${d}\n\n${line}` : line));
  }, []);

  const sharedWallUrl = `${getMainSiteOrigin()}/prayer-wall.html?tab=with-others`;

  return (
    <div className="min-h-screen">
      <TdbSiteNav currentPath={pathname ?? "/prayer-wall"} />

      <main className="mx-auto max-w-3xl px-4 pb-24 pt-10 sm:px-6 sm:pt-12">
        <header className="mb-10 text-center">
          <p className="mb-2 text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
            Local first · No performance
          </p>
          <h1 className="font-heading text-3xl font-semibold text-foreground sm:text-4xl">Prayer</h1>
          <p className="mx-auto mt-3 max-w-md text-pretty text-sm leading-relaxed text-muted-foreground">
            Two quiet doors — private lines stay here until you choose the shared wall on the main
            site.
          </p>
        </header>

        <Tabs defaultValue="private" className="w-full">
          <TabsList className="mb-6 w-full max-w-md">
            <TabsTrigger value="private" className="flex-1">
              Private
            </TabsTrigger>
            <TabsTrigger value="shared" className="flex-1">
              With others
            </TabsTrigger>
          </TabsList>

          <TabsContent value="private" className="space-y-6 outline-none">
            <Card className="border-border/70 shadow-none ring-1 ring-border/80">
              <CardHeader>
                <CardTitle className="font-heading text-lg">Quiet room</CardTitle>
                <p className="text-sm text-muted-foreground">
                  One honest line. No feed, no score. Saved only on this device.
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                {flushMsg ? (
                  <p className="text-sm text-muted-foreground" role="status">
                    {flushMsg}
                  </p>
                ) : null}
                {pending > 0 ? (
                  <div
                    className="rounded-lg border border-amber-900/15 bg-muted/25 p-3 text-sm text-muted-foreground dark:border-amber-100/15"
                    role="status"
                  >
                    <p className="font-medium text-foreground">
                      {pending} prayer line{pending === 1 ? "" : "s"} waiting in the offline queue
                    </p>
                    <p className="mt-1.5 leading-relaxed">
                      Saved when your connection dropped. They stay on this device until you go online
                      (we clear the queue marker then) or tap{" "}
                      <span className="text-foreground">Clear offline queue</span> below.
                    </p>
                  </div>
                ) : null}

                <TDBCard variant="parchment" className="shadow-none ring-border/60">
                  <CardHeader className="pb-2">
                    <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
                      Optional · KJV echo
                    </p>
                    <CardTitle className="font-heading text-base text-foreground">
                      {dailyVerse.reference}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">
                      Borrow a phrase into your prayer — nothing posts unless you save privately below.
                    </p>
                  </CardHeader>
                  <CardContent className="space-y-3 pt-0">
                    <blockquote className="border-l-[3px] border-primary/35 pl-3 font-heading text-sm italic leading-relaxed text-foreground/95">
                      {dailyVerse.text.length > 220
                        ? `${dailyVerse.text.slice(0, 220).trim()}…`
                        : dailyVerse.text}
                    </blockquote>
                    <div className="flex flex-wrap gap-2">
                      {verseEchoPrompts.map((p) => (
                        <Button
                          type="button"
                          key={p}
                          variant="outline"
                          size="sm"
                          className="text-xs font-normal"
                          onClick={() => appendPrompt(p)}
                        >
                          {p}
                        </Button>
                      ))}
                    </div>
                    <Button type="button" variant="secondary" size="sm" onClick={appendVerseEcho}>
                      Insert verse snippet into draft
                    </Button>
                  </CardContent>
                </TDBCard>

                <Textarea
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  placeholder="Lord, I'm tired…"
                  className="min-h-[120px] resize-y text-base"
                  aria-label="Private prayer"
                />

                <div className="flex flex-wrap gap-2">
                  <Button type="button" onClick={submitPrivate} disabled={!draft.trim()}>
                    Save privately
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      if (pending === 0) return;
                      if (
                        !window.confirm(
                          "Clear the offline queue on this device? Your saved private prayers stay — this only removes queued markers from when you were offline.",
                        )
                      ) {
                        return;
                      }
                      clearPendingFlush();
                      setPending(0);
                    }}
                    disabled={pending === 0}
                  >
                    Clear offline queue
                  </Button>
                </div>

                <div className="border-t border-border/50 pt-4">
                  <label htmlFor="tdb-household" className="text-sm font-medium text-foreground">
                    Household share code (optional)
                  </label>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Private — for future family rhythms on the main site. Stays only in this
                    browser until you use it there yourself. Nothing here posts to the shared wall.
                  </p>
                  <input
                    id="tdb-household"
                    className="mt-2 w-full max-w-xs rounded-md border border-input bg-background px-3 py-2 text-sm"
                    value={household}
                    onChange={(e) => {
                      setHousehold(e.target.value);
                      writeHouseholdShareCode(e.target.value);
                      setHouseholdSavedHint(false);
                    }}
                    onBlur={() => {
                      if (!household.trim()) return;
                      setHouseholdSavedHint(true);
                      window.setTimeout(() => setHouseholdSavedHint(false), 3200);
                    }}
                    placeholder="e.g. family code from main site"
                    autoComplete="off"
                  />
                  {householdSavedHint ? (
                    <p className="mt-2 text-xs text-muted-foreground" role="status">
                      Noted on this device — still private until you choose otherwise on the main site.
                    </p>
                  ) : null}
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/70 shadow-none ring-1 ring-border/80">
              <CardHeader>
                <CardTitle className="font-heading text-lg">Recent private lines</CardTitle>
              </CardHeader>
              <CardContent>
                {prayers.length === 0 ? (
                  <p className="text-sm text-muted-foreground">Nothing saved yet — your room is open.</p>
                ) : (
                  <ul className="space-y-3">
                    {prayers.slice(0, 12).map((p) => (
                      <li key={p.id} className="rounded-lg border border-border/50 bg-muted/15 px-3 py-2 text-sm">
                        <p className="whitespace-pre-wrap text-foreground">{p.text}</p>
                        <p className="mt-1 text-xs text-muted-foreground">{formatWhen(p.createdAt)}</p>
                      </li>
                    ))}
                  </ul>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="shared" className="space-y-4 outline-none">
            <Card className="border-border/70 shadow-none ring-1 ring-border/80">
              <CardHeader>
                <CardTitle className="font-heading text-lg">Shared wall</CardTitle>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  Short, moderated prayers with others — sign in on the main site when you&apos;re
                  ready. Nothing from your private tab posts automatically.
                </p>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-2">
                <a href={sharedWallUrl} className={cn(buttonVariants({ variant: "default" }))}>
                  Open shared Prayer Wall
                </a>
                <Link href="/" className={cn(buttonVariants({ variant: "outline" }))}>
                  Home
                </Link>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <TdbPageFooter />
      </main>
    </div>
  );
}
