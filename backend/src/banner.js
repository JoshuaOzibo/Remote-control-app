import { config } from './config/env.js';
import { isWebBuilt } from './features/web/web.routes.js';
import { log } from './shared/logger.js';
import { WINDOWS_HOTSPOT_ADDRESS, networkAddresses, primaryLanAddress } from './shared/network.js';

const ALL_INTERFACES = '0.0.0.0';
const SHOWN_KINDS = ['lan', 'hotspot'];

const LABELS = {
  lan: 'Home network',
  hotspot: 'Laptop hotspot',
  local: 'This laptop',
  host: 'Address',
};

function line(label, text) {
  return `    ${label.padEnd(16)}${text}`;
}

async function addressLines({ host, port }) {
  const urlFor = (address) => `http://${address}:${port}`;
  if (host !== ALL_INTERFACES) return [line(LABELS.host, urlFor(host))];

  const primary = await primaryLanAddress();
  const addresses = networkAddresses()
    .filter(({ kind }) => SHOWN_KINDS.includes(kind))
    .sort((a, b) => Number(b.address === primary) - Number(a.address === primary));
  const hotspotOn = addresses.some(({ kind }) => kind === 'hotspot');
  const lines = addresses.map(({ kind, address }) => line(LABELS[kind], urlFor(address)));

  if (!hotspotOn) {
    lines.push(line(LABELS.hotspot, `off (turn on Mobile hotspot, then ${urlFor(WINDOWS_HOTSPOT_ADDRESS)})`));
  }
  lines.push(line(LABELS.local, urlFor('localhost')));
  return lines;
}

async function printBanner(server) {
  const pinNote = config.pinIsRandom ? '  (new each run; set PIN in backend/.env to keep one)' : '';
  const lines = await addressLines(server);
  console.log(['', `  remote_app  (${config.nodeEnv})`, ...lines, '', `    PIN: ${server.getPin()}${pinNote}`, ''].join('\n'));

  if (!isWebBuilt(server.publicDir)) {
    log.warn('web', 'Frontend not built yet. Run: npm run build:web');
  }
}

export { printBanner };
