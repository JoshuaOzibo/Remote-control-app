import { log } from '../../shared/logger.js';
import { click, queueMove, queueScroll } from '../input/input.mouse.js';

const handlers = {
  move: ({ dx, dy }) => queueMove(dx, dy),
  scroll: ({ dy }) => queueScroll(dy),
  click: ({ b }) => click(b),
};

function dispatch(message) {
  const handle = handlers[message.t];
  if (handle) handle(message);
  else log.debug('input', message);
}

export { dispatch };
