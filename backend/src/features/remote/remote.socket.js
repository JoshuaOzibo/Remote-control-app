import { WebSocketServer } from 'ws';
import { log } from '../../shared/logger.js';
import { clientIp } from '../../shared/network.js';
import { startSession } from './remote.session.js';

const PATH = '/ws';
const MAX_PAYLOAD_BYTES = 4 * 1024;
const HEARTBEAT_MS = 15000;
const GOING_AWAY = 1001;

function attachRemoteSocket(server) {
  const wss = new WebSocketServer({ server, path: PATH, maxPayload: MAX_PAYLOAD_BYTES });
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
    for (const socket of wss.clients) socket.close(GOING_AWAY, 'Server shutting down');
    wss.close();
  }

  return { close };
}

export { attachRemoteSocket };
