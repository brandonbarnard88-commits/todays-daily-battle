import { TdbPageFooter } from "@/components/tdb-page-footer";
import { TdbSiteNav } from "@/components/tdb-site-nav";
import { dailyVerse } from "@/lib/daily-verse";
import { buildVersePageJsonLd } from "@/lib/verse-jsonld";
import { VerseRoomClient } from "./verse-room-client";

export default function VersePage() {
  return (
    <div className="min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(buildVersePageJsonLd()) }}
      />
      <TdbSiteNav currentPath="/verse" />

      <main className="mx-auto max-w-3xl px-4 pb-24 pt-10 sm:px-6 sm:pt-12">
        <header className="mb-10 text-center">
          <p className="mb-2 text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
            King James Version · Private · No pressure
          </p>
          <h1 className="font-heading text-3xl font-semibold text-foreground sm:text-4xl">
            Today&apos;s verse
          </h1>
          <p className="mx-auto mt-4 max-w-lg text-pretty text-sm leading-relaxed text-muted-foreground">
            A quiet room for {dailyVerse.reference} — same gentle breakdowns as home, with a little more space to breathe.
          </p>
        </header>

        <VerseRoomClient />

        <TdbPageFooter />
      </main>
    </div>
  );
}
