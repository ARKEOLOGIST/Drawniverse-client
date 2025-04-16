const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const fs = require('fs');

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    }
  });

  win.loadFile('index.html');
  win.setMenu(null); // Remove the default menu bar
}

// Handle save drawing request
ipcMain.handle('save-drawing', async (event, data) => {
  const { filePath } = await dialog.showSaveDialog({
    title: 'Save Drawing',
    defaultPath: path.join(app.getPath('documents'), 'drawing.png'),
    filters: [
      { name: 'PNG Files', extensions: ['png'] },
      { name: 'All Files', extensions: ['*'] }
    ]
  });

  if (filePath) {
    // Remove the data URL prefix
    const base64Data = data.replace(/^data:image\/png;base64,/, '');
    fs.writeFileSync(filePath, base64Data, 'base64');
    return { success: true, path: filePath };
  }
  return { success: false };
});

// Handle load drawing request
ipcMain.handle('load-drawing', async () => {
  const { filePaths } = await dialog.showOpenDialog({
    title: 'Open Drawing',
    filters: [
      { name: 'Image Files', extensions: ['png', 'jpg', 'jpeg'] },
      { name: 'All Files', extensions: ['*'] }
    ],
    properties: ['openFile']
  });

  if (filePaths && filePaths.length > 0) {
    const filePath = filePaths[0];
    const imageBuffer = fs.readFileSync(filePath);
    const base64Image = imageBuffer.toString('base64');
    return { success: true, data: `data:image/png;base64,${base64Image}` };
  }
  return { success: false };
});

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
}); 