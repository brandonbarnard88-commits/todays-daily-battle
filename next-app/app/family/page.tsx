import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";
import { TdbPageFooter } from "@/components/tdb-page-footer";
import { TdbSiteNav } from "@/components/tdb-site-nav";
import { FamilyRoomClient } from "./family-room-client";
import { cn } from "@/lib/utils";

export default function FamilyPage() {
  return (
    <div className="min-h-screen">
      <TdbSiteNav currentPath="/family" />

      <main className="mx-auto max-w-3xl px-4 pb-24 pt-10 sm:px-6 sm:pt-12">
        <header className="mb-10 text-center">
          <p className="mb-2 text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
            Family · KJV only · No pressure
          </p>
          <h1 className="font-heading text-3xl font-semibold text-foreground sm:text-4xl">Family &amp; kids</h1>
          <p className="mx-auto mt-4 max-w-lg text-pretty text-sm leading-relaxed text-muted-foreground sm:text-base">
            Long days of raising little ones deserve a quiet shelf of Scripture. Here&apos;s today&apos;s verse with
            gentler words for the supper table — you&apos;re not behind.
          </p>
        </header>

        <FamilyRoomClient />

        <div className="tdb-no-print mt-10 flex flex-wrap justify-center gap-2">
          <Link href="/" className={cn(buttonVariants({ variant: "outline", size: "sm" }))}>
            Home
          </Link>
        </div>

        <TdbPageFooter />
      </main>
    </div>
  );
}
