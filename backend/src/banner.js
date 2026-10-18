import { config } from './config/env.js';
import { isWebBuilt } from './features/web/web.routes.js';
import { log } from './shared/logger.js';
import { WINDOWS_HOTSPOT_ADDRESS, networkAddresses } from './shared/network.js';

const ALL_INTERFACES = '0.0.0.0';
const SHOWN_KINDS = ['lan', 'hotspot'];

const LABELS = {
  lan: 'Home network',
  hotspot: 'Laptop hotspot',
  local: 'This laptop',
  host: 'Address',
};

function urlFor(host) {
  return `http://${host}:${config.port}`;
}

function line(label, text) {
  return `    ${label.padEnd(16)}${text}`;
}

function addressLines() {
  if (config.host !== ALL_INTERFACES) return [line(LABELS.host, urlFor(config.host))];

  const addresses = networkAddresses().filter(({ kind }) => SHOWN_KINDS.includes(kind));
  const hotspotOn = addresses.some(({ kind }) => kind === 'hotspot');
  const lines = addresses.map(({ kind, address }) => line(LABELS[kind], urlFor(address)));

  if (!hotspotOn) {
    lines.push(line(LABELS.hotspot, `off (turn on Mobile hotspot, then ${urlFor(WINDOWS_HOTSPOT_ADDRESS)})`));
  }
  lines.push(line(LABELS.local, urlFor('localhost')));
  return lines;
}

function printBanner() {
  console.log(['', `  remote_app  (${config.nodeEnv})`, ...addressLines(), '', `    PIN: ${config.pin}`, ''].join('\n'));

  if (config.usingDefaultPin) {
    log.warn('config', 'Using the default PIN. Set PIN in backend/.env');
  }
  if (!isWebBuilt()) {
    log.warn('web', 'Frontend not built yet. Run: npm run build:web');
  }
}

export { printBanner };
