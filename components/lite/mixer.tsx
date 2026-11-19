"use client";

import Link from "next/link";
import { Pause, Play, RotateCcw, Square } from "lucide-react";
import { proScreens } from "@/data/pro-screens";
import { statusLabel, type Track } from "@/data/studio";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Toggle } from "@/components/ui/toggle";
import { KindIcon } from "@/components/lite/icons";
import { PageHeader } from "@/components/lite/page-header";
import { ProBadge } from "@/components/lite/pro-badge";
import { ProShot } from "@/components/lite/pro-shot";
import { useStudio } from "@/components/lite/studio-provider";
import { demoLevel, faderToGain, formatBars, formatDb, formatFader, formatPan, formatTime, hueColor } from "@/lib/audio";
import { proUrl, showProPreviews } from "@/lib/links";
import { cn } from "@/lib/utils";

const SEGMENTS = 16;
/** Each segment lights at this level, in dBFS: -45 … 0. */
const threshold = (i: number) => -45 + i * 3;
const segmentColor = (i: number) => (threshold(i) >= -3 ? "var(--tactile-accent)" : threshold(i) >= -12 ? "var(--tactile-warning)" : "var(--tactile-success)");

/** A column of LED segments for a level from 0 to 1. */
function Meter({ level, className }: { level: number; className?: string }) {
  const db = level > 0 ? 20 * Math.log10(level) : -Infinity;
  return (
    <span aria-hidden className={cn("flex h-full w-1.5 flex-col-reverse gap-[2px]", className)}>
      {Array.from({ length: SEGMENTS }, (_, i) => {
        const on = db >= threshold(i);
        return (
          <span
            key={i}
            className="w-full flex-1 rounded-[2px]"
            style={on ? { background: segmentColor(i), boxShadow: `0 0 5px ${segmentColor(i)}` } : { background: "var(--tactile-led-off)" }}
          />
        );
      })}
    </span>
  );
}

function useLevel(t: Track, index: number) {
  const { transport, audible } = useStudio();
  if (!transport.playing || !audible(t)) return 0;
  return demoLevel(index + 1, transport.beats, t.energy) * faderToGain(t.volume);
}

function Strip({ track: t, index }: { track: Track; index: number }) {
  const { updateTrack, audible } = useStudio();
  const level = useLevel(t, index);
  return (
    <div role="group" aria-label={`${t.name} channel`} className="flex w-[5.75rem] flex-none flex-col items-center gap-3 rounded-2xl bg-surface/60 lg:w-auto lg:min-w-[5.75rem] lg:flex-1 px-2 pt-2.5 pb-3">
      <span aria-hidden className="h-1 w-full rounded-full" style={{ background: hueColor(t.hue), boxShadow: `0 0 8px ${hueColor(t.hue, 0.7, 0.18)}` }} />
      <span className="flex w-full items-center gap-1.5 px-1 text-xs font-semibold text-fg [&_svg]:size-3.5 [&_svg]:flex-none [&_svg]:text-subtle">
        <KindIcon kind={t.kind} />
        <span className="truncate">{t.name}</span>
      </span>

      <div className="grid w-full gap-2.5 pt-1">
        <Slider aria-label={`${t.name} pan`} min={-50} max={50} value={[t.pan]} onValueChange={([pan]) => updateTrack(t.id, { pan })} />
        <span aria-hidden className="text-center font-mono text-[11px] text-subtle">
          {formatPan(t.pan)}
        </span>
      </div>

      <div className="flex gap-1">
        <Toggle size="sm" led className="h-8 gap-1 px-2 text-xs" pressed={t.mute} onPressedChange={(mute) => updateTrack(t.id, { mute })} aria-label={`Mute ${t.name}`}>
          M
        </Toggle>
        <Toggle size="sm" led className="h-8 gap-1 px-2 text-xs" pressed={t.solo} onPressedChange={(solo) => updateTrack(t.id, { solo })} aria-label={`Solo ${t.name}`}>
          S
        </Toggle>
      </div>

      <div className={cn("flex h-48 items-stretch gap-2.5 transition-opacity", !audible(t) && "opacity-55")}>
        <Slider
          orientation="vertical"
          aria-label={`${t.name} volume`}
          value={[t.volume]}
          onValueChange={([volume]) => updateTrack(t.id, { volume })}
          className="min-h-0"
        />
        <span className="tactile-well flex rounded-md p-1">
          <Meter level={level} />
        </span>
      </div>
      <span className="tactile-well rounded-md px-2 py-0.5 font-mono text-xs text-fg tabular-nums">{formatFader(t.volume)}</span>
    </div>
  );
}

function MasterStrip() {
  const { tracks, master, dispatch, transport, audible } = useStudio();
  let sum = 0;
  tracks.forEach((t, i) => {
    if (transport.playing && audible(t)) sum += (demoLevel(i + 1, transport.beats, t.energy) * faderToGain(t.volume)) ** 2;
  });
  const level = Math.sqrt(sum) * faderToGain(master) * 0.55;
  const right = level * (0.94 + 0.06 * Math.sin(transport.beats * 3));
  return (
    <div role="group" aria-label="Master channel" className="flex w-24 flex-none flex-col items-center gap-3 rounded-2xl border border-line bg-surface px-2 pt-2.5 pb-3">
      <span aria-hidden className="h-1 w-full rounded-full bg-brand shadow-[0_0_8px_var(--tactile-accent-glow)]" />
      <span className="text-xs font-semibold uppercase tracking-wider text-fg">Master</span>
      <span className="tactile-well w-full rounded-lg p-1.5 text-center font-mono text-[10px] text-subtle">
        Peak <span className="text-fg tabular-nums">{level > 0 ? formatDb(20 * Math.log10(level)) : "-∞"}</span>
      </span>
      <div className="mt-auto flex h-48 items-stretch gap-2.5">
        <Slider
          orientation="vertical"
          aria-label="Master volume"
          value={[master]}
          onValueChange={([value]) => dispatch({ type: "master", value })}
          className="min-h-0"
        />
        <span className="tactile-well flex gap-1 rounded-md p-1">
          <Meter level={level} />
          <Meter level={right} />
        </span>
      </div>
      <span className="tactile-well rounded-md px-2 py-0.5 font-mono text-xs text-fg tabular-nums">{formatFader(master)}</span>
    </div>
  );
}

