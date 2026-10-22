import { ACTION_GROUPS } from "@/components/more/moreActions";
import type { Transport } from "@/hooks/useRemote";
import type { ClientMsg, KeyName } from "@/lib/protocol";
import { useDemoStore } from "@/store/demoStore";

const SCREEN_WIDTH_PX = 1920;
const SCREEN_ASPECT = 10 / 16;
const MOVE_GAIN = 1.5;
const MOVE_X = (100 / SCREEN_WIDTH_PX) * MOVE_GAIN;
const MOVE_Y = MOVE_X / SCREEN_ASPECT;

const SHORTCUTS: Partial<Record<KeyName, string>> = {
  start: "Win",
  search: "Win + S",
  explorer: "Win + E",
  taskmanager: "Ctrl + Shift + Esc",
  desktop: "Win + D",
  lock: "Win + L",
  minimize: "Win + Down",
  maximize: "Win + Up",
  switch: "Alt + Tab",
  snapleft: "Win + Left",
  snapright: "Win + Right",
  closewindow: "Alt + F4",
  project: "Win + P",
  quicksettings: "Win + A",
  notifications: "Win + N",
  clipboard: "Win + V",
  emoji: "Win + .",
  newtab: "Ctrl + T",
  closetab: "Ctrl + W",
  reopentab: "Ctrl + Shift + T",
  prevtab: "Ctrl + Shift + Tab",
  nexttab: "Ctrl + Tab",
  newwindow: "Ctrl + N",
  back: "Alt + Left",
  forward: "Alt + Right",
  refresh: "F5",
  addressbar: "Ctrl + L",
  find: "Ctrl + F",
  menu: "Shift + F10",
  zoomout: "Ctrl + -",
  zoomreset: "Ctrl + 0",
  zoomin: "Ctrl + =",
  copy: "Ctrl + C",
  cut: "Ctrl + X",
  paste: "Ctrl + V",
  undo: "Ctrl + Z",
  redo: "Ctrl + Y",
  selectall: "Ctrl + A",
  save: "Ctrl + S",
  snip: "Win + Shift + S",
  taskview: "Win + Tab",
  settings: "Win + I",
  voice: "Win + H",
};

const EXTRA_LABELS: Partial<Record<KeyName, string>> = {
  taskview: "Task view",
  settings: "Settings",
  voice: "Voice typing",
  esc: "Escape",
};

const LABELS: Partial<Record<KeyName, string>> = {
  ...Object.fromEntries(
    Object.values(ACTION_GROUPS)
      .flat()
      .flatMap(({ actions }) => actions.map(({ k, label }) => [k, label])),
  ),
  ...EXTRA_LABELS,
};

function showShortcut(k: KeyName) {
  useDemoStore.getState().showToast(LABELS[k] ?? k, SHORTCUTS[k]);
}

const KEY_ACTIONS: Partial<Record<KeyName, () => void>> = {
  up: () => useDemoStore.getState().moveFocus(-1),
  down: () => useDemoStore.getState().moveFocus(1),
  left: () => useDemoStore.getState().showToast("Back 10 seconds", "Left arrow", "media"),
  right: () => useDemoStore.getState().showToast("Forward 10 seconds", "Right arrow", "media"),
  enter: () => {
    const store = useDemoStore.getState();
    store.playVideo(store.focusIndex);
  },
  space: () => useDemoStore.getState().togglePlay(),
  playpause: () => useDemoStore.getState().togglePlay(),
  next: () => {
    const store = useDemoStore.getState();
    store.playVideo(store.nowPlaying + 1);
  },
  prev: () => {
    const store = useDemoStore.getState();
    store.playVideo(store.nowPlaying - 1);
  },
  volup: () => useDemoStore.getState().changeVolume(1),
  voldown: () => useDemoStore.getState().changeVolume(-1),
  mute: () => useDemoStore.getState().toggleMute(),
  fullscreen: () => {
    const store = useDemoStore.getState();
    const fullscreen = !store.fullscreen;
    store.setFullscreen(fullscreen);
    store.showToast(fullscreen ? "Full screen" : "Exit full screen", "F");
  },
  esc: () => {
    const store = useDemoStore.getState();
    if (store.fullscreen) store.setFullscreen(false);
    store.showToast("Escape", "Esc");
  },
  pageup: () => useDemoStore.getState().scrollList(1, true),
  pagedown: () => useDemoStore.getState().scrollList(-1, true),
  tab: () => useDemoStore.getState().addNotes("    "),
  lock: () => {
    useDemoStore.getState().setLocked(true);
    showShortcut("lock");
  },
};

function pressKey(k: KeyName) {
  if (/^\d$/.test(k)) {
    useDemoStore.getState().addNotes(k);
    return;
  }
  (KEY_ACTIONS[k] ?? (() => showShortcut(k)))();
}

function handle(msg: ClientMsg) {
  const store = useDemoStore.getState();
  if (store.locked && msg.t !== "move") store.setLocked(false);
  switch (msg.t) {
    case "move":
      store.moveCursor(msg.dx * MOVE_X, msg.dy * MOVE_Y);
      break;
    case "click":
      store.clickAtCursor(msg.b);
      break;
    case "scroll":
      store.scrollList(msg.dy);
      break;
    case "type":
      store.addNotes(msg.text);
      break;
    case "key":
      pressKey(msg.k);
      break;
  }
}

export const demoTransport: Transport = {
  send(msg) {
    handle(msg);
    return true;
  },
};
