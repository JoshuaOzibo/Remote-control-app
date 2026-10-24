import path from 'path';
import { app, clipboard } from 'electron';

const WEB_PORT = 80;
const FIRST_PORT = 3001;
const LAST_PORT = 3010;
const PORT_TAKEN = new Set(['EADDRINUSE', 'EACCES']);

function webDirectory() {
  if (app.isPackaged) return path.join(process.resourcesPath, 'web');
  return path.resolve(import.meta.dirname, '../../backend/public');
}

const electronClipboard = {
  getContent: () => clipboard.readText(),
  setContent: (text) => clipboard.writeText(text),
};

function candidatePorts(savedPort) {
  const range = Array.from({ length: LAST_PORT - FIRST_PORT + 1 }, (_, i) => FIRST_PORT + i);
  return [...new Set([WEB_PORT, savedPort, ...range])];
}

async function startHost({ backend, preferredPort }) {
  const pinStore = backend.createFilePinStore(path.join(app.getPath('userData'), 'pin.json'));
  const options = {
    host: '0.0.0.0',
    pin: null,
    pinStore,
    publicDir: webDirectory(),
    version: app.getVersion(),
    clipboard: electronClipboard,
  };

  for (const port of candidatePorts(preferredPort)) {
    try {
      return await backend.startServer({ ...options, port });
    } catch (error) {
      if (!PORT_TAKEN.has(error.code)) throw error;
    }
  }
  throw new Error(
    `Ports ${WEB_PORT} and ${FIRST_PORT}–${LAST_PORT} are all in use. Close the other program using them and start Phone Remote again.`,
  );
}

function hostFor(address, port) {
  return port === WEB_PORT ? address : `${address}:${port}`;
}

function linkFor(server, address) {
  if (!address) return null;
  const base = `http://${hostFor(address, server.port)}/`;
  return server.isSetUp() ? base : `${base}?setup=${server.setupCode()}`;
}

export { startHost, linkFor, hostFor };
