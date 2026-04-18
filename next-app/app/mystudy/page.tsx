"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TdbPageFooter } from "@/components/tdb-page-footer";
import { TdbSiteNav } from "@/components/tdb-site-nav";
import { cn } from "@/lib/utils";
import { deleteSavedVerseById, exportSavedVersesJson, getAllSavedVerses, type SavedVerseRow } from "@/lib/tdb-study-db";

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

export default function MyStudyPage() {
  const pathname = usePathname();
  const [rows, setRows] = useState<SavedVerseRow[]>([]);
  const [loading, setLoading] = useState(true);

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
              <Link href="/" className={cn(buttonVariants({ variant: "ghost", size: "sm" }))}>
                Back home
              </Link>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            {loading ? (
              <p className="text-sm text-muted-foreground">Opening your quiet shelf…</p>
            ) : rows.length === 0 ? (
              <p className="text-sm leading-relaxed text-muted-foreground">
                Nothing saved yet. When a verse steadies you, tap <strong>Save to My Study</strong> on
                the home page — it&apos;ll land here.
              </p>
            ) : (
              <ul className="space-y-4">
                {rows.map((r, i) => (
                  <li
                    key={`${r.reference}-${r.savedAt}-${r.id ?? i}`}
                    className="flex flex-col gap-2 rounded-lg border border-border/60 bg-muted/20 px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div>
                      <p className="font-heading text-base font-medium text-foreground">{r.reference}</p>
                      <p className="text-xs text-muted-foreground">
                        {formatWhen(r.savedAt)}
                        {r.source ? ` · ${r.source}` : ""}
                      </p>
                    </div>
                    {typeof r.id === "number" ? (
                      <Button type="button" variant="ghost" size="sm" onClick={() => void handleDelete(r.id)}>
                        Remove
                      </Button>
                    ) : (
                      <span className="text-xs text-muted-foreground">Stored in backup storage — clear home saves to reset.</span>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        <TdbPageFooter />
      </main>
    </div>
  );
}
