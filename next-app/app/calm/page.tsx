import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";
import { TdbPageFooter } from "@/components/tdb-page-footer";
import { TdbSiteNav } from "@/components/tdb-site-nav";
import { CalmRoomClient } from "./calm-room-client";
import { cn } from "@/lib/utils";

export default function CalmPage() {
  return (
    <div className="min-h-screen">
      <TdbSiteNav currentPath="/calm" />

      <main className="mx-auto max-w-3xl px-4 pb-24 pt-10 sm:px-6 sm:pt-12">
        <header className="mb-10 text-center">
          <p className="mb-2 text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
            KJV only · On device · No pressure
          </p>
          <h1 className="font-heading text-3xl font-semibold text-foreground sm:text-4xl">Calm</h1>
          <p className="mx-auto mt-4 max-w-lg text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">
            Heavy right now? Tap a door or type how you feel. One gentle KJV verse at a time — with a quiet breakdown
            if you want it. Nothing required.
          </p>
        </header>

        <CalmRoomClient />

        <div className="tdb-no-print mt-10 flex flex-wrap justify-center gap-2">
          <Link href="/" className={cn(buttonVariants({ variant: "outline", size: "sm" }))}>
            Home
          </Link>
          <Link href="/verse" className={cn(buttonVariants({ variant: "ghost", size: "sm" }))}>
            Today&apos;s verse room
          </Link>
        </div>

        <TdbPageFooter />
      </main>
    </div>
  );
}
