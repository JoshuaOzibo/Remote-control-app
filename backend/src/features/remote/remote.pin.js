import crypto from 'crypto';

const PIN_FORMAT = /^\d{4}$/;

let currentPin = null;

function isValidPin(pin) {
  return PIN_FORMAT.test(String(pin));
}

function randomPin() {
  return String(crypto.randomInt(0, 10000)).padStart(4, '0');
}

function getPin() {
  return currentPin;
}

function assertValidPin(pin) {
  if (!isValidPin(pin)) throw new Error(`PIN must be exactly 4 digits (got "${pin}")`);
}

function setPin(pin) {
  assertValidPin(pin);
  currentPin = String(pin);
}

export { isValidPin, assertValidPin, randomPin, getPin, setPin };
