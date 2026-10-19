import crypto from 'crypto';
import { getPin } from './remote.pin.js';

function checkPin(given) {
  const expected = Buffer.from(getPin() ?? '');
  const actual = Buffer.from(String(given));
  return expected.length > 0 && actual.length === expected.length && crypto.timingSafeEqual(actual, expected);
}

export { checkPin };
