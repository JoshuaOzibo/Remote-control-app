import qrcode from 'qrcode-terminal';
import { config } from './config/env.js';
import { isWebBuilt } from './features/web/web.routes.js';
import { log } from './shared/logger.js';
import { lanAddresses } from './shared/network.js';

const ALL_INTERFACES = '0.0.0.0';

function reachableHosts() {
  return config.host === ALL_INTERFACES ? [...lanAddresses(), 'localhost'] : [config.host];
}

function urlFor(host) {
  return `http://${host}:${config.port}`;
}

function printQrCode(url) {
  qrcode.generate(url, { small: true }, (qr) => {
    console.log(`  Scan with your phone camera to open ${url}\n`);
    console.log(qr.replace(/^/gm, '  '));
  });
}

function printBanner() {
  const hosts = reachableHosts();
  const urls = hosts.map((host) => `    ${urlFor(host)}`);

  console.log(['', `  remote_app  (${config.nodeEnv})`, ...urls, '', `    PIN: ${config.pin}`, ''].join('\n'));

  if (hosts[0] !== 'localhost') printQrCode(urlFor(hosts[0]));

  if (config.usingDefaultPin) {
    log.warn('config', 'Using the default PIN. Set PIN in backend/.env');
  }
  if (!isWebBuilt()) {
    log.warn('web', 'Frontend not built yet. Run: npm run build:web');
  }
}

export { printBanner };
