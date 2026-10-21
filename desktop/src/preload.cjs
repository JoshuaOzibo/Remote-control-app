const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('phoneRemote', {
  onState(callback) {
    ipcRenderer.on('state', (_event, state) => callback(state));
    ipcRenderer.invoke('get-state').then((state) => {
      if (state) callback(state);
    });
  },
  copyLink: () => ipcRenderer.invoke('copy-link'),
  resetPin: () => ipcRenderer.invoke('reset-pin'),
  openWifiSettings: () => ipcRenderer.invoke('open-wifi-settings'),
  openUpdate: () => ipcRenderer.invoke('open-update'),
});
