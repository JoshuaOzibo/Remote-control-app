import { setTimeout as sleep } from 'timers/promises';
import { KEYMAP } from './input.keymap.js';
import { Key, clipboard, keyboard } from './input.nut.js';
import { enqueue } from './input.queue.js';
import { segmentText } from './input.text.js';

const PASTE_SETTLE_MS = 150;

async function pressCombo(combo) {
  const held = [];
  try {
    for (const key of combo) {
      await keyboard.pressKey(key);
      held.push(key);
    }
  } finally {
    for (const key of held.reverse()) await keyboard.releaseKey(key);
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

export { tapKey, typeText };
