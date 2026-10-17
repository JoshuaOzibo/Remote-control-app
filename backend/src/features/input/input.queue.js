import { log } from '../../shared/logger.js';

let chain = Promise.resolve();

function enqueue(action) {
  chain = chain.then(action).catch((error) => log.error('input', 'action failed:', error?.message ?? error));
  return chain;
}

export { enqueue };
