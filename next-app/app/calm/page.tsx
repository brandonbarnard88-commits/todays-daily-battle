import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TdbPageFooter } from "@/components/tdb-page-footer";
import { TdbSiteNav } from "@/components/tdb-site-nav";
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

        <TdbPageFooter />
      </main>
    </div>
  );
}
