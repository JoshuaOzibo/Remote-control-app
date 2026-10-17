import { tapKey, typeText } from '../input/input.keyboard.js';
import { click, queueMove, queueScroll } from '../input/input.mouse.js';

const handlers = {
  move: ({ dx, dy }) => queueMove(dx, dy),
  scroll: ({ dy }) => queueScroll(dy),
  click: ({ b }) => click(b),
  key: ({ k }) => tapKey(k),
  type: ({ text }) => typeText(text),
};

function dispatch(message) {
  handlers[message.t]?.(message);
}

export { dispatch };
