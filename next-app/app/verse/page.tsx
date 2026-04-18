import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TdbPageFooter } from "@/components/tdb-page-footer";
import { TdbSiteNav } from "@/components/tdb-site-nav";
import { dailyVerse } from "@/lib/daily-verse";
import { cn } from "@/lib/utils";

export default function VersePage() {
  return (
    <div className="min-h-screen">
      <TdbSiteNav currentPath="/verse" />

      <main className="mx-auto max-w-3xl px-4 pb-24 pt-10 sm:px-6 sm:pt-12">
        <header className="mb-10 text-center">
          <p className="mb-2 text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
            King James Version
          </p>
          <h1 className="font-heading text-3xl font-semibold text-foreground sm:text-4xl">
            Today&apos;s verse
          </h1>
        </header>

        <Card className="tdb-print-verse border-border/70 shadow-none ring-1 ring-border/80">
          <CardHeader>
            <CardTitle className="font-heading text-2xl sm:text-3xl">{dailyVerse.reference}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <blockquote className="font-heading border-l-4 border-primary/35 pl-5 text-xl leading-relaxed sm:text-2xl">
              {dailyVerse.text}
            </blockquote>
            <div className="flex flex-wrap gap-2">
              <Link href="/" className={cn(buttonVariants({ variant: "default" }))}>
                Full home experience
              </Link>
              <Link
                href={`/memorize?ref=${encodeURIComponent(dailyVerse.reference)}`}
                className={cn(buttonVariants({ variant: "outline" }))}
              >
                Memorize
              </Link>
            </div>
          </CardContent>
        </Card>

        <TdbPageFooter />
      </main>
    </div>
  );
}
