import { createApp } from './app.js';
import { config } from './config/env.js';

const app = createApp();

const server = app.listen(config.port, () => {
  console.log(`\n  remote_app API  →  http://localhost:${config.port}  (${config.nodeEnv})\n`);
});

function shutdown() {
  server.close(() => process.exit(0));
}

process.once('SIGINT', shutdown);
process.once('SIGTERM', shutdown);
