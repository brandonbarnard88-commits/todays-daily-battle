import Link from "next/link";
import { notFound } from "next/navigation";

import { buttonVariants } from "@/components/ui/button";
import { TdbPageFooter } from "@/components/tdb-page-footer";
import { TdbSiteNav } from "@/components/tdb-site-nav";
import { getPlanBySlug, listPlanSlugs } from "@/lib/battle-plans";
import { cn } from "@/lib/utils";
import { PlanRoomClient } from "../plan-room-client";

export function generateStaticParams() {
  return listPlanSlugs().map((slug) => ({ slug }));
}

export default async function PlanSlugPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const plan = getPlanBySlug(slug);
  if (!plan) notFound();

  return (
    <div className="min-h-screen">
      <TdbSiteNav currentPath="/plans" />

      <main className="mx-auto max-w-3xl px-4 pb-24 pt-10 sm:px-6 sm:pt-12">
        <header className="mb-8">
          <p className="mb-2 text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
            Battle Plan · KJV only · On device
          </p>
          <div className="flex flex-wrap items-center gap-2">
            <Link href="/plans" className={cn(buttonVariants({ variant: "ghost", size: "sm" }))}>
              ← All plans
            </Link>
            <Link href="/" className={cn(buttonVariants({ variant: "outline", size: "sm" }))}>
              Home
            </Link>
          </div>
        </header>

        <PlanRoomClient plan={plan} />

        <TdbPageFooter />
      </main>
    </div>
  );
}
