import { log } from '../../shared/logger.js';
import { checkPin } from './remote.auth.js';
import { releaseControl, takeControl } from './remote.controller.js';
import { dispatch } from './remote.dispatch.js';
import { isLockedOut, recordFailure, recordSuccess } from './remote.lockout.js';
import { CLOSE_CODE, authReply, parseMessage } from './remote.protocol.js';
import { createThrottle } from './remote.throttle.js';

const AUTH_TIMEOUT_MS = 5000;
const MAX_MESSAGES_PER_SECOND = 200;

function startSession(socket, ip) {
  let state = 'pending';
  let warnedThrottle = false;
  const allowMessage = createThrottle(MAX_MESSAGES_PER_SECOND, 1000);

  const authTimer = setTimeout(() => {
    log.info('remote', `${ip} did not send a PIN in time`);
    socket.close(CLOSE_CODE.authTimeout, 'Auth timeout');
  }, AUTH_TIMEOUT_MS);

  function reject(reason, closeCode) {
    state = 'rejected';
    socket.send(authReply(false, reason));
    socket.close(closeCode, reason);
  }

  function accept() {
    state = 'authed';
    recordSuccess(ip);
    socket.send(authReply(true));
    takeControl(socket);
    log.info('remote', `${ip} connected`);
  }

  function authenticate({ pin }) {
    clearTimeout(authTimer);
    if (isLockedOut(ip)) {
      log.warn('remote', `${ip} is locked out after too many wrong PINs`);
      reject('locked', CLOSE_CODE.lockedOut);
      return;
    }
    if (checkPin(pin)) {
      accept();
      return;
    }
    const lockedNow = recordFailure(ip);
    log.warn('remote', `${ip} sent a wrong PIN${lockedNow ? ', now locked out for 60s' : ''}`);
    reject(lockedNow ? 'locked' : 'wrong-pin', lockedNow ? CLOSE_CODE.lockedOut : CLOSE_CODE.wrongPin);
  }

  function handleMessage(raw, isBinary) {
    if (!allowMessage()) {
      if (!warnedThrottle) log.warn('remote', `${ip} is sending too fast, dropping messages`);
      warnedThrottle = true;
      return;
    }
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
    releaseControl(socket);
    if (state === 'authed') log.info('remote', `${ip} disconnected`);
  });
}

export { startSession };
