import { CLOSE_CODE } from './remote.protocol.js';

let controller = null;
let controllerIp = null;
const listeners = new Set();

function setController(socket, ip) {
  controller = socket;
  controllerIp = ip;
  for (const listener of listeners) listener(ip);
}

function takeControl(socket, ip) {
  if (controller && controller !== socket) controller.close(CLOSE_CODE.replaced, 'Another device took over');
  setController(socket, ip);
}

function releaseControl(socket) {
  if (controller === socket) setController(null, null);
}

function revokeControl() {
  controller?.close(CLOSE_CODE.wrongPin, 'PIN reset');
  if (controller) setController(null, null);
}

function currentControllerIp() {
  return controllerIp;
}

function onControlChange(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export { takeControl, releaseControl, revokeControl, currentControllerIp, onControlChange };
