import os from 'os';

const VIRTUAL_ADAPTER = /vethernet|virtualbox|vmware|wsl|hyper-v|docker|bluetooth/i;
const LINK_LOCAL = /^169\.254\./;
const WINDOWS_HOTSPOT = /^192\.168\.137\./;
const WINDOWS_HOTSPOT_ADDRESS = '192.168.137.1';

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
        .map((info) => ({ address: info.address, kind: kindOf({ name, address: info.address }) })),
    )
    .sort((a, b) => KIND_ORDER.indexOf(a.kind) - KIND_ORDER.indexOf(b.kind));
}

function lanAddresses() {
  return networkAddresses().map(({ address }) => address);
}

function clientIp(request) {
  return (request.socket.remoteAddress ?? 'unknown').replace(/^::ffff:/, '');
}

export { WINDOWS_HOTSPOT_ADDRESS, networkAddresses, lanAddresses, clientIp };
