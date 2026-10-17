// Shared contract with backend/src/ws. Keep in sync with the protocol table in CLAUDE.md.

export const KEYS = [
  "up",
  "down",
  "left",
  "right",
  "enter",
  "esc",
  "space",
  "tab",
  "0",
  "1",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "volup",
  "voldown",
  "mute",
  "playpause",
  "prev",
  "next",
  "fullscreen",
  "pageup",
  "pagedown",
  "lock",
  "voice",
  "desktop",
  "taskview",
  "settings",
  "back",
  "switch",
  "menu",
  "zoomin",
  "zoomout",
  "snip",
  "newtab",
  "closetab",
] as const;

export type KeyName = (typeof KEYS)[number];

export type ClickButton = "left" | "right" | "double";

export type ClientMsg =
  | { t: "auth"; pin: string }
  | { t: "move"; dx: number; dy: number }
  | { t: "scroll"; dy: number }
  | { t: "click"; b: ClickButton }
  | { t: "key"; k: KeyName }
  | { t: "type"; text: string };

export type AuthFailure = "wrong-pin" | "locked";

export type ServerMsg = { t: "auth"; ok: true } | { t: "auth"; ok: false; reason?: AuthFailure };

export const CLOSE_CODE = {
  replaced: 4002,
} as const;

export function isServerMsg(value: unknown): value is ServerMsg {
  return (
    typeof value === "object" &&
    value !== null &&
    (value as ServerMsg).t === "auth" &&
    typeof (value as ServerMsg).ok === "boolean"
  );
}
