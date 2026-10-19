import dgram from 'dgram';
import os from 'os';

const VIRTUAL_ADAPTER = /vethernet|virtualbox|vmware|wsl|hyper-v|docker|bluetooth|tailscale|zerotier|npcap|loopback|vpn/i;
const LINK_LOCAL = /^169\.254\./;
const WINDOWS_HOTSPOT = /^192\.168\.137\./;
const WINDOWS_HOTSPOT_ADDRESS = '192.168.137.1';
const ROUTE_PROBE = { host: '8.8.8.8', port: 53 };
const ROUTE_PROBE_TIMEOUT_MS = 500;
const REACHABLE_KINDS = ['lan', 'hotspot'];

function kindOf({ name, address }) {
  if (WINDOWS_HOTSPOT.test(address)) return 'hotspot';
  if (LINK_LOCAL.test(address)) return 'link-local';
  if (VIRTUAL_ADAPTER.test(name)) return 'virtual';
  return 'lan';
}

const KIND_ORDER = ['lan', 'hotspot', 'virtual', 'link-local'];

function networkAddresses() {
  return Object.entries(os.networkInterfaces())
    .flatMap(([name, infos = []]) =>
      infos
        .filter((info) => info.family === 'IPv4' && !info.internal)
        .map((info) => ({ name, address: info.address, kind: kindOf({ name, address: info.address }) })),
    )
    .sort((a, b) => KIND_ORDER.indexOf(a.kind) - KIND_ORDER.indexOf(b.kind));
}

function lanAddresses() {
  return networkAddresses().map(({ address }) => address);
}

function routedAddress() {
  return new Promise((resolve) => {
    const socket = dgram.createSocket('udp4');
    let settled = false;

    function finish(address) {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      socket.close();
      resolve(address);
    }

    const timer = setTimeout(() => finish(null), ROUTE_PROBE_TIMEOUT_MS);
    socket.once('error', () => finish(null));
    socket.connect(ROUTE_PROBE.port, ROUTE_PROBE.host, (error) => {
      if (error) return finish(null);
      try {
        finish(socket.address().address);
      } catch {
        finish(null);
      }
    });
  });
}

async function primaryLanAddress() {
  const reachable = networkAddresses().filter(({ kind }) => REACHABLE_KINDS.includes(kind));
  const routed = await routedAddress();
  const match = reachable.find(({ address, kind }) => address === routed && kind === 'lan');
  return (match ?? reachable[0])?.address ?? null;
}

function clientIp(request) {
  return (request.socket.remoteAddress ?? 'unknown').replace(/^::ffff:/, '');
}

export { WINDOWS_HOTSPOT_ADDRESS, networkAddresses, lanAddresses, primaryLanAddress, clientIp };
