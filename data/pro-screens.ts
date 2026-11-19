import { AudioWaveform, FolderSearch, KeyboardMusic, Share2, SlidersVertical, Users, type LucideIcon } from "lucide-react";

/** Screens that are only in the full template. Screenshots live in public/pro/<slug>-{dark,light}.jpg. */
export type ProScreen = { slug: string; name: string; icon: LucideIcon; summary: string; points: string[] };

export const proScreens: ProScreen[] = [
  {
    slug: "arrange",
    name: "Arrange",
    icon: AudioWaveform,
    summary: "Clips on a timeline with sections, a loop region and a playhead.",
    points: ["Select, draw, split and erase tools", "Move and resize clips with the keyboard", "Song sections and a draggable loop", "Recorded takes land on armed tracks"],
  },
  {
    slug: "instrument",
    name: "Instrument",
    icon: KeyboardMusic,
    summary: "A playable synth with presets, filter, envelope and LFO.",
    points: ["Two-octave keyboard you can play with the mouse or computer keys", "Live waveform, filter curve and ADSR drawing", "Knobs for every parameter", "Presets and a “Surprise me” button"],
  },
  {
    slug: "effects",
    name: "Effects",
    icon: SlidersVertical,
    summary: "Each track's insert chain: EQ, compressor, delay and reverb.",
    points: ["EQ with a live frequency curve", "Compressor with a gain-reduction meter", "Bypass, reorder, add and remove effects", "Signal flow and a post-effects meter"],
  },
  {
    slug: "samples",
    name: "Samples",
    icon: FolderSearch,
    summary: "A sample browser with drag-and-drop import and tags.",
    points: ["Drop audio files to import them", "Filter by kind, tag and search", "Preview and add a sample to a track", "Star your favourites"],
  },
  {
    slug: "export",
    name: "Export",
    icon: Share2,
    summary: "A four-step wizard that renders the mix or its stems.",
    points: ["Choose the range, format and bit depth", "Loudness normalising and dither", "Render progress with a live gauge", "A list of previous exports"],
  },
  {
    slug: "collaborators",
    name: "Collaborators",
    icon: Users,
    summary: "The people on a session and what they changed.",
    points: ["Roles you can change per person", "Invite by email", "An activity feed with comments", "Who's online right now"],
  },
];
