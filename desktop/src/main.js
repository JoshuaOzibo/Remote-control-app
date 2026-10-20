import path from 'path';
import { app, clipboard, dialog, ipcMain, shell } from 'electron';
import QRCode from 'qrcode';
import { createLogFile } from './logFile.js';
import { isOpenAtLogin, setOpenAtLogin, startedHidden } from './loginItem.js';
import { isPublicNetwork } from './netProfile.js';
import { watchNetwork } from './networkWatch.js';
import { createQrWindow } from './qrWindow.js';
import { linkFor, startHost } from './serverHost.js';
import { loadSettings, saveSettings } from './settings.js';
import { createTray } from './tray.js';

const APP_ID = 'com.joshuaozibo.phoneremote';
const ROOT = path.resolve(import.meta.dirname, '..');
const ICON = path.join(ROOT, 'assets', 'icon.png');
const QR_OPTIONS = { margin: 1, width: 440, errorCorrectionLevel: 'M', color: { dark: '#0D0E11', light: '#FFFFFF' } };
const PROFILE_CHECK_MS = 15000;
const FORCE_QUIT_MS = 3000;
const WIFI_SETTINGS_URL = 'ms-settings:network-wifi';

if (app.isPackaged) process.env.NODE_ENV ??= 'production';

let backend;
let server;
let tray;
let qrWindow;
let writeLog = () => {};
let address = null;
let publicNetwork = false;
let state = null;
let stopping = false;
let stopped = false;

async function buildState() {
  const url = linkFor(server, address);
  const setUp = server.isSetUp();
  return {
    mode: setUp ? 'ready' : 'setup',
    url,
    qr: url ? await QRCode.toDataURL(url, QR_OPTIONS) : null,
    setupCode: setUp ? null : backend.formatSetupCode(server.setupCode()),
    address,
    port: server.port,
    publicNetwork,
    controller: server.controllerIp(),
    version: app.getVersion(),
  };
}

function tooltipFor({ mode, address: shownAddress, port, controller }) {
  if (!shownAddress) return 'Phone Remote · no Wi-Fi';
  const where = `${shownAddress}:${port}`;
  if (mode === 'setup') return `Phone Remote · waiting for setup · ${where}`;
  return controller ? `Phone Remote · phone connected · ${where}` : `Phone Remote · ready · ${where}`;
}

async function publish() {
  state = await buildState();
  qrWindow.send(state);
  tray.update({ tooltip: tooltipFor(state), setupMode: state.mode === 'setup', openAtLogin: isOpenAtLogin() });
}

async function refreshNetworkProfile() {
  const adapter = backend.networkAddresses().find((entry) => entry.address === address)?.name;
  const isPublic = await isPublicNetwork(adapter);
  if (isPublic === publicNetwork) return;
  publicNetwork = isPublic;
  await publish();
}

function copyLink() {
  if (!state?.url) return false;
  clipboard.writeText(state.url);
  return true;
}

async function confirmResetPin() {
  const options = {
    type: 'warning',
    buttons: ['Reset PIN', 'Cancel'],
    defaultId: 1,
    cancelId: 1,
    title: 'Reset PIN',
    message: 'Reset the PIN?',
    detail: 'The connected phone is disconnected, and every phone needs the new PIN. This window then shows a new setup QR code.',
  };
  const parent = qrWindow.window.isVisible() ? qrWindow.window : null;
  const { response } = parent ? await dialog.showMessageBox(parent, options) : await dialog.showMessageBox(options);
  if (response !== 0) return false;
  server.resetPin();
  qrWindow.show();
  return true;
}

function registerIpc() {
  ipcMain.handle('get-state', () => state);
  ipcMain.handle('copy-link', () => copyLink());
  ipcMain.handle('reset-pin', () => confirmResetPin());
  ipcMain.handle('open-wifi-settings', () => shell.openExternal(WIFI_SETTINGS_URL));
}

async function start() {
  const settings = loadSettings();
  writeLog = createLogFile(path.join(app.getPath('userData'), 'logs'));
  backend = await import('remote-app-backend');
  backend.setLogSink(writeLog);

  try {
    server = await startHost({ backend, preferredPort: settings.port });
  } catch (error) {
    writeLog('error', 'app', ['Could not start:', error]);
    dialog.showErrorBox('Phone Remote could not start', error.message);
    app.exit(1);
    return;
  }
  saveSettings({ ...settings, port: server.port });

  qrWindow = createQrWindow({
    iconPath: ICON,
    preloadPath: path.join(ROOT, 'src', 'preload.cjs'),
    htmlPath: path.join(ROOT, 'renderer', 'index.html'),
  });
  tray = createTray({
    iconPath: ICON,
    actions: {
      show: () => qrWindow.show(),
      copyLink,
      resetPin: confirmResetPin,
      setOpenAtLogin: (openAtLogin) => {
        setOpenAtLogin(openAtLogin);
        publish();
      },
      quit: () => app.quit(),
    },
  });
  registerIpc();

  address = await backend.primaryLanAddress();
  await publish();
  server.onPinChange(() => publish());
  server.onControlChange(() => publish());
  watchNetwork(backend.primaryLanAddress, (next) => {
    address = next;
    publish();
    refreshNetworkProfile();
  });
  refreshNetworkProfile();
  setInterval(refreshNetworkProfile, PROFILE_CHECK_MS);

  if (!startedHidden() || !server.isSetUp()) qrWindow.show();
  writeLog('info', 'app', [`Phone Remote ${app.getVersion()} started on port ${server.port}`]);
}

function stopThenQuit(event) {
  if (stopped || !server) {
    qrWindow?.allowClose();
    return;
  }
  event.preventDefault();
  if (stopping) return;
  stopping = true;
  setTimeout(() => app.exit(0), FORCE_QUIT_MS).unref();
  server.stop().finally(() => {
    stopped = true;
    tray?.destroy();
    qrWindow?.allowClose();
    app.quit();
  });
}

if (!app.requestSingleInstanceLock()) {
  app.quit();
} else {
  app.setAppUserModelId(APP_ID);
  app.on('second-instance', () => qrWindow?.show());
  app.on('window-all-closed', () => {});
  app.on('before-quit', stopThenQuit);
  process.on('SIGINT', () => app.quit());
  process.on('uncaughtException', (error) => writeLog('error', 'app', ['Uncaught:', error]));
  process.on('unhandledRejection', (error) => writeLog('error', 'app', ['Unhandled rejection:', error]));
  app.whenReady().then(start);
}
