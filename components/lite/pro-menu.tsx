"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown } from "lucide-react";
import { proScreens } from "@/data/pro-screens";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ProBadge } from "@/components/lite/pro-badge";
import { proUrl } from "@/lib/links";
import { cn } from "@/lib/utils";

/** "More screens" menu listing what the full template adds. Each item opens a preview page. */
export function ProMenu() {
  const active = usePathname().startsWith("/pro/");
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className={cn(
          "flex flex-none items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-subtle outline-none hover:text-fg focus-visible:ring-2 focus-visible:ring-(--tactile-focus)",
          active && "tactile-key text-fg",
        )}
      >
        More screens <ProBadge /> <ChevronDown className="size-3.5" aria-hidden />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-64">
        <DropdownMenuLabel>In the full template</DropdownMenuLabel>
        {proScreens.map(({ slug, name, icon: Icon, summary }) => (
          <DropdownMenuItem key={slug} asChild>
            <Link href={`/pro/${slug}`} className="items-start">
              <Icon className="mt-0.5" aria-hidden />
              <span className="grid">
                <span>{name}</span>
                <span className="text-xs font-normal text-subtle">{summary}</span>
              </span>
            </Link>
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <a href={proUrl}>See everything in the full template</a>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
