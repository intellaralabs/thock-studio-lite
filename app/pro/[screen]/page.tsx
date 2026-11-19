import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ExternalLink, Lock } from "lucide-react";
import { proScreens } from "@/data/pro-screens";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/lite/page-header";
import { ProBadge } from "@/components/lite/pro-badge";
import { ProShot } from "@/components/lite/pro-shot";
import { demoUrl, proUrl, showProPreviews } from "@/lib/links";

export function generateStaticParams() {
  return showProPreviews ? proScreens.map((s) => ({ screen: s.slug })) : [];
}
export const dynamicParams = false;

export async function generateMetadata({ params }: PageProps<"/pro/[screen]">) {
  const { screen } = await params;
  const s = proScreens.find((p) => p.slug === screen);
  return { title: s ? `${s.name} (full template)` : "Not found" };
}

/** A preview of a screen that's only in the full template: a screenshot, what it does, and where to get it. */
export default async function ProPreviewPage({ params }: PageProps<"/pro/[screen]">) {
  const { screen } = await params;
  const s = proScreens.find((p) => p.slug === screen);
  if (!showProPreviews || !s) notFound();
  const others = proScreens.filter((p) => p.slug !== s.slug);

  return (
    <>
      <PageHeader
        title={
          <span className="flex items-center gap-3">
            {s.name} <ProBadge className="h-6 px-2 text-[11px]" />
          </span>
        }
        description={s.summary}
      >
        <Button asChild>
          <Link href="/">
            <ArrowLeft /> Back
          </Link>
        </Button>
      </PageHeader>

      <div className="grid gap-6 lg:grid-cols-[1fr_20rem]">
        <figure className="tactile-tray relative overflow-hidden rounded-3xl p-2 sm:p-3">
          <ProShot slug={s.slug} alt={`${s.name} screen from the full Studio template`} priority className="rounded-2xl" sizes="(min-width: 1024px) 70vw, 100vw" />
          <figcaption className="tactile-key pointer-events-none absolute top-5 left-5 flex items-center gap-1.5 rounded-lg px-2 py-1 text-xs font-medium text-fg">
            <Lock className="size-3.5" aria-hidden /> Preview
          </figcaption>
        </figure>

        <aside className="tactile-tray grid content-start gap-5 self-start rounded-3xl p-6">
          <div className="grid gap-1">
            <h2 className="font-semibold text-fg">In the full template</h2>
            <p className="text-sm text-subtle">This screen is one of the 12 in the Pro Studio template.</p>
          </div>
          <ul className="grid gap-2.5">
            {s.points.map((p) => (
              <li key={p} className="flex items-start gap-3 text-sm text-subtle">
                <span data-on className="tactile-led mt-1.5 size-1.5 shrink-0 rounded-full" />
                {p}
              </li>
            ))}
          </ul>
          <div className="grid gap-2">
            {demoUrl && (
              <Button asChild variant="accent">
                <a href={`${demoUrl.replace(/\/$/, "")}/${s.slug}`} target="_blank" rel="noreferrer">
                  Try it in the live demo <ExternalLink />
                </a>
              </Button>
            )}
            <Button asChild variant={demoUrl ? "default" : "accent"}>
              <a href={proUrl}>Get the full template</a>
            </Button>
          </div>
        </aside>
      </div>

      <section aria-labelledby="more" className="grid gap-3">
        <h2 id="more" className="text-sm font-semibold text-fg">
          Also in the full template
        </h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {others.map(({ slug, name, icon: Icon }) => (
            <Link key={slug} href={`/pro/${slug}`} className="tactile-key flex items-center gap-3 rounded-2xl p-4 text-sm font-medium text-fg [&_svg]:size-4">
              <Icon aria-hidden /> {name}
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
