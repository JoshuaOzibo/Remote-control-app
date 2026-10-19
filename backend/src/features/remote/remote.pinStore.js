import fs from 'fs';
import path from 'path';

function createFilePinStore(filePath) {
  return {
    read() {
      try {
        return JSON.parse(fs.readFileSync(filePath, 'utf8'));
      } catch (error) {
        if (error.code === 'ENOENT') return null;
        throw error;
      }
    },
    write(record) {
      if (record === null) {
        fs.rmSync(filePath, { force: true });
        return;
      }
      const temporary = `${filePath}.tmp`;
      fs.mkdirSync(path.dirname(filePath), { recursive: true });
      fs.writeFileSync(temporary, JSON.stringify(record, null, 2));
      fs.renameSync(temporary, filePath);
    },
  };
}

export { createFilePinStore };
