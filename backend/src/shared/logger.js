import { config } from '../config/env.js';

const CONSOLE_METHOD = { info: 'log', warn: 'warn', error: 'error', debug: 'debug' };

let sink = null;

function setLogSink(fn) {
  sink = fn;
}

function write(level, tag, args) {
  console[CONSOLE_METHOD[level]](`[${tag}]`, ...args);
  sink?.(level, tag, args);
}

const log = {
  info: (tag, ...args) => write('info', tag, args),
  warn: (tag, ...args) => write('warn', tag, args),
  error: (tag, ...args) => write('error', tag, args),
  debug: (tag, ...args) => {
    if (!config.isProduction) write('debug', tag, args);
  },
};

export { log, setLogSink };
