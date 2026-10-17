import { createApp } from './app.js';
import { printBanner } from './banner.js';
import { config } from './config/env.js';
import { log } from './shared/logger.js';

const app = createApp();

const server = app.listen(config.port, config.host, (error) => {
  if (error) {
    const reason = error.code === 'EADDRINUSE' ? `port ${config.port} is already in use` : error.message;
    log.error('server', `Could not start: ${reason}`);
    process.exit(1);
  }
  printBanner();
});

function shutdown() {
  server.close(() => process.exit(0));
}

process.once('SIGINT', shutdown);
process.once('SIGTERM', shutdown);
