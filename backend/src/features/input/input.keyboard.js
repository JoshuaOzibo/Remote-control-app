import { setTimeout as sleep } from 'timers/promises';
import { KEYMAP } from './input.keymap.js';
import { Key, clipboard, keyboard } from './input.nut.js';
import { enqueue } from './input.queue.js';
import { segmentText } from './input.text.js';

const PASTE_SETTLE_MS = 150;

const heldKeys = new Set();

async function press(key) {
  await keyboard.pressKey(key);
  heldKeys.add(key);
}

async function release(key) {
  heldKeys.delete(key);
  await keyboard.releaseKey(key);
}

async function pressCombo(combo) {
  const pressed = [];
  try {
    for (const key of combo) {
      await press(key);
      pressed.push(key);
    }
  } finally {
    for (const key of pressed.reverse()) await release(key);
  }
}

async function pasteText(text) {
  const previous = await clipboard.getContent().catch(() => '');
  await clipboard.setContent(text);
  await pressCombo([Key.LeftControl, Key.V]);
  await sleep(PASTE_SETTLE_MS);
  if (previous) await clipboard.setContent(previous);
}

const writers = {
  type: (text) => keyboard.type(text),
  enter: () => pressCombo([Key.Enter]),
  paste: pasteText,
};

async function writeText(text) {
  for (const { kind, text: part } of segmentText(text)) await writers[kind](part);
}

function tapKey(name) {
  const combo = KEYMAP[name];
  if (combo) enqueue(() => pressCombo(combo));
}

function typeText(text) {
  enqueue(() => writeText(text));
}

async function releaseHeldKeys() {
  for (const key of [...heldKeys].reverse()) await release(key).catch(() => {});
}

export { tapKey, typeText, releaseHeldKeys };
