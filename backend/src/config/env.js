import path from 'path';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

const backendRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');

dotenv.config({ path: path.join(backendRoot, '.env'), quiet: true });

const DEFAULT_PIN = '1234';
const PIN_FORMAT = /^\d{4}$/;

const config = {
  port: Number(process.env.PORT) || 3001,
  host: process.env.HOST || '0.0.0.0',
  nodeEnv: process.env.NODE_ENV || 'development',
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  pin: String(process.env.PIN || DEFAULT_PIN).trim(),
  usingDefaultPin: !process.env.PIN,
  publicDir: path.join(backendRoot, 'public'),
};

config.isProduction = config.nodeEnv === 'production';

if (!PIN_FORMAT.test(config.pin)) {
  throw new Error(`PIN in backend/.env must be exactly 4 digits (got "${config.pin}")`);
}

export { config };
