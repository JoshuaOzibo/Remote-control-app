import { create } from "zustand";

export const DEMO_VIDEOS = [
  { title: "Sunset drive", meta: "Lo-fi mix · 1:12:04", from: "#FF9F43", to: "#7A2E8E" },
  { title: "Rain on the city", meta: "Ambient · 48:30", from: "#3B82F6", to: "#0F172A" },
  { title: "Mountain timelapse", meta: "4K · 12:41", from: "#34D399", to: "#1E3A5F" },
  { title: "Late-night coding", meta: "Focus beats · 2:03:11", from: "#A78BFA", to: "#111827" },
  { title: "Ocean waves", meta: "Nature · 3:00:00", from: "#22D3EE", to: "#0C4A6E" },
  { title: "Jazz café", meta: "Live set · 58:20", from: "#F472B6", to: "#3F1D38" },
] as const;

export const AD_SECONDS = 5;
const VOLUME_STEP = 2;
const MOVED_GOAL_DISTANCE = 8;

export type DemoGoal = "moved" | "skippedAd" | "volume" | "typed";
export type ToastKind = "info" | "volume" | "media";
export type DemoToast = { id: number; title: string; detail?: string; kind: ToastKind };
export type DemoClick = { id: number; x: number; y: number; button: "left" | "right" | "double" };
export type DemoScroll = { id: number; dy: number; page: boolean };

type DemoData = {
  cursor: { x: number; y: number };
  travelled: number;
  click: DemoClick | null;
  scroll: DemoScroll | null;
  adSecondsLeft: number;
  adSkipped: boolean;
  playing: boolean;
  nowPlaying: number;
  focusIndex: number;
  fullscreen: boolean;
  volume: number;
  muted: boolean;
  notes: string;
  toast: DemoToast | null;
  locked: boolean;
  goals: Record<DemoGoal, boolean>;
};

type DemoActions = {
  moveCursor: (dx: number, dy: number) => void;
  clickAtCursor: (button: DemoClick["button"]) => void;
  scrollList: (dy: number, page?: boolean) => void;
  tickAd: () => void;
  skipAd: () => void;
  playVideo: (index: number) => void;
  moveFocus: (delta: number) => void;
  togglePlay: () => void;
  setFullscreen: (fullscreen: boolean) => void;
  changeVolume: (delta: number) => void;
  toggleMute: () => void;
  addNotes: (text: string) => void;
  showToast: (title: string, detail?: string, kind?: ToastKind) => void;
  clearToast: (id: number) => void;
  setLocked: (locked: boolean) => void;
  reset: () => void;
};

let nextId = 1;
const newId = () => nextId++;
const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));
const wrap = (index: number) => (index + DEMO_VIDEOS.length) % DEMO_VIDEOS.length;

function initialData(): DemoData {
  return {
    cursor: { x: 50, y: 45 },
    travelled: 0,
    click: null,
    scroll: null,
    adSecondsLeft: AD_SECONDS,
    adSkipped: false,
    playing: false,
    nowPlaying: 0,
    focusIndex: 0,
    fullscreen: false,
    volume: 40,
    muted: false,
    notes: "",
    toast: null,
    locked: false,
    goals: { moved: false, skippedAd: false, volume: false, typed: false },
  };
}

export const useDemoStore = create<DemoData & DemoActions>((set, get) => {
  const complete = (goal: DemoGoal) => set((s) => (s.goals[goal] ? s : { goals: { ...s.goals, [goal]: true } }));

  return {
    ...initialData(),

    moveCursor: (dx, dy) => {
      const { cursor, travelled } = get();
      const next = { x: clamp(cursor.x + dx, 0, 99), y: clamp(cursor.y + dy, 0, 98) };
      const total = travelled + Math.hypot(dx, dy);
      set({ cursor: next, travelled: total });
      if (total > MOVED_GOAL_DISTANCE) complete("moved");
    },

    clickAtCursor: (button) => {
      const { cursor } = get();
      set({ click: { id: newId(), x: cursor.x, y: cursor.y, button } });
    },

    scrollList: (dy, page = false) => set({ scroll: { id: newId(), dy, page } }),

    tickAd: () => set((s) => ({ adSecondsLeft: Math.max(0, s.adSecondsLeft - 1) })),

    skipAd: () => {
      if (get().adSkipped || get().adSecondsLeft > 0) return;
      set({ adSkipped: true, playing: true });
      complete("skippedAd");
      get().showToast("Ad skipped", "Enjoy the video", "media");
    },

    playVideo: (index) => {
      const nowPlaying = wrap(index);
      set({ nowPlaying, focusIndex: nowPlaying, playing: get().adSkipped });
      get().showToast(DEMO_VIDEOS[nowPlaying].title, "Now playing", "media");
    },

    moveFocus: (delta) => set((s) => ({ focusIndex: wrap(s.focusIndex + delta) })),

    togglePlay: () => {
      if (!get().adSkipped) {
        get().showToast("The ad is still playing", "Skip it first", "info");
        return;
      }
      const playing = !get().playing;
      set({ playing });
      get().showToast(playing ? "Playing" : "Paused", DEMO_VIDEOS[get().nowPlaying].title, "media");
    },

    setFullscreen: (fullscreen) => set({ fullscreen }),

    changeVolume: (delta) => {
      const volume = clamp(get().volume + delta * VOLUME_STEP, 0, 100);
      set({ volume, muted: false });
      complete("volume");
      get().showToast("Volume", String(volume), "volume");
    },

    toggleMute: () => {
      const muted = !get().muted;
      set({ muted });
      complete("volume");
      get().showToast(muted ? "Muted" : "Volume", muted ? "0" : String(get().volume), "volume");
    },

    addNotes: (text) => {
      set((s) => ({ notes: (s.notes + text).slice(-400) }));
      complete("typed");
    },

    showToast: (title, detail, kind = "info") => set({ toast: { id: newId(), title, detail, kind } }),

    clearToast: (id) => set((s) => (s.toast?.id === id ? { toast: null } : s)),

    setLocked: (locked) => set({ locked }),

    reset: () => set(initialData()),
  };
});
