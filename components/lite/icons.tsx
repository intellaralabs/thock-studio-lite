import { AudioLines, Drum, Guitar, KeyboardMusic, MicVocal, Piano, Sparkles } from "lucide-react";
import type { TrackKind } from "@/data/studio";

const icons = { drums: Drum, bass: Guitar, keys: Piano, synth: KeyboardMusic, guitar: Guitar, vocal: MicVocal, fx: Sparkles };

/** An icon for a kind of track. */
export function KindIcon({ kind, className }: { kind: TrackKind; className?: string }) {
  const Icon = icons[kind] ?? AudioLines;
  return <Icon className={className} aria-hidden />;
}
