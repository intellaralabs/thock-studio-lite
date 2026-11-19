"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useReducer, type ReactNode } from "react";
import { sessions as demoSessions, tracks as demoTracks, type Session, type Track } from "@/data/studio";

type Transport = { playing: boolean; loop: boolean; tempo: number; beats: number };

type State = {
  tracks: Track[];
  master: number;
  sessions: Session[];
  sessionId: string;
  transport: Transport;
};

type Action =
  | { type: "track"; id: string; patch: Partial<Track> }
  | { type: "tracks"; patch: Partial<Track> }
  | { type: "master"; value: number }
  | { type: "transport"; patch: Partial<Transport> }
  | { type: "tick"; delta: number }
  | { type: "open-session"; id: string }
  | { type: "star-session"; id: string }
  | { type: "add-session"; session: Session };

/** Song length in beats (48 bars of 4/4). With loop on, the playhead wraps bars 17–25. */
const SONG = 48 * 4;
const LOOP: [number, number] = [16 * 4, 24 * 4];

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "track":
      return { ...state, tracks: state.tracks.map((t) => (t.id === action.id ? { ...t, ...action.patch } : t)) };
    case "tracks":
      return { ...state, tracks: state.tracks.map((t) => ({ ...t, ...action.patch })) };
    case "master":
      return { ...state, master: action.value };
    case "transport":
      return { ...state, transport: { ...state.transport, ...action.patch } };
    case "tick": {
      const t = state.transport;
      let beats = t.beats + action.delta;
      if (t.loop && beats >= LOOP[1]) beats = LOOP[0] + ((beats - LOOP[0]) % (LOOP[1] - LOOP[0]));
      if (beats >= SONG) return { ...state, transport: { ...t, playing: false, beats: 0 } };
      return { ...state, transport: { ...t, beats } };
    }
    case "open-session": {
      const s = state.sessions.find((x) => x.id === action.id);
      return { ...state, sessionId: action.id, transport: { ...state.transport, playing: false, beats: 0, tempo: s?.bpm ?? state.transport.tempo } };
    }
    case "star-session":
      return { ...state, sessions: state.sessions.map((s) => (s.id === action.id ? { ...s, starred: !s.starred } : s)) };
    case "add-session":
      return { ...state, sessions: [action.session, ...state.sessions] };
  }
}

const initial: State = {
  tracks: demoTracks,
  master: 76,
  sessions: demoSessions,
  sessionId: demoSessions[0].id,
  transport: { playing: false, loop: false, tempo: demoSessions[0].bpm, beats: 0 },
};

type Ctx = State & {
  dispatch: (a: Action) => void;
  session: Session;
  updateTrack: (id: string, patch: Partial<Track>) => void;
  /** Whether a track can be heard, taking mute and solo into account. */
  audible: (t: Track) => boolean;
  anySolo: boolean;
  togglePlay: () => void;
  stop: () => void;
};

const StudioContext = createContext<Ctx | null>(null);

/**
 * All app state in one place. Screens call useStudio(); to drive a real audio engine, send each
 * action to it from here as well as to the reducer.
 */
export function StudioProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initial);
  const { playing, tempo } = state.transport;

  // A simple clock for the demo: moves the playhead ~20 times a second while playing.
  // Replace it with your engine's transport position.
  useEffect(() => {
    if (!playing) return;
    let last = performance.now();
    const id = window.setInterval(() => {
      const now = performance.now();
      dispatch({ type: "tick", delta: ((now - last) / 1000) * (tempo / 60) });
      last = now;
    }, 50);
    return () => window.clearInterval(id);
  }, [playing, tempo]);

  // Demo deep link: /?play&at=17 starts playing from bar 17 (handy for screenshots).
  useEffect(() => {
    const q = new URLSearchParams(window.location.search);
    const at = Number(q.get("at"));
    if (at > 0 || q.has("play")) dispatch({ type: "transport", patch: { beats: at > 0 ? (at - 1) * 4 : 0, playing: q.has("play") } });
  }, []);

  const updateTrack = useCallback((id: string, patch: Partial<Track>) => dispatch({ type: "track", id, patch }), []);
  const value = useMemo<Ctx>(() => {
    const anySolo = state.tracks.some((t) => t.solo);
    return {
      ...state,
      dispatch,
      session: state.sessions.find((s) => s.id === state.sessionId) ?? state.sessions[0],
      updateTrack,
      anySolo,
      audible: (t) => !t.mute && (!anySolo || t.solo),
      togglePlay: () => dispatch({ type: "transport", patch: { playing: !state.transport.playing } }),
      stop: () => dispatch({ type: "transport", patch: { playing: false, beats: 0 } }),
    };
  }, [state, updateTrack]);

  return <StudioContext.Provider value={value}>{children}</StudioContext.Provider>;
}

export function useStudio() {
  const ctx = useContext(StudioContext);
  if (!ctx) throw new Error("useStudio must be used inside <StudioProvider>");
  return ctx;
}
