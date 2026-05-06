"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState, type ChangeEvent } from "react";

import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { TDBVerseBreakdown } from "@/components/tdb-verse-breakdown";
import { TdbPageFooter } from "@/components/tdb-page-footer";
import { TdbSiteNav } from "@/components/tdb-site-nav";
import { CANON_VERSION, listCanonReferences, resolveVerseByRef, type CanonVerse } from "@/lib/daily-verse";
import { memorizeHrefForRef } from "@/lib/tdb-gentle-picks";
import { cn } from "@/lib/utils";
import {
  deleteSavedVerseById,
  exportSavedVersesJson,
  getAllSavedVerses,
  importSavedVersesJson,
  type SavedVerseRow,
} from "@/lib/tdb-study-db";

function formatWhen(iso: string) {
  try {
    return new Date(iso).toLocaleString(undefined, {
      dateStyle: "medium",
      timeStyle: "short",
    });
  } catch {
    return iso;
  }
}

function verseForSavedRow(r: SavedVerseRow): CanonVerse {
  const { verse } = resolveVerseByRef(r.reference);
  if (!r.snapshot) return verse;
  return {
    reference: r.reference,
    text: r.snapshot.text,
    breakdown: r.snapshot.merged,
    byAudience: { kid: {}, teen: {}, adult: {} },
    verseEchoPrompts: verse.verseEchoPrompts,
  };
}

