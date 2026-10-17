import { log } from '../../shared/logger.js';

function dispatch(message) {
  log.debug('input', message);
}

export { dispatch };
