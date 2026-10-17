const MAX_FAILURES = 5;
const LOCKOUT_MS = 60_000;

const attempts = new Map();

function current(ip) {
  const entry = attempts.get(ip);
  if (entry?.lockedUntil && entry.lockedUntil <= Date.now()) {
    attempts.delete(ip);
    return undefined;
  }
  return entry;
}

function isLockedOut(ip) {
  return Boolean(current(ip)?.lockedUntil);
}

function recordFailure(ip) {
  const failures = (current(ip)?.failures ?? 0) + 1;
  const lockedUntil = failures >= MAX_FAILURES ? Date.now() + LOCKOUT_MS : null;
  attempts.set(ip, { failures, lockedUntil });
  return Boolean(lockedUntil);
}

function recordSuccess(ip) {
  attempts.delete(ip);
}

export { isLockedOut, recordFailure, recordSuccess };
