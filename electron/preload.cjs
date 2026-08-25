const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('api', {
  sendVerse: (payload) => ipcRenderer.send('verse', payload),
  onVerse: (callback) => ipcRenderer.on('verse', (_event, payload) => callback(payload)),
  closeApp: () => ipcRenderer.send('close-app'),
})
