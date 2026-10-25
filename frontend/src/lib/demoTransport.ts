import { ACTION_GROUPS } from "@/components/more/moreActions";
import type { Transport } from "@/hooks/useRemote";
import type { ClientMsg, KeyName } from "@/lib/protocol";
import { useDemoStore } from "@/store/demoStore";

const SCREEN_WIDTH_PX = 1920;
const SCREEN_ASPECT = 10 / 16;
const MOVE_GAIN = 1.5;
const MOVE_X = (100 / SCREEN_WIDTH_PX) * MOVE_GAIN;
const MOVE_Y = MOVE_X / SCREEN_ASPECT;

const ACTIONS = Object.values(ACTION_GROUPS)
  .flat()
  .flatMap(({ actions }) => actions);

const SHORTCUTS: Partial<Record<KeyName, string>> = {
  ...Object.fromEntries(ACTIONS.map(({ k, hint }) => [k, hint])),
  voice: "Win + H",
};

const LABELS: Partial<Record<KeyName, string>> = {
  ...Object.fromEntries(ACTIONS.map(({ k, label }) => [k, label])),
  voice: "Voice typing",
  esc: "Escape",
};

function showShortcut(k: KeyName) {
  useDemoStore.getState().showToast(LABELS[k] ?? k, SHORTCUTS[k]);
}

const KEY_ACTIONS: Partial<Record<KeyName, () => void>> = {
  up: () => useDemoStore.getState().moveFocus(-1),
  down: () => useDemoStore.getState().moveFocus(1),
  left: () => useDemoStore.getState().showToast("Rewind 5 seconds", "Left arrow", "media"),
  right: () => useDemoStore.getState().showToast("Skip ahead 5 seconds", "Right arrow", "media"),
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
