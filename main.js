const { app, BrowserWindow, ipcMain, dialog,Menu } = require('electron');
const path = require('path');
const fs = require('fs');
const backend = require('./backend'); // 啟動後端服務

const CONFIG_PATH = path.join(app.getPath('userData'), 'config.json');

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    backgroundColor: '#000000', // 設置背景色為黑色
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'), // 修正 preload.js 路徑
      nodeIntegration: false,
      contextIsolation: true,
    },
  });
  Menu.setApplicationMenu(null);
  win.loadFile('index.html');
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit();
});

// IPC 事件處理
ipcMain.on('save-api-key', (event, apiKey) => {
  try {
    const config = { OPENAI_API_KEY: apiKey };
    fs.writeFileSync(CONFIG_PATH, JSON.stringify(config));
    dialog.showMessageBox({ message: 'API 密鑰已保存！', buttons: ['OK'] });
  } catch (error) {
    dialog.showErrorBox('錯誤', '無法保存 API 密鑰');
  }
});

ipcMain.on('detect-fraud', async (event, text) => {
  try {
    if (!fs.existsSync(CONFIG_PATH)) {
      event.reply('detection-result', { error: '未設置 API 密鑰' });
      return;
    }

    const config = JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf-8'));
    if (!config.OPENAI_API_KEY) {
      event.reply('detection-result', { error: '未設置 API 密鑰' });
      return;
    }

    // 發送檢測請求至本地後端
    const axios = require('axios');
    const response = await axios.post('http://localhost:3000/detect', { text });
    event.reply('detection-result', { result: response.data.result });
  } catch (error) {
    event.reply('detection-result', { error: '檢測失敗' });
  }
});
