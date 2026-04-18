import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TdbPageFooter } from "@/components/tdb-page-footer";
import { TdbSiteNav } from "@/components/tdb-site-nav";
import { getMainSiteOrigin } from "@/lib/main-site";
import { cn } from "@/lib/utils";

export default function PlansPage() {
  const url = `${getMainSiteOrigin()}/plans.html`;

  return (
    <div className="min-h-screen">
      <TdbSiteNav currentPath="/plans" />

      <main className="mx-auto max-w-3xl px-4 pb-24 pt-10 sm:px-6 sm:pt-12">
        <Card className="border-border/70 shadow-none ring-1 ring-border/80">
          <CardHeader>
            <CardTitle className="font-heading text-2xl">Battle Plans</CardTitle>
            <p className="text-sm leading-relaxed text-muted-foreground">
              7–40 day KJV lanes — fear, grief, family, peace. The full library lives on the main site
              until this route is migrated.
            </p>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            <a href={url} className={cn(buttonVariants({ variant: "default" }))}>
              Open Battle Plans
            </a>
            <Link href="/" className={cn(buttonVariants({ variant: "outline" }))}>
              Home
            </Link>
          </CardContent>
        </Card>

        <TdbPageFooter />
      </main>
    </div>
  );
}
