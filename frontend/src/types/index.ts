export type ConnectionStatus = "idle" | "connecting" | "connected" | "error";

export type ConnectionError = "wrong-pin" | "locked" | "replaced" | "unreachable";

export const MODES = ["dial", "trackpad", "keypad"] as const;

export type Mode = (typeof MODES)[number];

export type RecentLaptop = {
  name: string;
  address: string;
};
