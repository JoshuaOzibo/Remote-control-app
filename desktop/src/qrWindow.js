import { BrowserWindow } from 'electron';

const WIDTH = 400;
const HEIGHT = 720;

function createQrWindow({ iconPath, preloadPath, htmlPath }) {
  const window = new BrowserWindow({
    width: WIDTH,
    height: HEIGHT,
    useContentSize: true,
    resizable: false,
    maximizable: false,
    fullscreenable: false,
    show: false,
    title: 'Phone Remote',
    icon: iconPath,
    backgroundColor: '#0D0E11',
    autoHideMenuBar: true,
    webPreferences: { preload: preloadPath, contextIsolation: true, sandbox: true, nodeIntegration: false },
  });
  let closable = false;

  window.removeMenu();
  window.on('close', (event) => {
    if (closable) return;
    event.preventDefault();
    window.hide();
  });
  window.webContents.setWindowOpenHandler(() => ({ action: 'deny' }));
  window.webContents.on('will-navigate', (event) => event.preventDefault());
  window.loadFile(htmlPath);

  return {
    window,
    show() {
      if (window.isMinimized()) window.restore();
      window.show();
      window.focus();
    },
    send(state) {
      if (!window.isDestroyed()) window.webContents.send('state', state);
    },
    allowClose() {
      closable = true;
    },
  };
}

export { createQrWindow };
