const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
  // Expón solo las funciones específicas que necesitas
  someFunction: (arg) => ipcRenderer.invoke('some-channel', arg)
})