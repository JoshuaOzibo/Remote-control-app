import { config } from '../../config/env.js';
import { lanAddresses } from '../../shared/network.js';

const LOOPBACK_HOSTS = ['localhost', '127.0.0.1', '[::1]'];

function servedByThisLaptop(origin) {
  const { hostname } = new URL(origin);
  return LOOPBACK_HOSTS.includes(hostname) || lanAddresses().includes(hostname);
}

function isAllowedOrigin(request) {
  const { origin } = request.headers;
  if (!origin) return true;
  try {
    return origin === config.corsOrigin || servedByThisLaptop(origin);
  } catch {
    return false;
  }
}

export { isAllowedOrigin };
