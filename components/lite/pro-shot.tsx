import Image from "next/image";
import { cn } from "@/lib/utils";

/** A screenshot of a full-template screen that follows the current theme. */
export function ProShot({ slug, alt, priority, sizes, className }: { slug: string; alt: string; priority?: boolean; sizes?: string; className?: string }) {
  return (
    <>
      <Image src={`/pro/${slug}-dark.jpg`} alt={alt} width={1600} height={1000} priority={priority} sizes={sizes} className={cn("hidden dark:block", className)} />
      <Image src={`/pro/${slug}-light.jpg`} alt={alt} width={1600} height={1000} priority={priority} sizes={sizes} className={cn("dark:hidden", className)} />
    </>
  );
}
