import { Suspense } from "react";

import { MemorizeClient } from "./memorize-client";

export default function MemorizePage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[40vh] items-center justify-center text-sm text-muted-foreground">
          Loading…
        </div>
      }
    >
      <MemorizeClient />
    </Suspense>
  );
}
