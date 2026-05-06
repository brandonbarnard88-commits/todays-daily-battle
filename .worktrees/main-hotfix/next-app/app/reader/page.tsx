import { Suspense } from "react";

import { TdbPageFooter } from "@/components/tdb-page-footer";
import { TdbSiteNav } from "@/components/tdb-site-nav";

import { ReaderClient } from "./reader-client";

function ReaderFallback() {
  return (
    <div className="min-h-screen">
      <TdbSiteNav currentPath="/reader" />
      <main className="mx-auto max-w-3xl px-4 pb-24 pt-10 sm:px-6 sm:pt-12">
        <p className="text-center text-sm text-muted-foreground">Opening the chapter reader…</p>
        <TdbPageFooter />
      </main>
    </div>
  );
}

export default function ReaderPage() {
  return (
    <div className="tdb-reader-print-root">
      <Suspense fallback={<ReaderFallback />}>
        <ReaderClient />
      </Suspense>
    </div>
  );
}
