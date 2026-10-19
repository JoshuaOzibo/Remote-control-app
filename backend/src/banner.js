import { config } from './config/env.js';
import { formatSetupCode } from './features/remote/remote.credentials.js';
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

function addressLines({ host, port }, primary) {
  const urlFor = (address) => `http://${address}:${port}`;
  if (host !== ALL_INTERFACES) return [line(LABELS.host, urlFor(host))];

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

function pinLines(server, primary) {
  if (server.isPinFixed()) return [`    PIN: ${config.pin}  (from backend/.env)`];
  if (server.isSetUp()) return ['    PIN: set on your phone  (forgot it? npm run reset-pin, then restart)'];

  const code = server.setupCode();
  const host = server.host === ALL_INTERFACES ? (primary ?? '<laptop-ip>') : server.host;
  return [
    `    Setup code: ${formatSetupCode(code)}`,
    `    Open http://${host}:${server.port}/?setup=${code} on your phone to choose a PIN`,
  ];
}

async function printBanner(server) {
  const primary = await primaryLanAddress();
  console.log(
    [
      '',
      `  remote_app  (${config.nodeEnv})`,
      ...addressLines(server, primary),
      '',
      ...pinLines(server, primary),
      '',
    ].join('\n'),
  );

  if (!isWebBuilt(server.publicDir)) {
    log.warn('web', 'Frontend not built yet. Run: npm run build:web');
  }
}

export { printBanner };
