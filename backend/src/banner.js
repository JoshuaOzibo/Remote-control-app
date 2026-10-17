import { config } from './config/env.js';
import { isWebBuilt } from './features/web/web.routes.js';
import { log } from './shared/logger.js';
import { lanAddresses } from './shared/network.js';

const ALL_INTERFACES = '0.0.0.0';

function reachableHosts() {
  return config.host === ALL_INTERFACES ? [...lanAddresses(), 'localhost'] : [config.host];
}

function printBanner() {
  const urls = reachableHosts().map((host) => `    http://${host}:${config.port}`);

  console.log(['', `  remote_app  (${config.nodeEnv})`, ...urls, '', `    PIN: ${config.pin}`, ''].join('\n'));

  if (config.usingDefaultPin) {
    log.warn('config', 'Using the default PIN. Set PIN in backend/.env');
  }
  if (!isWebBuilt()) {
    log.warn('web', 'Frontend not built yet. Run: npm run build:web');
  }
}

export { printBanner };
