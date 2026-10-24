import { printBanner } from './banner.js';
import { config } from './config/env.js';
import { startServer } from './server.js';
import { log } from './shared/logger.js';
import { registerShutdown } from './shutdown.js';

const NEXT_PORT = config.port + 1;

function portInUseHelp() {
  return [
    `port ${config.port} is already in use.`,
    '  The Phone Remote tray app (or another npm start) is probably running: it is the same server.',
    '  Either quit it (right-click the tray icon → Quit Phone Remote), or use another port for this run:',
    `  $env:PORT="${NEXT_PORT}"; npm run dev`,
  ].join('\n');
}

try {
  const server = await startServer();
  registerShutdown(server);
  await printBanner(server);
} catch (error) {
  const reason = error.code === 'EADDRINUSE' ? portInUseHelp() : error.message;
  log.error('server', `Could not start: ${reason}`);
  process.exit(1);
}
