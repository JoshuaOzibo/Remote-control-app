import { Button, Point, mouse } from './input.nut.js';
import { enqueue } from './input.queue.js';

const FLUSH_MS = 16;
const WHEEL_UNITS_PER_PX = 2.4;
const ACCEL_SPEED_PX = 20;
const MAX_ACCEL_BOOST = 1.5;

const pending = { dx: 0, dy: 0, wheel: 0 };
let flushTimer = null;

const clicks = {
  left: () => mouse.click(Button.LEFT),
  right: () => mouse.click(Button.RIGHT),
  double: () => mouse.doubleClick(Button.LEFT),
};

function acceleration(dx, dy) {
  return 1 + Math.min(Math.hypot(dx, dy) / ACCEL_SPEED_PX, MAX_ACCEL_BOOST);
}

function takeWhole(axis) {
  const whole = Math.trunc(pending[axis]);
  pending[axis] -= whole;
  return whole;
}

async function moveBy(dx, dy) {
  const { x, y } = await mouse.getPosition();
  await mouse.setPosition(new Point(x + dx, y + dy));
}

function scrollBy(units) {
  return units > 0 ? mouse.scrollUp(units) : mouse.scrollDown(-units);
}

function flush() {
  clearTimeout(flushTimer);
  flushTimer = null;

  const dx = takeWhole('dx');
  const dy = takeWhole('dy');
  const wheel = takeWhole('wheel');

  if (dx || dy) enqueue(() => moveBy(dx, dy));
  if (wheel) enqueue(() => scrollBy(wheel));
}

function scheduleFlush() {
  flushTimer ??= setTimeout(flush, FLUSH_MS);
}

function queueMove(dx, dy) {
  const gain = acceleration(dx, dy);
  pending.dx += dx * gain;
  pending.dy += dy * gain;
  scheduleFlush();
}

function queueScroll(dy) {
  pending.wheel += dy * WHEEL_UNITS_PER_PX;
  scheduleFlush();
}

function click(button) {
  flush();
  enqueue(clicks[button]);
}

export { queueMove, queueScroll, click };
