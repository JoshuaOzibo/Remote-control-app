import fs from 'fs';
import path from 'path';
import { spawnSync } from 'child_process';
import { config } from '../src/config/env.js';

const frontendRoot = path.resolve(config.publicDir, '../../frontend');
const exportDir = path.join(frontendRoot, 'out');

function buildFrontend() {
  const result = spawnSync('npm', ['run', 'build'], {
    cwd: frontendRoot,
    stdio: 'inherit',
    shell: true,
    env: { ...process.env, NODE_ENV: 'production' },
  });
  if (result.status !== 0) {
    console.error('\nFrontend build failed. Nothing was copied.');
    process.exit(result.status ?? 1);
  }
}

function replacePublicDir() {
  fs.rmSync(config.publicDir, { recursive: true, force: true });
  fs.cpSync(exportDir, config.publicDir, { recursive: true });
}

function countFiles(dir) {
  return fs.readdirSync(dir, { recursive: true, withFileTypes: true }).filter((entry) => entry.isFile()).length;
}

buildFrontend();
replacePublicDir();
console.log(`\nCopied ${countFiles(config.publicDir)} files from frontend/out to backend/public. Start with: npm start`);
