import { createApp } from './app.js';
import { config } from './config/env.js';
import { releaseHeldKeys } from './features/input/input.keyboard.js';
import { warnUnmappedKeys } from './features/input/input.keymap.js';
import { revokeControl } from './features/remote/remote.controller.js';
import { assertValidPin, getPin, setPin as storePin } from './features/remote/remote.pin.js';
import { KEYS } from './features/remote/remote.protocol.js';
import { attachRemoteSocket } from './features/remote/remote.socket.js';

function listen(app, port, host) {
  return new Promise((resolve, reject) => {
    const server = app.listen(port, host, (error) => {
      if (error) reject(error);
      else resolve(server);
    });
  });
}

function closeServer(server) {
  return new Promise((resolve) => server.close(() => resolve()));
}

async function startServer({
  port = config.port,
  host = config.host,
  pin = config.pin,
  publicDir = config.publicDir,
  version = config.version,
} = {}) {
  warnUnmappedKeys(KEYS);
  assertValidPin(pin);

  const server = await listen(createApp({ publicDir, version }), port, host);
  storePin(pin);
  const remote = attachRemoteSocket(server);
  let stopping = null;

  async function shutDown() {
    remote.close();
    await releaseHeldKeys();
    server.closeAllConnections();
    await closeServer(server);
  }

  return {
    port: server.address().port,
    host,
    publicDir,
    getPin,
    setPin(next) {
      storePin(next);
      revokeControl();
    },
    stop() {
      stopping ??= shutDown();
      return stopping;
    },
  };
}

export { startServer };
export { primaryLanAddress, networkAddresses } from './shared/network.js';
export { randomPin, isValidPin } from './features/remote/remote.pin.js';
export { setLogSink } from './shared/logger.js';
