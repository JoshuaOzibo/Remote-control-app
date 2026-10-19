import crypto from 'crypto';
import { promisify } from 'util';

const scrypt = promisify(crypto.scrypt);

const ALGO = 'scrypt';
const KEY_BYTES = 32;
const SALT_BYTES = 16;
const SETUP_ALPHABET = '23456789ABCDEFGHJKMNPQRSTUVWXYZ';
const SETUP_LENGTH = 8;

function isPinRecord(record) {
  return (
    record?.algo === ALGO &&
    typeof record.salt === 'string' &&
    typeof record.hash === 'string' &&
    Buffer.from(record.hash, 'base64').length === KEY_BYTES
  );
}

async function hashPin(pin) {
  const salt = crypto.randomBytes(SALT_BYTES);
  const hash = await scrypt(String(pin), salt, KEY_BYTES);
  return { algo: ALGO, salt: salt.toString('base64'), hash: hash.toString('base64') };
}

async function verifyPin(pin, record) {
  if (!isPinRecord(record)) return false;
  const expected = Buffer.from(record.hash, 'base64');
  const actual = await scrypt(String(pin), Buffer.from(record.salt, 'base64'), KEY_BYTES);
  return crypto.timingSafeEqual(actual, expected);
}

function newSetupCode() {
  return Array.from({ length: SETUP_LENGTH }, () => SETUP_ALPHABET[crypto.randomInt(SETUP_ALPHABET.length)]).join('');
}

function normalizeSetupCode(code) {
  return String(code).replaceAll('-', '').toUpperCase();
}

function sameSetupCode(given, expected) {
  if (!expected) return false;
  const actual = Buffer.from(normalizeSetupCode(given));
  const wanted = Buffer.from(expected);
  return actual.length === wanted.length && crypto.timingSafeEqual(actual, wanted);
}

function formatSetupCode(code) {
  return code ? `${code.slice(0, SETUP_LENGTH / 2)}-${code.slice(SETUP_LENGTH / 2)}` : null;
}

export { isPinRecord, hashPin, verifyPin, newSetupCode, sameSetupCode, formatSetupCode };
