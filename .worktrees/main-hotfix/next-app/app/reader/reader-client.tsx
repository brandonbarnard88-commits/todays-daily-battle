"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useId, useMemo, useState, type ChangeEvent } from "react";

import { Button, buttonVariants } from "@/components/ui/button";
import { TDBVerseBreakdown } from "@/components/tdb-verse-breakdown";
import { TdbPageFooter } from "@/components/tdb-page-footer";
import { TdbSiteNav } from "@/components/tdb-site-nav";
import { dailyVerse, resolveVerseForChapterLine, type TdbAudience } from "@/lib/daily-verse";
import { KJV_BOOK_ORDER } from "@/lib/kjv-book-order";
import { getMaxChapterForBook, loadKjvFullMap, listChapterVerses, type KjvVerseLine } from "@/lib/kjv-chapter";
import { getMainSiteOrigin } from "@/lib/main-site";
import { normalizeBookForKjvFull, parseRefToBookChapter } from "@/lib/reader-href";
import { cn } from "@/lib/utils";
import { BookOpen, ChevronLeft, ChevronRight } from "lucide-react";

function defaultBookChapter(): { book: string; chapter: string } {
  const p = parseRefToBookChapter(dailyVerse.reference);
  if (p) return p;
  return { book: "Isaiah", chapter: "54" };
}

function ReaderChapterVerses({
  book,
  chapterNum,
  canonBook,
  audience,
  audienceLabelId,
  onAudienceChange,
}: {
  book: string;
  chapterNum: number;
  canonBook: string;
  audience: TdbAudience;
  audienceLabelId: string;
  onAudienceChange: (next: TdbAudience) => void;
}) {
  const [lines, setLines] = useState<KjvVerseLine[]>([]);
  const [loadState, setLoadState] = useState<"loading" | "ready" | "offline" | "error">("loading");
  const [loadHint, setLoadHint] = useState<string | null>(null);

  useEffect(() => {
    const ac = new AbortController();
    void loadKjvFullMap(ac.signal)
      .then((map) => {
        if (ac.signal.aborted) return;
        const next = listChapterVerses(map, book, chapterNum);
        setLines(next);
        setLoadState(next.length ? "ready" : "error");
        setLoadHint(
          next.length ? null : `No verses found for ${canonBook} ${chapterNum}. Check the book name or try the main site reader.`,
        );
      })
      .catch(() => {
        if (ac.signal.aborted) return;
        setLines([]);
        setLoadState("offline");
        setLoadHint(
          "Offline—still got you. Reconnect once to load chapter text, then it can stay cached.",
        );
      });
    return () => ac.abort();
  }, [book, canonBook, chapterNum]);

  if (loadState === "loading") {
    return <p className="text-center text-sm text-muted-foreground">Opening the chapter…</p>;
  }
  if (loadHint) {
    return (
      <p className="rounded-lg border border-border/60 bg-muted/20 px-4 py-6 text-center text-sm leading-relaxed text-muted-foreground">
        {loadHint}
      </p>
    );
  }

  return (
    <ol className="space-y-10">
      {lines.map((line) => {
        const resolved = resolveVerseForChapterLine(line.reference);
        const verseForUi = resolved.matchedRef
          ? {
              ...resolved.verse,
              reference: line.reference,
              text: line.text,
            }
          : null;
        return (
          <li
            key={line.key}
            className="tdb-print-verse tdb-reader-verse-card rounded-xl border border-border/60 bg-card/80 p-4 shadow-none ring-1 ring-border/50 sm:p-6"
          >
            <p className="font-heading text-lg font-semibold text-foreground">{line.reference}</p>
            <blockquote className="mt-3 border-l-[3px] border-primary/35 pl-4 font-heading text-base leading-relaxed text-foreground sm:text-lg">
              {line.text}
            </blockquote>
            {verseForUi ? (
              <div className="mt-6">
                <TDBVerseBreakdown
                  verse={verseForUi}
                  audience={audience}
                  onAudienceChange={onAudienceChange}
                  tabsLabelId={`${audienceLabelId}-${line.verseNum}`}
                  expandAllByDefault={false}
                  className="mt-2"
                />
              </div>
            ) : (
              <p className="tdb-no-print mt-5 text-sm leading-relaxed text-muted-foreground">
                Gentle notes aren&apos;t on the pilot shelf for this verse yet — you still have the KJV line
                above.{" "}
                <Link href="/verse" className="font-medium text-primary underline underline-offset-4">
                  Today&apos;s verse
                </Link>{" "}
                always carries the full companion.
              </p>
            )}
          </li>
        );
      })}
    </ol>
  );
}

