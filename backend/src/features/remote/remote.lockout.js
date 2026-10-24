import { log } from '../../shared/logger.js';

const MAX_FAILURES = 5;
const LOCKOUT_MS = 60_000;
const GLOBAL_WINDOW_MS = 10 * 60_000;
const GLOBAL_MAX_FAILURES = 20;
const GLOBAL_LOCKOUT_MS = 5 * 60_000;

const attempts = new Map();
let recentFailures = [];
let globalLockedUntil = 0;

function current(ip) {
  const entry = attempts.get(ip);
  if (entry?.lockedUntil && entry.lockedUntil <= Date.now()) {
    attempts.delete(ip);
    return undefined;
  }
  return entry;
}

function isGloballyLocked() {
  return globalLockedUntil > Date.now();
}

function isLockedOut(ip) {
  return isGloballyLocked() || Boolean(current(ip)?.lockedUntil);
}

function recordGlobalFailure() {
  const now = Date.now();
  recentFailures = [...recentFailures.filter((time) => now - time < GLOBAL_WINDOW_MS), now];
  if (recentFailures.length < GLOBAL_MAX_FAILURES || isGloballyLocked()) return isGloballyLocked();
  globalLockedUntil = now + GLOBAL_LOCKOUT_MS;
  recentFailures = [];
  log.warn('remote', `${GLOBAL_MAX_FAILURES} wrong PINs or setup codes in 10 minutes, so all logins are paused for 5 minutes`);
  return true;
}

function recordFailure(ip) {
  const failures = (current(ip)?.failures ?? 0) + 1;
  const lockedUntil = failures >= MAX_FAILURES ? Date.now() + LOCKOUT_MS : null;
  attempts.set(ip, { failures, lockedUntil });
  const globallyLocked = recordGlobalFailure();
  return Boolean(lockedUntil) || globallyLocked;
}

function recordSuccess(ip) {
  attempts.delete(ip);
}

export { isLockedOut, recordFailure, recordSuccess };
