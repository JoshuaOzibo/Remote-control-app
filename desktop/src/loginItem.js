import { app } from 'electron';

const HIDDEN_FLAG = '--hidden';

function loginItemOptions() {
  if (app.isPackaged) return { args: [HIDDEN_FLAG] };
  return { path: process.execPath, args: [app.getAppPath(), HIDDEN_FLAG] };
}

function isOpenAtLogin() {
  return app.getLoginItemSettings(loginItemOptions()).openAtLogin;
}

function setOpenAtLogin(openAtLogin) {
  app.setLoginItemSettings({ ...loginItemOptions(), openAtLogin });
}

function startedHidden() {
  return process.argv.includes(HIDDEN_FLAG);
}

export { isOpenAtLogin, setOpenAtLogin, startedHidden };