export function MixerScreen() {
  const { tracks, session, transport, dispatch, togglePlay, stop, anySolo } = useStudio();
  const muted = tracks.filter((t) => t.mute).length;

  return (
    <>
      <PageHeader title="Mixer" description={`${session.name} · ${session.artist} · ${tracks.length} tracks · ${transport.tempo} BPM · ${session.key}`}>
        <Button size="sm" disabled={!anySolo} onClick={() => dispatch({ type: "tracks", patch: { solo: false } })}>
          Clear solo
        </Button>
        <Button
          size="sm"
          onClick={() => {
            dispatch({ type: "tracks", patch: { volume: 80, pan: 0 } });
            dispatch({ type: "master", value: 80 });
          }}
        >
          <RotateCcw /> Reset faders
        </Button>
      </PageHeader>

      <section aria-label="Transport" className="tactile-tray flex flex-wrap items-center gap-3 rounded-3xl p-3">
        <div className="flex gap-2">
          <Button size="icon" aria-label="Stop and go to start" onClick={stop}>
            <Square />
          </Button>
          <Button size="icon" variant={transport.playing ? "accent" : "default"} aria-label={transport.playing ? "Pause" : "Play"} onClick={togglePlay}>
            {transport.playing ? <Pause /> : <Play />}
          </Button>
        </div>
        <div className="tactile-well flex h-11 items-center gap-3 rounded-xl px-4 font-mono" aria-label="Position">
          <span className="text-lg font-semibold text-fg tabular-nums">{formatBars(transport.beats)}</span>
          <span className="text-xs text-subtle tabular-nums">{formatTime(transport.beats, transport.tempo)}</span>
        </div>
        <Toggle led pressed={transport.loop} onPressedChange={(loop) => dispatch({ type: "transport", patch: { loop } })}>
          Loop 17–24
        </Toggle>
        <div className="flex items-center gap-3 sm:ml-auto">
          <label htmlFor="metronome" className="text-sm text-subtle">
            Metronome
          </label>
          <Switch id="metronome" size="sm" />
        </div>
      </section>

      <section aria-label="Channels" className="tactile-tray flex gap-2 overflow-x-auto rounded-3xl p-3">
        {tracks.map((t, i) => (
          <Strip key={t.id} track={t} index={i} />
        ))}
        <div className="flex-1 lg:hidden" />
        <MasterStrip />
      </section>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader>
            <CardDescription>Session</CardDescription>
            <CardTitle className="flex items-center gap-2">
              {session.name} <Badge status="warning">{statusLabel[session.status]}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-subtle">
            <Link href="/sessions" className="underline-offset-4 hover:text-fg hover:underline">
              Open another session
            </Link>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription>Channels heard</CardDescription>
            <CardTitle className="font-mono text-2xl tabular-nums">
              {tracks.length - muted}/{tracks.length}
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-subtle">{anySolo ? "Solo is on: only soloed channels play." : `${muted} muted`}</CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription>Keyboard</CardDescription>
            <CardTitle className="text-base">Tab to a fader, then use the arrow keys</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-subtle">Page Up / Page Down move faster; Home and End go to the ends.</CardContent>
        </Card>
      </div>

      {showProPreviews && (
        <section aria-labelledby="pro" className="grid gap-3">
          <div className="flex flex-wrap items-end justify-between gap-2">
            <div>
              <h2 id="pro" className="flex items-center gap-2 text-sm font-semibold text-fg">
                In the full template <ProBadge />
              </h2>
              <p className="mt-1 text-sm text-subtle">Arrangement, a playable synth, effects, samples and more, built from the same components.</p>
            </div>
            <a href={proUrl} className="text-sm text-subtle underline-offset-4 hover:text-fg hover:underline">
              See the full template
            </a>
          </div>
          <div className="-mx-4 flex snap-x gap-3 overflow-x-auto px-4 pb-2 sm:mx-0 sm:grid sm:grid-cols-3 sm:overflow-visible sm:px-0">
            {proScreens.map(({ slug, name, icon: Icon }) => (
              <Link
                key={slug}
                href={`/pro/${slug}`}
                className="tactile-tray group grid w-56 flex-none snap-start gap-2 rounded-2xl p-2 outline-none focus-visible:ring-2 focus-visible:ring-(--tactile-focus) sm:w-auto"
              >
                <span className="overflow-hidden rounded-xl">
                  <ProShot slug={slug} alt="" sizes="(min-width: 640px) 33vw, 224px" className="transition-transform duration-300 group-hover:scale-105" />
                </span>
                <span className="flex items-center gap-2 px-1.5 pb-1 text-sm font-medium text-fg [&_svg]:size-4">
                  <Icon aria-hidden /> {name}
                </span>
              </Link>
            ))}
          </div>
        </section>
      )}
    </>
  );
}
