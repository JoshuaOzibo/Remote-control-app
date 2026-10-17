import { log } from '../../shared/logger.js';
import { checkPin } from './remote.auth.js';
import { dispatch } from './remote.dispatch.js';
import { authReply, parseMessage } from './remote.protocol.js';

const AUTH_TIMEOUT_MS = 5000;

const CLOSE_CODE = {
  authTimeout: 4000,
  wrongPin: 4001,
};

function startSession(socket, ip) {
  let state = 'pending';

  const authTimer = setTimeout(() => {
    log.info('remote', `${ip} did not send a PIN in time`);
    socket.close(CLOSE_CODE.authTimeout, 'Auth timeout');
  }, AUTH_TIMEOUT_MS);

  function authenticate({ pin }) {
    clearTimeout(authTimer);
    const ok = checkPin(pin);
    state = ok ? 'authed' : 'rejected';
    socket.send(authReply(ok));

    if (ok) {
      log.info('remote', `${ip} connected`);
      return;
    }
    log.warn('remote', `${ip} sent a wrong PIN`);
    socket.close(CLOSE_CODE.wrongPin, 'Wrong PIN');
  }

  function handleMessage(raw, isBinary) {
    const message = isBinary ? null : parseMessage(raw);
    if (!message) {
      log.debug('remote', `${ip} sent an invalid message`);
      return;
    }
    if (state === 'pending' && message.t === 'auth') authenticate(message);
    else if (state === 'authed' && message.t !== 'auth') dispatch(message);
  }

  socket.on('message', handleMessage);
  socket.on('error', (error) => log.debug('remote', `${ip} socket error:`, error.message));
  socket.on('close', () => {
    clearTimeout(authTimer);
    if (state === 'authed') log.info('remote', `${ip} disconnected`);
  });
}

export { startSession };
