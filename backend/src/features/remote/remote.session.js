import { log } from '../../shared/logger.js';
import { releaseControl, takeControl } from './remote.controller.js';
import { dispatch } from './remote.dispatch.js';
import { isLockedOut, recordFailure, recordSuccess } from './remote.lockout.js';
import { checkPin, choosePin, isSetUp } from './remote.pin.js';
import { CLOSE_CODE, LOGIN_MESSAGES, authReply, parseMessage, setupReply } from './remote.protocol.js';
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

  const isOpen = () => socket.readyState === socket.OPEN;

  function reject(reply, reason, closeCode) {
    state = 'rejected';
    socket.send(reply(false, reason));
    socket.close(closeCode, reason);
  }

  function rejectFailure(reply, reason, closeCode, what) {
    const lockedNow = recordFailure(ip);
    log.warn('remote', `${ip} sent ${what}${lockedNow ? ', now locked out for 60s' : ''}`);
    reject(reply, lockedNow ? 'locked' : reason, lockedNow ? CLOSE_CODE.lockedOut : closeCode);
  }

  function rejectIfLocked(reply) {
    if (!isLockedOut(ip)) return false;
    log.warn('remote', `${ip} is locked out after too many wrong attempts`);
    reject(reply, 'locked', CLOSE_CODE.lockedOut);
    return true;
  }

  function accept(reply) {
    state = 'authed';
    recordSuccess(ip);
    socket.send(reply(true));
    takeControl(socket);
    log.info('remote', `${ip} connected`);
  }

  async function authenticate({ pin }) {
    if (rejectIfLocked(authReply)) return;
    if (!isSetUp()) {
      log.info('remote', `${ip} tried to log in, but no PIN is set yet`);
      reject(authReply, 'not-set-up', CLOSE_CODE.notSetUp);
      return;
    }
    state = 'checking';
    const ok = await checkPin(pin);
    if (!isOpen()) return;
    if (ok) accept(authReply);
    else rejectFailure(authReply, 'wrong-pin', CLOSE_CODE.wrongPin, 'a wrong PIN');
  }

  async function setUp({ code, pin }) {
    if (rejectIfLocked(setupReply)) return;
    state = 'checking';
    const ok = await choosePin(code, pin);
    if (ok) log.info('remote', `${ip} set a new PIN`);
    if (!isOpen()) return;
    if (ok) accept(setupReply);
    else rejectFailure(setupReply, 'setup-expired', CLOSE_CODE.setupExpired, 'a wrong or used setup code');
  }

  function logIn(login, message) {
    clearTimeout(authTimer);
    login(message).catch((error) => {
      log.error('remote', `${ip} login failed:`, error);
      state = 'rejected';
      socket.close(CLOSE_CODE.serverError, 'Server error');
    });
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
    if (state === 'pending' && message.t === 'auth') logIn(authenticate, message);
    else if (state === 'pending' && message.t === 'setup') logIn(setUp, message);
    else if (state === 'authed' && !LOGIN_MESSAGES.has(message.t)) dispatch(message);
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
