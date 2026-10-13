const { contextBridge, ipcRenderer } = require('electron');
contextBridge.exposeInMainWorld('agent', { action: (action,data) => ipcRenderer.invoke('action',{action,data}), onStatus: fn => ipcRenderer.on('status',(_event,data)=>fn(data)) });
