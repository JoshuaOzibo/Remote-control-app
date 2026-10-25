import { create } from "zustand";
import { laptopNameFor } from "@/lib/network";
import { load, save, STORAGE_KEYS } from "@/lib/storage";
import { MODES, type ConnectionError, type ConnectionStatus, type Mode, type RecentLaptop } from "@/types";

const MAX_RECENT = 5;
const NUDGE_EVERY_MS = 1200;

function savedMode(): Mode {
  const mode = load<string>(STORAGE_KEYS.mode, "dial");
  return MODES.find((known) => known === mode) ?? "dial";
}

function savedRecent(): RecentLaptop[] {
  const raw = load<unknown>(STORAGE_KEYS.recent, []);
  if (!Array.isArray(raw)) return [];
  return raw
    .filter((entry) => typeof entry?.address === "string" && entry.address)
    .map((entry) => ({
      address: entry.address,
      name: typeof entry.name === "string" && entry.name ? entry.name : laptopNameFor(entry.address),
      pin: typeof entry.pin === "string" ? entry.pin : "",
      lastUsed: typeof entry.lastUsed === "number" ? entry.lastUsed : 0,
    }))
    .slice(0, MAX_RECENT);
}

type RemoteState = {
  status: ConnectionStatus;
  error: ConnectionError | null;
  mode: Mode;
  address: string;
  pin: string;
  sensitivity: number;
  recent: RecentLaptop[];
  autoConnect: boolean;
  setupCode: string | null;
  hydrated: boolean;
  offlineNudgeAt: number;

  setStatus: (status: ConnectionStatus, error?: ConnectionError | null) => void;
  setMode: (mode: Mode) => void;
  setSensitivity: (sensitivity: number) => void;
  setAutoConnect: (autoConnect: boolean) => void;
  setSetupCode: (setupCode: string | null) => void;
  remember: (address: string, pin: string) => void;
  rename: (address: string, name: string) => void;
  forget: (address: string) => void;
  hydrate: () => void;
  nudgeOffline: () => boolean;
};

export const useRemoteStore = create<RemoteState>((set, get) => ({
  status: "idle",
  error: null,
  mode: "dial",
  address: "",
  pin: "",
  sensitivity: 1.6,
  recent: [],
  autoConnect: true,
  setupCode: null,
  hydrated: false,
  offlineNudgeAt: 0,

  setStatus: (status, error = null) => set({ status, error }),
  setMode: (mode) => {
    save(STORAGE_KEYS.mode, mode);
    set({ mode });
  },
  setSensitivity: (sensitivity) => set({ sensitivity }),
  setAutoConnect: (autoConnect) => {
    save(STORAGE_KEYS.autoConnect, autoConnect);
    set({ autoConnect });
  },
  setSetupCode: (setupCode) => set({ setupCode }),

  remember: (address, pin) => {
    const existing = get().recent.find((r) => r.address === address);
    const entry: RecentLaptop = { name: existing?.name ?? laptopNameFor(address), address, pin, lastUsed: Date.now() };
    const recent = [entry, ...get().recent.filter((r) => r.address !== address)].slice(0, MAX_RECENT);
    save(STORAGE_KEYS.address, address);
    save(STORAGE_KEYS.pin, pin);
    save(STORAGE_KEYS.recent, recent);
    set({ address, pin, recent });
    get().setAutoConnect(true);
  },

  rename: (address, name) => {
    const recent = get().recent.map((r) => (r.address === address ? { ...r, name } : r));
    save(STORAGE_KEYS.recent, recent);
    set({ recent });
  },

  forget: (address) => {
    const recent = get().recent.filter((r) => r.address !== address);
    save(STORAGE_KEYS.recent, recent);
    set({ recent });
  },

  hydrate: () => {
    if (get().hydrated) return;
    set({
      address: load(STORAGE_KEYS.address, ""),
      pin: load(STORAGE_KEYS.pin, ""),
      recent: savedRecent(),
      mode: savedMode(),
      autoConnect: load<boolean>(STORAGE_KEYS.autoConnect, true) !== false,
      hydrated: true,
    });
  },

  nudgeOffline: () => {
    const now = Date.now();
    if (now - get().offlineNudgeAt < NUDGE_EVERY_MS) return false;
    set({ offlineNudgeAt: now });
    return true;
  },
}));
