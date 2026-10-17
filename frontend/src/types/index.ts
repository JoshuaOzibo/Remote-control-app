export type ConnectionStatus = "idle" | "connecting" | "connected" | "error";

export type ConnectionError = "wrong-pin" | "locked" | "replaced" | "unreachable";

export type Mode = "dial" | "trackpad";

export type RecentLaptop = {
  name: string;
  address: string;
};