export function ReaderClient() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const audienceLabelId = useId();
  const [audience, setAudience] = useState<TdbAudience>("adult");
  const [kjvMap, setKjvMap] = useState<Record<string, string> | null>(null);

  const defaults = useMemo(() => defaultBookChapter(), []);

  const book = (searchParams.get("book") ?? defaults.book).trim() || defaults.book;
  const chapterRaw = (searchParams.get("chapter") ?? defaults.chapter).trim() || defaults.chapter;
  const chapterNum = Number(chapterRaw);
  const chapterInvalid = !Number.isFinite(chapterNum) || chapterNum < 1;

  const canonBook = normalizeBookForKjvFull(book);

  useEffect(() => {
    void loadKjvFullMap()
      .then(setKjvMap)
      .catch(() => setKjvMap(null));
  }, []);

  const maxChapter = useMemo(() => {
    if (!kjvMap || chapterInvalid) return 0;
    return getMaxChapterForBook(kjvMap, book);
  }, [book, chapterInvalid, kjvMap]);

  const chapterOptions = useMemo(() => {
    if (chapterInvalid) return [1];
    const cap = maxChapter > 0 ? maxChapter : Math.max(chapterNum, 1);
    return Array.from({ length: cap }, (_, i) => i + 1);
  }, [chapterInvalid, chapterNum, maxChapter]);

  const bookSelectValue = (KJV_BOOK_ORDER as readonly string[]).includes(book) ? book : "Genesis";

  const chapterSelectValue =
    chapterInvalid || chapterOptions.length === 0
      ? 1
      : Math.min(chapterNum, chapterOptions[chapterOptions.length - 1]!);

  const navigateReader = useCallback(
    (nextBook: string, nextChapter: number) => {
      const q = new URLSearchParams({
        book: nextBook,
        chapter: String(nextChapter),
      });
      router.push(`/reader?${q.toString()}`);
    },
    [router],
  );

  const onBookSelect = useCallback(
    (e: ChangeEvent<HTMLSelectElement>) => {
      navigateReader(e.target.value, 1);
    },
    [navigateReader],
  );

  const onChapterSelect = useCallback(
    (e: ChangeEvent<HTMLSelectElement>) => {
      const ch = Number(e.target.value);
      if (!Number.isFinite(ch)) return;
      navigateReader(bookSelectValue, ch);
    },
    [bookSelectValue, navigateReader],
  );

  const prevNext = useMemo(() => {
    if (chapterInvalid) return { prev: null as string | null, next: null as string | null };
    const q = (ch: number) =>
      `/reader?${new URLSearchParams({ book, chapter: String(ch) }).toString()}`;
    return { prev: chapterNum > 1 ? q(chapterNum - 1) : null, next: q(chapterNum + 1) };
  }, [book, chapterInvalid, chapterNum]);

  const chapterTitle = `${canonBook} ${chapterInvalid ? chapterRaw : chapterNum}`;

  const printBannerLine =
    !chapterInvalid && Number.isFinite(chapterNum)
      ? `Today's Daily Battle — ${canonBook} ${chapterNum} — KJV`
      : `Today's Daily Battle — KJV`;

  const classicReaderUrl = useMemo(() => {
    const origin = getMainSiteOrigin();
    if (chapterInvalid) return `${origin}/reader.html`;
    return `${origin}/reader.html?${new URLSearchParams({ book, chapter: chapterRaw }).toString()}`;
  }, [book, chapterInvalid, chapterRaw]);

  const handleShareChapter = useCallback(() => {
    if (typeof window === "undefined") return;
    const url = `${window.location.origin}/reader?${new URLSearchParams({ book, chapter: chapterRaw }).toString()}`;
    void navigator.clipboard.writeText(url).catch(() => {});
  }, [book, chapterRaw]);

  const selectClass =
    "min-h-9 max-w-full rounded-md border border-border/60 bg-muted/25 px-2 py-1.5 text-sm text-foreground shadow-none outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring";

  return (
    <div className="min-h-screen pb-[env(safe-area-inset-bottom,0px)]">
      <TdbSiteNav currentPath={pathname ?? "/reader"} />

      <main className="mx-auto max-w-3xl px-4 pb-24 pt-10 sm:px-6 sm:pt-12">
        <div className="tdb-print-reader-banner hidden print:block">
          <p className="tdb-print-reader-banner-title font-heading text-center">{printBannerLine}</p>
        </div>

        <header className="tdb-no-print mb-8 text-center sm:mb-10">
          <p className="mb-2 text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
            KJV · Full chapter · Gentle notes when available
          </p>
          <h1 className="font-heading text-3xl font-semibold text-foreground sm:text-4xl">
            {chapterInvalid ? "Chapter reader" : chapterTitle}
          </h1>
          <p className="mx-auto mt-3 max-w-lg text-pretty text-sm leading-relaxed text-muted-foreground">
            One verse at a time — calm breakdowns only for verses in the pilot shelf. Everything else stays
            plain KJV.
          </p>
        </header>

        {!chapterInvalid ? (
          <div className="tdb-no-print mb-6 flex flex-wrap items-center justify-center gap-x-3 gap-y-2 text-sm">
            <label className="flex flex-wrap items-center gap-2 text-muted-foreground">
              <span className="sr-only">Book</span>
              <span aria-hidden className="text-xs text-muted-foreground/90">
                Book
              </span>
              <select
                className={selectClass}
                value={bookSelectValue}
                onChange={onBookSelect}
                disabled={!kjvMap}
              >
                {KJV_BOOK_ORDER.map((b) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
              </select>
            </label>
            <label className="flex flex-wrap items-center gap-2 text-muted-foreground">
              <span className="sr-only">Chapter</span>
              <span aria-hidden className="text-xs text-muted-foreground/90">
                Chapter
              </span>
              <select
                className={cn(selectClass, "min-w-[4.5rem]")}
                value={chapterSelectValue}
                onChange={onChapterSelect}
                disabled={!kjvMap || chapterOptions.length === 0}
              >
                {chapterOptions.map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>
            </label>
          </div>
        ) : null}

        {!chapterInvalid ? (
          <div className="tdb-no-print mb-8 flex flex-wrap items-center justify-center gap-2">
            {prevNext.prev ? (
              <Link
                href={prevNext.prev}
                className={cn(buttonVariants({ variant: "outline", size: "sm" }), "gap-1")}
              >
                <ChevronLeft className="size-4" aria-hidden />
                Prev chapter
              </Link>
            ) : (
              <span className="inline-flex min-h-9 items-center gap-1 rounded-md border border-transparent px-3 text-xs text-muted-foreground">
                First chapter
              </span>
            )}
            {prevNext.next ? (
              <Link href={prevNext.next} className={cn(buttonVariants({ variant: "outline", size: "sm" }), "gap-1")}>
                Next chapter
                <ChevronRight className="size-4" aria-hidden />
              </Link>
            ) : null}
            <Button type="button" variant="ghost" size="sm" onClick={handleShareChapter}>
              Copy chapter link
            </Button>
            <a
              href={classicReaderUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "text-muted-foreground")}
            >
              Classic reader
            </a>
          </div>
        ) : null}

        {chapterInvalid ? (
          <p className="rounded-lg border border-border/60 bg-muted/20 px-4 py-6 text-center text-sm leading-relaxed text-muted-foreground">
            That chapter number doesn&apos;t look right — try a number from 1 upward.
          </p>
        ) : (
          <ReaderChapterVerses
            key={`${book}-${chapterNum}`}
            book={book}
            chapterNum={chapterNum}
            canonBook={canonBook}
            audience={audience}
            audienceLabelId={audienceLabelId}
            onAudienceChange={setAudience}
          />
        )}

        <section className="tdb-no-print mt-14 rounded-xl border border-border/50 bg-muted/15 px-4 py-5 text-sm text-muted-foreground sm:px-5">
          <p className="flex items-start gap-2">
            <BookOpen className="mt-0.5 size-4 shrink-0 text-primary/80" aria-hidden />
            <span>
              Tip: the audience tabs (Kid / Teen / Adult) apply to the three personal fields. The KJV line never
              changes.
            </span>
          </p>
        </section>

        <TdbPageFooter className="tdb-no-print" />
      </main>
    </div>
  );
}
