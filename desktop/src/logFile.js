import fs from 'fs';
import path from 'path';
import { format } from 'util';

const MAX_BYTES = 1024 * 1024;

function createLogFile(directory) {
  const file = path.join(directory, 'server.log');
  const previous = path.join(directory, 'server.old.log');
  fs.mkdirSync(directory, { recursive: true });
  let size = fs.existsSync(file) ? fs.statSync(file).size : 0;

  function rotate() {
    fs.rmSync(previous, { force: true });
    if (fs.existsSync(file)) fs.renameSync(file, previous);
    size = 0;
  }

  return function write(level, tag, args) {
    const line = `${new Date().toISOString()} ${level.toUpperCase().padEnd(5)} [${tag}] ${format(...args)}\n`;
    try {
      if (size + line.length > MAX_BYTES) rotate();
      fs.appendFileSync(file, line);
      size += Buffer.byteLength(line);
    } catch {
      size = 0;
    }
  };
}

export { createLogFile };
