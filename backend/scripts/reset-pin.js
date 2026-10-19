import fs from 'fs';
import { config } from '../src/config/env.js';
import { createFilePinStore } from '../src/features/remote/remote.pinStore.js';

const hadPin = fs.existsSync(config.pinFile);
createFilePinStore(config.pinFile).write(null);

console.log(
  hadPin
    ? 'PIN removed. Restart the server (npm start), then scan the new setup code to choose a PIN.'
    : 'No PIN was set. The next npm start shows a setup code.',
);
if (config.pin) {
  console.log('Note: PIN is set in backend/.env, so that PIN is used instead. Empty it (PIN=) to use setup.');
}
