import { create } from "zustand";
import { laptopNameFor } from "@/lib/network";
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
  autoConnect: boolean;
  hydrated: boolean;

  setStatus: (status: ConnectionStatus, error?: ConnectionError | null) => void;
  setMode: (mode: Mode) => void;
  setSensitivity: (sensitivity: number) => void;
  setAutoConnect: (autoConnect: boolean) => void;
  remember: (address: string, pin: string) => void;
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
  autoConnect: true,
  hydrated: false,

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

  remember: (address, pin) => {
    const existing = get().recent.find((r) => r.address === address);
    const entry: RecentLaptop = existing ?? { name: laptopNameFor(address), address };
    const recent = [entry, ...get().recent.filter((r) => r.address !== address)].slice(0, MAX_RECENT);
    save(STORAGE_KEYS.address, address);
    save(STORAGE_KEYS.pin, pin);
    save(STORAGE_KEYS.recent, recent);
    set({ address, pin, recent });
    get().setAutoConnect(true);
  },

  hydrate: () => {
    if (get().hydrated) return;
    set({
      address: load(STORAGE_KEYS.address, ""),
      pin: load(STORAGE_KEYS.pin, ""),
      recent: load<RecentLaptop[]>(STORAGE_KEYS.recent, []),
      mode: load<Mode>(STORAGE_KEYS.mode, "dial") === "trackpad" ? "trackpad" : "dial",
      autoConnect: load<boolean>(STORAGE_KEYS.autoConnect, true) !== false,
      hydrated: true,
    });
  },
}));
