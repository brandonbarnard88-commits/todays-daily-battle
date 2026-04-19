import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TdbPageFooter } from "@/components/tdb-page-footer";
import { TdbSiteNav } from "@/components/tdb-site-nav";
import { listPlans } from "@/lib/battle-plans";
import { getMainSiteOrigin } from "@/lib/main-site";
import { cn } from "@/lib/utils";

export default function PlansPage() {
  const plans = listPlans();
  const mainUrl = `${getMainSiteOrigin()}/plans.html`;

  return (
    <div className="min-h-screen">
      <TdbSiteNav currentPath="/plans" />

      <main className="mx-auto max-w-3xl px-4 pb-24 pt-10 sm:px-6 sm:pt-12">
        <header className="mb-10 text-center">
          <p className="mb-2 text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
            KJV only · Private · Review when you can
          </p>
          <h1 className="font-heading text-3xl font-semibold text-foreground sm:text-4xl">Battle Plans</h1>
          <p className="mx-auto mt-4 max-w-lg text-pretty text-sm leading-relaxed text-muted-foreground sm:text-base">
            Seven-day pilot lanes on this device — each day is one KJV verse with the same gentle five-part breakdown.
            Pick up where you left off; nothing scores you.
          </p>
        </header>

        <div className="space-y-4">
          {plans.map((p) => (
            <Link
              key={p.slug}
              href={`/plans/${p.slug}`}
              className="group block rounded-xl outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring"
            >
              <Card className="h-full border-border/70 shadow-none ring-1 ring-border/80 transition-[box-shadow,border-color] group-hover:border-primary/25 group-hover:ring-primary/20">
                <CardHeader>
                  <CardTitle className="font-heading text-lg">{p.title}</CardTitle>
                  <p className="text-sm text-muted-foreground">{p.tagline}</p>
                </CardHeader>
                <CardContent className="pt-0">
                  <span className={cn(buttonVariants({ variant: "secondary", size: "sm" }), "pointer-events-none")}>
                    Open plan
                  </span>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        <Card className="mt-10 border-border/70 shadow-none ring-1 ring-border/80">
          <CardHeader>
            <CardTitle className="font-heading text-base">Full library</CardTitle>
            <p className="text-sm text-muted-foreground">
              Longer lanes and print packs still live on the main site when you want more.
            </p>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            <a href={mainUrl} className={cn(buttonVariants({ variant: "outline", size: "sm" }))}>
              Open main-site Battle Plans
            </a>
            <Link href="/" className={cn(buttonVariants({ variant: "ghost", size: "sm" }))}>
              Home
            </Link>
          </CardContent>
        </Card>

        <TdbPageFooter />
      </main>
    </div>
  );
}
