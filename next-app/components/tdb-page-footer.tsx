import { cn } from "@/lib/utils";

type FooterProps = {
  className?: string;
};

export function TdbPageFooter({ className }: FooterProps) {
  return (
    <p
      role="note"
      className={cn(
        "mt-16 border-t border-border/40 pt-10 text-center text-xs leading-relaxed text-muted-foreground sm:mt-20 sm:pt-12",
        className,
      )}
    >
      A quiet place · We battle. He wins. We&apos;re not perfect; He is.
      <br />
      Everything stays on this device until you choose to export or sync.
    </p>
  );
}
