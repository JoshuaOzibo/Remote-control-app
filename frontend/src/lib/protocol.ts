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
  "start",
  "search",
  "explorer",
  "taskmanager",
  "minimize",
  "maximize",
  "snapleft",
  "snapright",
  "closewindow",
  "project",
  "quicksettings",
  "notifications",
  "clipboard",
  "emoji",
  "reopentab",
  "nexttab",
  "prevtab",
  "refresh",
  "forward",
  "addressbar",
  "find",
  "newwindow",
  "zoomreset",
  "copy",
  "cut",
  "paste",
  "undo",
  "redo",
  "selectall",
  "save",
] as const;

export type KeyName = (typeof KEYS)[number];

export type ClickButton = "left" | "right" | "double";

export type ClientMsg =
  | { t: "auth"; pin: string }
  | { t: "setup"; code: string; pin: string }
  | { t: "move"; dx: number; dy: number }
  | { t: "scroll"; dy: number }
  | { t: "click"; b: ClickButton }
  | { t: "key"; k: KeyName }
  | { t: "type"; text: string };

export type AuthFailure = "wrong-pin" | "locked" | "not-set-up";

export type SetupFailure = "setup-expired" | "locked";

export type ServerMsg =
  | { t: "auth"; ok: true }
  | { t: "auth"; ok: false; reason?: AuthFailure }
  | { t: "setup"; ok: true }
  | { t: "setup"; ok: false; reason?: SetupFailure };

export const CLOSE_CODE = {
  replaced: 4002,
  setupExpired: 4004,
  notSetUp: 4005,
} as const;

const SERVER_MSG_TYPES: ReadonlySet<string> = new Set(["auth", "setup"]);

export function isServerMsg(value: unknown): value is ServerMsg {
  return (
    typeof value === "object" &&
    value !== null &&
    SERVER_MSG_TYPES.has((value as ServerMsg).t) &&
    typeof (value as ServerMsg).ok === "boolean"
  );
}
