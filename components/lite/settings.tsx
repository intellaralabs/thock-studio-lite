"use client";

import { useTheme } from "next-themes";
import { useState, useSyncExternalStore, type FormEvent } from "react";
import { audioDevices, bufferSizes, outputDevices, sampleRates, studio } from "@/data/studio";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { PageHeader } from "@/components/lite/page-header";

const options = [
  { id: "o-monitor", label: "Low-latency monitoring", hint: "Hear armed inputs straight from the interface", on: true },
  { id: "o-countin", label: "Count in before recording", hint: "One bar of clicks", on: true },
  { id: "o-autosave", label: "Save automatically", hint: "Every 5 minutes, keeps 20 versions", on: false },
];

const noop = () => () => {};

export function SettingsScreen() {
  const { theme, setTheme } = useTheme();
  // The theme is only known in the browser; render the radio group unselected on the server.
  const mounted = useSyncExternalStore(noop, () => true, () => false);
  const [input, setInput] = useState(audioDevices[1]);
  const [output, setOutput] = useState(outputDevices[1]);
  const [rate, setRate] = useState(String(sampleRates[1]));
  const [buffer, setBuffer] = useState(String(bufferSizes[1]));
  const [saved, setSaved] = useState(false);
  const latency = ((Number(buffer) * 2) / Number(rate)) * 1000 + 1.5;

  function save(e: FormEvent) {
    e.preventDefault();
    setSaved(true);
  }

  return (
    <>
      <PageHeader title="Settings" description="Your audio setup, how the app looks, and your profile." />
      <div className="grid max-w-2xl gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Audio</CardTitle>
            <CardDescription>
              Round-trip latency: <span className="font-mono text-fg tabular-nums">{latency.toFixed(1)} ms</span>
            </CardDescription>
          </CardHeader>
          <CardContent className="gap-5">
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField label="Input device">
                <Select value={input} onValueChange={setInput}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {audioDevices.map((d) => (
                      <SelectItem key={d} value={d}>
                        {d}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormField>
              <FormField label="Output device">
                <Select value={output} onValueChange={setOutput}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {outputDevices.map((d) => (
                      <SelectItem key={d} value={d}>
                        {d}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormField>
            </div>
            <div className="grid gap-2">
              <span id="rate-label" className="text-sm font-medium text-fg">
                Sample rate
              </span>
              <ToggleGroup type="single" value={rate} onValueChange={(v) => v && setRate(v)} aria-labelledby="rate-label" className="w-fit max-w-full flex-wrap p-1.5">
                {sampleRates.map((r) => (
                  <ToggleGroupItem key={r} value={String(r)} led className="h-9 text-sm">
                    {(r / 1000).toFixed(r % 1000 ? 1 : 0)} kHz
                  </ToggleGroupItem>
                ))}
              </ToggleGroup>
            </div>
            <div className="grid gap-2">
              <span id="buffer-label" className="text-sm font-medium text-fg">
                Buffer size
              </span>
              <ToggleGroup type="single" value={buffer} onValueChange={(v) => v && setBuffer(v)} aria-labelledby="buffer-label" className="w-fit max-w-full flex-wrap p-1.5">
                {bufferSizes.map((b) => (
                  <ToggleGroupItem key={b} value={String(b)} led className="h-9 text-sm">
                    {b}
                  </ToggleGroupItem>
                ))}
              </ToggleGroup>
              <p className="text-xs text-subtle">Smaller buffers feel tighter when recording but use more CPU.</p>
            </div>
            <div className="grid">
              {options.map((o, i) => (
                <div key={o.id}>
                  {i > 0 && <Separator className="my-1" />}
                  <div className="flex items-center gap-4 py-3">
                    <label htmlFor={o.id} className="min-w-0 flex-1 cursor-pointer">
                      <span className="block text-sm font-medium text-fg">{o.label}</span>
                      <span className="block text-xs text-subtle">{o.hint}</span>
                    </label>
                    <Switch id={o.id} size="sm" defaultChecked={o.on} />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Appearance</CardTitle>
          </CardHeader>
          <CardContent>
            <RadioGroup value={mounted ? theme : undefined} onValueChange={setTheme} aria-label="Theme" className="grid gap-3 sm:grid-cols-3">
              {[
                { value: "light", label: "Light" },
                { value: "dark", label: "Dark" },
                { value: "system", label: "Match system" },
              ].map((o) => (
                <div key={o.value} className="flex items-center gap-3">
                  <RadioGroupItem id={`theme-${o.value}`} value={o.value} />
                  <Label htmlFor={`theme-${o.value}`}>{o.label}</Label>
                </div>
              ))}
            </RadioGroup>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Profile</CardTitle>
            <CardDescription>Shown on sessions you share.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={save} onChange={() => setSaved(false)} className="grid gap-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <FormField label="Name">
                  <Input name="name" defaultValue={studio.owner} autoComplete="name" />
                </FormField>
                <FormField label="Email">
                  <Input name="email" type="email" defaultValue={studio.email} autoComplete="email" />
                </FormField>
              </div>
              <FormField label="Studio name">
                <Input name="studio" defaultValue={studio.name} />
              </FormField>
              {saved && (
                <Alert variant="success">
                  <AlertDescription>Saved.</AlertDescription>
                </Alert>
              )}
              <Button type="submit" variant="accent" className="w-fit">
                Save changes
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
