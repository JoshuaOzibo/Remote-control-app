import { createApp } from './app.js';
import { printBanner } from './banner.js';
import { config } from './config/env.js';
import { warnUnmappedKeys } from './features/input/input.keymap.js';
import { KEYS } from './features/remote/remote.protocol.js';
import { attachRemoteSocket } from './features/remote/remote.socket.js';
import { log } from './shared/logger.js';
import { registerShutdown } from './shutdown.js';

warnUnmappedKeys(KEYS);

const app = createApp();
let remote;

const server = app.listen(config.port, config.host, (error) => {
  if (error) {
    const reason = error.code === 'EADDRINUSE' ? `port ${config.port} is already in use` : error.message;
    log.error('server', `Could not start: ${reason}`);
    process.exit(1);
  }
  remote = attachRemoteSocket(server);
  printBanner();
});

registerShutdown(server, () => remote);
