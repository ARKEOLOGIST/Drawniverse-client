const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
    saveDrawing: (data) => ipcRenderer.invoke('save-drawing', data),
    loadDrawing: () => ipcRenderer.invoke('load-drawing')
}); 