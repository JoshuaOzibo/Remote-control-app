import { clipboard as nutClipboard } from './input.nut.js';

let clipboard = nutClipboard;

function useClipboard(next) {
  clipboard = next ?? nutClipboard;
}

async function readClipboard() {
  return clipboard.getContent();
}

async function writeClipboard(text) {
  await clipboard.setContent(text);
}

export { useClipboard, readClipboard, writeClipboard };
