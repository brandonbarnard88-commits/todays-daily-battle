import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const links = [
  { href: "/verse", label: "Today's Verse" },
  { href: "/calm", label: "Calm" },
  { href: "/plans", label: "Battle Plans" },
  { href: "/memorize", label: "Memorize" },
  { href: "/reader", label: "Reader" },
  { href: "/mystudy", label: "My Study" },
  { href: "/prayer-wall", label: "Pray" },
] as const;

type Props = {
  currentPath?: string;
};

export function TdbSiteNav({ currentPath }: Props) {
  return (
    <nav
      aria-label="Primary"
      className="tdb-no-print sticky top-0 z-50 border-b border-border/60 bg-background/85 pt-[env(safe-area-inset-top,0px)] backdrop-blur-md supports-[backdrop-filter]:bg-background/70"
    >
      <div className="mx-auto flex max-w-3xl flex-wrap items-center justify-between gap-3 px-4 pb-3 pt-2 sm:px-6 sm:pb-4 sm:pt-3">
        <Link
          href="/"
          className="font-heading text-lg font-semibold tracking-tight text-foreground sm:text-xl"
        >
          Today&apos;s Daily Battle
        </Link>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground">
          {links.map(({ href, label }) => {
            const onSection =
              href === "/plans"
                ? currentPath === "/plans" || Boolean(currentPath?.startsWith("/plans/"))
                : href === "/reader"
                  ? currentPath === "/reader"
                  : currentPath === href;
            return (
              <Link
                key={href}
                href={href}
                className="underline-offset-4 hover:text-foreground hover:underline"
                aria-current={onSection ? "page" : undefined}
              >
                {label}
              </Link>
            );
          })}
          <Link
            href="/family"
            className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "text-muted-foreground")}
            aria-current={currentPath === "/family" ? "page" : undefined}
          >
            Family
          </Link>
        </div>
      </div>
    </nav>
  );
}
