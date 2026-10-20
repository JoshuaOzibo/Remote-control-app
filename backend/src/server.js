import { createApp } from './app.js';
import { config } from './config/env.js';
import { releaseHeldKeys } from './features/input/input.keyboard.js';
import { warnUnmappedKeys } from './features/input/input.keymap.js';
import { currentControllerIp, onControlChange, revokeControl } from './features/remote/remote.controller.js';
import {
  applyPin,
  currentSetupCode,
  isPinFixed,
  isSetUp,
  onPinChange,
  preparePin,
  resetPin,
} from './features/remote/remote.pin.js';
import { createFilePinStore } from './features/remote/remote.pinStore.js';
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
  pinStore = createFilePinStore(config.pinFile),
  publicDir = config.publicDir,
  version = config.version,
} = {}) {
  warnUnmappedKeys(KEYS);
  const preparedPin = await preparePin({ plainPin: pin, store: pinStore });

  const server = await listen(createApp({ publicDir, version }), port, host);
  applyPin(preparedPin);
  const remote = attachRemoteSocket(server);
  const subscriptions = new Set();
  let stopping = null;

  function subscribe(addListener, listener) {
    const unsubscribe = addListener(listener);
    subscriptions.add(unsubscribe);
    return unsubscribe;
  }

  async function shutDown() {
    for (const unsubscribe of subscriptions) unsubscribe();
    remote.close();
    await releaseHeldKeys();
    server.closeAllConnections();
    await closeServer(server);
  }

  return {
    port: server.address().port,
    host,
    publicDir,
    isSetUp,
    isPinFixed,
    setupCode: currentSetupCode,
    controllerIp: currentControllerIp,
    onPinChange: (listener) => subscribe(onPinChange, listener),
    onControlChange: (listener) => subscribe(onControlChange, listener),
    resetPin() {
      const code = resetPin();
      revokeControl();
      return code;
    },
    stop() {
      stopping ??= shutDown();
      return stopping;
    },
  };
}

export { startServer };
export { primaryLanAddress, networkAddresses } from './shared/network.js';
export { isValidPin } from './features/remote/remote.pin.js';
export { formatSetupCode } from './features/remote/remote.credentials.js';
export { createFilePinStore } from './features/remote/remote.pinStore.js';
export { setLogSink } from './shared/logger.js';
