import path from 'path';
import { app } from 'electron';

const FIRST_PORT = 3001;
const LAST_PORT = 3010;

function webDirectory() {
  if (app.isPackaged) return path.join(process.resourcesPath, 'web');
  return path.resolve(import.meta.dirname, '../../backend/public');
}

function candidatePorts(preferredPort) {
  const range = Array.from({ length: LAST_PORT - FIRST_PORT + 1 }, (_, i) => FIRST_PORT + i);
  return [...new Set([preferredPort, ...range])];
}

async function startHost({ backend, preferredPort }) {
  const pinStore = backend.createFilePinStore(path.join(app.getPath('userData'), 'pin.json'));
  const options = { host: '0.0.0.0', pin: null, pinStore, publicDir: webDirectory(), version: app.getVersion() };

  for (const port of candidatePorts(preferredPort)) {
    try {
      return await backend.startServer({ ...options, port });
    } catch (error) {
      if (error.code !== 'EADDRINUSE') throw error;
    }
  }
  throw new Error(`Ports ${FIRST_PORT}–${LAST_PORT} are all in use. Close the other program using them and start Phone Remote again.`);
}

function linkFor(server, address) {
  if (!address) return null;
  const base = `http://${address}:${server.port}/`;
  return server.isSetUp() ? base : `${base}?setup=${server.setupCode()}`;
}

export { startHost, linkFor };
