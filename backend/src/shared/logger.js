import { config } from '../config/env.js';

function write(method, tag, args) {
  console[method](`[${tag}]`, ...args);
}

const log = {
  info: (tag, ...args) => write('log', tag, args),
  warn: (tag, ...args) => write('warn', tag, args),
  error: (tag, ...args) => write('error', tag, args),
  debug: (tag, ...args) => {
    if (!config.isProduction) write('debug', tag, args);
  },
};

export { log };
