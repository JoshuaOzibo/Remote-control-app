import { WebSocketServer } from 'ws';
import { log } from '../../shared/logger.js';
import { clientIp } from '../../shared/network.js';
import { isAllowedOrigin } from './remote.origin.js';
import { CLOSE_CODE } from './remote.protocol.js';
import { startSession } from './remote.session.js';

const PATH = '/ws';
const MAX_PAYLOAD_BYTES = 4 * 1024;
const HEARTBEAT_MS = 15000;

function verifyClient({ req }) {
  const allowed = isAllowedOrigin(req);
  if (!allowed) log.warn('remote', `${clientIp(req)} refused: origin ${req.headers.origin} is not allowed`);
  return allowed;
}

function attachRemoteSocket(server) {
  const wss = new WebSocketServer({ server, path: PATH, maxPayload: MAX_PAYLOAD_BYTES, verifyClient });
  const awaitingPong = new WeakSet();

  wss.on('connection', (socket, request) => {
    socket.on('pong', () => awaitingPong.delete(socket));
    startSession(socket, clientIp(request));
  });

  wss.on('error', (error) => log.error('remote', 'WebSocket server error:', error.message));

  const heartbeat = setInterval(() => {
    for (const socket of wss.clients) {
      if (awaitingPong.has(socket)) {
        socket.terminate();
        continue;
      }
      awaitingPong.add(socket);
      socket.ping();
    }
  }, HEARTBEAT_MS);

  function close() {
    clearInterval(heartbeat);
    for (const socket of wss.clients) socket.close(CLOSE_CODE.shuttingDown, 'Server shutting down');
    wss.close();
  }

  return { close };
}

export { attachRemoteSocket };
