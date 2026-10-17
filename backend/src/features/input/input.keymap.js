import { log } from '../../shared/logger.js';
import { Key } from './input.nut.js';

const digits = Object.fromEntries(Array.from({ length: 10 }, (_, digit) => [String(digit), [Key[`Num${digit}`]]]));

const KEYMAP = {
  up: [Key.Up],
  down: [Key.Down],
  left: [Key.Left],
  right: [Key.Right],
  enter: [Key.Enter],
  esc: [Key.Escape],
  space: [Key.Space],
  tab: [Key.Tab],
  ...digits,
  volup: [Key.AudioVolUp],
  voldown: [Key.AudioVolDown],
  mute: [Key.AudioMute],
  playpause: [Key.AudioPlay],
  prev: [Key.AudioPrev],
  next: [Key.AudioNext],
  fullscreen: [Key.F],
  pageup: [Key.PageUp],
  pagedown: [Key.PageDown],
  lock: [Key.LeftWin, Key.L],
  voice: [Key.LeftWin, Key.H],
  desktop: [Key.LeftWin, Key.D],
  taskview: [Key.LeftWin, Key.Tab],
  settings: [Key.LeftWin, Key.I],
  back: [Key.LeftAlt, Key.Left],
  switch: [Key.LeftAlt, Key.Tab],
  menu: [Key.LeftShift, Key.F10],
  zoomin: [Key.LeftControl, Key.Equal],
  zoomout: [Key.LeftControl, Key.Minus],
  snip: [Key.LeftWin, Key.LeftShift, Key.S],
  newtab: [Key.LeftControl, Key.T],
  closetab: [Key.LeftControl, Key.W],
};

function warnUnmappedKeys(names) {
  const unmapped = names.filter((name) => !KEYMAP[name]?.length || KEYMAP[name].includes(undefined));
  if (unmapped.length) log.warn('input', `No key mapping for: ${unmapped.join(', ')}`);
}

export { KEYMAP, warnUnmappedKeys };
