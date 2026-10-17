import { releaseHeldKeys } from './features/input/input.keyboard.js';
import { log } from './shared/logger.js';

const FORCE_EXIT_MS = 2000;

function registerShutdown(server, getRemote) {
  let stopping = false;

  async function stop(exitCode) {
    if (stopping) return;
    stopping = true;
    setTimeout(() => process.exit(exitCode), FORCE_EXIT_MS).unref();

    getRemote()?.close();
    await releaseHeldKeys();
    server.closeAllConnections();
    server.close(() => process.exit(exitCode));
  }

  process.once('SIGINT', () => stop(0));
  process.once('SIGTERM', () => stop(0));
  process.on('uncaughtException', (error) => {
    log.error('server', 'Crashed:', error);
    stop(1);
  });
  process.on('unhandledRejection', (error) => {
    log.error('server', 'Unhandled rejection:', error);
    stop(1);
  });
}

export { registerShutdown };
