import { printBanner } from './banner.js';
import { config } from './config/env.js';
import { startServer } from './server.js';
import { log } from './shared/logger.js';
import { registerShutdown } from './shutdown.js';

try {
  const server = await startServer();
  registerShutdown(server);
  await printBanner(server);
} catch (error) {
  const reason = error.code === 'EADDRINUSE' ? `port ${config.port} is already in use` : error.message;
  log.error('server', `Could not start: ${reason}`);
  process.exit(1);
}