export default function MyStudyPage() {
  const pathname = usePathname();
  const [rows, setRows] = useState<SavedVerseRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterQ, setFilterQ] = useState("");
  const [importNote, setImportNote] = useState<string | null>(null);
  const importRef = useRef<HTMLInputElement | null>(null);

  const filteredRows = useMemo(() => {
    const q = filterQ.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter((r) => {
      const v = verseForSavedRow(r);
      return r.reference.toLowerCase().includes(q) || v.text.toLowerCase().includes(q);
    });
  }, [rows, filterQ]);

  const refresh = useCallback(async () => {
    setLoading(true);
    const list = await getAllSavedVerses();
    setRows(list);
    setLoading(false);
  }, []);

  useEffect(() => {
    queueMicrotask(() => void refresh());
  }, [refresh]);

  const handleExport = useCallback(async () => {
    const json = await exportSavedVersesJson();
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `tdb-my-study-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }, []);

  const handleImportPick = useCallback(() => {
    importRef.current?.click();
  }, []);

  const handleImportFile = useCallback(
    async (e: ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      e.target.value = "";
      if (!file) return;
      setImportNote(null);
      const text = await file.text();
      const result = await importSavedVersesJson(text);
      if (result.error) {
        setImportNote(result.error);
        return;
      }
      setImportNote(
        result.added || result.skipped
          ? `Imported ${result.added} line${result.added === 1 ? "" : "s"}. Skipped ${result.skipped} duplicate or unreadable row${result.skipped === 1 ? "" : "s"}.`
          : "Nothing new to add — that file matched what you already had.",
      );
      void refresh();
    },
    [refresh],
  );

  const canonRefs = useMemo(() => listCanonReferences(), []);

  const handleDelete = useCallback(
    async (id: number | undefined) => {
      if (id === undefined) return;
      if (!window.confirm("Remove this saved line from My Study on this device?")) return;
      await deleteSavedVerseById(id);
      void refresh();
    },
    [refresh],
  );

  return (
    <div className="min-h-screen">
      <TdbSiteNav currentPath={pathname ?? "/mystudy"} />

      <main className="mx-auto max-w-3xl px-4 pb-24 pt-10 sm:px-6 sm:pt-12">
        <header className="mb-10 text-center">
          <p className="mb-2 text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
            Local · KJV · No account
          </p>
          <h1 className="font-heading text-3xl font-semibold text-foreground sm:text-4xl">My Study</h1>
          <p className="mx-auto mt-3 max-w-md text-pretty text-sm leading-relaxed text-muted-foreground">
            Verses you&apos;ve saved on this device. Nothing leaves unless you export.
          </p>
        </header>

        <Card className="border-border/70 shadow-none ring-1 ring-border/80">
          <CardHeader className="flex flex-col gap-4 border-b border-border/50 sm:flex-row sm:items-center sm:justify-between">
            <CardTitle className="font-heading text-lg">Saved references</CardTitle>
            <div className="flex flex-wrap gap-2">
              <Button type="button" variant="outline" size="sm" onClick={() => void handleExport()} disabled={rows.length === 0}>
                Export JSON
              </Button>
              <Button type="button" variant="outline" size="sm" onClick={handleImportPick}>
                Import backup
              </Button>
              <input
                ref={importRef}
                type="file"
                accept="application/json,.json"
                className="sr-only"
                aria-hidden
                onChange={(e) => void handleImportFile(e)}
              />
              <Link href="/" className={cn(buttonVariants({ variant: "ghost", size: "sm" }))}>
                Back home
              </Link>
            </div>
          </CardHeader>
          <CardContent className="space-y-4 pt-6">
            {importNote ? (
              <p className="rounded-lg border border-border/50 bg-muted/20 px-3 py-2 text-sm text-muted-foreground" role="status">
                {importNote}
              </p>
            ) : null}
            <div className="rounded-lg border border-border/50 bg-muted/10 px-3 py-3">
              <p className="text-sm font-medium text-foreground">Pilot catalog (on-device suggestions)</p>
              <p className="mt-1 text-xs text-muted-foreground">
                Gentle opens — same KJV shelf as the rest of the app. Tap to memorize a line when you want a next
                step.
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {canonRefs.map((ref) => (
                  <Link
                    key={ref}
                    href={memorizeHrefForRef(ref)}
                    className={cn(
                      buttonVariants({ variant: "outline", size: "sm" }),
                      "text-xs font-normal",
                    )}
                  >
                    {ref}
                  </Link>
                ))}
              </div>
            </div>
            {!loading && rows.length > 0 ? (
              <div className="space-y-2">
                <label htmlFor="mystudy-filter" className="text-sm font-medium text-foreground">
                  Filter by reference or verse text
                </label>
                <Input
                  id="mystudy-filter"
                  value={filterQ}
                  onChange={(e) => setFilterQ(e.target.value)}
                  placeholder="e.g. Isaiah 54, kindness, peace"
                  autoComplete="off"
                />
              </div>
            ) : null}
            {loading ? (
              <p className="text-sm text-muted-foreground">Opening your quiet shelf…</p>
            ) : rows.length === 0 ? (
              <p className="text-sm leading-relaxed text-muted-foreground">
                Nothing saved yet. When a verse steadies you, tap <strong>Save to My Study</strong> on
                the home page — it&apos;ll land here.
              </p>
            ) : filterQ.trim() && filteredRows.length === 0 ? (
              <div className="rounded-lg border border-border/60 bg-muted/20 px-4 py-10 text-center">
                <p className="text-sm leading-relaxed text-muted-foreground">
                  No saved verses match your filter yet — try a different word or{" "}
                  <button
                    type="button"
                    className="font-medium text-primary underline underline-offset-4 hover:text-foreground"
                    onClick={() => setFilterQ("")}
                  >
                    clear the filter
                  </button>
                  .
                </p>
              </div>
            ) : (
              <ul className="space-y-4">
                {filteredRows.map((r, i) => {
                  const v = verseForSavedRow(r);
                  const snapStale = r.snapshot && r.snapshot.canonVersion !== CANON_VERSION;
                  return (
                    <li
                      key={`${r.reference}-${r.savedAt}-${r.id ?? i}`}
                      className="rounded-lg border border-border/60 bg-muted/20 px-4 py-3"
                    >
                      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                          <p className="font-heading text-base font-medium text-foreground">{r.reference}</p>
                          <p className="text-xs text-muted-foreground">
                            {formatWhen(r.savedAt)}
                            {r.source ? ` · ${r.source}` : ""}
                            {r.snapshot ? ` · saved as ${r.snapshot.tier}` : ""}
                          </p>
                          {snapStale ? (
                            <p className="mt-1 text-xs text-muted-foreground">
                              Gentle notes may predate the latest site update — still your copy.
                            </p>
                          ) : null}
                        </div>
                        {typeof r.id === "number" ? (
                          <Button type="button" variant="ghost" size="sm" onClick={() => void handleDelete(r.id)}>
                            Remove
                          </Button>
                        ) : (
                          <span className="text-xs text-muted-foreground">Stored in backup storage — clear home saves to reset.</span>
                        )}
                      </div>
                      <details className="tdb-no-print mt-3 rounded-md border border-border/50 bg-background/40">
                        <summary className="cursor-pointer select-none px-3 py-2 text-sm font-medium text-foreground">
                          Verse &amp; gentle breakdown
                        </summary>
                        <div className="border-t border-border/40 px-3 py-3">
                          <blockquote className="mb-4 border-l-[3px] border-primary/35 pl-3 font-heading text-sm leading-relaxed text-foreground">
                            {v.text}
                          </blockquote>
                          <TDBVerseBreakdown
                            verse={v}
                            showAudienceTabs={!r.snapshot}
                            frozenBreakdown={r.snapshot ? r.snapshot.merged : undefined}
                          />
                        </div>
                      </details>
                    </li>
                  );
                })}
              </ul>
            )}
          </CardContent>
        </Card>

        <TdbPageFooter />
      </main>
    </div>
  );
}
