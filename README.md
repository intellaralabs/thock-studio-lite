# Lowlight Studio Lite: free music mixing dashboard

A free, MIT-licensed music mixing dashboard built with **[Thock UI](https://thock-ui.vercel.app)**, the tactile React
component library by Intellara Labs. It has three screens, light and dark themes, and works on phones.

**Stack:** Next.js 16 (App Router), React 19, Tailwind CSS v4, Radix UI, lucide-react, next-themes.

## Quick start

```bash
npm install
npm run dev        # http://localhost:3000
```

## Screens

| Route | What it shows |
| --- | --- |
| `/` | Mixer: transport with play, stop and loop; eight channel strips with pan, mute, solo, a fader and a live LED meter; master fader with a stereo meter |
| `/sessions` | Every session in a searchable table, filtered by status or stars; open a session or create a new one |
| `/settings` | Audio devices, sample rate and buffer size (with the latency they give), recording options, theme and profile |

Every fader, pan slider and button works with the keyboard. `/?play&at=17` opens the mixer playing from bar 17,
which is handy for demos and screenshots.

## Project structure

```
app/                  layout.tsx (theme + state + shell) and one page per screen
components/ui/        Thock UI components (free, MIT; yours to edit)
components/lite/      app parts: shell, state provider, screens
data/studio.ts        demo data and the types the UI expects
lib/audio.ts          dB / pan / time formatting and the demo meter levels
lib/links.ts          Pro links and previews; set showProPreviews = false to remove them all
styles/tactile.css    design tokens: colours, raised and recessed surfaces, LEDs
```

## Connecting a real engine

All state lives in `components/lite/studio-provider.tsx`. Screens only call `useStudio()` (`updateTrack`,
`togglePlay`, `stop`, `dispatch`). To drive real audio (Web Audio, a native engine or a hardware desk):

1. Load the session's tracks from your API instead of `data/studio.ts`.
2. In `StudioProvider`, send each action to your engine as well as to the reducer.
3. Replace the demo clock in `StudioProvider` with your engine's transport position.
4. Replace `demoLevel()` in `lib/audio.ts` with real levels (for example from an `AnalyserNode`).

## Building your own product on this?

The "More screens" menu, the `/pro/*` preview pages, the mixer teaser, the "Get Pro" button and the footer
are all switched off by one line in `lib/links.ts`:

```ts
export const showProPreviews = false;
```

You can then also delete `app/pro`, `data/pro-screens.ts`, `components/lite/pro-*.tsx` and `public/pro`.

## Want more?

The **full Studio template** has 12 screens:

- a mixer with knobs, inserts, FX returns, a loudness gauge and CPU meter
- an arrangement timeline with clips, sections, a loop region and editing tools
- a playable synth with filter, envelope and LFO
- an effects rack (EQ, compressor, delay, reverb) with live curves
- a sample browser with drag-and-drop import and tags
- a four-step export wizard
- collaborators with roles, invites and an activity feed
- a ⌘K command menu, keyboard shortcuts and sign-in screens

It's built with the Pro components (knobs, faders, gauges, steps, sheets, toasts and more):
[thock-ui.vercel.app/templates/studio](https://thock-ui.vercel.app/templates/studio).

## Licence

MIT. See [LICENSE](LICENSE).
