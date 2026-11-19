/* Demo data for the starter. Replace it with your own engine or API; the types describe what the UI expects. */

export const studio = {
  name: "Lowlight Studio",
  owner: "Jordan Lee",
  email: "jordan@example.com",
};

/* ------------------------------------------------------------------ tracks */

export type TrackKind = "drums" | "bass" | "keys" | "synth" | "guitar" | "vocal" | "fx";

export type Track = {
  id: string;
  name: string;
  kind: TrackKind;
  /** Colour hue (oklch) for the strip. */
  hue: number;
  /** Fader position 0–100. 80 is unity (0 dB). */
  volume: number;
  /** -50 (hard left) … 50 (hard right). */
  pan: number;
  mute: boolean;
  solo: boolean;
  /** How busy the part is, 0–1. Only used to animate the demo meters. */
  energy: number;
};

export const tracks: Track[] = [
  { id: "drums", name: "Drums", kind: "drums", hue: 25, volume: 78, pan: 0, mute: false, solo: false, energy: 0.95 },
  { id: "bass", name: "Bass", kind: "bass", hue: 55, volume: 74, pan: 0, mute: false, solo: false, energy: 0.85 },
  { id: "rhodes", name: "Rhodes", kind: "keys", hue: 85, volume: 66, pan: -18, mute: false, solo: false, energy: 0.6 },
  { id: "pad", name: "Pad", kind: "synth", hue: 165, volume: 58, pan: 12, mute: false, solo: false, energy: 0.7 },
  { id: "lead", name: "Lead", kind: "synth", hue: 210, volume: 70, pan: 8, mute: false, solo: false, energy: 0.75 },
  { id: "guitar", name: "Guitar", kind: "guitar", hue: 260, volume: 62, pan: -30, mute: true, solo: false, energy: 0.65 },
  { id: "vocal", name: "Vocal", kind: "vocal", hue: 320, volume: 80, pan: 0, mute: false, solo: false, energy: 0.9 },
  { id: "fx", name: "FX", kind: "fx", hue: 290, volume: 52, pan: 22, mute: false, solo: false, energy: 0.4 },
];

/* ---------------------------------------------------------------- sessions */

export type SessionStatus = "draft" | "tracking" | "mixing" | "mastered";

export type Session = {
  id: string;
  name: string;
  artist: string;
  bpm: number;
  key: string;
  /** Length, m:ss. */
  length: string;
  status: SessionStatus;
  tracks: number;
  /** Relative, e.g. "2 hours ago". */
  updated: string;
  starred: boolean;
};

export const statusLabel: Record<SessionStatus, string> = { draft: "Draft", tracking: "Tracking", mixing: "Mixing", mastered: "Mastered" };

export const sessions: Session[] = [
  { id: "night-ferry", name: "Night Ferry", artist: "Harbor Lights", bpm: 96, key: "F minor", length: "2:00", status: "mixing", tracks: 8, updated: "Just now", starred: true },
  { id: "paper-moons", name: "Paper Moons", artist: "Harbor Lights", bpm: 118, key: "A major", length: "3:24", status: "tracking", tracks: 14, updated: "Yesterday", starred: true },
  { id: "low-tide", name: "Low Tide", artist: "Pale Orchard", bpm: 84, key: "D minor", length: "4:02", status: "mastered", tracks: 22, updated: "3 days ago", starred: false },
  { id: "glasshouse", name: "Glasshouse", artist: "Pale Orchard", bpm: 124, key: "C minor", length: "5:16", status: "mixing", tracks: 31, updated: "4 days ago", starred: false },
  { id: "slow-signal", name: "Slow Signal", artist: "Kite District", bpm: 72, key: "E♭ major", length: "3:48", status: "draft", tracks: 6, updated: "1 week ago", starred: false },
  { id: "copper-wire", name: "Copper Wire", artist: "Kite District", bpm: 140, key: "G minor", length: "2:51", status: "tracking", tracks: 18, updated: "1 week ago", starred: true },
  { id: "afterglow", name: "Afterglow (Radio Edit)", artist: "Harbor Lights", bpm: 102, key: "B♭ major", length: "3:10", status: "mastered", tracks: 27, updated: "2 weeks ago", starred: false },
  { id: "field-notes", name: "Field Notes", artist: "Juniper & Ash", bpm: 90, key: "G major", length: "3:33", status: "draft", tracks: 4, updated: "3 weeks ago", starred: false },
  { id: "northbound", name: "Northbound", artist: "Juniper & Ash", bpm: 128, key: "F♯ minor", length: "6:05", status: "mixing", tracks: 24, updated: "1 month ago", starred: false },
];

/* ------------------------------------------------------------------- audio */

export const audioDevices = ["Built-in Microphone", "Desk Interface 2×4 (USB)", "Studio Interface 18×20 (Thunderbolt)"];
export const outputDevices = ["Built-in Output", "Desk Interface 2×4 (USB)", "Studio Interface 18×20 (Thunderbolt)"];
export const sampleRates = [44100, 48000, 96000];
export const bufferSizes = [64, 128, 256, 512];
