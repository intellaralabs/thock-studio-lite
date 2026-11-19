import { cn } from "@/lib/utils";

/** A small lit "Pro" cap for things only in the full template. */
export function ProBadge({ className }: { className?: string }) {
  return (
    <span
      data-variant="accent"
      className={cn("tactile-key pointer-events-none inline-flex h-5 items-center rounded-md px-1.5 text-[10px] font-semibold uppercase tracking-wider", className)}
    >
      Pro
    </span>
  );
}
