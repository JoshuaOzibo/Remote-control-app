import { Menu, Tray, nativeImage } from 'electron';

const TRAY_SIZE = 16;
const SCALE_FACTORS = [1, 1.25, 1.5, 2];

function trayImage(iconPath) {
  const source = nativeImage.createFromPath(iconPath);
  const image = nativeImage.createEmpty();
  for (const scaleFactor of SCALE_FACTORS) {
    const size = Math.round(TRAY_SIZE * scaleFactor);
    const buffer = source.resize({ width: size, height: size, quality: 'best' }).toPNG();
    image.addRepresentation({ scaleFactor, width: size, height: size, buffer });
  }
  return image;
}

function createTray({ iconPath, actions }) {
  const tray = new Tray(trayImage(iconPath));
  tray.on('click', actions.show);

  function update({ tooltip, setupMode, openAtLogin }) {
    tray.setToolTip(tooltip);
    tray.setContextMenu(
      Menu.buildFromTemplate([
        { label: setupMode ? 'Show setup QR code' : 'Show QR code', click: actions.show },
        { label: 'Copy link', click: actions.copyLink },
        { label: 'Reset PIN…', click: actions.resetPin },
        { type: 'separator' },
        {
          label: 'Start with Windows',
          type: 'checkbox',
          checked: openAtLogin,
          click: (item) => actions.setOpenAtLogin(item.checked),
        },
        { type: 'separator' },
        { label: 'Quit Phone Remote', click: actions.quit },
      ]),
    );
  }

  return { update, destroy: () => tray.destroy() };
}

export { createTray };
