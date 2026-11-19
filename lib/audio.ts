/** Fader position (0–100, 80 = unity) to decibels. */
export function faderToDb(v: number) {
  if (v <= 0) return -Infinity;
  return 60 * Math.log10(v / 80);
}

export const faderToGain = (v: number) => (v <= 0 ? 0 : Math.pow(10, faderToDb(v) / 20));

export function formatDb(db: number, digits = 1) {
  if (!Number.isFinite(db)) return "-∞";
  const r = Math.abs(db).toFixed(digits);
  if (Number(r) === 0) return r;
  return db > 0 ? `+${r}` : `-${r}`;
}

export const formatFader = (v: number) => formatDb(faderToDb(v));

export function formatPan(v: number) {
  if (v === 0) return "C";
  return v < 0 ? `L${-v}` : `R${v}`;
}

/** Beats to "bar.beat.sixteenth", e.g. 017.3.2. */
export function formatBars(beats: number) {
  const bar = Math.floor(beats / 4) + 1;
  const beat = Math.floor(beats % 4) + 1;
  const six = Math.floor((beats % 1) * 4) + 1;
  return `${String(bar).padStart(3, "0")}.${beat}.${six}`;
}

/** Beats to m:ss at a tempo. */
export function formatTime(beats: number, bpm: number) {
  const s = (beats * 60) / bpm;
  return `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`;
}

export const hueColor = (hue: number, l = 0.68, c = 0.15) => `oklch(${l} ${c} ${hue})`;

/** A deterministic pseudo-random number in [0, 1). */
export function rand(seed: number) {
  const x = Math.sin(seed * 12.9898 + 78.233) * 43758.5453;
  return x - Math.floor(x);
}

/**
 * A fake level (0–1) for the demo meters: a kick-like pulse on each beat plus some movement.
 * Replace it with real levels from an AnalyserNode or your engine's meter callback.
 */
export function demoLevel(seed: number, beats: number, energy: number) {
  const phase = beats % 1;
  const pulse = Math.exp(-phase * 4);
  const wobble = rand(seed * 31 + Math.floor(beats * 8)) * 0.25;
  return Math.min(1, energy * (0.45 + pulse * 0.4 + wobble));
}
