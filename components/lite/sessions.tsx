"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { Plus, Star } from "lucide-react";
import { statusLabel, type Session, type SessionStatus } from "@/data/studio";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { SearchInput } from "@/components/ui/search-input";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { PageHeader } from "@/components/lite/page-header";
import { useStudio } from "@/components/lite/studio-provider";
import { cn } from "@/lib/utils";

const statusLed: Record<SessionStatus, "neutral" | "warning" | "success" | "error"> = {
  draft: "neutral",
  tracking: "error",
  mixing: "warning",
  mastered: "success",
};

type Filter = SessionStatus | "all" | "starred";

export function SessionsScreen() {
  const { sessions, sessionId, dispatch } = useStudio();
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Filter>("all");

  const q = query.trim().toLowerCase();
  const shown = sessions.filter(
    (s) =>
      (filter === "all" || (filter === "starred" ? s.starred : s.status === filter)) &&
      (!q || s.name.toLowerCase().includes(q) || s.artist.toLowerCase().includes(q) || s.key.toLowerCase().includes(q)),
  );

  function open(s: Session) {
    dispatch({ type: "open-session", id: s.id });
    router.push("/");
  }

  return (
    <>
      <PageHeader title="Sessions" description={`${sessions.length} sessions · ${sessions.filter((s) => s.status === "mixing").length} in mixing`}>
        <NewSessionDialog />
      </PageHeader>

      <div className="grid gap-3 lg:grid-cols-[minmax(0,22rem)_1fr] lg:items-center">
        <SearchInput value={query} onValueChange={setQuery} placeholder="Search by name, artist or key…" aria-label="Search sessions" />
        <div className="-mx-4 overflow-x-auto px-4 pb-1 lg:mx-0 lg:justify-self-end lg:px-0">
          <ToggleGroup type="single" value={filter} onValueChange={(v) => v && setFilter(v as Filter)} aria-label="Show" className="p-1.5">
            {(["all", "starred", "tracking", "mixing", "mastered", "draft"] as Filter[]).map((f) => (
              <ToggleGroupItem key={f} value={f} led className="h-9 text-sm">
                {f === "all" ? "All" : f === "starred" ? "Starred" : statusLabel[f]}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
        </div>
      </div>

      <section aria-label="Sessions" className="tactile-tray overflow-hidden rounded-3xl p-2">
        {shown.length ? (
          <div className="relative overflow-x-auto">
            <table className="w-full min-w-[40rem] border-separate border-spacing-y-1 text-sm">
              <thead>
                <tr className="text-left text-xs text-subtle">
                  <th scope="col" className="w-10 px-3 py-2 font-medium">
                    <span className="sr-only">Starred</span>
                  </th>
                  <th scope="col" className="px-3 py-2 font-medium">Session</th>
                  <th scope="col" className="px-3 py-2 font-medium">Status</th>
                  <th scope="col" className="px-3 py-2 text-right font-medium">Tempo</th>
                  <th scope="col" className="px-3 py-2 font-medium">Key</th>
                  <th scope="col" className="hidden px-3 py-2 text-right font-medium md:table-cell">Tracks</th>
                  <th scope="col" className="hidden px-3 py-2 font-medium md:table-cell">Updated</th>
                  <th scope="col" className="px-3 py-2">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {shown.map((s) => {
                  const current = s.id === sessionId;
                  return (
                    <tr key={s.id} className={cn("[&>td]:bg-surface/60 [&>td:first-child]:rounded-l-xl [&>td:last-child]:rounded-r-xl", current && "[&>td]:bg-surface")}>
                      <td className="px-2 py-2">
                        <Button
                          size="icon-sm"
                          variant="ghost"
                          aria-pressed={s.starred}
                          aria-label={`Star ${s.name}`}
                          onClick={() => dispatch({ type: "star-session", id: s.id })}
                          className={cn(s.starred ? "text-warning" : "text-subtle")}
                        >
                          <Star className={cn(s.starred && "fill-current")} />
                        </Button>
                      </td>
                      <td className="px-3 py-2">
                        <span className="block font-medium text-fg">{s.name}</span>
                        <span className="block text-xs text-subtle">
                          {s.artist} · {s.length}
                        </span>
                      </td>
                      <td className="px-3 py-2">
                        <Badge variant="well" status={statusLed[s.status]}>
                          {statusLabel[s.status]}
                        </Badge>
                      </td>
                      <td className="px-3 py-2 text-right font-mono text-fg tabular-nums">{s.bpm}</td>
                      <td className="px-3 py-2 whitespace-nowrap text-subtle">{s.key}</td>
                      <td className="hidden px-3 py-2 text-right font-mono text-subtle tabular-nums md:table-cell">{s.tracks}</td>
                      <td className="hidden px-3 py-2 whitespace-nowrap text-subtle md:table-cell">{s.updated}</td>
                      <td className="px-2 py-2 text-right">
                        <Button size="sm" disabled={current} onClick={() => open(s)} aria-label={current ? `${s.name} is open` : `Open ${s.name}`}>
                          {current ? "Open now" : "Open"}
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="grid justify-items-center gap-3 px-4 py-14 text-center">
            <p className="font-medium text-fg">No sessions match</p>
            <p className="text-sm text-subtle">Try another search or filter.</p>
            <Button
              size="sm"
              onClick={() => {
                setQuery("");
                setFilter("all");
              }}
            >
              Show all sessions
            </Button>
          </div>
        )}
      </section>
    </>
  );
}

function NewSessionDialog() {
  const { dispatch } = useStudio();
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const name = String(f.get("name") ?? "").trim();
    if (!name) return setError("Give the session a name.");
    const bpm = Math.min(300, Math.max(20, Number(f.get("bpm")) || 120));
    dispatch({
      type: "add-session",
      session: {
        id: `s-${Date.now()}`,
        name,
        artist: String(f.get("artist") ?? "").trim() || "Untitled artist",
        bpm,
        key: "C major",
        length: "0:00",
        status: "draft",
        tracks: 0,
        updated: "Just now",
        starred: false,
      },
    });
    setError(null);
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="accent">
          <Plus /> New session
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>New session</DialogTitle>
          <DialogDescription>Starts as a draft. You can change everything later.</DialogDescription>
        </DialogHeader>
        <form onSubmit={submit} className="grid gap-4" noValidate>
          <FormField label="Name" required error={error ?? undefined}>
            <Input name="name" placeholder="e.g. Late Train" autoFocus />
          </FormField>
          <div className="grid gap-4 sm:grid-cols-[1fr_8rem]">
            <FormField label="Artist">
              <Input name="artist" placeholder="Artist or project" />
            </FormField>
            <FormField label="Tempo (BPM)">
              <Input name="bpm" type="number" inputMode="numeric" min={20} max={300} defaultValue={120} />
            </FormField>
          </div>
          <DialogFooter>
            <Button type="button" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="accent">
              Create session
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
