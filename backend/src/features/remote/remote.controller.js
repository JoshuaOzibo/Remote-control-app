import { CLOSE_CODE } from './remote.protocol.js';

let controller = null;

function takeControl(socket) {
  if (controller && controller !== socket) controller.close(CLOSE_CODE.replaced, 'Another device took over');
  controller = socket;
}

function releaseControl(socket) {
  if (controller === socket) controller = null;
}

export { takeControl, releaseControl };
