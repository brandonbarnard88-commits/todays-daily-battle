import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TdbPageFooter } from "@/components/tdb-page-footer";
import { TdbSiteNav } from "@/components/tdb-site-nav";
import { GENTLE_PICKS, memorizeHrefForRef } from "@/lib/tdb-gentle-picks";
import { getMainSiteOrigin } from "@/lib/main-site";
import { cn } from "@/lib/utils";

export default function CalmPage() {
  const url = `${getMainSiteOrigin()}/calm.html`;

  return (
    <div className="min-h-screen">
      <TdbSiteNav currentPath="/calm" />

      <main className="mx-auto max-w-3xl px-4 pb-24 pt-10 sm:px-6 sm:pt-12">
        <Card className="border-border/70 shadow-none ring-1 ring-border/80">
          <CardHeader>
            <CardTitle className="font-heading text-2xl">Calm</CardTitle>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Breath, grounding, and gentle sheets — the full Calm hub is on the main site for now.
            </p>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            <a href={url} className={cn(buttonVariants({ variant: "default" }))}>
              Open Calm hub
            </a>
            <Link href="/" className={cn(buttonVariants({ variant: "outline" }))}>
              Home
            </Link>
          </CardContent>
        </Card>

        <Card className="mt-8 border-border/70 shadow-none ring-1 ring-border/80">
          <CardHeader>
            <CardTitle className="font-heading text-lg">Gentle picks (on device)</CardTitle>
            <p className="text-sm text-muted-foreground">
              Same KJV catalog as the home pilot — tap a lane to open Memorize with that reference.
              Nothing is sent anywhere until you choose.
            </p>
          </CardHeader>
          <CardContent className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
            {GENTLE_PICKS.map((p) => (
              <Link
                key={p.id}
                href={memorizeHrefForRef(p.reference)}
                className={cn(
                  buttonVariants({ variant: "outline", size: "sm" }),
                  "h-auto min-h-10 max-w-full flex-col items-start gap-0.5 py-2 text-left sm:max-w-[14rem]",
                )}
              >
                <span className="font-medium text-foreground">{p.mood}</span>
                <span className="text-xs font-normal text-muted-foreground">{p.hint}</span>
              </Link>
            ))}
          </CardContent>
        </Card>

        <TdbPageFooter />
      </main>
    </div>
  );
}
