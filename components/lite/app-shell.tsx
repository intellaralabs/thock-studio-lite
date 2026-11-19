"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { FolderOpen, Settings, SlidersVertical, Sparkles } from "lucide-react";
import { studio } from "@/data/studio";
import { Button } from "@/components/ui/button";
import { ProMenu } from "@/components/lite/pro-menu";
import { useStudio } from "@/components/lite/studio-provider";
import { ThemeToggle } from "@/components/lite/theme-toggle";
import { proUrl, showProPreviews } from "@/lib/links";
import { cn } from "@/lib/utils";

const nav = [
  { href: "/", label: "Mixer", icon: SlidersVertical },
  { href: "/sessions", label: "Sessions", icon: FolderOpen },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function AppShell({ children }: { children: ReactNode }) {
  const path = usePathname();
  const { transport } = useStudio();
  const links = (
    <>
      {nav.map(({ href, label, icon: Icon }) => {
        const active = href === "/" ? path === "/" : path.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            aria-current={active ? "page" : undefined}
            className={cn(
              "flex flex-none items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-subtle outline-none hover:text-fg focus-visible:ring-2 focus-visible:ring-(--tactile-focus) [&_svg]:size-4",
              active && "tactile-key text-fg",
            )}
          >
            <Icon aria-hidden /> {label}
          </Link>
        );
      })}
      {showProPreviews && <ProMenu />}
    </>
  );

  return (
    <div className="min-h-dvh">
      <header className="sticky top-0 z-30 border-b border-line bg-bg/80 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center gap-4 px-4">
          <Link href="/" className="flex items-center gap-2.5 rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-(--tactile-focus)">
            <span className="tactile-key grid size-9 place-items-center rounded-xl">
              <span className="tactile-led size-2" data-on={transport.playing || undefined} />
            </span>
            <span className="text-sm font-semibold text-fg">{studio.name}</span>
          </Link>
          <nav aria-label="Main" className="ml-4 hidden items-center gap-1 md:flex">
            {links}
          </nav>
          <div className="ml-auto flex items-center gap-2">
            {showProPreviews && (
              <Button asChild size="sm" variant="accent" className="hidden sm:inline-flex">
                <a href={proUrl}>
                  <Sparkles /> Get Pro
                </a>
              </Button>
            )}
            <ThemeToggle />
          </div>
        </div>
        <nav aria-label="Main" className="mx-auto flex max-w-6xl gap-1 overflow-x-auto px-4 pb-3 md:hidden">
          {links}
        </nav>
      </header>
      <main className="mx-auto grid max-w-6xl gap-8 px-4 py-8">{children}</main>
      {showProPreviews && (
        <footer className="mx-auto max-w-6xl px-4 pb-8 text-xs text-subtle">
          Built with Thock UI.{" "}
          <a href={proUrl} className="underline underline-offset-4 hover:text-fg">
            The full template
          </a>{" "}
          adds 9 more screens: arrangement, a playable synth, effects, samples, export, collaborators and more.
        </footer>
      )}
    </div>
  );
}
