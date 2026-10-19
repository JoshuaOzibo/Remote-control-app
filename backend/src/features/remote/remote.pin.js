import { log } from '../../shared/logger.js';
import { hashPin, isPinRecord, newSetupCode, sameSetupCode, verifyPin } from './remote.credentials.js';

const PIN_FORMAT = /^\d{4}$/;

let state = { record: null, store: null, setupCode: null, fixed: false };
const listeners = new Set();

function isValidPin(pin) {
  return PIN_FORMAT.test(String(pin));
}

function assertValidPin(pin) {
  if (!isValidPin(pin)) throw new Error(`PIN must be exactly 4 digits (got "${pin}")`);
}

function readStoredRecord(store) {
  try {
    const record = store.read();
    if (record === null || isPinRecord(record)) return record;
    log.warn('pin', 'Saved PIN file is not valid, so setup is needed again');
  } catch (error) {
    log.warn('pin', 'Could not read the saved PIN, so setup is needed again:', error.message);
  }
  return null;
}

async function preparePin({ plainPin, store }) {
  if (plainPin != null) {
    assertValidPin(plainPin);
    return { record: await hashPin(plainPin), store: null, setupCode: null, fixed: true };
  }
  const record = readStoredRecord(store);
  return { record, store, setupCode: record ? null : newSetupCode(), fixed: false };
}

function applyPin(prepared) {
  state = { ...prepared };
}

function save(record) {
  try {
    state.store?.write(record);
  } catch (error) {
    log.error('pin', 'Could not save the PIN, it only lasts until the server stops:', error.message);
  }
}

function notify(change) {
  for (const listener of listeners) listener(change);
}

function isSetUp() {
  return state.record !== null;
}

function currentSetupCode() {
  return state.setupCode;
}

function isPinFixed() {
  return state.fixed;
}

function checkPin(pin) {
  return state.record ? verifyPin(pin, state.record) : Promise.resolve(false);
}

async function choosePin(code, pin) {
  if (state.record || !sameSetupCode(code, state.setupCode)) return false;
  assertValidPin(pin);
  const record = await hashPin(pin);
  if (state.record || !sameSetupCode(code, state.setupCode)) return false;
  state.record = record;
  state.setupCode = null;
  save(record);
  notify('set-up');
  return true;
}

function resetPin() {
  if (state.fixed) throw new Error('The PIN comes from backend/.env. Empty PIN there to use setup instead');
  state.record = null;
  state.setupCode = newSetupCode();
  save(null);
  notify('reset');
  return state.setupCode;
}

function onPinChange(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export {
  isValidPin,
  assertValidPin,
  preparePin,
  applyPin,
  isSetUp,
  currentSetupCode,
  isPinFixed,
  checkPin,
  choosePin,
  resetPin,
  onPinChange,
};
