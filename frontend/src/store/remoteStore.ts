import { create } from "zustand";
import { load, save, STORAGE_KEYS } from "@/lib/storage";
import type { ConnectionError, ConnectionStatus, Mode, RecentLaptop } from "@/types";

const MAX_RECENT = 5;

type RemoteState = {
  status: ConnectionStatus;
  error: ConnectionError | null;
  mode: Mode;
  address: string;
  pin: string;
  sensitivity: number;
  recent: RecentLaptop[];
  hydrated: boolean;

  setStatus: (status: ConnectionStatus, error?: ConnectionError | null) => void;
  setMode: (mode: Mode) => void;
  setSensitivity: (sensitivity: number) => void;
  /** Saves a working address + PIN and moves it to the top of the recent list. */
  remember: (address: string, pin: string) => void;
  /** Reads saved values from localStorage. Client only, called once on mount. */
  hydrate: () => void;
};

export const useRemoteStore = create<RemoteState>((set, get) => ({
  status: "idle",
  error: null,
  mode: "dial",
  address: "",
  pin: "",
  sensitivity: 1.6,
  recent: [],
  hydrated: false,

  setStatus: (status, error = null) => set({ status, error }),
  setMode: (mode) => {
    save(STORAGE_KEYS.mode, mode);
    set({ mode });
  },
  setSensitivity: (sensitivity) => set({ sensitivity }),

  remember: (address, pin) => {
    const existing = get().recent.find((r) => r.address === address);
    const entry: RecentLaptop = existing ?? { name: "My laptop", address };
    const recent = [entry, ...get().recent.filter((r) => r.address !== address)].slice(0, MAX_RECENT);
    save(STORAGE_KEYS.address, address);
    save(STORAGE_KEYS.pin, pin);
    save(STORAGE_KEYS.recent, recent);
    set({ address, pin, recent });
  },

  hydrate: () => {
    if (get().hydrated) return;
    set({
      address: load(STORAGE_KEYS.address, ""),
      pin: load(STORAGE_KEYS.pin, ""),
      recent: load<RecentLaptop[]>(STORAGE_KEYS.recent, []),
      mode: load<Mode>(STORAGE_KEYS.mode, "dial") === "trackpad" ? "trackpad" : "dial",
      hydrated: true,
    });
  },
}));
