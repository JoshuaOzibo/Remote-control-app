import os from 'os';

const VIRTUAL_ADAPTER = /vethernet|virtualbox|vmware|wsl|hyper-v|docker|bluetooth/i;
const LINK_LOCAL = /^169\.254\./;

function isLikelyVirtual({ name, address }) {
  return VIRTUAL_ADAPTER.test(name) || LINK_LOCAL.test(address);
}

function lanAddresses() {
  return Object.entries(os.networkInterfaces())
    .flatMap(([name, infos = []]) =>
      infos
        .filter((info) => info.family === 'IPv4' && !info.internal)
        .map((info) => ({ name, address: info.address })),
    )
    .sort((a, b) => Number(isLikelyVirtual(a)) - Number(isLikelyVirtual(b)))
    .map(({ address }) => address);
}

export { lanAddresses };
