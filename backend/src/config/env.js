import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

const backendRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');

dotenv.config({ path: path.join(backendRoot, '.env'), quiet: true });

const { version } = JSON.parse(fs.readFileSync(path.join(backendRoot, 'package.json'), 'utf8'));
const pinFromEnv = String(process.env.PIN ?? '').trim();

const config = {
  port: Number(process.env.PORT) || 3001,
  host: process.env.HOST || '0.0.0.0',
  nodeEnv: process.env.NODE_ENV || 'development',
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  pin: pinFromEnv || null,
  pinFile: path.join(backendRoot, 'data', 'pin.json'),
  publicDir: path.join(backendRoot, 'public'),
  version,
};

config.isProduction = config.nodeEnv === 'production';

export { config };
