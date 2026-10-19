import { isValidPin } from './remote.pin.js';

const KEYS = [
  'up',
  'down',
  'left',
  'right',
  'enter',
  'esc',
  'space',
  'tab',
  '0',
  '1',
  '2',
  '3',
  '4',
  '5',
  '6',
  '7',
  '8',
  '9',
  'volup',
  'voldown',
  'mute',
  'playpause',
  'prev',
  'next',
  'fullscreen',
  'pageup',
  'pagedown',
  'lock',
  'voice',
  'desktop',
  'taskview',
  'settings',
  'back',
  'switch',
  'menu',
  'zoomin',
  'zoomout',
  'snip',
  'newtab',
  'closetab',
  'start',
  'search',
  'explorer',
  'taskmanager',
  'minimize',
  'maximize',
  'snapleft',
  'snapright',
  'closewindow',
  'project',
  'quicksettings',
  'notifications',
  'clipboard',
  'emoji',
  'reopentab',
  'nexttab',
  'prevtab',
  'refresh',
  'forward',
  'addressbar',
  'find',
  'newwindow',
  'zoomreset',
  'copy',
  'cut',
  'paste',
  'undo',
  'redo',
  'selectall',
  'save',
];

const KEY_SET = new Set(KEYS);
const CLICK_BUTTONS = new Set(['left', 'right', 'double']);
const LOGIN_MESSAGES = new Set(['auth', 'setup']);
const MAX_MOVE = 500;
const MAX_SCROLL = 1000;
const MAX_TEXT_LENGTH = 500;
const SETUP_CODE_FORMAT = /^[A-Za-z0-9-]{8,9}$/;

const isFiniteNumber = (value) => typeof value === 'number' && Number.isFinite(value);
const clamp = (value, limit) => Math.max(-limit, Math.min(limit, value));

const parsers = {
  auth: ({ pin }) => (typeof pin === 'string' ? { t: 'auth', pin } : null),
  setup: ({ code, pin }) =>
    typeof code === 'string' && SETUP_CODE_FORMAT.test(code) && typeof pin === 'string' && isValidPin(pin)
      ? { t: 'setup', code, pin }
      : null,
  move: ({ dx, dy }) =>
    isFiniteNumber(dx) && isFiniteNumber(dy) ? { t: 'move', dx: clamp(dx, MAX_MOVE), dy: clamp(dy, MAX_MOVE) } : null,
  scroll: ({ dy }) => (isFiniteNumber(dy) ? { t: 'scroll', dy: clamp(dy, MAX_SCROLL) } : null),
  click: ({ b }) => (CLICK_BUTTONS.has(b) ? { t: 'click', b } : null),
  key: ({ k }) => (KEY_SET.has(k) ? { t: 'key', k } : null),
  type: ({ text }) =>
    typeof text === 'string' && text.length > 0 && text.length <= MAX_TEXT_LENGTH ? { t: 'type', text } : null,
};

function parseMessage(raw) {
  let data;
  try {
    data = JSON.parse(String(raw));
  } catch {
    return null;
  }
  if (typeof data !== 'object' || data === null || !Object.hasOwn(parsers, data.t)) return null;
  return parsers[data.t](data);
}

const CLOSE_CODE = {
  shuttingDown: 1001,
  authTimeout: 4000,
  wrongPin: 4001,
  replaced: 4002,
  lockedOut: 4003,
  setupExpired: 4004,
  notSetUp: 4005,
  serverError: 1011,
};

function reply(t, ok, reason) {
  return JSON.stringify(ok ? { t, ok } : { t, ok, reason });
}

const authReply = (ok, reason) => reply('auth', ok, reason);
const setupReply = (ok, reason) => reply('setup', ok, reason);

export { KEYS, CLOSE_CODE, LOGIN_MESSAGES, parseMessage, authReply, setupReply };
