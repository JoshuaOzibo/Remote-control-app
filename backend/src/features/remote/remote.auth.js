import crypto from 'crypto';
import { config } from '../../config/env.js';

function checkPin(given) {
  const expected = Buffer.from(config.pin);
  const actual = Buffer.from(String(given));
  return actual.length === expected.length && crypto.timingSafeEqual(actual, expected);
}

export { checkPin };
