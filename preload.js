const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  saveApiKey: (apiKey) => ipcRenderer.send('save-api-key', apiKey),
  detectFraud: (text) => ipcRenderer.send('detect-fraud', text),
  onDetectionResult: (callback) => ipcRenderer.on('detection-result', callback),
});
